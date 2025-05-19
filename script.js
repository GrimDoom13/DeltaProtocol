 let activeSlot = null;
        let totalPoints = 0;
        const totalPointsInput = document.querySelector('.TotalPoints');

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
                        }
                    }
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