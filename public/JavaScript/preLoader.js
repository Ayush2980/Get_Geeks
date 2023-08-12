const SearchBtn = document.getElementById('Search-bar-homepage');
const navbar = document.querySelector('nav');
const footer = document.querySelector('footer');
const mainBody = document.getElementById('main-body');
SearchBtn.addEventListener('click' , () => {
    navbar.style.display = 'none';
    // document.getElementsByClassName('load-conatainer')[0].style.display = 'inline';
    footer.style.display = 'none';
    mainBody.style.display = 'none';
    document.getElementById('loader').style.display = "block";
})
