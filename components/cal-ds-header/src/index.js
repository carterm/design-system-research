// from
// https://www.cssscript.com/create-a-multi-level-drop-down-menu-with-pure-css/

//@ts-check
import cal_ds_base from "../../_cal-ds-base/src/index";

// @ts-ignore
import css from "./styles.css";

// @ts-ignore
import html from "./template.html";

export default class my extends cal_ds_base {
  /** @override */
  static get tagName() {
    return "cal-ds-header";
  }

  /**
   * @protected
   * @override
   */
  static get observedAttributes() {
    return ["data-logo-overflow"];
  }

  static updateAttributes(target, source) {
    if (source.attributes)
      // Update attributes
      Array.from(source.attributes).forEach(attr => {
        target.setAttribute(attr.name, attr.value);
      });

    // Update text content if specified
    if (
      !target.childElementCount &&
      !source.childElementCount &&
      source.textContent.trim()
    ) {
      target.textContent = source.textContent;
    }
  }

  static updateElement(target, source) {
    // Update attributes if specified
    my.updateAttributes(target, source);

    // Add missing children
    Array.from(source.childNodes).forEach(sourceChild => {
      if (sourceChild.nodeType === Node.ELEMENT_NODE) {
        const targetChild = Array.from(target.children).find(
          child => child.tagName === sourceChild.tagName
        );
        if (targetChild) {
          my.updateElement(targetChild, sourceChild);
        } else {
          target.appendChild(sourceChild.cloneNode(true));
        }
      }
    });
  }

  constructor() {
    const _contentChanged = () => {
      if (this.UserTemplate && this.shadowRoot) {
        const target = this.shadowRoot;
        target.innerHTML = html;

        const source = /** @type {DocumentFragment} */ (
          this.UserTemplate.cloneNode(true)
        );

        const site_logo = target.querySelector();

        my.updateElement(target, source);
      }
    };

    super({
      shadow: true,
      ignore_base_css: true,
      css,
      connectedCallback: _contentChanged,
      templateChangedCallback: _contentChanged
    });
  }
}
