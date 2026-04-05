"""
Parse extracted_changeunit.js and extracted_changerace.js to produce MoM units.json.

Unit names, race membership, category, and sort order are all derived from changerace.js.
Combat stats are parsed from changeunit.js.
"""
import json
import re

CHANGEUNIT_INPUT = "MoM material/extracted_changeunit.js"
CHANGERACE_INPUT = "MoM material/extracted_changerace.js"
OUTPUT = "MoM units.json"

# MoM rangedtypex numeric -> ranged_type string (matches CoM2 RANGED_TYPE_MAP strings)
MOM_RANGED_TYPE = {
    1: 'magic_c',   # fire bolt (Magicians, Witches, etc.)
    2: 'magic_n',   # nature sparkles (Druids, Healers, etc.)
    3: 'magic_s',   # illusion/ice bolt (Sages, Illusionists)
    4: 'missile',   # arrow (Rangers, Archers, etc.)
    5: 'rock',      # boulder (Giants, Air Ship, Galley)
}

# MoM breathtypex numeric -> breath_type string
MOM_BREATH_TYPE = {
    1: 'thrown',
    2: 'fire',
    3: 'lightning',
}

# Field mappings: JS variable name suffix -> stat key
FIELD_MAP = {
    "base_meleex":      "melee",
    "base_rangedx":     "ranged",
    "rangedtypex":      "ranged_type",
    "base_defensex":    "defense",
    "base_resistx":     "resist",
    "base_tohitx":      "to_hit",
    "base_breathx":     "breath",
    "breathtypex":      "breath_type",
    "base_hpx":         "hp",
    "flyingx":          "Flying",
    "noncorpx":         "Noncorporeal",
    "lshieldx":         "LargeShield",
    "luckyx":           "Lucky",
    "lrangex":          "LongRange",
    "apx":              "ArmorPiercing",
    "fsx":              "FirstStrike",
    "negatefsx":        "NegateFirstStrike",
    "missimmx":         "MissileImmunity",
    "magimmx":          "MagicImmunity",
    "illimmx":          "IllusionImmunity",
    "weapimmx":         "WeaponImmunity",
    "deathimmx":        "DeathImmunity",
    "fireimmx":         "FireImmunity",
    "coldimmx":         "ColdImmunity",
    "poisimmx":         "PoisonImmunity",
    "stonimmx":         "StoningImmunity",
    "poisonx":          "Poison",
    "illusionx":        "Illusion",
    "gazerangedx":      "GazeRanged",
    "dgazex":           "DeathGaze",
    "sgazex":           "StoningGaze",
    "doomgazex":        "DoomGaze",
    "immox":            "Immolation",
    "dispelevilx":      "DispelEvil",
    "stouchx":          "StoningTouch",
    "invisx":           "Invisibility",
    "resistallx":       "ResistanceToAll",
    "holybonusx":       "HolyBonus",
    "lifestealx":       "LifeSteal",
    "regenx":           "Regeneration",
    "fearx":            "Fear",
    "lifeunitx":        "life_unit",
    "deathunitx":       "death_unit",
    "chaosunitx":       "chaos_unit",
    "natureunitx":      "nature_unit",
    "sorcunitx":        "sorc_unit",
    # Hero-specific
    "guaranteed_mightx":    "guaranteed_might",
    "guaranteed_arcanex":   "guaranteed_arcane",
    "guaranteed_bladex":    "guaranteed_blade",
    "guaranteed_leadx":     "guaranteed_leadership",
    "guaranteed_agilex":    "guaranteed_agility",
    "guaranteed_constx":    "guaranteed_constitution",
    "guaranteed_prayerx":   "guaranteed_prayer",
    "guaranteed_charmx":    "guaranteed_charm",
    "guaranteed_casterx":   "guaranteed_caster",
    "guaranteed_armsx":     "guaranteed_arms_master",
    "guaranteed_legenx":    "guaranteed_legendary",
    "guaranteed_noblex":    "guaranteed_noble",
    "guaranteed_sagex":     "guaranteed_sage",
    "pickctx":              "pick_count",
    "picktypex":            "pick_type",
}

