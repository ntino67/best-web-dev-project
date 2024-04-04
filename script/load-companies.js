function processCompany(newElement, company) {
    $(".search-result-title", newElement).html(company.company_name);
    $(".search-result-description", newElement).html(company.company_description);

    var internship_amt = company.internship_amt;
    var student_amt = company.student_amt;
    // Insert bottom info
    $(".search-result-bottom-info-element", newElement).eq(0).html(internship_amt + (internship_amt === 1 ? " Internship Offer" : " Internships Offers"));
    $(".search-result-bottom-info-element", newElement).eq(1).html(student_amt + (student_amt === 1 ? " Student working there" : " Students working there"));

    // Insert right info
    $(".info-text", newElement).eq(0).html("TODO" /*TODO: Location*/);
    $(".info-text", newElement).eq(1).html(getStars(Math.floor(company.review_avg)));

    // Redirect to correct page
    $(".bw-button", newElement).on("click", function () {
        window.location.href = `/company/${company.id_company}`;
    });
}

function getStars(rating) {
    if (rating === 0) {
        return "No reviews yet";
    }

    // Initialize stars as an empty array
    var stars = [];

    // Add full stars
    for (let i = 0; i < rating; i++) {
        stars.push('<span class="fas"></span>');
    }

    // Add empty stars
    while (stars.length < 5) {
        stars.push('<span class="far"></span>');
    }

    return stars.join('');
}

function handleDropdownChange(id, filterKey) {
    $(id).change(function () {
        const selected = $(this).val();
        const url = selected ? `http://webp.local/api/company?orderby=id_company&filter=${filterKey} eq ${selected}` : 'http://webp.local/api/company';

        $('#companies-container').empty();
        loadEntities(url, '#companies-container', processCompany, "/components/company.html");
    });
}

$(document).ready(function () {
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

    var url = "http://webp.local/api/company";
    loadEntities(url, "#companies-container", processCompany, "/components/company.html"); // replace path with relevant one

    $(".search-bar-small").keypress(function (e) {
        if (e.which === 13) {  // 13 is the enter key's keycode
            let input = $(this).val();
            if (input) {
                url = `http://webp.local/api/company?orderby=id_company&filter=company_name startswith ${input}`;
            } else {
                url = 'http://webp.local/api/company';
            }

            $("#companies-container").empty();
            loadEntities(url, "#companies-container", processCompany, "/components/company.html");

            return false;  // Prevent the default action (form submission)
        }
    });

    $("#cities").change(function () {
        let city = $(this).val();
        if (city) {
            url = `http://webp.local/api/company?orderby=id_company&filter=city_name eq ${city}`;
        } else {
            url = 'http://webp.local/api/company';
        }
        $("#companies-container").empty();
        loadEntities(url, "#companies-container", processCompany, "/components/company.html");
    });

    $("#sectors").change(function () {
        let sector = $(this).val();
        if (sector) {
            url = `http://webp.local/api/company?orderby=id_company&filter=business_sector_name eq ${sector}`;
        } else {
            url = 'http://webp.local/api/company';
        }
        $("#companies-container").empty();
        loadEntities(url, "#companies-container", processCompany, "/components/company.html");
    });

    $("#reset").click(function () {
        $("#companies-container").empty();
        url = 'http://webp.local/api/company';
        loadEntities(url, "#companies-container", processCompany, "/components/company.html");
    });
});