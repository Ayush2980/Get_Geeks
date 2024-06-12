window.addEventListener("load", async () => {
  //Dp change
  const editDP = document.getElementsByClassName("edit-option")[0];
  editDP.addEventListener("click", () => {
    document.getElementById("gg-dp").click();
  });
  //Edit profile
  const editPrbtn = document.getElementsByClassName("edit-pr-btn")[0];
  const secondDiv = document.getElementsByClassName("second-div")[0];
  const thirdDiv = document.getElementsByClassName("third-div")[0];
  if (editPrbtn) {
    editPrbtn.addEventListener("click", () => {
      thirdDiv.style.display = "flex";
      editDP.style.display = "flex";
      secondDiv.style.display = "none";
    });
  }

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
    const fullname =
      document.getElementById("gg-fullname").value == ""
        ? undefined
        : document.getElementById("gg-fullname").value;
    const about =
      document.getElementById("gg-about").value == ""
        ? undefined
        : document.getElementById("gg-about").value;
    const linkedIn =
      document.getElementById("linkedin").value == ""
        ? undefined
        : document.getElementById("linkedin").value;
    try {
      //add a loader
      editDP.style.display = "none";
      thirdDivLoader.style.display = "flex";
      pronounBtn.style.display = "none";

      const { data } = await axios.post("http://localhost:8000/profile/edit", {
        fullname,
        about,
        linkedIn,
        pronoun:
          showPronoun.innerHTML.toString() == ""
            ? undefined
            : showPronoun.innerHTML.toString(),
      });
      document.getElementById("gg-fullname").value = "";
      document.getElementById("gg-about").value = "";
      document.getElementById("linkedin").value = "";
      //validating the data
      console.log(data);
      const { success, error = "No error" } = data;
      if (!success) throw Error(error);
      // const {fullname , linkedIn , about , pronoun} = data.userData;
      const { userData } = data;
      document.getElementsByClassName(
        "name-and-pronoun"
      )[0].innerHTML = `${userData.fullname} | ${userData.pronoun}`;
      document.getElementsByClassName(
        "user-about"
      )[0].innerHTML = `${userData.about}`;
      document.getElementsByClassName(
        "linked-in-link"
      )[0].href = `${userData.linkedIn}`;
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
  //load user Data
  const profCard = document.getElementsByClassName("prof-handle-card");
  const ccProfName =
    document.getElementsByClassName("cc-prof-name")[0].innerHTML;
  const cfProfName =
    document.getElementsByClassName("cf-prof-name")[0].innerHTML;
  console.log(ccProfName, cfProfName);
  const ccLoader = document.getElementsByClassName("cc-loader");
  const cfLoader = document.getElementsByClassName("cf-loader");
  const ccusername = document.getElementsByClassName("cc-username-load");
  const ccRating = document.getElementsByClassName("cc-curr-rating-load");
  const ccRatingMax = document.getElementsByClassName("cc-rating-load");
  const linkCc = document.getElementsByClassName("view-cc-acc");
  const ccDataFetch = await fetchData(ccProfName, 0);
  for (let i = 0; i < 2; i++) {
    ccLoader[i].style.display = "none";
    const { username, ratingNo, maxRating } = ccDataFetch;
    ccusername[i].innerHTML = username;
    ccRating[i].innerHTML = ratingNo;
    ccRatingMax[i].innerHTML = maxRating;
    linkCc[i].href = `/fetch?handle=CC&username=${username}`;
  }
  profCard[1].style.display = "block";
  profCard[3].style.display = "block";
  const cfDataFetch = await fetchData(cfProfName, 1);
  const cfusername = document.getElementsByClassName("cf-username-load");
  const cfRating = document.getElementsByClassName("cf-curr-rating-load");
  const linkCf = document.getElementsByClassName("view-cf-acc");
  const cfRatingMax = document.getElementsByClassName("cf-rating-load");
  for (let i = 0; i < 2; i++) {
    cfLoader[i].style.display = "none";
    const { handle, rating, maxRating } = cfDataFetch;
    cfusername[i].innerHTML = handle;
    cfRating[i].innerHTML = rating;
    cfRatingMax[i].innerHTML = maxRating;
    linkCf[i].href = `/fetch?handle=CF&username=${handle}`;
    // profCard[2*i].style.display = "block";
  }
  profCard[0].style.display = "block";
  profCard[2].style.display = "block";
});
async function fetchData(name, bit) {
  let site = ["CC", "CF"];
  const data = await axios.get(
    `http://localhost:8000/justData?username=${name}&handle=${site[bit]}`
  );
  console.log(data.data);
  return data.data;
}

//Add friend or stalklist funtionality
const addFriendButton = document.getElementsByClassName("add-friend")[0];
if (addFriendButton) {
  addFriendButton.addEventListener("click", async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(
        "http://localhost:8000/community/stalklist/add",
        {
          image:
            "https://cdn.codechef.com/sites/default/files/uploads/pictures/5cf28a1c81060786bf492ef98a5cc252.jpg",
          name: document.getElementById("GG-user-name").innerText,
          plat: "GG",
        }
      );
    } catch (err) {
      const { message = "Friend Req not sent !!" } = err;
      fireClientFlash(false, message);
    }
  });
}
