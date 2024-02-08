//@ts-check

import ca_eureka_component from "../ca-eureka-component/index.js";

export default class ca_head extends ca_eureka_component {
  /** @override */
  static get tagName() {
    return "ca-head";
  }

  /**
   * @protected
   * @override
   */
  static get observedAttributes() {
    return ["data-title", "data-description", "data-canonical-params"];
  }

  constructor() {
    /**
     *
     * @param {string} name
     * @param {string} _oldValue
     * @param {string} newValue
     */
    const attributeChangedCallback = (name, _oldValue, newValue) => {
      /**
       * @param {string} metaName
       * @param {string | null} metaValue
       */
      const setMeta = (metaName, metaValue) => {
        const existingMeta = document.head.querySelector(
          `meta[name="${metaName}" i]`
        );

        if (existingMeta) {
          if (metaValue === null) {
            existingMeta.remove();
          } else {
            existingMeta.attributes["content"].value = metaValue;
          }
        } else if (metaValue !== null) {
          document.head.append(
            Object.assign(document.createElement("meta"), {
              name: metaName,
              content: metaValue
            })
          );
        }
      };

      switch (name) {
        case "data-title":
          document.title = newValue || "";
          ["title", "og:title", "twitter:title"].forEach(m =>
            setMeta(m, newValue)
          );

          break;
        case "data-description":
          ["description", "og:description", "twitter:description"].forEach(m =>
            setMeta(m, newValue)
          );

          break;
        case "data-canonical-params":
          {
            const metaNames = ["canonical", "og:url", "twitter:url"];

            if (newValue === null) {
              metaNames.forEach(m => setMeta(m, newValue));
            } else {
              const u = new URL(location.href.toLowerCase());
              const qs = newValue
                .split(",")
                .map(t => t.trim())
                .filter(p => u.searchParams.has(p.toLowerCase()));
              const href = `${u.origin}${u.pathname}${
                qs.length
                  ? `?${qs
                      .map(q => `${q}=${u.searchParams.get(q.toLowerCase())}`)
                      .join("&")}`
                  : ""
              }`;

              metaNames.forEach(m => setMeta(m, href));
            }
          }

          break;
      }
    };

    super({ attributeChangedCallback });
  }
}
