"use strict";
var import__ = require("..");
var import_server_kit = require("../../kits/server-kit");
var import_compare = require("../compare");
const refUrl = "ref://";
const imageUrl = "http://localhost";
const extensions = [import_server_kit.ServerKit];
const tests = [
  { name: "Italic", body: "*Asteriscs* and _Underscores_" },
  { name: "Bold", body: "**Asteriscs** and __Underscores__" },
  { name: "Bullet list with asteriscs", body: "Asterisks :\r\n* Firstly\r\n* Secondly" },
  { name: "Bullet list with dashes", body: "Dashes :\r\n- Firstly\r\n- Secondly" },
  { name: "TODO list with asteriscs", body: "* [ ] Take\n* [ ] Do\n\n" },
  { name: "TODO list with dashes", body: "- [x] Take\n- [ ] Do\n\n" },
  {
    name: "Different markers",
    body: "Asterisks bulleted list:\r\n* Asterisks: *Italic* and  **Bold*** Underscores: _Italic_ and __Bold__\r\n\r\nDash bulleted list:\r\n- Asterisks: *Italic* and  **Bold**\r\n- Underscores: _Italic_ and __Bold__\r\n-"
  },
  { name: "Single line comment", body: "<!-- Do not earase me -->" },
  {
    name: "Real with multiline comment",
    body: '"<!--\r\n\r\nPlease title your PR as follows: `module: description` (e.g. `time: fix date format`).\r\nAlways start with the thing you are fixing, then describe the fix.\r\nDon\'t use past tense (e.g. "fixed foo bar").\r\n\r\nExplain what your PR does and why.\r\n\r\nIf you are adding a new function, please document it and add tests:\r\n\r\n```\r\n// foo does foo and bar\r\nfn foo() {\r\n\r\n// file_test.v\r\nfn test_foo() {\r\n    assert foo() == ...\r\n    ...\r\n}\r\n```\r\n\r\nIf you are fixing a bug, please add a test that covers it.\r\n\r\nBefore submitting a PR, please run `v test-all` .\r\nSee also `TESTS.md`.\r\n\r\nI try to process PRs as soon as possible. They should be handled within 24 hours.\r\n\r\nApplying labels to PRs is not needed.\r\n\r\nThanks a lot for your contribution!\r\n\r\n-->\r\n\r\nThis PR fix issue #22424\r\n\r\n\r\n"'
  }
];
describe("md compatibility", () => {
  tests.forEach(({ name, body: description }) => {
    it(name, () => {
      const json = (0, import__.parseMessageMarkdown)(description, refUrl, imageUrl, extensions);
      const serialized = (0, import__.serializeMessage)(json, refUrl, imageUrl);
      expect((0, import_compare.isMarkdownsEquals)(description, serialized)).toBe(true);
    });
  });
});
//# sourceMappingURL=compare.test.js.map
