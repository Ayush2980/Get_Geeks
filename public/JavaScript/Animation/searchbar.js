//SearchBar Animation

window.addEventListener("load", () => {
  const searchbar = document.getElementById("big-search");
  console.log("this is the animator this sid e");
  anime({
    targets: searchbar,
    opacity: [
      { value: 0, duration: 200 },
      { value: 1, duration: 800 },
    ],
    width: "80%", // Maximum width
    duration: 1000, // Duration of the animation in milliseconds
    easing: "easeInOutQuad", // Easing function for smooth animation
  });

  const platforms = document.getElementsByClassName("plats");
  const texts = document.getElementsByClassName("dropdown-item");
  for (let i = 0; i < 2; i++) {
    platforms[i].addEventListener("hover", () => {
      texts[i].style.color = `black`;
    });
  }
});
