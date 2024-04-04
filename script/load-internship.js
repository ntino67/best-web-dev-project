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

$(document).ready(function () {
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

    $("#cities").change(function () {
        let city = $(this).val();
        if (city) {
            url = `http://webp.local/api/internship?orderby=id_internship_offer&filter=city_name eq ${city}`;
        } else {
            url = 'http://webp.local/api/internship';
        }
        $("#internship-container").empty();
        loadEntities(url, "#internship-container", processInternship, "/components/internship-offer.html");
    });

    $("#sectors").change(function () {
        let sector = $(this).val();
        if (sector) {
            url = `http://webp.local/api/internship?orderby=id_internship_offer&filter=business_sector_name eq ${sector}`;
        } else {
            url = 'http://webp.local/api/internship';
        }
        $("#internship-container").empty();
        loadEntities(url, "#internship-container", processInternship, "/components/internship-offer.html");
    });

});