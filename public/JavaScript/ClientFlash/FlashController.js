// //This file is included in the main boilerplate
// // so simply use this function anywhere by its name
const fireClientFlash = async (success, text) => {
  console.log("FIred");
  if (text == "") return;
  const errorCont = document.getElementById("error-alert-client");
  const successCont = document.getElementById("success-alert-client");
  const successtext = document.getElementsByClassName("success-client")[0];
  const errortext = document.getElementsByClassName("error-client")[0];

  let instance;
  if (success) {
    instance = InsantiateAnimation(successCont, successtext, text);
  } else {
    instance = InsantiateAnimation(errorCont, errortext, text);
  }
  instance.play();
};

const InsantiateAnimation = (targetElem, targetDataDiv, data) => {
  targetDataDiv.innerHTML = data;

  const animationObject = anime.timeline({
    easing: "easeInOutQuad",
    duration: 2000,
    autoplay: false,
    complete: (animInstance) => {
      animInstance.reset();
    },
  });

  animationObject
    .add({
      targets: targetElem,
      opacity: [0, 1],
      translateX: ["100%", "0%"],
      duration: 1000,
    })
    .add({
      targets: targetElem,
      opacity: [1, 0],
      duration: 1000,
      delay: 1000,
    });

  return animationObject;
};
