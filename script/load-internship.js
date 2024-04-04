let ApiUrl = null;
let SortType = null;

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
        const ApiUrl = selected ? `http://webp.local/api/internship?orderby=id_internship_offer&filter=${filterKey} eq ${selected}` : 'http://webp.local/api/internship';

        $('#internship-container').empty();
        loadEntities(ApiUrl, '#internship-container', processInternship, "/components/internship-offer.html");
    });
}

function switch_sorting_internship() {
    const sortingButtons = $(".sorting-category");
    let states = {'name': 0, 'salary': 0, 'slots': 0};  // Changed property names to match the new context

    sortingButtons.each(function () {
        $(this).click(function () {
            const thisButton = $(event.target).closest('.sorting-category');
            const sortType = $("span:last", thisButton).text().toLowerCase();
            const allOtherButtons = sortingButtons.not(this);
            let orderBy;

            $("span.far", allOtherButtons).html("");
            for (let propName in states) {
                if (propName !== sortType) {
                    states[propName] = 0;
                }
            }

            switch (states[sortType]) {
                case 0:
                    $("span.far", thisButton).html("");
                    states[sortType]++;
                    orderBy = sortType === 'name' ? 'internship_offer_title' : (sortType === 'slots' ? 'available_slots' : 'base_salary');
                    sortOrder = 'ASC';
                    break;
                case 1:
                    $("span.far", thisButton).html("");
                    states[sortType]++;
                    orderBy = sortType === 'name' ? 'internship_offer_title' : (sortType === 'slots' ? 'available_slots' : 'base_salary');
                    sortOrder = 'DESC';
                    break;
                case 2:
                    $("span.far", thisButton).html("");
                    states[sortType] = 0;
                    orderBy = 'id_internship_offer';  // Default sort order
                    sortOrder = 'ASC';
                    break;
            }

            ApiUrl = `http://webp.local/api/internship?orderby=${orderBy} ${sortOrder}`;

            $("#internship-container").empty();
            loadEntities(ApiUrl, "#internship-container", processInternship, "/components/internship-offer.html");
        });
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

    ApiUrl = "http://webp.local/api/internship";
    loadEntities(ApiUrl, "#internship-container", processInternship, "/components/internship-offer.html");

    $(".search-bar-small").keypress(function (e) {
        if (e.which === 13) {  // 13 is the enter key's keycode
            let input = $(this).val();
            if (input) {
                ApiUrl = `http://webp.local/api/internship?orderby=id_internship_offer&filter=internship_offer_title startswith ${input}`;
            } else {
                ApiUrl = 'http://webp.local/api/internship';
            }

            $("#internship-container").empty();
            loadEntities(ApiUrl, "#internship-container", processInternship, "/components/internship-offer.html");

            return false;  // Prevent the default action (form submission)
        }
    });

    $("#reset").click(function () {
        $('#cities').val('0');
        $('#sectors').val('0');
        $('#internship-container').empty();
        ApiUrl = 'http://webp.local/api/internship';
        loadEntities(ApiUrl, '#internship-container', processInternship, "/components/internship-offer.html");
    });

    switch_sorting_internship();
});