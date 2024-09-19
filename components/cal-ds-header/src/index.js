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

  /**
   * @param {Element} target
   * @param {Element} source
   */
  static updateAttributes(target, source) {
    if (source.attributes)
      // Update attributes
      // Clear attribtues set as "null"
      Array.from(source.attributes).forEach(attr => {
        if (attr.value.trim().toLowerCase() === "null") {
          target.attributes.removeNamedItem(attr.name);
        } else {
          target.setAttribute(attr.name, attr.value);
        }
      });

    // Update text content if specified
    if (
      !target.childElementCount &&
      !source.childElementCount &&
      source.textContent?.trim()
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
          my.updateElement(targetChild, sourceChild, children);
        } else {
          target.appendChild(sourceChild.cloneNode(true));
        }
      }
    });
  }

  /**
   * @template {HTMLElement} T
   * @param {DocumentFragment | Element} element
   * @param {string} selectors
   * @param {boolean} scope
   */
  static querySelectorRequre = (element, selectors, scope = true) => {
    if (scope) selectors = `:scope > ${selectors}`;
    const result = element.querySelector(selectors);
    if (!result) throw Error(`Can't find selector "${selectors}"`);
    return /** @type {T} */ (result);
  };

  constructor() {
    /**
     * Used with `observedAttributes` to track attribute changes
     * @param {string} _name
     * @protected
     */
    const _attributeChangedCallback = _name => {
      switch (_name) {
        case my.observedAttributes[0]: //"data-logo-overflow";
          _contentChanged();

          break;
      }
    };

    const _contentChanged = () => {
      if (this.UserTemplate && this.shadowRoot) {
        const target = this.shadowRoot;
        target.innerHTML = html;

        const source = document.createElement("div");
        source.appendChild(this.UserTemplate.cloneNode(true));

        const source_site_logo = source.querySelector(":scope > a");

        // <header role="banner">
        //   <div class="site-header">
        //     <div class="site-header-container">
        const target_site_header_container = my.querySelectorRequre(
          target,
          "header > div.site-header > div.site-header-container",
          false
        );

        if (source_site_logo) {
          // <a class="site-logo">
          const target_site_logo = my.querySelectorRequre(
            target_site_header_container,
            "a.site-logo"
          );

          my.updateElement(target_site_logo, source_site_logo);

          // <img class="logo-image" />
          const target_site_logo_img = my.querySelectorRequre(
            target_site_logo,
            "img.logo-image"
          );

          const source_site_logo_img = source_site_logo.querySelector("img");
          if (source_site_logo_img) {
            my.updateElement(target_site_logo_img, source_site_logo_img);
          }

          if (this.dataset.logoOverflow?.toLowerCase() === "false") {
            target_site_logo_img.classList.add("no-overflow");
          }

          const source_site_branding_spans =
            source_site_logo.querySelectorAll("span");

          if (source_site_branding_spans.length) {
            // <div class="site-branding-text">
            const target_site_branding = my.querySelectorRequre(
              target_site_logo,
              "div.site-branding-text"
            );

            // <span class="state">
            const target_site_branding_state = my.querySelectorRequre(
              target_site_branding,
              "span.state"
            );

            my.updateElement(
              target_site_branding_state,
              source_site_branding_spans[0]
            );

            // <span class="department">
            const target_site_branding_department = my.querySelectorRequre(
              target_site_branding,
              "span.department"
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

        // <div class="site-header-utility">
        const target_site_header_utility = my.querySelectorRequre(
          target_site_header_container,
          "div.site-header-utility"
        );

        // <div class="search-container-desktop">
        const target_search_container_desktop = my.querySelectorRequre(
          target_site_header_utility,
          "div.search-container-desktop"
        );

        /** @type {HTMLFormElement | null} */
        const source_form = source.querySelector("form");

        if (source_form) {
          // <form>
          const target_form = my.querySelectorRequre(
            target_search_container_desktop,
            "form"
          );

          my.updateElement(target_form, source_form, true);
        } else {
          // No form specified, remove search
          target_site_header_utility.removeChild(
            target_search_container_desktop
          );
        }
      }
    };

    super({
      shadow: true,
      ignore_base_css: true,
      css,
      connectedCallback: _contentChanged,
      templateChangedCallback: _contentChanged,
      attributeChangedCallback: _attributeChangedCallback
    });
  }
}
