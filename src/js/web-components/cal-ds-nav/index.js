// from
// https://www.cssscript.com/create-a-multi-level-drop-down-menu-with-pure-css/

//@ts-check
import cal_ds_base from "../_cal-ds-base/index";

export default class extends cal_ds_base {
  /** @override */
  static get tagName() {
    return "cal-ds-nav";
  }

  constructor() {
    const connectedCallback = () => {
      const myTemplate = this.querySelector("template");

      if (myTemplate && this.shadowRoot) {
        this.shadowRoot.appendChild(myTemplate.content.cloneNode(true));
      }
    };

    super({ shadow: true, connectedCallback });
  }

  disconnectedCallback() {
    if (this.shadowRoot) {
      const root = this.shadowRoot.firstElementChild;
      if (root) {
        this.shadowRoot.removeChild(root);
      }
    }
  }
}
