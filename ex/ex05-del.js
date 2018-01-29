import VariableStore from '../variablestore';

const regex    = /^[a-zA-Z\_]\w*$/;
const restrictedNames = ["ans"];
const varStore = new VariableStore(regex, restrictedNames);

// Insert a variable
varStore.set({name: "a", value: 2});
console.log(varStore.has("a")); // true

// Delete variable using delete
varStore.del("a");
console.log(varStore.has("a"));

varStore.set({name: "a", value: 2});
varStore.set({name: "b", value: 3});
console.log(varStore.has("a")); // true
console.log(varStore.has("b")); // true

// Can delete multiple variables at a time by passing array
varStore.del(["a", "b"]);
console.log(varStore.has("a")); // false
console.log(varStore.has("b")); // false

// Deleting non-existant variables will do nothing
varStore.del("h");
