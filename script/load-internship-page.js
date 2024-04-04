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

function populateInternship(internshipData) {
    // Fill the HTML elements with the data from the server
    $('header h1').text(internshipData.internship_offer_title);
    $('.internship-description').text(internshipData.internship_offer_description);
    $('.header-tag p').text(internshipData.business_sector_name);
    $('.internship-info-center:nth-child(1) p:nth-child(2)').text(internshipData.company_name + ', France'); /*TODO: implement city too*/
    $('.internship-info-center:nth-child(2) span:nth-child(2)').text(internshipData.available_slots);
    $('.internship-info-center:nth-child(3) p:nth-child(2)').text(internshipData.internship_duration + ' months');
    $('.internship-info-center:nth-child(4) p:nth-child(2)').text(internshipData.base_salary + ' $');
    $('.internship-info-center:nth-child(5) p:nth-child(2)').text(new Date(internshipData.internship_offer_created_at).toLocaleDateString());
    $('.internship-info-center:nth-child(6) p:nth-child(2)').text(new Date(internshipData.internship_offer_expires_at).toLocaleDateString());
    $('.internship-info-center:nth-child(7) p:nth-child(2)').text(internshipData.available_slots + ' places');

    // Fill in the required skills
    $('.internship-info-center:nth-child(8) ul').empty();
    for (let i = 0; i < internshipData.required_skills.length; i++) {
        let li = $('<li>').text(internshipData.required_skills[i].skill_name);
        $('.internship-info-center:nth-child(8) ul').append(li);
    }
}

$(document).ready(function () {
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split('/');
    const interId = urlParts.pop() || urlParts.pop();

    $.ajax({
        url: `http://webp.local/api/internship/${interId}`,
        type: "GET",
        headers: {
            "authorization-token": userData.token
        },
        success: function (response) {
            populateInternship(response.data);
        },
        error: function (jqXHR, exception) {
            console.log('Error occurred:', jqXHR, exception);
            window.location.href = "/login.html";
        }
    });
});