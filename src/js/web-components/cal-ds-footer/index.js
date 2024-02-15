//@ts-check
import cal_ds_base from "../_cal-ds-base/index";

// @ts-ignore
import css from "./styles.css";

// @ts-ignore
import html from "./template.html";

export default class extends cal_ds_base {
  /** @override */
  static get tagName() {
    return "cal-ds-footer";
  }

  constructor() {
    super({ shadow: true, css, html });
  }
}
