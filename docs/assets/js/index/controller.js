"use strict";var currentSelectedCategory="all",StoreDbAPI=new StoreDatabaseAPI,isFirstInitCompleted=!1,currentWebStoreVersion="";function separateArrayCommas(e){var t="";const a=e.length;for(const n in e)t+=n+1<a?e[n]+", ":e[n]+" ";return t}function generateReadableCategories(e){var t=[];for(const a in e){const n=e[a],o=StoreDbAPI.db.categories[n].name;o?t.push(o):t.push(n)}return separateArrayCommas(t)}function listAppsByCategory(e,t){return StoreDbAPI.sortApps(StoreDbAPI.getAppsByCategory(e),t)}function reloadAppRatings(e){appDetailsModal.content.ratings.loggedIn.points.value=1,appDetailsModal.content.ratings.loggedIn.description.value="",appDetailsModal.content.ratings.loggedIn.points.disabled=!0,appDetailsModal.content.ratings.loggedIn.description.disabled=!0,appDetailsModal.content.ratings.loggedIn.ratingIncompleteBlurb.classList.add("is-hidden"),appDetailsModal.content.ratings.loggedIn.submitButton.classList.add("is-loading"),appDetailsModal.content.ratings.loggedIn.submitButton.disabled=!0,appDetailsModal.content.ratings.allRatings.innerHTML="Loading ratings... <br>",StoreDbAPI.getAppRatings(e).then((function(t){appDetailsModal.content.ratings.allRatings.innerHTML="";var a=!1;if(t.response.data.average){var n=document.createElement("h3");n.classList.add("title","is-6","is-unselectable"),n.innerText=`Average points rating: ${t.response.data.average} points`,appDetailsModal.content.ratings.allRatings.appendChild(n),n.appendChild(document.createElement("hr"))}for(const e of t.response.data.ratings)if(e.username==userDetails.username)appDetailsModal.content.ratings.loggedIn.points.disabled=!1,appDetailsModal.content.ratings.loggedIn.description.disabled=!1,appDetailsModal.content.ratings.loggedIn.points.value=e.points,appDetailsModal.content.ratings.loggedIn.description.value=e.description,appDetailsModal.content.ratings.loggedIn.points.disabled=!0,appDetailsModal.content.ratings.loggedIn.description.disabled=!0,a=!0;else{var o=document.createElement("div");o.classList.add("card"),appDetailsModal.content.ratings.allRatings.appendChild(o),appDetailsModal.content.ratings.allRatings.appendChild(document.createElement("br"));var s=document.createElement("div");s.classList.add("card-content"),o.appendChild(s);var l=document.createElement("p");l.classList.add("title","is-5"),l.innerText=e.description,s.appendChild(l);var i=document.createElement("p");i.classList.add("subtitle","is-6"),i.innerText=`${e.username} • ${e.points} points • ${new Date(e.creationtime)}`,s.appendChild(i)}appDetailsModal.content.ratings.loggedIn.submitButton.setAttribute("data-app-appid",e),a?(appDetailsModal.content.ratings.loggedIn.points.disabled=!0,appDetailsModal.content.ratings.loggedIn.description.disabled=!0,appDetailsModal.content.ratings.loggedIn.submitButton.disabled=!0):(appDetailsModal.content.ratings.loggedIn.points.disabled=!1,appDetailsModal.content.ratings.loggedIn.description.disabled=!1,appDetailsModal.content.ratings.loggedIn.submitButton.disabled=!1),appDetailsModal.content.ratings.loggedIn.submitButton.classList.remove("is-loading");var d=document.createElement("span");d.classList.add("title","is-6"),d.innerText="No more ratings.",appDetailsModal.content.ratings.allRatings.appendChild(d),appDetailsModal.content.ratings.allRatings.appendChild(document.createElement("hr"))})).catch((function(e){bulmaToast.toast({message:"Ratings could not be loaded! Check the console for more info.",type:"is-danger"}),console.error(e)}))}var appDownloadsModal={controller:new BulmaModal("#app-download-modal"),content:{name:document.getElementById("app-download-modal-app-name"),icon:document.getElementById("app-download-modal-app-icon"),qrcode:document.getElementById("app-download-modal-app-download-qrcode")},buttons:{download:document.getElementById("app-download-modal-download-button")}};appDownloadsModal.buttons.download.onclick=function(e){e.target.classList.add("is-loading"),e.target.disabled=!0,StoreDbAPI.dlCountApp(e.target.getAttribute("data-app-appid")).then((function(){e.target.disabled=!1,e.target.classList.remove("is-loading")})).catch((function(){e.target.disabled=!1,e.target.classList.remove("is-loading"),bulmaToast.toast({message:"Failed to record download count! Check the console for more info.",type:"is-danger"})})),window.open(e.target.getAttribute("data-app-download"),"_blank")};var appDetailsModal={controller:new BulmaModal("#app-details-modal"),content:{name:document.getElementById("app-details-modal-app-name"),icon:document.getElementById("app-details-modal-app-icon"),screenshots:{container:document.getElementById("app-details-modal-app-screenshots-container"),scroller:document.getElementById("app-details-modal-app-screenshots")},descriptionSeparator:document.getElementById("app-details-modal-description-separator"),description:document.getElementById("app-details-modal-app-description"),categories:document.getElementById("app-details-modal-app-categories"),maintainer:document.getElementById("app-details-modal-app-maintainer"),version:document.getElementById("app-details-modal-app-version"),type:document.getElementById("app-details-modal-app-type"),has_ads:document.getElementById("app-details-modal-app-has_ads"),has_tracking:document.getElementById("app-details-modal-app-has_tracking"),license:document.getElementById("app-details-modal-app-license"),downloadCount:document.getElementById("app-details-modal-app-downloadCount"),ratings:{notLoggedIn:document.getElementById("app-details-modal-app-ratings-not-logged-in"),loggedIn:{container:document.getElementById("app-details-modal-app-ratings-logged-in"),points:document.getElementById("app-details-modal-app-ratings-logged-in-points"),description:document.getElementById("app-details-modal-app-ratings-logged-in-description"),ratingIncompleteBlurb:document.getElementById("app-details-modal-rating-incomplete-blurb"),submitButton:document.getElementById("app-details-modal-app-ratings-logged-in-submit-button")},allRatings:document.getElementById("app-details-modal-app-ratings-all-ratings")}},buttons:{download:document.getElementById("app-details-modal-download-button"),donation:document.getElementById("app-details-modal-donation-button")}};appDetailsModal.controller.addEventListener("modal:show",(function(){document.getElementsByTagName("html")[0].classList.add("is-clipped")})),appDetailsModal.controller.addEventListener("modal:close",(function(){document.getElementsByTagName("html")[0].classList.remove("is-clipped")})),appDetailsModal.buttons.download.onclick=function(){appDownloadsModal.controller.show()},appDetailsModal.buttons.donation.onclick=function(e){window.open(e.target.getAttribute("data-app-donate"),"_blank")},appDetailsModal.content.ratings.loggedIn.submitButton.onclick=function(e){appDetailsModal.content.ratings.loggedIn.ratingIncompleteBlurb.classList.add("is-hidden"),appDetailsModal.content.ratings.loggedIn.description.value.length>2&&isUserLoggedIn?(e.target.classList.add("is-loading"),e.target.disabled=!0,appDetailsModal.content.ratings.loggedIn.points.disabled=!0,appDetailsModal.content.ratings.loggedIn.description.disabled=!0,StoreDbAPI.addNewRating(userDetails.username,userDetails.logintoken,e.target.getAttribute("data-app-appid"),appDetailsModal.content.ratings.loggedIn.points.value,appDetailsModal.content.ratings.loggedIn.description.value).then((function(){setTimeout((function(){reloadAppRatings(e.target.getAttribute("data-app-appid"))}),2e3)})).catch((function(){setTimeout((function(){reloadAppRatings(e.target.getAttribute("data-app-appid"))}),2e3)}))):appDetailsModal.content.ratings.loggedIn.ratingIncompleteBlurb.classList.remove("is-hidden")};var appCardColumn=0,appCardsColumnElements=[document.getElementById("app-cards-column-0"),document.getElementById("app-cards-column-1"),document.getElementById("app-cards-column-2")],appCardsContainerElement=document.getElementById("app-cards-container");function addAppCard(e){appCardsColumnElements[appCardColumn].appendChild(document.createElement("br"));var t=document.createElement("div");t.classList.add("card"),t.id=e.slug,appCardsColumnElements[appCardColumn].appendChild(t);var a=document.createElement("div");a.classList.add("card-content"),t.appendChild(a);var n=document.createElement("div");n.classList.add("media"),a.appendChild(n);var o=document.createElement("div");o.classList.add("media-left"),n.appendChild(o);var s=document.createElement("figure");s.classList.add("image","is-48x48","is-unselectable");var l=document.createElement("img");l.src=e.icon,s.appendChild(l),o.appendChild(s);var i=document.createElement("div");i.classList.add("media-content"),n.appendChild(i);var d=document.createElement("p");d.classList.add("title","is-4"),d.innerText=e.name,i.appendChild(d);var r=document.createElement("p");r.classList.add("subtitle","is-6"),r.innerText=generateReadableCategories(e.meta.categories),i.appendChild(r);var c=document.createElement("div");c.classList.add("content"),c.innerText=e.description,a.appendChild(c);var p=document.createElement("footer");p.classList.add("card-footer"),t.appendChild(p);var u=document.createElement("a");if(u.classList.add("card-footer-item","is-unselectable","app"),u.setAttribute("data-app-categories",e.meta.categories.toString()),u.setAttribute("data-app-name",e.name),u.innerText="View app details",p.appendChild(u),navigator.share)(g=document.createElement("a")).classList.add("card-footer-item","is-unselectable"),g.innerText="Share link to app",g.onclick=function(){navigator.share({title:e.name,text:e.description,url:"https://store.bananahackers.net/#"+e.slug}).then((function(){console.log(`[Index Controller] Shared app '${e.slug}' successfully.`)})).catch((function(t){console.error(`[Index Controller] Could not share app '${e.slug}': `+t)}))},p.appendChild(g);else if(navigator.clipboard){var g;(g=document.createElement("a")).classList.add("card-footer-item","is-unselectable"),g.innerText="Copy link to app",g.onclick=function(){navigator.clipboard.writeText("https://store.bananahackers.net/#"+e.slug).then((function(){console.log(`[Index Controller] Copied app '${e.slug}' to clipboard successfully.`)})).catch((function(t){console.error(`[Index Controller] Could not copy app '${e.slug}' to clipboard: `+t)}))},p.appendChild(g)}switch(appCardColumn){case 0:appCardColumn=1;break;case 1:appCardColumn=2;break;case 2:appCardColumn=0}}appCardsContainerElement.onclick=function(e){if(e.target.classList.contains("app")){const n=e.target.getAttribute("data-app-categories").split(",")[0];if(n in StoreDbAPI.db.apps.categorical){const o=StoreDbAPI.db.apps.categorical[n][e.target.getAttribute("data-app-name")];if(o){if(o.name?(appDetailsModal.content.name.innerText=o.name,appDownloadsModal.content.name.innerText=o.name):(appDetailsModal.content.name.innerText="Unknown app name",appDownloadsModal.content.name.innerText="Unknown app name"),o.icon?(appDetailsModal.content.icon.src=o.icon,appDownloadsModal.content.icon.src=o.icon):(appDetailsModal.content.icon.src="icons/default-icon.png",appDownloadsModal.content.icon.src="icons/default-icon.png"),o.screenshots.length>0)for(var t of(appDetailsModal.content.screenshots.container.style.display="initial",appDetailsModal.content.screenshots.scroller.innerHTML="",appDetailsModal.content.descriptionSeparator.classList.remove("is-hidden"),o.screenshots)){var a=document.createElement("img");a.style.padding="4px",a.src=t,appDetailsModal.content.screenshots.scroller.appendChild(a)}else appDetailsModal.content.screenshots.container.style.display="none",appDetailsModal.content.descriptionSeparator.classList.add("is-hidden");o.description?appDetailsModal.content.description.innerText=o.description:appDetailsModal.content.description.innerText="No description.",o.meta.categories?appDetailsModal.content.categories.innerHTML="Categories: <b>"+generateReadableCategories(o.meta.categories)+"</b>":appDetailsModal.content.categories.innerHTML="Categories: <b>unknown</b>",o.author?"string"==typeof o.author?appDetailsModal.content.maintainer.innerHTML="Author(s): <b>"+o.author+"</b>":Array.isArray(o.author)&&(appDetailsModal.content.maintainer.innerHTML="Author(s): <b>"+separateArrayCommas(o.author)+"</b>"):o.maintainer?"string"==typeof o.maintainer?appDetailsModal.content.maintainer.innerHTML="Maintainer(s): <b>"+o.maintainer+"</b>":Array.isArray(o.maintainer)&&(appDetailsModal.content.maintainer.innerHTML="Maintainer(s): <b>"+separateArrayCommas(o.maintainer)+"</b>"):appDetailsModal.content.maintainer.innerHTML="Authors/maintainers: <b>unknown</b>",o.download.version?appDetailsModal.content.version.innerHTML="Version: <b>"+o.download.version+"</b>":appDetailsModal.content.version.innerHTML="Version: <b>unknown</b>",o.type?appDetailsModal.content.type.innerHTML="Type: <b>"+o.type+"</b>":appDetailsModal.content.type.innerHTML="Type: <b>unknown</b>",void 0!==o.has_ads?appDetailsModal.content.has_ads.innerHTML="Ads: <b>"+o.has_ads+"</b>":appDetailsModal.content.has_ads.innerHTML="Ads: <b>unknown</b>",void 0!==o.has_tracking?appDetailsModal.content.has_tracking.innerHTML="Tracking: <b>"+o.has_tracking+"</b>":appDetailsModal.content.has_tracking.innerHTML="Tracking: <b>unknown</b>",o.license?appDetailsModal.content.license.innerHTML="License: <b>"+o.license+"</b>":appDetailsModal.content.license.innerHTML="License: <b>unknown</b>",StoreDbAPI.db.apps.downloadCounts[o.slug]?appDetailsModal.content.downloadCount.innerHTML="Downloads: <b>"+StoreDbAPI.db.apps.downloadCounts[o.slug]+"</b>":appDetailsModal.content.downloadCount.innerHTML="Downloads: <b>unknown</b>",reloadAppRatings(o.slug),o.download.url?(appDetailsModal.buttons.download.style.display="initial",appDetailsModal.buttons.download.setAttribute("data-app-download",o.download.url),appDownloadsModal.buttons.download.style.display="initial",appDownloadsModal.buttons.download.setAttribute("data-app-download",o.download.url),appDownloadsModal.buttons.download.setAttribute("data-app-appid",o.slug),appDownloadsModal.content.qrcode.innerHTML="",new QRCode(appDownloadsModal.content.qrcode,"bhackers:"+o.slug)):(appDetailsModal.buttons.download.style.display="none",appDownloadsModal.buttons.download.style.display="none"),o.donation?(appDetailsModal.buttons.donation.style.display="initial",appDetailsModal.buttons.donation.setAttribute("data-app-donate",o.donation)):appDetailsModal.buttons.donation.style.display="none",isUserLoggedIn?(appDetailsModal.content.ratings.notLoggedIn.classList.add("is-hidden"),appDetailsModal.content.ratings.loggedIn.container.classList.remove("is-hidden")):(appDetailsModal.content.ratings.loggedIn.container.classList.add("is-hidden"),appDetailsModal.content.ratings.notLoggedIn.classList.remove("is-hidden")),appDetailsModal.controller.show()}else bulmaToast.toast({message:'App does not exist in category "'+n+'"!',type:"is-danger"})}else bulmaToast.toast({message:'Given category "'+n+'" does not exist!',type:"is-danger"})}},document.getElementById("scrolltop-fab").onclick=function(){window.scrollTo({top:0,behavior:"smooth"})};var reloadButton=document.getElementById("reload-button"),sortSelect=document.getElementById("sort-select");sortSelect.onchange=function(e){reloadButton.classList.add("is-loading");var t=document.getElementById("sort-icon");switch(t.classList.remove("fa-sort-alpha-down","fa-fire-alt","fa-tags"),e.target.value){case"alphabetical":t.classList.add("fa-sort-alpha-down");break;case"popularity":t.classList.add("fa-fire-alt");break;case"categorical":t.classList.add("fa-tags")}for(var a of(sortSelect.disabled=!0,reloadButton.disabled=!0,appCardsColumnElements))a.innerHTML="";appCardColumn=0,listAppsByCategory(currentSelectedCategory,e.target.value).then((function(e){for(const t in e)addAppCard(e[t]);reloadButton.classList.remove("is-loading"),sortSelect.disabled=!1,reloadButton.disabled=!1;try{const e=window.location.hash.split("#")[1];window.location.hash=void 0!==e?e:""}catch(e){window.location.hash=""}bulmaToast.toast({message:"Apps sorted successfully!",type:"is-success"})})).catch((function(e){reloadButton.classList.remove("is-loading"),sortSelect.disabled=!1,reloadButton.disabled=!1,bulmaToast.toast({message:"Apps could not be sorted! Check the console for more info.",type:"is-danger"}),console.log(e)}))};var categoriesTabsElement=document.getElementById("categories-tabs");categoriesTabsElement.onclick=function(e){const t=e.target.classList;if((t.contains("category-link")||t.contains("category-tab"))&&(currentSelectedCategory=e.target.getAttribute("data-category-id"))in StoreDbAPI.db.categories){for(const e of document.querySelectorAll(".category-tab"))e.getAttribute("data-category-id")===currentSelectedCategory?e.classList.add("is-active"):e.classList.remove("is-active");sortSelect.dispatchEvent(new Event("change"))}};var userDetails={username:null,logintoken:null},userModal={controller:new BulmaModal("#user-modal"),content:{usernameInput:document.getElementById("user-modal-username-input"),logintokenInput:document.getElementById("user-modal-logintoken-input"),loginFailedBlurb:document.getElementById("user-modal-login-failed-blurb"),saveLoginCheckbox:document.getElementById("user-modal-save-login-checkbox")},buttons:{login:document.getElementById("user-modal-login-button")}};userModal.controller.addEventListener("modal:show",(function(){var e=!1;const t=localStorage.getItem("webstore-ratings-username");null!==t?(userModal.content.usernameInput.value=t,e=!0):userModal.content.usernameInput.value="";const a=localStorage.getItem("webstore-ratings-logintoken");null!==a?(userModal.content.logintokenInput.value=a,e=!0):userModal.content.logintokenInput.value="",e&&(userModal.content.saveLoginCheckbox.checked=!0)})),userModal.controller.addEventListener("modal:close",(function(){userModal.content.loginFailedBlurb.classList.add("is-hidden")}));var isUserLoggedIn=!1,userButton={button:document.getElementById("user-button"),icon:document.getElementById("user-icon")};function loginSuccessCb(){userModal.content.usernameInput.disabled=!1,userModal.content.logintokenInput.disabled=!1,userModal.buttons.login.disabled=!1,userModal.buttons.login.classList.remove("is-loading"),userButton.button.classList.remove("is-link"),userButton.button.classList.add("is-danger"),userButton.icon.classList.add("fa-sign-out-alt"),userButton.icon.classList.remove("fa-user"),userModal.controller.close(),isUserLoggedIn=!0}userButton.button.onclick=function(){isUserLoggedIn?(userDetails.username=null,userDetails.logintoken=null,userButton.button.classList.remove("is-danger"),userButton.button.classList.add("is-link"),userButton.icon.classList.add("fa-user"),userButton.icon.classList.remove("fa-sign-out-alt"),isUserLoggedIn=!1):userModal.controller.show()},userModal.buttons.login.onclick=function(){userModal.buttons.login.classList.add("is-loading"),userModal.buttons.login.disabled=!0,userModal.content.loginFailedBlurb.classList.add("is-hidden"),userDetails.username=userModal.content.usernameInput.value,userDetails.logintoken=userModal.content.logintokenInput.value,userModal.content.usernameInput.disabled=!0,userModal.content.logintokenInput.disabled=!0,StoreDbAPI.loginToRatingsAccount(userDetails.username,userDetails.logintoken).then((function(e){loginSuccessCb()})).catch((function(e){StoreDbAPI.createRatingsAccount(userDetails.username,userDetails.logintoken).then((function(e){loginSuccessCb()})).catch((function(t){userModal.content.usernameInput.disabled=!1,userModal.content.logintokenInput.disabled=!1,userModal.buttons.login.disabled=!1,userModal.buttons.login.classList.remove("is-loading"),userModal.content.loginFailedBlurb.classList.remove("is-hidden"),console.error(e)}))}))},userModal.content.saveLoginCheckbox.onchange=function(e){e.target.checked?(localStorage.setItem("webstore-ratings-username",userModal.content.usernameInput.value),localStorage.setItem("webstore-ratings-logintoken",userModal.content.logintokenInput.value)):(localStorage.removeItem("webstore-ratings-username"),localStorage.removeItem("webstore-ratings-logintoken"))};var updateModal={controller:new BulmaModal("#webstore-update-modal"),buttons:{update:document.getElementById("webstore-update-modal-update-button")}};function reloadData(){sortSelect.disabled=!0,reloadButton.classList.add("is-loading"),reloadButton.disabled=!0;var e=document.getElementById("webstore-github-commit-label");for(var t of(e.classList.remove("is-danger"),categoriesTabsElement.innerHTML="",appCardsColumnElements))t.innerHTML="";StoreDbAPI.loadData().then((function(t){for(const e in t.categories){var a={tab:document.createElement("li"),link:{container:document.createElement("a"),content:{icon:{container:document.createElement("span"),icon:document.createElement("i")},text:document.createElement("span")}}};for(var n of(a.tab.setAttribute("data-category-id",e),a.tab.classList.add("category-tab"),categoriesTabsElement.appendChild(a.tab),a.link.container.setAttribute("data-category-id",e),a.link.container.classList.add("category-link"),a.tab.appendChild(a.link.container),a.link.content.icon.container.setAttribute("data-category-id",e),a.link.content.icon.container.classList.add("icon","is-small","category-link"),a.link.container.appendChild(a.link.content.icon.container),t.categories[e].icon.split(" ")))a.link.content.icon.icon.classList.add(n);a.link.content.icon.icon.classList.add("category-link"),a.link.content.icon.icon.setAttribute("data-category-id",e),a.link.content.icon.container.appendChild(a.link.content.icon.icon),a.link.content.text.innerText=t.categories[e].name,a.link.content.text.setAttribute("data-category-id",e),a.link.content.text.classList.add("category-link"),a.link.container.appendChild(a.link.content.text)}document.querySelector(`.category-tab[data-category-id*="${currentSelectedCategory}"]`).classList.add("is-active"),sortSelect.dispatchEvent(new Event("change"));var o=document.getElementById("data-generated-time-label");t.generatedAt&&(o.innerText=dayjs(t.generatedAt).fromNow(),o.classList.remove("is-danger"),o.classList.add("is-success"));var s=document.getElementById("data-total-apps-label");s.innerText=t.apps.raw.length,s.classList.remove("is-danger"),s.classList.add("is-success");var l=new Worker("assets/js/index/workers/githubcommit-worker.js");l.onmessage=function(t){l.terminate(),null!==t.data&&(e.innerText=t.data.substring(0,7),e.setAttribute("href","https://github.com/jkelol111/webstore/blob/"+t.data+"/src/"),e.classList.remove("is-danger"),e.classList.add("is-success"),isFirstInitCompleted||(currentWebStoreVersion=t.data,isFirstInitCompleted=!0),t.data!==currentWebStoreVersion&&updateModal.controller.show())},l.postMessage(null),bulmaToast.toast({message:"Data loaded successfully!",type:"is-success"})})).catch((function(e){bulmaToast.toast({message:"Data could not be loaded! Check the console for more info.",type:"is-danger"}),console.error(e)}))}updateModal.buttons.update.onclick=function(){location.reload()},reloadButton.onclick=function(){reloadData()},reloadData();