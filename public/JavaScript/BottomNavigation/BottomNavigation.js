const list = document.querySelectorAll(".nav__item");
list.forEach((item) => {
  item.addEventListener("click", () => {
    console.log("hello");
    list.forEach((item) => item.classList.remove("active"));
    item.classList.add("active");
  });
});

const indicator = document.querySelector(".nav-indicator-wrapper");
const items = document.querySelectorAll(".nav-item");

function handleIndicator(el) {
  items.forEach((item) => {
    item.classList.remove("is-active");
  });

  indicator.style.width = `${el.offsetWidth}px`;
  indicator.style.left = `${el.offsetLeft}px`;

  el.classList.add("is-active");
}
const obj = {
  home: document.getElementsByClassName("home-btm")[0],
  blogs: document.getElementsByClassName("blogs-btm")[0],
  comm: document.getElementsByClassName("comm-btm")[0],
  prof: document.getElementsByClassName("prof-btm")[0],
};
const currEndPoint = window.location.pathname;
if (currEndPoint == "/Blogs") {
  handleIndicator(obj.blogs);
  document.getElementById("blog-mob").style.fill = "#6ba7a8";
} else if (currEndPoint == "/find") {
  handleIndicator(obj.home);
  document.getElementById("home-mob").style.fill = "#6ba7a8";
} else if (currEndPoint == "/community") {
  handleIndicator(obj.comm);
} else {
  document.getElementById("login-mob").style.fill = "#6ba7a8";
  handleIndicator(obj.prof);
}

items.forEach((item) => {
  item.addEventListener("click", (e) => {
    handleIndicator(item);
  });

  item.classList.contains("is-active") && handleIndicator(item);
});
