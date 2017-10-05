"use strict";

function isObject(value) {
  return (typeof value === 'object' && !(Array.isArray(value)));
}

const Privates = Symbol("VariableStorePrivates");

class VariableStore {
   constructor(regex = /^[a-zA-Z\_]\w*$/, restrictedNames = []) {
      if(!(regex instanceof RegExp))        throw new Error("Must pass regex to first parameter of VariableStore");
      if(!Array.isArray(restrictedNames)) throw new Error("Must pass array to second parameter of VariableStore");

      this.Privates                 = {};
      this.Privates.variables       = {};
      this.Privates.restrictedNames = restrictedNames;
      this.Privates.regex           = regex;

      this.Privates.validVariableName = function validVariableName(varName) {
         return this.regex.test(varName) ? true : false;
      }

      this.Privates.restrictedName = function restrictedName(varName) {
         return this.restrictedNames.indexOf(varName) !== -1;
      }

      this.Privates.set = function _set(obj) {
         if(!(obj.name && obj.value)) {
            throw new Error("Must provide name and value to set {name: Name, value: Value}");
         }
         if(this.variables[obj.name] && this.variables[obj.name].const) {
            throw new Error("Attempting to set constant variable");
         }
         if(!this.validVariableName(obj.name)) {
            throw new Error(`Invalid variable name, must satisfy regex: ${regex}`);
         }
         this.variables[obj.name] = {value: obj.value, const: !!obj.const};
      }
   }

   has(varName) {
      return Reflect.has(this.Privates.variables, varName);
   }

   set(obj) {
      if(this.Privates.restrictedName(obj.name)) {
         throw new Error(`Variable cannot be a reserved word: ${obj.name}`);
      }
      this.Privates.set(obj);
   }

   setRestricted(obj) {
      this.Privates.set(obj);
   }

   get(varName) {
      if(!this.has(varName)) {
         throw new Error("Variable does not exist");
      }
      return this.Privates.variables[varName].value;
   }

   del(varName) {
      if(Array.isArray(varName)) {
         varName.map((elem) => delete this.Privates.variables[elem]);
      } else {
         delete this.Privates.variables[varName];
      }
   }

   clear() {
      this.Privates.variables = {};
   }

   clearNonConst() {
      let old = this.Privates.variables;
      this.Privates.variables = {};
      for(const prop in old) {
          if(old[prop].const) {
            this.Privates.variables[prop] = old[prop];
          }
      }
   }

   get variableNames() {
      return Object.keys(this.Privates.variables);
   }

   get variables() {
      return this.Privates.variables;
   }
}

module.exports = VariableStore;
