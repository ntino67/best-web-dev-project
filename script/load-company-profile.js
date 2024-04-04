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
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split('/');
    const compId = urlParts.pop() || urlParts.pop();  // handles potential trailing slash

    // AJAX request to fetch user data from an API
    $.ajax({
        url: `http://webp.local/api/company/${compId}`,
        type: "GET",
        headers: {
            "authorization-token": userData.token
        },
        success: function (response) {
            console.log(response);

            $('title').text(response.company_name);
            $('#company-name').text(response.company_name);
            $('#company-sector').text(response.business_sector_name);
            $('.profile-description').text(response.company_description);
        },
        error: function (jqXHR, exception) {
            console.log('Error occurred:', jqXHR, exception);
            window.location.href = "/login.html";
        }
    });
});
