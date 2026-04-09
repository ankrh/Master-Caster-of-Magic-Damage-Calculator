[The unit statistics window displays all of a unit's attributes, and allows enchantments or the entire unit to be dismissed out of combat.](https://static.wikia.nocookie.net/masterofmagic/images/b/bb/Unit_Statistics_Window.png/revision/latest?cb=20170505170917)

The *unit statistics window* displays all of a unit's attributes, and allows enchantments or the entire unit to be dismissed out of combat.



**Attack Strength** is the measure of potential [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **damage** that an attack can inflict. For “single target” attacks (i.e. conventional [Physical Damage](https://masterofmagic.fandom.com/wiki/Physical_Damage "Physical Damage")) this is generally the maximum amount of [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **damage** that the attack can inflict overall. For [Area Damage](https://masterofmagic.fandom.com/wiki/Area_Damage "Area Damage"), it is the maximum amount of [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **damage** that may be inflicted upon each individual [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") **figure** of a target unit, although this is also limited by the current [Hit Points](https://masterofmagic.fandom.com/wiki/Hit_Points "Hit Points") **hit points** of those figures.

The strength of an attack is usually defined by the rules governing that attack (e.g. for [Melee Attacks](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") the **Attack Strength** is equal to the [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") **Melee** attribute of the unit making the attack). In turn, the **Attack Strength** determines the number of attack dice used during an [Attack Roll](https://masterofmagic.fandom.com/wiki/Attack_Roll "Attack Roll").

 [The combat unit display shows the attributes (including Melee and Ranged Attack Strength) of the unit that the mouse is pointing at.](https://static.wikia.nocookie.net/masterofmagic/images/b/b7/Combat_Unit_Display.png/revision/latest?cb=20170505170155)

The *combat unit display* shows the attributes (including Melee and Ranged **Attack Strength**) of the unit that the mouse is pointing at.



The **Attack Strengths** of a unit’s basic attacks (Melee and Ranged) are indicated by rows of icons in the unit statistics window. For [Special Attacks](https://masterofmagic.fandom.com/wiki/Special_Attack "Special Attack") granted by a [Unit Ability](https://masterofmagic.fandom.com/wiki/Unit_Ability "Unit Ability") ([Thrown](https://masterofmagic.fandom.com/wiki/Thrown "Thrown") [Thrown](https://masterofmagic.fandom.com/wiki/Thrown "Thrown"), [Fire Breath](https://masterofmagic.fandom.com/wiki/Fire_Breath "Fire Breath") [Fire Breath](https://masterofmagic.fandom.com/wiki/Fire_Breath "Fire Breath"), [Lightning Breath](https://masterofmagic.fandom.com/wiki/Lightning_Breath "Lightning Breath") [Lightning Breath](https://masterofmagic.fandom.com/wiki/Lightning_Breath "Lightning Breath"), [Doom Gaze](https://masterofmagic.fandom.com/wiki/Doom_Gaze "Doom Gaze") [Doom Gaze](https://masterofmagic.fandom.com/wiki/Doom_Gaze "Doom Gaze")), the **Attack Strength** is shown instead as a number after the ability name. For spells and other effects, the **Attack Strength** is generally only listed in the description or help text.

## Concept

Imagine a fearsome minotaur swinging its great axe, a huge red dragon
exhaling fire, and a humble spearman thrusting his weapon forward. How
likely is it that all three are going to cause the same amount of
destruction? Not very likely. Are they even comparable? Possibly, but
damage is a compound function of many factors that is not easy to
condense into a single statistic. On the other hand, potential damage
may be much more simpler to define. In the above example, for instance,
it should be fairly easy to determine an order from highest to lowest
damage potential.

Granted, not all situations in a fantasy themed game will be this
clear-cut. Still, the concept is sound, and can be easily implemented
as the first step of a damage calculation mechanism. This is exactly
what the developers of many games, including Master of Magic, have
decided to do. As such, in this particular game, every form of attack
starts off with defining the **Attack Strength**, the attribute nominated to represent potential damage.

In most games simulating combat situations, and especially in
turn-based games, each action, or attack, takes a certain amount of time
to perform. The actual amount need not be defined, it is only necessary
to be able to draw comparisons. To follow with the example, the
spearman may eventually be able to bring down a tree with his thrusts,
it will just take him forever to do so. Therefore, the **Attack Strength** should ideally reflect the damage that can be done in a specific time frame.

Barring some special factors, this usually means that the system can be simplified such that the **Attack Strength**
represents primarily the size of the weapon being used (or that of a
body part, in the case of otherworldly creatures). This notion is
generally followed by Master of Magic, with factors such as weapon
quality and experience of the wielder being applied as separate bonuses.

## Effect

 [Attribute icons are colored to represent enhancements and reductions.](https://static.wikia.nocookie.net/masterofmagic/images/6/63/Attribute_Icon_Colors.png/revision/latest?cb=20170505172356)

Attribute icons are colored to represent enhancements and reductions.



**Attack Strength** serves a singular purpose in the game: it determines the amount of dice used for [Attack Rolls](https://masterofmagic.fandom.com/wiki/Attack_Roll "Attack Roll").
It is generally made up of two parts: a base strength, that is set out
by the rules, and an enhancement component, that comprises of
situational modifiers. A prime example of this would be [Combat Instant](https://masterofmagic.fandom.com/wiki/Combat_Instant "Combat Instant") damage spells that can be infused at the time of casting, resulting in a situationally higher **Attack Strength** based on the extra [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **Mana** spent.

The system used for a unit’s **Attack Strength** is slightly more ambiguous, as some modifiers (most prominently those conferred by [Experience](https://masterofmagic.fandom.com/wiki/Experience "Experience") **Experience Levels** and [Hero Abilities](https://masterofmagic.fandom.com/wiki/Hero_Ability "Hero Ability")) are displayed as part of the base **Attack Strength**.
This can be observed because the unit statistics window actually uses
separate icons for representing enhancements and reductions to a unit’s **Attack Strength** and other combat attributes. These icons have a golden background ([Icon Melee Normal Gold](https://static.wikia.nocookie.net/masterofmagic/images/d/dd/Icon_Melee_Normal_Gold.png/revision/latest?cb=20150104004737)) to represent a bonus, dark grey background ([Icon Melee Normal Lost](https://static.wikia.nocookie.net/masterofmagic/images/f/fd/Icon_Melee_Normal_Lost.png/revision/latest?cb=20150104004838)) for a penalty, and darkened gold ([Icon Melee Normal Gold Lost](https://static.wikia.nocookie.net/masterofmagic/images/2/28/Icon_Melee_Normal_Gold_Lost.png/revision/latest?cb=20150104004758)) for a combination of the two.

As noted already, **Attack Strengths** related to a unit’s basic attacks ([Melee](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack"), [Ranged](https://masterofmagic.fandom.com/wiki/Ranged_Attack "Ranged Attack"))
are represented by a row of corresponding icons in the unit statistics
window; and a single icon preceded by the numerical value in the combat
unit display (upper right corner when mousing over a unit in battle).
For abilities granting [Special Attacks](https://masterofmagic.fandom.com/wiki/Special_Attack "Special Attack") ([Thrown](https://masterofmagic.fandom.com/wiki/Thrown "Thrown") [Thrown Attacks](https://masterofmagic.fandom.com/wiki/Thrown_Attack "Thrown Attack"), [Fire Breath](https://masterofmagic.fandom.com/wiki/Fire_Breath "Fire Breath") and [Lightning Breath](https://masterofmagic.fandom.com/wiki/Lightning_Breath "Lightning Breath") [Breath Attacks](https://masterofmagic.fandom.com/wiki/Breath_Attack "Breath Attack"), [Doom Gaze](https://masterofmagic.fandom.com/wiki/Doom_Gaze "Doom Gaze") [Doom Gaze](https://masterofmagic.fandom.com/wiki/Doom_Gaze "Doom Gaze")), the **Attack Strength** is represented by a number following the icon and name of the ability. Finally, for other effects, such as spells and the [Immolation](https://masterofmagic.fandom.com/wiki/Immolation "Immolation") [Immolation](https://masterofmagic.fandom.com/wiki/Immolation "Immolation") ability, the **Attack Strength** is part of the description or help text of the effect.

### Attack Rolls

An [Attack Roll](https://masterofmagic.fandom.com/wiki/Attack_Roll "Attack Roll") is a series of "d10 rolls" (random numbers between 1 and 10) used to determine the "raw" (before mitigation) [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **damage**
of an individual attack. It is generally the second step of the process
for dealing damage, which is then followed by determining effective [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense** and performing [Defense Roll](https://masterofmagic.fandom.com/wiki/Defense_Roll "Defense Roll") **Defense Rolls**.

Each “die” of an Attack Roll has a base 30% chance to succeed,
however, only spell damage (for which the success chance can not be
modified), and the attacks of inexperienced or low-tier units actually
use this value in practice. Otherwise, it is influenced by another unit
statistic called [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit**, which modifies each die’s chance to succeed in 10% increments.

The result of an Attack Roll is the sum of successes. This is always a number between 0 and the **Attack Strength**, which is then carried over to the next step of damage resolution (mitigation).

[Figure](https://masterofmagic.fandom.com/wiki/Figure#Multi-Figure_Units "Figure") **Multi-figure** units and [Area Damage](https://masterofmagic.fandom.com/wiki/Area_Damage "Area Damage")
spells perform multiple attacks at the same time, and each of these is
handled as a completely separate procedure. It is important to realize
that this means that the target is allowed separate [Defense Roll](https://masterofmagic.fandom.com/wiki/Defense_Roll "Defense Roll") **Defense Rolls** against each individual attacking [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") **figure**, and that each target [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") **figure** defends separately versus Area Damage. The same is true for [Special Attacks](https://masterofmagic.fandom.com/wiki/Special_Attack "Special Attack") and [Sorcery](https://masterofmagic.fandom.com/wiki/Sorcery "Sorcery")**[Hasted](https://masterofmagic.fandom.com/wiki/Haste "Haste")** units: rather than adding the **Attack Strengths**
together (or doubling them), separate attacks are performed with the
component strengths, even if the attacks were to occur in the exact same
combat stage. This maintains the linearity of the damage reduction
granted by [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Armor**.

### 0 Base Attack Strength

 [Catapults can never deal Melee Damage...](https://static.wikia.nocookie.net/masterofmagic/images/5/5a/Catapults_Dont_Melee.png/revision/latest?cb=20170505171147)

Catapults can never deal Melee Damage...



There are a few units in the game (mostly [Settlers](https://masterofmagic.fandom.com/wiki/Settlers "Settlers") and war machines) that have zero base melee **Attack Strength**. Furthermore, all units that do not possess a Ranged Attack (or have exhausted all of their [Ability Ammunition](https://static.wikia.nocookie.net/masterofmagic/images/e/ed/Ability_Ammunition.png/revision/latest?cb=20140415211446) ammunition) technically abide by the same rules with respect to Ranged **Attack Strength**.

These units are unable to conduct the indicated attack in battle. It may seem that they can (for example the [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") command may still be given), but the unit will deal no damage or deliver any added effects (i.e. [Touch Attacks](https://masterofmagic.fandom.com/wiki/Touch_Attack "Touch Attack"))
with the 0 strength attack. The distinction is mainly relevant for the
AI, as it will never move or attack with such a unit, to the point of
even ignoring some [Special Attacks](https://masterofmagic.fandom.com/wiki/Special_Attack "Special Attack") that could still work (e.g. [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Chaos Channels](https://masterofmagic.fandom.com/wiki/Chaos_Channels "Chaos Channels")** Settlers with [Chaos Channels](https://masterofmagic.fandom.com/wiki/Chaos_Channels "Chaos Channels") [Fire Breath](https://masterofmagic.fandom.com/wiki/Fire_Breath "Fire Breath"), [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Chaos Spawn](https://masterofmagic.fandom.com/wiki/Chaos_Spawn "Chaos Spawn")** or [Barbarian Spearmen](https://masterofmagic.fandom.com/wiki/Barbarian_Spearmen "Barbarian Spearmen") with [Death](https://masterofmagic.fandom.com/wiki/Death "Death")**[Weakness](https://masterofmagic.fandom.com/wiki/Weakness "Weakness")**).

 [... and Catapults that ran out of ammo have no Attack Strength of any kind.](https://static.wikia.nocookie.net/masterofmagic/images/d/da/Helpless_Catapult.png/revision/latest?cb=20170505171846)

... and Catapults that ran out of ammo have no **Attack Strength** of any kind.



In addition, when a unit’s base **Attack Strength**
is 0, this results in the attribute not receiving any benefit from any
effect that would normally increase it. For effects that provide a
composite bonus (i.e. enhance multiple attributes at the same time, such
as [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") **mithril weapons** or [Death](https://masterofmagic.fandom.com/wiki/Death "Death")**[Black Channels](https://masterofmagic.fandom.com/wiki/Black_Channels "Black Channels")**), the rest of the effect will still apply, only the part improving the 0 base **Attack Strength** is ignored.

This means that no matter how many enhancements are stacked onto a 0 base **Attack Strength**,
or how high their bonuses are, the unit will still not be able to do
damage with the corresponding attack. It will simply skip the phase in
which it would deal this damage, although in the case of [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") **0 Melee** **Attack Strength**, some abilities may still deal damage elsewhere in the Melee sequence. This can be quite important for some types of [Special Attacks](https://masterofmagic.fandom.com/wiki/Special_Attack "Special Attack") (see the next section).

### Reducing Attack Strength To 0

A different, but practically similar situation arises when a unit’s **Attack Strength** is reduced to 0 by magical means. The [Sorcery](https://masterofmagic.fandom.com/wiki/Sorcery "Sorcery")**[Mind Storm](https://masterofmagic.fandom.com/wiki/Mind_Storm "Mind Storm")** spell is most effective at accomplishing this; but [Death](https://masterofmagic.fandom.com/wiki/Death "Death")**[Black Prayer](https://masterofmagic.fandom.com/wiki/Black_Prayer "Black Prayer")** and [Death](https://masterofmagic.fandom.com/wiki/Death "Death")**[Weakness](https://masterofmagic.fandom.com/wiki/Weakness "Weakness")** can also play a part; and situationally [Life](https://masterofmagic.fandom.com/wiki/Life "Life")**[True Light](https://masterofmagic.fandom.com/wiki/True_Light "True Light")**, [Death](https://masterofmagic.fandom.com/wiki/Death "Death")**[Darkness](https://masterofmagic.fandom.com/wiki/Darkness "Darkness")**, and their overland versions.

As with a base 0 **Attack Strength**,
a modified 0 will also disable the damage dealing phase of the relevant
attack sequence. This has a profound effect on units with certain types
of Special Attacks, namely Touch Attacks and Gaze Attacks. So much so,
that this has been marked as a bug and changed in the [Unofficial Patch 1.50](https://masterofmagic.fandom.com/wiki/Unofficial_Patch_1.50 "Unofficial Patch 1.50"). As such, players using this patch (or a later one) can safely ignore the rest of this section.

[Touch Attacks](https://masterofmagic.fandom.com/wiki/Touch_Attack "Touch Attack")
are a type of Special Attack that is affixed to other types of attacks.
They are executed alongside those attacks for added effect, and are
completely disabled if the relevant attack skips the phase in which it
would deal damage. For instance, reducing the [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") **Melee** **Attack Strength** of [Nightblades](https://masterofmagic.fandom.com/wiki/Nightblades "Nightblades") (a unit with an innate [Poison Touch](https://masterofmagic.fandom.com/wiki/Poison_Touch "Poison Touch") [Poison Touch](https://masterofmagic.fandom.com/wiki/Poison_Touch "Poison Touch")
ability) to 0 effectively negates their poison attack as well. It will
never be executed, even if the unit is forced into a melee [Counter Attack](https://masterofmagic.fandom.com/wiki/Counter_Attack "Counter Attack").

This effect is even more severe for units with [Gaze Attacks](https://masterofmagic.fandom.com/wiki/Gaze_Attack "Gaze Attack"),
which are short range attacks executed only as part of a Melee attack
sequence. An undocumented feature of these attacks is that they are
actually delivered as an added effect, usually to an otherwise hidden
short range attack, that has an **Attack Strength** of 1 (more on this [below](#Gaze_Attacks)).
While this hidden attack is largely irrelevant in most situations,
reducing it to 0 or less will essentially disable the entire Gaze
Attack: the added effect will never trigger. The [Death](https://masterofmagic.fandom.com/wiki/Death "Death")**[Night Stalker](https://masterofmagic.fandom.com/wiki/Night_Stalker "Night Stalker")** probably provides the best example of this situation, as its otherwise rather threatening [Death Gaze](https://masterofmagic.fandom.com/wiki/Death_Gaze "Death Gaze") [Death Gaze](https://masterofmagic.fandom.com/wiki/Death_Gaze "Death Gaze") can be effectively negated by a [Common](https://masterofmagic.fandom.com/wiki/Common_Spell "Common Spell") [Life](https://masterofmagic.fandom.com/wiki/Life "Life")**[True Light](https://masterofmagic.fandom.com/wiki/True_Light "True Light")** spell.

The main difference between a modified and a base 0 Attack
Strength is the fact that a penalized attribute can still be enhanced
back above 0, removing the obstacle that bars the use of both normal and
Special Attacks. In the Night Stalker example above, casting [Death](https://masterofmagic.fandom.com/wiki/Death "Death")**[Darkness](https://masterofmagic.fandom.com/wiki/Darkness "Darkness")**
would immediately restore the creature’s ability to use its Gaze
Attack. This would not be the case for a base 0 Attack Strength.

## Melee Strength

 [The active unit window shows Attack Strength as a numerical value followed by the icon of the attack type.](https://static.wikia.nocookie.net/masterofmagic/images/4/4b/Active_Unit_Window.png/revision/latest?cb=20170505171600)

The *active unit window* shows **Attack Strength** as a numerical value followed by the icon of the attack type.



By far the most common type of attack in the game is the [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack"). Nearly every unit in the game possesses a **Melee Attack Strength** (referred to in the *Manual* as simply **Melee Strength**), and this is listed as one of the unit’s main attributes in the unit statistics window.

**Melee Attack Strength** is generally represented as a row of sword icons, with the number of icons corresponding to the **Attack Strength**.
The combat unit display in battles uses a condensed representation
instead, showing only a single icon and the current strength as a
numerical value preceding it.

The base icons themselves are different to represent the quality
of the unit’s weapons. Furthermore, as previously mentioned, the unit
statistics window also differentiates between base **Attack Strength** and enhancements, which results in a total of four different icons for each particular weapon quality.

Weapon quality is always set at the time the unit is created, and
can not be modified afterwards. Mercenaries are always created with
normal weapons, regardless of the capabilities of the hiring wizard or
their capital city.

### Normal Weapons

The icons [Icon Melee Normal](https://static.wikia.nocookie.net/masterofmagic/images/5/5a/Icon_Melee_Normal.png/revision/latest?cb=20120103052412), [Icon Melee Normal Gold](https://static.wikia.nocookie.net/masterofmagic/images/d/dd/Icon_Melee_Normal_Gold.png/revision/latest?cb=20150104004737), [Icon Melee Normal Lost](https://static.wikia.nocookie.net/masterofmagic/images/f/fd/Icon_Melee_Normal_Lost.png/revision/latest?cb=20150104004838), and [Icon Melee Normal Gold Lost](https://static.wikia.nocookie.net/masterofmagic/images/2/28/Icon_Melee_Normal_Gold_Lost.png/revision/latest?cb=20150104004758)
are used to represent normal weapons. This is the weapon quality that
the rules are based on, and thus they have no special modifiers. The [Weapon Immunity](https://masterofmagic.fandom.com/wiki/Weapon_Immunity "Weapon Immunity") [Weapon Immunity](https://masterofmagic.fandom.com/wiki/Weapon_Immunity "Weapon Immunity") effect provides enhanced protection against regular attacks made by [Normal Units](https://masterofmagic.fandom.com/wiki/Normal_Unit "Normal Unit") with this weapon quality. However, the attacks of [Heroes](https://masterofmagic.fandom.com/wiki/Hero "Hero") and [Fantastic Units](https://masterofmagic.fandom.com/wiki/Fantastic_Unit "Fantastic Unit") bypass this immunity by default, despite being represented by the same icons. In fact, the **Melee Attack Strength**
of Heroes and Summoned Units will never be represented by any other
weapon quality icon. Normal Units turned into fantastic ones (e.g. via [Death](https://masterofmagic.fandom.com/wiki/Death "Death")**[Black Channels](https://masterofmagic.fandom.com/wiki/Black_Channels "Black Channels")** or [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Chaos Channels](https://masterofmagic.fandom.com/wiki/Chaos_Channels "Chaos Channels")**), on the other hand, will keep the weapon quality they were originally created with.

### Magical Weapons

The icons [Icon Melee Magic](https://static.wikia.nocookie.net/masterofmagic/images/3/39/Icon_Melee_Magic.png/revision/latest?cb=20120103212630), [Icon Melee Magic Gold](https://static.wikia.nocookie.net/masterofmagic/images/8/84/Icon_Melee_Magic_Gold.png/revision/latest?cb=20150104004916), [Icon Melee Magic Lost](https://static.wikia.nocookie.net/masterofmagic/images/c/c0/Icon_Melee_Magic_Lost.png/revision/latest?cb=20150104005000), and [Icon Melee Magic Gold Lost](https://static.wikia.nocookie.net/masterofmagic/images/5/5c/Icon_Melee_Magic_Gold_Lost.png/revision/latest?cb=20150104004935) represent magical weapons. These weapons have a hidden To Hit modifier of [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **+1** (not displayed in their statistics), which makes each dice of an [Attack Roll](https://masterofmagic.fandom.com/wiki/Attack_Roll "Attack Roll") 10% more likely to succeed. This will affect all attacks that are made with basic weapons ([Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") **Melee**, [Ranged Missile Attack](https://masterofmagic.fandom.com/wiki/Ranged_Missile_Attack "Ranged Missile Attack") **Ranged Missile**, [Ranged Boulder Attack](https://masterofmagic.fandom.com/wiki/Ranged_Boulder_Attack "Ranged Boulder Attack") **Ranged Boulder**), but not special or magical attacks ([Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **Ranged Magical**, [Thrown Attack](https://masterofmagic.fandom.com/wiki/Thrown_Attack "Thrown Attack") **Thrown**, or [Fire Breath](https://masterofmagic.fandom.com/wiki/Fire_Breath "Fire Breath") **Fire Breath**). The unofficial [Insecticide](https://masterofmagic.fandom.com/wiki/Insecticide "Insecticide") patch changes this behaviour to add this hidden modifier to [Thrown Attack](https://masterofmagic.fandom.com/wiki/Thrown_Attack "Thrown Attack") **Thrown** attacks as well (also applies to the higher quality weapons), but not to the other two attack types.

Units created by a [Wizard](https://masterofmagic.fandom.com/wiki/Wizard "Wizard") with the [Alchemy](https://masterofmagic.fandom.com/wiki/Alchemy_(Retort) "Alchemy (Retort)") retort, and units created in a town with an [Alchemists' Guild](https://masterofmagic.fandom.com/wiki/Alchemists%27_Guild "Alchemists' Guild"), will possess magical weapons by default. However, this can be overridden by the special materials listed below.

### Mithril Weapons

The icons [Icon Melee Mithril](https://static.wikia.nocookie.net/masterofmagic/images/6/69/Icon_Melee_Mithril.png/revision/latest?cb=20120103212637), [Icon Melee Mithril Gold](https://static.wikia.nocookie.net/masterofmagic/images/c/c8/Icon_Melee_Mithril_Gold.png/revision/latest?cb=20150104005141), [Icon Melee Mithril Lost](https://static.wikia.nocookie.net/masterofmagic/images/3/31/Icon_Melee_Mithril_Lost.png/revision/latest?cb=20150104005226), and [Icon Melee Mithril Gold Lost](https://static.wikia.nocookie.net/masterofmagic/images/c/c5/Icon_Melee_Mithril_Gold_Lost.png/revision/latest?cb=20150104005159) represent mithril arms and armor. In addition to providing the same (hidden) [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit** bonus that magical weapons do (see above), mithril armaments also grant a +1 bonus to the unit’s **Attack Strength** and [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense**. The **Attack Strength** benefit applies to all attacks made with weapons: it affects [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") **Melee**, [Ranged Missile Attack](https://masterofmagic.fandom.com/wiki/Ranged_Missile_Attack "Ranged Missile Attack") **Missile**, [Ranged Boulder Attack](https://masterofmagic.fandom.com/wiki/Ranged_Boulder_Attack "Ranged Boulder Attack") **Boulder**, and [Thrown Attack](https://masterofmagic.fandom.com/wiki/Thrown_Attack "Thrown Attack") **Thrown** Attacks (for which there is still no [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit** bonus in v1.31); but does not benefit [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **Magical** Ranged Attacks or [Fire Breath](https://masterofmagic.fandom.com/wiki/Fire_Breath "Fire Breath") **Fire Breath**.
As noted in the previous sections, units with a 0 base Attack Strength
will not receive the corresponding enhancement (but will still gain the
increased [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense**).

Two criteria need to be met for a unit to be created with mithril weaponry: the town in which it is produced must have an [Alchemists' Guild](https://masterofmagic.fandom.com/wiki/Alchemists%27_Guild "Alchemists' Guild"); and its catchment area must contain a tile with the [Mithril Ore](https://masterofmagic.fandom.com/wiki/Mithril_Ore "Mithril Ore") resource. Furthermore, this bonus does not stack with the next one, Adamantium, and will instead be overwritten by it.

The option to use special materials for crafting the equipment of [Normal Units](https://masterofmagic.fandom.com/wiki/Normal_Unit "Normal Unit")
is only available to those races that can build an Alchemists' Guild.
No other unit can ever have Mithril or Adamantium weapons. On the other
hand, magical weapons may be available to any race, as it is one of the
perks granted by the [Alchemy](https://masterofmagic.fandom.com/wiki/Alchemy_(Retort) "Alchemy (Retort)")
retort. The retort does not, however, function as an Alchemists Guild,
and does not allow the use of special materials for weaponry even if the
required resource is present near a [Town](https://masterofmagic.fandom.com/wiki/Town "Town").

The requirements for using these metals is checked at the time
the unit’s production is finished. Thus, if the Alchemists Guild is
destroyed in the meantime, the unit will be created with [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") **normal** weapons instead. The same thing will happen if the resource itself is destroyed (by [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Raise Volcano](https://masterofmagic.fandom.com/wiki/Raise_Volcano "Raise Volcano")**), [Nature](https://masterofmagic.fandom.com/wiki/Nature "Nature")**[Transmuted](https://masterofmagic.fandom.com/wiki/Transmute "Transmute")** (only applicable to Mithril Ore), or the tile containing it falls prey to [Corruption](https://masterofmagic.fandom.com/wiki/Corruption "Corruption"). The destruction (by [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Raise Volcano](https://masterofmagic.fandom.com/wiki/Raise_Volcano "Raise Volcano")**) of resources is unfortunately irreversible in game version 1.31, which significantly increases their strategic value.

### Adamantium Weapons

The highest quality weapons in the game are made out of Adamantium, and are represented by the [Icon Melee Adamantium](https://static.wikia.nocookie.net/masterofmagic/images/5/5e/Icon_Melee_Adamantium.png/revision/latest?cb=20120103212641), [Icon Melee Adamantium Gold](https://static.wikia.nocookie.net/masterofmagic/images/3/37/Icon_Melee_Adamantium_Gold.png/revision/latest?cb=20150104003923), [Icon Melee Adamantium Lost](https://static.wikia.nocookie.net/masterofmagic/images/f/fd/Icon_Melee_Adamantium_Lost.png/revision/latest?cb=20150104004453), and [Icon Melee Adamantium Gold Lost](https://static.wikia.nocookie.net/masterofmagic/images/8/80/Icon_Melee_Adamantium_Gold_Lost.png/revision/latest?cb=20150104004212) icons. They provide the same (hidden) [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit** bonus as the previous two weapon types. In addition, just like Mithril, they also increase both the **Attack Strength** and [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense** of their wielder, except the magnitude of these bonuses is **+2**
for Adamantium. In all other respects the enhancements are identical,
and Adamantium overrides Mithril in those cases where both would be
available.

The criteria for creating units with Adamantium equipment is also similar: the town in which the unit is created must have an [Alchemists' Guild](https://masterofmagic.fandom.com/wiki/Alchemists%27_Guild "Alchemists' Guild"), and its catchment area must contain a tile with the [Adamantium Ore](https://masterofmagic.fandom.com/wiki/Adamantium_Ore "Adamantium Ore") resource. The rules regarding the removal of either criteria are also the same as described above.

## Ranged Attack Strength

[Ranged Attacks](https://masterofmagic.fandom.com/wiki/Ranged_Attack "Ranged Attack")
are the second most common type of attack in the game. They are
sub-divided into three categories, each with their own perks and
conditional modifiers. Each of these (and the three [Special Attacks](https://masterofmagic.fandom.com/wiki/Special_Attack "Special Attack")
below them) are mutually exclusive due to technical reasons (their
strength and type are stored in the same variables by the game). Thus,
no unit can have more than one type of ranged attack.

**Ranged Attack strength** is displayed as a separate
attribute in the unit statistics window, with its own dedicated row of
icons (or single icon and numeric value in the combat unit display).
However, in battle, this is only visible as long as the unit still has [Ability Ammunition](https://static.wikia.nocookie.net/masterofmagic/images/e/ed/Ability_Ammunition.png/revision/latest?cb=20140415211446) Ammunition left to fire. Once it is exhausted, **Ranged Attack Strength** will disappear from the unit for the remainder of the battle, and the rules for 0 base **Attack Strength** apply (the unit can’t make any more ranged attacks).

Weapon quality is not represented in the ranged icons, it has to
be deduced from the melee icons. Instead, the ranged icons depict the
Ranged Attack Type, in addition to using the same modified backgrounds
for base, enhanced, and weakened statistics, just like the other
attribute icons. However, for weapon-based ranged attacks, weapon
quality does apply, as noted in their sections below.

**Ranged Attack Strength** may be effectively negated by the [Invisibility](https://masterofmagic.fandom.com/wiki/Invisibility "Invisibility") [Invisibility](https://masterofmagic.fandom.com/wiki/Invisibility "Invisibility") effect, as no Ranged Attacks can be performed against an Invisible unit unless the ranged attacker has [Illusions Immunity](https://masterofmagic.fandom.com/wiki/Illusions_Immunity "Illusions Immunity") [Illusions Immunity](https://masterofmagic.fandom.com/wiki/Illusions_Immunity "Illusions Immunity"). The same is true for armies besieging a town with [Death](https://masterofmagic.fandom.com/wiki/Death "Death")**[Wall of Darkness](https://masterofmagic.fandom.com/wiki/Wall_of_Darkness "Wall of Darkness")**: no Ranged Attacks can be made against the units inside. In addition, the [Large Shield](https://masterofmagic.fandom.com/wiki/Large_Shield "Large Shield") [Large Shield](https://masterofmagic.fandom.com/wiki/Large_Shield "Large Shield") ability increases a target’s [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense** against all types of Ranged Attacks.

### Ranged Missile Attacks

**[Ranged Missile Attack](https://masterofmagic.fandom.com/wiki/Ranged_Missile_Attack "Ranged Missile Attack") Strength** is represented by a row of the bow icons: [Icon Ranged Bow](https://static.wikia.nocookie.net/masterofmagic/images/6/6c/Icon_Ranged_Bow.png/revision/latest?cb=20120103213237), [Icon Ranged Bow Gold](https://static.wikia.nocookie.net/masterofmagic/images/f/fc/Icon_Ranged_Bow_Gold.png/revision/latest?cb=20150104002026), [Icon Ranged Bow Lost](https://static.wikia.nocookie.net/masterofmagic/images/a/aa/Icon_Ranged_Bow_Lost.png/revision/latest?cb=20150104002128), and [Icon Ranged Bow Gold Lost](https://static.wikia.nocookie.net/masterofmagic/images/5/50/Icon_Ranged_Bow_Gold_Lost.png/revision/latest?cb=20150104002102). There is also one unit in the game (Halfling [Slingers](https://masterofmagic.fandom.com/wiki/Slingers "Slingers")) for whom this **Attack Strength**
is represented by the boulder icons instead (see the next section).
However, the Slingers’ attacks abide by the rules for Ranged Missile
attacks in every other respect.

Ranged Missile weapons benefit from all of the effects of the various weapon qualities, including increases to **Attack Strength** where applicable. However, Ranged Missile attacks also suffer [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit** penalties if the attack distance is more than 2 tiles, and units with [Missile Immunity](https://masterofmagic.fandom.com/wiki/Missile_Immunity "Missile Immunity") [Missile Immunity](https://masterofmagic.fandom.com/wiki/Missile_Immunity "Missile Immunity") defend against them as if they had [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **50**.

Many spells and abilities that affect **Melee Strength** also affect **Ranged Missile Attack Strength**. On the other hand, the [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Warp Wood](https://masterofmagic.fandom.com/wiki/Warp_Wood "Warp Wood")** spell is designed specifically for use against Ranged Missile attackers: it destroys all of their [Ability Ammunition](https://static.wikia.nocookie.net/masterofmagic/images/e/ed/Ability_Ammunition.png/revision/latest?cb=20140415211446) Ammunition, thus nullifying their **Ranged Attack Strength** completely.

### Ranged Boulder Attacks

**[Ranged Boulder Attack](https://masterofmagic.fandom.com/wiki/Ranged_Boulder_Attack "Ranged Boulder Attack") Strength** is represented by a row of the rock icons: [Icon Ranged Boulder](https://static.wikia.nocookie.net/masterofmagic/images/c/c8/Icon_Ranged_Boulder.png/revision/latest?cb=20120103213246), [Icon Ranged Boulder Gold](https://static.wikia.nocookie.net/masterofmagic/images/8/80/Icon_Ranged_Boulder_Gold.png/revision/latest?cb=20150104003445), [Icon Ranged Boulder Lost](https://static.wikia.nocookie.net/masterofmagic/images/1/10/Icon_Ranged_Boulder_Lost.png/revision/latest?cb=20150104003612), and [Icon Ranged Boulder Gold Lost](https://static.wikia.nocookie.net/masterofmagic/images/2/29/Icon_Ranged_Boulder_Gold_Lost.png/revision/latest?cb=20150104003550). The Ranged Missile strength of Halfling [Slingers](https://masterofmagic.fandom.com/wiki/Slingers "Slingers")
is also confusingly represented by these icons, however, their attacks
in fact use the rule set for Ranged Missiles (see above).

**Ranged Boulder Attack Strength** benefits from the enhancements granted by weapon quality, and these attacks suffer from [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit** reductions for distance, just like [Ranged Missile Attack](https://masterofmagic.fandom.com/wiki/Ranged_Missile_Attack "Ranged Missile Attack") **Missile** attacks. However, there are no immunities against this type of attack, and boulders are not subject to any spell affecting [Ability Ammunition](https://static.wikia.nocookie.net/masterofmagic/images/e/ed/Ability_Ammunition.png/revision/latest?cb=20140415211446) Ammunition either. Similarly, only a portion of the effects that apply to **Attack Strength** will affect Ranged Boulders, it is best to consult the relevant article or the table below to find out which ones do or do not.

### Ranged Magical Attacks

The longest range attacks in the game are performed by magic users. **[Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") Strength** is represented by a row of the fireball icons: [Icon Ranged Magic](https://static.wikia.nocookie.net/masterofmagic/images/1/11/Icon_Ranged_Magic.png/revision/latest?cb=20120103133448), [Icon Ranged Magic Gold](https://static.wikia.nocookie.net/masterofmagic/images/b/b0/Icon_Ranged_Magic_Gold.png/revision/latest?cb=20150104002201), [Icon Ranged Magic Lost](https://static.wikia.nocookie.net/masterofmagic/images/a/ab/Icon_Ranged_Magic_Lost.png/revision/latest?cb=20170514025831), and [Icon Ranged Magic Gold Lost](https://static.wikia.nocookie.net/masterofmagic/images/3/38/Icon_Ranged_Magic_Gold_Lost.png/revision/latest?cb=20150104002224). Throughout this wiki, the [Icon Ranged Magic](https://static.wikia.nocookie.net/masterofmagic/images/1/11/Icon_Ranged_Magic.png/revision/latest?cb=20120103133448) icon is also used to represent the **Attack Strength** of both spells, and certain abilities that execute spell-like attacks, all of which deal damage that is magical in nature.

**Magical Ranged Attack Strength** is *not* affected by weapon quality, but in turn the attacks suffer no penalties for range either. Most effects that increase **Attack Strength** are invalid with respect to **Ranged Magical Attack Strength**, making this the most difficult basic attack in the game to improve.

Units possessing [Magic Immunity](https://masterofmagic.fandom.com/wiki/Magic_Immunity "Magic Immunity") [Magic Immunity](https://masterofmagic.fandom.com/wiki/Magic_Immunity "Magic Immunity") defend against Ranged Magical attacks as if they had [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **50**. In addition, the spells [Nature](https://masterofmagic.fandom.com/wiki/Nature "Nature")**[Resist Elements](https://masterofmagic.fandom.com/wiki/Resist_Elements "Resist Elements")** and [Nature](https://masterofmagic.fandom.com/wiki/Nature "Nature")**[Elemental Armor](https://masterofmagic.fandom.com/wiki/Elemental_Armor "Elemental Armor")** grant a [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense** bonus against all Ranged Magical attacks except for those performed by [Zaldron the Sage](https://masterofmagic.fandom.com/wiki/Zaldron_the_Sage "Zaldron the Sage") and [Aerie the Illusionist](https://masterofmagic.fandom.com/wiki/Aerie_the_Illusionist "Aerie the Illusionist"). [Life](https://masterofmagic.fandom.com/wiki/Life "Life")**[Bless](https://masterofmagic.fandom.com/wiki/Bless "Bless")** and [Life](https://masterofmagic.fandom.com/wiki/Life "Life")**[Righteousness](https://masterofmagic.fandom.com/wiki/Righteousness "Righteousness")**
also affect a large portion of these attacks, with the latter providing
the same effect as Magic Immunity. To find out which attacks are
affected, please see the article on [Ranged Magical Attacks](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack#Ranged_Magical_Attack_Subtypes "Ranged Magical Attack").

Finally, the [Combat Enchantment](https://masterofmagic.fandom.com/wiki/Combat_Enchantment "Combat Enchantment") [Death](https://masterofmagic.fandom.com/wiki/Death "Death")**[Mana Leak](https://masterofmagic.fandom.com/wiki/Mana_Leak "Mana Leak")** has an adverse effect on all units possessing Ranged Magical attacks, as it decreases their [Ability Ammunition](https://static.wikia.nocookie.net/masterofmagic/images/e/ed/Ability_Ammunition.png/revision/latest?cb=20140415211446) Ammunition by one (or [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **Mana** by 5) every turn it is in effect, until the units run out completely (and thus be unable to perform any more ranged attacks).

## Short Range Attack Strength

There are three groups of [Unit Abilities](https://masterofmagic.fandom.com/wiki/Unit_Abilities "Unit Abilities") in the game that either use [Attack Rolls](https://masterofmagic.fandom.com/wiki/Attack_Roll "Attack Roll") to determine their [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **damage**, or have such a component that the entire ability depends on. Thus, **Attack Strength** is a relevant factor for all of these abilities. Indeed, many effects that increase or decrease a unit’s **Attack Strength** also affect one or more of these abilities in a similar way. Each group is discussed below separately.

### Thrown Attacks

There are exactly 7 units in the game that possess the [Thrown](https://masterofmagic.fandom.com/wiki/Thrown "Thrown") [Thrown](https://masterofmagic.fandom.com/wiki/Thrown "Thrown")
ability. This enables these units to execute a short-range attack every
time they initiate melee against an enemy unit. This only works during
the [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") sequence, and only when making voluntary attacks (i.e. is not executed during a [Counter Attack](https://masterofmagic.fandom.com/wiki/Counter_Attack "Counter Attack")). However, it does allow the unit to engage [Air Movement](https://masterofmagic.fandom.com/wiki/Air_Movement "Air Movement")**Flying** opponents in melee, and does not use ammunition like regular [Ranged Attacks](https://masterofmagic.fandom.com/wiki/Ranged_Attack "Ranged Attack").

The **Attack Strength**
of the Thrown ability is listed as a numerical value after the name of
the ability in the unit statistics window. Throughout this wiki, the [Thrown Attack](https://masterofmagic.fandom.com/wiki/Thrown_Attack "Thrown Attack") icon is also used to represent [Thrown Attacks](https://masterofmagic.fandom.com/wiki/Thrown_Attack "Thrown Attack") and their **Attack Strength**,
in an attempt to signify the similarities between them and other attack
types. Thrown attacks are not shown in the combat unit display in
battle.

In the vanilla 1.31 game version, Thrown Attacks are partially affected by weapon quality: they do not get any [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit** bonus, but do benefit from increases to **Attack Strength** (i.e. from [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") **Mithril** and [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") **Adamantium** equipment). This is changed in the [unofficial 1.40](https://masterofmagic.fandom.com/wiki/Insecticide "Insecticide") and [later](https://masterofmagic.fandom.com/wiki/Unofficial_Patch_1.50 "Unofficial Patch 1.50") patches; players using these will find that Thrown Attacks now receive the full benefits of weapon quality.

Many other effects also affect Thrown Attacks, but there are none
that are tailored towards them specifically. However, it is worth
noting that [Heroes](https://masterofmagic.fandom.com/wiki/Hero "Hero") wielding an [Axe](https://masterofmagic.fandom.com/wiki/Axe "Axe") are able to apply most of the weapon’s effects (with the exception of any [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit**
bonus, unless one of the unofficial patches is in use) to their Thrown
Attacks in addition to their Melee Attacks. This does mean that any **Attack Strength**
bonus granted by such an Axe will also apply to the Thrown ability, and
is not the case if the Hero wields any other type of weapon.

Thrown Attacks are not affected by either [Weapon Immunity](https://masterofmagic.fandom.com/wiki/Weapon_Immunity "Weapon Immunity") Weapon, [Missile Immunity](https://masterofmagic.fandom.com/wiki/Missile_Immunity "Missile Immunity") Missile, or [Magic Immunity](https://masterofmagic.fandom.com/wiki/Magic_Immunity "Magic Immunity") Magic Immunity. The only conditional effect that does offer some protection against them is the [Large Shield](https://masterofmagic.fandom.com/wiki/Large_Shield "Large Shield") Large Shield ability (although in the [1.50](https://masterofmagic.fandom.com/wiki/Unofficial_Patch_1.50 "Unofficial Patch 1.50") or later patches [Weapon Immunity](https://masterofmagic.fandom.com/wiki/Weapon_Immunity "Weapon Immunity") also protects against Thrown Attacks made without magical weapons).

### Breath Attacks

There are two different types of [Breath Attacks](https://masterofmagic.fandom.com/wiki/Breath_Attack "Breath Attack") in Master of Magic, granted by the abilities [Fire Breath](https://masterofmagic.fandom.com/wiki/Fire_Breath "Fire Breath") [Fire Breath](https://masterofmagic.fandom.com/wiki/Fire_Breath "Fire Breath") and [Lightning Breath](https://masterofmagic.fandom.com/wiki/Lightning_Breath "Lightning Breath") [Lightning Breath](https://masterofmagic.fandom.com/wiki/Lightning_Breath "Lightning Breath") respectively. 12 units possess one of these by default, but Fire Breath may also be conferred onto any normal unit by the [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Chaos Channels](https://masterofmagic.fandom.com/wiki/Chaos_Channels "Chaos Channels")**
spell. The only limitation is that the unit can not have a default
ranged or breath attack already, and Fire Breath is only one of three
effects that are chosen randomly. As noted below however, this type is
Breath Attack is significantly different than the innate ones with
respect to its **Attack Strength**.

The **Attack Strength**
of any Breath Attack is displayed as a numeric value after the name of
the ability in the unit statistics window. It is not shown at all in the
combat unit display during battles. On this wiki the [Icon Breath](https://static.wikia.nocookie.net/masterofmagic/images/7/7a/Icon_Breath.png/revision/latest?cb=20120826153701) icon is also used to represent Breath Attacks, their respective **Attack Strength**, or modifiers thereof. The [Icon Breath Lightning](https://static.wikia.nocookie.net/masterofmagic/images/b/bd/Icon_Breath_Lightning.png/revision/latest?cb=20120824223647) icon may also be used, however, there is only a single creature in the game that can ever have a Lightning Breath attack.

Breath Attacks are short range attacks that can only be performed by a unit when it is initiating a [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack"). They are not executed on [Counter Attacks](https://masterofmagic.fandom.com/wiki/Counter_Attack "Counter Attack"). However, there are otherwise no limits to their use, and they also enable [Ground Movement](https://masterofmagic.fandom.com/wiki/Ground_Movement "Ground Movement")**Ground**  units to engage [Air Movement](https://masterofmagic.fandom.com/wiki/Air_Movement "Air Movement")**Flying** enemies in melee combat.

Breath Attacks are not affected by weapon quality at all, and most effects that enhance **Attack Strength** are also invalid for them (with [Experience](https://masterofmagic.fandom.com/wiki/Experience "Experience") **Experience Levels** being the most notable exception in the case or [Normal Units](https://masterofmagic.fandom.com/wiki/Normal_Unit "Normal Unit") and [Heroes](https://masterofmagic.fandom.com/wiki/Hero "Hero")). They are considered a magical source of damage, and units possessing the [Life](https://masterofmagic.fandom.com/wiki/Life "Life")**[Righteousness](https://masterofmagic.fandom.com/wiki/Righteousness "Righteousness")** or [Magic Immunity](https://masterofmagic.fandom.com/wiki/Magic_Immunity "Magic Immunity") Magic Immunity effects defend against them as if they had [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **50**. The conditional effects of [Life](https://masterofmagic.fandom.com/wiki/Life "Life")**[Bless](https://masterofmagic.fandom.com/wiki/Bless "Bless")**, [Nature](https://masterofmagic.fandom.com/wiki/Nature "Nature")**[Resist Elements](https://masterofmagic.fandom.com/wiki/Resist_Elements "Resist Elements")**, [Nature](https://masterofmagic.fandom.com/wiki/Nature "Nature")**[Elemental Armor](https://masterofmagic.fandom.com/wiki/Elemental_Armor "Elemental Armor")**, and [Large Shield](https://masterofmagic.fandom.com/wiki/Large_Shield "Large Shield") Large Shield also apply against all Breath Attacks.

Fire Breath additionally triggers a defender’s [Fire Immunity](https://masterofmagic.fandom.com/wiki/Fire_Immunity "Fire Immunity") [Fire Immunity](https://masterofmagic.fandom.com/wiki/Fire_Immunity "Fire Immunity") if it possesses this ability (granting it the same [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **50** that similar immunities do), however, Lightning Breath is not affected by this. In addition, Lightning Breath is [Armor-Piercing](https://masterofmagic.fandom.com/wiki/Armor_Piercing_Damage "Armor Piercing Damage"), meaning that it halves the defender’s [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense** score before the [Defense Roll](https://masterofmagic.fandom.com/wiki/Defense_Roll "Defense Roll") **Defense Roll** is made. This happens after other modifiers are taken into account, but before immunities: thus the [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **50** effects are unaffected, but in lieu of these, the total [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense** is halved. [City Walls](https://masterofmagic.fandom.com/wiki/City_Walls "City Walls"), if any, also grant their full bonus despite this attribute.

#### Chaos Channels Fire Breath

The [Fire Breath](https://masterofmagic.fandom.com/wiki/Fire_Breath "Fire Breath") Fire Breath granted by the [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Chaos Channels](https://masterofmagic.fandom.com/wiki/Chaos_Channels "Chaos Channels")**
spell is actually not identical to the innate ability possessed
naturally by units. Although the mechanics of the attack are the same,
the **Attack Strength** of this type of Breath Attack is not improved by any effect that would benefit regular Fire Breath.

In fact, in version 1.31 of the game, *no modifiers to **Attack Strength***, whether positive or negative, will ever apply to this type of Breath Attack. However, [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit** modifiers valid for [Fire Breath](https://masterofmagic.fandom.com/wiki/Fire_Breath "Fire Breath") **Breath Attacks** do work, and may still improve (or reduce) the average damage output.

In games without the unofficial [1.40](https://masterofmagic.fandom.com/wiki/Insecticide "Insecticide") patch, this Fire Breath effect also overrides any natural [Thrown](https://masterofmagic.fandom.com/wiki/Thrown "Thrown") Thrown ability that the target may possess, which is almost always a bad trade-off.

### Gaze Attacks

[Gaze Attacks](https://masterofmagic.fandom.com/wiki/Gaze_Attack "Gaze Attack") are peculiar short range abilities that are either [Resistance](https://masterofmagic.fandom.com/wiki/Resistance "Resistance") **Resistance**-
based effects, or ignore the target’s defenses entirely. However, due to
their technical implementation, they actually rely on a physical attack
for their effects to trigger at all, much like the added effects of [Touch Attacks](https://masterofmagic.fandom.com/wiki/Touch_Attack "Touch Attack"). For the [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Chaos Spawn](https://masterofmagic.fandom.com/wiki/Chaos_Spawn "Chaos Spawn")**, this can be accomplished by its [Doom Gaze](https://masterofmagic.fandom.com/wiki/Doom_Gaze "Doom Gaze") [Doom Gaze](https://masterofmagic.fandom.com/wiki/Doom_Gaze "Doom Gaze"); but for units with single gaze abilities, the developers have decided to add an otherwise *hidden short range attack* to achieve this.

Gaze Attacks may be performed during any kind of melee
engagement, regardless of whether the unit is initiating or countering
such an attack. However, the timing is slightly different between the
two, and the attacking unit always gets to perform its short range
attack (if any), before the defender can use its Gaze Attack(s).

Gaze Attacks can be used by [Ground Movement](https://masterofmagic.fandom.com/wiki/Ground_Movement "Ground Movement")**Ground** units to engage [Air Movement](https://masterofmagic.fandom.com/wiki/Air_Movement "Air Movement")**Flying**
opponents in melee, and have no limit on the amount of times they can
be used in a battle. However, unlike every other Attack Type, they may
not be performed twice during a single run of the attack sequence as a
result of the [Sorcery](https://masterofmagic.fandom.com/wiki/Sorcery "Sorcery")**[Haste](https://masterofmagic.fandom.com/wiki/Haste "Haste")** spell.

There are only 4 units in the game that possess a Gaze Attack,
and such an attack can not be added to other units via magic spells
either. [Death](https://masterofmagic.fandom.com/wiki/Death "Death")**[Night Stalkers](https://masterofmagic.fandom.com/wiki/Night_Stalker "Night Stalker")** have a [Death Gaze](https://masterofmagic.fandom.com/wiki/Death_Gaze "Death Gaze") [Death Gaze](https://masterofmagic.fandom.com/wiki/Death_Gaze "Death Gaze"), [Nature](https://masterofmagic.fandom.com/wiki/Nature "Nature")**[Basilisks](https://masterofmagic.fandom.com/wiki/Basilisk "Basilisk")** and [Nature](https://masterofmagic.fandom.com/wiki/Nature "Nature")**[Gorgons](https://masterofmagic.fandom.com/wiki/Gorgons "Gorgons")** have a [Stoning Gaze](https://masterofmagic.fandom.com/wiki/Stoning_Gaze "Stoning Gaze") [Stoning Gaze](https://masterofmagic.fandom.com/wiki/Stoning_Gaze "Stoning Gaze"), and [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Chaos Spawns](https://masterofmagic.fandom.com/wiki/Chaos_Spawn "Chaos Spawn")** have both of these with an additional [Doom Gaze](https://masterofmagic.fandom.com/wiki/Doom_Gaze "Doom Gaze") Doom Gaze. This last ability also enables the other gaze effects to be used as added effects with it, and has a base **Attack Strength** of **4**. However, for all of the other units, Gaze Attacks are implemented through a hidden short range attack that has a base **Attack Strength** of only **1**.

The existence of this undocumented attack has several
consequences, the most important being that it provides a method to
disable the associated gaze effect completely by way of reducing the
ranged **Attack Strength** to
0. This is not necessarily an easy task though, as there are only a
handful of effects that allow this value to be modified. This is also
the reason why this attack goes mostly unnoticed, it is just as
difficult to raise its strength, this circumstance being mostly limited
to battles in, or around, Magic [Nodes](https://masterofmagic.fandom.com/wiki/Node "Node").

The [Unofficial Patch 1.50](https://masterofmagic.fandom.com/wiki/Unofficial_Patch_1.50 "Unofficial Patch 1.50") also removes this particular consequence. In games played with this patch, Gaze and [Touch Attack](https://masterofmagic.fandom.com/wiki/Touch_Attack "Touch Attack") effects are no longer disabled if the relevant **Attack Strength** is 0, which may make it significantly less useful to apply negative modifiers to this attribute.

There are only 3 spells capable of reducing a **Gaze Attack Strength**: [Sorcery](https://masterofmagic.fandom.com/wiki/Sorcery "Sorcery")**[Mind Storm](https://masterofmagic.fandom.com/wiki/Mind_Storm "Mind Storm")** (a single target spell that can not be cast on units with [Illusions Immunity](https://masterofmagic.fandom.com/wiki/Illusions_Immunity "Illusions Immunity") Illusions Immunity), [Death](https://masterofmagic.fandom.com/wiki/Death "Death")**[Black Prayer](https://masterofmagic.fandom.com/wiki/Black_Prayer "Black Prayer")** (a [Combat Enchantment](https://masterofmagic.fandom.com/wiki/Combat_Enchantment "Combat Enchantment") affecting all enemy units), and [Life](https://masterofmagic.fandom.com/wiki/Life "Life")**[True Light](https://masterofmagic.fandom.com/wiki/True_Light "True Light")** (a Combat Enchantment hindering only [Death](https://masterofmagic.fandom.com/wiki/Death "Death")**Death**
creatures). Night Stalkers may be affected by the last two spells,
whereas the other Gaze Attack units can only fall prey to the first two
effects. However, their hidden attacks may also be enhanced by Node
Auras, which will never affect the Night Stalker.

It is also possible to create or encounter [Undead](https://masterofmagic.fandom.com/wiki/Undead "Undead")
versions of all Gaze Attack creatures except the Night Stalker. These
monsters no longer benefit from their respective Node Auras (or [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Chaos Surge](https://masterofmagic.fandom.com/wiki/Chaos_Surge "Chaos Surge")**
in the case of Undead Chaos Spawns), and will instead be affected by
the same spells and effects that work on Night Stalkers. In addition,
they may also benefit from [Death](https://masterofmagic.fandom.com/wiki/Death "Death")**[Black Channels](https://masterofmagic.fandom.com/wiki/Black_Channels "Black Channels")**.

Enhancing the hidden attack of the Night Stalker or the Basilisk can only be marginally useful, as both of them are [Figure](https://masterofmagic.fandom.com/wiki/Figure#Single-Figure_Units "Figure") **Single-figure** units, and the achievable increase is minimal in comparison to their base damage. On the other hand, Gorgons have [Figure](https://masterofmagic.fandom.com/wiki/Figure#Multi-Figure_Units "Figure") **4 Figures** and a formidable [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit** bonus to begin with, and the Chaos Spawn’s [Doom Gaze](https://masterofmagic.fandom.com/wiki/Doom_Gaze "Doom Gaze") Doom Gaze does damage that can not be blocked; both of which present opportunities for meaningful enhancement.

Node Auras ([Nature](https://masterofmagic.fandom.com/wiki/Nature "Nature")**Nature** for Basilisks and Gorgons, and [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**Chaos** for Chaos Spawns) can increase the **Attack Strength** of both the hidden short range attacks and the Doom Gaze. The [Global Enchantment](https://masterofmagic.fandom.com/wiki/Global_Enchantment "Global Enchantment") [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Chaos Surge](https://masterofmagic.fandom.com/wiki/Chaos_Surge "Chaos Surge")** also benefits the Doom Gaze. Finally, as mentioned above, [Death](https://masterofmagic.fandom.com/wiki/Death "Death")**[Black Channels](https://masterofmagic.fandom.com/wiki/Black_Channels "Black Channels")** may be used on the Undead versions of these units, along with [Death](https://masterofmagic.fandom.com/wiki/Death "Death")**[Darkness](https://masterofmagic.fandom.com/wiki/Darkness "Darkness")**
and its overland equivalents. Unlike Node Auras, these spells are not
limited to specific map tiles, and the combination of the two provides
the same level of enhancement.

In terms of a target's conditional [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense** modifiers, the hidden short range components are treated as equivalents to [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **Magical Ranged Attacks** associated with the [Realm](https://masterofmagic.fandom.com/wiki/Realm "Realm") that the ability itself belongs to. [Stoning Gaze](https://masterofmagic.fandom.com/wiki/Stoning_Gaze "Stoning Gaze") Stoning Gaze is [Nature](https://masterofmagic.fandom.com/wiki/Nature "Nature")**Nature**, [Death Gaze](https://masterofmagic.fandom.com/wiki/Death_Gaze "Death Gaze") Death Gaze is [Death](https://masterofmagic.fandom.com/wiki/Death "Death")**Death**, and [Doom Gaze](https://masterofmagic.fandom.com/wiki/Doom_Gaze "Doom Gaze") Doom Gaze is [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**Chaos**, albeit this last one is meaningless here as its [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **damage** can not be blocked or reduced by any effect, conditional or otherwise (unless the **Attack Strength** itself is reduced). [Nature](https://masterofmagic.fandom.com/wiki/Nature "Nature")**[Resist Elements](https://masterofmagic.fandom.com/wiki/Resist_Elements "Resist Elements")** and [Nature](https://masterofmagic.fandom.com/wiki/Nature "Nature")**[Elemental Armor](https://masterofmagic.fandom.com/wiki/Elemental_Armor "Elemental Armor")** work against the hidden component of Stoning Gaze; [Life](https://masterofmagic.fandom.com/wiki/Life "Life")**[Bless](https://masterofmagic.fandom.com/wiki/Bless "Bless")** and [Life](https://masterofmagic.fandom.com/wiki/Life "Life")**[Righteousness](https://masterofmagic.fandom.com/wiki/Righteousness "Righteousness")** are triggered by that of Death Gaze; and [Large Shield](https://masterofmagic.fandom.com/wiki/Large_Shield "Large Shield") Large Shield and [Magic Immunity](https://masterofmagic.fandom.com/wiki/Magic_Immunity "Magic Immunity") Magic Immunity protect against both.

It should be noted here that the undocumented attack does not actually have to do [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **damage** for the Gaze Attacks to work, it must simply be *capable* of doing so by having an **Attack Strength** of at least **1**. That is, of course, unless the patch mentioned above is in play, in which case the Gaze effect will trigger either way.

Another side effect of the hidden short range attack is that it can be used to deliver [Touch Attacks](https://masterofmagic.fandom.com/wiki/Touch_Attack "Touch Attack"). The Chaos Spawn even has a [Poison Touch](https://masterofmagic.fandom.com/wiki/Poison_Touch "Poison Touch") Poison Touch by default. Otherwise, the [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Immolation](https://masterofmagic.fandom.com/wiki/Immolation "Immolation")** spell can be used on any of these units to empower them with an [Area Damage](https://masterofmagic.fandom.com/wiki/Area_Damage "Area Damage") Touch Attack. This plays onto the strength of Gaze Attacks as it is a [Physical Damage](https://masterofmagic.fandom.com/wiki/Physical_Damage "Physical Damage") component (i.e. [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense**-based), that is also more effective against [Figure](https://masterofmagic.fandom.com/wiki/Figure#Multi-Figure_Units "Figure") **Multi-figure** units, just like the Gaze Attack effects. However, this again does not apply with [patch 1.50](https://masterofmagic.fandom.com/wiki/Unofficial_Patch_1.50 "Unofficial Patch 1.50"), as it disables the execution of the [Immolation](https://masterofmagic.fandom.com/wiki/Immolation "Immolation") [Immolation](#Immolation) effect on all types of ranged attacks (including short range).

## Spell Attack Strength

Direct damage spells are also considered a form of attack and follow the same rules for dealing their [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **damage**. Their **Attack Strength**
is listed only in their descriptions, help texts, and documentation
accompanying the game (a table is also provided below). On this wiki,
the flaming ball icon of Magical Ranged Attacks ([Icon Ranged Magic](https://static.wikia.nocookie.net/masterofmagic/images/1/11/Icon_Ranged_Magic.png/revision/latest?cb=20120103133448)) is generally used to represent a spell’s **Attack Strength**.

Direct damage spells can be divided into two general groups based on whether they deal "single target" or [Area Damage](https://masterofmagic.fandom.com/wiki/Area_Damage "Area Damage"). Attack and Defense Rolls are handled differently by the two groups, and the meaning of **Attack Strength** is extended for Area Damage attacks.

### Single Target Spells

Single target damage spells follow the same principle as conventional melee and ranged attacks. That is, [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **damage** is applied to the [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") **Figures** in the target unit one after another, with a new [Defense Roll](https://masterofmagic.fandom.com/wiki/Defense_Roll "Defense Roll") **Defense Roll** being made every time the unit loses a full [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") **Figure**’s worth of [Hit Points](https://masterofmagic.fandom.com/wiki/Hit_Points "Hit Points") **Hit Points**.

Many of these spells can be infused with extra [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **Mana** at the time of casting to drastically improve their **Attack Strength**.
How much extra power can be gained depends on the spell, but the
general formula is that 5 times the spell’s basic cost can be spent on
casting it in total (i.e. 4 times the base cost can be used to enhance).
However, not all direct damage spells convert [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **Mana** into **Attack Strength** at the same rate, as noted in the table below.

All direct damage spells are blocked by [Magic Immunity](https://masterofmagic.fandom.com/wiki/Magic_Immunity "Magic Immunity") [Magic Immunity](https://masterofmagic.fandom.com/wiki/Magic_Immunity "Magic Immunity"), units possessing this ability from any source will never take any [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **spell damage**. The [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense** bonus of the [Large Shield](https://masterofmagic.fandom.com/wiki/Large_Shield "Large Shield")
Large Shield ability also indiscriminately applies against all attacks
made by spells. There are also further conditional effects that may or
may not apply, usually depending on the realm of the offensive spell. On
the other hand, some of these spells have an added effect (or tandem [Damage Type](https://masterofmagic.fandom.com/wiki/Damage_Type "Damage Type")), that may temporarily reduce or entirely negate the target’s [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense** score while processing their damage.

| Spell | Type | Target | Cost | Base | Infuse | Max | Tandem | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [Life](https://masterofmagic.fandom.com/wiki/Life "Life")**[Star Fires](https://masterofmagic.fandom.com/wiki/Star_Fires "Star Fires")** | [Combat Instant](https://masterofmagic.fandom.com/wiki/Combat_Instant "Combat Instant") | 1 Unit | [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **5** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **15** | No | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **15** | None | Only affects [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**Chaos** and [Death](https://masterofmagic.fandom.com/wiki/Death "Death")**Death** targets |
| [Nature](https://masterofmagic.fandom.com/wiki/Nature "Nature")**[Call Lightning](https://masterofmagic.fandom.com/wiki/Call_Lightning "Call Lightning")** | [Combat Enchant](https://masterofmagic.fandom.com/wiki/Combat_Enchantment "Combat Enchantment") | Random enemies | [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **60** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **8** | No | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **40**\* | [Armor- Piercing](https://masterofmagic.fandom.com/wiki/Armor_Piercing_Damage "Armor Piercing Damage") | - 3-5 bolts strike random enemies each turn - [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense** is halved |
| [Nature](https://masterofmagic.fandom.com/wiki/Nature "Nature")**[Ice Bolt](https://masterofmagic.fandom.com/wiki/Ice_Bolt "Ice Bolt")** | [Combat Instant](https://masterofmagic.fandom.com/wiki/Combat_Instant "Combat Instant") | 1 Unit | [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **10** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **5** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **1** / [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **1** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **45** | None | [Cold Damage](https://masterofmagic.fandom.com/wiki/Cold_Damage "Cold Damage") |
| [Sorcery](https://masterofmagic.fandom.com/wiki/Sorcery "Sorcery")**[Psionic Blast](https://masterofmagic.fandom.com/wiki/Psionic_Blast "Psionic Blast")** | [Combat Instant](https://masterofmagic.fandom.com/wiki/Combat_Instant "Combat Instant") | 1 Unit | [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **10** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **5** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **1** / [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **2** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **25** | [Illusion](https://masterofmagic.fandom.com/wiki/Illusion_Damage "Illusion Damage") | No [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense** unless [Illusions Immunity](https://masterofmagic.fandom.com/wiki/Illusions_Immunity "Illusions Immunity") [Illusions Immunity](https://masterofmagic.fandom.com/wiki/Illusions_Immunity "Illusions Immunity") |
| [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Call Chaos](https://masterofmagic.fandom.com/wiki/Call_Chaos "Call Chaos")** | [Combat Instant](https://masterofmagic.fandom.com/wiki/Combat_Instant "Combat Instant") | Random enemies | [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **75** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **15** | No | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **15** | None | This is the [Fire Bolt](https://masterofmagic.fandom.com/wiki/Fire_Bolt "Fire Bolt") effect, [Doom Bolt](https://masterofmagic.fandom.com/wiki/Doom_Bolt "Doom Bolt") and [Warp Lightning](https://masterofmagic.fandom.com/wiki/Warp_Lightning "Warp Lightning") match the identical spells |
| [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Call the Void](https://masterofmagic.fandom.com/wiki/Call_the_Void "Call the Void")** | [Town Instant](https://masterofmagic.fandom.com/wiki/Instant_Spell "Instant Spell") | 1 Town | [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **500** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **10** | No | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **10** | [Doom Damage](https://masterofmagic.fandom.com/wiki/Doom_Damage "Doom Damage") | - Unblockable except by immunities - All units in the town are hit |
| [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Chaos Rift](https://masterofmagic.fandom.com/wiki/Chaos_Rift "Chaos Rift")** | [Town Enchant](https://masterofmagic.fandom.com/wiki/Town_Enchantment "Town Enchantment") | 1 Town | [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **300** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **8** | No | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **40**\* | [Armor- Piercing](https://masterofmagic.fandom.com/wiki/Armor_Piercing_Damage "Armor Piercing Damage") | - 5 bolts strike random units each turn - [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense** is halved |
| [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Doom Bolt](https://masterofmagic.fandom.com/wiki/Doom_Bolt "Doom Bolt")** | [Combat Instant](https://masterofmagic.fandom.com/wiki/Combat_Instant "Combat Instant") | 1 Unit | [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **40** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **10** | No | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **10** | [Doom Damage](https://masterofmagic.fandom.com/wiki/Doom_Damage "Doom Damage") | Unblockable except by immunities |
| [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Fire Bolt](https://masterofmagic.fandom.com/wiki/Fire_Bolt "Fire Bolt")** | [Combat Instant](https://masterofmagic.fandom.com/wiki/Combat_Instant "Combat Instant") | 1 Unit | [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **5** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **5** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **1** / [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **1** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **25** | None | [Fire Damage](https://masterofmagic.fandom.com/wiki/Fire_Damage "Fire Damage") |
| [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Lightning Bolt](https://masterofmagic.fandom.com/wiki/Lightning_Bolt "Lightning Bolt")** | [Combat Instant](https://masterofmagic.fandom.com/wiki/Combat_Instant "Combat Instant") | 1 Unit | [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **10** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **5** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **1** / [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **1** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **45** | [Armor- Piercing](https://masterofmagic.fandom.com/wiki/Armor_Piercing_Damage "Armor Piercing Damage") | [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense** is halved |
| [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Magic Vortex](https://masterofmagic.fandom.com/wiki/Magic_Vortex "Magic Vortex")** (1) | [Combat Special](https://masterofmagic.fandom.com/wiki/Combat_Instant "Combat Instant") | Random units | [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **50** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **5** | No | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **5** | [Doom Damage](https://masterofmagic.fandom.com/wiki/Doom_Damage "Doom Damage") | - When the Vortex moves over a unit - Unblockable except by immunities |
| [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Magic Vortex](https://masterofmagic.fandom.com/wiki/Magic_Vortex "Magic Vortex")** (2) | [Combat Special](https://masterofmagic.fandom.com/wiki/Combat_Instant "Combat Instant") | Random units | [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **50** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **5** | No | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **5** | [Armor- Piercing](https://masterofmagic.fandom.com/wiki/Armor_Piercing_Damage "Armor Piercing Damage") | - 33% chance when the Vortex moves *next to* a unit - [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense** is halved |
| [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Warp Lightning](https://masterofmagic.fandom.com/wiki/Warp_Lightning "Warp Lightning")** | [Combat Instant](https://masterofmagic.fandom.com/wiki/Combat_Instant "Combat Instant") | 1 Unit | [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **35** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **10** | No | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **55**\* | [Armor- Piercing](https://masterofmagic.fandom.com/wiki/Armor_Piercing_Damage "Armor Piercing Damage") | - 10 attacks from [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **10** down to [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **1** - [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense** is halved |
| \* - *Total strength of multiple attacks. The highest single Attack Strength is the spell's listed Base strength.* | | | | | | | | |

### Area Damage Spells

[Area Damage](https://masterofmagic.fandom.com/wiki/Area_Damage "Area Damage")
spells differ from the previous group mainly in that they do not deal
damage in a linear fashion. Instead, an Area Damage attack uses its **Attack Strength** to make a separate [Attack Roll](https://masterofmagic.fandom.com/wiki/Attack_Roll "Attack Roll") against each and every [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") **Figure** of the target unit. The full **Attack Strength** is used for each of these attacks, meaning that the potential damage for these spells is multiplied by the amount of [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") **Figures** in the target unit. Naturally, Area Damage is quite dangerous to [Figure](https://masterofmagic.fandom.com/wiki/Figure#Multi-Figure_Units "Figure") **Multi-figure** units.

There are some caveats, however. Area Damage can not inflict more [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **damage** on a single [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") **Figure** than that [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") **Figure** has [Hit Points](https://masterofmagic.fandom.com/wiki/Hit_Points "Hit Points") **Hit Points**, including any [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **damage** previously suffered by it. This strictly limits the [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **damage** of these spells to the [Hit Points](https://masterofmagic.fandom.com/wiki/Hit_Points "Hit Points") **Hit Points** of the target unit. The [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") **Figures** also defend against the attacks individually, and each [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") **Figure** can use the full [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense** score of the unit, including all applicable modifiers.

There are only two types of Area Damage used by the game, and both have a respective immunity. [Immolation Damage](https://masterofmagic.fandom.com/wiki/Immolation_Damage "Immolation Damage") is the area version of [Fire Damage](https://masterofmagic.fandom.com/wiki/Fire_Damage "Fire Damage"), to which [Fire Immunity](https://masterofmagic.fandom.com/wiki/Fire_Immunity "Fire Immunity") [Fire Immunity](https://masterofmagic.fandom.com/wiki/Fire_Immunity "Fire Immunity") applies; while [Blizzard Damage](https://masterofmagic.fandom.com/wiki/Blizzard_Damage "Blizzard Damage") is the area version of [Cold Damage](https://masterofmagic.fandom.com/wiki/Cold_Damage "Cold Damage"), and triggers [Cold Immunity](https://masterofmagic.fandom.com/wiki/Cold_Immunity "Cold Immunity") [Cold Immunity](https://masterofmagic.fandom.com/wiki/Cold_Immunity "Cold Immunity"). Both of these effects grant [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **50** against their respective damage type. In addition, both types fulfil the conditions for the protection granted by [Nature](https://masterofmagic.fandom.com/wiki/Nature "Nature")**[Resist Elements](https://masterofmagic.fandom.com/wiki/Resist_Elements "Resist Elements")** and [Nature](https://masterofmagic.fandom.com/wiki/Nature "Nature")**[Elemental Armor](https://masterofmagic.fandom.com/wiki/Elemental_Armor "Elemental Armor")**.

These spells also deliver magical damage, which is nullified completely by [Magic Immunity](https://masterofmagic.fandom.com/wiki/Magic_Immunity "Magic Immunity") Magic Immunity. Against Immolation Damage, the [Unit Enchantment](https://masterofmagic.fandom.com/wiki/Unit_Enchantment "Unit Enchantment") [Life](https://masterofmagic.fandom.com/wiki/Life "Life")**[Righteousness](https://masterofmagic.fandom.com/wiki/Righteousness "Righteousness")** also provides the same effect. Both types can also be defended against with the [Large Shield](https://masterofmagic.fandom.com/wiki/Large_Shield "Large Shield") Large Shield ability, but [Life](https://masterofmagic.fandom.com/wiki/Life "Life")**[Bless](https://masterofmagic.fandom.com/wiki/Bless "Bless")** again only applies to Immolation Damage spells.

Finally, one of the spells delivering Immolation Damage, [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Fireball](https://masterofmagic.fandom.com/wiki/Fireball "Fireball")**, can also be infused with extra [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **Mana** to increase its **Attack Strength**, just like single target spells. All other Area Damage is of a fixed **Attack Strength** as noted in their descriptions and listed in the table below.

| Spell | Type | Target | Cost | Strength | Damage | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| [Nature](https://masterofmagic.fandom.com/wiki/Nature "Nature")**[Ice Storm](https://masterofmagic.fandom.com/wiki/Ice_Storm "Ice Storm")** | [Instant Spell](https://masterofmagic.fandom.com/wiki/Instant_Spell "Instant Spell") | 1 Tile | [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **200** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **6** | Cold | - |
| [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Fireball](https://masterofmagic.fandom.com/wiki/Fireball "Fireball")** | [Combat Instant](https://masterofmagic.fandom.com/wiki/Combat_Instant "Combat Instant") | 1 Unit | [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **15 - 75** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **5 - 25** | Fire | Can be infused (gaining [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **1** per [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **3** spent) |
| [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Fire Storm](https://masterofmagic.fandom.com/wiki/Fire_Storm "Fire Storm")** | [Instant Spell](https://masterofmagic.fandom.com/wiki/Instant_Spell "Instant Spell") | 1 Tile | [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **250** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **8** | Fire | - |
| [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Flame Strike](https://masterofmagic.fandom.com/wiki/Flame_Strike "Flame Strike")** | [Combat Instant](https://masterofmagic.fandom.com/wiki/Combat_Instant "Combat Instant") | All enemies | [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **60** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **15** | Fire | - |
| [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Immolation](https://masterofmagic.fandom.com/wiki/Immolation_(Spell) "Immolation (Spell)")** | [Unit Enchant](https://masterofmagic.fandom.com/wiki/Unit_Enchantment "Unit Enchantment") | 1 Unit | [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **150 / 30** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **4** | Fire | Triggered as a [Touch Attack](https://masterofmagic.fandom.com/wiki/Touch_Attack "Touch Attack") ability. |
| [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Meteor Storm](https://masterofmagic.fandom.com/wiki/Meteor_Storm "Meteor Storm")** | [Global Enchant](https://masterofmagic.fandom.com/wiki/Global_Enchantment "Global Enchantment") | All units | [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **900** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **4** | Fire | Every unit not in a [Town](https://masterofmagic.fandom.com/wiki/Town "Town") is hit each turn. |
| [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Wall of Fire](https://masterofmagic.fandom.com/wiki/Wall_of_Fire "Wall of Fire")** | [Town Enchant](https://masterofmagic.fandom.com/wiki/Town_Enchantment "Town Enchantment") | 1 Town | [Mana](https://masterofmagic.fandom.com/wiki/Mana "Mana") **150 / 30** | [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **5** | Fire | Triggered by [Ground Movement](https://masterofmagic.fandom.com/wiki/Ground_Movement "Ground Movement")**Walking** and [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") **Melee** through the wall. |

#### Immolation

[Immolation](https://masterofmagic.fandom.com/wiki/Immolation "Immolation") [Immolation](https://masterofmagic.fandom.com/wiki/Immolation "Immolation")
is a hybrid special ability that combines several mechanics to achieve a
unique effect. It can be conferred onto any unit in the game using the [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Immolation](https://masterofmagic.fandom.com/wiki/Immolation_(Spell) "Immolation (Spell)")** spell. This grants the unit a special attack that is triggered the same way as a [Touch Attack](https://masterofmagic.fandom.com/wiki/Touch_Attack "Touch Attack"), meaning that it is affixed to any other type of attack that the unit makes (including other [Special Attacks](https://masterofmagic.fandom.com/wiki/Special_Attack "Special Attack")).

Immolation has a constant **Attack Strength** of **4**
that can not be modified by any means, but at the same time it delivers
an Area Damage attack instead of a conventional one. As such, the above
section is fully applicable to describing this attack, and the Unit
Enchantment is also listed there.

The unofficial [1.50 patch](https://masterofmagic.fandom.com/wiki/Unofficial_Patch_1.50 "Unofficial Patch 1.50")
modifies Immolation such that it no longer triggers when executing
Ranged Attacks, which also includes all three types of short range
attacks. It is now only affixed exclusively to [Melee Damage](https://masterofmagic.fandom.com/wiki/Melee_Damage "Melee Damage").

## Table Of Attack Strength Modifiers

Below is a comprehensive table of **Attack Strength**
modifiers. Icons with a dark background are used to represent any bonus
that is not obtainable in practice without modifying the game in one
way or another. This is usually a result of a limitation on the affected
targets and the abilities that they actually have. These effects are
included mainly for those who wish to mod the game without changing the
underlying mechanics.

For example, the [Life](https://masterofmagic.fandom.com/wiki/Life "Life")**[True Light](https://masterofmagic.fandom.com/wiki/True_Light "True Light")** spell grants an **Attack Strength** bonus to every type of attack that an affected creature can make. However, it is only valid for units of the [Life](https://masterofmagic.fandom.com/wiki/Life "Life")**Life** realm, and these creatures exclusively can only ever have [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") **Melee** Attacks in the original game. Because of this, the spell is only highlighted as providing a benefit for this single type of **Attack Strength**. However, since it would technically improve all others should a [Life](https://masterofmagic.fandom.com/wiki/Life "Life")**Life** creature possess any, these are listed with a dark background instead.

| Effect | | Magnitude | Affects | | | | | | | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Experience | | | | | | | | | | |
| Experience 1 | [Regular](https://masterofmagic.fandom.com/wiki/Experience_Level "Experience Level") | **+1** | Icon Melee Normal | Icon Ranged Bow | Icon Ranged Boulder | Icon Ranged Magic | Icon Thrown | Icon Breath | Icon Gaze Lost | [Normal Units](https://masterofmagic.fandom.com/wiki/Normal_Unit "Normal Unit") only, requires [Experience](https://masterofmagic.fandom.com/wiki/Experience "Experience") **20 Experience Points** |
| Experience 3 | [Elite](https://masterofmagic.fandom.com/wiki/Experience_Level "Experience Level") | **+1** (total **+2**) | Icon Melee Normal | Icon Ranged Bow | Icon Ranged Boulder | Icon Ranged Magic | Icon Thrown | Icon Breath | Icon Gaze Lost | Normal Units only, requires [Experience](https://masterofmagic.fandom.com/wiki/Experience "Experience") **120 Experience Points** |
| Experience 5 | [Champion](https://masterofmagic.fandom.com/wiki/Experience_Level "Experience Level") | **+1** (total **+3**) | Icon Melee Normal | Icon Ranged Bow | Icon Ranged Boulder | Icon Ranged Magic | Icon Thrown | Icon Breath | Icon Gaze Lost | Normal Units only, requires [Warlord](https://masterofmagic.fandom.com/wiki/Warlord "Warlord") and [Life](https://masterofmagic.fandom.com/wiki/Life "Life")**[Crusade](https://masterofmagic.fandom.com/wiki/Crusade "Crusade")** |
| Experience 8 | [Hero Levels](https://masterofmagic.fandom.com/wiki/Experience_Level "Experience Level") | **+1** (per level) | Icon Melee Normal | Icon Ranged Bow | Icon Ranged Boulder Lost | Icon Ranged Magic | Icon Thrown | Icon Breath | Icon Gaze Lost | [Heroes](https://masterofmagic.fandom.com/wiki/Hero "Hero") only (cumulative) |
| Equipment | | | | | | | | | | |
| Icon Melee Mithril | Mithril | **+1** | Icon Melee Normal | Icon Ranged Bow | Icon Ranged Boulder |  | Icon Thrown |  |  | Normal Units only, [Mithril Ore](https://masterofmagic.fandom.com/wiki/Mithril_Ore "Mithril Ore") + [Alchemists' Guild](https://masterofmagic.fandom.com/wiki/Alchemists%27_Guild "Alchemists' Guild") |
| Icon Melee Adamantium | Adamantium | **+2** | Icon Melee Normal | Icon Ranged Bow | Icon Ranged Boulder |  | Icon Thrown |  |  | Normal Units only, [Adamantium Ore](https://masterofmagic.fandom.com/wiki/Adamantium_Ore "Adamantium Ore") + [Alchemists' Guild](https://masterofmagic.fandom.com/wiki/Alchemists%27_Guild "Alchemists' Guild") |
| Item Sword 1 | [Sword](https://masterofmagic.fandom.com/wiki/Sword "Sword") | up to **+3** | Icon Melee Normal |  |  |  |  |  |  | Heroes only, requires ItemSlot Sword, ItemSlot Bow, or ItemSlot SwordStaff equipment slot |
| Item Mace 1 | [Mace](https://masterofmagic.fandom.com/wiki/Mace "Mace") | up to **+4** | Icon Melee Normal |  |  |  |  |  |  | Heroes only, requires ItemSlot Sword, ItemSlot Bow, or ItemSlot SwordStaff equipment slot |
| Item Axe 1 | [Axe](https://masterofmagic.fandom.com/wiki/Axe "Axe") | up to **+6** | Icon Melee Normal |  |  |  | Icon Thrown |  |  | Heroes only, requires ItemSlot Sword, ItemSlot Bow, or ItemSlot SwordStaff equipment slot |
| Item Bow 1 | [Bow](https://masterofmagic.fandom.com/wiki/Bow "Bow") | up to **+6** |  | Icon Ranged Bow |  |  |  |  |  | Heroes only, requires ItemSlot Bow equipment slot |
| Item Wand 1 | [Wand](https://masterofmagic.fandom.com/wiki/Wand "Wand") | up to **+2** |  |  |  | Icon Ranged Magic |  |  |  | Heroes only, requires ItemSlot Staff or ItemSlot SwordStaff equipment slot |
| Item Staff 1 | [Staff](https://masterofmagic.fandom.com/wiki/Staff "Staff") | up to **+6** |  |  |  | Icon Ranged Magic |  |  |  | Heroes only, requires ItemSlot Staff or ItemSlot SwordStaff equipment slot |
| ItemPower Sword Red | [Flaming](https://masterofmagic.fandom.com/wiki/Flaming_(Item_Power) "Flaming (Item Power)") Weapon | **+3** | same as the weapon | | | | | | | Heroes only (requires [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**2 books** to enchant) |
| ItemPower Axe Green | [Giant Strength](https://masterofmagic.fandom.com/wiki/Giant_Strength_(Item_Power) "Giant Strength (Item Power)") Weapon | **+1** | same as the weapon | | | | | | | - Heroes only (requires [Nature](https://masterofmagic.fandom.com/wiki/Nature "Nature")**3 books** to enchant), - Sword/Mace/Axe only (stacks with the spell) |
| Item Misc 1 | [Jewelry](https://masterofmagic.fandom.com/wiki/Jewelry "Jewelry") | up to **+4** | Icon Melee Normal | Icon Ranged Bow | Icon Ranged Boulder Lost | Icon Ranged Magic | Icon Thrown | Icon Breath | Icon Gaze Lost | Heroes only, requires ItemSlot Misc equipment slot |
| ItemPower Misc 35 Green | [Giant Strength](https://masterofmagic.fandom.com/wiki/Giant_Strength_(Item_Power) "Giant Strength (Item Power)") Jewelry | **+1** | Icon Melee Normal |  |  |  |  |  |  | - Heroes only (requires [Nature](https://masterofmagic.fandom.com/wiki/Nature "Nature")**3 books** to enchant), - stacks with both weapon and spell |
| Abilities | | | | | | | | | | |
| Ability HolyBonus | [Holy Bonus](https://masterofmagic.fandom.com/wiki/Holy_Bonus "Holy Bonus") | **+1** or **+2** | Icon Melee Normal |  |  |  |  |  |  | affects *all* friendly units |
| Ability Might | [Might](https://masterofmagic.fandom.com/wiki/Might "Might") | **+1** / level | Icon Melee Normal |  |  |  |  |  |  | [Hero Ability](https://masterofmagic.fandom.com/wiki/Hero_Ability "Hero Ability") |
| Ability Might | [Super Might](https://masterofmagic.fandom.com/wiki/Might "Might") | **+1.5** / level | Icon Melee Normal |  |  |  |  |  |  | Hero Ability, bonus is rounded down |
| Ability ArcanePower | [Arcane Power](https://masterofmagic.fandom.com/wiki/Arcane_Power "Arcane Power") | **+1** / level |  |  |  | Icon Ranged Magic |  |  |  | Hero Ability |
| Ability ArcanePower | [Super Arcane Power](https://masterofmagic.fandom.com/wiki/Arcane_Power "Arcane Power") | **+1.5** / level |  |  |  | Icon Ranged Magic |  |  |  | Hero Ability, bonus is rounded down |
| Ability Leadership | [Leadership](https://masterofmagic.fandom.com/wiki/Leadership "Leadership") | **+1** / 3 levels | Icon Melee Normal |  |  |  |  |  |  | - Hero Ability, bonus is rounded down - affects all friendly [Normal Units](https://masterofmagic.fandom.com/wiki/Normal_Unit "Normal Unit") and [Heroes](https://masterofmagic.fandom.com/wiki/Hero "Hero") |
| **+1** / 6 levels |  | Icon Ranged Bow | Icon Ranged Boulder |  | Icon Thrown | Icon Breath | Icon Gaze Lost |
| Ability Leadership | [Super Leadership](https://masterofmagic.fandom.com/wiki/Leadership "Leadership") | **+1** / 2 levels | Icon Melee Normal |  |  |  |  |  |  | - Hero Ability, bonus is rounded down - affects all friendly Normal Units and Heroes |
| **+1** / 4 levels |  | Icon Ranged Bow | Icon Ranged Boulder |  | Icon Thrown | Icon Breath | Icon Gaze Lost |
| Unit Enchantments | | | | | | | | | | |
| UnitEnchantment Lionheart | [Life](https://masterofmagic.fandom.com/wiki/Life "Life")**[Lionheart](https://masterofmagic.fandom.com/wiki/Lionheart "Lionheart")** | **+3** | Icon Melee Normal | Icon Ranged Bow | Icon Ranged Boulder |  | Icon Thrown |  |  | - |
| UnitEnchantment GiantStrength | [Nature](https://masterofmagic.fandom.com/wiki/Nature "Nature")**[Giant Strength](https://masterofmagic.fandom.com/wiki/Giant_Strength "Giant Strength")** | **+1** | Icon Melee Normal |  |  |  | Icon Thrown |  |  | - |
| UnitEnchantment FlameBlade | [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Flame Blade](https://masterofmagic.fandom.com/wiki/Flame_Blade "Flame Blade")** | **+2** | Icon Melee Normal | Icon Ranged Bow |  |  | Icon Thrown |  |  | [Normal Units](https://masterofmagic.fandom.com/wiki/Normal_Unit "Normal Unit") and [Heroes](https://masterofmagic.fandom.com/wiki/Hero "Hero") only |
| UnitEnchantment Berserk | [Death](https://masterofmagic.fandom.com/wiki/Death "Death")**[Berserk](https://masterofmagic.fandom.com/wiki/Berserk "Berserk")** | **doubled** | Icon Melee Normal |  |  |  |  |  |  | - |
| UnitEnchantment BlackChannels | [Death](https://masterofmagic.fandom.com/wiki/Death "Death")**[Black Channels](https://masterofmagic.fandom.com/wiki/Black_Channels "Black Channels")** | **+2** | Icon Melee Normal |  |  |  |  |  |  | - Normal Units, Heroes, and [Undead](https://masterofmagic.fandom.com/wiki/Undead "Undead") units only - Turns Normal Units and Heroes into Undead |
| **+1** |  | Icon Ranged Bow | Icon Ranged Boulder | Icon Ranged Magic | Icon Thrown | Icon Breath | [Gaze Attack](https://masterofmagic.fandom.com/wiki/Gaze_Attack "Gaze Attack") |
| Combat and Global Enchantments, Node Auras | | | | | | | | | | |
| CombatEnchantment HighPrayer | [Life](https://masterofmagic.fandom.com/wiki/Life "Life")**[High Prayer](https://masterofmagic.fandom.com/wiki/High_Prayer "High Prayer")** | **+2** | Icon Melee Normal |  |  |  |  |  |  | affects *all* friendly units |
| CombatEnchantment TrueLight | [Life](https://masterofmagic.fandom.com/wiki/Life "Life")**[True Light](https://masterofmagic.fandom.com/wiki/True_Light "True Light")** | **+1** | Icon Melee Normal | Icon Ranged Bow Lost | Icon Ranged Boulder Lost | Icon Ranged Magic Lost | Icon Thrown Lost | Icon Breath Lost | Icon Gaze Lost | only benefits [Life](https://masterofmagic.fandom.com/wiki/Life "Life")**Life** creatures |
| SpellIcon ChaosSurge | [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Chaos Surge](https://masterofmagic.fandom.com/wiki/Chaos_Surge "Chaos Surge")** | **+2** | Icon Melee Normal | Icon Ranged Bow | Icon Ranged Boulder | Icon Ranged Magic | Icon Thrown | Icon Breath | [Doom Gaze](https://masterofmagic.fandom.com/wiki/Doom_Gaze "Doom Gaze") | only benefits [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**Chaos** (or [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Chaos Channeled](https://masterofmagic.fandom.com/wiki/Chaos_Channels "Chaos Channels")**) units |
| CombatEnchantment MetalFires | [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Metal Fires](https://masterofmagic.fandom.com/wiki/Metal_Fires "Metal Fires")** | **+1** | Icon Melee Normal | Icon Ranged Bow |  |  | Icon Thrown |  |  | - [Normal Units](https://masterofmagic.fandom.com/wiki/Normal_Unit "Normal Unit") and [Heroes](https://masterofmagic.fandom.com/wiki/Hero "Hero") only - does not stack with [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Flame Blade](https://masterofmagic.fandom.com/wiki/Flame_Blade "Flame Blade")** |
| CombatEnchantment Darkness | [Death](https://masterofmagic.fandom.com/wiki/Death "Death")**[Darkness](https://masterofmagic.fandom.com/wiki/Darkness "Darkness")** | **+1** | Icon Melee Normal | Icon Ranged Bow | Icon Ranged Boulder | Icon Ranged Magic | Icon Thrown | Icon Breath | [Gaze Attack](https://masterofmagic.fandom.com/wiki/Gaze_Attack "Gaze Attack") | only benefits [Death](https://masterofmagic.fandom.com/wiki/Death "Death")**Death** creatures and [Undead](https://masterofmagic.fandom.com/wiki/Undead "Undead") |
| CombatEnchantment ChaosNodeBonusAura | [Chaos Node Aura](https://masterofmagic.fandom.com/wiki/Chaos_Node#Chaos_Node_Unit_Bonus_Aura "Chaos Node") | **+2** | Icon Melee Normal | Icon Ranged Bow | Icon Ranged Boulder | Icon Ranged Magic | Icon Thrown | Icon Breath | [Doom Gaze](https://masterofmagic.fandom.com/wiki/Doom_Gaze "Doom Gaze") | only benefits [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**Chaos** (or [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Chaos Channeled](https://masterofmagic.fandom.com/wiki/Chaos_Channels "Chaos Channels")**) units |
| CombatEnchantment NatureNodeBonusAura | [Nature Node Aura](https://masterofmagic.fandom.com/wiki/Nature_Node#Nature_Node_Unit_Bonus_Aura "Nature Node") | **+2** | Icon Melee Normal | Icon Ranged Bow Lost | Icon Ranged Boulder | Icon Ranged Magic | Icon Thrown Lost | Icon Breath Lost | [Gaze Attack](https://masterofmagic.fandom.com/wiki/Gaze_Attack "Gaze Attack") | only benefits [Nature](https://masterofmagic.fandom.com/wiki/Nature "Nature")**Nature** creatures |
| CombatEnchantment SorceryNodeBonusAura | [Soorcery Node Aura](https://masterofmagic.fandom.com/wiki/Sorcery_Node#Sorcery_Node_Unit_Bonus_Aura "Sorcery Node") | **+2** | Icon Melee Normal | Icon Ranged Bow Lost | Icon Ranged Boulder Lost | Icon Ranged Magic | Icon Thrown Lost | [Lightning Breath](https://masterofmagic.fandom.com/wiki/Lightning_Breath "Lightning Breath") | Icon Gaze Lost | only benefits [Sorcery](https://masterofmagic.fandom.com/wiki/Sorcery "Sorcery")**Sorcery** creatures |
| Negative Effects | | | | | | | | | | |
| ItemPower Bow Red | [Chaos](https://masterofmagic.fandom.com/wiki/Chaos_(Item_Power) "Chaos (Item Power)") Weapon | **halved** | same as the weapon | | | | | | | - Heroes only (requires [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**6 books** to enchant) - applies the [Doom](https://masterofmagic.fandom.com/wiki/Doom_Damage "Doom Damage") [Damage Type](https://masterofmagic.fandom.com/wiki/Damage_Type "Damage Type") to the attack |
| CombatEnchantment TrueLight | [Life](https://masterofmagic.fandom.com/wiki/Life "Life")**[True Light](https://masterofmagic.fandom.com/wiki/True_Light "True Light")** | **-1** | Icon Melee Normal | Icon Ranged Bow | Icon Ranged Boulder | Icon Ranged Magic | Icon Thrown | Icon Breath | [Gaze Attack](https://masterofmagic.fandom.com/wiki/Gaze_Attack "Gaze Attack") | affects all [Death](https://masterofmagic.fandom.com/wiki/Death "Death")**Death** and [Undead](https://masterofmagic.fandom.com/wiki/Undead "Undead") units |
| UnitEnchantment MindStorm | [Sorcery](https://masterofmagic.fandom.com/wiki/Sorcery "Sorcery")**[Mind Storm](https://masterofmagic.fandom.com/wiki/Mind_Storm "Mind Storm")** | **-5** | Icon Melee Normal | Icon Ranged Bow | Icon Ranged Boulder | Icon Ranged Magic | Icon Thrown | Icon Breath | [Gaze Attack](https://masterofmagic.fandom.com/wiki/Gaze_Attack "Gaze Attack") | - single target, [Resistance](https://masterofmagic.fandom.com/wiki/Resistance "Resistance") **non-resistable** - does not work against [Illusions Immunity](https://masterofmagic.fandom.com/wiki/Illusions_Immunity "Illusions Immunity") [Illusions Immunity](https://masterofmagic.fandom.com/wiki/Illusions_Immunity "Illusions Immunity") |
| UnitEnchantment Shatter | [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Shatter](https://masterofmagic.fandom.com/wiki/Shatter "Shatter")** | set to **1** | Icon Melee Normal | Icon Ranged Bow | Icon Ranged Boulder | Icon Ranged Magic | Icon Thrown | Icon Breath | Icon Gaze Lost | - single target, [Resistance](https://masterofmagic.fandom.com/wiki/Resistance "Resistance") **resistable** (no penalty) - only affects [Normal Units](https://masterofmagic.fandom.com/wiki/Normal_Unit "Normal Unit") or [Heroes](https://masterofmagic.fandom.com/wiki/Hero "Hero") |
| UnitEnchantment WarpCreature Offensive | [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Warp Creature](https://masterofmagic.fandom.com/wiki/Warp_Creature "Warp Creature")** | **halved** | Icon Melee Normal |  |  |  |  |  |  | - single target, [Resistance](https://masterofmagic.fandom.com/wiki/Resistance "Resistance") **resistable** (at [Resistance](https://masterofmagic.fandom.com/wiki/Resistance#Spell_Save_Penalties "Resistance") **-1**) - only 1 of 3 possible effects |
| SpellIcon WarpWood | [Chaos](https://masterofmagic.fandom.com/wiki/Chaos "Chaos")**[Warp Wood](https://masterofmagic.fandom.com/wiki/Warp_Wood "Warp Wood")** | set to **0** |  | Icon Ranged Bow |  |  |  |  |  | single target, [Resistance](https://masterofmagic.fandom.com/wiki/Resistance "Resistance") **non-resistable** |
| CombatEnchantment BlackPrayer | [Death](https://masterofmagic.fandom.com/wiki/Death "Death")**[Black Prayer](https://masterofmagic.fandom.com/wiki/Black_Prayer "Black Prayer")** | **-1** | Icon Melee Normal | Icon Ranged Bow | Icon Ranged Boulder | Icon Ranged Magic | Icon Thrown | Icon Breath | [Gaze Attack](https://masterofmagic.fandom.com/wiki/Gaze_Attack "Gaze Attack") | affects *all* opposing units |
| CombatEnchantment Darkness | [Death](https://masterofmagic.fandom.com/wiki/Death "Death")**[Darkness](https://masterofmagic.fandom.com/wiki/Darkness "Darkness")** | **-1** | Icon Melee Normal | Icon Ranged Bow Lost | Icon Ranged Boulder Lost | Icon Ranged Magic Lost | Icon Thrown Lost | Icon Breath Lost | Icon Gaze Lost | affects all [Life](https://masterofmagic.fandom.com/wiki/Life "Life")**Life** creatures |
| UnitEnchantment Weakness | [Death](https://masterofmagic.fandom.com/wiki/Death "Death")**[Weakness](https://masterofmagic.fandom.com/wiki/Weakness "Weakness")** | **-2** | Icon Melee Normal | Icon Ranged Bow |  |  |  |  |  | single target, [Resistance](https://masterofmagic.fandom.com/wiki/Resistance "Resistance") **resistable** (at [Resistance](https://masterofmagic.fandom.com/wiki/Resistance#Spell_Save_Penalties "Resistance") **-2**) |