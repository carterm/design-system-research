//@ts-check
import cal_ds_base from "../_cal-ds-base/index";

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
  static setSizes = detail => {
    /**
     * @param {string} prop
     * @param {number} value
     */
    const setOnlyIfChanged = (prop, value) => {
      const pxvalue = `${value}px`;

      if (detail.style.getPropertyValue(prop) !== pxvalue) {
        detail.style.setProperty(prop, pxvalue);
      }
    };

    const summary_Height = /** @type {HTMLElement} */ (
      detail.querySelector(":scope > summary")
    ).clientHeight;

    const allKids_Height = [...detail.querySelectorAll(":scope > *")]
      .map(x => /** @type {HTMLElement} */ (x).offsetHeight)
      .reduce((a, b) => a + b, 0);

    setOnlyIfChanged("--collapsed", summary_Height);
    setOnlyIfChanged("--expanded", allKids_Height);
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
   * @protected
   */
  static observeResize(target) {
    if (!my._resizeObserver) {
      // This declaration will only happen once for all controls
      my._resizeObserver = new ResizeObserver(entries =>
        entries.forEach(entry => {
          my.setSizes(/** @type {HTMLDetailsElement} */ (entry.target));
        })
      );
    }
    my._resizeObserver.observe(target);
  }

  /** @public */
  get details() {
    return /** @type {HTMLDetailsElement} */ (
      this.shadowRoot?.querySelector("details")
    );
  }

  /** @public */
  get summary() {
    return /** @type {HTMLElement} */ (
      this.details.querySelector(":scope > summary")
    );
  }

  constructor() {
    /**
     * @param {string} name
     * @param {string} _oldValue
     * @param {string} newValue
     */
    const attributeChangedCallback = (name, _oldValue, newValue) => {
      switch (name) {
        case "data-expanded":
          this.details.open =
            (newValue ?? "false").trim().toLowerCase() !== "false";

          break;
      }
    };

    super({
      shadow: true,
      css,
      html,
      attributeChangedCallback
    });

    const detail = this.details;

    my.observeResize(detail);

    detail.addEventListener("transitionstart", e => {
      //Sets the size right as the animation starts
      if (e.target === detail) my.setSizes(detail);
    });

    detail.addEventListener("toggle", () => {
      this.dataset.expanded = detail.open.toString();
    });
  }
}
