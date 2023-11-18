//@ts-check
import ca_eureka_component from "../ca-eureka-component/index.js";

// @ts-ignore
import styles from "./styles.css" assert { type: "css" };

// @ts-ignore
import template from "./template.html" assert { type: "html" };
export default class ca_accordion extends ca_eureka_component {
  /** @override */
  static get tagName() {
    return "ca-accordion";
  }

  constructor() {
    const connectedCallback = () => {
      //console.log(template);
      if (!this.shadowRoot) return;

      this.shadowRoot.innerHTML = template;

      const root = /** @type {Element} */ (this.shadowRoot.getRootNode());
      const summaryEl = root.querySelector("summary");
      const detailsEl = root.querySelector("details");
      const bodyEl = root.querySelector("details > :not(summary)");

      if (summaryEl && detailsEl && bodyEl) {
        // trigger the opening and closing height change animation on summary click

        /**
         * @param {function} func
         */
        const debounce = (func, timeout = 300) => {
          let timer;
          return (/** @type {any} */ ...args) => {
            window.clearTimeout(timer);
            timer = window.setTimeout(() => {
              func.apply(this, args);
            }, timeout);
          };
        };

        const setHeight = () => {
          window.requestAnimationFrame(() => {
            // delay so the desired height is readable in all browsers
            this.closedHeightInt = summaryEl.scrollHeight + 2;
            this.closedHeight = `${this.closedHeightInt}px`;

            // apply initial height
            if (detailsEl.hasAttribute("open")) {
              // if open get scrollHeight
              detailsEl.style.height = `${
                bodyEl.scrollHeight + this.closedHeightInt
              }px`;
            } else {
              // else apply closed height
              detailsEl.style.height = this.closedHeight;
            }
          });
        };

        const listen = () => {
          if (detailsEl.hasAttribute("open")) {
            // was open, now closing
            detailsEl.style.height = this.closedHeight;
          } else {
            // was closed, opening
            window.requestAnimationFrame(() => {
              // delay so the desired height is readable in all browsers
              detailsEl.style.height = `${
                bodyEl.scrollHeight + this.closedHeightInt
              }px`;
            });
          }
        };

        setHeight();
        summaryEl.addEventListener("click", listen.bind(this));
        summaryEl.insertAdjacentHTML("beforeend", `<div aria-hidden="true" />`);

        window.addEventListener("resize", debounce(setHeight).bind(this));
      }
    };

    super(connectedCallback, {
      parent: "ca-body"
    });

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(styles);

    const shadow = this.attachShadow({ mode: "open" });
    shadow.adoptedStyleSheets.push(sheet);

    //let linkElem = document.querySelector("#bootstrap_css");
    //let scriptElem = document.querySelector("#bootstrap_js");
    /*
    let linkElem = document.createElement("link");
    linkElem.href =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css";
    linkElem.integrity =
      "sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN";
    linkElem.rel = "stylesheet";
    linkElem.crossOrigin = "anonymous";

    let scriptElem = document.createElement("script");
    scriptElem.src =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js";
    scriptElem.integrity =
      "sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL";
    scriptElem.crossOrigin = "anonymous";

    if (linkElem && scriptElem) {
      shadow.appendChild(linkElem.cloneNode());
      shadow.appendChild(scriptElem.cloneNode());
    }
    */
  }
}
