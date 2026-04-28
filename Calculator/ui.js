// --- UI Layer ---
// All DOM interaction. Depends on data.js, engine.js, combat.js.

// --- Abilities UI ---

function buildAbilitiesUI(prefix) {
  const container = document.getElementById(prefix + 'Abilities');
  let gridDiv = null;
  let currentGroup = '';
  let currentGroupClass = '';
  let currentSubgroup = '';
  for (const abil of ABILITY_DEFS) {
    if (abil.group && abil.group !== currentGroup) {
      currentGroup = abil.group;
      currentGroupClass = 'group-' + currentGroup.toLowerCase().replace(/[^a-z]+/g, '-');
      currentSubgroup = '';
      gridDiv = null;
      const header = document.createElement('div');
      header.className = 'abil-group-header';
      header.dataset.abilGroup = currentGroup;
      header.textContent = currentGroup;
      container.appendChild(header);
    }
    if (abil.subgroup && abil.subgroup !== currentSubgroup) {
      currentSubgroup = abil.subgroup;
      gridDiv = null;
      if (!abil.subgroup.startsWith('_')) {
        const subheader = document.createElement('div');
        subheader.className = 'abil-subgroup-header';
        subheader.dataset.abilGroup = currentGroup;
        subheader.dataset.abilSubgroup = currentSubgroup;
        subheader.textContent = currentSubgroup;
        container.appendChild(subheader);
      }
    }
    if (!gridDiv) {
      gridDiv = document.createElement('div');
      gridDiv.className = 'abil-grid ' + currentGroupClass;
      gridDiv.dataset.abilGroup = currentGroup;
      if (currentSubgroup) gridDiv.dataset.abilSubgroup = currentSubgroup;
      container.appendChild(gridDiv);
    }
    const id = prefix + 'Abil_' + abil.key;
    const realmCls = abil.realm ? 'realm-' + abil.realm : '';
    // Color only spell-name text: for dual-name ability/spell labels, wrap the spell part after '/'
    let labelHtml;
    if (realmCls && abil.group === 'Abilities/Enchantments' && abil.label.includes('/')) {
      const slashIdx = abil.label.indexOf('/');
      labelHtml = abil.label.slice(0, slashIdx + 1) + `<span class="${realmCls}">${abil.label.slice(slashIdx + 1)}</span>`;
    } else if (realmCls) {
      labelHtml = `<span class="${realmCls}">${abil.label}</span>`;
    } else {
      labelHtml = abil.label;
    }
    if (abil.type === 'bool') {
      const lbl = document.createElement('label');
      lbl.className = 'abil-check abil-item';
      lbl.dataset.abilKey = abil.key;
      if (abil.tooltip) lbl.dataset.tooltip = abil.tooltip;
      lbl.innerHTML = `<input type="checkbox" id="${id}"> ${labelHtml}`;
      gridDiv.appendChild(lbl);
    } else if (abil.type === 'select') {
      const row = document.createElement('div');
      row.className = 'abil-num-row abil-item';
      row.dataset.abilKey = abil.key;
      row.dataset.abilDefault = abil.options[0][0];
      if (abil.tooltip) row.dataset.tooltip = abil.tooltip;
      const opts = abil.options.map(([v, l]) => `<option value="${v}">${l}</option>`).join('');
      row.innerHTML = `<label for="${id}">${labelHtml}</label><select id="${id}">${opts}</select>`;
      gridDiv.appendChild(row);
    } else if (abil.type === 'numcheck') {
      const row = document.createElement('div');
      row.className = 'abil-num-row abil-item';
      row.dataset.abilKey = abil.key;
      if (abil.tooltip) row.dataset.tooltip = abil.tooltip;
      row.innerHTML = `<input type="checkbox" id="${id}_on"><label for="${id}">${labelHtml}</label><input type="number" id="${id}" value="0" min="-50" max="50">`;
      gridDiv.appendChild(row);
    } else {
      const row = document.createElement('div');
      row.className = 'abil-num-row abil-item';
      row.dataset.abilKey = abil.key;
      if (abil.tooltip) row.dataset.tooltip = abil.tooltip;
      row.innerHTML = `<label for="${id}">${labelHtml}</label><input type="number" id="${id}" value="0" min="-50" max="50">`;
      gridDiv.appendChild(row);
    }
  }
}

function parseAbilitiesFromUnit(unit) {
  const result = {};
  const abilities = unit.abilities || [];
  // Normalize: strip spaces from ability strings for matching against camelCase match keys
  const normalized = abilities.map(a => a.replace(/ /g, ''));
  for (const abil of ABILITY_DEFS) {
    if (abil.type === 'bool') {
      result[abil.key] = normalized.some(a => a === abil.match || a.startsWith(abil.match + '='))
        || abilities.some(a => a.startsWith(abil.match + ' ') && !a.includes('='));
    } else if (abil.type === 'numcheck') {
      const found = normalized.find(a => a.startsWith(abil.match + '='));
      if (found) {
        result[abil.key] = parseInt(found.split('=')[1]) || 0;
      } else if (normalized.includes(abil.match)) {
        result[abil.key] = 0;
      } else {
        result[abil.key] = null;
      }
    } else {
      const found = normalized.find(a => a.startsWith(abil.match + '='));
      if (found) {
        result[abil.key] = parseInt(found.split('=')[1]) || 0;
      } else if (normalized.includes(abil.match)) {
        result[abil.key] = 1;
      } else {
        result[abil.key] = 0;
      }
    }
  }
  return result;
}

function applyAbilities(prefix, abilValues) {
  for (const abil of ABILITY_DEFS) {
    const el = document.getElementById(prefix + 'Abil_' + abil.key);
    if (!el) continue;
    if (abil.type === 'bool') {
      el.checked = !!abilValues[abil.key];
    } else if (abil.type === 'select') {
      el.value = abilValues[abil.key] || abil.options[0][0];
    } else if (abil.type === 'numcheck') {
      const chk = document.getElementById(prefix + 'Abil_' + abil.key + '_on');
      const val = abilValues[abil.key];
      if (chk) chk.checked = val != null;
      el.value = val != null ? val : 0;
    } else {
      el.value = abilValues[abil.key] || 0;
    }
  }
}

function clearAbilities(prefix) {
  for (const abil of ABILITY_DEFS) {
    const el = document.getElementById(prefix + 'Abil_' + abil.key);
    if (!el) continue;
    if (abil.type === 'bool') {
      el.checked = false;
    } else if (abil.type === 'select') {
      el.value = abil.options[0][0];
    } else if (abil.type === 'numcheck') {
      const chk = document.getElementById(prefix + 'Abil_' + abil.key + '_on');
      if (chk) chk.checked = false;
      el.value = 0;
    } else {
      el.value = 0;
    }
  }
}

// --- Unit Database ---

const unitDatabases = {};
const unitBaseStats = {};
let _activeVersion = null;

function loadUnitDatabase(version) {
  if (unitDatabases[version]) return unitDatabases[version];
  const data = VERSION_DATA[version];
  if (!data) { unitDatabases[version] = []; return []; }
  unitDatabases[version] = Object.values(data);
  return unitDatabases[version];
}

const unitComboboxData = {};

function populateUnitDropdown(selectId, units) {
  const prefix = selectId[0];
  const hiddenEl = document.getElementById(selectId);
  const oldVal = hiddenEl.value;

  const CAT_NORMALIZE = {
    'General': 'Generic', 'Dwarf': 'Dwarven',
    'Life Creatures': 'Life', 'Death Creatures': 'Death', 'Chaos Creatures': 'Chaos',
    'Nature Creatures': 'Nature', 'Sorcery Creatures': 'Sorcery', 'Arcane Creatures': 'Arcane',
  };
  const raceOrder = [
    'Barbarian', 'Gnoll', 'Halfling', 'High Elf', 'High Men', 'Klackon',
    'Lizardman', 'Nomad', 'Orc',
    'Beastmen', 'Dark Elf', 'Draconian', 'Dwarven', 'Troll',
  ];
  const categoryOrder = [
    'Heroes', 'Generic',
    ...raceOrder,
    'Other',
    'Life', 'Death', 'Chaos',
    'Nature', 'Sorcery', 'Arcane',
  ];

  const groups = {};
  for (const u of units) {
    if (u.abilities && u.abilities.includes('CreateOutpost')) continue;
    if (u.name === 'Floating Island') continue;
    if (u.category === 'Heroes') continue;
    const cat = CAT_NORMALIZE[u.category] || u.category;
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(u);
  }

  const flatList = [];
  for (const cat of categoryOrder) {
    if (!groups[cat]) continue;
    for (const u of groups[cat].slice().sort((a, b) => {
      const k = a.sort_order !== undefined ? 'sort_order' : 'cost';
      return (a[k] || 0) - (b[k] || 0);
    })) {
      flatList.push({ id: String(u.id), name: u.name, cat });
    }
  }
  unitComboboxData[prefix] = flatList;

  hiddenEl.value = flatList.some(u => u.id === oldVal) ? oldVal : 'custom';
  syncUnitDisplay(prefix);
}

function syncUnitDisplay(prefix) {
  const hiddenEl = document.getElementById(prefix + 'Unit');
  const searchEl = document.getElementById(prefix + 'UnitSearch');
  if (!searchEl) return;
  if (hiddenEl.value === 'custom') {
    searchEl.value = '';
  } else {
    const u = (unitComboboxData[prefix] || []).find(u => u.id === hiddenEl.value);
    searchEl.value = u ? u.name : '';
  }
}

