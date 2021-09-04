'use strict';

var userCredentials = {
  username: null,
  logintoken: null
}
var isUserLoggedIn = false;

const userButton = {
  button: document.getElementById('user-button'),
  icon: document.getElementById('user-icon')
}

userButton.button.onclick = () => {
  if (isUserLoggedIn) {
    userCredentials.username = null
    userCredentials.logintoken = null
    userButton.button.classList.remove('is-danger')
    userButton.button.classList.add('is-link')
    userButton.icon.classList.add('fa-user')
    userButton.icon.classList.remove('fa-sign-out-alt')
    isUserLoggedIn = false
  } else {
    userModal.controller.show()
  }
}

const userModal = {
  controller: new BulmaModal('#user-modal'),
  content: {
    usernameInput: document.getElementById('user-modal-username-input'),
    logintokenInput: document.getElementById('user-modal-logintoken-input'),
    loginFailedBlurb: document.getElementById('user-modal-login-failed-blurb'),
    saveLoginCheckbox: document.getElementById('user-modal-save-login-checkbox')
  },
  buttons: {
    login: document.getElementById('user-modal-login-button')
  }
}

userModal.controller.addEventListener('modal:show', () => {
  let isLoginDetailsSaved = false

  const username = localStorage.getItem('webstore-bhackers-username');
  if (username !== null) {
      userModal.content.usernameInput.value = username
      isLoginDetailsSaved = true
  } else {
    userModal.content.usernameInput.value = ''
  }

  const logintoken = localStorage.getItem('webstore-bhackers-logintoken')
  if (logintoken !== null) {
    userModal.content.logintokenInput.value = logintoken
    isLoginDetailsSaved = true
  } else {
    userModal.content.logintokenInput.value = ''
  }

  if (isLoginDetailsSaved) {
    userModal.content.saveLoginCheckbox.checked = true
  }
})

userModal.controller.addEventListener('modal:close', () => {
  userModal.content.loginFailedBlurb.classList.add('is-hidden');
})

function loginSuccessCb () {
  userModal.content.usernameInput.disabled = false
  userModal.content.logintokenInput.disabled = false
  userModal.buttons.login.disabled = false
  userModal.buttons.login.classList.remove('is-loading')
  userButton.button.classList.remove('is-link')
  userButton.button.classList.add('is-danger')
  userButton.icon.classList.add('fa-sign-out-alt')
  userButton.icon.classList.remove('fa-user')
  userModal.controller.close()
  isUserLoggedIn = true
}

userModal.buttons.login.onclick = async () => {
  if (userModal.content.usernameInput.value !== "" && userModal.content.logintokenInput.value !== "") {
    userModal.buttons.login.classList.add('is-loading');
    userModal.buttons.login.disabled = true;
    userModal.content.loginFailedBlurb.classList.add('is-hidden');
    userCredentials.username = userModal.content.usernameInput.value;
    userCredentials.logintoken = userModal.content.logintokenInput.value;
    userModal.content.usernameInput.disabled = true;
    userModal.content.logintokenInput.disabled = true;
    try {
      await StoreDbAPI.loginToRatingsAccount(userCredentials.username, userCredentials.logintoken);
      loginSuccessCb();
    } catch {
      try {
        await StoreDbAPI.createRatingsAccount(userCredentials.username, userCredentials.logintoken);
        loginSuccessCb();
      } catch (err) {
        userModal.content.usernameInput.disabled = false
        userModal.content.logintokenInput.disabled = false
        userModal.buttons.login.disabled = false
        userModal.buttons.login.classList.remove('is-loading')
        userModal.content.loginFailedBlurb.classList.remove('is-hidden')
        console.error(err)
        bulmaToast.toast({
          message: err,
          type: "is-danger"
        });
      }
    }
  } else {
    userModal.content.loginFailedBlurb.classList.remove("is-hidden");
  }
}

userModal.content.saveLoginCheckbox.onchange = (e) => {
  if (e.target.checked) {
    localStorage.setItem('webstore-bhackers-username', userModal.content.usernameInput.value);
    localStorage.setItem('webstore-bhackers-logintoken', userModal.content.logintokenInput.value);
  } else {
    localStorage.removeItem('webstore-bhackers-username');
    localStorage.removeItem('webstore-bhackers-logintoken');
  }
}