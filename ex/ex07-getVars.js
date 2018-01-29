import VariableStore from '../variablestore';

const regex    = /^[a-zA-Z\_]\w*$/;
const restrictedNames = ["ans"];
const varStore = new VariableStore(regex, restrictedNames);

// Insert variables
varStore.set({name: "a", value: 2});
varStore.set({name: "b", value: 3});

// Get all variable names
console.log(varStore.variableNames); // ["a", "b"]

// Get all variable objects
console.log(varStore.variables); // [{a: {value: 2, const: false}}, {b: {value: 3, const: false}}]
