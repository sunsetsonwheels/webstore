var allCategories={all:{name:"All apps",icon:"fas fa-store"}},selectedCategory="all";const categoriesTabsElement=document.getElementById("categories-tabs");function loadCategoriesTabs(){categoriesTabsElement.innerHTML="",allCategories.all={name:"All apps",icon:"fas fa-store"};for(const a in allCategories){var t={tab:document.createElement("li"),link:{container:document.createElement("a"),content:{icon:{container:document.createElement("span"),icon:document.createElement("i")},text:document.createElement("span")}}};for(var e of(t.tab.setAttribute("data-category-id",a),t.tab.classList.add("category-tab"),categoriesTabsElement.appendChild(t.tab),t.link.container.setAttribute("data-category-id",a),t.link.container.classList.add("category-link"),t.tab.appendChild(t.link.container),t.link.content.icon.container.setAttribute("data-category-id",a),t.link.content.icon.container.classList.add("icon","is-small","category-link"),t.link.container.appendChild(t.link.content.icon.container),allCategories[a].icon.split(" ")))t.link.content.icon.icon.classList.add(e);t.link.content.icon.icon.classList.add("category-link"),t.link.content.icon.icon.setAttribute("data-category-id",a),t.link.content.icon.container.appendChild(t.link.content.icon.icon),t.link.content.text.innerText=allCategories[a].name,t.link.content.text.setAttribute("data-category-id",a),t.link.content.text.classList.add("category-link"),t.link.container.appendChild(t.link.content.text)}document.querySelector('.category-tab[data-category-id*="'+selectedCategory+'"]').classList.add("is-active"),loadAppsFromCategories()}categoriesTabsElement.onclick=function(t){const e=t.target.classList;if((e.contains("category-link")||e.contains("category-tab"))&&(selectedCategory=t.target.getAttribute("data-category-id"))in allCategories){for(const t of document.querySelectorAll(".category-tab"))t.getAttribute("data-category-id")===selectedCategory?t.classList.add("is-active"):t.classList.remove("is-active");loadAppsFromCategories()}};