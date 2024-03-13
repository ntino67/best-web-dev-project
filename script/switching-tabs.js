document.addEventListener('DOMContentLoaded', (event) => {
    // Get all the tabs
    let tabs = document.querySelectorAll('.tabs h2');

    // Add event listener to each tab
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // Remove active class from all tabs and add inactive class
            tabs.forEach(tab => {
                tab.classList.remove('active-tab');
                tab.classList.add('inactive-tab');
            });

            // Add active class to the clicked tab and remove inactive class
            this.classList.add('active-tab');
            this.classList.remove('inactive-tab');
        });
    });
});