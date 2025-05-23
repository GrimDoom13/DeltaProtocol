let activeSlot = null;
let totalPoints = 0;
const totalPointsInput = document.querySelector('.TotalPoints');
const itemInfoTitle = document.getElementById('item-info-title');
const itemInfoContent = document.getElementById('item-info-content');
const atachment_con = document.getElementById('Atachment_Con'); // Referencing the single Atachment_Con


// Store the title and content of the currently selected item
let currentSelectedItemTitle = 'Topic-NoN';
let currentSelectedItemContent = 'Content';
let currentSelectedItemWeaponId = null; // To track which weapon's attachments should be displayed

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

function updatePoints(cost, isAdding) {
    totalPoints = isAdding ? totalPoints + cost : totalPoints - cost;
    if (totalPoints < 0) {
        totalPoints = 0;
    }
    if (totalPoints > 14) {
        totalPointsInput.style.color = 'red';
    } 
    totalPointsInput.value = totalPoints;
    localStorage.setItem('totalPoints', totalPoints); // Auto-save total points
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
        attachmentsContent = `<h5>Attachments for ${weaponSlotId === 'weapon1' ? 'Main Weapon' : 'Secondary Weapon'}:</h5><ul>`;
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
        attachmentsContent = `No ${weaponSlotId === 'weapon1' ? 'Main Weapon' : 'Secondary Weapon'} Atachment Selected`;
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
                    const previousCost = parseInt(targetImage.dataset.cost || 0);

                    updatePoints(previousCost, false);
                    updatePoints(newCost, true);

                    targetImage.src = newSrc;
                    targetImage.dataset.cost = newCost;

                    // Save selected item to localStorage
                    localStorage.setItem(`selectedItem_${activeSlot}_image`, newSrc);
                    localStorage.setItem(`selectedItem_${activeSlot}_cost`, newCost);
                    localStorage.setItem(`selectedItem_${activeSlot}_title`, listItem.getAttribute('data-info-title'));
                    localStorage.setItem(`selectedItem_${activeSlot}_content`, listItem.getAttribute('data-info-content'));

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
                    currentSelectedItemTitle = listItem.getAttribute('data-info-title');
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
        }
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
        }
    },
    {
        name: "Artemis",
        image: "Media/UiElements/The Squad/Artemis.png",
        implants: {
            image: "Media/UiElements/Implants/AsterisImplant.png",
            text: "Neural interface, +2 to hacking and tech skills"
        },
        characteristics: {
            image: "Media/UiElements/Characteristics/FatManStats.png",
            text: "HP: 8 | Speed: 5m | Armor: Light"
        },
        abilities: {
            image: "Media/UiElements/Abilities/AsterisAbility.png",
            text: "System Override - Disable enemy electronics for 1 round"
        }
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
        }
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
        // character switching
        initializeCharacterSwitching();
    });

    // Load total points
    const savedTotalPoints = localStorage.getItem('totalPoints');
    if (savedTotalPoints !== null) {
        totalPoints = parseInt(savedTotalPoints, 10);
        totalPointsInput.value = totalPoints;
    }

    // List of all slot IDs to iterate through for loading
    const slotIds = [
        'vest', 'melee', 'weapon1', 'weapon2', 'equipment1', 'equipment2',
        'equipment3', 'granade1', 'granade2', 'granade3', // From invintory.html
        'silens', 'mount1', 'mount2', 'magazine', 'scope', 'stock', // From Atachments.html
        'silens_Sec', 'mount1_Sec', 'mount2_Sec', 'scope_Sec', 'stock_Sec', 'magazine_Sec' // Asecondary Atachments.html
    ];

    let infoPanelUpdatedBySavedItem = false;

    slotIds.forEach(slotId => {
        const savedImage = localStorage.getItem(`selectedItem_${slotId}_image`);
        const savedCost = localStorage.getItem(`selectedItem_${slotId}_cost`);
        const savedTitle = localStorage.getItem(`selectedItem_${slotId}_title`);
        const savedContent = localStorage.getItem(`selectedItem_${slotId}_content`);

        const targetImage = document.getElementById(slotId);
        if (targetImage && savedImage) {
            // Restore image and cost
            targetImage.src = savedImage;
            targetImage.dataset.cost = parseInt(savedCost || 0);

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

    // Initial state: hide the attachment display
    atachment_con.style.display = 'none';

    // item plug
    if (!infoPanelUpdatedBySavedItem) {
        const initialItem = document.querySelector('.dropdown-item[data-cost="0"]'); // Assuming the first "Nothing" item
        if (initialItem) {
            currentSelectedItemTitle = initialItem.getAttribute('data-info-title');
            currentSelectedItemContent = initialItem.getAttribute('data-info-content');
        }
        updateInfoPanel(currentSelectedItemTitle, currentSelectedItemContent);
    }
});