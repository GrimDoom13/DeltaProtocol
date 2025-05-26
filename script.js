let activeSlot = null;
let totalPoints = 0;
const totalPointsInput = document.querySelector('.TotalPoints');
const itemInfoTitle = document.getElementById('item-info-title');
const itemInfoContent = document.getElementById('item-info-content');
const atachment_con = document.getElementById('Atachment_Con');
let currentSelectedItemTitle = 'Topic-NoN';
let currentSelectedItemContent = 'Content';

let currentSelectedItemWeaponId = null;

let selectedItems = {}; // selectedItems must be declared before loading into it

let currentVestInfo = { equipmentCount: 0, grenadeCount: 0 };

// Storage key prefix to avoid conflicts
const STORAGE_PREFIX = 'deltaGame_';

// Call loadAllDataFromLocalStorage immediately after global variable declarations
loadAllDataFromLocalStorage();

function updateInfoPanel(title, content) {
 
    if (itemInfoTitle) {
        itemInfoTitle.textContent = title || 'Topic-NoN';
    }
    if (itemInfoContent) {
        itemInfoContent.innerHTML = '';
        if (content) {
            const lines = content.split(' | '); // Split by |
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

function selectSlot(slotId) {
    document.querySelectorAll('.dropdown-list').forEach(dl => dl.style.display = 'none');
    document.querySelectorAll('.selector-button').forEach(btn => btn.classList.remove('selected'));

    activeSlot = slotId;
    const dropdown = document.getElementById(`dropdown_${slotId}`);
    if (dropdown) {
        dropdown.style.display = 'block';
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

document.querySelectorAll('.dropdown').forEach(dropdownContainer => {
    const dropdownList = dropdownContainer.querySelector('.dropdown-list');
    if (dropdownList) {
        // dropdown clicks event
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
                    if (activeSlot === 'vest') {
                        targetImage.dataset.infoContent = newItemContent;
                        currentVestInfo = parseVestInfo(newItemContent); 
                    }

                    selectedItems[activeSlot] = {
                        image: newSrc,
                        cost: newCost,
                        title: newItemName,
                        content: newItemContent
                    };

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

                    updateEquipmentAndGrenadeDisplay();
                }
            }
        });

        //dropdown hover
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
    // Close dropdowns
    if (!e.target.closest('.dropdown') && !e.target.closest('.selector-button')) {
        document.querySelectorAll('.dropdown-list').forEach(dl => dl.style.display = 'none');
        document.querySelectorAll('.selector-button').forEach(btn => btn.classList.remove('selected'));
        activeSlot = null;

        atachment_con.style.display = 'none';
        currentSelectedItemWeaponId = null;
    }
});

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
        costReductions: [],
        combinedCostReductions: [
            { itemNames: ["Pistol", "Knife"], reduction: 1 },
            { itemNames: ["Pistol", "Dildo_Purple"], reduction: 1 },
            { itemNames: ["Pistol", "Dildo"], reduction: 1 }
        ],
        extraGrenadeSlots: 0,
        extraEquipmentSlots: 0
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
        costReductions: [],
        combinedCostReductions: [
            { itemNames: ["Pistol", "Knife"], reduction: 1 },
            { itemNames: ["Pistol", "Dildo_Purple"], reduction: 1 },
            { itemNames: ["Pistol", "Dildo"], reduction: 1 }
        ],
        extraGrenadeSlots: 3, 
        extraEquipmentSlots: 0
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
        costReductions: [],
        combinedCostReductions: [
            { itemNames: ["Pistol", "Knife"], reduction: 1 },
            { itemNames: ["Pistol", "Dildo_Purple"], reduction: 1 },
            { itemNames: ["Pistol", "Dildo"], reduction: 1 }
        ],
        extraGrenadeSlots: 0,
        extraEquipmentSlots: 0
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
        costReductions: [],
        combinedCostReductions: [
            { itemNames: ["Pistol", "Knife"], reduction: 1 },
            { itemNames: ["Pistol", "Dildo_Purple"], reduction: 1 },
            { itemNames: ["Pistol", "Dildo"], reduction: 1 }
        ],
        extraGrenadeSlots: 0,
        extraEquipmentSlots: 0
    }
];

