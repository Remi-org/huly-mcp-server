"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
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
var context_exports = {};
__export(context_exports, {
  MeasureMetricsContext: () => MeasureMetricsContext,
  NoMetricsContext: () => NoMetricsContext,
  addOperation: () => addOperation,
  registerOperationLog: () => registerOperationLog,
  setOperationLogProfiling: () => setOperationLogProfiling,
  updateOperationLog: () => updateOperationLog,
  withContext: () => withContext
});
module.exports = __toCommonJS(context_exports);
var import_utils = require("../utils");
var import_metrics = require("./metrics");
const errorPrinter = /* @__PURE__ */ __name(({ message, stack, ...rest }) => ({
  message,
  stack,
  ...rest
}), "errorPrinter");
function replacer(value) {
  return value instanceof Error ? errorPrinter(value) : value;
}
__name(replacer, "replacer");
const consoleLogger = /* @__PURE__ */ __name((logParams) => ({
  info: /* @__PURE__ */ __name((msg, args) => {
    console.info(
      msg,
      ...Object.entries({ ...args ?? {}, ...logParams ?? {} }).map(
        (it) => `${it[0]}=${JSON.stringify(replacer(it[1]))}`
      )
    );
  }, "info"),
  error: /* @__PURE__ */ __name((msg, args) => {
    console.error(
      msg,
      ...Object.entries({ ...args ?? {}, ...logParams ?? {} }).map(
        (it) => `${it[0]}=${JSON.stringify(replacer(it[1]))}`
      )
    );
  }, "error"),
  warn: /* @__PURE__ */ __name((msg, args) => {
    console.warn(msg, ...Object.entries(args ?? {}).map((it) => `${it[0]}=${JSON.stringify(replacer(it[1]))}`));
  }, "warn"),
  close: /* @__PURE__ */ __name(async () => {
  }, "close"),
  logOperation: /* @__PURE__ */ __name((operation, time, params) => {
  }, "logOperation")
}), "consoleLogger");
const noParamsLogger = consoleLogger({});
const nullPromise = Promise.resolve();
class MeasureMetricsContext {
  constructor(name, params, fullParams = {}, metrics = (0, import_metrics.newMetrics)(), logger, parent, logParams) {
    this.parent = parent;
    this.logParams = logParams;
    this.name = name;
    this.params = params;
    this.fullParams = fullParams;
    this.metrics = metrics;
    this.metrics.namedParams = this.metrics.namedParams ?? {};
    for (const [k, v] of Object.entries(params)) {
      if (this.metrics.namedParams[k] !== v) {
        this.metrics.namedParams[k] = v;
      } else {
        this.metrics.namedParams[k] = "*";
      }
    }
    this.logger = logger ?? (this.logParams != null ? consoleLogger(this.logParams ?? {}) : noParamsLogger);
  }
  static {
    __name(this, "MeasureMetricsContext");
  }
  name;
  params;
  fullParams = {};
  logger;
  metrics;
  id;
  st = Date.now();
  contextData = {};
  done(value, override) {
    (0, import_metrics.updateMeasure)(this.metrics, this.st, this.params, this.fullParams, (spend) => {
    }, value, override);
  }
  measure(name, value, override) {
    const c = new MeasureMetricsContext("#" + name, {}, {}, (0, import_metrics.childMetrics)(this.metrics, ["#" + name]), this.logger, this);
    c.contextData = this.contextData;
    c.done(value, override);
  }
  newChild(name, params, fullParams, logger) {
    const result = new MeasureMetricsContext(
      name,
      params,
      fullParams ?? {},
      (0, import_metrics.childMetrics)(this.metrics, [name]),
      logger ?? this.logger,
      this,
      this.logParams
    );
    result.id = this.id;
    result.contextData = this.contextData;
    return result;
  }
  with(name, params, op, fullParams) {
    const c = this.newChild(name, params, fullParams, this.logger);
    let needFinally = true;
    try {
      const value = op(c);
      if (value instanceof Promise) {
        needFinally = false;
        return value.finally(() => {
          c.end();
        });
      } else {
        if (value == null) {
          return nullPromise;
        }
        return Promise.resolve(value);
      }
    } finally {
      if (needFinally) {
        c.end();
      }
    }
  }
  withSync(name, params, op, fullParams) {
    const c = this.newChild(name, params, fullParams, this.logger);
    try {
      return op(c);
    } finally {
      c.end();
    }
  }
  withLog(name, params, op, fullParams) {
    const st = Date.now();
    const r = this.with(name, params, op, fullParams);
    void r.finally(() => {
      this.logger.logOperation(name, Date.now() - st, { ...params, ...fullParams });
    });
    return r;
  }
  error(message, args) {
    this.logger.error(message, { ...this.params, ...args, ...this.logParams ?? {} });
  }
  info(message, args) {
    this.logger.info(message, { ...this.params, ...args, ...this.logParams ?? {} });
  }
  warn(message, args) {
    this.logger.warn(message, { ...this.params, ...args, ...this.logParams ?? {} });
  }
  end() {
    this.done();
  }
}
class NoMetricsContext {
  static {
    __name(this, "NoMetricsContext");
  }
  logger;
  id;
  contextData = {};
  constructor(logger) {
    this.logger = logger ?? consoleLogger({});
  }
  measure(name, value, override) {
  }
  newChild(name, params, fullParams, logger) {
    const result = new NoMetricsContext(logger ?? this.logger);
    result.id = this.id;
    result.contextData = this.contextData;
    return result;
  }
  with(name, params, op, fullParams) {
    const r = op(this.newChild(name, params, fullParams, this.logger));
    return r instanceof Promise ? r : Promise.resolve(r);
  }
  withSync(name, params, op, fullParams) {
    const c = this.newChild(name, params, fullParams, this.logger);
    return op(c);
  }
  withLog(name, params, op, fullParams) {
    const r = op(this.newChild(name, params, fullParams, this.logger));
    return r instanceof Promise ? r : Promise.resolve(r);
  }
  error(message, args) {
    this.logger.error(message, { ...args });
  }
  info(message, args) {
    this.logger.info(message, { ...args });
  }
  warn(message, args) {
    this.logger.warn(message, { ...args });
  }
  end() {
  }
}
function withContext(name, params = {}) {
  return (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function(...args) {
      const ctx = args[0];
      return ctx.with(name, params, (ctx2) => originalMethod.apply(this, [ctx2, ...args.slice(1)]));
    };
    return descriptor;
  };
}
__name(withContext, "withContext");
let operationProfiling = false;
function setOperationLogProfiling(value) {
  operationProfiling = value;
}
__name(setOperationLogProfiling, "setOperationLogProfiling");
function registerOperationLog(ctx) {
  if (!operationProfiling) {
    return {};
  }
  const op = { start: Date.now(), ops: [], end: -1 };
  let opLogMetrics;
  if (ctx.id === void 0) {
    ctx.id = "op_" + (0, import_utils.generateId)();
  }
  if (ctx.metrics !== void 0) {
    if (ctx.metrics.opLog === void 0) {
      ctx.metrics.opLog = {};
    }
    ctx.metrics.opLog[ctx.id] = op;
    opLogMetrics = ctx.metrics;
  }
  return { opLogMetrics, op };
}
__name(registerOperationLog, "registerOperationLog");
function updateOperationLog(opLogMetrics, op) {
  if (!operationProfiling) {
    return;
  }
  if (op !== void 0) {
    op.end = Date.now();
  }
  if (opLogMetrics?.opLog !== void 0) {
    const entries = Object.entries(opLogMetrics.opLog);
    const incomplete = entries.filter((it) => it[1].end === -1);
    const complete = entries.filter((it) => it[1].end !== -1);
    complete.sort((a, b) => a[1].start - b[1].start);
    if (complete.length > 30) {
      complete.splice(0, complete.length - 30);
    }
    opLogMetrics.opLog = Object.fromEntries(incomplete.concat(complete));
  }
}
__name(updateOperationLog, "updateOperationLog");
function addOperation(ctx, name, params, op, fullParams) {
  if (!operationProfiling) {
    return op(ctx);
  }
  let opEntry;
  let p = ctx;
  let opLogMetrics;
  let id;
  while (p !== void 0) {
    if (p.metrics?.opLog !== void 0) {
      opLogMetrics = p.metrics;
    }
    if (id === void 0 && p.id !== void 0) {
      id = p.id;
    }
    p = p.parent;
  }
  const opLog = id !== void 0 ? opLogMetrics?.opLog?.[id] : void 0;
  if (opLog !== void 0) {
    opEntry = {
      op: name,
      start: Date.now(),
      params: {},
      end: -1
    };
  }
  const result = op(ctx);
  if (opEntry !== void 0 && opLog !== void 0) {
    void result.finally(() => {
      if (opEntry !== void 0 && opLog !== void 0) {
        opEntry.end = Date.now();
        opEntry.params = { ...params, ...typeof fullParams === "function" ? fullParams() : fullParams };
        opLog.ops.push(opEntry);
      }
    });
  }
  return result;
}
__name(addOperation, "addOperation");
//# sourceMappingURL=context.js.map
