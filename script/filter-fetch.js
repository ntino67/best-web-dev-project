// This is a sample data. You might be fetching this data from server in your case
var cityData = ["New York", "London", "Paris"];
var sectorData = ["Software", "Hardware", "Networking"];
const $sectors = $('#sectors');
const $cities = $('#cities');
const $reset = $('#reset');

function handleDropdownChange(elementId, containerClass, defaultValue = "0") {
    $(elementId).change(function () {
        const dropdownValue = $(this).val();
        if (dropdownValue !== defaultValue) {
            const filterContainer = $(`.filter-container.${containerClass}`);
            const newFilter = `<div class="filter-tag" data-origin="${elementId}">${dropdownValue}</div>`;
            filterContainer.append(newFilter);
            filterContainer.show();
            $(`${elementId} option[value='${dropdownValue}']`).prop('disabled', true);
        }
    });
}

$(document).ready(function () {
    // Populate City Dropdown
    $.each(cityData, function (key, value) {
        $('#cities')
            .append($("<option></option>")
                .attr("value", value)
                .text(value));
    });

    // Populate Sector Dropdown
    $.each(sectorData, function (key, value) {
        $('#sectors')
            .append($("<option></option>")
                .attr("value", value)
                .text(value));
    });

    $("#reset").click(function () {
        $cities.val("0");
        $sectors.val("0");
        $('.filter-tag').each(function () {
            $(this).trigger('click');
        });
    });

    $(document).on('click', '.filter-tag', function () {
        const $this = $(this);
        const originId = $this.data('origin');
        const filterValue = $this.text();
        $(`${originId} option[value='${filterValue}']`).prop('disabled', false);
        $this.remove();
        const $parentContainer = $this.parent();
        if (!$parentContainer.children().length) {
            $parentContainer.hide();
        }
    });

    handleDropdownChange("#sectors", "sectors-container");
    handleDropdownChange("#cities", "cities-container");
});