function formatText(text) {
    return text.replace(/\|/g, '<br>');
}

const characterImage = document.querySelector('.DeltaChar');
const charNameElement = document.querySelector('.CharName');
const swipeLeftBtn = document.getElementById('Swipeleft_btn');
const swipeRightBtn = document.getElementById('Swiperight_btn');
let currentCharIndex = 0;

function updateCharacterDisplay() {
    const character = deltaCharacters[currentCharIndex];
    if (character) {
        characterImage.src = character.image;
        characterImage.alt = character.name;
        charNameElement.textContent = character.name;

        updateEquipmentAndGrenadeDisplay();
    }
}

swipeLeftBtn.addEventListener('click', () => {
    currentCharIndex = (currentCharIndex - 1 + deltaCharacters.length) % deltaCharacters.length;
    updateCharacterDisplay();
    recalculateTotalPointsBasedOnSelections();
    saveAllDataToLocalStorage();
});

swipeRightBtn.addEventListener('click', () => {
    currentCharIndex = (currentCharIndex + 1) % deltaCharacters.length;
    updateCharacterDisplay();
    recalculateTotalPointsBasedOnSelections();
    saveAllDataToLocalStorage();
});

function parseVestInfo(vestContent) {
    let equipmentCount = 0;
    let grenadeCount = 0;

    const grenadeMatch = vestContent.match(/(\d+)\s+grenades?/i);
    if (grenadeMatch && grenadeMatch[1]) {
        grenadeCount = parseInt(grenadeMatch[1]);
    }

    const equipmentMatch = vestContent.match(/(\d+)\s+special\s+equipment/i);
    if (equipmentMatch && equipmentMatch[1]) {
        equipmentCount = parseInt(equipmentMatch[1]);
    }
    return { equipmentCount, grenadeCount };
}

function updateEquipmentAndGrenadeDisplay() {
    const currentCharacter = deltaCharacters[currentCharIndex];
    let finalEquipmentCount = currentVestInfo.equipmentCount + (currentCharacter.extraEquipmentSlots || 0);
    let finalGrenadeCount = currentVestInfo.grenadeCount + (currentCharacter.extraGrenadeSlots || 0);

    finalEquipmentCount = Math.max(0, finalEquipmentCount);
    finalGrenadeCount = Math.max(0, finalGrenadeCount);

    for (let i = 1; i <= 5; i++) {
        const eqDropdown = document.querySelector(`.dropdown.E${i}`);
        if (eqDropdown) {
            eqDropdown.style.display = 'none';
        }
    }
    for (let i = 1; i <= finalEquipmentCount; i++) {
        const eqDropdown = document.querySelector(`.dropdown.E${i}`);
        if (eqDropdown) {
            eqDropdown.style.display = 'block';
        }
    }

    for (let i = 1; i <= 5; i++) {
        const gDropdown = document.querySelector(`.dropdown.G${i}`);
        if (gDropdown) {
            gDropdown.style.display = 'none';
        }
    }
    for (let i = 1; i <= finalGrenadeCount; i++) {
        const gDropdown = document.querySelector(`.dropdown.G${i}`);
        if (gDropdown) {
            gDropdown.style.display = 'block';
        }
    }

    setTimeout(() => {
        initializeDropdownHeights();
    }, 50); 
}

