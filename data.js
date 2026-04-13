// --- Constants ---

const RACE_NAMES = {
  0: 'Barbarian', 1: 'Beastmen', 2: 'Dark Elf', 3: 'Draconian', 4: 'Dwarf',
  5: 'Gnoll', 6: 'Halfling', 7: 'High Elf', 8: 'High Men', 9: 'Klackon',
  10: 'Lizardman', 11: 'Nomad', 12: 'Orc', 13: 'Troll', 14: 'Special',
  15: 'Arcane', 16: 'Nature', 17: 'Sorcery', 18: 'Chaos', 19: 'Life', 20: 'Death',
};

// RangedType ID -> calculator ranged type (used by INI parser)
const RANGED_TYPE_MAP = {
  10: 'boulder', // boulder
  11: 'boulder', // cannon
  20: 'missile',
  21: 'missile', // sling
  30: 'magic_c', // chaos — lightning bolt
  31: 'magic_c', // chaos — fire bolt
  32: 'magic_s', // sorcery — ice bolt
  33: 'magic_c', // chaos — death bolt
  34: 'magic_s', // sorcery (Water Elemental)
  35: 'magic_n', // nature — priest sparkles
  36: 'magic_c', // chaos — drow sparkles
  37: 'magic_n', // nature — sprite shimmer
  38: 'magic_n', // nature — green bolt
};

// Normalized ranged type from unit DB display strings
const RANGED_TYPE_NORMALIZE = {
  'Missile': 'missile', 'Boulder': 'boulder',
  'Magic(C)': 'magic_c', 'Magic(N)': 'magic_n', 'Magic(S)': 'magic_s',
};

const RANGED_TYPES = ['missile', 'boulder', 'magic_c', 'magic_n', 'magic_s'];
const THROWN_TYPES = ['thrown', 'fire', 'lightning'];

// --- Ability Definitions ---
// Each ability: { key, label, type: 'bool'|'num'|'select', match, group }
const ABILITY_DEFS = [
  // Abilities (innate unit abilities) — numeric first
  { key: 'stoningGaze', label: 'Stoning Gaze', type: 'numcheck', match: 'StoningGaze', group: 'Abilities' },
  { key: 'stoningTouch', label: 'Stoning Touch', type: 'numcheck', match: 'StoningTouch', group: 'Abilities' },
  { key: 'deathGaze', label: 'Death Gaze', type: 'numcheck', match: 'DeathGaze', group: 'Abilities' },
  { key: 'lifeSteal', label: 'Life Steal', type: 'numcheck', match: 'LifeSteal', group: 'Abilities' },
  { key: 'doomGaze', label: 'Doom Gaze', type: 'num', match: 'DoomGaze', group: 'Abilities' },
  { key: 'poison', label: 'Poison Touch', type: 'num', match: 'Poison', group: 'Abilities' },
  { key: 'gazeRanged', label: 'Hidden Gaze Attack', type: 'num', match: 'GazeRanged', group: 'Abilities' },
  { key: 'armorPiercing', label: 'Armor Piercing', type: 'bool', match: 'ArmorPiercing', group: 'Abilities' },
  { key: 'firstStrike', label: 'First Strike', type: 'bool', match: 'FirstStrike', group: 'Abilities' },
  { key: 'negateFirstStrike', label: 'Negate First Strike', type: 'bool', match: 'NegateFirstStrike', group: 'Abilities' },
  { key: 'largeShield', label: 'Large Shield', type: 'bool', match: 'LargeShield', group: 'Abilities' },
  { key: 'lucky', label: 'Lucky', type: 'bool', match: 'Lucky', group: 'Abilities' },
  { key: 'illusion', label: 'Illusion', type: 'bool', match: 'Illusion', group: 'Abilities' },
  { key: 'longRange', label: 'Long Range', type: 'bool', match: 'LongRange', group: 'Abilities' },
  { key: 'doom', label: 'Doom Damage', type: 'bool', match: 'Doom', group: 'Abilities' },
  { key: 'fireImmunity', label: 'Fire Immunity', type: 'bool', match: 'FireImmunity', group: 'Abilities' },
  { key: 'coldImmunity', label: 'Cold Immunity', type: 'bool', match: 'ColdImmunity', group: 'Abilities' },
  { key: 'deathImmunity', label: 'Death Immunity', type: 'bool', match: 'DeathImmunity', group: 'Abilities' },
  { key: 'poisonImmunity', label: 'Poison Immunity', type: 'bool', match: 'PoisonImmunity', group: 'Abilities' },
  { key: 'stoningImmunity', label: 'Stoning Immunity', type: 'bool', match: 'StoningImmunity', group: 'Abilities' },
  { key: 'lightningResist', label: 'Lightning Resist', type: 'bool', match: 'LightningResist', group: 'Abilities' },
  // Abilities/Enchantments (innate or granted by spells) — sorted by realm: no realm, life, death, chaos, nature, sorcery
  { key: 'resistanceToAll', label: 'Received resistance to all', type: 'num', match: 'ResistanceToAll', group: 'Abilities/Enchantments' },
  { key: 'holyBonus', label: 'Received holy bonus', type: 'num', match: 'HolyBonus', group: 'Abilities/Enchantments' },
  { key: 'illusionImmunity', label: 'Illusion Imm./True Sight', type: 'bool', match: 'IllusionImmunity', group: 'Abilities/Enchantments', realm: 'life' },
  { key: 'fear', label: 'Cause Fear/Cloak of Fear', type: 'bool', match: 'Fear', group: 'Abilities/Enchantments', realm: 'death' },
  { key: 'weaponImmunity', label: 'Weapon Imm./Wraith Form', type: 'bool', match: 'WeaponImmunity', group: 'Abilities/Enchantments', realm: 'death' },
  { key: 'immolation', label: 'Immolation', type: 'bool', match: 'Immolation', group: 'Abilities/Enchantments', realm: 'chaos' },
  { key: 'invisibility', label: 'Invisible', type: 'bool', match: 'Invisibility', group: 'Abilities/Enchantments', realm: 'sorcery' },
  { key: 'magicImmunity', label: 'Magic Immunity', type: 'bool', match: 'MagicImmunity', group: 'Abilities/Enchantments', realm: 'sorcery' },
  { key: 'missileImmunity', label: 'Missile Imm./Guardian Wind', type: 'bool', match: 'MissileImmunity', group: 'Abilities/Enchantments', realm: 'sorcery' },
  // Enchantments (spell-granted only) — dropdowns first, then checkboxes; each sorted by realm
  { key: 'prayer', label: 'Prayer', type: 'select', options: [['none','None'],['prayer','Prayer'],['highPrayer','High Prayer']], group: 'Enchantments', realm: 'life' },
  { key: 'flameBlade', label: 'Metal Fires/Fl. Blade', type: 'select', options: [['none','None'],['metalFires','Metal Fires'],['flameBlade','Flame Blade']], group: 'Enchantments', realm: 'chaos' },
  { key: 'chaosChannels', label: 'Chaos Channels', type: 'select', options: [['none','None'],['defense','+Defense'],['fireBreath','+Fire Breath']], group: 'Enchantments', realm: 'chaos' },
  { key: 'stoneSkin', label: 'Stone/Iron Skin', type: 'select', options: [['none','None'],['stoneSkin','Stone Skin'],['ironSkin','Iron Skin']], group: 'Enchantments', realm: 'nature' },
  { key: 'bless', label: 'Bless', type: 'bool', match: 'Bless', group: 'Enchantments', realm: 'life' },
  { key: 'holyWeapon', label: 'Holy Weapon/Holy Arms', type: 'bool', match: 'HolyWeapon', group: 'Enchantments', realm: 'life' },
  { key: 'holyArmor', label: 'Holy Armor', type: 'bool', match: 'HolyArmor', group: 'Enchantments', realm: 'life' },
  { key: 'invulnerability', label: 'Invulnerability', type: 'bool', match: 'Invulnerability', group: 'Enchantments', realm: 'life' },
  { key: 'righteousness', label: 'Righteousness', type: 'bool', match: 'Righteousness', group: 'Enchantments', realm: 'life' },
  { key: 'lionheart', label: 'Lionheart', type: 'bool', match: 'Lionheart', group: 'Enchantments', realm: 'life' },
  { key: 'charmOfLife', label: 'Charm of Life', type: 'bool', match: 'CharmOfLife', group: 'Enchantments', realm: 'life' },
  { key: 'blackPrayer', label: 'Debuffed by Black Prayer', type: 'bool', match: 'BlackPrayer', group: 'Enchantments', realm: 'death' },
  { key: 'berserk', label: 'Berserk', type: 'bool', match: 'Berserk', group: 'Enchantments', realm: 'death' },
  { key: 'blackChannels', label: 'Black Channels', type: 'bool', match: 'BlackChannels', group: 'Enchantments', realm: 'death' },
  { key: 'warpReality', label: 'Warp Reality', type: 'bool', match: 'WarpReality', group: 'Enchantments', realm: 'chaos' },
  { key: 'eldritchWeapon', label: 'Eldritch Weapon', type: 'bool', match: 'EldritchWeapon', group: 'Enchantments', realm: 'chaos' },
  { key: 'giantStrength', label: 'Giant Strength', type: 'bool', match: 'GiantStrength', group: 'Enchantments', realm: 'nature' },
  { key: 'elementalArmor', label: 'Elemental Armor', type: 'bool', match: 'ElementalArmor', group: 'Enchantments', realm: 'nature' },
  { key: 'resistElements', label: 'Resist Elements', type: 'bool', match: 'ResistElements', group: 'Enchantments', realm: 'nature' },
  { key: 'blur', label: 'Blur', type: 'bool', match: 'Blur', group: 'Enchantments', realm: 'sorcery' },
  { key: 'haste', label: 'Haste', type: 'bool', match: 'Haste', group: 'Enchantments', realm: 'sorcery' },
  { key: 'resistMagic', label: 'Resist Magic', type: 'bool', match: 'ResistMagic', group: 'Enchantments', realm: 'sorcery' },
];

