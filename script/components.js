if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/script/service-worker.js')
}
$(document).ready(function () {
    $.get(`/components/navbar.html`, function (data) {
        $("#navbar-container").html(data);
    })

    $.get("/components/footer.html", function (data) {
        $("#footer-container").html(data);
    })
});