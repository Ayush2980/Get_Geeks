window.addEventListener("load", () => {
  const texts = document.getElementsByTagName("text");
  for (let i = 0; i < texts.length; i++) {
    texts[i].style.fill = "white";
  }
  const charts = document.getElementsByClassName("highcharts-background");
  for (let i = 0; i < charts.length; i++) {
    charts[i].style.fill = "#141E30";
  }

  const removeFrnd = document.getElementsByClassName("remove-stalklist");
  const sendReqBtn = document.getElementsByClassName("add-stalklist");
  console.log(document.getElementById("CC-user-name"));
  try {
    for (let i = 0; i < sendReqBtn.length; i++) {
      sendReqBtn[i].addEventListener("click", async () => {
        try {
          const { data } = await axios.post(
            "https://getgeeks.onrender.com/community/stalklist/add",
            {
              image:
                "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fdefault-profile-picture&psig=AOvVaw02kcoBrxvIcQIi6giZU6VC&ust=1718045480517000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNCfmaaYz4YDFQAAAAAdAAAAABAJ",
              name: document.getElementById("CC-user-name").innerText,
              plat: "CC",
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          let message = data.success ? "Added to stalkList" : data.err.msg;
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
              name: document.getElementById("CC-user-name").innerText,
              plat: "CC",
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
