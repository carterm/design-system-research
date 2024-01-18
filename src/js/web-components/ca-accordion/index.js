//@ts-check
import ca_eureka_component from "../ca-eureka-component/index.js";

// @ts-ignore
import CssStyleString from "./styles.css" assert { type: "css" };

// @ts-ignore
import HtmlTemplateString from "./template.html" assert { type: "html" };

export default class ca_accordion extends ca_eureka_component {
  /** @override */
  static get tagName() {
    return "ca-accordion";
  }

  /** @protected @readonly @override */
  static observedAttributes = ["data-summary", "data-expanded"];

  /**
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
    const cssVars = ["--expanded", "--collapsed"]; //match the CSS vars in CSS
    if (!ca_accordion._resizeObserver) {
      // This declaration should only happen once for all controls
      ca_accordion._resizeObserver = new ResizeObserver(entries =>
        entries.forEach(entry => {
          const detail = /** @type {HTMLDetailsElement} */ (entry.target);

          const contentRectWidth = `${entry.contentRect.width}`;

          if (detail.dataset.width !== contentRectWidth) {
            detail.dataset.width = contentRectWidth;

            cssVars.forEach(cssVar => detail.style.removeProperty(cssVar));

            //Run 2 times
            [0, 0].forEach(() => {
              detail.style.setProperty(
                detail.open ? cssVars[0] : cssVars[1],
                `${detail.getBoundingClientRect().height}px`
              );

              detail.open = !detail.open;
            });
          }
        })
      );
    }
    ca_accordion._resizeObserver.observe(target);
  }

  /**
   *
   * @param {string} name
   * @param {string} _oldValue
   * @param {string} newValue
   * @protected
   * @override
   */
  attributeChangedCallback(name, _oldValue, newValue) {
    const o = ca_accordion.observedAttributes;
    switch (name) {
      case "data-summary":
        this.summary.innerHTML = newValue + `<div aria-hidden="true" />`;

        break;
      case "data-expanded":
        this.details.open =
          (newValue ?? "false").trim().toLowerCase() !== "false";

        break;
    }
  }

  constructor() {
    super({
      parent: "ca-body"
    });

    const shadow = this.attachShadow({ mode: "open" });

    this.addStyle();
    this.addStyle(CssStyleString);

    const myTemplate = document.createElement("template");
    myTemplate.innerHTML = this.setHTMLTemplateString(HtmlTemplateString);

    shadow.appendChild(myTemplate.content.cloneNode(true));

    /** @private */
    this.details = /** @type {HTMLDetailsElement} */ (
      shadow.querySelector("details")
    );

    /** @private */
    this.summary = /** @type {HTMLElement} */ (
      this.details.querySelector(":scope > summary")
    );

    ca_accordion.observeResize(this.details);
  }
}
