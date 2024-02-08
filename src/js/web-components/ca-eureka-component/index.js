//@ts-check

// @ts-ignore
import CssRootStyleString from "./rootstyle.css";

/**
 * Options for ca-eureka components
 * @typedef {object} ca_eureka_component_options
 * @property {boolean} [shadow] - Create a shadow DOM?
 * @property {string} [css] - CSS to apply to component
 * @property {string} [html] - HTML to apply to component (Event configurable)
 * @property {() => void} [connectedCallback]
 * @property {(name:string,oldValue:string,newValue:string) => void} [attributeChangedCallback]
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

    if (options) {
      if (options.connectedCallback) {
        /**
         * @private
         * @type {()=>void | undefined}
         */
        this._connectedCallback = options.connectedCallback;
      }
      if (options.attributeChangedCallback) {
        /**
         * @private
         * @type {(name:string,oldValue:string,newValue:string) => void | undefined}
         */
        this._attributeChangedCallback = options.attributeChangedCallback;
      }
      if (options.shadow) {
        //Shadow Dom requested
        const shadow = this.attachShadow({ mode: "open" });

        this.addStyle(CssRootStyleString);

        document
          .querySelectorAll("ca-custom-css > style")
          .forEach(s => this.addStyle(s.innerHTML));

        if (options.css) {
          this.addStyle(options.css);
        }

        if (options.html) {
          /**
           * change this in the `eureka_htmltemplate_set` event if you want to update the source HTML
           * @public
           * @type {string | undefined}
           */
          this.HTMLTemplateString = options.html;

          // Triggers an event to get a custom TemplateString if asked for
          this.dispatchComponentEvent("eureka_htmltemplate_set");

          const myTemplate = document.createElement("template");
          myTemplate.innerHTML = this.HTMLTemplateString;

          shadow.appendChild(myTemplate.content.cloneNode(true));
        }
      }
    }
  }

  /**
   * Used with `attributeChangedCallback` to track changes to attributes
   * @abstract
   * @protected
   * @type {string[]}
   * @example //@protected //@readonly //@override
   * static get observedAttributes() { return ["data-summary", "data-expanded"]; }
   */
  static get observedAttributes() {
    return []; //Should never see
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

    // Hash Algorithm
    const hash = [...styleString].reduce(
      (a, b) => (a = (a << 5) - a + b.charCodeAt(0)) & a,
      0
    );

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
   * Base class connectedCallback
   * @protected
   * @readonly
   */
  connectedCallback() {
    const eventHeader = "eureka_connectedCallback_";
    this.dispatchComponentEvent(`${eventHeader}start`);

    if (this._connectedCallback) {
      this._connectedCallback();
    }
    this.dispatchComponentEvent(`${eventHeader}end`);
  }

  /**
   * Used with `observedAttributes` to track attribute changes
   * @param {string} _name
   * @param {string} _oldValue
   * @param {string} _newValue
   * @protected
   */
  attributeChangedCallback(_name, _oldValue, _newValue) {
    const eventHeader = "eureka_attributeChangedCallback_";
    this.dispatchComponentEvent(`${eventHeader}start`);

    if (this._attributeChangedCallback) {
      this._attributeChangedCallback(_name, _oldValue, _newValue);
    }
    this.dispatchComponentEvent(`${eventHeader}end`);
  }
}
