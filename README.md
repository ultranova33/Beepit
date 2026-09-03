# Beepit

Beepit is a local-only Chrome Manifest V3 extension that censors vowels in selected words before text messages are sent through WhatsApp Web.

```text
shit     -> $h#t
fuck     -> f#ck
bitch    -> b#tch
asshole  -> @$$h#l*
sh1t     -> $h#t
s.h.i.t  -> $.h.#.t
```

Beepit changes the message in the WhatsApp composer. It does not read sent message history, use WhatsApp private APIs, call a backend, or upload message content.

## V1 Scope

V1 supports WhatsApp Web text composers, typing, pasting, chat switching, repeated letters, punctuation and spaces between letters, common symbol substitutions, accented characters, and an editable blocked-word list. It does not process images, audio, documents, calls, WhatsApp mobile, or messages that were already sent.

No browser extension can stop a user who disables or removes it. The matching pipeline is designed to resist common text obfuscation rather than claim perfect language understanding.

## How It Works

```text
Composer input
  -> Unicode normalization
  -> Confusable-character mapping
  -> Separator-resistant matching
  -> Repeated-letter normalization
  -> Whole-word boundary check
  -> Original-character index mapping
  -> Vowel replacement
  -> Updated composer text
```

### Vowel-only censoring

The matcher identifies a blocked word, but the censor replaces only its vowels. Vowels are replaced in order with alternating `#` and `*`, starting with `#`. Matched `s` or `S` becomes `$`, and matched `a` or `A` becomes `@`. Other consonants, punctuation, whitespace, and message structure remain intact.

### Unicode normalization

`normalize.js` uses Unicode NFKD normalization and removes combining marks. This lets accented forms be compared with their base letters, for example `shít` matching `shit`.

### Confusable characters

Common substitutions are mapped before matching, including `1 -> i`, `0 -> o`, `3 -> e`, `4 -> a`, `5 -> s`, `@ -> a`, and `$ -> s`. This is intentionally a small, reviewable mapping rather than an attempt to guess every possible symbol.

### Separator-resistant matching

Whitespace, punctuation, symbols, underscores, and line breaks are ignored in the matching representation. An index map points each normalized character back to its source characters, so the original separators can remain visible while vowels in the detected word are censored.

### Repeated-letter normalization

Repeated consecutive characters are collapsed for matching. The source index map still contains every original character, so `shiiit` is matched as `shit` and all three original vowels are replaced.

### Whole-word boundaries

A blocked word is not matched inside a larger letter-or-number sequence. For example, a blocked `shit` does not match `shitless`. Separators are allowed inside a match, so `s h i t` can still be detected.

### Fuzzy matching

V1 uses controlled normalization rather than unrestricted fuzzy search. This catches casing, accents, substitutions, separators, and repeated characters while reducing false positives. Adding broad edit-distance matching would risk censoring innocent words and is reserved for a future setting with explicit thresholds and tests.

## Architecture

- `manifest.json` declares the extension, permissions, WhatsApp host scope, content scripts, options page, and execution timing.
- `src/core/normalize.js` creates the normalized representation and source index map.
- `src/core/matcher.js` finds longest-first blocked-word matches and checks boundaries.
- `src/core/censor.js` maps matches back to the original text and replaces vowels.
- `src/core/settings.js` defines defaults and wraps `chrome.storage.local`.
- `src/content/observer.js` watches WhatsApp's dynamic single-page DOM and finds composers.
- `src/content/composer.js` listens for input, updates the contenteditable composer, and restores the caret.
- `src/content/content.js` loads settings and applies live storage changes.
- `src/options/` provides the editable settings page.
- `tests/` runs core behavior without needing WhatsApp or a browser.

## Manifest V3 Concepts

Chrome extensions use `manifest.json` as their declaration file. Beepit uses Manifest V3 because it is the current Chrome extension platform.

- `manifest_version`: selects the platform version.
- `permissions: ["storage"]`: permits local extension settings storage.
- `host_permissions`: limits access to WhatsApp Web.
- `content_scripts`: injects the core and integration scripts on matching pages.
- `run_at: "document_idle"`: starts after the page has become available for interaction.
- `options_page`: points Chrome to the settings screen.
- `action`: gives the extension a browser-toolbar identity.

The extension does not request tabs, history, network interception, or remote code permissions.

## Local Development

### Requirements

- Google Chrome or a Chromium-based browser
- Node.js 18 or newer for tests
- Git, if cloning the repository

### Run the tests

From the project directory:

```bash
npm test
```

### Load the extension

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose the Beepit project directory, the folder containing `manifest.json`.
5. Open or reload `https://web.whatsapp.com`.
6. Open the extension details and select **Extension options** to edit the word list.
7. Reload the extension from `chrome://extensions` after changing extension source files.

No build step is required in V1. The files in this repository are the files Chrome loads.

## User Guide

### Install from GitHub

1. Open the Beepit GitHub repository.
2. Select **Code**, then **Download ZIP**, or clone it with Git.
3. Extract the ZIP if necessary.
4. Follow the **Load the extension** steps above.

### Configure words

Open Beepit's extension options. Add one blocked word per line and save. Vowels automatically alternate between `#` and `*`; matched `s/S` becomes `$` and `a/A` becomes `@`. Changes apply to open WhatsApp Web tabs through local storage updates.

### Use it

Open a WhatsApp Web conversation and type or paste a text message. Beepit updates the composer before you send it. The extension can be disabled from the options page without removing it.

## Privacy and Security

Beepit is local-only. Blocked words and preferences are stored in Chrome extension storage. Message text is processed in the page by the content script and is not sent to a Beepit service. The extension is scoped to WhatsApp Web and does not need access to other websites.

The WhatsApp DOM is not a stable public API. If WhatsApp changes its composer markup, the integration may need an update. WhatsApp Web remains responsible for sending the final message.

## Repository Development

```text
Beepit/
├── manifest.json
├── README.md
├── LICENSE
├── package.json
├── src/
│   ├── content/
│   ├── core/
│   └── options/
└── tests/
```

Use focused commits and add unit tests for every new normalization or matching rule. Do not add message content, screenshots containing private chats, or credentials to the repository.

## Roadmap

- Better caret and rich-content handling across WhatsApp UI changes
- Optional custom replacement patterns
- Import and export of word lists
- More configurable normalization rules
- Chrome Web Store packaging and publication
- Additional browser support
