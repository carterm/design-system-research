//@ts-check
import ca_eureka_component from "../ca-eureka-component/index.js";

// @ts-ignore
import css from "./styles.css";

// @ts-ignore
import html from "./template.html";

export default class ca_accordion extends ca_eureka_component {
  /** @override */
  static get tagName() {
    return "ca-accordion";
  }

  /**
   * @protected
   * @readonly
   * @override
   */
  static observedAttributes = ["data-summary", "data-expanded"];

  /**
   * Updates the css vars to match the size of the control
   * @param {HTMLDetailsElement} detail
   * @private
   */
  static setSizes = detail => {
    /**
     *
     * @param {string} prop
     * @param {number} value
     */
    const setOnlyIfChanged = (prop, value) => {
      const pxvalue = `${value}px`;

      if (detail.style.getPropertyValue(prop) !== pxvalue) {
        detail.style.setProperty(prop, pxvalue);
      }
    };

    const summary_clientHeight = /** @type {HTMLElement} */ (
      detail.querySelector(":scope > summary")
    ).clientHeight;

    const allKids_clientHeight = [...detail.querySelectorAll(":scope > *")]
      .map(x => x.clientHeight)
      .reduce((a, b) => a + b, 0);

    setOnlyIfChanged("--collapsed", summary_clientHeight);
    setOnlyIfChanged("--expanded", summary_clientHeight + allKids_clientHeight);
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
    if (!ca_accordion._resizeObserver) {
      // This declaration will only happen once for all controls
      ca_accordion._resizeObserver = new ResizeObserver(entries =>
        entries.forEach(entry => {
          ca_accordion.setSizes(
            /** @type {HTMLDetailsElement} */ (entry.target)
          );
        })
      );
    }
    ca_accordion._resizeObserver.observe(target);
  }

  /**
   * @param {string} name
   * @param {string} _oldValue
   * @param {string} newValue
   * @protected
   * @override
   */
  attributeChangedCallback(name, _oldValue, newValue) {
    const o = ca_accordion.observedAttributes;
    switch (name) {
      case o[0]: //"data-summary":
        this.summary.innerHTML = `${newValue}<div aria-hidden="true" />`;

        break;
      case o[1]: //"data-expanded":
        this.details.open =
          (newValue ?? "false").trim().toLowerCase() !== "false";

        break;
    }
  }

  constructor() {
    super({
      shadow: true,
      css,
      html
    });

    /** @private */
    this.details = /** @type {HTMLDetailsElement} */ (
      this.shadowRoot?.querySelector("details")
    );

    /** @private */
    this.summary = /** @type {HTMLElement} */ (
      this.details.querySelector(":scope > summary")
    );
    const detail = this.details;

    ca_accordion.observeResize(detail);

    detail.addEventListener("transitionstart", e => {
      //Sets the size right as the animation starts
      if (e.target === detail) ca_accordion.setSizes(detail);
    });
  }
}
