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
            ulElement.style.listStyleType = 'none'; // remove bullet points
            ulElement.style.paddingLeft = '0'; // remove default padding

            lines.forEach(line => {
                const liElement = document.createElement('li');
                liElement.textContent = line.trim();
                ulElement.appendChild(liElement);
            });
            itemInfoContent.appendChild(ulElement);
        } else {
            itemInfoContent.textContent = 'Content'; // Fallback if no content
        }
    }
}

function updatePoints(cost, isAdding) {
    totalPoints = isAdding ? totalPoints + cost : totalPoints - cost;
    if (totalPointsInput) {
        totalPointsInput.value = totalPoints;
    }
    // Save totalPoints to localStorage immediately after it changes
    localStorage.setItem('totalPoints', totalPoints);
}

function selectSlot(slotId) {
    // Hide previous dropdown if any
    if (activeSlot && activeSlot !== slotId) {
        const prevDropdown = document.getElementById(`dropdown_${activeSlot}`);
        if (prevDropdown) {
            prevDropdown.style.display = 'none';
        }
    }

    const dropdownList = document.getElementById(`dropdown_${slotId}`);
    if (dropdownList) {
        dropdownList.style.display = dropdownList.style.display === 'block' ? 'none' : 'block';
        activeSlot = slotId; // Set the currently active slot

        // Close dropdown if clicked outside
        document.addEventListener('click', function(event) {
            const isClickInside = dropdownList.contains(event.target) || document.querySelector(`.dropdown.${slotId.charAt(0).toUpperCase() + slotId.slice(1)} .selector-button`).contains(event.target);
            if (!isClickInside && dropdownList.style.display === 'block') {
                dropdownList.style.display = 'none';
                activeSlot = null;
            }
        });
    }
}

document.addEventListener('click', function(event) {
    const selectorButtons = document.querySelectorAll('.selector-button');
    let clickedOnButton = false;
    selectorButtons.forEach(button => {
        if (button.contains(event.target)) {
            clickedOnButton = true;
        }
    });

    if (!clickedOnButton && activeSlot) {
        const currentDropdown = document.getElementById(`dropdown_${activeSlot}`);
        if (currentDropdown) {
            currentDropdown.style.display = 'none';
        }
        activeSlot = null;
    }
});

// Dropdown limit size and initial info display
document.addEventListener('DOMContentLoaded', function () {
    const dropdownLists = document.querySelectorAll('.dropdown-list');

    dropdownLists.forEach(dropdownList => {
        const itemCon = dropdownList.querySelector('.item_con');

        if (itemCon) {
            dropdownList.style.display = 'block';
            dropdownList.style.visibility = 'hidden';

            const itemHeight = itemCon.scrollHeight;
            const listMaxHeight = itemHeight * 2.5;

            dropdownList.style.maxHeight = `${listMaxHeight}px`;
            dropdownList.style.overflowY = 'auto';

            dropdownList.style.display = 'none';
            dropdownList.style.visibility = 'visible';
        }
    });

    // Initialize info display for the "Nothing" item of the first slot
    const initialItem = document.querySelector('.Vest_Grp .dropdown-item[data-cost="0"]');
    if (initialItem) {
        // Set and store the initial selected item's info
        currentSelectedItemTitle = initialItem.getAttribute('data-info-title');
        currentSelectedItemContent = initialItem.getAttribute('data-info-content');
        updateInfoPanel(currentSelectedItemTitle, currentSelectedItemContent);
    } else {
        // Fallback if no initial item is found
        updateInfoPanel('Topic-NoN', 'Content');
    }

    // Load saved data for all dropdowns on page load
    loadAllDropdownStates();

    // Attach click listeners to dropdown items to save their state
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            const slotId = this.closest('.dropdown-list').id.replace('dropdown_', '');
            const selectorButton = document.querySelector(`#${slotId}`); // The img element within the selector-button
            const selectedItemImage = this.getAttribute('data-image');
            const selectedItemCost = parseInt(this.getAttribute('data-cost'), 10);
            const selectedItemTitle = this.getAttribute('data-info-title');
            const selectedItemContent = this.getAttribute('data-info-content');

            const prevCost = parseInt(selectorButton.dataset.cost || '0', 10);

            // Update points only if the cost has changed or it's the initial selection
            if (prevCost !== selectedItemCost || !selectorButton.dataset.cost) {
                if (prevCost > 0) {
                    updatePoints(prevCost, false); // Subtract previous cost
                }
                if (selectedItemCost > 0) {
                    updatePoints(selectedItemCost, true); // Add new cost
                }
            } else if (prevCost === 0 && selectedItemCost === 0) {
                 // If both previous and current are 0, do nothing regarding points
            }


            // Update the image of the selector button
            selectorButton.src = selectedItemImage;
            selectorButton.alt = selectedItemTitle;

            // Store selected item data in a dataset on the image element for easy retrieval
            selectorButton.dataset.image = selectedItemImage;
            selectorButton.dataset.cost = selectedItemCost;
            selectorButton.dataset.title = selectedItemTitle;
            selectorButton.dataset.content = selectedItemContent;

            // Update info panel
            updateInfoPanel(selectedItemTitle, selectedItemContent);

            // Save the state of this specific dropdown
            saveDropdownState(slotId, {
                image: selectedItemImage,
                cost: selectedItemCost,
                title: selectedItemTitle,
                content: selectedItemContent
            });

            // Hide the dropdown list
            this.closest('.dropdown-list').style.display = 'none';
            activeSlot = null;
        });
    });
});


