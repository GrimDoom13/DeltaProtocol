/*
 * Delta Squad — single-source item/codex database.
 *
 * WHY THIS FILE EXISTS
 * ---------------------
 * Today every item (vest, weapon, grenade, equipment, attachment) is written out
 * as a hardcoded <li> block directly inside the HTML — and because the same
 * weapon list is needed in two weapon slots, the same grenade list in five
 * grenade slots, and the same equipment list in three equipment slots, each
 * list is copy-pasted 2-5 times per page, and AGAIN across invintory.html and
 * Atachments.html.
 *
 * That's the root cause of at least one confirmed bug already found in the
 * live site: the "Breach Drone Beaver" entry in invintory.html's 2nd and 3rd
 * equipment dropdowns has the WRONG description (the Oxygen Tank's text),
 * because it was copy-pasted and only the 1st copy was ever edited correctly.
 * See SUGGESTIONS.md for the full list of drift bugs this caused.
 *
 * This file is the fix: every item is defined exactly ONCE. render-engine.js
 * reads this data and builds the dropdown/codex HTML at runtime. Add a new
 * grenade here, and it instantly appears correctly in all 5 grenade slots —
 * no hunting through the HTML for copies to update.
 *
 * Every entry below was transcribed verbatim from the current HTML so this is
 * a drop-in replacement, not a redesign. The one exception: known copy-paste
 * bugs are fixed here and flagged with a "FIXED:" comment so you can see
 * exactly what changed and why.
 */

