const VariableStore = require('../variablestore.js');

const regex    = /^[a-zA-Z\_]\w*$/;
const restrictedNames = ["ans"];
const varStore = new VariableStore(regex, restrictedNames);

// Insert a variable
varStore.set({name: "a", value: 2});

// Can get variable values using get
console.log(varStore.get("a"));

// Will throw error if you attempt to get a non existant value
try {
   varStore.get("b");
} catch(e) {
   console.log(e.message); // Variable does not exist
}