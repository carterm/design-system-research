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
   *
   * @param {HTMLDetailsElement} detail
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

    const shadow = /** @type {ShadowRoot} */ (detail.parentNode);

    const innerDiv = /** @type {HTMLDivElement} */ (
      shadow.querySelector("details > div")
    );

    const summary = /** @type {HTMLElement} */ (
      shadow.querySelector("details > summary")
    );

    setOnlyIfChanged(
      "--expanded",
      summary.clientHeight +
        Math.max(summary.clientHeight * 2, innerDiv.clientHeight)
    );

    setOnlyIfChanged("--collapsed", summary.clientHeight);
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
      // This declaration should only happen once for all controls
      ca_accordion._resizeObserver = new ResizeObserver(entries =>
        entries.forEach(entry => {
          const detail = /** @type {HTMLDetailsElement} */ (entry.target);

          const contentRectWidth = `${entry.contentRect.width}`;

          if (detail.dataset.width !== contentRectWidth) {
            detail.dataset.width = contentRectWidth;

            ca_accordion.setSizes(detail);
          }
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
      if (e.target === detail) ca_accordion.setSizes(detail);
    });
  }
}
