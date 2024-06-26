//@ts-check
import cal_ds_base from "../_cal-ds-base/src/index";

// @ts-ignore
import css from "./styles.css";

// @ts-ignore
import html from "./template.html";

export default class my extends cal_ds_base {
  /** @override */
  static get tagName() {
    return "cal-ds-accordion";
  }

  /**
   * @protected
   * @override
   */
  static get observedAttributes() {
    return ["data-expanded"];
  }

  /**
   * Updates the css vars to match the size of the control
   * @param {HTMLDetailsElement} detail
   * @private
   */
  static _setSizes = detail => {
    /**
     * @param {string} prop
     * @param {number} value
     */
    const setOnlyIfChanged = (prop, value) => {
      const oldValue = Number(
        detail.style.getPropertyValue(prop).replace("px", "")
      );

      if (value !== oldValue) {
        detail.style.setProperty(prop, `${value}px`);
      }
    };

    const summary_Height = /** @type {HTMLElement} */ (
      detail.querySelector(":scope > summary")
    ).clientHeight;
    setOnlyIfChanged("--collapsed", summary_Height);

    if (detail.open) {
      const allKids_Height = [...detail.querySelectorAll(":scope > *")]
        .map(x => /** @type {HTMLElement} */ (x).offsetHeight)
        .reduce((a, b) => a + b, 0);
      setOnlyIfChanged("--expanded", allKids_Height);
    }
  };

  /**
   * A single static observer for all accordions on the page
   * @type {ResizeObserver}
   * @private
   */
  static _resizeObserver;

  /**
   * The observer for all accordion control details resizing
   * @param {HTMLDetailsElement} target
   * @private
   */
  static _observeResize(target) {
    if (!my._resizeObserver) {
      // This declaration will only happen once for all controls
      my._resizeObserver = new ResizeObserver(entries =>
        entries.forEach(entry =>
          my._setSizes(/** @type {HTMLDetailsElement} */ (entry.target))
        )
      );
    }
    my._resizeObserver.observe(target);
  }

  /** @private */
  get _details() {
    return /** @type {HTMLDetailsElement} */ (
      this.shadowRoot?.querySelector("details")
    );
  }

  constructor() {
    const connectedCallback = () =>
      window.setTimeout(() => {
        my._setSizes(detail);

        _setOpenToMatchProperty();

        detail.addEventListener("toggle", () => {
          this.dataset.expanded = detail.open.toString();
        });

        _connectedCallbackCalled = true;
      });

    const attributeChangedCallback = () => {
      // for data-expanded
      if (_connectedCallbackCalled) _setOpenToMatchProperty();
    };

    super({
      shadow: true,
      css,
      html,
      attributeChangedCallback,
      connectedCallback
    });

    const _setOpenToMatchProperty = () => {
      const shouldBeOpen =
        (this.dataset.expanded ?? "false").trim().toLowerCase() !== "false";

      if (detail.open !== shouldBeOpen) detail.open = shouldBeOpen;
    };

    const detail = this._details;
    let _connectedCallbackCalled = false;

    my._observeResize(detail);
  }
}
