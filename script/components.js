$.get(`/components/navbar.html`, function (data) {
    $("#navbar-container").html(data);
})

$.get("/components/footer.html", function (data) {
    $("#footer-container").html(data);
})