# `cal-ds-header`

Banner for the top of any page. Place the code anywhere in your HTML and it will move to the top.

# User Definition Sample

```html
<cal-ds-header
  data-logo-overflow="true"
  data-apps-link-style="link"
  data-apps-link-url="https://www.ca.gov"
  data-apps-link-tooltip="Link to www.ca.gov website"
>
  <template>
    <!-- Site Branding -->
    <a href="/">
      <!-- Branding logo -->
      <img src="https://cdn.cdt.ca.gov/cdt/CAWeb/site-logo-circle.svg" alt="Eureka Design System logo">
      <!-- Branding text -->
      <span>California</span>
      <span>Department Website</span>
    </a>

    <!-- Nav links -->
    <nav>
      <a href="/home/">Home</a>
      <a>Level 2 Menu</a>
      <a href="/level2/option1" data-level="2">Level 2 Option 1</a>
      <a href="/level2/option2" data-level="2">Level 2 Option 2</a>
      <a href="/about/">About</a>
    </nav>

    <!-- Search Form -->
    <form action="/serp.html">
      <input placeholder="Search">
    </form>

    <!-- Additional header links -->
    <a href="#" class="login-button">Login</a>
  </template>
</cal-ds-header>
```

# Rendered Markup Sample

```html
<header role="banner">
  <!-- Add class "theme-light" to use light header version -->
  <div class="site-header">
    <div class="site-header-container">
      <nav class="mobile-nav-menu" role="navigation">
        <a href="#" tabindex="0" class="main-navigation-button" role="button">
          <div class="hamburger"></div>
          <span class="visually-hidden">Main menu</span>
        </a>
        <a
          href="#"
          tabindex="-1"
          class="main-navigation-cancel"
          role="button"
          aria-label="Close menu"></a>
        <ul>
          <li>
            <details name="MobileMenu">
              <summary>Level 1 menu - 1</summary>
              <ul>
                <li><a href="#" role="menuitem">Submenu 1A</a></li>
                <li><a href="#" role="menuitem">Submenu 1B</a></li>
                <li><a href="#" role="menuitem">Submenu 1C</a></li>
              </ul>
            </details>
          </li>
          <li>
            <details name="MobileMenu">
              <summary>Level 1 menu - 2</summary>
              <ul>
                <li><a href="#" role="menuitem">Submenu 2A</a></li>
                <li><a href="#" role="menuitem">Submenu 2B</a></li>
                <li><a href="#" role="menuitem">Submenu 2C</a></li>
              </ul>
            </details>
          </li>
        </ul>
      </nav>

      <a href="index.html" class="site-logo">
        <!-- add class "no-overflow" to remove image's bottom overflow-->
        <img
          src="https://cdn.cdt.ca.gov/cdt/CAWeb/site-logo-circle.svg"
          alt="Eureka Design System logo"
          class="logo-image " />

        <div class="site-branding-text">
          <span class="state">California</span>
          <span class="department">Department Website</span>
        </div>
      </a>
      <div class="site-header-utility">
        <div class="search-container-desktop">
          <form autocomplete="on">
            <label class="search-toggle" for="site-search"
              ><span class="visually-hidden">Search this site</span></label
            >
            <input
              id="site-search"
              type="search"
              name="q"
              class="search-input"
              placeholder="Search..."
              tabindex="0"
              required />
            <button type="submit" class="search-submit" tabindex="-1"></button>
            <button type="submit" class="search-submit"></button>
          </form>
        </div>
        <a href="#" class="login-button"
          ><span class="login-text">Login</span></a
        >
        <a class="cagov-toggle" href="https://www.ca.gov/">
          <span class="visually-hidden">ca.gov link</span>
        </a>
      </div>
    </div>
  </div>
</header>
```

# Adding HTML SCRIPT reference

```HTML
<head>
  <script src="https://cdn.jsdelivr.net/npm/@cagovweb/cal-ds-header" type="module"></script>
</head>
```

# Try this on your site

```JavaScript
document.head.appendChild(Object.assign(document.createElement("script"), {src: "https://cdn.jsdelivr.net/npm/@cagovweb/cal-ds-header",type:"module"}));
document.body.innerHTML = `

<cal-ds-header>
  <template>
    <!-- Site Branding -->
    <a href="https://www.ca.gov">
      <img
        src="https://template.webstandards.ca.gov/images/template-logo.png"
        alt="Custom Image"
        title="Custom Image" />
      <span>California Custom</span>
      <span>Department Website Custom</span>
    </a>
  </template>
</cal-ds-header>

`+document.body.innerHTML;
```
