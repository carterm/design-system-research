// from
// https://www.cssscript.com/create-a-multi-level-drop-down-menu-with-pure-css/

//@ts-check
import cal_ds_base from "../../_cal-ds-base/src/index";

// @ts-ignore
import css from "./styles.css";

// @ts-ignore
import html from "./template.html";

export default class my extends cal_ds_base {
  /** @override */
  static get tagName() {
    return "cal-ds-banner";
  }

  /**
   * @protected
   * @override
   */
  static get observedAttributes() {
    return ["data-target"];
  }

  constructor() {
    /**
     * @param {string} name
     */
    const attributeChangedCallback = name => {
      switch (name) {
        case my.observedAttributes[0]: //"data-target":
          _contentChanged();

          break;
      }
    };

    const _contentChanged = () => {
      if (this.UserTemplate && this.shadowRoot && this.HTMLTemplateString) {
        this.shadowRoot.innerHTML = this.HTMLTemplateString;

        const ul = /** @type {HTMLElement} */ (
          this.shadowRoot.querySelector("p")
        );
        const dom = /** @type {DocumentFragment} */ (
          this.UserTemplate.cloneNode(true)
        );

        ul.appendChild(dom);
      }

      const target = document.querySelector(
        this.dataset.target || ":scope > body"
      );
      if (!target)
        throw new Error(`Can't find data-target - ${this.dataset.target}`);

      //Move itself to the target
      if (target.firstElementChild !== this) target.prepend(this);
    };

    super({
      shadow: true,
      css,
      html,
      connectedCallback: _contentChanged,
      templateChangedCallback: _contentChanged,
      attributeChangedCallback
    });
  }
}
