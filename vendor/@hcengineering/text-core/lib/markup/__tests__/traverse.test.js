"use strict";
var import_model = require("../model");
var import_traverse = require("../traverse");
describe("traverseNode", () => {
  it("should call the callback function for each node", () => {
    const callback = jest.fn();
    const node = {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Hello, world!"
        }
      ]
    };
    (0, import_traverse.traverseNode)(node, callback);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith(node, void 0);
    expect(callback).toHaveBeenCalledWith(node.content[0], node);
  });
  it("should stop traversing if the callback returns false", () => {
    const callback = jest.fn((node2) => {
      if (node2.type === import_model.MarkupNodeType.paragraph) {
        return false;
      }
    });
    const node = {
      type: import_model.MarkupNodeType.paragraph,
      content: [
        {
          type: import_model.MarkupNodeType.text,
          text: "Hello, world!"
        }
      ]
    };
    (0, import_traverse.traverseNode)(node, callback);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(node, void 0);
  });
});
describe("traverseNodeMarks", () => {
  it("should call the callback function for each mark", () => {
    const callback = jest.fn();
    const node = {
      type: "paragraph",
      marks: [{ type: "bold" }, { type: "italic" }, { type: "underline" }]
    };
    (0, import_traverse.traverseNodeMarks)(node, callback);
    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenCalledWith(node.marks[0]);
    expect(callback).toHaveBeenCalledWith(node.marks[1]);
    expect(callback).toHaveBeenCalledWith(node.marks[2]);
  });
  it("should not call the callback function if marks are not present", () => {
    const callback = jest.fn();
    const node = {
      type: import_model.MarkupNodeType.paragraph
    };
    (0, import_traverse.traverseNodeMarks)(node, callback);
    expect(callback).not.toHaveBeenCalled();
  });
});
describe("traverseAllMarks", () => {
  it("should traverse all marks and call the callback function", () => {
    const callback = jest.fn();
    const node = {
      type: "paragraph",
      marks: [{ type: "bold" }],
      content: [
        {
          type: import_model.MarkupNodeType.text,
          text: "Hello, world!",
          marks: [{ type: "italic" }, { type: "underline" }]
        }
      ]
    };
    (0, import_traverse.traverseAllMarks)(node, callback);
    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenCalledWith(node, node.marks[0]);
    expect(callback).toHaveBeenCalledWith(node.content[0], node.content[0].marks[0]);
    expect(callback).toHaveBeenCalledWith(node.content[0], node.content[0].marks[1]);
  });
});
//# sourceMappingURL=traverse.test.js.map
