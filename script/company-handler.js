let typeRequest = "POST";

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
    $.ajax({
        url: 'http://webp.local/api/business-sector',
        type: 'GET',
        dataType: 'json',
        headers: {
            "authorization-token": userData ? userData.token : ''
        },
        success: function (sectorsData) {
            var select = $('#create-company-sectors');
            // Clear options
            select.empty();

            // Populate select with sectors from API
            $.each(sectorsData, function (index, sector) {
                select.append($("<option></option>")
                    .attr("value", sector.id_business_sector)
                    .text(sector.business_sector_name));
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle request errors here
            console.log(`Error: ${textStatus} - ${errorThrown}`);
            alert('Failed to retrieve business sectors');
        }
    });

    // Fetch company data if available
    let companyData = JSON.parse(localStorage.getItem("lastCompanyData"));

    // Fetch company id if available
    let lastCompanyId = localStorage.getItem("lastCompanyId");

    // If companyData is not null, populate form fields
    if (companyData) {
        $("#page-title").text("Update Company");
        $("#page-subtitle").text("Update your company details");
        $("#create-company-name").val(companyData.company_name);
        $("#create-company-sectors").val(companyData.business_sector);
        $("#create-company-description").val(companyData.company_description);
        $("#create-company-submit").text("Update Company");
        typeRequest = "PATCH";
    }

    // Add an event listener to the form submit event
    $('form').on('submit', function (e) {
        // Prevent the form from being submitted normally
        e.preventDefault();

        // Create an object to store our form data
        var companyData = {
            "id_business_sector": parseInt($('#create-company-sectors').val()),  // Assuming it's an integer
            "company_name": $('#create-company-name').val().trim(),
            "company_description": $('#create-company-description').val().trim()
        };

        // Validate fields
        var errors = [];
        if (!companyData.company_name) errors.push('Company name is required');
        if (!companyData.company_description) errors.push('Company description is required');
        if (!companyData.id_business_sector || companyData.id_business_sector.length == 0) errors.push('One sector is required');

        if (errors.length > 0) {
            // Handle errors here (display them to the user)
            console.log(errors);
            return;
        }

        // Submit data to server
        console.log(companyData);

        let requestUrl = 'http://webp.local/api/company';
// If we are updating, append the company id to the URL
        if (typeRequest == "PATCH") {
            requestUrl += `/${lastCompanyId}`;
        }

        $.ajax({
            type: typeRequest,
            url: requestUrl,
            headers: {
                "authorization-token": userData ? userData.token : ''
            },
            data: JSON.stringify(companyData),
            contentType: 'application/json',
            success: function (response) {
                if (typeRequest == "PATCH") {
                    alert('Company successfully updated!');
                    localStorage.removeItem('lastCompanyData');
                    window.location.href = '/companies.html';
                } else {
                    alert('Company successfully created');
                    window.location.href = '/companies.html';
                }
            },
            error: function (error) {
                alert('There was an error');
            },
        });
    });
});