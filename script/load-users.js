$(document).ready(function () {

    // Load internship offers initially using AJAX GET request
    var url = 'http://webp.local/api/user';
    loadUsers(url, '#users-container', function (newElement, user) {
        if (user.id_role === 3) {
            // Insert bottom info
            $(".search-result-bottom-info-element", newElement).eq(0).html("TODO"); //TODO: wishlist.length + (user.wishlist.length === 1 ? " Wish" : " Wishes")
        } else {
            $(".search-result-bottom-info-far", newElement).eq(0).hide();
        }

        // Insert classes info
        if (user.classes.length > 0) {
            $(".search-result-bottom-info-element", newElement).eq(1).html(user.center_name);
        }

        // Insert right info
        $(".info-text", newElement).eq(0).html(user.role_name);
        if (user.classes.length > 0) {
            //here we're showing the class name for 0th index, change it as per your requirement
            $(".info-text", newElement).eq(1).html(user.classes[0].class_name);
        }
    });

    $('.search-bar-small').keypress(function (e) {
        console.log('Key Pressed:', e.which);
        // When enter key is pressed
        if (e.which === 13) {  // 13 is the enter key's keycode
            let input = $(this).val();

            if (input) {
                // Load internships with filter if there's input
                console.log(input)
                url = `http://webp.local/api/user?orderby=id_user&filter=first_name startswith ${input}`;
            } else {
                // Load all internships if input is empty
                url = 'http://webp.local/api/user';
            }

            $('#users-container').empty();

            loadUsers(url, '#users-container', function (newElement, user) {
                // Insert classes info
                if (user.classes.length > 0) {
                    //here we're showing the class name for 0th index, change it as per your requirement
                    $(".search-result-bottom-info-element", newElement).eq(1).html(user.classes[0].class_name);
                }

                // Insert right info
                $(".info-text", newElement).eq(0).html(user.role_name);
                if (user.classes.length > 0) {
                    //here we're showing the class name for 0th index, change it as per your requirement
                    $(".info-text", newElement).eq(1).html(user.classes[0].class_name);
                }
            });

            // prevent the default action
            return false;
        }

        $('#cities').change(function () {
            let city = $(this).val();
            console.log(city);

            if (city) {
                url = `http://webp.local/api/user?orderby=id_user&filter=city_name eq ${city}`;
            } else {
                url = 'http://webp.local/api/user';
            }

            $('#users-container').empty();

            loadUsers(url, '#users-container', function (newElement, user) {
                // specific handler code
            });
        });

        $('#sectors').change(function () {
            let sector = $(this).val();
            console.log(sector);

            if (sector) {
                url = `http://webp.local/api/user?orderby=id_user&filter=business_sector_name eq ${sector}`;
            } else {
                url = 'http://webp.local/api/user';
            }

            $('#users-container').empty();

            loadUsers(url, '#users-container', function (newElement, user) {
                // specific handler code
            });
        });
    });
});