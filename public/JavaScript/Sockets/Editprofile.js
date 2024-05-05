
var socket = io();
const saveEdit = document.getElementsByClassName("save-edit")[0];
//Updation Data

saveEdit.addEventListener("click" , async() => {
    const linkedIn = document.getElementsByClassName("linked-in-data")[0].value;
    const about = document.getElementById("gg-about").value;
    const fullname = document.getElementById("gg-username").value;
    const pronoun = document.getElementsByClassName("show-pronoun")[0].innerText;
    const loggedInId = document.getElementById("hidden-id-profile");
    const image = document.getElementById("gg-dp").files[0];
    console.log("Client side" , typeof(image));
    const userUpdate = {
        id : loggedInId,
        data : {linkedIn , about ,  fullname , pronoun ,image},
    };
    socket.emit("profile-changes" , userUpdate);
})