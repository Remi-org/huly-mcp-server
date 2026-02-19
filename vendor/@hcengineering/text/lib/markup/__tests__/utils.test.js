"use strict";
var import_text_core = require("@hcengineering/text-core");
var import_core = require("@tiptap/core");
var import_server_kit = require("../../kits/server-kit");
var import_utils = require("../utils");
jest.mock("@tiptap/html", () => ({
  generateHTML: jest.fn(() => "<p>hello</p>"),
  generateJSON: jest.fn(() => ({
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text: "hello" }] }]
  }))
}));
const extensions = [import_server_kit.ServerKit];
describe("EmptyMarkup", () => {
  it("is empty markup", async () => {
    const editor = new import_core.Editor({ extensions });
    expect((0, import_text_core.isEmptyMarkup)((0, import_utils.getMarkup)(editor))).toBeTruthy();
  });
});
describe("getMarkup", () => {
  it("with empty content", async () => {
    const editor = new import_core.Editor({ extensions });
    expect((0, import_utils.getMarkup)(editor)).toEqual('{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":null}}]}');
  });
  it("with some content", async () => {
    const editor = new import_core.Editor({ extensions, content: "<p>hello</p>" });
    expect((0, import_utils.getMarkup)(editor)).toEqual(
      '{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"hello"}]}]}'
    );
  });
  it("with empty paragraphs as content", async () => {
    const editor = new import_core.Editor({ extensions, content: "<p></p><p></p>" });
    expect((0, import_utils.getMarkup)(editor)).toEqual(
      '{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":null}},{"type":"paragraph","attrs":{"textAlign":null}}]}'
    );
  });
});
describe("isEmptyMarkup", () => {
  it("returns true for undefined content", async () => {
    expect((0, import_text_core.isEmptyMarkup)(void 0)).toBeTruthy();
    expect((0, import_text_core.isEmptyMarkup)("")).toBeTruthy();
  });
  it("returns true for empty content", async () => {
    const editor = new import_core.Editor({ extensions });
    expect((0, import_text_core.isEmptyMarkup)((0, import_utils.getMarkup)(editor))).toBeTruthy();
  });
  it("returns true for empty paragraphs content", async () => {
    const editor = new import_core.Editor({ extensions, content: "<p></p><p></p><p></p>" });
    expect((0, import_text_core.isEmptyMarkup)((0, import_utils.getMarkup)(editor))).toBeTruthy();
  });
  it("returns true for empty paragraphs content with spaces", async () => {
    const editor = new import_core.Editor({ extensions, content: "<p> </p><p> </p><p> </p>" });
    expect((0, import_text_core.isEmptyMarkup)((0, import_utils.getMarkup)(editor))).toBeTruthy();
  });
  it("returns false for not empty content", async () => {
    const editor = new import_core.Editor({ extensions, content: "<p>hello</p>" });
    expect((0, import_text_core.isEmptyMarkup)((0, import_utils.getMarkup)(editor))).toBeFalsy();
  });
  it("returns true for various empty content", async () => {
    expect((0, import_text_core.isEmptyMarkup)((0, import_text_core.jsonToMarkup)({ type: import_text_core.MarkupNodeType.doc }))).toBeTruthy();
    expect((0, import_text_core.isEmptyMarkup)((0, import_text_core.jsonToMarkup)({ type: import_text_core.MarkupNodeType.doc, content: [] }))).toBeTruthy();
    expect(
      (0, import_text_core.isEmptyMarkup)((0, import_text_core.jsonToMarkup)({ type: import_text_core.MarkupNodeType.doc, content: [{ type: import_text_core.MarkupNodeType.paragraph }] }))
    ).toBeTruthy();
    expect(
      (0, import_text_core.isEmptyMarkup)(
        (0, import_text_core.jsonToMarkup)({ type: import_text_core.MarkupNodeType.doc, content: [{ type: import_text_core.MarkupNodeType.paragraph, content: [] }] })
      )
    ).toBeTruthy();
  });
});
describe("areEqualMarkups", () => {
  it("returns true for the same content", async () => {
    const markup = '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"hello"}]}]}';
    expect((0, import_text_core.areEqualMarkups)(markup, markup)).toBeTruthy();
  });
  it("returns true for empty content", async () => {
    expect(
      (0, import_text_core.areEqualMarkups)('{"type":"doc","content":[]}', '{"type":"doc","content":[{"type":"paragraph"}]}')
    ).toBeTruthy();
    expect(
      (0, import_text_core.areEqualMarkups)(
        '{"type":"doc","content":[{"type":"paragraph"}]}',
        '{"type":"doc","content":[{"type":"paragraph","content":[]}]}'
      )
    ).toBeTruthy();
  });
  it("returns true for same content but empty marks and attrs", async () => {
    expect(
      (0, import_text_core.areEqualMarkups)(
        '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"hello"}]}]}',
        '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"hello","content":[],"marks":[],"attrs": {"color": null}}]}]}'
      )
    ).toBeTruthy();
  });
  it("returns false for same content but trailing hard breaks", async () => {
    expect(
      (0, import_text_core.areEqualMarkups)(
        '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"hello","marks":[]}]}]}',
        '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"hello"},{"type":"hardBreak"}]}]}'
      )
    ).toBeFalsy();
    expect(
      (0, import_text_core.areEqualMarkups)(
        '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"hello"}]}]}',
        '{"type":"doc","content":[{"type":"hardBreak"},{"type":"paragraph","content":[{"type":"text","text":"hello"}]},{"type":"hardBreak"}]}'
      )
    ).toBeFalsy();
  });
  it("returns false for different content", async () => {
    expect(
      (0, import_text_core.areEqualMarkups)(
        '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"hello"}]}]}',
        '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"world"}]}]}'
      )
    ).toBeFalsy();
  });
  it("returns false for different marks", async () => {
    expect(
      (0, import_text_core.areEqualMarkups)(
        '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"hello","marks":[{"type":"bold"}]}]}]}',
        '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"hello","marks":[{"type":"italic"}]}]}]}'
      )
    ).toBeFalsy();
  });
});
describe("isEmptyNode", () => {
  it("returns true for empty doc node", () => {
    const node = {
      type: import_text_core.MarkupNodeType.doc,
      content: []
    };
    expect((0, import_text_core.isEmptyNode)(node)).toBeTruthy();
  });
  it("returns true for empty paragraph node", () => {
    const node = {
      type: import_text_core.MarkupNodeType.doc,
      content: [
        {
          type: import_text_core.MarkupNodeType.paragraph,
          content: []
        }
      ]
    };
    expect((0, import_text_core.isEmptyNode)(node)).toBeTruthy();
  });
  it("returns true for empty text node", () => {
    const node = {
      type: import_text_core.MarkupNodeType.doc,
      content: [
        {
          type: import_text_core.MarkupNodeType.paragraph,
          content: [
            {
              type: import_text_core.MarkupNodeType.text,
              text: ""
            }
          ]
        }
      ]
    };
    expect((0, import_text_core.isEmptyNode)(node)).toBeTruthy();
  });
  it("returns false for non-empty text node", () => {
    const node = {
      type: import_text_core.MarkupNodeType.paragraph,
      content: [
        {
          type: import_text_core.MarkupNodeType.text,
          text: "Hello, world!"
        }
      ]
    };
    expect((0, import_text_core.isEmptyNode)(node)).toBeFalsy();
  });
  it("returns false for non-empty text node", () => {
    const node = {
      type: import_text_core.MarkupNodeType.paragraph,
      content: [
        {
          type: import_text_core.MarkupNodeType.horizontal_rule
        }
      ]
    };
    expect((0, import_text_core.isEmptyNode)(node)).toBeFalsy();
  });
  it("returns false for non-empty node", () => {
    const node = {
      type: import_text_core.MarkupNodeType.paragraph,
      content: [
        {
          type: import_text_core.MarkupNodeType.text,
          text: "Hello, world!"
        }
      ]
    };
    expect((0, import_text_core.isEmptyNode)(node)).toBeFalsy();
  });
});
describe("pmNodeToMarkup", () => {
  it("converts ProseMirrorNode to Markup", () => {
    const schema = (0, import_core.getSchema)(extensions);
    const node = schema.node("paragraph", {}, [schema.text("Hello, world!")]);
    expect((0, import_utils.pmNodeToMarkup)(node)).toEqual(
      '{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"Hello, world!"}]}'
    );
  });
});
describe("markupToPmNode", () => {
  it("converts markup to ProseMirrorNode", () => {
    const markup = '{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"Hello, world!"}]}';
    const node = (0, import_utils.markupToPmNode)(markup);
    expect(node.type.name).toEqual("paragraph");
    expect(node.content.childCount).toEqual(1);
    expect(node.content.child(0).type.name).toEqual("text");
    expect(node.content.child(0).text).toEqual("Hello, world!");
  });
});
describe("markupToJSON", () => {
  it("with empty content", async () => {
    expect((0, import_text_core.markupToJSON)("")).toEqual({ type: "doc", content: [{ type: "paragraph", content: [] }] });
  });
  it("with some content", async () => {
    const markup = '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"hello"}]}]}';
    expect((0, import_text_core.markupToJSON)(markup)).toEqual({
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "text", text: "hello" }] }]
    });
  });
});
describe("jsonToMarkup", () => {
  it("with some content", async () => {
    const json = {
      type: import_text_core.MarkupNodeType.doc,
      content: [
        {
          type: import_text_core.MarkupNodeType.paragraph,
          content: [
            {
              type: import_text_core.MarkupNodeType.text,
              text: "hello"
            }
          ]
        }
      ]
    };
    expect((0, import_text_core.jsonToMarkup)(json)).toEqual(
      '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"hello"}]}]}'
    );
  });
});
describe("pmNodeToJSON", () => {
  it("converts ProseMirrorNode to Markup", () => {
    const schema = (0, import_core.getSchema)(extensions);
    const node = schema.node("paragraph", {}, [schema.text("Hello, world!")]);
    const json = {
      type: import_text_core.MarkupNodeType.paragraph,
      attrs: { textAlign: null },
      content: [(0, import_text_core.nodeText)("Hello, world!")]
    };
    expect((0, import_utils.pmNodeToJSON)(node)).toEqual(json);
  });
});
describe("jsonToPmNode", () => {
  it("converts json to ProseMirrorNode", () => {
    const markup = '{"type":"paragraph","content":[{"type":"text","text":"Hello, world!"}]}';
    const node = (0, import_utils.markupToPmNode)(markup);
    expect(node.type.name).toEqual("paragraph");
    expect(node.content.childCount).toEqual(1);
    expect(node.content.child(0).type.name).toEqual("text");
    expect(node.content.child(0).text).toEqual("Hello, world!");
  });
});
describe("htmlToMarkup", () => {
  it("converts HTML to Markup", () => {
    const html = "<p>hello</p>";
    const expectedMarkup = '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"hello"}]}]}';
    expect((0, import_utils.htmlToMarkup)(html)).toEqual(expectedMarkup);
  });
});
describe("markupToHTML", () => {
  it("converts markup to HTML", () => {
    const markup = '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"hello"}]}]}';
    const expectedHtml = "<p>hello</p>";
    expect((0, import_text_core.markupToHTML)(markup)).toEqual(expectedHtml);
  });
});
describe("htmlToJSON", () => {
  it("converts HTML to JSON", () => {
    const html = "<p>hello</p>";
    const json = (0, import_text_core.nodeDoc)((0, import_text_core.nodeParagraph)((0, import_text_core.nodeText)("hello")));
    expect((0, import_utils.htmlToJSON)(html)).toEqual(json);
  });
});
describe("jsonToHTML", () => {
  it("converts JSON to HTML", () => {
    const json = (0, import_text_core.nodeDoc)((0, import_text_core.nodeParagraph)((0, import_text_core.nodeText)("hello")));
    const html = "<p>hello</p>";
    expect((0, import_utils.jsonToHTML)(json)).toEqual(html);
  });
});
describe("pmNodeToHTML", () => {
  it("converts ProseMirrorNode to HTML", () => {
    const schema = (0, import_core.getSchema)(extensions);
    const node = schema.node("paragraph", {}, [schema.text("hello")]);
    expect((0, import_utils.pmNodeToHTML)(node)).toEqual("<p>hello</p>");
  });
});
describe("htmlToPmNode", () => {
  it("converts html to ProseMirrorNode", () => {
    const node = (0, import_utils.htmlToPmNode)("<p>hello</p>");
    expect(node.type.name).toEqual("doc");
    expect(node.content.childCount).toEqual(1);
    expect(node.content.child(0).type.name).toEqual("paragraph");
    expect(node.content.child(0).childCount).toEqual(1);
    expect(node.content.child(0).child(0).type.name).toEqual("text");
    expect(node.content.child(0).child(0).text).toEqual("hello");
  });
});
describe("jsonToText", () => {
  it("returns text for text node", () => {
    const node = {
      type: import_text_core.MarkupNodeType.paragraph,
      content: [
        {
          type: import_text_core.MarkupNodeType.text,
          text: "Hello, world!"
        }
      ]
    };
    expect((0, import_utils.jsonToText)(node)).toEqual("Hello, world!");
  });
  it("returns concatenated text for block node with multiple children", () => {
    const node = {
      type: import_text_core.MarkupNodeType.paragraph,
      content: [
        {
          type: import_text_core.MarkupNodeType.text,
          text: "Hello "
        },
        {
          type: import_text_core.MarkupNodeType.text,
          text: "world!"
        }
      ]
    };
    expect((0, import_utils.jsonToText)(node)).toEqual("Hello world!");
  });
  it("returns text for node with link", () => {
    const node = {
      type: import_text_core.MarkupNodeType.paragraph,
      content: [
        {
          type: import_text_core.MarkupNodeType.text,
          text: "Hello! Check out "
        },
        {
          type: import_text_core.MarkupNodeType.text,
          text: "this page",
          marks: [
            {
              type: import_text_core.MarkupMarkType.link,
              attrs: {
                href: "http://example.com/"
              }
            }
          ]
        },
        {
          type: import_text_core.MarkupNodeType.text,
          text: "!"
        }
      ]
    };
    expect((0, import_utils.jsonToText)(node)).toEqual("Hello! Check out this page!");
  });
  it("returns empty string for block node with no children", () => {
    const node = {
      type: import_text_core.MarkupNodeType.paragraph,
      content: []
    };
    expect((0, import_utils.jsonToText)(node)).toEqual("");
  });
  it("returns error for text node with no text", () => {
    const node = {
      type: import_text_core.MarkupNodeType.text,
      text: ""
    };
    expect(() => (0, import_utils.jsonToText)(node)).toThrow("Empty text nodes are not allowed");
  });
  it("returns error for block node with empty children", () => {
    const node = {
      type: import_text_core.MarkupNodeType.paragraph,
      content: [
        {
          type: import_text_core.MarkupNodeType.text,
          text: ""
        },
        {
          type: import_text_core.MarkupNodeType.text,
          text: ""
        }
      ]
    };
    expect(() => (0, import_utils.jsonToText)(node)).toThrow("Empty text nodes are not allowed");
  });
});
//# sourceMappingURL=utils.test.js.map
