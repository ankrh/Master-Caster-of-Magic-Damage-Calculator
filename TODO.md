# TODO

## Open Questions

- **Troll Shaman/Magician cost and Magician attack discrepancy**: Game data shows Troll Shamans cost 80 (manual: 50), Magicians cost 180 (manual: 120), and Magicians have Melee 4 (manual: 3). The cost increases may reflect the high-HP / Regeneration premium not documented in the manual. The +1 Melee on Magicians is unexplained — verify whether Trolls have an undocumented +1 Melee modifier on top of the +2 already listed, or whether the manual value is simply wrong.

- **Draconian Resistance discrepancy**: Game data (UNITS.INI / HTML) shows Draconian common units have Resistance 1 higher than the manual states (Spearmen 4 vs 3, Swordsmen 5 vs 4, Halberdiers 6 vs 5, Magicians 9 vs 8). This likely means Draconians have an undocumented +1 Resistance racial modifier not listed in the manual. Verify against another source and update the racial modifier note in `CoM2 material/units_by_race.md`.
VERIFIED UNITS.DAT ACCURATE IN-GAME CoM2

- **Clarify RangedType-to-realm mapping for CoM2**: The current RANGED_TYPE_MAP in index.html is based on the MoM wiki's Ranged Magical Attack Subtypes table. However, some codes are ambiguous:
  - **Code 32** (ice bolt / illusion ball): The wiki lists Djinn (Nature) and Sage/Illusionist heroes (Sorcery) under the same animation group, but with different realm colors. We currently map 32 to Sorcery based on the hero majority. Need to verify whether CoM2 treats Djinn's ranged attack as Sorcery or Nature.
  - **Code 34** (Water Elemental): Not listed in the wiki subtypes table. Mapped to Sorcery based on Water Elemental being a Sorcery creature. Need confirmation.
  - **Code 33** (death bolt): Wiki says Chaos-colored, but used by Death realm creatures (Shadow Demons, Demon Lord, Ghouls). Need to confirm whether CoM2 treats these as Chaos or has a separate Death realm for damage purposes.
  - General question: Does CoM2 use the same realm-color assignments as MoM, or has it changed any?

- **UNITS.INI validity** The data on settlers in the UNITS.INI file has no lucky settlers, but they exist in game in CoM2. Are we sure that the UNITS.INI from the CoM2 folder actually describes CoM2 units?

- **Night Stalker "ranged"** Does the night stalker in CoM2 still have the 1 magical ranged attack that the death gaze is attached to in MoM?

- **What is Doom Bat "Doom"** It does not seem to be the same as Doom gaze.

- **What is lightning resistance** (Sky drake, Storm giant)

- **Which races have access to catapults and ships?**

- **Any source for ammo of MoM units?**

- **CoM2 hero caster stats?**