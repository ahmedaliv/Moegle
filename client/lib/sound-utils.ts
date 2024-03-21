  export const playMatchNotification = () => {
    const audio = new Audio("/sounds/cartoon.mp3");
    audio.addEventListener(
      "canplaythrough",
      () => {
        audio.play();
      },
      { once: true }
    );
  };