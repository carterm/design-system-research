//@ts-check
import ca_eureka_component from "../ca-eureka-component/index.js";

// @ts-ignore
import custom_css from "./styles.css" assert { type: "css" };

export default class ca_nav extends ca_eureka_component {
  /** @override */
  static get tagName() {
    return "ca-nav";
  }

  constructor() {
    super({
      use_shadow: true,
      custom_css
    });

    this.setConnectedCallback(this.contentChanged);

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
