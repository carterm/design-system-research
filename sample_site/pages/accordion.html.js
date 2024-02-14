//@ts-check

window.addEventListener("eureka_connectedCallback_end", e => {
  const comp = /** @type {import("../../src/js").ca_eureka_component} **/ (
    e.target
  );

  if (comp.tagName === "CA-ACCORDION") {
    comp.addStyle("details{background-color:pink}");

    if (comp.dataset.summary?.includes("1")) {
      comp.addStyle("details{background-color:yellow}");
    }

    if (comp.shadowRoot) {
      const testItem = document.createElement("em");
      testItem.innerHTML = "JavaScript added to shadow root";
      comp.shadowRoot.querySelector("details")?.appendChild(testItem);
    }

    comp.innerHTML = comp.innerHTML.replace(
      /accordion/g,
      "Accordion Customized"
    );
  }
});

window.addEventListener("eureka_shadow_constructed_start", e => {
  const comp = /** @type {import("../../src/js").ca_eureka_component} **/ (
    e.target
  );

  if (comp.tagName === "CA-ACCORDION") {
    comp.HTMLTemplateString = comp.HTMLTemplateString?.replace(
      /<div>/g,
      "<div>JavaScript Event added"
    );
  }
});
