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

var idUser = userData.data.id_user;

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
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split('/');
    const compId = urlParts.pop() || urlParts.pop();

    // Fetch your user data
    $.ajax({
        url: "http://webp.local/api/user",
        type: "GET",
        headers: {
            "authorization-token": userData.token
        },
        success: function (response) {
            var user = response.data[idUser - 1]; // Response object is your logged in user data
            console.log('User Data:', user);
            localStorage.setItem("idRole", JSON.stringify(user.id_role)); // Save Role
        },
        error: function (jqXHR, exception) {
            console.log('Error occurred:', jqXHR, exception);
            window.location.href = "/login.html";
        },
    });

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
            handleDropdownChange("#cities", "id_city");
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
            handleDropdownChange("#sectors", "id_business_sector");
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

    // Check if current URL matches the desired format
    if (currentUrl.endsWith(`company/${compId}`)) {
        // You can now use the company id to get the internships for that specific company
        ApiUrl = `http://webp.local/api/internship?filter=id_company eq ${compId}`;

        // Load entities with the new ApiUrl which fetches internships for the signed in company
        loadEntities(ApiUrl, "#internship-container-company", processInternship, "/components/internship-offer.html");
    }

    switch_sorting_internship();
});