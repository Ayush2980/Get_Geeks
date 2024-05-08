
//Dp change 
const editDP = document.getElementsByClassName("edit-option")[0];
editDP.addEventListener("click" , () => {
    document.getElementById("gg-dp").click();
})
//Edit profile
const secondDiv = document.getElementsByClassName("second-div")[0];
secondDiv.addEventListener("click", () => {
  document.getElementsByClassName("third-div")[0].style.display = "flex";
  editDP.style.display = "flex";
  secondDiv.style.display = "none";
});

//he/him changes

const showPronoun = document.getElementsByClassName("show-pronoun")[0];
const pronounOption = document.getElementsByClassName("dd-pro");
for (let i = 0; i < pronounOption.length; i++) {
    pronounOption[i].addEventListener("click" , () => {
        showPronoun.innerText = pronounOption[i].innerText;
    })
}

//Cancel and Save btn
const cancelBtn = document.getElementsByClassName("cancel-edit")[0];
const saveBtn = document.getElementsByClassName("save-edit")[0];
cancelBtn.addEventListener("click" , () => {
    document.getElementsByClassName("third-div")[0].style.display = "none";
    editDP.style.display = "none";
    secondDiv.style.display = "block";
});

saveBtn.addEventListener("click" , async(e) => {
    e.preventDefault();
    const fullname = document.getElementById("gg-fullname").value;
    const about = document.getElementById("gg-about").value;
    //pronoun => showPronoun
    const linkedIn = document.getElementById("linkedin").value;
    console.log(fullname, showPronoun.innerHTML , about , linkedIn);
    try{
        //add a loader
        const {response} = await axios.post("http://localhost:8000/Blogs/react/${userIdLoggedIn}/${blogId}" , {username , about , linkedIn , pronoun : showPronoun})
        //end the loader
        
    }
    catch(e){
        //end the loader with an error
        console.log(e);
    }

});