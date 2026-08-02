//Variables
// Single source of truth for the starting equipment point cap (X-COM D&D.pdf
// p.48: 14 base, 16 once the Base's bonuses are unlocked). Change this one
// value to change the cap everywhere — every page's displayed "/N" updates
// itself from this constant on load instead of each page hardcoding its own
// (which is how invintory.html/Atachments.html ended up at "/15" and
// Implants.html at "/14").
const MAX_STARTING_POINTS = 16;

let activeSlot = null;
let totalPoints = 0;
const totalPointsInput = document.querySelector('.TotalPoints');
const itemInfoTitle = document.getElementById('item-info-title');
const itemInfoContent = document.getElementById('item-info-content');
const atachment_con = document.getElementById('Atachment_Con');
let currentSelectedItemTitle = 'Topic-NoN';
let currentSelectedItemContent = 'Content';
let currentSelectedItemWeaponId = null;
let selectedItems = {};
//invintory 
let equipmentSlots = 0;
let grenadeSlots= 0; 
let assultMagazine= 0; 
let heavyAssaultMegazin=0; 
let pistolMegazin=0;

//Characteristics
let MaxHP=0;

// Vest configuration
const vestConfigurations = {
    'Nothing': { equipmentSlots: 0, grenadeSlots: 0, assultMagazine: 0, heavyAssaultMegazin:0, pistolMegazin:0},

    'Civilian Clothes': { equipmentSlots: 2, grenadeSlots: 2, assultMagazine: 1, heavyAssaultMegazin:1, pistolMegazin:1, bonusStealth:2 },
    'Civilian Clothes LVL2': { equipmentSlots: 2, grenadeSlots: 2, assultMagazine: 1, heavyAssaultMegazin:1, pistolMegazin:1, bonusStealth:2 },
    'Light Vest': { equipmentSlots: 1, grenadeSlots: 2, assultMagazine: 4, heavyAssaultMegazin:1, pistolMegazin:3 },
    'Light Vest LVL2': { equipmentSlots: 1, grenadeSlots: 2, assultMagazine: 4, heavyAssaultMegazin:1, pistolMegazin:3, bonusMaxHP:7},
    'Medium Vest': { equipmentSlots: 3, grenadeSlots: 3, assultMagazine: 6, heavyAssaultMegazin:2, pistolMegazin:4 },
    'Medium Vest LVL2': { equipmentSlots: 3, grenadeSlots: 3, assultMagazine: 6, heavyAssaultMegazin:2, pistolMegazin:4, bonusMaxHP:9 },
    'Heavy Vest': { equipmentSlots: 2, grenadeSlots: 2, assultMagazine: 10, heavyAssaultMegazin:3, pistolMegazin:5 },
    'Heavy Vest LVL2': { equipmentSlots: 2, grenadeSlots: 2, assultMagazine: 10, heavyAssaultMegazin:3, pistolMegazin:5, bonusMaxHP:12 },
    'Chemical Defense Suit': { equipmentSlots: 2, grenadeSlots: 2, assultMagazine: 4, heavyAssaultMegazin:1, pistolMegazin:3, bonusMaxHP:6 },
    'Medical Vest': { equipmentSlots: 3, grenadeSlots: 2, assultMagazine: 5, heavyAssaultMegazin:2, pistolMegazin:3, bonusMaxHP:6 },
    'Spider suit': { equipmentSlots: 1, grenadeSlots: 2, assultMagazine: 4, heavyAssaultMegazin:1, pistolMegazin:3, bonusMaxHP:6 },
    
};

function updateInfoPanel(title, content) {
    if (itemInfoTitle) {
        itemInfoTitle.textContent = title || 'Topic-NoN';
    }
    if (itemInfoContent) {
        itemInfoContent.innerHTML = ''; 
        if (content) {
            const lines = content.split(' | ');
            const ulElement = document.createElement('ul');
            ulElement.style.listStyleType = 'none';
            ulElement.style.paddingLeft = '0';

            lines.forEach(line => {
                const liElement = document.createElement('li');
                liElement.textContent = line.trim();
                ulElement.appendChild(liElement);
            });
            itemInfoContent.appendChild(ulElement);
        } else {
            itemInfoContent.textContent = 'Content';
        }
    }
}

