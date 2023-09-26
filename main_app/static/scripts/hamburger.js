const hamburgerEl = document.querySelector(".hamburger");
const dropbtnContentEl = document.querySelector(".dropdown-content");
hamburgerEl.addEventListener("click", showBurger)



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