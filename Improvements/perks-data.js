/*
 * Delta Squad — Classes & Perks data, translated from
 * Delta_Main_Players_Info/X-COM D&D.pdf, pages 2-14
 * ("כלסים" / Classes, and "רשימת פקודות" / List of Commands).
 *
 * TRANSLATION CONFIDENCE: this is a first-pass translation of a dense,
 * multi-column Hebrew table read visually page-by-page (no OCR/text layer
 * was available to extract verbatim). The numbers (XP thresholds, dice,
 * ranges, cooldowns) were cross-checked carefully and should be reliable;
 * a handful of ability-text cells were genuinely hard to parse and are
 * marked inline with "(translation uncertain)". Please proofread the whole
 * file against the source PDF before treating it as authoritative at the
 * table — a misread perk is worse than a missing one.
 *
 * SCOPE NOTE: nothing on the live site currently uses this data.
 * skils.html has its own, much simpler ability tracker (4 classes, no rank
 * gating, no XP thresholds, choices aren't mutually exclusive) — see
 * SUGGESTIONS.md §6 for how that compares to the real system captured here,
 * and for a naming mismatch this pass turned up between skils.html and the
 * characters' own bios in script.js.
 *
 * SCHEMA
 * - Each class has a `baseAbility` (unlocked for free at rank 1, "רב טוראי")
 *   and a `perkTree`: an array of rank tiers. Each tier is either:
 *     { rank, xp, options: [textA, textB] }   — pick ONE of the two, OR
 *     { rank, xp, passive: text }              — a single ability everyone
 *                                                 at that class gets automatically
 * - Rank names are kept in Hebrew with an English gloss in `rankEn`, since
 *   they're IDF-style ranks (רב טוראי/סמל/סגן/סרן/רב סרן/אלוף משנה) and the
 *   Hebrew is what a DM cross-referencing the PDF will be scanning for.
 */

