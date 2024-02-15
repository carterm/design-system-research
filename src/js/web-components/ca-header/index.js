//@ts-check
import ca_eureka_component from "../_ca-eureka-component/index.js";

// @ts-ignore
import css from "./styles.css";

// @ts-ignore
import html from "./template.html";

export default class ca_header extends ca_eureka_component {
  /** @override */
  static get tagName() {
    return "ca-header";
  }

  // eslint-disable-next-line jsdoc/empty-tags
  /** @protected @readonly @override */
  static observedAttributes = ["data-department", "data-avatar"];

  /**
   * @param {string} name
   * @param {string} _oldValue
   * @param {string} newValue
   * @protected
   * @override
   */
  attributeChangedCallback(name, _oldValue, newValue) {
    switch (name) {
      case "data-department":
        {
          const selector = this.shadowRoot?.querySelectorAll(
            ".department-name > h4"
          );
          if (selector) {
            selector.forEach(item => (item.innerHTML = newValue));
          }
        }
        break;
      case "data-avatar":
        {
          const selector = this.shadowRoot?.querySelectorAll(".avatar > img");
          if (selector) {
            selector.forEach(item => item.setAttribute("src", newValue));
          }
        }
        break;
    }
  }

  constructor() {
    super({
      shadow: true,
      css,
      html
    });

    const avatar = this.shadowRoot?.querySelector(".avatar");
    const mobileMenu = this.shadowRoot?.querySelector(".mobile-menu");
    const search = this.shadowRoot?.querySelector(".search-icon-container");
    const login = this.shadowRoot?.querySelector(".login");
    const loginMobile = this.shadowRoot?.querySelector(".login-mobile");
    const caGov = this.shadowRoot?.querySelector(".cagov-menu");
    const caGovMobile = this.shadowRoot?.querySelector(".cagov-menu-mobile");

    avatar.addEventListener("click", e => {
      console.log("Avatar was clicked!", e.target);
    });
    mobileMenu.addEventListener("click", e => {
      console.log("Mobile Menu was clicked!", e.target);
    });
    search.addEventListener("click", e => {
      console.log("Search was clicked!", e.target);
    });
    login.addEventListener("click", e => {
      console.log("Login was clicked!", e.target);
    });
    loginMobile.addEventListener("click", e => {
      console.log("Login Mobile was clicked!", e.target);
    });
    caGov.addEventListener("click", e => {
      console.log("CA GOV was clicked!", e.target);
    });
    caGovMobile.addEventListener("click", e => {
      console.log("CA GOV Mobile was clicked!", e.target);
    });
  }
}
