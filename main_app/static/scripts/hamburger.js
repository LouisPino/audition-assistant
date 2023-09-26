const hamburgerEl = document.querySelector(".hamburger");
const dropbtnContentEl = document.querySelector(".dropdown-content");
hamburgerEl.addEventListener("click", showBurger)


function showBurger() {
    if (dropbtnContentEl.style.display === "block") {
      dropbtnContentEl.style.display = "none";
      console.log('hit11')
    } else {
        dropbtnContentEl.style.display = "block";
        console.log('hit')
    }
  }

  function hideBurger(){
    dropbtnContentEl.style.display = "none";
    }