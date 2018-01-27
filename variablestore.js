const CLASS_SYMBOL = Symbol('VariableStore Symbol');

export default class VariableStore {
  constructor(regex = /^[a-zA-Z]\w*$/, restrictedNames = []) {
    if (!(regex instanceof RegExp)) throw new Error('Must pass regex to first parameter of VariableStore');
    if (!Array.isArray(restrictedNames)) throw new Error('Must pass array to second parameter of VariableStore');
    this[CLASS_SYMBOL] = {
      variables: {},
      restrictedNames,
      regex,
    };

    this[CLASS_SYMBOL].validVariableName = function validVariableName(varName) {
      return this.regex.test(varName);
    };

    this[CLASS_SYMBOL].restrictedName = function restrictedName(varName) {
      return this.restrictedNames.indexOf(varName) !== -1;
    };

    this[CLASS_SYMBOL].set = function _set(obj) {
      if (!(obj.name && obj.value)) {
        throw new Error('Must provide name and value to set {name: Name, value: Value}');
      }
      if (this.variables[obj.name] && this.variables[obj.name].const) {
        throw new Error('Attempting to set constant variable');
      }
      if (!this.validVariableName(obj.name)) {
        throw new Error(`Invalid variable name, must satisfy regex: ${regex}`);
      }
      this.variables[obj.name] = { value: obj.value, const: !!obj.const };
    };
  }

  has(varName) {
    return Reflect.has(this[CLASS_SYMBOL].variables, varName);
  }

  set(toSet) {
    if (this[CLASS_SYMBOL].restrictedName(toSet.name)) {
      throw new Error(`Variable cannot be a reserved word: ${toSet.name}`);
    }
    if (Array.isArray(toSet)) toSet.map(e => this[CLASS_SYMBOL].set(e));
    else this[CLASS_SYMBOL].set(toSet);
  }

  setRestricted(obj) {
    this[CLASS_SYMBOL].set(obj);
  }

  get(varName) {
    if (!this.has(varName)) {
      throw new Error('Variable does not exist');
    }
    return this[CLASS_SYMBOL].variables[varName].value;
  }

  del(varName) {
    if (Array.isArray(varName)) {
      varName.map(elem => delete this[CLASS_SYMBOL].variables[elem]);
    } else {
      delete this[CLASS_SYMBOL].variables[varName];
    }
  }

  clear() {
    this[CLASS_SYMBOL].variables = {};
  }

  /* eslint-disable no-param-reassign */
  clearNonConst() {
    const old = this[CLASS_SYMBOL].variables;

    const newVars = Object.keys(old)
      .filter(e => !!old[e].const)
      .reduce((a, c) => {
        (a[c] = old[c]);
        return a;
      }, {});

    this[CLASS_SYMBOL].variables = newVars;
  }

  get variableNames() {
    return Object.keys(this[CLASS_SYMBOL].variables);
  }

  get variables() {
    return this[CLASS_SYMBOL].variables;
  }
}
