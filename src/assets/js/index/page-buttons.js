'use strict';

// Handle hamburger menu button.
for (const navbarBurger of document.getElementsByClassName("navbar-burger")) {
  navbarBurger.addEventListener("click", (e) => {
    e.target.classList.toggle('is-active');
    document.getElementById(e.target.dataset.target).classList.toggle('is-active');
  });
}

// Handle floating scrollup FAB button.
document.getElementById('scrolltop-fab').onclick = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}