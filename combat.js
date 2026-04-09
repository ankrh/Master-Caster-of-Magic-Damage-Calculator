// --- Combat Resolution ---
// Pure functions with no DOM dependencies. Depends on engine.js.

// Clamp a percentage to 10%-100% (MoM rules: always at least 10%, at most 100%)
function clampPct(base, mod) {
  return Math.min(1.0, Math.max(0.1, (base + mod) / 100));
}

// Weapon type bonuses: { atk, def, toHit }
// Magical/Mithril/Adamantium: +10% To Hit (melee, missile, boulder only)
// Mithril: +1 atk (melee, missile, boulder, thrown), +1 def
// Adamantium: +2 atk (same types), +2 def
function weaponBonus(type) {
  switch (type) {
    case 'magic':      return { atk: 0, def: 0, toHit: 10 };
    case 'mithril':    return { atk: 1, def: 1, toHit: 10 };
    case 'adamantium': return { atk: 2, def: 2, toHit: 10 };
    default:           return { atk: 0, def: 0, toHit: 0 };
  }
}

// Level bonuses vary by game version
function getLevelBonuses(level, version) {
  const isMoM = version.startsWith('mom_');
  if (isMoM) {
    switch (level) {
      case 'regular':    return { atk: 1, ranged: 1, thrown: 1, def: 0, res: 1, hp: 0, toHit: 0 };
      case 'veteran':    return { atk: 1, ranged: 1, thrown: 1, def: 1, res: 2, hp: 0, toHit: 0 };
      case 'elite':      return { atk: 2, ranged: 2, thrown: 2, def: 1, res: 3, hp: 1, toHit: 10 };
      case 'ultra_elite':return { atk: 2, ranged: 2, thrown: 2, def: 2, res: 4, hp: 1, toHit: 20 };
      case 'champion':   return { atk: 3, ranged: 3, thrown: 3, def: 2, res: 5, hp: 2, toHit: 30 };
      default:           return { atk: 0, ranged: 0, thrown: 0, def: 0, res: 0, hp: 0, toHit: 0 };
    }
  } else {
    switch (level) {
      case 'regular':    return { atk: 1, ranged: 1, thrown: 0, def: 0, res: 1, hp: 0, toHit: 0 };
      case 'veteran':    return { atk: 2, ranged: 2, thrown: 1, def: 1, res: 1, hp: 0, toHit: 0 };
      case 'elite':      return { atk: 2, ranged: 2, thrown: 1, def: 2, res: 2, hp: 1, toHit: 0 };
      case 'ultra_elite':return { atk: 3, ranged: 3, thrown: 1, def: 3, res: 2, hp: 1, toHit: 0 };
      case 'champion':   return { atk: 3, ranged: 3, thrown: 1, def: 3, res: 2, hp: 2, toHit: 10 };
      default:           return { atk: 0, ranged: 0, thrown: 0, def: 0, res: 0, hp: 0, toHit: 0 };
    }
  }
}

// Compute ranged distance penalty for missile/boulder attacks.
// Returns a negative percentage modifier (e.g. -10, -20, -30) or 0.
function distancePenalty(distance, rangedType) {
  if (rangedType !== 'missile' && rangedType !== 'boulder') return 0;
  if (distance >= 9) return -30;
  if (distance >= 6) return -20;
  if (distance >= 3) return -10;
  return 0;
}

// --- Ability Stat Modifiers ---
// Apply ability/enchantment effects that modify base stats.
// Called after level/weapon bonuses are computed.
// `abilities` is a map of ability key -> value (bool true/false, or number).
// Returns { atkMod, defMod, resMod, hpMod, toHitMod, toBlkMod, rtbMod } — additive modifiers.
//
// TODO: Implement each ability's stat effects. Currently returns zeros (no-op).
function getAbilityStatModifiers(abilities) {
  return { atkMod: 0, defMod: 0, resMod: 0, hpMod: 0, toHitMod: 0, toBlkMod: 0, rtbMod: 0 };
}

// --- Combat Flow Modifiers ---
// Abilities that change *how* combat resolves rather than just stat values.
// These are checked during resolveCombat to alter phase ordering, defense
// effectiveness, damage types, etc.
//
// TODO: Implement each modifier. For now these are documented stubs.
//
// Categories:
//   Phase ordering:  First Strike, Negate First Strike
//   Defense halving: Armor Piercing, Illusion (defender ignores defense if no Illusion Immunity)
//   Damage immunity: Fire Immunity (vs fire breath/immolation), Magic Immunity (vs magic ranged),
//                    Missile Immunity (vs missile/boulder), Weapon Immunity (vs non-magic melee),
//                    Poison Immunity, Stoning Immunity, Cold Immunity, Death Immunity
//   Special attacks: Poison Touch, Life Steal, Stoning Touch/Gaze, Death Gaze, Doom Gaze
//   Defense bonus:   Large Shield (+2 def vs ranged), Invulnerability
//   Hit bonus:       Lucky (minimum 10% To Hit after all penalties), Bless (vs Chaos/Death)
//   Misc:           Haste (double melee attacks), Immolation (extra damage phase)