function initUnitCombobox(prefix) {
  const searchEl = document.getElementById(prefix + 'UnitSearch');
  const listEl = document.getElementById(prefix + 'UnitList');
  const hiddenEl = document.getElementById(prefix + 'Unit');
  let activeIndex = -1;

  function renderDropdown(query) {
    const allUnits = unitComboboxData[prefix] || [];
    const q = query.trim().toLowerCase();
    const matches = q === '' ? allUnits : allUnits.filter(u => u.name.toLowerCase().includes(q) || u.cat.toLowerCase().includes(q));

    listEl.innerHTML = '';
    activeIndex = -1;

    if (matches.length === 0) { listEl.style.display = 'none'; return; }

    let lastCat = null;
    for (const u of matches) {
      if (u.cat !== lastCat) {
        const header = document.createElement('div');
        header.className = 'unit-dropdown-cat';
        header.textContent = u.cat;
        listEl.appendChild(header);
        lastCat = u.cat;
      }
      const item = document.createElement('div');
      item.className = 'unit-dropdown-item';
      item.textContent = u.name;
      item.dataset.id = u.id;
      item.addEventListener('mousedown', e => { e.preventDefault(); commitUnit(u.id); });
      listEl.appendChild(item);
    }
    listEl.style.display = 'block';
  }

  function commitUnit(id) {
    hiddenEl.value = id;
    listEl.style.display = 'none';
    activeIndex = -1;
    syncUnitDisplay(prefix);
    hiddenEl.dispatchEvent(new Event('change'));
  }

  function updateActiveItem() {
    const items = [...listEl.querySelectorAll('.unit-dropdown-item')];
    items.forEach((item, i) => item.classList.toggle('unit-dropdown-active', i === activeIndex));
    if (activeIndex >= 0 && items[activeIndex]) items[activeIndex].scrollIntoView({ block: 'nearest' });
  }

  searchEl.addEventListener('focus', () => renderDropdown(searchEl.value));
  searchEl.addEventListener('input', () => renderDropdown(searchEl.value));
  searchEl.addEventListener('blur', () => {
    setTimeout(() => {
      listEl.style.display = 'none';
      activeIndex = -1;
      syncUnitDisplay(prefix);
    }, 150);
  });
  searchEl.addEventListener('keydown', e => {
    const items = [...listEl.querySelectorAll('.unit-dropdown-item')];
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
      updateActiveItem();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, -1);
      updateActiveItem();
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && items[activeIndex]) {
        commitUnit(items[activeIndex].dataset.id);
        searchEl.blur();
      }
    } else if (e.key === 'Escape') {
      listEl.style.display = 'none';
      syncUnitDisplay(prefix);
      searchEl.blur();
    }
  });
}

// --- Stat Reading ---

// Read ability checkboxes/inputs from DOM for a given prefix.
// Returns a plain object keyed by ability key.
function readAbilitiesFromDOM(prefix) {
  const result = {};
  for (const abil of ABILITY_DEFS) {
    const el = document.getElementById(prefix + 'Abil_' + abil.key);
    if (!el) continue;
    if (abil.type === 'bool') {
      result[abil.key] = el.checked;
    } else if (abil.type === 'select') {
      result[abil.key] = el.value;
    } else if (abil.type === 'numcheck') {
      const chk = document.getElementById(prefix + 'Abil_' + abil.key + '_on');
      result[abil.key] = chk && chk.checked ? (parseInt(el.value) || 0) : null;
    } else {
      result[abil.key] = parseInt(el.value) || 0;
    }
  }
  return result;
}

