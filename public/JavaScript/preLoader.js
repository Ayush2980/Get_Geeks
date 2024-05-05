const SearchBtn = document.getElementById('Search-bar-homepage');
const loader = document.getElementById('loader');
const navbar = document.querySelector('nav');
const footer = document.querySelector('footer');
const mainBody = document.getElementsByClassName('container-fluid')[1];
window.addEventListener('load' , () => {
    loader.style.display = 'none';
})
// SearchBtn.addEventListener('click' , () => {
//     navbar.style.display = 'none';
//     footer.style.display = 'none';
//     mainBody.style.display = 'none';
//     document.getElementById('loader').style.display = 'block';
// })
