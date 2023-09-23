
const dateEl = document.getElementById("id_date");
M.Datepicker.init(dateEl, {
  format: "yyyy-mm-dd",
  defaultDate: new Date(),
  setDefaultDate: true,
  autoClose: true,
});

const selectEl = document.getElementById("id_goal_tempo_type");
M.FormSelect.init(selectEl);