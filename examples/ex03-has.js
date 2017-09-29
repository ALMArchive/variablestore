const VariableStore = require('../variablestore.js');

const regex    = /^[a-zA-Z\_]\w*$/;
const restrictedNames = ["ans"];
const varStore = new VariableStore(regex, restrictedNames);

// Insert a variable
varStore.set({name: "a", value: 2});

// See if the variable is in the store
console.log(varStore.has("a")); // true

// See if random variable is in the store
console.log(varStore.has("foo")); // false