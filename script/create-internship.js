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

function handleDropdownChange(id, filterKey) {
    $(id).change(function () {
        const selected = $(this).val();
        ApiUrl = selected ? `http://webp.local/api/company?orderby=id_company&filter=${filterKey} eq ${selected}` : 'http://webp.local/api/company';
        $('#companies-container').empty();
        loadEntities(ApiUrl, '#companies-container', processCompany, "/components/company.html");
    });
}

$(document).ready(function () {
    $("form").submit(function (e) {
        e.preventDefault();  // Stop form from submitting normally

        var id_company = localStorage.getItem('lastCompanyId');  // Get company ID from localStorage
        // Ensure it is an integer, as your API might expect an integer
        id_company = parseInt(id_company);

        var internshipData = {
            'id_company': id_company,
            'available_slots': parseInt($("#available_slots").val()),
            'internship_offer_title': $("#create-internship-name").val().trim(),
            'internship_offer_description': $("#create-internship-description").val().trim(),
            'internship_offer_created_at': new Date($("#internship_offer_created_at").val()).toISOString().slice(0, 10),
            'internship_offer_expires_at': new Date($("#internship_offer_expires_at").val()).toISOString().slice(0, 10),
            'id_business_sector': parseInt($("#sectors").val()),
            'base_salary': parseInt($("#base_salary").val()),
            'internship_duration': parseInt($("#internship_duration").val()),
            'id_city': parseInt($("#id_city").val()),
        };

        $.ajax({
            url: 'http://webp.local/api/internship',  // API endpoint
            headers: {
                "authorization-token": userData.token
            },
            type: "POST",  // Or 'PATCH' depending on endpoint
            dataType: 'json',
            data: JSON.stringify(internshipData),  // Convert data to JSON string
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                alert('Internship created successfully');
            },
            error: function (jqXHR, exception) {
                console.log('Error occurred:', jqXHR, exception);
                alert('Failed to create internship');
            }
        });
    });

    $.ajax({
        url: 'http://webp.local/api/business-sector',
        type: 'GET',
        dataType: 'json',
        headers: {
            "authorization-token": userData.token
        },
        success: function (sectorData) {
            // dataType is set to 'json', jQuery will automatically parse the response
            var sectorSelect = $("#sectors");
            sectorSelect.empty();

            $.each(sectorData, function (index, sectorItem) {
                sectorSelect.append($("<option></option>")
                    .attr("value", sectorItem.id_business_sector)
                    .text(sectorItem.business_sector_name));
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(`Error: ${textStatus} - ${errorThrown}`);
            alert('Failed to retrieve sectors');
        }
    });
});