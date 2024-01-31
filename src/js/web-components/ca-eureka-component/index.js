//@ts-check

// @ts-ignore
import CssRootStyleString from "./rootstyle.css";

/**
 * Options for ca-eureka components
 * @typedef {object} ca_eureka_component_options
 * @property {boolean} [shadow] - Create a shadow DOM?
 * @property {string} [css] - CSS to apply to component
 * @property {string} [html] - HTML to apply to component (Event configurable)
 */

/**
 * @abstract
 */
export default class ca_eureka_component extends HTMLElement {
  /**
   *
   * @param {ca_eureka_component_options} [options]
   */
  constructor(options) {
    super();

    if (options?.shadow) {
      const shadow = this.attachShadow({ mode: "open" });
      this.shadowRoot?.adoptedStyleSheets.push(ca_eureka_component.shareCss);
      document.querySelectorAll("ca-custom-css > style").forEach(s => {
        this.addStyle(s.innerHTML);
      });
      if (options.css) {
        this.addStyle(options.css);
      }
      if (options.html) {
        const myTemplate = document.createElement("template");
        myTemplate.innerHTML = this.setHTMLTemplateString(options.html);

        shadow.appendChild(myTemplate.content.cloneNode(true));
      }
    }
  }

  /**
   * Used with `attributeChangedCallback` to track changes to attributes
   * @abstract
   * @protected
   * @readonly
   * @type {string[] | undefined}
   * @example //@protected //@readonly //@override
   * static observedAttributes = ["data-summary", "data-expanded"];
   */
  static observedAttributes = undefined;

  /** @type {CSSStyleSheet} */
  static _shareCss;
  static get shareCss() {
    if (!this._shareCss) {
      this._shareCss = new CSSStyleSheet();
      this._shareCss.replaceSync(CssRootStyleString);
    } else {
      console.log("reuse");
    }
    return this._shareCss;
  }

  /**
   * Get the tagName this class will use
   * @abstract
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
   *  @type {string[]}
   */
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
   * @param {string} styleString css to add
   * @public
   * @example myComponent.addStyle("p{background-color:pink}");
   */
  addStyle(styleString) {
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

      //Safari 17.2.1 does not support remembering adoptedStyleSheets here
      //ca_eureka_component._styles[hash] = style;
    }

    this.shadowRoot.adoptedStyleSheets.push(style);
  }

  /**
   * @protected
   * @param {string} html
   */
  setHTMLTemplateString(html) {
    /**
     * change this in the `eureka_htmltemplate_set` event if you want to update the source HTML
     * @public
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
   * Base class connectedCallback
   * @protected
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
   * @abstract
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  attributeChangedCallback(_name, _oldValues, _newValue) {}
}
