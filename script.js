const mainButton = document.getElementById('main-button');
const dropdownList = document.getElementById('dropdown-list');
const dropdownItems = document.querySelectorAll('.dropdown-item');
const mainImage = document.getElementById('main-image');

// Toggle dropdown visibility
mainButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent click from closing it immediately
    dropdownList.style.display = dropdownList.style.display === 'block' ? 'none' : 'block';
});

// Handle option selection
dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const listItem = e.target.closest('li');
        const newImageSrc = listItem.getAttribute('data-image');
        console.log("Switching to image:", newImageSrc); 
        mainImage.src = newImageSrc; 
        dropdownList.style.display = 'none'; 
    });
});


// Click outside to close dropdown
document.addEventListener('click', (e) => {
    if (!mainButton.contains(e.target)) {
        dropdownList.style.display = 'none';
    }
});