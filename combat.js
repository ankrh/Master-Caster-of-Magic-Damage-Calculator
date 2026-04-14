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
// Long Range caps the penalty at -10%.
function distancePenalty(distance, rangedType, longRange) {
  if (rangedType !== 'missile' && rangedType !== 'boulder') return 0;
  let penalty = 0;
  if (distance >= 9) penalty = -30;
  else if (distance >= 6) penalty = -20;
  else if (distance >= 3) penalty = -10;
  if (longRange && penalty < -10) penalty = -10;
  return penalty;
}

// --- Ability Stat Modifiers ---
// Apply ability/enchantment effects that modify base stats.
// Called after level/weapon bonuses are computed.
// `abilities` is a map of ability key -> value (bool true/false, or number).
// `version` is the game version string (e.g. 'mom_1.31', 'com_6.08', 'com2_1.05.11').
// Returns { atkMod, defMod, resMod, hpMod, toHitMod, toBlkMod, rtbMod } — additive modifiers.
function getAbilityStatModifiers(abilities, version) {
  let atkMod = 0, defMod = 0, resMod = 0, hpMod = 0, toHitMod = 0, toBlkMod = 0, rtbMod = 0;

  // Holy Bonus: +X to melee attack, defense, resistance.
  // CoM v6.05+ and CoM2: also +X to ranged/thrown/breath attack.
  const hb = (abilities && abilities.holyBonus) || 0;
  if (hb > 0) {
    atkMod += hb;
    defMod += hb;
    resMod += hb;
    const isCoMPlus = version && (version.startsWith('com_') || version.startsWith('com2_'));
    if (isCoMPlus) {
      rtbMod += hb;
    }
  }

  // Resistance to All: +X to resistance.
  const rta = (abilities && abilities.resistanceToAll) || 0;
  if (rta > 0) {
    resMod += rta;
  }

  // Lucky: +10% To Hit, +10% To Block, +1 Resistance.
  // The v1.31 enemy melee penalty (-10% To Hit) is applied in resolveCombat.
  if (abilities && abilities.lucky) {
    toHitMod += 10;
    toBlkMod += 10;
    resMod += 1;
  }

  return { atkMod, defMod, resMod, hpMod, toHitMod, toBlkMod, rtbMod };
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
// doom gaze (exact damage), stoning-kill rolls and death-kill rolls.
function buildGazeDist(atk, def, defAlive, defRemHP, stoningFail, deathFail, doomStr, defDefStat) {
  if (defAlive <= 0 || defRemHP <= 0) return [1];
  let dist = [1];
  const defStat = (defDefStat != null) ? defDefStat : def.def;
  if (atk.effectiveGazeRanged > 0) {
    dist = calcTotalDamageDist(1, atk.effectiveGazeRanged, atk.toHitRtb, defStat, def.toBlock, def.hp, defRemHP);
  }
  // Doom Gaze: exact damage, no rolls, no immunities
  if (doomStr > 0) {
    const doomDist = new Array(Math.min(doomStr, defRemHP) + 1).fill(0);
    doomDist[Math.min(doomStr, defRemHP)] = 1;
    dist = convolveDists(dist, doomDist, defRemHP);
  }
  if (stoningFail > 0) {
    dist = convolveDists(dist, calcFigureKillDmgDist(defAlive, stoningFail, def.hp, defRemHP), defRemHP);
  }
  if (deathFail > 0) {
    dist = convolveDists(dist, calcFigureKillDmgDist(defAlive, deathFail, def.hp, defRemHP), defRemHP);
  }
  return dist;
}

// Build a deterministic doom damage distribution.
// Doom damage skips attack rolls and defense rolls: total = figs * str, capped at maxDmg.
function calcDoomDist(figs, str, maxDmg) {
  const totalDmg = Math.min(figs * str, maxDmg);
  const dist = new Array(totalDmg + 1).fill(0);
  dist[totalDmg] = 1;
  return dist;
}

// Phase label for a gaze attack given which gaze types are active.
function gazeLabel(stoning, death, doom) {
  const count = (stoning ? 1 : 0) + (death ? 1 : 0) + (doom ? 1 : 0);
  if (count > 1) return 'Gaze Attack';
  if (stoning) return 'Stoning Gaze';
  if (death) return 'Death Gaze';
  if (doom) return 'Doom Gaze';
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
  if (version === 'mom_1.31') return effectiveAtk > 0;
  return (baseAtk || 0) > 0;
}

// Check whether a gaze attack fires for a given unit.
// Stoning/Death Gaze are attached to either the hidden gaze ranged component or a
// Doom Gaze — the gaze fires if at least one of these is present.
// v1.31 bug: requires non-zero effective strength after modifiers.
// Patched versions (CP 1.60+): gaze always fires if the unit has the ability.
function gazeAttackFires(effectiveGazeRanged, effectiveDoomGaze, version) {
  if (version === 'mom_1.31') return effectiveGazeRanged > 0 || effectiveDoomGaze > 0;
  return true;
}

// --- Weapon Immunity ---
// Applies Weapon Immunity defense boost after armor piercing.
// MoM: defense raised to minimum 10.  CoM2: +8 defense.
// Triggers only against Normal units with normal (non-magical) weapons.
// Phase applicability varies by version:
//   Melee: always applies.
//   Thrown: applies in all versions EXCEPT v1.31 (bug: thrown ignores WI).
//   Ranged missile/boulder: MoM = never. CoM2 = applies.
//   Magic ranged: never (already magical).
function weaponImmunityDef(baseDef, defAbilities, atkWeapon, atkUnitType, version) {
  if (!defAbilities || !defAbilities.weaponImmunity) return baseDef;
  if (atkWeapon !== 'normal') return baseDef;
  if (atkUnitType !== 'normal') return baseDef;
  if (version && version.startsWith('com')) {
    return baseDef + 8;
  }
  return Math.max(baseDef, 10);
}

// --- Missile Immunity ---
// Applies Missile Immunity defense boost. Only triggers against Ranged Missile Attacks.
// MoM: defense set to 50. Applied after armor piercing and weapon immunity.
function missileImmunityDef(baseDef, defAbilities) {
  if (!defAbilities || !defAbilities.missileImmunity) return baseDef;
  return 50;
}

// --- Fire Immunity ---
// Raises defense to 50 against Fire Breath and Immolation damage.
// Fire Damage is also a subtype of Magical Damage, so Magic Immunity also blocks it
// (but that's handled separately). Applied after armor piercing and weapon immunity.
function fireImmunityDef(baseDef, defAbilities) {
  if (!defAbilities || !defAbilities.fireImmunity) return baseDef;
  return 50;
}

// --- Cause Fear ---
// Probability of a single figure failing its fear resistance roll.
// Fear has no resistance modifier (0). Blocked by Death Immunity, Magic Immunity.
function fearFailProb(defRes, defAbilities) {
  if (defAbilities && (defAbilities.deathImmunity || defAbilities.magicImmunity)) return 0;
  const effectiveRes = Math.min(Math.max(defRes, 0), 10);
  if (effectiveRes >= 10) return 0;
  return (10 - effectiveRes) / 10;
}

// Distribution of unfeared (active) figures under Cause Fear.
// Returns array where dist[k] = P(k figures are unfeared).
// Uses Binomial(numFigs, 1 - pFear).
function calcFearDist(numFigs, pFear) {
  if (numFigs <= 0) return [1];
  if (pFear <= 0) {
    const d = new Array(numFigs + 1).fill(0);
    d[numFigs] = 1;
    return d;
  }
  if (pFear >= 1) {
    const d = new Array(numFigs + 1).fill(0);
    d[0] = 1;
    return d;
  }
  return binomialPMF(numFigs, 1 - pFear);
}

// v1.31 bug: attacker self-fears based on defender's resistance rolls.
// Defender's figures each roll; each fail fears one attacker figure.
// Returns dist[k] = P(k attacker figures are unfeared).
function calcFearBugDist(atkFigs, defFigs, pFear) {
  if (atkFigs <= 0) return [1];
  if (pFear <= 0 || defFigs <= 0) {
    const d = new Array(atkFigs + 1).fill(0);
    d[atkFigs] = 1;
    return d;
  }
  // Defender fails ~ Binomial(defFigs, pFear)
  const failsPMF = binomialPMF(defFigs, pFear);
  const d = new Array(atkFigs + 1).fill(0);
  for (let f = 0; f <= defFigs; f++) {
    if (failsPMF[f] < 1e-15) continue;
    d[Math.max(atkFigs - f, 0)] += failsPMF[f];
  }
  return d;
}

// Compute melee + touch-attack damage distribution, weighted over possible
// unfeared figure counts (Cause Fear).
// fearDist: array where fearDist[k] = P(k figures attack), or null if no fear active.
function calcMeleeTouchDmg(fearDist, maxFigs, isDoom, atk, toHit,
                            def, toBlock, targetHP, remHP,
                            poisonStr, poisonFail,
                            stoningFail,
                            lifeStealMod, lifeStealRes) {
  if (remHP <= 0 || maxFigs <= 0) return [1];
  const result = new Array(remHP + 1).fill(0);
  const lo = fearDist ? 0 : maxFigs;
  for (let k = lo; k <= maxFigs; k++) {
    const pK = fearDist ? fearDist[k] : 1;
    if (pK < 1e-15) continue;
    let dist;
    if (k <= 0 || atk <= 0) {
      dist = [1];
    } else if (isDoom) {
      dist = calcDoomDist(k, atk, remHP);
    } else {
      dist = calcTotalDamageDist(k, atk, toHit, def, toBlock, targetHP, remHP);
    }
    if (poisonStr > 0 && poisonFail > 0 && k > 0) {
      dist = convolveDists(dist, calcResistDmgDist(k * poisonStr, poisonFail, remHP), remHP);
    }
    if (stoningFail > 0 && k > 0) {
      dist = convolveDists(dist, calcFigureKillDmgDist(k, stoningFail, targetHP, remHP), remHP);
    }
    if (lifeStealMod !== null && k > 0) {
      dist = convolveDists(dist, calcLifeStealDmgDist(k, lifeStealRes, lifeStealMod, remHP), remHP);
    }
    for (let d = 0; d < dist.length; d++) result[d] += pK * dist[d];
  }
  return result;
}

// Build feared-count display distributions for the phase breakdown.
// Returns { atkFearedDist, defFearedDist } or null if no fear is active.
function buildFearPhaseDists(aFigs, bFigs, bPFear, aPFear, aFearedByB, aFearBug, bFearedByA) {
  if (!aFearedByB && !aFearBug && !bFearedByA) return null;
  // B's feared dist (from A's fear)
  const defFearedDist = bFearedByA && bFigs > 0
    ? binomialPMF(bFigs, bPFear) : [1];
  // A's feared dist (from B's fear or v1.31 self-fear bug)
  let atkFearedDist;
  if (aFearedByB && aFigs > 0) {
    atkFearedDist = binomialPMF(aFigs, aPFear);
  } else if (aFearBug && aFigs > 0 && bFigs > 0) {
    // v1.31 bug: B's figures roll, each fail fears one of A's figures
    const failsPMF = binomialPMF(bFigs, bPFear);
    atkFearedDist = new Array(aFigs + 1).fill(0);
    for (let f = 0; f <= bFigs; f++) {
      if (failsPMF[f] < 1e-15) continue;
      atkFearedDist[Math.min(f, aFigs)] += failsPMF[f];
    }
  } else {
    atkFearedDist = [1];
  }
  return { atkFearedDist, defFearedDist };
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
//   Damage immunity: Magic Immunity (vs magic ranged),
//                    Missile Immunity (vs missile/boulder), Weapon Immunity (vs non-magic melee),
//                    Poison Immunity, Stoning Immunity, Cold Immunity, Death Immunity
//   Special attacks: Poison Touch, Life Steal, Stoning Touch/Gaze, Death Gaze, Doom Gaze, Cause Fear
//   Defense bonus:   Large Shield (+2 def vs ranged), Invulnerability
//   Hit bonus:       Lucky (+10% To Hit, +10% To Block, +1 Res; v1.31: enemy melee -10% To Hit), Bless (vs Chaos/Death)
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

  // Lucky v1.31: defender's Lucky penalizes opponent's melee To Hit by -10%.
  // Removed in v1.40n+ (Insecticide patch). Only affects melee, not ranged/thrown/breath.
  // We reclamp via Math.max(0.1, ...) since toHitMelee is already a decimal (0.1-1.0).
  if (opts.version === 'mom_1.31') {
    if (b.abilities && b.abilities.lucky) {
      a = Object.assign({}, a, { toHitMelee: Math.max(0.1, a.toHitMelee - 0.1) });
    }
    if (a.abilities && a.abilities.lucky) {
      b = Object.assign({}, b, { toHitMelee: Math.max(0.1, b.toHitMelee - 0.1) });
    }
  }

  // First Strike applies when A is voluntarily attacking in melee and B cannot negate it.
  // Ranged attacks never trigger first strike (it only affects melee ordering).
  const hasFirstStrike = !isRanged
    && !!(a.abilities && a.abilities.firstStrike)
    && !(b.abilities && b.abilities.negateFirstStrike);

  // Compute alive figures and remaining HP
  const aTotalHP = a.figs * a.hp;
  const aAlive   = Math.max(0, a.figs - Math.floor(a.dmg / a.hp));
  const aRemHP   = Math.max(0, aTotalHP - a.dmg);

  const bTotalHP = b.figs * b.hp;
  const bAlive   = Math.max(0, b.figs - Math.floor(b.dmg / b.hp));
  const bRemHP   = Math.max(0, bTotalHP - b.dmg);

  // Doom Damage: converts regular melee/ranged/thrown/breath attacks to exact damage (no to-hit, no defense).
  const aDoom = !!(a.abilities && a.abilities.doom);
  const bDoom = !!(b.abilities && b.abilities.doom);

  // Cause Fear: reduces opponent's effective melee + touch-attack figures.
  // Fires before the melee exchange. No resistance modifier.
  // v1.31 bugs: (1) defending Fear doesn't work; (2) attacker's Fear also self-fears attacker.
  const aFear = !isRanged && !!(a.abilities && a.abilities.fear);
  const bFear = !isRanged && !!(b.abilities && b.abilities.fear);
  const bPFear = aFear ? fearFailProb(b.res, b.abilities) : 0; // A's fear on B
  const aPFear = bFear ? fearFailProb(a.res, a.abilities) : 0; // B's fear on A
  const bFearedByA = bPFear > 0; // A can fear B's counter (all versions)
  const aFearedByB = aPFear > 0 && opts.version !== 'mom_1.31'; // B can fear A (not v1.31: bug #1)
  const aFearBug = aFear && opts.version === 'mom_1.31' && bPFear > 0; // v1.31 self-fear bug #2

  // Determine if attacker has thrown/breath (melee only)
  const hasThrown = !isRanged && a.thrownType !== 'none' && a.rtb > 0;

  // Large Shield: +2 defense (MoM) or +3 defense (CoM/CoM2) against ranged, thrown,
  // breath, and gaze attacks. Does NOT apply against melee. Added before armor piercing
  // so that AP halves the combined defense total.
  const ver = opts.version;
  const bLargeShield = !!(b.abilities && b.abilities.largeShield);
  const aLargeShield = !!(a.abilities && a.abilities.largeShield);
  const isCoM = ver && ver.startsWith('com');
  const largeShieldBonus = isCoM ? 3 : 2;
  const bDefLS = bLargeShield ? b.def + largeShieldBonus : b.def;
  const aDefLS = aLargeShield ? a.def + largeShieldBonus : a.def;

  // Armor Piercing: halve defense (round down) before immunities. Applies to all of
  // the attacker's attacks. Lightning Breath is intrinsically armor piercing but only
  // for the thrown/breath phase. Halving is applied at most once regardless of source.
  const aArmorPiercing = !!(a.abilities && a.abilities.armorPiercing);
  const bArmorPiercing = !!(b.abilities && b.abilities.armorPiercing);
  const bDefAP = aArmorPiercing ? Math.floor(b.def / 2) : b.def;
  const aDefAP = bArmorPiercing ? Math.floor(a.def / 2) : a.def;
  // Large Shield variants: applied to non-melee defense before AP
  const bDefAPLS = aArmorPiercing ? Math.floor(bDefLS / 2) : bDefLS;
  const aDefAPLS = bArmorPiercing ? Math.floor(aDefLS / 2) : aDefLS;
  const bDefAPThrownLS = (aArmorPiercing || a.thrownType === 'lightning')
    ? Math.floor(bDefLS / 2) : bDefLS;

  // Weapon Immunity: applied after armor piercing. Phase-specific eligibility.
  // MoM: defense → min 10. CoM2: defense + 8. Only vs normal units with normal weapons.
  // Melee: always eligible
  let bDefVsA = weaponImmunityDef(bDefAP, b.abilities, a.weapon, a.unitType, ver);
  // Gaze: hidden ranged component — gaze attackers are always fantastic so WI never
  // triggers, but Large Shield applies since it's a ranged attack.
  let bDefForGaze = weaponImmunityDef(bDefAPLS, b.abilities, a.weapon, a.unitType, ver);
  let aDefVsB = weaponImmunityDef(aDefAP, a.abilities, b.weapon, b.unitType, ver);
  let aDefForGaze = weaponImmunityDef(aDefAPLS, a.abilities, b.weapon, b.unitType, ver);
  // Ranged: WI applies to missile/boulder (physical ranged) in all versions.
  // Does NOT apply to magic ranged (already magical damage).
  // Large Shield bonus is included for all ranged types.
  const isPhysRanged = a.rangedType === 'missile' || a.rangedType === 'boulder';
  let bDefVsARanged = isPhysRanged
    ? weaponImmunityDef(bDefAPLS, b.abilities, a.weapon, a.unitType, ver) : bDefAPLS;
  // Thrown: WI eligible except v1.31 bug. Breath (fire/lightning) is magical, never triggers WI.
  // Large Shield bonus is included for thrown/breath.
  const thrownWI = a.thrownType === 'thrown' && ver !== 'mom_1.31';
  let bDefForThrown = thrownWI
    ? weaponImmunityDef(bDefAPThrownLS, b.abilities, a.weapon, a.unitType, ver) : bDefAPThrownLS;

  // Missile Immunity: defense set to 50 against missile ranged attacks only (not boulder/magic).
  // Applied after armor piercing and weapon immunity.
  // v1.31 bug: when both WI and MI apply to the same missile attack, WI overwrites MI
  // (defense stays at 10 instead of 50). Fixed in v1.51+ (CP 1.60).
  const isMissile = a.rangedType === 'missile';
  const wiTriggeredOnMissile = isMissile && b.abilities && b.abilities.weaponImmunity
    && a.weapon === 'normal' && a.unitType === 'normal';
  if (isMissile && !(ver === 'mom_1.31' && wiTriggeredOnMissile)) {
    bDefVsARanged = missileImmunityDef(bDefVsARanged, b.abilities);
  }

  // Fire Immunity: defense set to 50 against fire breath (thrownType 'fire').
  // Applied after armor piercing and weapon immunity (though breath is magical so WI never triggers).
  if (a.thrownType === 'fire') {
    bDefForThrown = fireImmunityDef(bDefForThrown, b.abilities);
  }

  // Illusion: sets defender's defense to 0 (only city walls bonus survives).
  // Applied after all other immunities. Negated by Illusion Immunity.
  const aIllusion = !!(a.abilities && a.abilities.illusion);
  const bIllusion = !!(b.abilities && b.abilities.illusion);
  const aIllusionImmune = !!(a.abilities && a.abilities.illusionImmunity);
  const bIllusionImmune = !!(b.abilities && b.abilities.illusionImmunity);
  if (aIllusion && !bIllusionImmune) {
    const bCW = b.cityWallBonus || 0;
    bDefVsA = bCW;
    bDefVsARanged = bCW;
    bDefForThrown = bCW;
    bDefForGaze = bCW;
  }
  if (bIllusion && !aIllusionImmune) {
    aDefVsB = a.cityWallBonus || 0;
    aDefForGaze = a.cityWallBonus || 0;
  }

  if (isRanged) {
    // --- Ranged: attacker shoots, no counter-attack ---
    let dmgToB = aAlive > 0 && bRemHP > 0 && a.rtb > 0
      ? (aDoom ? calcDoomDist(aAlive, a.rtb, bRemHP)
               : calcTotalDamageDist(aAlive, a.rtb, a.toHitRtb, bDefVsARanged, b.toBlock, b.hp, bRemHP))
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
    // Stoning Gaze, Death Gaze, and Doom Gaze fire together when a unit has multiple
    // (e.g. Chaos Spawn), and share a single hidden physical ranged component.
    const aDoomGazeStr = (a.effectiveDoomGaze || 0) > 0 ? a.effectiveDoomGaze : 0;
    const bDoomGazeStr = (b.effectiveDoomGaze || 0) > 0 ? b.effectiveDoomGaze : 0;
    const aDoomGazeActive = aDoomGazeStr > 0;
    const bDoomGazeActive = bDoomGazeStr > 0;
    const gazeFires = gazeAttackFires(a.effectiveGazeRanged, aDoomGazeStr, opts.version);
    const gazeFiresB = gazeAttackFires(b.effectiveGazeRanged, bDoomGazeStr, opts.version);
    const aStoningGazeActive = !!(a.abilities && a.abilities.stoningGaze != null) && gazeFires;
    const bStoningGazeActive = !!(b.abilities && b.abilities.stoningGaze != null) && gazeFiresB;
    const aDeathGazeActive = !!(a.abilities && a.abilities.deathGaze != null) && gazeFires;
    const bDeathGazeActive = !!(b.abilities && b.abilities.deathGaze != null) && gazeFiresB;
    const aGazeActive = aStoningGazeActive || aDeathGazeActive || aDoomGazeActive;
    const bGazeActive = bStoningGazeActive || bDeathGazeActive || bDoomGazeActive;
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
      ? buildGazeDist(b, a, aAlive, aRemHP, bStoningGazeFail, bDeathGazeFail, bDoomGazeStr, aDefForGaze)
      : [1];

    // Phase 1: Thrown/Breath damage
    let thrownDist = aAlive > 0 && bRemHP > 0
      ? (aDoom ? calcDoomDist(aAlive, a.rtb, bRemHP)
               : calcTotalDamageDist(aAlive, a.rtb, a.toHitRtb, bDefForThrown, b.toBlock, b.hp, bRemHP))
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
      // A's gaze: physical ranged + doom + stoning + death effects on B's surviving figures
      const aGazeDist = aGazeActive
        ? buildGazeDist(a, b, bAliveAfterP1, bRemHPAfterP1, aStoningGazeFail, aDeathGazeFail, aDoomGazeStr, bDefForGaze)
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

          // Phase 3: Melee + Touch (post-gaze figure counts), with Cause Fear
          const aUnfeared1 = aFearedByB ? calcFearDist(aAliveAfterGaze, aPFear)
                           : aFearBug ? calcFearBugDist(aAliveAfterGaze, bAliveAfterGaze, bPFear)
                           : null;
          const meleeDist = calcMeleeTouchDmg(aUnfeared1, aAliveAfterGaze, aDoom, a.atk, a.toHitMelee,
            bDefVsA, b.toBlock, b.hp, bRemHPAfterGaze,
            aPoisonWithMelee ? aPoisonStr : 0, aPoisonFail,
            aStoningWithMelee ? aStoningFail : 0,
            aLifeStealWithMelee ? aLifeStealMod : null, b.res);

          if (hasFirstStrike) {
            // A's melee resolves before B's counter-attack; counter uses post-melee survivors.
            for (let mDmg = 0; mDmg < meleeDist.length; mDmg++) {
              if (meleeDist[mDmg] < 1e-15) continue;
              const pM = pCombined * meleeDist[mDmg];
              totalDmgToB[Math.min(p1Dmg + aGzDmg + mDmg, bRemHP)] += pM;
              meleeOnlyToB[Math.min(mDmg, bRemHP)] += pM;

              const bDmgAfterMelee = bDmgAfterAGaze + mDmg;
              const bAliveAfterMelee = Math.max(0, b.figs - Math.floor(bDmgAfterMelee / b.hp));
              const bUnfearedFS1 = bFearedByA ? calcFearDist(bAliveAfterMelee, bPFear) : null;
              const counterDist = calcMeleeTouchDmg(bUnfearedFS1, bAliveAfterMelee, bDoom, b.atk, b.toHitMelee,
                aDefVsB, a.toBlock, a.hp, aRemHPAfterGaze,
                bPoisonWithMelee ? bPoisonStr : 0, bPoisonFail,
                bStoningWithMelee ? bStoningFail : 0,
                bLifeStealWithMelee ? bLifeStealMod : null, a.res);
              for (let cDmg = 0; cDmg < counterDist.length; cDmg++) {
                if (counterDist[cDmg] < 1e-15) continue;
                const v = pM * counterDist[cDmg];
                totalDmgToA[Math.min(bGzDmg + cDmg, aRemHP)] += v;
                counterOnlyToA[Math.min(cDmg, aRemHP)] += v;
              }
            }
            continue;
          }

          // Counter-attack (surviving B figures after gaze, simultaneous with A's melee)
          const bUnfeared1 = bFearedByA ? calcFearDist(bAliveAfterGaze, bPFear) : null;
          const counterDist = calcMeleeTouchDmg(bUnfeared1, bAliveAfterGaze, bDoom, b.atk, b.toHitMelee,
            aDefVsB, a.toBlock, a.hp, aRemHPAfterGaze,
            bPoisonWithMelee ? bPoisonStr : 0, bPoisonFail,
            bStoningWithMelee ? bStoningFail : 0,
            bLifeStealWithMelee ? bLifeStealMod : null, a.res);

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

    let meleePhaseLabel = hasFirstStrike ? 'First Strike' : 'Melee';
    if (aPoisonWithMelee || bPoisonWithMelee) meleePhaseLabel += ' + Poison Touch';
    if (aStoningWithMelee || bStoningWithMelee) meleePhaseLabel += ' + Stoning Touch';
    if (aLifeStealWithMelee || bLifeStealWithMelee) meleePhaseLabel += ' + Life Steal';
    meleePhaseLabel += ' + Counter-attack';

    const fearPhaseDists1 = buildFearPhaseDists(aAlive, bAlive, bPFear, aPFear, aFearedByB, aFearBug, bFearedByA);

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
      phases.push({ label: 'Attacker ' + gazeLabel(aStoningGazeActive, aDeathGazeActive, aDoomGazeActive),
        atkDist: [1], atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
        defDist: gazeOnlyToB, defHP: bRemHP, defHPper: b.hp, defFigs: bAlive });
    }
    if (bGazeActive) {
      phases.push({ label: 'Defender ' + gazeLabel(bStoningGazeActive, bDeathGazeActive, bDoomGazeActive),
        atkDist: gazeOnlyToA, atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
        defDist: [1], defHP: bRemHP, defHPper: b.hp, defFigs: bAlive });
    }
    if (fearPhaseDists1) {
      phases.push({ label: 'Cause Fear', mode: 'feared',
        atkDist: fearPhaseDists1.atkFearedDist, defDist: fearPhaseDists1.defFearedDist });
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
    const aDoomGazeStr = (a.effectiveDoomGaze || 0) > 0 ? a.effectiveDoomGaze : 0;
    const bDoomGazeStr = (b.effectiveDoomGaze || 0) > 0 ? b.effectiveDoomGaze : 0;
    const aDoomGazeActive = aDoomGazeStr > 0;
    const bDoomGazeActive = bDoomGazeStr > 0;
    const gazeFiresA = gazeAttackFires(a.effectiveGazeRanged, aDoomGazeStr, opts.version);
    const gazeFiresB = gazeAttackFires(b.effectiveGazeRanged, bDoomGazeStr, opts.version);
    const aStoningGazeActive = !!(a.abilities && a.abilities.stoningGaze != null) && gazeFiresA;
    const bStoningGazeActive = !!(b.abilities && b.abilities.stoningGaze != null) && gazeFiresB;
    const aDeathGazeActive = !!(a.abilities && a.abilities.deathGaze != null) && gazeFiresA;
    const bDeathGazeActive = !!(b.abilities && b.abilities.deathGaze != null) && gazeFiresB;
    const aGazeActive = aStoningGazeActive || aDeathGazeActive || aDoomGazeActive;
    const bGazeActive = bStoningGazeActive || bDeathGazeActive || bDoomGazeActive;
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
        ? buildGazeDist(b, a, aAlive, aRemHP, bStoningGazeFail, bDeathGazeFail, bDoomGazeStr, aDefForGaze)
        : [1];

      const totalDmgToB = new Array(bRemHP + 1).fill(0);
      const totalDmgToA = new Array(aRemHP + 1).fill(0);
      const gazeOnlyToB = new Array(bRemHP + 1).fill(0);
      const gazeOnlyToA = new Array(aRemHP + 1).fill(0);
      const meleeOnlyToB = new Array(bRemHP + 1).fill(0);
      const meleeOnlyToA = new Array(aRemHP + 1).fill(0);

      // A's gaze: physical ranged + doom + stoning + death effects on B's figures
      const aGazeDist = aGazeActive
        ? buildGazeDist(a, b, bAlive, bRemHP, aStoningGazeFail, aDeathGazeFail, aDoomGazeStr, bDefForGaze)
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

          // Melee: attacker → defender (post-gaze figures), with Cause Fear
          const aUnfeared2 = aFearedByB ? calcFearDist(aAliveAfterGaze, aPFear)
                           : aFearBug ? calcFearBugDist(aAliveAfterGaze, bAliveAfterGaze, bPFear)
                           : null;
          const meleeDist = calcMeleeTouchDmg(aUnfeared2, aAliveAfterGaze, aDoom, a.atk, a.toHitMelee,
            bDefVsA, b.toBlock, b.hp, bRemHPAfterGaze,
            aPoisonStr, aPoisonFail, aStoningFail, aLifeStealModM, b.res);

          // Accumulate gaze damage
          gazeOnlyToB[Math.min(aGzDmg, bRemHP)] += pGaze;
          gazeOnlyToA[Math.min(bGzDmg, aRemHP)] += pGaze;

          if (hasFirstStrike) {
            // A's melee resolves before B's counter; counter uses post-melee survivors.
            for (let mDmg = 0; mDmg < meleeDist.length; mDmg++) {
              if (meleeDist[mDmg] < 1e-15) continue;
              const pM = pGaze * meleeDist[mDmg];
              totalDmgToB[Math.min(aGzDmg + mDmg, bRemHP)] += pM;
              meleeOnlyToB[Math.min(mDmg, bRemHP)] += pM;

              const bDmgAfterMelee = bDmgAfterAGaze + mDmg;
              const bAliveAfterMelee = Math.max(0, b.figs - Math.floor(bDmgAfterMelee / b.hp));
              const bUnfearedFS2 = bFearedByA ? calcFearDist(bAliveAfterMelee, bPFear) : null;
              const counterDist = calcMeleeTouchDmg(bUnfearedFS2, bAliveAfterMelee, bDoom, b.atk, b.toHitMelee,
                aDefVsB, a.toBlock, a.hp, aRemHPAfterGaze,
                bPoisonStr, bPoisonFail, bStoningFail, bLifeStealModM, a.res);
              for (let cDmg = 0; cDmg < counterDist.length; cDmg++) {
                if (counterDist[cDmg] < 1e-15) continue;
                const v = pM * counterDist[cDmg];
                totalDmgToA[Math.min(bGzDmg + cDmg, aRemHP)] += v;
                meleeOnlyToA[Math.min(cDmg, aRemHP)] += v;
              }
            }
            continue;
          }

          // Simultaneous: counter uses post-gaze figures
          const bUnfeared2 = bFearedByA ? calcFearDist(bAliveAfterGaze, bPFear) : null;
          const counterDist = calcMeleeTouchDmg(bUnfeared2, bAliveAfterGaze, bDoom, b.atk, b.toHitMelee,
            aDefVsB, a.toBlock, a.hp, aRemHPAfterGaze,
            bPoisonStr, bPoisonFail, bStoningFail, bLifeStealModM, a.res);

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
      let meleeLabel = hasFirstStrike ? 'First Strike' : 'Melee';
      if (aPoisonFail > 0 || bPoisonFail > 0) meleeLabel += ' + Poison Touch';
      if (aStoningFail > 0 || bStoningFail > 0) meleeLabel += ' + Stoning Touch';
      if (aLifeStealModM !== null || bLifeStealModM !== null) meleeLabel += ' + Life Steal';
      meleeLabel += ' + Counter-attack';

      const fearPhaseDists2 = buildFearPhaseDists(aAlive, bAlive, bPFear, aPFear, aFearedByB, aFearBug, bFearedByA);

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
        gazePhases.push({ label: 'Attacker ' + gazeLabel(aStoningGazeActive, aDeathGazeActive, aDoomGazeActive),
          atkDist: [1], atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
          defDist: gazeOnlyToB, defHP: bRemHP, defHPper: b.hp, defFigs: bAlive });
      }
      if (bGazeActive) {
        gazePhases.push({ label: 'Defender ' + gazeLabel(bStoningGazeActive, bDeathGazeActive, bDoomGazeActive),
          atkDist: gazeOnlyToA, atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
          defDist: [1], defHP: bRemHP, defHPper: b.hp, defFigs: bAlive });
      }

      const fearPhase2 = fearPhaseDists2
        ? [{ label: 'Cause Fear', mode: 'feared', atkDist: fearPhaseDists2.atkFearedDist, defDist: fearPhaseDists2.defFearedDist }]
        : [];

      return {
        phases: [
          ...gazePhases,
          ...fearPhase2,
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
      // --- No gaze: melee exchange (simultaneous, or sequential under First Strike) ---
      const fearPhaseDists3 = buildFearPhaseDists(aAlive, bAlive, bPFear, aPFear, aFearedByB, aFearBug, bFearedByA);

      const aUnfeared3 = aFearedByB ? calcFearDist(aAlive, aPFear)
                       : aFearBug ? calcFearBugDist(aAlive, bAlive, bPFear)
                       : null;
      const dmgToB = calcMeleeTouchDmg(aUnfeared3, aAlive, aDoom, a.atk, a.toHitMelee,
        bDefVsA, b.toBlock, b.hp, bRemHP,
        aPoisonStr, aPoisonFail, aStoningFail, aLifeStealModM, b.res);

      let aLifeStealDistM = null;
      if (aLifeStealModM !== null && aAlive > 0 && bRemHP > 0) {
        aLifeStealDistM = calcLifeStealDmgDist(aAlive, b.res, aLifeStealModM, bRemHP);
      }

      let bLifeStealDistM = null;
      if (bLifeStealModM !== null && bAlive > 0 && aRemHP > 0) {
        bLifeStealDistM = calcLifeStealDmgDist(bAlive, a.res, bLifeStealModM, aRemHP);
      }

      if (hasFirstStrike) {
        // A's melee resolves first; B's counter-attack uses survivors after A's damage.
        const totalDmgToA = new Array(aRemHP + 1).fill(0);
        const counterOnlyToA = new Array(aRemHP + 1).fill(0);
        for (let mDmg = 0; mDmg < dmgToB.length; mDmg++) {
          const pM = dmgToB[mDmg];
          if (pM < 1e-15) continue;
          const bDmgAfter = b.dmg + mDmg;
          const bAliveAfter = Math.max(0, b.figs - Math.floor(bDmgAfter / b.hp));
          const bUnfearedFS3 = bFearedByA ? calcFearDist(bAliveAfter, bPFear) : null;
          const counterDist = calcMeleeTouchDmg(bUnfearedFS3, bAliveAfter, bDoom, b.atk, b.toHitMelee,
            aDefVsB, a.toBlock, a.hp, aRemHP,
            bPoisonStr, bPoisonFail, bStoningFail, bLifeStealModM, a.res);
          for (let cDmg = 0; cDmg < counterDist.length; cDmg++) {
            if (counterDist[cDmg] < 1e-15) continue;
            const v = pM * counterDist[cDmg];
            totalDmgToA[Math.min(cDmg, aRemHP)] += v;
            counterOnlyToA[Math.min(cDmg, aRemHP)] += v;
          }
        }

        let firstStrikeLabel = 'First Strike';
        if (aFearedByB || aFearBug) firstStrikeLabel += ' + Fear';
        if (aPoisonFail > 0) firstStrikeLabel += ' + Poison Touch';
        if (aStoningFail > 0) firstStrikeLabel += ' + Stoning Touch';
        if (aLifeStealModM !== null) firstStrikeLabel += ' + Life Steal';
        let counterLabel = 'Counter-attack';
        if (bFearedByA) counterLabel += ' + Fear';
        if (bPoisonFail > 0) counterLabel += ' + Poison Touch';
        if (bStoningFail > 0) counterLabel += ' + Stoning Touch';
        if (bLifeStealModM !== null) counterLabel += ' + Life Steal';

        const fearPhaseFS3 = fearPhaseDists3
          ? [{ label: 'Cause Fear', mode: 'feared', atkDist: fearPhaseDists3.atkFearedDist, defDist: fearPhaseDists3.defFearedDist }]
          : [];
        return {
          phases: [
            ...fearPhaseFS3,
            { label: firstStrikeLabel,
              atkDist: [1], atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
              defDist: dmgToB, defHP: bRemHP, defHPper: b.hp, defFigs: bAlive },
            { label: counterLabel,
              atkDist: counterOnlyToA, atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
              defDist: [1], defHP: bRemHP, defHPper: b.hp, defFigs: bAlive },
          ],
          totalDmgToA,
          totalDmgToB: dmgToB,
          aLifeStealDist: aLifeStealDistM,
          bLifeStealDist: bLifeStealDistM,
          aRemHP, aHP: a.hp, aAlive,
          bRemHP, bHP: b.hp, bAlive,
        };
      }

      // Simultaneous melee
      const bUnfeared3 = bFearedByA ? calcFearDist(bAlive, bPFear) : null;
      const dmgToA = calcMeleeTouchDmg(bUnfeared3, bAlive, bDoom, b.atk, b.toHitMelee,
        aDefVsB, a.toBlock, a.hp, aRemHP,
        bPoisonStr, bPoisonFail, bStoningFail, bLifeStealModM, a.res);

      let fearPhaseSimul3 = null;
      if (fearPhaseDists3) {
        let meleeLabel3 = 'Melee';
        if (aPoisonFail > 0 || bPoisonFail > 0) meleeLabel3 += ' + Poison Touch';
        if (aStoningFail > 0 || bStoningFail > 0) meleeLabel3 += ' + Stoning Touch';
        if (aLifeStealModM !== null || bLifeStealModM !== null) meleeLabel3 += ' + Life Steal';
        meleeLabel3 += ' + Counter-attack';
        fearPhaseSimul3 = [
          { label: 'Cause Fear', mode: 'feared', atkDist: fearPhaseDists3.atkFearedDist, defDist: fearPhaseDists3.defFearedDist },
          { label: meleeLabel3,
            atkDist: dmgToA, atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
            defDist: dmgToB, defHP: bRemHP, defHPper: b.hp, defFigs: bAlive },
        ];
      }
      return {
        phases: fearPhaseSimul3,
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
