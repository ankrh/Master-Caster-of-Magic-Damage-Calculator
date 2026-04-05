"""
Generate a JSON file of CoM2 units from UNITS.INI.

Shared stat fields (snake_case, matching MoM units_from_changeunit.json):
  id, name, race, figures, hp, melee, defense, resist, to_hit
  ranged, ranged_type, ammo   (omitted when absent)
  breath, breath_type         (omitted when absent)

CoM2-only fields (no MoM equivalent):
  abilities (list), ini_name, category, hero_type, moves, cost, upkeep
"""

import json
import re

RACE_NAMES = {
    0: 'Barbarian', 1: 'Beastmen', 2: 'Dark Elf', 3: 'Draconian', 4: 'Dwarf',
    5: 'Gnoll', 6: 'Halfling', 7: 'High Elf', 8: 'High Men', 9: 'Klackon',
    10: 'Lizardman', 11: 'Nomad', 12: 'Orc', 13: 'Troll', 14: 'Special',
    15: 'Arcane', 16: 'Nature', 17: 'Sorcery', 18: 'Chaos', 19: 'Life', 20: 'Death',
}

# RangedType ID -> calculator ranged type string (mirrors index.html RANGED_TYPE_MAP)
RANGED_TYPE_MAP = {
    10: 'rock',      # boulder / catapult
    11: 'rock',      # cannon
    20: 'missile',
    21: 'missile',   # sling
    30: 'magic_c',   # chaos — lightning bolt
    31: 'magic_c',   # chaos — fire bolt
    32: 'magic_s',   # sorcery — ice bolt / illusion ball
    33: 'magic_c',   # chaos — death bolt
    34: 'magic_s',   # sorcery
    35: 'magic_n',   # nature — priest sparkles
    36: 'magic_c',   # chaos — drow sparkles
    37: 'magic_n',   # nature — sprite shimmer
    38: 'magic_n',   # nature — green bolt
    39: 'magic_c',   # chaos (misc)
    40: 'magic_n',   # nature (misc)
}

# Realm lookup for fantastic creatures (Race >= 15)
REALM_NAMES = {
    15: 'Arcane', 16: 'Nature', 17: 'Sorcery', 18: 'Chaos', 19: 'Life', 20: 'Death',
}

# Spell ID -> display name for Spellability field
SPELL_NAMES = {
    5:   "Web",
    96:  "Fireball",
    104: "Doom Bolt",
    125: "Healing",
    137: "Raise Dead",
    191: "Summon Demon",
}


def parse_units_ini(path):
    units = []
    current = None
    with open(path, 'r', encoding='utf-8', errors='replace') as f:
        for raw_line in f:
            line = raw_line.strip()
            if not line:
                continue
            sec_match = re.match(r'^\[(\d+)\]$', line)
            if sec_match:
                if current is not None:
                    units.append(current)
                current = {'index': int(sec_match.group(1))}
                continue
            if current is None:
                continue
            eq_idx = line.find('=')
            if eq_idx < 0:
                continue
            key = line[:eq_idx].strip()
            val = line[eq_idx + 1:].strip()
            current[key] = val
    if current is not None:
        units.append(current)
    return units


def get_category(u):
    """Mirror index.html getUnitCategory logic."""
    idx = u['index']
    if u.get('HeroType'):
        return 'Heroes'
    if 35 <= idx <= 38:
        return 'General'
    race = int(u.get('Race', 0))
    if race >= 15:
        return REALM_NAMES.get(race, 'Fantastic') + ' Creatures'
    if race in RACE_NAMES:
        return RACE_NAMES[race]
    return 'Other'