// Read DOM inputs and compute all effective stats for a unit.
// Returns a stat object suitable for both display and resolveCombat.
function readUnitStats(prefix) {
  function anyNonZero(values) {
    return values.some(v => Math.abs(v || 0) > 1e-9);
  }

  const version = document.getElementById('gameVersion').value;
  // Read abilities from DOM early because Chaos Channels eligibility can depend on gaze attacks.
  const abilities = readAbilitiesFromDOM(prefix);
  const destinyActive = destinyActiveForUnit(abilities, version);
  const level = document.getElementById(prefix + 'Level').value;
  const effectiveLevel = destinyActive ? 'normal' : level;
  const lvl = getLevelBonuses(effectiveLevel, version);
  const weapon = document.getElementById(prefix + 'Weapon').value;
  const wpn = weaponBonus(weapon);
  const armor = document.getElementById(prefix + 'Armor').value;

  const rtbTypeRaw = document.getElementById(prefix + 'RtbType').value;
  let rangedType = RANGED_TYPES.includes(rtbTypeRaw) ? rtbTypeRaw : 'none';
  let thrownType = THROWN_TYPES.includes(rtbTypeRaw) ? rtbTypeRaw : 'none';

  const unitTypeRaw = document.getElementById(prefix + 'Abil_unitType').value;
  const unitTypeVal = determineEffectiveUnitType(unitTypeRaw, abilities, version);
  const baseDoomGazeWithBlazingEyes = blazingEyesDoomGazeForUnit(abilities, unitTypeVal, version);

  // Chaos Channels (Fire Breath option): version-sensitive strength.
  // MoM: strength 2.
  // CoM/CoM2: strength 4.
  // Fire Breath is not rolled for units that already have a ranged or breath attack.
  // If the unit has Thrown, Fire Breath replaces it.
  // CoM2 exception: Fire Breath can also replace Gaze and Lightning Breath.
  const ccValEarly = document.getElementById(prefix + 'Abil_chaosChannels');
  const ccVal = ccValEarly ? ccValEarly.value : 'none';
  const hasGazeAttack = (abilities.gazeRanged || 0) > 0
    || abilities.stoningGaze != null
    || abilities.deathGaze != null
    || baseDoomGazeWithBlazingEyes > 0;
  const ccCanOverwriteSpecial = version.startsWith('com2')
    && (thrownType === 'lightning' || hasGazeAttack);
  const ccFireBreathStrength = version.startsWith('com') ? 4 : 2;
  const ccFireBreathActive = ccVal === 'fireBreath' && rangedType === 'none'
    && (thrownType === 'none' || thrownType === 'thrown' || ccCanOverwriteSpecial);
  if (ccFireBreathActive) {
    thrownType = 'fire';
  }

  // Base values from inputs
  const baseFigs = Math.max(1, parseInt(document.getElementById(prefix + 'Figs').value) || 1);
  const inputBaseAtk = Math.max(0, parseInt(document.getElementById(prefix + 'Atk').value) || 0);
  const inputBaseRtb = Math.max(0, parseInt(document.getElementById(prefix + 'Rtb').value) || 0);
  const inputBaseDef = Math.max(0, parseInt(document.getElementById(prefix + 'Def').value) || 0);
  const inputBaseRes = Math.max(0, parseInt(document.getElementById(prefix + 'Res').value) || 0);
  const inputBaseHP  = Math.max(1, parseInt(document.getElementById(prefix + 'HP').value) || 1);
  const calcBaseAtk = destinyActive ? inputBaseAtk * 2 : inputBaseAtk;
  let calcBaseRtb = destinyActive ? inputBaseRtb * 2 : inputBaseRtb;
  if (ccFireBreathActive) calcBaseRtb = ccFireBreathStrength;
  const calcBaseDef = destinyActive ? inputBaseDef + 4 : inputBaseDef;
  const calcBaseRes = destinyActive ? inputBaseRes + 4 : inputBaseRes;
  const calcBaseHP  = destinyActive ? inputBaseHP * 2 : inputBaseHP;
  const baseToHitMod = parseInt(document.getElementById(prefix + 'ToHitMod').value) || 0;
  const baseToHitRtbMod = parseInt(document.getElementById(prefix + 'ToHitRtbMod').value) || 0;
  const baseToBlkMod = parseInt(document.getElementById(prefix + 'ToBlkMod').value) || 0;

  // Focus Magic: CoM/CoM2-only. In CoM2, magical ranged, doom gaze, and breath get +3.
  // In CoM, doom gaze is not mentioned, so only magical ranged and breath are boosted.
  // Otherwise, thrown/missile (CoM2) or thrown/non-magical ranged (CoM) is converted
  // into Sorcery magical ranged, with a minimum strength of 3. If nothing qualifies,
  // the unit gains strength-3 Sorcery magical ranged.
  const isCoM2 = version.startsWith('com2');
  const focusMagicActive = !!(abilities && abilities.focusMagic) && version.startsWith('com');
  const hasMagicRangedForFocus = calcBaseRtb > 0
    && (rangedType === 'magic_c' || rangedType === 'magic_n' || rangedType === 'magic_s');
  const hasBreathForFocus = calcBaseRtb > 0 && (thrownType === 'fire' || thrownType === 'lightning');
  const hasDoomGazeForFocus = isCoM2 && baseDoomGazeWithBlazingEyes > 0;
  const focusMagicBuffsExisting = focusMagicActive
    && (hasMagicRangedForFocus || hasBreathForFocus || hasDoomGazeForFocus);
  if (focusMagicActive && !focusMagicBuffsExisting) {
    const canConvertThrown = calcBaseRtb > 0 && thrownType === 'thrown';
    const canConvertRanged = calcBaseRtb > 0
      && (isCoM2
        ? rangedType === 'missile'
        : (rangedType === 'missile' || rangedType === 'boulder'));
    const convertedStrength = (canConvertThrown || canConvertRanged) ? Math.max(calcBaseRtb, 3) : 3;
    rangedType = 'magic_s';
    thrownType = 'none';
    calcBaseRtb = convertedStrength;
  }

  const rangedGetsWpn = (rangedType === 'missile' || rangedType === 'boulder');
  const thrownGetsWpn = (thrownType === 'thrown');

  // City walls bonus (defender only)
  const cwVal = document.getElementById('cityWalls').value;
  const cityWallBonus = (prefix === 'b' && cwVal !== 'none') ? parseInt(cwVal) : 0;

  // Node Aura bonus: +2 atk, +2 rtb, +2 def, +2 res for matching Fantastic units.
  // Effective combat type is resolved through the shared precedence helper.
  const supremeLightEligible = supremeLightActiveForUnit(abilities, unitTypeVal, version);
  const survivalInstinctEligible = survivalInstinctActiveForUnit(abilities, unitTypeVal, version);
  const innerPowerEligible = innerPowerActiveForUnit(abilities, version);
  const misleadEligible = misleadActiveForUnit(abilities, unitTypeVal, version);
  const effectiveAbilities = {
    ...abilities,
    doomGaze: baseDoomGazeWithBlazingEyes,
    innerPower: innerPowerEligible ? abilities.innerPower : false,
    mislead: misleadEligible ? abilities.mislead : false,
    supernatural: ((abilities && abilities.supernatural) || destinyActive),
    supremeLight: supremeLightEligible ? abilities.supremeLight : false,
    survivalInstinct: survivalInstinctEligible ? abilities.survivalInstinct : false,
  };
  const abilMods = getAbilityStatModifiers(effectiveAbilities, version);
  const nodeAuraVal = document.getElementById('nodeAura').value;
  const unitRealm = unitTypeVal.startsWith('fantastic_') ? unitTypeVal.slice('fantastic_'.length) : null;
  const nodeAuraActive = unitRealm !== null && nodeAuraVal !== 'none' && unitRealm === nodeAuraVal;
  const nodeBonus = nodeAuraActive ? 2 : 0;

  // Darkness / True Light: +1/-1 to atk (non-spell), def, res for Death/Life fantastic units
  // Darkness: +1 Death, -1 Life. True Light: +1 Life, -1 Death. Both can be active (cancel out).
  // True Light was removed in CoM 1 & 2; Darkness still exists in all versions.
  const lightDarkVal = document.getElementById('enchLightDark').value;
  const isCoMVersion = version.startsWith('com');
  const hasDarkness = lightDarkVal === 'darkness';
  const hasTrueLight = lightDarkVal === 'trueLight' && !isCoMVersion;
  let darkLightBonus = 0;
  if (unitRealm === 'death') {
    if (hasDarkness) darkLightBonus += 1;
    if (hasTrueLight) darkLightBonus -= 1;
  } else if (unitRealm === 'life') {
    if (hasTrueLight) darkLightBonus += 1;
    if (hasDarkness) darkLightBonus -= 1;
  }

  // Effective values (level + weapon + ability + node aura + darkness/light modifiers)
  // Lionheart: version-dependent HP bonus (+3 in MoM; floor(8/figs) in CoM/CoM2).
  // RTB bonus (+3) applies only to non-magical ranged (missile/boulder) and thrown.
  const lionheartActive = !!(abilities && abilities.lionheart);
  const lionheartHpMod = lionheartActive
    ? (version.startsWith('mom') ? 3 : Math.floor(8 / baseFigs))
    : 0;
  const lionheartRtbMod = lionheartActive
    && (rangedType === 'missile' || rangedType === 'boulder' || thrownType === 'thrown') ? 3 : 0;
  // Endurance: CoM gives +2 defense; CoM2 instead gives +4 total HP split evenly
  // between figures, with a minimum of +1 HP per figure.
  const enduranceActive = !!(abilities && abilities.endurance);
  const enduranceDefMod = enduranceActive && version.startsWith('com_') ? 2 : 0;
  const enduranceHpMod = enduranceActive && version.startsWith('com2')
    ? Math.max(1, Math.floor(4 / baseFigs))
    : 0;

  // Charm of Life: +1 HP per figure if base HP ≤ 7, else +25% (floor) of base HP.
  const charmOfLifeHpMod = (abilities && abilities.charmOfLife)
    ? (calcBaseHP >= 8 ? Math.floor(calcBaseHP * 0.25) : 1)
    : 0;
  const supremeLightDefMod = supremeLightEligible
    ? Math.floor(Math.max(0, calcBaseRes + lvl.res + abilMods.resMod + nodeBonus + darkLightBonus) / 3)
    : 0;
  const levelRank = ({
    normal: 0,
    regular: 1,
    veteran: 2,
    elite: 3,
    ultra_elite: 4,
    champion: 5,
  })[effectiveLevel] || 0;
  const disciplineVal = version.startsWith('com2') ? ((abilities && abilities.discipline) || 'none') : 'none';
  const disciplineActive = disciplineVal === 'overland' || disciplineVal === 'combat';
  const combatDisciplineNegatesFirstStrike = disciplineVal === 'combat' && levelRank >= 3;
  const disciplineDefMod = disciplineActive ? (levelRank >= 1 ? 2 : 1) : 0;
  const disciplineAtkMod = disciplineActive && levelRank >= 2 ? 1 : 0;
  // Overland Discipline grants +1 movement at Elite+, but movement is not modeled here.
  const disciplineRtbMod = disciplineActive && levelRank >= 2
    && (rangedType === 'missile' || rangedType === 'boulder') ? 1 : 0;

  // Orihalcon: +1 resistance, +2 magical ranged attack (CoM2 only).
  const orihalconActive = armor === 'orihalcon';
  const orihalconResMod = orihalconActive ? 1 : 0;
  const orihalconRtbMod = orihalconActive
    && (rangedType === 'magic_c' || rangedType === 'magic_n' || rangedType === 'magic_s') ? 2 : 0;

  const atk = calcBaseAtk > 0 ? Math.max(0, calcBaseAtk + lvl.atk + wpn.atk + abilMods.atkMod + disciplineAtkMod + nodeBonus + darkLightBonus) : 0;
  const defBase = Math.max(0, calcBaseDef + lvl.def + wpn.def + cityWallBonus + abilMods.defMod + enduranceDefMod + disciplineDefMod + supremeLightDefMod + nodeBonus + darkLightBonus);
  // Holy Armor: MoM: +2 defense. CoM/CoM2: +2 defense if def ≤ 5; +10% To Block if def > 5.
  const holyArmorActive = !!(abilities && abilities.holyArmor);
  const holyArmorHighDef = holyArmorActive && isCoMVersion && defBase > 5;
  const holyArmorDefBonus = holyArmorActive && !holyArmorHighDef ? 2 : 0;
  const holyArmorToBlkBonus = holyArmorHighDef ? 10 : 0;
  const def = defBase + holyArmorDefBonus;
  const res = Math.max(0, calcBaseRes + lvl.res + abilMods.resMod + orihalconResMod + nodeBonus + darkLightBonus);
  const hp  = Math.max(1, calcBaseHP + lvl.hp + abilMods.hpMod + lionheartHpMod + enduranceHpMod + charmOfLifeHpMod);

  // Metal Fires / Flame Blade: +1/+2 to missile and thrown rtb only (not boulder, magic).
  // Also upgrades normal weapon to magic for Weapon Immunity purposes.
  const fbAtkBonus = abilities.flameBlade ? 2 : (abilities.metalFires ? 1 : 0);
  const fbRtbMod = fbAtkBonus > 0 && (rangedType === 'missile' || thrownType === 'thrown') ? fbAtkBonus : 0;

  // Blazing March: +3 to missile only (not boulder, magic ranged, thrown, or breath).
  const blazingMarchActive = !!(abilities && abilities.blazingMarch);
  const blazingMarchRtbMod = blazingMarchActive && rangedType === 'missile' ? 3 : 0;

  const focusMagicRtbMod = focusMagicBuffsExisting
    && (rangedType === 'magic_c' || rangedType === 'magic_n' || rangedType === 'magic_s'
      || thrownType === 'fire' || thrownType === 'lightning') ? 3 : 0;

  // Reinforce Magic: +2 to magical ranged attack strength only.
  const reinforceMagicRtbMod = (abilities && abilities.reinforceMagic)
    && (rangedType === 'magic_c' || rangedType === 'magic_n' || rangedType === 'magic_s') ? 2 : 0;

  // Mislead/Misfortune: -1 ranged attack only (not thrown or breath) per source helptext.
  // Eligibility (normal/hero) is handled via effectiveAbilities.mislead.
  const misleadRtbMod = (effectiveAbilities && effectiveAbilities.mislead)
    && (rangedType === 'missile' || rangedType === 'boulder'
      || rangedType === 'magic_c' || rangedType === 'magic_n' || rangedType === 'magic_s') ? -1 : 0;

  // Supreme Light: +2 to ranged attack strength (missile/boulder/magic ranged).
  // Source manuals say "+2 melee and ranged attack" — thrown and breath are not affected.
  const supremeLightRtbMod = supremeLightEligible
    && (rangedType === 'missile' || rangedType === 'boulder'
      || rangedType === 'magic_c' || rangedType === 'magic_n' || rangedType === 'magic_s') ? 2 : 0;

  // Giant Strength: +1 thrown only (not missile/boulder/magic ranged, not breath).
  const gsRtbMod = (abilities.giantStrength && thrownType === 'thrown') ? 1 : 0;

  // Weakness: -2 (MoM) or -3 (CoM/CoM2) to missile ranged and thrown.
  // In MoM 1.31, thrown is bugged and NOT reduced (fixed in 1.60+).
  const weaknessActive = !!(abilities && abilities.weakness);
  const weaknessPenalty = weaknessActive ? (version.startsWith('com') ? 3 : 2) : 0;
  const weaknessRtbMod = weaknessActive
    ? (rangedType === 'missile' ? -weaknessPenalty
      : (thrownType !== 'none' && version !== 'mom_1.31' ? -weaknessPenalty : 0))
    : 0;

  // Holy Weapon: +10% To Hit on melee, missile, and boulder attacks. Also applies to thrown
  // in all versions except MoM 1.31 (bug). Does NOT affect magic ranged, fire/lightning
  // breath, or gaze attacks. Also upgrades normal weapon to magic (bypasses Weapon Immunity).
  const hwActive = !!(abilities && abilities.holyWeapon);
  const hwMeleeToHit = hwActive ? 10 : 0;
  let hwRtbToHit = 0;
  if (hwActive) {
    if (rangedType === 'missile' || rangedType === 'boulder') hwRtbToHit = 10;
    else if (thrownType === 'thrown' && version !== 'mom_1.31') hwRtbToHit = 10;
  }
  const weaponUpgradedByHW = hwActive && weapon === 'normal';
  const wraithFormBypassesWI = weapon === 'normal'
    && version.startsWith('com')
    && !!(abilities && (abilities.wraithForm || abilities.rulerOfUnderworld));
  const eldritchActive = !!(abilities && abilities.eldritchWeapon);
  const effectiveWeapon = (fbAtkBonus > 0 && weapon === 'normal') ? 'magic'
    : (weaponUpgradedByHW ? 'magic'
    : (wraithFormBypassesWI ? 'magic'
    : ((eldritchActive && weapon === 'normal') ? 'magic' : weapon)));

  // Ranged/Thrown/Breath strength
  let rtbLvl = 0, rtbWpn = 0;
  if (rangedType !== 'none') {
    rtbLvl = calcBaseRtb > 0 ? lvl.ranged : 0;
    rtbWpn = (calcBaseRtb > 0 && rangedGetsWpn) ? wpn.atk : 0;
  } else if (thrownType !== 'none') {
    rtbLvl = lvl.thrown;
    rtbWpn = (calcBaseRtb > 0 && thrownGetsWpn) ? wpn.atk : 0;
  }
  const rtb = calcBaseRtb > 0 ? Math.max(0, calcBaseRtb + rtbLvl + rtbWpn + abilMods.rtbMod + disciplineRtbMod + fbRtbMod + blazingMarchRtbMod + focusMagicRtbMod + reinforceMagicRtbMod + misleadRtbMod + supremeLightRtbMod + orihalconRtbMod + gsRtbMod + lionheartRtbMod + weaknessRtbMod + nodeBonus + darkLightBonus) : 0;

  // Hidden gaze ranged attack: affected by same modifiers as ranged (level, node aura,
  // darkness/light, ability mods) but NOT weapon bonuses. In v1.31, if reduced to 0 the
  // gaze attack does not fire.
  const gazeOverwrittenByCC = ccFireBreathActive && ccCanOverwriteSpecial && hasGazeAttack;
  const baseGazeRanged = gazeOverwrittenByCC ? 0 : ((abilities && abilities.gazeRanged) || 0);
  const effectiveGazeRanged = baseGazeRanged > 0
    ? Math.max(0, baseGazeRanged + lvl.ranged + abilMods.rtbMod + nodeBonus + darkLightBonus)
    : 0;

  // Doom Gaze: delivers exact doom damage. Affected by node aura, darkness/light,
  // and ability modifiers (e.g. Black Prayer), but NOT level or weapon bonuses.
  const baseDoomGaze = gazeOverwrittenByCC ? 0 : (effectiveAbilities.doomGaze || 0);
  const effectiveDoomGaze = baseDoomGaze > 0
    ? Math.max(0, baseDoomGaze + abilMods.rtbMod + (focusMagicBuffsExisting && isCoM2 ? 3 : 0) + nodeBonus + darkLightBonus)
    : 0;

  const combatAbilitiesBase = combatDisciplineNegatesFirstStrike
    ? { ...effectiveAbilities, negateFirstStrike: true }
    : effectiveAbilities;
  const combatAbilities = gazeOverwrittenByCC
    ? { ...combatAbilitiesBase, gazeRanged: 0, stoningGaze: null, deathGaze: null, doomGaze: 0 }
    : combatAbilitiesBase;

  // To Hit percentage bonuses
  const meleeToHitBonus = lvl.toHit + wpn.toHit + abilMods.toHitMod + hwMeleeToHit;
  const rtbToHitWpn = rangedGetsWpn ? wpn.toHit : 0;

  // Distance penalty (attacker ranged only)
  let rtbDistPenalty = 0;
  if (prefix === 'a' && (rangedType === 'missile' || rangedType === 'boulder')) {
    const rangedCheck = document.getElementById('rangedCheck');
    if (rangedCheck && rangedCheck.checked) {
      const dist = Math.max(1, parseInt(document.getElementById('rangedDist').value) || 1);
      rtbDistPenalty = distancePenalty(dist, rangedType, !!(abilities && abilities.longRange), version);
    }
  }

  // Pre-clamped To Hit/Block values for combat (decimals 0.1-1.0)
  let toHitMelee = clampPct(30, baseToHitMod + meleeToHitBonus);
  let toHitRtb = clampPct(30, baseToHitRtbMod + lvl.toHit + rtbToHitWpn + rtbDistPenalty + abilMods.toHitMod + hwRtbToHit);
  let toBlock = clampPct(30, baseToBlkMod + abilMods.toBlkMod + holyArmorToBlkBonus);
  // Immolation To Hit: always base 30%, ignoring all modifiers (it's a spell attack)
  let toHitImmolation = 0.3;

  // Warp Reality: -20% To Hit for non-Chaos units. Chaos Channels exempts a unit.
  // Read from global checkbox here so the penalty is reflected in the red display numbers.
  const warpRealityActive = document.getElementById('warpReality') && document.getElementById('warpReality').checked;
  const unitIsChaos = unitTypeVal === 'fantastic_chaos';  // Chaos Channels already folds into unitTypeVal
  if (warpRealityActive && !unitIsChaos) {
    toHitMelee      = Math.max(0.1, toHitMelee - 0.2);
    toHitRtb        = Math.max(0.1, toHitRtb - 0.2);
    toHitImmolation = Math.max(0.1, toHitImmolation - 0.2);
  }

  let displayToHitMelee = toHitMelee;
  let displayToHitRtb = toHitRtb;
  let displayToBlock = toBlock;

  // Vertigo: reflect the displayed penalty in the red To Hit / To Block numbers.
  // MoM: -20% To Hit, -1 Defense. CoM/CoM2: -30% To Hit, -1 To Block.
  const vertigoActive = !!(abilities && abilities.vertigo)
    && !(abilities && (abilities.illusionImmunity || abilities.magicImmunity));
  if (vertigoActive) {
    if (version.startsWith('com')) {
      displayToHitMelee = Math.max(0.1, displayToHitMelee - 0.3);
      displayToHitRtb = Math.max(0.1, displayToHitRtb - 0.3);
      displayToBlock = Math.max(0.0, displayToBlock - 0.1);
    } else {
      displayToHitMelee = Math.max(0.1, displayToHitMelee - 0.2);
      displayToHitRtb = Math.max(0.1, displayToHitRtb - 0.2);
    }
  }

  // Berserk: doubles melee attack (applied last, after all other bonuses), sets defense
  // to 0 absolutely (no other bonus can raise it while Berserk is active).
  const berserkActive = !!(abilities && abilities.berserk);
  let finalAtk = berserkActive ? atk * 2 : atk;
  let finalDef = berserkActive ? 0 : def;
  let finalRtb = rtb;
  let finalRes = res;

  // Warp Creature effects (applied after all other bonuses per MoM wiki).
  // Warp Attack: halves melee (all versions) and all ranged/thrown (CoM/CoM2 only).
  // Warp Defense: halves defense (MoM) or reduces to one-third (CoM/CoM2).
  // Warp Resist: sets resistance to 0; Resist Magic +5 still applies in combat.js.
  const isCoMVer = version.startsWith('com');
  if (abilities && abilities.warpAttack) {
    finalAtk = Math.floor(finalAtk / 2);
    if (isCoMVer) finalRtb = Math.floor(finalRtb / 2);
  }
  if (abilities && abilities.warpDefense) {
    finalDef = Math.floor(finalDef / (isCoMVer ? 3 : 2));
  }
  if (abilities && abilities.warpResist) {
    finalRes = 0;
  }
  const displayDef = (vertigoActive && !isCoMVer) ? Math.max(0, finalDef - 1) : finalDef;

  const toHitMeleeHasModifiers = anyNonZero([
    baseToHitMod,
    lvl.toHit,
    wpn.toHit,
    abilMods.toHitMod,
    hwMeleeToHit,
    (warpRealityActive && !unitIsChaos) ? -20 : 0,
    vertigoActive ? (version.startsWith('com') ? -30 : -20) : 0,
  ]);
  const toHitRtbHasModifiers = anyNonZero([
    baseToHitRtbMod,
    lvl.toHit,
    rtbToHitWpn,
    rtbDistPenalty,
    abilMods.toHitMod,
    hwRtbToHit,
    (warpRealityActive && !unitIsChaos) ? -20 : 0,
    vertigoActive ? (version.startsWith('com') ? -30 : -20) : 0,
  ]);
  const toBlockHasModifiers = anyNonZero([
    baseToBlkMod,
    abilMods.toBlkMod,
    holyArmorToBlkBonus,
    (vertigoActive && version.startsWith('com')) ? -10 : 0,
  ]);

  return {
    // Base values (for display)
    baseAtk: inputBaseAtk, baseRtb: inputBaseRtb, baseDef: inputBaseDef, baseRes: inputBaseRes, baseHP: inputBaseHP,
    baseToHitMod, baseToHitRtbMod, baseToBlkMod,
    // Bonus breakdown (for display)
    atkBonus: finalAtk - inputBaseAtk,
    rtbBonus: finalRtb - inputBaseRtb,
    defBonus: displayDef - inputBaseDef,
    resBonus: finalRes - inputBaseRes,
    hpBonus: hp - inputBaseHP,
    meleeToHitBonus,
    rtbToHitWpnBonus: rtbToHitWpn,
    rtbToHitLvlBonus: lvl.toHit,
    rtbDistPenalty,
    toHitMeleeHasModifiers,
    toHitRtbHasModifiers,
    toBlockHasModifiers,
    // Effective values (for calculation)
    figs: baseFigs,
    atk: finalAtk, def: finalDef, res: finalRes, hp, rtb: finalRtb, effectiveGazeRanged, effectiveDoomGaze, weapon: effectiveWeapon, unitType: unitTypeVal, generic: !!(unitBaseStats[prefix] && unitBaseStats[prefix].generic),
    dmg: Math.max(0, parseInt(document.getElementById(prefix + 'Dmg').value) || 0),
    rangedType, thrownType,
    rangedGetsWpn, thrownGetsWpn,
    cityWallBonus,
    wpn, lvl,
    // Display values (can include modifiers that resolveCombat also applies internally)
    displayDef,
    displayToHitMelee,
    displayToHitRtb,
    displayToBlock,
    // Pre-clamped combat values
    toHitMelee, toHitRtb, toHitImmolation, toBlock,
    // Abilities (for combat flow modifiers)
    abilities: combatAbilities,
  };
}

