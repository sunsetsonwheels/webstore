'use strict';

// Global variables.
var currentSelectedCategory = 'all';

const categoriesTabsElement = document.getElementById('categories-tabs');

categoriesTabsElement.onclick = (e) => {
  const targetElementClasses = e.target.classList
  if (targetElementClasses.contains('category-tab')) {
    currentSelectedCategory = e.target.getAttribute('data-category-id');
    for (const categoryTabElement of document.querySelectorAll('.category-tab')) {
      if (categoryTabElement.getAttribute('data-category-id') === currentSelectedCategory) {
        categoryTabElement.classList.add('is-active');
      } else {
        categoryTabElement.classList.remove('is-active');
      }
    }
    sortSelect.dispatchEvent(new Event('change'));
  }
}