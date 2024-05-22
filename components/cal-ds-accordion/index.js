//@ts-check
import cal_ds_base from "../_cal-ds-base/src/index";

// @ts-ignore
import css from "./styles.css";

// @ts-ignore
import html from "./template.html";

export default class my extends cal_ds_base {
  /** @override */
  static get tagName() {
    return "cal-ds-accordion";
  }

  /**
   * @protected
   * @override
   */
  static get observedAttributes() {
    return ["data-expanded"];
  }

  /**
   * Updates the css vars to match the size of the control
   * @param {HTMLDetailsElement} detail
   * @private
   */
  static _setSizes = detail => {
    /**
     * @param {string} prop
     * @param {number} value
     */
    const setOnlyIfChanged = (prop, value) => {
      const numValue = Number(
        detail.style.getPropertyValue(prop).replace("px", "")
      );

      if (value !== numValue) {
        detail.style.setProperty(prop, `${value}px`);
      }
    };

    const summary_Height = /** @type {HTMLElement} */ (
      detail.querySelector(":scope > summary")
    ).clientHeight;

    const allKids_Height = [...detail.querySelectorAll(":scope > *")]
      .map(x => /** @type {HTMLElement} */ (x).offsetHeight)
      .reduce((a, b) => a + b, 0);

    if (detail.open) setOnlyIfChanged("--expanded", allKids_Height);
    else setOnlyIfChanged("--collapsed", summary_Height);
  };

  /**
   * A single static observer for all accordions on the page
   * @type {ResizeObserver}
   * @private
   */
  static _resizeObserver;

  /**
   * The observer for all accordion control details resizing
   * @param {HTMLDetailsElement} target
   * @private
   */
  static _observeResize(target) {
    if (!my._resizeObserver) {
      // This declaration will only happen once for all controls
      my._resizeObserver = new ResizeObserver(entries =>
        entries.forEach(entry => {
          my._setSizes(/** @type {HTMLDetailsElement} */ (entry.target));
        })
      );
    }
    my._resizeObserver.observe(target);
  }

  /** @private */
  get _details() {
    return /** @type {HTMLDetailsElement} */ (
      this.shadowRoot?.querySelector("details")
    );
  }

  constructor() {
    const connectedCallback = () => {
      window.setTimeout(() => {
        my._setSizes(/** @type {HTMLDetailsElement} */ (detail));
      });
    };

    /**
     * @param {string} name
     * @param {string} _oldValue
     * @param {string} newValue
     */
    const attributeChangedCallback = (name, _oldValue, newValue) => {
      switch (name) {
        case my.observedAttributes[0]: {
          // data-expanded
          const shouldBeOpen =
            (newValue ?? "false").trim().toLowerCase() !== "false";

          if (this._details.open !== shouldBeOpen) {
            window.setTimeout(() => {
              this._details.open = shouldBeOpen;
            }, 1);
          }

          break;
        }
      }
    };

    super({
      shadow: true,
      css,
      html,
      attributeChangedCallback,
      connectedCallback
    });

    const detail = this._details;

    my._observeResize(detail);

    detail.addEventListener("toggle", () => {
      this.dataset.expanded = detail.open.toString();
    });
  }
}
