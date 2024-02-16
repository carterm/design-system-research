# Eureka Design System, Development Repository

Eureka Design System, Development Repository

This repo is an expantion on the work done on the [California State Template V6](https://template.webstandards.ca.gov/).

## Developer Features

- **base class**: All components inherit from a base class that coordinates common component features.
- **html-data**: Includes an html-data file that gives developers dropdown menus for possible tags, attributes and attribute values.
- **Bundles**: Created JavaScript bundles that only add the modules you want in your minified output.

## Future Developer Features

- **runtime validation**: A component that could validate for proper tag placement at run-time.

## Why Web Components (Shadow DOM)?

A Shadow DOM (Document Object Model) allows components to encapulate their code, styles and markup so that the rest of the page can't break them. They work like an IFRAME, where the Shadow DOM is like a new page inside the component. This allows the component to work without worrying about the ecosystem it is being used in.

Here are some reasons why using JavaScript "Web Components" is an improvement over just using disconnected HTML/CSS/JavaScript:

- **Simpler CSS**: You can use simpler CSS without classes since the CSS applies to the shadow DOM only and not the rest of the HTML page. This means less clutter and more readability for your stylesheets.
- **Shadow DOM vs Light DOM**: The shadow DOM is a hidden part of the DOM that encapsulates the internal structure and style of a web component. The light DOM is the visible part of the DOM that contains the content and attributes of a web component. By using the shadow DOM, you can isolate your web component from the rest of the page and avoid conflicts with other styles or scripts.
- **Custom tags**: You can create custom tags that represent your web components, such as `<my-button>`, `<my-card>`, or `<my-chart>`. This makes your HTML more semantic and easier to understand for developers and documentation tools. You can also define custom attributes and events for your web components, giving them more functionality and interactivity.