function getCurrentVestType() {
    const vestItem = selectedItems['vest'];
    if (vestItem && vestItem.title) {
        return vestItem.title;
    }
    return 'Nothing'; // Default vest type
}

function getBaseSlotCounts() {
    const currentVestType = getCurrentVestType();
    const vestConfig = vestConfigurations[currentVestType];
    
    if (vestConfig) {
        return {
            equipmentSlots: vestConfig.equipmentSlots,
            grenadeSlots: vestConfig.grenadeSlots
        };
    }
    
    // Default values if vest type not found
    console.warn(`Vest type "${currentVestType}" not found in configuration, using defaults`);
    return {
        equipmentSlots: 0,
        grenadeSlots: 0,
        assultMagazine: 0,
        heavyAssaultMegazin:0,
        pistolMegazin:0
    };
}

// Sizes a dropdown-list to show ~5 items tall, based on its first item's
// actual rendered height. Called both once at page load (best-effort, for a
// snappier first open) and every time the dropdown is actually opened via
// selectSlot() — the on-open call is what matters for correctness: if the
// item's image hasn't finished loading yet, its box is too short to
// measure, so we leave the CSS default (max-height:30vh, already set in
// styles.css) in place instead of locking in a too-small pixel value, and
// re-measure once the image does load. Measuring only once at page load
// (the original approach) meant a dropdown could get stuck permanently
// undersized if its image was still loading at that exact moment — rare on
// a single standalone page, much more likely on DeltaSquad_AllInOne.html
// where every page's images are all loading at once.
function sizeDropdownList(dropdownList) {
    if (!dropdownList) return;
    const firstItem = dropdownList.querySelector('.dropdown-item');
    if (!firstItem) return;
    const img = firstItem.querySelector('img');
    if (img && !img.complete) {
        dropdownList.style.maxHeight = '';
        img.addEventListener('load', () => sizeDropdownList(dropdownList), { once: true });
        return;
    }
    const itemHeight = firstItem.scrollHeight;
    if (itemHeight > 0) {
        dropdownList.style.maxHeight = `${itemHeight * 5}px`;
        dropdownList.style.overflowY = 'auto';
    }
}

function selectSlot(slotId) {
    document.querySelectorAll('.dropdown-list').forEach(dl => dl.style.display = 'none');
    document.querySelectorAll('.selector-button').forEach(btn => btn.classList.remove('selected'));

    activeSlot = slotId;
    const dropdown = document.getElementById(`dropdown_${slotId}`);
    if (dropdown) {
        dropdown.style.display = 'block';
        sizeDropdownList(dropdown);
    }
    const currentButton = event.currentTarget;
    currentButton.classList.add('selected');

    if (slotId === 'weapon1' || slotId === 'weapon2') {
        currentSelectedItemWeaponId = slotId;
        updateWeaponAttachmentsDisplay(currentSelectedItemWeaponId);
        atachment_con.style.display = 'block'; 
    } else {
        const parentWA_Group = currentButton.closest('.WA_Group');
        if (parentWA_Group) {
            if (parentWA_Group.querySelector('#weapon1')) {
                currentSelectedItemWeaponId = 'weapon1';
            } else if (parentWA_Group.querySelector('#weapon2')) {
                currentSelectedItemWeaponId = 'weapon2';
            }
            if (currentSelectedItemWeaponId) {
                updateWeaponAttachmentsDisplay(currentSelectedItemWeaponId);
                atachment_con.style.display = 'block';
            } else {
                atachment_con.style.display = 'none';
                currentSelectedItemWeaponId = null;
            }
        } else {
            atachment_con.style.display = 'none';
            currentSelectedItemWeaponId = null;
        }
    }
}

