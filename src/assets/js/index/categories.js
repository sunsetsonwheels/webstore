var allCategories = {
  all: {
    name: 'All apps',
    icon: 'fas fa-store'
  }
}
var selectedCategory = 'all'



function loadCategoriesTabs () {
  categoriesTabsElement.innerHTML = ''
  allCategories.all = {
    name: 'All apps',
    icon: 'fas fa-store'
  }
  for (const category in allCategories) {
    var newCategoryTab = {
      tab: document.createElement('li'),
      link: {
        container: document.createElement('a'),
        content: {
          icon: {
            container: document.createElement('span'),
            icon: document.createElement('i')
          },
          text: document.createElement('span')
        }
      },
    }

    newCategoryTab.tab.setAttribute('data-category-id', category)
    newCategoryTab.tab.classList.add('category-tab')
    categoriesTabsElement.appendChild(newCategoryTab.tab)

    newCategoryTab.link.container.setAttribute('data-category-id', category)
    newCategoryTab.link.container.classList.add('category-link')
    newCategoryTab.tab.appendChild(newCategoryTab.link.container)

    newCategoryTab.link.content.icon.container.setAttribute('data-category-id', category)
    newCategoryTab.link.content.icon.container.classList.add('icon', 'is-small', 'category-link')
    newCategoryTab.link.container.appendChild(newCategoryTab.link.content.icon.container)

    for (var faIconClass of allCategories[category].icon.split(' ')) {
      newCategoryTab.link.content.icon.icon.classList.add(faIconClass)
    }
    newCategoryTab.link.content.icon.icon.classList.add('category-link')
    newCategoryTab.link.content.icon.icon.setAttribute('data-category-id', category)
    newCategoryTab.link.content.icon.container.appendChild(newCategoryTab.link.content.icon.icon)

    newCategoryTab.link.content.text.innerText = allCategories[category].name
    newCategoryTab.link.content.text.setAttribute('data-category-id', category)
    newCategoryTab.link.content.text.classList.add('category-link')
    newCategoryTab.link.container.appendChild(newCategoryTab.link.content.text)
  }
  document.querySelector('.category-tab[data-category-id*="' + selectedCategory +'"]').classList.add('is-active')
  loadAppsFromCategories()
}

categoriesTabsElement.onclick = function (e) {
  const targetElementClasses = e.target.classList
  if (targetElementClasses.contains('category-link') || targetElementClasses.contains('category-tab'))  {
    selectedCategory = e.target.getAttribute('data-category-id')
    if (selectedCategory in allCategories) {
      for (const categoryTabElement of document.querySelectorAll('.category-tab')) {
        if (categoryTabElement.getAttribute('data-category-id') === selectedCategory) {
          categoryTabElement.classList.add('is-active')
        } else {
          categoryTabElement.classList.remove('is-active')
        }
      }
      loadAppsFromCategories()
    }
  }
}