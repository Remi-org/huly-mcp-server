"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var minmodel_exports = {};
__export(minmodel_exports, {
  createDoc: () => createDoc,
  deleteDoc: () => deleteDoc,
  genMinModel: () => genMinModel,
  test: () => test,
  updateDoc: () => updateDoc
});
module.exports = __toCommonJS(minmodel_exports);
var import_platform = require("@hcengineering/platform");
var import_classes = require("../classes");
var import_component = __toESM(require("../component"));
var import_tx = require("../tx");
const txFactory = new import_tx.TxFactory(import_component.default.account.System);
function createClass(_class, attributes) {
  return txFactory.createTxCreateDoc(import_component.default.class.Class, import_component.default.space.Model, attributes, _class);
}
__name(createClass, "createClass");
function createInterface(_interface, attributes) {
  return txFactory.createTxCreateDoc(import_component.default.class.Interface, import_component.default.space.Model, attributes, _interface);
}
__name(createInterface, "createInterface");
function createDoc(_class, attributes) {
  return txFactory.createTxCreateDoc(_class, import_component.default.space.Model, attributes);
}
__name(createDoc, "createDoc");
function updateDoc(_class, space, objectId, operations) {
  return txFactory.createTxUpdateDoc(_class, space, objectId, operations);
}
__name(updateDoc, "updateDoc");
function deleteDoc(_class, space, objectId) {
  return txFactory.createTxRemoveDoc(_class, space, objectId);
}
__name(deleteDoc, "deleteDoc");
const test = (0, import_platform.plugin)("test", {
  mixin: {
    TestMixin: "",
    TaskMixinTodos: ""
  },
  class: {
    Task: "",
    TaskCheckItem: "",
    TestComment: "",
    TestMixinTodo: ""
  },
  interface: {
    WithState: "",
    DummyWithState: ""
  }
});
function genMinModel() {
  const txes = [];
  txes.push(createClass(import_component.default.class.Obj, { label: "Obj", kind: import_classes.ClassifierKind.CLASS }));
  txes.push(
    createClass(import_component.default.class.Doc, { label: "Doc", extends: import_component.default.class.Obj, kind: import_classes.ClassifierKind.CLASS })
  );
  txes.push(
    createClass(import_component.default.class.AttachedDoc, {
      label: "AttachedDoc",
      extends: import_component.default.class.Doc,
      kind: import_classes.ClassifierKind.MIXIN
    })
  );
  txes.push(
    createClass(import_component.default.class.Class, {
      label: "Class",
      extends: import_component.default.class.Doc,
      kind: import_classes.ClassifierKind.CLASS,
      domain: import_classes.DOMAIN_MODEL
    })
  );
  txes.push(
    createClass(import_component.default.class.Interface, {
      label: "Interface",
      extends: import_component.default.class.Doc,
      kind: import_classes.ClassifierKind.CLASS
    })
  );
  txes.push(
    createClass(import_component.default.class.Space, {
      label: "Space",
      extends: import_component.default.class.Doc,
      kind: import_classes.ClassifierKind.CLASS,
      domain: import_classes.DOMAIN_MODEL
    })
  );
  txes.push(
    createClass(import_component.default.class.Account, {
      label: "Account",
      extends: import_component.default.class.Doc,
      kind: import_classes.ClassifierKind.CLASS,
      domain: import_classes.DOMAIN_MODEL
    })
  );
  txes.push(
    createInterface(test.interface.WithState, {
      label: "WithState",
      extends: [],
      kind: import_classes.ClassifierKind.INTERFACE
    })
  );
  txes.push(
    createClass(import_component.default.class.Tx, {
      label: "Tx",
      extends: import_component.default.class.Doc,
      kind: import_classes.ClassifierKind.CLASS,
      domain: import_tx.DOMAIN_TX
    })
  );
  txes.push(
    createClass(import_component.default.class.TxCUD, {
      label: "TxCUD",
      extends: import_component.default.class.Tx,
      kind: import_classes.ClassifierKind.CLASS,
      domain: import_tx.DOMAIN_TX
    })
  );
  txes.push(
    createClass(import_component.default.class.TxCreateDoc, {
      label: "TxCreateDoc",
      extends: import_component.default.class.TxCUD,
      kind: import_classes.ClassifierKind.CLASS
    })
  );
  txes.push(
    createClass(import_component.default.class.TxUpdateDoc, {
      label: "TxUpdateDoc",
      extends: import_component.default.class.TxCUD,
      kind: import_classes.ClassifierKind.CLASS
    })
  );
  txes.push(
    createClass(import_component.default.class.TxRemoveDoc, {
      label: "TxRemoveDoc",
      extends: import_component.default.class.TxCUD,
      kind: import_classes.ClassifierKind.CLASS
    })
  );
  txes.push(
    createClass(import_component.default.class.Blob, {
      label: "Blob",
      extends: import_component.default.class.Doc,
      kind: import_classes.ClassifierKind.CLASS
    })
  );
  txes.push(
    createClass(test.mixin.TestMixin, {
      label: "TestMixin",
      extends: import_component.default.class.Doc,
      kind: import_classes.ClassifierKind.MIXIN
    })
  );
  txes.push(
    createInterface(test.interface.DummyWithState, {
      label: "DummyWithState",
      extends: [test.interface.WithState],
      kind: import_classes.ClassifierKind.INTERFACE
    })
  );
  txes.push(
    createClass(test.class.TestComment, {
      label: "TestComment",
      extends: import_component.default.class.AttachedDoc,
      kind: import_classes.ClassifierKind.CLASS
    })
  );
  txes.push(
    createClass(test.class.Task, {
      label: "Task",
      extends: import_component.default.class.Doc,
      implements: [test.interface.DummyWithState],
      kind: import_classes.ClassifierKind.CLASS
    })
  );
  txes.push(
    createClass(test.class.TaskCheckItem, {
      label: "Task",
      extends: import_component.default.class.AttachedDoc,
      implements: [test.interface.WithState],
      kind: import_classes.ClassifierKind.CLASS
    })
  );
  txes.push(
    createClass(test.mixin.TaskMixinTodos, {
      label: "TaskMixinTodos",
      extends: test.class.Task,
      kind: import_classes.ClassifierKind.MIXIN
    })
  );
  txes.push(
    createClass(test.class.TestMixinTodo, {
      label: "TestMixinTodo",
      extends: import_component.default.class.AttachedDoc,
      kind: import_classes.ClassifierKind.CLASS
    })
  );
  txes.push(
    createDoc(import_component.default.class.Space, {
      name: "Sp1",
      description: "",
      private: false,
      members: [],
      archived: false
    })
  );
  txes.push(
    createDoc(import_component.default.class.Space, {
      name: "Sp2",
      description: "",
      private: false,
      members: [],
      archived: false
    })
  );
  return txes;
}
__name(genMinModel, "genMinModel");
//# sourceMappingURL=minmodel.js.map
