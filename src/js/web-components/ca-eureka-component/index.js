//@ts-check

// @ts-ignore
import CssRootStyleString from "./rootstyle.css" assert { type: "css" };

export default class ca_eureka_component extends HTMLElement {
  constructor(use_shadow = false, custom_css = "", html_template = "") {
    super();

    if (use_shadow) {
      const shadow = this.attachShadow({ mode: "open" });
      this.addStyle();
      document.querySelectorAll("ca-custom-css > style").forEach(s => {
        this.addStyle(s.innerHTML);
      });
      if (custom_css) {
        this.addStyle(custom_css);
      }
      if (html_template) {
        const myTemplate = document.createElement("template");
        myTemplate.innerHTML = this.setHTMLTemplateString(html_template);

        shadow.appendChild(myTemplate.content.cloneNode(true));
      }
    }
  }

  /**
   * Used with `attributeChangedCallback` to track changes to attributes
   *
   * Should be overridden in extended component
   * @protected
   * @readonly
   * @type {string[] | undefined}
   * @example //@protected //@readonly //@override
   * static observedAttributes = ["data-summary", "data-expanded"];
   */
  static observedAttributes = undefined;

  /**
   * Get the tagName this class will use
   * @protected
   */
  static get tagName() {
    return ""; //Should never see
  }

  /**
   * Private Hashtable for style objects
   * @private
   * @readonly
   */
  static _styles = {};

  /**
   *  @public
   *  @type {string[]} */
  static defaultStyleCss = [];

  /**
   * Dispatch a bubbling event for the page to listen for
   * @protected
   * @param {string} type
   */
  dispatchComponentEvent(type) {
    this.dispatchEvent(
      new Event(type, {
        bubbles: true
      })
    );
  }

  /**
   * Add a cachable stylestring to a shadow root
   * @param {string} [styleString] leave blank to add the root css
   * @public
   * @example myComponent.addStyle("p{background-color:pink}");
   */
  addStyle(styleString = CssRootStyleString) {
    if (!this.shadowRoot)
      throw new Error("AddStyle only works with open shadowRoots");

    const hashCode = (/** @type {string} */ s) =>
      s.split("").reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0);

    const hash = hashCode(styleString);

    /** @type {CSSStyleSheet} */
    let style = ca_eureka_component._styles[hash];

    if (!style) {
      style = new CSSStyleSheet();
      style.replaceSync(styleString);

      ca_eureka_component._styles[hash] = style;
    }

    this.shadowRoot.adoptedStyleSheets.push(style);
  }

  /**
   * @protected
   * @param {string} html
   */
  setHTMLTemplateString(html) {
    /**
     * @public
     * change this in the `eureka_htmltemplate_set` event if you want to update the source HTML
     */

    this.HTMLTemplateString = html;

    this.dispatchComponentEvent("eureka_htmltemplate_set");

    return this.HTMLTemplateString;
  }

  /**
   * @protected
   * @param {() => void} [connectedCallback]
   */
  setConnectedCallback(connectedCallback) {
    /** @private */
    this._connectedCallback = connectedCallback;
  }

  /**
   * @protected
   * Base class connectedCallback
   */
  connectedCallback() {
    this.dispatchComponentEvent("eureka_connectedCallback_start");

    if (this._connectedCallback) {
      this._connectedCallback();
    }
    this.dispatchComponentEvent("eureka_connectedCallback_end");
  }

  /**
   * Used with `observedAttributes` to track attribute changes
   *
   * Should be overridden in extended component
   * @param {string} _name
   * @param {string} _oldValues
   * @param {string} _newValue
   * @protected
   */
  attributeChangedCallback(_name, _oldValues, _newValue) {}
}
