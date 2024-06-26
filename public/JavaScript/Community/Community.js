window.addEventListener("load", async () => {
  const response = await axios.get("https://getgeeks.onrender.com/community/stalklist");
  console.log(response.success);
  if (!response.data.success) {
    console.log("Please Login , some error occured ");
    return;
  }
  const { data } = response.data;
  console.log(data);
  let friends = [];

  //Using the template to show and make the search bar work
  const dataTemplate = document.querySelector("[friend-data-template]");
  const baapContainer = document.querySelector(".stalklist-container");
  console.log(dataTemplate);
  //Simple displaying data on page loading
  friends = data.map((user, index) => {
    const card = dataTemplate.content.cloneNode(true).children[0];
    const name = card.querySelector("[friend-name]");
    const handle = card.querySelector("[friend-handle]");
    const image = card.querySelector(".image-sizer");
    const deleteBtn = card.querySelector(".delete-o-hombre");
    const viewBtn = card.querySelector(".view-o-hombre");
    name.textContent = user.name;
    handle.textContent = user.plat;
    image.src = user.image;
    if (user.plat == "GG") viewBtn.href = `/profile/${user.userId}`;
    else viewBtn.href = `/fetch?handle=${user.plat}&username=${user.name}`;

    deleteBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const response = await axios({
        method: "post",
        url: "https://getgeeks.onrender.com/community/stalklist/remove",
        params: {
          id: document.getElementById("classified-data").innerText,
        },
        data: {
          name: user.name,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      //trigger a flash here
      fireClientFlash(true, "User Removed from Stalklist");
      anime({
        targets: card,
        keyframes: [
          { scale: 0.5, duration: 1000, easing: "easeInOutQuad" },
          {
            translateX: -200,
            opacity: 0,
            duration: 500,
            easing: "easeInOutQuad",
          },
        ],
        complete: function (anim) {
          anim.animatables[0].target.style.display = "none";
        },
      });
    });

    baapContainer.append(card);
    return { ...user, element: card };
  });

  //Searching functionality
  const searchBar = document.getElementsByClassName("input-group")[0];
  searchBar.addEventListener("input", (e) => {
    const { value } = e.target;
    // console.log(value);
    friends.forEach((user) => {
      const isVisible = user.name.includes(value);
      console.log(user.element.classList, isVisible);
      user.element.classList.toggle("hider", !isVisible);
    });
  });
});
