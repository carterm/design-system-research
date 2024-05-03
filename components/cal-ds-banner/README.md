# `cal-ds-banner`

Banner for the top of any page

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
