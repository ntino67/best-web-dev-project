function handleDropdownChange(elementId, containerClass, defaultValue = "0") {
    $(elementId).change(function () {
        const dropdownValue = $(this).val();
        const dropdownText = $(this).find('option:selected').text();
        if (dropdownValue !== defaultValue) {
            const filterContainer = $(`.filter-container.${containerClass}`);
            const newFilter = `<div class="filter-tag" data-origin="${elementId}" data-value="${dropdownValue}">${dropdownText}</div>`;
            filterContainer.append(newFilter);
            filterContainer.show();
            $(`${elementId} option[value='${dropdownValue}']`).prop('disabled', true);
        }
    });
}

$(document).ready(function () {
    // Populate City Dropdown
    $.ajax({
        url: 'http://webp.local/api/city',
        type: 'GET',
        success: function (response) {
            var cities = response.data; //access the data property of the response
            $.each(cities, function (index, city) {
                $("#cities")
                    .append($("<option></option>")
                        .attr("value", city.id_city)
                        .text(city.city_name));
            });
        },
        error: function (jqXHR, exception) {
            console.log('Error occurred:', jqXHR, exception);
        }
    });

    // Populate Sector Dropdown
    $.ajax({
        url: 'http://webp.local/api/business-sector',
        type: 'GET',
        success: function (sectors) {
            $.each(sectors, function (index, sector) {
                $("#sectors")
                    .append($("<option></option>")
                        .attr("value", sector.id_business_sector)
                        .text(sector.business_sector_name));
            });
        },
        error: function (jqXHR, exception) {
            console.log('Error occurred:', jqXHR, exception);
        }
    });

    $("#reset").click(function () {
        $("#cities").val("0");
        $("#sectors").val("0");
        $('.filter-tag').each(function () {
            $(this).trigger('click');
        });
    });

    $(document).on('click', '.filter-tag', function () {
        const $this = $(this);
        const originId = $this.data('origin');
        const filterValue = $this.data('value'); // Get the stored value
        $(`${originId} option[value='${filterValue}']`).prop('disabled', false); // enable the option with the stored value
        $this.remove();
        const $parentContainer = $this.parent();
        if (!$parentContainer.children().length) {
            $parentContainer.hide();
        }
    });

    handleDropdownChange("#sectors", "sectors-container");
    handleDropdownChange("#cities", "cities-container");
});