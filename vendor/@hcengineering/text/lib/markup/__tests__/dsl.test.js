"use strict";
var import_text_core = require("@hcengineering/text-core");
var import_utils = require("../utils");
describe("dsl", () => {
  it("returns a MarkupNode for complex doc", () => {
    const doc = (0, import_text_core.nodeDoc)(
      (0, import_text_core.nodeParagraph)((0, import_text_core.nodeText)("Hello, "), (0, import_text_core.nodeReference)({ id: "123", label: "World", objectclass: "world" })),
      (0, import_text_core.nodeParagraph)(
        (0, import_text_core.nodeText)("Check out "),
        (0, import_text_core.markLink)({ href: "https://example.com", title: "this link" }, (0, import_text_core.markUnderline)((0, import_text_core.nodeText)("this link"))),
        (0, import_text_core.nodeText)(".")
      )
    );
    expect((0, import_utils.jsonToHTML)(doc)).toEqual(
      '<p>Hello, <span data-type="reference" class="antiMention" data-id="123" data-objectclass="world" data-label="World">@World</span></p><p>Check out <a target="_blank" rel="noopener noreferrer" class="cursor-pointer" href="https://example.com"><u>this link</u></a>.</p>'
    );
  });
});
describe("nodeDoc", () => {
  it('returns a MarkupNode with type "doc"', () => {
    const result = (0, import_text_core.nodeDoc)();
    expect(result.type).toEqual(import_text_core.MarkupNodeType.doc);
  });
  it("returns a MarkupNode with the provided content", () => {
    const content = [
      { type: import_text_core.MarkupNodeType.paragraph, content: [{ type: import_text_core.MarkupNodeType.text, text: "Hello" }] },
      { type: import_text_core.MarkupNodeType.paragraph, content: [{ type: import_text_core.MarkupNodeType.text, text: "World" }] }
    ];
    const result = (0, import_text_core.nodeDoc)(...content);
    expect(result.content).toEqual(content);
  });
  it("returns an empty MarkupNode if no content is provided", () => {
    const result = (0, import_text_core.nodeDoc)();
    expect(result.content).toEqual([]);
  });
});
describe("nodeParagraph", () => {
  it('returns a MarkupNode with type "paragraph"', () => {
    const result = (0, import_text_core.nodeParagraph)();
    expect(result.type).toEqual(import_text_core.MarkupNodeType.paragraph);
  });
  it("returns a MarkupNode with the provided content", () => {
    const content = [{ type: import_text_core.MarkupNodeType.text, text: "Hello" }];
    const result = (0, import_text_core.nodeParagraph)(...content);
    expect(result.content).toEqual(content);
  });
  it("returns an empty MarkupNode if no content is provided", () => {
    const result = (0, import_text_core.nodeParagraph)();
    expect(result.content).toEqual([]);
  });
});
describe("nodeText", () => {
  it('returns a MarkupNode with type "text"', () => {
    const result = (0, import_text_core.nodeText)("Hello");
    expect(result.type).toEqual(import_text_core.MarkupNodeType.text);
  });
  it("returns a MarkupNode with the provided text", () => {
    const result = (0, import_text_core.nodeText)("Hello");
    expect(result.text).toEqual("Hello");
  });
});
describe("nodeImage", () => {
  it('returns a MarkupNode with type "image"', () => {
    const attrs = { src: "image.jpg" };
    const result = (0, import_text_core.nodeImage)(attrs);
    expect(result.type).toEqual(import_text_core.MarkupNodeType.image);
  });
  it("returns a MarkupNode with the provided attributes", () => {
    const attrs = { src: "image.jpg", alt: "Image", width: 500, height: 300 };
    const result = (0, import_text_core.nodeImage)(attrs);
    expect(result.attrs).toEqual(attrs);
  });
});
describe("nodeReference", () => {
  it('returns a MarkupNode with type "reference"', () => {
    const attrs = { id: "123", label: "Reference", objectclass: "class" };
    const result = (0, import_text_core.nodeReference)(attrs);
    expect(result.type).toEqual(import_text_core.MarkupNodeType.reference);
  });
  it("returns a MarkupNode with the provided attributes", () => {
    const attrs = { id: "123", label: "Reference", objectclass: "class" };
    const result = (0, import_text_core.nodeReference)(attrs);
    expect(result.attrs).toEqual(attrs);
  });
});
//# sourceMappingURL=dsl.test.js.map
