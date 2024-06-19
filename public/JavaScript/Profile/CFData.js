window.addEventListener("load", () => {
  console.log("hello from script");
  document.addEventListener("DOMContentLoaded", () => {
    const weekday = document.getElementsByClassName("wday");
    for (let i = 0; i < weekday.length; i++) {
      weekday[i].setAttribute("fill", "white");
    }
    const month = document.getElementsByClassName("month");
    for (let i = 0; i < month.length; i++) {
      month[i].setAttribute("fill", "white");
    }
  });

  const removeFrnd = document.getElementsByClassName("remove-stalklist");
  const sendReqBtn = document.getElementsByClassName("add-stalklist");
  try {
    for (let i = 0; i < sendReqBtn.length; i++) {
      sendReqBtn[i].addEventListener("click", async () => {
        try {
          const { data } = await axios.post(
            "https://getgeeks.onrender.com/community/stalklist/add",
            {
              image:
                "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fdefault-profile-picture&psig=AOvVaw02kcoBrxvIcQIi6giZU6VC&ust=1718045480517000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNCfmaaYz4YDFQAAAAAdAAAAABAJ",
              name: document.getElementById("CF-user-name").innerText,
              plat: "CF",
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log(data);
          let message = data.success
            ? "Added to stalkList"
            : "Some error Occured";
          fireClientFlash(data.success, message);
          for (let i = 0; i < sendReqBtn.length; i++) {
            sendReqBtn[i].style.display = "none";
            removeFrnd[i].style.display = "block";
          }
        } catch (err) {
          fireClientFlash(false, err.message);
        }
      });
    }
  } catch (e) {
    console.log("jh");
  }

  try {
    for (let i = 0; i < removeFrnd.length; i++) {
      console.log("CLickc", i);
      removeFrnd[i].addEventListener("click", async () => {
        try {
          const { data } = await axios.post(
            "https://getgeeks.onrender.com/community/stalklist/remove",
            {
              image:
                "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fdefault-profile-picture&psig=AOvVaw02kcoBrxvIcQIi6giZU6VC&ust=1718045480517000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNCfmaaYz4YDFQAAAAAdAAAAABAJ",
              name: document.getElementById("CF-user-name").innerText,
              plat: "CF",
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          let message = data.success ? "Removed from stalkList" : err.msg;
          fireClientFlash(data.success, message);
          for (let i = 0; i < sendReqBtn.length; i++) {
            sendReqBtn[i].style.display = "block";
            removeFrnd[i].style.display = "none";
          }
        } catch (err) {
          fireClientFlash(false, err.message);
        }
      });
    }
  } catch (e) {
    console.log("NONON");
  }
});
