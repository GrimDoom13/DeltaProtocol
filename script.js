let activeSlot = null;
        let totalPoints = 0;
        const totalPointsInput = document.querySelector('.TotalPoints');
        const itemInfoTitle = document.getElementById('item-info-title');
        const itemInfoContent = document.getElementById('item-info-content');

        function updatePoints(cost, isAdding) {
            totalPoints = isAdding ? totalPoints + cost : totalPoints - cost;
            totalPointsInput.value = totalPoints;
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

                            // Set initial info for the selected item
                            itemInfoTitle.textContent = listItem.getAttribute('data-info-title') || 'Topic-NoN';
                            itemInfoContent.textContent = listItem.getAttribute('data-info-content') || 'Content';
                        }
                    }
                });

                // Add hover effects for dropdown items
                dropdownList.querySelectorAll('.dropdown-item').forEach(item => {
                    item.addEventListener('mouseover', () => {
                        const title = item.getAttribute('data-info-title');
                        const content = item.getAttribute('data-info-content');
                        if (title) itemInfoTitle.textContent = title;
                        if (content) itemInfoContent.textContent = content;
                    });

                    item.addEventListener('mouseout', () => {
                        // Revert to the currently selected item's info when hovering off an item in the list
                        // Or you can clear it, depending on desired behavior
                        const currentSelectedImage = document.getElementById(activeSlot);
                        if (currentSelectedImage && currentSelectedImage.dataset.cost !== undefined) {
                            const selectedItemCost = currentSelectedImage.dataset.cost;
                            // Find the list item corresponding to the currentSelectedImage's src and cost
                            const currentSelectedItem = Array.from(dropdownList.querySelectorAll('.dropdown-item')).find(
                                li => li.getAttribute('data-image') === currentSelectedImage.src.split('/').pop() &&
                                      parseInt(li.getAttribute('data-cost')) === parseInt(selectedItemCost)
                            );
                            if (currentSelectedItem) {
                                itemInfoTitle.textContent = currentSelectedItem.getAttribute('data-info-title') || 'Topic-NoN';
                                itemInfoContent.textContent = currentSelectedItem.getAttribute('data-info-content') || 'Content';
                            } else {
                                itemInfoTitle.textContent = 'Topic-NoN';
                                itemInfoContent.textContent = 'Content';
                            }
                        } else {
                            itemInfoTitle.textContent = 'Topic-NoN';
                            itemInfoContent.textContent = 'Content';
                        }
                    });
                });
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown-list').forEach(dl => dl.style.display = 'none');
                document.querySelectorAll('.selector-button').forEach(btn => btn.classList.remove('selected'));
                activeSlot = null;
            }
        });

//Dropdown limit size
document.addEventListener('DOMContentLoaded', function () {
    const dropdownLists = document.querySelectorAll('.dropdown-list');

    dropdownLists.forEach(dropdownList => {
        const itemCon = dropdownList.querySelector('.item_con');

        if (itemCon) {
            dropdownList.style.display = 'block';
            dropdownList.style.visibility = 'hidden';

            // Use scrollHeight to get full height even if content overflows
            const itemHeight = itemCon.scrollHeight;
            const listMaxHeight = itemHeight * 2.5;

            dropdownList.style.maxHeight = `${listMaxHeight}px`;
            dropdownList.style.overflowY = 'auto';

            dropdownList.style.display = 'none';
            dropdownList.style.visibility = 'visible';
        }
    });

    // Initialize info display with "Nothing" or default
    itemInfoTitle.textContent = 'Topic-NoN';
    itemInfoContent.textContent = 'Content';
});

//Info