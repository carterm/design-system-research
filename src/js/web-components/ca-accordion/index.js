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

  /** @type {CSSStyleSheet | undefined} */
  static _style;
  static get StyleSheet() {
    if (!this._style) {
      this._style = new CSSStyleSheet();
      this._style.replaceSync(CssStyleString);
    }
    return this._style;
  }

  constructor() {
    const connectedCallback = () => {};

    super(connectedCallback, {
      parent: "ca-body"
    });

    const shadow = this.attachShadow({ mode: "closed" });

    shadow.adoptedStyleSheets.push(ca_accordion.StyleSheet);

    const myTemplate = document.createElement("template");
    myTemplate.innerHTML = HtmlTemplateString;

    shadow.appendChild(myTemplate.content.cloneNode(true));

    const root = /** @type {Element} */ (shadow.getRootNode());

    const detailsEl = root.querySelector("details");
    const summaryEl = root.querySelector("details > summary");
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
  }
}
