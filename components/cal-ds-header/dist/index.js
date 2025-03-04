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

var css = ":host{--banner-light:#d5dbde;--banner-dark:#001323;--action-secondary:#fae2ad;--navigation-submenu-dark:#6d6d6d;--navigation-submenu-light:#dbdbdb;--text-dark:#323232;--text-light:#fff;--rounded-buttons:50px;--space-unit-1:0.5rem;--space-unit-x2:calc(0.5rem * 2);--space-unit-x4:calc(0.5rem * 4);--font-family:noto sans;--font-size-base:1rem;--font-weight-base:400;--line-height-base:1rem;--ratio:1.24;--font-size-base-plus-viewport-adjustment:calc( var(--font-size-base) + 0.2vw );--p-font-size:calc( var(--font-size-base-plus-viewport-adjustment) * var(--ratio) );--search-icon-light:url(\"data:image/svg+xml;charset=UTF-8,%3Csvg viewBox='0 0 16.5 16.7' fill='%23FFFFFF' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M16.2,15l-4-4c2-2.6,1.8-6.4-0.6-8.8c-1.3-1.3-3-2-4.7-2s-3.4,0.6-4.7,2c-2.6,2.6-2.6,6.9,0,9.5 c1.3,1.3,3,2,4.7,2c1.4,0,2.9-0.4,4-1.4l4,4c0.2,0.2,0.4,0.3,0.6,0.3c0.2,0,0.5-0.1,0.6-0.3C16.5,16,16.5,15.4,16.2,15L16.2,15z M6.8,11.9c-1.3,0-2.5-0.5-3.5-1.4c-1.9-1.9-1.9-5,0-6.9c0.9-0.9,2.1-1.4,3.5-1.4s2.5,0.5,3.5,1.4c0.9,0.9,1.4,2.1,1.4,3.5 s-0.5,2.5-1.4,3.5C9.4,11.4,8.1,11.9,6.8,11.9z'%3E%3C/path%3E%3C/svg%3E\");--search-icon-dark:url(\"data:image/svg+xml;charset=UTF-8,%3Csvg viewBox='0 0 16.5 16.7' fill='%23323232' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M16.2,15l-4-4c2-2.6,1.8-6.4-0.6-8.8c-1.3-1.3-3-2-4.7-2s-3.4,0.6-4.7,2c-2.6,2.6-2.6,6.9,0,9.5 c1.3,1.3,3,2,4.7,2c1.4,0,2.9-0.4,4-1.4l4,4c0.2,0.2,0.4,0.3,0.6,0.3c0.2,0,0.5-0.1,0.6-0.3C16.5,16,16.5,15.4,16.2,15L16.2,15z M6.8,11.9c-1.3,0-2.5-0.5-3.5-1.4c-1.9-1.9-1.9-5,0-6.9c0.9-0.9,2.1-1.4,3.5-1.4s2.5,0.5,3.5,1.4c0.9,0.9,1.4,2.1,1.4,3.5 s-0.5,2.5-1.4,3.5C9.4,11.4,8.1,11.9,6.8,11.9z'%3E%3C/path%3E%3C/svg%3E\");--cagov-icon-light:url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"28\" height=\"32\" viewBox=\"0 0 28 32\" fill=\"none\"><path d=\"M25.9068 27.9804L23.6088 25.2227C21.4918 26.9887 18.7676 28.0513 15.7951 28.0513C9.05442 28.0513 3.58999 22.5869 3.58999 15.8462C3.58999 9.10544 9.05442 3.64101 15.7951 3.64101C18.7676 3.64101 21.4918 4.70357 23.6088 6.46957L25.9068 3.7119C23.1672 1.4264 19.6416 0.0512695 15.7949 0.0512695C7.07161 0.0512695 0 7.12288 0 15.8462C0 24.5694 7.07161 31.6411 15.7949 31.6411C19.6416 31.6411 23.1672 30.2659 25.9068 27.9804Z\" fill=\"%23FFFFFF\"/><path d=\"M27.0018 20.6891C27.6442 19.2044 28.0003 17.5669 28.0003 15.8462C28.0003 12.8516 26.9219 10.1089 25.1322 7.98535C25.1102 7.98774 25.0878 7.99004 25.0654 7.99233C24.9549 8.00367 24.8438 8.01506 24.7741 8.03858C23.6497 8.42009 22.7564 9.46828 22.1607 10.1673C21.911 10.4602 21.7136 10.6918 21.5734 10.7873C21.5153 10.5665 20.8208 9.60004 19.5272 9.60004C18.9542 9.60004 18.5465 9.80828 18.2362 10.1673C17.7336 10.7488 17.5758 11.5887 17.5901 12.0411C17.5971 12.2651 16.3279 12.9568 16.2381 13.0707C16.1043 13.2544 15.8683 13.5276 15.5939 13.8452C15.0382 14.4885 14.325 15.3141 13.9842 15.9483C13.8734 16.1544 13.8865 16.5365 13.8994 16.9116C13.9109 17.2464 13.9222 17.5757 13.8451 17.7696C13.5625 18.4793 12.4875 19.536 11.685 20.3248C11.2274 20.7747 10.8584 21.1375 10.7755 21.299C10.6305 21.6844 13.158 23.8038 14.2262 24.0901C15.2811 24.0901 17.1979 23.768 18.4504 23.5575C18.9431 23.4747 19.333 23.4092 19.5272 23.3874C19.6656 23.3841 19.8741 23.4469 20.1427 23.5278C20.6981 23.6951 21.5106 23.9398 22.4919 23.8382C23.632 23.6016 24.1877 22.8617 24.6953 22.1857C25.043 21.7228 25.3681 21.2899 25.843 21.069C26.1903 20.9073 26.5956 20.7709 27.0018 20.6891Z\" fill=\"%23FFFFFF\"/><path d=\"M10.2865 15.0564C9.79093 14.6829 8.78834 13.9228 8.77314 13.911C8.57755 13.7599 8.57841 13.7611 8.38426 13.9101C7.90247 14.2806 6.90332 15.0561 6.86489 15.0434C6.86489 14.9026 7.27241 13.5727 7.43845 13.0423C7.47115 12.9382 7.43559 12.9018 7.37221 12.8536C6.85342 12.4576 5.78974 11.6387 5.74414 11.5947C5.99852 11.5947 7.33579 11.5628 7.78431 11.5707C7.84482 11.5719 7.89071 11.5677 7.91308 11.4927C8.11641 10.8146 8.3226 10.1373 8.5288 9.45642C8.59161 9.49131 9.01461 10.8428 9.19815 11.4605C9.23085 11.571 9.28275 11.5707 9.36104 11.5707C10.0198 11.5698 10.6782 11.5701 11.3441 11.5701C11.3232 11.6663 9.83223 12.7877 9.74619 12.8533C9.67134 12.9103 9.66589 12.9461 9.69285 13.0326C9.87897 13.634 10.3157 14.9593 10.2862 15.0561L10.2865 15.0564Z\" fill=\"%23FFFFFF\"/></svg>');--cagov-icon-dark:url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"28\" height=\"32\" viewBox=\"0 0 28 32\" fill=\"none\"><path d=\"M25.9068 27.9804L23.6088 25.2227C21.4918 26.9887 18.7676 28.0513 15.7951 28.0513C9.05442 28.0513 3.58999 22.5869 3.58999 15.8462C3.58999 9.10544 9.05442 3.64101 15.7951 3.64101C18.7676 3.64101 21.4918 4.70357 23.6088 6.46957L25.9068 3.7119C23.1672 1.4264 19.6416 0.0512695 15.7949 0.0512695C7.07161 0.0512695 0 7.12288 0 15.8462C0 24.5694 7.07161 31.6411 15.7949 31.6411C19.6416 31.6411 23.1672 30.2659 25.9068 27.9804Z\" fill=\"%2313394B\"/><path d=\"M27.0018 20.6891C27.6442 19.2044 28.0003 17.5669 28.0003 15.8462C28.0003 12.8516 26.9219 10.1089 25.1322 7.98535C25.1102 7.98774 25.0878 7.99004 25.0654 7.99233C24.9549 8.00367 24.8438 8.01506 24.7741 8.03858C23.6497 8.42009 22.7564 9.46828 22.1607 10.1673C21.911 10.4602 21.7136 10.6918 21.5734 10.7873C21.5153 10.5665 20.8208 9.60004 19.5272 9.60004C18.9542 9.60004 18.5465 9.80828 18.2362 10.1673C17.7336 10.7488 17.5758 11.5887 17.5901 12.0411C17.5971 12.2651 16.3279 12.9568 16.2381 13.0707C16.1043 13.2544 15.8683 13.5276 15.5939 13.8452C15.0382 14.4885 14.325 15.3141 13.9842 15.9483C13.8734 16.1544 13.8865 16.5365 13.8994 16.9116C13.9109 17.2464 13.9222 17.5757 13.8451 17.7696C13.5625 18.4793 12.4875 19.536 11.685 20.3248C11.2274 20.7747 10.8584 21.1375 10.7755 21.299C10.6305 21.6844 13.158 23.8038 14.2262 24.0901C15.2811 24.0901 17.1979 23.768 18.4504 23.5575C18.9431 23.4747 19.333 23.4092 19.5272 23.3874C19.6656 23.3841 19.8741 23.4469 20.1427 23.5278C20.6981 23.6951 21.5106 23.9398 22.4919 23.8382C23.632 23.6016 24.1877 22.8617 24.6953 22.1857C25.043 21.7228 25.3681 21.2899 25.843 21.069C26.1903 20.9073 26.5956 20.7709 27.0018 20.6891Z\" fill=\"%2313394B\"/><path d=\"M10.2865 15.0564C9.79093 14.6829 8.78834 13.9228 8.77314 13.911C8.57755 13.7599 8.57841 13.7611 8.38426 13.9101C7.90247 14.2806 6.90332 15.0561 6.86489 15.0434C6.86489 14.9026 7.27241 13.5727 7.43845 13.0423C7.47115 12.9382 7.43559 12.9018 7.37221 12.8536C6.85342 12.4576 5.78974 11.6387 5.74414 11.5947C5.99852 11.5947 7.33579 11.5628 7.78431 11.5707C7.84482 11.5719 7.89071 11.5677 7.91308 11.4927C8.11641 10.8146 8.3226 10.1373 8.5288 9.45642C8.59161 9.49131 9.01461 10.8428 9.19815 11.4605C9.23085 11.571 9.28275 11.5707 9.36104 11.5707C10.0198 11.5698 10.6782 11.5701 11.3441 11.5701C11.3232 11.6663 9.83223 12.7877 9.74619 12.8533C9.67134 12.9103 9.66589 12.9461 9.69285 13.0326C9.87897 13.634 10.3157 14.9593 10.2862 15.0561L10.2865 15.0564Z\" fill=\"%2313394B\"/></svg>');--login-icon-light:url(\"data:image/svg+xml;charset=UTF-8,%3Csvg viewBox='0 0 32 32' fill='%23FFFFFF' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M16,0.4c-8.7,0-15.7,7-15.7,15.7s7,15.7,15.7,15.7s15.7-7,15.7-15.7S24.7,0.4,16,0.4z M16,4 c2.9,0,5.6,2.6,5.6,5.6c0,3-2.6,5.7-5.6,5.6c-2.9,0-5.6-2.6-5.6-5.6C10.4,6.6,13,4,16,4z M16,17.2c4.8,0,9.3,4.5,9.4,10.9 c-2.6,2-5.9,3.3-9.4,3.3c-3.5,0-6.7-1.2-9.3-3.2C6.8,21.7,11.2,17.2,16,17.2z'%3E%3C/path%3E%3C/svg%3E\");--login-icon-dark:url(\"data:image/svg+xml;charset=UTF-8,%3Csvg viewBox='0 0 32 32' fill='%2313394B' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M16,0.4c-8.7,0-15.7,7-15.7,15.7s7,15.7,15.7,15.7s15.7-7,15.7-15.7S24.7,0.4,16,0.4z M16,4 c2.9,0,5.6,2.6,5.6,5.6c0,3-2.6,5.7-5.6,5.6c-2.9,0-5.6-2.6-5.6-5.6C10.4,6.6,13,4,16,4z M16,17.2c4.8,0,9.3,4.5,9.4,10.9 c-2.6,2-5.9,3.3-9.4,3.3c-3.5,0-6.7-1.2-9.3-3.2C6.8,21.7,11.2,17.2,16,17.2z'%3E%3C/path%3E%3C/svg%3E\");--search-submit-dark:url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='25px' height='16px' viewBox='0 0 25 16'><path style='fill:%2309202B;' d='M24.5,7.3l-6.4-6.4c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4L21.4,7H0.1v2h21.3l-4.7,4.7c-0.4,0.4-0.4,1,0,1.4s1,0.4,1.4,0l6.4-6.4C24.9,8.3,24.9,7.7,24.5,7.3z'/></svg>\");--search-submit-light:url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='25px' height='16px' viewBox='0 0 25 16'><path style='fill:%23DBDBDB;' d='M24.5,7.3l-6.4-6.4c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4L21.4,7H0.1v2h21.3l-4.7,4.7c-0.4,0.4-0.4,1,0,1.4s1,0.4,1.4,0l6.4-6.4C24.9,8.3,24.9,7.7,24.5,7.3z'/></svg>\");--search-input-clear-dark:url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='16px' height='16px' viewBox='0 0 16 16'><path style='fill:%23323232;' d='M9.3,8L9.3,8L8.9,7.5l5.8-5.8c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0L7.9,5.7l0,0L7.4,6.1L1.7,0.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l5.3,5.3l0,0L6,7.5l-5.8,5.8c-0.4,0.4-0.4,1,0,1.4s1,0.4,1.4,0L7,9.4l0,0L7.4,9l5.8,5.8c0.4,0.4,1,0.4,1.4,0s0.4-1,0-1.4L9.3,8z'/></svg>\");--search-input-clear-light:url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='16px' height='16px' viewBox='0 0 16 16'><path style='fill:%23DBDBDB;' d='M9.3,8L9.3,8L8.9,7.5l5.8-5.8c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0L7.9,5.7l0,0L7.4,6.1L1.7,0.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l5.3,5.3l0,0L6,7.5l-5.8,5.8c-0.4,0.4-0.4,1,0,1.4s1,0.4,1.4,0L7,9.4l0,0L7.4,9l5.8,5.8c0.4,0.4,1,0.4,1.4,0s0.4-1,0-1.4L9.3,8z'/></svg>\");--horizontal-rule-light:linear-gradient( 90deg,var(--banner-light) 10.5%,#6d6d6d 45%,var(--banner-light) 95.5% );--horizontal-rule-dark:linear-gradient( 90deg,var(--banner-dark) 10.5%,#999 45%,var(--banner-dark) 95.5% );--action-secondary-hover-light:linear-gradient(4deg,#fff -98.02%,#999);--action-secondary-hover-dark:linear-gradient( 4deg,#fff -98.02%,rgb(0 81 148) 33.09% );}@media (prefers-color-scheme:light){:host(:not([data-brightness-mode=\"dark\"])){--search-icon:var(--search-icon-dark);--cagov-icon:var(--cagov-icon-dark);--login-icon:var(--login-icon-dark);--header-bg:var(--banner-light);--hamburger-bg:#000;--header-link-color:#000;--search-border-color:var(--navigation-submenu-dark);--search-placeholder-color:var(--navigation-submenu-dark);--search-input-color:#000;--search-submit-button-color:var(--navigation-submenu-dark);--search-input-outline:#000;--search-submit-icon:var(--search-submit-light);--search-input-clear-icon:var(--search-input-clear-dark);--horizontal-rule:var(--horizontal-rule-light);--action-secondary-hover:var(--action-secondary-hover-light);--current-page-background:#999;}}:host([data-brightness-mode=\"light\"]){--search-icon:var(--search-icon-dark);--cagov-icon:var(--cagov-icon-dark);--login-icon:var(--login-icon-dark);--header-bg:var(--banner-light);--hamburger-bg:#000;--header-link-color:#000;--search-border-color:var(--navigation-submenu-dark);--search-placeholder-color:var(--navigation-submenu-dark);--search-input-color:#000;--search-submit-button-color:var(--navigation-submenu-dark);--search-input-outline:#000;--search-submit-icon:var(--search-submit-light);--search-input-clear-icon:var(--search-input-clear-dark);--horizontal-rule:var(--horizontal-rule-light);--action-secondary-hover:var(--action-secondary-hover-light);--current-page-background:#999;}@media (prefers-color-scheme:dark){:host(:not([data-brightness-mode=\"light\"])){--search-icon:var(--search-icon-light);--cagov-icon:var(--cagov-icon-light);--login-icon:var(--login-icon-light);--header-bg:var(--banner-dark);--hamburger-bg:#fff;--header-link-color:#fff;--search-border-color:var(--navigation-submenu-light);--search-placeholder-color:var(--navigation-submenu-light);--search-input-color:#fff;--search-submit-button-color:var(--navigation-submenu-light);--search-input-outline:#fff;--search-submit-icon:var(--search-submit-dark);--search-input-clear-icon:var(--search-input-clear-light);--horizontal-rule:var(--horizontal-rule-dark);--action-secondary-hover:var(--action-secondary-hover-dark);--current-page-background:#002747;}}:host([data-brightness-mode=\"dark\"]){--search-icon:var(--search-icon-light);--cagov-icon:var(--cagov-icon-light);--login-icon:var(--login-icon-light);--header-bg:var(--banner-dark);--hamburger-bg:#fff;--header-link-color:#fff;--search-border-color:var(--navigation-submenu-light);--search-placeholder-color:var(--navigation-submenu-light);--search-input-color:#fff;--search-submit-button-color:var(--navigation-submenu-light);--search-input-outline:#fff;--search-submit-icon:var(--search-submit-dark);--search-input-clear-icon:var(--search-input-clear-light);--horizontal-rule:var(--horizontal-rule-dark);--action-secondary-hover:var(--action-secondary-hover-dark);--current-page-background:#002747;}span.visually-hidden{position:absolute!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;width:1px!important;height:1px!important;margin:-1px!important;padding:0!important;white-space:nowrap!important;border:0!important;}header{font-family:var(--font-family),system-ui,-apple-system,\"Roboto\",\"Helvetica Neue\",sans-serif;font-size:clamp(1rem,var(--p-font-size),5rem);letter-spacing:0.02rem;font-weight:var(--font-weight-base);line-height:var(--line-height-base);position:relative;top:0;z-index:100;a{color:var(--header-link-color);}@media (min-width:1080px){position:sticky;}> div.horizontal-rule{background:var(--horizontal-rule);height:0.125rem;}> nav.desktop-nav-menu{background-color:var(--header-bg);display:flex;@media (max-width:1079px){display:none;}ul{list-style:none;}a{display:block;color:var(--header-link-color);text-decoration:none;padding:1rem;font-size:1rem;&:hover{background-image:var(--action-secondary-hover);}&:focus{background:var(--action-secondary-hover);border:-2px solid #fff;}&[aria-current=\"page\"]{background:var(--current-page-background);box-shadow:2px 2px 4px 0 rgb(0 0 0 / 40%) inset;}}> ul{display:flex;margin:0;padding:0;&.desktop-nav-menu-main{padding-left:13.6rem;}&.desktop-nav-menu-utility{margin-left:auto;}}}> div.site-header{background-color:var(--header-bg);> div.site-header-container{margin:0 auto;padding:0 var(--space-unit-x2);display:flex;align-items:center;gap:var(--space-unit-x4);overflow:visible;> nav.mobile-nav-menu{display:flex;border:none;padding:0;margin:0;color:var(--header-link-color);> a.main-navigation-cancel,> a#mobile-menu-button{padding:1rem;width:24px;height:24px;}> a.main-navigation-cancel{position:absolute;display:none;}> a#mobile-menu-button{> div.hamburger{height:4px;position:relative;&,&::before,&::after{width:100%;background-color:var(--hamburger-bg);border-radius:5px;}&::before,&::after{content:\"\";position:absolute;left:0;height:100%;transition:all 200ms ease;}&::before{transform:translateY(-7px);}&::after{transform:translateY(7px);}}}> ul#mobile-menu{background-color:var(--header-bg);border:#000 solid 1px;margin:0;position:absolute;top:100%;left:0;padding:0;display:none;> li{> a{padding:1rem;text-decoration:none;display:block;&:focus{background-image:var(--action-secondary-hover);border:-2px solid #fff;}}}}&:focus-within{> ul#mobile-menu{display:block;}> a#mobile-menu-button{pointer-events:none;> div.hamburger{transform:rotate(45deg);&::before,&::after{transform:rotate(90deg) translateX(0);}}}> a.main-navigation-cancel{display:block;&:focus{display:none;}}}@media (min-width:1080px){display:none;}}> a.site-logo{display:flex;align-items:flex-start;gap:var(--space-unit-x4);text-decoration:none;> img.logo-image{max-width:100%;min-height:auto;height:clamp(4.5rem,1.9286rem + 3.8095vw,6.5rem);object-fit:contain;transform:translateY(var(--space-unit-x2));display:none;@media (min-width:1080px){display:block;}&.no-overflow{transform:translateY(0);padding:var(--space-unit-1) 0;}}> div.site-branding-text{padding:var(--space-unit-x2) 0;> span{display:block;letter-spacing:1px;&.state{font-size:clamp(1.5rem,1.5625rem,1.75rem);font-weight:600;margin-top:clamp(0rem,-1.2857rem + 1.9048vw,1rem);}&.department{font-size:clamp(1rem,1.125rem,1.25rem);font-weight:300;margin-top:clamp(0.5rem,-0.4643rem + 1.4286vw,1.25rem);}}}}> div.site-header-utility{margin-left:auto;display:flex;align-items:flex-end;gap:calc(var(--space-unit-x2) / 1.5);@media (min-width:1080px){gap:var(--space-unit-x4);}> div.search-container-desktop{border:1px solid var(--search-border-color);border-radius:var(--rounded-buttons);display:none;@media (min-width:1080px){display:block;}> form{display:flex;position:relative;> input#site-search{outline:2px solid var(--search-input-outline);outline-offset:-4px;border-radius:var(--rounded-buttons) 0 0 var(--rounded-buttons);border:0;width:clamp(10rem,-6.7143rem + 24.7619vw,23rem);height:var(--space-unit-x4);padding-left:calc(var(--space-unit-x2) * 3);padding-right:var(--space-unit-1);background:transparent;color:var(--search-input-color);transition:opacity 300ms ease,width 300ms ease,padding 300ms ease;&:autofill{box-shadow:0 0 0 1000px var(--header-bg) inset;-webkit-text-fill-color:var(--search-input-color);}&::placeholder{color:var(--search-placeholder-color);}&::-webkit-search-cancel-button{-webkit-appearance:none;height:var(--space-unit-x2);width:var(--space-unit-x2);background:transparent var(--search-input-clear-icon) no-repeat;}}> label.search-toggle{border:none;border-radius:var(--rounded-buttons);position:absolute;height:var(--space-unit-x4);width:var(--space-unit-x4);background:transparent var(--search-icon) no-repeat center / 1.125rem;top:0;left:0;pointer-events:none;}> button.search-submit{padding:0 1.5rem;border:none;border-radius:0 var(--rounded-buttons) var(--rounded-buttons) 0;background:var(--search-submit-button-color) var(--search-submit-icon) no-repeat center / 1.125rem;cursor:pointer;}&:not(:focus-within){> input#site-search{outline:none;padding:0;opacity:0;width:var(--space-unit-x4);cursor:pointer;border-radius:var(--rounded-buttons);&:autofill{-webkit-text-fill-color:var(--header-bg);}&::-webkit-search-cancel-button{display:none;}}> button.search-submit{display:none;}}&:has(> input#site-search:placeholder-shown) > button.search-submit:not([tabindex]){display:none;}&:not(:has(> input#site-search:placeholder-shown)) > button.search-submit[tabindex]{display:none;}}}> a.login-button{background:var(--login-icon) no-repeat center / 2rem;padding:var(--space-unit-x2);display:block;> span.login-text{position:absolute;overflow:hidden;clip:rect(0,0,0,0);width:1px;height:1px;margin:-1px;@media (min-width:1080px){position:relative;overflow:visible;clip:unset;width:unset;height:unset;margin:unset;}}@media (min-width:1080px){background:var(--action-secondary);border-radius:var(--rounded-buttons);padding:var(--space-unit-1) calc(var(--space-unit-1) + (30 * ((100vw - 48rem) / 1200)));text-decoration:none;color:var(--text-dark);font-size:1.125rem;&:hover,&:focus{color:#000;background:var(--action-secondary-hover);border:2px solid #fff;box-shadow:0 4px 4px 0 rgb(0 0 0 / 25%);}}}> a#cagov-toggle{background:transparent var(--cagov-icon) no-repeat center;background-size:clamp(2rem,0.7143rem + 1.9048vw,3rem) clamp(2rem,0.7143rem + 1.9048vw,3rem);height:clamp(2rem,0.7143rem + 1.9048vw,3rem);width:clamp(2rem,0.7143rem + 1.9048vw,3rem);margin-inline-start:clamp(0rem,-11.5714rem + 17.1429vw,9rem);}}}}}";

