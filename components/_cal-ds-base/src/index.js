//@ts-check

// @ts-ignore
import CssBaseStyleString from "./basestyle.css";

/**
 * Options for ca-eureka components
 * @typedef {object} cal_ds_options
 * @property {boolean} [shadow] - Create a shadow DOM?
 * @property {string} [css] - CSS to apply to component
 * @property {string} [global_css] - CSS to merge into the main DOM
 * @property {string} [html] - HTML to apply to component (Event configurable)
 * @property {() => void} [connectedCallback] - Callback to use when the component is added to DOM
 * @property {() => void} [templateChangedCallback] - callback to use when the TEMPLATE content changes
 * @property {(name:string,oldValue:string,newValue:string) => void} [attributeChangedCallback] - Callback to use when attribute changes
 */

/**
 * @typedef {"cal_ds_connectedCallback_end"
 * | "cal_ds_connectedCallback_start"
 * | "cal_ds_shadow_constructed_start"
 * | "cal_ds_shadow_constructed_end"
 * | "cal_ds_attributeChangedCallback_start"
 * | "cal_ds_attributeChangedCallback_end"
 * } cal_ds_events
 */

/** @typedef {(target:cal_ds_base,e:Event) => void} cal_ds_event_handler */

/**
 * @abstract
 */
export default class cal_ds_base extends HTMLElement {
  /**
   *
   * @param {cal_ds_options} [options]
   */
  constructor(options = {}) {
    super();

    /**
     * @type {(() => void) | undefined}
     * @private
     */
    this._connectedCallback = options.connectedCallback;

    /**
     * @type {((name:string,oldValue:string,newValue:string)=> void) | undefined}
     * @private
     */
    this._attributeChangedCallback = options.attributeChangedCallback;

    /**
     * Sets the HTML Template String that will be used to render the component
     * change this in the `cal_ds_shadow_constructed_start` event if you want to update the source HTML
     * @public
     * @type {string | undefined}
     */
    this.HTMLTemplateString = options.html;

    if (options.shadow) {
      //Shadow Dom requested
      const shadow = this.attachShadow({ mode: "open" });
      this.dispatchComponentEvent("cal_ds_shadow_constructed_start");

      this.addStyle(CssBaseStyleString); //Adds the base style for ALL components

      if (options.css) {
        this.addStyle(options.css);
      }

      if (this.HTMLTemplateString) {
        const myTemplate = document.createElement("template");
        myTemplate.innerHTML = this.HTMLTemplateString;
        // Check ram savings by using console.log(window.performance.memory.usedJSHeapSize/1000000);

        shadow.appendChild(myTemplate.content.cloneNode(true));
      }

      this.dispatchComponentEvent("cal_ds_shadow_constructed_end");
    }

    if (options.global_css) {
      //TODO: make this only happen one per unique sheet
      // Create a new style node
      const styleSheet = document.createElement("style");
      styleSheet.innerText = options.global_css;

      // Append the style node to the document head
      document.head.appendChild(styleSheet);
    }

    /***
     * The TEMPLATE tag inside the component
     * @public
     * @type {DocumentFragment | undefined}
     */
    this.UserTemplate = this.querySelector("template")?.content;
    const templateChangedCallback = options.templateChangedCallback;

    if (this.UserTemplate && templateChangedCallback) {
      // Create an observer instance linked to the callback function
      const observer = new MutationObserver(mutationsList =>
        mutationsList.forEach(templateChangedCallback)
      );

      // Start observing the target node for configured mutations
      observer.observe(this.UserTemplate, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
      });
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
   * @param {cal_ds_events} type
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
   * @param {cal_ds_events} EventName
   * @param {cal_ds_event_handler} handler
   * @returns {void}
   */
  /**
   * Add a window event handler for a component event (string)
   * @overload
   * @param {string} EventName
   * @param {cal_ds_event_handler} handler
   * @returns {void}
   */
  /**
   * @param {cal_ds_events | string} EventName
   * @param {cal_ds_event_handler} handler
   */
  static addCEventListener(EventName, handler) {
    window.addEventListener(EventName, e =>
      handler(/** @type {cal_ds_base} **/ (e.target), e)
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
    let style = cal_ds_base._styles[hash];

    if (!style) {
      style = new CSSStyleSheet();
      style.replaceSync(styleString);

      cal_ds_base._styles[hash] = style;
    }

    this.shadowRoot.adoptedStyleSheets.push(style);
  }

  /**
   * Base class connectedCallback
   * @protected
   * @readonly
   */
  connectedCallback() {
    this.dispatchComponentEvent("cal_ds_connectedCallback_start");

    if (this._connectedCallback) {
      this._connectedCallback();
    }

    this.dispatchComponentEvent("cal_ds_connectedCallback_end");
  }

  /**
   * Used with `observedAttributes` to track attribute changes
   * @param {string} _name
   * @param {string} _oldValue
   * @param {string} _newValue
   * @protected
   */
  attributeChangedCallback(_name, _oldValue, _newValue) {
    this.dispatchComponentEvent("cal_ds_attributeChangedCallback_start");

    if (this._attributeChangedCallback) {
      this._attributeChangedCallback(_name, _oldValue, _newValue);
    }
    this.dispatchComponentEvent("cal_ds_attributeChangedCallback_end");
  }
}
