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
    console.log('Pilote Features Enabled');
}

function defaultFeatures() {
    $(".edit-profile").hide();
    console.log('Default Features Enabled');
}

$(document).ready(function () {
    // Breaking down the current URL and retrieving the last identifier (userId)
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split('/');
    const userId = urlParts.pop() || urlParts.pop();  // handles potential trailing slash

    // AJAX request to fetch user data from an API
    $.ajax({
        url: `http://webp.local/api/user/${userId}`,
        type: "GET",
        headers: {
            "authorization-token": userData.token
        },
        success: function (response) { // Executing upon successful request
            // Printing server response in console
            console.log(response);

            // Changing the page title using user's name
            $('title').text(response.data.first_name + ' ' + response.data.last_name);

            // Updating elements on the page with user data
            $('#User-name').text(response.data.first_name + ' ' + response.data.last_name);
            $('#User-role').text(response.data.role_name);
            $('#user-class').text(' ' + response.data.classes[0].class_name);
        },
        error: function (jqXHR, exception) { // Handling any errors from request
            console.log('Error occurred:', jqXHR, exception);
        }
    });

    // Another AJAX request to get user's wishlist from an API
    loadInternships(`http://webp.local/api/user/${userId}/wishlist`, '#wishlist-container', function (newElement, offer) {
        // For each required skill in offer add it to the newElement
        let skillsElem = $(".search-result-skill", newElement);
        $.each(offer.required_skills, function (i, skill) {
            skillsElem.eq(i).html(skill.skill_name);
        });

        // Update additional properties of new element
        $('.info-text', newElement).eq(0).html("Base Salary: " + offer.base_salary);
        $('.info-text', newElement).eq(1).html(offer.company_name);
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

    // Define the function to create an internship
    function createInternship() {
        // To get the company id from the previous page, you can use either localStorage, cookies, URL parameters, or another method.
        // Here we use localStorage for the example
        const companyId = localStorage.getItem("companyId");

        // Capture the data from the form inputs. Example for few parameters only:
        const internshipTitle = $('#create-internship-name').val();
        const internshipDescription = $('#create-internship-description').val();
        // Continue for all input fields you need

        // Setup the data object to encapsulate the internship information
        const internshipData = {
            id_company: companyId,
            internship_offer_title: internshipTitle,
            internship_offer_description: internshipDescription
            // Finish creating other properties for your object for all input fields
        };

        // You would typically send the internshipData to your server through an AJAX call
        $.ajax({
            url: `http://webp.local/api/internship`,
            type: "POST",
            headers: {
                "authorization-token": userData.token
            },
            data: JSON.stringify(internshipData),
            success: function (response) {
                alert('Internship created successfully!')
                // Redirect or do something else upon successful creation of the internship
            },
            error: function (jqXHR, exception) {
                console.error('Error occurred:', jqXHR, exception);
            }
        });
    }

    // Attach the createInternship function to the submit button click event
    $('#create-company-submit').click(function (e) {
        e.preventDefault(); // Prevents the form from submitting normally
        createInternship();
    });
});