# Race ID (from changerace switch) -> race name and category
RACE_ID_TO_NAME = {
    1:  ("Hero",     "Heroes"),
    2:  ("Barbarian","Barbarian"),
    3:  ("Gnoll",    "Gnoll"),
    4:  ("Halfling", "Halfling"),
    5:  ("High Elf", "High Elf"),
    6:  ("High Men", "High Men"),
    7:  ("Klackon",  "Klackon"),
    8:  ("Lizardmen","Lizardmen"),
    9:  ("Nomad",    "Nomad"),
    10: ("Orc",      "Orc"),
    11: ("Beastmen", "Beastmen"),
    12: ("Dark Elf", "Dark Elf"),
    13: ("Draconian","Draconian"),
    14: ("Dwarf",    "Dwarf"),
    15: ("Troll",    "Troll"),
    16: ("Life",     "Life Creatures"),
    17: ("Death",    "Death Creatures"),
    18: ("Chaos",    "Chaos Creatures"),
    19: ("Nature",   "Nature Creatures"),
    20: ("Sorcery",  "Sorcery Creatures"),
    21: ("Arcane",   "Arcane Creatures"),
}

# Units that appear under multiple races with identical stats get duplicate entries.
# Synthetic ID = race_id * 1000 + original_uid.
# The primary entry (lowest race_id) keeps the original uid.
# We track which (race_id, uid) pairs are primaries vs duplicates after parsing changerace.
# Units that appear in every race's dropdown but should only be listed once (under General)
GENERAL_ONLY_UIDS = {899, 900, 901, 902}

STAT_FIELDS = {
    'melee', 'ranged', 'ranged_type', 'defense', 'resist', 'to_hit',
    'breath', 'breath_type', 'hp', 'figures',
    'pick_count', 'pick_type',
    'guaranteed_might', 'guaranteed_arcane', 'guaranteed_blade',
    'guaranteed_leadership', 'guaranteed_agility', 'guaranteed_constitution',
    'guaranteed_prayer', 'guaranteed_charm', 'guaranteed_caster',
    'guaranteed_arms_master', 'guaranteed_legendary', 'guaranteed_noble',
    'guaranteed_sage',
    'life_unit', 'death_unit', 'chaos_unit', 'nature_unit', 'sorc_unit',
    'id', 'name', 'race', 'category', 'sort_order',
}


def parse_changerace(src):
    """
    Parse changerace.js to extract, per unit:
      - base_name: name as shown in dropdown
      - race: race string
      - category: category string
      - sort_order: position within its race's dropdown
      - emit_id: the ID to use in the output JSON

    Returns list of (emit_id, original_uid, base_name, race, category, sort_order).
    Units appearing in multiple races get a duplicate entry with synthetic emit_id.
    """
    entries = []  # (emit_id, original_uid, base_name, race, category, sort_order)
    uid_first_race = {}  # uid -> race_id of first occurrence (primary)

    # Heroes: raceidx == 1 block — capture only the unitx.innerHTML assignment, not levelx
    hero_match = re.search(r'raceidx == 1\b.*?unitx\.innerHTML\s*=\n\s*(.*?\';)', src, re.DOTALL)
    if hero_match:
        hero_body = hero_match.group(1)
        opts = re.findall(r'value="(\d+)">(.*?)</option>', hero_body)
        race_name, category = RACE_ID_TO_NAME[1]
        for pos, (uid_str, raw_name) in enumerate(opts):
            uid = int(uid_str)
            if uid == 0:
                continue
            name = re.sub(r'&rsquo;', "'", raw_name).strip()
            uid_first_race[uid] = 1
            entries.append((uid, uid, name, race_name, category, pos))

    # All other races: switch(raceidx) cases — only parse unitx.innerHTML, not levelx etc.
    race_cases = re.findall(r'case (\d+):(.*?)(?=case \d+:|$)', src, re.DOTALL)
    for race_id_str, body in race_cases:
        race_id = int(race_id_str)
        if race_id not in RACE_ID_TO_NAME:
            continue
        race_name, category = RACE_ID_TO_NAME[race_id]
        # Extract only the unitx.innerHTML string, not other innerHTML assignments
        unit_html_match = re.search(r'unitx\.innerHTML\s*=\n\s*(.*?\';)', body, re.DOTALL)
        if not unit_html_match:
            continue
        opts = re.findall(r'value="(\d+)">(.*?)</option>', unit_html_match.group(1))
        for pos, (uid_str, raw_name) in enumerate(opts):
            uid = int(uid_str)
            if uid == 0:
                continue
            name = re.sub(r'&rsquo;', "'", raw_name).strip()
            if uid in GENERAL_ONLY_UIDS:
                if uid in uid_first_race:
                    continue  # skip per-race duplicates
                uid_first_race[uid] = race_id
                entries.append((uid, uid, name, "General", "General", pos))
                continue
            if uid not in uid_first_race:
                uid_first_race[uid] = race_id
                emit_id = uid
            else:
                # Duplicate: assign synthetic ID
                emit_id = race_id * 1000 + uid
            entries.append((emit_id, uid, name, race_name, category, pos))

    return entries


