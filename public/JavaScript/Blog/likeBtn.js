const socket = io();
// const axios = require("axios")

window.addEventListener("load", () => {
  const likeBtn = document.getElementsByClassName("like-svg"); //generalise it
  const hiddenIdList = document.getElementsByClassName("hidden-blog-id");
  const userIdLoggedIn = document.getElementById("hidden-id").innerText;
  const LikeSVG = document.getElementsByClassName("like-svg");
  const LikeValue = document.getElementsByClassName("like-value");
  const blogDiv = document.getElementsByClassName("blog-anime");
  for (let i = 0; i < likeBtn.length; i++) {
    likeBtn[i].addEventListener("click", async (e) => {
      console.log(i, " pressed !!");
      const blogId = hiddenIdList[i].innerHTML;
      console.log(userIdLoggedIn);
      try {
        const response = await axios.post(
          `http://localhost:8000/Blogs/react/${userIdLoggedIn}/${blogId}`
        );
        console.log(response.data);
        const { Blog, success = true } = response.data;
        if (!success) {
          console.log("Not Liked");
          throw new Error("Could Not Like !! some error occured");
        }
        const color = LikeSVG[i].getAttribute("fill");
        if (color == "none") LikeSVG[i].setAttribute("fill", "red");
        else LikeSVG[i].setAttribute("fill", "none");
        LikeValue[i].innerHTML = Blog.likes;
        fireClientFlash(true, "Liked !!");
      } catch (e) {
        fireClientFlash(false, "some error occured");
      }
    });
  }

  //Delete Post Button
  const deleteBtn = document.getElementsByClassName("delete-post");
  for (let i = 0; i < deleteBtn.length; i++) {
    deleteBtn[i].addEventListener("click", async (e) => {
      try {
        const { id } = e.target;
        console.log("Delete clicked");
        const response = await axios.post(
          `http://localhost:8000/Blogs/delete/${id}`
        );
        const { success, blogId } = response.data;
        if (!success) {
          console.log("COde Some error ui ", blogId);
          return;
        }
        const postData = document.getElementsByClassName(blogId.toString())[0];
        postData.style.display = "none";
        const closeIt = document.getElementsByClassName(
          `close-${blogId.toString()}`
        )[0];
        closeIt.click();
        fireClientFlash(true, "Deleted Successfully");
      } catch (e) {
        fireClientFlash(false, "some error occured");
      }
    });
  }
});