function updateWeaponAttachmentsDisplay(weaponSlotId) {
    let attachmentsContent = '';
    const attachments = [];

    let attachmentSlotIds = [];
    if (weaponSlotId === 'weapon1') {
        attachmentSlotIds = ['silens', 'mount1', 'mount2', 'scope', 'stock', 'magazine'];
    } else if (weaponSlotId === 'weapon2') {
        attachmentSlotIds = ['silens_Sec', 'mount1_Sec', 'mount2_Sec', 'scope_Sec', 'stock_Sec', 'magazine_Sec'];
    }

    attachmentSlotIds.forEach(slotId => {
        const item = selectedItems[slotId];
        if (item && item.title && item.title !== 'Nothing') {
            attachments.push({ title: item.title, content: item.content });
        }
    });

    if (attachments.length > 0) {
        attachmentsContent = `<h5>Attachments for ${weaponSlotId === 'weapon1' ? 'Weapon 1' : 'Weapon 2'}:</h5><ul>`;
        attachments.forEach(attachment => {
            attachmentsContent += `<li><strong>${attachment.title}</strong>: `;
            const contentLines = attachment.content.split(' | ');
            attachmentsContent += `<ul>`;
            contentLines.forEach(line => {
                attachmentsContent += `<li>${line.trim()}</li>`;
            });
            attachmentsContent += `</ul></li>`;
        });
        attachmentsContent += '</ul>';
    } else {
        attachmentsContent = `No Attachments Selected for ${weaponSlotId === 'weapon1' ? 'Weapon 1' : 'Weapon 2'}`;
    }
    atachment_con.innerHTML = attachmentsContent;
}

// Character data
const deltaCharacters = [
    {
        name: "Nomad",
        image: "Media/UiElements/The Squad/Nomad.png",
        implants: {
            image: "Media/UiElements/Implants/NomadImplant.png",
            text: "Cybernetic reflex boost, +2 to reaction time"
        },
        characteristics: {
            image: "Media/UiElements/Characteristics/NomadStats.png",
            text: "HP: 10 | Speed: 6m | Armor: Light"
        },
        abilities: {
            image: "Media/UiElements/Abilities/NomadAbility.png",
            text: "Ghost Walk - Become invisible for 1 round"
        },
        costReductions: [{ itemNames: ["Pistol"], reduction: 1 },
            { itemNames: ["Dildo_Purple"], reduction: 1 },
            { itemNames: ["Knife"], reduction: 1 },
            { itemNames: ["Dildo"], reduction: 1 }
        ],
        combinedCostReductions: [
            { itemNames: ["Pistol", "Knife"], reduction: 1 },
            { itemNames: ["Pistol", "Dildo_Purple"], reduction: 1 },
            { itemNames: ["Pistol", "Dildo"], reduction: 1 },
            
        ],
        extraGrenadeSlots: 0,
        extraEquipmentSlots: 0,
        extraAssultMagazine: 0,
        extraHeavyAssaultMegazin:0,
        extraPistolMegazin:0,
        MaxHP:30
    },
    {
        name: "FatMan",
        image: "Media/UiElements/The Squad/Fatman.png",
        implants: {
            image: "Media/UiElements/Implants/FatManImplant.png",
            text: "Armor plating system, +3 to damage resistance"
        },
        characteristics: {
            image: "Media/UiElements/Characteristics/FatManStats.png",
            text: "HP: 15 | Speed: 4m | Armor: Heavy"
        },
        abilities: {
            image: "Media/UiElements/Abilities/FatManAbility.png",
            text: "Shield Wall - Protect allies behind you for 2 rounds"
        },
        costReductions: [{ itemNames: ["Pistol"], reduction: 1 },
            { itemNames: ["Dildo_Purple"], reduction: 1 },
            { itemNames: ["Knife"], reduction: 1 },
            { itemNames: ["Dildo"], reduction: 1 }
        ],
        combinedCostReductions: [
            { itemNames: ["Pistol", "Knife"], reduction: 1 },
            { itemNames: ["Pistol", "Dildo_Purple"], reduction: 1 },
            { itemNames: ["Pistol", "Dildo"], reduction: 1 },
            
        ],
        extraGrenadeSlots: 2,
        extraEquipmentSlots: 0,
        extraAssultMagazine: 0,
        extraHeavyAssaultMegazin:0,
        extraPistolMegazin:0,
        MaxHP:33
    },
    {
        name: "Artemis",
        image: "Media/UiElements/The Squad/Artemis.png",
        implants: {
            image: "Media/UiElements/Implants/AsterisImplant.png",
            text: "Neural interface, +2 to hacking and tech skills"
        },
        characteristics: {
            image: "Media/UiElements/Characteristics/AsterisStats.png",
            text: "HP: 8 | Speed: 5m | Armor: Light"
        },
        abilities: {
            image: "Media/UiElements/Abilities/AsterisAbility.png",
            text: "System Override - Disable enemy electronics for 1 round"
        },
        costReductions: [{ itemNames: ["Pistol"], reduction: 1 },
            { itemNames: ["Dildo_Purple"], reduction: 1 },
            { itemNames: ["Knife"], reduction: 1 },
            { itemNames: ["Dildo"], reduction: 1 }
        ],
        combinedCostReductions: [
            { itemNames: ["Pistol", "Knife"], reduction: 1 },
            { itemNames: ["Pistol", "Dildo_Purple"], reduction: 1 },
            { itemNames: ["Pistol", "Dildo"], reduction: 1 },
            
        ],
        extraGrenadeSlots: 0,
        extraEquipmentSlots: 0,
        extraAssultMagazine: 0,
        extraHeavyAssaultMegazin:0,
        extraPistolMegazin:0,
        MaxHP:30
    },
    {
        name: "Tiffany",
        image: "Media/UiElements/The Squad/Tiffany.png",
        implants: {
            image: "Media/UiElements/Implants/TiffanyImplant.png",
            text: "Biometric scanner, +3 to medical and support actions"
        },
        characteristics: {
            image: "Media/UiElements/Characteristics/TiffanyStats.png",
            text: "HP: 10 | Speed: 5m | Armor: Medium"
        },
        abilities: {
            image: "Media/UiElements/Abilities/TiffanyAbility.png",
            text: "Healing Aura - Heals all allies within 3 meters for 1D6 HP for 2 rounds"
        },
        costReductions: [{ itemNames: ["Pistol"], reduction: 1 },
            { itemNames: ["Dildo_Purple"], reduction: 1 },
            { itemNames: ["Knife"], reduction: 1 },
            { itemNames: ["Dildo"], reduction: 1 },
            { itemNames: ["Drone"], reduction: 2 }
        ],
        combinedCostReductions: [
            { itemNames: ["Pistol", "Knife"], reduction: 1 },
            { itemNames: ["Pistol", "Dildo_Purple"], reduction: 1 },
            { itemNames: ["Pistol", "Dildo"], reduction: 1 },
            
        ],
        extraGrenadeSlots: 0,
        extraEquipmentSlots: 0,
        extraAssultMagazine: 0,
        extraHeavyAssaultMegazin:0,
        extraPistolMegazin:0,
        MaxHP:29
    }
];

