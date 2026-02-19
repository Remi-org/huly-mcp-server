"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var compare_exports = {};
__export(compare_exports, {
  calcS\u00F8rensenDiceCoefficient: () => calcS\u00F8rensenDiceCoefficient,
  isMarkdownsEquals: () => isMarkdownsEquals
});
module.exports = __toCommonJS(compare_exports);
function calcS\u00F8rensenDiceCoefficient(a, b) {
  const first = a.replace(/\s+/g, "");
  const second = b.replace(/\s+/g, "");
  if (first === second) return 1;
  if (first.length < 2 || second.length < 2) return 0;
  const firstBigrams = /* @__PURE__ */ new Map();
  for (let i = 0; i < first.length - 1; i++) {
    const bigram = first.substring(i, i + 2);
    const count = (firstBigrams.get(bigram) ?? 0) + 1;
    firstBigrams.set(bigram, count);
  }
  let intersectionSize = 0;
  for (let i = 0; i < second.length - 1; i++) {
    const bigram = second.substring(i, i + 2);
    const count = firstBigrams.get(bigram) ?? 0;
    if (count > 0) {
      firstBigrams.set(bigram, count - 1);
      intersectionSize++;
    }
  }
  return 2 * intersectionSize / (first.length + second.length - 2);
}
__name(calcS\u00F8rensenDiceCoefficient, "calcS\xF8rensenDiceCoefficient");
function isMarkdownsEquals(source1, source2) {
  const normalizeLineEndings = /* @__PURE__ */ __name((str) => str.replace(/\r?\n/g, "\n"), "normalizeLineEndings");
  const excludeBlankLines = /* @__PURE__ */ __name((str) => str.split("\n").map((it) => it.trimEnd()).filter((it) => it.length > 0).join("\n"), "excludeBlankLines");
  const norm1 = normalizeLineEndings(source1);
  const lines1 = excludeBlankLines(norm1);
  const norm2 = normalizeLineEndings(source2);
  const lines2 = excludeBlankLines(norm2);
  return lines1 === lines2;
}
__name(isMarkdownsEquals, "isMarkdownsEquals");
//# sourceMappingURL=compare.js.map
