const boxes = document.getElementsByClassName("card");

const inVH = (e) => {
  const rect = e.getBoundingClientRect();
  console.log(rect.top);
  return rect.top <= 700 && rect.top >= 300;
};

//Global flag
let flag = [false, false, false, false];

window.addEventListener("load", () => {
  for (let i = 0; i < boxes.length; i++) {
    let box = boxes[i];
    if (i % 2) box.style.transform = "translateX(+100vw)";
    else box.style.transform = "translateX(-100vw)";
  }
});

window.addEventListener("scroll", () => {
  for (let i = 0; i < boxes.length; i++) {
    let box = boxes[i];
    //   let box = boxes[0];
    if (inVH(box) && !flag[i]) {
      let animateString = "-100vw";
      if (i % 2) animateString = "100vw";
      anime({
        targets: box,
        //   translateX: [-window.innerWidth, 0], //old
        translateX: [animateString, "0"],
        opacity: [0, 1],
        duration: 2000,
        easing: "easeOutExpo",
      });
      flag[i] = true;
    }
  }
});
