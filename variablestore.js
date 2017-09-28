"use strict";

function validateRegex(reg) {
   if(reg === undefined) return false;
   return !(reg instanceof RegExp) ? false : true;
}

function toString(val) {
   return val.toString() || (val + "");
}

function isString(str)    {
   return typeof str === 'string';
}

function isObject(value) {
  const type = typeof value;
  return value != null && (type == 'object' && !(type === 'function'));
}

class VariableStore {
   constructor(regex = /^[a-zA-Z\_]\w*$/, restrictedNames = []) {
      if(!validateRegex(regex))           throw new Error("Must pass regex to first parameter of VariableStore");
      if(!Array.isArray(restrictedNames)) throw new Error("Must pass array to second parameter of VariableStore");

      let variables = {};

      function validVariableName(varName) {
         return (!regex.test(varName)) ? false : true;
      }

      function restrictedName(varName) {
         return restrictedNames.indexOf(varName) != -1;
      }

      this.has = function has(varName) {
         return Reflect.has(variables, varName);
      }

      this.set = function set(obj) {
         if(restrictedName(obj.name)) {
            throw new Error(`Variable cannot be a reserved word. ${obj}`);
         }
         _set(obj);
      }

      this.setRestricted = function setRestricted(obj) {
         _set(obj);
      }

      function _set(obj) {
         if(!(obj.name && obj.value)) {
            throw new Error("Must provide name and value to set {name: Name, value: Value}");
         }
         if(variables[obj.name] && variables[obj.name].const) {
            throw new Error("Attempting to set constant variable");
         }
         if(!validVariableName(obj.name)) {
            throw new Error(`Invalid variable name, must satisfy regex: ${regex}`);
         }
         variables[obj.name] = {value: obj.value, const: !!obj.const};
      }

      this.get = function get(varName) {
         if(!this.has(varName)) {
            throw new Error("Variable does not exist");
         }
         return variables[varName].value;
      }

      this.del = function del(varName) {
         if(Array.isArray(varName)) {
            varName.map((elem) => delete variables[elem]);
         } else {
            delete variables[varName];
         }
      }

      this.clear = function clear() {
         variables = {};
      }

      this.getVariableNames = function getVariableNames() {
         return Object.keys(variables);
      }

      this.getVariableObjects = function getVariableObjects() {
         return variables;
      }
   }
}

module.exports = VariableStore;