const VariableStore = require('../variablestore.js');

const regex    = /^[a-zA-Z\_]\w*$/;
const restrictedNames = ["ans"];
const varStore = new VariableStore(regex, restrictedNames);

// Insert variables
varStore.set({name: "a", value: 2});
varStore.set({name: "b", value: 3});
varStore.set({name: "c", value: 4, const: true});
console.log(varStore.has("a")); // true
console.log(varStore.has("b")); // true

// Clear will clear all variables including constant
varStore.clearNonConst();
