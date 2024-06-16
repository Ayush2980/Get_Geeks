const Handle = document.getElementsByClassName("real-handle")[0];
const cf = document.getElementsByClassName("codeforces")[0];
const cc = document.getElementsByClassName("codechef")[0];
const displayHandle = document.getElementsByClassName("search-img-btn")[0];

cf.addEventListener("click", () => {
  Handle.value = "CF";
  displayHandle.innerHTML = "@cf";
});

cc.addEventListener("click", () => {
  Handle.value = "CC";
  displayHandle.innerHTML = "@cc";
});

console.log("connected");


//