var html = "<header role=\"banner\"> <!-- Add class \"theme-light\" to use light header version --> <slot name=\"slot1\"></slot> <div class=\"site-header\"> <slot name=\"slot2\"></slot> <div class=\"site-header-container\"> <slot name=\"slot3\"></slot> <nav class=\"mobile-nav-menu\" role=\"navigation\"> <a id=\"mobile-menu-button\" href=\"#\" tabindex=\"0\" role=\"button\" aria-haspopup=\"true\" aria-controls=\"mobile-menu\"> <div class=\"hamburger\"></div> <span class=\"visually-hidden\">Mobile menu</span> </a> <a href=\"#\" tabindex=\"-1\" class=\"main-navigation-cancel\" role=\"button\" aria-label=\"Close menu\"></a> <ul role=\"menu\" id=\"mobile-menu\" aria-labelledby=\"mobile-menu-button\"> <template> <li role=\"presentation\"> <a role=\"menuitem\" tabindex=\"0\"></a> </li> </template> </ul> </nav> <a href=\"index.html\" class=\"site-logo\"> <!-- add class \"no-overflow\" to remove image's bottom overflow--> <img src=\"https://cdn.cdt.ca.gov/cdt/CAWeb/site-logo-circle.svg\" alt=\"Eureka Design System logo\" class=\"logo-image\"> <div class=\"site-branding-text\"> <span class=\"state\">California default</span> <span class=\"department\">Department Website default</span> </div> </a> <slot name=\"slot4\"></slot> <div class=\"site-header-utility\"> <slot name=\"slot5\"></slot> <div class=\"search-container-desktop\"> <slot name=\"slot6\"></slot> <form autocomplete=\"on\"> <label class=\"search-toggle\" for=\"site-search\"><span class=\"visually-hidden\">Search this site</span></label> <input id=\"site-search\" type=\"search\" name=\"q\" placeholder=\"Search...\" tabindex=\"0\" required> <button type=\"submit\" class=\"search-submit\" tabindex=\"-1\" aria-hidden=\"true\"></button> <button type=\"submit\" class=\"search-submit\" aria-label=\"Submit search\"></button> </form> <slot name=\"slot7\"></slot> </div> <slot name=\"slot8\"></slot> <a href=\"#\" class=\"login-button\"><span class=\"login-text\">Login</span></a> <slot name=\"slot9\"></slot> <a id=\"cagov-toggle\" href=\"https://www.ca.gov/\"> <span class=\"visually-hidden\">ca.gov link</span> </a> <slot name=\"slot10\"></slot> </div> <slot name=\"slot11\"></slot> </div> <slot name=\"slot12\"></slot> </div> <div class=\"horizontal-rule\"></div> <nav class=\"desktop-nav-menu\" role=\"navigation\"> <ul class=\"desktop-nav-menu-main\" role=\"menu\" aria-label=\"Desktop Menu\"> <template> <li role=\"presentation\"> <a role=\"menuitem\"></a> </li> </template> </ul> <ul class=\"desktop-nav-menu-utility\" role=\"menu\" aria-label=\"Utility Menu\"> <template> <li role=\"presentation\"> <a role=\"menuitem\"></a> </li> </template> </ul> </nav> <slot name=\"slot13\"></slot> </header> ";

