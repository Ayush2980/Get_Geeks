//Dp change
const editDP = document.getElementsByClassName("edit-option")[0];
editDP.addEventListener("click", () => {
  document.getElementById("gg-dp").click();
});
//Edit profile
const editPrbtn = document.getElementsByClassName("edit-pr-btn")[0];
const secondDiv = document.getElementsByClassName("second-div")[0];
const thirdDiv = document.getElementsByClassName("third-div")[0];
editPrbtn.addEventListener("click", () => {
  thirdDiv.style.display = "flex";
  editDP.style.display = "flex";
  secondDiv.style.display = "none";
});

//he/him changes

const showPronoun = document.getElementsByClassName("show-pronoun")[0];
const pronounOption = document.getElementsByClassName("dd-pro");
for (let i = 0; i < pronounOption.length; i++) {
  pronounOption[i].addEventListener("click", () => {
    showPronoun.innerText = pronounOption[i].innerText;
  });
}

//Cancel and Save btn
const cancelBtn = document.getElementsByClassName("cancel-edit")[0];
const saveBtn = document.getElementsByClassName("save-edit")[0];
cancelBtn.addEventListener("click", () => {
  document.getElementsByClassName("third-div")[0].style.display = "none";
  editDP.style.display = "none";
  secondDiv.style.display = "block";
});
//click save btn
const thirdDivLoader = document.getElementsByClassName("third-div-loader")[0];
const pronounBtn = document.getElementsByClassName("pronoun-btn")[0];

saveBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const fullname = (document.getElementById("gg-fullname").value == "") ? undefined : document.getElementById("gg-fullname").value;
  const about = (document.getElementById("gg-about").value == "") ? undefined : document.getElementById("gg-about").value;
  const linkedIn = (document.getElementById("linkedin").value == "") ? undefined : document.getElementById("linkedin").value ;
  try {
    //add a loader
    editDP.style.display = "none";
    thirdDivLoader.style.display = "flex";
    pronounBtn.style.display = "none";

    const {data} = await axios.post("http://localhost:8000/profile/edit" , {fullname , about , linkedIn , pronoun : ((showPronoun.innerHTML.toString() == "") ? undefined :  showPronoun.innerHTML.toString())})
    document.getElementById("gg-fullname").value = "";
    document.getElementById("gg-about").value = "";
    document.getElementById("linkedin").value = "";
    //validating the data
    console.log(data);
    const {success , error = "No error"} = data;
    if(!success) throw Error(error);
    // const {fullname , linkedIn , about , pronoun} = data.userData;
    const {userData} = data;
    document.getElementsByClassName("name-and-pronoun")[0].innerHTML = `${userData.fullname} | ${userData.pronoun}`
    document.getElementsByClassName("user-about")[0].innerHTML = `${userData.about}`
    document.getElementsByClassName("linked-in-link")[0].href = `${userData.linkedIn}`
    console.log(userData);
    //end the loader
    thirdDivLoader.style.display = "none";
    pronounBtn.style.display = "block";
    secondDiv.style.display = "block";
    thirdDiv.style.display = "none";
    console.log(data);
} catch (e) {
    //end the loader with an error
    thirdDivLoader.style.display = "none";
    pronounBtn.style.display = "block";
    secondDiv.style.display = "block";
    thirdDiv.style.display = "none";
    console.log(e);
  }
});
