"use strict";
var import__ = require("..");
describe("mergeQueries", () => {
  it("merges query with empty query", () => {
    const q1 = { name: "john", age: { $gt: 42 } };
    const q2 = {};
    const res = { name: "john", age: { $gt: 42 } };
    expect((0, import__.mergeQueries)(q1, q2)).toEqual(res);
    expect((0, import__.mergeQueries)(q2, q1)).toEqual(res);
  });
  it("merges query with different fields", () => {
    const q1 = { name: "john" };
    const q2 = { age: { $gt: 42 } };
    const res = { name: "john", age: { $gt: 42 } };
    expect((0, import__.mergeQueries)(q1, q2)).toEqual(res);
    expect((0, import__.mergeQueries)(q2, q1)).toEqual(res);
  });
  it("merges equal field values", () => {
    expect((0, import__.mergeQueries)({ value: 42 }, { value: 42 })).toEqual({ value: 42 });
  });
  it("does not merge different field values", () => {
    const q1 = { value: 42 };
    const q2 = { value: "true" };
    const res = { value: { $in: [] } };
    expect((0, import__.mergeQueries)(q1, q2)).toEqual(res);
    expect((0, import__.mergeQueries)(q2, q1)).toEqual(res);
  });
  it("merges predicate with predicate", () => {
    expect((0, import__.mergeQueries)({ age: { $in: [41, 42] } }, { age: { $in: [42, 43] } })).toEqual({ age: { $in: [42] } });
    expect((0, import__.mergeQueries)({ age: { $in: [42, 43] } }, { age: { $in: [41, 42] } })).toEqual({ age: { $in: [42] } });
    expect((0, import__.mergeQueries)({ age: { $nin: [42] } }, { age: { $nin: [42] } })).toEqual({ age: { $nin: [42] } });
    expect((0, import__.mergeQueries)({ age: { $lt: 45 } }, { age: { $lt: 42 } })).toEqual({ age: { $lt: 42 } });
    expect((0, import__.mergeQueries)({ age: { $lt: 42 } }, { age: { $lt: 45 } })).toEqual({ age: { $lt: 42 } });
    expect((0, import__.mergeQueries)({ age: { $gt: 40 } }, { age: { $gt: 42 } })).toEqual({ age: { $gt: 42 } });
    expect((0, import__.mergeQueries)({ age: { $gt: 42 } }, { age: { $gt: 40 } })).toEqual({ age: { $gt: 42 } });
    expect((0, import__.mergeQueries)({ age: { $lte: 45 } }, { age: { $lte: 42 } })).toEqual({ age: { $lte: 42 } });
    expect((0, import__.mergeQueries)({ age: { $lte: 42 } }, { age: { $lte: 45 } })).toEqual({ age: { $lte: 42 } });
    expect((0, import__.mergeQueries)({ age: { $gte: 40 } }, { age: { $gte: 42 } })).toEqual({ age: { $gte: 42 } });
    expect((0, import__.mergeQueries)({ age: { $gte: 42 } }, { age: { $gte: 40 } })).toEqual({ age: { $gte: 42 } });
    expect((0, import__.mergeQueries)({ age: { $ne: 42 } }, { age: { $ne: 42 } })).toEqual({ age: { $ne: 42 } });
  });
  it("merges predicate with value", () => {
    expect((0, import__.mergeQueries)({ age: { $in: [41, 42, 43] } }, { age: 42 })).toEqual({ age: 42 });
    expect((0, import__.mergeQueries)({ age: 42 }, { age: { $in: [41, 42, 43] } })).toEqual({ age: 42 });
    expect((0, import__.mergeQueries)({ age: { $nin: [41, 43] } }, { age: 42 })).toEqual({ age: 42 });
    expect((0, import__.mergeQueries)({ age: 42 }, { age: { $nin: [41, 43] } })).toEqual({ age: 42 });
    expect((0, import__.mergeQueries)({ age: { $lt: 45 } }, { age: 42 })).toEqual({ age: 42 });
    expect((0, import__.mergeQueries)({ age: 42 }, { age: { $lt: 45 } })).toEqual({ age: 42 });
    expect((0, import__.mergeQueries)({ age: { $gt: 40 } }, { age: 42 })).toEqual({ age: 42 });
    expect((0, import__.mergeQueries)({ age: 42 }, { age: { $gt: 40 } })).toEqual({ age: 42 });
    expect((0, import__.mergeQueries)({ age: { $lte: 42 } }, { age: 42 })).toEqual({ age: 42 });
    expect((0, import__.mergeQueries)({ age: 42 }, { age: { $lte: 42 } })).toEqual({ age: 42 });
    expect((0, import__.mergeQueries)({ age: { $gte: 42 } }, { age: 42 })).toEqual({ age: 42 });
    expect((0, import__.mergeQueries)({ age: 42 }, { age: { $gte: 42 } })).toEqual({ age: 42 });
    expect((0, import__.mergeQueries)({ age: { $ne: 40 } }, { age: 42 })).toEqual({ age: 42 });
    expect((0, import__.mergeQueries)({ age: 42 }, { age: { $ne: 40 } })).toEqual({ age: 42 });
    expect((0, import__.mergeQueries)({ age: { $in: [31, 32, 33] } }, { age: 42 })).toEqual({ age: { $in: [] } });
    expect((0, import__.mergeQueries)({ age: 42 }, { age: { $in: [31, 32, 33] } })).toEqual({ age: { $in: [] } });
    expect((0, import__.mergeQueries)({ age: { $nin: [41, 42, 43] } }, { age: 42 })).toEqual({ age: { $in: [] } });
    expect((0, import__.mergeQueries)({ age: 42 }, { age: { $nin: [41, 42, 43] } })).toEqual({ age: { $in: [] } });
    expect((0, import__.mergeQueries)({ age: { $lt: 42 } }, { age: 42 })).toEqual({ age: { $in: [] } });
    expect((0, import__.mergeQueries)({ age: 42 }, { age: { $lt: 42 } })).toEqual({ age: { $in: [] } });
    expect((0, import__.mergeQueries)({ age: { $gt: 42 } }, { age: 42 })).toEqual({ age: { $in: [] } });
    expect((0, import__.mergeQueries)({ age: 42 }, { age: { $gt: 42 } })).toEqual({ age: { $in: [] } });
    expect((0, import__.mergeQueries)({ age: { $lte: 40 } }, { age: 42 })).toEqual({ age: { $in: [] } });
    expect((0, import__.mergeQueries)({ age: 42 }, { age: { $lte: 40 } })).toEqual({ age: { $in: [] } });
    expect((0, import__.mergeQueries)({ age: { $gte: 43 } }, { age: 42 })).toEqual({ age: { $in: [] } });
    expect((0, import__.mergeQueries)({ age: 42 }, { age: { $gte: 43 } })).toEqual({ age: { $in: [] } });
    expect((0, import__.mergeQueries)({ age: { $ne: 42 } }, { age: 42 })).toEqual({ age: { $in: [] } });
    expect((0, import__.mergeQueries)({ age: 42 }, { age: { $ne: 42 } })).toEqual({ age: { $in: [] } });
  });
  it("$in merge", () => {
    expect((0, import__.mergeQueries)({ value: { $in: [1, 2] } }, { value: { $in: [2, 3] } })).toEqual({ value: { $in: [2] } });
    expect((0, import__.mergeQueries)({ value: { $in: [2, 3] } }, { value: { $in: [1, 2] } })).toEqual({ value: { $in: [2] } });
    expect((0, import__.mergeQueries)({ value: { $in: [1, 2] } }, { value: { $in: [3, 4] } })).toEqual({ value: { $in: [] } });
    expect((0, import__.mergeQueries)({ value: { $in: [3, 4] } }, { value: { $in: [1, 2] } })).toEqual({ value: { $in: [] } });
    expect((0, import__.mergeQueries)({ value: { $in: [] } }, { value: { $in: [] } })).toEqual({ value: { $in: [] } });
    expect((0, import__.mergeQueries)({ value: { $in: [42] } }, { value: { $in: [42] } })).toEqual({ value: { $in: [42] } });
  });
  it("$nin merge", () => {
    expect((0, import__.mergeQueries)({ value: { $nin: [] } }, { value: { $nin: [] } })).toEqual({});
    expect((0, import__.mergeQueries)({ value: { $nin: [42] } }, { value: { $nin: [42] } })).toEqual({ value: { $nin: [42] } });
  });
  it("$in $nin $ne merge", () => {
    expect((0, import__.mergeQueries)({ value: { $in: [1, 2] } }, { value: { $nin: [1] } })).toEqual({ value: { $in: [2] } });
    expect((0, import__.mergeQueries)({ value: { $nin: [1] } }, { value: { $in: [1, 2] } })).toEqual({ value: { $in: [2] } });
    expect((0, import__.mergeQueries)({ value: { $in: ["a", "b"] } }, { value: { $nin: ["a"] } })).toEqual({ value: { $in: ["b"] } });
    expect((0, import__.mergeQueries)({ value: { $nin: ["a"] } }, { value: { $in: ["a", "b"] } })).toEqual({ value: { $in: ["b"] } });
    expect((0, import__.mergeQueries)({ value: { $in: [1, 2] } }, { value: { $nin: [1, 2, 3] } })).toEqual({ value: { $in: [] } });
    expect((0, import__.mergeQueries)({ value: { $nin: [1, 2, 3] } }, { value: { $in: [1, 2] } })).toEqual({ value: { $in: [] } });
    expect((0, import__.mergeQueries)({ value: { $in: [1, 2] } }, { value: { $nin: [1, 2] } })).toEqual({ value: { $in: [] } });
    expect((0, import__.mergeQueries)({ value: { $in: [] } }, { value: { $nin: [42] } })).toEqual({ value: { $in: [] } });
    expect((0, import__.mergeQueries)({ value: { $nin: [42] } }, { value: { $in: [] } })).toEqual({ value: { $in: [] } });
    expect((0, import__.mergeQueries)({ value: { $in: [1, 2] } }, { value: { $ne: 1 } })).toEqual({ value: { $in: [2] } });
    expect((0, import__.mergeQueries)({ value: { $ne: 1 } }, { value: { $in: [1, 2] } })).toEqual({ value: { $in: [2] } });
    expect((0, import__.mergeQueries)({ value: { $in: [1] } }, { value: { $ne: 1 } })).toEqual({ value: { $in: [] } });
    expect((0, import__.mergeQueries)({ value: { $ne: 1 } }, { value: { $in: [1] } })).toEqual({ value: { $in: [] } });
    expect((0, import__.mergeQueries)({ value: { $in: [] } }, { value: { $ne: 42 } })).toEqual({ value: { $in: [] } });
    expect((0, import__.mergeQueries)({ value: { $ne: 42 } }, { value: { $in: [] } })).toEqual({ value: { $in: [] } });
  });
  it("$lt and $gt", () => {
    expect((0, import__.mergeQueries)({ age: { $lt: 25 } }, { age: { $gt: 20 } })).toEqual({ age: { $lt: 25, $gt: 20 } });
    expect((0, import__.mergeQueries)({ age: { $gt: 20 } }, { age: { $lt: 25 } })).toEqual({ age: { $lt: 25, $gt: 20 } });
    expect((0, import__.mergeQueries)({ age: { $lt: 20 } }, { age: { $gt: 25 } })).toEqual({ age: { $lt: 20, $gt: 25 } });
    expect((0, import__.mergeQueries)({ age: { $gt: 25 } }, { age: { $lt: 20 } })).toEqual({ age: { $lt: 20, $gt: 25 } });
  });
  it("complex", () => {
    const q1 = {
      space: 1,
      unique: "item",
      age: { $gt: 10 }
    };
    const q2 = {
      space: { $in: [1, 2] },
      age: 30
    };
    const res = {
      space: 1,
      unique: "item",
      age: 30
    };
    expect((0, import__.mergeQueries)(q1, q2)).toEqual(res);
    expect((0, import__.mergeQueries)(q2, q1)).toEqual(res);
  });
});
//# sourceMappingURL=utils.test.js.map
