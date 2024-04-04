let ApiUrl = null;
let sortOrder = 'ASC';

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
        ApiUrl = selected ? `http://webp.local/api/company?orderby=id_company&filter=${filterKey} eq ${selected}` : 'http://webp.local/api/company';
        $('#companies-container').empty();
        loadEntities(ApiUrl, '#companies-container', processCompany, "/components/company.html");
    });
}

function switch_sorting_companies() {
    const sortingButtons = $(".sorting-category");
    let states = {'name': 0, 'ratings': 0, 'applications': 0};

    sortingButtons.each(function () {
        $(this).click(function (event) {
            const thisButton = $(event.target).closest('.sorting-category');
            const sortType = $("span:last", thisButton).text().toLowerCase();  // 'name', 'ratings', or 'applications'
            const allOtherButtons = sortingButtons.not(thisButton);
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
                    orderBy = sortType === 'name' ? 'company_name' : (sortType === 'applications' ? 'student_amt' : 'review_avg');
                    sortOrder = 'ASC';
                    break;
                case 1:
                    $("span.far", thisButton).html("");
                    states[sortType]++;
                    orderBy = sortType === 'name' ? 'company_name' : (sortType === 'applications' ? 'student_amt' : 'review_avg');
                    sortOrder = 'DESC';
                    break;
                case 2:
                    $("span.far", thisButton).html("");
                    states[sortType] = 0;
                    orderBy = 'id_company';
                    sortOrder = 'ASC';
                    break;
            }

            ApiUrl = `http://webp.local/api/company?orderby=${orderBy} ${sortOrder}`;

            $('#companies-container').empty();
            loadEntities(ApiUrl, '#companies-container', processCompany, "/components/company.html");
        });
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
            handleDropdownChange("#sectors", "id_business_sector");
        },
        error: function (jqXHR, exception) {
            console.log('Sector fetch error: ', jqXHR, exception);
        }
    });

    ApiUrl = 'http://webp.local/api/company';
    loadEntities(ApiUrl, "#companies-container", processCompany, "/components/company.html"); // replace path with relevant one

    $(".search-bar-small").keypress(function (e) {
        if (e.which === 13) {  // 13 is the enter key's keycode
            let input = $(this).val();
            if (input) {
                ApiUrl = `http://webp.local/api/company?orderby=id_company&filter=company_name startswith ${input}`;
            } else {
                ApiUrl = 'http://webp.local/api/company';
            }
            $("#companies-container").empty();
            loadEntities(ApiUrl, "#companies-container", processCompany, "/components/company.html");
            return false;  // Prevent the default action (form submission)
        }
    });

    $("#reset").click(function () {
        $('#sectors').val('0');
        $("#companies-container").empty();
        ApiUrl = 'http://webp.local/api/company';
        loadEntities(ApiUrl, "#companies-container", processCompany, "/components/company.html");
    });

    switch_sorting_companies();
});