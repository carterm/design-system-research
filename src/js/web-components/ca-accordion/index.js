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

      /**
       *
       * @param {HTMLDetailsElement} details
       */
      function setDetailsHeight(details) {
        const setHeight = (
          /** @type {HTMLDetailsElement} */ detail,
          open = false
        ) => {
          const originalOpen = detail.open;
          detail.open = open;
          const rect = detail.getBoundingClientRect();
          console.log(rect);
          detail.dataset.width = `${rect.width}`;
          detail.style.setProperty(
            open ? `--expanded` : `--collapsed`,
            `${rect.height}px`
          );
          detail.open = originalOpen;
        };

        const RO = new ResizeObserver(entries =>
          entries
            .filter(x => x.target)
            .forEach(entry => {
              const detail = /** @type {HTMLDetailsElement} */ (entry.target);

              const width = parseInt(detail.dataset.width || "", 10);
              if (width !== entry.contentRect.width) {
                detail.removeAttribute("style");
                setHeight(detail);
                setHeight(detail, true);
              }
            })
        );

        RO.observe(details, { box: "border-box" });
      }

      /* Run it */
      setDetailsHeight(detailsEl);
    }
  }
}
