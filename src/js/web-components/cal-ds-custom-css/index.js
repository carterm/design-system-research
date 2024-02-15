//@ts-check
import cal_ds_base from "../_cal-ds-base/index";

export default class extends cal_ds_base {
  /** @override */
  static get tagName() {
    return "cal-ds-custom-css";
  }

  constructor() {
    super();

    //Push the styles on anything with a shadow
    cal_ds_base.addCEventListener("cal_ds_shadow_constructed_end", comp =>
      this.querySelectorAll("style").forEach(s => comp.addStyle(s.innerHTML))
    );
  }
}