const PerksData = {

  classes: {
    commander: {
      name: "Squad Commander",
      hebrewName: "מפקד חוליה",
      baseAbility: "You have command points (5) used to grant bonuses to other soldiers. Starts with a communicator and an earpiece that don't take up an inventory slot.",
      perkTree: [
        { rank: "סמל", rankEn: "Sergeant", xp: 230, options: [
          "You always have one grenade of your choice available (it doesn't take up a slot in your vest).",
          "Your support skills count as half of a Specialist's.",
        ] },
        { rank: "סגן", rankEn: "Lieutenant", xp: 666, options: [
          "One extra equipment slot of your choice. +1 equipment points.",
          "+1 command-point choice. +3 command points.",
        ] },
        { rank: "סרן", rankEn: "Captain", xp: 1530, options: [
          "Piercing round: a shot that breaks 1 point of an enemy's armor and adds +3 damage. (3-round cooldown)",
          "+3 damage. (translation uncertain — likely applies to your Order abilities)",
        ] },
        { rank: "רב סרן", rankEn: "Major", xp: 3250, options: [
          "Order — Stand Down: an ally of your choice can act without spending an action this round. (Does not affect that ally's own cooldowns.)",
          "Leadership Aura: +1 WILL and +1 armor for every soldier on the mission.",
        ] },
        { rank: "אלוף משנה", rankEn: "Lieutenant Colonel", xp: 5690, options: [
          "Order — Execution: command everyone to fire at an enemy of your choice; you don't spend an action for this.",
          "Order — Suppress: an enemy of your choice loses their action this round. +3 command points. (translation uncertain)",
        ] },
      ],
    },

    medic: {
      name: "Medic",
      hebrewName: "חובש",
      baseAbility: "Can use a first-aid kit 4 times instead of once. You heal with double effectiveness.",
      perkTree: [
        { rank: "סמל", rankEn: "Sergeant", xp: 230, options: [
          "You can move 5 additional meters.",
          "Recovery Protocol: the drone flies out and heals each soldier with the same effectiveness as you.",
        ] },
        { rank: "סגן", rankEn: "Lieutenant", xp: 666, options: [
          "Recovery Protocol: the drone can remotely use the 'Heal' and 'Stabilize' abilities. The gremlin has one charge (range up to 30 meters).",
          "One extra special-equipment slot. + Damage against Infected increases by 50%.",
        ] },
        { rank: "סרן", rankEn: "Captain", xp: 1530, options: [
          "Recovery Protocol: the drone can remotely use the 'Heal' and 'Stabilize' abilities. The gremlin's charges equal the number of medpacks you carry.",
          "The medpack restores 4 additional HP.",
        ] },
        { rank: "רב סרן", rankEn: "Major", xp: 3250, passive:
          "You may use any item that has a limited number of uses one additional time (does not apply to grenades).",
        },
        { rank: "אלוף משנה", rankEn: "Lieutenant Colonel", xp: 5690, options: [
          "If you scored a kill during your turn, the first hit against you this round deals no damage.",
          "+1 armor.",
        ] },
      ],
    },

    // Hebrew "קלה" literally means "Light" — kept the class's actual kit
    // (ranged precision/crit, pistol-focused) as the English name instead.
    sharpshooter: {
      name: "Sharpshooter",
      hebrewName: "קלה",
      baseAbility: "+2 hit chance. If the enemy is within 10 meters of the weapon's maximum effective range, damage increases by +2.",
      perkTree: [
        { rank: "סמל", rankEn: "Sergeant", xp: 230, options: [
          "Blood Trail: shots deal +1 more damage if the target was already wounded during the current round.",
          "When you shoot a target with a pistol, you don't spend an action to make that attack. (3-round cooldown)",
        ] },
        { rank: "סגן", rankEn: "Lieutenant", xp: 666, options: [
          "Attack from Above: in addition to the usual advantages, grants +1 accuracy and +1 to defense.",
          "Increases pistol damage by 2.",
        ] },
        { rank: "סרן", rankEn: "Captain", xp: 1530, options: [
          "Every kill increases your critical-hit chance by +1, up to a maximum of +4.",
          "Fire your pistol once at every target you can see. (4-round cooldown)",
        ] },
        { rank: "רב סרן", rankEn: "Major", xp: 3250, passive:
          "Every kill scored with a sniper-type weapon refunds the action you spent.",
        },
        { rank: "אלוף משנה", rankEn: "Lieutenant Colonel", xp: 5690, options: [
          "A kill made with a sniper rifle while flanking a target that isn't in cover doesn't cost an action. (translation uncertain)",
          "Fan Fire: fire your pistol three times at the same target. (3-round cooldown)",
        ] },
      ],
    },

    // Hebrew "מטוליסט" — a coined term from "מטול רימונים" (grenade
    // launcher); kept as "Grenadier" to match skils.html's existing key name.
    grenadier: {
      name: "Grenadier",
      hebrewName: "מטוליסט",
      baseAbility: "Can carry 2x grenades. Grenade blast radius and throw range x2 (throw up to 50 meters).",
      perkTree: [
        { rank: "סמל", rankEn: "Sergeant", xp: 230, options: [
          "Grenades deal 3 additional damage.",
          "Your gear includes additional plating layers that reduce explosive damage by 66%.",
        ] },
        { rank: "סגן", rankEn: "Lieutenant", xp: 666, options: [
          "Grants +1 to defense while in a combat-ready (Overwatch) stance. (translation uncertain)",
          "A grenade in its designated equipment slot can be used twice.",
        ] },
        { rank: "סרן", rankEn: "Captain", xp: 1530, options: [
          "Can fire a second Overwatch shot if the first one hits its target.",
          "Fire at a target twice at -2 accuracy. (Does not end your turn.)",
        ] },
        { rank: "רב סרן", rankEn: "Major", xp: 3250, passive:
          "You may use any item that has a limited number of uses one additional time (does not apply to grenades).",
        },
        { rank: "אלוף משנה", rankEn: "Lieutenant Colonel", xp: 5690, options: [
          "Rupture: deals critical damage, and the affected target takes +3 damage from all subsequent attacks. (3-round cooldown)",
          "Grenade radius increases by +1, damage dealt increases by +2, and damage dealt to shields increases by +1.",
        ] },
      ],
    },

    heavy: {
      name: "Heavy",
      hebrewName: "לוחם כבד",
      baseAbility: "The Negev costs 2 points instead of 3. +1 free weapon attachment.",
      perkTree: [
        { rank: "סמל", rankEn: "Sergeant", xp: 230, options: [
          "Lead Rain: can fire two shots for the cost of one action. (2-round cooldown)",
          "Suppressive Fire (costs 2 shots): you fire continuously at one target until their next turn, reducing their accuracy by 3, and you can still hit them if they act. (translation uncertain on the final clause)",
        ] },
        { rank: "סגן", rankEn: "Lieutenant", xp: 666, options: [
          "Your shots can now destroy the enemy's armor (-1 per hit).",
          "Holographic Marker: when you fire, allies attacking the same target gain +1 accuracy.",
        ] },
        { rank: "סרן", rankEn: "Captain", xp: 1530, options: [
          "Can fire a second Overwatch shot if the first one hits its target.",
          "Thermal Ammunition: increases damage dealt to robots by 50%.",
        ] },
        { rank: "רב סרן", rankEn: "Major", xp: 3250, passive:
          "If you are in cover and not being flanked, damage taken is reduced by 2.",
        },
        { rank: "אלוף משנה", rankEn: "Lieutenant Colonel", xp: 5690, options: [
          "+2 armor.",
          "+5 damage for all heavy weapons.",
        ] },
      ],
    },

    specialist: {
      name: "Specialist",
      hebrewName: "מומחה",
      baseAbility: "Certified in technology and can hack computers, doors, and turrets. Drone and shock-device cost only 1 point.",
      perkTree: [
        { rank: "סמל", rankEn: "Sergeant", xp: 230, options: [
          "Attack Protocol: the drone can deliver an electric strike to an enemy for 4 damage (double damage against robots).",
          "The drone can remotely use the 'Heal' and 'Stabilize' abilities. The drone has one charge (up to 25 meters).",
        ] },
        { rank: "סגן", rankEn: "Lieutenant", xp: 666, options: [
          "You can use the drone remotely to hack.",
          "Recovery Protocol: the drone flies out and heals each soldier for 6 HP.",
        ] },
        { rank: "סרן", rankEn: "Captain", xp: 1530, options: [
          "You can use the drone against robots and mechanical targets to hack and take control of them.",
          "Even if you've spent all your actions, you can still enter 'Overwatch' at the end of your turn.",
        ] },
        { rank: "רב סרן", rankEn: "Major", xp: 3250, passive:
          "The drone shields one soldier, granting them +2 to defense (limited) until the start of their next turn.",
        },
        { rank: "אלוף משנה", rankEn: "Lieutenant Colonel", xp: 5690, options: [
          "The drone discharges a powerful electric burst, dealing damage with a chance to stun everyone nearby. (7m radius, 2D20 damage, one-time use)",
          "Every successful shot while in 'Overwatch' grants an additional shot.",
        ] },
      ],
    },

    scout: {
      name: "Scout",
      hebrewName: "סקאוט",
      baseAbility: "+2 to movement in terrain (regardless of terrain type). When the squad is spotted, you remain hidden.",
      perkTree: [
        { rank: "סמל", rankEn: "Sergeant", xp: 230, options: [
          "The ability to pass by enemies without risking detection (once per mission).",
          "+2 to stealth rolls.",
        ] },
        { rank: "סגן", rankEn: "Lieutenant", xp: 666, options: [
          "+2 to detecting enemies and traps.",
          "+1 slot for special gadgets/equipment.",
        ] },
        { rank: "סרן", rankEn: "Captain", xp: 1530, options: [
          "+4 to movement in terrain (regardless of terrain type).",
          "Firing from stealth deals an additional 1D6 damage.",
        ] },
        { rank: "רב סרן", rankEn: "Major", xp: 3250, passive:
          "Firing from stealth has a chance not to reveal you (100% if it was the last enemy in the group, 50% if one enemy remains, 25% if more than one enemy remains in the group).",
        },
        { rank: "אלוף משנה", rankEn: "Lieutenant Colonel", xp: 5690, options: [
          "Allows the Scout to mark an enemy, increasing damage against them by +3 for all squad members for 3 rounds.",
          "When the Scout is revealed, they gain a +10 meter movement-speed bonus for one round and +2 to defense.",
        ] },
      ],
    },
  },

  // ---- MEC suit (page 3 + page 11) ----------------------------------------
  // Not a base class pick — unlocked via the "MEC Pilot" perk at Major rank
  // in any class's tree (see e.g. commander/medic/etc. — actually granted
  // generically; the PDF states it once on p.11's own table rather than
  // per-class, see mecFighter.perkTree below). While worn, a soldier keeps
  // their previous class's passives (per mecFighter.baseAbility) plus one
  // bonus specific to whichever class they came from — that per-class bonus
  // list is `mecSuitBonusByClass` below.
  mecFighter: {
    name: "MEC Trooper",
    hebrewName: "לוחם MEC",
    baseAbility: "Passives from your previous class are retained. Outside the MEC suit, your prosthetics give you +2 STR.",
    perkTree: [
      { rank: "סמל", rankEn: "Sergeant", xp: 230, options: [
        "Power Punch: uses the suit's level to determine how many dice to roll when using this ability.",
        "+2 weapon damage. +2 armor-piercing damage.",
      ] },
      { rank: "סגן", rankEn: "Lieutenant", xp: 666, options: [
        "Grenade Launcher: deals 4d6 damage in a 3-meter radius (up to 2 uses). (2-round cooldown) (range 50 meters)",
        "+2 armor.",
      ] },
      { rank: "סרן", rankEn: "Captain", xp: 1530, options: [
        "Flamethrower: deals 3d8+ fire damage to enemies, plus 1d6 damage per round for 2 more rounds. (up to 2 uses) (range 6 meters) (3-round cooldown)",
        "Overdrive: costs 2 actions instead of 3 (2-round cooldown); while in Overdrive you can run through walls (breaking them).",
      ] },
      { rank: "רב סרן", rankEn: "Major", xp: 3250, passive:
        "The MEC suit can be piloted remotely as an additional combat unit ('MEC Pilot').",
      },
      { rank: "אלוף משנה", rankEn: "Lieutenant Colonel", xp: 5690, options: [
        "In 'Living Cover' stance you gain +2 armor. + Energy Shot: 2D20 damage within a 15-meter radius. (translation uncertain on the exact trigger condition)",
        "Energy Burst: deals 3 damage to everything within a 5-meter radius. No charge limit, but each successive use in the same encounter increases the damage by 3.",
      ] },
    ],
  },

  // Per-class passive bonus granted while wearing the MEC suit (page 3).
  mecSuitBonusByClass: {
    commander: "Detects all hidden enemies and traps within a 10-meter radius.",
    medic: "Allies in 'Living Cover' gain +1 defense.",
    sharpshooter: "Every shot fired without moving gets +1 accuracy and +1 critical-hit chance.",
    grenadier: "Grenade blast radius and throw range x2 (throw up to 50 meters).",
    heavy: "The nearest visible enemy cannot land a critical hit against the MEC trooper.",
    specialist: "A drone built into the suit lets you repair yourself once per mission. +10 Engineering Skills. Certified in technology; can hack computers and doors.",
    scout: "+2 to movement in terrain (regardless of terrain type).",
  },

  // ---- MEC Pilot (page 49) -------------------------------------------------
  // Unlocked by the mecFighter class's own Major-rank perk ("The MEC suit
  // can be piloted remotely as an additional combat unit"). This is a
  // separate, weaker ability tree for controlling the suit BY REMOTE rather
  // than wearing it — same named abilities as mecFighter's tree (Power
  // Punch, Grenade Launcher, Flamethrower, Overdrive, Energy Shot, Energy
  // Burst) but consistently smaller numbers, since nobody's inside the suit
  // taking the risk. Not gated by its own XP thresholds in the source —
  // it's unlocked as a unit (via mecFighter's Major perk) and then these are
  // presumably available as a package, not one at a time; recorded as given.
  mecPilot: {
    name: "MEC Pilot",
    hebrewName: "MEC Pilot",
    description: "Changes to the MEC suit's abilities while used in Pilot mode (remote-controlled) instead of worn. The suit's stats while piloted equal the bonuses it grants its wearer.",
    abilities: {
      "סמל": [
        "+2 weapon damage.",
        "Power Punch: a powerful punch that staggers enemies and destroys devices. Deals 1d10+STR damage.",
      ],
      "סגן": [
        "+1 armor.",
        "Grenade Launcher: deals 1d6 damage in a 3-meter radius. (up to 2 uses) (range 50 meters) (2-round cooldown)",
      ],
      "סרן": [
        "Flamethrower: deals 1d8 damage and sets enemies on fire (additional 1d6 damage per round for 2 rounds). (up to 2 uses) (range 6 meters) (3-round cooldown)",
        "Overdrive: grants 3 actions instead of 2 (2-round cooldown), but costs you 4 HP.",
      ],
      "אלוף משנה": [
        "Energy Shot: 2D20 damage (1D20 if you missed) within a 15-meter radius. (Inaccessible to the suit without a pilot.)",
        "Energy Burst: deals 3 damage to everyone within a 5-meter radius. No charge limit, but each successive use in the same encounter increases the damage by 3.",
      ],
    },
  },

  // ---- Commander's Orders (page 14, "פקודות המפקד") -----------------------
  // A separate list from the perk trees above — these are the abilities the
  // Squad Commander's "command points" (from their baseAbility) are spent on.
  commanderOrders: [
    { id: "target", name: "Target", hebrewName: "מטרה",
      description: "You order your squad to open fire on an enemy of your choice. All attacks against that enemy gain +2 to hit." },
    { id: "special_coordination", name: "Special Coordination", hebrewName: "תיאום מיוחד",
      description: "A soldier given this order performs all of their skill checks with advantage for one minute." },
    { id: "double_time", name: "Double Time", hebrewName: "זמן כפול",
      description: "For the next 3 turns, the soldier gets one extra action; while active, they can fire twice for the cost of two action units. When the effect ends, that soldier becomes dazed." },
    { id: "duel_time", name: "Duel Time", hebrewName: "זמן דו-קרב",
      description: "A soldier under this order deals +3 damage and attacks with advantage if there are no allies within 15 meters." },
    { id: "hide_in_shadows", name: "Hide in the Shadows", hebrewName: "התחבאות בצללים",
      description: "Allies get a +5 stealth bonus for a short time as long as they follow the Commander's orders." },
    { id: "combat_cohesion", name: "Combat Cohesion", hebrewName: "גיבוש קרב",
      description: "All soldiers standing near the Commander gain increased defense and an accuracy bonus when standing next to one another. (Bonus = +1 per adjacent ally.)" },
    { id: "quick_exit", name: "Quick Exit", hebrewName: "יציאה מהירה",
      description: "All allies get a x2 speed bonus for 1-3 turns. (Useful for strategic retreats or regrouping.)" },
    { id: "brave_heart", name: "Brave Heart", hebrewName: "לב אמיץ",
      description: "Can be given to a soldier at any time without spending an action; grants advantage on a panic/fear save. (Can be applied even after the first roll.)" },
  ],

  // ---- Mission XP & resource rewards (page 4) -----------------------------
  // killXp/bodyXp/aliveXp: XP for killing / recovering the body of /
  // capturing alive each target type. `alive` is negative for Civilians and
  // the VIP row because those represent LOSING them, not capturing them.
  missionXP: [
    { target: "Regular Infected", hebrew: "נגוע רגיל", killXp: 1, bodyXp: 1, aliveXp: 3 },
    { target: "Infected Animal", hebrew: "בעל חיים נגוע", killXp: 2, bodyXp: 2, aliveXp: 6 },
    { target: "Weak Unique Infected", hebrew: "נגוע מיוחד חלש", killXp: 3, bodyXp: 3, aliveXp: 9 },
    { target: "Unique Infected Animal", hebrew: "בעל חיים נגוע מיוחד", killXp: 10, bodyXp: 10, aliveXp: 30 },
    { target: "Strong Unique Infected", hebrew: "נגוע מיוחד חזק", killXp: 15, bodyXp: 15, aliveXp: 45 },
    { target: "Regular Aliens", hebrew: "חוצנים רגילים", killXp: 30, bodyXp: 30, aliveXp: 90 },
    { target: "Strong Aliens", hebrew: "חוצנים חזק", killXp: 40, bodyXp: 40, aliveXp: 120 },
    { target: "Alien Leader", hebrew: "מנהיג חוצנים", killXp: 50, bodyXp: 50, aliveXp: 150 },
    { target: "Civilians", hebrew: "אזרחים", killXp: -10, bodyXp: 0, aliveXp: 10,
      note: "killXp here means a civilian died on your watch (penalty); aliveXp means you saved one." },
    { target: "VIP Extraction", hebrew: "חילוץ VIP", killXp: -100, bodyXp: 0, aliveXp: 100,
      note: "killXp here means the VIP was lost (penalty); aliveXp means successful extraction." },
  ],

  // Harvestable material currencies (also page 4) — feed into the Base
  // chapter (pages 52-66), not translated yet.
  materialCurrency: {
    infectedMaterial: { abbreviation: "I.M", xpValue: 30 },
    meld: { abbreviation: "MELD", akaEnglish: "Golden Fog", xpValue: 45 },
    fragmentsOfAlienTech: { abbreviation: "F.O.A.T", xpValue: 55 },
  },

  missionObjectiveXP: {
    primaryObjectiveCompleted: 100,
    primaryObjectiveFailed: -100,
    secondaryObjectiveCompleted: 50,
    secondaryObjectiveFailed: -50,
    missionCompletedSuccessfully: 200,
  },
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = PerksData;
}
