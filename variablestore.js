"use strict";

function isObject(value) {
  return (typeof value === 'object' && !(Array.isArray(value)));
}

function VariableStore(regex = /^[a-zA-Z\_]\w*$/, restrictedNames = []) {
   if(!(regex instanceof RegExp))        throw new Error("Must pass regex to first parameter of VariableStore");
   if(!Array.isArray(restrictedNames)) throw new Error("Must pass array to second parameter of VariableStore");

   let variables = {};

   function validVariableName(varName) {
      return regex.test(varName) ? true : false;
   }

   function restrictedName(varName) {
      return restrictedNames.indexOf(varName) !== -1;
   }

   this.has = function has(varName) {
      return Reflect.has(variables, varName);
   }

   this.set = function set(obj) {
      if(restrictedName(obj.name)) {
         throw new Error(`Variable cannot be a reserved word: ${obj.name}`);
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

   this.clearNonConst = function clearNonConst() {
      let old = variables;
      variables = {};
      for(const prop in old) {
          if(old[prop].const) {
            variables[prop] = old[prop];
          }
      }
   }

   this.getVariableNames = function getVariableNames() {
      return Object.keys(variables);
   }

   this.getVariableObjects = function getVariableObjects() {
      return variables;
   }
}

module.exports = VariableStore;
