'use strict';

// Language selector.
const databaseSelect = document.getElementById("database-select");

databaseSelect.onchange = async (e) => {
    e.target.disabled = true;
    sortSelect.disabled = true;
    reloadButton.disabled = true;
    searchInput.disabled = true;
    searchButton.disabled = true;
    exitSearchButton.disabled = true;

    switch (databaseSelect.value) {
        case 'openGiraffes-Store':
            MultiDB.openGiraffes();
            reloadData();
            break;
        case 'BananaHackers':
            MultiDB.BananaHackers();
            reloadData();
            break;
    }

    e.target.disabled = false;
    sortSelect.disabled = false;
    reloadButton.disabled = false;
    searchInput.disabled = false;
    searchButton.disabled = false;
    if (isSearching) exitSearchButton.disabled = false;
}