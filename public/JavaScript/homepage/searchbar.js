const handle = document.getElementsByClassName("real-handle")[0];
const cf = document.getElementsByClassName("codeforces")[0];
const cc = document.getElementsByClassName("codechef")[0];
const displayHandle = document.getElementsByClassName("search-img-btn")[0];

cf.addEventListener("click",  () => {
    handle.value = "CF";
    displayHandle.innerHTML = "@cf";
})

cc.addEventListener("click" , () => {
    handle.value = "CC";
    displayHandle.innerHTML = "@cc";
})

console.log("connected")