function recalculateTotalPointsBasedOnSelections() {
    totalPoints = 0; 
    const currentChar = deltaCharacters[currentCharIndex];

    const combinedReductionItems = {};
    if (currentChar && currentChar.combinedCostReductions) {
        currentChar.combinedCostReductions.forEach(rule => {
            rule.itemNames.forEach(itemName => {
                combinedReductionItems[itemName] = { rule: rule, count: 0, totalOriginalCost: 0 };
            });
        });
    }

    for (const slotId in selectedItems) {
        const item = selectedItems[slotId];
        if (item && item.cost !== undefined) {
            const itemCost = item.cost;
            const itemName = item.title;

            if (itemName && combinedReductionItems[itemName]) {
                combinedReductionItems[itemName].count++;
                combinedReductionItems[itemName].totalOriginalCost += itemCost;
            } else {
                let effectiveCost = itemCost;
                if (currentChar && currentChar.costReductions) {
                    const reductionRule = currentChar.costReductions.find(rule => rule.itemName === itemName);
                    if (reductionRule) {
                        effectiveCost = Math.max(0, itemCost - reductionRule.reduction);
                    }
                }
                totalPoints += effectiveCost;
            }
        }
    }

    if (currentChar && currentChar.combinedCostReductions) {
        currentChar.combinedCostReductions.forEach(rule => {
            let groupOriginalCost = 0;

            rule.itemNames.forEach(itemNameInGroup => {
                if (combinedReductionItems[itemNameInGroup] && combinedReductionItems[itemNameInGroup].count > 0) {
                    groupOriginalCost += combinedReductionItems[itemNameInGroup].totalOriginalCost;
                }
            });

            let effectiveGroupCost = Math.max(0, groupOriginalCost - rule.reduction);
            totalPoints += effectiveGroupCost;
        });
    }

    if (totalPointsInput) {
        totalPointsInput.value = totalPoints;
        if (totalPoints > 15) {
            totalPointsInput.style.color = 'red';
        } else {
            totalPointsInput.style.color = 'white';
        }
    }

    // Always save after recalculating
    saveAllDataToLocalStorage();
}

// Improved localStorage functions with better error handling and validation
function saveAllDataToLocalStorage() {
    try {
        // Check if localStorage is available
        if (typeof Storage === 'undefined') {
            console.warn('localStorage is not supported');
            return false;
        }

        // Collect current UI state before saving
        collectCurrentUIState();

        // Prepare data object with all necessary information
        const gameData = {
            selectedItems: selectedItems,
            totalPoints: totalPoints,
            currentCharIndex: currentCharIndex,
            currentVestInfo: currentVestInfo,
            currentSelectedItemTitle: currentSelectedItemTitle,
            currentSelectedItemContent: currentSelectedItemContent,
            currentSelectedItemWeaponId: currentSelectedItemWeaponId,
            timestamp: Date.now(),
            version: '1.0' // For future compatibility
        };

        // Save as single JSON object
        localStorage.setItem(STORAGE_PREFIX + 'gameData', JSON.stringify(gameData));
        
        console.log('Game data saved successfully:', gameData);
        return true;
    } catch (e) {
        console.error("Error saving to localStorage:", e);
        return false;
    }
}

// Function to collect current UI state from DOM elements
function loadSelectionsFromLocalStorage() {
    const slotIds = [
        'vest', 'melee', 'weapon1', 'weapon2', 
        'equipment1', 'equipment2', 'equipment3', 'equipment4', 'equipment5', 
        'granade1', 'granade2', 'granade3', 'granade4', 'granade5',

        'silens', 'mount1', 'mount2', 'magazine', 'scope', 'stock',
        'silens_Sec', 'mount1_Sec', 'mount2_Sec', 'scope_Sec', 'stock_Sec', 'magazine_Sec'
    ];
    slotIds.forEach(slotId => {
        const targetImage = document.getElementById(slotId);
        if (targetImage && targetImage.dataset.cost !== undefined) {
            // Only update if we have valid data
            const cost = parseInt(targetImage.dataset.cost);
            const title = targetImage.dataset.title;
            const content = targetImage.dataset.infoContent;
            const image = targetImage.src;

            if (title && title !== 'Nothing' && !isNaN(cost)) {
                selectedItems[slotId] = {
                    image: image,
                    cost: cost,
                    title: title,
                    content: content || ''
                };
            }
        }
    });
}

