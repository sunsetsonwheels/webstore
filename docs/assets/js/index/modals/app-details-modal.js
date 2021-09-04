"use strict";const appDetailsModal={controller:new BulmaModal("#app-details-modal"),content:{name:document.getElementById("app-details-modal-app-name"),icon:document.getElementById("app-details-modal-app-icon"),screenshots:{container:document.getElementById("app-details-modal-app-screenshots-container"),scroller:document.getElementById("app-details-modal-app-screenshots")},descriptionSeparator:document.getElementById("app-details-modal-description-separator"),description:document.getElementById("app-details-modal-app-description"),categories:document.getElementById("app-details-modal-app-categories"),authors:document.getElementById("app-details-modal-app-authors"),maintainers:document.getElementById("app-details-modal-app-maintainers"),dependencies:document.getElementById("app-details-modal-app-dependencies"),version:document.getElementById("app-details-modal-app-version"),size:document.getElementById("app-details-modal-app-size"),type:document.getElementById("app-details-modal-app-type"),locales:document.getElementById("app-details-modal-app-locales"),has_ads:document.getElementById("app-details-modal-app-has_ads"),has_tracking:document.getElementById("app-details-modal-app-has_tracking"),license:document.getElementById("app-details-modal-app-license"),downloadCount:document.getElementById("app-details-modal-app-downloadCount"),ratings:{notLoggedIn:document.getElementById("app-details-modal-app-ratings-not-logged-in"),loggedIn:{container:document.getElementById("app-details-modal-app-ratings-logged-in"),details:document.getElementById("app-details-modal-app-ratings-logged-in-details"),points:document.getElementById("app-details-modal-app-ratings-logged-in-points"),description:document.getElementById("app-details-modal-app-ratings-logged-in-description"),ratingIncompleteBlurb:document.getElementById("app-details-modal-rating-incomplete-blurb"),submitButton:document.getElementById("app-details-modal-app-ratings-logged-in-submit-button")},averageRating:document.getElementById("app-details-modal-app-ratings-average-rating"),allRatings:document.getElementById("app-details-modal-app-ratings-all-ratings")}},buttons:{download:document.getElementById("app-details-modal-download-button"),website:document.getElementById("app-details-modal-website-button"),repo:document.getElementById("app-details-modal-repo-button"),donation:document.getElementById("app-details-modal-donation-button")}};async function reloadAppRatings(e){appDetailsModal.content.ratings.loggedIn.details.innerHTML="<strong>@Unknown</strong>",appDetailsModal.content.ratings.loggedIn.points.value=1,appDetailsModal.content.ratings.loggedIn.description.value="",appDetailsModal.content.ratings.loggedIn.points.disabled=!0,appDetailsModal.content.ratings.loggedIn.description.disabled=!0,appDetailsModal.content.ratings.loggedIn.ratingIncompleteBlurb.classList.add("is-hidden"),appDetailsModal.content.ratings.loggedIn.submitButton.classList.add("is-loading"),appDetailsModal.content.ratings.loggedIn.submitButton.disabled=!0,appDetailsModal.content.ratings.averageRating.innerText="Unknown ★",appDetailsModal.content.ratings.allRatings.innerHTML=i18next.t("load-ratings");try{const a=await StoreDbAPI.getAppRatings(e);appDetailsModal.content.ratings.allRatings.innerHTML="";var t=!1;a.average&&(appDetailsModal.content.ratings.averageRating.innerText=`${a.average.toFixed(1)} ★`);for(const e of a.ratings){const a=relTime.getRelativeTime(new Date(1e3*e.creationtime));e.username===userCredentials.username?(appDetailsModal.content.ratings.loggedIn.details.innerHTML=`<strong>@${e.username}</strong> (you) • <small>${a}</small>`,appDetailsModal.content.ratings.loggedIn.points.disabled=!1,appDetailsModal.content.ratings.loggedIn.description.disabled=!1,appDetailsModal.content.ratings.loggedIn.points.value=e.points,appDetailsModal.content.ratings.loggedIn.description.value=e.description,appDetailsModal.content.ratings.loggedIn.points.disabled=!0,appDetailsModal.content.ratings.loggedIn.description.disabled=!0,t=!0):appDetailsModal.content.ratings.allRatings.innerHTML+=`\n          <div class="box">\n            <article class="media">\n              <div class="media-content">\n                <div class="content">\n                  <p>\n                    <strong>@${e.username}</strong> • <small>${e.points} ★</small> • <small>${a}</small>\n                  </p>\n                  <p>${e.description}></p>\n                </div>\n              </div>\n            </acticle>\n          </div>\n        `}appDetailsModal.content.ratings.loggedIn.submitButton.setAttribute("data-app-appid",e),t?(appDetailsModal.content.ratings.loggedIn.points.disabled=!0,appDetailsModal.content.ratings.loggedIn.description.disabled=!0,appDetailsModal.content.ratings.loggedIn.submitButton.disabled=!0):(appDetailsModal.content.ratings.loggedIn.details.innerHTML=`<strong>@${userCredentials.username}</strong> (you)`,appDetailsModal.content.ratings.loggedIn.points.disabled=!1,appDetailsModal.content.ratings.loggedIn.description.disabled=!1,appDetailsModal.content.ratings.loggedIn.submitButton.disabled=!1),appDetailsModal.content.ratings.loggedIn.submitButton.classList.remove("is-loading")}catch(e){bulmaToast.toast({message:e,type:"is-danger"}),console.error(e)}}function setAppDetailsModalDetails(e){appDetailsModal.content.name.innerText=e.name,e.icon?appDetailsModal.content.icon.src=e.icon:appDetailsModal.content.icon.src="icons/default-icon.png",Array.isArray(e.screenshots)&&e.screenshots.length>0?(appDetailsModal.content.screenshots.container.classList.remove("is-hidden"),appDetailsModal.content.screenshots.scroller.innerHTML="",appDetailsModal.content.descriptionSeparator.classList.remove("is-hidden"),e.screenshots.forEach((e=>{appDetailsModal.content.screenshots.scroller.innerHTML+=`\n        <img src="${e}" style="padding: 4px">\n      `}))):(appDetailsModal.content.screenshots.container.classList.add("is-hidden"),appDetailsModal.content.descriptionSeparator.classList.add("is-hidden")),appDetailsModal.content.description.innerText=e.description,appDetailsModal.content.categories.innerText=generateReadableCategories(e.meta.categories),"string"==typeof e.author?appDetailsModal.content.authors.innerText=e.author:Array.isArray(e.author)?appDetailsModal.content.authors.innerText=separateArrayCommas(e.author):appDetailsModal.content.authors.innerText="?","string"==typeof e.maintainer?appDetailsModal.content.maintainers.innerText=e.maintainer:Array.isArray(e.maintainer)?appDetailsModal.content.maintainers.innerText=separateArrayCommas(e.maintainer):appDetailsModal.content.maintainers.innerText="?",e.dependencies?(appDetailsModal.content.dependencies.innerHTML="",e.dependencies.forEach((e=>{e.hasOwnProperty("url")?appDetailsModal.content.dependencies.innerHTML=`\n          <a href=${e.url} target="_blank">\n            ${e.name}\n          </a>&nbsp;\n        `:appDetailsModal.content.dependencies.innerHTML+=`${e.name}&nbsp;`}))):appDetailsModal.content.dependencies.innerText="?",e.download.version?appDetailsModal.content.version.innerText=e.download.version:e.download.manifest?(appDetailsModal.content.version.innerText="...",fetch(e.download.manifest).then((e=>{if(e.ok()){const t=e.json();t.version?appDetailsModal.content.version.innerText=t.version:appDetailsModal.content.version.innerText="?"}else appDetailsModal.content.version.innerText="?"})).catch((()=>appDetailsModal.content.version.innerText="?"))):appDetailsModal.content.version.innerText="?",appDetailsModal.content.type.innerText=e.type,e.locales?appDetailsModal.content.locales.innerText=separateArrayCommas(e.locales):appDetailsModal.content.locales.innerText="?",appDetailsModal.content.has_ads.innerText=`${i18next.t("ads")}: ${e.has_ads}`,appDetailsModal.content.has_tracking.innerText=`${i18next.t("tracking")}: ${e.has_tracking}`,e.license?appDetailsModal.content.license.innerText=e.license:appDetailsModal.content.license.innerText="?",StoreDbAPI.db.apps.downloadCounts[e.slug]?appDetailsModal.content.downloadCount.innerText=StoreDbAPI.db.apps.downloadCounts[e.slug]:appDetailsModal.content.downloadCount.innerText="?",reloadAppRatings(e.slug),e.download.url?(appDetailsModal.buttons.download.classList.remove("is-hidden"),appDetailsModal.content.size.innerText="...",fetch(e.download.url,{method:"HEAD"}).then((e=>{e.ok()?appDetailsModal.content.size.innerText=`${(e.headers.get("content-length")/1024).toFixed(2)} KB`:appDetailsModal.content.size.innerText="?"})).catch((()=>appDetailsModal.content.size.innerText="?"))):appDetailsModal.buttons.download.classList.add("is-hidden"),e.website?(appDetailsModal.buttons.website.classList.remove("is-hidden"),appDetailsModal.buttons.website.href=e.website):appDetailsModal.buttons.website.classList.add("is-hidden"),e.git_repo?(appDetailsModal.buttons.repo.classList.remove("is-hidden"),appDetailsModal.buttons.repo.href=e.git_repo):appDetailsModal.buttons.repo.classList.add("is-hidden"),e.donation?(appDetailsModal.buttons.donation.style.display="initial",appDetailsModal.buttons.donation.href=e.donation):appDetailsModal.buttons.donation.style.display="none",isUserLoggedIn?(appDetailsModal.content.ratings.notLoggedIn.classList.add("is-hidden"),appDetailsModal.content.ratings.loggedIn.container.classList.remove("is-hidden")):(appDetailsModal.content.ratings.loggedIn.container.classList.add("is-hidden"),appDetailsModal.content.ratings.notLoggedIn.classList.remove("is-hidden")),setAppDownloadModalDetails(e)}appDetailsModal.controller.addEventListener("modal:show",(function(){document.getElementsByTagName("html")[0].classList.add("is-clipped")})),appDetailsModal.controller.addEventListener("modal:close",(function(){document.getElementsByTagName("html")[0].classList.remove("is-clipped")})),appDetailsModal.buttons.download.onclick=()=>{appDownloadsModal.controller.show()},appDetailsModal.content.ratings.loggedIn.submitButton.onclick=async()=>{appDetailsModal.content.ratings.loggedIn.ratingIncompleteBlurb.classList.add("is-hidden"),appDetailsModal.content.ratings.loggedIn.description.value.length>2&&isUserLoggedIn?(appDetailsModal.content.ratings.loggedIn.submitButton.classList.add("is-loading"),appDetailsModal.content.ratings.loggedIn.submitButton.disabled=!0,appDetailsModal.content.ratings.loggedIn.points.disabled=!0,appDetailsModal.content.ratings.loggedIn.description.disabled=!0,StoreDbAPI.addNewRating(userCredentials.username,userCredentials.logintoken,appDetailsModal.content.ratings.loggedIn.submitButton.getAttribute("data-app-appid"),appDetailsModal.content.ratings.loggedIn.points.value,appDetailsModal.content.ratings.loggedIn.description.value).then((function(){setTimeout((async()=>{await reloadAppRatings(appDetailsModal.content.ratings.loggedIn.submitButton.getAttribute("data-app-appid"))}),2e3)})).catch((function(){setTimeout((async()=>{await reloadAppRatings(appDetailsModal.content.ratings.loggedIn.submitButton.getAttribute("data-app-appid"))}),2e3)}))):appDetailsModal.content.ratings.loggedIn.ratingIncompleteBlurb.classList.remove("is-hidden")};