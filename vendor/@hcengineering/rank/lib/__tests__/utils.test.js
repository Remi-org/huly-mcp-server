"use strict";
var import__ = require("..");
describe("makeRank", () => {
  it("calculates rank when no prev and next", () => {
    expect((0, import__.makeRank)(void 0, void 0)).toBe("0|hzzzzz:");
  });
  it.each([
    ["0|hzzzzz:", "0|i00007:"],
    ["0|i00007:", "0|i0000f:"],
    ["0|i0000f:", "0|i0000n:"],
    ["0|zzzzzz:", "0|zzzzzz:"]
  ])("calculates rank value when prev is %p", (prev, expected) => {
    expect((0, import__.makeRank)(prev, void 0)).toBe(expected);
  });
  it.each([
    ["0|hzzzzz:", "0|hzzzzr:"],
    ["0|hzzzzr:", "0|hzzzzj:"],
    ["0|hzzzzj:", "0|hzzzzb:"],
    ["0|000000:", "0|000000:"]
  ])("calculates rank value when next is %p", (next, expected) => {
    expect((0, import__.makeRank)(void 0, next)).toBe(expected);
  });
  it.each([
    ["0|000000:", "0|000001:", "0|000000:i"],
    ["0|hzzzzz:", "0|i0000f:", "0|i00007:"],
    ["0|hzzzzz:", "0|hzzzzz:", "0|i00007:"],
    ["0|i00007:", "0|i00007:", "0|i0000f:"],
    ["0|i00007:", "0|i00008:", "0|i00007:i"]
  ])("calculates rank value when prev is %p and next is %p", (prev, next, expected) => {
    expect((0, import__.makeRank)(prev, next)).toBe(expected);
  });
  it.each([
    [10, "0|hzzzxr:"],
    [100, "0|hzzzdr:"],
    [1e3, "0|hzzttr:"],
    [1e4, "0|hzya9r:"]
  ])("produces prev rank of reasonable length for %p generations", (count, expected) => {
    let rank = "0|hzzzzz:";
    for (let i = 0; i < count; i++) {
      rank = (0, import__.makeRank)(void 0, rank);
    }
    expect(rank).toBe(expected);
  });
  it.each([
    [5, "0|zfqzzz:"],
    [10, "0|zzd7vh:"],
    [50, "0|zzzzzy:zzzi"],
    [100, "0|zzzzzy:zzzzzzzzzzzv"]
  ])("produces middle rank of reasonable length for %p generations", (count, expected) => {
    let rank = "0|hzzzzz:";
    for (let i = 0; i < count; i++) {
      rank = (0, import__.makeRank)(rank, "0|zzzzzz");
    }
    expect(rank).toBe(expected);
  });
  it.each([
    [10, "0|i00027:"],
    [100, "0|i000m7:"],
    [1e3, "0|i00667:"],
    [1e4, "0|i01pq7:"],
    [1e5, "0|i0h5a7:"],
    [1e6, "0|i4rgu7:"]
  ])("produces next rank of reasonable length for %p generations", (count, expected) => {
    let rank = "0|hzzzzz:";
    for (let i = 0; i < count; i++) {
      rank = (0, import__.makeRank)(rank, void 0);
    }
    expect(rank).toBe(expected);
  });
});
//# sourceMappingURL=utils.test.js.map