// --- Modified Display ---

// Show modified (final) stat values next to base stat fields.
// Takes a pre-computed stat object to avoid redundant readUnitStats calls.
function updateModifiedDisplay(prefix, stats) {
  const s = stats || readUnitStats(prefix);

  function showMod(id, effective, base) {
    const el = document.getElementById(id);
    if (!el) return;
    if (effective !== base) {
      el.textContent = String(effective);
      el.classList.add('visible');
    } else {
      el.textContent = '';
      el.classList.remove('visible');
    }
  }

  // Show the total percentage whenever it differs from the default 30%.
  function showModPct(id, effective, forceShow) {
    const el = document.getElementById(id);
    if (!el) return;
    const pct = Math.round(effective * 100);
    if (pct !== 30 || forceShow) {
      el.textContent = pct + '%';
      el.classList.add('visible');
    } else {
      el.textContent = '';
      el.classList.remove('visible');
    }
  }

  showMod(prefix + 'AtkMod', s.atk, s.baseAtk);
  showMod(prefix + 'RtbMod', s.rtb, s.baseRtb);
  showMod(prefix + 'DefMod', s.displayDef ?? s.def, s.baseDef);
  showMod(prefix + 'ResMod', s.res, s.baseRes);
  showMod(prefix + 'HPMod', s.hp, s.baseHP);

  showModPct(prefix + 'ToHitMeleeMod', s.displayToHitMelee ?? s.toHitMelee, s.toHitMeleeHasModifiers);
  showModPct(prefix + 'ToHitRtbModDisp', s.displayToHitRtb ?? s.toHitRtb, s.toHitRtbHasModifiers);
  showModPct(prefix + 'ToBlkModDisp', s.displayToBlock ?? s.toBlock, s.toBlockHasModifiers);
}