let currentCharIndex = 0;

function updateSlotVisibility() {
    const currentChar = deltaCharacters[currentCharIndex];
    
    if (!currentChar) {
        console.error('No character data found');
        return;
    }

    // Get base slot counts from vest type
    const baseSlots = getBaseSlotCounts();
    
    
    // Calculate total slots (base from vest + character bonuses)
        //E-G
        const totalEquipmentSlots = baseSlots.equipmentSlots + currentChar.extraEquipmentSlots;
        const totalGrenadeSlots = baseSlots.grenadeSlots + currentChar.extraGrenadeSlots;
        //Megazins 
        const totalAssultMagazine = baseSlots.assultMagazine + currentChar.extraAssultMagazine;
        const totalHeavyAssaultMegazin = baseSlots.heavyAssaultMegazin + currentChar.extraHeavyAssaultMegazin;
        const totalPistolMegazin = baseSlots.pistolMegazin + currentChar.extraPistolMegazin;

        //Hp
        const totalMaxHP = currentChar.MaxHP + vestConfigurations.bonusMaxHP;
        
        console.log(`Updating slots for ${currentChar.name}:`);
        console.log(`Vest: ${getCurrentVestType()} (Base: ${baseSlots.equipmentSlots} equipment, ${baseSlots.grenadeSlots} grenades)`);
        console.log(`Character bonuses: +${currentChar.extraEquipmentSlots} equipment, +${currentChar.extraGrenadeSlots} grenades`);
        console.log(`Total: ${totalEquipmentSlots} equipment, ${totalGrenadeSlots} grenades`);
        
        updateEquipmentSlots(totalEquipmentSlots);
        updateGrenadeSlots(totalGrenadeSlots);
        
}

