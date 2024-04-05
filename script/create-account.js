let account_type_select;
let promotion_select_radio;
let promotion_select_checkbox;
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
function account_type() {
    switch (account_type_select.val()) {
        case "0":
            promotion_select_radio.hide();
            promotion_select_checkbox.hide();
            break;
        case "student":
            promotion_select_radio.show();
            promotion_select_checkbox.hide();
            break;
        case "pilot":
            promotion_select_radio.hide();
            promotion_select_checkbox.show();
            break;
        case "admin":
            promotion_select_radio.hide();
            promotion_select_checkbox.hide();
            break;
        default:
            promotion_select_radio.hide();
            promotion_select_checkbox.hide();
            break;
    }
}

function adminFeatures() {
    console.log('Admin Features Enabled');
}

function pilotFeatures() {
    $(".edit-profile").hide();
    console.log('Pilot Features Enabled');

    // If a pilot, only Student role should be allowed to be assigned
    var $signupRoleSelect = $("#signup-account-type");
    $signupRoleSelect.empty();
    $signupRoleSelect.append(new Option("Student", "3"));
}

function defaultFeatures() {
    $(".edit-profile").hide();
    console.log('Default Features Enabled');
}

$(document).ready(function() {
    account_type_select = $(".auth-input select#signup-account-type");
    promotion_select_radio = $("div[name=signup-promotion-radio]");
    promotion_select_checkbox = $("div[name=signup-promotion-checkbox]");

    $(account_type_select).change(account_type);
    account_type();

    function checkWidth() {
        var windowSize = $(window).width();

        if (windowSize < 770) {
            $('#navbar-container').removeClass('navbar-absolute');
        } else {
            $('#navbar-container').addClass('navbar-absolute');
        }
    }

    checkWidth();

    $(window).resize(checkWidth);

    var idRole = localStorage.getItem("idRole");
    console.log('User Role:', idRole);

    switch (idRole) {
        case "1":
            adminFeatures();
            break;
        case "2":
            pilotFeatures();
            break;
        default:
            defaultFeatures();
            break;
    }

    // Fetch user data if available
    let userDataToUpdate = JSON.parse(localStorage.getItem("lastUserDataToUpdate"));

    // If userDataToUpdate is not null, populate form fields
    if (userDataToUpdate) {
        $("#signup-first-name").val(userDataToUpdate.firstName);
        $("#signup-last-name").val(userDataToUpdate.lastName);
        $("#signup-email").val(userDataToUpdate.email);
        $("#signup-password").val(userDataToUpdate.password);
        $("#signup-account-type").val(userDataToUpdate.roleId);
        $(".center").val(userDataToUpdate.centerId);
        typeRequest = "PATCH";
    } // end of if statement

    $('form').submit(function (event) {
        event.preventDefault();

        var first_name = $('#signup-first-name').val().trim();
        var last_name = $('#signup-last-name').val().trim();
        var email = $('#signup-email').val().trim();
        var id_center = parseInt($('.center').val());
        var password = $('#signup-password').val().trim();

        var userRole = localStorage.getItem('userRole');

        var id_role = (userRole === '"Pilote"') ? '2' : '3';

        var data = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password,
            id_center: id_center,
            id_role: parseInt(id_role),
            user_active: 1
        };

        let requestUrl = 'http://webp.local/api/user';

        // If we are updating, append the user id to the URL
        if (typeRequest == "PATCH") {
            let userIdToUpdate = localStorage.getItem("userIdToUpdate");
            requestUrl += `/${userIdToUpdate}`;
        }

        console.log(data);

        $.ajax({
            url: requestUrl,
            type: typeRequest,
            headers: {
                "authorization-token": userData.token
            },
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            success: function (data) {

                if (typeRequest == "PATCH") {
                    alert("Account updated successfully");
                    localStorage.removeItem('lastUserDataToUpdate');
                    localStorage.removeItem('userIdToUpdate');
                    window.location.href = "/profile.html";
                } else {
                    alert("Account created successfully")
                    window.location.href = "/login.html";
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("An error occurred. Please try again.")
            },
        });

    });

    $.ajax({
        url: 'http://webp.local/api/center',
        type: 'GET',
        dataType: 'json',
        headers: {
            "authorization-token": userData.token
        },
        success: function (centerData) {
            var select = $('.center');
            // Clear options
            select.empty();

            // Populate select with centers from API
            $.each(centerData, function (index, center) {
                select.append($("<option></option>")
                    .attr("value", center.id_center)
                    .text(center.center_name));
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle request errors here
            console.log(`Error: ${textStatus} - ${errorThrown}`);
            alert('Failed to retrieve centers');
        }
    });

}); // end of document ready