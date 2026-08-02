/*
 * Delta Squad — Base chapter data, translated from
 * Delta_Main_Players_Info/X-COM D&D.pdf, pages 52-66 ("בסיס" / Base).
 *
 * The Base is run by 3 department heads — Dr. Raymond Shen (Engineering),
 * Dr. Moira Vahlen (Laboratory), Senior Officer Bradford (Command) — who are
 * already on the site as-is: `game-data.js`'s `codex.personal` array has all
 * three (same names, same department one-liners), so this file is the deep
 * version of those 3 codex entries.
 *
 * Each department has a research tree (2-4 projects, each with an LVL1
 * unlock and — if the source shows one — a locked LVL2 that requires LVL1
 * first) plus its own unique system built on top:
 *  - Shen (Engineering): cybernetic enhancements (replace a body part with a
 *    bionic one) + the Tarantula combat robot.
 *  - Vahlen (Laboratory): gene mods (splice captured-enemy DNA into a
 *    soldier) + a mutant combat dog.
 *  - Bradford (Command): the Squad Commander's Order-style unlocks — and
 *    this is where skils.html's `baseAbilities` array actually comes from;
 *    every one of its 6 entries (Artillery, Air Support, Teamwork, Return
 *    Fire, Run and Gun, Simulator Training) matches a Command research
 *    unlock here word-for-word, confirming that part of skils.html is
 *    already sourced correctly + a War Dog unit (distinct from Vahlen's
 *    mutant dog — same shape, different stats).
 *
 * TRANSLATION CONFIDENCE: same caveat as perks-data.js — this is a first
 * pass on dense Hebrew read visually page by page. A couple of gene-mod
 * cells are marked (translation uncertain).
 *
 * GENE MODS CROSS-REFERENCE: most gene mods are unlocked by capturing a
 * specific enemy alive — `unlockCreature` names the enemy. Most already
 * match an entry in `game-data.js`'s `codex.enemies` (matched by name where
 * the spelling differs, e.g. "Ram" here = "Ram 'Bruce Banner'" there,
 * "Berserk" here = "Berserker" there). Two do NOT exist in the codex yet:
 * "Bloodthirsty Leviathan" and "Vennomorph" — new creature names surfaced by
 * this chapter, not yet written up anywhere else on the site.
 */