// --- Level Bonuses ---

function applyLevelBonuses(prefix) {
  const base = unitBaseStats[prefix];
  if (!base) return;
  const version = document.getElementById('gameVersion').value;
  const b = getLevelBonuses(document.getElementById(prefix + 'Level').value, version);
  document.getElementById(prefix + 'Atk').value = base.atk;
  document.getElementById(prefix + 'Rtb').value = base.rtb;
  document.getElementById(prefix + 'Def').value = base.def;
  document.getElementById(prefix + 'Res').value = base.res;
  document.getElementById(prefix + 'HP').value = base.hp;
  document.getElementById(prefix + 'ToHitMod').value = base.toHitMod;
}

// --- Unit Application ---

function applyUnit(prefix, unitIndex) {
  const version = document.getElementById('gameVersion').value;
  const units = unitDatabases[version] || [];
  const unit = units.find(u => u.id === unitIndex);
  if (!unit) return;

  const unitRtb = (unit.ranged && parseInt(unit.ranged) > 0) ? parseInt(unit.ranged)
                : (unit.breath && parseInt(unit.breath) > 0) ? parseInt(unit.breath)
                : (unit.thrown_breath && parseInt(unit.thrown_breath) > 0) ? parseInt(unit.thrown_breath) : 0;
  unitBaseStats[prefix] = {
    atk: unit.melee, def: unit.defense, res: unit.resist, hp: unit.hp,
    rtb: unitRtb,
    toHitMod: unit.to_hit || 0,
    generic: unit.category === 'Generic',
  };

  document.getElementById(prefix + 'Figs').value = unit.figures || 1;
  document.getElementById(prefix + 'ToHitRtbMod').value = 0;
  document.getElementById(prefix + 'ToBlkMod').value = 0;
  document.getElementById(prefix + 'Dmg').value = 0;

  const rawRtb = (unit.ranged_type && unit.ranged_type !== 'none') ? unit.ranged_type
               : (unit.thrown_breath_type && unit.thrown_breath_type !== 'none') ? unit.thrown_breath_type
               : 'none';
  const rtbType = RANGED_TYPE_NORMALIZE[rawRtb] || rawRtb;
  document.getElementById(prefix + 'RtbType').value = rtbType;

  const unitTypeSel = document.getElementById(prefix + 'Abil_unitType');
  if (unitTypeSel) {
    const cat = unit.category || '';
    const hasFantasticAbility = (unit.abilities || []).some(a => a === 'Fantastic' || a === 'Fantastic=1');
    const isFantastic = cat.endsWith(' Creatures') || hasFantasticAbility;
    if (cat === 'Heroes') {
      unitTypeSel.value = 'hero';
    } else if (isFantastic) {
      const realmMap = { 'Nature': 'nature', 'Sorcery': 'sorcery', 'Chaos': 'chaos',
                         'Life': 'life', 'Death': 'death', 'Arcane': 'arcane',
                         'Nature Creatures': 'nature', 'Sorcery Creatures': 'sorcery', 'Chaos Creatures': 'chaos',
                         'Life Creatures': 'life', 'Death Creatures': 'death', 'Arcane Creatures': 'arcane' };
      const realm = realmMap[cat] || 'arcane';
      unitTypeSel.value = 'fantastic_' + realm;
    } else {
      unitTypeSel.value = 'normal';
    }
  }

  // Clear any previous unit-innate locks before re-applying
  const abilCont = document.getElementById(prefix + 'Abilities');
  abilCont.querySelectorAll('.abil-unit-locked').forEach(item => {
    item.classList.remove('abil-unit-locked');
    item.querySelectorAll('input, select').forEach(inp => { inp.disabled = false; });
  });

  const abilValues = parseAbilitiesFromUnit(unit);
  applyAbilities(prefix, abilValues);
  applyLevelBonuses(prefix);

  // Lock Abilities/Enchantments items that are innate to this unit
  for (const abil of ABILITY_DEFS) {
    if (abil.group !== 'Abilities/Enchantments') continue;
    const val = abilValues[abil.key];
    const isActive = abil.type === 'bool' ? !!val
      : abil.type === 'numcheck' ? val != null
      : (val || 0) !== 0;
    if (!isActive) continue;
    const el = document.getElementById(prefix + 'Abil_' + abil.key);
    if (!el) continue;
    const item = el.closest('.abil-item');
    if (!item) continue;
    item.classList.add('abil-unit-locked');
    item.querySelectorAll('input, select').forEach(inp => { inp.disabled = true; });
  }

  refreshAbilityFieldVisibility();
}

function updateUnitLock(prefix) {
  const sel = document.getElementById(prefix + 'Unit');
  const fields = sel.closest('.panel').querySelector('.panel-fields');
  const abilContent = document.getElementById(prefix + 'Abilities');
  const isCustom = sel.value === 'custom';
  fields.classList.toggle('locked', !isCustom);
  abilContent.classList.toggle('locked', !isCustom);

  const unitTypeSel = document.getElementById(prefix + 'Abil_unitType');
  if (unitTypeSel) unitTypeSel.disabled = !isCustom;

  const levelSel = document.getElementById(prefix + 'Level');
  const weaponSel = document.getElementById(prefix + 'Weapon');
  if (!isCustom) {
    const version = document.getElementById('gameVersion').value;
    const units = unitDatabases[version] || [];
    const unit = units.find(u => u.id === parseInt(sel.value));
    const hasFantasticAbility = unit && (unit.abilities || []).some(a => a === 'Fantastic' || a === 'Fantastic=1');
    const isHeroOrFantastic = unit && (unit.category === 'Heroes' || (unit.category || '').endsWith(' Creatures') || hasFantasticAbility);
    const isZombies = unit && unit.name === 'Zombies';
    if (isHeroOrFantastic) {
      levelSel.value = 'normal';
      if (!isZombies) weaponSel.value = 'normal';
    }
    applyUnit(prefix, parseInt(sel.value));
    levelSel.disabled = isHeroOrFantastic;
    weaponSel.classList.toggle('weapon-locked', isHeroOrFantastic && !isZombies);
  } else {
    delete unitBaseStats[prefix];
    weaponSel.classList.remove('weapon-locked');
    // Clear unit-innate locks when switching to custom
    const abilContCustom = document.getElementById(prefix + 'Abilities');
    abilContCustom.querySelectorAll('.abil-unit-locked').forEach(item => {
      item.classList.remove('abil-unit-locked');
      item.querySelectorAll('input, select').forEach(inp => { inp.disabled = false; });
    });
    updateCustomLevelState(prefix);
  }
}

function updateCustomLevelState(prefix) {
  const sel = document.getElementById(prefix + 'Unit');
  if (sel.value !== 'custom') return;
  const levelSel = document.getElementById(prefix + 'Level');
  const weaponSel = document.getElementById(prefix + 'Weapon');
  const unitTypeSel = document.getElementById(prefix + 'Abil_unitType');
  const isNormal = !unitTypeSel || unitTypeSel.value === 'normal';
  levelSel.disabled = !isNormal;
  if (!isNormal) levelSel.value = 'normal';
  weaponSel.classList.toggle('weapon-locked', !isNormal);
  if (!isNormal) weaponSel.value = 'normal';
}

// --- Swap ---

function swapAttackerDefender() {
  const aUnitSel = document.getElementById('aUnit');
  const bUnitSel = document.getElementById('bUnit');
  let tmp = aUnitSel.value;
  aUnitSel.value = bUnitSel.value;
  bUnitSel.value = tmp;

  const simpleFields = ['Figs', 'Atk', 'RtbType', 'Rtb', 'ToHitMod', 'ToHitRtbMod', 'ToBlkMod', 'Def', 'Res', 'HP', 'Dmg', 'Level', 'Weapon', 'Armor'];
  for (const f of simpleFields) {
    const aEl = document.getElementById('a' + f);
    const bEl = document.getElementById('b' + f);
    if (!aEl || !bEl) continue;
    tmp = aEl.value;
    aEl.value = bEl.value;
    bEl.value = tmp;
  }

  for (const abil of ABILITY_DEFS) {
    const aEl = document.getElementById('aAbil_' + abil.key);
    const bEl = document.getElementById('bAbil_' + abil.key);
    if (!aEl || !bEl) continue;
    if (abil.type === 'bool') {
      const tmpC = aEl.checked;
      aEl.checked = bEl.checked;
      bEl.checked = tmpC;
    } else {
      tmp = aEl.value;
      aEl.value = bEl.value;
      bEl.value = tmp;
    }
  }

  const aTypeSel = document.getElementById('aAbil_unitType');
  const bTypeSel = document.getElementById('bAbil_unitType');
  if (aTypeSel && bTypeSel) {
    tmp = aTypeSel.value;
    aTypeSel.value = bTypeSel.value;
    bTypeSel.value = tmp;
  }

  tmp = unitBaseStats['a'];
  unitBaseStats['a'] = unitBaseStats['b'];
  unitBaseStats['b'] = tmp;

  syncUnitDisplay('a');
  syncUnitDisplay('b');
  updateUnitLock('a');
  updateUnitLock('b');
  updateTypeVisibility();
  updateAbilityVisibility();
  recalculate();
}

