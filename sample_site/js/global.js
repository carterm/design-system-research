//@ts-check

window.addEventListener("eureka_connectedCallback_end", e => {
  const ce = /** @type {CustomEvent} */ (e);

  /** @type {import("../../src/js/web-components/ca-eureka-component").ca_eureka_component_event_data} */
  const detail = ce.detail;

  const comp = detail.component;

  console.log(comp.tagName + "");
  console.log(ce.target === comp);

  if (comp.tagName === "CA-ACCORDION") {
    if (comp.shadowRoot) {
      comp.shadowRoot.innerHTML = comp.shadowRoot.innerHTML.replace(
        /Accordion/g,
        "Accordion Customized"
      );
    }

    comp.innerHTML = comp.innerHTML.replace(
      /accordion/g,
      "Accordion Customized"
    );
  }
});
