$(document).ready(function () {
    $('.line-effect').on('mouseenter', function () {
        $(this).addClass('hover');
    }).on('mouseleave', function () {
        $(this).removeClass('hover');
    });

    $(".menu-burger").click(function () {
        $(".nav-links").toggleClass("mobile-menu");
    });

    function logout(e) {
        e.preventDefault();
        var result = confirm("Are you sure you want to logout?");
        if (result) {
            // If confirmed, redirect to login.html
            window.location.href = "login.html";
        }
    }

    $('#logout, #logout-2').click(logout);
});