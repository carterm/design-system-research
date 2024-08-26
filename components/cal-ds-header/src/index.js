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
      const _UserTemplate = this.UserTemplate;
      const _shadowRoot = this.shadowRoot;
      const _HTMLTemplateString = this.HTMLTemplateString;
      const _dataTarget = this.dataset.target;

      if (_UserTemplate && _shadowRoot && _HTMLTemplateString) {
        _shadowRoot.innerHTML = _HTMLTemplateString;

        /** @type {HTMLElement} */ (_shadowRoot.querySelector("p")).appendChild(
          _UserTemplate.cloneNode(true)
        );
      }

      const target = document.querySelector(_dataTarget || ":scope > body");
      if (!target) throw new Error(`Can't find data-target - ${_dataTarget}`);

      //Move itself to the target
      if (target.firstElementChild !== this) target.prepend(this);
    };

    super({
      shadow: true,
      ignore_base_css: true,
      css,
      html,
      connectedCallback: _contentChanged,
      templateChangedCallback: _contentChanged,
      attributeChangedCallback
    });
  }
}
