"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var parser_exports = {};
__export(parser_exports, {
  MarkdownParser: () => MarkdownParser,
  isInlineToken: () => isInlineToken,
  isListItemToken: () => isListItemToken,
  isParagraphToken: () => isParagraphToken
});
module.exports = __toCommonJS(parser_exports);
var import_markdown_it = __toESM(require("markdown-it"));
var import_text_core = require("@hcengineering/text-core");
var import_utils = require("../markup/utils");
var import_marks = require("./marks");
var import_node = require("./node");
function readSpec(rule, tok, state) {
  if (typeof rule === "function") {
    return rule(tok, state);
  }
  return rule;
}
__name(readSpec, "readSpec");
function isText(a, b) {
  return (a.type === import_text_core.MarkupNodeType.text || a.type === import_text_core.MarkupNodeType.reference) && b.type === import_text_core.MarkupNodeType.text;
}
__name(isText, "isText");
function maybeMerge(a, b) {
  if (isText(a, b) && ((0, import_marks.sameSet)(a.marks, b.marks) || a.text === "" && (a.marks?.length ?? 0) === 0)) {
    if (a.text === "" && (a.marks?.length ?? 0) === 0) {
      return { ...b };
    }
    return { ...a, text: (a.text ?? "") + (b.text ?? "") };
  }
  return void 0;
}
__name(maybeMerge, "maybeMerge");
class MarkdownParseState {
  constructor(tokenHandlers2, refUrl, imageUrl) {
    this.refUrl = refUrl;
    this.imageUrl = imageUrl;
    this.stack = [{ type: import_text_core.MarkupNodeType.doc, attrs: {}, content: [] }];
    this.marks = [];
    this.tokenHandlers = tokenHandlers2;
  }
  static {
    __name(this, "MarkdownParseState");
  }
  stack;
  marks;
  tokenHandlers;
  top() {
    return this.stack[this.stack.length - 1];
  }
  push(elt) {
    if (this.stack.length > 0) {
      const tt = this.top();
      tt?.content.push(elt);
    }
  }
  mergeWithLast(nodes, node) {
    const last = nodes[nodes.length - 1];
    let merged;
    if (last !== void 0 && (merged = maybeMerge(last, node)) !== void 0) {
      nodes[nodes.length - 1] = merged;
      return true;
    }
    return false;
  }
  // : (string)
  // Adds the given text to the current position in the document,
  // using the current marks as styling.
  addText(text) {
    const top = this.top();
    if (text === void 0 || top === void 0 || text.length === 0) {
      return;
    }
    const node = {
      type: import_text_core.MarkupNodeType.text,
      text
    };
    if (this.marks !== void 0) {
      node.marks = this.marks;
    }
    const nodes = top.content;
    if (!this.mergeWithLast(nodes, node)) {
      nodes.push(node);
    }
  }
  addAttr(key, value) {
    const top = this.top();
    if (top === void 0) {
      return;
    }
    top.attrs[key] = value;
  }
  // : (Mark)
  // Adds the given mark to the set of active marks.
  openMark(mark) {
    this.marks = (0, import_marks.addToSet)(mark, this.marks);
  }
  // : (Mark)
  // Removes the given mark from the set of active marks.
  closeMark(mark) {
    this.marks = (0, import_marks.removeFromSet)(mark, this.marks);
  }
  parseTokens(toks) {
    const _toks = [...toks ?? []];
    while (_toks.length > 0) {
      const tok = _toks.shift();
      if (tok === void 0) {
        break;
      }
      if (tok.type === "html_inline" && tok.content.trim() === "<sub>") {
        while (_toks.length > 0) {
          const _tok = _toks.shift();
          if (_tok !== void 0) {
            tok.content += _tok.content;
            if (_tok.type === "html_inline" && _tok.content.trim() === "</sub>") {
              break;
            }
          }
        }
      }
      const handler = this.tokenHandlers[tok.type];
      if (handler === void 0) {
        throw new Error(`Token type '${String(tok.type)} not supported by Markdown parser`);
      }
      handler(this, tok);
    }
  }
  // : (NodeType, ?Object, ?[Node]) → ?Node
  // Add a node at the current position.
  addNode(type, attrs2, content = []) {
    const node = { type, content };
    if (Object.keys(attrs2 ?? {}).length > 0) {
      node.attrs = attrs2;
    }
    if (this.marks.length > 0) {
      node.marks = this.marks;
    }
    this.push(node);
    return node;
  }
  // : (NodeType, ?Object)
  // Wrap subsequent content in a node of the given type.
  openNode(type, attrs2) {
    this.stack.push({ type, attrs: attrs2, content: [] });
  }
  // : () → ?Node
  // Close and return the node that is currently on top of the stack.
  closeNode() {
    if (this.marks.length > 0) this.marks = [];
    const info = this.stack.pop();
    if (info !== void 0) {
      return this.addNode(info.type, info.attrs, info.content);
    }
    return { type: import_text_core.MarkupNodeType.doc };
  }
}
function attrs(spec, token, state) {
  return spec.getAttrs?.(token, state) ?? {};
}
__name(attrs, "attrs");
function noCloseToken(spec, type) {
  return (spec.noCloseToken ?? false) || ["code_inline", "code_block", "fence"].indexOf(type) > 0;
}
__name(noCloseToken, "noCloseToken");
function withoutTrailingNewline(str) {
  return str[str.length - 1] === "\n" ? str.slice(0, str.length - 1) : str;
}
__name(withoutTrailingNewline, "withoutTrailingNewline");
function addSpecBlock(handlers, spec, type, specBlock) {
  if (noCloseToken(spec, type)) {
    handlers[type] = newSimpleBlockHandler(specBlock, spec);
  } else {
    handlers[type + "_open"] = (state, tok) => {
      state.openNode(readSpec(specBlock, tok, state), attrs(spec, tok, state));
      if (spec.wrapContent === true) {
        state.openNode(import_text_core.MarkupNodeType.paragraph, {});
      }
    };
    handlers[type + "_close"] = (state) => {
      if (spec.wrapContent === true) {
        state.closeNode();
      }
      state.closeNode();
    };
  }
}
__name(addSpecBlock, "addSpecBlock");
function newSimpleBlockHandler(specBlock, spec) {
  return (state, tok) => {
    state.openNode(readSpec(specBlock, tok, state), attrs(spec, tok, state));
    state.addText(withoutTrailingNewline(tok.content));
    state.closeNode();
  };
}
__name(newSimpleBlockHandler, "newSimpleBlockHandler");
function addSpecMark(handlers, spec, type, specMark) {
  if (noCloseToken(spec, type)) {
    handlers[type] = newSimpleMarkHandler(spec, specMark);
  } else {
    handlers[type + "_open"] = (state, tok) => {
      state.openMark({ type: specMark, attrs: attrs(spec, tok, state) });
    };
    handlers[type + "_close"] = (state) => {
      state.closeMark(specMark);
    };
  }
}
__name(addSpecMark, "addSpecMark");
function addSpecialRule(handlers, spec, type) {
  handlers[type + "_open"] = (state, tok) => {
    const type2 = spec.type(state, tok);
    if (type2.node) {
      state.openNode(type2.type, spec.getAttrs?.(tok, state) ?? {});
    } else {
      state.openMark({ type: type2.type, attrs: spec.getAttrs?.(tok, state) ?? {} });
    }
  };
  handlers[type + "_close"] = (state, tok) => {
    const type2 = spec.type(state, tok);
    if (type2.node) {
      state.closeNode();
    } else {
      state.closeMark(type2.type);
    }
  };
}
__name(addSpecialRule, "addSpecialRule");
function addIgnoreRule(handlers, spec, type) {
  handlers[type + "_open"] = (state, tok) => {
  };
  handlers[type + "_close"] = (state, tok) => {
  };
}
__name(addIgnoreRule, "addIgnoreRule");
function newSimpleMarkHandler(spec, specMark) {
  return (state, tok) => {
    state.openMark({ attrs: attrs(spec, tok, state), type: specMark });
    state.addText(withoutTrailingNewline(tok.content));
    state.closeMark(specMark);
  };
}
__name(newSimpleMarkHandler, "newSimpleMarkHandler");
function tokenHandlers(tokensBlock2, tokensNode2, tokensMark2, specialRules, ignoreRules, extensions) {
  const handlers = {};
  Object.entries(tokensBlock2).forEach(([type, spec]) => {
    addSpecBlock(handlers, spec, type, spec.block);
  });
  Object.entries(tokensNode2).forEach(([type, spec]) => {
    addSpecNode(handlers, type, spec);
  });
  Object.entries(tokensMark2).forEach(([type, spec]) => {
    addSpecMark(handlers, spec, type, spec.mark);
  });
  Object.entries(specialRules).forEach(([type, spec]) => {
    addSpecialRule(handlers, spec, type);
  });
  Object.entries(ignoreRules).forEach(([type, spec]) => {
    addIgnoreRule(handlers, spec, type);
  });
  handlers.html_inline = (state, tok) => {
    try {
      const model = (0, import_utils.htmlToJSON)(tok.content, extensions);
      if (model.content !== void 0) {
        const shouldUnwrap = model.content.length === 1 && model.content[0].type === import_text_core.MarkupNodeType.paragraph && state.top()?.type === import_text_core.MarkupNodeType.paragraph;
        const content = (0, import_node.messageContent)(shouldUnwrap ? model.content[0] : model);
        for (const c of content) {
          state.push(c);
        }
      }
    } catch (err) {
      console.error(err);
      state.addText(tok.content);
    }
  };
  handlers.html_block = (state, tok) => {
    try {
      const model = (0, import_utils.htmlToJSON)(tok.content, extensions);
      const content = (0, import_node.messageContent)(model);
      for (const c of content) {
        state.push(c);
      }
    } catch (err) {
      console.error(err);
      state.addText(tok.content);
    }
  };
  addTextHandlers(handlers);
  return handlers;
}
__name(tokenHandlers, "tokenHandlers");
function addTextHandlers(handlers) {
  handlers.text = (state, tok) => {
    state.addText(tok.content);
  };
  handlers.inline = (state, tok) => {
    state.parseTokens(tok.children);
  };
  handlers.softbreak = (state) => {
    state.addText("\n");
  };
}
__name(addTextHandlers, "addTextHandlers");
function addSpecNode(handlers, type, spec) {
  handlers[type] = (state, tok) => state.addNode(spec.node, attrs(spec, tok, state));
}
__name(addSpecNode, "addSpecNode");
function tokAttrGet(token, name) {
  const attr = token.attrGet(name);
  if (attr != null) {
    return attr;
  }
  for (const [k, v] of token.attrs ?? []) {
    if (k === name) {
      return v;
    }
  }
}
__name(tokAttrGet, "tokAttrGet");
function tokToAttrs(token, ...names) {
  const result = {};
  for (const name of names) {
    const attr = token.attrGet(name);
    if (attr !== null) {
      result[name] = attr;
    }
  }
  return result;
}
__name(tokToAttrs, "tokToAttrs");
function todoItemMetaAttrsGet(tok) {
  const userid = tokAttrGet(tok, "userid");
  const todoid = tokAttrGet(tok, "todoid");
  const result = {};
  if (userid !== void 0) {
    result.userid = userid;
  }
  if (todoid !== void 0) {
    result.todoid = todoid;
  }
  return result;
}
__name(todoItemMetaAttrsGet, "todoItemMetaAttrsGet");
const tokensBlock = {
  blockquote: { block: import_text_core.MarkupNodeType.blockquote },
  paragraph: { block: import_text_core.MarkupNodeType.paragraph },
  list_item: { block: import_text_core.MarkupNodeType.list_item },
  task_item: { block: import_text_core.MarkupNodeType.taskItem, getAttrs: /* @__PURE__ */ __name((tok) => ({ "data-type": "taskItem" }), "getAttrs") },
  bullet_list: {
    block: import_text_core.MarkupNodeType.bullet_list,
    getAttrs: /* @__PURE__ */ __name((tok) => ({
      bullet: tok.markup
    }), "getAttrs")
  },
  todo_list: {
    block: import_text_core.MarkupNodeType.todoList,
    getAttrs: /* @__PURE__ */ __name((tok) => ({
      bullet: tok.markup
    }), "getAttrs")
  },
  todo_item: {
    block: import_text_core.MarkupNodeType.todoItem,
    getAttrs: /* @__PURE__ */ __name((tok) => ({
      checked: tokAttrGet(tok, "checked") === "true",
      ...todoItemMetaAttrsGet(tok)
    }), "getAttrs")
  },
  ordered_list: {
    block: import_text_core.MarkupNodeType.ordered_list,
    getAttrs: /* @__PURE__ */ __name((tok) => ({ order: tokAttrGet(tok, "start") ?? "1" }), "getAttrs")
  },
  task_list: {
    block: import_text_core.MarkupNodeType.taskList,
    getAttrs: /* @__PURE__ */ __name((tok) => ({ order: tokAttrGet(tok, "start") ?? "1", "data-type": "taskList" }), "getAttrs")
  },
  heading: {
    block: import_text_core.MarkupNodeType.heading,
    getAttrs: /* @__PURE__ */ __name((tok) => ({
      level: Number(tok.tag.slice(1)),
      marker: tok.markup
    }), "getAttrs")
  },
  code_block: {
    block: /* @__PURE__ */ __name((tok) => {
      if (tok.info === "mermaid") {
        return import_text_core.MarkupNodeType.mermaid;
      }
      return import_text_core.MarkupNodeType.code_block;
    }, "block"),
    getAttrs: /* @__PURE__ */ __name((tok) => {
      return { language: tok.info ?? "" };
    }, "getAttrs"),
    noCloseToken: true
  },
  fence: {
    block: /* @__PURE__ */ __name((tok) => {
      if (tok.info === "mermaid") {
        return import_text_core.MarkupNodeType.mermaid;
      }
      return import_text_core.MarkupNodeType.code_block;
    }, "block"),
    getAttrs: /* @__PURE__ */ __name((tok) => {
      return { language: tok.info ?? "" };
    }, "getAttrs"),
    noCloseToken: true
  },
  sub: {
    block: import_text_core.MarkupNodeType.code_block,
    getAttrs: /* @__PURE__ */ __name((tok) => {
      return { language: tok.info ?? "" };
    }, "getAttrs"),
    noCloseToken: false
  },
  table: {
    block: import_text_core.MarkupNodeType.table,
    noCloseToken: false
  },
  th: {
    block: import_text_core.MarkupNodeType.table_header,
    getAttrs: /* @__PURE__ */ __name((tok) => {
      return {
        colspan: Number(tok.attrGet("colspan") ?? "1"),
        rowspan: Number(tok.attrGet("rowspan") ?? "1")
      };
    }, "getAttrs"),
    wrapContent: true,
    noCloseToken: false
  },
  tr: {
    block: import_text_core.MarkupNodeType.table_row,
    noCloseToken: false
  },
  td: {
    block: import_text_core.MarkupNodeType.table_cell,
    getAttrs: /* @__PURE__ */ __name((tok) => {
      return {
        colspan: Number(tok.attrGet("colspan") ?? "1"),
        rowspan: Number(tok.attrGet("rowspan") ?? "1")
      };
    }, "getAttrs"),
    wrapContent: true,
    noCloseToken: false
  }
};
const tokensNode = {
  hr: { node: import_text_core.MarkupNodeType.horizontal_rule },
  image: {
    node: import_text_core.MarkupNodeType.image,
    getAttrs: /* @__PURE__ */ __name((tok, state) => {
      const result = tokToAttrs(tok, "src", "title", "alt", "data");
      if (tok.content !== "" && (result.alt === "" || result.alt == null)) {
        result.alt = tok.content;
      }
      if (result.src.startsWith(state.imageUrl)) {
        const url = new URL(result.src);
        result["data-type"] = "image";
        const file = url.searchParams.get("file");
        if (file != null) {
          result["file-id"] = file;
        }
        const width = url.searchParams.get("width");
        if (width != null) {
          result.width = width;
        }
        const height = url.searchParams.get("height");
        if (height != null) {
          result.height = height;
        }
      }
      return result;
    }, "getAttrs")
  },
  hardbreak: { node: import_text_core.MarkupNodeType.hard_break }
};
const tokensMark = {
  em: {
    mark: import_text_core.MarkupMarkType.em,
    getAttrs: /* @__PURE__ */ __name((tok, state) => {
      return { marker: tok.markup };
    }, "getAttrs")
  },
  bold: {
    mark: import_text_core.MarkupMarkType.bold,
    getAttrs: /* @__PURE__ */ __name((tok, state) => {
      return { marker: tok.markup };
    }, "getAttrs")
  },
  strong: {
    mark: import_text_core.MarkupMarkType.bold,
    getAttrs: /* @__PURE__ */ __name((tok, state) => {
      return { marker: tok.markup };
    }, "getAttrs")
  },
  s: { mark: import_text_core.MarkupMarkType.strike },
  u: { mark: import_text_core.MarkupMarkType.underline },
  code_inline: {
    mark: import_text_core.MarkupMarkType.code,
    noCloseToken: true
  }
};
const specialRule = {
  link: {
    type: /* @__PURE__ */ __name((state, tok) => {
      const href = tok.attrGet("href");
      if ((href?.startsWith(state.refUrl) ?? false) || state.stack[state.stack.length - 1]?.type === "reference") {
        return { type: import_text_core.MarkupNodeType.reference, node: true };
      }
      return { type: import_text_core.MarkupMarkType.link, node: false, close: true };
    }, "type"),
    getAttrs: /* @__PURE__ */ __name((tok, state) => {
      const attrs2 = tokToAttrs(tok, "href", "title");
      if (attrs2.href !== void 0) {
        try {
          const url = new URL(attrs2.href);
          if (attrs2.href.startsWith(state.refUrl) ?? false) {
            return {
              label: url.searchParams?.get("label") ?? "",
              id: url.searchParams?.get("_id") ?? "",
              objectclass: url.searchParams?.get("_class") ?? ""
            };
          }
        } catch (err) {
        }
      }
      return attrs2;
    }, "getAttrs")
  }
};
const ignoreRule = {
  thead: {},
  tbody: {}
};
const isInlineToken = /* @__PURE__ */ __name((token) => token?.type === "inline", "isInlineToken");
const isParagraphToken = /* @__PURE__ */ __name((token) => token?.type === "paragraph_open", "isParagraphToken");
const isListItemToken = /* @__PURE__ */ __name((token) => token?.type === "list_item_open", "isListItemToken");
const startsWithTodoMarkdown = /* @__PURE__ */ __name((token) => /^\[[xX \u00A0]\][ \u00A0]/.test(token.content), "startsWithTodoMarkdown");
const isCheckedTodoItem = /* @__PURE__ */ __name((token) => /^\[[xX]\][ \u00A0]/.test(token.content), "isCheckedTodoItem");
class MarkdownParser {
  constructor(extensions, refUrl, imageUrl) {
    this.extensions = extensions;
    this.refUrl = refUrl;
    this.imageUrl = imageUrl;
    this.tokenizer = (0, import_markdown_it.default)("default", {
      html: true
    });
    this.tokenizer.core.ruler.after("inline", "task_list", this.listRule);
    this.tokenizer.core.ruler.after("inline", "html_comment", this.htmlCommentRule);
    this.tokenHandlers = tokenHandlers(tokensBlock, tokensNode, tokensMark, specialRule, ignoreRule, extensions);
  }
  static {
    __name(this, "MarkdownParser");
  }
  tokenizer;
  tokenHandlers;
  parse(text) {
    const state = new MarkdownParseState(this.tokenHandlers, this.refUrl, this.imageUrl);
    let doc;
    const tokens = this.tokenizer.parse(text, {});
    state.parseTokens(tokens);
    do {
      doc = state.closeNode();
    } while (state.stack.length > 0);
    return doc;
  }
  htmlCommentRule = /* @__PURE__ */ __name((state) => {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === "html_block" || tokens[i].type === "html_inline") {
        const content = tokens[i].content.replaceAll("<!--", "<comment>").replaceAll("-->", "</comment>");
        tokens[i].content = content;
      }
    }
    return true;
  }, "htmlCommentRule");
  listRule = /* @__PURE__ */ __name((state) => {
    const tokens = state.tokens;
    const states = [];
    for (let open = 0; open < tokens.length; open++) {
      if (isTodoListItem(tokens, open)) {
        convertTodoItem(tokens, open);
      }
    }
    let listCloseIdx = -1;
    let itemCloseIdx = -1;
    for (let i = tokens.length - 1; i >= 0; i--) {
      if (tokens[i].type === "bullet_list_close") {
        states.push({ closeIdx: listCloseIdx, lastItemIdx: itemCloseIdx });
        listCloseIdx = tokens.length - i;
        itemCloseIdx = -1;
      } else if (tokens[i].type === "list_item_close" || tokens[i].type === "todo_item_close") {
        if (itemCloseIdx === -1) {
          itemCloseIdx = tokens.length - i;
        } else if (tokens[i].type !== tokens[tokens.length - itemCloseIdx].type) {
          const bulletListOpen = new state.Token("bullet_list_open", "ul", 1);
          bulletListOpen.markup = tokens[i + 1].markup;
          tokens.splice(i + 1, 0, bulletListOpen);
          tokens.splice(i + 1, 0, new state.Token("bullet_list_close", "ul", -1));
          convertTodoList(tokens, i + 2, tokens.length - listCloseIdx, tokens.length - itemCloseIdx);
          listCloseIdx = tokens.length - i - 1;
          itemCloseIdx = tokens.length - i;
        }
      } else if (tokens[i].type === "bullet_list_open") {
        if (itemCloseIdx !== -1) {
          convertTodoList(tokens, i, tokens.length - listCloseIdx, tokens.length - itemCloseIdx);
        }
        const prevState = states.pop() ?? { closeIdx: -1, lastItemIdx: -1 };
        listCloseIdx = prevState.closeIdx;
        itemCloseIdx = prevState.lastItemIdx;
      }
    }
    return true;
  }, "listRule");
}
function convertTodoList(tokens, open, close, item) {
  if (tokens[open].type !== "bullet_list_open") {
    throw new Error("bullet_list_open token expected");
  }
  if (tokens[close].type !== "bullet_list_close") {
    throw new Error("bullet_list_close token expected");
  }
  if (tokens[item].type === "todo_item_close") {
    tokens[open].type = "todo_list_open";
    tokens[close].type = "todo_list_close";
  }
}
__name(convertTodoList, "convertTodoList");
function convertTodoItem(tokens, open) {
  const close = findListItemCloseToken(tokens, open);
  if (close !== -1) {
    tokens[open].type = "todo_item_open";
    tokens[close].type = "todo_item_close";
    const inline = tokens[open + 2];
    if (tokens[open].attrs == null) {
      tokens[open].attrs = [];
    }
    ;
    tokens[open].attrs.push(["checked", isCheckedTodoItem(inline) ? "true" : "false"]);
    if (inline.children !== null) {
      const newContent = inline.children[0].content.slice(4);
      if (newContent.length > 0) {
        inline.children[0].content = newContent;
      } else {
        inline.children = inline.children.slice(1);
      }
      const metaTok = inline.children.find(
        (tok) => tok.type === "html_inline" && tok.content.startsWith("<!--") && tok.content.endsWith("-->")
      );
      if (metaTok !== void 0) {
        const metaValues = metaTok.content.slice(5, -4).split(",");
        for (const mv of metaValues) {
          if (mv.startsWith("todoid")) {
            ;
            tokens[open].attrs.push(["todoid", mv.slice(7)]);
          }
          if (mv.startsWith("userid")) {
            ;
            tokens[open].attrs.push(["userid", mv.slice(7)]);
          }
        }
      }
    }
    return true;
  }
  return false;
}
__name(convertTodoItem, "convertTodoItem");
function findListItemCloseToken(tokens, open) {
  if (tokens[open].type !== "list_item_open") {
    throw new Error("list_item_open token expected");
  }
  const level = tokens[open].level;
  for (let close = open + 1; close < tokens.length; close++) {
    if (tokens[close].type === "list_item_close" && tokens[close].level === level) {
      return close;
    }
  }
  return -1;
}
__name(findListItemCloseToken, "findListItemCloseToken");
function isTodoListItem(tokens, pos) {
  return isListItemToken(tokens[pos]) && isParagraphToken(tokens[pos + 1]) && isInlineToken(tokens[pos + 2]) && startsWithTodoMarkdown(tokens[pos + 2]);
}
__name(isTodoListItem, "isTodoListItem");
//# sourceMappingURL=parser.js.map
