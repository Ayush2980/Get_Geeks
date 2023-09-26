const addFrndBtn = document.getElementsByClassName('addFrndBtn');
for(let i = 0;i < addFrndBtn.length ; i++){
    addFrndBtn[i].addEventListener( 'click' , () => {
        for(let j = 0;j < addFrndBtn.length ; j++){
            addFrndBtn[j].disabled = true;
        }
    })
}