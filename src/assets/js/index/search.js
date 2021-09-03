'use strict';

const searchInput = document.getElementById("search-input");
const searchButton = {
  button: document.getElementById("search-button"),
  icon: document.getElementById("search-button-icon")
}

var isSearching = false;

searchButton.button.onclick = () => {
  searchButton.button.classList.remove("is-primary", "is-danger");
  searchButton.icon.classList.remove("fa-search", "fa-times");
  if (isSearching) {
    isSearching = false;
    document.getElementById("categories-tabs-container").classList.remove("is-hidden");
    searchButton.button.classList.add("is-primary");
    searchButton.icon.classList.add("fa-search");
  } else {
    isSearching = true;
    document.getElementById("categories-tabs-container").classList.add("is-hidden");
    searchButton.button.classList.add("is-danger");
    searchButton.icon.classList.add("fa-times");
  }
  sortSelect.dispatchEvent(new Event('change'));
}
