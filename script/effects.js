$(document).ready(function () {
    $('.line-effect').on('mouseenter', function () {
        $(this).addClass('hover');
    }).on('mouseleave', function () {
        $(this).removeClass('hover');
    });

    $(".menu-burger").click(function () {
        $(".nav-links").toggleClass("mobile-menu");
    });

    $('#logout').click(function (e) {
        e.preventDefault();  // Prevent the default action (redirect to logout)

        var result = confirm("Are you sure you want to logout?");

        if (result) {
            // If confirmed, redirect to login.html
            window.location.href = "login.html";
        }
    });
});