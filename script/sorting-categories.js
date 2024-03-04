let sorting_categories;

function switch_sorting(event) {
  if (event.currentTarget.querySelectorAll("span.far")[0].innerHTML == "") {
    event.currentTarget.querySelectorAll("span.far")[0].innerHTML = "";
  }
  else {
    event.currentTarget.querySelectorAll("span.far")[0].innerHTML = "";
  }


  for (let i = 0; i < sorting_categories.length; i++) {
    if (!(sorting_categories[i] == event.currentTarget)) {
      sorting_categories[i].querySelectorAll("span.far")[0].innerHTML = "";

    }
  }
}

window.onload = function() {
  sorting_categories = document.querySelectorAll("button.sorting-category");

  console.log(sorting_categories.length);

  for (let i = 0; i < sorting_categories.length; i++) {
    sorting_categories[i].addEventListener("click", switch_sorting);
  } 
}
