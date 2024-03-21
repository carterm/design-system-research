// from
// https://www.cssscript.com/create-a-multi-level-drop-down-menu-with-pure-css/

//@ts-check
import cal_ds_base from "../_cal-ds-base/index";

// @ts-ignore
import html from "./template.html";

// @ts-ignore
import css from "./styles.css";

export default class my extends cal_ds_base {
  /** @override */
  static get tagName() {
    return "cal-ds-dev-editor";
  }

  /**
   * @protected
   * @override
   */
  static get observedAttributes() {
    return ["data-target-selector"];
  }

  /**
   * @private
   */
  get _textarea() {
    return /** @type {HTMLTextAreaElement} */ (
      this.shadowRoot?.querySelector("textarea")
    );
  }

  constructor() {
    /**
     *  attributeChangedCallback, static so it can be a reference
     *  @private
     *  @readonly
     */
    const _attributeChangedCallback =
      /**
       * @param {string} name
       * @param {string} _oldValue
       * @param {string} newValue
       */
      (name, _oldValue, newValue) => {
        const observedAttributes = my.observedAttributes; // const will minify

        switch (name) {
          case observedAttributes[0]: //"data-title":
            {
              const target = document.querySelector(newValue);
              if (target) {
                this._target = target;
              }
            }

            break;
        }
      };

    const _keylistener = () => {
      console.log("key");
      if (this._target) {
        this._target.innerHTML = this._textarea.value;
      }
    };
    const _connectedCallback = () => {
      if (this._target) {
        this._textarea.value = this._target.innerHTML;

        this._textarea.addEventListener("keyup", _keylistener);
      }
    };

    super({
      shadow: true,
      html,
      css,
      attributeChangedCallback: _attributeChangedCallback,
      connectedCallback: _connectedCallback
    });

    /**
     * @type {Element | undefined}
     * @private
     */
    this._target = undefined;
  }
}
