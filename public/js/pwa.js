let deferredPrompt = null;

const installBtn = document.getElementById("installAppBtn");

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();

  deferredPrompt = event;

  if (installBtn) {
    installBtn.style.display = "flex";
  }
});

if (installBtn) {
  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) {
      alert("Install is not available right now. Please use Chrome and make sure the site is opened over HTTPS.");
      return;
    }

    deferredPrompt.prompt();

    const result = await deferredPrompt.userChoice;

    if (result.outcome === "accepted") {
      installBtn.style.display = "none";
    }

    deferredPrompt = null;
  });
}

window.addEventListener("appinstalled", () => {
  deferredPrompt = null;

  if (installBtn) {
    installBtn.style.display = "none";
  }
});