// --- Version -> Unit Data mapping ---
// MOM_UNITS_DATA and COM2_UNITS_DATA are defined in units.js
const VERSION_DATA = {
  'mom_1.31':       MOM_UNITS_DATA,
  'mom_cp_1.60.00': MOM_UNITS_DATA,
  'com_6.08':       COM2_UNITS_DATA,
  'com2_1.05.11':   COM2_UNITS_DATA,
};

// Cross-version unit name aliases (CoM2 name -> MoM name and vice versa)
const UNIT_NAME_ALIASES = {
  'Shamans': 'Shaman',       'Shaman': 'Shamans',
  'Chimeras': 'Chimera',     'Chimera': 'Chimeras',
  'Phantom Warriors': 'Phantom Warrior', 'Phantom Warrior': 'Phantom Warriors',
  'Pegasai': 'Pegasi',       'Pegasi': 'Pegasai',
  'Archangel': 'Arch Angel', 'Arch Angel': 'Archangel',
  'Orc Warrior': 'Orc Archer', 'Orc Archer': 'Orc Warrior',
};

// --- Test Presets ---

const PRESETS = {
  attackRolls: {
    desc: 'Attack Rolls: 1 fig, 1 atk, 30% to hit — isolates hit binomial with no defense',
    a: { atk:1, hp:10 },
    b: { hp:10 },
    expected: { dmgToA: 0, dmgToB: 0.300 },
  },
  defenseRolls: {
    desc: 'Defense Rolls: 1 guaranteed hit vs 1 def, 30% to block — isolates block binomial',
    a: { atk:1, toHitMod:70, hp:10 },
    b: { def:1, hp:10 },
    expected: { dmgToA: 0, dmgToB: 0.700 },
  },
  multiFigDefense: {
    desc: 'Multi-Fig Defense: 3 atk vs 1 def 100% block — always kills 1 of 2 figs exactly',
    a: { atk:3, toHitMod:70, hp:10 },
    b: { figs:2, def:1, toBlkMod:70, hp:2, dmg:1 },
    expected: { dmgToA: 0, dmgToB: 2.000 },
  },
  multiFigOverflow: {
    desc: 'Multi-Fig Overflow: 3 atk vs 1 def 100% block, hp=1 — excess hit absorbed by next fig',
    a: { atk:3, toHitMod:70, hp:10 },
    b: { figs:2, def:1, toBlkMod:70 },
    expected: { dmgToA: 0, dmgToB: 1.000 },
  },
  multiFigAttack: {
    desc: 'Multi-Fig Attack: 2 figs each deal exactly 1 — isolates per-figure independence',
    a: { figs:2, atk:2, toHitMod:70, hp:10 },
    b: { def:1, toBlkMod:70, hp:10 },
    expected: { dmgToA: 0, dmgToB: 2.000 },
  },
  complexMelee: {
    desc: 'Complex Melee: 6 figs 5 atk 3 def hp 3 vs 4 figs 8 atk 5 def hp 2',
    a: { figs:6, atk:5, def:3, hp:3 },
    b: { figs:4, atk:8, def:5, hp:2 },
    expected: { dmgToA: 6.161, dmgToB: 3.125 },
  },
  rangedMissileBasic: {
    desc: 'Ranged Missile: 100% base to hit, range 9 → 70% effective (−30% penalty)',
    a: { toHitRtbMod:70, rtbType:'missile', rtb:1, hp:10 },
    b: { hp:10 },
    rangedCheck: true, rangedDist: 9,
    expected: { dmgToA: 0, dmgToB: 0.700 },
  },
  rangedBoulderBasic: {
    desc: 'Ranged Boulder: 100% base to hit, range 9 → 70% effective (−30% penalty)',
    a: { toHitRtbMod:70, rtbType:'boulder', rtb:1, hp:10 },
    b: { hp:10 },
    rangedCheck: true, rangedDist: 9,
    expected: { dmgToA: 0, dmgToB: 0.700 },
  },
  rangedMagicBasic: {
    desc: 'Ranged Magic: 100% base to hit, range 9 → 100% effective (no distance penalty)',
    a: { toHitRtbMod:70, rtbType:'magic_c', rtb:1, hp:10 },
    b: { hp:10 },
    rangedCheck: true, rangedDist: 9,
    expected: { dmgToA: 0, dmgToB: 1.000 },
  },
  thrownBasic: {
    desc: 'Thrown: 100% to hit thrown, B dies before melee/counter fires',
    a: { atk:1, rtbType:'thrown', rtb:1, toHitRtbMod:70, def:0, hp:1 },
    b: { atk:1, toHitMod:70, def:0, hp:1 },
    expected: { dmgToA: 0, dmgToB: 1 },
  },
  fireBreathBasic: {
    desc: 'Fire Breath: 100% to hit breath, B dies before melee/counter fires',
    a: { atk:1, rtbType:'fire', rtb:1, toHitRtbMod:70, def:0, hp:1 },
    b: { atk:1, toHitMod:70, def:0, hp:1 },
    expected: { dmgToA: 0, dmgToB: 1 },
  },
  lightningBreathBasic: {
    desc: 'Lightning Breath: 100% to hit breath, B dies despite 1 defense (lightning is AP)',
    a: { atk:1, rtbType:'lightning', rtb:1, toHitRtbMod:70, def:0, hp:1 },
    b: { atk:1, toHitMod:70, def:1, toBlkMod:70, hp:1 },
    expected: { dmgToA: 0, dmgToB: 1 },
  },
  levelWeaponBonus: {
    desc: 'Level+Weapon Bonus: Champion+Adamantium (base 1atk/2def/1hp) matches defender with equivalent effective stats',
    a: { figs:8, atk:1, def:2, res:5, hp:1, level:'champion', weapon:'adamantium' },
    b: { figs:8, atk:6, toHitMod:40, toHitRtbMod:30, def:6, res:10, hp:3 },
    expected: { dmgToA: 17.375, dmgToB: 17.375 },
  },
  poisonTouchBasic: {
    desc: 'Poison Touch: 1 atk (100% blocked) + Poison 4 vs Res 5 — 4 rolls × 50% fail = 2.0',
    a: { atk:1, toHitMod:70, hp:10, abilities: { poison: 4 } },
    b: { def:1, toBlkMod:70, res:5, hp:10 },
    expected: { dmgToA: 0, dmgToB: 2.000 },
  },
  poisonPlusMelee: {
    desc: 'Poison + Melee: 1 atk 100% hit + Poison 2, vs 0 def Res 5 — 1.0 melee + 1.0 poison',
    a: { atk:1, toHitMod:70, hp:10, abilities: { poison: 2 } },
    b: { res:5, hp:10 },
    expected: { dmgToA: 0, dmgToB: 2.000 },
  },
  poisonImmunity: {
    desc: 'Poison Immunity: 1 atk (100% blocked) + Poison 4 vs Poison Immune — no damage',
    a: { atk:1, toHitMod:70, hp:10, abilities: { poison: 4 } },
    b: { def:1, toBlkMod:70, res:5, hp:10, abilities: { poisonImmunity: true } },
    expected: { dmgToA: 0, dmgToB: 0 },
  },
  poisonHighRes: {
    desc: 'Poison vs High Res: 1 atk (100% blocked) + Poison 4 vs Res 10 — immune',
    a: { atk:1, toHitMod:70, hp:10, abilities: { poison: 4 } },
    b: { def:1, toBlkMod:70, res:10, hp:10 },
    expected: { dmgToA: 0, dmgToB: 0 },
  },
  poisonRanged: {
    desc: 'Poison + Ranged: 1 missile 100% hit + Poison 2 vs 0 def Res 5 — 1.0 ranged + 1.0 poison',
    a: { rtbType:'missile', rtb:1, toHitRtbMod:70, hp:10, abilities: { poison: 2 } },
    b: { res:5, hp:10 },
    rangedCheck: true, rangedDist: 1,
    expected: { dmgToA: 0, dmgToB: 2.000 },
  },
  poisonThrown: {
    desc: 'Poison + Thrown + Melee: 1 thrown + 1 melee (100% hit, 0 def) + Poison 2 × 2 phases vs Res 5 — 2 + 2 poison',
    a: { atk:1, toHitMod:70, rtbType:'thrown', rtb:1, toHitRtbMod:70, hp:10, abilities: { poison: 2 } },
    b: { res:5, hp:20 },
    expected: { dmgToA: 0, dmgToB: 4.000 },
  },
  stoningTouchBasic: {
    desc: 'Stoning Touch: 1 atk (100% blocked) + Stoning -3 vs Res 5 — pFail 80%, E[dmg] = 0.8 × 10 = 8.0',
    a: { atk:1, toHitMod:70, hp:10, abilities: { stoningTouch: -3 } },
    b: { def:1, toBlkMod:70, res:5, hp:10 },
    expected: { dmgToA: 0, dmgToB: 8.000 },
  },
  stoningImmunity: {
    desc: 'Stoning Immunity: 1 atk (100% blocked) + Stoning -3 vs Stoning Immune — no damage',
    a: { atk:1, toHitMod:70, hp:10, abilities: { stoningTouch: -3 } },
    b: { def:1, toBlkMod:70, res:5, hp:10, abilities: { stoningImmunity: true } },
    expected: { dmgToA: 0, dmgToB: 0 },
  },
  stoningMagicImmunity: {
    desc: 'Magic Immunity blocks Stoning: 1 atk (100% blocked) + Stoning -3 vs Magic Immune — no damage',
    a: { atk:1, toHitMod:70, hp:10, abilities: { stoningTouch: -3 } },
    b: { def:1, toBlkMod:70, res:5, hp:10, abilities: { magicImmunity: true } },
    expected: { dmgToA: 0, dmgToB: 0 },
  },
  stoningHighRes: {
    desc: 'Stoning vs High Res: Stoning -3 vs Res 13 (effective 10) — immune',
    a: { atk:1, toHitMod:70, hp:10, abilities: { stoningTouch: -3 } },
    b: { def:1, toBlkMod:70, res:13, hp:10 },
    expected: { dmgToA: 0, dmgToB: 0 },
  },
  stoningMultiFig: {
    desc: 'Stoning Multi-fig: 4 figs, Stoning -1 vs Res 5, 4 figs 5hp — pFail 60%, E[kills]=2.4, E[dmg]=12.0',
    a: { figs:4, atk:1, toHitMod:70, hp:5, abilities: { stoningTouch: -1 } },
    b: { figs:4, def:1, toBlkMod:70, res:5, hp:5 },
    expected: { dmgToA: 0, dmgToB: 12.000 },
  },
  stoningGazeBasic: {
    desc: 'Stoning Gaze: Gaze -3 + 1 ranged vs 1 fig Res 5, 10 hp — stoning 8.0 + physical 0.06 = 8.06',
    a: { hp:10, abilities: { stoningGaze: -3, gazeRanged: 1 } },
    b: { res:5, hp:10 },
    expected: { dmgToA: 0, dmgToB: 8.060 },
  },
  stoningGazeMultiFig: {
    desc: 'Stoning Gaze Multi-fig: Gaze -1 + 1 ranged vs 4 figs Res 5, 5hp — stoning 12.0 + physical ~0.26',
    a: { hp:10, abilities: { stoningGaze: -1, gazeRanged: 1 } },
    b: { figs:4, res:5, hp:5 },
    expected: { dmgToA: 0, dmgToB: 12.261 },
  },
  stoningGazeBilateral: {
    desc: 'Bilateral Gaze: both -3 + 1 ranged, Res 5 — A gaze 8.06; B gaze (if B survives) 1.612',
    a: { hp:10, res:5, abilities: { stoningGaze: -3, gazeRanged: 1 } },
    b: { hp:10, res:5, abilities: { stoningGaze: -3, gazeRanged: 1 } },
    expected: { dmgToA: 1.612, dmgToB: 8.060 },
  },
  stoningGazeImmunity: {
    desc: 'Stoning Gaze vs Stoning Immunity — stoning blocked, but physical 1 ranged still hits (0.3)',
    a: { hp:10, abilities: { stoningGaze: -3, gazeRanged: 1 } },
    b: { res:5, hp:10, abilities: { stoningImmunity: true } },
    expected: { dmgToA: 0, dmgToB: 0.300 },
  },
  deathGazeBasic: {
    desc: 'Death Gaze: Gaze -3 + 1 ranged vs 1 fig Res 5, 10 hp — death 8.0 + physical 0.06 = 8.06',
    a: { hp:10, abilities: { deathGaze: -3, gazeRanged: 1 } },
    b: { res:5, hp:10 },
    expected: { dmgToA: 0, dmgToB: 8.060 },
  },
  deathGazeMultiFig: {
    desc: 'Death Gaze Multi-fig: Gaze -1 + 1 ranged vs 4 figs Res 5, 5hp — death 12.0 + physical ~0.26',
    a: { hp:10, abilities: { deathGaze: -1, gazeRanged: 1 } },
    b: { figs:4, res:5, hp:5 },
    expected: { dmgToA: 0, dmgToB: 12.261 },
  },
  deathGazeDeathImmunity: {
    desc: 'Death Gaze vs Death Immunity — death blocked, but physical 1 ranged still hits (0.3)',
    a: { hp:10, abilities: { deathGaze: -3, gazeRanged: 1 } },
    b: { res:5, hp:10, abilities: { deathImmunity: true } },
    expected: { dmgToA: 0, dmgToB: 0.300 },
  },
  deathGazeMagicImmunity: {
    desc: 'Magic Immunity blocks Death Gaze kill, but physical 1 ranged still hits (0.3)',
    a: { hp:10, abilities: { deathGaze: -3, gazeRanged: 1 } },
    b: { res:5, hp:10, abilities: { magicImmunity: true } },
    expected: { dmgToA: 0, dmgToB: 0.300 },
  },
  deathGazeStoningImmunityNotBlocked: {
    desc: 'Stoning Immunity does NOT block Death Gaze — full effect (8.0 + 0.06)',
    a: { hp:10, abilities: { deathGaze: -3, gazeRanged: 1 } },
    b: { res:5, hp:10, abilities: { stoningImmunity: true } },
    expected: { dmgToA: 0, dmgToB: 8.060 },
  },
  deathGazeHighRes: {
    desc: 'Death Gaze vs High Res: Death Gaze -3 vs Res 13 (effective 10) — kill blocked, physical 0.3 (unreduced)',
    a: { hp:10, abilities: { deathGaze: -3, gazeRanged: 1 } },
    b: { res:13, hp:10 },
    expected: { dmgToA: 0, dmgToB: 0.300 },
  },
  combinedStoningDeathGaze: {
    desc: 'Chaos-Spawn-style combined gaze: Stoning -3 + Death -3 + 1 ranged vs Res 5, 10 hp — each kill roll 80% fail, physical 0.06. 1−(1−0.8)(1−0.8)=0.96 chance of 10 dmg, else physical only.',
    a: { hp:10, abilities: { stoningGaze: -3, deathGaze: -3, gazeRanged: 1 } },
    b: { res:5, hp:10 },
    expected: { dmgToA: 0, dmgToB: 9.612 },
  },
  doomGazeBasic: {
    desc: 'Doom Gaze 4 vs 10 hp — exact 4 damage, no rolls, no defense.',
    a: { hp:10, abilities: { doomGaze: 4 } },
    b: { def:10, res:10, hp:10 },
    expected: { dmgToA: 0, dmgToB: 4 },
  },
  doomGazeMagicImmunity: {
    desc: 'Doom Gaze 4 vs Magic Immune 10 hp — doom gaze ignores Magic Immunity, exact 4 damage.',
    a: { hp:10, abilities: { doomGaze: 4 } },
    b: { def:10, res:10, hp:10, abilities: { magicImmunity: true } },
    expected: { dmgToA: 0, dmgToB: 4 },
  },
  doomGazeKill: {
    desc: 'Doom Gaze 12 vs 10 hp — exact 10 damage (capped at total HP), kills the unit.',
    a: { hp:10, abilities: { doomGaze: 12 } },
    b: { def:10, res:10, hp:10 },
    expected: { dmgToA: 0, dmgToB: 10 },
  },
  doomGazeChaosSpawn: {
    desc: 'Chaos Spawn gaze suite: Doom 4 + Stoning -4 + Death -4 vs 4 figs, 5 hp, Res 12 — doom exact 4, stoning/death each 20% kill per figure.',
    a: { hp:10, abilities: { doomGaze: 4, stoningGaze: -4, deathGaze: -4 } },
    b: { figs:4, res:12, hp:5 },
    expected: { dmgToA: 0, dmgToB: 11.716 },
  },
  lifeStealBasic: {
    desc: 'Life Steal: 1 atk (100% blocked) + Life Steal -3 vs Res 5 — effective res 2, E[dmg] = sum(1..8)/10 = 3.6',
    a: { atk:1, toHitMod:70, hp:10, abilities: { lifeSteal: -3 } },
    b: { def:1, toBlkMod:70, res:5, hp:20 },
    expected: { dmgToA: 0, dmgToB: 3.600 },
  },
  lifeStealDeathImmune: {
    desc: 'Life Steal vs Death Immunity: Life Steal -3 vs Death Immune — no damage',
    a: { atk:1, toHitMod:70, hp:10, abilities: { lifeSteal: -3 } },
    b: { def:1, toBlkMod:70, res:5, hp:10, abilities: { deathImmunity: true } },
    expected: { dmgToA: 0, dmgToB: 0 },
  },
  lifeStealMagicImmune: {
    desc: 'Life Steal vs Magic Immunity: Life Steal -3 vs Magic Immune — no damage',
    a: { atk:1, toHitMod:70, hp:10, abilities: { lifeSteal: -3 } },
    b: { def:1, toBlkMod:70, res:5, hp:10, abilities: { magicImmunity: true } },
    expected: { dmgToA: 0, dmgToB: 0 },
  },
  lifeStealHighRes: {
    desc: 'Life Steal vs High Res: Life Steal -3 vs Res 13 (effective 10) — immune',
    a: { atk:1, toHitMod:70, hp:10, abilities: { lifeSteal: -3 } },
    b: { def:1, toBlkMod:70, res:13, hp:10 },
    expected: { dmgToA: 0, dmgToB: 0 },
  },
  lifeStealNoMod: {
    desc: 'Life Steal 0 modifier vs Res 5: E[dmg] = sum(1..5)/10 = 1.5',
    a: { atk:1, toHitMod:70, hp:10, abilities: { lifeSteal: 0 } },
    b: { def:1, toBlkMod:70, res:5, hp:20 },
    expected: { dmgToA: 0, dmgToB: 1.500 },
  },
  firstStrikeKillsBeforeCounter: {
    desc: 'First Strike: 1-fig A (atk 10, 100% hit) kills 1-fig B (10hp) before B can counter — dmgToA=0',
    a: { atk:10, toHitMod:70, hp:10, abilities: { firstStrike: true } },
    b: { atk:5, toHitMod:70, hp:10 },
    expected: { dmgToA: 0, dmgToB: 10 },
  },
  negateFirstStrike: {
    desc: 'Negate First Strike cancels First Strike — simultaneous exchange: A takes 5, B takes 10',
    a: { atk:10, toHitMod:70, hp:10, abilities: { firstStrike: true } },
    b: { atk:5, toHitMod:70, hp:10, abilities: { negateFirstStrike: true } },
    expected: { dmgToA: 5, dmgToB: 10 },
  },
  firstStrikeMultiFig: {
    desc: 'First Strike Multi-fig: A (4 figs × 1 atk, 100% hit) kills 1 B fig, B (2→1 figs × 2 atk) counters for 2',
    a: { figs:4, atk:1, toHitMod:70, hp:4, abilities: { firstStrike: true } },
    b: { figs:2, atk:2, toHitMod:70, hp:4 },
    expected: { dmgToA: 2, dmgToB: 4 },
  },
  firstStrikeNoKillUnchanged: {
    desc: 'First Strike but no figures killed: damage matches simultaneous (A 1 atk, B 10hp, B 2 atk)',
    a: { atk:1, toHitMod:70, hp:10, abilities: { firstStrike: true } },
    b: { atk:2, toHitMod:70, hp:10 },
    expected: { dmgToA: 2, dmgToB: 1 },
  },
  firstStrikeIgnoredOnRanged: {
    desc: 'First Strike has no effect on ranged attacks (no counter exists anyway)',
    a: { rtbType:'missile', rtb:3, toHitRtbMod:70, hp:10, abilities: { firstStrike: true } },
    b: { hp:10 },
    rangedCheck: true, rangedDist: 1,
    expected: { dmgToA: 0, dmgToB: 3 },
  },
  nodeAuraChaos: {
    desc: 'Node Aura: Chaos Fantastic 4atk/2def in Chaos Node → effective 6atk/4def (+2 each)',
    a: { figs:1, atk:4, def:2, res:5, hp:10, unitType:'fantastic_chaos' },
    b: { figs:1, def:0, res:0, hp:10 },
    nodeAura: 'chaos',
    expected: { dmgToA: 0, dmgToB: 1.800 },
  },
  nodeAuraNoMatch: {
    desc: 'Node Aura Mismatch: same Chaos Fantastic in Nature Node → no bonus, effective 4atk/2def',
    a: { figs:1, atk:4, def:2, res:5, hp:10, unitType:'fantastic_chaos' },
    b: { figs:1, def:0, res:0, hp:10 },
    nodeAura: 'nature',
    expected: { dmgToA: 0, dmgToB: 1.200 },
  },
  darknessDeathVsLife: {
    desc: 'Darkness: Death 4atk/3def→5/4, Life 4atk/3def→3/2, mirror match',
    a: { figs:1, atk:4, def:3, res:5, hp:10, unitType:'fantastic_death' },
    b: { figs:1, atk:4, def:3, res:5, hp:10, unitType:'fantastic_life' },
    enchLightDark: 'darkness',
    expected: { dmgToA: 0.323, dmgToB: 1.033 },
  },
  trueLightDeathVsLife: {
    desc: 'True Light: Death 4atk/3def→3/2, Life 4atk/3def→5/4, mirror match',
    a: { figs:1, atk:4, def:3, res:5, hp:10, unitType:'fantastic_death' },
    b: { figs:1, atk:4, def:3, res:5, hp:10, unitType:'fantastic_life' },
    enchLightDark: 'trueLight',
    expected: { dmgToA: 1.033, dmgToB: 0.323 },
  },
  armorPiercingMelee: {
    desc: 'Armor Piercing Melee: 2 atk 100% hit vs def 3 100% block — AP halves and rounds down def to 1, dmg=1',
    a: { atk:2, toHitMod:70, hp:10, abilities: { armorPiercing: true } },
    b: { def:3, toBlkMod:70, hp:10 },
    expected: { dmgToA: 0, dmgToB: 1.000 },
  },
  armorPiercingRanged: {
    desc: 'Armor Piercing Ranged: missile rtb 2 100% hit vs def 3 100% block — AP halves and rounds down def to 1, dmg=1',
    a: { rtbType:'missile', rtb:2, toHitRtbMod:70, hp:10, abilities: { armorPiercing: true } },
    b: { def:3, toBlkMod:70, hp:10 },
    rangedCheck: true, rangedDist: 1,
    expected: { dmgToA: 0, dmgToB: 1.000 },
  },
  armorPiercingThrown: {
    desc: 'Armor Piercing Thrown: thrown 2 + melee 1 (100% hit) vs def 2 (100% block) — AP halves to 1; thrown 2−1=1, melee 1−1=0',
    a: { atk:1, toHitMod:70, rtbType:'thrown', rtb:2, toHitRtbMod:70, hp:10, abilities: { armorPiercing: true } },
    b: { atk:0, def:2, toBlkMod:70, hp:10 },
    expected: { dmgToA: 0, dmgToB: 1.000 },
  },
  armorPiercingLightningNoDoubleHalve: {
    desc: 'AP + Lightning Breath: def halved once (not twice). Breath 2−1=1; melee 1−1=0',
    a: { atk:1, toHitMod:70, rtbType:'lightning', rtb:2, toHitRtbMod:70, hp:10, abilities: { armorPiercing: true } },
    b: { atk:0, def:2, toBlkMod:70, hp:10 },
    expected: { dmgToA: 0, dmgToB: 1.000 },
  },
  armorPiercingDefenderCounter: {
    desc: 'Defender Armor Piercing: A 1 atk blocked by B def 1; B 2 atk counter halves A def 2→1, dmg=1',
    a: { atk:1, toHitMod:70, def:2, toBlkMod:70, hp:10 },
    b: { atk:2, toHitMod:70, def:1, toBlkMod:70, hp:10, abilities: { armorPiercing: true } },
    expected: { dmgToA: 1.000, dmgToB: 0 },
  },

  // --- Weapon Immunity (MoM 1.31) ---
  weaponImmunityMelee: {
    desc: 'Weapon Immunity: normal melee vs WI (def 0→10), 100% block → all 10 hits blocked',
    a: { atk:10, toHitMod:70, hp:10 },
    b: { def:0, toBlkMod:70, hp:10, abilities: { weaponImmunity: true } },
    expected: { dmgToA: 0, dmgToB: 0 },
  },
  weaponImmunityMagicWeapon: {
    desc: 'Weapon Immunity bypassed by magic weapon: 10 hits vs 0 def → full damage',
    a: { atk:10, toHitMod:70, hp:10, weapon: 'magic' },
    b: { def:0, toBlkMod:70, hp:10, abilities: { weaponImmunity: true } },
    expected: { dmgToA: 0, dmgToB: 10 },
  },
  weaponImmunityFantastic: {
    desc: 'Weapon Immunity bypassed by fantastic unit: 10 hits vs 0 def → full damage',
    a: { atk:10, toHitMod:70, hp:10, unitType: 'fantastic_chaos' },
    b: { def:0, toBlkMod:70, hp:10, abilities: { weaponImmunity: true } },
    expected: { dmgToA: 0, dmgToB: 10 },
  },
  weaponImmunityHero: {
    desc: 'Weapon Immunity bypassed by hero: 10 hits vs 0 def → full damage',
    a: { atk:10, toHitMod:70, hp:10, unitType: 'hero' },
    b: { def:0, toBlkMod:70, hp:10, abilities: { weaponImmunity: true } },
    expected: { dmgToA: 0, dmgToB: 10 },
  },
  weaponImmunityCounter: {
    desc: 'Weapon Immunity on attacker: A has WI (def 0→10), B normal counter 10 atk all blocked',
    a: { atk:1, toHitMod:70, def:0, toBlkMod:70, hp:10, abilities: { weaponImmunity: true } },
    b: { atk:10, toHitMod:70, def:0, toBlkMod:70, hp:10 },
    expected: { dmgToA: 0, dmgToB: 1 },
  },
  weaponImmunityThrown131: {
    desc: 'Weapon Immunity v1.31 bug: thrown ignores WI → def stays 0, all 10 thrown hits land; melee 1 hit blocked by WI def 10',
    a: { atk:1, toHitMod:70, rtbType:'thrown', rtb:10, toHitRtbMod:70, hp:10 },
    b: { atk:0, def:0, toBlkMod:70, hp:20, abilities: { weaponImmunity: true } },
    expected: { dmgToA: 0, dmgToB: 10 },
  },
  weaponImmunityRangedMissile: {
    desc: 'Weapon Immunity applies to ranged missile: def 0→10, 100% block → all hits blocked',
    a: { rtbType:'missile', rtb:10, toHitRtbMod:70, hp:10 },
    b: { def:0, toBlkMod:70, hp:10, abilities: { weaponImmunity: true } },
    rangedCheck: true, rangedDist: 1,
    expected: { dmgToA: 0, dmgToB: 0 },
  },
  weaponImmunityRangedMagic: {
    desc: 'Weapon Immunity does not apply to ranged magic: 10 hits vs 0 def → full damage',
    a: { rtbType:'magic_c', rtb:10, toHitRtbMod:70, hp:10 },
    b: { def:0, toBlkMod:70, hp:10, abilities: { weaponImmunity: true } },
    rangedCheck: true, rangedDist: 1,
    expected: { dmgToA: 0, dmgToB: 10 },
  },
  // --- Weapon Immunity (version-specific) ---
  weaponImmunityThrownPatched: {
    desc: 'Weapon Immunity patched: thrown triggers WI (def 0→10), 100% block → all thrown + melee blocked',
    version: 'mom_cp_1.60.00',
    a: { atk:1, toHitMod:70, rtbType:'thrown', rtb:10, toHitRtbMod:70, hp:10 },
    b: { atk:0, def:0, toBlkMod:70, hp:10, abilities: { weaponImmunity: true } },
    expected: { dmgToA: 0, dmgToB: 0 },
  },
  weaponImmunityCom2Melee: {
    desc: 'Weapon Immunity CoM2: normal melee vs WI → def 0+8=8, 100% block → only 8 hits blocked',
    version: 'com2_1.05.11',
    a: { atk:10, toHitMod:70, hp:10 },
    b: { def:0, toBlkMod:70, hp:10, abilities: { weaponImmunity: true } },
    expected: { dmgToA: 0, dmgToB: 2 },
  },

  // --- Missile Immunity ---
  missileImmunityMissile: {
    desc: 'Missile Immunity vs Missile: def 2→50, 3 atk 100% hit → all blocked (50 def × 100% block)',
    a: { rtbType:'missile', rtb:3, toHitRtbMod:70, hp:10 },
    b: { def:2, toBlkMod:70, hp:10, abilities: { missileImmunity: true } },
    rangedCheck: true, rangedDist: 1,
    expected: { dmgToA: 0, dmgToB: 0 },
  },
  missileImmunityBoulder: {
    desc: 'Missile Immunity does NOT apply to boulder: def stays 2, 3 atk 100% hit → 1 dmg',
    a: { rtbType:'boulder', rtb:3, toHitRtbMod:70, hp:10 },
    b: { def:2, toBlkMod:70, hp:10, abilities: { missileImmunity: true } },
    rangedCheck: true, rangedDist: 1,
    expected: { dmgToA: 0, dmgToB: 1.000 },
  },
  missileImmunityMagic: {
    desc: 'Missile Immunity does NOT apply to magic ranged: def stays 0, 3 atk 100% hit → 3 dmg',
    a: { rtbType:'magic_c', rtb:3, toHitRtbMod:70, hp:10 },
    b: { def:0, toBlkMod:70, hp:10, abilities: { missileImmunity: true } },
    rangedCheck: true, rangedDist: 1,
    expected: { dmgToA: 0, dmgToB: 3.000 },
  },
  missileImmunityMelee: {
    desc: 'Missile Immunity does NOT apply to melee: def stays 0, 3 atk 100% hit → 3 dmg',
    a: { atk:3, toHitMod:70, hp:10, abilities: {} },
    b: { def:0, toBlkMod:70, hp:10, abilities: { missileImmunity: true } },
    expected: { dmgToA: 0, dmgToB: 3.000 },
  },
  missileImmunityArmorPiercing: {
    desc: 'Missile Immunity after Armor Piercing: AP halves first, then MI raises to 50 → all blocked',
    a: { rtbType:'missile', rtb:3, toHitRtbMod:70, hp:10, abilities: { armorPiercing: true } },
    b: { def:6, toBlkMod:70, hp:10, abilities: { missileImmunity: true } },
    rangedCheck: true, rangedDist: 1,
    expected: { dmgToA: 0, dmgToB: 0 },
  },

  missileImmunityWIOverwrite131: {
    desc: 'v1.31 bug: WI+MI vs normal missile → WI overwrites MI, def=10 not 50. 15 hits − 10 blocks = 5',
    a: { rtbType:'missile', rtb:15, toHitRtbMod:70, hp:10 },
    b: { def:0, toBlkMod:70, hp:20, abilities: { weaponImmunity: true, missileImmunity: true } },
    rangedCheck: true, rangedDist: 1,
    expected: { dmgToA: 0, dmgToB: 5.000 },
  },
  missileImmunityWIOverwriteFixed: {
    desc: 'v1.60 fix: WI+MI vs normal missile → MI wins, def=50. 15 hits all blocked',
    version: 'mom_cp_1.60.00',
    a: { rtbType:'missile', rtb:15, toHitRtbMod:70, hp:10 },
    b: { def:0, toBlkMod:70, hp:20, abilities: { weaponImmunity: true, missileImmunity: true } },
    rangedCheck: true, rangedDist: 1,
    expected: { dmgToA: 0, dmgToB: 0 },
  },
  missileImmunityWIMagicWeapon: {
    desc: 'WI+MI vs magic weapon missile → WI bypassed, MI still applies, def=50. All blocked',
    a: { rtbType:'missile', rtb:15, toHitRtbMod:70, hp:10, weapon:'magic' },
    b: { def:0, toBlkMod:70, hp:20, abilities: { weaponImmunity: true, missileImmunity: true } },
    rangedCheck: true, rangedDist: 1,
    expected: { dmgToA: 0, dmgToB: 0 },
  },

  // --- Illusion ---
  illusionMelee: {
    desc: 'Illusion Melee: 5 atk 30% hit vs def 6 → def becomes 0, E[dmg] = 5×0.3 = 1.5',
    a: { atk:5, hp:10, abilities: { illusion: true } },
    b: { def:6, hp:10 },
    expected: { dmgToA: 0, dmgToB: 1.500 },
  },
  illusionRanged: {
    desc: 'Illusion Ranged: missile 5 atk 30% hit vs def 6 → def becomes 0, E[dmg] = 5×0.3 = 1.5',
    a: { rtbType:'missile', rtb:5, hp:10, abilities: { illusion: true } },
    b: { def:6, hp:10 },
    rangedCheck: true, rangedDist: 1,
    expected: { dmgToA: 0, dmgToB: 1.500 },
  },
  illusionThrown: {
    desc: 'Illusion Thrown: thrown 5 + melee 1, 30% hit vs def 6 → def becomes 0, E[dmg] = 6×0.3 = 1.8',
    a: { atk:1, rtbType:'thrown', rtb:5, hp:10, abilities: { illusion: true } },
    b: { atk:0, def:6, hp:10 },
    expected: { dmgToA: 0, dmgToB: 1.800 },
  },
  illusionCounter: {
    desc: 'Illusion on defender: B counter ignores A def 6. A 1atk all blocked; B 5atk 30% hit → E[counter] = 1.5',
    a: { atk:1, toHitMod:70, def:6, hp:10 },
    b: { atk:5, def:1, toBlkMod:70, hp:10, abilities: { illusion: true } },
    expected: { dmgToA: 1.500, dmgToB: 0 },
  },
  illusionImmunityNegates: {
    desc: 'Illusion Immunity: 5 atk 30% hit vs def 6 + Illusion Immunity → def stays 6, normal damage',
    a: { atk:5, hp:10, abilities: { illusion: true } },
    b: { def:6, hp:10, abilities: { illusionImmunity: true } },
    expected: { dmgToA: 0, dmgToB: 0.449 },
  },
  illusionCityWalls: {
    desc: 'Illusion + City Walls: def 3 base + 3 CW = 6, Illusion → only CW survives, def=3',
    a: { atk:5, toHitMod:70, hp:10, abilities: { illusion: true } },
    b: { def:3, toBlkMod:70, hp:10 },
    cityWalls: '3',
    expected: { dmgToA: 0, dmgToB: 2.000 },
  },
  illusionOverridesWeaponImmunity: {
    desc: 'Illusion overrides Weapon Immunity: WI sets def to 10, then Illusion sets to 0 → full damage',
    a: { atk:5, toHitMod:70, hp:10, abilities: { illusion: true } },
    b: { def:0, toBlkMod:70, hp:10, abilities: { weaponImmunity: true } },
    expected: { dmgToA: 0, dmgToB: 5.000 },
  },

  // --- Doom Damage ---
  doomDamageMelee: {
    desc: 'Doom Damage Melee: 1 fig 5 atk doom vs 5 def — bypasses to-hit and defense, exact 5 damage',
    a: { atk:5, hp:10, abilities: { doom: true } },
    b: { def:5, toBlkMod:70, hp:10 },
    expected: { dmgToA: 0, dmgToB: 5.000 },
  },
  doomDamageMultiFig: {
    desc: 'Doom Damage Multi-fig: 4 figs × 2 atk doom vs 5 def — exact 8 damage, ignores defense',
    a: { figs:4, atk:2, hp:10, abilities: { doom: true } },
    b: { def:5, toBlkMod:70, hp:10 },
    expected: { dmgToA: 0, dmgToB: 8.000 },
  },
  doomDamageRanged: {
    desc: 'Doom Damage Ranged: 1 fig 5 missile doom vs 5 def — exact 5 damage, no distance penalty',
    a: { rtbType:'missile', rtb:5, hp:10, abilities: { doom: true } },
    b: { def:5, toBlkMod:70, hp:10 },
    rangedCheck: true, rangedDist: 9,
    expected: { dmgToA: 0, dmgToB: 5.000 },
  },
  doomDamageThrownAffected: {
    desc: 'Doom Damage applies to thrown + melee: 1 thrown doom + 3 melee doom vs 5 def, 20 hp — exact 1 + 3 = 4',
    a: { atk:3, rtbType:'thrown', rtb:1, hp:10, abilities: { doom: true } },
    b: { def:5, toBlkMod:70, hp:20 },
    expected: { dmgToA: 0, dmgToB: 4.000 },
  },
  doomDamageCounter: {
    desc: 'Doom Damage Counter: defender 5 atk doom vs attacker 5 def — counter is exact 5 damage',
    a: { atk:1, toHitMod:70, def:5, toBlkMod:70, hp:10 },
    b: { atk:5, hp:10, abilities: { doom: true } },
    expected: { dmgToA: 5.000, dmgToB: 1.000 },
  },

  // --- Holy Bonus ---
  holyBonusMeleeAtk: {
    desc: 'Holy Bonus Melee Atk: base 1 atk + HB 2 → effective 3 atk, 100% hit vs 0 def → 3 dmg',
    a: { atk:1, toHitMod:70, hp:10, abilities: { holyBonus: 2 } },
    b: { hp:10 },
    expected: { dmgToA: 0, dmgToB: 3.000 },
  },
  holyBonusDef: {
    desc: 'Holy Bonus Defense: 2 atk 100% hit vs base def 1 + HB 2 → effective 3 def, 100% block → all blocked',
    a: { atk:2, toHitMod:70, hp:10 },
    b: { def:1, toBlkMod:70, hp:10, abilities: { holyBonus: 2 } },
    expected: { dmgToA: 0, dmgToB: 0 },
  },
  holyBonusRes: {
    desc: 'Holy Bonus Resistance: Poison 4 vs base res 5 + HB 2 → effective res 7, pFail 30%, E[dmg]=1.2',
    a: { atk:1, toHitMod:70, hp:10, abilities: { poison: 4 } },
    b: { def:1, toBlkMod:70, res:5, hp:10, abilities: { holyBonus: 2 } },
    expected: { dmgToA: 0, dmgToB: 1.200 },
  },
  holyBonusRangedMoM: {
    desc: 'Holy Bonus MoM: HB does NOT boost ranged atk in MoM. rtb 1 + HB 2 → still 1 hit',
    a: { rtbType:'missile', rtb:1, toHitRtbMod:70, hp:10, abilities: { holyBonus: 2 } },
    b: { hp:10 },
    rangedCheck: true, rangedDist: 1,
    expected: { dmgToA: 0, dmgToB: 1.000 },
  },
  holyBonusRangedCoM2: {
    desc: 'Holy Bonus CoM2: HB boosts ranged atk. rtb 1 + HB 2 → 3 hits, 100% hit vs 0 def → 3 dmg',
    version: 'com2_1.05.11',
    a: { rtbType:'missile', rtb:1, toHitRtbMod:70, hp:10, abilities: { holyBonus: 2 } },
    b: { hp:10 },
    rangedCheck: true, rangedDist: 1,
    expected: { dmgToA: 0, dmgToB: 3.000 },
  },

  // --- Resistance to All ---
  resistanceToAllBasic: {
    desc: 'Resistance to All: Poison 4 vs base res 5 + RTA 2 → effective res 7, pFail 30%, E[dmg]=1.2',
    a: { atk:1, toHitMod:70, hp:10, abilities: { poison: 4 } },
    b: { def:1, toBlkMod:70, res:5, hp:10, abilities: { resistanceToAll: 2 } },
    expected: { dmgToA: 0, dmgToB: 1.200 },
  },
  resistanceToAllCap: {
    desc: 'Resistance to All caps immunity: Poison 4 vs res 8 + RTA 2 → effective res 10, pFail 0% → immune',
    a: { atk:1, toHitMod:70, hp:10, abilities: { poison: 4 } },
    b: { def:1, toBlkMod:70, res:8, hp:10, abilities: { resistanceToAll: 2 } },
    expected: { dmgToA: 0, dmgToB: 0 },
  },
  holyBonusPlusResistanceToAll: {
    desc: 'HB + RTA stacking: Poison 4 vs res 4 + HB 1 + RTA 1 → effective res 6, pFail 40%, E[dmg]=1.6',
    a: { atk:1, toHitMod:70, hp:10, abilities: { poison: 4 } },
    b: { def:1, toBlkMod:70, res:4, hp:10, abilities: { holyBonus: 1, resistanceToAll: 1 } },
    expected: { dmgToA: 0, dmgToB: 1.600 },
  },

  // --- Lucky ---
  luckyToHit: {
    desc: 'Lucky To Hit: 1 atk, base 30% + Lucky +10% = 40% hit vs 0 def → E[dmg] = 0.4',
    a: { atk:1, hp:10, abilities: { lucky: true } },
    b: { hp:10 },
    expected: { dmgToA: 0, dmgToB: 0.400 },
  },
  luckyToHitRanged: {
    desc: 'Lucky To Hit Ranged: missile 1 atk, base 30% + Lucky +10% = 40% hit vs 0 def → 0.4',
    a: { rtbType:'missile', rtb:1, hp:10, abilities: { lucky: true } },
    b: { hp:10 },
    rangedCheck: true, rangedDist: 1,
    expected: { dmgToA: 0, dmgToB: 0.400 },
  },
  luckyToBlock: {
    desc: 'Lucky To Block: 1 atk 100% hit vs def 1, base 30% + Lucky +10% = 40% block → E[dmg] = 0.6',
    version: 'mom_cp_1.60.00',
    a: { atk:1, toHitMod:70, hp:10 },
    b: { def:1, hp:10, abilities: { lucky: true } },
    expected: { dmgToA: 0, dmgToB: 0.600 },
  },
  luckyResistance: {
    desc: 'Lucky Resistance: Poison 4 vs base res 5 + Lucky +1 = res 6, pFail 40%, E[dmg] = 1.6',
    a: { atk:1, toHitMod:70, hp:10, abilities: { poison: 4 } },
    b: { def:1, toBlkMod:70, res:5, hp:10, abilities: { lucky: true } },
    expected: { dmgToA: 0, dmgToB: 1.600 },
  },
  luckyEnemyMeleePenalty131: {
    desc: 'Lucky v1.31 enemy penalty: B Lucky, A melee 30% → 20%. 1 atk vs 0 def → E[dmg] = 0.2',
    a: { atk:1, hp:10 },
    b: { hp:10, abilities: { lucky: true } },
    expected: { dmgToA: 0, dmgToB: 0.200 },
  },
  luckyEnemyPenaltyNotRanged131: {
    desc: 'Lucky v1.31: enemy penalty does NOT apply to ranged. Missile 1 atk 30% → still 0.3',
    a: { rtbType:'missile', rtb:1, hp:10 },
    b: { hp:10, abilities: { lucky: true } },
    rangedCheck: true, rangedDist: 1,
    expected: { dmgToA: 0, dmgToB: 0.300 },
  },
  luckyEnemyPenaltyRemovedPatched: {
    desc: 'Lucky patched: enemy melee penalty removed in v1.60. 1 atk 30% vs Lucky → still 0.3',
    version: 'mom_cp_1.60.00',
    a: { atk:1, hp:10 },
    b: { hp:10, abilities: { lucky: true } },
    expected: { dmgToA: 0, dmgToB: 0.300 },
  },

  // --- Predefined unit matchups (MoM 1.31) ---
  // --- Large Shield ---
  largeShieldRangedMissile: {
    desc: 'Large Shield Ranged: missile 4 (100% hit) vs def 1+2=3 (100% block) → 4−3=1',
    a: { rtbType:'missile', rtb:4, toHitRtbMod:70, hp:10 },
    b: { def:1, toBlkMod:70, hp:10, abilities: { largeShield: true } },
    rangedCheck: true, rangedDist: 1,
    expected: { dmgToA: 0, dmgToB: 1.000 },
  },
  largeShieldMeleeNoEffect: {
    desc: 'Large Shield Melee: LS does NOT apply — atk 4 (100% hit) vs def 1 (100% block) → 4−1=3',
    a: { atk:4, toHitMod:70, hp:10 },
    b: { atk:0, def:1, toBlkMod:70, hp:10, abilities: { largeShield: true } },
    expected: { dmgToA: 0, dmgToB: 3.000 },
  },
  largeShieldThrown: {
    desc: 'Large Shield Thrown: thrown 4 (100% hit) vs def 1+2=3 (100% block) → 4−3=1; melee 1 vs def 1 (no LS) → 0',
    a: { atk:1, toHitMod:70, rtbType:'thrown', rtb:4, toHitRtbMod:70, hp:10 },
    b: { atk:0, def:1, toBlkMod:70, hp:10, abilities: { largeShield: true } },
    expected: { dmgToA: 0, dmgToB: 1.000 },
  },
  largeShieldArmorPiercing: {
    desc: 'Large Shield + AP Ranged: def 4+2=6 halved to 3 — missile 4 (100% hit) vs 3 (100% block) → 1',
    a: { rtbType:'missile', rtb:4, toHitRtbMod:70, hp:10, abilities: { armorPiercing: true } },
    b: { def:4, toBlkMod:70, hp:10, abilities: { largeShield: true } },
    rangedCheck: true, rangedDist: 1,
    expected: { dmgToA: 0, dmgToB: 1.000 },
  },
  largeShieldFireBreath: {
    desc: 'Large Shield Breath: fire breath 4 (100% hit) vs def 1+2=3 (100% block) → 4−3=1; melee 1 vs def 1 (no LS) → 0',
    a: { atk:1, toHitMod:70, rtbType:'fire', rtb:4, toHitRtbMod:70, hp:10 },
    b: { atk:0, def:1, toBlkMod:70, hp:10, abilities: { largeShield: true } },
    expected: { dmgToA: 0, dmgToB: 1.000 },
  },

  // --- Large Shield (CoM2: +3) ---
  largeShieldCom2Ranged: {
    desc: 'Large Shield CoM2: missile 4 (100% hit) vs def 1+3=4 (100% block) → 0',
    a: { rtbType:'missile', rtb:4, toHitRtbMod:70, hp:10 },
    b: { def:1, toBlkMod:70, hp:10, abilities: { largeShield: true } },
    rangedCheck: true, rangedDist: 1,
    version: 'com2_1.05.11',
    expected: { dmgToA: 0, dmgToB: 0 },
  },

  // --- Predefined-unit Tests ---
  predefBarbSwordsVsSpears: {
    desc: 'Barbarian Swordsmen vs Barbarian Spearmen: basic normal-vs-normal melee',
    aUnitName: 'Barbarian Swordsmen',
    bUnitName: 'Barbarian Spearmen',
  },
  predefLongbowmenVsOrcSpears: {
    desc: 'Longbowmen vs Orc Spearmen: ranged missile matchup at range 1',
    aUnitName: 'Longbowmen',
    bUnitName: 'Orc Spearmen',
    rangedCheck: true,
    rangedDist: 1,
  },
  predefWarBearsVsDwarvenHalberdiers: {
    desc: 'War Bears vs Dwarven Halberdiers: Nature fantastic vs tough normal infantry',
    aUnitName: 'War Bears',
    bUnitName: 'Dwarven Halberdiers',
  },
  predefGreatDrakeVsHydra: {
    desc: 'Great Drake vs Hydra: fantastic vs fantastic, breath and multi-attack',
    aUnitName: 'Great Drake',
    bUnitName: 'Hydra',
  },
  predefDeathKnightsVsPaladins: {
    desc: 'Death Knights vs Ultra Elite Paladins: Death fantastic (life steal) vs strong normal unit',
    aUnitName: 'Death Knights',
    bUnitName: 'Paladins',
    b: { level: 'ultra_elite', weapon: 'adamantium' },
  },
};

