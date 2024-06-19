const sendReqBtn = document.getElementsByClassName("add-friend");
const removeFrnd = document.getElementsByClassName("remove-friend");
window.addEventListener("load", () => {
  try {
    for (let i = 0; i < sendReqBtn.length; i++) {
      sendReqBtn[i].addEventListener("click", async () => {
        try {
          const sendObj = {
            image:
              "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fdefault-profile-picture&psig=AOvVaw02kcoBrxvIcQIi6giZU6VC&ust=1718045480517000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNCfmaaYz4YDFQAAAAAdAAAAABAJ",
            name: document.getElementById("GG-user-name").innerText,
            plat: "GG",
            userId: document.getElementById("hidden-curr-id-profile").innerHTML,
          };
          console.log(sendObj);
          const { data } = await axios.post(
            "https://getgeeks.onrender.com/community/stalklist/add",
            sendObj,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          let message = data.success ? "Added to stalkList" : err.msg;
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
      removeFrnd[i].addEventListener("click", async () => {
        try {
          const { data } = await axios.post(
            "https://getgeeks.onrender.com/community/stalklist/remove",
            {
              image:
                "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fdefault-profile-picture&psig=AOvVaw02kcoBrxvIcQIi6giZU6VC&ust=1718045480517000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNCfmaaYz4YDFQAAAAAdAAAAABAJ",
              name: document.getElementById("GG-user-name").innerText,
              plat: "GG",
              userId: document.getElementById("hidden-curr-id-profile")
                .innerHTML,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          let message = data.success ? "Removed from stalkList" : data.err.msg;
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

//Think of some logicx to make it reasltinm e
