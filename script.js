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
    // Hide all dropdowns and remove selected class from buttons
    document.querySelectorAll('.dropdown-list').forEach(dl => dl.style.display = 'none');
    document.querySelectorAll('.selector-button').forEach(btn => btn.classList.remove('selected'));

    // Set the active slot
    activeSlot = slotId;
    const dropdown = document.getElementById(`dropdown_${slotId}`);
    if (dropdown) {
        dropdown.style.display = 'block'; // Show the dropdown for the active slot
    }
    // Add selected class to the current button that triggered the selection
    const currentButton = event.currentTarget;
    currentButton.classList.add('selected');

    // Logic to show/hide attachment display based on weapon selection
    if (slotId === 'weapon1' || slotId === 'weapon2') {
        currentSelectedItemWeaponId = slotId;
        updateWeaponAttachmentsDisplay(currentSelectedItemWeaponId);
        atachment_con.style.display = 'block'; // Show the attachment display
    } else {
        // If an attachment slot is selected, determine its parent weapon
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
            // If the selected slot is not a weapon or part of a weapon group, hide attachment display
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
                    // Save the entire selectedItems object to localStorage
                    localStorage.setItem('selectedItems', JSON.stringify(selectedItems));

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

                    // Update and store info for the selected item in the info panel
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
        ]
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
        ]
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
        combinedCostReductions: [
            { itemNames: ["Pistol", "Knife"], reduction: 1 },
            { itemNames: ["Pistol", "Dildo_Purple"], reduction: 1 },
            { itemNames: ["Pistol", "Dildo"], reduction: 1 }
        ]
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
            { itemNames: ["Pistol", "Dildo_Purple"], reduction: 1 },
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
    const currentChar = deltaCharacters[currentCharIndex]; 

    // Temporary storage for items involved in combined reductions
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

    totalPointsInput.value = totalPoints;
    if (totalPoints > 15) {
        totalPointsInput.style.color = 'red';
    } else {
        totalPointsInput.style.color = 'white'; 
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

   
    initializeCharacterSwitching();

 
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
        const item = selectedItems[slotId];
        const targetImage = document.getElementById(slotId);

        if (targetImage && item) {
            targetImage.src = item.image;
            targetImage.dataset.cost = item.cost;
            targetImage.dataset.title = item.title;

            // Restore the selected-item-con display based on the saved item
            const selectorButton = targetImage.parentNode;
            const selectedItemCon = selectorButton.querySelector('.selected-item-con');
            if (selectedItemCon) {
                // Find the corresponding dropdown item to get its display content
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

            // Update info panel with the last saved item's info (or the first one encountered)
            if (item.title && item.content && !infoPanelUpdatedBySavedItem) {
                currentSelectedItemTitle = item.title;
                currentSelectedItemContent = item.content;
                updateInfoPanel(currentSelectedItemTitle, currentSelectedItemContent);
                infoPanelUpdatedBySavedItem = true; // Set flag to only update with one saved item's info
            }
        }
    });

    // Recalculate points once all items are loaded into
    recalculateTotalPointsBasedOnSelections();

    
    atachment_con.style.display = 'none';

    
    if (!infoPanelUpdatedBySavedItem) {
        const initialItem = document.querySelector('.Vest_Grp .dropdown-item[data-cost="0"]'); // Assuming Vest_Grp is typically the first
        if (initialItem) {
            currentSelectedItemTitle = initialItem.getAttribute('data-info-title');
            currentSelectedItemContent = initialItem.getAttribute('data-info-content');
        }
        updateInfoPanel(currentSelectedItemTitle, currentSelectedItemContent);
    }
});
