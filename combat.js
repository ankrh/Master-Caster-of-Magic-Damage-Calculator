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

// --- Poison Touch ---
// Compute probability of failing a single poison resistance roll.
// MoM: d10, success if roll ≤ Resistance. pFail = max(0, (10 - res) / 10).
// CoM2: universal -1 save modifier → pFail = max(0, (11 - res) / 10).
// Returns 0 if target is immune (Poison Immunity or effective resistance ≥ 10).
function poisonFailProb(defRes, defAbilities, version) {
  if (defAbilities && defAbilities.poisonImmunity) return 0;
  const penalty = version && version.startsWith('com') ? 1 : 0;
  const effectiveRes = defRes - penalty;
  if (effectiveRes >= 10) return 0;
  return Math.max(0, (10 - effectiveRes) / 10);
}

// --- Stoning Touch ---
// Compute probability of failing a stoning resistance roll.
// MoM: d10, success if roll ≤ (Resistance + modifier). The stoningTouch value is negative
// (e.g. -3 means a -3 penalty to the target's resistance roll).
// Returns 0 if target is immune (Stoning Immunity or Magic Immunity).
function stoningFailProb(defRes, defAbilities, modifier) {
  if (defAbilities && (defAbilities.stoningImmunity || defAbilities.magicImmunity)) return 0;
  const effectiveRes = defRes + modifier;
  if (effectiveRes >= 10) return 0;
  return Math.max(0, (10 - effectiveRes) / 10);
}

// --- Death Gaze ---
// Same roll mechanics as Stoning Gaze, but blocked by Death Immunity / Magic Immunity.
function deathGazeFailProb(defRes, defAbilities, modifier) {
  if (defAbilities && (defAbilities.deathImmunity || defAbilities.magicImmunity)) return 0;
  const effectiveRes = defRes + modifier;
  if (effectiveRes >= 10) return 0;
  return Math.max(0, (10 - effectiveRes) / 10);
}

// Build the combined gaze damage distribution delivered by `atk` against `def`.
// Includes (at most once) the hidden physical ranged component, followed by
// stoning-kill rolls and death-kill rolls — one per target figure for each gaze type.
function buildGazeDist(atk, def, defAlive, defRemHP, stoningFail, deathFail) {
  if (defAlive <= 0 || defRemHP <= 0) return [1];
  let dist = [1];
  if (atk.effectiveGazeRanged > 0) {
    dist = calcTotalDamageDist(1, atk.effectiveGazeRanged, atk.toHitRtb, def.def, def.toBlock, def.hp, defRemHP);
  }
  if (stoningFail > 0) {
    dist = convolveDists(dist, calcFigureKillDmgDist(defAlive, stoningFail, def.hp, defRemHP), defRemHP);
  }
  if (deathFail > 0) {
    dist = convolveDists(dist, calcFigureKillDmgDist(defAlive, deathFail, def.hp, defRemHP), defRemHP);
  }
  return dist;
}

// Phase label for a gaze attack given which gaze types are active.
function gazeLabel(stoning, death) {
  if (stoning && death) return 'Gaze Attack';
  if (stoning) return 'Stoning Gaze';
  if (death) return 'Death Gaze';
  return 'Gaze';
}

// --- Life Steal ---
// Compute whether life steal can affect the target, and return the modifier.
// Returns null if immune (Death Immunity, Magic Immunity, or effective Resistance ≥ 10).
// The lifeSteal value is the resistance penalty (e.g. -3 means target's res is penalized by 3).
function lifeStealEffective(defRes, defAbilities, modifier) {
  if (defAbilities && (defAbilities.deathImmunity || defAbilities.magicImmunity)) return null;
  const effRes = defRes + modifier;
  if (effRes >= 10) return null;
  return modifier;
}

// Check whether touch attacks fire for a given attack phase.
// v1.31 bug: touch attacks don't fire if the effective attack value is 0.
// Other versions: only skip if the base (pre-modifier) attack value is 0.
function touchAttackFires(effectiveAtk, baseAtk, version) {
  if (version === 'mom_1.03.01') return effectiveAtk > 0;
  return (baseAtk || 0) > 0;
}

