const { ipcRenderer } = require('electron');

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const usernameInput = document.getElementById('username');
  const username = usernameInput.value.trim();

  if (username !== '') {
    // Send the username to the main process
    ipcRenderer.send('username-selected', username);
  }
});
