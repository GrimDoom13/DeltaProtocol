let activeSlot = null;
let totalPoints = 0;
const totalPointsInput = document.querySelector('.TotalPoints');
const itemInfoTitle = document.getElementById('item-info-title');
const itemInfoContent = document.getElementById('item-info-content');
const atachment_con = document.getElementById('Atachment_Con');

// Store the title and content of the currently selected item
let currentSelectedItemTitle = 'Topic-NoN';
let currentSelectedItemContent = 'Content';

// To track which weapon's attachments should be displayed
let currentSelectedItemWeaponId = null;

// Helper function to update the info panel with multi-line content
function updateInfoPanel(title, content) {
    if (itemInfoTitle) {
        itemInfoTitle.textContent = title || 'Topic-NoN';
    }
    if (itemInfoContent) {
        itemInfoContent.innerHTML = ''; // Clear previous content
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

// updatePoints will now simply add/subtract the item's raw cost,
// and then trigger a full recalculation to handle all bonuses.
function updatePoints(cost, isAdding) { // Removed itemName parameter as it's handled by recalculate
    // This function will no longer apply specific reductions directly.
    // It's purpose is to trigger the full recalculation.
    // However, for immediate feedback on the totalPoints input,
    // we will still update totalPoints, but the authoritative value
    // will come from recalculateTotalPointsBasedOnSelections after an item change.
    
    // For now, we'll let recalculateTotalPointsBasedOnSelections handle the actual point logic.
    // This function's direct manipulation of totalPoints is less critical now.
    // It's crucial that `recalculateTotalPointsBasedOnSelections()` is called after any item change.

    // A simpler approach for updatePoints in this model:
    // It's mainly called when a new item is selected.
    // The previous item's cost is removed, new item's cost is added.
    // Then, recalculateTotalPointsBasedOnSelections takes care of all rules.
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

    // If a weapon is selected, update currentSelectedItemWeaponId and its attachment display
    if (slotId === 'weapon1') {
        currentSelectedItemWeaponId = 'weapon1';
        updateWeaponAttachmentsDisplay(currentSelectedItemWeaponId);
        atachment_con.style.display = 'block'; // Show the attachment display
    } else if (slotId === 'weapon2') {
        currentSelectedItemWeaponId = 'weapon2';
        updateWeaponAttachmentsDisplay(currentSelectedItemWeaponId);
        atachment_con.style.display = 'block'; // Show the attachment display
    } else {
        // If an attachment slot is selected, check which weapon it belongs to
        const parentWA_Group = currentButton.closest('.WA_Group');
        if (parentWA_Group) {
            if (parentWA_Group.querySelector('#weapon1')) {
                currentSelectedItemWeaponId = 'weapon1';
                updateWeaponAttachmentsDisplay(currentSelectedItemWeaponId);
                atachment_con.style.display = 'block';
            } else if (parentWA_Group.querySelector('#weapon2')) {
                currentSelectedItemWeaponId = 'weapon2';
                updateWeaponAttachmentsDisplay(currentSelectedItemWeaponId);
                atachment_con.style.display = 'block';
            } else {
                // If a non-weapon slot is selected and it's not part of a weapon group (e.g., if there were other non-weapon dropdowns),
                // you might want to hide the attachment display or show a default message.
                atachment_con.style.display = 'none';
                currentSelectedItemWeaponId = null;
            }
        } else {
            // If the selected slot is not a weapon and not part of a weapon group, hide attachment display
            atachment_con.style.display = 'none';
            currentSelectedItemWeaponId = null;
        }
    }
}


// Function to update the attachments display for a specific weapon in the single Atachment_Con
function updateWeaponAttachmentsDisplay(weaponSlotId) {
    let attachmentsContent = '';
    const attachments = [];

    // Determine relevant attachment slot IDs based on the weapon slot ID
    let attachmentSlotIds = [];
    if (weaponSlotId === 'weapon1') {
        attachmentSlotIds = ['silens', 'mount1', 'mount2', 'scope', 'stock', 'magazine'];
    } else if (weaponSlotId === 'weapon2') {
        attachmentSlotIds = ['silens_Sec', 'mount1_Sec', 'mount2_Sec', 'scope_Sec', 'stock_Sec', 'magazine_Sec'];
    }

    attachmentSlotIds.forEach(slotId => {
        const savedTitle = localStorage.getItem(`selectedItem_${slotId}_title`);
        const savedContent = localStorage.getItem(`selectedItem_${slotId}_content`);
        if (savedTitle && savedTitle !== 'Nothing') {
            attachments.push({ title: savedTitle, content: savedContent });
        }
    });

    if (attachments.length > 0) {
        attachmentsContent = `<h5>Attachments for ${weaponSlotId === 'weapon1' ? 'Weapon 1' : 'Weapon 2'}:</h5><ul>`;
        attachments.forEach(attachment => {
            attachmentsContent += `<li><strong>${attachment.title}</strong>: `;
            // Split content by ' | ' and format as a nested unordered list
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
                    // const previousCost = parseInt(targetImage.dataset.cost || 0); // Not needed with full recalculation
                    const newItemName = listItem.getAttribute('data-info-title'); // Get the item name

                    // Update the dataset on the targetImage for recalculation
                    targetImage.src = newSrc;
                    targetImage.dataset.cost = newCost;
                    targetImage.dataset.title = newItemName; // Store the title on the target image for future reference

                    // Save selected item to localStorage
                    localStorage.setItem(`selectedItem_${activeSlot}_image`, newSrc);
                    localStorage.setItem(`selectedItem_${activeSlot}_cost`, newCost);
                    localStorage.setItem(`selectedItem_${activeSlot}_title`, newItemName); // Save the title
                    localStorage.setItem(`selectedItem_${activeSlot}_content`, listItem.getAttribute('data-info-content'));

                    // Now, trigger the full recalculation after the item is "selected"
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

                    // Update and store info for the selected item
                    currentSelectedItemTitle = newItemName; // Use the new item name
                    currentSelectedItemContent = listItem.getAttribute('data-info-content');
                    updateInfoPanel(currentSelectedItemTitle, currentSelectedItemContent);

                    // If an attachment is selected, ensure the weapon's attachments display is updated
                    // We need to know which weapon's attachment set this belongs to.
                    const parentWA_Group = targetImage.closest('.WA_Group');
                    if (parentWA_Group) {
                        if (parentWA_Group.querySelector('#weapon1')) {
                            currentSelectedItemWeaponId = 'weapon1';
                        } else if (parentWA_Group.querySelector('#weapon2')) {
                            currentSelectedItemWeaponId = 'weapon2';
                        }
                        if (currentSelectedItemWeaponId) {
                            updateWeaponAttachmentsDisplay(currentSelectedItemWeaponId);
                            atachment_con.style.display = 'block'; // Ensure it's visible
                        }
                    }
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
        // Hide the attachment display when clicking outside
        atachment_con.style.display = 'none';
        currentSelectedItemWeaponId = null; // Clear the active weapon for attachments
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
        combinedCostReductions: []
    },
    {
        name: "FatMan",
        image: "Media/UiElements/The Squad/FatMan.png",
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
        combinedCostReductions: []
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
        costReductions: [

        ],
        combinedCostReductions: []
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
            text: "HP: 9 | Speed: 5m | Armor: Light"
        },
        abilities: {
            image: "Media/UiElements/Abilities/TiffanyAbility.png",
            text: "Field Medic - Instantly heal 5 HP to any ally"
        },
        costReductions: [
            { itemName: "Drone", reduction: 2 },
        ],
        combinedCostReductions: [
            { itemNames: ["Pistol", "Knife"], reduction: 1 },
            { itemNames: ["Pistol", "Dildo"], reduction: 1 }
        ]
    },
];

//char info update system
let currentCharIndex = 0;

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
        // Recalculate points after character switch, as bonuses might apply/unapply
        recalculateTotalPointsBasedOnSelections();
    } else {
        console.error('Missing elements or character data for character switching');
    }
}

function initializeCharacterSwitching() {
    // Character Selector
    updateDeltaCharDisplay(); // Initial display of character

    const leftBtn = document.getElementById('Swipeleft_btn');
    const rightBtn = document.getElementById('Swiperight_btn');
    // Save character index
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

    // Load saved character index
    const savedCharIndex = localStorage.getItem('currentCharIndex');
    if (savedCharIndex !== null) {
        currentCharIndex = parseInt(savedCharIndex, 10);
        // Ensure index is within bounds
        if (currentCharIndex >= deltaCharacters.length) {
            currentCharIndex = 0;
        }
    updateDeltaCharDisplay();
    }
}

// Function to recalculate total points based on current selections and character
function recalculateTotalPointsBasedOnSelections() {
    totalPoints = 0; // Reset total points
    const slotIds = [
        'vest', 'melee', 'weapon1', 'weapon2', 'equipment1', 'equipment2',
        'equipment3', 'granade1', 'granade2', 'granade3',
        'silens', 'mount1', 'mount2', 'magazine', 'scope', 'stock',
        'silens_Sec', 'mount1_Sec', 'mount2_Sec', 'scope_Sec', 'stock_Sec', 'magazine_Sec'
    ];
    const currentChar = deltaCharacters[currentCharIndex]; // Get the current character

    // Temporary storage for items involved in combined reductions
    const combinedReductionItems = {};
    if (currentChar && currentChar.combinedCostReductions) {
        currentChar.combinedCostReductions.forEach(rule => {
            rule.itemNames.forEach(itemName => {
                combinedReductionItems[itemName] = { rule: rule, count: 0, totalOriginalCost: 0 };
            });
        });
    }

    slotIds.forEach(slotId => {
        const targetImage = document.getElementById(slotId);
        if (targetImage) {
            const itemCost = parseInt(targetImage.dataset.cost || 0);
            const itemName = localStorage.getItem(`selectedItem_${slotId}_title`); // Get the stored item title from localStorage

            if (itemName && combinedReductionItems[itemName]) {
                // This item is part of a combined reduction group
                combinedReductionItems[itemName].count++;
                combinedReductionItems[itemName].totalOriginalCost += itemCost;
            } else {
                // This item is subject to individual reduction or no reduction
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
    });

    // Apply combined reductions after all individual items are processed
    if (currentChar && currentChar.combinedCostReductions) {
        currentChar.combinedCostReductions.forEach(rule => {
            let groupOriginalCost = 0;
            // Sum costs of all items in this group that are currently selected
            rule.itemNames.forEach(itemNameInGroup => {
                if (combinedReductionItems[itemNameInGroup] && combinedReductionItems[itemNameInGroup].count > 0) {
                    groupOriginalCost += combinedReductionItems[itemNameInGroup].totalOriginalCost;
                }
            });
            
            // Apply the reduction to the total original cost of the group
            let effectiveGroupCost = Math.max(0, groupOriginalCost - rule.reduction);
            totalPoints += effectiveGroupCost;
        });
    }

    totalPointsInput.value = totalPoints;
    if (totalPoints > 14) {
        totalPointsInput.style.color = 'red';
    } else {
        totalPointsInput.style.color = 'white'; // Keep the color white when within limits
    }
    localStorage.setItem('totalPoints', totalPoints);
}


// Load saved data and initialize display on page load
document.addEventListener('DOMContentLoaded', function() {
    
    const dropdownLists = document.querySelectorAll('.dropdown-list');

    dropdownLists.forEach(dropdownList => {
        //show for calc and hide
        dropdownList.style.display = 'block';
        dropdownList.style.visibility = 'hidden';

        const firstItem = dropdownList.querySelector('.dropdown-item');
        if (firstItem) {
            const itemHeight = firstItem.scrollHeight;
            const listMaxHeight = itemHeight * 5;

            dropdownList.style.maxHeight = `${listMaxHeight}px`;
            dropdownList.style.overflowY = 'auto';
        }

        dropdownList.style.display = 'none';
        dropdownList.style.visibility = 'visible';
    });

    // character switching - ONLY CALL ONCE AFTER DOM IS LOADED
    initializeCharacterSwitching();

    // Load total points
    const savedTotalPoints = localStorage.getItem('totalPoints');
    if (savedTotalPoints !== null) {
        totalPoints = parseInt(savedTotalPoints, 10);
        totalPointsInput.value = totalPoints;
    }

    // List of all slot IDs to iterate through for loading
    const slotIds = [
        'vest', 'melee', 'weapon1', 'weapon2', 'equipment1', 'equipment2',
        'equipment3', 'granade1', 'granade2', 'granade3',
        'silens', 'mount1', 'mount2', 'magazine', 'scope', 'stock',
        'silens_Sec', 'mount1_Sec', 'mount2_Sec', 'scope_Sec', 'stock_Sec', 'magazine_Sec'
    ];

    let infoPanelUpdatedBySavedItem = false;

    slotIds.forEach(slotId => {
        const savedImage = localStorage.getItem(`selectedItem_${slotId}_image`);
        const savedCost = localStorage.getItem(`selectedItem_${slotId}_cost`);
        const savedTitle = localStorage.getItem(`selectedItem_${slotId}_title`);
        const savedContent = localStorage.getItem(`selectedItem_${slotId}_content`);

        const targetImage = document.getElementById(slotId);
        if (targetImage && savedImage) {
            // Restore image, cost, and title
            targetImage.src = savedImage;
            targetImage.dataset.cost = parseInt(savedCost || 0);
            targetImage.dataset.title = savedTitle; // Restore the title

            // Restore the selected-item-con display based on the saved item
            const selectorButton = targetImage.parentNode;
            const selectedItemCon = selectorButton.querySelector('.selected-item-con');
            if (selectedItemCon) {
                const dropdownList = document.getElementById(`dropdown_${slotId}`);
                if (dropdownList) {
                    const listItem = Array.from(dropdownList.children).find(item =>
                        item.getAttribute('data-image') === savedImage
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

            // Update info panel if this is the last saved item (or the first one encountered)
            if (savedTitle && savedContent && !infoPanelUpdatedBySavedItem) {
                currentSelectedItemTitle = savedTitle;
                currentSelectedItemContent = savedContent;
                updateInfoPanel(currentSelectedItemTitle, currentSelectedItemContent);
                infoPanelUpdatedBySavedItem = true; // Set flag to only update with one saved item's info
            }
        }
    });

    // Recalculate points once all items are loaded and character is set
    recalculateTotalPointsBasedOnSelections();

    // Initial state: hide the attachment display
    atachment_con.style.display = 'none';

    // item plug
    if (!infoPanelUpdatedBySavedItem) {
        
        const initialItem = document.querySelector('.Vest_Grp .dropdown-item[data-cost="0"]'); // Assuming Vest_Grp is typically the first
        if (initialItem) {
            currentSelectedItemTitle = initialItem.getAttribute('data-info-title');
            currentSelectedItemContent = initialItem.getAttribute('data-info-content');
        }
        updateInfoPanel(currentSelectedItemTitle, currentSelectedItemContent);
    }
});