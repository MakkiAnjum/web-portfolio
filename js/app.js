if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then((reg) => console.log('Service worker connected', reg))
    .catch((error) => console.log('Service worker connected', error))
}