HERO_NAMES = {
    'Dwarf':        'Dwarf (Brax)',
    'Barbarian':    'Barbarian (Gunther)',
    'Sage':         'Sage (Zaldron)',
    'Dervish':      'Dervish (B\'Shan)',
    'Beastmaster':  'Beastmaster (Rakir)',
    'Bard':         'Bard (Valana)',
    'Orc Archer':   'Orc Archer (Bahgtru)',
    'Healer':       'Healer (Serena)',
    'Huntress':     'Huntress (Shuri)',
    'Thief':        'Thief (Theria)',
    'Druid':        'Druid (Greyfairer)',
    'War Monk':     'War Monk (Taki)',
    'Warrior Mage': 'Warrior Mage (Reywind)',
    'Magician':     'Magician (Malleus)',
    'Assassin':     'Assassin (Tumu)',
    'Wind Mage':    'Wind Mage (Jaer)',
    'Ranger':       'Ranger (Marcus)',
    'Draconian':    'Draconian (Fang)',
    'Witch':        'Witch (Morgana)',
    'Golden One':   'Golden One (Aureus)',
    'Ninja':        'Ninja (Shin Bo)',
    'Rogue':        'Rogue (Spyder)',
    'Amazon':       'Amazon (Shalla)',
    'Warlock':      'Warlock (Yramrag)',
    'Unknown':      'Unknown (Mystic X)',
    'Illusionist':  'Illusionist (Aerie)',
    'Swordsman':    'Swordsman (Deth Stryke)',
    'Priestess':    'Priestess (Elana)',
    'Paladin':      'Paladin (Roland)',
    'Black Knight': 'Black Knight (Mortu)',
    'Elven Archer': 'Elven Archer (Alorra)',
    'Knight':       'Knight (Sir Harold)',
    'Necromancer':  'Necromancer (Ravashack)',
    'Chaos Warrior':'Chaos Warrior (Warrax)',
    'Chosen':       'Chosen (Torin)',
}


def get_display_name(u):
    """Mirror index.html getUnitDisplayName logic."""
    name = u.get('Name', 'Unknown')
    if u.get('HeroType'):
        return HERO_NAMES.get(name, name)
    race = int(u.get('Race', 0))
    if u.get('DisplayRace') == 'Yes' and RACE_NAMES.get(race) and RACE_NAMES.get(race) != 'Special':
        return RACE_NAMES[race] + ' ' + name
    return name