// --- Version Change ---

function findMatchingUnit(units, oldUnit) {
  if (!oldUnit) return null;
  const nonHeroes = units.filter(u => u.category !== 'Heroes');
  const oldName = oldUnit.name;
  let match = nonHeroes.find(u => u.name === oldName);
  if (match) return match;
  const aliased = UNIT_NAME_ALIASES[oldName];
  if (aliased) {
    match = nonHeroes.find(u => u.name === aliased);
    if (match) return match;
  }
  return null;
}

function onVersionChange() {
  const version = document.getElementById('gameVersion').value;
  const aUnitSel = document.getElementById('aUnit');
  const bUnitSel = document.getElementById('bUnit');
  const oldAId = aUnitSel.value;
  const oldBId = bUnitSel.value;
  const prevDb = (_activeVersion && unitDatabases[_activeVersion]) || [];
  const oldAUnit = oldAId !== 'custom' ? (prevDb.find(u => String(u.id) === oldAId) || null) : null;
  const oldBUnit = oldBId !== 'custom' ? (prevDb.find(u => String(u.id) === oldBId) || null) : null;

  const units = loadUnitDatabase(version);
  populateUnitDropdown('aUnit', units);
  populateUnitDropdown('bUnit', units);

  for (const [prefix, oldUnit, sel] of [['a', oldAUnit, aUnitSel], ['b', oldBUnit, bUnitSel]]) {
    if (!oldUnit) continue;
    const matched = findMatchingUnit(units, oldUnit);
    sel.value = matched ? String(matched.id) : 'custom';
    syncUnitDisplay(prefix);
  }

  // Save user enchantments — updateUnitLock calls applyUnit which resets all abilities
  const savedEnch = {};
  for (const prefix of ['a', 'b']) {
    savedEnch[prefix] = {};
    for (const abil of ABILITY_DEFS) {
      if (abil.group !== 'Enchantments') continue;
      const el = document.getElementById(prefix + 'Abil_' + abil.key);
      if (!el) continue;
      if (abil.type === 'bool') {
        savedEnch[prefix][abil.key] = el.checked;
      } else if (abil.type === 'select') {
        savedEnch[prefix][abil.key] = el.value;
      } else if (abil.type === 'numcheck') {
        const chk = document.getElementById(prefix + 'Abil_' + abil.key + '_on');
        savedEnch[prefix][abil.key] = chk && chk.checked ? (parseInt(el.value) || 0) : null;
      } else {
        savedEnch[prefix][abil.key] = parseInt(el.value) || 0;
      }
    }
  }

  _activeVersion = version;
  updateUnitLock('a');
  updateUnitLock('b');

  // Restore user enchantments; updateTypeVisibility will still disable/uncheck version-incompatible ones
  for (const prefix of ['a', 'b']) {
    for (const abil of ABILITY_DEFS) {
      if (abil.group !== 'Enchantments') continue;
      const el = document.getElementById(prefix + 'Abil_' + abil.key);
      if (!el) continue;
      const val = savedEnch[prefix][abil.key];
      if (val === undefined) continue;
      if (abil.type === 'bool') {
        el.checked = val;
      } else if (abil.type === 'select') {
        el.value = val;
      } else if (abil.type === 'numcheck') {
        const chk = document.getElementById(prefix + 'Abil_' + abil.key + '_on');
        if (chk) chk.checked = val != null;
        el.value = val != null ? val : 0;
      } else {
        el.value = val || 0;
      }
    }
  }

  updateTypeVisibility();
  recalculate();
}

// --- Rendering ---

function formatPct(p) {
  return (p * 100).toFixed(1) + '%';
}

function renderDistPanel(container, title, dist, hp, numFigs, opts) {
  const showSkulls = opts && opts.showSkulls;
  const colHeader = (opts && opts.colHeader) || 'Damage';
  // firstFigRem: HP remaining on the lead figure (accounts for pre-existing damage)
  const firstFigRem = (opts && opts.firstFigRem) || hp;

  let maxD = dist.length - 1;
  while (maxD > 0 && dist[maxD] < 1e-10) maxD--;

  let expected = 0;
  for (let d = 0; d < dist.length; d++) expected += d * dist[d];

  let peakProb = 0;
  for (let d = 0; d <= maxD; d++) {
    if ((dist[d] || 0) > peakProb) peakProb = dist[d];
  }

  // Precompute figure-kill thresholds
  const killThresholds = new Set();
  if (showSkulls && numFigs > 0 && hp > 0) {
    for (let i = 0; i < numFigs; i++) {
      const thresh = i === 0 ? firstFigRem : firstFigRem + i * hp;
      killThresholds.add(thresh);
    }
  }

  // Compute destruction chance (damage >= total remaining HP).
  // opts.pDestroy overrides with a pre-computed cumulative value (used by phase panels).
  let destroyPct = '';
  if (opts && opts.pDestroy != null) {
    destroyPct = ` &mdash; ${formatPct(opts.pDestroy)} destroyed`;
  } else if (numFigs > 0 && hp > 0) {
    const totalRemHP = firstFigRem + (numFigs - 1) * hp;
    let pDestroy = 0;
    for (let d = totalRemHP; d < dist.length; d++) pDestroy += dist[d] || 0;
    destroyPct = ` &mdash; ${formatPct(pDestroy)} destroyed`;
  }

  const barColor = (opts && opts.barColor) || '#ff4d6a';

  let html = `<div class="dist-header">${title}: <span class="avg">${expected.toFixed(3)}</span>${destroyPct}</div>`;
  html += '<div class="dist-scroll"><table class="dist-table">';
  html += `<thead><tr><th>${colHeader}</th><th style="text-align:right">Chance</th></tr></thead><tbody>`;

  for (let d = 0; d <= maxD; d++) {
    const p = dist[d] || 0;
    const barWidth = peakProb > 0 ? (p / peakProb) * 100 : 0;
    const isPeak = peakProb > 0 && Math.abs(p - peakProb) < 1e-15;

    let dmgLabel = '' + d;
    if (showSkulls && killThresholds.has(d)) {
      dmgLabel += ' ☠';
    }

    html += `<tr class="${isPeak ? 'peak' : ''}">`;
    html += `<td class="dmg-cell">${dmgLabel}</td>`;
    html += `<td class="chance-cell">`;
    html += `<span class="chance-bar" style="width:${barWidth}%;background:${barColor}"></span>`;
    html += `<span class="chance-text">${formatPct(p)}</span>`;
    html += `</td></tr>`;
  }

  html += '</tbody></table></div>';
  container.innerHTML = html;
}

function renderBreakdownGrid(phases) {
  const section = document.getElementById('breakdownSection');
  const grid = document.getElementById('breakdownGrid');
  if (!phases || phases.length <= 1) {
    section.style.display = 'none';
    grid.innerHTML = '';
    return;
  }
  section.style.display = '';
  let html = '';
  for (const phase of phases) {
    html += `<div class="breakdown-phase-label">${phase.label}</div>`;
    html += '<div class="dist-panel"></div>';
    html += '<div class="dist-panel"></div>';
  }
  grid.innerHTML = html;

  const panels = grid.querySelectorAll('.dist-panel');
  let idx = 0;
  const breakdownOpts = { barColor: '#f0c030' };
  for (const phase of phases) {
    if (phase.mode === 'feared') {
      const fearOpts = { barColor: '#c080ff', colHeader: 'Feared' };
      renderDistPanel(panels[idx], 'Attacker figs feared', phase.atkDist, 0, 0, fearOpts);
      renderDistPanel(panels[idx + 1], 'Defender figs feared', phase.defDist, 0, 0, fearOpts);
    } else {
      const atkOpts = phase.atkDestroyPct != null ? { ...breakdownOpts, pDestroy: phase.atkDestroyPct } : breakdownOpts;
      const defOpts = phase.defDestroyPct != null ? { ...breakdownOpts, pDestroy: phase.defDestroyPct } : breakdownOpts;
      renderDistPanel(panels[idx], 'Mean damage to attacker', phase.atkDist, phase.atkHPper, phase.atkFigs, atkOpts);
      renderDistPanel(panels[idx + 1], 'Mean damage to defender', phase.defDist, phase.defHPper, phase.defFigs, defOpts);
    }
    idx += 2;
  }
}

// --- Life Steal Summary ---

function renderLifeStealSummary(result) {
  const el = document.getElementById('lifeStealSummary');
  if (!el) return;

  function expectedValue(dist) {
    if (!dist) return 0;
    let ev = 0;
    for (let d = 0; d < dist.length; d++) ev += d * dist[d];
    return ev;
  }

  const aLS = (result.aLifeStealExpected != null)
    ? result.aLifeStealExpected
    : (result.aLifeStealDist ? expectedValue(result.aLifeStealDist) : 0);
  const bLS = (result.bLifeStealExpected != null)
    ? result.bLifeStealExpected
    : (result.bLifeStealDist ? expectedValue(result.bLifeStealDist) : 0);

  if (aLS < 0.001 && bLS < 0.001) {
    el.style.display = 'none';
    el.innerHTML = '';
    return;
  }

  let html = '';
  if (aLS >= 0.001) {
    html += `<span>Attacker life steal damage: <strong>${aLS.toFixed(3)}</strong></span>`;
  }
  if (bLS >= 0.001) {
    if (html) html += ' &nbsp;|&nbsp; ';
    html += `<span>Defender life steal damage: <strong>${bLS.toFixed(3)}</strong></span>`;
  }
  el.style.display = '';
  el.innerHTML = html;
}

// --- Main Calculate ---
// Reads stats once, updates displays, resolves combat, renders results.