function updateEquipmentSlots(totalSlots) {
    const equipmentSlotIds = ['equipment1', 'equipment2', 'equipment3'];
    
    console.log(`Setting equipment slots: ${totalSlots} total`);
    
    equipmentSlotIds.forEach((slotId, index) => {
        const slotElement = document.getElementById(slotId);
        const slotContainer = slotElement ? slotElement.closest('.selector-button') : null;
        
        if (slotContainer) {
            if (index < totalSlots) {
                slotContainer.style.visibility = 'visible';
                slotContainer.style.pointerEvents = 'auto';
                slotContainer.style.opacity = '1';
                console.log(`Showing equipment slot: ${slotId}`);
            } else {
                slotContainer.style.visibility = 'hidden';
                slotContainer.style.pointerEvents = 'none';
                slotContainer.style.opacity = '0.3';
                clearSlotSelection(slotId);
                console.log(`Hiding equipment slot: ${slotId}`);
            }
        } else {
            console.error(`Could not find container for slot: ${slotId}`);
        }
    });
}

function updateGrenadeSlots(totalSlots) {
    const grenadeSlotIds = ['granade1', 'granade2', 'granade3', 'granade4', 'granade5'];
    
    console.log(`Setting grenade slots: ${totalSlots} total`);
    
    grenadeSlotIds.forEach((slotId, index) => {
        const slotElement = document.getElementById(slotId);
        const slotContainer = slotElement ? slotElement.closest('.selector-button') : null;
        
        if (slotContainer) {
            if (index < totalSlots) {
                slotContainer.style.visibility = 'visible';
                slotContainer.style.pointerEvents = 'auto';
                slotContainer.style.opacity = '1';
                console.log(`Showing grenade slot: ${slotId}`);
            } else {
                slotContainer.style.visibility = 'hidden';
                slotContainer.style.pointerEvents = 'none';
                slotContainer.style.opacity = '0.3';
                clearSlotSelection(slotId);
                console.log(`Hiding grenade slot: ${slotId}`);
            }
        } else {
            console.error(`Could not find container for slot: ${slotId}`);
        }
    });
}

function clearSlotSelection(slotId) {
    if (selectedItems[slotId]) {
        delete selectedItems[slotId];
        
        const slotElement = document.getElementById(slotId);
        if (slotElement) {
            slotElement.src = getDefaultImageForSlot(slotId);
            slotElement.dataset.cost = '0';
            slotElement.dataset.title = 'Nothing';
            
            const selectorButton = slotElement.parentNode;
            const selectedItemCon = selectorButton.querySelector('.selected-item-con');
            if (selectedItemCon) {
                selectedItemCon.innerHTML = '';
            }
        }
        
        localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
        recalculateTotalPointsBasedOnSelections();
    }
}

function getDefaultImageForSlot(slotId) {
    return 'Media/UiElements/Nothing.jpg';
}

function updateDeltaCharDisplay() {
    const deltaChar = document.querySelector('.DeltaChar');
    const charName = document.querySelector('.CharName');
    const statsContainer = document.getElementById('CharStats');
    const char = deltaCharacters[currentCharIndex];

    if (deltaChar && charName && statsContainer && char) {
        deltaChar.src = char.image;
        deltaChar.alt = char.name;
        charName.textContent = char.name;

        statsContainer.innerHTML = `
            <div class="stat-section">
                <h4>Implants:</h4>
                <p>${char.implants.text}</p>
            </div>
            <div class="stat-section">
                <h4>Characteristics:</h4>
                <p>${char.characteristics.text}</p>
            </div>
            <div class="stat-section">
                <h4>Abilities:</h4>
                <p>${char.abilities.text}</p>
            </div>
        `;

        console.log(`Character switched to: ${char.name} (Index: ${currentCharIndex})`);

        //CharStats update
        MaxHP = char.MaxHP;

        // Update slot visibility based on character's extra slots AND vest type
        updateSlotVisibility();
        
        // Recalculate points after character switch
        recalculateTotalPointsBasedOnSelections();
    } else {
        console.error('Missing elements or character data for character switching');
    }
}

