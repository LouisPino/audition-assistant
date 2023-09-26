const hamburgerEl = document.querySelector(".hamburger");
const metBtnEl = document.querySelector("#sidenav-btn2");
const dropbtnContentEl = document.querySelector(".dropdown-content");
hamburgerEl.addEventListener("click", showBurger)
metBtnEl.addEventListener("click", hideBurger)



function showBurger() {
    if (dropbtnContentEl.style.display === 'flex') {
        dropbtnContentEl.style.display = "none";
        console.log(dropbtnContentEl.style.display) 

    } else {
        dropbtnContentEl.style.display = "flex";
        console.log(dropbtnContentEl.style.display) 
    }
  }


function hideBurger(){
    dropbtnContentEl.style.display = "none";
}