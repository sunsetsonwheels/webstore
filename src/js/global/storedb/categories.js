var allCategories = {}

const categoriesTabsElement = document.getElementById('categories-tabs')

function loadCategoriesTabs () {
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
    newCategoryTab.tab.appendChild(newCategoryTab.link.container)

    newCategoryTab.link.content.icon.container.classList.add('icon', 'is-small')
    newCategoryTab.link.container.appendChild(newCategoryTab.link.content.icon.container)

    for (var faIconClass of allCategories[category].icon.split(' ')) {
      newCategoryTab.link.content.icon.icon.classList.add(faIconClass)
    }
    newCategoryTab.link.content.icon.container.appendChild(newCategoryTab.link.content.icon.icon)

    newCategoryTab.link.content.text.innerText = allCategories[category].name
    newCategoryTab.link.container.appendChild(newCategoryTab.link.content.text)
  }
  loadAppsFromCategories()
}