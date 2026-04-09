*This article contains outdated information. Until it is revised, please see [Conventional Damage](https://masterofmagic.fandom.com/wiki/Conventional_Damage "Conventional Damage") for a more accurate description of the same concept.*

**Physical Damage** is the most common [Damage Type](https://masterofmagic.fandom.com/wiki/Damage_Type "Damage Type") in *Master of Magic*. It is the primary (and often only) damage component delivered by all [Melee Attacks](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") and [Ranged Attacks](https://masterofmagic.fandom.com/wiki/Ranged_Attack "Ranged Attack"), and it is used by a wide variety of spells in order to directly harm their targets. In all cases, **Physical Damage** behaves in a specific but rather complex way, significantly different from the various types of [Special Damage](https://masterofmagic.fandom.com/wiki/Special_Damage "Special Damage").

**Physical Damage** is intended to cause actual [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **Damage Points** to the target - reducing its current [Hit Points](https://masterofmagic.fandom.com/wiki/Hit_Points "Hit Points") **Health** and potentially killing off some or all of its [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") **figures**. The "stronger" the **Physical Damage** attack, the more [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **Damage Points** it can potentially deliver.

The process involves two types of rolls - [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit** and [Defense Roll](https://masterofmagic.fandom.com/wiki/Defense_Roll "Defense Roll") **Defense** rolls - made respectively by the attacker and the target. These rolls help determine how much [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **Damage** is actually inflicted on the target, and thus give **Physical Damage** a great randomness that is not found in other types of damage.

The process is quite complex, and becomes even more complex whenever the attacker or the target (or both!) are [Figure](https://masterofmagic.fandom.com/wiki/Figure#Multi-Figure_Units "Figure") **Multi-Figure units**. This article explains the entire process in as great a detail as possible.

**Physical Damage** sometimes receives different names depending on how it is delivered - such as "[Melee Damage](https://masterofmagic.fandom.com/wiki/Melee_Damage "Melee Damage")", "[Ranged Damage](https://masterofmagic.fandom.com/wiki/Ranged_Damage "Ranged Damage")" or "[Magical Damage](https://masterofmagic.fandom.com/wiki/Magical_Damage "Magical Damage")". All of these behave the same way, except they may sometimes trigger various immunities the target might possess.

Finally, it is important to note that while some other [Damage Types](https://masterofmagic.fandom.com/wiki/Damage_Type "Damage Type"), such as [Doom Damage](https://masterofmagic.fandom.com/wiki/Doom_Damage "Doom Damage") and [Poison Damage](https://masterofmagic.fandom.com/wiki/Poison_Damage "Poison Damage"), also cause [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **Damage Points** to the target, they are not considered **Physical Damage** since they involve no [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit** nor [Defense Roll](https://masterofmagic.fandom.com/wiki/Defense_Roll "Defense Roll") **Defense** rolls - a staple of all **Physical Damage** types.

## Process Overview

Whenever **Physical Damage** is being dealt, by any attack or method, the program runs through this generalized set of actions:

1. Calculate the **Total Attack Strength** of the attacking unit.
2. The attacker makes several randomized [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit** rolls to determine how many times it has managed to **hit** its target.
3. The target makes several randomized [Defense Roll](https://masterofmagic.fandom.com/wiki/Defense_Roll "Defense Roll") **Defense** rolls to determine how many of these hits are blocked or deflected.
4. Each *unblocked* hit inflicts [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **1 Damage Point** on the target, injuring it and possibly killing some or all of its [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") **figures**.
5. [Figure](https://masterofmagic.fandom.com/wiki/Figure#Multi-Figure_Units "Figure") **Multi-Figure units** that lose a figure due to this damage may get to make more defense rolls to reduce further damage.
6. Steps #4 and #5 are repeated until all registered hits are either blocked or translated into [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **Damage**.

Each of these steps is explained in greater detail below.

## Attack Type and Strength

Before we start to deliver **Physical Damage**, we need to figure out the *strength* of the attack itself. This tells us the *amount* of **Physical Damage** being delivered at the target.

To tell how strong an attack is (and therefore how much damage it
can deliver), we need to know what kind of attack we're dealing with.
In other words, we'll know what factors to look at in order to determine
the attack strength.

| Attack Type | Strength Calculated From... |
| --- | --- |
| [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") | The attacker's [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") **Melee Attack strength**. |
|  |  |  |
| [Ranged Missile Attack](https://masterofmagic.fandom.com/wiki/Ranged_Missile_Attack "Ranged Missile Attack") | The attacker's [Ranged Missile Attack](https://masterofmagic.fandom.com/wiki/Ranged_Missile_Attack "Ranged Missile Attack") **Ranged Missile Attack strength**. |
|  |  |  |
| [Ranged Boulder Attack](https://masterofmagic.fandom.com/wiki/Ranged_Boulder_Attack "Ranged Boulder Attack") | The attacker's [Ranged Boulder Attack](https://masterofmagic.fandom.com/wiki/Ranged_Boulder_Attack "Ranged Boulder Attack") **Ranged Boulder Attack strength**. |
|  |  |  |
| [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") | The attacker's [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **Ranged Magical Attack strength**. |
|  |  |  |
| [Thrown Attack](https://masterofmagic.fandom.com/wiki/Thrown_Attack "Thrown Attack") | The attacker's [Thrown Attack](https://masterofmagic.fandom.com/wiki/Thrown_Attack "Thrown Attack") **Thrown Attack strength**. |
|  |  |  |
| [Breath Attack](https://masterofmagic.fandom.com/wiki/Breath_Attack "Breath Attack") | The attacker's [Fire Breath](https://masterofmagic.fandom.com/wiki/Fire_Breath "Fire Breath") **Fire Breath** or [Lightning Breath](https://masterofmagic.fandom.com/wiki/Lightning_Breath "Lightning Breath") **Lightning Breath** ability score. |
|  |  |  |
| Direct-damage spells | Varies from spell to spell, as indicated in the spell's description tool-tip and on this wiki. |

The column on the right indicates which unit property we need to read to get the attack strength - which is also the amount of **Physical Damage**
the attack delivers. Spells are the exception, as their strength is not
indicated in any specific panel - but rather in the spell's description
as found in-game or (often more accurately) in this wiki.

The attack's strength indicates the *maximum potential*
amount of damage it can deliver. However, due to the many random rolls
involved, as explained below, very few units in very few circumstances
will actually deliver this many [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **Damage Points** to the target.

Further complicating things, for [Figure](https://masterofmagic.fandom.com/wiki/Figure#Multi-Figure_Units "Figure") **Multi-Figure units** the attack strength represents the maximum potential damage that can be delivered by *each individual [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") **figure***
in the unit. Only figures that are alive and visible on the battlefield
can inflict damage - missing ones (i.e. casualties) cannot. The process
of multi-figure attack and defense is explained in greater detail below
and elsewhere, particularly in the [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") article.

## Registered Hits

Calculating the strength of a **Physical Damage**
attack is only the first step. Next up, the attacker (whether a unit on
the battlefield or an independent spell effect) must make a number of [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit** rolls to determine how much of this damage *potential* it can actually manifest. Each successful [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit** roll will result in one "registered hit" on the target, which will potentially be translated into [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **1 point of Damage** at the end of the process.

The number of [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit** rolls that are made is equal to the strength of the attack (see the previous section). Therefore, for example, a unit with [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") **18** will make 18 separate [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit** rolls, representing 18 separate attempts to score Hits on the target.

Each [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit** roll results in a completely random number between 1 and 100. This is then directly compared to the attacker's [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit** score. The default [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") score is [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **30%**
for all units and spells, while some units can enjoy a bonus (or suffer
a penalty) which is measured in 10% increments, given by the unit's
innate abilities and/or any [Unit Enchantments](https://masterofmagic.fandom.com/wiki/Unit_Enchantment "Unit Enchantment") currently affecting it.

Each roll that results in a number *equal to or lower than* the [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit** score is "successful", and thus one hit is registered on the target. Each rolls that comes up *higher than* the [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit** score is a "miss", and is not registered.

When all [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit** rolls are completed, the game tallies them up. This number of successful hit represents the maximum amount of [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **Damage**
that will be done to the target. However, as we'll see in a moment, the
process is not over: the target might still have a chance to deflect
some of this damage.

### Example

:   A unit attacks with [Ranged Missile Attack](https://masterofmagic.fandom.com/wiki/Ranged_Missile_Attack "Ranged Missile Attack") **15**. This gives it 15 separate attempts to score hits on the target.

:   Units have a basic [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") value of [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **30%**, but this specific unit's abilities happen to modify its score to [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **40%**.

:   The game proceeds to roll 15 completely-random numbers, each between 1 and 100. Each of these rolls that comes up *40 or lower* will register as a Hit on the target. All other rolls are ignored.

:   The game tallies together all of these "registered Hits". If,
    for example, 10 rolls were successful, then 10 "hits" are registered,
    and the target will suffer anywhere up to [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **10** depending on how well it defends itself.

:   If *all* fifteen rolls resulted in 40 or lower, it means that the attacker delivers its full damage potential of [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **15 damage points** to the target. Conversely, if *all* rolls came up 41 or higher, the attacker has failed to score any hits and will deal no [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **Damage**
    at all! Most often though, thanks to the copious randomness involved,
    some rolls will succeed and some will fail, resulting in somewhere
    between 0 and 15 hits.

## The Target's Defense

Before damage is actually applied however, the target of this **Physical Damage** gets the chance to block or avert some or all hits registered upon it by rolling against its own [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense** and [Defense Roll](https://masterofmagic.fandom.com/wiki/Defense_Roll "Defense Roll") **To Block** scores.

The unit's [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense** score is visible in its details panel as a row of [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Shield** icons. Each [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Shield** represents a chance to block one of the registered hits, thus avoiding exactly [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **1**. The more rolls are successful, the more [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **Damage** is avoided.

The process is similar to the [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit** rolls explained above - except with different parameters.

For one, the number of rolls made by the defender is equal to its [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense** score, so a unit with [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **5 Defense** makes 5 rolls, and thus blocks anywhere up to 5 incoming hits (i.e. [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **5**).

Secondly, the chance of success with each roll depends on the unit's [Defense Roll](https://masterofmagic.fandom.com/wiki/Defense_Roll "Defense Roll") **To Block** score. This score is rarely shown anywhere in the game, since it almost never changes; it is nearly always exactly [Defense Roll](https://masterofmagic.fandom.com/wiki/Defense_Roll "Defense Roll") **30%** for any target. Only a few targets, primarily those possessing the [Lucky](https://masterofmagic.fandom.com/wiki/Lucky "Lucky") ability, have more than [Defense Roll](https://masterofmagic.fandom.com/wiki/Defense_Roll "Defense Roll") **30% To Block** (usu. [Defense Roll](https://masterofmagic.fandom.com/wiki/Defense_Roll "Defense Roll") **40%** and no more).

Once again, each roll results in a random number between 1 and 100. The numbers are then compared to the target's [Defense Roll](https://masterofmagic.fandom.com/wiki/Defense_Roll "Defense Roll") **To Block** score. Each roll that comes up *equal to or lower than* that score has successfully managed to deflect 1 incoming hit, and thus reduces the resulting damage by [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **1**. Failed rolls - resulting in a number *higher than* the unit's [Defense Roll](https://masterofmagic.fandom.com/wiki/Defense_Roll "Defense Roll") **To Block** score - do nothing.

Thus, the greater the number of successful [Defense Roll](https://masterofmagic.fandom.com/wiki/Defense_Roll "Defense Roll") **Defense** rolls made by the target, the less **Physical Damage** it suffers from the attack. A target can potentially block *all*
incoming damage if it succeeds in a large enough number of rolls, which
often happens when the incoming attack was weak to begin with.

### Example

:   An attacker makes its [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit** rolls, and ends up registering 10 hits on the target.

:   The target has a [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") score of [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **10**, and an unmodified [Defense Roll](https://masterofmagic.fandom.com/wiki/Defense_Roll "Defense Roll") **30% To Block**.
    It will therefore roll 10 random numbers, each between 1 and 100, and
    each roll that comes up 30 or lower will deflect one incoming hit.

:   If three rolls are successful, the number of hits is reduced by
    3. Therefore, the target will only suffer 7 hits (which will be
    translated to [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **7 points of damage**, as explained below).

:   If all 10 rolls are successful, the target unit suffers no damage - having averted all hits!

:   Conversely, if all 10 rolls fail, the target will suffer all 10 hits, i.e. [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **10 points of damage**.

## Applying Damage

As explained above, each registered hit that is not blocked by the target's [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense** rolls will inflict exactly [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **1 damage point** on the target.

[Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **Damage Points** are subtracted from the unit's current [Hit Points](https://masterofmagic.fandom.com/wiki/Hit_Points "Hit Points") **Hit Points**. Each [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **1** will darken a single [Hit Points](https://masterofmagic.fandom.com/wiki/Hit_Points "Hit Points") **Heart** as displayed in the unit's details panel. Only healing (whether over time or thanks to spell effects) will restore these lost [Hit Points](https://masterofmagic.fandom.com/wiki/Hit_Points "Hit Points") **Hit Points**.

Once a unit loses all of its [Hit Points](https://masterofmagic.fandom.com/wiki/Hit_Points "Hit Points") **Hit Points**, it is completely destroyed. Only magical spells and very special [Unit Abilities](https://masterofmagic.fandom.com/wiki/Unit_Abilities "Unit Abilities") can restore it to life - otherwise it is gone for good.

### Implications of Damage

[Figure](https://masterofmagic.fandom.com/wiki/Figure#Single-Figure_Units "Figure") **Single-Figure units** handle [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **Damage** in a very simple manner: as long as a [Figure](https://masterofmagic.fandom.com/wiki/Figure#Single-Figure_Units "Figure") **Single-Figure unit** has at least [Hit Points](https://masterofmagic.fandom.com/wiki/Hit_Points "Hit Points") **1 Hit Point** remaining, it remains alive and can fight just as effectively as when the unit is fully-healed. In other words, [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **Damage** itself has no noticeable effect on the unit's performance.

For example, a [Sky Drake](https://masterofmagic.fandom.com/wiki/Sky_Drake "Sky Drake")
has a powerful and dangerous attack regardless of how injured it is --
so long as it is still alive. Obviously, it is much easier to kill a Sky
Drake when it only has a few [Hit Points](https://masterofmagic.fandom.com/wiki/Hit_Points "Hit Points") **Hit Points** left; but until it is killed, its offensive abilities are not affected by any amount of [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **Damage** from which it is currently suffering.

[Hit Points](https://masterofmagic.fandom.com/wiki/Hit_Points "Hit Points") **Hit Points** are handled *very* differently for units containing [Figure](https://masterofmagic.fandom.com/wiki/Figure#Multi-Figure_Units "Figure") **Multiple Figures**, where things start to get complex. This is because the game tracks the [Hit Points](https://masterofmagic.fandom.com/wiki/Hit_Points "Hit Points") **Health** of each individual figure *separately*.

Only the "front" figure in a [Figure](https://masterofmagic.fandom.com/wiki/Figure#Multi-Figure_Units "Figure") **Multi-Figure unit** suffers [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **Damage**. However, once that figure suffers a sufficient amount of [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **Damage** - enough to reduce its Health to [Hit Points](https://masterofmagic.fandom.com/wiki/Hit_Points "Hit Points") **0**
- that figure is killed off. When this happens, the next figure in the
unit (if any remain at all) steps up to take any subsequent damage. The
unit itself is only destroyed once *all* [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") **figures** are killed in this way, but each lost [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") **figure** reduces the unit's combat performance as well.

For more information, see [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points"), or skip to the section on [Multi-Figure Units](#Multi-Figure_Units), below.

## Multiple-Figure Units

**Physical Damage**, and the attacks that deliver it, behaves *very* differently when it is either inflicted by or upon a [Figure](https://masterofmagic.fandom.com/wiki/Figure#Multi-Figure_Units "Figure") **Multi-Figure unit** than it does when inflicted by or upon a [Figure](https://masterofmagic.fandom.com/wiki/Figure#Single-Figure_Units "Figure") **Single-Figure unit**. The process becomes very complex in these cases, and is explained here in some detail.

### Multiple Figures Attacking

When a [Figure](https://masterofmagic.fandom.com/wiki/Figure#Multi-Figure_Units "Figure") **Multi-Figure Unit** makes an attack delivering any kind of **Physical Damage**, it will actually deliver *one attack per each of its live [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") **figures***. This is contrary to the game's manual and *Official Strategy Guide*, which erroneously explain that [Figure](https://masterofmagic.fandom.com/wiki/Figure#Multi-Figure_Units "Figure") **Multi-Figure units** deliver only a single attack whose strength is based on the number of live [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") **figures**.

In other words, each of the [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") **figures**
in the attacking unit makes a separate attack on the target. The
strength of each of these "sub-attacks" is equal to the unit's [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") **Melee Attack strength**, [Ranged Missile Attack](https://masterofmagic.fandom.com/wiki/Ranged_Missile_Attack "Ranged Missile Attack") **Ranged Missile Attack strength**, or whatever other factor is appropriate (see table [above](#Attack_Type_and_Strength)).

:   For example, imagine a unit with [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") **4 Melee Attack Strength** and [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") **3 live Figures remaining**. When making a [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack"), this unit will actually deliver 3 separate **Physical Damage** sub-attacks (one per [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") **figure**). Each of these "sub-attacks" delivers 4 **Physical Damage** points (given the unit's Melee strength of [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") **4**).

Only *live* [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") **figures**
are permitted to deliver a sub-attack. Casualties - i.e. figures
currently missing from the unit - obviously cannot attack at all.

This is one of the primary reasons why a [Figure](https://masterofmagic.fandom.com/wiki/Figure#Multi-Figure_Units "Figure") **Multi-Figure unit**'s combat performance relies so heavily on the maximum number of [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") **figures** it can contain, and the number it has left at any given time. It also explains why [Figure](https://masterofmagic.fandom.com/wiki/Figure#Multi-Figure_Units "Figure") **Multi-Figure units** can seem to punch well above their weight, though that is a topic to discuss separately.

Again, since each of these sub-attacks is a *separate* attack of its own, each delivers **Physical Damage** as per the entire process described above in this article, from start to finish - including all [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit** and [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense** rolls as appropriate, as well as applying [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **Damage** to the target - before moving on to process the next sub-attack. Thus, while the attacker's potential [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **Damage**
output is greater, the defender's ability to protect itself is also
greater, since it gets to defend separately against each and every
attacking [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") **figure**.

### Multiple Figures Defending

As explained [earlier in this article](#Implications_of_Damage), [Figure](https://masterofmagic.fandom.com/wiki/Figure#Multi-Figure_Units "Figure") **Multi-Figure units** also behave differently when suffering [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **Damage**, and as explained in this section here, they [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defend** differently as well.

Each [Figure](https://masterofmagic.fandom.com/wiki/Figure#Multi-Figure_Units "Figure") **Multi-Figure unit** has one figure designated as the "lead" figure. This is the only figure in the unit that will [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defend** itself, and the only figure that will suffer [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **Damage**. To hurt the other figures in the unit, it is first necessary to kill the "lead" figure.

When this figure is killed, something very important happens: the
next figure in the defending unit steps up to take its place. Any
unblocked incoming [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **Damage**
in excess of what it took to kill the first "lead" figure is now
redirected towards the new "lead" figure, and can potentially kill it
too. If sufficient [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **Damage** has yet to be inflicted, it can potentially kill all of these figures one after the other.

However, each time a new "lead" figure steps up, it will make a *completely new set of [Defense Roll](https://masterofmagic.fandom.com/wiki/Defense_Roll "Defense Roll") **Defense** rolls*, just like the first lead figure did before it died! Therefore, each time a new figure steps up, the remaining incoming [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **Damage** can be reduced further and further. Each new "lead" figure's [Defense Roll](https://masterofmagic.fandom.com/wiki/Defense_Roll "Defense Roll") **Defense** rolls does not diminish - it is exactly as potent as the rolls made by the original lead figure.

The result in the game is that the more figures there are in a
unit, the harder it is to kill in one attack. Killing the first "lead"
figure is usually easy, but the remaining damage will likely be reduced
more and more as it keeps killing figures.

#### Example

:   A [High Men Cavalry](https://masterofmagic.fandom.com/wiki/High_Men_Cavalry "High Men Cavalry") unit - with all 4 of its [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") **figures** present - is being attacked by some enemy unit. Each [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") **figure** in this unit has [Hit Points](https://masterofmagic.fandom.com/wiki/Hit_Points "Hit Points") **3 Hit Points**. The unit's [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense** score is [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **2**, and it has a mundane [Defense Roll](https://masterofmagic.fandom.com/wiki/Defense_Roll "Defense Roll") **To Block** score of [Defense Roll](https://masterofmagic.fandom.com/wiki/Defense_Roll "Defense Roll") **30%**.

:   The attacker makes 7 successful [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit** rolls, scoring a total of 7 hits. Potentially, this should cause [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **7** to the target, killing two of the Cavalrymen and injuring another ([Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **7** / [Hit Points](https://masterofmagic.fandom.com/wiki/Hit_Points "Hit Points") **3** = [Figure](https://masterofmagic.fandom.com/wiki/Figure "Figure") **2 dead figures** and change). Of course, given what's explained above, that is actually very unlikely to happen, as we'll see in a moment.

:   Once we're done with the hit rolls, the "lead" figure in the [High Men Cavalry](https://masterofmagic.fandom.com/wiki/High_Men_Cavalry "High Men Cavalry") unit makes his [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense** rolls. Since this cavalry unit has a Defense score of [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **2**, the cavalryman may make 2 separate rolls. Each roll has a 30% chance to avert one hit, as per the unit's [Defense Roll](https://masterofmagic.fandom.com/wiki/Defense_Roll "Defense Roll") **30% To Block**.

:   The rolls are made, but the cavalryman succeeds with only one. This means that the number of inflicted hits is only reduced to **7-1 = [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points")**6. This is still enough to kill two cavalrymen, but we're not there just yet.

:   First, we inflict as much damage as possible on the lead cavalryman. Since the he only has [Hit Points](https://masterofmagic.fandom.com/wiki/Hit_Points "Hit Points") **3 Hit Points**, [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **3 points of Damage** are inflicted on him - just enough to kill this cavalryman on the spot.

:   The next cavalryman then steps up to the "lead" position, ready to absorb the remaining [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **3** that's still pending. However instead of just taking the damage, this cavalryman gets to make *another set* of 2 [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense** rolls! Lets imagine that he rolls well, blocking [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **2** of the remaining damage points, leaving him to suffer only [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **3** - [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **2** = [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **1 point of Damage**. He suffers this damage, which isn't enough to kill him, and with no [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **Damage** left to be processed, the attack concludes.

:   In total the unit made 4 Defense rolls. 2 were made by the first
    cavalryman, who failed to protect himself and died valiantly. The
    second cavalryman then got a fresh chance, making an additional 2
    defense rolls and saving himself. Had this cavalryman also been killed,
    the next one in line would *also* have been able to make 2 defense rolls, and so would the very last figure if it came to that.

:   This method of defense is so effective, that it would require *an attack of strength 40 or higher* to have any real chance of destroying the entire [High Men Cavalry](https://masterofmagic.fandom.com/wiki/High_Men_Cavalry "High Men Cavalry") unit in one go! Thus, while seemingly a little fragile and defenseless, even [High Men Cavalry](https://masterofmagic.fandom.com/wiki/High_Men_Cavalry "High Men Cavalry") display quite some resilience, and will rarely be killed in an instant - at least where **Physical Damage** attacks are involved.

## Immunities

As mentioned earlier, **Physical Damage** may be delivered by all sorts of different attacks. Generally speaking, **Physical Damage** behaves the same regardless of which [Attack Type](https://masterofmagic.fandom.com/wiki/Attack_Type "Attack Type") delivered it, at least in terms of the process of applying [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **Damage** to the target.

However, different methods of delivering **Physical Damage** will trigger different immunities possessed by the target (if any). For the most part, if **Physical Damage** triggers one of the target's immunities, the target's [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") score is temporarily boosted to [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **50** for purposes of blocking this **Physical Damage**. In other words, the target will make 50 [Defense Roll](https://masterofmagic.fandom.com/wiki/Defense_Roll "Defense Roll") **Defense** rolls, which can easily avert all [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **Damage** from any but the strongest **Physical Damage** attacks.

In most cases, the factor that determines whether one or more of target's immunities are triggered is either the *delivery method* of **Physical Damage** or its source. In others, specific sub-types of **Physical Damage** from the same type of attack will cause different types of immunities to trigger.

### [Weapon Immunity](https://masterofmagic.fandom.com/wiki/Weapon_Immunity "Weapon Immunity") Weapon Immunity

:   *Main article: [Weapon Immunity](https://masterofmagic.fandom.com/wiki/Weapon_Immunity "Weapon Immunity")*

[Weapon Immunity](https://masterofmagic.fandom.com/wiki/Weapon_Immunity "Weapon Immunity") is the weakest type of immunity that works against **Physical Damage**. It is also triggered only in very specific circumstances.

When triggered, [Weapon Immunity](https://masterofmagic.fandom.com/wiki/Weapon_Immunity "Weapon Immunity") sets the target's [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") score to [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **10** while processing the **Physical Damage** component of the attack. Thus, the target makes 10 [Defense Roll](https://masterofmagic.fandom.com/wiki/Defense_Roll "Defense Roll") **Defense Rolls** instead of however many it normally would.

Only [Normal Units](https://masterofmagic.fandom.com/wiki/Normal_Unit "Normal Unit") and [Heroes](https://masterofmagic.fandom.com/wiki/Hero "Hero") will ever trigger [Weapon Immunity](https://masterofmagic.fandom.com/wiki/Weapon_Immunity "Weapon Immunity") in their target, and only while delivering [Melee Damage](https://masterofmagic.fandom.com/wiki/Melee_Damage "Melee Damage") (a sub-type of **Physical Damage**).

Also, a [Normal Unit](https://masterofmagic.fandom.com/wiki/Normal_Unit "Normal Unit") must be carrying [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") **Normal Weapons** in order to trigger an enemy's [Weapon Immunity](https://masterofmagic.fandom.com/wiki/Weapon_Immunity "Weapon Immunity"). If the unit has [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") **Magical Weapons** or better, the target's [Weapon Immunity](https://masterofmagic.fandom.com/wiki/Weapon_Immunity "Weapon Immunity") is not triggered.

Similarly, [Heroes](https://masterofmagic.fandom.com/wiki/Hero "Hero") will only trigger a target's [Weapon Immunity](https://masterofmagic.fandom.com/wiki/Weapon_Immunity "Weapon Immunity") if they are not currently holding a [Magical Weapon](https://masterofmagic.fandom.com/wiki/Magical_Item "Magical Item"). Any weapon will give the Hero a magical attack that does not trigger this immunity.

### [Missile Immunity](https://masterofmagic.fandom.com/wiki/Missile_Immunity "Missile Immunity") Missile Immunity

:   *Main article: [Missile Immunity](https://masterofmagic.fandom.com/wiki/Missile_Immunity "Missile Immunity")*

[Missile Immunity](https://masterofmagic.fandom.com/wiki/Missile_Immunity "Missile Immunity") works only when a target is struck by a [Ranged Missile Attack](https://masterofmagic.fandom.com/wiki/Ranged_Missile_Attack "Ranged Missile Attack") **Ranged Missile Attack**, and will temporarily raise the target's [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") score to [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **50** for the purposes of blocking the **Physical Damage** component of that attack. This includes the [Slingers](https://masterofmagic.fandom.com/wiki/Slingers "Slingers")' [Ranged Boulder Attack](https://masterofmagic.fandom.com/wiki/Ranged_Boulder_Attack "Ranged Boulder Attack") **Ranged Attacks** which are missile attacks.

Other types of [Ranged Attacks](https://masterofmagic.fandom.com/wiki/Ranged_Attack "Ranged Attack") (namely [Ranged Boulder Attack](https://masterofmagic.fandom.com/wiki/Ranged_Boulder_Attack "Ranged Boulder Attack") **Ranged Boulder Attacks** and [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **Ranged Magical Attacks**) will not trigger a target's [Missile Immunity](https://masterofmagic.fandom.com/wiki/Missile_Immunity "Missile Immunity").

### [Magic Immunity](https://masterofmagic.fandom.com/wiki/Magic_Immunity "Magic Immunity") Magic Immunity

:   *Main article: [Magic Immunity](https://masterofmagic.fandom.com/wiki/Magic_Immunity "Magic Immunity")*

[Magic Immunity](https://masterofmagic.fandom.com/wiki/Magic_Immunity "Magic Immunity") is triggered whenever a target is struck by [Magical Damage](https://masterofmagic.fandom.com/wiki/Magical_Damage "Magical Damage") - the type of **Physical Damage** delivered by [Ranged Magical Attacks](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack"), [Lightning Breath](https://masterofmagic.fandom.com/wiki/Lightning_Breath "Lightning Breath"), and most damage-dealing spells.

Furthermore, [Magic Immunity](https://masterofmagic.fandom.com/wiki/Magic_Immunity "Magic Immunity") will trigger against any attack that delivers either [Fire Damage](https://masterofmagic.fandom.com/wiki/Fire_Damage "Fire Damage") or [Cold Damage](https://masterofmagic.fandom.com/wiki/Cold_Damage "Cold Damage"), which are basically just sub-types of [Magical Damage](https://masterofmagic.fandom.com/wiki/Magical_Damage "Magical Damage").

The resulting effect of triggering a target's [Magic Immunity](https://masterofmagic.fandom.com/wiki/Magic_Immunity "Magic Immunity") differs based entirely on the method of delivery of this damage:

* When [Magic Immunity](https://masterofmagic.fandom.com/wiki/Magic_Immunity "Magic Immunity") is triggered by a spell, it basically negates the spell's effect entirely. Thus, spells causing [Magical Damage](https://masterofmagic.fandom.com/wiki/Magical_Damage "Magical Damage"), [Fire Damage](https://masterofmagic.fandom.com/wiki/Fire_Damage "Fire Damage") or [Cold Damage](https://masterofmagic.fandom.com/wiki/Cold_Damage "Cold Damage") will never harm a [Magic-Immune](https://masterofmagic.fandom.com/wiki/Magic_Immunity "Magic Immunity") unit.

* Against [Ranged Magical Attacks](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack"), [Magic Immunity](https://masterofmagic.fandom.com/wiki/Magic_Immunity "Magic Immunity") raises the target's [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") score to [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **50** temporarily, allowing it to block a vast amount of [Damage Points](https://masterofmagic.fandom.com/wiki/Damage_Points "Damage Points") **Damage** on average from the attack.

It is currently unknown which of these two effects occurs against [Breath Attacks](https://masterofmagic.fandom.com/wiki/Breath_Attack "Breath Attack"), but the working theory is that these are blocked entirely - similarly to spells.

### [Fire Immunity](https://masterofmagic.fandom.com/wiki/Fire_Immunity "Fire Immunity") Fire Immunity

:   *Main article: [Fire Immunity](https://masterofmagic.fandom.com/wiki/Fire_Immunity "Fire Immunity")*

[Fire Immunity](https://masterofmagic.fandom.com/wiki/Fire_Immunity "Fire Immunity") is triggered whenever a target is struck by [Fire Damage](https://masterofmagic.fandom.com/wiki/Fire_Damage "Fire Damage") - a specialized sub-type of [Magical Damage](https://masterofmagic.fandom.com/wiki/Magical_Damage "Magical Damage"). [Fire Damage](https://masterofmagic.fandom.com/wiki/Fire_Damage "Fire Damage") is only distinguished from [Magical Damage](https://masterofmagic.fandom.com/wiki/Magical_Damage "Magical Damage") by the fact that it triggers [Magic Immunity](https://masterofmagic.fandom.com/wiki/Magic_Immunity "Magic Immunity") *or* [Fire Immunity](https://masterofmagic.fandom.com/wiki/Fire_Immunity "Fire Immunity"), if either is present in the target.

Again, when [Fire Immunity](https://masterofmagic.fandom.com/wiki/Fire_Immunity "Fire Immunity") is triggered, the target's [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") score is raised to [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **50** for purposes of blocking this incoming damage. Therefore it is virtually impossible to hurt a [Fire-Immune](https://masterofmagic.fandom.com/wiki/Fire_Immunity "Fire Immunity") target using [Fire Damage](https://masterofmagic.fandom.com/wiki/Fire_Damage "Fire Damage").

Note that if the target possesses both [Magic Immunity](https://masterofmagic.fandom.com/wiki/Magic_Immunity "Magic Immunity") *and* [Fire Immunity](https://masterofmagic.fandom.com/wiki/Fire_Immunity "Fire Immunity"), [Fire Damage](https://masterofmagic.fandom.com/wiki/Fire_Damage "Fire Damage") will only trigger one of these (doesn't matter which one) - causing the target's [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") score to be raised to [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **50**, not [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **100**.

### [Cold Immunity](https://masterofmagic.fandom.com/wiki/Cold_Immunity "Cold Immunity") Cold Immunity

:   *Main article: [Cold Immunity](https://masterofmagic.fandom.com/wiki/Cold_Immunity "Cold Immunity")*

[Cold Immunity](https://masterofmagic.fandom.com/wiki/Cold_Immunity "Cold Immunity") is triggered whenever a target is struck by [Cold Damage](https://masterofmagic.fandom.com/wiki/Cold_Damage "Cold Damage") - a specialized sub-type of [Magical Damage](https://masterofmagic.fandom.com/wiki/Magical_Damage "Magical Damage"). [Cold Damage](https://masterofmagic.fandom.com/wiki/Cold_Damage "Cold Damage") is only distinguished from [Magical Damage](https://masterofmagic.fandom.com/wiki/Magical_Damage "Magical Damage") by the fact that it can trigger [Magic Immunity](https://masterofmagic.fandom.com/wiki/Magic_Immunity "Magic Immunity") *or* [Cold Immunity](https://masterofmagic.fandom.com/wiki/Cold_Immunity "Cold Immunity"), if either is present in the target.

Again, when [Cold Immunity](https://masterofmagic.fandom.com/wiki/Cold_Immunity "Cold Immunity") is triggered, the target's [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") score is raised to [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **50** for purposes of blocking this incoming damage. Therefore it is virtually impossible to hurt a [Cold-Immune](https://masterofmagic.fandom.com/wiki/Cold_Immunity "Cold Immunity") target using [Cold Damage](https://masterofmagic.fandom.com/wiki/Cold_Damage "Cold Damage").

Note that if the target possesses both [Magic Immunity](https://masterofmagic.fandom.com/wiki/Magic_Immunity "Magic Immunity") *and* [Cold Immunity](https://masterofmagic.fandom.com/wiki/Cold_Immunity "Cold Immunity"), [Cold Damage](https://masterofmagic.fandom.com/wiki/Cold_Damage "Cold Damage") will only trigger one of these (doesn't matter which one) - causing the target's [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") score to be raised to [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **50**, not [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **100**.

## Tandem Damage

While many **Physical Damage** attacks deliver only **Physical Damage** of one type or another, a few of them are or can be augmented with additional [Damage Types](https://masterofmagic.fandom.com/wiki/Damage_Type "Damage Type") that will make this **Physical Damage** more effective.

This is called "tandem damage delivery", because two or more damage types are delivered simultaneously by the same attack. The **Physical Damage**
component of such an attack is the only component that's actually
responsible for harming the target, while the tandem damage components
make that task easier.

This also means that if the **Physical Damage**
is blocked by any of the target's immunities (see previous chapter),
the effect of the tandem damage component is meaningless, since it
causes no harm on its own.

Tandem damage types include:

* [Illusion Damage](https://masterofmagic.fandom.com/wiki/Illusion_Damage "Illusion Damage")
* [Armor Piercing Damage](https://masterofmagic.fandom.com/wiki/Armor_Piercing_Damage "Armor Piercing Damage") (sometimes known as "Lightning Damage")

### Illusion Damage

:   *Main article: [Illusion Damage](https://masterofmagic.fandom.com/wiki/Illusion_Damage "Illusion Damage")*

[Illusion Damage](https://masterofmagic.fandom.com/wiki/Illusion_Damage "Illusion Damage") is fairly rare, and is found as a tandem component in the attacks of units possessing the [Illusion](https://masterofmagic.fandom.com/wiki/Illusion "Illusion") ability, as well as [Heroes](https://masterofmagic.fandom.com/wiki/Hero "Hero") holding certain [Magical Weapons](https://masterofmagic.fandom.com/wiki/Magical_Item "Magical Item").

When [Illusion Damage](https://masterofmagic.fandom.com/wiki/Illusion_Damage "Illusion Damage") is dealt together with **Physical Damage** in the same attack, the target is not allowed to make any [Defense Roll](https://masterofmagic.fandom.com/wiki/Defense_Roll "Defense Roll") **Defense Rolls** during the process of dealing that **Physical Damage**. This means that the **Physical Damage** process, as described in this article, relies entirely on [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit** rolls, giving the target no chance to defend itself.

The [Illusion Damage](https://masterofmagic.fandom.com/wiki/Illusion_Damage "Illusion Damage") component is cancelled when used against targets possessing [Illusion Immunity](https://masterofmagic.fandom.com/wiki/Illusion_Immunity "Illusion Immunity") - such targets *can* make [Defense Roll](https://masterofmagic.fandom.com/wiki/Defense_Roll "Defense Roll") **Defense Rolls** as normal.

### Armor Piercing Damage

:   *Main article: [Armor Piercing Damage](https://masterofmagic.fandom.com/wiki/Armor_Piercing_Damage "Armor Piercing Damage")*

[Armor Piercing Damage](https://masterofmagic.fandom.com/wiki/Armor_Piercing_Damage "Armor Piercing Damage") is an uncommon tandem component that's usually added to a unit's attacks via the [Armor Piercing](https://masterofmagic.fandom.com/wiki/Armor_Piercing "Armor Piercing") ability. Furthermore, the [Lightning Breath](https://masterofmagic.fandom.com/wiki/Lightning_Breath "Lightning Breath") **Lightning Breath**
attack and most lightning-based spells deliver this damage as well,
resulting in it sometimes being referred to as "Lightning Damage". [Heroes](https://masterofmagic.fandom.com/wiki/Hero "Hero") may also acquire [Armor Piercing Damage](https://masterofmagic.fandom.com/wiki/Armor_Piercing_Damage "Armor Piercing Damage") through [Magical Weapons](https://masterofmagic.fandom.com/wiki/Magical_Item "Magical Item").

When [Armor Piercing Damage](https://masterofmagic.fandom.com/wiki/Armor_Piercing_Damage "Armor Piercing Damage") is dealt together with **Physical Damage** in the same attack, the target may only make half as many [Defense Roll](https://masterofmagic.fandom.com/wiki/Defense_Roll "Defense Roll") **Defense Rolls** as it normally would. This makes it much easier for the **Physical Damage** component to hurt the target, particularly if the target was heavily-armored to begin with.

There is no immunity that cancels the effect of [Armor Piercing Damage](https://masterofmagic.fandom.com/wiki/Armor_Piercing_Damage "Armor Piercing Damage"), so it is quite reliable. Of course, if the **Physical Damage** component does trigger any of the target's immunities, then [Armor Piercing Damage](https://masterofmagic.fandom.com/wiki/Armor_Piercing_Damage "Armor Piercing Damage") has no effect at all.

## The Many Names of Physical Damage

One of the purposes of the *Master of Magic Wiki* is to attempt
to analyze and explain the inner workings of the game. This can be very
difficult to do, since many of the rules are filled with exceptions and
are very complex to begin with. Thus, many concepts have had to be
invented in order to try and keep things simple. This isn't always an
easy task.

**Physical Damage** was the name given to the entirety of [Damage Types](https://masterofmagic.fandom.com/wiki/Damage_Type "Damage Type") that involve [To Hit](https://masterofmagic.fandom.com/wiki/To_Hit "To Hit") **To Hit** and [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **Defense** rolls, as explained above in this article. **Physical Damage**
was invented in order to refrain from re-explaining things over and
over whenever discussing various attack types and damage types, but it
doesn't solve all the complexity. There are still many different ways
that **Physical Damage** is handled, as explained in the chapters on immunities and tandem damage above.

To make things a little easier to read, this Wiki often refers to different "sub-types" of **Physical Damage**
by different names. Although they behave the same, they are often
delivered differently or have slightly-different effects. This chapter
explains the different names of **Physical Damage** used throughout the wiki, why they are used, and what they mean when used.

### Melee Damage

:   *Main article: [Melee Damage](https://masterofmagic.fandom.com/wiki/Melee_Damage "Melee Damage")*

[Melee Damage](https://masterofmagic.fandom.com/wiki/Melee_Damage "Melee Damage") is the name given to the **Physical Damage** delivered by any [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack").

When the term [Melee Damage](https://masterofmagic.fandom.com/wiki/Melee_Damage "Melee Damage") is used, it will always refer to the damage delivered at the *very end* of the attack (or sometimes just before the end, such as when attacks employ [First Strike](https://masterofmagic.fandom.com/wiki/First_Strike "First Strike") to reorganize the combat sequence). The amount of [Melee Damage](https://masterofmagic.fandom.com/wiki/Melee_Damage "Melee Damage") an attack delivers is based on the unit's [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") **Melee Attack** strength.

This is important because some [Melee Attacks](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") deliver several separate instances of **Physical Damage**. For example, an attacker possessing a [Thrown Attack](https://masterofmagic.fandom.com/wiki/Thrown_Attack "Thrown Attack") **Thrown Attack** will deliver **Physical Damage** from this attack when melee combat begins, and then [Melee Damage](https://masterofmagic.fandom.com/wiki/Melee_Damage "Melee Damage") at the end of the attack. Similarly, units with a [Fire Breath](https://masterofmagic.fandom.com/wiki/Fire_Breath "Fire Breath") **Breath Attack** of any kind will also deliver **Physical Damage** as part of that attack, prior to delivering [Melee Damage](https://masterofmagic.fandom.com/wiki/Melee_Damage "Melee Damage").

To summarize, whenever the term "[Melee Damage](https://masterofmagic.fandom.com/wiki/Melee_Damage "Melee Damage")" is mentioned, it refers only to that damage that a [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") delivers near the very end of the attack process, and whose amount is based mostly or entirely on the unit's [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") **Melee Attack** strength. A [Melee Attack](https://masterofmagic.fandom.com/wiki/Melee_Attack "Melee Attack") may deliver additional **Physical Damage**, which would then be referred to separately as appropriate.

### Ranged Damage

:   *Main article: [Ranged Damage](https://masterofmagic.fandom.com/wiki/Ranged_Damage "Ranged Damage")*

All [Ranged Attacks](https://masterofmagic.fandom.com/wiki/Ranged_Attack "Ranged Attack") deliver **Physical Damage**, though it behaves a little differently based on which type of [Ranged Attack](https://masterofmagic.fandom.com/wiki/Ranged_Attack "Ranged Attack") a unit is using - whether it is a [Ranged Missile Attack](https://masterofmagic.fandom.com/wiki/Ranged_Missile_Attack "Ranged Missile Attack") **Missile**, [Ranged Boulder Attack](https://masterofmagic.fandom.com/wiki/Ranged_Boulder_Attack "Ranged Boulder Attack") **Boulder**, or [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **Magical** attack. This makes things a lot harder to explain without using very very long sentences.

The term [Ranged Damage](https://masterofmagic.fandom.com/wiki/Ranged_Damage "Ranged Damage") was invented to describe any **Physical Damage** as coming from a [Ranged Attack](https://masterofmagic.fandom.com/wiki/Ranged_Attack "Ranged Attack"), without specifying the attack's type. In other words, **Physical Damage** from any of the three [Ranged Attack](https://masterofmagic.fandom.com/wiki/Ranged_Attack "Ranged Attack") types is often called [Ranged Damage](https://masterofmagic.fandom.com/wiki/Ranged_Damage "Ranged Damage") - for simplicity's sake.

This can get very confusing since, again, the damage from each attack is sometimes handled differently. For example, **Physical Damage** from a [Ranged Missile Attack](https://masterofmagic.fandom.com/wiki/Ranged_Missile_Attack "Ranged Missile Attack") **Ranged Missile Attack** will trigger a target's [Missile Immunity](https://masterofmagic.fandom.com/wiki/Missile_Immunity "Missile Immunity"), while damage from a [Ranged Boulder Attack](https://masterofmagic.fandom.com/wiki/Ranged_Boulder_Attack "Ranged Boulder Attack") **Ranged Boulder Attack** will not.

Therefore, the term [Ranged Damage](https://masterofmagic.fandom.com/wiki/Ranged_Damage "Ranged Damage") should be used only when discussing damage coming from a [Ranged Attack](https://masterofmagic.fandom.com/wiki/Ranged_Attack "Ranged Attack") of *any* kind. If it is necessary to distinguish between them, extra explanations can be used, particularly denoting the type of attack.

### Magical Damage

:   *Main article: [Magical Damage](https://masterofmagic.fandom.com/wiki/Magical_Damage "Magical Damage")*

[Magical Damage](https://masterofmagic.fandom.com/wiki/Magical_Damage "Magical Damage") is one of the most confusing terms used on this wiki, since it lumps together a whole bunch of **Physical Damage** instances delivered by all sorts of attacks and from all kinds of sources. The main thing that all [Magical Damage](https://masterofmagic.fandom.com/wiki/Magical_Damage "Magical Damage") has in common is that it will trigger a target's [Magic Immunity](https://masterofmagic.fandom.com/wiki/Magic_Immunity "Magic Immunity") (if it has this ability), in one way or another.

All **Physical Damage** spells are said to deliver [Magical Damage](https://masterofmagic.fandom.com/wiki/Magical_Damage "Magical Damage") - and they will all be completely blocked if the target has [Magic Immunity](https://masterofmagic.fandom.com/wiki/Magic_Immunity "Magic Immunity"), as explained earlier. None of this damage will ever hurt the target in any way!

The same thing goes for spell effects that deliver **Physical Damage**, such as the [Wall of Fire](https://masterofmagic.fandom.com/wiki/Wall_of_Fire "Wall of Fire") spell, [Magic Vortex](https://masterofmagic.fandom.com/wiki/Magic_Vortex "Magic Vortex"), [Meteor Storm](https://masterofmagic.fandom.com/wiki/Meteor_Storm "Meteor Storm"), and a whole slew of others. Again, if a target possesses [Magic Immunity](https://masterofmagic.fandom.com/wiki/Magic_Immunity "Magic Immunity"), the spell effect will deal no damage to it whatsoever.

The term [Magical Damage](https://masterofmagic.fandom.com/wiki/Magical_Damage "Magical Damage") is also sometimes used to refer to the **Physical Damage** caused by a [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **Magical Ranged Attack**, since it also triggers the target's [Magic Immunity](https://masterofmagic.fandom.com/wiki/Magic_Immunity "Magic Immunity"). In this case, the target's [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") score is raised to [Defense](https://masterofmagic.fandom.com/wiki/Defense "Defense") **50**,
rather than just blocking all damage outright. Of course, things get a
little complicated since, given what's explained in the previous
section, a [Ranged Magical Attack](https://masterofmagic.fandom.com/wiki/Ranged_Magical_Attack "Ranged Magical Attack") **Magical Ranged Attack** is also said to deliver [Ranged Damage](https://masterofmagic.fandom.com/wiki/Ranged_Damage "Ranged Damage"). Depending on the context, either term (and usually both) is appropriate.