// Resolve a full combat exchange between attacker and defender.
// All inputs are plain objects — no DOM access.
//
// Parameters:
//   a, b: unit stat objects with fields:
//     { figs, atk, def, res, hp, dmg, rtb, rangedType, thrownType,
//       toHitMelee, toHitRtb, toBlock, abilities }
//     where toHitMelee/toHitRtb/toBlock are already-clamped decimals (0.1-1.0)
//   opts: { isRanged, distance }
//
// Returns:
//   { phases, totalDmgToA, totalDmgToB,
//     aRemHP, aHP, aAlive, bRemHP, bHP, bAlive }
//   phases: array of { label, atkDist, defDist, atkHP, defHP, atkHPper, defHPper, atkFigs, defFigs } or null
function resolveCombat(a, b, opts) {
  const isRanged = opts.isRanged;

  // Compute alive figures and remaining HP
  const aTotalHP = a.figs * a.hp;
  const aAlive   = Math.max(0, a.figs - Math.floor(a.dmg / a.hp));
  const aRemHP   = Math.max(0, aTotalHP - a.dmg);

  const bTotalHP = b.figs * b.hp;
  const bAlive   = Math.max(0, b.figs - Math.floor(b.dmg / b.hp));
  const bRemHP   = Math.max(0, bTotalHP - b.dmg);

  // Determine if attacker has thrown/breath (melee only)
  const hasThrown = !isRanged && a.thrownType !== 'none' && a.rtb > 0;

  // Lightning breath is armor piercing: halve defense (round down)
  const bDefForThrown = a.thrownType === 'lightning' ? Math.floor(b.def / 2) : b.def;

  if (isRanged) {
    // --- Ranged: attacker shoots, no counter-attack ---
    const dmgToB = aAlive > 0 && bRemHP > 0 && a.rtb > 0
      ? calcTotalDamageDist(aAlive, a.rtb, a.toHitRtb, b.def, b.toBlock, b.hp, bRemHP)
      : [1];

    return {
      phases: null,
      totalDmgToA: [1],
      totalDmgToB: dmgToB,
      aRemHP, aHP: a.hp, aAlive,
      bRemHP, bHP: b.hp, bAlive,
    };

  } else if (hasThrown) {
    // --- Melee with thrown/breath: thrown first, then simultaneous melee exchange ---
    const thrownDist = aAlive > 0 && bRemHP > 0
      ? calcTotalDamageDist(aAlive, a.rtb, a.toHitRtb, bDefForThrown, b.toBlock, b.hp, bRemHP)
      : [1];

    const totalDmgToB = new Array(bRemHP + 1).fill(0);
    const totalDmgToA = new Array(aRemHP + 1).fill(0);
    const meleeOnlyToB = new Array(bRemHP + 1).fill(0);
    const counterOnlyToA = new Array(aRemHP + 1).fill(0);

    for (let tDmg = 0; tDmg < thrownDist.length; tDmg++) {
      if (thrownDist[tDmg] < 1e-15) continue;
      const pThrown = thrownDist[tDmg];

      // Defender state after thrown damage
      const bDmgAfter = b.dmg + tDmg;
      const bAliveAfter = Math.max(0, b.figs - Math.floor(bDmgAfter / b.hp));
      const bRemHPAfter = Math.max(0, bRemHP - tDmg);

      // Attacker's melee vs defender
      const meleeDist = aAlive > 0 && bRemHPAfter > 0 && a.atk > 0
        ? calcTotalDamageDist(aAlive, a.atk, a.toHitMelee, b.def, b.toBlock, b.hp, bRemHPAfter)
        : [1];

      // Defender's counter-attack (surviving figures after thrown)
      const counterDist = bAliveAfter > 0 && aRemHP > 0 && b.atk > 0
        ? calcTotalDamageDist(bAliveAfter, b.atk, b.toHitMelee, a.def, a.toBlock, a.hp, aRemHP)
        : [1];

      // Combine thrown + melee for total damage to defender
      for (let mDmg = 0; mDmg < meleeDist.length; mDmg++) {
        if (meleeDist[mDmg] < 1e-15) continue;
        const totalD = Math.min(tDmg + mDmg, bRemHP);
        totalDmgToB[totalD] += pThrown * meleeDist[mDmg];
        meleeOnlyToB[Math.min(mDmg, bRemHP)] += pThrown * meleeDist[mDmg];
      }

      // Counter-attack damage to attacker
      for (let cDmg = 0; cDmg < counterDist.length; cDmg++) {
        if (counterDist[cDmg] < 1e-15) continue;
        totalDmgToA[cDmg] += pThrown * counterDist[cDmg];
        counterOnlyToA[cDmg] += pThrown * counterDist[cDmg];
      }
    }

    const thrownLabel = a.thrownType === 'thrown' ? 'Thrown'
                      : a.thrownType === 'fire' ? 'Fire Breath'
                      : 'Lightning Breath';

    return {
      phases: [
        { label: thrownLabel,
          atkDist: [1], atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
          defDist: thrownDist, defHP: bRemHP, defHPper: b.hp, defFigs: bAlive },
        { label: 'Melee + Counter-attack',
          atkDist: counterOnlyToA, atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
          defDist: meleeOnlyToB, defHP: bRemHP, defHPper: b.hp, defFigs: bAlive },
      ],
      totalDmgToA,
      totalDmgToB,
      aRemHP, aHP: a.hp, aAlive,
      bRemHP, bHP: b.hp, bAlive,
    };

  } else {
    // --- Pure melee: simultaneous exchange ---
    const dmgToB = aAlive > 0 && bRemHP > 0 && a.atk > 0
      ? calcTotalDamageDist(aAlive, a.atk, a.toHitMelee, b.def, b.toBlock, b.hp, bRemHP)
      : [1];

    const dmgToA = bAlive > 0 && aRemHP > 0 && b.atk > 0
      ? calcTotalDamageDist(bAlive, b.atk, b.toHitMelee, a.def, a.toBlock, a.hp, aRemHP)
      : [1];

    return {
      phases: null,
      totalDmgToA: dmgToA,
      totalDmgToB: dmgToB,
      aRemHP, aHP: a.hp, aAlive,
      bRemHP, bHP: b.hp, bAlive,
    };
  }
}
