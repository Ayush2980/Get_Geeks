const list = document.querySelectorAll(".nav__item");
list.forEach((item) => {
  item.addEventListener("click", () => {
    console.log("hello")
    list.forEach((item) => item.classList.remove("active"));
    item.classList.add("active");
  });
});