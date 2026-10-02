(function () {
  let deferredPrompt = null;

  // Register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker
        .register('/sw.js')
        .then(function () {
          console.log('Service worker registered');
        })
        .catch(function (error) {
          console.error('Service worker registration failed:', error);
        });
    });
  }

  // Browser says the app can be installed
  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();

    deferredPrompt = event;

    const buttons = document.querySelectorAll('[data-install-app]');

    buttons.forEach(function (button) {
      button.hidden = false;
    });

    console.log('Install prompt available');
  });

  // Install button click
  document.addEventListener('click', async function (event) {
    const button = event.target.closest('[data-install-app]');

    if (!button) return;

    if (!deferredPrompt) {
      alert(
        'The app cannot be installed from this button right now. ' +
        'Open your browser menu and choose "Add to Home screen" or "Install app".'
      );
      return;
    }

    try {
      deferredPrompt.prompt();

      const result = await deferredPrompt.userChoice;

      console.log('Install result:', result.outcome);

      deferredPrompt = null;
      button.hidden = true;

    } catch (error) {
      console.error('Install failed:', error);
    }
  });

  // Hide install button if the app is already installed
  window.addEventListener('appinstalled', function () {
    deferredPrompt = null;

    const buttons = document.querySelectorAll('[data-install-app]');

    buttons.forEach(function (button) {
      button.hidden = true;
    });

    console.log('App installed');
  });

})();
