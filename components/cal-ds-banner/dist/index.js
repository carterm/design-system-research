var CssBaseStyleString = ":host{font-family:system-ui,-apple-system,\"Segoe UI\",Roboto,\"Helvetica Neue\",\"Noto Sans\",\"Liberation Sans\",Arial,sans-serif;--gov-header:#071645;--brand-primary:#13394b;--brand-secondary:#0070a3;--banner-light:#d5dbde;--banner-dark:#09202b;--brand-hover-light:#3ca3d3;--brand-hover-dark:#246c8e;--background-primary-light:#d9d8cf;--background-secondary-light:#f5f3eb;--background-primary-dark:#43433f;--background-secondary-dark:#65645f;--action-primary:#fec335;--action-secondary:#fae2ad;--text-white:#fff;--grey:#ccc;--grey-text:#323232;--grey-background:#eee;--gutter-gap:1.674vw;--flow-space:1rem;--radius:1rem;--shadow:0.2rem 0.2rem 0.5rem 0 rgba(0 0 0 / 25%);--shadow-focus:0.1rem 0.1rem 0.25rem 0 rgba(0 0 0 / 10%);--shadow-active:0.2rem 0.2rem 0.5rem 0 rgba(0 0 0 / 60%);--font-size:1rem;--ratio:1.24;--s0:calc(var(--font-size) - 0.3rem) + 0.2vw;--st:calc(var(--s0) * var(--ratio));--base:calc(var(--st) * var(--ratio));--lt:calc(var(--base) * var(--ratio));--h6:calc(var(--s0) * var(--ratio));--h5:calc(var(--h6) * var(--ratio));--h4:calc(var(--h5) * var(--ratio));--h3:calc(var(--h4) * var(--ratio));--h2:calc(var(--h3) * var(--ratio));--h1:calc(var(--h2) * var(--ratio) * var(--ratio));}";

//@ts-check


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
class cal_ds_base extends HTMLElement {
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

var css = ":host > div{background-color:#fdbc5b;min-height:2rem;> div{display:flex;gap:0.3rem;margin:0 auto;padding:0.5rem 1rem;width:100%;max-width:1820px;font-family:\"Noto Sans\",system-ui,-apple-system,\"Segoe UI\",Roboto,\"Helvetica Neue\",sans-serif;> p{margin:0;font-size:1rem;a{color:#203673;&:hover,&:focus{color:#004972;}&:focus{outline:2px solid #004972;}}}@media (width >= 576px){max-width:576px!important;}@media (width >= 768px){max-width:768px!important;}@media (width >= 992px){max-width:992px!important;}@media (width >= 1200px){max-width:1200px!important;}@media (width >= 1280px){max-width:1280px!important;}@media (width >= 1400px){max-width:1820px!important;}}}";

var html = "<div> <div> <svg aria-hidden=\"true\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 18 17.6\" style=\"width: 1rem; height: 1rem;\"> <g> <radialGradient id=\"SVGID_1_\" cx=\"7.6553\" cy=\"6.5485\" r=\"7.5719\" gradientUnits=\"userSpaceOnUse\"> <stop offset=\"0.4356\" style=\"stop-color:#FF0000\"/> <stop offset=\"0.8402\" style=\"stop-color:#AB0000\"/> </radialGradient> <circle style=\"fill:url(#SVGID_1_);\" cx=\"9\" cy=\"8.7\" r=\"8\"/> </g> </svg> <p></p> </div> </div> ";

// from
// https://www.cssscript.com/create-a-multi-level-drop-down-menu-with-pure-css/


class my extends cal_ds_base {
  /** @override */
  static get tagName() {
    return "cal-ds-banner";
  }

  /**
   * @protected
   * @override
   */
  static get observedAttributes() {
    return ["data-target"];
  }

  constructor() {
    /**
     * @param {string} name
     */
    const attributeChangedCallback = name => {
      switch (name) {
        case my.observedAttributes[0]: //"data-target":
          _contentChanged();

          break;
      }
    };

    const _contentChanged = () => {
      if (this.UserTemplate && this.shadowRoot && this.HTMLTemplateString) {
        this.shadowRoot.innerHTML = this.HTMLTemplateString;

        const ul = /** @type {HTMLElement} */ (
          this.shadowRoot.querySelector("p")
        );
        const dom = /** @type {DocumentFragment} */ (
          this.UserTemplate.cloneNode(true)
        );

        ul.appendChild(dom);
      }

      const target = document.querySelector(
        this.dataset.target || ":scope > body"
      );
      if (!target)
        throw new Error(`Can't find data-target - ${this.dataset.target}`);

      //Move itself to the target
      if (target.firstElementChild !== this) target.prepend(this);
    };

    super({
      shadow: true,
      css,
      html,
      connectedCallback: _contentChanged,
      templateChangedCallback: _contentChanged,
      attributeChangedCallback
    });
  }
}

//@ts-check


//comment out any elements you are not using
//Definition order matters!!!  Code will run in this order

const my_bundle = [my];

for (const c of my_bundle) {
  //sync "for", to ensure define order
  window.customElements.define(c.tagName, c);
}
