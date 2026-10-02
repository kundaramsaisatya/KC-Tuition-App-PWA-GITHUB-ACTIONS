(function () {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    });
  }

  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    deferredPrompt = event;
    const buttons = document.querySelectorAll('[data-install-app]');
    buttons.forEach(function (button) { button.hidden = false; });
  });

  document.addEventListener('click', function (event) {
    const button = event.target.closest('[data-install-app]');
    if (!button || !deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.finally(function () {
      deferredPrompt = null;
      button.hidden = true;
    });
  });
})();
