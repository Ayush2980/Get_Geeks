const sendReqBtn = document.getElementsByClassName("add-friend")[0];
const removeFrnd = document.getElementsByClassName("remove-friend")[0];

try {
  sendReqBtn.addEventListener("click", async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:8000/community/stalklist/add",
        {
          image:
            "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fdefault-profile-picture&psig=AOvVaw02kcoBrxvIcQIi6giZU6VC&ust=1718045480517000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNCfmaaYz4YDFQAAAAAdAAAAABAJ",
          name: document.getElementById("GG-user-name").innerText,
          plat: "GG",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let message = data.success ? "Added to stalkList" : err.msg;
      fireClientFlash(data.success, message);
    } catch (err) {
      fireClientFlash(false, err.message);
    }
  });
} catch (e) {
  console.log("jh");
}

try {
  removeFrnd.addEventListener("click", async () => {
    try {
      console.log("Clkicked");
      const { data } = await axios.post(
        "http://localhost:8000/community/stalklist/remove",
        {
          image:
            "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fdefault-profile-picture&psig=AOvVaw02kcoBrxvIcQIi6giZU6VC&ust=1718045480517000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNCfmaaYz4YDFQAAAAAdAAAAABAJ",
          name: document.getElementById("GG-user-name").innerText,
          plat: "GG",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let message = data.success ? "Removed from stalkList" : err.msg;
      fireClientFlash(data.success, message);
    } catch (err) {
      fireClientFlash(false, err.message);
    }
  });
} catch (e) {
  console.log("NONON");
}

//Think of some logicx to make it reasltinm e
