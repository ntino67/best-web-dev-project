let ApiUrl = null;

function processUser(newElement, user) {
    $(".search-result-title", newElement).html(user.first_name + " " + user.last_name);
    $(".search-result-description", newElement).html("Hello, my name is " + user.first_name + " " + user.last_name + " and I am a " + user.role_name + " at " + user.center_name + ".");
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

function handleDropdownChange(id, filterKey) {
    $(id).change(function () {
        const selected = $(this).val();
        ApiUrl = selected ? `http://webp.local/api/user?orderby=id_user&filter=${filterKey} eq ${selected}` : 'http://webp.local/api/user';
        $('#users-container').empty();
        loadEntities(ApiUrl, '#users-container', processUser, "/components/user.html");
    });
}

function switch_sorting_user() {
    const sortingButton = $(".sorting-category");
    let state = 0;  // 0 represents 'id_user', 1 represents 'first_name asc', 2 represents 'first_name desc'

    sortingButton.click(function () {
        if (state === 0) {
            $("span.far", this).html("");
            ApiUrl = `http://webp.local/api/user?orderby=first_name`;
            state = 1;
        } else if (state === 1) {
            $("span.far", this).html("");
            ApiUrl = `http://webp.local/api/user?orderby=first_name DESC`;
            state = 2;
        } else if (state === 2) {
            $("span.far", this).html("");
            ApiUrl = 'http://webp.local/api/user';
            state = 0;
        }

        // Reload entities after sorting
        $('#users-container').empty();
        loadEntities(ApiUrl, '#users-container', processUser, "/components/user.html");
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
                        .text(role.name)); // Set the option text to the Role name
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

    $("#reset").click(function () {
        $('#role').val('0');
        $('#centers').val('0');
        $('#users-container').empty();
        ApiUrl = 'http://webp.local/api/user';
        loadEntities(ApiUrl, '#users-container', processUser, "/components/user.html");
    });

    ApiUrl = 'http://webp.local/api/user';
    loadEntities(ApiUrl, '#users-container', processUser, "/components/user.html");

    $('.search-bar-small').keypress(function (e) {
        if (e.which == 13) {
            var input = $(this).val();
            ApiUrl = input ? `http://webp.local/api/user?orderby=id_user&filter=first_name startswith ${input}` : 'http://webp.local/api/user';
            $('#users-container').empty();
            loadEntities(ApiUrl, '#users-container', processUser, "/components/user.html");
            return false;
        }
    });

    handleDropdownChange("#role", "id_role");
    handleDropdownChange("#centers", "id_center");

    switch_sorting_user();
});