function initializeCharacterSwitching() {
    updateDeltaCharDisplay(); 
    const leftBtn = document.getElementById('Swipeleft_btn');
    const rightBtn = document.getElementById('Swiperight_btn');

    if (leftBtn) {
        leftBtn.addEventListener('click', () => {
            currentCharIndex = (currentCharIndex - 1 + deltaCharacters.length) % deltaCharacters.length;
            updateDeltaCharDisplay();
            localStorage.setItem('currentCharIndex', currentCharIndex);
        });
    } else {
        console.error('SwipeLeft_btn not found');
    }

    if (rightBtn) {
        rightBtn.addEventListener('click', () => {
            currentCharIndex = (currentCharIndex + 1) % deltaCharacters.length;
            updateDeltaCharDisplay();
            localStorage.setItem('currentCharIndex', currentCharIndex);
        });
    } else {
        console.error('Swiperight_btn not found');
    }

    const savedCharIndex = localStorage.getItem('currentCharIndex');
    if (savedCharIndex !== null) {
        currentCharIndex = parseInt(savedCharIndex, 10);
        if (currentCharIndex >= deltaCharacters.length) {
            currentCharIndex = 0;
        }
        updateDeltaCharDisplay();
    }
}

function recalculateTotalPointsBasedOnSelections() {
    totalPoints = 0;
    const currentChar = deltaCharacters[currentCharIndex];

    // Tally selected items by name first (an item name could occupy more
    // than one slot at once, e.g. the same pistol in both weapon slots).
    const selectedByName = {};
    for (const slotId in selectedItems) {
        const item = selectedItems[slotId];
        if (item && item.cost !== undefined && item.title) {
            if (!selectedByName[item.title]) {
                selectedByName[item.title] = { count: 0, totalCost: 0 };
            }
            selectedByName[item.title].count++;
            selectedByName[item.title].totalCost += item.cost;
        }
    }

    // A combinedCostReductions rule (e.g. "Pistol + Knife") only applies when
    // EVERY item it names is actually selected — not just whichever one
    // happens to share a name with the rule. Without this check, a
    // character whose combo rules list "Pistol" alongside several different
    // melee options (Knife/Dildo/Dildo_Purple) would have their Pistol's
    // cost re-summed once per rule that mentions it, multiplying its
    // effective cost instead of discounting it.
    const namesCoveredByCombo = new Set();
    if (currentChar && currentChar.combinedCostReductions) {
        currentChar.combinedCostReductions.forEach(rule => {
            const allPresent = rule.itemNames.every(name => selectedByName[name]);
            if (allPresent) {
                let groupCost = 0;
                rule.itemNames.forEach(name => {
                    groupCost += selectedByName[name].totalCost;
                    namesCoveredByCombo.add(name);
                });
                totalPoints += Math.max(0, groupCost - rule.reduction);
            }
        });
    }

    // Everything not already counted via a combo gets its normal cost, minus
    // any per-item discount (applied once per copy, so two of the same item
    // in two slots both get discounted).
    for (const name in selectedByName) {
        if (namesCoveredByCombo.has(name)) continue;
        let cost = selectedByName[name].totalCost;
        if (currentChar && currentChar.costReductions) {
            const reductionRule = currentChar.costReductions.find(rule => rule.itemNames.includes(name));
            if (reductionRule) {
                cost = Math.max(0, cost - reductionRule.reduction * selectedByName[name].count);
            }
        }
        totalPoints += cost;
    }

    // Codex_*.html pages have no .TotalPoints element (totalPointsInput is
    // null there) but this function still runs on every page load to keep
    // localStorage's saved total in sync — only touch the DOM if it exists.
    if (totalPointsInput) {
        totalPointsInput.value = totalPoints;
        if (totalPoints > MAX_STARTING_POINTS) {
            totalPointsInput.style.color = 'red';
        } else {
            totalPointsInput.style.color = 'white';
        }
    }

    localStorage.setItem('totalPoints', totalPoints);
}

// Enhanced vest selection handler
function handleVestSelection(slotId, newItemName) {
    if (slotId === 'vest') {
        console.log(`Vest changed to: ${newItemName}`);
        // Update slot visibility when vest changes
        updateSlotVisibility();
    }
}

