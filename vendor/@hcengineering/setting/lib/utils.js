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
var utils_exports = {};
__export(utils_exports, {
  createSpaceType: () => createSpaceType,
  createSpaceTypeRole: () => createSpaceTypeRole,
  createSpaceTypeRoles: () => createSpaceTypeRoles,
  deleteSpaceTypeRole: () => deleteSpaceTypeRole,
  getRoleAttributeProps: () => getRoleAttributeProps
});
module.exports = __toCommonJS(utils_exports);
var import_core = __toESM(require("@hcengineering/core"));
var import_platform = require("@hcengineering/platform");
var import_index = __toESM(require("./index"));
async function createSpaceType(client, data, _id, _class = import_core.default.class.SpaceType) {
  const descriptorObj = client.getModel().findObject(data.descriptor);
  if (descriptorObj === void 0) {
    throw new Error("Descriptor is not found in the model");
  }
  const baseClassClazz = client.getHierarchy().getClass(descriptorObj.baseClass);
  const spaceTypeMixinId = `${_id}:type:mixin`;
  await client.createDoc(
    import_core.default.class.Mixin,
    import_core.default.space.Model,
    {
      extends: descriptorObj.baseClass,
      kind: import_core.ClassifierKind.MIXIN,
      label: (0, import_platform.getEmbeddedLabel)(data.name),
      icon: baseClassClazz.icon
    },
    spaceTypeMixinId
  );
  return await client.createDoc(
    _class,
    import_core.default.space.Model,
    { ...data, targetClass: spaceTypeMixinId },
    _id
  );
}
__name(createSpaceType, "createSpaceType");
function TypeAny(presenter, label, editor) {
  return { _class: import_core.default.class.TypeAny, label, presenter, editor };
}
__name(TypeAny, "TypeAny");
function getRoleAttributeProps(name) {
  const label = (0, import_core.getRoleAttributeLabel)(name);
  const roleType = TypeAny(import_index.default.component.RoleAssignmentEditor, label, import_index.default.component.RoleAssignmentEditor);
  return { label, roleType };
}
__name(getRoleAttributeProps, "getRoleAttributeProps");
async function createSpaceTypeRole(client, type, data, _id) {
  const roleId = await client.addCollection(
    import_core.default.class.Role,
    import_core.default.space.Model,
    type._id,
    type._class,
    "roles",
    data,
    _id
  );
  const { label, roleType } = getRoleAttributeProps(data.name);
  await client.createDoc(import_core.default.class.Attribute, import_core.default.space.Model, {
    name: roleId,
    attributeOf: type.targetClass,
    type: roleType,
    label
  });
  return roleId;
}
__name(createSpaceTypeRole, "createSpaceTypeRole");
async function createSpaceTypeRoles(tx, typeId, roles) {
  const spaceType = await tx.findOne(import_core.default.class.SpaceType, { _id: typeId });
  if (spaceType === void 0) return;
  for (const { _id, name, permissions } of roles) {
    await createSpaceTypeRole(tx, spaceType, { name, permissions }, _id);
  }
}
__name(createSpaceTypeRoles, "createSpaceTypeRoles");
async function deleteSpaceTypeRole(client, role, targetClass) {
  const attribute = await client.findOne(import_core.default.class.Attribute, { name: role._id, attributeOf: targetClass });
  const ops = client.apply();
  await ops.removeCollection(
    import_core.default.class.Role,
    import_core.default.space.Model,
    role._id,
    role.attachedTo,
    role.attachedToClass,
    "roles"
  );
  if (attribute !== void 0) {
    const mixins = await client.findAll(targetClass, {});
    for (const mixin of mixins) {
      await ops.updateMixin(mixin._id, mixin._class, mixin.space, targetClass, {
        [attribute.name]: void 0
      });
    }
    await ops.remove(attribute);
  }
  await ops.commit();
}
__name(deleteSpaceTypeRole, "deleteSpaceTypeRole");
//# sourceMappingURL=utils.js.map
