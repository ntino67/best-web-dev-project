$(document).ready(function () {

    // Breaking down the current URL and retrieving the last identifier (userId)
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split('/');
    const userId = urlParts.pop() || urlParts.pop();  // handles potential trailing slash

    // AJAX request to fetch user data from an API
    $.ajax({
        url: `http://webp.local/api/user/${userId}`,
        type: "GET",
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
});
