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

    $('#cities').change(function () {
        var city = $(this).val();
        url = city ? `http://webp.local/api/user?orderby=id_user&filter=city_name eq ${city}` : 'http://webp.local/api/user';
        $('#users-container').empty();
        loadEntities(url, '#users-container', processUser, "/components/user.html");
    });

    $('#sectors').change(function () {
        var sector = $(this).val();
        url = sector ? `http://webp.local/api/user?orderby=id_user&filter=business_sector_name eq ${sector}` : 'http://webp.local/api/user';
        $('#users-container').empty();
        loadEntities(url, '#users-container', processUser, "/components/user.html");
    });
});