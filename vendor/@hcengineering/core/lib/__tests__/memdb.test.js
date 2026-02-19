"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import__ = require("..");
var import_component = __toESM(require("../component"));
var import_hierarchy = require("../hierarchy");
var import_memdb = require("../memdb");
var import_operations = require("../operations");
var import_storage = require("../storage");
var import_minmodel = require("./minmodel");
const txes = (0, import_minmodel.genMinModel)();
class ClientModel extends import_memdb.ModelDb {
  static {
    __name(this, "ClientModel");
  }
  notify;
  getHierarchy() {
    return this.hierarchy;
  }
  getModel() {
    return this;
  }
  async findOne(_class, query, options) {
    return (await this.findAll(_class, query, options)).shift();
  }
  async searchFulltext(query, options) {
    return { docs: [] };
  }
  async close() {
  }
}
async function createModel(modelTxes = txes) {
  const hierarchy = new import_hierarchy.Hierarchy();
  for (const tx of modelTxes) {
    hierarchy.tx(tx);
  }
  const model = new ClientModel(hierarchy);
  for (const tx of modelTxes) {
    await model.tx(tx);
  }
  const txDb = new import_memdb.TxDb(hierarchy);
  for (const tx of modelTxes) await txDb.tx(tx);
  return { model, hierarchy, txDb };
}
__name(createModel, "createModel");
describe("memdb", () => {
  it("should save all tx", async () => {
    const { txDb } = await createModel();
    const result = await txDb.findAll(import_component.default.class.Tx, {});
    expect(result.length).toBe(txes.length);
  });
  it("should create space", async () => {
    const { model } = await createModel();
    const client = new import_operations.TxOperations(model, import_component.default.account.System);
    const result = await client.findAll(import_component.default.class.Space, {});
    expect(result).toHaveLength(2);
    await client.createDoc(import_component.default.class.Space, import_component.default.space.Model, {
      private: false,
      name: "NewSpace",
      description: "",
      members: [],
      archived: false
    });
    const result2 = await client.findAll(import_component.default.class.Space, {});
    expect(result2).toHaveLength(3);
    await client.createDoc(import_component.default.class.Space, import_component.default.space.Model, {
      private: false,
      name: "NewSpace",
      description: "",
      members: [],
      archived: false
    });
    const result3 = await client.findAll(import_component.default.class.Space, {});
    expect(result3).toHaveLength(4);
  });
  it("should query model", async () => {
    const { model } = await createModel();
    const result = await model.findAll(import_component.default.class.Class, {});
    const names = result.map((d) => d._id);
    expect(names.includes(import_component.default.class.Class)).toBe(true);
    const result2 = await model.findAll(import_component.default.class.Class, { _id: void 0 });
    expect(result2.length).toBe(0);
  });
  it("should fail query wrong class", async () => {
    const { model } = await createModel();
    await expect(model.findAll("class:workbench.Application", { _id: void 0 })).rejects.toThrow();
  });
  it("should create mixin", async () => {
    const { model } = await createModel();
    const ops = new import_operations.TxOperations(model, import_component.default.account.System);
    await ops.createMixin(import_component.default.class.Obj, import_component.default.class.Class, import_component.default.space.Model, import_minmodel.test.mixin.TestMixin, {
      arr: ["hello"]
    });
    const objClass = (await model.findAll(import_component.default.class.Class, { _id: import_component.default.class.Obj }))[0];
    expect(objClass["test:mixin:TestMixin"].arr).toEqual(expect.arrayContaining(["hello"]));
  });
  it("should allow delete", async () => {
    const { model } = await createModel();
    const result = await model.findAll(import_component.default.class.Space, {});
    expect(result.length).toBe(2);
    const ops = new import_operations.TxOperations(model, import_component.default.account.System);
    await ops.removeDoc(result[0]._class, result[0].space, result[0]._id);
    const result2 = await model.findAll(import_component.default.class.Space, {});
    expect(result2).toHaveLength(1);
  });
  it("should query model with params", async () => {
    const { model } = await createModel();
    const first = await model.findAll(import_component.default.class.Class, {
      _id: txes[1].objectId,
      kind: 0
    });
    expect(first.length).toBe(1);
    const second = await model.findAll(import_component.default.class.Class, {
      _id: { $in: [txes[1].objectId, txes[3].objectId] }
    });
    expect(second.length).toBe(2);
    const incorrectId = await model.findAll(import_component.default.class.Class, {
      _id: txes[1].objectId + "test"
    });
    expect(incorrectId.length).toBe(0);
    const result = await model.findAll(import_component.default.class.Class, {
      _id: txes[1].objectId,
      kind: 1
    });
    expect(result.length).toBe(0);
    const multipleParam = await model.findAll(import_component.default.class.Doc, {
      space: { $in: [import_component.default.space.Model, import_component.default.space.Tx] }
    });
    expect(multipleParam.length).toBeGreaterThan(5);
    const classes = await model.findAll(import_component.default.class.Class, {});
    const gt = await model.findAll(import_component.default.class.Class, {
      kind: { $gt: 1 }
    });
    expect(gt.length).toBe(classes.filter((p) => p.kind > 1).length);
    const gte = await model.findAll(import_component.default.class.Class, {
      kind: { $gte: 1 }
    });
    expect(gte.length).toBe(classes.filter((p) => p.kind >= 1).length);
    const lt = await model.findAll(import_component.default.class.Class, {
      kind: { $lt: 1 }
    });
    expect(lt.length).toBe(classes.filter((p) => p.kind < 1).length);
    const lte = await model.findAll(import_component.default.class.Class, {
      kind: { $lt: 1 }
    });
    expect(lte.length).toBe(classes.filter((p) => p.kind <= 1).length);
  });
  it("should query model like params", async () => {
    const { model } = await createModel();
    const expectedLength = txes.filter((tx) => tx.objectSpace === import_component.default.space.Model).length;
    const without = await model.findAll(import_component.default.class.Doc, {
      space: { $like: import_component.default.space.Model }
    });
    expect(without).toHaveLength(expectedLength);
    const begin = await model.findAll(import_component.default.class.Doc, {
      space: { $like: "%Model" }
    });
    expect(begin).toHaveLength(expectedLength);
    const zero = await model.findAll(import_component.default.class.Doc, {
      space: { $like: "Model" }
    });
    expect(zero).toHaveLength(0);
    const end = await model.findAll(import_component.default.class.Doc, {
      space: { $like: "core:space:M%" }
    });
    expect(end).toHaveLength(expectedLength);
    const mid = await model.findAll(import_component.default.class.Doc, {
      space: { $like: "%M%de%" }
    });
    expect(mid).toHaveLength(expectedLength);
    const all = await model.findAll(import_component.default.class.Doc, {
      space: { $like: "%Mod%" }
    });
    expect(all).toHaveLength(expectedLength);
    const regex = await model.findAll(import_component.default.class.Doc, {
      space: { $regex: ".*Mod.*" }
    });
    expect(regex).toHaveLength(expectedLength);
  });
  it("should push to array", async () => {
    const hierarchy = new import_hierarchy.Hierarchy();
    for (const tx of txes) hierarchy.tx(tx);
    const model = new import_operations.TxOperations(new ClientModel(hierarchy), import_component.default.account.System);
    for (const tx of txes) await model.tx(tx);
    const space = await model.createDoc(import_component.default.class.Space, import_component.default.space.Model, {
      name: "name",
      description: "desc",
      private: false,
      members: [],
      archived: false
    });
    const account = await model.createDoc(import_component.default.class.Account, import_component.default.space.Model, {
      email: "email",
      role: import__.AccountRole.User
    });
    await model.updateDoc(import_component.default.class.Space, import_component.default.space.Model, space, { $push: { members: account } });
    const txSpace = await model.findAll(import_component.default.class.Space, { _id: space });
    expect(txSpace[0].members).toEqual(expect.arrayContaining([account]));
  });
  it("limit and sorting", async () => {
    const hierarchy = new import_hierarchy.Hierarchy();
    for (const tx of txes) hierarchy.tx(tx);
    const model = new import_operations.TxOperations(new ClientModel(hierarchy), import_component.default.account.System);
    for (const tx of txes) await model.tx(tx);
    const without = await model.findAll(import_component.default.class.Space, {});
    expect(without).toHaveLength(2);
    const limit = await model.findAll(import_component.default.class.Space, {}, { limit: 1 });
    expect(limit).toHaveLength(1);
    const sortAsc = await model.findAll(import_component.default.class.Space, {}, { limit: 1, sort: { name: import_storage.SortingOrder.Ascending } });
    expect(sortAsc[0].name).toMatch("Sp1");
    const sortDesc = await model.findAll(import_component.default.class.Space, {}, { limit: 1, sort: { name: import_storage.SortingOrder.Descending } });
    expect(sortDesc[0].name).toMatch("Sp2");
    const numberSortDesc = await model.findAll(import_component.default.class.Doc, {}, { sort: { modifiedOn: import_storage.SortingOrder.Descending } });
    expect(numberSortDesc[0].modifiedOn).toBeGreaterThanOrEqual(numberSortDesc[numberSortDesc.length - 1].modifiedOn);
    const numberSort = await model.findAll(import_component.default.class.Doc, {}, { sort: { modifiedOn: import_storage.SortingOrder.Ascending } });
    expect(numberSort[0].modifiedOn).toBeLessThanOrEqual(numberSort[numberSortDesc.length - 1].modifiedOn);
  });
  it("should add attached document", async () => {
    const { model } = await createModel();
    const client = new import_operations.TxOperations(model, import_component.default.account.System);
    const result = await client.findAll(import_component.default.class.Space, {});
    expect(result).toHaveLength(2);
    await client.addCollection(import_minmodel.test.class.TestComment, import_component.default.space.Model, result[0]._id, result[0]._class, "comments", {
      message: "msg"
    });
    const result2 = await client.findAll(import_minmodel.test.class.TestComment, {});
    expect(result2).toHaveLength(1);
  });
  it("lookups", async () => {
    const { model } = await createModel();
    const client = new import_operations.TxOperations(model, import_component.default.account.System);
    const spaces = await client.findAll(import_component.default.class.Space, {});
    expect(spaces).toHaveLength(2);
    const first = await client.addCollection(
      import_minmodel.test.class.TestComment,
      import_component.default.space.Model,
      spaces[0]._id,
      spaces[0]._class,
      "comments",
      {
        message: "msg"
      }
    );
    const second = await client.addCollection(
      import_minmodel.test.class.TestComment,
      import_component.default.space.Model,
      first,
      import_minmodel.test.class.TestComment,
      "comments",
      {
        message: "msg2"
      }
    );
    await client.addCollection(import_minmodel.test.class.TestComment, import_component.default.space.Model, spaces[0]._id, spaces[0]._class, "comments", {
      message: "msg3"
    });
    const simple = await client.findAll(
      import_minmodel.test.class.TestComment,
      { _id: first },
      { lookup: { attachedTo: spaces[0]._class } }
    );
    expect(simple[0].$lookup?.attachedTo).toEqual(spaces[0]);
    const nested = await client.findAll(
      import_minmodel.test.class.TestComment,
      { _id: second },
      { lookup: { attachedTo: [import_minmodel.test.class.TestComment, { attachedTo: spaces[0]._class }] } }
    );
    expect((nested[0].$lookup?.attachedTo).$lookup?.attachedTo).toEqual(spaces[0]);
    const reverse = await client.findAll(
      spaces[0]._class,
      { _id: spaces[0]._id },
      { lookup: { _id: { comments: import_minmodel.test.class.TestComment } } }
    );
    expect(reverse[0].$lookup.comments).toHaveLength(2);
  });
  it("mixin lookups", async () => {
    const { model } = await createModel();
    const client = new import_operations.TxOperations(model, import_component.default.account.System);
    const spaces = await client.findAll(import_component.default.class.Space, {});
    expect(spaces).toHaveLength(2);
    const task = await client.createDoc(import_minmodel.test.class.Task, spaces[0]._id, {
      name: "TSK1",
      number: 1,
      state: 0
    });
    await client.createMixin(task, import_minmodel.test.class.Task, spaces[0]._id, import_minmodel.test.mixin.TaskMixinTodos, {
      todos: 0
    });
    await client.addCollection(import_minmodel.test.class.TestMixinTodo, spaces[0]._id, task, import_minmodel.test.mixin.TaskMixinTodos, "todos", {
      text: "qwe"
    });
    await client.addCollection(import_minmodel.test.class.TestMixinTodo, spaces[0]._id, task, import_minmodel.test.mixin.TaskMixinTodos, "todos", {
      text: "qwe2"
    });
    const results = await client.findAll(
      import_minmodel.test.class.TestMixinTodo,
      {},
      { lookup: { attachedTo: import_minmodel.test.mixin.TaskMixinTodos } }
    );
    expect(results.length).toEqual(2);
    const attached = results[0].$lookup?.attachedTo;
    expect(attached).toBeDefined();
    expect(import_hierarchy.Hierarchy.mixinOrClass(attached)).toEqual(import_minmodel.test.mixin.TaskMixinTodos);
  });
  it("createDoc for AttachedDoc", async () => {
    expect.assertions(1);
    const { model } = await createModel();
    const client = new import_operations.TxOperations(model, import_component.default.account.System);
    const spaces = await client.findAll(import_component.default.class.Space, {});
    const task = await client.createDoc(import_minmodel.test.class.Task, spaces[0]._id, {
      name: "TSK1",
      number: 1,
      state: 0
    });
    try {
      await client.createDoc(import_minmodel.test.class.TestMixinTodo, spaces[0]._id, {
        text: "",
        attachedTo: task,
        attachedToClass: import_minmodel.test.mixin.TaskMixinTodos,
        collection: "todos"
      });
    } catch (e) {
      expect(e).toEqual(new Error("createDoc cannot be used for objects inherited from AttachedDoc"));
    }
  });
  it("has correct accounts", async () => {
    const modTxes = [...txes];
    modTxes.push(
      (0, import_minmodel.createDoc)(import_component.default.class.Account, {
        email: "system_admin",
        role: import__.AccountRole.Owner
      })
    );
    const system1Account = (0, import_minmodel.createDoc)(import_component.default.class.Account, {
      email: "system1",
      role: import__.AccountRole.Maintainer
    });
    modTxes.push(system1Account);
    const user1Account = (0, import_minmodel.createDoc)(import_component.default.class.Account, {
      email: "user1",
      role: import__.AccountRole.User
    });
    modTxes.push(user1Account);
    modTxes.push((0, import_minmodel.updateDoc)(import_component.default.class.Account, import_component.default.space.Model, system1Account.objectId, { email: "user1" }));
    modTxes.push((0, import_minmodel.deleteDoc)(import_component.default.class.Account, import_component.default.space.Model, user1Account.objectId));
    const { model } = await createModel(modTxes);
    expect(model.getAccountByEmail("system_admin")).not.toBeUndefined();
    expect(model.getAccountByEmail("system_admin")?.role).toBe(import__.AccountRole.Owner);
    expect(model.getAccountByEmail("system1")).toBeUndefined();
    expect(model.getAccountByEmail("user1")).not.toBeUndefined();
    expect(model.getAccountByEmail("user1")?.role).toBe(import__.AccountRole.Maintainer);
  });
});
//# sourceMappingURL=memdb.test.js.map
