//@ts-check

window.addEventListener("eureka_connectedCallback_end", e => {
  const comp =
    /** @type {import("../../src/js/web-components").ca_eureka_component} **/ (
      e.target
    );

  if (comp.tagName === "CA-ACCORDION") {
    comp.addStyle("details{background-color:pink}");

    if (comp.dataset.summary?.includes("1")) {
      comp.addStyle("details{background-color:yellow}");
    }

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

window.addEventListener("eureka_htmltemplate_set", e => {
  const comp =
    /** @type {import("../../src/js/web-components").ca_eureka_component} **/ (
      e.target
    );

  if (comp.tagName === "CA-ACCORDION") {
    comp.HTMLTemplateString = comp.HTMLTemplateString?.replace(
      /<div>/g,
      "<div>monkey"
    );
  }
});
