if (navigator.serviceWorker && 'serviceWorker' in navigator) {
  navigator.serviceWorker.onmessage = (event) => {
    console.log(event);
    if (event.data) {
      console.log(event.data);
    }
  };
}
