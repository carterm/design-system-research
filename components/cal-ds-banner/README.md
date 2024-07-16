# `cal-ds-banner`

Banner for the top of any page. Place the code anywhere in your HTML and it will move to the top.

```html
<html>
  ...
  <body>
    <cal-ds-banner>
      <template>
        <p>Banner on the top</p>
      </template>
    </cal-ds-banner>

    <cal-ds-banner data-target="header">
      <template>
        <p>Banner on the top of the HEADER</p>
      </template>
    </cal-ds-banner>

    <cal-ds-banner data-target="header > span">
      <template>
        <p>Banner on the top of the first direct SPAN in HEADER</p>
      </template>
    </cal-ds-banner>
```

## Try this on any page on the web!

Place this in the web console

```javascript
document.head.appendChild(Object.assign(document.createElement("script"), {src: "https://cdn.jsdelivr.net/npm/@cagovweb/cal-ds-banner",type:"module"}));
document.body.innerHTML += `

<cal-ds-banner>
  <template>
    <strong>Live now:</strong> Press conference | <a href="">Priorities</a>
  </template>
</cal-ds-banner>

`;
```