def parse_case_body(body):
    stats = {}
    for var, key in FIELD_MAP.items():
        m = re.search(rf'{re.escape(var)}\.value\s*=\s*[\'"](\d+)[\'"]', body)
        if m:
            stats[key] = int(m.group(1))
    m = re.search(r'figuresx\.value\s*=\s*[\'"](\d+)[\'"]', body)
    if m:
        stats["figures"] = int(m.group(1))
    else:
        m = re.search(r'fixed_figuresx\.innerHTML\s*=\s*[\'"](\d+)[\'"]', body)
        if m:
            stats["figures"] = int(m.group(1))
    # Summoned units use true_* variables
    for js_name, key in [("true_melee", "melee"), ("true_defense", "defense"),
                          ("true_resist", "resist"), ("true_tohit", "to_hit"),
                          ("true_hp", "hp"), ("true_ranged", "ranged"),
                          ("true_breath", "breath")]:
        m = re.search(rf'{js_name}\s*=\s*(\d+)', body)
        if m:
            stats[key] = int(m.group(1))
    # DeathGaze/StoningGaze in the wiki calculator are stored as (10 + |penalty|);
    # convert to negative resistance modifiers (e.g. 14 → -4).
    # DoomGaze is flat damage and should not be converted.
    for gaze_key in ('DeathGaze', 'StoningGaze', 'StoningTouch'):
        if gaze_key in stats and stats[gaze_key] > 0:
            stats[gaze_key] = -(stats[gaze_key] - 10)
    return stats


def extract_switch_block(src, start):
    i = src.index('{', start)
    depth = 0
    begin = i
    while i < len(src):
        if src[i] == '{':
            depth += 1
        elif src[i] == '}':
            depth -= 1
            if depth == 0:
                return src[begin:i+1]
        i += 1
    return src[begin:]


def parse_switch_block(block):
    return re.findall(r'case (\d+):(.*?)(?=\n\s*case \d+:|\n\s*default:|\s*\}$)', block, re.DOTALL)


def extract_defaults_before_switch(src, switch_pos):
    pre = src[max(0, switch_pos - 500):switch_pos]
    defaults = {}
    for var, key in FIELD_MAP.items():
        m = re.search(rf'{re.escape(var)}\.value\s*=\s*[\'"](\d+)[\'"]', pre)
        if m:
            defaults[key] = int(m.group(1))
    return defaults