function recalculate() {
  const a = readUnitStats('a');
  const b = readUnitStats('b');

  // Update modified displays using the already-computed stats (no redundant reads)
  updateModifiedDisplay('a', a);
  updateModifiedDisplay('b', b);

  const isRanged = document.getElementById('rangedCheck').checked && a.rangedType !== 'none' && a.rtb > 0;
  const version = document.getElementById('gameVersion').value;
  const wallOfFire = document.getElementById('wallOfFire').checked;

  const result = resolveCombat(a, b, { isRanged, version, wallOfFire });

  const aFirstFigRem = a.hp > 0 && a.dmg % a.hp !== 0 ? a.hp - (a.dmg % a.hp) : a.hp;
  const bFirstFigRem = b.hp > 0 && b.dmg % b.hp !== 0 ? b.hp - (b.dmg % b.hp) : b.hp;

  renderBreakdownGrid(result.phases);
  renderDistPanel(document.getElementById('distA'), 'Mean damage to attacker', result.totalDmgToA, result.aHP, result.aAlive,
    { showSkulls: true, firstFigRem: aFirstFigRem });
  renderDistPanel(document.getElementById('distB'), 'Mean damage to defender', result.totalDmgToB, result.bHP, result.bAlive,
    { showSkulls: true, firstFigRem: bFirstFigRem });
  renderLifeStealSummary(result);
}

// Backward-compatible alias
function calculate() { recalculate(); }

// --- Visibility ---

function updateTypeVisibility() {
  ['aRtbType', 'bRtbType'].forEach(id => {
    const sel = document.getElementById(id);
    const input = sel.nextElementSibling;
    if (input) input.classList.toggle('disabled-field', sel.value === 'none');
  });

  // Armor type is CoM/CoM2-only; grey it out for MoM versions.
  const version = document.getElementById('gameVersion').value;
  const isMoM = version === 'mom_1.31' || version === 'mom_cp_1.60.00';
  ['aArmor', 'bArmor'].forEach(id => {
    const el = document.getElementById(id);
    const label = document.querySelector(`label[for="${id}"]`);
    el.classList.toggle('disabled-field', isMoM);
    if (label) label.classList.toggle('disabled-field', isMoM);
    el.disabled = isMoM;
    if (isMoM) el.value = 'normal';
  });

  // Version and unit type restrictions on enchantments.
  const isCoMorCoM2 = version === 'com_6.08' || version === 'com2_1.05.11';
  const isCoM2 = version === 'com2_1.05.11';

  function subgroupAllowed(subgroup) {
    const sg = (subgroup || '').replace(/^_/, '');
    if (sg === 'MoM only') return isMoM;
    if (sg === 'CoM & CoM2') return isCoMorCoM2;
    if (sg === 'CoM2 only') return isCoM2;
    return true;
  }

  const abilByKey = Object.fromEntries(ABILITY_DEFS.map(a => [a.key, a]));

  function applyDisabled(el, disabled) {
    if (disabled) {
      if (el.tagName === 'SELECT') el.value = el.options[0].value;
      else if (el.type === 'checkbox') el.checked = false;
    }
    el.disabled = disabled;
  }

  for (const prefix of ['a', 'b']) {
    const unitTypeSel = document.getElementById(prefix + 'Abil_unitType');
    const unitType = unitTypeSel ? unitTypeSel.value : 'normal';
    // Casting restrictions should reflect the explicit base Unit Type selector only.
    // Some enchantments can transform a unit after other legal enchantments were already cast.
    const isFantastic = unitType.startsWith('fantastic_');
    const isNormal = unitType === 'normal';

    // Version-only pass: set all Enchantments items based on version.
    for (const abil of ABILITY_DEFS) {
      if (abil.group !== 'Enchantments') continue;
      const el = document.getElementById(prefix + 'Abil_' + abil.key);
      if (!el) continue;
      applyDisabled(el, !subgroupAllowed(abil.subgroup));
    }

    // Unit-type passes use the explicit Unit Type control, not transformed/effective type.

    // Normal or Hero only (disabled for fantastic units).
    for (const key of ['flameBlade', 'metalFires', 'chaosChannels', 'blackChannels', 'holyArmor', 'holyWeapon', 'eldritchWeapon', 'shatter', 'mislead']) {
      const el = document.getElementById(prefix + 'Abil_' + key);
      if (!el) continue;
      applyDisabled(el, isFantastic || !subgroupAllowed(abilByKey[key]?.subgroup));
    }

    // Normal only (disabled for fantastic units AND heroes).
    for (const key of ['discipline', 'destiny']) {
      const el = document.getElementById(prefix + 'Abil_' + key);
      if (!el) continue;
      applyDisabled(el, !isNormal || !subgroupAllowed(abilByKey[key]?.subgroup));
    }
  }

  const aStats = readUnitStats('a');
  const hasRanged = aStats.rangedType !== 'none' && aStats.rtb > 0;
  const rangedCheckLabel = document.getElementById('rangedCheckLabel');
  const rangedCheck = document.getElementById('rangedCheck');
  const rangedDist = document.getElementById('rangedDist');
  rangedCheckLabel.classList.toggle('disabled-field', !hasRanged);
  rangedCheck.disabled = !hasRanged;
  if (!hasRanged) rangedCheck.checked = false;

  const isRanged = hasRanged && rangedCheck.checked;
  document.getElementById('rangedDistLabel').classList.toggle('disabled-field', !isRanged);
  rangedDist.classList.toggle('disabled-field', !isRanged);
  rangedDist.disabled = !isRanged;

  for (const prefix of ['a', 'b']) {
    const armorSel = document.getElementById(prefix + 'Armor');
    if (!armorSel) continue;
    if (isMoM) {
      armorSel.value = 'normal';
      armorSel.disabled = true;
    } else {
      armorSel.disabled = false;
    }
  }
}

function refreshAbilityFieldVisibility() {
  updateTypeVisibility();
  updateAbilityVisibility();
}

// --- Presets ---

const PRESET_VERSIONS = {};

function applyPreset(name) {
  const preset = PRESETS[name];
  if (!preset) return;
  const targetVersion = preset.version || PRESET_VERSIONS[name];
  if (targetVersion) {
    const versionSel = document.getElementById('gameVersion');
    if (versionSel.value !== targetVersion) {
      versionSel.value = targetVersion;
      onVersionChange();
    }
  }
  function setUnit(prefix, u) {
    const s = { ...UNIT_DEFAULTS, ...u };
    document.getElementById(prefix + 'Figs').value = s.figs;
    document.getElementById(prefix + 'Atk').value = s.atk;
    document.getElementById(prefix + 'RtbType').value = s.rtbType;
    document.getElementById(prefix + 'Rtb').value = s.rtb;
    document.getElementById(prefix + 'Def').value = s.def;
    document.getElementById(prefix + 'Res').value = s.res;
    document.getElementById(prefix + 'ToHitMod').value = s.toHitMod;
    document.getElementById(prefix + 'ToHitRtbMod').value = s.toHitRtbMod;
    document.getElementById(prefix + 'ToBlkMod').value = s.toBlkMod;
    document.getElementById(prefix + 'HP').value = s.hp;
    document.getElementById(prefix + 'Dmg').value = s.dmg;
    document.getElementById(prefix + 'Weapon').value = s.weapon;
    document.getElementById(prefix + 'Armor').value = s.armor || 'normal';
    document.getElementById(prefix + 'Level').value = s.level;
    document.getElementById(prefix + 'Abil_unitType').value = s.unitType;
    clearAbilities(prefix);
    applyAbilities(prefix, s.abilities);
    refreshAbilityFieldVisibility();
  }
  const activeVersion = document.getElementById('gameVersion').value;
  const unitsDb = unitDatabases[activeVersion] || [];
  function selectPredefined(prefix, unitName) {
    const match = unitsDb.find(u => u.name === unitName);
    if (!match) {
      console.warn(`Preset "${name}": predefined unit "${unitName}" not found in ${activeVersion}`);
      document.getElementById(prefix + 'Unit').value = 'custom';
      syncUnitDisplay(prefix);
      return false;
    }
    document.getElementById(prefix + 'Unit').value = String(match.id);
    syncUnitDisplay(prefix);
    return true;
  }
  if (preset.aUnitName) {
    if (!selectPredefined('a', preset.aUnitName)) setUnit('a', preset.a || {});
  } else {
    setUnit('a', preset.a || {});
    document.getElementById('aUnit').value = 'custom';
    syncUnitDisplay('a');
  }
  if (preset.bUnitName) {
    if (!selectPredefined('b', preset.bUnitName)) setUnit('b', preset.b || {});
  } else {
    setUnit('b', preset.b || {});
    document.getElementById('bUnit').value = 'custom';
    syncUnitDisplay('b');
  }
  updateUnitLock('a');
  updateUnitLock('b');
  if (preset.a && preset.a.level) document.getElementById('aLevel').value = preset.a.level;
  if (preset.a && preset.a.weapon) document.getElementById('aWeapon').value = preset.a.weapon;
  if (preset.b && preset.b.level) document.getElementById('bLevel').value = preset.b.level;
  if (preset.b && preset.b.weapon) document.getElementById('bWeapon').value = preset.b.weapon;
  document.getElementById('rangedCheck').checked = preset.rangedCheck || false;
  document.getElementById('rangedDist').value = preset.rangedDist || 1;
  document.getElementById('cityWalls').value = preset.cityWalls || 'none';
  document.getElementById('nodeAura').value = preset.nodeAura || 'none';
  document.getElementById('enchLightDark').value = preset.enchLightDark || 'none';
  document.getElementById('wallOfFire').checked = preset.wallOfFire || false;
  document.getElementById('warpReality').checked = preset.warpReality || false;
  refreshAbilityFieldVisibility();
  recalculate();
}

// --- Test Runner ---