const BaseData = {

  departments: {
    engineering: {
      leadName: "Dr. Raymond Shen",
      hebrewLeadTitle: "המחלקה ההנדסית",
      researchTree: [
        { id: "new_weapons", name: "New Weapons", hebrewName: "נשקים חדשים",
          lvl1: ["Unlocking new and stronger weapons.", "Improvements to existing weapons."],
          lvl2Locked: true },
        { id: "new_grenades_equipment_drones", name: "New Grenades / Equipment / Drones", hebrewName: "רימונים חדשים / ציוד / רחפנים חדשים",
          lvl1: [
            "Grenades with advanced effects (like slow, paralysis).",
            "Grenades with an increased blast area.",
            "Scout drones with improved sensors.",
            "Combat drones with attack and defense capability.",
          ],
          lvl2: ["Holographic decoy tech, a freeze grenade, a mine, C4+, and a weaponized drone."],
          lvl2Locked: true },
        { id: "mec_armor_upgrades", name: "MEC Suit / Stock Armor Upgrades", hebrewName: "שדרוג חליפת MEC / שדרוג שריון מלאי",
          lvl1: ["Increasing the number of slots in stock armor.", "Improved protective vests with increased defense."],
          lvl2: ["Armor with a grappling hook, dual-layer armor, an improved larger medium armor, and larger stock capacity."],
          lvl2Locked: true },
        { id: "biotech_research", name: "Biotechnology Research", hebrewName: "מחקרים ביוטכנולוגיים",
          lvl1: ["Development of implants and prostheses with improved characteristics.", "Biotechnology for faster recovery and improved health."],
          lvl2: ["Replacing organs and body parts with implants for a permanent improvement, plus a robot helper in place of a soldier."],
          lvl2Locked: true },
      ],
    },

    laboratory: {
      leadName: "Dr. Moira Vahlen",
      hebrewLeadTitle: "מעבדה",
      researchTree: [
        { id: "new_stimulants", name: "New Stimulants", hebrewName: "סטימולנטים חדשים",
          lvl1: ["Stimulants that boost various characteristics for a limited time (strength, agility, endurance...).", "Antibodies and serums against various infections."],
          lvl2: ["A regeneration injector, a 'Hide in Shadows' injector, a reinforcement injector, and other injectors. +1 point when choosing equipment."],
          lvl2Locked: true },
        { id: "virus_research", name: "Virus & Retrovirus Research", hebrewName: "מחקר וירוסים",
          lvl1: ["Improving understanding of the virus's nature, enabling more effective countermeasures.", "Developing experimental treatments for infected characters."],
          lvl2: ["'Immunomodulator': +50% infection resistance for the mission's duration; reduces infection effects on soldiers (e.g. less damage, shorter duration); reduces panic chance when encountering infected enemies. +1 point when choosing equipment."],
          lvl2Locked: true,
          notes: [
            "Campaign-progress flavor line: 'The virus's spread rate has decreased slightly.'",
            "Unlocks the Vaccine V-04 already captured as `researchRewards` in mechanics-data.js.",
            "'Good Preparation' unlock: +1 point when choosing equipment.",
          ] },
      ],
    },

    command: {
      leadName: "Senior Officer Bradford",
      hebrewLeadTitle: "מרכז הפיקוד",
      researchTree: [
        { id: "intel_and_tactics", name: "Intel & Tactics", hebrewName: "מודיעין וטקטיקה",
          lvl1: [
            "Improving mission intel for tactical advantages.",
            "Ability to perform early scouting operations.",
            "Ability to bring a vehicle on a mission.",
          ],
          lvl2: [
            "'Good Preparation': +1 point when choosing equipment.",
            "'Air Support': call in artillery (25m radius, 5D100 damage) or an airstrike (a 3m-wide, 50m-long path, 5D10 damage) — once per mission. (Matches skils.html's baseAbilities 'ארטילריה'/'סיוע אווירי' exactly.)",
            "'Intel Support': reveals, before the mission starts, where large enemy groups are concentrated and what enemy types to expect.",
            "'Code Word': you can now speak 10 words per turn instead of the base rule's 6 (see mechanics-data.js's `coreMechanics.combat`).",
          ],
          lvl2Locked: true },
        { id: "training_and_simulations", name: "Training & Simulations", hebrewName: "הדרכה ואימונים",
          lvl1: [
            "Training programs to improve characters' skills.",
            "Combat simulators for difficult missions.",
            "Ability to bring a combat dog on a mission (one dog per soldier).",
          ],
          lvl2: [
            "'Run and Gun': move and fire at the end of your movement. (2-round cooldown) (Matches skils.html's baseAbilities exactly.)",
            "'Teamwork': a soldier can grant a teammate one extra action, once per mission. (Matches skils.html exactly.)",
            "'Resistance/Muscle Training': choose a permanent +1 Stealth OR +1 Strength.",
            "'Trained Hand': you can take a pistol or knife without risking wasted points. (This appears to be the intended source of the per-item Pistol/Knife cost discounts in script.js's `costReductions` — see SUGGESTIONS.md §1.1 for why those discounts don't currently fire in-game.)",
            "'Return Fire': once per round, fire your pistol at whoever attacked you. (Matches skils.html exactly.)",
            "'Endurance Training': +2 max HP.",
            "'Simulator Training': once per mission, reroll any one die and take the new result. (Matches skils.html exactly.)",
          ],
          lvl2Locked: true },
      ],
    },
  },

  // ---- Cybernetic Enhancements (Shen, p.54-56) -----------------------------
  // Each replaces the listed body part; incompatible with any "biological"
  // version of the same enhancement (i.e. gene mods on the same slot,
  // below) — pick cybernetic OR genetic for a given body part, not both.
  cyberneticEnhancements: [
    { id: "adaptive_skin", name: "Adaptive Skin Implant", slot: "skin",
      effect: "Reduces damage from environmental effects (acid, fire, etc.) by 1.",
      howItWorks: "Nano-bots create a layer of bio-organic protective skin that adapts to the environment and attacking factors, increasing the soldier's survival odds.",
      incompatibleWith: "biological skin enhancements (gene mods)" },
    { id: "nano_heart", name: "Mechanical Heart with Nano-Robot Integration", slot: "heart",
      effect: "Increases a physical characteristic by +1, up to 6 times per mission (once every 60 seconds).",
      howItWorks: "A mechanical heart releases nano-bots to deliver an adrenaline burst on demand.",
      incompatibleWith: "biological heart enhancements (gene mods)" },
    { id: "hybrid_prosthesis", name: "Hybrid Bionic Prosthesis", slot: "arm",
      effect: "Grants the ability to use a concealed bladed weapon called 'Mantis.'",
      howItWorks: "Built on 'Meld,' combining bionic and organic components into a hybrid weapon with improved body function.",
      mantisWeaponStats: { range: "0-2 meters", damage: "2D10", specialAttack: "Melts 2 units of the target's armor, if any.", cost: 0 },
      incompatibleWith: "biological arm enhancements (gene mods)" },
    { id: "bionic_lungs", name: "Bionic Lungs", slot: "lungs",
      effect: "Grants the ability to breathe in any condition (underwater, in a toxic cloud) unless actively being choked/strangled.",
      howItWorks: "A full lung replacement engineered to filter incoming air and prevent the wearer from becoming infected.",
      incompatibleWith: "biological lungs enhancements (gene mods)" },
  ],

  // ---- Gene Mods (Vahlen) ---------------------------------------------------
  // Splice captured-enemy DNA into a soldier. Rule: only one module per body
  // part, and switching your choice later costs additional MELD. Each entry
  // not marked "Access Granted" (i.e. free/always available) requires
  // capturing a live specimen of `unlockCreature` first.
  geneMods: {
    brain: [
      { id: "instant_learning_chip", name: "Instant Learning Chip", accessGranted: true,
        description: "A chip that stimulates memory use.",
        effect: "Medical Skill +2 OR Engineering Skill +2." },
      { id: "mentor_defense", name: "Mental Defense (Mentor)", unlockCreature: "Mentor",
        description: "Strengthens the soldier's defense against mental attacks.",
        effect: "Protects against mental control and panic." },
      { id: "brain_resilience", name: "Mental Resilience (Brain)", unlockCreature: "Brain",
        description: "Strengthens the soldier's defense against mental attacks.",
        effect: "+3 WILL." },
      { id: "mec_fighter_shield", name: "Mental Shield (MEC Fighter)", unlockCreature: "MEC Fighter",
        description: "Strengthens the soldier's defense against mental attacks.",
        effect: "'Energy Shield': creates an energy field that absorbs up to 10 damage for 3 rounds. (5-round cooldown)",
        note: "unlockCreature 'MEC Fighter' has no matching entry in codex.enemies — implies enemy MEC troopers exist somewhere (ADVENT-equivalent forces?), not yet documented elsewhere on the site." },
    ],
    eyes: [
      { id: "hyper_reactive_stimulants", name: "Hyper-Reactive Stimulants", accessGranted: true,
        description: "Allows you to quickly correct [reflexive aim errors]. (translation uncertain on the exact mechanism)",
        effect: "+2 accuracy after a miss." },
      { id: "infected_armored_skin_vision", name: "Dark Vision (Infected)", unlockCreature: "Infected",
        description: "Allows you to see in the dark.",
        effect: "Your eyes adjust to darkness within 10 seconds." },
      { id: "thermal_vision", name: "Thermal Vision (Flamethrower)", unlockCreature: "Flamethrower", accessGranted: true,
        description: "Allows you to see enemies' heat signatures.",
        effect: "Can detect enemies hidden behind cover or in smoke.",
        note: "Listed as 'Access Granted' in the source despite naming a creature — possibly already unlocked in this campaign, or a formatting inconsistency in the PDF." },
      { id: "depth_perception", name: "Depth Perception (Bloodthirsty Leviathan)", unlockCreature: "Bloodthirsty Leviathan",
        description: "Allows you to better judge range.",
        effect: "+2 accuracy and +2 crit chance when you have a height advantage.",
        note: "unlockCreature 'Bloodthirsty Leviathan' has no matching entry in codex.enemies — a new creature name not documented elsewhere on the site yet." },
    ],
    chest: [
      { id: "combat_pheromones", name: "Combat Pheromones", accessGranted: true,
        description: "Pheromone-secreting glands.",
        effect: "Releases pheromones after a kill: you and nearby allies (4m) gain 'Rage,' doubling (x2) melee damage within 4 meters." },
      { id: "improved_heart_tearer", name: "Improved Heart (Tearer)", unlockCreature: "Tearer",
        description: "Increases stamina and health-recovery rate.",
        effect: "Restores 1d4 HP at the end of every combat turn." },
      { id: "acidic_blood", name: "Acidic Blood (Acid Spit)", unlockCreature: "Acid Spitter",
        description: "Releases acid when you're wounded, damaging the attacker.",
        effect: "Enemies that hit you in melee (up to 4 meters) take 1d6 acid damage." },
      { id: "improved_strength_berserk", name: "Improved Strength (Berserk)", unlockCreature: "Berserker",
        description: "Infected genes that grant extra strength, spliced into the soldier's DNA.",
        effect: "+3 STRENGTH." },
    ],
    skin: [
      { id: "spider_skin", name: "Spider Skin", accessGranted: true,
        description: "Skin covered in tiny hairs that grip surfaces.",
        effect: "Climb any surface in any direction for 1 minute (5-minute cooldown), at half your normal movement speed." },
      { id: "stone_skin_ram", name: "Stone Skin (Ram)", unlockCreature: "Ram 'Bruce Banner'",
        description: "Strengthens skin defense, making it nearly impenetrable.",
        effect: "+3 armor." },
      { id: "electric_field_wanderer", name: "Electric Field (Electric Wanderer)", unlockCreature: "Electric Wanderer",
        description: "Genes that generate an electric field, spliced into the soldier's DNA.",
        effect: "Enemies within 2 meters take 1d6 shock damage at the start of every turn." },
      { id: "crystalline_invisibility_seeker", name: "Crystalline Invisibility (Seeker)", unlockCreature: "Seeker",
        description: "Skin becomes covered in crystals, rendering the soldier transparent.",
        effect: "Turn invisible at will for 1 minute (5-minute cooldown) — firing a weapon ends it early. (You can still be heard/detected by other means.)" },
    ],
    legs: [
      { id: "sport_legs", name: "Sport Legs", accessGranted: true,
        description: "New, improved leg muscles.",
        effect: "+5 movement speed." },
      { id: "accelerated_reflexes_screamer", name: "Accelerated Reflexes (Screamer)", unlockCreature: "Screamer",
        description: "Powerful legs.",
        effect: "Land from a 25-meter fall without taking damage." },
      { id: "quiet_steps_shadow", name: "Quiet Steps (Shadow)", accessGranted: true,
        description: "Makes the soldier's footsteps quieter, improving stealth.",
        effect: "+3 to stealth rolls." },
      { id: "power_jump_vennomorph", name: "Power Jump (Vennomorph)", unlockCreature: "Vennomorph",
        description: "Lets the soldier jump higher.",
        effect: "+3 meters to jump height.",
        note: "unlockCreature 'Vennomorph' has no matching entry in codex.enemies — a new creature name not documented elsewhere on the site yet." },
    ],
  },

  // ---- Combat Robot (Shen, p.57) -------------------------------------------
  robots: {
    tarantula: {
      name: "Tarantula",
      hebrewName: "טרנטולה",
      description: "A multi-purpose robotic platform built to support field operations.",
      hp: 30,
      armor: "None at the first tier of Biotechnology research.",
      speed: "6 meters",
      powerCells: 2,
      note: "Power cells are spent to activate the special abilities below.",
      weapon: { name: "Heavy Machine Gun", damage: "1d6", range: "2-30 meters" },
      abilities: [
        { name: "Rocket Launcher", damage: "2d8 (2m splash radius)", range: "50 meters",
          description: "Ideal for destroying large groups of enemies or structures." },
        { name: "Drone Dock", effect: "Restores 1d4 HP to an ally (or itself) within a 10-meter radius.",
          description: "Releases a repair drone for damaged allies or itself." },
        { name: "Defense Stance", effect: "Reduces incoming damage by 50% for one round.",
          description: "The Tarantula locks itself in place and reinforces its armor." },
      ],
    },
  },

  // ---- Combat Dogs ----------------------------------------------------------
  // Two distinct units from two different research trees — similar shape,
  // different stats. Note both share the same Pounce/Defense
  // Instinct/Bite ability text almost verbatim.
  combatDogs: {
    // Vahlen's Laboratory-tree dog (mutant/gene-modified).
    labMutant: {
      name: "Combat Dog (Mutant Version)",
      hp: 18,
      speed: "12 meters per action",
      defense: "+1 (small body — enemies need an 11 to hit it instead of 10)",
      abilities: [
        { name: "Pounce Attack", frequency: "once per round",
          description: "The dog can pounce on and knock down an enemy: STR+1D6 attack. On success, the enemy is Knocked Down and loses one action." },
        { name: "Defense Instinct", frequency: "passive, once per round",
          description: "If a player near the dog takes damage, the dog automatically tries to attack the attacker." },
        { name: "Bite", damage: "1D6 + STRENGTH" },
      ],
    },
    // Bradford's Command-tree dog (trained, not genetically modified).
    warDog: {
      name: "War Dog",
      hp: 12,
      speed: "10 meters per action",
      defense: "+1 (small body — enemies need an 11 to hit it instead of 10)",
      characteristics: { detail: 6, engineeringSkills: 0, will: 2, stealth: 3, medicalSkills: 0, strength: 3 },
      abilities: [
        { name: "Threat Sense", frequency: "passive",
          description: "Automatically detects hidden enemies within a 10-meter radius." },
        { name: "Pounce Attack", frequency: "once per round",
          description: "The dog can pounce on and knock down an enemy: 1D6 + STRENGTH attack. On success, the enemy is Knocked Down and loses one action." },
        { name: "Defense Instinct", frequency: "passive, once per round",
          description: "If a player near the dog takes damage, the dog automatically tries to attack the attacker." },
        { name: "Bite", damage: "1D6 + STRENGTH" },
      ],
      note: "The source page also has a named-dog roster checklist (שקד/Shaked and איגור/Igor checked off, אילית/Elit and מילנה/Milena still open) — that's this specific campaign's play state (which named War Dogs have been recruited/lost), not a general rule, so it wasn't carried into this data file.",
    },
  },
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = BaseData;
}
