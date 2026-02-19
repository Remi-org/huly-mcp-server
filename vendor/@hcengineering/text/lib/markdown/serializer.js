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
var serializer_exports = {};
__export(serializer_exports, {
  MarkdownState: () => MarkdownState,
  storeMarks: () => storeMarks,
  storeNodes: () => storeNodes
});
module.exports = __toCommonJS(serializer_exports);
var import_text_core = require("@hcengineering/text-core");
var import_html = require("@tiptap/html");
var import_extensions = require("../extensions");
var import_marks = require("./marks");
var import_node = require("./node");
function backticksFor(side) {
  return side ? "`" : "`";
}
__name(backticksFor, "backticksFor");
function isPlainURL(link, parent, index) {
  if (link.attrs.title !== void 0 || !/^\w+:/.test(link.attrs.href)) return false;
  const content = parent.content?.[index];
  if (content === void 0) {
    return false;
  }
  if (content.type !== import_text_core.MarkupNodeType.text || content.text !== link.attrs.href || content.marks?.[content.marks.length - 1] !== link) {
    return false;
  }
  return index === (parent.content?.length ?? 0) - 1 || !(0, import_marks.isInSet)(link, parent.content?.[index + 1]?.marks ?? []);
}
__name(isPlainURL, "isPlainURL");
const formatTodoItem = /* @__PURE__ */ __name((i, attrs, parentAttrs) => {
  const meta = attrs?.todoid !== void 0 && attrs?.userid !== void 0 ? `<!-- todoid=${attrs?.todoid},userid=${attrs?.userid} -->` : "";
  const bullet = parentAttrs?.bullet ?? "*";
  return `${bullet} [${attrs?.checked === true ? "x" : " "}] ${meta}`;
}, "formatTodoItem");
const storeNodes = {
  blockquote: /* @__PURE__ */ __name((state, node) => {
    state.wrapBlock("> ", null, node, () => {
      state.renderContent(node);
    });
  }, "blockquote"),
  codeBlock: /* @__PURE__ */ __name((state, node) => {
    state.write(`\`\`\`${(0, import_node.nodeAttrs)(node).language ?? ""}
`);
    state.renderInline(node);
    state.ensureNewLine();
    state.write("```");
    state.closeBlock(node);
  }, "codeBlock"),
  mermaid: /* @__PURE__ */ __name((state, node) => {
    state.write("```mermaid\n");
    state.renderInline(node);
    state.ensureNewLine();
    state.write("```");
    state.closeBlock(node);
  }, "mermaid"),
  heading: /* @__PURE__ */ __name((state, node) => {
    const attrs = (0, import_node.nodeAttrs)(node);
    if (attrs.marker === "=" && attrs.level === 1) {
      state.renderInline(node);
      state.ensureNewLine();
      state.write("===\n");
    } else if (attrs.marker === "-" && attrs.level === 2) {
      state.renderInline(node);
      state.ensureNewLine();
      state.write("---\n");
    } else {
      state.write(state.repeat("#", attrs.level !== void 0 ? Number(attrs.level) : 1) + " ");
      state.renderInline(node);
    }
    state.closeBlock(node);
  }, "heading"),
  horizontalRule: /* @__PURE__ */ __name((state, node) => {
    state.write(`${(0, import_node.nodeAttrs)(node).markup ?? "---"}`);
    state.closeBlock(node);
  }, "horizontalRule"),
  bulletList: /* @__PURE__ */ __name((state, node) => {
    state.renderList(node, "  ", () => `${(0, import_node.nodeAttrs)(node).bullet ?? "*"} `);
  }, "bulletList"),
  taskList: /* @__PURE__ */ __name((state, node) => {
    state.renderList(node, "  ", () => "* [ ] ");
  }, "taskList"),
  todoList: /* @__PURE__ */ __name((state, node) => {
    state.renderList(node, "  ", formatTodoItem);
  }, "todoList"),
  orderedList: /* @__PURE__ */ __name((state, node) => {
    let start = 1;
    if ((0, import_node.nodeAttrs)(node).order !== void 0) {
      start = Number((0, import_node.nodeAttrs)(node).order);
    }
    const maxW = String(start + (0, import_node.messageContent)(node).length - 1).length;
    const space = state.repeat(" ", maxW + 2);
    state.renderList(node, space, (i) => {
      const nStr = String(start + i);
      return state.repeat(" ", maxW - nStr.length) + nStr + ". ";
    });
  }, "orderedList"),
  listItem: /* @__PURE__ */ __name((state, node) => {
    state.renderContent(node);
  }, "listItem"),
  taskItem: /* @__PURE__ */ __name((state, node) => {
    state.renderContent(node);
  }, "taskItem"),
  todoItem: /* @__PURE__ */ __name((state, node) => {
    state.renderContent(node);
  }, "todoItem"),
  paragraph: /* @__PURE__ */ __name((state, node) => {
    state.renderInline(node);
    state.closeBlock(node);
  }, "paragraph"),
  subLink: /* @__PURE__ */ __name((state, node) => {
    state.write("<sub>");
    state.renderAHref = true;
    state.renderInline(node);
    state.renderAHref = false;
    state.write("</sub>");
  }, "subLink"),
  image: /* @__PURE__ */ __name((state, node) => {
    const attrs = (0, import_node.nodeAttrs)(node);
    if (attrs.token != null && attrs["file-id"] != null) {
      state.write(
        "![" + state.esc(`${attrs.alt ?? ""}`) + "](" + (state.imageUrl + `${attrs["file-id"]}?file=${attrs["file-id"]}` + (attrs.width != null ? "&width=" + state.esc(`${attrs.width}`) : "") + (attrs.height != null ? "&height=" + state.esc(`${attrs.height}`) : "") + (attrs.token != null ? "&token=" + state.esc(`${attrs.token}`) : "")) + (attrs.title != null ? " " + state.quote(`${attrs.title}`) : "") + ")"
      );
    } else if (attrs["file-id"] != null) {
      state.write(
        "![" + state.esc(`${attrs.alt ?? ""}`) + "](" + (state.imageUrl + `${attrs["file-id"]}` + (attrs.width != null ? "&width=" + state.esc(`${attrs.width}`) : "") + (attrs.height != null ? "&height=" + state.esc(`${attrs.height}`) : "")) + (attrs.title != null ? " " + state.quote(`${attrs.title}`) : "") + ")"
      );
    } else {
      if (attrs.width != null || attrs.height != null) {
        state.write(
          "<img" + (attrs.width != null ? ` width="${state.esc(`${attrs.width}`)}"` : "") + (attrs.height != null ? ` height="${state.esc(`${attrs.height}`)}"` : "") + ` src="${state.esc(`${attrs.src}`)}"` + (attrs.alt != null ? ` alt="${state.esc(`${attrs.alt}`)}"` : "") + (attrs.title != null ? ">" + state.quote(`${attrs.title}`) + "</img>" : ">")
        );
      } else {
        state.write(
          "![" + state.esc(`${attrs.alt ?? ""}`) + "](" + state.esc(`${attrs.src}`) + (attrs.title != null ? " " + state.quote(`${attrs.title}`) : "") + ")"
        );
      }
    }
  }, "image"),
  reference: /* @__PURE__ */ __name((state, node) => {
    const attrs = (0, import_node.nodeAttrs)(node);
    let url = state.refUrl;
    if (!url.includes("?")) {
      url += "?";
    } else {
      url += "&";
    }
    state.write(
      "[" + state.esc(`${attrs.label ?? ""}`) + `](${url}${makeQuery({
        _class: attrs.objectclass,
        _id: attrs.id,
        label: attrs.label
      })}` + (attrs.title !== void 0 ? " " + state.quote(`${attrs.title}`) : "") + ")"
    );
  }, "reference"),
  markdown: /* @__PURE__ */ __name((state, node) => {
    state.renderInline(node);
    state.closeBlock(node);
  }, "markdown"),
  comment: /* @__PURE__ */ __name((state, node) => {
    state.write("<!--");
    state.renderInline(node);
    state.write("-->");
  }, "comment"),
  hardBreak: /* @__PURE__ */ __name((state, node, parent, index) => {
    const content = (0, import_node.messageContent)(parent);
    for (let i = index + 1; i < content.length; i++) {
      if (content[i].type !== node.type) {
        state.write("\\\n");
        return;
      }
    }
  }, "hardBreak"),
  text: /* @__PURE__ */ __name((state, node) => {
    state.text(node.text ?? "");
  }, "text"),
  table: /* @__PURE__ */ __name((state, node) => {
    const html = (0, import_html.generateHTML)(node, import_extensions.defaultExtensions);
    state.write("<table><tbody>" + html + "</tbody></table>");
    state.closeBlock(node);
  }, "table")
};
const storeMarks = {
  em: {
    open: "*",
    close: "*",
    mixable: true,
    expelEnclosingWhitespace: true,
    escape: true
  },
  italic: {
    open: "*",
    close: "*",
    mixable: true,
    expelEnclosingWhitespace: true,
    escape: true
  },
  bold: {
    open: "**",
    close: "**",
    mixable: true,
    expelEnclosingWhitespace: true,
    escape: true
  },
  strong: {
    open: "**",
    close: "**",
    mixable: true,
    expelEnclosingWhitespace: true,
    escape: true
  },
  strike: {
    open: "~~",
    close: "~~",
    mixable: true,
    expelEnclosingWhitespace: true,
    escape: true
  },
  underline: {
    open: "<ins>",
    close: "</ins>",
    mixable: true,
    expelEnclosingWhitespace: true,
    escape: true
  },
  link: {
    open: /* @__PURE__ */ __name((state, mark, parent, index) => {
      if (state.renderAHref === true) {
        return `<a href="${encodeURI(mark.attrs.href)}">`;
      } else {
        state.inAutolink = isPlainURL(mark, parent, index);
        return state.inAutolink ? "<" : "[";
      }
    }, "open"),
    close: /* @__PURE__ */ __name((state, mark, parent, index) => {
      if (state.renderAHref === true) {
        return "</a>";
      } else {
        const { inAutolink } = state;
        state.inAutolink = void 0;
        return inAutolink === true ? ">" : "](" + // eslint-disable-next-line
        mark.attrs.href.replace(/[\(\)"]/g, "\\$&") + (mark.attrs.title !== void 0 ? ` "${mark.attrs.title.replace(/"/g, '\\"')}"` : "") + ")";
      }
    }, "close"),
    mixable: false,
    expelEnclosingWhitespace: false,
    escape: true
  },
  code: {
    open: /* @__PURE__ */ __name((state, mark, parent, index) => {
      return backticksFor(false);
    }, "open"),
    close: /* @__PURE__ */ __name((state, mark, parent, index) => {
      return backticksFor(true);
    }, "close"),
    mixable: false,
    expelEnclosingWhitespace: false,
    escape: false
  }
};
class MarkdownState {
  static {
    __name(this, "MarkdownState");
  }
  nodes;
  marks;
  delim;
  out;
  closed;
  closedNode;
  inTightList;
  options;
  refUrl;
  imageUrl;
  constructor(nodes = storeNodes, marks = storeMarks, options = { tightLists: true, refUrl: "ref://", imageUrl: "http://" }) {
    this.nodes = nodes;
    this.marks = marks;
    this.delim = this.out = "";
    this.closed = false;
    this.inTightList = false;
    this.refUrl = options.refUrl;
    this.imageUrl = options.imageUrl;
    this.options = options;
  }
  flushClose(size) {
    if (this.closed) {
      if (!this.atBlank()) this.out += "\n";
      if (size > 1) {
        this.addDelim(size);
      }
      this.closed = false;
    }
  }
  addDelim(size) {
    let delimMin = this.delim;
    const trim = /\s+$/.exec(delimMin);
    if (trim !== null) {
      delimMin = delimMin.slice(0, delimMin.length - trim[0].length);
    }
    for (let i = 1; i < size; i++) {
      this.out += delimMin + "\n";
    }
  }
  wrapBlock(delim, firstDelim, node, f) {
    const old = this.delim;
    this.write(firstDelim ?? delim);
    this.delim += delim;
    f();
    this.delim = old;
    this.closeBlock(node);
  }
  atBlank() {
    return /(^|\n)$/.test(this.out);
  }
  // :: ()
  // Ensure the current content ends with a newline.
  ensureNewLine() {
    if (!this.atBlank()) this.out += "\n";
  }
  // :: (?string)
  // Prepare the state for writing output (closing closed paragraphs,
  // adding delimiters, and so on), and then optionally add content
  // (unescaped) to the output.
  write(content) {
    this.flushClose(2);
    if (this.delim !== void 0 && this.atBlank()) this.out += this.delim;
    if (content.length > 0) this.out += content;
  }
  // :: (Node)
  // Close the block for the given node.
  closeBlock(node) {
    this.closedNode = node;
    this.closed = true;
  }
  // :: (string, ?bool)
  // Add the given text to the document. When escape is not `false`,
  // it will be escaped.
  text(text, escape = false) {
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const startOfLine = this.atBlank() || this.closed;
      this.write("");
      this.out += escape ? this.esc(lines[i], startOfLine) : lines[i];
      if (i !== lines.length - 1) this.out += "\n";
    }
  }
  // :: (Node)
  // Render the given node as a block.
  render(node, parent, index) {
    if (this.nodes[node.type] === void 0) {
      throw new Error("Token type `" + node.type + "` not supported by Markdown renderer");
    }
    this.nodes[node.type](this, node, parent, index);
  }
  // :: (Node)
  // Render the contents of `parent` as block nodes.
  renderContent(parent) {
    (0, import_node.messageContent)(parent).forEach((node, i) => {
      this.render(node, parent, i);
    });
  }
  reorderMixableMark(state, mark, i, len) {
    for (let j = 0; j < state.active.length; j++) {
      const other = state.active[j];
      if (!this.marks[other.type].mixable || this.checkSwitchMarks(i, j, state, mark, other, len)) {
        break;
      }
    }
  }
  reorderMixableMarks(state, len) {
    for (let i = 0; i < len; i++) {
      const mark = state.marks[i];
      const mm = this.marks[mark.type];
      if (mm == null) {
        break;
      }
      if (!mm.mixable) break;
      this.reorderMixableMark(state, mark, i, len);
    }
  }
  checkSwitchMarks(i, j, state, mark, other, len) {
    if (!(0, import_marks.markEq)(mark, other) || i === j) {
      return false;
    }
    this.switchMarks(i, j, state, mark, len);
    return true;
  }
  switchMarks(i, j, state, mark, len) {
    if (i > j) {
      state.marks = state.marks.slice(0, j).concat(mark).concat(state.marks.slice(j, i)).concat(state.marks.slice(i + 1, len));
    }
    if (j > i) {
      state.marks = state.marks.slice(0, i).concat(state.marks.slice(i + 1, j)).concat(mark).concat(state.marks.slice(j, len));
    }
  }
  renderNodeInline(state, index) {
    state.marks = state.node?.marks ?? [];
    this.updateHardBreakMarks(state, index);
    const leading = this.adjustLeading(state);
    const inner = state.marks.length > 0 ? state.marks[state.marks.length - 1] : void 0;
    const noEsc = inner !== void 0 && !(this.marks[inner.type]?.escape ?? false);
    const len = state.marks.length - (noEsc ? 1 : 0);
    this.reorderMixableMarks(state, len);
    this.checkCloseMarks(state, len, index);
    if (leading !== "") this.text(leading);
    this.checkOpenMarks(state, len, index, inner, noEsc);
  }
  checkOpenMarks(state, len, index, inner, noEsc) {
    if (state.node !== void 0) {
      this.updateActiveMarks(state, len, index);
      if (this.isNoEscapeRequire(state.node, inner, noEsc, state)) {
        this.renderMarkText(inner, state, index);
      } else {
        this.render(state.node, state.parent, index);
      }
    }
  }
  isNoEscapeRequire(node, inner, noEsc, state) {
    return inner !== void 0 && noEsc && node.type === import_text_core.MarkupNodeType.text;
  }
  renderMarkText(inner, state, index) {
    this.text(
      this.markString(inner, true, state.parent, index) + state.node?.text + this.markString(inner, false, state.parent, index + 1),
      false
    );
  }
  updateActiveMarks(state, len, index) {
    while (state.active.length < len) {
      const add = state.marks[state.active.length];
      state.active.push(add);
      this.text(this.markString(add, true, state.parent, index), false);
    }
  }
  checkCloseMarks(state, len, index) {
    let keep = 0;
    while (keep < Math.min(state.active.length, len) && (0, import_marks.markEq)(state.marks[keep], state.active[keep])) {
      ++keep;
    }
    while (keep < state.active.length) {
      const mark = state.active.pop();
      if (mark !== void 0) {
        this.text(this.markString(mark, false, state.parent, index), false);
      }
    }
  }
  adjustLeading(state) {
    let leading = state.trailing;
    state.trailing = "";
    const node = state?.node;
    if (this.isText(node) && this.isMarksHasExpelEnclosingWhitespace(state)) {
      const match = /^(\s*)(.*?)(\s*)$/m.exec(node?.text ?? "");
      if (match !== null) {
        const [leadMatch, innerMatch, trailMatch] = [match[1], match[2], match[3]];
        leading += leadMatch;
        state.trailing = trailMatch;
        this.adjustLeadingTextNode(leadMatch, trailMatch, state, innerMatch, node);
      }
    }
    return leading;
  }
  isMarksHasExpelEnclosingWhitespace(state) {
    return state.marks.some((mark) => this.marks[mark.type]?.expelEnclosingWhitespace);
  }
  adjustLeadingTextNode(lead, trail, state, inner, node) {
    if (lead !== "" || trail !== "") {
      state.node = inner !== void 0 ? { ...node, text: inner } : void 0;
      if (state.node === void 0) {
        state.marks = state.active;
      }
    }
  }
  updateHardBreakMarks(state, index) {
    if (state.node !== void 0 && state.node.type === import_text_core.MarkupNodeType.hard_break) {
      state.marks = this.filterHardBreakMarks(state.marks, index, state);
    }
  }
  filterHardBreakMarks(marks, index, state) {
    const content = state.parent.content ?? [];
    const next = content[index + 1];
    if (!this.isHardbreakText(next)) {
      return [];
    }
    return marks.filter((m) => (0, import_marks.isInSet)(m, next.marks ?? []));
  }
  isHardbreakText(next) {
    return next !== void 0 && (next.type !== import_text_core.MarkupNodeType.text || next.text !== void 0 && /\S/.test(next.text));
  }
  isText(node) {
    return node !== void 0 && node.type === import_text_core.MarkupNodeType.text && node.text !== void 0;
  }
  // :: (Node)
  // Render the contents of `parent` as inline content.
  renderInline(parent) {
    const state = { active: [], trailing: "", parent, marks: [] };
    (0, import_node.messageContent)(parent).forEach((nde, index) => {
      state.node = nde;
      this.renderNodeInline(state, index);
    });
    state.node = void 0;
    this.renderNodeInline(state, 0);
  }
  // :: (Node, string, (number) → string)
  // Render a node's content as a list. `delim` should be the extra
  // indentation added to all lines except the first in an item,
  // `firstDelim` is a function going from an item index to a
  // delimiter for the first line of the item.
  renderList(node, delim, firstDelim) {
    this.flushListClose(node);
    const isTight = typeof node.attrs?.tight !== "undefined" ? node.attrs.tight === "true" : this.options.tightLists;
    const prevTight = this.inTightList;
    this.inTightList = isTight;
    (0, import_node.messageContent)(node).forEach((child, i) => {
      this.renderListItem(node, child, i, isTight, delim, firstDelim);
    });
    this.inTightList = prevTight;
  }
  renderListItem(node, child, i, isTight, delim, firstDelim) {
    if (i > 0 && isTight) this.flushClose(1);
    this.wrapBlock(delim, firstDelim(i, node.content?.[i].attrs, node.attrs), node, () => {
      this.render(child, node, i);
    });
  }
  flushListClose(node) {
    if (this.closed && this.closedNode?.type === node.type) {
      this.flushClose(3);
    } else if (this.inTightList) {
      this.flushClose(1);
    }
  }
  // :: (string, ?bool) → string
  // Escape the given string so that it can safely appear in Markdown
  // content. If `startOfLine` is true, also escape characters that
  // has special meaning only at the start of the line.
  esc(str, startOfLine = false) {
    if (str == null) {
      return "";
    }
    str = str.replace(/[`*\\~\[\]]/g, "\\$&");
    if (startOfLine) {
      str = str.replace(/^[:#\-*+]/, "\\$&").replace(/^(\d+)\./, "$1\\.");
    }
    return str;
  }
  quote(str) {
    const wrap = !(str?.includes('"') ?? false) ? '""' : !(str?.includes("'") ?? false) ? "''" : "()";
    return wrap[0] + str + wrap[1];
  }
  // :: (string, number) → string
  // Repeat the given string `n` times.
  repeat(str, n) {
    let out = "";
    for (let i = 0; i < n; i++) out += str;
    return out;
  }
  // : (Mark, bool, string?) → string
  // Get the markdown string for a given opening or closing mark.
  markString(mark, open, parent, index) {
    let value = mark.attrs?.marker;
    if (value === void 0) {
      const info = this.marks[mark.type];
      if (info == null) {
        throw new Error(`No info for mark ${mark.type}`);
      }
      value = open ? info.open : info.close;
    }
    return typeof value === "string" ? value : value(this, mark, parent, index) ?? "";
  }
}
function makeQuery(obj) {
  return Object.keys(obj).filter((it) => it[1] != null).map(function(k) {
    return encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]);
  }).join("&");
}
__name(makeQuery, "makeQuery");
//# sourceMappingURL=serializer.js.map
