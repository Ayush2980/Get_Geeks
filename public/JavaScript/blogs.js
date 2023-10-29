const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))



//Real Time Like functionality using SOcket
var elemCnt = document.getElementById('data');
if(elemCnt) elemCnt = elemCnt.innerHTML;
var btn = document.getElementsByClassName('likeBtn');
var like = document.getElementsByClassName('like');
const loggedIn = document.getElementById('login');
//for each button we code ==::::
for(let i =0;i < elemCnt ;i++){
  //Setting the default design for buttons based on logged in user data 
  if(loggedIn){
    const blogData = JSON.parse(document.getElementsByClassName('blog-details')[i].innerHTML); //has the total blog info 
    const userData = JSON.parse(document.getElementById('login').innerHTML);
    const isLiked = (blogData.likers.indexOf(userData._id) > -1);//True means user has liked it 
    if(isLiked) btn[i].classList.add('btn-danger');
    else btn[i].classList.add('btn-outline-danger');
  }
  else{
    btn[i].classList.add('btn-outline-danger');
  }
  //Adding event Listener to all buttons 
  btn[i].addEventListener('click' , (e) => {
    e.preventDefault();
    if(loggedIn ){
      const isLiked = btn[i].classList.contains('btn-outline-danger');
      if(isLiked){//We are liking in this case
        btn[i].classList.remove('btn-outline-danger');
        btn[i].classList.add('btn-danger');
        const blogData = JSON.parse(document.getElementsByClassName('blog-details')[i].innerHTML); //has the total blog info 
        const userData = JSON.parse(document.getElementById('login').innerHTML);
        $.ajax({
          url : `/Blogs/like/${userData._id}/${blogData._id}`,
          type : 'POST',
          success : (data) => {
            if(data.success == true){
              var socket = io();
              socket.emit("like" , data.Blog)
            }
            else{
              console.log(data.msg);
            }
          }
        })
        
        
      }
      else{//We are disliking in this case 
        btn[i].classList.add('btn-outline-danger');
        btn[i].classList.remove('btn-danger');
        const blogData = JSON.parse(document.getElementsByClassName('blog-details')[i].innerHTML); //has the total blog info 
        const userData = JSON.parse(document.getElementById('login').innerHTML);
        $.ajax({
          url : `/Blogs/unlike/${userData._id}/${blogData._id}`,
          type : 'POST',
          success : (data) => {
            if(data.success == true){
              var socket = io();
              socket.emit("dislike" , data.Blog)
            }
            else{
              console.log(data.msg);
            }
          }
        })
      }
    }
    else{
      document.getElementById('redirector').click();
    }
  })
}
var socket = io();
socket.on("like" , (data) => {
  const blogDetails = document.getElementsByClassName('blog-details');
  for(let i= 0; i < blogDetails.length; i++){
    const id = JSON.parse(blogDetails[i].innerHTML)._id
    if(data._id == id){
      like[i].innerHTML = data.likes;
      break;
    }
  }
})
socket.on("dislike" , (data) => {
  const blogDetails = document.getElementsByClassName('blog-details');
  for(let i= 0; i < blogDetails.length; i++){
    const id = JSON.parse(blogDetails[i].innerHTML)._id
    if(data._id == id){
      like[i].innerHTML = data.likes;
      break;
    }
  }
})