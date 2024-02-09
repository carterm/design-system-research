//@ts-check
import ca_eureka_component from "../_ca-eureka-component/index";

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
      const o = ca_accordion.observedAttributes;
      switch (name) {
        case o[0]: //"data-expanded":
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

    ca_accordion.observeResize(detail);

    detail.addEventListener("transitionstart", e => {
      //Sets the size right as the animation starts
      if (e.target === detail) ca_accordion.setSizes(detail);
    });

    detail.addEventListener("toggle", () => {
      this.dataset.expanded = detail.open.toString();
    });
  }
}
