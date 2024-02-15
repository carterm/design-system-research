//@ts-check

// @ts-ignore
import css from "./styles.css";

// @ts-ignore
import html from "./template.html";

import cal_ds_base from "../_cal-ds-base/index";

export default class extends cal_ds_base {
  /** @override */
  static get tagName() {
    return "cal-ds-card-simple";
  }

  constructor() {
    super({ shadow: true, css, html });
  }
}
