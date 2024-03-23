//@ts-check

// @ts-ignore
import css from "./styles.css";

import cal_ds_base from "../_cal-ds-base/index";

export default class extends cal_ds_base {
  /** @override */
  static get tagName() {
    return "cal-ds-card";
  }

  constructor() {
    const _contentChanged = () => {
      const myTemplate = this.template;

      if (myTemplate && this.shadowRoot) {
        const li = document.createElement("li");
        const div = document.createElement("div");

        div.appendChild(myTemplate.content.cloneNode(true));
        li.appendChild(div);

        div.querySelectorAll(":scope > img").forEach(i => li.appendChild(i));

        this.shadowRoot.appendChild(li);
      }
    };

    super({ shadow: true, css, connectedCallback: _contentChanged });

    this.observeTemplate(_contentChanged);
  }
}
