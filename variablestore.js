"use strict";

class VariableStore {
   constructor(regex = /^[a-zA-Z\_]\w*$/, restrictedNames = ["ans"]) {
      if(!Array.isArray(invalidNames)) throw new Error("Must bass array to second parameter of VariableStore");
      let variables = {};

      function toString(val) {
         return val.toString() || (val + "");
      }

      function isString(str)    { return typeof str === 'string'; }

      function isObject(value) {
        const type = typeof value;
        return value != null && (type == 'object' && !(type === 'function'));
      }

      function validVariableName(varName) {
         const reg = regex;
         if(!reg.test(varName)) return false;
         if(const val of invalidNames) {
            if(varName === val) {
               return false;
            }
         }
         return true;
      }

      function restrictedName(varName) {
         return restrictedNames.indexOf(varName) != -1;
      }

      this.has = function has(varName) {
         return Reflect.has(variables, varName);
      }

      this.set = function set(obj) {
         if(!restrictedVariableName(obj)) {
            throw new Error(`Variable cannot be a reserved word. ${obj}`);
         }
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
            throw new Error("Invalid variable name, must not be reserved word, start with number or contain non-alphanumeric characters excpet underscore");
         }
         variables[obj.name] = {value: obj.value, const: !!obj.const || false };
      }

      this.get = function get(varName) {
         if(!variables[varName]) {
            throw new Error("Variable does not exist");
         }
         return variables[varName].value;
      }

      this.del = function del(varName) {
         if(Array.isArray(varName)) {
            for(let tmp of varName) {
               delete variables[tmp];
            }
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