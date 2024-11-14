export default (
  { title, content, year }: Lume.Data,
  _helpers: Lume.Helpers,
) => /*html*/ `
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <title>${title} | NexInox</title>
    <link rel="stylesheet" href="/pico.min.css" />
    <link rel="stylesheet" href="/style.css" inline />
  </head>
  <body>
    <header>
      <div class="container">
        <nav>
          <ul>
            <li>
              <a href="/" data-tooltip="Beranda" data-placement="bottom">
                <h1><img class="avatar brand" src="/images/profile_pic.jpg" transform-images="avif webp jpg 400" alt="NexInox's Icon" />NexInox</h1>
              </a>
            </li>
          </ul>
          <ul>
            <li>
              <a href="/peta" aria-label="Peta Kuliner" data-tooltip="Peta Kuliner" data-placement="bottom">
                <img src="/icons/map.svg" inline />
              </a>
            </li>
            <li>
              <a href="https://instagram.com/nex_inox" target="_blank" rel="noreferrer noopener" aria-label="Instagram" data-tooltip="Instagram" data-placement="bottom">
                <img src="/icons/instagram.svg" inline />
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <hr />
    </header>
    <main class="container">
      ${content}
    </main>
    <footer>
      <hr />
      <div class="container">
        <nav>
          <ul>
            <li>
              <small>Hak cipta NexInox &copy; ${year}</small>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  </body>
</html>
`;
