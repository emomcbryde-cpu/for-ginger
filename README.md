# Happy Birthday Ginger ❤️

A cinematic, single-page interactive birthday website — a digital love letter,
built mobile-first so it opens beautifully from a text-message link.

Pure HTML + CSS + vanilla JavaScript. No frameworks, no build step. Works from
the root of a GitHub Pages site and runs on Safari (iPhone) and Chrome (Android).

## What's inside

```
happy-birthday-ginger/
├── index.html        the page
├── style.css         luxury romantic styling + animations
├── script.js         the experience (tap-driven flow, effects, music)
├── README.md         this file
└── assets/           your music + photos go here (see assets/README-assets.txt)
```

## The experience

1. **Opening** — screen starts black, then a soft glow, drifting stars and gold
   particles fade in with the line *"Someone special deserves a special moment…"*
2. **Letters** — tap to reveal **G · I · N · G · E · R** one letter at a time,
   each with its own message and a slow gold glow.
3. **Final reveal** — *"Happy Birthday Ginger ❤️"* and a full letter, with floating
   hearts, falling rose petals, sparkles, and a glowing **"With love ❤️"** signature.
4. **Favorite Memories** — an optional fade-in photo gallery at the very bottom.

Tap anywhere to move forward. Music never autoplays — it starts on the first tap,
with a small toggle in the top-right corner.

---

## Put it online with GitHub Pages (free)

You don't need to know any code. About 5 minutes.

### 1. Create a repository
- Go to <https://github.com> and sign in (create a free account if needed).
- Click the **+** (top-right) → **New repository**.
- Name it something like `birthday` (a short, clean name — it becomes part of the URL).
- Set it to **Public**, then click **Create repository**.

### 2. Upload the files
- On the new repo page, click **uploading an existing file** (or **Add file → Upload files**).
- Drag in **index.html**, **style.css**, **script.js**, and **README.md**.
- Also drag in your **assets** folder (with music.mp3 and the photos, if you have them).
  - Tip: if the folder won't drag, create the files first, then upload the folder's
    contents — GitHub keeps the `assets/` path as long as you upload the folder itself.
- Scroll down and click **Commit changes**.

> Important: **index.html must sit at the top level** of the repo (not inside a
> subfolder), so the site loads from the root.

### 3. Enable Pages
- In the repo, click **Settings** (top menu).
- In the left sidebar, click **Pages**.
- Under **Build and deployment → Source**, choose **Deploy from a branch**.
- Set **Branch** to **main** and folder to **/ (root)**, then click **Save**.

### 4. Get your link
- Wait ~1 minute, then refresh the **Pages** settings page.
- GitHub shows: *"Your site is live at"* a URL like:

  `https://YOUR-USERNAME.github.io/birthday/`

- That's the link to text her. Open it once on your own phone first to confirm.

---

## Adding music and photos

Everything optional lives in the **assets** folder:

- **Music:** save your song as `assets/music.mp3` (exact name).
- **Photos:** save three images as `assets/photo1.jpg`, `assets/photo2.jpg`,
  `assets/photo3.jpg` (exact lowercase names).

The site works fine without them — missing photos disappear, and the whole
"Favorite Memories" section stays hidden if there are none. See
`assets/README-assets.txt` for details.

To add them after the site is already live, just upload the files into the
`assets` folder in your repo (**Add file → Upload files**) and commit — the live
site updates within a minute.

---

## Notes

- Designed mobile-first; also looks great on desktop.
- Fonts (Playfair Display, Cormorant Garamond, Poppins) load from Google Fonts,
  so an internet connection is needed the first time it opens.
- Respects "reduce motion" accessibility settings.
