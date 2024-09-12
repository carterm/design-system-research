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

  /**
   *
   * @param {Element} target
   * @param {Element} source
   * @param {boolean} children
   */
  static updateElement(target, source, children = false) {
    // Update attributes if specified
    my.updateAttributes(target, source);

    if (!children) return;

    // Add missing children
    Array.from(source.children).forEach(sourceChild => {
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

  /**
   *
   * @param {DocumentFragment | Element} element
   * @param {string} selectors
   */
  static querySelectorRequre = (element, selectors) => {
    const result = element.querySelector(selectors);
    if (!result) throw Error(`Can't find selector "${selectors}"`);
    return result;
  };

  /**
   *
   * @param {DocumentFragment | Element} element
   * @param {string} selectors
   */
  static querySelectorAllRequre = (element, selectors) => {
    const result = element.querySelectorAll(selectors);
    if (result.length === 0) throw Error(`Can't find selector "${selectors}"`);
    return result;
  };

  constructor() {
    const _contentChanged = () => {
      if (this.UserTemplate && this.shadowRoot) {
        const target = this.shadowRoot;
        target.innerHTML = html;

        const target_site_header_container = /** @type {HTMLDivElement} */ (
          my.querySelectorRequre(
            target,
            "header > div.site-header > div.site-header-container"
          )
        );

        const source = document.createElement("div");
        source.appendChild(this.UserTemplate.cloneNode(true));

        const source_site_logo = source.querySelector(":scope > a");

        if (source_site_logo) {
          const target_site_logo = /** @type {HTMLAnchorElement} */ (
            my.querySelectorRequre(target_site_header_container, ":scope > a")
          );

          my.updateElement(target_site_logo, source_site_logo);

          const source_site_logo_img =
            source_site_logo.querySelector(":scope > img");
          if (source_site_logo_img) {
            const target_site_logo_img = /** @type {HTMLAnchorElement} */ (
              my.querySelectorRequre(target_site_logo, ":scope > img")
            );

            my.updateElement(target_site_logo_img, source_site_logo_img);
          }

          /** @type {NodeListOf<HTMLSpanElement> } */
          const source_site_branding_spans =
            source_site_logo.querySelectorAll(":scope > span");

          if (source_site_branding_spans.length) {
            const target_site_branding = my.querySelectorRequre(
              target_site_logo,
              ":scope > div.site-branding-text"
            );

            const target_site_branding_state = /** @type {HTMLSpanElement } */ (
              my.querySelectorRequre(
                target_site_branding,
                ":scope  > span.state"
              )
            );

            const target_site_branding_department =
              /** @type {HTMLSpanElement } */ (
                my.querySelectorRequre(
                  target_site_branding,
                  ":scope > span.department"
                )
              );

            my.updateElement(
              target_site_branding_state,
              source_site_branding_spans[0]
            );

            if (source_site_branding_spans.length > 1) {
              my.updateElement(
                target_site_branding_department,
                source_site_branding_spans[1]
              );
            } else {
              target_site_branding_department.innerHTML = "";
            }
          }
        }
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
