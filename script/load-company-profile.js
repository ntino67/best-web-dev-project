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

function piloteFeatures() {
    $(".edit-profile").hide();
    console.log('Pilote Features Enabled');
}

function defaultFeatures() {
    $(".edit-profile").hide();
    console.log('Default Features Enabled');
}

$(document).ready(function () {
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split('/');
    const compId = urlParts.pop() || urlParts.pop();  // handles potential trailing slash
    localStorage.setItem('lastCompanyId', compId);

    var companyData = null;


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

    // AJAX request to fetch user data from an API
    $.ajax({
        url: `http://webp.local/api/company/${compId}`,
        type: "GET",
        headers: {
            "authorization-token": userData.token
        },
        success: function (response) {
            console.log('Company Data:', response);
            // Your existing code
            $('title').text(response.company_name);
            $('#company-name').text(response.company_name);
            $('#company-sector').text(response.business_sector_name);
            $('.profile-description').text(response.company_description);
            $('.rating-number').text(response.avg_rating);
            // Number of Ratings
            $('.company-rating').text(response.num_ratings + " Ratings");
            // Internship Offers
            $('.internship-number').text(" " + response.num_internship_offers);
            // Students Working
            $('.student-number').text(" " + response.num_students_working);

            companyData = {
                "id_business_sector": response.id_business_sector,
                "company_name": response.company_name,
                "company_description": response.company_description,
                "company_active": 0,
            };

            // Save the company data for later
            localStorage.setItem('lastCompanyData', JSON.stringify(response));

            // Now to handle the new data
            // Avg Rating

        },
        error: function (jqXHR, exception) {
            console.log('Error occurred:', jqXHR, exception);
            window.location.href = "/login.html";
        }
    });

    // Event handler for the Modify Data link
    $("#modify-company").on("click", function (e) {
        e.preventDefault();
        // Navigate to create-company.html
        window.location.href = "/create-company.html";
    });

    // Event handler for the "Delete Company" action
    $('#delete-company').on('click', function (e) {
        e.preventDefault();

        // AJAX request to update company status
        $.ajax({
            url: `http://webp.local/api/company/${compId}`,
            type: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization-token': userData.token
            },
            data: JSON.stringify(companyData), // Mark the company as inactive
            success: function (response) {
                alert('Company marked as inactive: ' + response.company_name);

                // You can redirect the user here, or reload the page (or part of it) to reflect the changes
                window.location.href = "/companies.html";
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Error occurred:', errorThrown);
                // Handle error
            }
        });
    });
});