// Event listeners for dropdown functionality
document.querySelectorAll('.dropdown').forEach(dropdownContainer => {
    const dropdownList = dropdownContainer.querySelector('.dropdown-list');
    if (dropdownList) {
        dropdownList.addEventListener('click', (event) => {
            const listItem = event.target.closest('.dropdown-item');
            if (listItem && activeSlot) {
                const targetImage = document.getElementById(activeSlot);
                const selectorButton = targetImage.parentNode;
                const selectedItemCon = selectorButton.querySelector('.selected-item-con');

                if (targetImage && selectorButton && selectedItemCon) {
                    const newSrc = listItem.getAttribute('data-image');
                    const newCost = parseInt(listItem.getAttribute('data-cost'));
                    const newItemName = listItem.getAttribute('data-info-title');
                    const newItemContent = listItem.getAttribute('data-info-content');

                    targetImage.src = newSrc;
                    targetImage.dataset.cost = newCost;
                    targetImage.dataset.title = newItemName;
                    selectedItems[activeSlot] = {
                        image: newSrc,
                        cost: newCost,
                        title: newItemName,
                        content: newItemContent
                    };

                    localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
                    
                    // Handle vest-specific logic
                    handleVestSelection(activeSlot, newItemName);
                    
                    recalculateTotalPointsBasedOnSelections();

                    const itemCon = listItem.querySelector('.item_con');
                    let itemConContent = '';
                    if (itemCon) {
                        itemCon.childNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('img_con')) {
                                itemConContent += node.outerHTML;
                            }
                        });
                    }
                    selectedItemCon.innerHTML = itemConContent;
                    document.querySelectorAll('.dropdown-list').forEach(dl => dl.style.display = 'none');
                    document.querySelectorAll('.selector-button').forEach(btn => btn.classList.remove('selected'));
                    activeSlot = null;

                    currentSelectedItemTitle = newItemName;
                    currentSelectedItemContent = newItemContent;
                    updateInfoPanel(currentSelectedItemTitle, currentSelectedItemContent);

                    const parentWA_Group = targetImage.closest('.WA_Group');
                    if (parentWA_Group) {
                        if (parentWA_Group.querySelector('#weapon1')) {
                            currentSelectedItemWeaponId = 'weapon1';
                        } else if (parentWA_Group.querySelector('#weapon2')) {
                            currentSelectedItemWeaponId = 'weapon2';
                        }
                        if (currentSelectedItemWeaponId) {
                            updateWeaponAttachmentsDisplay(currentSelectedItemWeaponId);
                            atachment_con.style.display = 'block'; 
                        }
                    }
                }
            }
        });

        dropdownList.querySelectorAll('.dropdown-item').forEach(item => {
            const infoButton = item.querySelector('.info_con');
            if (infoButton) {
                const title = item.getAttribute('data-info-title');
                const content = item.getAttribute('data-info-content');

                infoButton.addEventListener('mouseenter', () => {
                    updateInfoPanel(title, content);
                });

                infoButton.addEventListener('mouseleave', () => {
                    updateInfoPanel(currentSelectedItemTitle, currentSelectedItemContent);
                });
            }
        });
    }
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown') && !e.target.closest('.selector-button')) {
        document.querySelectorAll('.dropdown-list').forEach(dl => dl.style.display = 'none');
        document.querySelectorAll('.selector-button').forEach(btn => btn.classList.remove('selected'));
        activeSlot = null;
        // This listener fires on every click anywhere on every page — on
        // Codex_*.html (no #Atachment_Con at all) that included clicking a
        // .codex-btn, throwing an uncaught error on every codex entry click.
        if (atachment_con) {
            atachment_con.style.display = 'none';
        }
        currentSelectedItemWeaponId = null;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Sync the displayed point cap ("/15", "/14", ...) to MAX_STARTING_POINTS
    // so every page shows the same, single-source-of-truth number.
    document.querySelectorAll('.MaxPointsDisplay').forEach(el => {
        el.textContent = MAX_STARTING_POINTS;
    });

    //Codex info
    const codexButtons = document.querySelectorAll('.codex-btn');
    const codexImage = document.getElementById('CodexContent_img');
    const codexTitle = document.getElementById('Codex_Title');
    const codexDescription = document.getElementById('Codex_content');

    codexButtons.forEach(button => {
        button.addEventListener('click', function() {
            const newImage = this.getAttribute('data-image');
            const newName = this.getAttribute('data-name');
            const newDescription = this.getAttribute('data-description');

            codexImage.src = newImage;
            codexTitle.textContent = newName;
            codexDescription.textContent = newDescription;
        });
    });
    // Best-effort pre-sizing so the first open of each dropdown doesn't have
    // to wait — see sizeDropdownList()'s comment for why this alone isn't
    // relied on for correctness (selectSlot() re-measures on every open).
    document.querySelectorAll('.dropdown-list').forEach(dropdownList => {
        dropdownList.style.display = 'block';
        dropdownList.style.visibility = 'hidden';
        sizeDropdownList(dropdownList);
        dropdownList.style.display = 'none';
        dropdownList.style.visibility = 'visible';
    });

    // Initialize character switching
    initializeCharacterSwitching();

    // Load saved items
    const savedSelectedItems = localStorage.getItem('selectedItems');
    if (savedSelectedItems) {
        try {
            selectedItems = JSON.parse(savedSelectedItems);
        } catch (e) {
            console.error("Error parsing selectedItems from localStorage:", e);
            selectedItems = {};
        }
    }
    
    const savedTotalPoints = localStorage.getItem('totalPoints');
    if (savedTotalPoints !== null) {
        totalPoints = parseInt(savedTotalPoints, 10);
        // Codex_*.html pages have no .TotalPoints element at all, so this is
        // null there — once a player has used the inventory even once,
        // localStorage has a saved total, and every later Codex page visit
        // was throwing an uncaught error here (which silently skipped the
        // rest of this init function, including character-index restore).
        if (totalPointsInput) {
            totalPointsInput.value = totalPoints;
        }
    }

    // Load saved character index and update slots
    const savedCharIndex = localStorage.getItem('currentCharIndex');
    if (savedCharIndex !== null) {
        currentCharIndex = parseInt(savedCharIndex, 10);
        if (currentCharIndex >= deltaCharacters.length) {
            currentCharIndex = 0;
        }
    }

    // Restore selected items to UI
    const slotIds = [
        'vest', 'melee', 'weapon1', 'weapon2', 'equipment1', 'equipment2',
        'equipment3', 'granade1', 'granade2', 'granade3','granade4', 'granade5',
        'silens', 'mount1', 'mount2', 'magazine', 'scope', 'stock',
        'silens_Sec', 'mount1_Sec', 'mount2_Sec', 'scope_Sec', 'stock_Sec', 'magazine_Sec'
    ];

    let infoPanelUpdatedBySavedItem = false;

    slotIds.forEach(slotId => {
        const item = selectedItems[slotId];
        const targetImage = document.getElementById(slotId);

        if (targetImage && item) {
            targetImage.src = item.image;
            targetImage.dataset.cost = item.cost;
            targetImage.dataset.title = item.title;

            const selectorButton = targetImage.parentNode;
            const selectedItemCon = selectorButton.querySelector('.selected-item-con');
            if (selectedItemCon) {
                const dropdownList = document.getElementById(`dropdown_${slotId}`);
                if (dropdownList) {
                    const listItem = Array.from(dropdownList.children).find(li =>
                        li.getAttribute('data-image') === item.image
                    );
                    if (listItem) {
                        const itemCon = listItem.querySelector('.item_con');
                        let itemConContent = '';
                        if (itemCon) {
                            itemCon.childNodes.forEach(node => {
                                if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('img_con')) {
                                    itemConContent += node.outerHTML;
                                }
                            });
                        }
                        selectedItemCon.innerHTML = itemConContent;
                    }
                }
            }

            if (item.title && item.content && !infoPanelUpdatedBySavedItem) {
                currentSelectedItemTitle = item.title;
                currentSelectedItemContent = item.content;
                updateInfoPanel(currentSelectedItemTitle, currentSelectedItemContent);
                infoPanelUpdatedBySavedItem = true; 
            }
        }
    });

    // Final initialization - IMPORTANT: Update slot visibility after loading saved items
    updateDeltaCharDisplay(); // This will call updateSlotVisibility() with correct vest info
    recalculateTotalPointsBasedOnSelections();
    // Runs on every page load unconditionally — Codex_*.html has no
    // #Atachment_Con at all, so this threw on page load before reaching
    // anything below it (including the initial info-panel default further
    // down this same function).
    if (atachment_con) {
        atachment_con.style.display = 'none';
    }

    if (!infoPanelUpdatedBySavedItem) {
        const initialItem = document.querySelector('.Vest_Grp .dropdown-item[data-cost="0"]');
        if (initialItem) {
            currentSelectedItemTitle = initialItem.getAttribute('data-info-title');
            currentSelectedItemContent = initialItem.getAttribute('data-info-content');
        }
        updateInfoPanel(currentSelectedItemTitle, currentSelectedItemContent);
    }
});