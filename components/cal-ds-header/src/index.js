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

  constructor() {
    /**
     * @param {Element} target
     * @param {Element} source
     * @private
     */
    const _updateAttributes = (target, source) => {
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
    };

    /**
     *
     * @param {Element} target
     * @param {Element} source
     * @param {boolean} children
     * @private
     */
    const _updateElement = (target, source, children = false) => {
      // Update attributes if specified
      _updateAttributes(target, source);

      if (!children) return;

      // Add missing children
      Array.from(source.children).forEach(sourceChild => {
        if (sourceChild.nodeType === Node.ELEMENT_NODE) {
          const targetChild = Array.from(target.children).find(
            child => child.tagName === sourceChild.tagName
          );
          if (targetChild) {
            _updateElement(targetChild, sourceChild, children);
          } else {
            target.appendChild(sourceChild.cloneNode(true));
          }
        }
      });
    };

    /**
     * @template {HTMLElement} T
     * @param {DocumentFragment | Element} element
     * @param {string} selectors
     * @private
     */
    const _querySelectorRequre = (element, selectors) => {
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
    const _processNav = (
      source,
      target_desktop_nav_menu,
      target_mobile_nav_menu
    ) => {
      const detailsName = "MobileMenu";

      const source_navs = source.querySelectorAll(":scope > nav");
      if (!source_navs.length) {
        target_mobile_nav_menu.remove();
        target_desktop_nav_menu.remove();
        return;
      }

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

      const getLi = (/** @type {Element} */ myTag) => {
        const newLi = document.createElement("li");
        if (myTag.tagName === "A") {
          const aTag = /** @type {HTMLAnchorElement} */ (myTag.cloneNode(true));
          aTag.role = "menuitem";
          setIfCurrent(aTag);

          newLi.appendChild(aTag);
        }

        return newLi;
      };

      /** @type {HTMLUListElement} */
      const target_mobile_nav_ul = _querySelectorRequre(
        target_mobile_nav_menu,
        ":scope > ul"
      );

      /** @type {HTMLUListElement} */
      const target_desktop_nav_ul_utility = _querySelectorRequre(
        target_desktop_nav_menu,
        ":scope > ul.desktop-nav-menu-utility"
      );

      /** @type {HTMLUListElement} */
      const target_desktop_nav_ul_main = _querySelectorRequre(
        target_desktop_nav_menu,
        ":scope > ul.desktop-nav-menu-main"
      );

      [...source_navs[0].children].forEach(n => {
        const newLi = getLi(n);

        target_mobile_nav_ul.appendChild(newLi);
        target_desktop_nav_ul_main.appendChild(newLi.cloneNode(true));
      });

      const source_nav_utility =
        source_navs.length > 1 ? source_navs[1] : undefined;

      if (source_nav_utility) {
        [...source_nav_utility.children].forEach(n => {
          const newLi = getLi(n);

          target_mobile_nav_ul.appendChild(newLi);
          target_desktop_nav_ul_utility.appendChild(newLi.cloneNode(true));
        });
      } else {
        target_desktop_nav_ul_utility.remove();
      }
    };

    /**
     *
     * @param {HTMLDivElement} source
     * @param {HTMLElement} target_site_header_container
     * @param {my} me
     */
    const _processBranding = (source, target_site_header_container, me) => {
      const source_site_logo = source.querySelector(":scope > a:first-of-type");
      if (source_site_logo) {
        // <a class="site-logo">
        const target_site_logo = _querySelectorRequre(
          target_site_header_container,
          ":scope > a.site-logo"
        );

        _updateElement(target_site_logo, source_site_logo);

        // <img class="logo-image" />
        const target_site_logo_img = _querySelectorRequre(
          target_site_logo,
          ":scope > img.logo-image"
        );

        const source_site_logo_img =
          source_site_logo.querySelector(":scope > img");
        if (source_site_logo_img) {
          _updateElement(target_site_logo_img, source_site_logo_img);
        }

        if (me.dataset.logoOverflow?.toLowerCase() === "false") {
          target_site_logo_img.classList.add("no-overflow");
        }

        const source_site_branding_spans =
          source_site_logo.querySelectorAll(":scope > span");

        if (source_site_branding_spans.length) {
          // <div class="site-branding-text">
          const target_site_branding = _querySelectorRequre(
            target_site_logo,
            ":scope > div.site-branding-text"
          );

          // <span class="state">
          const target_site_branding_state = _querySelectorRequre(
            target_site_branding,
            ":scope > span.state"
          );

          _updateElement(
            target_site_branding_state,
            source_site_branding_spans[0]
          );

          // <span class="department">
          const target_site_branding_department = _querySelectorRequre(
            target_site_branding,
            ":scope > span.department"
          );

          if (source_site_branding_spans.length > 1) {
            _updateElement(
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
     * @private
     */
    const _processSearch = (source, target_site_header_utility) => {
      // <div class="search-container-desktop">
      const target_search_container_desktop = _querySelectorRequre(
        target_site_header_utility,
        ":scope > div.search-container-desktop"
      );

      /** @type {HTMLFormElement | null} */
      const source_form = source.querySelector(":scope > form");

      if (source_form) {
        // <form>
        const target_form = _querySelectorRequre(
          target_search_container_desktop,
          ":scope > form"
        );

        _updateElement(target_form, source_form, true);
      } else {
        // No form specified, remove search

        target_search_container_desktop.remove();
      }
    };

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
        const target_site_header_container = _querySelectorRequre(
          target,
          "header > div.site-header > div.site-header-container"
        );

        // <div class="site-header-utility">
        const target_site_header_utility = _querySelectorRequre(
          target_site_header_container,
          ":scope > div.site-header-utility"
        );

        _processBranding(source, target_site_header_container, this);
        _processSearch(source, target_site_header_utility);
        _processNav(
          source,
          _querySelectorRequre(target, "header > nav.desktop-nav-menu"),
          _querySelectorRequre(
            target_site_header_container,
            ":scope > nav.mobile-nav-menu"
          )
        );

        // Process Login Button
        const source_login_button = source.querySelector(
          ":scope > a.login-button"
        );
        const target_login_button = _querySelectorRequre(
          target_site_header_utility,
          ":scope > a.login-button"
        );

        if (source_login_button) {
          _updateElement(target_login_button, source_login_button, true);
        } else {
          target_login_button.remove();
        }
      }
    };

    // Track changes to the URL and update the selected menu item
    /** @private */
    let lastUrl = window.location.href;
    setInterval(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        _contentChanged();
      }
    }, 1000);

    super({
      shadow: true,
      css,
      connectedCallback: _contentChanged,
      templateChangedCallback: _contentChanged,
      attributeChangedCallback: _attributeChangedCallback
    });
  }
}
