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

function adminFeatures() {
    console.log('Admin Features Enabled');
}

function piloteFeatures(i) {
    if (i == 1) {
        $("#create, #create-2").hide();
    } else {
        console.log('Can edit student profile');
    }
    console.log('Pilote Features Enabled');
}

function defaultFeatures() {
    $("#create, #create-2").hide();
    console.log('Default Features Enabled');
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

    var currentLocation = window.location.href;
    if (currentLocation.endsWith('/internships.html')) {
        $("#create span:nth-child(2), #create-2 span:nth-child(2)").text(' Create Internship');
        piloteFeatures(1);
    } else if (currentLocation.endsWith('/companies.html')) {
        $("#create span:nth-child(2), #create-2 span:nth-child(2)").text(' Create Company');
        piloteFeatures(1);
    } else if (currentLocation.endsWith('/users.html')) {
        $("#create span:nth-child(2), #create-2 span:nth-child(2)").text(' Create User');
        piloteFeatures(0);
    }

    $('#create, #create-2').click(function () {
        var currentLocation = window.location.href;
        if (currentLocation.endsWith('/internships.html')) {
            window.location.href = '/create-internship.html';
        } else if (currentLocation.endsWith('/companies.html')) {
            window.location.href = '/create-company.html';
        } else if (currentLocation.endsWith('/users.html')) {
            window.location.href = '/create-user.html';
        }
    });


    var idRole = localStorage.getItem("idRole");
    console.log('User Role:', idRole);
    // You can have certain functions for enabling or disabling your GUI based on role.
    switch (idRole) {
        case "1":
            adminFeatures();
            break;
        case "2":
            piloteFeatures();
            break;
        case "3":
            defaultFeatures();
            break;
    }
});