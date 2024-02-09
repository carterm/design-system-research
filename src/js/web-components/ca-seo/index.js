//@ts-check

import ca_eureka_component from "../_ca-eureka-component/index";

export default class ca_seo extends ca_eureka_component {
  /** @override */
  static get tagName() {
    return "ca-seo";
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
            let href = null;

            if (newValue !== null) {
              const url = new URL(location.href.toLowerCase());

              const qs = newValue
                .split(",")
                .map(t => t.trim())
                .filter(p => url.searchParams.has(p.toLowerCase()));
              href =
                url.origin +
                url.pathname +
                (qs.length
                  ? `?${qs
                      .map(q => `${q}=${url.searchParams.get(q.toLowerCase())}`)
                      .join("&")}`
                  : "");
            }
            ["canonical", "og:url", "twitter:url"].forEach(m =>
              setMeta(m, href)
            );
          }

          break;
      }
    };

    super({ attributeChangedCallback });
  }
}