def ini_unit_to_record(u):
    """Convert a raw INI unit dict to the shared JSON schema record."""
    idx = u['index']

    # Shared stat fields (snake_case, matching MoM schema)
    record = {
        'id':         idx,
        'name':       get_display_name(u),
        'race':       int(u.get('Race', 0)),
        'figures':    int(u.get('Figures', 1)),
        'hp':         int(u.get('HP', 1)),
        'melee':      int(u.get('Attack', 0)),
        'defense':    int(u.get('Defense', 0)),
        'resist':     int(u.get('Resistance', 0)),
        'to_hit':     int(u.get('Hit', 30)) - 30,  # bonus relative to base 30%
    }

    # Units with non-standard base block chance
    to_defend = int(u.get('ToDefend', 30))
    if to_defend != 30:
        record['to_block'] = to_defend

    # Ranged attack
    if u.get('Ranged') and int(u['Ranged']) > 0:
        rt = int(u.get('RangedType', 20))
        record['ranged']      = int(u['Ranged'])
        record['ranged_type'] = RANGED_TYPE_MAP.get(rt, 'missile')
        record['ammo']        = int(u.get('Ammo', 0))

    # Breath / thrown attack (named "breath" to match MoM)
    if u.get('Thrown') and int(u['Thrown']) > 0:
        record['breath']      = int(u['Thrown'])
        record['breath_type'] = 'thrown'
    elif u.get('FireBreath') and int(u['FireBreath']) > 0:
        record['breath']      = int(u['FireBreath'])
        record['breath_type'] = 'fire'
    elif u.get('LightningBreath') and int(u['LightningBreath']) > 0:
        record['breath']      = int(u['LightningBreath'])
        record['breath_type'] = 'lightning'

    # Abilities list (CoM2-only; MoM uses flat fields instead)
    abilities = []
    for ab in [
        'FirstStrike', 'NegateFirstStrike', 'ArmorPiercing', 'MissileImmunity',
        'MagicImmunity', 'IllusionImmunity', 'DeathImmunity', 'PoisonImmunity',
        'FireImmunity', 'ColdImmunity', 'WeaponImmunity', 'Stealth', 'Invisibility',
        'Flying', 'Sailing', 'Forester', 'Mountainwalk', 'Windwalking',
        'Waterwalking', 'LongRange', 'WallCrusher', 'Healer', 'Purify',
        'Regeneration', 'HolyBonus', 'Illusion', 'QuickCasting',
        'Fantastic', 'Noncorporeal', 'BloodSucker', 'HealingAura', 'LargeShield',
        'CreateOutpost', 'Lucky', 'Fear', 'Immolation', 'Meld', 'PlaneShifting',
        'StoningGaze', 'StoningTouch', 'StoningImmunity',
        'CounterImmunity', 'LightningResist', 'Supernatural', 'Doom',
    ]:
        val = u.get(ab, '').strip()
        if val.lower() == 'yes':
            abilities.append(ab)
        elif val and val != '0':
            abilities.append(f'{ab}={val}')

    for ab in ['Caster', 'Poison', 'Destruction']:
        val = u.get(ab, '').strip()
        if val and val != '0':
            abilities.append(f'{ab}={val}')

    # Spell ability: resolve ID to name
    spell_id = u.get('Spellability', '').strip()
    if spell_id and spell_id != '0':
        spell_id_int = int(spell_id)
        spell_name = SPELL_NAMES.get(spell_id_int, f'Spell#{spell_id}')
        charges = u.get('Spellcharges', '0').strip()
        charges_int = int(charges) if charges else 0
        abilities.append(f'Spellcaster={spell_name}x{charges_int}')

    # Keys with spaces in INI; output without spaces
    val = u.get('Life Steal', '').strip()
    if val and val != '0':
        abilities.append(f'LifeSteal={val}')
    val = u.get('Resistance To All', '').strip()
    if val and val != '0':
        abilities.append('ResistanceToAll' if val.lower() == 'yes' else f'ResistanceToAll={val}')

    for ab in ['DeathGaze', 'DoomGaze']:
        val = u.get(ab, '').strip()
        if val and val != '0':
            abilities.append(f'{ab}={val}')

    # Collapse Forester + Mountainwalk into Pathfinding
    if 'Forester' in abilities and 'Mountainwalk' in abilities:
        abilities.remove('Forester')
        abilities.remove('Mountainwalk')
        abilities.append('Pathfinding')

    if abilities:
        record['abilities'] = abilities

    # CoM2-only metadata
    record['ini_name']  = u.get('Name', 'Unknown')
    record['category']  = get_category(u)
    record['hero_type'] = int(u['HeroType']) if u.get('HeroType') else 0
    record['moves']     = int(u.get('Moves', 0))
    record['cost']      = int(u.get('Cost', 0))
    record['upkeep']    = int(u.get('Upkeep', 0))

    return record


def main():
    ini_path = 'CoM2 material/UNITS.INI'
    out_path = 'CoM2 units.json'

    SPECIAL_UNIT_NAMES = {'Floating Island'}

    raw_units = parse_units_ini(ini_path)
    records = [ini_unit_to_record(u) for u in raw_units
               if u.get('CreateOutpost', '').lower() != 'yes'
               and u.get('Name') not in SPECIAL_UNIT_NAMES]

    # Hardcoded ability fixes for data missing from the INI
    for r in records:
        if r.get('ini_name') == 'Night Stalker' and r['category'] == 'Death Creatures':
            r.setdefault('abilities', []).append('GazeRanged=1')

    # Force race prefix for non-hero units that share a name with another race's unit
    from collections import Counter
    name_counts = Counter(r['name'] for r in records if r['category'] != 'Heroes')
    for r in records:
        if r['category'] == 'Heroes':
            continue
        if name_counts[r['name']] > 1:
            race = RACE_NAMES.get(r['race'])
            if race and race != 'Special' and not r['name'].startswith(race):
                r['name'] = race + ' ' + r['name']

    # Keyed by id (string) to match units_from_changeunit.json convention
    output = {str(r['id']): r for r in records}

    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"Wrote {len(records)} units to {out_path}")

    # Summary by category
    from collections import Counter
    cats = Counter(r['category'] for r in records)
    for cat, count in sorted(cats.items()):
        print(f"  {cat}: {count}")


if __name__ == '__main__':
    main()
