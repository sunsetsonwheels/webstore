var allCategories = {}
var selectedCategories = []
var unselectedCategories = []

const categoriesListElement = document.getElementById('categories-list')

function loadCategoriesList () {
  selectedCategories.sort()
  unselectedCategories.sort()
  console.log('Selected categories: ' + selectedCategories)
  console.log('Unselected categories: ' + unselectedCategories)
  categoriesListElement.innerHTML = ''
  for (const selectedCategory of selectedCategories) {
    categoriesListElement.innerHTML += '<div class="control" data-category-id="' + selectedCategory + '"><div class="tags has-addons"><span class="tag is-success is-unselectable is-rounded"><i class="'+ allCategories[selectedCategory].icon +'"></i>' + allCategories[selectedCategory].name + '</span><a class="tag is-rounded is-delete delete-category" data-category-id="' + selectedCategory + '"></a></div></div>'
  }
  for (const unselectedCategory of unselectedCategories) {
    categoriesListElement.innerHTML += '<div class="control" data-category-id="' + unselectedCategory + '"><div class="tags has-addons"><span class="tag is-danger is-unselectable is-rounded"><i class="'+ allCategories[unselectedCategory].icon +'"></i>' + allCategories[unselectedCategory].name + '</span><a class="tag is-rounded is-delete add-category" data-category-id="' + unselectedCategory + '"></a></div></div>'
  }
  loadAppsFromCategories()
}

categoriesListElement.onclick = function (e) {
  const targetElementClasses = e.target.classList
  if (targetElementClasses.contains('delete-category')) {
    const targetCategoryId = e.target.getAttribute('data-category-id')
    console.log('Delete category: ' + targetCategoryId)
    selectedCategories.splice(selectedCategories.indexOf(targetCategoryId), 1)
    unselectedCategories.push(targetCategoryId)
    loadCategoriesList()
  } else if (targetElementClasses.contains('add-category')) {
    const targetCategoryId = e.target.getAttribute('data-category-id')
    console.log('Add category: ' + targetCategoryId)
    unselectedCategories.splice(unselectedCategories.indexOf(targetCategoryId), 1)
    selectedCategories.push(targetCategoryId)
    loadCategoriesList()
  }
}
