"use strict";
var import_utils = require("../utils");
describe("TimeRateLimiter", () => {
  it("should limit rate of executions", async () => {
    jest.useFakeTimers();
    const limiter = new import_utils.TimeRateLimiter(2, 1e3);
    const mockFn = jest.fn().mockResolvedValue("result");
    const operations = [];
    for (let i = 0; i < 4; i++) {
      operations.push(limiter.exec(mockFn));
    }
    expect(mockFn).toHaveBeenCalledTimes(2);
    jest.advanceTimersByTime(1001);
    await Promise.resolve();
    expect(mockFn).toHaveBeenCalledTimes(4);
    await Promise.all(operations);
  });
  it("should cleanup old executions", async () => {
    jest.useFakeTimers();
    const limiter = new import_utils.TimeRateLimiter(2, 1e3);
    const mockFn = jest.fn().mockResolvedValue("result");
    await limiter.exec(mockFn);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(limiter.executions.length).toBe(1);
    jest.advanceTimersByTime(1001);
    await limiter.exec(mockFn);
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(limiter.executions.length).toBe(1);
  });
  it("should handle concurrent operations", async () => {
    jest.useFakeTimers();
    const limiter = new import_utils.TimeRateLimiter(2, 1e3);
    const mockFn = jest.fn().mockImplementation(async () => {
      console.log("start#");
      await new Promise((resolve) => setTimeout(resolve, 450));
      console.log("finished#");
      return "result";
    });
    const operations = Promise.all([limiter.exec(mockFn), limiter.exec(mockFn), limiter.exec(mockFn)]);
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(limiter.active).toBe(2);
    jest.advanceTimersByTime(500);
    await Promise.resolve();
    await Promise.resolve();
    jest.advanceTimersByTime(1e3);
    await Promise.resolve();
    jest.advanceTimersByTime(2001);
    await Promise.resolve();
    await Promise.resolve();
    expect(limiter.active).toBe(0);
    expect(mockFn).toHaveBeenCalledTimes(3);
    await operations;
  });
  it("should wait for processing to complete", async () => {
    jest.useFakeTimers();
    const limiter = new import_utils.TimeRateLimiter(2, 1e3);
    const mockFn = jest.fn().mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return "result";
    });
    const operation = limiter.exec(mockFn);
    const waitPromise = limiter.waitProcessing().then(() => {
      console.log("wait complete");
    });
    expect(limiter.active).toBe(1);
    jest.advanceTimersByTime(1001);
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    await waitPromise;
    await operation;
    expect(limiter.active).toBe(0);
  });
});
//# sourceMappingURL=limits.test.js.map