// from
// https://www.cssscript.com/create-a-multi-level-drop-down-menu-with-pure-css/


class my extends cal_ds_base {
  /** @override */
  static get tagName() {
    return "cal-ds-header";
  }

  /**
   * @protected
   * @override
   */
  static get observedAttributes() {
    return ["data-logo-overflow", "data-apps-link-style"];
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
        }
      };

      const getLi = (
        /** @type {Element} */ myTag,
        /** @type {HTMLTemplateElement} */ myTemplate
      ) => {
        if (myTag.tagName === "A") {
          const newLi = /** @type {HTMLElement} */ (
            myTemplate.content.cloneNode(true)
          );

          /** @type {HTMLAnchorElement} */
          const aTag = _querySelectorRequre(newLi, "a");

          _updateElement(aTag, myTag);

          setIfCurrent(aTag);

          return newLi;
        } else {
          return document.createElement("li");
        }
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

      /** @type {HTMLTemplateElement} */
      const templateMobile = _querySelectorRequre(
        target_mobile_nav_ul,
        "template"
      );
      /** @type {HTMLTemplateElement} */
      const templateDesktopMain = _querySelectorRequre(
        target_desktop_nav_ul_main,
        "template"
      );

      //Removing templates once found.  Not needed for output markup
      templateMobile.remove();
      templateDesktopMain.remove();

      [...source_navs[0].children].forEach(n => {
        target_mobile_nav_ul.appendChild(getLi(n, templateMobile));
        target_desktop_nav_ul_main.appendChild(getLi(n, templateDesktopMain));
      });

      const source_nav_utility =
        source_navs.length > 1 ? source_navs[1] : undefined;

      if (source_nav_utility) {
        /** @type {HTMLTemplateElement} */
        const templateDesktopUtility = _querySelectorRequre(
          target_desktop_nav_ul_utility,
          "template"
        );
        templateDesktopUtility.remove();
        [...source_nav_utility.children].forEach(n => {
          target_mobile_nav_ul.appendChild(getLi(n, templateMobile));
          target_desktop_nav_ul_utility.appendChild(
            getLi(n, templateDesktopUtility)
          );
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
     * @protected
     */
    const _attributeChangedCallback = () => {
      //switch (_name) {
      //  case my.observedAttributes[0]: //"data-logo-overflow";
      //  case my.observedAttributes[1]: //"data-apps-link-style";
      _contentChanged();

      //    break;
      //}
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

        // ca-gov menu
        // data-apps-link-style="none"
        if (this.dataset.appsLinkStyle?.toLowerCase() === "none") {
          /** @type {HTMLAnchorElement} */ (
            target.querySelector("#cagov-toggle")
          ).remove();
        }

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

//@ts-check


//comment out any elements you are not using
//Definition order matters!!!  Code will run in this order

const my_bundle = [my];

for (const c of my_bundle) {
  //sync "for", to ensure define order
  window.customElements.define(c.tagName, c);
}
