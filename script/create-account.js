let account_type_select;
let promotion_select_radio;
let promotion_select_checkbox;

function account_type() {
  switch (account_type_select.val())
  {
    case "0":
      promotion_select_radio.hide();
      promotion_select_checkbox.hide();
      break;
    case "student": 
      promotion_select_radio.show();
      promotion_select_checkbox.hide();
      break;
    case "pilot": 
      promotion_select_radio.hide();
      promotion_select_checkbox.show();
      break;
    case "admin": 
      promotion_select_radio.hide();
      promotion_select_checkbox.hide();
      break;
    default:
      promotion_select_radio.hide();
      promotion_select_checkbox.hide();
      break;
  }
}


$(document).ready(function() {
  account_type_select = $(".auth-input select#signup-account-type");
  promotion_select_radio = $("div[name=signup-promotion-radio]");
  promotion_select_checkbox = $("div[name=signup-promotion-checkbox]");

  $(account_type_select).change(account_type);
  account_type();
}
)