function runTests(tolerance) {
  tolerance = tolerance || 0.002;
  const results = [];
  let allPassed = true;
  for (const [name, preset] of Object.entries(PRESETS)) {
    if (!preset.expected) continue;
    applyPreset(name);
    const panels = document.querySelectorAll('.dist-header .avg');
    const dmgToA = parseFloat(panels[0].textContent);
    const dmgToB = parseFloat(panels[1].textContent);
    const expA = preset.expected.dmgToA;
    const expB = preset.expected.dmgToB;
    const errA = expA != null ? Math.abs(dmgToA - expA) : 0;
    const errB = expB != null ? Math.abs(dmgToB - expB) : 0;
    const pass = errA < tolerance && errB < tolerance;
    if (!pass) allPassed = false;
    results.push({
      name, pass,
      dmgToA, expectedA: expA, errA: +errA.toFixed(4),
      dmgToB, expectedB: expB, errB: +errB.toFixed(4),
    });
  }
  const failures = results.filter(r => !r.pass);
  if (allPassed) {
    console.log(`All ${results.length} tests passed.`);
  } else {
    console.error(`${failures.length}/${results.length} tests FAILED:`);
    failures.forEach(f => console.error(`  ${f.name}: A=${f.dmgToA} (exp ${f.expectedA}, err ${f.errA}), B=${f.dmgToB} (exp ${f.expectedB}, err ${f.errB})`));
  }
  return { allPassed, total: results.length, failures };
}

// --- Ability Visibility ---

// Check if a single ability item is "active" (non-default value)
function isAbilityActive(item) {
  const key = item.dataset.abilKey;
  if (!key) return false;
  const chk = item.querySelector('input[type="checkbox"]');
  const numInput = item.querySelector('input[type="number"]');
  const sel = item.querySelector('select');

  // numcheck: has a _on checkbox and a number input
  if (chk && numInput) return chk.checked;
  // bool: just a checkbox
  if (chk) return chk.checked;
  // select: non-default value
  if (sel) return sel.value !== (item.dataset.abilDefault || sel.options[0].value);
  // num: non-zero
  if (numInput) return parseInt(numInput.value) !== 0;
  return false;
}

// Update which abilities are shown based on active state.
// Hides inactive items, group headers, and empty grid containers when in hide-inactive mode.
function updateAbilityVisibility() {
  for (const prefix of ['a', 'b']) {
    const section = document.getElementById(prefix + 'Abilities').closest('.abilities-section');
    if (!section) continue;
    const content = document.getElementById(prefix + 'Abilities');
    const hiding = section.classList.contains('hide-inactive');
    const items = section.querySelectorAll('.abil-item');

    items.forEach(item => {
      if (!hiding) {
        item.classList.remove('abil-hidden');
      } else {
        const active = isAbilityActive(item);
        const focused = item.contains(document.activeElement);
        item.classList.toggle('abil-hidden', !active && !focused);
      }
    });

    // Hide subgroup headers when all their children are hidden
    section.querySelectorAll('.abil-subgroup-header').forEach(header => {
      const group = header.dataset.abilGroup;
      const subgroup = header.dataset.abilSubgroup;
      const gridContainers = section.querySelectorAll(
        `.abil-grid[data-abil-group="${group}"][data-abil-subgroup="${subgroup}"]`
      );
      let anyVisible = false;
      gridContainers.forEach(c => {
        c.querySelectorAll('.abil-item').forEach(item => {
          if (!item.classList.contains('abil-hidden')) anyVisible = true;
        });
      });
      header.classList.toggle('abil-hidden', hiding && !anyVisible);
    });

    // Hide group headers and grid containers when all their children are hidden
    section.querySelectorAll('.abil-group-header').forEach(header => {
      const group = header.dataset.abilGroup;
      const siblings = section.querySelectorAll(`.abil-item[data-abil-key]`);
      // Find items in this group: they are in grid/num-grid containers with matching data-abil-group
      const groupContainers = section.querySelectorAll(`[data-abil-group="${group}"]`);
      let anyVisible = false;
      groupContainers.forEach(c => {
        if (c === header) return;
        if (c.classList.contains('abil-subgroup-header')) return;
        const groupItems = c.querySelectorAll('.abil-item');
        groupItems.forEach(item => {
          if (!item.classList.contains('abil-hidden')) anyVisible = true;
        });
      });
      header.classList.toggle('abil-hidden', hiding && !anyVisible);
    });

    // Hide empty grid containers
    section.querySelectorAll('.abil-grid').forEach(grid => {
      const items = grid.querySelectorAll('.abil-item');
      let anyVisible = false;
      items.forEach(item => {
        if (!item.classList.contains('abil-hidden')) anyVisible = true;
      });
      grid.classList.toggle('abil-hidden', hiding && !anyVisible);
    });

    const hasVisibleAbility = [...content.querySelectorAll('.abil-item')]
      .some(item => !item.classList.contains('abil-hidden'));
    section.classList.toggle('abilities-empty', hiding && !hasVisibleAbility);
  }
}

// Toggle show/hide all abilities for both panels
function toggleAllAbilities() {
  const sections = document.querySelectorAll('.abilities-section');
  const btns = document.querySelectorAll('.toggle-abil-btn');
  const isCurrentlyHiding = sections[0] && sections[0].classList.contains('hide-inactive');

  sections.forEach(s => s.classList.toggle('hide-inactive', !isCurrentlyHiding));
  btns.forEach(b => b.textContent = isCurrentlyHiding ? 'Hide inactive' : 'Show all abilities');
  updateAbilityVisibility();
}

// --- Event Wiring ---

// Build ability UI
buildAbilitiesUI('a');
buildAbilitiesUI('b');

// Unit type change -> update level availability
['a', 'b'].forEach(prefix => {
  const unitTypeSel = document.getElementById(prefix + 'Abil_unitType');
  if (unitTypeSel) {
    unitTypeSel.addEventListener('change', () => {
      updateCustomLevelState(prefix);
      recalculate();
    });
  }
});

document.getElementById('gameVersion').addEventListener('change', onVersionChange);
document.getElementById('swapBtn').addEventListener('click', swapAttackerDefender);
document.querySelectorAll('.toggle-abil-btn').forEach(btn => {
  btn.addEventListener('click', toggleAllAbilities);
});
document.getElementById('aUnit').addEventListener('change', () => {
  updateUnitLock('a');
  updateTypeVisibility();
  recalculate();
});
document.getElementById('bUnit').addEventListener('change', () => {
  updateUnitLock('b');
  updateTypeVisibility();
  recalculate();
});
initUnitCombobox('a');
initUnitCombobox('b');

document.getElementById('aLevel').addEventListener('change', () => {
  applyLevelBonuses('a');
  recalculate();
});
document.getElementById('bLevel').addEventListener('change', () => {
  applyLevelBonuses('b');
  recalculate();
});

// Global input/change handler for all fields
document.querySelectorAll('input, select').forEach(el => {
  el.addEventListener('input', () => { updateTypeVisibility(); updateAbilityVisibility(); recalculate(); });
  el.addEventListener('change', () => { updateTypeVisibility(); updateAbilityVisibility(); recalculate(); });
});

// Focus/blur on ability items: keep focused items visible, re-hide on blur
document.querySelectorAll('.abil-item').forEach(item => {
  item.addEventListener('focusin', () => {
    item.classList.remove('abil-hidden');
  });
  item.addEventListener('focusout', () => {
    // Delay to allow click on another element within the same item
    setTimeout(() => updateAbilityVisibility(), 100);
  });
});

// Generate preset buttons as a collapsible tree
(function buildPresetButtons() {
  const container = document.getElementById('presetButtons');

  function makeButton(name) {
    const preset = PRESETS[name];
    if (!preset) return null;
    const parts = preset.desc.split(/:\s*(.+)/);
    const title = parts[0];
    const sub = parts[1] || '';
    const exp = preset.expected;
    const expLine = exp ? `${exp.dmgToA != null ? `E[A]=${exp.dmgToA.toFixed(3)}` : ''}${exp.dmgToA != null && exp.dmgToB != null ? ' ' : ''}${exp.dmgToB != null ? `E[B]=${exp.dmgToB.toFixed(3)}` : ''}` : '';
    const btn = document.createElement('button');
    btn.onclick = () => applyPreset(name);
    btn.innerHTML = `${title}<br><small>${sub}</small>` +
      (expLine ? `<br><small style="color:var(--accent)">${expLine}</small>` : '');
    return btn;
  }

  for (const group of TEST_TREE) {
    const groupDetails = document.createElement('details');
    groupDetails.className = 'preset-group';
    groupDetails.open = true;
    const groupSummary = document.createElement('summary');
    groupSummary.textContent = group.name;
    groupDetails.appendChild(groupSummary);

    for (const sub of group.subs) {
      const subDetails = document.createElement('details');
      subDetails.className = 'preset-subgroup';
      subDetails.open = false;
      const subSummary = document.createElement('summary');
      subSummary.textContent = sub.name;
      subDetails.appendChild(subSummary);

      for (const key of sub.keys) {
        if (group.version) PRESET_VERSIONS[key] = group.version;
        const btn = makeButton(key);
        if (btn) subDetails.appendChild(btn);
      }
      groupDetails.appendChild(subDetails);
    }
    container.appendChild(groupDetails);
  }
})();

// Initial load
onVersionChange();
updateAbilityVisibility();

// --- Cursor-following tooltip ---
(function initTooltip() {
  const tip = document.getElementById('tt');

  // Propagate data-tooltip from each label to the input/select siblings that follow it
  // in the same panel-fields grid, until the next label resets the current tooltip.
  document.querySelectorAll('.panel-fields').forEach(grid => {
    let cur = null;
    for (const child of grid.children) {
      if (child.tagName === 'LABEL') {
        cur = child.dataset.tooltip || null;
      } else if (cur && (child.tagName === 'INPUT' || child.tagName === 'SELECT')) {
        if (!child.dataset.tooltip) child.dataset.tooltip = cur;
      }
    }
  });
  document.addEventListener('mousemove', e => {
    let el = e.target;
    while (el && el !== document.documentElement) {
      if (el.dataset && el.dataset.tooltip) break;
      el = el.parentElement;
    }
    const text = el && el.dataset && el.dataset.tooltip;
    if (text) {
      tip.textContent = text;
      tip.style.display = 'block';
      const offX = 14, offY = 14;
      let x = e.clientX + offX;
      let y = e.clientY + offY;
      if (x + tip.offsetWidth > window.innerWidth)  x = e.clientX - tip.offsetWidth - 6;
      if (y + tip.offsetHeight > window.innerHeight) y = e.clientY - tip.offsetHeight - 6;
      tip.style.left = x + 'px';
      tip.style.top  = y + 'px';
    } else {
      tip.style.display = 'none';
    }
  });
  document.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
})();
