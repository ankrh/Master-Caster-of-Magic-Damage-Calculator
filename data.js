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
  { key: 'poison', label: 'Poison Touch', type: 'num', match: 'Poison', group: 'Abilities' },
  { key: 'lifeSteal', label: 'Life Steal', type: 'num', match: 'LifeSteal', group: 'Abilities' },
  { key: 'stoningTouch', label: 'Stoning Touch', type: 'num', match: 'StoningTouch', group: 'Abilities' },
  { key: 'deathGaze', label: 'Death Gaze', type: 'num', match: 'DeathGaze', group: 'Abilities' },
  { key: 'stoningGaze', label: 'Stoning Gaze', type: 'num', match: 'StoningGaze', group: 'Abilities' },
  { key: 'doomGaze', label: 'Doom Gaze', type: 'num', match: 'DoomGaze', group: 'Abilities' },
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
  { key: 'illusionImmunity', label: 'Illusion Imm./Tr. Sight', type: 'bool', match: 'IllusionImmunity', group: 'Abilities/Enchantments', realm: 'life' },
  { key: 'fear', label: 'Cause Fear/Cl. of Fear', type: 'bool', match: 'Fear', group: 'Abilities/Enchantments', realm: 'death' },
  { key: 'weaponImmunity', label: 'Weapon Imm./Wr. Form', type: 'bool', match: 'WeaponImmunity', group: 'Abilities/Enchantments', realm: 'death' },
  { key: 'immolation', label: 'Immolation', type: 'bool', match: 'Immolation', group: 'Abilities/Enchantments', realm: 'chaos' },
  { key: 'invisibility', label: 'Invisible', type: 'bool', match: 'Invisibility', group: 'Abilities/Enchantments', realm: 'sorcery' },
  { key: 'magicImmunity', label: 'Magic Immunity', type: 'bool', match: 'MagicImmunity', group: 'Abilities/Enchantments', realm: 'sorcery' },
  { key: 'missileImmunity', label: 'Missile Imm./G. Wind', type: 'bool', match: 'MissileImmunity', group: 'Abilities/Enchantments', realm: 'sorcery' },
  // Enchantments (spell-granted only) — dropdowns first, then checkboxes; each sorted by realm
  { key: 'prayer', label: 'Prayer', type: 'select', options: [['none','None'],['prayer','Prayer'],['highPrayer','High Prayer']], group: 'Enchantments', realm: 'life' },
  { key: 'flameBlade', label: 'Metal Fires/Fl. Blade', type: 'select', options: [['none','None'],['metalFires','Metal Fires'],['flameBlade','Flame Blade']], group: 'Enchantments', realm: 'chaos' },
  { key: 'chaosChannels', label: 'Chaos Channels', type: 'select', options: [['none','None'],['defense','+Defense'],['fireBreath','+Fire Breath']], group: 'Enchantments', realm: 'chaos' },
  { key: 'stoneSkin', label: 'Stone/Iron Skin', type: 'select', options: [['none','None'],['stoneSkin','Stone Skin'],['ironSkin','Iron Skin']], group: 'Enchantments', realm: 'nature' },
  { key: 'bless', label: 'Bless', type: 'bool', match: 'Bless', group: 'Enchantments', realm: 'life' },
  { key: 'holyWeapon', label: 'Holy Weapon/H. Arms', type: 'bool', match: 'HolyWeapon', group: 'Enchantments', realm: 'life' },
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
  'mom_1.03.01':    MOM_UNITS_DATA,
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
    desc: 'Thrown: 100% to hit thrown, no melee atk — thrown kills the defender before counter',
    a: { atk:0, rtbType:'thrown', rtb:1, toHitRtbMod:70, def:0, hp:1 },
    b: { atk:1, toHitMod:70, def:0, hp:1 },
    expected: { dmgToA: 0, dmgToB: 1 },
  },
  fireBreathBasic: {
    desc: 'Fire Breath: 100% to hit breath, no melee atk — breath kills the defender before counter',
    a: { atk:0, rtbType:'fire', rtb:1, toHitRtbMod:70, def:0, hp:1 },
    b: { atk:1, toHitMod:70, def:0, hp:1 },
    expected: { dmgToA: 0, dmgToB: 1 },
  },
  lightningBreathBasic: {
    desc: 'Lightning Breath: 100% to hit breath, no melee atk — lightning kills the defender despite 1 defense',
    a: { atk:0, rtbType:'lightning', rtb:1, toHitRtbMod:70, def:0, hp:1 },
    b: { atk:1, toHitMod:70, def:1, toBlkMod:70, hp:1 },
    expected: { dmgToA: 0, dmgToB: 1 },
  },
  levelWeaponBonus: {
    desc: 'Level+Weapon Bonus: Champion+Adamantium (base 1atk/2def/1hp) matches defender with equivalent effective stats',
    a: { figs:8, atk:1, def:2, res:5, hp:1, level:'champion', weapon:'adamantium' },
    b: { figs:8, atk:6, toHitMod:40, toHitRtbMod:30, def:6, res:10, hp:3 },
    expected: { dmgToA: 17.375, dmgToB: 17.375 },
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
  darknessBoostsDeath: {
    desc: 'Darkness: Death unit 4atk gets +1 → effective 5atk, 30% to hit vs 0 def',
    a: { figs:1, atk:4, def:0, hp:10, unitType:'fantastic_death' },
    b: { figs:1, def:0, hp:10 },
    enchLightDark: 'darkness',
    expected: { dmgToA: 0, dmgToB: 1.500 },
  },
  darknessHinderLife: {
    desc: 'Darkness: Life unit 4atk gets −1 → effective 3atk, 30% to hit vs 0 def',
    a: { figs:1, atk:4, def:0, hp:10, unitType:'fantastic_life' },
    b: { figs:1, def:0, hp:10 },
    enchLightDark: 'darkness',
    expected: { dmgToA: 0, dmgToB: 0.900 },
  },
};

const UNIT_DEFAULTS = {
  figs: 1, atk: 0, rtbType: 'none', rtb: 0,
  def: 0, res: 0,
  toHitMod: 0, toHitRtbMod: 0,
  toBlkMod: 0, hp: 1, dmg: 0, weapon: 'normal', level: 'normal', unitType: 'normal', abilities: {},
};
