let activeSlot = null;
let totalPoints = 0;
const totalPointsInput = document.querySelector('.TotalPoints');
const itemInfoTitle = document.getElementById('item-info-title');
const itemInfoContent = document.getElementById('item-info-content');

// Store the title and content of the currently selected item
let currentSelectedItemTitle = 'Topic-NoN';
let currentSelectedItemContent = 'Content';

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
    if (totalPoints <  0){
        totalPoints = 0;
    }
    if (totalPoints > 14 ){
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
            image: "Media/UiElements/Characteristics/AsterisStats.png",
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
            const listMaxHeight = itemHeight * 2.5; 

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
        'silens', 'mount1', 'mount2', 'magazine', // From invintory_Accesory.html
        'silens_Sec', 'mount1_Sec', 'mount2_Sec', 'scope_Sec', 'stock_Sec', 'magazine_Sec' // Asecondary invintory_Accesory.html
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
