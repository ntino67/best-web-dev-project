let sorting_categories;

function switch_sorting(event) {
  if ($("span.far", event.currentTarget).html() == "") {
    $("span.far", event.currentTarget).html("");
  }
  else {
    $("span.far", event.currentTarget).html("");
  }


  for (let i = 0; i < sorting_categories.length; i++) {
    if (sorting_categories[i] != event.currentTarget) {
      $("span.far", sorting_categories[i]).html("");

    }
  }
}

$(document).ready(function() {
  sorting_categories = $("button.sorting-category");

  for (let i = 0; i < sorting_categories.length; i++) {
    $(sorting_categories[i]).click(switch_sorting);
  } 
}
)
