//@ts-check

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Components/Using_custom_elements

//@ts-check
import my_component from "./index";

//comment out any elements you are not using
//Definition order matters!!!  Code will run in this order

const my_bundle = [my_component];

for (const c of my_bundle) {
  //sync "for", to ensure define order
  window.customElements.define(c.tagName, c);
}
