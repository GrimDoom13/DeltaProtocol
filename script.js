
            let activeSlot = null;
        let totalPoints = 0;
        const totalPointsInput = document.querySelector('.TotalPoints');

        function updatePoints(cost, isAdding) {
            totalPoints = isAdding ? totalPoints + cost : totalPoints - cost;
            totalPointsInput.value = totalPoints;
        }

        function selectSlot(slotId) {
            // Remove all dropdowns
            document.querySelectorAll('.dropdown-list').forEach(dl => dl.style.display = 'none');

            // Remove selection highlights
            document.querySelectorAll('.selector-button').forEach(btn => {
                btn.classList.remove('selected');
                const pointsDisplay = btn.querySelector('.item-points');
                if (pointsDisplay) {
                    pointsDisplay.remove(); // Remove previous points display
                }
            });

            // Set active slot
            activeSlot = slotId;

            // Show related dropdown
            let dropdownId;
  if (slotId === 'vest') {
    dropdownId = 'dropdown_vest';
  } else if (slotId === 'equipment1') {
    dropdownId = 'dropdown_equipment1';
  } else if (slotId === 'equipment2') {
    dropdownId = 'dropdown_equipment2';
  } else if (slotId === 'equipment3') {
    dropdownId = 'dropdown_equipment3';
  } else if (slotId === 'granade1') {
    dropdownId = 'dropdown_granade1';
  } else if (slotId === 'granade2') {
    dropdownId = 'dropdown_granade2';
  } else if (slotId === 'granade3') {
    dropdownId = 'dropdown_granade3';
  }
    
  if (dropdownId) {
    document.getElementById(dropdownId).style.display = 'block';
  }

            // Highlight clicked button
            const currentButton = event.currentTarget;
            currentButton.classList.add('selected');
        }

        // Handle dropdown image click
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                if (!activeSlot) return;

                const newSrc = item.getAttribute('data-image');
                const newCost = parseInt(item.getAttribute('data-cost'));
                const targetImage = document.getElementById(activeSlot);
                const previousCost = parseInt(targetImage.dataset.cost || 0); // Get previous cost

                // Update total points
                updatePoints(previousCost, false); // Subtract previous cost
                updatePoints(newCost, true);    // Add new cost

                // Update image source and data-cost
                targetImage.src = newSrc;
                targetImage.dataset.cost = newCost;

                // Display points on the selector button
                const selectorButton = targetImage.parentNode;
                let pointsDisplay = selectorButton.querySelector('.item-points');
                if (!pointsDisplay) {
                    pointsDisplay = document.createElement('div');
                    pointsDisplay.classList.add('item-points');
                    selectorButton.appendChild(pointsDisplay);
                }
                pointsDisplay.textContent = newCost;

                // Hide dropdown and reset
                document.querySelectorAll('.dropdown-list').forEach(dl => dl.style.display = 'none');
                document.querySelectorAll('.selector-button').forEach(btn => btn.classList.remove('selected'));
                activeSlot = null;
            });
        });

        // Click outside to close dropdown
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown-list').forEach(dl => dl.style.display = 'none');
                document.querySelectorAll('.selector-button').forEach(btn => btn.classList.remove('selected'));
                activeSlot = null;
            }
        });