def main():
    changeunit_src = json.loads(open(CHANGEUNIT_INPUT, encoding='utf-8').read())
    changerace_src = json.loads(open(CHANGERACE_INPUT, encoding='utf-8').read())

    # --- Parse combat stats from changeunit.js ---
    switch_positions = [m.start() for m in re.finditer(r'switch \(unitidx\)', changeunit_src)]
    print(f"Found {len(switch_positions)} switch(unitidx) blocks")

    all_cases = {}  # original_uid -> stats dict
    for pos in switch_positions:
        defaults = extract_defaults_before_switch(changeunit_src, pos)
        if 'base_defensex.value' in changeunit_src[max(0, pos-500):pos]:
            if 'hp' not in defaults:
                defaults['hp'] = 1
        block = extract_switch_block(changeunit_src, pos)
        cases = parse_switch_block(block)
        for uid_str, body in cases:
            uid = int(uid_str)
            stats = {**defaults, **parse_case_body(body)}
            if uid not in all_cases:
                all_cases[uid] = stats
            else:
                all_cases[uid].update(stats)

    # Hardcode zombie variants — the source uses runtime arithmetic (unitidx - 1040/1041)
    # that the parser cannot evaluate. Stats derived from the formula plus shared fields.
    # Shared: figures=6, resist=3, hp=3, immunities, death_unit
    _zombie_shared = {
        'figures': 6, 'resist': 3, 'hp': 3,
        'IllusionImmunity': 1, 'DeathImmunity': 1, 'ColdImmunity': 1, 'PoisonImmunity': 1,
        'death_unit': 1,
    }
    all_cases[1005] = {**_zombie_shared, 'melee': 4, 'defense': 3, 'to_hit': 10}  # base
    all_cases[1044] = {**_zombie_shared, 'melee': 4, 'defense': 3, 'to_hit': 20}  # mag. weap.
    all_cases[1045] = {**_zombie_shared, 'melee': 5, 'defense': 4, 'to_hit': 20}  # mithril
    all_cases[1046] = {**_zombie_shared, 'melee': 6, 'defense': 5, 'to_hit': 20}  # adamantium

    print(f"Total unique unit IDs in changeunit: {len(all_cases)}")

    # --- Parse names/races/categories/sort_order from changerace.js ---
    race_entries = parse_changerace(changerace_src)
    print(f"Total unit entries from changerace: {len(race_entries)}")

    # Find base names that appear under multiple races (need race prefix)
    name_race_counts = {}
    for _emit_id, _orig_uid, base_name, race, _cat, _pos in race_entries:
        key = base_name
        if key not in name_race_counts:
            name_race_counts[key] = set()
        name_race_counts[key].add(race)
    ambiguous = {n for n, races in name_race_counts.items() if len(races) > 1}

    # --- Build output units ---
    units = {}
    for emit_id, orig_uid, base_name, race, category, sort_order in race_entries:
        stats = dict(all_cases.get(orig_uid, {}))

        display_name = f"{race} {base_name}" if base_name in ambiguous else base_name

        stats["id"]         = emit_id
        stats["name"]       = display_name
        stats["race"]       = race
        stats["category"]   = category
        stats["sort_order"] = sort_order

        # Heroes are always single figures
        if category == "Heroes" and "figures" not in stats:
            stats["figures"] = 1

        # Convert numeric ranged_type/breath_type to strings
        if 'ranged_type' in stats:
            stats['ranged_type'] = MOM_RANGED_TYPE.get(stats['ranged_type'], 'missile')
        if 'breath_type' in stats:
            stats['breath_type'] = MOM_BREATH_TYPE.get(stats['breath_type'], 'fire')

        # Move ability flags into abilities list
        # Hardcoded fixes for wiki calculator data errors
        if base_name == "Chaos Spawn":
            stats.pop('GazeRanged', None)  # Chaos Spawn does not have ranged gaze

        abilities = []
        # Add CreateOutpost for settlers so they can be filtered by the calculator
        if base_name == "Settlers":
            abilities.append('CreateOutpost')
        ALWAYS_VALUED = {'HolyBonus', 'Poison', 'LifeSteal', 'Regeneration',
                         'Immolation', 'ResistanceToAll', 'DeathGaze', 'StoningGaze',
                         'DoomGaze', 'GazeRanged', 'StoningTouch'}
        for key in sorted(stats.keys() - STAT_FIELDS):
            val = stats[key]
            if val:
                abilities.append(f'{key}={val}' if (val != 1 or key in ALWAYS_VALUED) else key)
        for key in list(stats.keys()):
            if key not in STAT_FIELDS:
                del stats[key]
        if abilities:
            stats['abilities'] = abilities

        if 'CreateOutpost' not in abilities:
            units[emit_id] = stats

    with open(OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(units, f, indent=2)
    print(f"Written {len(units)} units to {OUTPUT}")

    # Spot-check
    for uid in [37, 63, 1004, 1024]:
        if uid in units:
            print(f"\n--- {units[uid]['name']} (id={uid}) ---")
            print(json.dumps(units[uid], indent=2))


if __name__ == '__main__':
    main()