const GameData = {

  // ---- Vest / body armor (invintory.html .Vest_Grp) ----------------------
  // `effects` mirrors script.js's vestConfigurations object. Keeping the
  // slot/HP bonuses on the item itself (instead of a second lookup table
  // keyed by display-name string) means a renamed vest can't silently lose
  // its bonuses the way it can today.
  //
  // NOTE — small deliberate addition, not just a transcription: the original
  // vest dropdown has no "Nothing" option, so once a vest is picked there is
  // no way to unequip it from the UI (only the untouched initial state counts
  // as no-vest). Added a "none" entry here to close that gap; delete it if
  // you'd rather keep vests as a one-way choice.
  vests: [
    { id: "none", name: "Nothing", image: "Media/UiElements/Nothing.jpg", cost: 0,
      description: "No item selected.", effects: {} },
    { id: "civilian", name: "Civilian Clothes", image: "Media/UiElements/Vests/Civilian Clothing.jpg", cost: 1,
      description: "In civilian clothes, only one small weapon and one magazine for it can be concealed. | Civilian clothes ≠ body armor, meaning any hit on you will be critical. | In the civilian backpack: | 2 grenades can be placed (changeable via skills) | 2 special equipment. | Only one magazine per weapon can be taken. (Cannot take a magazine for a heavy weapon). | +2 STEALTH | Movement + 2",
      effects: { equipmentSlots: 2, grenadeSlots: 2, assultMagazine: 1, heavyAssaultMegazin: 1, pistolMegazin: 1, bonusStealth: 2 } },
    { id: "civilian2", name: "Civilian Clothes LVL2", image: "Media/UiElements/Vests/Civilian Clothing LVL2.jpg", cost: 2,
      description: "In civilian clothes, only one small weapon and one magazine for it can be concealed. | Civilian clothes are reinforced with Kevlar, so the fighters do not only receive critical hits. In the civilian backpack, | 2 grenades can be placed (changeable via skills) | 2 special equipment. | Only one magazine per weapon can be taken. (Cannot take a magazine for a heavy weapon) | +2 STEALTH | Movement + 2",
      effects: { equipmentSlots: 2, grenadeSlots: 2, assultMagazine: 1, heavyAssaultMegazin: 1, pistolMegazin: 1, bonusStealth: 2 } },
    { id: "light", name: "Light Vest", image: "Media/UiElements/Vests/LightArmor.jpg", cost: 3,
      description: "Allows carrying 4 magazines for assault weapons (or 1 magazine for heavy assault weapons) | 3 magazines for pistols | 2 grenades | 1 special equipment. | Grants a chance to evade attacks (30%).",
      effects: { equipmentSlots: 1, grenadeSlots: 2, assultMagazine: 4, heavyAssaultMegazin: 1, pistolMegazin: 3 } },
    { id: "light2", name: "Light Vest LVL2", image: "Media/UiElements/Vests/LightArmor LVL2.jpg", cost: 4,
      description: "Allows carrying 4 magazines for assault weapons (or 1 magazine for heavy weapons) | 3 magazines for pistols | 2 grenades | 1 special equipment. | Gives a chance to dodge attacks (30%). | MAX HP +7",
      effects: { equipmentSlots: 1, grenadeSlots: 2, assultMagazine: 4, heavyAssaultMegazin: 1, pistolMegazin: 3, bonusMaxHP: 7 } },
    { id: "medium", name: "Medium Vest", image: "Media/UiElements/Vests/MediumArmor.jpg", cost: 2,
      description: "Allows carrying 6 magazines for assault weapons (or 2 magazines for heavy assault weapons) | 4 magazines for pistols | 3 grenades | 3 special equipment.",
      effects: { equipmentSlots: 3, grenadeSlots: 3, assultMagazine: 6, heavyAssaultMegazin: 2, pistolMegazin: 4 } },
    { id: "medium2", name: "Medium Vest LVL2", image: "Media/UiElements/Vests/MediumArmor LVL2.jpg", cost: 3,
      description: "Allows carrying 6 magazines for assault weapons (or 2 magazines for heavy weapons) | 4 magazines for pistols | 3 grenades | 3 special equipment. | MAX HP +9",
      effects: { equipmentSlots: 3, grenadeSlots: 3, assultMagazine: 6, heavyAssaultMegazin: 2, pistolMegazin: 4, bonusMaxHP: 9 } },
    { id: "heavy", name: "Heavy Vest", image: "Media/UiElements/Vests/HeavyArmor.jpg", cost: 3,
      description: "Allows carrying 3 magazines for heavy assault weapons (or 10 magazines for regular assault weapons) | 5 magazines for pistols | 2 grenades | 2 special equipment | A ceramic plate in the armor reduces incoming damage by 1. The plate may break in an explosion.",
      effects: { equipmentSlots: 2, grenadeSlots: 2, assultMagazine: 10, heavyAssaultMegazin: 3, pistolMegazin: 5 } },
    { id: "heavy2", name: "Heavy Vest LVL2", image: "Media/UiElements/Vests/HeavyArmor LVL2.jpg", cost: 4,
      description: "Allows carrying 3 magazines for heavy assault weapons (or 10 magazines for regular assault weapons) | 5 magazines for pistols | 2 grenades | 2 special equipment | A Ceramic plate in the armor reduces damage taken by 2. The plate might break in an explosion. | + 12 HP | Movement - 2",
      effects: { equipmentSlots: 2, grenadeSlots: 2, assultMagazine: 10, heavyAssaultMegazin: 3, pistolMegazin: 5, bonusMaxHP: 12 } },
    { id: "chemical", name: "Chemical Defense Suit", image: "Media/UiElements/Vests/Chemical Defense Suit.jpg", cost: 4,
      description: "Blocks 3 damage from poisons/gases/acids in one round. | Allows carrying 4 magazines for assault weapons (or 1 magazine for heavy weapons) | 3 magazines for pistols | 2 grenades | 2 special equipment. | + 6 HP | Movement - 1",
      effects: { equipmentSlots: 2, grenadeSlots: 2, assultMagazine: 4, heavyAssaultMegazin: 1, pistolMegazin: 3, bonusMaxHP: 6 } },
    { id: "medical", name: "Medical Vest", image: "Media/UiElements/Vests/Medical Vest.jpg", cost: 4,
      description: "Allows carrying 5 magazines for assault weapons (or 2 magazines for heavy weapons) | 3 magazines for pistols | 2 grenades | 3 special equipment. | Allows healing even after you spent the action on something else. | + 6 HP",
      effects: { equipmentSlots: 3, grenadeSlots: 2, assultMagazine: 5, heavyAssaultMegazin: 2, pistolMegazin: 3, bonusMaxHP: 6 } },
    { id: "spider", name: "Spider suit", image: "Media/UiElements/Vests/Spider suit.jpg", cost: 4,
      description: "Allows carrying 4 magazines for assault weapons (or 1 magazine for heavy weapons) | 3 magazines for pistols | 2 grenades | 1 special equipment | Grappling hook allows you to be pulled into a grab area or targets within 15 meters. | + 6 HP",
      effects: { equipmentSlots: 1, grenadeSlots: 2, assultMagazine: 4, heavyAssaultMegazin: 1, pistolMegazin: 3, bonusMaxHP: 6 } },
  ],

  // ---- MEC Suits (X-COM D&D.pdf p.27, same "ווסתים"/Vests chapter) --------
  // NEW — the missing link for the whole MEC system already captured
  // elsewhere: perks-data.js has the `mecFighter` class perk tree, the
  // per-class `mecSuitBonusByClass`, and the `mecPilot` remote tier, but
  // nothing before this was the actual equippable item you put in the vest
  // slot to become a MEC trooper in the first place. These two are that
  // item. Kept as their own array rather than folded into `vests` above
  // because they're mechanically a different animal — granting STRENGTH and
  // a built-in unarmed attack, not just slot counts and a flat HP/armor
  // bonus — and a UI would likely want to gate them behind "have you reached
  // Major rank in some class" (per mecFighter's own unlock condition) rather
  // than offering them next to a starting Civilian Clothes choice.
  // No clean reference art: the base tier's is an uncredited XCOM 2 game
  // screenshot and the LVL2 tier's is BioWare/EA-watermarked Anthem concept
  // art — both placeholder for now, same policy as the Weapons-chapter pass.
  mecSuits: [
    { id: "mec_suit", name: "MEC Suit", image: "Media/UiElements/Nothing.jpg", cost: 5,
      description: "Allows carrying 3 magazines for heavy assault weapons, 2 grenades, and 2 special equipment. | +8 HP | +2 armor | +5 STRENGTH | The MEC can become 'Living Cover' to shield an ally; requires an action to activate and to maintain. | Flight: for 3 rounds (can be used non-consecutively). | Built-in punch attack: 1D10+STR." },
    { id: "mec_suit_2", name: "MEC Suit LVL2", image: "Media/UiElements/Nothing.jpg", cost: 6,
      description: "Allows carrying 4 magazines for heavy assault weapons, 3 grenades, and 3 special equipment. | +16 HP | +4 armor | +6 STRENGTH | The MEC can become 'Living Cover' to shield an ally; requires an action to activate and to maintain. | Flight: for 6 rounds (can be used non-consecutively). | Built-in punch attack: 1D12+STR." },
  ],

  // ---- Melee (invintory.html .Melee_Grp) ----------------------------------
  melee: [
    { id: "none", name: "Nothing", image: "Media/UiElements/Nothing.jpg", cost: 0, description: "No item selected." },
    { id: "knife", name: "Knife", image: "Media/UiElements/Weapons/Melee/Knife.jpg", cost: 1,
      description: "Effective Range: 0-1 meters | Damage: 1D12 | Special Attack: Can be thrown up to a distance of 12 meters to deal damage | Points Cost: 1" },
    { id: "dildo", name: "Dildo", image: "Media/UiElements/Weapons/Melee/Dildo.png", cost: 1,
      description: "A surprisingly effective melee weapon." },
    { id: "dildo_purple", name: "Dildo_Purple", image: "Media/UiElements/Weapons/Melee/DildoPurple.png", cost: 1,
      description: "A surprisingly effective melee weapon." },
    // NEW from X-COM D&D.pdf p.32-33 (Weapons chapter) — not yet on the site.
    { id: "red_sting", name: "Red Sting", image: "Media/UiElements/Weapons/Melee/Red Sting.png", cost: 2,
      description: "Effective Range: 0-1 meters | Damage: 2D12 | Special Attack: Ignites the blade's built-in flamethrower tank, dealing 1D10 FIRE damage (one charge only) | Points Cost: 2" },
    { id: "zeus", name: "Zeus", image: "Media/UiElements/Weapons/Melee/Zeus.png", cost: 2,
      description: "Effective Range: 0-1 meters | Damage: 1D12 | Special Attack: Electrified melee strike deals 1D4 shock damage (x2 against mechanical/robotic enemies) | Points Cost: 2" },
  ],

  // ---- Main / secondary weapons ------------------------------------------
  // Used by BOTH weapon1 and weapon2 in invintory.html AND Atachments.html —
  // that's 4 copies of this exact list in the current HTML, now 1.
  mainWeapons: [
    { id: "none", name: "Nothing", image: "Media/UiElements/Nothing.jpg", cost: 0, description: "No item selected." },
    { id: "m16", name: "M-16", image: "Media/UiElements/Weapons/MainWeapon/M-16.jpg", cost: 2,
      description: "Effective Range: 3-75 meters | Damage: 1D10 | Number of Shots: 4 | Accuracy: 1-2 | Special Attack: Headshot increases crit chance by 2 but reduces hit chance by 2 | Points Cost: 2." },
    { id: "shotgun", name: "ShotGun", image: "Media/UiElements/Weapons/MainWeapon/ShotGun.jpg", cost: 2,
      description: "Effective Range: 3-25 meters | Damage: 1D12 | Number of Shots: 4 | Accuracy: 1-2 | Special Attack: Double Shot (you shoot twice in a row at the same enemy) | Points Cost: 2" },
    { id: "negev", name: "Negev", image: "Media/UiElements/Weapons/MainWeapon/Negev.jpg", cost: 3,
      description: "Effective Range: 5-60 meters | Damage: 1D8 | Number of Shots: 3 (heavy magazines) | Accuracy: 1-3 | Special Attack: At the cost of a magazine, you can hit all enemies in the cone of attack. | Points Cost: 3" },
    { id: "minigun", name: "Minigun", image: "Media/UiElements/Weapons/MainWeapon/Minigun.jpg", cost: 2,
      description: "Effective Range: 5-60 meters | Damage: 1D8+4 | Number of Shots: 5 | Accuracy: 1-3 | Special Attack: Each shot is an explosive shot that breaks enemy shields (-2 shields) | Points Cost: 2 | Disadvantages: Can only be used with MEC suit." },
    { id: "bow", name: "Bow", image: "Media/UiElements/Weapons/MainWeapon/Bow.jpg", cost: 1,
      description: "Effective Range: 3-70 meters | Damage: 1D100 | Number of Shots: 4 | Accuracy: - | Special Attack: Makes any game cool [Types of Arrows]| Points Cost: 1." },
    { id: "vector_smg", name: "VECTOR SMG GEN 2", image: "Media/UiElements/Weapons/MainWeapon/VECTOR SMG GEN 2.jpg", cost: 2,
      description: "Effective Range: 2-50 meters | Damage: 1D6 | Number of Shots: 4 | Accuracy: 1 | Special Attack: Improved ergonomics: Reduces recoil, and allows an additional 1d4 damage per shot. (Once per round) | Points Cost: 2 | Bonus: Can be used in combination with 'Riot Shield'" },
    // FIXED: original data-info-title was "Riot Shield.jpg" (the ".jpg" leaked into the displayed name).
    { id: "riot_shield", name: "Riot Shield", image: "Media/UiElements/Weapons/SecondartWeapon/Riot Shield.jpg", cost: 2,
      description: "Effective Range: 0-1 meters | Damage: 2 | Stability: 5 armor units | Accuracy: - | Special Attack: Creates full cover for you and one ally behind you. | Points Cost: 2 | Disadvantages: Cannot be used simultaneously with a large weapon in your hands, You need to put it behind your back or take a pistol/submachine gun. On the back is not considered cover." },
    { id: "double_barrel", name: "Double-Barreled Shotgun", image: "Media/UiElements/Weapons/MainWeapon/double-barreled shotgun.jpg", cost: 2,
      description: "Effective Range: 1-15 meters | Damage: 1D12 | Number of Shots: 2 | Accuracy: 1 | Special Attack: Knockdown: Each shot has a 50% chance to knock down an enemy if they are within 5 meters. | Points Cost: 2 | Bonus: 2 shots fit into a pistol magazine pocket, 4 shots fit into a regular weapon pocket. Can be used in combination with 'Riot Shield'." },
    { id: "m24", name: "M-24", image: "Media/UiElements/Weapons/MainWeapon/M24.jpg", cost: 3,
      description: "Effective Range: 200-2300 meters | Damage: 1D20 | Number of Shots: 3 | Accuracy: 1-2 | Special Attack: Piercing shot that reduces the target's armor by 2, if any, and deals X2 damage. (Has a cooldown of 2 rounds) | Points Cost: 3 | Disadvantages: Your speed will decrease by 2 meters. Efficiency: Between 200 and 1500 meters (7.62x51mm regular cartridges), Between 1500 and 2300 meters (.470 Nitro Express heavy cartridges)." },
    // FIXED: original data-info-title had a stray leading space: "Pistol ( 911)".
    { id: "pistol_911", name: "Pistol (911)", image: "Media/UiElements/Weapons/SecondartWeapon/Pistol ( 911).jpg", cost: 1,
      description: "Effective Range: 2-20 meters| Damage: 1D4| Number of Shots: 5 | Accuracy: 1 | Special Attack: - Advantage against small targets| Points Cost: 1 | Bonus: Can be used in combination with Riot Shield." },

    // ---- NEW from X-COM D&D.pdf p.28-41 (Weapons + Arsenal Expansion) ----
    // These are upgraded/"magnetic" tiers of weapons already above, plus a
    // second Riot Shield tier — none of these are on the site yet. Translated
    // from the PDF's Hebrew stat blocks. Field name note: the PDF labels this
    // stat "מאצור" (spare magazines carried for the weapon), which existing
    // entries above mistranslate as "Accuracy" (see SUGGESTIONS.md §5) — new
    // entries here use the correct "Spare Magazines" label instead, so expect
    // that wording difference until the older entries get the same fix.
    { id: "m_pistol", name: "M-Pistol", image: "Media/UiElements/Weapons/SecondartWeapon/M-Pistol.png", cost: 2,
      description: "Effective Range: 2-20 meters | Damage: 2D4 | Number of Shots: 5 (small weapon) | Spare Magazines: 1 | Special Attack: Advantage against small targets | Points Cost: 2 | Bonus: Can be used in combination with 'Riot Shield'." },
    // NOTE: no clean unbranded reference image found for MR-19 in the PDF (the
    // embedded image is an unrelated multi-weapon concept-art collage) —
    // falls back to the shared placeholder until real art exists.
    { id: "mr19", name: "MR-19", image: "Media/UiElements/Nothing.jpg", cost: 3,
      description: "Effective Range: 3-75 meters | Damage: 2D10 | Number of Shots: 4 | Spare Magazines: 1-2 | Special Attack: Headshot increases crit chance by 2 but reduces hit chance by 2 | Points Cost: 3." },
    { id: "mag_storm", name: "MAG-STORM", image: "Media/UiElements/Weapons/MainWeapon/MAG-STORM.png", cost: 3,
      description: "Effective Range: 3-25 meters | Damage: 2D12 | Number of Shots: 4 | Spare Magazines: 1-2 | Special Attack: Double Shot (you shoot twice in a row at the same enemy) | Points Cost: 3" },
    // NOTE: PDF's reference image for Railstorm is the same unrelated
    // "TITAN WEAPONS" concept-art collage as MR-19 — placeholder for now.
    { id: "railstorm", name: "Railstorm", image: "Media/UiElements/Nothing.jpg", cost: 4,
      description: "Effective Range: 5-60 meters | Damage: 2D8 | Number of Shots: 3 (heavy magazines) | Spare Magazines: 1-3 | Special Attack: At the cost of a magazine, you can hit all enemies in the cone of attack. | Points Cost: 4" },
    { id: "magnetic_rpg", name: "Magnetic RPG", image: "Media/UiElements/Weapons/MainWeapon/Magnetic RPG.png", cost: 3,
      description: "Effective Range: 10-350 meters | Damage: 3D10, 7-meter splash radius | Number of Shots: 2 | Spare Magazines: 1-4 (missile flies in a random direction) | Special Attack: Can load a grenade-tipped missile to use the grenade's blast radius (area affected x2) plus the grenade's damage (x2) | Points Cost: 3 | Bonus: A hit reduces the target's armor by 3. | Drawbacks: Weapon upgrades and spare magazines don't work on this weapon; the Grenadier class's grenade bonuses don't apply to it." },
    { id: "vector_smg7", name: "VECTOR SMG-7", image: "Media/UiElements/Weapons/MainWeapon/VECTOR SMG-7.png", cost: 3,
      description: "Effective Range: 2-50 meters | Damage: 2D6 | Number of Shots: 4 (small weapon) | Spare Magazines: 1 | Special Attack: Improved ergonomics: Reduces recoil, and allows an additional 1d4 damage per shot. (Once per round) | Points Cost: 3 | Bonus: Can be used in combination with 'Riot Shield'" },
    // NOTE: the PDF names this exactly like the tier-1 "Riot Shield" above but
    // with stronger stats (7 armor units / cost 3 vs. 5 armor units / cost 2)
    // — kept as a distinct "Riot Shield II" entry rather than overwriting the
    // original, since the site needs both to exist as separate choices.
    // Reference image is a Battlefield 2042/EA-branded concept render, so this
    // uses the placeholder instead of copying that art in.
    { id: "riot_shield_2", name: "Riot Shield II", image: "Media/UiElements/Nothing.jpg", cost: 3,
      description: "Effective Range: 0-1 meters | Damage: 2 | Stability: 7 armor units | Special Attack: Creates full cover for you and one ally behind you. | Points Cost: 3 | Disadvantages: Cannot be used simultaneously with a large weapon in your hands, You need to put it behind your back or take a pistol/submachine gun. On the back is not considered cover." },
    // NOTE: PDF's reference image is Killzone/Guerrilla Games concept art with
    // visible studio branding — placeholder used instead.
    { id: "magnetic_handheld_shotgun", name: "Magnetic Handheld Shotgun", image: "Media/UiElements/Nothing.jpg", cost: 3,
      description: "Effective Range: 1-15 meters | Damage: 2D12 | Number of Shots: 2 (small weapon) | Spare Magazines: 1 | Special Attack: Knockdown (passive): each shot has a 50% chance to knock down an enemy if they are within 5 meters. | Points Cost: 3 | Bonus: 2 shots fit into a pistol magazine pocket, 4 shots fit into a regular weapon pocket. Can be used in combination with 'Riot Shield'." },
    { id: "lre_mr", name: "Long-Range Experimental Magnetic Rifle (LRE-MR)", image: "Media/UiElements/Nothing.jpg", cost: 4,
      description: "Effective Range: 100-2500 meters | Damage: 2D20 | Number of Shots: 4 | Spare Magazines: 1-2 | Special Attack: Piercing shot that reduces the target's armor by 2, if any, and deals X2 damage. (Has a cooldown of 2 rounds) | Points Cost: 4 | Disadvantages: Your speed will decrease by 3 meters. Efficiency: Between 100 and 1500 meters (7.62x51mm regular cartridges), Between 1500 and 2500 meters (.470 Nitro Express heavy cartridges)." },
  ],

  // ---- Equipment (invintory.html equipment1/2/3 — was 3 copies) ----------
  equipment: [
    { id: "none", name: "Nothing", image: "Media/UiElements/Nothing.jpg", cost: 0, description: "No item selected." },
    { id: "battle_boost", name: "Battle Boost", image: "Media/UiElements/Equipments/BattelBoost.jpg", cost: 1,
      description: "An injector with a substance that works like the 'Double Time' command." },
    { id: "communication", name: "Communication Device", image: "Media/UiElements/Equipments/Comunication.jpg", cost: 1,
      description: "Allows communication with base and soldiers remotely." },
    { id: "drone", name: "Drone", image: "Media/UiElements/Equipments/Dron.jpg", cost: 3,
      description: "For situational assessment (limited to a range of 25 meters from the owner)." },
    { id: "fulton", name: "Fulton Device", image: "Media/UiElements/Equipments/Fulton.jpg", cost: 1,
      description: "A device that uses a balloon to extract people/infected from the battlefield." },
    { id: "insta_heal", name: "Insta-Heal", image: "Media/UiElements/Equipments/InstaHeal.jpg", cost: 2,
      description: "A device that automatically injects medication in case of serious injury, gives the character a chance to survive. +1 HP after a fall." },
    { id: "medkit", name: "MedKit", image: "Media/UiElements/Equipments/MedKit.jpg", cost: 2,
      description: "Allows you to heal." },
    { id: "night_vision", name: "Night Vision Goggles", image: "Media/UiElements/Equipments/NightVision.jpg", cost: 2,
      description: "Allows you to see well in the dark and shoot without 'disadvantage.'" },
    { id: "shockwave", name: "Shockwave Device", image: "Media/UiElements/Equipments/ShokWave.jpg", cost: 3,
      description: "When pressed, creates an electric shockwave that shocks enemies within a 4-meter radius. (One-time use)" },
    { id: "welding_tool", name: "Welding Tool", image: "Media/UiElements/Equipments/Svarka.jpg", cost: 1,
      description: "Allows you to weld a metal door so that it will not open or vice versa, to open a welded door." },
    { id: "tool_kit", name: "Robotic Repair Kit", image: "Media/UiElements/Equipments/ToolKit.jpg", cost: 2,
      description: "Allows you to repair robots." },
    { id: "daze_gun", name: "DazeGun", image: "Media/UiElements/Equipments/DazeGun.jpg", cost: 2,
      description: "2 Range: 10 meters 1D10 to hit (each 1 HP of the enemy gives a 10% chance that they will not be unconscious). 10 HP of the enemy means they have a 100% chance of not losing consciousness. 1 HP of the enemy means they have a 10% chance of not losing consciousness." },
    { id: "combat_drone_wasp", name: "Combat Drone 'Wasp'", image: "Media/UiElements/Equipments/Combat Drone Wasp.png", cost: 3,
      description: "Not for scouting, but it has a weapon that can fly to an enemy and attack the enemy, +3 hit chance, 1d6+1 damage, and then flies back. (Shots: 8)" },
    { id: "defense_drone_turtle", name: "Defense Drone 'Turtle'", image: "Media/UiElements/Equipments/Defense Drone Turtle.png", cost: 3,
      description: "Not for scouting, but it has a device that allows you to improve the target's defense (-2 to hit the target)." },
    { id: "devastation_drone_gypaetus", name: "Devastation Drone 'Gypaetus'", image: "Media/UiElements/Equipments/Devastation Drone Gypaetus.png", cost: 3,
      description: "Not for scouting, but it has cells with explosives that it can drop while flying, causing 20 damage in a 4-meter radius (destroys 4 units of enemy shields) (one time)." },
    // FIXED: in invintory.html's equipment2 & equipment3 dropdowns this entry's
    // description was wrongly copy-pasted from "Oxygen Tank" ("Provides up to 4
    // hours of clean air..."). Restored to the correct text from equipment1.
    { id: "breach_drone_beaver", name: "Breach Drone 'Beaver'", image: "Media/UiElements/Equipments/Breach Drone Beaver.png", cost: 3,
      description: "Not for scouting, but it has a better communication system, which increases the chance of breaching through the drone by +2." },
    { id: "oxygen_tank", name: "Oxygen Tank", image: "Media/UiElements/Equipments/Oxygen Tank.png", cost: 1,
      description: "Provides up to 4 hours of clean air in normal conditions. (Pressure, panic, and even underwater use can significantly shorten the duration)." },
    // NEW from X-COM D&D.pdf p.20 (Unique Equipment chapter) — the only
    // genuinely new item in that whole chapter; everything else there
    // (pages 15-19: all 12 grenades, all 7 weapon attachments, and the other
    // 16 equipment items) turned out to already match this file exactly,
    // confirming those lists were sourced correctly the first time. This one
    // is a craftable item, not a simple point-buy one: it costs points AND
    // consumes harvested "Chryssalid" bodies (Chryssalid is the classic
    // X-COM name for the creature the site's own Codex lists as
    // "Cristolide" — see game-data.js's `codex.enemies`), AND has a hard
    // stock limit — none of which the current {image,cost,description}
    // shape has fields for, so those extra facts are folded into the prose
    // description instead of being dropped.
    { id: "chryssalid_light_armor", name: "Chryssalid-Plate Light Armor", image: "Media/UiElements/Nothing.jpg", cost: 2,
      description: "Light armor built from a Chryssalid-type exoskeleton (see 'Cristolide' in the Enemies codex). Grants +2 armor. Crafting ratio: 4 harvested Chryssalid bodies = 1 armor point (so this +2 version consumes 8 bodies). Only 32 exist in total — a hard stock limit, not a per-mission cap." },
  ],

  // ---- Grenades (invintory.html granade1-5 — was 5 identical copies) -----
  grenades: [
    { id: "none", name: "Nothing", image: "Media/UiElements/Nothing.jpg", cost: 0, description: "No item selected." },
    { id: "clamor_mine", name: "Clamor Mine", image: "Media/UiElements/Granades/Clamor.jpg", cost: 1,
      description: "A wire between two points that will cause an explosion when stepped on, 10 damage, 5-meter radius." },
    { id: "flame_grenade", name: "Flame Grenade", image: "Media/UiElements/Granades/FlameGranade.jpg", cost: 1,
      description: "Covers an area with fire causing 3 persistent fire damage for 4 rounds, radius 2 meters." },
    { id: "flashbang", name: "Flashbang", image: "Media/UiElements/Granades/FlashBang.jpg", cost: 1,
      description: "Blinds everyone in a 6-meter radius. The target is blinded for 2 rounds. Easier to hit, harder for them to hit someone. Their speed is halved." },
    { id: "frag_grenade", name: "Frag Grenade", image: "Media/UiElements/Granades/Granate.jpg", cost: 1,
      description: "Deals 7 damage and destroys cover. Reduces the target's armor by 1, if any, radius 3 meters." },
    { id: "smoke_grenade", name: "Smoke Grenade", image: "Media/UiElements/Granades/SmokkeGranade.jpg", cost: 1,
      description: "Creates a smoke cloud for 3 rounds that makes it difficult to hit a target in the smoke and to hit a target through the smoke, radius 6." },
    { id: "magnetic_grenade", name: "Magnetic Grenade", image: "Media/UiElements/Granades/Magnetic Grenade.png", cost: 1,
      description: "Attracts enemies and objects within a 3-meter radius." },
    { id: "decoy_grenade", name: "Decoy Grenade", image: "Media/UiElements/Granades/Decoy Grenade.png", cost: 2,
      description: "Creates a hologram of a soldier and can provoke an enemy attack. The hologram has 20 HP." },
    { id: "door_breacher", name: "Door Breacher", image: "Media/UiElements/Granades/Door Breacher.png", cost: 1,
      description: "Explosive gel that, after being smeared on the wall, explodes and creates a 'new door' to the room." },
    { id: "emp_grenade", name: "EMP Grenade", image: "Media/UiElements/Granades/EMP Grenade.png", cost: 1,
      description: "Blocks abilities and disables drones/automatic machine gun turrets for one round. In a 5-meter radius." },
    { id: "panic_gas_grenade", name: "Panic Gas Grenade", image: "Media/UiElements/Granades/Panic Gas Grenade.png", cost: 1,
      description: "Enemies in the area of effect perform a WILL check or suffer a panic effect. Radius of 4 meters." },
    { id: "proximity_mine", name: "Proximity Mine", image: "Media/UiElements/Granades/Mine.png", cost: 1,
      description: "12 damage, 5-meter radius." },
    { id: "safety_grenade", name: "Safety Grenade", image: "Media/UiElements/Granades/SafetyGranade.png", cost: 1,
      description: "These grenades are designed for combat in a space where it is necessary to damage a group of enemies without causing damage to the surroundings. Deals 7 damage, 3-meter radius." },
  ],

  // ---- Weapon attachments (Atachments.html — primary & secondary share these) ----
  attachments: {
    silencer: [
      { id: "none", name: "Nothing", image: "Media/UiElements/Nothing.jpg", cost: 0, description: "No item selected." },
      { id: "suppressor", name: "Suppressor (Silencer)", image: "Media/UiElements/Atachments/Silens/Suppressor (Silencer).jpg", cost: 1,
        description: "Reduces the firing noise radius to 5 meters." },
      { id: "flash_hider", name: "Flash Hider", image: "Media/UiElements/Atachments/Silens/Flash Hider.jpg", cost: 1,
        description: "You deal +1 damage." },
    ],
    mount: [
      { id: "none", name: "Nothing", image: "Media/UiElements/Nothing.jpg", cost: 0, description: "No item selected." },
      { id: "flashlight", name: "Flashlight", image: "Media/UiElements/Atachments/Mount/Flashlight.jpg", cost: 1,
        description: "Allows you to see and shoot better in the dark (Hit chance +2 but does not cancel disadvantage) also works for allies." },
      { id: "laser_sight", name: "Laser Sight", image: "Media/UiElements/Atachments/Mount/Laser Sight.jpg", cost: 1,
        description: "Critical hit chance +1." },
    ],
    stock: [
      { id: "none", name: "Nothing", image: "Media/UiElements/Nothing.jpg", cost: 0, description: "No item selected." },
      { id: "stock", name: "Stock", image: "Media/UiElements/Atachments/Stock/Stock.jpg", cost: 1,
        description: "You deal 1 damage to the enemy if you miss." },
    ],
    magazine: [
      { id: "none", name: "Nothing", image: "Media/UiElements/Nothing.jpg", cost: 0, description: "No item selected." },
      { id: "extended_magazine", name: "Extended Magazine", image: "Media/UiElements/Atachments/Megazin/Extended Magazine.jpg", cost: 1,
        description: "150% ammunition." },
    ],
    scope: [
      { id: "none", name: "Nothing", image: "Media/UiElements/Nothing.jpg", cost: 0, description: "No item selected." },
      { id: "scope", name: "Scope", image: "Media/UiElements/Atachments/Scope/Scope.jpg", cost: 1,
        description: "Hit chance +1." },
    ],
  },

  // ---- MEC-suit-only weapons (X-COM D&D.pdf p.34-36, Weapons chapter) ----
  // NEW — none of these are on the site. Unlike the mainWeapons list, these
  // aren't safe to drop into the weapon1/weapon2 dropdowns as-is: every one
  // of them is gated behind a "MEC suit" (mentioned in the existing Minigun's
  // own drawback text too — "Can only be used with MEC suit"), and there is
  // currently no MEC-suit slot/equipment anywhere in invintory.html. Treat
  // this array as data staged for when that slot gets built, not something
  // to render into the existing weapon dropdowns yet.
  mecWeapons: [
    { id: "magnetic_mec_minigun", name: "Magnetic MEC-Minigun", image: "Media/UiElements/Weapons/MEC/Magnetic MEC-Minigun.png", cost: 3,
      description: "Effective Range: 5-60 meters | Damage: 2D8+6 | Number of Shots: 5 | Spare Magazines: 1-3 | Special Attack: Each shot is an explosive shot that breaks enemy shields (-3 shields) | Points Cost: 3 | Drawbacks: Can only be used with a MEC suit." },
    // NOTE: PDF's reference image is Titanfall/Respawn Entertainment concept
    // art with a visible studio watermark — placeholder used instead.
    { id: "mec_retractable_blade", name: "MEC Retractable Blade", image: "Media/UiElements/Nothing.jpg", cost: 2,
      description: "Effective Range: 0-3 meters | Damage: 1D12+2+STR | Special Attack: The blade extends up to 30 meters, dealing double damage (retracts if it hits an obstacle first). | Points Cost: 2 | Bonus: Can be used in combination with 'MEC Shield'. | Drawbacks: Can only be used with a MEC suit." },
    // NOTE: PDF's reference image is The Division 2/Ubisoft concept art with
    // a visible studio watermark — placeholder used instead.
    { id: "mec_2tx98", name: "MEC 2TX-98", image: "Media/UiElements/Nothing.jpg", cost: 3,
      description: "Effective Range: 20-450 meters | Damage: 3D12, 7-meter splash radius | Number of Shots: 2 | Spare Magazines: 1-4 (missile flies in a random direction) | Special Attack: Can load a grenade-tipped missile to use the grenade's blast radius (area affected x2) plus the grenade's damage (x2) | Points Cost: 3 | Bonus: A hit reduces the target's armor by 3. | Drawbacks: Weapon upgrades and spare magazines don't work on this weapon; can only be used with a MEC suit; movement/speed penalties don't apply to it." },
  ],

  // ---- Legendary Weapons (X-COM D&D.pdf p.42-43) --------------------------
  // The PDF's own "Legendary Weapons" section has 2 entries: Dildo (already
  // implemented above under `melee` as "Dildo"/"Dildo_Purple" — the PDF
  // treats it as ONE weapon with 3 limited-quantity color variants
  // (purple/black/yellow, "Availability: 3" total), while the site instead
  // modeled it as 2 separate, unlimited items and never added the yellow
  // variant or any scarcity tracking — worth knowing if you want the site to
  // match the rulebook exactly, but not changed here since it's a bigger
  // "limited-quantity items" feature, not a data-entry fix) and Last Bet,
  // added new below.
  legendaryWeapons: [
    // NOTE: PDF's reference image is a copyrighted product photo (visible
    // "kitana.ru" watermark) — placeholder used instead.
    { id: "last_bet", name: "Last Bet", image: "Media/UiElements/Nothing.jpg", cost: 2,
      description: "Effective Range: 2-30 meters | Damage: 1D6 | Number of Shots: 6 (small weapon) | Special Attack (1) 'All In': usable only when exactly one round remains in the cylinder — forfeit your action to reload, then gain +2 to hit and +1D6 damage on your next shot. Once per combat, only while exactly one round remains; if combat ends before you use it, the bonus is lost. | Special Attack (2) 'Aura Farm': costs a WILL(1) check to activate; on a successful hit, deals an extra 1D4 psychological damage, and the target must pass a WILL(10) check or gain the 'Feared' status effect. WILL resets at the end of the mission. | Points Cost: 2 | Bonus: Can be used in combination with 'Riot Shield'. | Availability: 1 (this weapon's quantity is limited)." },
  ],

  // ---- Ammunition (X-COM D&D.pdf p.21-22, "תחמושת") ------------------------
  // NEW — nothing on the site currently has an ammo/arrow-type slot; these
  // are staged data, same as `mecWeapons`/`legendaryWeapons` above. All 10
  // entries are alternate ammunition you load instead of a normal shot, not
  // separate weapons in their own right.
  ammunition: {
    // Bow-only — this is exactly what the Bow's existing flavor text in
    // `mainWeapons` above refers to ("Special Attack: ... [Types of Arrows]").
    // No reference images existed for these in the PDF (just small stock
    // icons of arrowheads), so all fall back to the shared placeholder.
    arrows: [
      { id: "regular_arrow", name: "Regular Arrow", image: "Media/UiElements/Nothing.jpg", cost: 0,
        description: "Damage: 1D10." },
      { id: "rope_arrow", name: "Rope Arrow", image: "Media/UiElements/Nothing.jpg", cost: 0,
        description: "An arrow that sticks to a wall and leaves behind a rope you can use to climb. Damage: 1D6." },
      { id: "explosive_arrow", name: "Explosive Arrow", image: "Media/UiElements/Nothing.jpg", cost: 0,
        description: "Explodes on contact. Deals 2D10 damage and destroys cover. 2-meter radius." },
      { id: "incendiary_arrow", name: "Incendiary Arrow", image: "Media/UiElements/Nothing.jpg", cost: 0,
        description: "Covers an area in fire, dealing 3 fire damage continuously for 3 rounds. 2-meter radius." },
      { id: "electric_arrow", name: "Electric Arrow", image: "Media/UiElements/Nothing.jpg", cost: 0,
        description: "Blocks abilities and disables drones/automatic turrets for one round, within a 3-meter radius. Damage: 2D10 to robots." },
      { id: "radio_arrow", name: "Tracker Arrow", image: "Media/UiElements/Nothing.jpg", cost: 0,
        description: "Detects enemies within 10 meters of impact. Very high chance to break after being fired." },
      { id: "broadhead_arrow", name: "Broadhead Arrow", image: "Media/UiElements/Nothing.jpg", cost: 0,
        description: "Damage: 1D100. Very high chance to break after being fired." },
    ],
    // Special firearm rounds — loaded instead of a weapon's standard
    // ammunition; each trades shots-per-magazine for a situational bonus.
    specialRounds: [
      { id: "incendiary_rounds", name: "Fire Cartridge", image: "Media/UiElements/Nothing.jpg", cost: 1,
        description: "Sets an enemy on fire if you hit, dealing 1D4 fire damage for 3 rounds. Reduces the weapon's number of shots by 1 (cannot go below 1)." },
      { id: "fragmentation_rounds", name: "Fragmentation Rounds", image: "Media/UiElements/Nothing.jpg", cost: 1,
        description: "+1D4 damage against biological enemies, plus 1D4 bleed damage for 2 rounds. But -1 damage against robots. Reduces the weapon's number of shots by 2 (cannot go below 1)." },
      { id: "electric_rounds", name: "Electric Rounds", image: "Media/UiElements/Nothing.jpg", cost: 1,
        description: "+1D8 damage against robots. But -1 damage against biological enemies. Reduces the weapon's number of shots by 2 (cannot go below 1)." },
    ],
  },

  // ---- Codex entries -------------------------------------------------------
  // Same {image, name, description} shape across all 4 Codex_*.html pages —
  // every .codex-btn is convertible to one array entry.
  codex: {
    enemies: [
      { image: "Media/UiElements/Codex/Enemys/Full/Acid Spit.png", thumb: "Media/UiElements/Codex/Enemys/Acid Spit.png", name: "Acid Spitter",
        description: "Thick, covered with growths from which mucus drips. It spits acid, its skin is thick and leathery, covered in sores and tumors." },
      { image: "Media/UiElements/Codex/Enemys/Full/Berserker.png", thumb: "Media/UiElements/Codex/Enemys/Berserker.png", name: "Berserker",
        description: "The Berserker is even larger and more muscular than a normal Muton, with a massive build, incredibly broad shoulders and powerful limbs. They embody brute strength and unbridled aggression, and their appearance emphasizes their purpose as close-combat fighters. This unit is designed to deal heavy damage and tear enemies apart. | *HP*:45~75" },
      { image: "Media/UiElements/Codex/Enemys/Full/Brain.png", thumb: "Media/UiElements/Codex/Enemys/Brain.png", name: "Brain",
        description: "Infected with high mental activity, capable of controlling other infected. The brain is not protected by the skull, it has tentacles growing from the back. | Infected with telepathic abilities and long tentacles on his back used for attacks. | *HP*:30~60" },
      { image: "Media/UiElements/Codex/Enemys/Full/Cristolide.png", thumb: "Media/UiElements/Codex/Enemys/Cristolide.png", name: "Cristolide",
        description: "The Crystolid is covered in a dark carapace, and its sharp, serrated claws are designed to tear through armor. The massive, predatory body resembles a giant ant. The poisonous mandibles, shimmering with toxic red. Judging by their action on the battlefield, the Crystolids are not just animal monsters, but intelligent creatures. | *HP*: 15~20 | *Shields* : 1 Reduces damage taken. | *Armor* : 2 Reduces the chance of hitting him. | *Jump*: Can move 5 meters in one jump. | *Claw Strike* : ~5 + (Severely poisons the target). | *Poisonous Bite* : Killing with a bite, the Crystolid turns the target into a zombie." },
      { image: "Media/UiElements/Codex/Enemys/Full/Electric Wanderer.png", thumb: "Media/UiElements/Codex/Enemys/Electric Wanderer.png", name: "Electric Wanderer",
        description: "Skinny, covered in electrical discharges. With elongated limbs and a thin face. The eyes glow with an ominous blue light. | A very fast electrified infected that recovers from electricity. | *HP*:~15" },
      { image: "Media/UiElements/Codex/Enemys/Full/Flamethrower.png", thumb: "Media/UiElements/Codex/Enemys/Flamethrower.png", name: "Flamethrower",
        description: "Large and gangly, with visible swellings and blisters on the skin. His body constantly heats up, making him unstable. | * Weaknesses* : Slow and predictable in movement. Sensitive to cold and attacks from a long distance. | * HP * : 50~70 |  * Fire Spit * : Fire projectile ~4 (Lightly sets the target on fire). | * Flamethrower* : Cone of fire ~5 (Sets the target on fire heavily.) (Sets the ground on fire). | * Flaming Fist* : ~5 (Sets the target on fire). | * Explosion on death* : Radius of 2 Meters ~6 + (Sets the target on fire heavily)." },
      { image: "Media/UiElements/Codex/Enemys/Full/Flyer.png", thumb: "Media/UiElements/Codex/Enemys/Flyer.png", name: "Flyer",
        description: "The upper part of a regular Infected but equipped with alien technology. Its main purpose is to quickly penetrate enemy lines, gather intelligence and attack key targets. Thanks to its advanced technology, the Flyer is capable of delivering surprise attacks." },
      { image: "Media/UiElements/Codex/Enemys/Full/Infected Birds.png", thumb: "Media/UiElements/Codex/Enemys/Infected Birds.png", name: "Infected Birds 'Guardians of the Sky'",
        description: "A flock of small birds with mutated beaks and blood-red eyes. Their feathers have fallen out, replaced by hard scales.There are at least 8 individuals in one flock. | *HP*: ~2 (for each bird)." },
      { image: "Media/UiElements/Codex/Enemys/Full/Infected Dog.png", thumb: "Media/UiElements/Codex/Enemys/Infected Dog.png", name: "Infected Dog 'Clawed'",
        description: "A medium-sized dog with scaly fur and exposed, inflamed skin. It has elongated fangs and claws on its paws due to a painful mutation. | Strengths: Fast running, strong bites, can deal damage with claws. | Weaknesses: Low resistance to fire. | Abilities: Pack (attack in a group with other infected dogs). | *HP*:  7 | Bite: ~3 , Claws: ~2" },
      { image: "Media/UiElements/Codex/Enemys/Full/Infected Monkey_Trickster.png", thumb: "Media/UiElements/Codex/Enemys/Infected Monkey_Trickster.png", name: "Infected Monkey_Trickster",
        description: "Lithe, with tumors on her arms and chest. Her eyes glow a bright green, suggesting an infection." },
      { image: "Media/UiElements/Codex/Enemys/Full/Infected Shark.png", thumb: "Media/UiElements/Codex/Enemys/Infected Shark.png", name: "Infected Shark",
        description: "A massive shark with mutated features, its skin is covered in ulcers and tumors. Its jaws have become even more massive, and its teeth have acquired a sharpened shape. Its eyes glow with an ominous red light. Its fins are enlarged and covered in spikes, and its body exudes the smell of decay and blood. | * HP * 123-135" },
      { image: "Media/UiElements/Codex/Enemys/Full/Infected Soldier.png", thumb: "Media/UiElements/Codex/Enemys/Infected Soldier.png", name: "Infected Soldier",
        description: "Infected Soldier with rotten flesh are usually in the armor that they wore during life, they are dull but capable of using tools like weapons. | *HP*:7~10" },
      { image: "Media/UiElements/Codex/Enemys/Full/Infected.png", thumb: "Media/UiElements/Codex/Enemys/Infected.png", name: "Infected",
        description: "Infected People with rotten flesh are very stupid. | *HP*:1~4" },
      { image: "Media/UiElements/Codex/Enemys/Full/Infested Rat.png", thumb: "Media/UiElements/Codex/Enemys/Infested Rat.png", name: "Infected Rat 'Cannibal'",
        description: "A pack of Rats, covered in sores and scars. Eyes cloudy and filled with blood." },
      { image: "Media/UiElements/Codex/Enemys/Full/Mentor.png", thumb: "Media/UiElements/Codex/Enemys/Mentor.png", name: "Mentor",
        description: "A tall, thin alien with long limbs and glowing eyes. His skin shimmers with metal and changes color.According to the data received from the Gamma squad and the Delta squad, this creature is not infected. It has strong telepathic and telekinetic abilities.Sensitive to bright light." },
      { image: "Media/UiElements/Codex/Enemys/Full/Mooton.png", thumb: "Media/UiElements/Codex/Enemys/Mooton.png", name: "Mooton",
        description: "Mootons are massive, muscular creatures with powerful torsos and massive arms. They are taller than the average human, with broad shoulders and a menacing stance. Their skin is rough-textured and has a reddish or brownish-red hue, which emphasizes their aggressive nature.Using an alien assault rifle and grenades, this unit represents the aliens' main fighting force." },
      { image: "Media/UiElements/Codex/Enemys/Full/Outsider.png", thumb: "Media/UiElements/Codex/Enemys/Outsider.png", name: "Outsider",
        description: "His figure appears to be created or formed from energy rather than flesh and blood, making him unique among other enemies. After this unit dies, there is practically nothing left but a broken crystal. Apparently, this creature was controlling the alien ship." },
      { image: "Media/UiElements/Codex/Enemys/Full/Ram_BruceBanner.png", thumb: "Media/UiElements/Codex/Enemys/Ram_BruceBanner.png", name: "Ram 'Bruce Banner'",
        description: "A huge infected with powerful armor, capable of breaking through fortifications. The body is covered with spines and thick skin. | *HP*:~130" },
      { image: "Media/UiElements/Codex/Enemys/Full/Screamer.png", thumb: "Media/UiElements/Codex/Enemys/Screamer.png", name: "Screamer",
        description: "A strange creature resembling a cross between a human and a bird, with a huge mouth covered with many small teeth. Makes a piercing scream." },
      { image: "Media/UiElements/Codex/Enemys/Full/Seeker.png", thumb: "Media/UiElements/Codex/Enemys/Seeker.png", name: "Seeker",
        description: "Seeker is a flying alien that looks like a metal octopus with four tentacles. It can become invisible and moves by flying. Its tentacles are equipped with high-tech devices that can be used for attack and defense. | *HP* :12~15" },
      { image: "Media/UiElements/Codex/Enemys/Full/Shadow.png", thumb: "Media/UiElements/Codex/Enemys/Shadow.png", name: "Shadow",
        description: "A flexible, mutant with gray, hairless skin. It has elongated limbs and glowing eyes. Moves quickly, almost silently. | When first meeting him, he killed 'Delta 2'. | *Strengths* : Stealth and speed. Can approach targets undetected and ambush. | *Weaknesses* : Light armor and sensitivity to bright light. Suffering from increased vulnerability to fire. | *Abilities* : Claw strike (inflicts poison effect), long-range jump. ~4 + ~2 Poison Damage | *HP*:12" },
      { image: "Media/UiElements/Codex/Enemys/Full/Tearer.png", thumb: "Media/UiElements/Codex/Enemys/Tearer.png", name: "Tearer",
        description: "Medium height with mutilated limbs, which the mutation turned into claws. His muscles are constantly tense, which gives him impressive strength." },
      // FIXED: in Codex_Enemy.html both of these had data-name="Tearer" (copy-paste
      // of the entry above), which breaks anything that identifies an entry by
      // name and makes two unrelated monsters display as "Tearer" in the list.
      // Named them after their own image/thumb instead; descriptions kept as-is
      // ("????" looks like a placeholder the writer hasn't filled in yet).
      { image: "Media/UiElements/Codex/Enemys/Full/Fugu.png", thumb: "Media/UiElements/Codex/Enemys/Fugu.png", name: "Fugu",
        description: "????" },
      { image: "Media/UiElements/Codex/Enemys/Full/Ghost.png", thumb: "Media/UiElements/Codex/Enemys/Ghost.png", name: "Ghost",
        description: "Better than Nomad ." },
    ],

    allies: [
      { image: "Media/UiElements/Codex/Allies/Full/Marina Novikova.png", thumb: "Media/UiElements/Codex/Allies/Marina Novikova.png", name: "Marina Novikova",
        description: "*Appearance: * 165 cm, slim, with short brown hair and green eyes. She often wears glasses for electronics work but uses contact lenses during missions. | * Features: * Marina is known for her ability to infiltrate the most complex locations silently. She has a small scar on her right cheek from a fight with an infected. She is a master with a knife and prefers light gear to maintain her mobility. | * Codename *: 'Shadow' | * Age * : 28 years | * Class * : Scout | * Rank *: Lieutenant (סגן) * Family status * : Single | * Blood type * : A+ | * Missions completed *: 6" },
      // FIXED: thumbnail caption text read "Alina Petrovar" (typo) even though
      // data-name was correctly "Alina Petrova" — the name field is now the
      // single source, so this typo can't resurface.
      { image: "Media/UiElements/Codex/Allies/Full/Alina Petrova.png", thumb: "Media/UiElements/Codex/Allies/Alina Petrova.png", name: "Alina Petrova",
        description: "* Appearance * : 160 cm, slim, with long blonde hair usually braided, and blue eyes. Her face is always friendly, even in the most challenging moments. | * Features *: Alina is known for her kindness and compassion, making her an excellent medic. She always carries a medallion with an angel on it, a gift from her mother. She is extremely attentive to details and capable of providing medical aid in the most extreme conditions. Codename: 'Angel' | * Age * : 27 years | *Class * : Medic | * Rank * : Sergeant (סמל) | * Family status * : Single | * Blood type *: AB- | * Missions completed * : 3" },
    ],

    personal: [
      // FIXED: data-name had a stray trailing "r" ("Bradfordr").
      { image: "Media/UiElements/Codex/Personal/Full/Senior Officer Bradford.png", thumb: "Media/UiElements/Codex/Personal/Senior Officer Bradford.png", name: "Senior Officer Bradford",
        description: "Command Center" },
      { image: "Media/UiElements/Codex/Personal/Full/Dr. Raymond Shen.png", thumb: "Media/UiElements/Codex/Personal/Dr. Raymond Shen.png", name: "Raymond Shen",
        description: "Engineering Department" },
      { image: "Media/UiElements/Codex/Personal/Full/Dr. Moira Vahlen.png", thumb: "Media/UiElements/Codex/Personal/Dr. Moira Vahlen.png", name: "Dr. Moira Vahlen",
        description: "laboratory" },
    ],

    // Codex_MemoryRoom.html currently renders the exact same 20 enemy entries
    // as Codex_Enemy.html (word-for-word) instead of actual memory-room
    // content — see SUGGESTIONS.md. Left empty here rather than guessing at
    // what should go here; fill this in with the real memories/flashbacks
    // content once written, and MemoryRoom.html will pick it up automatically.
    memoryRoom: [],
  },
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = GameData;
}
