export default (
  { title, description, content }: Lume.Data,
  _helpers: Lume.Helpers,
) =>
  /*html*/ `<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <title>${title} | NexInox</title>
    <meta name="description" content="${description}" />
    <link rel="stylesheet" href="/pico.min.css" />
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <header>
      <nav>
          <div class="container">
            <ul>
                <li><a href="/"><h1>NexInox</h1></a></li>
            </ul>
          </div>
      </nav>
      <hr />
    </header>
    <main class="container">
      ${content}
    </main>
  </body>
</html>`;