const TEST_TREE = [
  {
    name: 'Artificial MoM 1.31 tests',
    version: 'mom_1.31',
    subs: [
      { name: 'Core / Binomial', keys: ['attackRolls', 'defenseRolls'] },
      { name: 'Multi-figure', keys: ['multiFigDefense', 'multiFigOverflow', 'multiFigAttack', 'complexMelee'] },
      { name: 'Ranged', keys: ['rangedMissileBasic', 'rangedBoulderBasic', 'rangedMagicBasic'] },
      { name: 'Thrown', keys: ['thrownBasic'] },
      { name: 'Breath', keys: ['fireBreathBasic', 'lightningBreathBasic'] },
      { name: 'Level & Weapon bonuses', keys: ['levelWeaponBonus'] },
      { name: 'Poison touch', keys: ['poisonTouchBasic', 'poisonPlusMelee', 'poisonImmunity', 'poisonHighRes', 'poisonRanged', 'poisonThrown'] },
      { name: 'Stoning touch', keys: ['stoningTouchBasic', 'stoningImmunity', 'stoningMagicImmunity', 'stoningHighRes', 'stoningMultiFig'] },
      { name: 'Stoning gaze', keys: ['stoningGazeBasic', 'stoningGazeMultiFig', 'stoningGazeBilateral', 'stoningGazeImmunity'] },
      { name: 'Death gaze', keys: ['deathGazeBasic', 'deathGazeMultiFig', 'deathGazeDeathImmunity', 'deathGazeMagicImmunity', 'deathGazeStoningImmunityNotBlocked', 'deathGazeHighRes'] },
      { name: 'Combined gaze', keys: ['combinedStoningDeathGaze'] },
      { name: 'Doom gaze', keys: ['doomGazeBasic', 'doomGazeMagicImmunity', 'doomGazeKill', 'doomGazeChaosSpawn'] },
      { name: 'Doom damage', keys: ['doomDamageMelee', 'doomDamageMultiFig', 'doomDamageRanged', 'doomDamageThrownAffected', 'doomDamageCounter'] },
      { name: 'Life steal', keys: ['lifeStealBasic', 'lifeStealDeathImmune', 'lifeStealMagicImmune', 'lifeStealHighRes', 'lifeStealNoMod'] },
      { name: 'First Strike', keys: ['firstStrikeKillsBeforeCounter', 'negateFirstStrike', 'firstStrikeMultiFig', 'firstStrikeNoKillUnchanged', 'firstStrikeIgnoredOnRanged'] },
      { name: 'Node aura', keys: ['nodeAuraChaos', 'nodeAuraNoMatch'] },
      { name: 'Darkness / True Light', keys: ['darknessDeathVsLife', 'trueLightDeathVsLife'] },
      { name: 'Armor Piercing', keys: ['armorPiercingMelee', 'armorPiercingRanged', 'armorPiercingThrown', 'armorPiercingLightningNoDoubleHalve', 'armorPiercingDefenderCounter'] },
      { name: 'Weapon Immunity', keys: ['weaponImmunityMelee', 'weaponImmunityMagicWeapon', 'weaponImmunityFantastic', 'weaponImmunityHero', 'weaponImmunityCounter', 'weaponImmunityThrown131', 'weaponImmunityRangedMissile', 'weaponImmunityRangedMagic'] },
      { name: 'Missile Immunity', keys: ['missileImmunityMissile', 'missileImmunityBoulder', 'missileImmunityMagic', 'missileImmunityMelee', 'missileImmunityArmorPiercing', 'missileImmunityWIOverwrite131', 'missileImmunityWIMagicWeapon'] },
      { name: 'Illusion', keys: ['illusionMelee', 'illusionRanged', 'illusionThrown', 'illusionCounter', 'illusionImmunityNegates', 'illusionCityWalls', 'illusionOverridesWeaponImmunity'] },
      { name: 'Holy Bonus', keys: ['holyBonusMeleeAtk', 'holyBonusDef', 'holyBonusRes', 'holyBonusRangedMoM'] },
      { name: 'Resistance to All', keys: ['resistanceToAllBasic', 'resistanceToAllCap', 'holyBonusPlusResistanceToAll'] },
      { name: 'Lucky', keys: ['luckyToHit', 'luckyToHitRanged', 'luckyResistance', 'luckyEnemyMeleePenalty131', 'luckyEnemyPenaltyNotRanged131'] },
      { name: 'Large Shield', keys: ['largeShieldRangedMissile', 'largeShieldMeleeNoEffect', 'largeShieldThrown', 'largeShieldArmorPiercing', 'largeShieldFireBreath'] },
    ],
  },
  {
    name: 'Predefined units tests',
    version: 'mom_1.31',
    subs: [
      {
        name: 'Basic matchups',
        keys: [
          'predefBarbSwordsVsSpears',
          'predefLongbowmenVsOrcSpears',
          'predefWarBearsVsDwarvenHalberdiers',
          'predefGreatDrakeVsHydra',
          'predefDeathKnightsVsPaladins',
        ],
      },
    ],
  },
  { name: 'Version differences tests', subs: [
      { name: 'Weapon Immunity', keys: ['weaponImmunityThrownPatched', 'weaponImmunityCom2Melee', 'weaponImmunityCom2Ranged'] },
      { name: 'Missile Immunity + WI fix', keys: ['missileImmunityWIOverwriteFixed'] },
      { name: 'Holy Bonus Ranged (CoM2)', keys: ['holyBonusRangedCoM2'] },
      { name: 'Lucky (patched)', keys: ['luckyToBlock', 'luckyEnemyPenaltyRemovedPatched'] },
      { name: 'Large Shield (CoM2: +3)', keys: ['largeShieldCom2Ranged'] },
    ],
  },
];

const UNIT_DEFAULTS = {
  figs: 1, atk: 0, rtbType: 'none', rtb: 0,
  def: 0, res: 0,
  toHitMod: 0, toHitRtbMod: 0,
  toBlkMod: 0, hp: 1, dmg: 0, weapon: 'normal', level: 'normal', unitType: 'normal', abilities: {},
};
