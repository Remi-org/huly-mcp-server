"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var server_kit_exports = {};
__export(server_kit_exports, {
  ServerKit: () => ServerKit
});
module.exports = __toCommonJS(server_kit_exports);
var import_core = require("@tiptap/core");
var import_extension_table = __toESM(require("@tiptap/extension-table"));
var import_extension_table_cell = __toESM(require("@tiptap/extension-table-cell"));
var import_extension_table_header = __toESM(require("@tiptap/extension-table-header"));
var import_extension_table_row = __toESM(require("@tiptap/extension-table-row"));
var import_extension_task_item = __toESM(require("@tiptap/extension-task-item"));
var import_extension_task_list = __toESM(require("@tiptap/extension-task-list"));
var import_extension_text_align = __toESM(require("@tiptap/extension-text-align"));
var import_extension_text_style = __toESM(require("@tiptap/extension-text-style"));
var import_code = require("../marks/code");
var import_colors = require("../marks/colors");
var import_inlineComment = require("../marks/inlineComment");
var import_noteBase = require("../marks/noteBase");
var import_nodeUuid = require("../marks/nodeUuid");
var import_nodes = require("../nodes");
var import_comment = require("../nodes/comment");
var import_file = require("../nodes/file");
var import_image = require("../nodes/image");
var import_markdown = require("../nodes/markdown");
var import_mermaid = require("../nodes/mermaid");
var import_reference = require("../nodes/reference");
var import_todo = require("../nodes/todo");
var import_default_kit = require("./default-kit");
const headingLevels = [1, 2, 3, 4, 5, 6];
const tableExtensions = [
  import_extension_table.default.configure({
    resizable: false,
    HTMLAttributes: {
      class: "proseTable"
    }
  }),
  import_extension_table_row.default.configure({}),
  import_extension_table_header.default.configure({}),
  import_extension_table_cell.default.configure({})
];
const taskListExtensions = [
  import_extension_task_list.default,
  import_extension_task_item.default.configure({
    nested: true,
    HTMLAttributes: {
      class: "flex flex-grow gap-1 checkbox_style"
    }
  })
];
const ServerKit = import_core.Extension.create({
  name: "serverKit",
  addExtensions() {
    const fileExtensions = this.options.file !== false ? [import_file.FileNode.configure(this.options.file)] : [];
    const imageExtensions = this.options.image !== false ? [import_image.ImageNode.configure(this.options.image)] : [];
    return [
      import_default_kit.DefaultKit.configure({
        ...this.options,
        codeBlock: false,
        code: false,
        heading: {
          levels: headingLevels
        }
      }),
      import_inlineComment.InlineCommentMark.configure({}),
      import_nodes.CodeBlockExtension.configure(import_nodes.codeBlockOptions),
      import_code.CodeExtension.configure(import_code.codeOptions),
      import_mermaid.MermaidExtension.configure(import_mermaid.mermaidOptions),
      ...tableExtensions,
      ...taskListExtensions,
      ...fileExtensions,
      ...imageExtensions,
      import_extension_text_align.default.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right"],
        defaultAlignment: null
      }),
      import_todo.TodoItemNode,
      import_todo.TodoListNode,
      import_reference.ReferenceNode,
      import_comment.CommentNode,
      import_markdown.MarkdownNode,
      import_nodeUuid.NodeUuid,
      import_noteBase.NoteBaseExtension,
      import_extension_text_style.default.configure({}),
      import_colors.TextColor.configure({}),
      import_colors.BackgroundColor.configure({ types: ["tableCell"] })
    ];
  }
});
//# sourceMappingURL=server-kit.js.map
