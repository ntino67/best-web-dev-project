// Processing function
function processUser(newElement, user) {
    $(".search-result-title", newElement).html(user.first_name + " " + user.last_name);
    $(".search-result-description", newElement).html("Salut, je m'appelle " + user.first_name + " " + user.last_name + " et je suis " + user.role_name + " à " + user.center_name + ".");
    if (user.id_role === 3) {
        // Insert bottom info
        $(".search-result-bottom-info-element", newElement).eq(0).html("TODO");
    } else {
        $(".search-result-bottom-info-far", newElement).eq(0).hide();
    }

    if (user.classes.length > 0) {
        $(".search-result-bottom-info-element", newElement).eq(1).html(user.center_name);
    }

    $(".info-text", newElement).eq(0).html(user.role_name);
    if (user.classes.length > 0) {
        $(".info-text", newElement).eq(1).html(user.classes[0].class_name);
    }

    // Redirect to correct page
    $(".bw-button", newElement).on("click", function () {
        window.location.href = `/user/${user.id_user}`;
    });
}

$(document).ready(function () {
    // Fetching Role data
    $.ajax({
        url: 'http://webp.local/api/role', // Use the correct endpoint for Roles
        type: 'GET',
        headers: {
            "authorization-token": userData.token
        },
        success: function (roles) {
            $.each(roles, function (index, role) {
                $("#role")
                    .append($("<option></option>")
                        .attr("value", role.id_role) // Set the option value to the Role ID
                        .text(role.role_name)); // Set the option text to the Role name
            });
        },
        error: function (jqXHR, exception) {
            console.log('Role fetch error: ', jqXHR, exception);
        }
    });

    // Fetching Centers data
    $.ajax({
        url: 'http://webp.local/api/center',
        type: 'GET',
        headers: {
            "authorization-token": userData.token
        },
        success: function (centers) {
            $.each(centers, function (index, center) {
                $("#centers")
                    .append($("<option></option>")
                        .attr("value", center.id_center) // Set the option value to the Center ID
                        .text(center.center_name)); // Set the option text to the Center name
            });
        },
        error: function (jqXHR, exception) {
            console.log('Centers fetch error: ', jqXHR, exception);
        }
    });

    function handleDropdownChange(id, filterKey) {
        $(id).change(function () {
            const selected = $(this).val();
            const url = selected ? `http://webp.local/api/user?orderby=id_user&filter=${filterKey} eq ${selected}` : 'http://webp.local/api/user';

            $('#users-container').empty();
            loadEntities(url, '#users-container', processUser, "/components/user.html");
        });
    }

    $("#reset").click(function () {
        $('#users-container').empty();
        url = 'http://webp.local/api/user';
        loadEntities(url, '#users-container', processUser, "/components/user.html");
    });

    var url = 'http://webp.local/api/user';
    loadEntities(url, '#users-container', processUser, "/components/user.html");

    $('.search-bar-small').keypress(function (e) {
        if (e.which == 13) {
            var input = $(this).val();
            url = input ? `http://webp.local/api/user?orderby=id_user&filter=first_name startswith ${input}` : 'http://webp.local/api/user';
            $('#users-container').empty();
            loadEntities(url, '#users-container', processUser, "/components/user.html");
            return false;
        }
    });

    handleDropdownChange("#role", "role_name");
    handleDropdownChange("#centers", "id_center");
});