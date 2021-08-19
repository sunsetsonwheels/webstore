// Handle hamburger menu button.
for (const navbarBurger of document.getElementsByClassName('navbar-burger')) {
  navbarBurger.onclick = () => {
    navbarBurger.classList.toggle('is-active');
    document.getElementById(navbarBurger.dataset.target).classList.toggle('is-active');
  }
}

// Handle floating scrollup FAB button.
document.getElementById('scrolltop-fab').onclick = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Set default options for toast messages
bulmaToast.setDefaults({
  position: 'top-center',
  closeOnClick: true,
  pauseOnHover: true,
  animate: {
    in: 'bounceInDown',
    out: 'bounceOutUp'
  }
});

// StoreDbAPI class init.
const StoreDbAPI = new StoreDatabaseAPI();

// Global variables.
var currentSelectedCategory = 'all';
var isFirstInitCompleted = false;
var currentWebStoreVersion = 'Unknown';