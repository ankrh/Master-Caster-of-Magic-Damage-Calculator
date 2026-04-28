// --- Combat Resolution ---
// Pure functions with no DOM dependencies. Depends on engine.js.

// Clamp a percentage to 10%-100% (MoM rules: always at least 10%, at most 100%)
function clampPct(base, mod) {
  return Math.min(1.0, Math.max(0.1, (base + mod) / 100));
}

// CoM2: remaining HP of the wounded top figure in a stack.
// If remHP is an exact multiple of hpPerFig, all figures are at full HP → return hpPerFig.
function woundedTopFigHP(remHP, hpPerFig) {
  return remHP % hpPerFig || hpPerFig;
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

function supremeLightActiveForUnit(abilities, unitType, version) {
  const isCoMPlus = version && (version.startsWith('com_') || version.startsWith('com2_'));
  if (!isCoMPlus || !abilities || !abilities.supremeLight) return false;
  return unitType === 'fantastic_life' || !!abilities.caster;
}

function survivalInstinctActiveForUnit(abilities, unitType, version) {
  const isCoMPlus = version && (version.startsWith('com_') || version.startsWith('com2_'));
  if (!isCoMPlus || !abilities || !abilities.survivalInstinct) return false;
  return !!unitType && unitType.startsWith('fantastic_');
}

function innerPowerActiveForUnit(abilities, version) {
  if (!version || !version.startsWith('com2_') || !abilities || !abilities.innerPower) return false;
  return !!abilities.fireImmunity || !!abilities.lightningResist;
}

function blazingEyesDoomGazeForUnit(abilities, unitType, version) {
  const baseDoomGaze = ((abilities && abilities.doomGaze) || 0);
  if (!version || !version.startsWith('com2_') || !abilities || !abilities.blazingEyes) return baseDoomGaze;
  if (unitType !== 'fantastic_chaos') return baseDoomGaze;
  return baseDoomGaze > 0 ? baseDoomGaze + 1 : 3;
}

function misleadActiveForUnit(abilities, unitType, version) {
  if (!version || !version.startsWith('com2_') || !abilities || !abilities.mislead) return false;
  return unitType === 'normal' || unitType === 'hero';
}

function destinyActiveForUnit(abilities, version) {
  return !!(version && version.startsWith('com2_') && abilities && abilities.destiny);
}

function determineEffectiveUnitType(baseUnitType, abilities, version) {
  let unitType = baseUnitType || 'normal';
  const ccVal = (abilities && abilities.chaosChannels) || 'none';
  const isCoMPlus = version && (version.startsWith('com_') || version.startsWith('com2_'));
  const destinyActive = destinyActiveForUnit(abilities, version);

  // Reported CoM2 combat recalculation order: last applicable type rewrite wins.
  if (ccVal === 'fireBreath') unitType = 'fantastic_chaos';
  if (destinyActive) unitType = 'fantastic_life';
  if (ccVal === 'flight') unitType = 'fantastic_chaos';
  if (ccVal === 'defense') unitType = 'fantastic_chaos';
  if (abilities && abilities.bloodLust) unitType = 'fantastic_death';
  if (abilities && abilities.blackChannels) unitType = 'fantastic_death';
  if (abilities && (abilities.undead || abilities.animated)) unitType = 'fantastic_death';
  if (abilities && abilities.mysticSurge) unitType = 'fantastic_unaligned';
  if (isCoMPlus && abilities && abilities.raiseDead) unitType = 'fantastic_unaligned';

  return unitType;
}

function supernaturalMinDamageForHits(hits, version) {
  if (hits <= 0 || !version) return 0;
  if (version.startsWith('com2_')) {
    return Math.round(hits / 3);
  }
  if (version.startsWith('com_')) {
    return Math.max(0, Math.floor((hits - 5) / 2));
  }
  return 0;
}

function supernaturalMinDamageFn(abilities, version) {
  const hasSupernatural = !!(abilities && abilities.supernatural);
  const destinyActive = destinyActiveForUnit(abilities, version);
  if (!hasSupernatural && !destinyActive) return null;
  return hits => supernaturalMinDamageForHits(hits, version);
}

// Compute ranged distance penalty for missile/boulder attacks.
// Returns a negative percentage modifier or 0.
// MoM: tiered at 3/6/9 tiles (-10/-20/-30%).
// CoM: tiered at 4/8/12 tiles (-10/-20/-30%).
// CoM2: -10% at 4 tiles, then -3% per additional tile.
// Long Range caps the penalty at -10% in all versions.
function distancePenalty(distance, rangedType, longRange, version) {
  if (rangedType !== 'missile' && rangedType !== 'boulder') return 0;
  let penalty = 0;
  if (version && version.startsWith('com2')) {
    if (distance >= 4) penalty = -10 - 3 * (distance - 4);
  } else if (version && version.startsWith('com')) {
    if (distance >= 12) penalty = -30;
    else if (distance >= 8) penalty = -20;
    else if (distance >= 4) penalty = -10;
  } else {
    if (distance >= 9) penalty = -30;
    else if (distance >= 6) penalty = -20;
    else if (distance >= 3) penalty = -10;
  }
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
  const isCoMPlus = version && (version.startsWith('com_') || version.startsWith('com2_'));

  // Holy Bonus: +X to melee attack, defense, resistance.
  // CoM v6.05+ and CoM2: also +X to ranged/thrown/breath attack.
  const hb = (abilities && abilities.holyBonus) || 0;
  if (hb > 0) {
    atkMod += hb;
    defMod += hb;
    resMod += hb;
    if (isCoMPlus) {
      rtbMod += hb;
    }
  }

  // Animate Dead's Animated buff in CoM/CoM2: +1 attack, +1 defense, +10% To Hit,
  // weapon immunity. A later CoM2 fix notes the +1 should also apply to thrown/breath.
  // Weapon Immunity is added in combat flow; the stat bonuses are applied here.
  if (abilities && abilities.animated && isCoMPlus) {
    atkMod += 1;
    defMod += 1;
    toHitMod += 10;
    rtbMod += 1;
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

  // Prayer / High Prayer: combat enchantments (not cumulative — High Prayer supersedes Prayer).
  // Prayer: +10% To Hit (all attacks except immolation/spells), +10% To Block, +1 Resistance.
  // High Prayer: +2 Melee Atk, +2 Defense, +3 Resistance, +10% To Hit, +10% To Block.
  // The v1.31 enemy melee To Hit malus (-10%) is applied in resolveCombat.
  const prayerVal = (abilities && abilities.prayer) || 'none';
  if (prayerVal === 'highPrayer') {
    atkMod += 2;
    defMod += 2;
    resMod += 3;
    toHitMod += 10;
    toBlkMod += 10;
  } else if (prayerVal === 'prayer') {
    resMod += 1;
    toHitMod += 10;
    toBlkMod += 10;
  }

  // Black Prayer (debuff): -1 all conventional attack strengths, -1 Defense, -2 Resistance.
  if (abilities && abilities.blackPrayer) {
    atkMod -= 1;
    rtbMod -= 1;
    defMod -= 1;
    resMod -= 2;
  }

  // Reinforce Magic: CoM2 global enchantment. All units gain +2 resistance.
  // The +2 magical ranged attack strength bonus is type-conditional and handled in ui.js.
  if (abilities && abilities.reinforceMagic && version && version.startsWith('com2_')) {
    resMod += 2;
  }

  // Inner Power: CoM2 global enchantment. Units with Fire Immunity or Lightning Resist
  // gain +3 to all attack strengths, +2 defense, and +2 resistance. Eligibility is
  // resolved in ui.js so the checkbox can remain visible without affecting other units.
  if (abilities && abilities.innerPower) {
    atkMod += 3;
    rtbMod += 3;
    defMod += 2;
    resMod += 2;
  }

  // Mislead applies Misfortune in CoM2. The checkbox represents the current unit being
  // affected by Misfortune; normal units and heroes are eligible, and that gating is handled in ui.js.
  // The -1 ranged-attack penalty applies only to ranged attacks (not thrown or breath) per the
  // source helptext, so it is applied conditionally in ui.js as misleadRtbMod.
  if (abilities && abilities.mislead) {
    atkMod -= 1;
    defMod -= 1;
    resMod -= 1;
  }

  // Stone Skin / Iron Skin: +1 / +5 Defense. Iron Skin supersedes Stone Skin.
  if (abilities && abilities.ironSkin) {
    defMod += 5;
  } else if (abilities && abilities.stoneSkin) {
    defMod += 1;
  }

  // Holy Armor: handled in ui.js (version- and stat-conditional).

  // Lionheart: +3 Melee Attack (only if base > 0 — guarded in ui.js), +3 Resistance.
  // RTB bonus (non-magic ranged/thrown only) and HP bonus (version/figs-dependent) in ui.js.
  if (abilities && abilities.lionheart) {
    atkMod += 3;
    resMod += 3;
  }

  // Metal Fires / Flame Blade: +1 / +2 melee attack. Flame Blade supersedes Metal Fires.
  // Missile/thrown bonus and weapon upgrade are handled in ui.js (type-conditional).
  if (abilities && abilities.flameBlade) {
    atkMod += 2;
  } else if (abilities && abilities.metalFires) {
    atkMod += 1;
  }

  // Blazing March: CoM/CoM2 combat enchantment. +3 melee attack to all units.
  // Missile/fire/lightning breath bonus is handled in ui.js (type-conditional).
  if (abilities && abilities.blazingMarch) {
    atkMod += 3;
  }

  // Breakthrough: CoM2 combat enchantment resolved via the UI selector.
  // '+1melee' grants +1 melee attack.
  // '+1melee/+1def' grants +1 melee attack and +1 defense.
  const breakthroughVal = version && version.startsWith('com2')
    ? ((abilities && abilities.breakthrough) || 'none')
    : 'none';
  if (breakthroughVal === 'melee' || breakthroughVal === 'meleeDef') {
    atkMod += 1;
  }
  if (breakthroughVal === 'meleeDef') {
    defMod += 1;
  }

  // Giant Strength: +1 melee attack. +1 thrown bonus handled in ui.js (thrown only, not missile).
  if (abilities && abilities.giantStrength) {
    atkMod += 1;
  }

  // Chaos Channels (Demon-Skin Armor): +6 Defense in MoM 1.31 (bug: applied twice in combat),
  // +3 Defense in MoM 1.40+/CP 1.60/CoM/CoM2 (Insecticide fix).
  // Fire Breath option is handled in ui.js (modifies thrownType/rtb).
  const ccVal = (abilities && abilities.chaosChannels) || 'none';
  if (ccVal === 'defense') {
    defMod += (version === 'mom_1.31') ? 6 : 3;
  }

  // Black Channels: +2 melee attack (gated on baseAtk > 0 in ui.js), +1 all ranged/thrown/breath/gaze,
  // +1 defense, +1 resistance, +1 HP per figure. Death realm; MoM only.
  if (abilities && abilities.blackChannels) {
    atkMod += 2;
    rtbMod += 1;
    defMod += 1;
    resMod += 1;
    hpMod += 1;
  }

  // Weakness: -2 (MoM) or -3 (CoM/CoM2) melee attack. RTB penalty is type-specific, applied in ui.js.
  if (abilities && abilities.weakness) {
    const isCoM = version && version.startsWith('com');
    atkMod -= isCoM ? 3 : 2;
  }

  // Mind Storm: MoM: -5 melee, -5 all ranged/thrown/breath, -5 defense, -5 resistance.
  // CoM2: -3 melee, -5 all ranged/thrown, -5 defense, -5 resistance.
  if (abilities && abilities.mindStorm) {
    const isCoM = version && version.startsWith('com');
    atkMod -= isCoM ? 3 : 5;
    rtbMod -= 5;
    defMod -= 5;
    resMod -= 5;
  }

  // Supreme Light: CoM/CoM2 combat enchantment. Applies only to Life creatures and
  // Caster units; the defense-from-resistance component is handled in ui.js because
  // it depends on the effective resistance after other modifiers are applied.
  // The +2 ranged-attack bonus is type-conditional (ranged only — not thrown/breath)
  // and handled in ui.js.
  if (abilities && abilities.supremeLight) {
    atkMod += 2;
  }

  // Survival Instinct: CoM/CoM2 global enchantment. Applies only to fantastic creatures;
  // eligibility is resolved in ui.js using the effective combat unit type.
  if (abilities && abilities.survivalInstinct) {
    defMod += 1;
    resMod += 2;
    toHitMod += 10;
  }

  // Mystic Surge: +2 Defense, -2 Resistance. The unaligned-fantastic conversion and
  // -10% To Block are applied in ui.js / resolveCombat.
  if (abilities && abilities.mysticSurge) {
    defMod += 2;
    resMod -= 2;
  }

  return { atkMod, defMod, resMod, hpMod, toHitMod, toBlkMod, rtbMod };
}

// --- Poison Touch ---
// Compute probability of failing a single poison resistance roll.
// MoM: d10, success if roll ≤ Resistance. pFail = max(0, (10 - res) / 10).
// CoM2: universal -1 save modifier → pFail = max(0, (11 - res) / 10).
// Returns 0 if target is immune (Poison Immunity grants +50/+100 resistance, effective resistance ≥ 10).
// Magic Immunity does NOT protect from Poison — it is not a magical effect.
function poisonFailProb(defRes, defAbilities, version) {
  const isCoM = version && version.startsWith('com');
  const immuneBonus = (defAbilities && defAbilities.poisonImmunity) ? (isCoM ? 100 : 50) : 0;
  const penalty = isCoM ? 1 : 0;
  const effectiveRes = defRes - penalty + immuneBonus;
  if (effectiveRes >= 10) return 0;
  return Math.max(0, (10 - effectiveRes) / 10);
}

// --- Stoning Touch ---
// Compute probability of failing a stoning resistance roll.
// MoM: d10, success if roll ≤ (Resistance + modifier). The stoningTouch value is negative
// (e.g. -3 means a -3 penalty to the target's resistance roll).
// Returns 0 if target is immune (Stoning/Magic Immunity grants +50/+100 resistance, effective resistance ≥ 10).
function stoningFailProb(defRes, defAbilities, modifier, version) {
  const isCoM = version && version.startsWith('com');
  const immuneBonus = (defAbilities && (defAbilities.stoningImmunity || defAbilities.magicImmunity)) ? (isCoM ? 100 : 50) : 0;
  const effectiveRes = defRes + modifier + immuneBonus;
  if (effectiveRes >= 10) return 0;
  return Math.max(0, (10 - effectiveRes) / 10);
}

// --- Dispel Evil ---
// Touch attack that kills one figure per attacking figure on a failed resist roll.
// Only affects: fantastic_death (including undead/animated units, penalty -9),
// fantastic_chaos (penalty -4). Other unit types are immune.
// Magic Immunity grants +50/+100 resistance. Other unit types are completely immune.
function dispelEvilFailProb(defRes, defAbilities, defUnitType, version) {
  let penalty;
  const isUndeadTarget = defUnitType === 'fantastic_death' && !!(defAbilities && (defAbilities.undead || defAbilities.animated));
  if (isUndeadTarget) {
    penalty = 9;
  } else if (defUnitType === 'fantastic_death' || defUnitType === 'fantastic_chaos') {
    penalty = 4;
  } else {
    return 0;
  }
  const isCoM = version && version.startsWith('com');
  const immuneBonus = (defAbilities && defAbilities.magicImmunity) ? (isCoM ? 100 : 50) : 0;
  const effectiveRes = defRes - penalty + immuneBonus;
  if (effectiveRes >= 10) return 0;
  return Math.min(1, Math.max(0, (10 - effectiveRes) / 10));
}

// --- Death Gaze ---
// Same roll mechanics as Stoning Gaze. Death/Magic Immunity grants +50/+100 resistance.
// Righteousness grants +30 resistance (always pushes effective Res ≥ 10).
function deathGazeFailProb(defRes, defAbilities, modifier, version) {
  const isCoM = version && version.startsWith('com');
  let bonus = 0;
  if (defAbilities) {
    if (defAbilities.deathImmunity || defAbilities.magicImmunity) bonus = isCoM ? 100 : 50;
    else if (defAbilities.righteousness) bonus = 30;
  }
  const effectiveRes = defRes + modifier + bonus;
  if (effectiveRes >= 10) return 0;
  return Math.max(0, (10 - effectiveRes) / 10);
}

// Build the combined gaze damage distribution delivered by `atk` against `def`.
// Includes (at most once) the hidden physical ranged component, followed by
// doom gaze (exact damage), stoning-kill rolls and death-kill rolls.
// Blur applies only to the hidden physical ranged component, not doom gaze.
function buildGazeDist(atk, def, defAlive, defRemHP, stoningFail, deathFail, doomStr, defDefStat, defInvulnBonus, blurChance, blurBuggy, defTopFigHP, conventionalAsDoom = false, defToBlockOverride = null, minDamageFromHits = null) {
  if (defAlive <= 0 || defRemHP <= 0) return [1];
  let dist = [1];
  const defStat = (defDefStat != null) ? defDefStat : def.def;
  const defToBlock = (defToBlockOverride != null) ? defToBlockOverride : def.toBlock;
  if (atk.effectiveGazeRanged > 0) {
    dist = conventionalAsDoom
      ? calcDoomDist(1, atk.effectiveGazeRanged, defRemHP)
      : calcTotalDamageDist(1, atk.effectiveGazeRanged, atk.toHitRtb, defStat, defToBlock, def.hp, defRemHP, defInvulnBonus, blurChance, blurBuggy, defTopFigHP, minDamageFromHits);
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
// Returns null if immune (Death/Magic Immunity +50/+100 res, or Righteousness +30 res, or effective Res ≥ 10).
// The lifeSteal value is the resistance penalty (e.g. -3 means target's res is penalized by 3).
function lifeStealEffective(defRes, defAbilities, modifier, version) {
  const isCoM = version && version.startsWith('com');
  let bonus = 0;
  if (defAbilities) {
    if (defAbilities.deathImmunity || defAbilities.magicImmunity) bonus = isCoM ? 100 : 50;
    else if (defAbilities.righteousness) bonus = 30;
  }
  const effRes = defRes + modifier + bonus;
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

function hasWeaponImmunityEffect(abilities) {
  return !!(abilities && (abilities.weaponImmunity || abilities.invulnerability || abilities.wraithForm || abilities.rulerOfUnderworld));
}

// --- Weapon Immunity ---
// Applies Weapon Immunity defense boost after armor piercing.
// MoM: defense raised to minimum 10.  CoM/CoM2: +8 defense.
// Triggers only against Normal units with normal (non-magical) weapons.
// Phase applicability varies by version:
//   Melee: always applies.
//   Thrown: applies in all versions EXCEPT v1.31 (bug: thrown ignores WI).
//   Ranged missile/boulder: always applies (all versions).
//   Magic ranged: never (already magical).
// v1.31 bug: Generic units (Trireme, Galley, Warship, Catapult) bypass WI regardless of attack type.
function weaponImmunityDef(baseDef, defAbilities, atkWeapon, atkUnitType, version, atkGeneric) {
  if (!hasWeaponImmunityEffect(defAbilities)) return baseDef;
  // Ruler of Underworld preserves Weapon Immunity against magical/mithril/adamantium
  // weapons, but still only against normal-unit attacks.
  const weaponBypasses = atkWeapon !== 'normal' && !(defAbilities && defAbilities.rulerOfUnderworld);
  if (weaponBypasses) return baseDef;
  if (atkUnitType !== 'normal') return baseDef;
  if (version === 'mom_1.31' && atkGeneric) return baseDef;
  if (version && version.startsWith('com')) {
    return baseDef + 8;
  }
  return Math.max(baseDef, 10);
}

// --- Missile Immunity ---
// Applies Missile Immunity defense boost. Only triggers against Ranged Missile Attacks.
// MoM: defense set to 50. CoM/CoM2: defense set to 100. Applied after armor piercing and weapon immunity.
function missileImmunityDef(baseDef, defAbilities, version) {
  if (!defAbilities || !defAbilities.missileImmunity) return baseDef;
  return (version && version.startsWith('com')) ? 100 : 50;
}

// --- Fire Immunity ---
// Raises defense against Fire Breath and Immolation damage. MoM: 50. CoM/CoM2: 100.
// Applied after armor piercing and weapon immunity.
function fireImmunityDef(baseDef, defAbilities, version) {
  if (!defAbilities || !defAbilities.fireImmunity) return baseDef;
  return (version && version.startsWith('com')) ? 100 : 50;
}

// --- Righteousness ---
// Life-realm unit enchantment. Protects against Chaos/Death magic.
// In combat, applies:
//   Defense 50 (MoM) / 100 (CoM/CoM2) vs Chaos-realm Ranged Magical Attack (magic_c), Fire Breath, Lightning Breath
//   Defense 50/100 vs Immolation and Wall of Fire (via magicImmunityDef chain)
//   +30 Resistance vs Cause Fear, Life Steal, Death Gaze (always pushes effective Res ≥ 10).
function righteousnessDef(baseDef, defAbilities, version) {
  if (!defAbilities || !defAbilities.righteousness) return baseDef;
  return (version && version.startsWith('com')) ? 100 : 50;
}

// --- Magic Immunity (defense) ---
// Raises defense against magic ranged attacks, Immolation, and Wall of Fire.
// MoM: defense set to 50. CoM/CoM2: defense set to 100.
// Applied after other defense modifiers; overrides Fire Immunity and Righteousness if higher.
function magicImmunityDef(baseDef, defAbilities, version) {
  if (!defAbilities || !defAbilities.magicImmunity) return baseDef;
  return (version && version.startsWith('com')) ? 100 : 50;
}

// --- Immolation ---
// Immolation strength: 4 in MoM, 10 in CoM/CoM2.
function immolationStr(version) {
  if (version && (version.startsWith('com_') || version.startsWith('com2_'))) return 10;
  return 4;
}

// After 1.50 patch (and CoM/CoM2), immolation no longer accompanies ranged attacks.
// Thrown, breath, gaze, and melee still fire in all versions.
function immolationBlocksRanged(version) {
  return version !== 'mom_1.31';
}

// --- Wall of Fire ---
// Wall of Fire: town enchantment. Inflicts a Ranged Magical Immolation Damage
// attack on every attacker figure that melees a unit inside the town.
// Strength 5 in MoM; strength 10 in CoM/CoM2.
// Fires once per combat, at Step 3 in the melee sequence: AFTER thrown/breath
// and gaze phases, BEFORE the melee damage + counter-attack.
// Targets only the attacker (A) - the unit passing through the wall.
// Does not fire in ranged combat (attacker shoots from outside the wall).
// Magic Immunity raises defense to 50 (MoM) / 100 (CoM/CoM2). Fire Immunity and
// Righteousness also raise defense to 50/100. Large Shield and AP apply.
function wallOfFireStr(version) {
  if (version && (version.startsWith('com_') || version.startsWith('com2_'))) return 10;
  return 5;
}

// --- Cause Fear ---
// Probability of a single figure failing its fear resistance roll.
// Fear has no resistance modifier (0). Death/Magic Immunity grants +50/+100 resistance.
// Righteousness grants +30 resistance (always pushes effective Res ≥ 10).
function fearFailProb(defRes, defAbilities, version) {
  const isCoM = version && version.startsWith('com');
  let bonus = 0;
  if (defAbilities) {
    if (defAbilities.deathImmunity || defAbilities.magicImmunity) bonus = isCoM ? 100 : 50;
    else if (defAbilities.righteousness) bonus = 30;
  }
  const effectiveRes = Math.max(defRes, 0) + bonus;
  if (effectiveRes >= 10) return 0;
  return (10 - effectiveRes) / 10;
}

// Marginal fear display distribution when survivor count is uncertain.
// survivorDist[k] = P(k figures alive when fear fires); returns dist[j] = P(j figures feared).
function marginalFearDistFromSurvivors(survivorDist, pFear) {
  const maxFigs = survivorDist.length - 1;
  const result = new Array(maxFigs + 1).fill(0);
  for (let k = 0; k <= maxFigs; k++) {
    const pK = survivorDist[k];
    if (pK < 1e-15) continue;
    if (k === 0 || pFear <= 0) { result[0] += pK; continue; }
    if (pFear >= 1) { result[k] += pK; continue; }
    const bd = binomialPMF(k, pFear);
    for (let j = 0; j < bd.length; j++) result[j] += pK * bd[j];
  }
  return result;
}

// P(total damage in dist >= remHP), i.e. P(unit stack completely destroyed).
function pDestroyedFrom(dist, remHP) {
  let p = 0;
  for (let d = remHP; d < dist.length; d++) p += dist[d] || 0;
  return p;
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
// blurChance/blurBuggy: Blur pre-defense hit negation (0 = no blur; not applied to doom attacks).
function calcMeleeTouchDmg(fearDist, maxFigs, isDoom, atk, toHit,
                            def, toBlock, targetHP, remHP,
                            poisonStr, poisonFail,
                            stoningFail,
                            dispelEvilFail,
                            lifeStealMod, lifeStealRes,
                            immolationDist, defInvulnBonus,
                            blurChance, blurBuggy,
                            doubleStrike, defTopFigHP,
                            minDamageFromHits) {
  return calcMeleeTouchOutcome(
    fearDist, maxFigs, isDoom, atk, toHit,
    def, toBlock, targetHP, remHP,
    poisonStr, poisonFail,
    stoningFail,
    dispelEvilFail,
    lifeStealMod, lifeStealRes,
    immolationDist, defInvulnBonus,
    blurChance, blurBuggy,
    doubleStrike, defTopFigHP,
    minDamageFromHits
  ).damageDist;
}

function calcMeleeTouchOutcome(fearDist, maxFigs, isDoom, atk, toHit,
                               def, toBlock, targetHP, remHP,
                               poisonStr, poisonFail,
                               stoningFail,
                               dispelEvilFail,
                               lifeStealMod, lifeStealRes,
                               immolationDist, defInvulnBonus,
                               blurChance, blurBuggy,
                               doubleStrike, defTopFigHP,
                               minDamageFromHits) {
  if (remHP <= 0 || maxFigs <= 0) return { damageDist: [1], lifeStealEV: 0 };
  const result = new Array(remHP + 1).fill(0);
  let lifeStealEV = 0;
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
      dist = calcTotalDamageDist(k, atk, toHit, def, toBlock, targetHP, remHP, defInvulnBonus, blurChance, blurBuggy, defTopFigHP, minDamageFromHits);
    }
    if (poisonStr > 0 && poisonFail > 0 && k > 0) {
      dist = convolveDists(dist, calcResistDmgDist(k * poisonStr, poisonFail, remHP), remHP);
    }
    if (stoningFail > 0 && k > 0) {
      dist = convolveDists(dist, calcFigureKillDmgDist(k, stoningFail, targetHP, remHP), remHP);
    }
    if (dispelEvilFail > 0 && k > 0) {
      dist = convolveDists(dist, calcFigureKillDmgDist(k, dispelEvilFail, targetHP, remHP), remHP);
    }
    if (lifeStealMod !== null && k > 0) {
      const lsDist = calcLifeStealDmgDist(k, lifeStealRes, lifeStealMod, remHP);
      dist = convolveDists(dist, lsDist, remHP);
      lifeStealEV += pK * expectedDamage(lsDist);
    }
    if (immolationDist && k > 0) {
      dist = convolveDists(dist, immolationDist, remHP);
    }
    if (doubleStrike && k > 0 && atk > 0) {
      dist = convolveDists(dist, dist, remHP);
      if (lifeStealMod !== null) lifeStealEV += pK * expectedDamage(calcLifeStealDmgDist(k, lifeStealRes, lifeStealMod, remHP));
    }
    for (let d = 0; d < dist.length; d++) result[d] += pK * dist[d];
  }
  return { damageDist: result, lifeStealEV };
}

function repeatDist(dist, times, cap) {
  if (!dist || times <= 0) return null;
  let result = [1];
  for (let i = 0; i < times; i++) {
    result = convolveDists(result, dist, cap);
  }
  return result;
}

function expectedDamage(dist) {
  if (!dist) return 0;
  let ev = 0;
  for (let d = 0; d < dist.length; d++) ev += d * dist[d];
  return ev;
}

// Build feared-count display distributions for the phase breakdown.
// Returns { atkFearedDist, defFearedDist } or null if no fear is active.
// defSurvivorDist / atkSurvivorDist: optional marginal distributions over how many figures
// survive to the fear check (accounts for prior-phase casualties from gaze/thrown/WoF).
// When provided, the fear distribution is correctly marginalised; otherwise initial counts are used.
function buildFearPhaseDists(aFigs, bFigs, bPFear, aPFear, aFearedByB, aFearBug, bFearedByA, showNoop = false,
                              defSurvivorDist = null, atkSurvivorDist = null) {
  if (!aFearedByB && !aFearBug && !bFearedByA) return showNoop ? { atkFearedDist: [1], defFearedDist: [1] } : null;
  // B's feared dist (from A's fear)
  const defFearedDist = bFearedByA && bFigs > 0
    ? (defSurvivorDist ? marginalFearDistFromSurvivors(defSurvivorDist, bPFear) : binomialPMF(bFigs, bPFear))
    : [1];
  // A's feared dist (from B's fear or v1.31 self-fear bug)
  let atkFearedDist;
  if (aFearedByB && aFigs > 0) {
    atkFearedDist = atkSurvivorDist
      ? marginalFearDistFromSurvivors(atkSurvivorDist, aPFear)
      : binomialPMF(aFigs, aPFear);
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

// --- Blur ---
// Returns effective Blur chance (0–1) for attacks against a unit.
// defAbilities: defender's abilities; atkAbilities: attacker's abilities.
// CoM/CoM2: Blur rate 20%, Invisibility also grants 20%; combined cap is 30%.
// MoM: Blur rate 10%.
// v1.31 bug: Illusion Immunity checked on defender instead of attacker.
// Fixed (1.51+/CoM/CoM2): Illusion Immunity checked on attacker.
function getBlurChance(defAbilities, atkAbilities, version) {
  const isCoM = version && version.startsWith('com');
  const hasBlur = !!(defAbilities && defAbilities.blur);
  const hasInvis = !!(defAbilities && defAbilities.invisibility);
  const invisGivesBlur = isCoM;
  const blurRate = isCoM ? 0.2 : 0.1;

  let blurChance = 0;
  if (hasBlur && invisGivesBlur && hasInvis) {
    blurChance = 0.3;
  } else if (hasBlur) {
    blurChance = blurRate;
  } else if (invisGivesBlur && hasInvis) {
    blurChance = blurRate;
  }
  if (!blurChance) return 0;

  if (version === 'mom_1.31') {
    if (defAbilities && defAbilities.illusionImmunity) return 0;
  } else {
    if (atkAbilities && atkAbilities.illusionImmunity) return 0;
  }
  return blurChance;
}

// Apply immunities granted by the Undead / Animate Dead state.
// v1.31 bug: only Death Immunity actually applies; Cold/Poison/Illusions Immunity are missing.
// Fixed in v1.51 (all four apply). All our non-1.31 versions are v1.51+.
function applyUndeadImmunities(unit, version) {
  if (!unit.abilities || !(unit.abilities.undead || unit.abilities.animated)) return unit;
  const extra = { deathImmunity: true };
  if (version !== 'mom_1.31') {
    extra.poisonImmunity = true;
    extra.illusionImmunity = true;
    extra.coldImmunity = true;
  }
  return Object.assign({}, unit, {
    abilities: Object.assign({}, unit.abilities, extra),
  });
}

function applyAnimatedEffects(unit, version) {
  if (!unit.abilities || !unit.abilities.animated) return unit;
  const isCoMPlus = version !== 'mom_1.31' && version !== 'mom_1.60';
  if (!isCoMPlus) return unit;
  return Object.assign({}, unit, {
    abilities: Object.assign({}, unit.abilities, { weaponImmunity: true }),
  });
}

// Apply immunities from Black Channels.
// Grants Cold, Illusion, Poison, Death immunities in all versions (BC explicitly grants all four,
// unlike the Undead attribute which only grants Death Immunity in v1.31).
function applyBlackChannelsEffects(unit) {
  if (!unit.abilities || !unit.abilities.blackChannels) return unit;
  const extra = {
    coldImmunity: true,
    illusionImmunity: true,
    poisonImmunity: true,
    deathImmunity: true,
  };
  return Object.assign({}, unit, {
    abilities: Object.assign({}, unit.abilities, extra),
  });
}

// Blood Lust grants the undead state; final unit type is resolved by determineEffectiveUnitType().
function applyBloodLustEffects(unit) {
  if (!unit.abilities || !unit.abilities.bloodLust) return unit;
  return Object.assign({}, unit, {
    abilities: Object.assign({}, unit.abilities, { undead: true }),
  });
}

function bloodLustMeleeAttack(atkUnit, defUnit) {
  const targetIsNormal = defUnit && (defUnit.unitType === 'normal' || defUnit.unitType === 'hero');
  if (!targetIsNormal || !atkUnit.abilities || !atkUnit.abilities.bloodLust) return atkUnit.atk;
  return atkUnit.atk * 2;
}

// --- Combat Flow Modifiers ---
// Abilities that change *how* combat resolves rather than just stat values.
// These are checked during resolveCombat to alter phase ordering, defense
// effectiveness, damage types, etc.
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
  const ver = opts.version;

  a = applyBloodLustEffects(a);
  b = applyBloodLustEffects(b);
  a = applyUndeadImmunities(a, ver);
  b = applyUndeadImmunities(b, ver);
  a = applyAnimatedEffects(a, ver);
  b = applyAnimatedEffects(b, ver);
  a = applyBlackChannelsEffects(a);
  b = applyBlackChannelsEffects(b);
  a = Object.assign({}, a, { unitType: determineEffectiveUnitType(a.unitType, a.abilities, ver) });
  b = Object.assign({}, b, { unitType: determineEffectiveUnitType(b.unitType, b.abilities, ver) });
  const aMeleeAtkVsB = bloodLustMeleeAttack(a, b);
  const bMeleeAtkVsA = bloodLustMeleeAttack(b, a);
  const aMinDamageFromHits = supernaturalMinDamageFn(a.abilities, ver);
  const bMinDamageFromHits = supernaturalMinDamageFn(b.abilities, ver);

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

  // Prayer / High Prayer v1.31: enemy melee To Hit malus (-10%).
  // Removed in Insecticide patch (v1.40n+). Only affects melee attacks.
  if (opts.version === 'mom_1.31') {
    const aPrayer = a.abilities && a.abilities.prayer;
    const bPrayer = b.abilities && b.abilities.prayer;
    if (aPrayer === 'prayer' || aPrayer === 'highPrayer') {
      b = Object.assign({}, b, { toHitMelee: Math.max(0.1, b.toHitMelee - 0.1) });
    }
    if (bPrayer === 'prayer' || bPrayer === 'highPrayer') {
      a = Object.assign({}, a, { toHitMelee: Math.max(0.1, a.toHitMelee - 0.1) });
    }
  }

  // Invisibility: in MoM, penalizes attacker's To Hit by -10% on all attacks that make
  // To Hit rolls (melee, ranged, thrown/breath, gaze ranged component), negated by
  // Illusion Immunity. In CoM/CoM2 the to-hit penalty was replaced by a Blur-equivalent
  // (handled in getBlurChance); only the ranged-targeting block remains.
  // In ranged mode, an invisible defender cannot be targeted at all (unless attacker has
  // Illusion Immunity), so all ranged damage is zero.
  const invisIsCoM = ver && ver.startsWith('com');
  const aInvisible = !!(a.abilities && a.abilities.invisibility);
  const bInvisible = !!(b.abilities && b.abilities.invisibility);
  const aCanSeeB = !bInvisible || !!(a.abilities && a.abilities.illusionImmunity);
  const bCanSeeA = !aInvisible || !!(b.abilities && b.abilities.illusionImmunity);
  if (!aCanSeeB && !invisIsCoM) {
    a = Object.assign({}, a, {
      toHitMelee: Math.max(0.1, a.toHitMelee - 0.1),
      toHitRtb:   Math.max(0.1, a.toHitRtb - 0.1),
    });
  }
  if (!bCanSeeA && !invisIsCoM) {
    b = Object.assign({}, b, {
      toHitMelee: Math.max(0.1, b.toHitMelee - 0.1),
      toHitRtb:   Math.max(0.1, b.toHitRtb - 0.1),
    });
  }

  // Vertigo: unit curse that penalizes the affected unit's conventional attacks and defense.
  // MoM:  -20% To Hit and -1 Defense.
  // CoM:  -30% To Hit and -10% To Block (no defense-die penalty).
  // CoM2: -25% To Hit and -7% To Block (no defense-die penalty).
  // Neither Illusion Immunity nor Magic Immunity negates Vertigo — we assume it was cast before those immunities were applied.
  const isCoM = ver && ver.startsWith('com');
  const isCoM2Vert = ver && ver.startsWith('com2');
  const aVertigo = !!(a.abilities && a.abilities.vertigo);
  const bVertigo = !!(b.abilities && b.abilities.vertigo);
  const vertigoHitPenalty = isCoM2Vert ? 0.25 : (isCoM ? 0.3 : 0.2);
  const vertigoBlockPenalty = isCoM2Vert ? 0.07 : (isCoM ? 0.1 : 0);
  const aToHitMeleeVert = aVertigo ? Math.max(0.1, a.toHitMelee - vertigoHitPenalty) : a.toHitMelee;
  const bToHitMeleeVert = bVertigo ? Math.max(0.1, b.toHitMelee - vertigoHitPenalty) : b.toHitMelee;
  const aToHitRtbVert = aVertigo ? Math.max(0.1, a.toHitRtb - vertigoHitPenalty) : a.toHitRtb;
  const bToHitRtbVert = bVertigo ? Math.max(0.1, b.toHitRtb - vertigoHitPenalty) : b.toHitRtb;
  const aVertigoDefPenalty = !isCoM && aVertigo ? 1 : 0;
  const bVertigoDefPenalty = !isCoM && bVertigo ? 1 : 0;
  const aVertigoBlockPenalty = aVertigo ? vertigoBlockPenalty : 0;
  const bVertigoBlockPenalty = bVertigo ? vertigoBlockPenalty : 0;

  // Blur: pre-defense hit negation. Applies to melee, counter, ranged, thrown/breath,
  // and gaze hidden ranged component. Does NOT apply to doom damage or special/spell damage.
  // Rate: 10% (MoM), 20% (CoM/CoM2; Invisibility also grants 20%, combined cap 30%).
  // v1.31 bugs: success skips next roll (max 50%) and illusionImmunity checked on wrong unit.
  const bBlurChance = getBlurChance(b.abilities, a.abilities, ver);
  const aBlurChance = getBlurChance(a.abilities, b.abilities, ver);
  const blurBuggy = ver === 'mom_1.31';

  // First Strike applies when A is voluntarily attacking in melee and B cannot negate it.
  // Ranged attacks never trigger first strike (it only affects melee ordering).
  const hasFirstStrike = !isRanged
    && !!(a.abilities && a.abilities.firstStrike)
    && !(b.abilities && b.abilities.negateFirstStrike);

  // Haste: doubles melee, thrown/breath, and (most) ranged attacks. Gaze, Fear, and
  // Wall of Fire do not double. Counter-attacks double in MoM but not in CoM/CoM2.
  const aHaste = !!(a.abilities && a.abilities.haste);
  const bHaste = !!(b.abilities && b.abilities.haste);
  const isCoMVer = ver && ver.startsWith('com');
  const aCounterHaste = aHaste && !isCoMVer;
  const bCounterHaste = bHaste && !isCoMVer;

  const isCoM2 = opts.version && opts.version.startsWith('com2');
  const isCoM1Only = isCoMVer && !isCoM2;

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
  // Black Sleep: sleeping unit cannot attack; all incoming conventional damage becomes Doom.
  const aBlackSleep = !!(a.abilities && a.abilities.blackSleep);
  const bBlackSleep = !!(b.abilities && b.abilities.blackSleep);
  // A Black Slept attacker cannot initiate combat at all.
  // No ranged volley, gaze exchange, Wall of Fire, melee, or counter-attack occurs.
  if (aBlackSleep) {
    return {
      phases: null,
      totalDmgToA: [1],
      totalDmgToB: [1],
      aLifeStealDist: null,
      bLifeStealDist: null,
      aRemHP, aHP: a.hp, aAlive,
      bRemHP, bHP: b.hp, bAlive,
    };
  }
  const aDoomsB = aDoom || bBlackSleep; // A's conventional attacks against B → Doom
  const bDoomsA = bDoom || aBlackSleep; // B's conventional attacks against A → Doom

  // Invulnerability: reduces incoming damage by 2 per defense roll (applies on every fresh
  // defense roll, including overflow chains and multi-figure area damage). Applies to melee,
  // ranged, thrown, breath, immolation, wall of fire, and the gaze physical ranged component.
  // Does NOT apply to resist-based effects (poison, stoning, life steal, death gaze) or Doom.
  const aInvulnBonus = (a.abilities && a.abilities.invulnerability) ? 2 : 0;
  const bInvulnBonus = (b.abilities && b.abilities.invulnerability) ? 2 : 0;

  // Bless (resistance half): +3 resistance (MoM) or +5 (CoM/CoM2) vs Death-realm resistable
  // effects (Cause Fear, Life Steal, Death Gaze). The defense half is computed further below.
  const bBless = !!(b.abilities && b.abilities.bless);
  const aBless = !!(a.abilities && a.abilities.bless);
  const blessBonus = isCoM ? 5 : 3;
  // Resist Magic: +5 resistance vs all magical/special effects except Poison.
  const bResM = b.res + (b.abilities && b.abilities.resistMagic ? 5 : 0);
  const aResM = a.res + (a.abilities && a.abilities.resistMagic ? 5 : 0);
  const bResDeath = bResM + (bBless ? blessBonus : 0);
  const aResDeath = aResM + (aBless ? blessBonus : 0);

  // Elemental Armor / Resist Elements: defense and resistance bonus vs magical attacks.
  // Not cumulative — higher bonus wins. Bonus amounts and scope are version-sensitive.
  const bElemVal = (b.abilities && b.abilities.elemArmor) || 'none';
  const aElemVal = (a.abilities && a.abilities.elemArmor) || 'none';

  // Cause Fear: reduces opponent's effective melee + touch-attack figures.
  // Fires before the melee exchange. No resistance modifier.
  // v1.31 bugs: (1) defending Fear doesn't work; (2) attacker's Fear also self-fears attacker.
  const aFear = !isRanged && !!(a.abilities && a.abilities.fear);
  const bFear = !isRanged && !!(b.abilities && b.abilities.fear);
  const bPFear = aFear ? fearFailProb(bResDeath, b.abilities, opts.version) : 0; // A's fear on B
  const aPFear = bFear ? fearFailProb(aResDeath, a.abilities, opts.version) : 0; // B's fear on A
  // Phase always shows when either unit has Cause Fear; immunity (Death/Magic Immunity)
  // results in 0 feared figures via the +50/+100 resistance bonus in fearFailProb.
  const bFearedByA = aFear; // A can fear B (all versions; immune B shows phase with 0 feared)
  const aFearedByB = bFear && opts.version !== 'mom_1.31'; // B can fear A (not v1.31: bug #1)
  const aFearBug = aFear && opts.version === 'mom_1.31' && bPFear > 0; // v1.31 self-fear bug #2: bypasses immunity
  // B has Cause Fear but v1.31 bug silences it — still show the phase.
  const showFearNoop = bFear && !aFearedByB;
  // Label for simultaneous (non-FS) fear phases: mutual = "Cause Fear", else directional.
  const hasDefenderFear = aFearedByB || aFearBug || showFearNoop;
  const simultaneousFearLabel = hasDefenderFear && bFearedByA ? 'Cause Fear'
    : bFearedByA ? 'Attacker Cause Fear' : 'Defender Cause Fear';

  // Determine if attacker has thrown/breath (melee only).
  // Requires a melee attack (atk > 0) — a unit that cannot engage in melee cannot throw or breathe.
  // Black Sleep also prevents all outgoing attacks.
  const hasThrown = !isRanged && a.thrownType !== 'none' && a.rtb > 0 && a.atk > 0 && !aBlackSleep;

  // Large Shield: +2 defense (MoM) or +3 defense (CoM/CoM2) against ranged, thrown,
  // breath, and gaze attacks. Does NOT apply against melee. Added before armor piercing
  // so that AP halves the combined defense total.
  const bLargeShield = !!(b.abilities && b.abilities.largeShield);
  const aLargeShield = !!(a.abilities && a.abilities.largeShield);
  const largeShieldBonus = isCoM ? 3 : 2;
  // Elemental Armor / Resist Elements: version-sensitive bonus amounts.
  // MoM: EA +10 def+res, RE +3 def+res vs Chaos/Nature magic ranged + fire/lightning breath.
  // CoM: EA +12 def only (no res) vs ALL magic ranged (not thrown); RE +4 def + +4 res (Nature only).
  const bElemDefBonus = isCoM
    ? (bElemVal === 'elementalArmor' ? 12 : bElemVal === 'resistElements' ? 4 : 0)
    : (bElemVal === 'elementalArmor' ? 10 : bElemVal === 'resistElements' ? 3 : 0);
  const aElemDefBonus = isCoM
    ? (aElemVal === 'elementalArmor' ? 12 : aElemVal === 'resistElements' ? 4 : 0)
    : (aElemVal === 'elementalArmor' ? 10 : aElemVal === 'resistElements' ? 3 : 0);
  // Resistance bonus: CoM EA has none; CoM RE +4 vs Nature (stoning) only; MoM both get bonus.
  const bElemResBonus = isCoM
    ? (bElemVal === 'resistElements' ? 4 : 0)
    : (bElemVal === 'elementalArmor' ? 10 : bElemVal === 'resistElements' ? 3 : 0);
  const aElemResBonus = isCoM
    ? (aElemVal === 'resistElements' ? 4 : 0)
    : (aElemVal === 'elementalArmor' ? 10 : aElemVal === 'resistElements' ? 3 : 0);
  const bResStoning = bResM + bElemResBonus;
  const aResStoning = aResM + aElemResBonus;
  const bDefBase = Math.max(0, b.def - bVertigoDefPenalty);
  const aDefBase = Math.max(0, a.def - aVertigoDefPenalty);
  const bDefLS = bLargeShield ? bDefBase + largeShieldBonus : bDefBase;
  const aDefLS = aLargeShield ? aDefBase + largeShieldBonus : aDefBase;
  const bDefLSNoVert = bLargeShield ? b.def + largeShieldBonus : b.def;
  const aDefLSNoVert = aLargeShield ? a.def + largeShieldBonus : a.def;

  // Bless (defense half): +3 defense (MoM) or +5 (CoM/CoM2) vs Death/Chaos conventional damage.
  // MoM 1.31/1.60:
  //   Melee: Death/Chaos fantastic units (incl. Chaos Channeled) → +blessBonus def
  //   Fire Breath / Lightning Breath / Immolation / Wall of Fire: always Chaos → +blessBonus def
  //   Ranged Magic(C): always Chaos → +blessBonus def
  //   Ranged Missile/Boulder & Thrown: Death/Chaos fantastic units → +blessBonus def
  // CoM/CoM2:
  //   No melee protection vs Chaos/Death creatures; only spells and ranged/breath/gaze-style
  //   attacks retain the Bless defense bonus.
  // Defense bonus is applied BEFORE armor piercing (AP halves it) and BEFORE
  // defense-overriding effects (Fire/Magic Immunity, Righteousness, Illusion, Doom),
  // so those effects wipe out the bonus entirely.
  const aIsDC = a.unitType === 'fantastic_death' || a.unitType === 'fantastic_chaos';
  const bIsDC = b.unitType === 'fantastic_death' || b.unitType === 'fantastic_chaos';
  const aThrownDC = a.thrownType === 'fire' || a.thrownType === 'lightning'
                  || (a.thrownType === 'thrown' && aIsDC);
  const aRangedDC = a.rangedType === 'magic_c'
                  || ((a.rangedType === 'missile' || a.rangedType === 'boulder') && aIsDC);
  const blessMeleeActive = !isCoM;
  const blessBMelee  = (blessMeleeActive && bBless && aIsDC) ? blessBonus : 0;
  const blessAMelee  = (blessMeleeActive && aBless && bIsDC) ? blessBonus : 0;
  const blessBThrown = (bBless && aThrownDC) ? blessBonus : 0;
  const blessBRanged = (bBless && aRangedDC) ? blessBonus : 0;
  const blessBGaze   = (bBless && aIsDC)     ? blessBonus : 0;
  const blessAGaze   = (aBless && bIsDC)     ? blessBonus : 0;
  const blessBImm    = bBless ? blessBonus : 0;
  const blessAImm    = aBless ? blessBonus : 0;

  // Elemental Armor / Resist Elements defense triggers: which attack types trigger the bonus.
  // CoM: ALL magic ranged (incl. sorcery) + breath; NOT physical thrown. MoM: Chaos/Nature magic ranged + breath.
  const aRangedElem = isCoM
    ? (a.rangedType === 'magic_c' || a.rangedType === 'magic_n' || a.rangedType === 'magic_s')
    : (a.rangedType === 'magic_c' || a.rangedType === 'magic_n');
  const aThrownElem = a.thrownType === 'fire' || a.thrownType === 'lightning';
  // Gaze physical component (stoning gaze only, not death gaze). CoM: not "magical ranged", no bonus.
  const aStoningGazeOnly = !!(a.abilities && a.abilities.stoningGaze != null) && !(a.abilities && a.abilities.deathGaze != null);
  const bStoningGazeOnly = !!(b.abilities && b.abilities.stoningGaze != null) && !(b.abilities && b.abilities.deathGaze != null);
  const bElemRanged = aRangedElem ? bElemDefBonus : 0;
  const bElemThrown = aThrownElem ? bElemDefBonus : 0;
  const bElemGaze   = (!isCoM && aStoningGazeOnly) ? bElemDefBonus : 0;
  const aElemGaze   = (!isCoM && bStoningGazeOnly) ? aElemDefBonus : 0;

  // Armor Piercing: halve defense (round down) before immunities. Applies to all of
  // the attacker's attacks. Lightning Breath is intrinsically armor piercing but only
  // for the thrown/breath phase. Halving is applied at most once regardless of source.
  // Lightning Resist on the defender cancels the intrinsic AP from lightning breath.
  const aArmorPiercing = !!(a.abilities && a.abilities.armorPiercing);
  const bArmorPiercing = !!(b.abilities && b.abilities.armorPiercing);
  const bLightningResist = !!(b.abilities && b.abilities.lightningResist);
  const bDefAP = aArmorPiercing ? Math.floor((bDefBase + blessBMelee) / 2) : (bDefBase + blessBMelee);
  const aDefAP = bArmorPiercing ? Math.floor((aDefBase + blessAMelee) / 2) : (aDefBase + blessAMelee);
  // Large Shield variants: applied to non-melee defense before AP. Bless bonus varies
  // by phase (ranged vs gaze vs immolation), so each gets its own pre-AP value.
  const bDefAPLSRanged = aArmorPiercing ? Math.floor((bDefLS + blessBRanged + bElemRanged) / 2) : (bDefLS + blessBRanged + bElemRanged);
  const bDefAPLSGaze   = aArmorPiercing ? Math.floor((bDefLS + blessBGaze   + bElemGaze)   / 2) : (bDefLS + blessBGaze   + bElemGaze);
  // Immolation is fire/Chaos-realm — elem bonus applies in MoM but not CoM (not "magical ranged").
  const bElemImm = !isCoM ? bElemDefBonus : 0;
  const aElemImm = !isCoM ? aElemDefBonus : 0;
  const bDefAPLSImm    = aArmorPiercing ? Math.floor((bDefLSNoVert + blessBImm + bElemImm) / 2) : (bDefLSNoVert + blessBImm + bElemImm);
  const aDefAPLSGaze   = bArmorPiercing ? Math.floor((aDefLS + blessAGaze   + aElemGaze)   / 2) : (aDefLS + blessAGaze   + aElemGaze);
  const aDefAPLSImm    = bArmorPiercing ? Math.floor((aDefLSNoVert + blessAImm + aElemImm) / 2) : (aDefLSNoVert + blessAImm + aElemImm);
  const bLightningAP = a.thrownType === 'lightning' && !bLightningResist;
  const bDefAPThrownLS = (aArmorPiercing || bLightningAP)
    ? Math.floor((bDefLS + blessBThrown + bElemThrown) / 2) : (bDefLS + blessBThrown + bElemThrown);

  // Weapon Immunity: applied after armor piercing. Phase-specific eligibility.
  // MoM: defense → min 10. CoM2: defense + 8. Only vs normal units with normal weapons.
  // Blazing March upgrades melee and missile attacks to magical weapons in CoM/CoM2.
  const aBlazingMarch = !!(a.abilities && a.abilities.blazingMarch);
  const bBlazingMarch = !!(b.abilities && b.abilities.blazingMarch);
  const aMeleeWeaponForWI = (aBlazingMarch && a.weapon === 'normal') ? 'magic' : a.weapon;
  const bMeleeWeaponForWI = (bBlazingMarch && b.weapon === 'normal') ? 'magic' : b.weapon;
  const aRangedWeaponForWI = (aBlazingMarch && a.rangedType === 'missile' && a.weapon === 'normal') ? 'magic' : a.weapon;
  // Melee: always eligible
  let bDefVsA = weaponImmunityDef(bDefAP, b.abilities, aMeleeWeaponForWI, a.unitType, ver, a.generic);
  // Gaze: hidden ranged component — gaze attackers are always fantastic so WI never
  // triggers, but Large Shield and Magic Immunity apply since it's a magical ranged attack.
  let bDefForGaze = magicImmunityDef(weaponImmunityDef(bDefAPLSGaze, b.abilities, a.weapon, a.unitType, ver, a.generic), b.abilities, ver);
  let aDefVsB = weaponImmunityDef(aDefAP, a.abilities, bMeleeWeaponForWI, b.unitType, ver, b.generic);
  let aDefForGaze = magicImmunityDef(weaponImmunityDef(aDefAPLSGaze, a.abilities, b.weapon, b.unitType, ver, b.generic), a.abilities, ver);
  // Ranged: WI applies to missile/boulder (physical ranged) in all versions.
  // Does NOT apply to magic ranged (already magical damage).
  // Large Shield bonus is included for all ranged types.
  const isPhysRanged = a.rangedType === 'missile' || a.rangedType === 'boulder';
  let bDefVsARanged = isPhysRanged
    ? weaponImmunityDef(bDefAPLSRanged, b.abilities, aRangedWeaponForWI, a.unitType, ver, a.generic) : bDefAPLSRanged;
  // Thrown: WI eligible except v1.31 bug. Breath (fire/lightning) is magical, never triggers WI.
  // Large Shield bonus is included for thrown/breath.
  const thrownWI = a.thrownType === 'thrown' && ver !== 'mom_1.31';
  let bDefForThrown = thrownWI
    ? weaponImmunityDef(bDefAPThrownLS, b.abilities, a.weapon, a.unitType, ver, a.generic) : bDefAPThrownLS;

  // Eldritch Weapon: -10pp to defender's toBlock on melee, thrown, and missile ranged attacks.
  // Does not apply to breath, ranged boulder, or ranged magical attacks.
  const aEW = !!(a.abilities && a.abilities.eldritchWeapon);
  const bEW = !!(b.abilities && b.abilities.eldritchWeapon);
  const aMysticSurge = !!(a.abilities && a.abilities.mysticSurge);
  const bMysticSurge = !!(b.abilities && b.abilities.mysticSurge);
  const bToBlockConventional = Math.max(0, b.toBlock - bVertigoBlockPenalty);
  const aToBlockConventional = Math.max(0, a.toBlock - aVertigoBlockPenalty);
  const bToBlockVsAAll = aMysticSurge ? Math.max(0, bToBlockConventional - 0.10) : bToBlockConventional;
  const aToBlockVsBAll = bMysticSurge ? Math.max(0, aToBlockConventional - 0.10) : aToBlockConventional;
  const bToBlockVsAMelee   = aEW ? Math.max(0, bToBlockVsAAll - 0.10) : bToBlockVsAAll;
  const bToBlockVsAThrEW   = (aEW && a.thrownType === 'thrown') ? Math.max(0, bToBlockVsAAll - 0.10) : bToBlockVsAAll;
  const bToBlockVsARangedEW = (aEW && a.rangedType === 'missile') ? Math.max(0, bToBlockVsAAll - 0.10) : bToBlockVsAAll;
  const aToBlockVsBMelee   = bEW ? Math.max(0, aToBlockVsBAll - 0.10) : aToBlockVsBAll;

  // Missile Immunity: defense set to 50/100 against missile ranged attacks only (not boulder/magic).
  // Applied after armor piercing and weapon immunity.
  // v1.31 bug: when both WI and MI apply to the same missile attack, WI overwrites MI
  // (defense stays at 10 instead of 50). Fixed in v1.51+ (CP 1.60).
  const isMissile = a.rangedType === 'missile';
  const wiTriggeredOnMissile = isMissile && b.abilities && b.abilities.weaponImmunity
    && aRangedWeaponForWI === 'normal' && a.unitType === 'normal';
  if (isMissile && !(ver === 'mom_1.31' && wiTriggeredOnMissile)) {
    bDefVsARanged = missileImmunityDef(bDefVsARanged, b.abilities, ver);
  }

  // Righteousness: defense set to 50/100 against Chaos-realm Ranged Magical Attack (magic_c).
  // Nature/Sorcery magic ranged are unaffected.
  if (a.rangedType === 'magic_c') {
    bDefVsARanged = righteousnessDef(bDefVsARanged, b.abilities, ver);
  }

  // Magic Immunity: defense set to 50/100 against all magic ranged attacks.
  if (a.rangedType === 'magic_c' || a.rangedType === 'magic_n' || a.rangedType === 'magic_s') {
    bDefVsARanged = magicImmunityDef(bDefVsARanged, b.abilities, ver);
  }

  // Fire Immunity: defense set to 50/100 against fire breath (thrownType 'fire').
  // Applied after armor piercing and weapon immunity (though breath is magical so WI never triggers).
  if (a.thrownType === 'fire') {
    bDefForThrown = fireImmunityDef(bDefForThrown, b.abilities, ver);
  }

  // Righteousness: defense set to 50/100 against Fire Breath and Lightning Breath
  // (both are Chaos-realm special attacks).
  if (a.thrownType === 'fire' || a.thrownType === 'lightning') {
    bDefForThrown = righteousnessDef(bDefForThrown, b.abilities, ver);
  }

  // Magic Immunity: defense set to 50 against Fire Breath and Lightning Breath in MoM.
  // CoM v2.3 removed this — breath attacks now bypass Magic Immunity in CoM/CoM2.
  if ((a.thrownType === 'fire' || a.thrownType === 'lightning') && !(ver && ver.startsWith('com'))) {
    bDefForThrown = magicImmunityDef(bDefForThrown, b.abilities, ver);
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

  // --- Immolation ---
  // Area fire damage: targets each defender figure independently (like fire breath).
  // Strength 4 (MoM) / 10 (CoM/CoM2). Fires like a touch attack with each attack phase.
  // Magic Immunity raises defense to 50/100. Fire Immunity and Righteousness also raise
  // defense to 50/100. Large Shield and AP apply.
  const aHasImm = !!(a.abilities && a.abilities.immolation);
  const bHasImm = !!(b.abilities && b.abilities.immolation);
  const immStr = (aHasImm || bHasImm) ? immolationStr(ver) : 0;
  // Defense for immolation: base + Large Shield + Bless + AP → Magic Immunity → Fire Immunity → Righteousness → Illusion
  let bDefForImm = righteousnessDef(fireImmunityDef(magicImmunityDef(bDefAPLSImm, b.abilities, ver), b.abilities, ver), b.abilities, ver);
  let aDefForImm = righteousnessDef(fireImmunityDef(magicImmunityDef(aDefAPLSImm, a.abilities, ver), a.abilities, ver), a.abilities, ver);
  if (aIllusion && !bIllusionImmune) bDefForImm = b.cityWallBonus || 0;
  if (bIllusion && !aIllusionImmune) aDefForImm = a.cityWallBonus || 0;

  // --- Wall of Fire ---
  // Area Immolation damage to attacker A between gaze and melee. Not in ranged combat.
  // Uses the same defense chain as immolation against A, and the same immunities.
  const wallOfFireActive = !!opts.wallOfFire && !isRanged;
  const wofStr = wallOfFireActive ? wallOfFireStr(ver) : 0;
  // Wall of Fire is cast at 30% base To Hit (standard spell To Hit, like immolation).
  const wofToHit = 0.3;

  if (isRanged) {
    // --- Ranged: attacker shoots, no counter-attack ---
    // Invisible defender cannot be targeted by ranged attacks (unless attacker has Illusions Immunity).
    if (!aCanSeeB) {
      return {
        phases: null,
        totalDmgToA: [1], totalDmgToB: [1],
        aRemHP, aHP: aTotalHP, aAlive,
        bRemHP, bHP: bTotalHP, bAlive,
      };
    }
    let dmgToB = aAlive > 0 && bRemHP > 0 && a.rtb > 0 && !aBlackSleep
      ? (aDoomsB ? calcDoomDist(aAlive, a.rtb, bRemHP)
                 : calcTotalDamageDist(aAlive, a.rtb, aToHitRtbVert, bDefVsARanged, bToBlockVsARangedEW, b.hp, bRemHP, bInvulnBonus, bBlurChance, blurBuggy,
                     isCoM2 ? woundedTopFigHP(bRemHP, b.hp) : undefined, aMinDamageFromHits))
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
      const pFail = stoningFailProb(bResStoning, b.abilities, a.abilities.stoningTouch, opts.version);
      if (pFail > 0) {
        const stoningDist = calcFigureKillDmgDist(aAlive, pFail, b.hp, bRemHP);
        dmgToB = convolveDists(dmgToB, stoningDist, bRemHP);
      }
    }

    // Life Steal accompanies ranged attacks
    let aLifeStealDistR = null;
    let aLifeStealExpectedR = 0;
    const aLifeStealActive = a.abilities && a.abilities.lifeSteal != null
      && touchAttackFires(a.rtb, a.baseRtb, opts.version);
    if (aLifeStealActive && aAlive > 0 && bRemHP > 0) {
      const lsMod = lifeStealEffective(bResDeath, b.abilities, a.abilities.lifeSteal, opts.version);
      if (lsMod !== null) {
        aLifeStealDistR = calcLifeStealDmgDist(aAlive, bResDeath, lsMod, bRemHP);
        aLifeStealExpectedR = expectedDamage(aLifeStealDistR);
        dmgToB = convolveDists(dmgToB, aLifeStealDistR, bRemHP);
      }
    }

    // Immolation accompanies ranged attacks (MoM only; CoM/CoM2 removed this)
    const aImmWithRanged = aHasImm && !immolationBlocksRanged(ver)
      && touchAttackFires(a.rtb, a.baseRtb, opts.version);
    if (aImmWithRanged && aAlive > 0 && bAlive > 0 && bRemHP > 0) {
      const immDist = calcAreaDamageDist(bAlive, immStr, a.toHitImmolation, bDefForImm, bToBlockVsAAll, b.hp, bRemHP, bInvulnBonus, aMinDamageFromHits);
      dmgToB = convolveDists(dmgToB, immDist, bRemHP);
    }

    // Haste doubles ranged attacks, EXCEPT mana-pool magic ranged in MoM (Caster ability
    // skips doubling). In CoM/CoM2, ranged never spends mana so Caster does not suppress
    // doubling. Self-convolving captures both the main ranged damage and all touch + immolation
    // effects folded in above.
    const aIsMagicRangedR = a.rangedType === 'magic_c' || a.rangedType === 'magic_n' || a.rangedType === 'magic_s';
    const aCasterR = !!(a.abilities && a.abilities.caster);
    const hasteDoublesRanged = aHaste && a.rtb > 0 && aAlive > 0 && bRemHP > 0
      && !(!isCoMVer && aIsMagicRangedR && aCasterR);
    if (hasteDoublesRanged) {
      dmgToB = convolveDists(dmgToB, dmgToB, bRemHP);
      if (aLifeStealDistR) aLifeStealDistR = convolveDists(aLifeStealDistR, aLifeStealDistR, bRemHP);
      aLifeStealExpectedR *= 2;
    }

    return {
      phases: null,
      totalDmgToA: [1],
      totalDmgToB: dmgToB,
      aLifeStealDist: aLifeStealDistR,
      aLifeStealExpected: aLifeStealExpectedR,
      bLifeStealDist: null,
      bLifeStealExpected: 0,
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
    const aStoningFail = aStoningOn ? stoningFailProb(bResStoning, b.abilities, a.abilities.stoningTouch, opts.version) : 0;
    const bStoningFail = bStoningOn ? stoningFailProb(aResStoning, a.abilities, b.abilities.stoningTouch, opts.version) : 0;

    const aLifeStealOn = a.abilities && a.abilities.lifeSteal != null;
    const bLifeStealOn = b.abilities && b.abilities.lifeSteal != null;
    const aLifeStealMod = aLifeStealOn ? lifeStealEffective(bResDeath, b.abilities, a.abilities.lifeSteal, opts.version) : null;
    const bLifeStealMod = bLifeStealOn ? lifeStealEffective(aResDeath, a.abilities, b.abilities.lifeSteal, opts.version) : null;

    // Per-phase activation: touch attacks require the associated attack to be non-zero.
    // Black Sleep prevents all outgoing attacks including touch effects.
    const aPoisonWithThrown = aPoisonFail > 0 && !aBlackSleep && touchAttackFires(a.rtb, a.baseRtb, opts.version);
    const aPoisonWithMelee  = aPoisonFail > 0 && !aBlackSleep && touchAttackFires(a.atk, a.baseAtk, opts.version);
    const bPoisonWithMelee  = bPoisonFail > 0 && !bBlackSleep && touchAttackFires(b.atk, b.baseAtk, opts.version);
    const aStoningWithThrown = aStoningFail > 0 && !aBlackSleep && touchAttackFires(a.rtb, a.baseRtb, opts.version);
    const aStoningWithMelee  = aStoningFail > 0 && !aBlackSleep && touchAttackFires(a.atk, a.baseAtk, opts.version);
    const bStoningWithMelee  = bStoningFail > 0 && !bBlackSleep && touchAttackFires(b.atk, b.baseAtk, opts.version);

    const aDispelEvilFail = (a.abilities && a.abilities.dispelEvil)
      ? dispelEvilFailProb(bResM, b.abilities, b.unitType, opts.version) : 0;
    const bDispelEvilFail = (b.abilities && b.abilities.dispelEvil)
      ? dispelEvilFailProb(aResM, a.abilities, a.unitType, opts.version) : 0;
    const aDispelEvilWithMelee = aDispelEvilFail > 0 && !aBlackSleep && touchAttackFires(a.atk, a.baseAtk, opts.version);
    const bDispelEvilWithMelee = bDispelEvilFail > 0 && !bBlackSleep && touchAttackFires(b.atk, b.baseAtk, opts.version);

    const aLifeStealWithThrown = aLifeStealMod !== null && !aBlackSleep && touchAttackFires(a.rtb, a.baseRtb, opts.version);
    const aLifeStealWithMelee  = aLifeStealMod !== null && !aBlackSleep && touchAttackFires(a.atk, a.baseAtk, opts.version);
    const bLifeStealWithMelee  = bLifeStealMod !== null && !bBlackSleep && touchAttackFires(b.atk, b.baseAtk, opts.version);

    // Immolation per-phase activation
    const aImmWithThrown = aHasImm && !aBlackSleep && touchAttackFires(a.rtb, a.baseRtb, opts.version);
    const aImmWithMeleeT = aHasImm && !aBlackSleep && touchAttackFires(a.atk, a.baseAtk, opts.version);
    const bImmWithMeleeT = bHasImm && !bBlackSleep && touchAttackFires(b.atk, b.baseAtk, opts.version);

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
    const aGazeRangedActive = (a.effectiveGazeRanged || 0) > 0;
    const bGazeRangedActive = (b.effectiveGazeRanged || 0) > 0;
    const aGazeActive = !aBlackSleep && (aStoningGazeActive || aDeathGazeActive || aDoomGazeActive || aGazeRangedActive);
    const bGazeActive = !bBlackSleep && (bStoningGazeActive || bDeathGazeActive || bDoomGazeActive || bGazeRangedActive);
    const aStoningGazeFail = aStoningGazeActive
      ? stoningFailProb(bResStoning, b.abilities, a.abilities.stoningGaze, opts.version) : 0;
    const bStoningGazeFail = bStoningGazeActive
      ? stoningFailProb(aResStoning, a.abilities, b.abilities.stoningGaze, opts.version) : 0;
    const aDeathGazeFail = aDeathGazeActive
      ? deathGazeFailProb(bResDeath, b.abilities, a.abilities.deathGaze, opts.version) : 0;
    const bDeathGazeFail = bDeathGazeActive
      ? deathGazeFailProb(aResDeath, a.abilities, b.abilities.deathGaze, opts.version) : 0;
    const hasGaze = aGazeActive || bGazeActive;

    // Touch attacks (immolation, poison, stoning, life steal) fire with gaze (all versions)
    const aImmWithGaze       = aHasImm && aGazeActive;
    const bImmWithGaze       = bHasImm && bGazeActive;
    const aPoisonWithGaze    = aPoisonFail > 0  && !aBlackSleep && aGazeActive;
    const bPoisonWithGaze    = bPoisonFail > 0  && !bBlackSleep && bGazeActive;
    const aStoningWithGaze   = aStoningFail > 0 && !aBlackSleep && aGazeActive;
    const bStoningWithGaze   = bStoningFail > 0 && !bBlackSleep && bGazeActive;
    const aLifeStealWithGaze = aLifeStealMod !== null && !aBlackSleep && aGazeActive;
    const bLifeStealWithGaze = bLifeStealMod !== null && !bBlackSleep && bGazeActive;

    // Pre-compute B's gaze distribution (count-independent portion; targets A)
    // Touch attacks scale with B's surviving count and are added per-iteration below.
    let bGazeDistNoTouch = bGazeActive
      ? buildGazeDist(b, a, aAlive, aRemHP, bStoningGazeFail, bDeathGazeFail, bDoomGazeStr, aDefForGaze, aInvulnBonus, aBlurChance, blurBuggy,
          isCoM2 ? woundedTopFigHP(aRemHP, a.hp) : undefined, aBlackSleep, aToBlockVsBAll, bMinDamageFromHits)
      : [1];
    if (aAlive > 0 && aRemHP > 0 && bImmWithGaze) {
      bGazeDistNoTouch = convolveDists(bGazeDistNoTouch,
        calcAreaDamageDist(aAlive, immStr, b.toHitImmolation, aDefForImm, aToBlockVsBAll, a.hp, aRemHP, aInvulnBonus, bMinDamageFromHits), aRemHP);
    }
    // Cache full gaze+touch distributions by B's alive count (touch strength scales with it).
    const bGazeDistsByAlive1 = new Array(b.figs + 1).fill(null);

    // Phase 1: Thrown/Breath damage
    let thrownDist = aAlive > 0 && bRemHP > 0
      ? (aDoomsB ? calcDoomDist(aAlive, a.rtb, bRemHP)
                 : calcTotalDamageDist(aAlive, a.rtb, aToHitRtbVert, bDefForThrown, bToBlockVsAThrEW, b.hp, bRemHP, bInvulnBonus, bBlurChance, blurBuggy,
                     isCoM2 ? woundedTopFigHP(bRemHP, b.hp) : undefined, aMinDamageFromHits))
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
      const lsDist = calcLifeStealDmgDist(aAlive, bResDeath, aLifeStealMod, bRemHP);
      phase1Dist = convolveDists(phase1Dist, lsDist, bRemHP);
    }
    // Immolation with thrown: targets all defender figures (area damage)
    const phase1HasImm = aImmWithThrown && aAlive > 0 && bAlive > 0 && bRemHP > 0;
    if (phase1HasImm) {
      const immDist = calcAreaDamageDist(bAlive, immStr, a.toHitImmolation, bDefForImm, bToBlockVsAAll, b.hp, bRemHP, bInvulnBonus, aMinDamageFromHits);
      phase1Dist = convolveDists(phase1Dist, immDist, bRemHP);
    }
    // Haste doubles thrown/breath damage (+ all touch attacks + immolation already folded in).
    if (aHaste && aAlive > 0 && a.rtb > 0 && bRemHP > 0) {
      phase1Dist = convolveDists(phase1Dist, phase1Dist, bRemHP);
    }

    const totalDmgToB = new Array(bRemHP + 1).fill(0);
    const totalDmgToA = new Array(aRemHP + 1).fill(0);
    const meleeOnlyToB = new Array(bRemHP + 1).fill(0);
    const counterOnlyToA = new Array(aRemHP + 1).fill(0);
    const gazeOnlyToB = hasGaze ? new Array(bRemHP + 1).fill(0) : null;
    const gazeOnlyToA = hasGaze ? new Array(aRemHP + 1).fill(0) : null;
    const wofOnlyToA1 = wallOfFireActive ? new Array(aRemHP + 1).fill(0) : null;
    const secondStrikeOnlyToBT = (hasFirstStrike && aHaste) ? new Array(bRemHP + 1).fill(0) : null;
    // Marginal survivor distributions for fear display (accounts for thrown+gaze+WoF casualties).
    const defSurvT = (hasGaze && bFearedByA) ? new Array(b.figs + 1).fill(0) : null;
    const atkSurvT = (hasGaze && (aFearedByB || aFearBug)) ? new Array(a.figs + 1).fill(0) : null;
    // Cumulative P(destroyed) scalars for phase breakdown "% destroyed" display.
    let pDestroyBAfterAGaze = 0; // P(B destroyed after thrown + A-gaze)
    let pDestroyAAfterWof1 = 0;  // P(A destroyed after B-gaze + WoF)
    let pDestroyBAfterFS1 = 0;   // P(B destroyed after thrown + A-gaze + FS) [FS path only]
    let aLifeStealExpectedT = phase1HasLifeSteal ? expectedDamage(calcLifeStealDmgDist(aAlive, bResDeath, aLifeStealMod, bRemHP)) : 0;
    let bLifeStealExpectedT = 0;
    if (aHaste && aAlive > 0 && a.rtb > 0 && bRemHP > 0) aLifeStealExpectedT *= 2;

    for (let p1Dmg = 0; p1Dmg < phase1Dist.length; p1Dmg++) {
      if (phase1Dist[p1Dmg] < 1e-15) continue;
      const pPhase1 = phase1Dist[p1Dmg];

      // Defender state after phase 1 (thrown/breath) damage
      const bDmgAfterP1 = b.dmg + p1Dmg;
      const bAliveAfterP1 = Math.max(0, b.figs - Math.floor(bDmgAfterP1 / b.hp));
      const bRemHPAfterP1 = Math.max(0, bRemHP - p1Dmg);

      // Phase 2: Gaze attacks (attacker's gaze first, then defender's gaze)
      // A's gaze: physical ranged + doom + stoning + death effects on B's surviving figures
      let aGazeDist = aGazeActive
        ? buildGazeDist(a, b, bAliveAfterP1, bRemHPAfterP1, aStoningGazeFail, aDeathGazeFail, aDoomGazeStr, bDefForGaze, bInvulnBonus, bBlurChance, blurBuggy,
            isCoM2 ? woundedTopFigHP(bRemHPAfterP1, b.hp) : undefined, bBlackSleep, bToBlockVsAAll, aMinDamageFromHits)
        : [1];
      // A's touch attacks fire simultaneously with A's gaze
      if (aAlive > 0 && bAliveAfterP1 > 0 && bRemHPAfterP1 > 0) {
        if (aImmWithGaze) {
          aGazeDist = convolveDists(aGazeDist,
            calcAreaDamageDist(bAliveAfterP1, immStr, a.toHitImmolation, bDefForImm, bToBlockVsAAll, b.hp, bRemHPAfterP1, bInvulnBonus, aMinDamageFromHits), bRemHPAfterP1);
        }
        if (aPoisonWithGaze) {
          aGazeDist = convolveDists(aGazeDist,
            calcResistDmgDist(aAlive * aPoisonStr, aPoisonFail, bRemHPAfterP1), bRemHPAfterP1);
        }
        if (aStoningWithGaze) {
          aGazeDist = convolveDists(aGazeDist,
            calcFigureKillDmgDist(aAlive, aStoningFail, b.hp, bRemHPAfterP1), bRemHPAfterP1);
        }
        if (aLifeStealWithGaze) {
          aLifeStealExpectedT += pPhase1 * expectedDamage(calcLifeStealDmgDist(aAlive, bResDeath, aLifeStealMod, bRemHPAfterP1));
          aGazeDist = convolveDists(aGazeDist,
            calcLifeStealDmgDist(aAlive, bResDeath, aLifeStealMod, bRemHPAfterP1), bRemHPAfterP1);
        }
      }

      for (let aGzDmg = 0; aGzDmg < aGazeDist.length; aGzDmg++) {
        if (aGazeDist[aGzDmg] < 1e-15) continue;

        const bDmgAfterAGaze = bDmgAfterP1 + aGzDmg;
        const bAliveAfterGaze = Math.max(0, b.figs - Math.floor(bDmgAfterAGaze / b.hp));
        const bRemHPAfterGaze = Math.max(0, bRemHPAfterP1 - aGzDmg);

        // Accumulate cumulative P(B destroyed after thrown + A-gaze).
        if (p1Dmg + aGzDmg >= bRemHP) pDestroyBAfterAGaze += pPhase1 * aGazeDist[aGzDmg];

        // B's gaze: build distribution for this bAliveAfterGaze (touch strength scales with count).
        let bGazeDist;
        if (bAliveAfterGaze <= 0) {
          bGazeDist = [1];
        } else {
          if (!bGazeDistsByAlive1[bAliveAfterGaze]) {
            let gd = bGazeDistNoTouch.slice();
            if (bPoisonWithGaze) gd = convolveDists(gd, calcResistDmgDist(bAliveAfterGaze * bPoisonStr, bPoisonFail, aRemHP), aRemHP);
            if (bStoningWithGaze) gd = convolveDists(gd, calcFigureKillDmgDist(bAliveAfterGaze, bStoningFail, a.hp, aRemHP), aRemHP);
            if (bLifeStealWithGaze) gd = convolveDists(gd, calcLifeStealDmgDist(bAliveAfterGaze, aResDeath, bLifeStealMod, aRemHP), aRemHP);
            bGazeDistsByAlive1[bAliveAfterGaze] = gd;
          }
          bGazeDist = bGazeDistsByAlive1[bAliveAfterGaze];
        }

        // Accumulate B's survivor distribution before fear (depends only on thrown+A-gaze, not B-gaze).
        if (defSurvT) defSurvT[bAliveAfterGaze] += pPhase1 * aGazeDist[aGzDmg];
        if (bLifeStealWithGaze && bAliveAfterGaze > 0) {
          bLifeStealExpectedT += pPhase1 * aGazeDist[aGzDmg] * expectedDamage(calcLifeStealDmgDist(bAliveAfterGaze, aResDeath, bLifeStealMod, aRemHP));
        }

        for (let bGzDmg = 0; bGzDmg < bGazeDist.length; bGzDmg++) {
          if (bGazeDist[bGzDmg] < 1e-15) continue;
          const pGaze = pPhase1 * aGazeDist[aGzDmg] * bGazeDist[bGzDmg];

          const aAliveAfterGaze = Math.max(0, a.figs - Math.floor((a.dmg + bGzDmg) / a.hp));
          const aRemHPAfterGaze = Math.max(0, aRemHP - bGzDmg);

          // Accumulate gaze phase damage (independent of Wall of Fire outcome)
          if (gazeOnlyToB) gazeOnlyToB[Math.min(aGzDmg, bRemHP)] += pGaze;
          if (gazeOnlyToA) gazeOnlyToA[Math.min(bGzDmg, aRemHP)] += pGaze;

          // Wall of Fire fires between gaze and melee, on surviving A figures
          const wofDist1 = (wallOfFireActive && aAliveAfterGaze > 0 && aRemHPAfterGaze > 0)
            ? calcAreaDamageDist(aAliveAfterGaze, wofStr, wofToHit, aDefForImm, a.toBlock, a.hp, aRemHPAfterGaze, aInvulnBonus, null)
            : [1];

          for (let wofDmg = 0; wofDmg < wofDist1.length; wofDmg++) {
            const pWof = wofDist1[wofDmg];
            if (pWof < 1e-15) continue;
            const pCombined = pGaze * pWof;
            if (wofOnlyToA1) wofOnlyToA1[Math.min(wofDmg, aRemHP)] += pCombined;
            // Accumulate cumulative P(A destroyed after B-gaze + WoF).
            if (bGzDmg + wofDmg >= aRemHP) pDestroyAAfterWof1 += pCombined;

            const aAliveAfterWof = Math.max(0, a.figs - Math.floor((a.dmg + bGzDmg + wofDmg) / a.hp));
            const aRemHPAfterWof = Math.max(0, aRemHPAfterGaze - wofDmg);

            // Accumulate A's survivor distribution before fear (after B-gaze + WoF).
            if (atkSurvT) atkSurvT[aAliveAfterWof] += pCombined;

            // Phase 3: Melee + Touch (post-gaze+WoF figure counts), with Cause Fear
            // Immolation dists for melee phase (area damage targeting all defender figs)
            const aImmMeleeDist1 = aImmWithMeleeT && aAliveAfterWof > 0 && bAliveAfterGaze > 0 && bRemHPAfterGaze > 0
              ? calcAreaDamageDist(bAliveAfterGaze, immStr, a.toHitImmolation, bDefForImm, bToBlockVsAAll, b.hp, bRemHPAfterGaze, bInvulnBonus, aMinDamageFromHits) : null;
            const bImmMeleeDist1 = bImmWithMeleeT && aAliveAfterWof > 0 && aRemHPAfterWof > 0
              ? calcAreaDamageDist(aAliveAfterWof, immStr, b.toHitImmolation, aDefForImm, aToBlockVsBAll, a.hp, aRemHPAfterWof, aInvulnBonus, bMinDamageFromHits) : null;
            // aUnfeared1: full post-step-6 fear (used for 2nd strike and non-FS melee).
            // aUnfeared_preFS: only step-4 fear (B fears A before FS); aFearBug fires at step 6.
            const aUnfeared1 = aFearedByB ? calcFearDist(aAliveAfterWof, aPFear)
                             : aFearBug ? calcFearBugDist(aAliveAfterWof, bAliveAfterGaze, bPFear)
                             : null;
            const aUnfeared_preFS1 = hasFirstStrike
              ? (aFearedByB ? calcFearDist(aAliveAfterWof, aPFear) : null)
              : null;
            const meleeOutcome = calcMeleeTouchOutcome(
              hasFirstStrike ? aUnfeared_preFS1 : aUnfeared1,
              aAliveAfterWof, aDoomsB, aBlackSleep ? 0 : aMeleeAtkVsB, aToHitMeleeVert,
              bDefVsA, bToBlockVsAMelee, b.hp, bRemHPAfterGaze,
              aPoisonWithMelee ? aPoisonStr : 0, aPoisonFail,
              aStoningWithMelee ? aStoningFail : 0,
              aDispelEvilWithMelee ? aDispelEvilFail : 0,
              aLifeStealWithMelee ? aLifeStealMod : null, bResDeath,
              aImmMeleeDist1, bInvulnBonus, bBlurChance, blurBuggy,
              hasFirstStrike ? false : aHaste,
              isCoM2 ? woundedTopFigHP(bRemHPAfterGaze, b.hp) : undefined,
              aMinDamageFromHits);
            const meleeDist = meleeOutcome.damageDist;
            aLifeStealExpectedT += pCombined * meleeOutcome.lifeStealEV;

            if (hasFirstStrike && (!isCoM1Only || woundedTopFigHP(bRemHPAfterGaze, b.hp) <= 24)) {
              // A's melee resolves before B's counter-attack; counter uses post-melee survivors.
              // With Haste, A's 2nd strike is simultaneous with B's counter.
              for (let mDmg = 0; mDmg < meleeDist.length; mDmg++) {
                if (meleeDist[mDmg] < 1e-15) continue;
                const pM = pCombined * meleeDist[mDmg];
                meleeOnlyToB[Math.min(mDmg, bRemHP)] += pM;
                // Accumulate cumulative P(B destroyed after thrown + A-gaze + FS).
                if (p1Dmg + aGzDmg + mDmg >= bRemHP) pDestroyBAfterFS1 += pM;

                const bDmgAfterMelee = bDmgAfterAGaze + mDmg;
                const bAliveAfterMelee = Math.max(0, b.figs - Math.floor(bDmgAfterMelee / b.hp));
                const bRemHPAfterMelee = Math.max(0, bRemHPAfterGaze - mDmg);
                const bUnfearedFS1 = bFearedByA ? calcFearDist(bAliveAfterMelee, bPFear) : null;
                // B's immolation on counter targets A (A's alive count unchanged by B's counter)
                const bImmFSDist1 = bImmWithMeleeT && aAliveAfterWof > 0 && aRemHPAfterWof > 0
                  ? calcAreaDamageDist(aAliveAfterWof, immStr, b.toHitImmolation, aDefForImm, aToBlockVsBAll, a.hp, aRemHPAfterWof, aInvulnBonus, bMinDamageFromHits) : null;
                const counterOutcome = calcMeleeTouchOutcome(bUnfearedFS1, bAliveAfterMelee, bDoomsA, bBlackSleep ? 0 : bMeleeAtkVsA, bToHitMeleeVert,
                  aDefVsB, aToBlockVsBMelee, a.hp, aRemHPAfterWof,
                  bPoisonWithMelee ? bPoisonStr : 0, bPoisonFail,
                  bStoningWithMelee ? bStoningFail : 0,
                  bDispelEvilWithMelee ? bDispelEvilFail : 0,
                  bLifeStealWithMelee ? bLifeStealMod : null, aResDeath,
                  bImmFSDist1, aInvulnBonus, aBlurChance, blurBuggy,
                  bCounterHaste,
                  isCoM2 ? woundedTopFigHP(aRemHPAfterWof, a.hp) : undefined,
                  bMinDamageFromHits);
                const counterDist = counterOutcome.damageDist;
                bLifeStealExpectedT += pM * counterOutcome.lifeStealEV;

                // A's hasted 2nd strike (simultaneous with counter), targeting post-FS B.
                let secondDmgToB;
                if (aHaste && aAliveAfterWof > 0 && bRemHPAfterMelee > 0) {
                  const aImm2nd = aImmWithMeleeT && bAliveAfterMelee > 0 && bRemHPAfterMelee > 0
                    ? calcAreaDamageDist(bAliveAfterMelee, immStr, a.toHitImmolation, bDefForImm, bToBlockVsAAll, b.hp, bRemHPAfterMelee, bInvulnBonus, aMinDamageFromHits) : null;
                  const secondOutcome = calcMeleeTouchOutcome(aUnfeared1, aAliveAfterWof, aDoomsB, aBlackSleep ? 0 : aMeleeAtkVsB, aToHitMeleeVert,
                    bDefVsA, bToBlockVsAMelee, b.hp, bRemHPAfterMelee,
                    aPoisonWithMelee ? aPoisonStr : 0, aPoisonFail,
                    aStoningWithMelee ? aStoningFail : 0,
                    aDispelEvilWithMelee ? aDispelEvilFail : 0,
                    aLifeStealWithMelee ? aLifeStealMod : null, bResDeath,
                    aImm2nd, bInvulnBonus, bBlurChance, blurBuggy,
                    false,
                    isCoM2 ? woundedTopFigHP(bRemHPAfterMelee, b.hp) : undefined,
                    aMinDamageFromHits);
                  secondDmgToB = secondOutcome.damageDist;
                  aLifeStealExpectedT += pM * secondOutcome.lifeStealEV;
                } else {
                  secondDmgToB = [1];
                }

                for (let sDmg = 0; sDmg < secondDmgToB.length; sDmg++) {
                  const pS = secondDmgToB[sDmg];
                  if (pS < 1e-15) continue;
                  totalDmgToB[Math.min(p1Dmg + aGzDmg + mDmg + sDmg, bRemHP)] += pM * pS;
                  if (secondStrikeOnlyToBT) secondStrikeOnlyToBT[Math.min(sDmg, bRemHP)] += pM * pS;
                }
                for (let cDmg = 0; cDmg < counterDist.length; cDmg++) {
                  if (counterDist[cDmg] < 1e-15) continue;
                  const v = pM * counterDist[cDmg];
                  totalDmgToA[Math.min(bGzDmg + wofDmg + cDmg, aRemHP)] += v;
                  counterOnlyToA[Math.min(cDmg, aRemHP)] += v;
                }
              }
              continue;
            }

            // Counter-attack (surviving B figures after gaze, simultaneous with A's melee)
            const bUnfeared1 = bFearedByA ? calcFearDist(bAliveAfterGaze, bPFear) : null;
            const counterOutcome = calcMeleeTouchOutcome(bUnfeared1, bAliveAfterGaze, bDoomsA, bBlackSleep ? 0 : bMeleeAtkVsA, bToHitMeleeVert,
              aDefVsB, aToBlockVsBMelee, a.hp, aRemHPAfterWof,
              bPoisonWithMelee ? bPoisonStr : 0, bPoisonFail,
              bStoningWithMelee ? bStoningFail : 0,
              bDispelEvilWithMelee ? bDispelEvilFail : 0,
              bLifeStealWithMelee ? bLifeStealMod : null, aResDeath,
              bImmMeleeDist1, aInvulnBonus, aBlurChance, blurBuggy,
              bCounterHaste,
              isCoM2 ? woundedTopFigHP(aRemHPAfterWof, a.hp) : undefined,
              bMinDamageFromHits);
            const counterDist = counterOutcome.damageDist;
            bLifeStealExpectedT += pCombined * counterOutcome.lifeStealEV;

            // Accumulate total damage (thrown + gaze + WoF + melee)
            for (let mDmg = 0; mDmg < meleeDist.length; mDmg++) {
              if (meleeDist[mDmg] < 1e-15) continue;
              const totalDmgB = Math.min(p1Dmg + aGzDmg + mDmg, bRemHP);
              totalDmgToB[totalDmgB] += pCombined * meleeDist[mDmg];
              meleeOnlyToB[Math.min(mDmg, bRemHP)] += pCombined * meleeDist[mDmg];
            }

            for (let cDmg = 0; cDmg < counterDist.length; cDmg++) {
              if (counterDist[cDmg] < 1e-15) continue;
              const totalDmgA = Math.min(bGzDmg + wofDmg + cDmg, aRemHP);
              totalDmgToA[totalDmgA] += pCombined * counterDist[cDmg];
              counterOnlyToA[Math.min(cDmg, aRemHP)] += pCombined * counterDist[cDmg];
            }
          }
        }
      }
    }

    // Cumulative P(destroyed) at each phase endpoint for "% destroyed" display.
    const pDestroyBThrown = pDestroyedFrom(phase1Dist, bRemHP);
    // pDestroyBAfterAGaze accumulated above; if no A-gaze, B's cumulative stays at thrown level.
    const pDestroyBAtBGaze = aGazeActive ? pDestroyBAfterAGaze : pDestroyBThrown;
    const pDestroyAAtBGaze = bGazeActive ? pDestroyedFrom(gazeOnlyToA, aRemHP) : 0;
    const pDestroyAAtWof1 = wallOfFireActive ? pDestroyAAfterWof1 : pDestroyAAtBGaze;
    const pDestroyBFinal1 = pDestroyedFrom(totalDmgToB, bRemHP);
    const pDestroyAFinal1 = pDestroyedFrom(totalDmgToA, aRemHP);

    // Build phase labels
    let thrownLabel = a.thrownType === 'thrown' ? 'Thrown'
                    : a.thrownType === 'fire' ? 'Fire Breath'
                    : 'Lightning Breath';
    if (aHaste && a.rtb > 0) thrownLabel = 'Hasted ' + thrownLabel;
    if (phase1HasPoison) thrownLabel += ' + Poison Touch';
    if (phase1HasStoning) thrownLabel += ' + Stoning Touch';
    if (phase1HasLifeSteal) thrownLabel += ' + Life Steal';
    if (phase1HasImm) thrownLabel += ' + Immolation';

    // Build melee label parts. Under FS+Haste the FS phase and the (2nd strike + counter)
    // phase are shown separately; otherwise a single simultaneous row merges melee + counter.
    let meleeTouchSuffix = '';
    if (aPoisonWithMelee || bPoisonWithMelee) meleeTouchSuffix += ' + Poison Touch';
    if (aStoningWithMelee || bStoningWithMelee) meleeTouchSuffix += ' + Stoning Touch';
    if (aLifeStealWithMelee || bLifeStealWithMelee) meleeTouchSuffix += ' + Life Steal';
    if (aImmWithMeleeT || bImmWithMeleeT) meleeTouchSuffix += ' + Immolation';
    let aTouchSuffixT = '';
    if (aPoisonWithMelee)    aTouchSuffixT += ' + Poison Touch';
    if (aStoningWithMelee)   aTouchSuffixT += ' + Stoning Touch';
    if (aLifeStealWithMelee) aTouchSuffixT += ' + Life Steal';
    if (aImmWithMeleeT)      aTouchSuffixT += ' + Immolation';
    let bTouchSuffixT = '';
    if (bPoisonWithMelee)    bTouchSuffixT += ' + Poison Touch';
    if (bStoningWithMelee)   bTouchSuffixT += ' + Stoning Touch';
    if (bLifeStealWithMelee) bTouchSuffixT += ' + Life Steal';
    if (bImmWithMeleeT)      bTouchSuffixT += ' + Immolation';
    const counterSuffix = bCounterHaste ? ' + Hasted Counter-attack' : ' + Counter-attack';
    const meleeBase = hasFirstStrike ? 'First Strike' : (aHaste ? 'Hasted Melee' : 'Melee');
    // FS+Haste: FS row shows only A's 1st strike (no counter yet). Otherwise melee and
    // counter are simultaneous and share one row.
    const fsHasteSplit = hasFirstStrike && aHaste;
    const meleePhaseLabel = fsHasteSplit
      ? meleeBase + aTouchSuffixT
      : meleeBase + meleeTouchSuffix + counterSuffix;

    // For First Strike: B's fear fires before A's FS (step 4), A's fear fires after FS (step 6).
    const fearPhaseDists1 = hasFirstStrike
      ? null
      : buildFearPhaseDists(aAlive, bAlive, bPFear, aPFear, aFearedByB, aFearBug, bFearedByA, showFearNoop, defSurvT, atkSurvT);
    const fearBeforeFS1 = hasFirstStrike
      ? buildFearPhaseDists(aAlive, bAlive, bPFear, aPFear, aFearedByB, false, false, showFearNoop, defSurvT, atkSurvT)
      : null;
    const fearAfterFS1 = hasFirstStrike
      ? buildFearPhaseDists(aAlive, bAlive, bPFear, aPFear, false, aFearBug, bFearedByA, false, defSurvT, atkSurvT)
      : null;

    // Compute standalone life steal distributions for E[damage] display
    let aLifeStealDistT = null, bLifeStealDistT = null;
    if (aLifeStealMod !== null && aAlive > 0 && bRemHP > 0) {
      const singlePhase = calcLifeStealDmgDist(aAlive, bResDeath, aLifeStealMod, bRemHP);
      const phaseCount = (aLifeStealWithThrown ? 1 : 0) + (aLifeStealWithGaze ? 1 : 0) + (aLifeStealWithMelee ? 1 : 0);
      aLifeStealDistT = repeatDist(singlePhase, phaseCount, bRemHP);
    }
    if (bLifeStealMod !== null && bAlive > 0 && aRemHP > 0) {
      const singlePhase = calcLifeStealDmgDist(bAlive, aResDeath, bLifeStealMod, aRemHP);
      const phaseCount = (bLifeStealWithGaze ? 1 : 0) + (bLifeStealWithMelee ? 1 : 0);
      bLifeStealDistT = repeatDist(singlePhase, phaseCount, aRemHP);
    }

    // Build phases array (with optional gaze phase between thrown and melee)
    const phases = [
      { label: thrownLabel,
        atkDist: [1], atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
        defDist: phase1Dist, defHP: bRemHP, defHPper: b.hp, defFigs: bAlive,
        atkDestroyPct: 0, defDestroyPct: pDestroyBThrown },
    ];
    if (aGazeActive) {
      let aGazeLabel = 'Attacker ' + gazeLabel(aStoningGazeActive, aDeathGazeActive, aDoomGazeActive);
      if (aPoisonWithGaze)    aGazeLabel += ' + Poison Touch';
      if (aStoningWithGaze)   aGazeLabel += ' + Stoning Touch';
      if (aLifeStealWithGaze) aGazeLabel += ' + Life Steal';
      if (aImmWithGaze)       aGazeLabel += ' + Immolation';
      phases.push({ label: aGazeLabel,
        atkDist: [1], atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
        defDist: gazeOnlyToB, defHP: bRemHP, defHPper: b.hp, defFigs: bAlive,
        atkDestroyPct: 0, defDestroyPct: pDestroyBAfterAGaze });
    }
    if (bGazeActive) {
      let bGazeLabel = 'Defender ' + gazeLabel(bStoningGazeActive, bDeathGazeActive, bDoomGazeActive);
      if (bPoisonWithGaze)    bGazeLabel += ' + Poison Touch';
      if (bStoningWithGaze)   bGazeLabel += ' + Stoning Touch';
      if (bLifeStealWithGaze) bGazeLabel += ' + Life Steal';
      if (bImmWithGaze)       bGazeLabel += ' + Immolation';
      phases.push({ label: bGazeLabel,
        atkDist: gazeOnlyToA, atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
        defDist: [1], defHP: bRemHP, defHPper: b.hp, defFigs: bAlive,
        atkDestroyPct: pDestroyAAtBGaze, defDestroyPct: pDestroyBAtBGaze });
    }
    if (wofOnlyToA1) {
      phases.push({ label: 'Wall of Fire',
        atkDist: wofOnlyToA1, atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
        defDist: [1], defHP: bRemHP, defHPper: b.hp, defFigs: bAlive,
        atkDestroyPct: pDestroyAAtWof1, defDestroyPct: pDestroyBAtBGaze });
    }
    if (fearPhaseDists1) {
      phases.push({ label: simultaneousFearLabel, mode: 'feared',
        atkDist: fearPhaseDists1.atkFearedDist, defDist: fearPhaseDists1.defFearedDist });
    }
    if (fearBeforeFS1) {
      phases.push({ label: 'Defender Cause Fear', mode: 'feared',
        atkDist: fearBeforeFS1.atkFearedDist, defDist: fearBeforeFS1.defFearedDist });
    }
    if (fsHasteSplit) {
      // Phase 1: First Strike (A only, B untouched)
      phases.push({ label: meleePhaseLabel,
        atkDist: [1], atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
        defDist: meleeOnlyToB, defHP: bRemHP, defHPper: b.hp, defFigs: bAlive,
        atkDestroyPct: pDestroyAAtWof1, defDestroyPct: pDestroyBAfterFS1 });
      // A's fear fires after FS but before 2nd strike + counter (step 6)
      if (fearAfterFS1) {
        phases.push({ label: 'Attacker Cause Fear', mode: 'feared',
          atkDist: fearAfterFS1.atkFearedDist, defDist: fearAfterFS1.defFearedDist });
      }
      // Phase 2: A's 2nd strike simultaneous with B's counter
      phases.push({ label: 'Hasted 2nd Strike' + meleeTouchSuffix + counterSuffix,
        atkDist: counterOnlyToA, atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
        defDist: secondStrikeOnlyToBT, defHP: bRemHP, defHPper: b.hp, defFigs: bAlive,
        atkDestroyPct: pDestroyAFinal1, defDestroyPct: pDestroyBFinal1 });
    } else if (hasFirstStrike) {
      // FS without Haste: separate FS and counter rows with A's fear between them
      const counterLabelT = (bCounterHaste ? 'Hasted Counter-attack' : 'Counter-attack') + bTouchSuffixT;
      phases.push({ label: 'First Strike' + aTouchSuffixT,
        atkDist: [1], atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
        defDist: meleeOnlyToB, defHP: bRemHP, defHPper: b.hp, defFigs: bAlive,
        atkDestroyPct: pDestroyAAtWof1, defDestroyPct: pDestroyBAfterFS1 });
      if (fearAfterFS1) {
        phases.push({ label: 'Attacker Cause Fear', mode: 'feared',
          atkDist: fearAfterFS1.atkFearedDist, defDist: fearAfterFS1.defFearedDist });
      }
      phases.push({ label: counterLabelT,
        atkDist: counterOnlyToA, atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
        defDist: [1], defHP: bRemHP, defHPper: b.hp, defFigs: bAlive,
        atkDestroyPct: pDestroyAFinal1, defDestroyPct: pDestroyBFinal1 });
    } else {
      phases.push({ label: meleePhaseLabel,
        atkDist: counterOnlyToA, atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
        defDist: meleeOnlyToB, defHP: bRemHP, defHPper: b.hp, defFigs: bAlive,
        atkDestroyPct: pDestroyAFinal1, defDestroyPct: pDestroyBFinal1 });
    }

    return {
      phases,
      totalDmgToA,
      totalDmgToB,
      aLifeStealDist: aLifeStealDistT,
      aLifeStealExpected: aLifeStealExpectedT,
      bLifeStealDist: bLifeStealDistT,
      bLifeStealExpected: bLifeStealExpectedT,
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
    const aStoningFail = aStoningOn ? stoningFailProb(bResStoning, b.abilities, a.abilities.stoningTouch, opts.version) : 0;
    const bStoningFail = bStoningOn ? stoningFailProb(aResStoning, a.abilities, b.abilities.stoningTouch, opts.version) : 0;

    const aDispelEvilFail = (a.abilities && a.abilities.dispelEvil
      && touchAttackFires(a.atk, a.baseAtk, opts.version))
      ? dispelEvilFailProb(bResM, b.abilities, b.unitType, opts.version) : 0;
    const bDispelEvilFail = (b.abilities && b.abilities.dispelEvil
      && touchAttackFires(b.atk, b.baseAtk, opts.version))
      ? dispelEvilFailProb(aResM, a.abilities, a.unitType, opts.version) : 0;

    // Life steal setup
    const aLifeStealOnM = a.abilities && a.abilities.lifeSteal != null
      && touchAttackFires(a.atk, a.baseAtk, opts.version);
    const aLifeStealModM = aLifeStealOnM ? lifeStealEffective(bResDeath, b.abilities, a.abilities.lifeSteal, opts.version) : null;
    const bLifeStealOnM = b.abilities && b.abilities.lifeSteal != null
      && touchAttackFires(b.atk, b.baseAtk, opts.version);
    const bLifeStealModM = bLifeStealOnM ? lifeStealEffective(aResDeath, a.abilities, b.abilities.lifeSteal, opts.version) : null;

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
    const aGazeRangedActive = (a.effectiveGazeRanged || 0) > 0;
    const bGazeRangedActive = (b.effectiveGazeRanged || 0) > 0;
    const aGazeActive = !aBlackSleep && (aStoningGazeActive || aDeathGazeActive || aDoomGazeActive || aGazeRangedActive);
    const bGazeActive = !bBlackSleep && (bStoningGazeActive || bDeathGazeActive || bDoomGazeActive || bGazeRangedActive);
    const aStoningGazeFail = aStoningGazeActive
      ? stoningFailProb(bResStoning, b.abilities, a.abilities.stoningGaze, opts.version) : 0;
    const bStoningGazeFail = bStoningGazeActive
      ? stoningFailProb(aResStoning, a.abilities, b.abilities.stoningGaze, opts.version) : 0;
    const aDeathGazeFail = aDeathGazeActive
      ? deathGazeFailProb(bResDeath, b.abilities, a.abilities.deathGaze, opts.version) : 0;
    const bDeathGazeFail = bDeathGazeActive
      ? deathGazeFailProb(aResDeath, a.abilities, b.abilities.deathGaze, opts.version) : 0;
    const hasGaze = aGazeActive || bGazeActive;

    // Touch attack activation for pure melee path
    const aImmWithGazeM = aHasImm && aGazeActive;
    const bImmWithGazeM = bHasImm && bGazeActive;
    const aImmWithMeleeM = aHasImm && touchAttackFires(a.atk, a.baseAtk, opts.version);
    const bImmWithMeleeM = bHasImm && touchAttackFires(b.atk, b.baseAtk, opts.version);
    // Gaze touch: use raw ability values (not gated by melee atk) so pure-gaze units still trigger
    const aPoisonStrG    = (a.abilities && a.abilities.poison) || 0;
    const bPoisonStrG    = (b.abilities && b.abilities.poison) || 0;
    const aPoisonFailG   = aPoisonStrG  > 0 ? poisonFailProb(b.res, b.abilities, opts.version) : 0;
    const bPoisonFailG   = bPoisonStrG  > 0 ? poisonFailProb(a.res, a.abilities, opts.version) : 0;
    const aStoningOnG    = a.abilities && a.abilities.stoningTouch != null;
    const bStoningOnG    = b.abilities && b.abilities.stoningTouch != null;
    const aStoningFailG  = aStoningOnG ? stoningFailProb(bResStoning, b.abilities, a.abilities.stoningTouch, opts.version) : 0;
    const bStoningFailG  = bStoningOnG ? stoningFailProb(aResStoning, a.abilities, b.abilities.stoningTouch, opts.version) : 0;
    const aLifeStealModG = (a.abilities && a.abilities.lifeSteal != null) ? lifeStealEffective(bResDeath, b.abilities, a.abilities.lifeSteal, opts.version) : null;
    const bLifeStealModG = (b.abilities && b.abilities.lifeSteal != null) ? lifeStealEffective(aResDeath, a.abilities, b.abilities.lifeSteal, opts.version) : null;
    const aPoisonWithGazeM    = aPoisonFailG  > 0 && !aBlackSleep && aGazeActive;
    const bPoisonWithGazeM    = bPoisonFailG  > 0 && !bBlackSleep && bGazeActive;
    const aStoningWithGazeM   = aStoningFailG > 0 && !aBlackSleep && aGazeActive;
    const bStoningWithGazeM   = bStoningFailG > 0 && !bBlackSleep && bGazeActive;
    const aLifeStealWithGazeM = aLifeStealModG !== null && !aBlackSleep && aGazeActive;
    const bLifeStealWithGazeM = bLifeStealModG !== null && !bBlackSleep && bGazeActive;

    if (hasGaze) {
      // Multi-phase: Gaze (attacker first, then defender) → Melee + Counter
      // Pre-compute B's gaze distribution (count-independent portion; targets A).
      // Touch attacks scale with B's surviving count and are added per-iteration below.
      let bGazeDistNoTouch2 = bGazeActive
        ? buildGazeDist(b, a, aAlive, aRemHP, bStoningGazeFail, bDeathGazeFail, bDoomGazeStr, aDefForGaze, aInvulnBonus, aBlurChance, blurBuggy,
            isCoM2 ? woundedTopFigHP(aRemHP, a.hp) : undefined, aBlackSleep, aToBlockVsBAll, bMinDamageFromHits)
        : [1];
      if (aAlive > 0 && aRemHP > 0 && bImmWithGazeM) {
        bGazeDistNoTouch2 = convolveDists(bGazeDistNoTouch2,
          calcAreaDamageDist(aAlive, immStr, b.toHitImmolation, aDefForImm, aToBlockVsBAll, a.hp, aRemHP, aInvulnBonus, bMinDamageFromHits), aRemHP);
      }
      // Cache full gaze+touch distributions by B's alive count.
      const bGazeDistsByAlive2 = new Array(b.figs + 1).fill(null);

      const totalDmgToB = new Array(bRemHP + 1).fill(0);
      const totalDmgToA = new Array(aRemHP + 1).fill(0);
      const gazeOnlyToB = new Array(bRemHP + 1).fill(0);
      const gazeOnlyToA = new Array(aRemHP + 1).fill(0);
      const meleeOnlyToB = new Array(bRemHP + 1).fill(0);
      const meleeOnlyToA = new Array(aRemHP + 1).fill(0);
      const secondStrikeOnlyToBG = (hasFirstStrike && aHaste) ? new Array(bRemHP + 1).fill(0) : null;
      // Marginal survivor distributions for fear display (accounts for gaze+WoF casualties).
      const defSurvG = bFearedByA ? new Array(b.figs + 1).fill(0) : null;
      const atkSurvG = (aFearedByB || aFearBug) ? new Array(a.figs + 1).fill(0) : null;
      // Cumulative P(destroyed) scalars for phase breakdown "% destroyed" display.
      let pDestroyAAfterWof2 = 0; // P(A destroyed after B-gaze + WoF)
      let pDestroyBAfterFS2 = 0;  // P(B destroyed after A-gaze + FS) [FS path only]
      let aLifeStealExpectedM = 0;
      let bLifeStealExpectedM = 0;

      // A's gaze: physical ranged + doom + stoning + death effects on B's figures
      let aGazeDist = aGazeActive
        ? buildGazeDist(a, b, bAlive, bRemHP, aStoningGazeFail, aDeathGazeFail, aDoomGazeStr, bDefForGaze, bInvulnBonus, bBlurChance, blurBuggy,
            isCoM2 ? woundedTopFigHP(bRemHP, b.hp) : undefined, bBlackSleep, bToBlockVsAAll, aMinDamageFromHits)
        : [1];
      if (aAlive > 0 && bAlive > 0 && bRemHP > 0) {
        if (aImmWithGazeM) {
          aGazeDist = convolveDists(aGazeDist,
            calcAreaDamageDist(bAlive, immStr, a.toHitImmolation, bDefForImm, bToBlockVsAAll, b.hp, bRemHP, bInvulnBonus, aMinDamageFromHits), bRemHP);
        }
        if (aPoisonWithGazeM) {
          aGazeDist = convolveDists(aGazeDist,
            calcResistDmgDist(aAlive * aPoisonStrG, aPoisonFailG, bRemHP), bRemHP);
        }
        if (aStoningWithGazeM) {
          aGazeDist = convolveDists(aGazeDist,
            calcFigureKillDmgDist(aAlive, aStoningFailG, b.hp, bRemHP), bRemHP);
        }
        if (aLifeStealWithGazeM) {
          aLifeStealExpectedM += expectedDamage(calcLifeStealDmgDist(aAlive, bResDeath, aLifeStealModG, bRemHP));
          aGazeDist = convolveDists(aGazeDist,
            calcLifeStealDmgDist(aAlive, bResDeath, aLifeStealModG, bRemHP), bRemHP);
        }
      }

      const wofOnlyToA2 = wallOfFireActive ? new Array(aRemHP + 1).fill(0) : null;

      for (let aGzDmg = 0; aGzDmg < aGazeDist.length; aGzDmg++) {
        if (aGazeDist[aGzDmg] < 1e-15) continue;

        const bDmgAfterAGaze = b.dmg + aGzDmg;
        const bAliveAfterGaze = Math.max(0, b.figs - Math.floor(bDmgAfterAGaze / b.hp));
        const bRemHPAfterGaze = Math.max(0, bRemHP - aGzDmg);

        // B's gaze: build distribution for this bAliveAfterGaze (touch strength scales with count).
        let bGazeDist;
        if (bAliveAfterGaze <= 0) {
          bGazeDist = [1];
        } else {
          if (!bGazeDistsByAlive2[bAliveAfterGaze]) {
            let gd = bGazeDistNoTouch2.slice();
            if (bPoisonWithGazeM) gd = convolveDists(gd, calcResistDmgDist(bAliveAfterGaze * bPoisonStrG, bPoisonFailG, aRemHP), aRemHP);
            if (bStoningWithGazeM) gd = convolveDists(gd, calcFigureKillDmgDist(bAliveAfterGaze, bStoningFailG, a.hp, aRemHP), aRemHP);
            if (bLifeStealWithGazeM) gd = convolveDists(gd, calcLifeStealDmgDist(bAliveAfterGaze, aResDeath, bLifeStealModG, aRemHP), aRemHP);
            bGazeDistsByAlive2[bAliveAfterGaze] = gd;
          }
          bGazeDist = bGazeDistsByAlive2[bAliveAfterGaze];
        }

        // Accumulate B's survivor distribution before fear (depends only on A-gaze, not B-gaze).
        if (defSurvG) defSurvG[bAliveAfterGaze] += aGazeDist[aGzDmg];
        if (bLifeStealWithGazeM && bAliveAfterGaze > 0) {
          bLifeStealExpectedM += aGazeDist[aGzDmg] * expectedDamage(calcLifeStealDmgDist(bAliveAfterGaze, aResDeath, bLifeStealModG, aRemHP));
        }

        for (let bGzDmg = 0; bGzDmg < bGazeDist.length; bGzDmg++) {
          if (bGazeDist[bGzDmg] < 1e-15) continue;
          const pGaze = aGazeDist[aGzDmg] * bGazeDist[bGzDmg];

          const aAliveAfterGaze = Math.max(0, a.figs - Math.floor((a.dmg + bGzDmg) / a.hp));
          const aRemHPAfterGaze = Math.max(0, aRemHP - bGzDmg);

          // Accumulate gaze damage (independent of Wall of Fire outcome)
          gazeOnlyToB[Math.min(aGzDmg, bRemHP)] += pGaze;
          gazeOnlyToA[Math.min(bGzDmg, aRemHP)] += pGaze;

          // Wall of Fire fires between gaze and melee, on aAliveAfterGaze figures
          const wofDist2 = (wallOfFireActive && aAliveAfterGaze > 0 && aRemHPAfterGaze > 0)
            ? calcAreaDamageDist(aAliveAfterGaze, wofStr, wofToHit, aDefForImm, a.toBlock, a.hp, aRemHPAfterGaze, aInvulnBonus, null)
            : [1];

          for (let wofDmg = 0; wofDmg < wofDist2.length; wofDmg++) {
            const pWof = wofDist2[wofDmg];
            if (pWof < 1e-15) continue;
            const pGW = pGaze * pWof;
            if (wofOnlyToA2) wofOnlyToA2[Math.min(wofDmg, aRemHP)] += pGW;
            // Accumulate cumulative P(A destroyed after B-gaze + WoF).
            if (bGzDmg + wofDmg >= aRemHP) pDestroyAAfterWof2 += pGW;

            const aAliveAfterWof = Math.max(0, a.figs - Math.floor((a.dmg + bGzDmg + wofDmg) / a.hp));
            const aRemHPAfterWof = Math.max(0, aRemHPAfterGaze - wofDmg);

            // Accumulate A's survivor distribution before fear (after B-gaze + WoF).
            if (atkSurvG) atkSurvG[aAliveAfterWof] += pGW;

            // Melee: attacker → defender (post-gaze+WoF figures), with Cause Fear
            // When a.atk <= 0, calcMeleeTouchDmg returns [1] (zero damage) for A's attack,
            // but B still counter-attacks normally (A initiated combat via gaze).
            const aImmMDist2 = aImmWithMeleeM && aAliveAfterWof > 0 && bAliveAfterGaze > 0 && bRemHPAfterGaze > 0
              ? calcAreaDamageDist(bAliveAfterGaze, immStr, a.toHitImmolation, bDefForImm, bToBlockVsAAll, b.hp, bRemHPAfterGaze, bInvulnBonus, aMinDamageFromHits) : null;
            const bImmMDist2 = bImmWithMeleeM && aAliveAfterWof > 0 && aRemHPAfterWof > 0
              ? calcAreaDamageDist(aAliveAfterWof, immStr, b.toHitImmolation, aDefForImm, aToBlockVsBAll, a.hp, aRemHPAfterWof, aInvulnBonus, bMinDamageFromHits) : null;
            const aUnfeared2 = aFearedByB ? calcFearDist(aAliveAfterWof, aPFear)
                             : aFearBug ? calcFearBugDist(aAliveAfterWof, bAliveAfterGaze, bPFear)
                             : null;
            const aUnfeared_preFS2 = hasFirstStrike
              ? (aFearedByB ? calcFearDist(aAliveAfterWof, aPFear) : null)
              : null;
            // A's melee: single under FS (Haste's 2nd strike split out), doubled otherwise.
            const meleeOutcome = calcMeleeTouchOutcome(
              hasFirstStrike ? aUnfeared_preFS2 : aUnfeared2,
              aAliveAfterWof, aDoomsB, aBlackSleep ? 0 : aMeleeAtkVsB, aToHitMeleeVert,
              bDefVsA, bToBlockVsAMelee, b.hp, bRemHPAfterGaze,
              aPoisonStr, aPoisonFail, aStoningFail, aDispelEvilFail, aLifeStealModM, bResDeath,
              aImmMDist2, bInvulnBonus, bBlurChance, blurBuggy,
              hasFirstStrike ? false : aHaste,
              isCoM2 ? woundedTopFigHP(bRemHPAfterGaze, b.hp) : undefined,
              aMinDamageFromHits);
            const meleeDist = meleeOutcome.damageDist;
            aLifeStealExpectedM += pGW * meleeOutcome.lifeStealEV;

            if (hasFirstStrike && (!isCoM1Only || woundedTopFigHP(bRemHPAfterGaze, b.hp) <= 24)) {
              // A's melee resolves before B's counter; counter uses post-melee survivors.
              // With Haste, A also gets a 2nd strike simultaneous with B's counter.
              for (let mDmg = 0; mDmg < meleeDist.length; mDmg++) {
                if (meleeDist[mDmg] < 1e-15) continue;
                const pM = pGW * meleeDist[mDmg];
                meleeOnlyToB[Math.min(mDmg, bRemHP)] += pM;
                // Accumulate cumulative P(B destroyed after A-gaze + FS).
                if (aGzDmg + mDmg >= bRemHP) pDestroyBAfterFS2 += pM;

                const bDmgAfterMelee = bDmgAfterAGaze + mDmg;
                const bAliveAfterMelee = Math.max(0, b.figs - Math.floor(bDmgAfterMelee / b.hp));
                const bRemHPAfterMelee = Math.max(0, bRemHPAfterGaze - mDmg);
                const bUnfearedFS2 = bFearedByA ? calcFearDist(bAliveAfterMelee, bPFear) : null;
                const bImmFSDist2 = bImmWithMeleeM && aAliveAfterWof > 0 && aRemHPAfterWof > 0
                  ? calcAreaDamageDist(aAliveAfterWof, immStr, b.toHitImmolation, aDefForImm, aToBlockVsBAll, a.hp, aRemHPAfterWof, aInvulnBonus, bMinDamageFromHits) : null;
                const counterOutcome = calcMeleeTouchOutcome(bUnfearedFS2, bAliveAfterMelee, bDoomsA, bBlackSleep ? 0 : bMeleeAtkVsA, bToHitMeleeVert,
                  aDefVsB, aToBlockVsBMelee, a.hp, aRemHPAfterWof,
                  bPoisonStr, bPoisonFail, bStoningFail, bDispelEvilFail, bLifeStealModM, aResDeath,
                  bImmFSDist2, aInvulnBonus, aBlurChance, blurBuggy,
                  bCounterHaste,
                  isCoM2 ? woundedTopFigHP(aRemHPAfterWof, a.hp) : undefined,
                  bMinDamageFromHits);
                const counterDist = counterOutcome.damageDist;
                bLifeStealExpectedM += pM * counterOutcome.lifeStealEV;

                // A's hasted 2nd strike (simultaneous with counter), targeting post-FS B.
                let secondDmgToB;
                if (aHaste && aAliveAfterWof > 0 && bRemHPAfterMelee > 0) {
                  const aImm2nd = aImmWithMeleeM && bAliveAfterMelee > 0 && bRemHPAfterMelee > 0
                    ? calcAreaDamageDist(bAliveAfterMelee, immStr, a.toHitImmolation, bDefForImm, bToBlockVsAAll, b.hp, bRemHPAfterMelee, bInvulnBonus, aMinDamageFromHits) : null;
                  const secondOutcome = calcMeleeTouchOutcome(aUnfeared2, aAliveAfterWof, aDoomsB, aBlackSleep ? 0 : aMeleeAtkVsB, aToHitMeleeVert,
                    bDefVsA, bToBlockVsAMelee, b.hp, bRemHPAfterMelee,
                    aPoisonStr, aPoisonFail, aStoningFail, aDispelEvilFail, aLifeStealModM, bResDeath,
                    aImm2nd, bInvulnBonus, bBlurChance, blurBuggy,
                    false,
                    isCoM2 ? woundedTopFigHP(bRemHPAfterMelee, b.hp) : undefined,
                    aMinDamageFromHits);
                  secondDmgToB = secondOutcome.damageDist;
                  aLifeStealExpectedM += pM * secondOutcome.lifeStealEV;
                } else {
                  secondDmgToB = [1];
                }

                for (let sDmg = 0; sDmg < secondDmgToB.length; sDmg++) {
                  const pS = secondDmgToB[sDmg];
                  if (pS < 1e-15) continue;
                  totalDmgToB[Math.min(aGzDmg + mDmg + sDmg, bRemHP)] += pM * pS;
                  if (secondStrikeOnlyToBG) secondStrikeOnlyToBG[Math.min(sDmg, bRemHP)] += pM * pS;
                }
                for (let cDmg = 0; cDmg < counterDist.length; cDmg++) {
                  if (counterDist[cDmg] < 1e-15) continue;
                  const v = pM * counterDist[cDmg];
                  totalDmgToA[Math.min(bGzDmg + wofDmg + cDmg, aRemHP)] += v;
                  meleeOnlyToA[Math.min(cDmg, aRemHP)] += v;
                }
              }
              continue;
            }

            // Simultaneous: counter uses post-gaze+WoF figures
            const bUnfeared2 = bFearedByA ? calcFearDist(bAliveAfterGaze, bPFear) : null;
            const counterOutcome = calcMeleeTouchOutcome(bUnfeared2, bAliveAfterGaze, bDoomsA, bBlackSleep ? 0 : bMeleeAtkVsA, bToHitMeleeVert,
              aDefVsB, aToBlockVsBMelee, a.hp, aRemHPAfterWof,
              bPoisonStr, bPoisonFail, bStoningFail, bDispelEvilFail, bLifeStealModM, aResDeath,
              bImmMDist2, aInvulnBonus, aBlurChance, blurBuggy,
              bCounterHaste,
              isCoM2 ? woundedTopFigHP(aRemHPAfterWof, a.hp) : undefined,
              bMinDamageFromHits);
            const counterDist = counterOutcome.damageDist;
            bLifeStealExpectedM += pGW * counterOutcome.lifeStealEV;

            for (let mDmg = 0; mDmg < meleeDist.length; mDmg++) {
              if (meleeDist[mDmg] < 1e-15) continue;
              totalDmgToB[Math.min(aGzDmg + mDmg, bRemHP)] += pGW * meleeDist[mDmg];
              meleeOnlyToB[Math.min(mDmg, bRemHP)] += pGW * meleeDist[mDmg];
            }
            for (let cDmg = 0; cDmg < counterDist.length; cDmg++) {
              if (counterDist[cDmg] < 1e-15) continue;
              totalDmgToA[Math.min(bGzDmg + wofDmg + cDmg, aRemHP)] += pGW * counterDist[cDmg];
              meleeOnlyToA[Math.min(cDmg, aRemHP)] += pGW * counterDist[cDmg];
            }
          }
        }
      }

      // Phase labels. Under FS+Haste we emit two rows (FS alone, then 2nd strike + counter);
      // otherwise one simultaneous melee+counter row.
      let meleeTouchSuffix2 = '';
      if (aPoisonFail > 0 || bPoisonFail > 0) meleeTouchSuffix2 += ' + Poison Touch';
      if (aStoningFail > 0 || bStoningFail > 0) meleeTouchSuffix2 += ' + Stoning Touch';
      if (aDispelEvilFail > 0 || bDispelEvilFail > 0) meleeTouchSuffix2 += ' + Dispel Evil';
      if (aLifeStealModM !== null || bLifeStealModM !== null) meleeTouchSuffix2 += ' + Life Steal';
      if (aImmWithMeleeM || bImmWithMeleeM) meleeTouchSuffix2 += ' + Immolation';
      let aTouchSuffixM = '';
      if (aPoisonFail > 0)        aTouchSuffixM += ' + Poison Touch';
      if (aStoningFail > 0)       aTouchSuffixM += ' + Stoning Touch';
      if (aDispelEvilFail > 0)    aTouchSuffixM += ' + Dispel Evil';
      if (aLifeStealModM !== null) aTouchSuffixM += ' + Life Steal';
      if (aImmWithMeleeM)         aTouchSuffixM += ' + Immolation';
      let bTouchSuffixM = '';
      if (bPoisonFail > 0)        bTouchSuffixM += ' + Poison Touch';
      if (bStoningFail > 0)       bTouchSuffixM += ' + Stoning Touch';
      if (bDispelEvilFail > 0)    bTouchSuffixM += ' + Dispel Evil';
      if (bLifeStealModM !== null) bTouchSuffixM += ' + Life Steal';
      if (bImmWithMeleeM)         bTouchSuffixM += ' + Immolation';
      const counterSuffix2 = bCounterHaste ? ' + Hasted Counter-attack' : ' + Counter-attack';
      const meleeBase2 = hasFirstStrike ? 'First Strike' : (aHaste ? 'Hasted Melee' : 'Melee');
      const fsHasteSplit2 = hasFirstStrike && aHaste;
      const meleeLabel = fsHasteSplit2
        ? meleeBase2 + aTouchSuffixM
        : meleeBase2 + meleeTouchSuffix2 + counterSuffix2;

      const fearPhaseDists2 = hasFirstStrike
        ? null
        : buildFearPhaseDists(aAlive, bAlive, bPFear, aPFear, aFearedByB, aFearBug, bFearedByA, showFearNoop, defSurvG, atkSurvG);
      const fearBeforeFS2 = hasFirstStrike
        ? buildFearPhaseDists(aAlive, bAlive, bPFear, aPFear, aFearedByB, false, false, showFearNoop, defSurvG, atkSurvG)
        : null;
      const fearAfterFS2 = hasFirstStrike
        ? buildFearPhaseDists(aAlive, bAlive, bPFear, aPFear, false, aFearBug, bFearedByA, false, defSurvG, atkSurvG)
        : null;

      // Life steal PMFs below remain approximate, but the displayed summary EV is exact.
      let aLifeStealDistM = null, bLifeStealDistM = null;
      const aLifeStealSummaryMod = aLifeStealModG !== null ? aLifeStealModG : aLifeStealModM;
      const bLifeStealSummaryMod = bLifeStealModG !== null ? bLifeStealModG : bLifeStealModM;
      if (aLifeStealSummaryMod !== null && aAlive > 0 && bRemHP > 0) {
        const singlePhase = calcLifeStealDmgDist(aAlive, bResDeath, aLifeStealSummaryMod, bRemHP);
        const phaseCount = (aLifeStealWithGazeM ? 1 : 0) + (aLifeStealOnM ? 1 : 0);
        aLifeStealDistM = repeatDist(singlePhase, phaseCount, bRemHP);
      }
      if (bLifeStealSummaryMod !== null && bAlive > 0 && aRemHP > 0) {
        const singlePhase = calcLifeStealDmgDist(bAlive, aResDeath, bLifeStealSummaryMod, aRemHP);
        const phaseCount = (bLifeStealWithGazeM ? 1 : 0) + (bLifeStealOnM ? 1 : 0);
        bLifeStealDistM = repeatDist(singlePhase, phaseCount, aRemHP);
      }

      // Cumulative P(destroyed) at each phase endpoint for "% destroyed" display.
      const pDestroyBAtAGaze2 = aGazeActive ? pDestroyedFrom(gazeOnlyToB, bRemHP) : 0;
      const pDestroyAAtBGaze2 = bGazeActive ? pDestroyedFrom(gazeOnlyToA, aRemHP) : 0;
      const pDestroyAAtWof2b = wallOfFireActive ? pDestroyAAfterWof2 : pDestroyAAtBGaze2;
      const pDestroyBFinal2 = pDestroyedFrom(totalDmgToB, bRemHP);
      const pDestroyAFinal2 = pDestroyedFrom(totalDmgToA, aRemHP);

      const gazePhases = [];
      if (aGazeActive) {
        let aGzLabel2 = 'Attacker ' + gazeLabel(aStoningGazeActive, aDeathGazeActive, aDoomGazeActive);
        if (aPoisonWithGazeM)    aGzLabel2 += ' + Poison Touch';
        if (aStoningWithGazeM)   aGzLabel2 += ' + Stoning Touch';
        if (aLifeStealWithGazeM) aGzLabel2 += ' + Life Steal';
        if (aImmWithGazeM)       aGzLabel2 += ' + Immolation';
        gazePhases.push({ label: aGzLabel2,
          atkDist: [1], atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
          defDist: gazeOnlyToB, defHP: bRemHP, defHPper: b.hp, defFigs: bAlive,
          atkDestroyPct: 0, defDestroyPct: pDestroyBAtAGaze2 });
      }
      if (bGazeActive) {
        let bGzLabel2 = 'Defender ' + gazeLabel(bStoningGazeActive, bDeathGazeActive, bDoomGazeActive);
        if (bPoisonWithGazeM)    bGzLabel2 += ' + Poison Touch';
        if (bStoningWithGazeM)   bGzLabel2 += ' + Stoning Touch';
        if (bLifeStealWithGazeM) bGzLabel2 += ' + Life Steal';
        if (bImmWithGazeM)       bGzLabel2 += ' + Immolation';
        gazePhases.push({ label: bGzLabel2,
          atkDist: gazeOnlyToA, atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
          defDist: [1], defHP: bRemHP, defHPper: b.hp, defFigs: bAlive,
          atkDestroyPct: pDestroyAAtBGaze2, defDestroyPct: pDestroyBAtAGaze2 });
      }

      const wofPhase2 = wofOnlyToA2
        ? [{ label: 'Wall of Fire',
            atkDist: wofOnlyToA2, atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
            defDist: [1], defHP: bRemHP, defHPper: b.hp, defFigs: bAlive,
            atkDestroyPct: pDestroyAAtWof2b, defDestroyPct: pDestroyBAtAGaze2 }]
        : [];

      const fearPhase2Label = fearBeforeFS2 ? 'Defender Cause Fear' : simultaneousFearLabel;
      const fearPhase2 = (fearPhaseDists2 || fearBeforeFS2)
        ? [{ label: fearPhase2Label, mode: 'feared',
             atkDist: (fearBeforeFS2 || fearPhaseDists2).atkFearedDist,
             defDist: (fearBeforeFS2 || fearPhaseDists2).defFearedDist }]
        : [];

      let meleePhases2;
      if (fsHasteSplit2) {
        meleePhases2 = [
          { label: meleeLabel,
            atkDist: [1], atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
            defDist: meleeOnlyToB, defHP: bRemHP, defHPper: b.hp, defFigs: bAlive,
            atkDestroyPct: pDestroyAAtWof2b, defDestroyPct: pDestroyBAfterFS2 },
          ...(fearAfterFS2 ? [{ label: 'Attacker Cause Fear', mode: 'feared',
              atkDist: fearAfterFS2.atkFearedDist, defDist: fearAfterFS2.defFearedDist }] : []),
          { label: 'Hasted 2nd Strike' + meleeTouchSuffix2 + counterSuffix2,
            atkDist: meleeOnlyToA, atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
            defDist: secondStrikeOnlyToBG, defHP: bRemHP, defHPper: b.hp, defFigs: bAlive,
            atkDestroyPct: pDestroyAFinal2, defDestroyPct: pDestroyBFinal2 },
        ];
      } else if (hasFirstStrike) {
        const counterLabel2g = (bCounterHaste ? 'Hasted Counter-attack' : 'Counter-attack') + bTouchSuffixM;
        meleePhases2 = [
          { label: 'First Strike' + aTouchSuffixM,
            atkDist: [1], atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
            defDist: meleeOnlyToB, defHP: bRemHP, defHPper: b.hp, defFigs: bAlive,
            atkDestroyPct: pDestroyAAtWof2b, defDestroyPct: pDestroyBAfterFS2 },
          ...(fearAfterFS2 ? [{ label: 'Attacker Cause Fear', mode: 'feared',
              atkDist: fearAfterFS2.atkFearedDist, defDist: fearAfterFS2.defFearedDist }] : []),
          { label: counterLabel2g,
            atkDist: meleeOnlyToA, atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
            defDist: [1], defHP: bRemHP, defHPper: b.hp, defFigs: bAlive,
            atkDestroyPct: pDestroyAFinal2, defDestroyPct: pDestroyBFinal2 },
        ];
      } else {
        meleePhases2 = [
          { label: meleeLabel,
            atkDist: meleeOnlyToA, atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
            defDist: meleeOnlyToB, defHP: bRemHP, defHPper: b.hp, defFigs: bAlive,
            atkDestroyPct: pDestroyAFinal2, defDestroyPct: pDestroyBFinal2 },
        ];
      }

      return {
        phases: [
          ...gazePhases,
          ...wofPhase2,
          ...fearPhase2,
          ...meleePhases2,
        ],
        totalDmgToA,
        totalDmgToB,
        aLifeStealDist: aLifeStealDistM,
        aLifeStealExpected: aLifeStealExpectedM,
        bLifeStealDist: bLifeStealDistM,
        bLifeStealExpected: bLifeStealExpectedM,
        aRemHP, aHP: a.hp, aAlive,
        bRemHP, bHP: b.hp, bAlive,
      };

    } else if (a.atk <= 0) {
      // No gaze and no melee attack — cannot engage in melee at all.
      return {
        phases: null,
        totalDmgToA: [1], totalDmgToB: [1],
        aRemHP, aHP: a.hp, aAlive,
        bRemHP, bHP: b.hp, bAlive,
      };

    } else {
      // --- No gaze: melee exchange (simultaneous, or sequential under First Strike) ---
      // Wall of Fire fires before melee, reducing A's alive count and remaining HP.
      // wofDist is trivial [1] when inactive, so the outer loop is a no-op in that case.
      const wofDist3 = (wallOfFireActive && aAlive > 0 && aRemHP > 0)
        ? calcAreaDamageDist(aAlive, wofStr, wofToHit, aDefForImm, a.toBlock, a.hp, aRemHP, aInvulnBonus, null)
        : [1];
      const wofOnlyToA3 = wallOfFireActive ? new Array(aRemHP + 1).fill(0) : null;

      // Marginal A-survivor distribution after WoF for fear display (fear fires after WoF).
      let atkSurvivors3 = null;
      if (wallOfFireActive) {
        atkSurvivors3 = new Array(a.figs + 1).fill(0);
        for (let wofDmg = 0; wofDmg < wofDist3.length; wofDmg++) {
          if (wofDist3[wofDmg] < 1e-15) continue;
          const aAliveAfterWof3 = Math.max(0, a.figs - Math.floor((a.dmg + wofDmg) / a.hp));
          atkSurvivors3[aAliveAfterWof3] += wofDist3[wofDmg];
        }
      }
      const fearPhaseDists3 = buildFearPhaseDists(aAlive, bAlive, bPFear, aPFear, aFearedByB, aFearBug, bFearedByA, showFearNoop, null, atkSurvivors3);

      // Life steal PMFs below remain approximate, but the displayed summary EV is exact.
      let aLifeStealDistM = null;
      if (aLifeStealModM !== null && aAlive > 0 && bRemHP > 0) {
        aLifeStealDistM = calcLifeStealDmgDist(aAlive, bResDeath, aLifeStealModM, bRemHP);
      }
      let bLifeStealDistM = null;
      if (bLifeStealModM !== null && bAlive > 0 && aRemHP > 0) {
        bLifeStealDistM = calcLifeStealDmgDist(bAlive, aResDeath, bLifeStealModM, aRemHP);
      }
      let aLifeStealExpectedM = 0;
      let bLifeStealExpectedM = 0;

      if (hasFirstStrike && (!isCoM1Only || woundedTopFigHP(bRemHP, b.hp) <= 24)) {
        // A's melee resolves first; B's counter-attack uses survivors after A's damage.
        // With Haste, A's second strike happens simultaneously with B's counter (step 7 in manual).
        const totalDmgToA = new Array(aRemHP + 1).fill(0);
        const totalDmgToB = new Array(bRemHP + 1).fill(0);
        const meleeOnlyToB = new Array(bRemHP + 1).fill(0);
        const counterOnlyToA = new Array(aRemHP + 1).fill(0);
        const secondStrikeOnlyToB = aHaste ? new Array(bRemHP + 1).fill(0) : null;

        for (let wofDmg = 0; wofDmg < wofDist3.length; wofDmg++) {
          const pWof = wofDist3[wofDmg];
          if (pWof < 1e-15) continue;
          if (wofOnlyToA3) wofOnlyToA3[Math.min(wofDmg, aRemHP)] += pWof;

          const aDmgAfterWof = a.dmg + wofDmg;
          const aAliveAfterWof = Math.max(0, a.figs - Math.floor(aDmgAfterWof / a.hp));
          const aRemHPAfterWof = Math.max(0, aRemHP - wofDmg);

          // Immolation dists post-WoF (area damage)
          const aImmMDist3 = aImmWithMeleeM && aAliveAfterWof > 0 && bAlive > 0 && bRemHP > 0
            ? calcAreaDamageDist(bAlive, immStr, a.toHitImmolation, bDefForImm, bToBlockVsAAll, b.hp, bRemHP, bInvulnBonus, aMinDamageFromHits) : null;

          const aUnfeared3 = aFearedByB ? calcFearDist(aAliveAfterWof, aPFear)
                           : aFearBug ? calcFearBugDist(aAliveAfterWof, bAlive, bPFear)
                           : null;
          // aFearBug fires at step 6 (after FS), so A's FS uses only aFearedByB.
          const aUnfeared_preFS3 = aFearedByB ? calcFearDist(aAliveAfterWof, aPFear) : null;
          // A's 1st strike is single under FS (Haste's 2nd strike is split out below).
          const meleeOutcomeFS3 = calcMeleeTouchOutcome(aUnfeared_preFS3, aAliveAfterWof, aDoomsB, aBlackSleep ? 0 : aMeleeAtkVsB, aToHitMeleeVert,
            bDefVsA, bToBlockVsAMelee, b.hp, bRemHP,
            aPoisonStr, aPoisonFail, aStoningFail, aDispelEvilFail, aLifeStealModM, bResDeath,
            aImmMDist3, bInvulnBonus, bBlurChance, blurBuggy,
            false,
            isCoM2 ? woundedTopFigHP(bRemHP, b.hp) : undefined,
            aMinDamageFromHits);
          const dmgToB = meleeOutcomeFS3.damageDist;
          aLifeStealExpectedM += pWof * meleeOutcomeFS3.lifeStealEV;

          for (let mDmg = 0; mDmg < dmgToB.length; mDmg++) {
            const pM = dmgToB[mDmg];
            if (pM < 1e-15) continue;
            const pCombinedM = pWof * pM;
            meleeOnlyToB[Math.min(mDmg, bRemHP)] += pCombinedM;

            const bDmgAfter = b.dmg + mDmg;
            const bAliveAfter = Math.max(0, b.figs - Math.floor(bDmgAfter / b.hp));
            const bRemHPAfter = Math.max(0, bRemHP - mDmg);
            const bUnfearedFS3 = bFearedByA ? calcFearDist(bAliveAfter, bPFear) : null;
            const bImmMDist3 = bImmWithMeleeM && aAliveAfterWof > 0 && aRemHPAfterWof > 0
              ? calcAreaDamageDist(aAliveAfterWof, immStr, b.toHitImmolation, aDefForImm, aToBlockVsBAll, a.hp, aRemHPAfterWof, aInvulnBonus, bMinDamageFromHits) : null;
            const counterOutcomeFS3 = calcMeleeTouchOutcome(bUnfearedFS3, bAliveAfter, bDoomsA, bBlackSleep ? 0 : bMeleeAtkVsA, bToHitMeleeVert,
              aDefVsB, aToBlockVsBMelee, a.hp, aRemHPAfterWof,
              bPoisonStr, bPoisonFail, bStoningFail, bDispelEvilFail, bLifeStealModM, aResDeath,
              bImmMDist3, aInvulnBonus, aBlurChance, blurBuggy,
              bCounterHaste,
              isCoM2 ? woundedTopFigHP(aRemHPAfterWof, a.hp) : undefined,
              bMinDamageFromHits);
            const counterDist = counterOutcomeFS3.damageDist;
            bLifeStealExpectedM += pCombinedM * counterOutcomeFS3.lifeStealEV;

            // A's hasted 2nd strike: targets post-FS B figures, simultaneous with B's counter.
            // A's figure count is unchanged (A has not been hit yet by WoF-excluded damage).
            let secondDmgToB;
            if (aHaste && aAliveAfterWof > 0 && bRemHPAfter > 0) {
              const aImm2nd = aImmWithMeleeM && bAliveAfter > 0 && bRemHPAfter > 0
                ? calcAreaDamageDist(bAliveAfter, immStr, a.toHitImmolation, bDefForImm, bToBlockVsAAll, b.hp, bRemHPAfter, bInvulnBonus, aMinDamageFromHits) : null;
              const secondOutcomeFS3 = calcMeleeTouchOutcome(aUnfeared3, aAliveAfterWof, aDoomsB, aBlackSleep ? 0 : aMeleeAtkVsB, aToHitMeleeVert,
                bDefVsA, bToBlockVsAMelee, b.hp, bRemHPAfter,
                aPoisonStr, aPoisonFail, aStoningFail, aDispelEvilFail, aLifeStealModM, bResDeath,
                aImm2nd, bInvulnBonus, bBlurChance, blurBuggy,
                false,
                isCoM2 ? woundedTopFigHP(bRemHPAfter, b.hp) : undefined,
                aMinDamageFromHits);
              secondDmgToB = secondOutcomeFS3.damageDist;
              aLifeStealExpectedM += pCombinedM * secondOutcomeFS3.lifeStealEV;
            } else {
              secondDmgToB = [1];
            }

            // Counter and 2nd strike are simultaneous and independent given B's post-FS state.
            for (let sDmg = 0; sDmg < secondDmgToB.length; sDmg++) {
              const pS = secondDmgToB[sDmg];
              if (pS < 1e-15) continue;
              totalDmgToB[Math.min(mDmg + sDmg, bRemHP)] += pCombinedM * pS;
              if (secondStrikeOnlyToB) secondStrikeOnlyToB[Math.min(sDmg, bRemHP)] += pCombinedM * pS;
            }
            for (let cDmg = 0; cDmg < counterDist.length; cDmg++) {
              if (counterDist[cDmg] < 1e-15) continue;
              const v = pCombinedM * counterDist[cDmg];
              totalDmgToA[Math.min(wofDmg + cDmg, aRemHP)] += v;
              counterOnlyToA[Math.min(cDmg, aRemHP)] += v;
            }
          }
        }

        let firstStrikeLabel = 'First Strike';
        if (aPoisonFail > 0) firstStrikeLabel += ' + Poison Touch';
        if (aStoningFail > 0) firstStrikeLabel += ' + Stoning Touch';
        if (aDispelEvilFail > 0) firstStrikeLabel += ' + Dispel Evil';
        if (aLifeStealModM !== null) firstStrikeLabel += ' + Life Steal';
        if (aImmWithMeleeM) firstStrikeLabel += ' + Immolation';
        let counterLabel = bCounterHaste ? 'Hasted Counter-attack' : 'Counter-attack';
        if (bPoisonFail > 0) counterLabel += ' + Poison Touch';
        if (bStoningFail > 0) counterLabel += ' + Stoning Touch';
        if (bDispelEvilFail > 0) counterLabel += ' + Dispel Evil';
        if (bLifeStealModM !== null) counterLabel += ' + Life Steal';
        if (bImmWithMeleeM) counterLabel += ' + Immolation';
        let hasted2ndLabel = 'Hasted 2nd Strike';
        if (aPoisonFail > 0 || bPoisonFail > 0)  hasted2ndLabel += ' + Poison Touch';
        if (aStoningFail > 0 || bStoningFail > 0) hasted2ndLabel += ' + Stoning Touch';
        if (aDispelEvilFail > 0 || bDispelEvilFail > 0) hasted2ndLabel += ' + Dispel Evil';
        if (aLifeStealModM !== null || bLifeStealModM !== null) hasted2ndLabel += ' + Life Steal';
        if (aImmWithMeleeM || bImmWithMeleeM) hasted2ndLabel += ' + Immolation';
        hasted2ndLabel += ' + ' + (bCounterHaste ? 'Hasted Counter-attack' : 'Counter-attack');

        // B's fear fires before A's FS (step 4); A's fear fires after FS (step 6).
        const fearBeforeFS3 = buildFearPhaseDists(aAlive, bAlive, bPFear, aPFear, aFearedByB, false, false, showFearNoop, null, atkSurvivors3);
        const fearAfterFS3 = buildFearPhaseDists(aAlive, bAlive, bPFear, aPFear, false, aFearBug, bFearedByA, false, null, atkSurvivors3);

        // Cumulative P(destroyed) for phase "% destroyed" display.
        const pDestroyAAtWof3fs = wofOnlyToA3 ? pDestroyedFrom(wofOnlyToA3, aRemHP) : 0;
        const pDestroyBAfterFS3 = pDestroyedFrom(meleeOnlyToB, bRemHP);
        const pDestroyBFinal3fs = pDestroyedFrom(totalDmgToB, bRemHP);
        const pDestroyAFinal3fs = pDestroyedFrom(totalDmgToA, aRemHP);

        const wofPhaseFS3 = wofOnlyToA3
          ? [{ label: 'Wall of Fire',
              atkDist: wofOnlyToA3, atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
              defDist: [1], defHP: bRemHP, defHPper: b.hp, defFigs: bAlive,
              atkDestroyPct: pDestroyAAtWof3fs, defDestroyPct: 0 }]
          : [];
        const fearBeforePhase3 = fearBeforeFS3
          ? [{ label: 'Defender Cause Fear', mode: 'feared', atkDist: fearBeforeFS3.atkFearedDist, defDist: fearBeforeFS3.defFearedDist }]
          : [];
        const fearAfterPhase3 = fearAfterFS3
          ? [{ label: 'Attacker Cause Fear', mode: 'feared', atkDist: fearAfterFS3.atkFearedDist, defDist: fearAfterFS3.defFearedDist }]
          : [];
        // Under FS+Haste, merge A's 2nd strike with B's counter (simultaneous in step 7).
        // Otherwise keep the classic FS / Counter-attack split.
        const meleeFSRows = secondStrikeOnlyToB
          ? [
              { label: firstStrikeLabel,
                atkDist: [1], atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
                defDist: meleeOnlyToB, defHP: bRemHP, defHPper: b.hp, defFigs: bAlive,
                atkDestroyPct: pDestroyAAtWof3fs, defDestroyPct: pDestroyBAfterFS3 },
              ...fearAfterPhase3,
              { label: hasted2ndLabel,
                atkDist: counterOnlyToA, atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
                defDist: secondStrikeOnlyToB, defHP: bRemHP, defHPper: b.hp, defFigs: bAlive,
                atkDestroyPct: pDestroyAFinal3fs, defDestroyPct: pDestroyBFinal3fs },
            ]
          : [
              { label: firstStrikeLabel,
                atkDist: [1], atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
                defDist: meleeOnlyToB, defHP: bRemHP, defHPper: b.hp, defFigs: bAlive,
                atkDestroyPct: pDestroyAAtWof3fs, defDestroyPct: pDestroyBAfterFS3 },
              ...fearAfterPhase3,
              { label: counterLabel,
                atkDist: counterOnlyToA, atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
                defDist: [1], defHP: bRemHP, defHPper: b.hp, defFigs: bAlive,
                atkDestroyPct: pDestroyAFinal3fs, defDestroyPct: pDestroyBFinal3fs },
            ];
        return {
          phases: [
            ...wofPhaseFS3,
            ...fearBeforePhase3,
            ...meleeFSRows,
          ],
          totalDmgToA,
          totalDmgToB,
          aLifeStealDist: aLifeStealDistM,
          aLifeStealExpected: aLifeStealExpectedM,
          bLifeStealDist: bLifeStealDistM,
          bLifeStealExpected: bLifeStealExpectedM,
          aRemHP, aHP: a.hp, aAlive,
          bRemHP, bHP: b.hp, bAlive,
        };
      }

      // Simultaneous melee (+ Wall of Fire before).
      // meleeOnlyToB accumulates the doubled dist when aHaste so the single phase row
      // reflects both strikes; there is no separate 2nd-strike phase in this layout.
      const totalDmgToA = new Array(aRemHP + 1).fill(0);
      const totalDmgToB = new Array(bRemHP + 1).fill(0);
      const meleeOnlyToA = new Array(aRemHP + 1).fill(0);
      const meleeOnlyToB = new Array(bRemHP + 1).fill(0);

      for (let wofDmg = 0; wofDmg < wofDist3.length; wofDmg++) {
        const pWof = wofDist3[wofDmg];
        if (pWof < 1e-15) continue;
        if (wofOnlyToA3) wofOnlyToA3[Math.min(wofDmg, aRemHP)] += pWof;

        const aDmgAfterWof = a.dmg + wofDmg;
        const aAliveAfterWof = Math.max(0, a.figs - Math.floor(aDmgAfterWof / a.hp));
        const aRemHPAfterWof = Math.max(0, aRemHP - wofDmg);

        const aImmMDist3 = aImmWithMeleeM && aAliveAfterWof > 0 && bAlive > 0 && bRemHP > 0
          ? calcAreaDamageDist(bAlive, immStr, a.toHitImmolation, bDefForImm, bToBlockVsAAll, b.hp, bRemHP, bInvulnBonus, aMinDamageFromHits) : null;
        const bImmMDist3 = bImmWithMeleeM && aAliveAfterWof > 0 && aRemHPAfterWof > 0
          ? calcAreaDamageDist(aAliveAfterWof, immStr, b.toHitImmolation, aDefForImm, aToBlockVsBAll, a.hp, aRemHPAfterWof, aInvulnBonus, bMinDamageFromHits) : null;

        const aUnfeared3 = aFearedByB ? calcFearDist(aAliveAfterWof, aPFear)
                         : aFearBug ? calcFearBugDist(aAliveAfterWof, bAlive, bPFear)
                         : null;
        // Compute A's single-strike dist first; if Hasted, the two strikes are independent
        // so the total is the self-convolution. Split the phase rows to show each strike.
        const meleeOutcome3 = calcMeleeTouchOutcome(aUnfeared3, aAliveAfterWof, aDoomsB, aBlackSleep ? 0 : aMeleeAtkVsB, aToHitMeleeVert,
          bDefVsA, bToBlockVsAMelee, b.hp, bRemHP,
          aPoisonStr, aPoisonFail, aStoningFail, aDispelEvilFail, aLifeStealModM, bResDeath,
          aImmMDist3, bInvulnBonus, bBlurChance, blurBuggy,
          false,
          isCoM2 ? woundedTopFigHP(bRemHP, b.hp) : undefined,
          aMinDamageFromHits);
        const dmgToBSingle = meleeOutcome3.damageDist;
        aLifeStealExpectedM += pWof * meleeOutcome3.lifeStealEV * (aHaste ? 2 : 1);
        const dmgToB = aHaste ? convolveDists(dmgToBSingle, dmgToBSingle, bRemHP) : dmgToBSingle;

        const bUnfeared3 = bFearedByA ? calcFearDist(bAlive, bPFear) : null;
        const counterOutcome3 = calcMeleeTouchOutcome(bUnfeared3, bAlive, bDoomsA, bBlackSleep ? 0 : bMeleeAtkVsA, bToHitMeleeVert,
          aDefVsB, aToBlockVsBMelee, a.hp, aRemHPAfterWof,
          bPoisonStr, bPoisonFail, bStoningFail, bDispelEvilFail, bLifeStealModM, aResDeath,
          bImmMDist3, aInvulnBonus, aBlurChance, blurBuggy,
          bCounterHaste,
          isCoM2 ? woundedTopFigHP(aRemHPAfterWof, a.hp) : undefined,
          bMinDamageFromHits);
        const dmgToA = counterOutcome3.damageDist;
        bLifeStealExpectedM += pWof * counterOutcome3.lifeStealEV;

        for (let mDmg = 0; mDmg < dmgToB.length; mDmg++) {
          if (dmgToB[mDmg] < 1e-15) continue;
          totalDmgToB[Math.min(mDmg, bRemHP)] += pWof * dmgToB[mDmg];
          meleeOnlyToB[Math.min(mDmg, bRemHP)] += pWof * dmgToB[mDmg];
        }
        for (let cDmg = 0; cDmg < dmgToA.length; cDmg++) {
          if (dmgToA[cDmg] < 1e-15) continue;
          totalDmgToA[Math.min(wofDmg + cDmg, aRemHP)] += pWof * dmgToA[cDmg];
          meleeOnlyToA[Math.min(cDmg, aRemHP)] += pWof * dmgToA[cDmg];
        }
      }

      // Cumulative P(destroyed) for phase "% destroyed" display.
      const pDestroyAAtWof3 = wofOnlyToA3 ? pDestroyedFrom(wofOnlyToA3, aRemHP) : 0;
      const pDestroyBFinal3 = pDestroyedFrom(totalDmgToB, bRemHP);
      const pDestroyAFinal3 = pDestroyedFrom(totalDmgToA, aRemHP);

      const phases3 = [];
      if (wofOnlyToA3) {
        phases3.push({ label: 'Wall of Fire',
          atkDist: wofOnlyToA3, atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
          defDist: [1], defHP: bRemHP, defHPper: b.hp, defFigs: bAlive,
          atkDestroyPct: pDestroyAAtWof3, defDestroyPct: 0 });
      }
      if (fearPhaseDists3) {
        phases3.push({ label: simultaneousFearLabel, mode: 'feared',
          atkDist: fearPhaseDists3.atkFearedDist, defDist: fearPhaseDists3.defFearedDist });
      }
      // Include a melee phase breakdown when we have a preceding phase OR when Haste is
      // active on either side (so the Hasted labels show).
      if (phases3.length > 0 || aHaste || bCounterHaste) {
        let meleeLabel3 = aHaste ? 'Hasted Melee' : 'Melee';
        if (aPoisonFail > 0 || bPoisonFail > 0) meleeLabel3 += ' + Poison Touch';
        if (aStoningFail > 0 || bStoningFail > 0) meleeLabel3 += ' + Stoning Touch';
        if (aLifeStealModM !== null || bLifeStealModM !== null) meleeLabel3 += ' + Life Steal';
        if (aImmWithMeleeM || bImmWithMeleeM) meleeLabel3 += ' + Immolation';
        meleeLabel3 += bCounterHaste ? ' + Hasted Counter-attack' : ' + Counter-attack';
        phases3.push({ label: meleeLabel3,
          atkDist: meleeOnlyToA, atkHP: aRemHP, atkHPper: a.hp, atkFigs: aAlive,
          defDist: meleeOnlyToB, defHP: bRemHP, defHPper: b.hp, defFigs: bAlive,
          atkDestroyPct: pDestroyAFinal3, defDestroyPct: pDestroyBFinal3 });
      }

      return {
        phases: phases3.length > 0 ? phases3 : null,
        totalDmgToA,
        totalDmgToB,
        aLifeStealDist: aLifeStealDistM,
        aLifeStealExpected: aLifeStealExpectedM,
        bLifeStealDist: bLifeStealDistM,
        bLifeStealExpected: bLifeStealExpectedM,
        aRemHP, aHP: a.hp, aAlive,
        bRemHP, bHP: b.hp, bAlive,
      };
    }
  }
}
