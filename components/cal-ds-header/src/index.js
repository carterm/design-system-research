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
   */
  static querySelectorRequre = (element, selectors) => {
    const result = element.querySelector(selectors);
    if (!result) throw Error(`Can't find selector "${selectors}"`);
    return /** @type {T} */ (result);
  };

  /**
   *
   * @param {HTMLElement} source
   * @param {HTMLElement} target_desktop_nav_menu
   * @param {HTMLElement} target_mobile_nav_menu
   */
  static processNav = (
    source,
    target_desktop_nav_menu,
    target_mobile_nav_menu
  ) => {
    const detailsName = "MobileMenu";

    const source_nav = source.querySelector(":scope > nav");
    if (!source_nav) {
      target_mobile_nav_menu.remove();
      target_desktop_nav_menu.remove();
      return;
    }

    /** @type {HTMLUListElement} */
    const target_mobile_nav_ul = my.querySelectorRequre(
      target_mobile_nav_menu,
      ":scope > ul"
    );

    /** @type {HTMLUListElement} */
    const target_desktop_nav_ul = my.querySelectorRequre(
      target_desktop_nav_menu,
      ":scope > ul"
    );

    const validUrl = (/** @type {string} */ href) => {
      try {
        return new URL(href, window.location.origin).href;
      } catch (e) {
        return href;
      }
    };

    const setIfCurrent = (/** @type {HTMLAnchorElement} */ a) => {
      if (validUrl(a.href) === window.location.href) {
        a.ariaCurrent = "page";
        a.tabIndex = -1;
      }
    };

    Array.from(source_nav.children).forEach(n => {
      const newLi = document.createElement("li");
      if (n.tagName === "A") {
        const aTag = /** @type {HTMLAnchorElement} */ (n.cloneNode(true));
        aTag.role = "menuitem";
        setIfCurrent(aTag);

        newLi.appendChild(aTag);
      } else {
        const newDetails = document.createElement("details");
        newDetails.name = detailsName;
        const newSummary = document.createElement("summary");
        const newDetailsUl = document.createElement("ul");
        newDetails.appendChild(newSummary);
        newDetails.appendChild(newDetailsUl);

        const clone = /** @type {Element} */ (n.cloneNode(true));

        //child
        clone.querySelectorAll("a").forEach(aTag => {
          aTag.role = "menuitem";
          const newDetailsLi = document.createElement("li");
          newDetailsLi.appendChild(aTag);
          newDetailsUl.appendChild(newDetailsLi);

          setIfCurrent(aTag);
        });

        newLi.appendChild(newDetails);

        newSummary.innerHTML = clone.innerHTML;
      }

      target_mobile_nav_ul.appendChild(newLi);
      target_desktop_nav_ul.appendChild(newLi.cloneNode(true));
    });
  };

  /**
   *
   * @param {HTMLDivElement} source
   * @param {HTMLElement} target_site_header_container
   * @param {my} me
   */
  static processBranding = (source, target_site_header_container, me) => {
    const source_site_logo = source.querySelector(":scope > a:first-of-type");
    if (source_site_logo) {
      // <a class="site-logo">
      const target_site_logo = my.querySelectorRequre(
        target_site_header_container,
        ":scope > a.site-logo"
      );

      my.updateElement(target_site_logo, source_site_logo);

      // <img class="logo-image" />
      const target_site_logo_img = my.querySelectorRequre(
        target_site_logo,
        ":scope > img.logo-image"
      );

      const source_site_logo_img =
        source_site_logo.querySelector(":scope > img");
      if (source_site_logo_img) {
        my.updateElement(target_site_logo_img, source_site_logo_img);
      }

      if (me.dataset.logoOverflow?.toLowerCase() === "false") {
        target_site_logo_img.classList.add("no-overflow");
      }

      const source_site_branding_spans =
        source_site_logo.querySelectorAll(":scope > span");

      if (source_site_branding_spans.length) {
        // <div class="site-branding-text">
        const target_site_branding = my.querySelectorRequre(
          target_site_logo,
          ":scope > div.site-branding-text"
        );

        // <span class="state">
        const target_site_branding_state = my.querySelectorRequre(
          target_site_branding,
          ":scope > span.state"
        );

        my.updateElement(
          target_site_branding_state,
          source_site_branding_spans[0]
        );

        // <span class="department">
        const target_site_branding_department = my.querySelectorRequre(
          target_site_branding,
          ":scope > span.department"
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
  };

  /**
   *
   * @param {HTMLDivElement} source
   * @param {HTMLElement} target_site_header_utility
   */
  static processSearch = (source, target_site_header_utility) => {
    // <div class="search-container-desktop">
    const target_search_container_desktop = my.querySelectorRequre(
      target_site_header_utility,
      ":scope > div.search-container-desktop"
    );

    /** @type {HTMLFormElement | null} */
    const source_form = source.querySelector(":scope > form");

    if (source_form) {
      // <form>
      const target_form = my.querySelectorRequre(
        target_search_container_desktop,
        ":scope > form"
      );

      my.updateElement(target_form, source_form, true);
    } else {
      // No form specified, remove search

      target_search_container_desktop.remove();
    }
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

        // <header role="banner">
        //   <div class="site-header">
        //     <div class="site-header-container">
        const target_site_header_container = my.querySelectorRequre(
          target,
          "header > div.site-header > div.site-header-container"
        );

        // <div class="site-header-utility">
        const target_site_header_utility = my.querySelectorRequre(
          target_site_header_container,
          ":scope > div.site-header-utility"
        );

        my.processBranding(source, target_site_header_container, this);
        my.processSearch(source, target_site_header_utility);
        my.processNav(
          source,
          my.querySelectorRequre(target, "header > nav.desktop-nav-menu"),
          my.querySelectorRequre(
            target_site_header_container,
            ":scope > nav.mobile-nav-menu"
          )
        );

        // Process Login Button
        const source_login_button = source.querySelector(
          ":scope > a.login-button"
        );
        const target_login_button = my.querySelectorRequre(
          target_site_header_utility,
          ":scope > a.login-button"
        );

        if (source_login_button) {
          my.updateElement(target_login_button, source_login_button, true);
        } else {
          target_login_button.remove();
        }
      }
    };

    super({
      shadow: true,
      css,
      connectedCallback: _contentChanged,
      templateChangedCallback: _contentChanged,
      attributeChangedCallback: _attributeChangedCallback
    });
  }
}