// Check whether a gaze attack fires for a given unit.
// v1.31 bug: gaze requires non-zero effective hidden ranged attack strength after modifiers.
// Patched versions (CP 1.60+): gaze always fires if the unit has the ability.
function gazeAttackFires(effectiveGazeRanged, version) {
  if (version === 'mom_1.03.01') return effectiveGazeRanged > 0;
  return true;
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
    let dmgToB = aAlive > 0 && bRemHP > 0 && a.rtb > 0
      ? calcTotalDamageDist(aAlive, a.rtb, a.toHitRtb, b.def, b.toBlock, b.hp, bRemHP)
      : [1];

    // Poison Touch accompanies ranged attacks
    const aPoisonStr = touchAttackFires(a.rtb, a.baseRtb, opts.version)
      ? ((a.abilities && a.abilities.poison) || 0) : 0;
    if (aPoisonStr > 0 && aAlive > 0 && bRemHP > 0) {
      const pFail = poisonFailProb(b.res, b.abilities, opts.version);
      if (pFail > 0) {
        const poisonDist = calcResistDmgDist(aAlive * aPoisonStr, pFail, bRemHP);
        dmgToB = convolveDists(dmgToB, poisonDist, bRemHP);
      }
    }

    // Stoning Touch accompanies ranged attacks
    const aStoningActive = a.abilities && a.abilities.stoningTouch != null
      && touchAttackFires(a.rtb, a.baseRtb, opts.version);
    if (aStoningActive && aAlive > 0 && bRemHP > 0) {
      const pFail = stoningFailProb(b.res, b.abilities, a.abilities.stoningTouch);
      if (pFail > 0) {
        const stoningDist = calcFigureKillDmgDist(aAlive, pFail, b.hp, bRemHP);
        dmgToB = convolveDists(dmgToB, stoningDist, bRemHP);
      }
    }

    // Life Steal accompanies ranged attacks
    let aLifeStealDistR = null;
    const aLifeStealActive = a.abilities && a.abilities.lifeSteal != null
      && touchAttackFires(a.rtb, a.baseRtb, opts.version);
    if (aLifeStealActive && aAlive > 0 && bRemHP > 0) {
      const lsMod = lifeStealEffective(b.res, b.abilities, a.abilities.lifeSteal);
      if (lsMod !== null) {
        aLifeStealDistR = calcLifeStealDmgDist(aAlive, b.res, lsMod, bRemHP);
        dmgToB = convolveDists(dmgToB, aLifeStealDistR, bRemHP);
      }
    }

    return {
      phases: null,
      totalDmgToA: [1],
      totalDmgToB: dmgToB,
      aLifeStealDist: aLifeStealDistR,
      bLifeStealDist: null,
      aRemHP, aHP: a.hp, aAlive,
      bRemHP, bHP: b.hp, bAlive,
    };

  } else if (hasThrown) {
    // --- Melee with thrown/breath: thrown first, then simultaneous melee exchange ---
    // Touch attacks fire in BOTH the thrown/breath phase AND the melee phase.
    // Defender's touch attacks fire only with their melee counter-attack.
    const aPoisonStr = (a.abilities && a.abilities.poison) || 0;
    const bPoisonStr = (b.abilities && b.abilities.poison) || 0;
    const aPoisonFail = aPoisonStr > 0 ? poisonFailProb(b.res, b.abilities, opts.version) : 0;
    const bPoisonFail = bPoisonStr > 0 ? poisonFailProb(a.res, a.abilities, opts.version) : 0;

    const aStoningOn = a.abilities && a.abilities.stoningTouch != null;
    const bStoningOn = b.abilities && b.abilities.stoningTouch != null;
    const aStoningFail = aStoningOn ? stoningFailProb(b.res, b.abilities, a.abilities.stoningTouch) : 0;
    const bStoningFail = bStoningOn ? stoningFailProb(a.res, a.abilities, b.abilities.stoningTouch) : 0;

    const aLifeStealOn = a.abilities && a.abilities.lifeSteal != null;
    const bLifeStealOn = b.abilities && b.abilities.lifeSteal != null;
    const aLifeStealMod = aLifeStealOn ? lifeStealEffective(b.res, b.abilities, a.abilities.lifeSteal) : null;
    const bLifeStealMod = bLifeStealOn ? lifeStealEffective(a.res, a.abilities, b.abilities.lifeSteal) : null;

    // Per-phase activation: touch attacks require the associated attack to be non-zero
    const aPoisonWithThrown = aPoisonFail > 0 && touchAttackFires(a.rtb, a.baseRtb, opts.version);
    const aPoisonWithMelee  = aPoisonFail > 0 && touchAttackFires(a.atk, a.baseAtk, opts.version);
    const bPoisonWithMelee  = bPoisonFail > 0 && touchAttackFires(b.atk, b.baseAtk, opts.version);
    const aStoningWithThrown = aStoningFail > 0 && touchAttackFires(a.rtb, a.baseRtb, opts.version);
    const aStoningWithMelee  = aStoningFail > 0 && touchAttackFires(a.atk, a.baseAtk, opts.version);
    const bStoningWithMelee  = bStoningFail > 0 && touchAttackFires(b.atk, b.baseAtk, opts.version);
    const aLifeStealWithThrown = aLifeStealMod !== null && touchAttackFires(a.rtb, a.baseRtb, opts.version);
    const aLifeStealWithMelee  = aLifeStealMod !== null && touchAttackFires(a.atk, a.baseAtk, opts.version);
    const bLifeStealWithMelee  = bLifeStealMod !== null && touchAttackFires(b.atk, b.baseAtk, opts.version);

    // Gaze attack detection (resolved between thrown/breath and melee phases).
    // Stoning Gaze and Death Gaze fire together when a unit has both (e.g. Chaos Spawn),
    // and share a single hidden physical ranged component.
    const gazeFires = gazeAttackFires(a.effectiveGazeRanged, opts.version);
    const gazeFiresB = gazeAttackFires(b.effectiveGazeRanged, opts.version);
    const aStoningGazeActive = !!(a.abilities && a.abilities.stoningGaze != null) && gazeFires;
    const bStoningGazeActive = !!(b.abilities && b.abilities.stoningGaze != null) && gazeFiresB;
    const aDeathGazeActive = !!(a.abilities && a.abilities.deathGaze != null) && gazeFires;
    const bDeathGazeActive = !!(b.abilities && b.abilities.deathGaze != null) && gazeFiresB;
    const aGazeActive = aStoningGazeActive || aDeathGazeActive;
    const bGazeActive = bStoningGazeActive || bDeathGazeActive;
    const aStoningGazeFail = aStoningGazeActive
      ? stoningFailProb(b.res, b.abilities, a.abilities.stoningGaze) : 0;
    const bStoningGazeFail = bStoningGazeActive
      ? stoningFailProb(a.res, a.abilities, b.abilities.stoningGaze) : 0;
    const aDeathGazeFail = aDeathGazeActive
      ? deathGazeFailProb(b.res, b.abilities, a.abilities.deathGaze) : 0;
    const bDeathGazeFail = bDeathGazeActive
      ? deathGazeFailProb(a.res, a.abilities, b.abilities.deathGaze) : 0;
    const hasGaze = aGazeActive || bGazeActive;

    // Pre-compute B's gaze distribution (targets A; constant regardless of thrown)
    let bGazeDistBase = bGazeActive
      ? buildGazeDist(b, a, aAlive, aRemHP, bStoningGazeFail, bDeathGazeFail)
      : [1];

    // Phase 1: Thrown/Breath damage
    let thrownDist = aAlive > 0 && bRemHP > 0
      ? calcTotalDamageDist(aAlive, a.rtb, a.toHitRtb, bDefForThrown, b.toBlock, b.hp, bRemHP)
      : [1];

    // Convolve attacker's touch attacks into thrown phase (simultaneous with thrown)
    const phase1HasPoison = aPoisonWithThrown && aAlive > 0 && bRemHP > 0;
    const phase1HasStoning = aStoningWithThrown && aAlive > 0 && bRemHP > 0;
    const phase1HasLifeSteal = aLifeStealWithThrown && aAlive > 0 && bRemHP > 0;
    let phase1Dist = thrownDist;
    if (phase1HasPoison) {
      const poisonDist = calcResistDmgDist(aAlive * aPoisonStr, aPoisonFail, bRemHP);
      phase1Dist = convolveDists(phase1Dist, poisonDist, bRemHP);
    }
    if (phase1HasStoning) {
      const stoningDist = calcFigureKillDmgDist(aAlive, aStoningFail, b.hp, bRemHP);
      phase1Dist = convolveDists(phase1Dist, stoningDist, bRemHP);
    }
    if (phase1HasLifeSteal) {
      const lsDist = calcLifeStealDmgDist(aAlive, b.res, aLifeStealMod, bRemHP);
      phase1Dist = convolveDists(phase1Dist, lsDist, bRemHP);
    }

    const totalDmgToB = new Array(bRemHP + 1).fill(0);
    const totalDmgToA = new Array(aRemHP + 1).fill(0);
    const meleeOnlyToB = new Array(bRemHP + 1).fill(0);
    const counterOnlyToA = new Array(aRemHP + 1).fill(0);
    const gazeOnlyToB = hasGaze ? new Array(bRemHP + 1).fill(0) : null;
    const gazeOnlyToA = hasGaze ? new Array(aRemHP + 1).fill(0) : null;

    for (let p1Dmg = 0; p1Dmg < phase1Dist.length; p1Dmg++) {
      if (phase1Dist[p1Dmg] < 1e-15) continue;
      const pPhase1 = phase1Dist[p1Dmg];

      // Defender state after phase 1 (thrown/breath) damage
      const bDmgAfterP1 = b.dmg + p1Dmg;
      const bAliveAfterP1 = Math.max(0, b.figs - Math.floor(bDmgAfterP1 / b.hp));
      const bRemHPAfterP1 = Math.max(0, bRemHP - p1Dmg);

      // Phase 2: Gaze attacks (attacker's gaze first, then defender's gaze)
      // A's gaze: physical ranged + stoning + death effects on B's surviving figures
      const aGazeDist = aGazeActive
        ? buildGazeDist(a, b, bAliveAfterP1, bRemHPAfterP1, aStoningGazeFail, aDeathGazeFail)
        : [1];

      for (let aGzDmg = 0; aGzDmg < aGazeDist.length; aGzDmg++) {
        if (aGazeDist[aGzDmg] < 1e-15) continue;

        const bDmgAfterAGaze = bDmgAfterP1 + aGzDmg;
        const bAliveAfterGaze = Math.max(0, b.figs - Math.floor(bDmgAfterAGaze / b.hp));
        const bRemHPAfterGaze = Math.max(0, bRemHPAfterP1 - aGzDmg);

        // B's gaze targets each of A's figures; fires only if B has surviving figures
        const bGazeDist = bAliveAfterGaze > 0 ? bGazeDistBase : [1];

        for (let bGzDmg = 0; bGzDmg < bGazeDist.length; bGzDmg++) {
          if (bGazeDist[bGzDmg] < 1e-15) continue;
          const pCombined = pPhase1 * aGazeDist[aGzDmg] * bGazeDist[bGzDmg];

          const aAliveAfterGaze = Math.max(0, a.figs - Math.floor((a.dmg + bGzDmg) / a.hp));
          const aRemHPAfterGaze = Math.max(0, aRemHP - bGzDmg);

          // Phase 3: Melee + Touch (post-gaze figure counts)
          let meleeDist = aAliveAfterGaze > 0 && bRemHPAfterGaze > 0 && a.atk > 0
            ? calcTotalDamageDist(aAliveAfterGaze, a.atk, a.toHitMelee, b.def, b.toBlock, b.hp, bRemHPAfterGaze)
            : [1];

          if (aPoisonWithMelee && aAliveAfterGaze > 0 && bRemHPAfterGaze > 0) {
            const poisonDist = calcResistDmgDist(aAliveAfterGaze * aPoisonStr, aPoisonFail, bRemHPAfterGaze);
            meleeDist = convolveDists(meleeDist, poisonDist, bRemHPAfterGaze);
          }
          if (aStoningWithMelee && aAliveAfterGaze > 0 && bRemHPAfterGaze > 0) {
            const stoningDist = calcFigureKillDmgDist(aAliveAfterGaze, aStoningFail, b.hp, bRemHPAfterGaze);
            meleeDist = convolveDists(meleeDist, stoningDist, bRemHPAfterGaze);
          }
          if (aLifeStealWithMelee && aAliveAfterGaze > 0 && bRemHPAfterGaze > 0) {
            const lsDist = calcLifeStealDmgDist(aAliveAfterGaze, b.res, aLifeStealMod, bRemHPAfterGaze);
            meleeDist = convolveDists(meleeDist, lsDist, bRemHPAfterGaze);
          }

          // Counter-attack (surviving B figures after gaze)
          let counterDist = bAliveAfterGaze > 0 && aRemHPAfterGaze > 0 && b.atk > 0
            ? calcTotalDamageDist(bAliveAfterGaze, b.atk, b.toHitMelee, a.def, a.toBlock, a.hp, aRemHPAfterGaze)
            : [1];

          if (bPoisonWithMelee && bAliveAfterGaze > 0 && aRemHPAfterGaze > 0) {
            const poisonDist = calcResistDmgDist(bAliveAfterGaze * bPoisonStr, bPoisonFail, aRemHPAfterGaze);
            counterDist = convolveDists(counterDist, poisonDist, aRemHPAfterGaze);
          }
          if (bStoningWithMelee && bAliveAfterGaze > 0 && aRemHPAfterGaze > 0) {
            const stoningDist = calcFigureKillDmgDist(bAliveAfterGaze, bStoningFail, a.hp, aRemHPAfterGaze);
            counterDist = convolveDists(counterDist, stoningDist, aRemHPAfterGaze);
          }
          if (bLifeStealWithMelee && bAliveAfterGaze > 0 && aRemHPAfterGaze > 0) {
            const lsDist = calcLifeStealDmgDist(bAliveAfterGaze, a.res, bLifeStealMod, aRemHPAfterGaze);
            counterDist = convolveDists(counterDist, lsDist, aRemHPAfterGaze);
          }

          // Accumulate total damage (thrown + gaze + melee)
          for (let mDmg = 0; mDmg < meleeDist.length; mDmg++) {
            if (meleeDist[mDmg] < 1e-15) continue;
            const totalDmgB = Math.min(p1Dmg + aGzDmg + mDmg, bRemHP);
            totalDmgToB[totalDmgB] += pCombined * meleeDist[mDmg];
            meleeOnlyToB[Math.min(mDmg, bRemHP)] += pCombined * meleeDist[mDmg];
          }

          for (let cDmg = 0; cDmg < counterDist.length; cDmg++) {
            if (counterDist[cDmg] < 1e-15) continue;
            const totalDmgA = Math.min(bGzDmg + cDmg, aRemHP);
            totalDmgToA[totalDmgA] += pCombined * counterDist[cDmg];
            counterOnlyToA[Math.min(cDmg, aRemHP)] += pCombined * counterDist[cDmg];
          }

          if (gazeOnlyToB) gazeOnlyToB[Math.min(aGzDmg, bRemHP)] += pCombined;
          if (gazeOnlyToA) gazeOnlyToA[Math.min(bGzDmg, aRemHP)] += pCombined;
        }
      }
    }

    // Build phase labels
    let thrownLabel = a.thrownType === 'thrown' ? 'Thrown'
                    : a.thrownType === 'fire' ? 'Fire Breath'
                    : 'Lightning Breath';
    if (phase1HasPoison) thrownLabel += ' + Poison Touch';
    if (phase1HasStoning) thrownLabel += ' + Stoning Touch';
    if (phase1HasLifeSteal) thrownLabel += ' + Life Steal';

    let meleePhaseLabel = 'Melee';
    if (aPoisonWithMelee || bPoisonWithMelee) meleePhaseLabel += ' + Poison Touch';
    if (aStoningWithMelee || bStoningWithMelee) meleePhaseLabel += ' + Stoning Touch';
    if (aLifeStealWithMelee || bLifeStealWithMelee) meleePhaseLabel += ' + Life Steal';
    meleePhaseLabel += ' + Counter-attack';

    // Compute standalone life steal distributions for E[damage] display
    let aLifeStealDistT = null, bLifeStealDistT = null;
    if (aLifeStealMod !== null && aAlive > 0 && bRemHP > 0) {
      const singlePhase = calcLifeStealDmgDist(aAlive, b.res, aLifeStealMod, bRemHP);
      if (aLifeStealWithThrown && aLifeStealWithMelee) {
        aLifeStealDistT = convolveDists(singlePhase, singlePhase, bRemHP);
      } else if (aLifeStealWithThrown || aLifeStealWithMelee) {
        aLifeStealDistT = singlePhase;
      }
    }
    if (bLifeStealMod !== null && bAlive > 0 && aRemHP > 0 && bLifeStealWithMelee) {
      bLifeStealDistT = calcLifeStealDmgDist(bAlive, a.res, bLifeStealMod, aRemHP);
    }

    // Build phases array (with optional gaze phase between thrown and melee)
    const phases = [
      { label: thrownLabel,
        atkDist: [1], atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
        defDist: phase1Dist, defHP: bRemHP, defHPper: b.hp, defFigs: bAlive },
    ];
    if (aGazeActive) {
      phases.push({ label: 'Attacker ' + gazeLabel(aStoningGazeActive, aDeathGazeActive),
        atkDist: [1], atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
        defDist: gazeOnlyToB, defHP: bRemHP, defHPper: b.hp, defFigs: bAlive });
    }
    if (bGazeActive) {
      phases.push({ label: 'Defender ' + gazeLabel(bStoningGazeActive, bDeathGazeActive),
        atkDist: gazeOnlyToA, atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
        defDist: [1], defHP: bRemHP, defHPper: b.hp, defFigs: bAlive });
    }
    phases.push({ label: meleePhaseLabel,
      atkDist: counterOnlyToA, atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
      defDist: meleeOnlyToB, defHP: bRemHP, defHPper: b.hp, defFigs: bAlive });

    return {
      phases,
      totalDmgToA,
      totalDmgToB,
      aLifeStealDist: aLifeStealDistT,
      bLifeStealDist: bLifeStealDistT,
      aRemHP, aHP: a.hp, aAlive,
      bRemHP, bHP: b.hp, bAlive,
    };

  } else {
    // --- Pure melee ---
    // Touch attacks: resolved simultaneously with melee damage.
    const aPoisonStr = touchAttackFires(a.atk, a.baseAtk, opts.version)
      ? ((a.abilities && a.abilities.poison) || 0) : 0;
    const bPoisonStr = touchAttackFires(b.atk, b.baseAtk, opts.version)
      ? ((b.abilities && b.abilities.poison) || 0) : 0;
    const aPoisonFail = aPoisonStr > 0 ? poisonFailProb(b.res, b.abilities, opts.version) : 0;
    const bPoisonFail = bPoisonStr > 0 ? poisonFailProb(a.res, a.abilities, opts.version) : 0;

    const aStoningOn = a.abilities && a.abilities.stoningTouch != null
      && touchAttackFires(a.atk, a.baseAtk, opts.version);
    const bStoningOn = b.abilities && b.abilities.stoningTouch != null
      && touchAttackFires(b.atk, b.baseAtk, opts.version);
    const aStoningFail = aStoningOn ? stoningFailProb(b.res, b.abilities, a.abilities.stoningTouch) : 0;
    const bStoningFail = bStoningOn ? stoningFailProb(a.res, a.abilities, b.abilities.stoningTouch) : 0;

    // Life steal setup
    const aLifeStealOnM = a.abilities && a.abilities.lifeSteal != null
      && touchAttackFires(a.atk, a.baseAtk, opts.version);
    const aLifeStealModM = aLifeStealOnM ? lifeStealEffective(b.res, b.abilities, a.abilities.lifeSteal) : null;
    const bLifeStealOnM = b.abilities && b.abilities.lifeSteal != null
      && touchAttackFires(b.atk, b.baseAtk, opts.version);
    const bLifeStealModM = bLifeStealOnM ? lifeStealEffective(a.res, a.abilities, b.abilities.lifeSteal) : null;

    // Gaze attack detection (resolved before melee exchange)
    const gazeFiresA = gazeAttackFires(a.effectiveGazeRanged, opts.version);
    const gazeFiresB = gazeAttackFires(b.effectiveGazeRanged, opts.version);
    const aStoningGazeActive = !!(a.abilities && a.abilities.stoningGaze != null) && gazeFiresA;
    const bStoningGazeActive = !!(b.abilities && b.abilities.stoningGaze != null) && gazeFiresB;
    const aDeathGazeActive = !!(a.abilities && a.abilities.deathGaze != null) && gazeFiresA;
    const bDeathGazeActive = !!(b.abilities && b.abilities.deathGaze != null) && gazeFiresB;
    const aGazeActive = aStoningGazeActive || aDeathGazeActive;
    const bGazeActive = bStoningGazeActive || bDeathGazeActive;
    const aStoningGazeFail = aStoningGazeActive
      ? stoningFailProb(b.res, b.abilities, a.abilities.stoningGaze) : 0;
    const bStoningGazeFail = bStoningGazeActive
      ? stoningFailProb(a.res, a.abilities, b.abilities.stoningGaze) : 0;
    const aDeathGazeFail = aDeathGazeActive
      ? deathGazeFailProb(b.res, b.abilities, a.abilities.deathGaze) : 0;
    const bDeathGazeFail = bDeathGazeActive
      ? deathGazeFailProb(a.res, a.abilities, b.abilities.deathGaze) : 0;
    const hasGaze = aGazeActive || bGazeActive;

    if (hasGaze) {
      // Multi-phase: Gaze (attacker first, then defender) → Melee + Counter
      // Pre-compute B's gaze distribution (targets A)
      const bGazeDistBase = bGazeActive
        ? buildGazeDist(b, a, aAlive, aRemHP, bStoningGazeFail, bDeathGazeFail)
        : [1];

      const totalDmgToB = new Array(bRemHP + 1).fill(0);
      const totalDmgToA = new Array(aRemHP + 1).fill(0);
      const gazeOnlyToB = new Array(bRemHP + 1).fill(0);
      const gazeOnlyToA = new Array(aRemHP + 1).fill(0);
      const meleeOnlyToB = new Array(bRemHP + 1).fill(0);
      const meleeOnlyToA = new Array(aRemHP + 1).fill(0);

      // A's gaze: physical ranged + stoning + death effects on B's figures
      const aGazeDist = aGazeActive
        ? buildGazeDist(a, b, bAlive, bRemHP, aStoningGazeFail, aDeathGazeFail)
        : [1];

      for (let aGzDmg = 0; aGzDmg < aGazeDist.length; aGzDmg++) {
        if (aGazeDist[aGzDmg] < 1e-15) continue;

        const bDmgAfterAGaze = b.dmg + aGzDmg;
        const bAliveAfterGaze = Math.max(0, b.figs - Math.floor(bDmgAfterAGaze / b.hp));
        const bRemHPAfterGaze = Math.max(0, bRemHP - aGzDmg);

        // B's gaze: fires only if B has surviving figures
        const bGazeDist = bAliveAfterGaze > 0 ? bGazeDistBase : [1];

        for (let bGzDmg = 0; bGzDmg < bGazeDist.length; bGzDmg++) {
          if (bGazeDist[bGzDmg] < 1e-15) continue;
          const pGaze = aGazeDist[aGzDmg] * bGazeDist[bGzDmg];

          const aAliveAfterGaze = Math.max(0, a.figs - Math.floor((a.dmg + bGzDmg) / a.hp));
          const aRemHPAfterGaze = Math.max(0, aRemHP - bGzDmg);

          // Melee: attacker → defender (post-gaze figures)
          let meleeDist = aAliveAfterGaze > 0 && bRemHPAfterGaze > 0 && a.atk > 0
            ? calcTotalDamageDist(aAliveAfterGaze, a.atk, a.toHitMelee, b.def, b.toBlock, b.hp, bRemHPAfterGaze)
            : [1];

          if (aPoisonFail > 0 && aAliveAfterGaze > 0 && bRemHPAfterGaze > 0) {
            meleeDist = convolveDists(meleeDist,
              calcResistDmgDist(aAliveAfterGaze * aPoisonStr, aPoisonFail, bRemHPAfterGaze), bRemHPAfterGaze);
          }
          if (aStoningFail > 0 && aAliveAfterGaze > 0 && bRemHPAfterGaze > 0) {
            meleeDist = convolveDists(meleeDist,
              calcFigureKillDmgDist(aAliveAfterGaze, aStoningFail, b.hp, bRemHPAfterGaze), bRemHPAfterGaze);
          }
          if (aLifeStealModM !== null && aAliveAfterGaze > 0 && bRemHPAfterGaze > 0) {
            meleeDist = convolveDists(meleeDist,
              calcLifeStealDmgDist(aAliveAfterGaze, b.res, aLifeStealModM, bRemHPAfterGaze), bRemHPAfterGaze);
          }

          // Counter: defender → attacker (post-gaze figures)
          let counterDist = bAliveAfterGaze > 0 && aRemHPAfterGaze > 0 && b.atk > 0
            ? calcTotalDamageDist(bAliveAfterGaze, b.atk, b.toHitMelee, a.def, a.toBlock, a.hp, aRemHPAfterGaze)
            : [1];

          if (bPoisonFail > 0 && bAliveAfterGaze > 0 && aRemHPAfterGaze > 0) {
            counterDist = convolveDists(counterDist,
              calcResistDmgDist(bAliveAfterGaze * bPoisonStr, bPoisonFail, aRemHPAfterGaze), aRemHPAfterGaze);
          }
          if (bStoningFail > 0 && bAliveAfterGaze > 0 && aRemHPAfterGaze > 0) {
            counterDist = convolveDists(counterDist,
              calcFigureKillDmgDist(bAliveAfterGaze, bStoningFail, a.hp, aRemHPAfterGaze), aRemHPAfterGaze);
          }
          if (bLifeStealModM !== null && bAliveAfterGaze > 0 && aRemHPAfterGaze > 0) {
            counterDist = convolveDists(counterDist,
              calcLifeStealDmgDist(bAliveAfterGaze, a.res, bLifeStealModM, aRemHPAfterGaze), aRemHPAfterGaze);
          }

          // Accumulate
          gazeOnlyToB[Math.min(aGzDmg, bRemHP)] += pGaze;
          gazeOnlyToA[Math.min(bGzDmg, aRemHP)] += pGaze;

          for (let mDmg = 0; mDmg < meleeDist.length; mDmg++) {
            if (meleeDist[mDmg] < 1e-15) continue;
            totalDmgToB[Math.min(aGzDmg + mDmg, bRemHP)] += pGaze * meleeDist[mDmg];
            meleeOnlyToB[Math.min(mDmg, bRemHP)] += pGaze * meleeDist[mDmg];
          }
          for (let cDmg = 0; cDmg < counterDist.length; cDmg++) {
            if (counterDist[cDmg] < 1e-15) continue;
            totalDmgToA[Math.min(bGzDmg + cDmg, aRemHP)] += pGaze * counterDist[cDmg];
            meleeOnlyToA[Math.min(cDmg, aRemHP)] += pGaze * counterDist[cDmg];
          }
        }
      }

      // Phase labels
      let meleeLabel = 'Melee';
      if (aPoisonFail > 0 || bPoisonFail > 0) meleeLabel += ' + Poison Touch';
      if (aStoningFail > 0 || bStoningFail > 0) meleeLabel += ' + Stoning Touch';
      if (aLifeStealModM !== null || bLifeStealModM !== null) meleeLabel += ' + Life Steal';
      meleeLabel += ' + Counter-attack';

      // Life steal display distributions (approximate using initial figure counts)
      let aLifeStealDistM = null, bLifeStealDistM = null;
      if (aLifeStealModM !== null && aAlive > 0 && bRemHP > 0) {
        aLifeStealDistM = calcLifeStealDmgDist(aAlive, b.res, aLifeStealModM, bRemHP);
      }
      if (bLifeStealModM !== null && bAlive > 0 && aRemHP > 0) {
        bLifeStealDistM = calcLifeStealDmgDist(bAlive, a.res, bLifeStealModM, aRemHP);
      }

      const gazePhases = [];
      if (aGazeActive) {
        gazePhases.push({ label: 'Attacker ' + gazeLabel(aStoningGazeActive, aDeathGazeActive),
          atkDist: [1], atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
          defDist: gazeOnlyToB, defHP: bRemHP, defHPper: b.hp, defFigs: bAlive });
      }
      if (bGazeActive) {
        gazePhases.push({ label: 'Defender ' + gazeLabel(bStoningGazeActive, bDeathGazeActive),
          atkDist: gazeOnlyToA, atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
          defDist: [1], defHP: bRemHP, defHPper: b.hp, defFigs: bAlive });
      }

      return {
        phases: [
          ...gazePhases,
          { label: meleeLabel,
            atkDist: meleeOnlyToA, atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
            defDist: meleeOnlyToB, defHP: bRemHP, defHPper: b.hp, defFigs: bAlive },
        ],
        totalDmgToA,
        totalDmgToB,
        aLifeStealDist: aLifeStealDistM,
        bLifeStealDist: bLifeStealDistM,
        aRemHP, aHP: a.hp, aAlive,
        bRemHP, bHP: b.hp, bAlive,
      };

    } else {
      // --- No gaze: simultaneous melee exchange ---
      let dmgToB = aAlive > 0 && bRemHP > 0 && a.atk > 0
        ? calcTotalDamageDist(aAlive, a.atk, a.toHitMelee, b.def, b.toBlock, b.hp, bRemHP)
        : [1];

      if (aPoisonFail > 0 && aAlive > 0 && bRemHP > 0) {
        dmgToB = convolveDists(dmgToB, calcResistDmgDist(aAlive * aPoisonStr, aPoisonFail, bRemHP), bRemHP);
      }
      if (aStoningFail > 0 && aAlive > 0 && bRemHP > 0) {
        dmgToB = convolveDists(dmgToB, calcFigureKillDmgDist(aAlive, aStoningFail, b.hp, bRemHP), bRemHP);
      }
      let aLifeStealDistM = null;
      if (aLifeStealModM !== null && aAlive > 0 && bRemHP > 0) {
        aLifeStealDistM = calcLifeStealDmgDist(aAlive, b.res, aLifeStealModM, bRemHP);
        dmgToB = convolveDists(dmgToB, aLifeStealDistM, bRemHP);
      }

      let dmgToA = bAlive > 0 && aRemHP > 0 && b.atk > 0
        ? calcTotalDamageDist(bAlive, b.atk, b.toHitMelee, a.def, a.toBlock, a.hp, aRemHP)
        : [1];

      if (bPoisonFail > 0 && bAlive > 0 && aRemHP > 0) {
        dmgToA = convolveDists(dmgToA, calcResistDmgDist(bAlive * bPoisonStr, bPoisonFail, aRemHP), aRemHP);
      }
      if (bStoningFail > 0 && bAlive > 0 && aRemHP > 0) {
        dmgToA = convolveDists(dmgToA, calcFigureKillDmgDist(bAlive, bStoningFail, a.hp, aRemHP), aRemHP);
      }
      let bLifeStealDistM = null;
      if (bLifeStealModM !== null && bAlive > 0 && aRemHP > 0) {
        bLifeStealDistM = calcLifeStealDmgDist(bAlive, a.res, bLifeStealModM, aRemHP);
        dmgToA = convolveDists(dmgToA, bLifeStealDistM, aRemHP);
      }

      return {
        phases: null,
        totalDmgToA: dmgToA,
        totalDmgToB: dmgToB,
        aLifeStealDist: aLifeStealDistM,
        bLifeStealDist: bLifeStealDistM,
        aRemHP, aHP: a.hp, aAlive,
        bRemHP, bHP: b.hp, bAlive,
      };
    }
  }
}
