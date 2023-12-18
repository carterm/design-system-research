# design-system-research

Starting point for design system dev project

## Justification

### Web Components

Here are some reasons why using JavaScript "Web Components" is an improvement over just using disconnected HTML/CSS/JavaScript:

- **Simpler CSS**: You can use simpler CSS without classes since the CSS applies to the shadow DOM only and not the rest of the HTML page. This means less clutter and more readability for your stylesheets.
- **Shadow DOM vs Light DOM**: The shadow DOM is a hidden part of the DOM that encapsulates the internal structure and style of a web component. The light DOM is the visible part of the DOM that contains the content and attributes of a web component. By using the shadow DOM, you can isolate your web component from the rest of the page and avoid conflicts with other styles or scripts.
- **Custom tags**: You can create custom tags that represent your web components, such as `<my-button>`, `<my-card>`, or `<my-chart>`. This makes your HTML more semantic and easier to understand for developers and documentation tools. You can also define custom attributes and events for your web components, giving them more functionality and interactivity.

### Possible Design Features
- **html-data**: The Design System includes a html-data file that gives developers dropdown menus for possible tags, attributes and attribute values.
- **runtime validation**: The Design System can validate for proper tag placement at run-time.  The feature is enabled by default, and can be turned off in the `ca-root` element by specifying the `novalidate` attribute.