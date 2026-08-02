/*
 * Delta Squad — core rules reference data, translated from
 * Delta_Main_Players_Info/X-COM D&D.pdf.
 *
 * Separate file from game-data.js (equippable items) and perks-data.js
 * (class progression) on purpose: this is for rules glossaries/lookup
 * tables that other data references by name rather than something a player
 * equips or levels up — starting with Damage Types (p.51), since several
 * weapons/grenades already in game-data.js use these types in their flavor
 * text (e.g. Red Sting's FIRE damage, Zeus's shock damage, Flame Grenade's
 * persistent burn) without the underlying rule being written down anywhere
 * on the site. More core-mechanics chapters (Mechanics p.46-49, "The
 * Consequence of My Decisions" p.50) are natural fits for this same file
 * later.
 */

const MechanicsData = {

  // ---- Damage Types (X-COM D&D.pdf p.51, "סוגי נזק") -----------------------
  // `color` is the PDF's own highlight color for each type's name — kept in
  // case you want the same color-coding in the UI (e.g. tagging a weapon's
  // damage type badge to match).
  damageTypes: [
    { id: "regular", name: "Regular", hebrewName: "רגיל", color: null,
      description: "No advantages or disadvantages." },
    { id: "fire", name: "Fire", hebrewName: "אש", color: "orange",
      description: "Deals additional burning damage at the end of the round to biological enemies, for a set number of rounds or until put out by hand." },
    { id: "electric", name: "Electric", hebrewName: "חשמל", color: "cyan",
      description: "Deals additional electric damage to robotic/mechanical enemies (instant)." },
    { id: "acid", name: "Acid", hebrewName: "חומצה", color: "green",
      description: "Deals additional damage to enemies' shields (instant)." },
    { id: "freeze", name: "Freeze", hebrewName: "קפיאה", color: "blue",
      description: "Can freeze an enemy in place, lasting a set number of rounds." },
    { id: "bleed", name: "Bleed", hebrewName: "דימום", color: "red",
      description: "Deals damage on every action a living biological enemy takes; the bleed persists until treated." },
  ],

  // ---- Research/medical rewards (X-COM D&D.pdf p.44, "מרפ"א") --------------
  // NOTE: this page is NOT a "Ranks" chapter — there isn't a separate one.
  // The military rank ladder (רב טוראי → אלוף משנה, with XP thresholds) is
  // already fully captured as the tier gating in every class's `perkTree` in
  // perks-data.js. This p.44 page is a short, apparently-unfinished catalog
  // (only 2 filled rows, then one blank row in the source) of one-off
  // consumables bought with the harvested materials from missionXP's
  // `materialCurrency` (perks-data.js), not points — presumably tied into
  // the Base/research system (pages 52-66, not yet pulled in).
  researchRewards: [
    { id: "vaccine_v04", name: "Vaccine V-04", stock: 15, costCurrency: "infectedMaterial", costAmount: 1,
      description: "The new vaccine already demonstrates a long-term effect on the organism's stability (lasting 3 days). Neutralizes the first 2 stages of infection/transformation onset per mission. Cost: 1 unit of Infected Material per dose." },
    { id: "mechanical_limb_reconstruction", name: "Mechanical Limb Reconstruction", stock: 2, costCurrency: "meld", costAmount: 1,
      description: "Regrows/replaces a lost limb with a mechanical one. Cost: 1 unit of MELD per procedure." },
  ],

  // ---- Characteristics (X-COM D&D.pdf p.45, "מאפיינים") --------------------
  // The 6 core stats every character has. `creationRule` is the PDF's own
  // character-creation instruction: roll six separate d4s and assign the six
  // results to these six characteristics however you like (a roll-then-
  // point-buy hybrid, not "roll each stat individually").
  creationRule: "When creating a character, roll 6d4 (six separate four-sided dice) and distribute the six results across the characteristics below as you choose.",
  characteristics: [
    { id: "will", name: "WILL",
      description: "Represents the character's willpower and ability to focus during difficult missions. High willpower can increase resistance to pressure/stress during a complex operation." },
    { id: "engineering_skills", name: "ENGINEERING SKILLS",
      description: "Reflects the character's ability to work with machines and computers. A high level of engineering skill can improve hacking performance and allow quick repairs and modifications of equipment." },
    { id: "detail", name: "DETAIL",
      description: "Reflects the character's ability to notice details. A high DETAIL value can help in finding hidden things." },
    { id: "strength", name: "STRENGTH",
      description: "Represents the character's physical strength." },
    { id: "medical_skills", name: "MEDICAL SKILLS",
      description: "Reflects the character's knowledge of first aid and medical treatment on the battlefield." },
    { id: "stealth", name: "STEALTH",
      description: "Shows the character's ability to conceal themselves and move without drawing attention." },
  ],

  // ---- Core Mechanics (X-COM D&D.pdf p.46-49, "מחניקות") -------------------
  // The underlying rules engine everything else in this project assumes.
  coreMechanics: {
    combat: {
      name: "Combat",
      hebrewName: "קרב",
      description: "Alternating turns: first the players move (all simultaneously), then the enemies move. Each player has 2 action points per round, and can speak up to 6 words for free (without spending an action).",
    },

    // Some actions cost 1 action point; a few end your turn immediately no
    // matter how many action points you had left, per the PDF's own split
    // (its list has a visual break between the two groups).
    actions: {
      name: "Actions",
      hebrewName: "פעולה",
      description: "An action point is spent on everything except swapping weapons; some actions end your turn immediately no matter how many action points remain.",
      endsTurnImmediately: [
        "Entering Overwatch (combat-ready stance)",
        "Using a weapon's special attack ability",
        "Hacking",
        "Throwing a grenade",
      ],
      costsOneAction: [
        "Ranged/knife attack",
        "Movement up to STRENGTH+5 meters (inclusive)",
        "Reloading a magazine",
        "Healing wounds / repairing a robot",
        "Giving a Commander Order",
        "Picking up a body",
        "Using a gadget/special equipment",
      ],
    },

    hitChance: {
      name: "Hit Chance",
      hebrewName: "פגיע",
      description: "Roll a D20; you need to roll higher than the listed number to hit. Base: 10 (i.e. roll above 10). Target behind partial cover: 12 (+2 to their defense). Target behind full cover: 14 (+4 to their defense).",
    },

    crit: {
      name: "Critical Hit (CRIT)",
      hebrewName: "קרית",
      description: "Rolling a natural 20 on your hit roll deals double damage.",
    },

    flanking: {
      name: "Flanking",
      hebrewName: "מאגף (flank)",
      description: "When you flank an enemy, your hit-chance threshold drops by 2 (roll above 8 to hit instead of 10), and your crit threshold rises by 4 (roll above 16 for a crit instead of 20).",
    },

    darkness: {
      name: "Darkness / Disadvantage",
      hebrewName: "חושך",
      description: "In darkness it's harder to notice things and hit enemies: you roll with disadvantage. Disadvantage = roll 2D20 for the check and use the LOWER result.",
    },

    // NOTE: "example: 30% evasion" in the source suggests the D10 thresholds
    // below (8-9 / 10) are themselves an example for a specific evasion
    // rating, not a universal fixed rule — a soldier with a different evasion
    // % would presumably use different thresholds. Recorded as given.
    evasion: {
      name: "Evasion / Dodge",
      hebrewName: "התחמקות",
      description: "If you're hit and have an evasion modifier (e.g. Light Vest's 30% evade chance), you may roll a D10 to try to reduce the damage. Example shown for 30% evasion: roll 8-9 → take half damage; roll 10 → take no damage.",
    },

    armorUnits: {
      name: "Armor Units",
      hebrewName: "יחידות שריון",
      description: "When you're hit, you take that much less damage, equal to your armor value (e.g. hit for 4 damage with 3 armor → you take 1 damage).",
    },

    fearAndPanic: {
      name: "Fear / Panic",
      hebrewName: "פחד/פניקה",
      description: "When an ally dies or you take heavy damage, make a WILL(10) save or panic. On failure, your character flees toward the nearest cover within 10 meters and fires on whichever character is closest, ally or enemy. Each turn thereafter, attempt a WILL(8) save to recover (the DC drops by 2 each turn you remain panicked) — until you succeed, you're frozen and can't act.",
    },

    // X-COM D&D.pdf p.50, its own named system — a persistent, cross-session
    // scarring mechanic distinct from (but related to) Fear/Panic above,
    // which only lasts the current encounter. Already in English in the
    // source, no translation needed.
    consequenceOfMyDecisions: {
      name: "The Consequence of My Decisions",
      description: "If your character was mortally wounded but saved, they carry a debuff for the next few sessions, thematically tied to how they received the mortal wound. Debuffs accumulate with each near-death and fade one at a time for each session survived without dying. Dying repeatedly to the same type of enemy leads to a permanent fear of that enemy.",
    },

    overwatch: {
      name: "Overwatch (Combat-Ready Stance)",
      hebrewName: "מצב מוכננות לחימה",
      description: "A stance in which you fire on the next enemy that moves within your line of sight.",
    },

    healingWounds: {
      name: "Healing Wounds",
      hebrewName: "ריפוי פצועים",
      description: "You can heal an ally only if you have the tools (e.g. a medkit): 1 use if you aren't a Medic, 4 uses if you are (matches the Medic class's base ability in perks-data.js). Healing restores HP equal to your MEDICAL SKILLS stat, or MEDICAL SKILLS x2 if you're a Medic.",
    },

    robotRepair: {
      name: "Robot Repair",
      hebrewName: "תיקון רובות",
      description: "Works the same as healing a person, but uses your ENGINEERING SKILLS stat and requires Specialist-class skills.",
    },

    // NOTE: the site's Total Points field in invintory.html shows a hardcoded
    // "/15" cap. Neither number the PDF actually states here (14 base, or 16
    // after Base bonuses) matches 15 — worth checking whether 15 was a
    // deliberate house-rule adjustment or should be dynamic based on your
    // Base's bonuses. See SUGGESTIONS.md for the same note.
    startingPoints: {
      name: "Starting Equipment Points",
      hebrewName: "נקודות",
      description: "At character creation you have 14 points to spend on starting equipment (16 after all of the Base's bonuses). Some classes already come with certain equipment, or can buy specific equipment at a discount.",
    },

    // Confirms and sharpens the mistranslation already flagged in
    // SUGGESTIONS.md §5.1: this is what happens when a weapon's "מאצור"
    // (spare magazines) count is exhausted — nothing to do with accuracy.
    spareMagazines: {
      name: "Spare Magazines (מאצור)",
      hebrewName: "מאצור",
      description: "Once a weapon has no reloads (מאצור) left, it won't fire: the action and the shot are wasted, and you'll need to spend an action to fix/reload it before it can be used again.",
    },
  },

  // Per-soldier starting HP baseline (X-COM D&D.pdf p.49). NOTE: script.js's
  // deltaCharacters give Nomad/FatMan/Artemis/Tiffany MaxHP values of
  // 30/33/30/29 respectively, not a flat 20 — likely covers class/vest/base
  // bonuses stacked on top of this baseline rather than a contradiction, but
  // worth confirming since the PDF states this as a flat, unconditional
  // starting value for "every soldier."
  baseStartingHP: 20,
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = MechanicsData;
}
