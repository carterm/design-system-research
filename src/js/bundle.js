//@ts-check

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Components/Using_custom_elements

import * as all from "./index";

//comment out any elements you are not using
//Definition order matters!!!  Code will run in this order

const my_bundle = [
  //all.cal_ds_custom_css,
  //all.cal_ds_seo,
  //all.cal_ds_nav,
  //all.cal_ds_footer,
  all.cal_ds_accordion
  //all.cal_ds_card_simple,
  //all.cal_ds_cardgroup_wrap,
  //all.cal_ds_dev_editor,
  //all.cal_ds_banner
];

for (const c of my_bundle) {
  //sync "for", to ensure define order
  window.customElements.define(c.tagName, c);
}
