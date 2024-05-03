// from
// https://www.cssscript.com/create-a-multi-level-drop-down-menu-with-pure-css/

//@ts-check
import cal_ds_base from "../../_cal-ds-base/index";

// @ts-ignore
import css from "./styles.css";

// @ts-ignore
import html from "./template.html";

export default class extends cal_ds_base {
  /** @override */
  static get tagName() {
    return "cal-ds-nav";
  }

  constructor() {
    const _contentChanged = () => {
      if (this.UserTemplate && this.shadowRoot) {
        this.shadowRoot.innerHTML = html;

        const dom = /** @type {DocumentFragment} */ (
          this.UserTemplate.cloneNode(true)
        );

        const ul = /** @type {HTMLElement} */ (
          this.shadowRoot.querySelector("ul")
        );
        ul.appendChild(dom);

        const anchors = ul.querySelectorAll("a");

        anchors.forEach(a => {
          const li = document.createElement("li");
          li.role = "menuitem";

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
          }
        });
      }
    };

    super({ shadow: true, css, connectedCallback: _contentChanged });

    if (this.UserTemplate) {
      // Callback function to execute when mutations are observed
      // eslint-disable-next-line jsdoc/no-undefined-types
      /** @type {MutationCallback} */
      const mutationCallback = mutationsList =>
        mutationsList.forEach(_contentChanged);

      // Create an observer instance linked to the callback function
      const observer = new MutationObserver(mutationCallback);

      // Start observing the target node for configured mutations
      observer.observe(this.UserTemplate, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  }
}
