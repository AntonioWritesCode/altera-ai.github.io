# Sol

Sol is a browser-based chat and journaling prototype. The frontend is plain HTML,
CSS, and JavaScript. The local chat server is Python and connects to an Ollama
instance running on the same computer.

## Run locally

1. Install Python, Ollama, and the Python `ollama` package.
2. Download the configured model with `ollama pull llama3.1`.
3. From this directory, start the local server with `python sol.py`.
4. Open <http://127.0.0.1:8000>.

Keep Ollama running while testing chat. The Python server serves the pages and
handles `POST /api/chat`; it binds to localhost and is intended for local
development, not direct public exposure.

## Project map

- `index.html` and `chat.js`: chat page and browser-side chat requests.
- `journal.html` and `script.js`: journal page; entries are stored in the
  current browser's `localStorage` and do not sync across devices.
- `settings.html`: settings placeholder.
- `nav.css` and `nav.js`: shared desktop sidebar and mobile hamburger menu.
- `styles.css` and `journal.css`: page-specific visual styles.
- `sol.py`: local HTTP server and Ollama chat integration.
- `api/chat.js`: Vercel-style Ollama endpoint; requires `OLLAMA_URL` in the
  deployment environment.
- `html/intro.html` and `css/intro.css`: introductory prototype page and styles.
- `images/proto_tab.png`: image asset.
- `memory.json`: currently empty data file.
- `.gitignore`: excludes Vercel build output and environment files.
- `.gitattributes`: configures Git LFS handling for Python files.
- `.DS_Store`: macOS Finder metadata; it is not used by the application.

Navigation changes to a hamburger menu at 700px. The links are shared between
the chat, journal, and settings pages. Public chat hosting still requires a
securely reachable, always-on AI service.
