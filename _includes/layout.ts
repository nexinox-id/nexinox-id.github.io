export default ({ title, content }: Lume.Data, _helpers: Lume.Helpers) => 
`<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <link rel="stylesheet" href="pico.min.css" />
    <title>${title}</title>
  </head>
  <body>
    <main class="container">
      ${content}
    </main>
  </body>
</html>
)`;
