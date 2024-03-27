$(document).ready(function () {
    $("#openNav").click(function () {
        if ($("#sidebar").width() === 0) {
            $("#sidebar").width(250);
        } else {
            $("#sidebar").width(0);
        }
    });
});