// Functions to save and load all dropdown states
function saveDropdownState(slotId, state) {
    localStorage.setItem(`selected_${slotId}`, JSON.stringify(state));
}

function loadDropdownState(slotId) {
    const savedState = localStorage.getItem(`selected_${slotId}`);
    if (savedState) {
        return JSON.parse(savedState);
    }
    return null;
}

function loadAllDropdownStates() {
    let loadedTotalPoints = 0; // Recalculate total points from loaded items

    document.querySelectorAll('.selector-button img').forEach(imgElement => {
        const slotId = imgElement.id;
        if (slotId) {
            const savedState = loadDropdownState(slotId);
            if (savedState) {
                imgElement.src = savedState.image;
                imgElement.alt = savedState.title;
                imgElement.dataset.image = savedState.image;
                imgElement.dataset.cost = savedState.cost;
                imgElement.dataset.title = savedState.title;
                imgElement.dataset.content = savedState.content;

                loadedTotalPoints += savedState.cost; // Add cost to recalculate total points
            } else {
                // If no saved state, initialize with 'Nothing' for that slot
                const initialItem = document.querySelector(`#dropdown_${slotId} .dropdown-item[data-cost="0"]`);
                if (initialItem) {
                    const initialImage = initialItem.getAttribute('data-image');
                    const initialCost = parseInt(initialItem.getAttribute('data-cost'), 10);
                    const initialTitle = initialItem.getAttribute('data-info-title');
                    const initialContent = initialItem.getAttribute('data-info-content');

                    imgElement.src = initialImage;
                    imgElement.alt = initialTitle;
                    imgElement.dataset.image = initialImage;
                    imgElement.dataset.cost = initialCost;
                    imgElement.dataset.title = initialTitle;
                    imgElement.dataset.content = initialContent;
                    loadedTotalPoints += initialCost;
                }
            }
        }
    });

    // Update the totalPoints global variable and input field
    totalPoints = loadedTotalPoints;
    if (totalPointsInput) {
        totalPointsInput.value = totalPoints;
    }

    // Load and update the info panel for the *first* dropdown's saved item on page load
    const firstDropdownImg = document.querySelector('.selector-button img[id="vest"]'); // Assuming 'vest' is the first dropdown
    if (firstDropdownImg && firstDropdownImg.dataset.title && firstDropdownImg.dataset.content) {
        updateInfoPanel(firstDropdownImg.dataset.title, firstDropdownImg.dataset.content);
    } else {
        // Fallback to default if no saved item for the first dropdown
        updateInfoPanel('Topic-NoN', 'Content');
    }

    // Explicitly load totalPoints if it was saved separately (from invintory.html)
    const savedTotalPointsFromInv = localStorage.getItem('totalPoints');
    if (savedTotalPointsFromInv !== null) {
        totalPoints = parseInt(savedTotalPointsFromInv, 10);
        if (totalPointsInput) {
            totalPointsInput.value = totalPoints;
        }
    }
}