function loadAllDataFromLocalStorage() {
    try {
        // Check if localStorage is available
        if (typeof Storage === 'undefined') {
            console.warn('localStorage is not supported');
            return false;
        }

        const savedData = localStorage.getItem(STORAGE_PREFIX + 'gameData');
        
        if (!savedData) {
            console.log('No saved game data found');
            return false;
        }

        const gameData = JSON.parse(savedData);
        
        // Validate data structure
        if (typeof gameData !== 'object') {
            console.error('Invalid game data format');
            return false;
        }

        // Load selected items - preserve existing if loading fails
        if (gameData.selectedItems && typeof gameData.selectedItems === 'object') {
            // Merge saved items with current items instead of replacing
            selectedItems = { ...selectedItems, ...gameData.selectedItems };
        }

        // Load total points
        if (typeof gameData.totalPoints === 'number') {
            totalPoints = gameData.totalPoints;
            if (totalPointsInput) {
                totalPointsInput.value = totalPoints;
                if (totalPoints > 15) {
                    totalPointsInput.style.color = 'red';
                } else {
                    totalPointsInput.style.color = 'white';
                }
            }
        }

        // Load character index
        if (typeof gameData.currentCharIndex === 'number') {
            currentCharIndex = gameData.currentCharIndex;
            if (currentCharIndex >= deltaCharacters.length || currentCharIndex < 0) {
                currentCharIndex = 0;
            }
        }

        // Load vest info
        if (gameData.currentVestInfo && typeof gameData.currentVestInfo === 'object') {
            currentVestInfo = gameData.currentVestInfo;
        }

        // Load UI state variables
        if (gameData.currentSelectedItemTitle) {
            currentSelectedItemTitle = gameData.currentSelectedItemTitle;
        }
        if (gameData.currentSelectedItemContent) {
            currentSelectedItemContent = gameData.currentSelectedItemContent;
        }
        if (gameData.currentSelectedItemWeaponId) {
            currentSelectedItemWeaponId = gameData.currentSelectedItemWeaponId;
        }

        console.log('Game data loaded successfully:', gameData);
        return true;

    } catch (e) {
        console.error("Error loading from localStorage:", e);
        // Don't reset existing data on error, just log it
        console.log('Current selectedItems preserved:', selectedItems);
        return false;
    }
}

function loadSelectionsFromLocalStorage() {
    const slotIds = [
        'vest', 'melee', 'weapon1', 'weapon2', 'equipment1', 'equipment2',
        'equipment3', 'granade1', 'granade2', 'granade3','grandade4','granade5',
        'silens', 'mount1', 'mount2', 'magazine', 'scope', 'stock',
        'silens_Sec', 'mount1_Sec', 'mount2_Sec', 'scope_Sec', 'stock_Sec', 'magazine_Sec'
    ];

    let infoPanelUpdatedBySavedItem = false;

    console.log('Loading selections from localStorage:', selectedItems);

    slotIds.forEach(slotId => {
        const item = selectedItems[slotId];
        const targetImage = document.getElementById(slotId);

        if (targetImage && item && item.title && item.title !== 'Nothing') {
            console.log(`Loading item for slot ${slotId}:`, item);
            
            // Set image and data attributes
            targetImage.src = item.image;
            targetImage.dataset.cost = item.cost;
            targetImage.dataset.title = item.title;
            targetImage.dataset.infoContent = item.content || '';
            
            const selectorButton = targetImage.parentNode;
            const selectedItemCon = selectorButton ? selectorButton.querySelector('.selected-item-con') : null;
            
            if (selectedItemCon) {
                // Find the corresponding dropdown list to get the item content
                const dropdownList = document.getElementById(`dropdown_${slotId}`);
                if (dropdownList) {
                    const listItem = Array.from(dropdownList.children).find(li =>
                        li.getAttribute('data-image') === item.image ||
                        li.getAttribute('data-info-title') === item.title
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
                    } else {
                        // Fallback: create basic content display
                        selectedItemCon.innerHTML = `<div class="item-name">${item.title}</div>`;
                    }
                } else {
                    // Fallback: create basic content display
                    selectedItemCon.innerHTML = `<div class="item-name">${item.title}</div>`;
                }
            }

            // Update info panel with the first valid item found
            if (item.title && item.content && !infoPanelUpdatedBySavedItem) {
                currentSelectedItemTitle = item.title;
                currentSelectedItemContent = item.content;
                updateInfoPanel(currentSelectedItemTitle, currentSelectedItemContent);
                infoPanelUpdatedBySavedItem = true;
            }
        }
    });

    // Force recalculation after loading all items
    setTimeout(() => {
        recalculateTotalPointsBasedOnSelections();
    }, 100);
}

