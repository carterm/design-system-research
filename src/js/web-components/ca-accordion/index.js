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

  /** @type {ResizeObserver} */
  static _resizeObserver;

  /**
   * @param {Element} target
   */
  static observeResize(target) {
    if (!ca_accordion._resizeObserver) {
      ca_accordion._resizeObserver = new ResizeObserver(entries =>
        entries
          .filter(x => x.target)
          .forEach(entry => {
            const detail = /** @type {HTMLDetailsElement} */ (entry.target);

            const width = parseInt(detail.dataset.width || "");
            if (width !== entry.contentRect.width) {
              detail.dataset.width = `${entry.contentRect.width}`;

              ["--expanded", "--collapsed"].forEach(s =>
                detail.style.removeProperty(s)
              );

              [1, 2].forEach(x => {
                detail.style.setProperty(
                  detail.open ? "--expanded" : "--collapsed",
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

  constructor() {
    super({
      parent: "ca-body"
    });

    const shadow = this.attachShadow({ mode: "closed" });

    ca_accordion.addStyle(shadow);
    ca_accordion.addStyle(shadow, CssStyleString);

    const myTemplate = document.createElement("template");
    myTemplate.innerHTML = HtmlTemplateString;

    shadow.appendChild(myTemplate.content.cloneNode(true));

    const detailsEl = shadow.querySelector("details");
    const summaryEl = shadow.querySelector("details > summary");
    const bodyEl = shadow.querySelector("details > :not(summary)");

    if (summaryEl && detailsEl && bodyEl) {
      // trigger the opening and closing height change animation on summary click

      summaryEl.insertAdjacentHTML("beforeend", `<div aria-hidden="true" />`);

      ca_accordion.observeResize(detailsEl);
    }
  }
}
