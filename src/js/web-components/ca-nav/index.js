//@ts-check
import ca_eureka_component from "../ca-eureka-component/index.js";

// @ts-ignore
import styles from "./styles.css" assert { type: "css" };

export default class ca_nav extends ca_eureka_component {
  /**
   * Returns the tagName for this static class
   */
  static get tagName() {
    return "ca-nav";
  }

  constructor() {
    const yo = () => {
      this.requireParentElement("ca-eureka");
      this.requireSingle();
      this.requireNotAfter("ca-body", "ca-footer");

      this.contentChanged();
    };

    super(yo);

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(styles);

    const shadow = this.attachShadow({ mode: "open" });
    shadow.adoptedStyleSheets.push(sheet);

    // Callback function to execute when mutations are observed
    /** @type {MutationCallback} */
    const callback = mutationsList => {
      for (let mutation of mutationsList) {
        console.log(mutation.type);
        this.contentChanged();
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(this, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true
    });

    this.contentChanged();
  }

  contentChanged() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = this.innerHTML;
      //const sheet = document.createElement("style");
      //sheet.innerHTML = styles;
      //this.shadowRoot.getRootNode().appendChild(sheet);

      //const sheet = new CSSStyleSheet();
      //sheet.replaceSync(styles);
      //this.shadowRoot.adoptedStyleSheets = [sheet];
    }
  }
}
