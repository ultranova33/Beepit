const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

global.window = global;
[
  "src/core/normalize.js",
  "src/core/matcher.js",
  "src/core/censor.js"
].forEach((file) => vm.runInThisContext(fs.readFileSync(path.join(__dirname, "..", file), "utf8"), { filename: file }));

const blockedWords = ["shit", "fuck", "bitch", "asshole"];

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
  assert.equal(censor("shiiit shitty shitless"), "$h#*#t shitty shitless");
});

test("normalizes accented letters", () => {
  assert.equal(censor("shít"), "$h#t");
});

test("does not match a blocked word inside a larger word", () => {
  assert.equal(censor("class assignment"), "class assignment");
});

test("leaves clean text unchanged", () => {
  assert.equal(censor("Hello, this is a clean message."), "Hello, this is a clean message.");
});
