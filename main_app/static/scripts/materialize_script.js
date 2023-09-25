
const dateEl = document.getElementById("id_date");
M.Datepicker.init(dateEl, {
  format: "yyyy-mm-dd",
  defaultDate: new Date(),
  setDefaultDate: true,
  autoClose: true,
});

const selectEl = document.getElementById("id_goal_tempo_type");
M.FormSelect.init(selectEl);

window.onSpotifyIframeApiReady = (IFrameAPI) => {
  let element = document.getElementById('embed-iframe');
  let options = {
      uri: 'spotify:episode:7makk4oTQel546B0PZlDM5'
    };
  let callback = (EmbedController) => {};
  IFrameAPI.createController(element, options, callback);
};




  var sidenav = document.querySelectorAll('.sidenav');
  var sidenavInstances = M.Sidenav.init(sidenav, {'edge': 'right'});
  const click = document.getElementById("sidenav-btn") 
  click.addEventListener("click", function(){
    sidenavInstances[0].open()
  })

var lightboxes = document.querySelectorAll(".materialboxed");
var lightboxInstances = M.Materialbox.init(lightboxes);
