const dateEl = document.getElementById("id_date");
M.Datepicker.init(dateEl, {
  format: "yyyy-mm-dd",
  defaultDate: new Date(),
  setDefaultDate: true,
  autoClose: true,
});


const selectEl = document.getElementById("id_goal_tempo_type");
M.FormSelect.init(selectEl);


var sidenav = document.querySelectorAll('.sidenav');
var sidenavInstances = M.Sidenav.init(sidenav, {'edge': 'right', 'onCloseEnd': testFunc});
const click = document.getElementById("sidenav-btn") 
const click2 = document.getElementById("sidenav-btn2") 
click.addEventListener("click", function(){
    sidenavInstances[0].open()
  })
click2.addEventListener("click", function(){
    sidenavInstances[0].open()
  })


var lightboxes = document.querySelectorAll(".materialboxed");
var lightboxInstances = M.Materialbox.init(lightboxes);

function testFunc(){
sidenav[0].style.left = "initial"
sidenav[0].style.transform = "translateX(105%)"
sidenav[0].style.width = "initial"
}