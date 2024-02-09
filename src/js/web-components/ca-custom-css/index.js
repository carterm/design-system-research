//@ts-check
import ca_eureka_component from "../_ca-eureka-component/index";

export default class ca_custom_css extends ca_eureka_component {
  /** @override */
  static get tagName() {
    return "ca-custom-css";
  }

  constructor() {
    super();

    //Push the styles on anything with a shadow
    ca_eureka_component.addCEventListener(
      "eureka_shadow_constructed_end",
      comp => {
        this.querySelectorAll("style").forEach(s => comp.addStyle(s.innerHTML));
        console.log(comp.tagName);
      }
    );
  }
}