// Add function to clear saved data (useful for debugging)
function clearSavedData() {
    try {
        localStorage.removeItem(STORAGE_PREFIX + 'gameData');
        selectedItems = {};
        totalPoints = 0;
        currentCharIndex = 0;
        currentVestInfo = { equipmentCount: 0, grenadeCount: 0 };
        console.log('Saved data cleared');
        return true;
    } catch (e) {
        console.error('Error clearing saved data:', e);
        return false;
    }
}

// Add visibility change handler to save data when switching pages/tabs
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
        // Page is being hidden (user switched tabs or navigated away)
        console.log('Page hidden, saving data...');
        collectCurrentUIState();
        saveAllDataToLocalStorage();
    } else if (document.visibilityState === 'visible') {
        // Page is becoming visible again
        console.log('Page visible, loading data...');
        loadAllDataFromLocalStorage();
        setTimeout(() => {
            loadSelectionsFromLocalStorage();
            updateCharacterDisplay();
            updateEquipmentAndGrenadeDisplay();
        }, 100);
    }
});

// Add focus/blur handlers as backup
window.addEventListener('blur', function() {
    console.log('Window lost focus, saving data...');
    collectCurrentUIState();
    saveAllDataToLocalStorage();
});

window.addEventListener('focus', function() {
    console.log('Window gained focus, refreshing data...');
    loadAllDataFromLocalStorage();
    setTimeout(() => {
        loadSelectionsFromLocalStorage();
        updateCharacterDisplay();
        updateEquipmentAndGrenadeDisplay();
    }, 100);
});

// Add function to manually sync data (can be called from other pages)
function syncGameData() {
    console.log('Manual sync triggered');
    collectCurrentUIState();
    saveAllDataToLocalStorage();
    return selectedItems;
}

// Add function to force reload data (can be called when returning to inventory)
function reloadGameData() {
    console.log('Manual reload triggered');
    const success = loadAllDataFromLocalStorage();
    if (success) {
        loadSelectionsFromLocalStorage();
        updateCharacterDisplay();
        updateEquipmentAndGrenadeDisplay();
        recalculateTotalPointsBasedOnSelections();
    }
    return success;
}

// Make functions globally available for other pages
window.syncGameData = syncGameData;
window.reloadGameData = reloadGameData;

// Periodically save data (every 30 seconds)
setInterval(() => {
    saveAllDataToLocalStorage();
}, 30000);

