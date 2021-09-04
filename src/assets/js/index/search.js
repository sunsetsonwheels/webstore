'use strict';

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const exitSearchButton = document.getElementById("exit-search-button");

var isSearching = false;

searchButton.onclick = () => {
  isSearching = true;
  document.getElementById("categories-tabs-container").classList.add("is-hidden");
  sortSelect.dispatchEvent(new Event('change'));
}

exitSearchButton.onclick = () => {
  isSearching = false;
  document.getElementById("categories-tabs-container").classList.remove("is-hidden");
  sortSelect.dispatchEvent(new Event('change'));
}
