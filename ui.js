// --- UI Layer ---
// All DOM interaction. Depends on data.js, engine.js, combat.js.

// --- Abilities UI ---

function buildAbilitiesUI(prefix) {
  const container = document.getElementById(prefix + 'Abilities');
  let gridDiv = null;
  let numGridDiv = null;
  let currentGroup = '';
  let currentGroupClass = '';
  for (const abil of ABILITY_DEFS) {
    if (abil.group && abil.group !== currentGroup) {
      currentGroup = abil.group;
      currentGroupClass = 'group-' + currentGroup.toLowerCase().replace(/[^a-z]+/g, '-');
      gridDiv = null;
      numGridDiv = null;
      const header = document.createElement('div');
      header.className = 'abil-group-header';
      header.dataset.abilGroup = currentGroup;
      header.textContent = currentGroup;
      container.appendChild(header);
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
      numGridDiv = null;
      if (!gridDiv) {
        gridDiv = document.createElement('div');
        gridDiv.className = 'abil-grid ' + currentGroupClass;
        gridDiv.dataset.abilGroup = currentGroup;
        container.appendChild(gridDiv);
      }
      const lbl = document.createElement('label');
      lbl.className = 'abil-check abil-item';
      lbl.dataset.abilKey = abil.key;
      lbl.innerHTML = `<input type="checkbox" id="${id}"> ${labelHtml}`;
      gridDiv.appendChild(lbl);
    } else if (abil.type === 'select') {
      gridDiv = null;
      if (!numGridDiv) {
        numGridDiv = document.createElement('div');
        numGridDiv.className = 'abil-num-grid ' + currentGroupClass;
        numGridDiv.dataset.abilGroup = currentGroup;
        container.appendChild(numGridDiv);
      }
      const row = document.createElement('div');
      row.className = 'abil-num-row abil-item';
      row.dataset.abilKey = abil.key;
      row.dataset.abilDefault = abil.options[0][0];
      const opts = abil.options.map(([v, l]) => `<option value="${v}">${l}</option>`).join('');
      row.innerHTML = `<label for="${id}">${labelHtml}</label><select id="${id}">${opts}</select>`;
      numGridDiv.appendChild(row);
    } else if (abil.type === 'numcheck') {
      gridDiv = null;
      if (!numGridDiv) {
        numGridDiv = document.createElement('div');
        numGridDiv.className = 'abil-num-grid ' + currentGroupClass;
        numGridDiv.dataset.abilGroup = currentGroup;
        container.appendChild(numGridDiv);
      }
      const row = document.createElement('div');
      row.className = 'abil-num-row abil-item';
      row.dataset.abilKey = abil.key;
      row.innerHTML = `<input type="checkbox" id="${id}_on"><label for="${id}">${labelHtml}</label><input type="number" id="${id}" value="0" min="-50" max="50">`;
      numGridDiv.appendChild(row);
    } else {
      gridDiv = null;
      if (!numGridDiv) {
        numGridDiv = document.createElement('div');
        numGridDiv.className = 'abil-num-grid ' + currentGroupClass;
        numGridDiv.dataset.abilGroup = currentGroup;
        container.appendChild(numGridDiv);
      }
      const row = document.createElement('div');
      row.className = 'abil-num-row abil-item';
      row.dataset.abilKey = abil.key;
      row.innerHTML = `<label for="${id}">${labelHtml}</label><input type="number" id="${id}" value="0" min="-50" max="50">`;
      numGridDiv.appendChild(row);
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
      result[abil.key] = normalized.some(a => a === abil.match || a.startsWith(abil.match + '='));
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

function loadUnitDatabase(version) {
  if (unitDatabases[version]) return unitDatabases[version];
  const data = VERSION_DATA[version];
  if (!data) { unitDatabases[version] = []; return []; }
  unitDatabases[version] = Object.values(data);
  return unitDatabases[version];
}

function populateUnitDropdown(selectId, units) {
  const sel = document.getElementById(selectId);
  const oldVal = sel.value;

  while (sel.children.length > 1) sel.removeChild(sel.children[1]);
  if (units.length === 0) return;

  const groups = {};
  for (const u of units) {
    if (u.abilities && u.abilities.includes('CreateOutpost')) continue;
    if (u.name === 'Floating Island') continue;
    const cat = u.category;
    if (cat === 'Heroes') continue;
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(u);
  }

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

  for (const cat of categoryOrder) {
    if (!groups[cat]) continue;
    const optgroup = document.createElement('optgroup');
    optgroup.label = cat;
    for (const u of groups[cat].slice().sort((a, b) => {
      const k = a.sort_order !== undefined ? 'sort_order' : 'cost';
      return (a[k] || 0) - (b[k] || 0);
    })) {
      const opt = document.createElement('option');
      opt.value = String(u.id);
      opt.textContent = u.name;
      optgroup.appendChild(opt);
    }
    sel.appendChild(optgroup);
  }

  if ([...sel.options].some(o => o.value === oldVal)) {
    sel.value = oldVal;
  } else {
    sel.value = 'custom';
  }
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
  const version = document.getElementById('gameVersion').value;
  const lvl = getLevelBonuses(document.getElementById(prefix + 'Level').value, version);
  const weapon = document.getElementById(prefix + 'Weapon').value;
  const wpn = weaponBonus(weapon);

  const rtbTypeRaw = document.getElementById(prefix + 'RtbType').value;
  const rangedType = RANGED_TYPES.includes(rtbTypeRaw) ? rtbTypeRaw : 'none';
  const thrownType = THROWN_TYPES.includes(rtbTypeRaw) ? rtbTypeRaw : 'none';
  const rangedGetsWpn = (rangedType === 'missile' || rangedType === 'boulder');
  const thrownGetsWpn = (thrownType === 'thrown');

  // Base values from inputs
  const baseAtk = Math.max(0, parseInt(document.getElementById(prefix + 'Atk').value) || 0);
  const baseRtb = Math.max(0, parseInt(document.getElementById(prefix + 'Rtb').value) || 0);
  const baseDef = Math.max(0, parseInt(document.getElementById(prefix + 'Def').value) || 0);
  const baseRes = Math.max(0, parseInt(document.getElementById(prefix + 'Res').value) || 0);
  const baseHP  = Math.max(1, parseInt(document.getElementById(prefix + 'HP').value) || 1);
  const baseToHitMod = parseInt(document.getElementById(prefix + 'ToHitMod').value) || 0;
  const baseToHitRtbMod = parseInt(document.getElementById(prefix + 'ToHitRtbMod').value) || 0;
  const baseToBlkMod = parseInt(document.getElementById(prefix + 'ToBlkMod').value) || 0;

  // City walls bonus (defender only)
  const cwVal = document.getElementById('cityWalls').value;
  const cityWallBonus = (prefix === 'b' && cwVal !== 'none') ? parseInt(cwVal) : 0;

  // Read abilities from DOM
  const abilities = readAbilitiesFromDOM(prefix);
  const abilMods = getAbilityStatModifiers(abilities, version);

  // Node Aura bonus: +2 atk, +2 rtb, +2 def, +2 res for matching Fantastic units
  const unitTypeVal = document.getElementById(prefix + 'Abil_unitType').value;
  const nodeAuraVal = document.getElementById('nodeAura').value;
  const unitRealm = unitTypeVal.startsWith('fantastic_') ? unitTypeVal.slice('fantastic_'.length) : null;
  const nodeAuraActive = unitRealm !== null && nodeAuraVal !== 'none' && unitRealm === nodeAuraVal;
  const nodeBonus = nodeAuraActive ? 2 : 0;

  // Darkness / True Light: +1/-1 to atk (non-spell), def, res for Death/Life fantastic units
  // Darkness: +1 Death, -1 Life. True Light: +1 Life, -1 Death. Both can be active (cancel out).
  const lightDarkVal = document.getElementById('enchLightDark').value;
  const hasDarkness = lightDarkVal === 'darkness';
  const hasTrueLight = lightDarkVal === 'trueLight';
  let darkLightBonus = 0;
  if (unitRealm === 'death') {
    if (hasDarkness) darkLightBonus += 1;
    if (hasTrueLight) darkLightBonus -= 1;
  } else if (unitRealm === 'life') {
    if (hasTrueLight) darkLightBonus += 1;
    if (hasDarkness) darkLightBonus -= 1;
  }

  // Effective values (level + weapon + ability + node aura + darkness/light modifiers)
  const atk = baseAtk > 0 ? Math.max(0, baseAtk + lvl.atk + wpn.atk + abilMods.atkMod + nodeBonus + darkLightBonus) : 0;
  const def = Math.max(0, baseDef + lvl.def + wpn.def + cityWallBonus + abilMods.defMod + nodeBonus + darkLightBonus);
  const res = Math.max(0, baseRes + lvl.res + abilMods.resMod + nodeBonus + darkLightBonus);
  const hp  = Math.max(1, baseHP + lvl.hp + abilMods.hpMod);

  // Ranged/Thrown/Breath strength
  let rtbLvl = 0, rtbWpn = 0;
  if (rangedType !== 'none') {
    rtbLvl = baseRtb > 0 ? lvl.ranged : 0;
    rtbWpn = (baseRtb > 0 && rangedGetsWpn) ? wpn.atk : 0;
  } else if (thrownType !== 'none') {
    rtbLvl = lvl.thrown;
    rtbWpn = (baseRtb > 0 && thrownGetsWpn) ? wpn.atk : 0;
  }
  const rtb = baseRtb > 0 ? Math.max(0, baseRtb + rtbLvl + rtbWpn + abilMods.rtbMod + nodeBonus + darkLightBonus) : 0;

  // Hidden gaze ranged attack: affected by same modifiers as ranged (level, node aura,
  // darkness/light, ability mods) but NOT weapon bonuses. In v1.31, if reduced to 0 the
  // gaze attack does not fire.
  const baseGazeRanged = (abilities && abilities.gazeRanged) || 0;
  const effectiveGazeRanged = baseGazeRanged > 0
    ? Math.max(0, baseGazeRanged + lvl.ranged + abilMods.rtbMod + nodeBonus + darkLightBonus)
    : 0;

  // Doom Gaze: delivers exact doom damage. Affected by node aura, darkness/light,
  // and ability modifiers (e.g. Black Prayer), but NOT level or weapon bonuses.
  const baseDoomGaze = (abilities && abilities.doomGaze) || 0;
  const effectiveDoomGaze = baseDoomGaze > 0
    ? Math.max(0, baseDoomGaze + abilMods.rtbMod + nodeBonus + darkLightBonus)
    : 0;

  // To Hit percentage bonuses
  const meleeToHitBonus = lvl.toHit + wpn.toHit + abilMods.toHitMod;
  const rtbToHitWpn = rangedGetsWpn ? wpn.toHit : 0;

  // Distance penalty (attacker ranged only)
  let rtbDistPenalty = 0;
  if (prefix === 'a' && (rangedType === 'missile' || rangedType === 'boulder')) {
    const rangedCheck = document.getElementById('rangedCheck');
    if (rangedCheck && rangedCheck.checked) {
      const dist = Math.max(1, parseInt(document.getElementById('rangedDist').value) || 1);
      rtbDistPenalty = distancePenalty(dist, rangedType);
    }
  }

  // Pre-clamped To Hit/Block values for combat (decimals 0.1-1.0)
  const toHitMelee = clampPct(30, baseToHitMod + meleeToHitBonus);
  const toHitRtb = clampPct(30, baseToHitRtbMod + lvl.toHit + rtbToHitWpn + rtbDistPenalty + abilMods.toHitMod);
  const toBlock = clampPct(30, baseToBlkMod + abilMods.toBlkMod);

  return {
    // Base values (for display)
    baseAtk, baseRtb, baseDef, baseRes, baseHP,
    baseToHitMod, baseToHitRtbMod, baseToBlkMod,
    // Bonus breakdown (for display)
    atkBonus: baseAtk > 0 ? lvl.atk + wpn.atk + abilMods.atkMod + nodeBonus + darkLightBonus : 0,
    rtbBonus: baseRtb > 0 ? rtbLvl + rtbWpn + abilMods.rtbMod + nodeBonus + darkLightBonus : 0,
    defBonus: lvl.def + wpn.def + cityWallBonus + abilMods.defMod + nodeBonus + darkLightBonus,
    resBonus: lvl.res + abilMods.resMod + nodeBonus + darkLightBonus,
    hpBonus: lvl.hp + abilMods.hpMod,
    meleeToHitBonus,
    rtbToHitWpnBonus: rtbToHitWpn,
    rtbToHitLvlBonus: lvl.toHit,
    rtbDistPenalty,
    // Effective values (for calculation)
    figs: Math.max(1, parseInt(document.getElementById(prefix + 'Figs').value) || 1),
    atk, def, res, hp, rtb, effectiveGazeRanged, effectiveDoomGaze, weapon, unitType: unitTypeVal,
    dmg: Math.max(0, parseInt(document.getElementById(prefix + 'Dmg').value) || 0),
    rangedType, thrownType,
    rangedGetsWpn, thrownGetsWpn,
    cityWallBonus,
    wpn, lvl,
    // Pre-clamped combat values
    toHitMelee, toHitRtb, toBlock,
    // Abilities (for combat flow modifiers)
    abilities,
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

  function showModPct(id, effective, base) {
    const el = document.getElementById(id);
    if (!el) return;
    if (effective !== base) {
      el.textContent = Math.round(effective * 100) + '%';
      el.classList.add('visible');
    } else {
      el.textContent = '';
      el.classList.remove('visible');
    }
  }

  showMod(prefix + 'AtkMod', s.atk, s.baseAtk);
  showMod(prefix + 'RtbMod', s.rtb, s.baseRtb);
  showMod(prefix + 'DefMod', s.def, s.baseDef);
  showMod(prefix + 'ResMod', s.res, s.baseRes);
  showMod(prefix + 'HPMod', s.hp, s.baseHP);

  const baseMeleeToHit = clampPct(30, s.baseToHitMod);
  const baseRtbToHit = clampPct(30, s.baseToHitRtbMod);
  const baseToBlock = clampPct(30, s.baseToBlkMod);
  showModPct(prefix + 'ToHitMeleeMod', s.toHitMelee, baseMeleeToHit);
  showModPct(prefix + 'ToHitRtbModDisp', s.toHitRtb, baseRtbToHit);
  showModPct(prefix + 'ToBlkModDisp', s.toBlock, baseToBlock);
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
                         'Life': 'life', 'Death': 'death', 'Arcane': 'arcane' };
      const realm = realmMap[cat] || 'arcane';
      unitTypeSel.value = 'fantastic_' + realm;
    } else {
      unitTypeSel.value = 'normal';
    }
  }

  const abilValues = parseAbilitiesFromUnit(unit);
  applyAbilities(prefix, abilValues);
  applyLevelBonuses(prefix);
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

  const simpleFields = ['Figs', 'Atk', 'RtbType', 'Rtb', 'ToHitMod', 'ToHitRtbMod', 'ToBlkMod', 'Def', 'Res', 'HP', 'Dmg', 'Level', 'Weapon'];
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

  updateUnitLock('a');
  updateUnitLock('b');
  updateTypeVisibility();
  updateAbilityVisibility();
  recalculate();
}

// --- Version Change ---

function getUnitHeroArchetype(name) {
  const m = (name || '').match(/^(.+?)\s*\(.*\)$/);
  return m ? m[1].trim() : null;
}

function findMatchingUnit(units, oldUnit) {
  if (!oldUnit) return null;
  const oldName = oldUnit.name;
  let match = units.find(u => u.name === oldName);
  if (match) return match;
  const aliased = UNIT_NAME_ALIASES[oldName];
  if (aliased) {
    match = units.find(u => u.name === aliased);
    if (match) return match;
  }
  const arch = getUnitHeroArchetype(oldName);
  if (arch) {
    match = units.find(u => getUnitHeroArchetype(u.name) === arch);
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
  const oldAUnit = oldAId !== 'custom' ? (Object.values(unitDatabases).flat().find(u => String(u.id) === oldAId) || null) : null;
  const oldBUnit = oldBId !== 'custom' ? (Object.values(unitDatabases).flat().find(u => String(u.id) === oldBId) || null) : null;

  const units = loadUnitDatabase(version);
  populateUnitDropdown('aUnit', units);
  populateUnitDropdown('bUnit', units);

  for (const [prefix, oldUnit, sel] of [['a', oldAUnit, aUnitSel], ['b', oldBUnit, bUnitSel]]) {
    if (!oldUnit) continue;
    if (sel.value !== 'custom') continue;
    const matched = findMatchingUnit(units, oldUnit);
    if (matched) {
      sel.value = String(matched.id);
    }
  }

  updateUnitLock('a');
  updateUnitLock('b');
  updateTypeVisibility();
  recalculate();
}

// --- Rendering ---

function formatPct(p) {
  return (p * 100).toFixed(1) + '%';
}

function renderDistPanel(container, title, dist, hp, numFigs, opts) {
  const showSkulls = opts && opts.showSkulls;
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

  // Compute destruction chance (damage >= total remaining HP)
  let destroyPct = '';
  if (numFigs > 0 && hp > 0) {
    const totalRemHP = firstFigRem + (numFigs - 1) * hp;
    let pDestroy = 0;
    for (let d = totalRemHP; d < dist.length; d++) pDestroy += dist[d] || 0;
    destroyPct = ` &mdash; ${formatPct(pDestroy)} destroyed`;
  }

  const barColor = (opts && opts.barColor) || '#ff4d6a';

  let html = `<div class="dist-header">${title}: <span class="avg">${expected.toFixed(3)}</span>${destroyPct}</div>`;
  html += '<div class="dist-scroll"><table class="dist-table">';
  html += '<thead><tr><th>Damage</th><th style="text-align:right">Chance</th></tr></thead><tbody>';

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
  if (!phases || phases.length === 0) {
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
    renderDistPanel(panels[idx], 'Mean damage to attacker', phase.atkDist, phase.atkHPper, phase.atkFigs, breakdownOpts);
    renderDistPanel(panels[idx + 1], 'Mean damage to defender', phase.defDist, phase.defHPper, phase.defFigs, breakdownOpts);
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

  const aLS = result.aLifeStealDist ? expectedValue(result.aLifeStealDist) : 0;
  const bLS = result.bLifeStealDist ? expectedValue(result.bLifeStealDist) : 0;

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

  const result = resolveCombat(a, b, { isRanged, version });

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

  const aRtbVal = parseInt(document.getElementById('aRtb').value) || 0;
  const hasRanged = RANGED_TYPES.includes(document.getElementById('aRtbType').value) && aRtbVal > 0;
  const rangedCheckLabel = document.getElementById('rangedCheckLabel');
  const rangedCheck = document.getElementById('rangedCheck');
  rangedCheckLabel.classList.toggle('disabled-field', !hasRanged);

  const isRanged = hasRanged && rangedCheck.checked;
  document.getElementById('rangedDistLabel').classList.toggle('disabled-field', !isRanged);
  document.getElementById('rangedDist').classList.toggle('disabled-field', !isRanged);
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
    document.getElementById(prefix + 'Level').value = s.level;
    document.getElementById(prefix + 'Abil_unitType').value = s.unitType;
    clearAbilities(prefix);
    applyAbilities(prefix, s.abilities);
  }
  const activeVersion = document.getElementById('gameVersion').value;
  const unitsDb = unitDatabases[activeVersion] || [];
  function selectPredefined(prefix, unitName) {
    const match = unitsDb.find(u => u.name === unitName);
    if (!match) {
      console.warn(`Preset "${name}": predefined unit "${unitName}" not found in ${activeVersion}`);
      document.getElementById(prefix + 'Unit').value = 'custom';
      return false;
    }
    document.getElementById(prefix + 'Unit').value = String(match.id);
    return true;
  }
  if (preset.aUnitName) {
    if (!selectPredefined('a', preset.aUnitName)) setUnit('a', preset.a || {});
  } else {
    setUnit('a', preset.a || {});
    document.getElementById('aUnit').value = 'custom';
  }
  if (preset.bUnitName) {
    if (!selectPredefined('b', preset.bUnitName)) setUnit('b', preset.b || {});
  } else {
    setUnit('b', preset.b || {});
    document.getElementById('bUnit').value = 'custom';
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
  updateTypeVisibility();
  updateAbilityVisibility();
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
    const errA = Math.abs(dmgToA - preset.expected.dmgToA);
    const errB = Math.abs(dmgToB - preset.expected.dmgToB);
    const pass = errA < tolerance && errB < tolerance;
    if (!pass) allPassed = false;
    results.push({
      name, pass,
      dmgToA, expectedA: preset.expected.dmgToA, errA: +errA.toFixed(4),
      dmgToB, expectedB: preset.expected.dmgToB, errB: +errB.toFixed(4),
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

    // Hide group headers and grid containers when all their children are hidden
    section.querySelectorAll('.abil-group-header').forEach(header => {
      const group = header.dataset.abilGroup;
      const siblings = section.querySelectorAll(`.abil-item[data-abil-key]`);
      // Find items in this group: they are in grid/num-grid containers with matching data-abil-group
      const groupContainers = section.querySelectorAll(`[data-abil-group="${group}"]`);
      let anyVisible = false;
      groupContainers.forEach(c => {
        if (c === header) return;
        const groupItems = c.querySelectorAll('.abil-item');
        groupItems.forEach(item => {
          if (!item.classList.contains('abil-hidden')) anyVisible = true;
        });
      });
      header.classList.toggle('abil-hidden', hiding && !anyVisible);
    });

    // Hide empty grid containers
    section.querySelectorAll('.abil-grid, .abil-num-grid').forEach(grid => {
      const items = grid.querySelectorAll('.abil-item');
      let anyVisible = false;
      items.forEach(item => {
        if (!item.classList.contains('abil-hidden')) anyVisible = true;
      });
      grid.classList.toggle('abil-hidden', hiding && !anyVisible);
    });
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
    const expLine = exp ? `E[A]=${exp.dmgToA.toFixed(3)} E[B]=${exp.dmgToB.toFixed(3)}` : '';
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