async function initializeDropdownHeights() {
    const dropdownLists = document.querySelectorAll('.dropdown-list');

    for (const dropdownList of dropdownLists) {
        if (dropdownList.closest('.dropdown').style.display === 'none') {
            continue;
        }

        const originalDisplay = dropdownList.style.display;
        const originalOpacity = dropdownList.style.opacity;
        const originalPointerEvents = dropdownList.style.pointerEvents;

        dropdownList.style.display = 'block';
        dropdownList.style.opacity = '0';
        dropdownList.style.pointerEvents = 'none';

        const firstItem = dropdownList.querySelector('.dropdown-item');

        if (firstItem) {
            const images = firstItem.querySelectorAll('img');
            const imageLoadPromises = Array.from(images).map(img => {
                return new Promise(resolve => {
                    if (img.complete && img.naturalHeight !== 0) {
                        resolve();
                    } else {
                        img.onload = () => resolve();
                        img.onerror = () => resolve();
                    }
                });
            });

            await Promise.all(imageLoadPromises);

            void firstItem.offsetHeight;

            let itemHeight = firstItem.scrollHeight;
            const listMaxHeight = itemHeight * 5;

            dropdownList.style.maxHeight = `${listMaxHeight}px`;
            dropdownList.style.overflowY = 'auto';
        } else {
            dropdownList.style.maxHeight = '0px';
            dropdownList.style.overflowY = 'hidden';
        }

        dropdownList.style.display = originalDisplay;
        dropdownList.style.opacity = originalOpacity;
        dropdownList.style.pointerEvents = originalPointerEvents;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing game...');
    
    // Load data first
    const loadSuccess = loadAllDataFromLocalStorage();
    console.log('Data load success:', loadSuccess);
    
    // Update character display
    updateCharacterDisplay();
    
    // Load visual selections
    loadSelectionsFromLocalStorage();
    
    // Handle vest info
    const loadedVest = selectedItems['vest'];
    if (loadedVest && loadedVest.content) {
        currentVestInfo = parseVestInfo(loadedVest.content);
    }
    
    // Update displays
    updateEquipmentAndGrenadeDisplay();
    
    // Recalculate points to ensure consistency
    recalculateTotalPointsBasedOnSelections();
    
    // Initialize dropdown heights
    initializeDropdownHeights().then(() => {
        console.log("Initial dropdown heights set");
    });

    // Hide attachment container initially
    if (atachment_con) {
        atachment_con.style.display = 'none';
    }

    // Set initial info panel content
    if (!itemInfoTitle || !itemInfoTitle.textContent || itemInfoTitle.textContent === 'Topic-NoN') {
        const initialItem = document.querySelector('.Vest_Grp .dropdown-item[data-cost="0"]');
        if (initialItem) {
            currentSelectedItemTitle = initialItem.getAttribute('data-info-title');
            currentSelectedItemContent = initialItem.getAttribute('data-info-content');
        }
        updateInfoPanel(currentSelectedItemTitle, currentSelectedItemContent);
    }
    
    // Set up periodic saving
    setInterval(() => {
        collectCurrentUIState();
        saveAllDataToLocalStorage();
    }, 10000); // Save every 10 seconds instead of 30
    
    console.log('Game initialization complete');
    console.log('Current selectedItems:', selectedItems);
    console.log('Current totalPoints:', totalPoints);
});

// Codex functionality
document.addEventListener('DOMContentLoaded', function() {
    const codexButtons = document.querySelectorAll('.codex-btn');
    const contentImg = document.getElementById('CodexContent_img');
    const contentTitle = document.getElementById('Codex_Title');
    const contentDescription = document.getElementById('Codex_content');

    function formatText(text) {
        let formattedText = text.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
        formattedText = formattedText.replace(/\|/g, '<br>');
        return formattedText;
    }

    function updateCodexContent(button) {
        const imageSrc = button.getAttribute('data-image');
        const name = button.getAttribute('data-name');
        const description = button.getAttribute('data-description');

        codexButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        if (contentTitle) contentTitle.textContent = name;
        if (contentDescription) contentDescription.innerHTML = formatText(description);

        if (contentImg && imageSrc) {
            contentImg.src = imageSrc;
            contentImg.style.display = 'block';

            contentImg.onerror = function() {
                contentImg.style.display = 'none';
            };
        } else if (contentImg) {
            contentImg.style.display = 'none';
        }
    }

    codexButtons.forEach(button => {
        button.addEventListener('click', function() {
            updateCodexContent(this);
        });
    });

    if (codexButtons.length > 0) {
        updateCodexContent(codexButtons[0]);
    }
});