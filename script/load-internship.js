function processInternship(newElement, offer) {
    $(".search-result-title", newElement).html(offer.internship_offer_title);
    $(".search-result-description", newElement).html(offer.internship_offer_description);

    let slots = offer.available_slots;
    // Insert bottom info
    $(".search-result-bottom-info-element", newElement).html(slots + (slots === 1 ? " Slot" : " Slots"));

    // Insert right info
    $(".info-text", newElement).eq(0).html("Base Salary: " + offer.base_salary + "$");
    $(".info-text", newElement).eq(1).html(offer.company_name);

    // Redirect to correct page
    $(".bw-button", newElement).on("click", function () {
        window.location.href = `/internship/${offer.id_internship_offer}`;
    });
}

function handleDropdownChange(id, filterKey) {
    $(id).change(function () {
        const selected = $(this).val();
        const url = selected ? `http://webp.local/api/internship?orderby=id_internship_offer&filter=${filterKey} eq ${selected}` : 'http://webp.local/api/internship';

        $('#internship-container').empty();
        loadEntities(url, '#internship-container', processInternship, "/components/internship-offer.html");
    });
}

$(document).ready(function () {
    // Fetching City data
    $.ajax({
        url: 'http://webp.local/api/city',
        type: 'GET',
        headers: {
            "authorization-token": userData.token
        },
        success: function (response) {
            let cities = response.data;

            $.each(cities, function (index, city) {
                $("#cities")
                    .append($("<option></option>")
                        .attr("value", city.id_city)
                        .text(city.city_name));
            });
            handleDropdownChange("#cities", "city_name");
        },
        error: function (jqXHR, exception) {
            console.log('City fetch error: ', jqXHR, exception);
        }
    });

    // Fetching Sector data
    $.ajax({
        url: 'http://webp.local/api/business-sector',
        type: 'GET',
        headers: {
            "authorization-token": userData.token
        },
        success: function (sectors) {
            $.each(sectors, function (index, sector) {
                $("#sectors")
                    .append($("<option></option>")
                        .attr("value", sector.id_business_sector)
                        .text(sector.business_sector_name));
            });
            handleDropdownChange("#sectors", "business_sector_name");
        },
        error: function (jqXHR, exception) {
            console.log('Sector fetch error: ', jqXHR, exception);
        }
    });

    var url = "http://webp.local/api/internship";
    loadEntities(url, "#internship-container", processInternship, "/components/internship-offer.html");

    $(".search-bar-small").keypress(function (e) {
        if (e.which === 13) {  // 13 is the enter key's keycode
            let input = $(this).val();
            if (input) {
                url = `http://webp.local/api/internship?orderby=id_internship_offer&filter=internship_offer_title startswith ${input}`;
            } else {
                url = 'http://webp.local/api/internship';
            }

            $("#internship-container").empty();
            loadEntities(url, "#internship-container", processInternship, "/components/internship-offer.html");

            return false;  // Prevent the default action (form submission)
        }
    });

    $("#reset").click(function () {
        $('#internship-container').empty();
        url = 'http://webp.local/api/internship';
        loadEntities(url, '#internship-container', processInternship, "/components/internship-offer.html");
    });
});