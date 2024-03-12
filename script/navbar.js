$.get("components/navbar.html", function(data) {
    $("#navbar-container").html(data);
})

$.get("components/footer.html", function(data) {
  $("#footer-container").html(data);
})

$.get("components/paging.html", function(data) {
  $(".paging-container").html(data);
})
