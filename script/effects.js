// Define a function to extract cookie data
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Get the user data object from the cookie
var cookieData = getCookie('userData');

if (cookieData) {
    // Parse the string back into an object
    var userData = JSON.parse(cookieData);
    console.log(userData); // You can now access the data using dot notation
}

$(document).ready(function () {
    if (!userData || !userData.data) {
        // handle user not logged in or data missing
        return;
    }

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
            document.cookie = "userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "/login.html";
        }
    }

    $('#logout, #logout-2').click(logout);

    // Replace "Profile" with the user's first name
    // Use the jQuery selector 'a[href="/users-profile.html"] span:nth-of-type(2)'
    // to select the correct element
    $('a[href="/users-profile.html"] span:nth-of-type(2)').text(' ' + userData.data.first_name);

    // Update the href to redirect to the user's profile page with their user id
    $('a[href="/users-profile.html"]').attr('href', `/user/${userData.data.id_user}`);
});