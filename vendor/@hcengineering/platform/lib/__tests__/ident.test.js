"use strict";
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var import_platform = require("../platform");
var import_ident = require("../ident");
describe("ident", () => {
  const test = "test";
  it("should identify resources", () => {
    const ids = (0, import_platform.plugin)(test, {
      status: {
        MyString: ""
      }
    });
    expect(ids.status.MyString).toBe("test:status:MyString");
  });
  it("should merge ids", () => {
    const ids = (0, import_platform.plugin)(test, {
      resource: {
        MyString: ""
      }
    });
    const merged = (0, import_platform.mergeIds)(test, ids, {
      resource: {
        OneMore: ""
      },
      more: {
        X: ""
      }
    });
    expect(merged.resource.MyString).toBe("test:resource:MyString");
    expect(merged.resource.OneMore).toBe("test:resource:OneMore");
    expect(merged.more.X).toBe("test:more:X");
  });
  it("should fail overwriting ids", () => {
    const ids = (0, import_platform.plugin)(test, {
      resource: {
        MyString: ""
      }
    });
    const f = /* @__PURE__ */ __name(() => (0, import_platform.mergeIds)(test, ids, {
      resource: {
        MyString: "xxx"
      }
    }), "f");
    expect(f).toThrowError("'identify' overwrites");
  });
  it("should fail to parse id", () => {
    expect(() => (0, import_ident._parseId)("bad id")).toThrowError("ERROR: platform:status:InvalidId");
  });
  it("should parse id", () => {
    expect((0, import_ident._parseId)("comp:res:X")).toEqual({
      kind: "res",
      component: "comp",
      name: "X"
    });
  });
});
//# sourceMappingURL=ident.test.js.map
