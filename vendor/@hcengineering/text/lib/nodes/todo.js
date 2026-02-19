"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var todo_exports = {};
__export(todo_exports, {
  TodoItemNode: () => TodoItemNode,
  TodoListNode: () => TodoListNode
});
module.exports = __toCommonJS(todo_exports);
var import_extension_task_item = require("@tiptap/extension-task-item");
var import_extension_task_list = require("@tiptap/extension-task-list");
var import_utils = require("./utils");
const TodoItemNode = import_extension_task_item.TaskItem.extend({
  name: "todoItem",
  addOptions() {
    return {
      nested: true,
      HTMLAttributes: {},
      taskListTypeName: "todoList"
    };
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      todoid: (0, import_utils.getDataAttribute)("todoid", { default: null, keepOnSplit: false }),
      userid: (0, import_utils.getDataAttribute)("userid", { default: null, keepOnSplit: false })
    };
  }
});
const TodoListNode = import_extension_task_list.TaskList.extend({
  name: "todoList",
  addOptions() {
    return {
      itemTypeName: "todoItem",
      HTMLAttributes: {}
    };
  }
});
//# sourceMappingURL=todo.js.map
