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
var utils_exports = {};
__export(utils_exports, {
  EmptyMarkup: () => EmptyMarkup,
  areEqualJson: () => areEqualJson,
  areEqualMarkups: () => areEqualMarkups,
  equalMarks: () => equalMarks,
  isEmptyMarkup: () => isEmptyMarkup,
  isEmptyNode: () => isEmptyNode,
  jsonToMarkup: () => jsonToMarkup,
  markupToHTML: () => markupToHTML,
  markupToJSON: () => markupToJSON,
  markupToText: () => markupToText,
  stripTags: () => stripTags
});
module.exports = __toCommonJS(utils_exports);
var import_fast_equals = require("fast-equals");
var import_dsl = require("./dsl");
var import_model = require("./model");
var import_traverse = require("./traverse");
const EmptyMarkup = jsonToMarkup((0, import_model.emptyMarkupNode)());
function isEmptyMarkup(markup) {
  if (markup === void 0 || markup === null || markup === "") {
    return true;
  }
  return isEmptyNode(markupToJSON(markup));
}
__name(isEmptyMarkup, "isEmptyMarkup");
function areEqualMarkups(markup1, markup2) {
  if (markup1 === markup2) {
    return true;
  }
  const node1 = markupToJSON(markup1);
  const node2 = markupToJSON(markup2);
  if (isEmptyNode(node1) && isEmptyNode(node2)) {
    return true;
  }
  return equalNodes(node1, node2);
}
__name(areEqualMarkups, "areEqualMarkups");
function areEqualJson(json1, json2) {
  return equalNodes(json1, json2);
}
__name(areEqualJson, "areEqualJson");
function equalNodes(node1, node2) {
  if (node1.type !== node2.type) return false;
  const text1 = node1.text ?? "";
  const text2 = node2.text ?? "";
  if (text1 !== text2) return false;
  if (!equalArrays(node1.content, node2.content, equalNodes)) return false;
  if (!equalArrays(node1.marks, node2.marks, equalMarks)) return false;
  if (!equalRecords(node1.attrs, node2.attrs)) return false;
  return true;
}
__name(equalNodes, "equalNodes");
function equalArrays(a, b, equal) {
  if (a === b) return true;
  const arr1 = a ?? [];
  const arr2 = b ?? [];
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item1, i) => equal(item1, arr2[i]));
}
__name(equalArrays, "equalArrays");
function equalRecords(a, b) {
  if (a === b) return true;
  a = Object.fromEntries(Object.entries(a ?? {}).filter(([_, v]) => v != null));
  b = Object.fromEntries(Object.entries(b ?? {}).filter(([_, v]) => v != null));
  return (0, import_fast_equals.deepEqual)(a, b);
}
__name(equalRecords, "equalRecords");
function equalMarks(a, b) {
  return a.type === b.type && equalRecords(a.attrs, b.attrs);
}
__name(equalMarks, "equalMarks");
const emptyNodes = [import_model.MarkupNodeType.hard_break];
const nonEmptyNodes = [
  import_model.MarkupNodeType.horizontal_rule,
  import_model.MarkupNodeType.image,
  import_model.MarkupNodeType.reference,
  import_model.MarkupNodeType.subLink,
  import_model.MarkupNodeType.table
];
function isEmptyNode(node) {
  if (emptyNodes.includes(node.type)) return true;
  if (nonEmptyNodes.includes(node.type)) return false;
  if (node.text !== void 0 && node.text?.trim().length > 0) return false;
  const content = node.content ?? [];
  return content.every(isEmptyNode);
}
__name(isEmptyNode, "isEmptyNode");
function jsonToMarkup(json) {
  return JSON.stringify(json);
}
__name(jsonToMarkup, "jsonToMarkup");
function markupToJSON(markup) {
  if (markup == null || markup === "") {
    return (0, import_model.emptyMarkupNode)();
  }
  try {
    if (markup.startsWith("{")) {
      return JSON.parse(markup);
    } else {
      return (0, import_dsl.nodeDoc)((0, import_dsl.nodeParagraph)((0, import_dsl.nodeText)(markup)));
    }
  } catch (error) {
    return (0, import_model.emptyMarkupNode)();
  }
}
__name(markupToJSON, "markupToJSON");
const ELLIPSIS_CHAR = "\u2026";
const WHITESPACE = " ";
function stripTags(markup, textLimit = 0) {
  const parsed = markupToJSON(markup);
  const textParts = [];
  let charCount = 0;
  let isHardStop = false;
  const pushText = /* @__PURE__ */ __name((text) => {
    if (textLimit > 0 && charCount + text.length > textLimit) {
      const toAddCount = textLimit - charCount;
      const textPart = text.substring(0, toAddCount);
      textParts.push(textPart);
      textParts.push(ELLIPSIS_CHAR);
      isHardStop = true;
    } else {
      textParts.push(text);
      charCount += text.length;
    }
  }, "pushText");
  (0, import_traverse.traverseNode)(parsed, (node, parent) => {
    if (isHardStop) {
      return false;
    }
    if (node.type === import_model.MarkupNodeType.text) {
      const text = node.text ?? "";
      pushText(text);
      return false;
    } else if (node.type === import_model.MarkupNodeType.paragraph || node.type === import_model.MarkupNodeType.table || node.type === import_model.MarkupNodeType.doc || node.type === import_model.MarkupNodeType.blockquote) {
      if (textParts.length > 0 && textParts[textParts.length - 1] !== WHITESPACE) {
        textParts.push(WHITESPACE);
        charCount++;
      }
    } else if (node.type === import_model.MarkupNodeType.reference) {
      const label = `${node.attrs?.label ?? ""}`;
      pushText(label.length > 0 ? `@${label}` : "");
    }
    return true;
  });
  const result = textParts.join("");
  return result;
}
__name(stripTags, "stripTags");
class NodeBuilder {
  constructor(addTags) {
    this.addTags = addTags;
  }
  static {
    __name(this, "NodeBuilder");
  }
  textParts = [];
  addText(text) {
    this.textParts.push(text);
  }
  addTag(text, newLine = false) {
    if (this.addTags) {
      this.textParts.push(text);
    }
    if (!this.addTags && newLine) {
      this.textParts.push("\n");
    }
  }
  toText() {
    return this.textParts.join("");
  }
}
function addMark(builder, mark, next) {
  if (mark != null) {
    const attrs = mark.attrs ?? {};
    if (mark.type === import_model.MarkupMarkType.bold) {
      builder.addTag("<strong>");
      next?.();
      builder.addTag("</strong>");
    } else if (mark.type === import_model.MarkupMarkType.code) {
      builder.addTag('<code class="proseCode">');
      next?.();
      builder.addTag("</code>");
    } else if (mark.type === import_model.MarkupMarkType.em) {
      builder.addTag("<em>");
      next?.();
      builder.addTag("</em>");
    } else if (mark.type === import_model.MarkupMarkType.link) {
      builder.addTag(`<a href=${attrs.href} target=${attrs.target}>`);
      next?.();
      builder.addTag("</a>");
    } else if (mark.type === import_model.MarkupMarkType.strike) {
      builder.addTag("<s>");
      next?.();
      builder.addTag("</s>");
    } else if (mark.type === import_model.MarkupMarkType.underline) {
      builder.addTag("<u>");
      next?.();
      builder.addTag("</u>");
    } else {
      builder.addTag(`unknown mark: "${mark.type}"`, false);
      next?.();
    }
  }
}
__name(addMark, "addMark");
function addMarks(builder, marks, next) {
  if (marks.length > 0) {
    const mark = marks[0];
    const others = marks.slice(1);
    if (others.length > 0) {
      addMark(builder, mark, () => {
        addMarks(builder, others, next);
      });
    } else {
      addMark(builder, mark, next);
    }
  }
}
__name(addMarks, "addMarks");
function addNodeContent(builder, node) {
  if (node == null) return;
  const attrs = node.attrs ?? {};
  const nodes = node.content ?? [];
  if (node.type === import_model.MarkupNodeType.doc) {
    nodes.forEach((childNode) => {
      addNode(builder, childNode);
    });
  } else if (node.type === import_model.MarkupNodeType.text) {
    builder.addText(node.text ?? "");
  } else if (node.type === import_model.MarkupNodeType.paragraph) {
    builder.addTag("<p>");
    nodes.forEach((childNode) => {
      addNode(builder, childNode);
    });
    builder.addTag("</p>");
  } else if (node.type === import_model.MarkupNodeType.blockquote) {
    builder.addTag("<blockquote>");
    nodes.forEach((childNode) => {
      addNode(builder, childNode);
    });
    builder.addTag("</blockquote>");
  } else if (node.type === import_model.MarkupNodeType.horizontal_rule) {
    builder.addTag("<hr/>");
  } else if (node.type === import_model.MarkupNodeType.heading) {
    const level = toNumber(node.attrs?.level) ?? 1;
    builder.addTag(`<h${level}>`);
    nodes.forEach((childNode) => {
      addNode(builder, childNode);
    });
    builder.addTag(`</h${level}>`);
  } else if (node.type === import_model.MarkupNodeType.code_block) {
    builder.addTag("<pre><code>");
    nodes.forEach((childNode) => {
      addNode(builder, childNode);
    });
    builder.addTag("</code></pre>");
  } else if (node.type === import_model.MarkupNodeType.image) {
    const src = toString(attrs.src);
    const alt = toString(attrs.alt);
    builder.addText(`<img src="${src}" alt="${alt}"/>`);
  } else if (node.type === import_model.MarkupNodeType.reference) {
    const label = toString(attrs.label);
    builder.addTag(
      `<span class="antiMention reference" data-type="reference" label="${attrs.label}" id="${attrs.id}" objectclass="${attrs.objectclass}">`
    );
    builder.addText(label !== void 0 ? `@${label}` : "");
    builder.addTag("</span>");
  } else if (node.type === import_model.MarkupNodeType.hard_break) {
    builder.addTag("<br/>");
  } else if (node.type === import_model.MarkupNodeType.ordered_list) {
    builder.addTag("<ol>");
    nodes.forEach((childNode) => {
      addNode(builder, childNode);
    });
    builder.addTag("</ol>");
  } else if (node.type === import_model.MarkupNodeType.bullet_list) {
    builder.addTag("<ul>");
    nodes.forEach((childNode) => {
      addNode(builder, childNode);
    });
    builder.addTag("</ul>");
  } else if (node.type === import_model.MarkupNodeType.list_item) {
    builder.addTag("<li>");
    nodes.forEach((childNode) => {
      addNode(builder, childNode);
    });
    builder.addTag("</li>");
  } else if (node.type === import_model.MarkupNodeType.subLink) {
    builder.addTag("<sub>");
    nodes.forEach((childNode) => {
      addNode(builder, childNode);
    });
    builder.addTag("</sub>");
  } else if (node.type === import_model.MarkupNodeType.table) {
    builder.addTag("<table><tbody>");
    nodes.forEach((childNode) => {
      addNode(builder, childNode);
    });
    builder.addTag("</tbody></table>");
  } else if (node.type === import_model.MarkupNodeType.table_row) {
    builder.addTag("<tr>");
    nodes.forEach((childNode) => {
      addNode(builder, childNode);
    });
    builder.addTag("</tr>");
  } else if (node.type === import_model.MarkupNodeType.table_cell) {
    builder.addTag("<td>");
    nodes.forEach((childNode) => {
      addNode(builder, childNode);
    });
    builder.addTag("</td>");
  } else if (node.type === import_model.MarkupNodeType.table_header) {
    builder.addTag("<th>");
    nodes.forEach((childNode) => {
      addNode(builder, childNode);
    });
    builder.addTag("</th>");
  } else {
    builder.addText(`unknown node: "${node.type}"`);
    nodes.forEach((childNode) => {
      addNode(builder, childNode);
    });
  }
}
__name(addNodeContent, "addNodeContent");
function addNode(builder, node) {
  const marks = node.marks ?? [];
  if (marks.length > 0) {
    addMarks(builder, marks, () => {
      addNodeContent(builder, node);
    });
  } else {
    addNodeContent(builder, node);
  }
}
__name(addNode, "addNode");
function toString(value) {
  return value !== void 0 ? `${value}` : void 0;
}
__name(toString, "toString");
function toNumber(value) {
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }
  return value !== void 0 ? typeof value === "string" ? parseInt(value) : value : void 0;
}
__name(toNumber, "toNumber");
function markupToHTML(markup) {
  const jsonModel = markupToJSON(markup);
  const builder = new NodeBuilder(true);
  addNode(builder, jsonModel);
  return builder.toText();
}
__name(markupToHTML, "markupToHTML");
function markupToText(markup) {
  const jsonModel = markupToJSON(markup);
  const builder = new NodeBuilder(false);
  addNode(builder, jsonModel);
  return builder.toText();
}
__name(markupToText, "markupToText");
//# sourceMappingURL=utils.js.map
