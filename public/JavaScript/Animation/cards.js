const boxes = document.getElementsByClassName("card");
console.log("From animators : ", typeof window.innerWidth);
const inVH = (e) => {
  const rect = e.getBoundingClientRect();
  return rect.top <= 700 && rect.top >= 300;
};

//Global flag
let flag = [false, false, false, false];

window.addEventListener("load", () => {
  for (let i = 0; i < boxes.length; i++) {
    let box = boxes[i];
    if (window.innerWidth <= 800) {
      box.style.opacity = "0";
    } else {
      if (i % 2) box.style.transform = "translateX(+100vw)";
      else box.style.transform = "translateX(-100vw)";
    }
  }
});

window.addEventListener("scroll", () => {
  for (let i = 0; i < boxes.length; i++) {
    let box = boxes[i];
    if (inVH(box) && !flag[i]) {
      if (window.innerWidth <= 800) {
        console.log("small");
        anime({
          targets: box,
          opacity: [0, 1],
          duration: 2000,
          easing: "linear",
        });
      } else {
        let animateString = "-100vw";
        console.log("big", window.innerWidth);
        if (i % 2) animateString = "100vw";
        anime({
          targets: box,
          translateX: [animateString, "0"],
          opacity: [0, 1],
          duration: 2000,
          easing: "easeOutExpo",
        });
      }
      flag[i] = true;
    }
  }
});
