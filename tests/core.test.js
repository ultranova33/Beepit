const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

global.window = global;
[
  "src/core/normalize.js",
  "src/core/matcher.js",
  "src/core/censor.js",
  "src/core/regional-words.js",
  "src/core/settings.js"
].forEach((file) => vm.runInThisContext(fs.readFileSync(path.join(__dirname, "..", file), "utf8"), { filename: file }));

const blockedWords = ["shit", "fuck", "bitch", "asshole"];
const mergedBlockedWords = BeepitSettings.defaults.blockedWords;

function censor(text) {
  return BeepitCensor.censorText(text, blockedWords);
}

test("replaces only vowels in a matched word", () => {
  assert.equal(censor("shit fuck bitch asshole"), "$h#t f#ck b#tch @$$h#l*");
});

test("matches case variations and common substitutions", () => {
  assert.equal(censor("SHIT sh1t"), "$H#T $h#t");
});

test("matches separators between letters while preserving them", () => {
  assert.equal(censor("s h i t s.h.i.t"), "$ h # t $.h.#.t");
});

test("censors repeated letters without censoring adjacent clean words", () => {
  assert.equal(censor("shiiit shitty shitless"), "$h#*#t $h#tty $h#tless");
});

test("normalizes accented letters", () => {
  assert.equal(censor("shít"), "$h#t");
});

test("censors immediately and catches every blocked occurrence in live text", () => {
  assert.equal(censor("fuck shit fuck"), "f#ck $h#t f#ck");
  assert.equal(censor("hello fuck there"), "hello f#ck there");
  assert.equal(censor("space after fuck works"), "space after f#ck works");
  assert.equal(censor("bitch what do u think of this shit"), "b#tch what do u think of this $h#t");
});

test("leaves text without a blocked word unchanged", () => {
  assert.equal(censor("class assignment"), "class assignment");
});

test("preserves the expected blocking behavior for normal words", () => {
  assert.equal(censor("Hello, this is a clean message."), "Hello, this is a clean message.");
});

test("does not alter URLs or repository links", () => {
  const link = "https://github.com/ultranova33/Beepit#tg#tg#tg";
  assert.equal(censor(link), link);
  assert.equal(censor("github.com/ultranova33/Beepit#tg#tg#tg"), "github.com/ultranova33/Beepit#tg#tg#tg");
  assert.equal(censor("open " + link + " and say shit"), "open " + link + " and say $h#t");
});

test("censors Tamil and Hindi transliterated words", () => {
  const regionalWords = window.BeepitRegionalBlockedWords;
  assert.ok(mergedBlockedWords.includes("chutiya"));
  assert.ok(mergedBlockedWords.includes("watha"));
  assert.ok(mergedBlockedWords.includes("bhenchod"));
  assert.equal(BeepitCensor.censorText("chutiya gandu watha", mergedBlockedWords), "ch#t*y@ g@nd# w@th@");
  assert.equal(BeepitCensor.censorText("bhenchod bakchod maa ki chut", regionalWords), "bh#nch*d b@kch#d m@@ k# ch*t");
  assert.equal(BeepitCensor.censorText("chutiya and fuck", mergedBlockedWords), "ch#t*y@ and f#ck");
});
