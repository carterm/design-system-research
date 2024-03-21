var CssBaseStyleString = ":host {\n  font-family:\n    system-ui,\n    -apple-system,\n    \"Segoe UI\",\n    Roboto,\n    \"Helvetica Neue\",\n    \"Noto Sans\",\n    \"Liberation Sans\",\n    Arial,\n    sans-serif;\n\n  --gray-50: #f66; /* #fafafa; */\n  --gray-100: #fa0; /* #f3f3f4; */\n  --gray-200: #ff0; /* #d4d4d7; */\n}\n";

//@ts-check


/**
 * Options for ca-eureka components
 * @typedef {object} cal_ds_options
 * @property {boolean} [shadow] - Create a shadow DOM?
 * @property {string} [css] - CSS to apply to component
 * @property {string} [html] - HTML to apply to component (Event configurable)
 * @property {() => void} [connectedCallback]
 * @property {(name:string,oldValue:string,newValue:string) => void} [attributeChangedCallback]
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

var css = ":host > nav > ul {\n  display: flex;\n  list-style: none;\n\n  & > li > a {\n    font-size: xx-large;\n    padding: 1rem;\n    text-decoration: none;\n\n    &[aria-current=\"page\"] {\n      font-weight: 900;\n      pointer-events: none;\n    }\n\n    &:hover {\n      background-color: #fafafa;\n    }\n  }\n}\n";

var html = "<nav role=\"navigation\"> <ul role=\"menubar\"></ul> </nav> ";

// from
// https://www.cssscript.com/create-a-multi-level-drop-down-menu-with-pure-css/


class index extends cal_ds_base {
  /** @override */
  static get tagName() {
    return "cal-ds-nav";
  }

  constructor() {
    const _contentChanged = () => {
      const myTemplate = this.querySelector("template");

      if (myTemplate && this.shadowRoot) {
        this.shadowRoot.innerHTML = html;

        const dom = /** @type {DocumentFragment} */ (
          myTemplate.content.cloneNode(true)
        );

        const ul = /** @type {HTMLElement} */ (
          this.shadowRoot.querySelector("ul")
        );
        ul.appendChild(dom);

        const anchors = ul.querySelectorAll("a");

        anchors.forEach(a => {
          const li = document.createElement("li");

          a.parentElement?.appendChild(li);
          li.appendChild(a);

          const validUrl = (/** @type {string} */ href) => {
            try {
              return new URL(a.href, window.location.origin).href;
            } catch (e) {
              return href;
            }
          };

          if (validUrl(a.href) === window.location.href) {
            a.ariaCurrent = "page";
            a.tabIndex = -1;
          } else {
            a.role = "menuitem";
          }
        });
      }
    };

    super({ shadow: true, css, connectedCallback: _contentChanged });

    const myTemplate = this.querySelector("template");
    if (myTemplate) {
      // Callback function to execute when mutations are observed
      // eslint-disable-next-line jsdoc/no-undefined-types
      /** @type {MutationCallback} */
      const mutationCallback = mutationsList =>
        mutationsList.forEach(_contentChanged);

      // Create an observer instance linked to the callback function
      const observer = new MutationObserver(mutationCallback);

      // Start observing the target node for configured mutations
      observer.observe(myTemplate.content, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  }
}

export { index as default };
