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
 * @typedef {"eureka_connectedCallback_end"
 * | "eureka_connectedCallback_start"
 * | "eureka_htmltemplate_set"
 * | "eureka_shadow_constructed_start"
 * | "eureka_shadow_constructed_end"
 * | "eureka_attributeChangedCallback_start"
 * | "eureka_attributeChangedCallback_end"
 * } ca_eureka_events
 */

/** @typedef {(target:ca_eureka_component,e:Event) => void} ca_eureka_event_handler */

/**
 * @abstract
 */
export default class ca_eureka_component extends HTMLElement {
  /**
   *
   * @param {ca_eureka_component_options} [options]
   */
  constructor(options = {}) {
    super();

    /**
     * Private options defined in the constructor
     * @type {ca_eureka_component_options}
     * @private
     * @readonly
     */
    this.options = options;

    if (options.shadow) {
      //Shadow Dom requested
      const shadow = this.attachShadow({ mode: "open" });
      this.dispatchComponentEvent("eureka_shadow_constructed_start");

      this.addStyle(CssRootStyleString);

      if (options.css) {
        this.addStyle(options.css);
      }

      // Triggers an event to get a custom TemplateString if asked for
      this.dispatchComponentEvent("eureka_htmltemplate_set");

      if (this.HTMLTemplateString) {
        const myTemplate = document.createElement("template");
        myTemplate.innerHTML = this.HTMLTemplateString;

        shadow.appendChild(myTemplate.content.cloneNode(true));
      }

      this.dispatchComponentEvent("eureka_shadow_constructed_end");
    }
  }

  /**
   * Returns the HTML Template String that will be used to render the component
   * @public
   */
  get HTMLTemplateString() {
    return this.options.html;
  }

  /**
   * Sets the HTML Template String that will be used to render the component
   * change this in the `eureka_htmltemplate_set` event if you want to update the source HTML
   * @public
   */
  set HTMLTemplateString(value) {
    this.options.html = value;
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
   * @param {ca_eureka_events} type
   */
  dispatchComponentEvent(type) {
    this.dispatchEvent(
      new Event(type, {
        bubbles: true
      })
    );
  }

  /**
   * Add a window event handler for a component event (choose from enum)
   * @overload
   * @param {ca_eureka_events} EventName
   * @param {ca_eureka_event_handler} handler
   * @returns {void}
   */
  /**
   * Add a window event handler for a component event (string)
   * @overload
   * @param {string} EventName
   * @param {ca_eureka_event_handler} handler
   * @returns {void}
   */
  /**
   * @param {ca_eureka_events | string} EventName
   * @param {ca_eureka_event_handler} handler
   */
  static addCEventListener(EventName, handler) {
    window.addEventListener(EventName, e =>
      handler(/** @type {ca_eureka_component} **/ (e.target), e)
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
    this.dispatchComponentEvent("eureka_connectedCallback_start");

    if (this.options?.connectedCallback) {
      this.options.connectedCallback();
    }

    this.dispatchComponentEvent("eureka_connectedCallback_end");
  }

  /**
   * Used with `observedAttributes` to track attribute changes
   * @param {string} _name
   * @param {string} _oldValue
   * @param {string} _newValue
   * @protected
   */
  attributeChangedCallback(_name, _oldValue, _newValue) {
    this.dispatchComponentEvent("eureka_attributeChangedCallback_start");

    if (this.options?.attributeChangedCallback) {
      this.options.attributeChangedCallback(_name, _oldValue, _newValue);
    }
    this.dispatchComponentEvent("eureka_attributeChangedCallback_end");
  }
}
