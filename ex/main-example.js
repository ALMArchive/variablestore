import VariableStore from '../variablestore';

// Initialize your rejex and restrictedNames, and create a new varStore
const regex    = /^[a-zA-Z\_]\w*$/;
const restrictedNames = ["ans"];
const varStore = new VariableStore(regex, restrictedNames);

// Variables can be added to VariableStore with set, of the form
const varObj = {name: "a", value: "b"};
varStore.set(varObj);

// Variable names that violate the regex passed will throw error
try {
   varStore.set({name:"1a", value: "b"});
} catch(e) {
   console.log(e.message); // Invalid variable name, must satisfy regex
}

// Can see if VariableStore has variable with has
console.log(varStore.has("a")); // true

// Can get variable from VariableStore with get
console.log(varStore.get("a")); // b

// Add another variable
varStore.set({name: "b", value: "b"}); // undefined

// Can get all variable names with variableNames;
console.log(varStore.variableNames); // ["a", "b"]

// Can get all stored objects with variables
console.log(varStore.variables); // [a: {value: "b", const: false}, b: {name: "b", const: false}]

// Can delete a variable with del
console.log(varStore.has("a")); // true
varStore.del("a");
console.log(varStore.has("a")); // false

// Add variable back
varStore.set({name: "a", value: "b"});

// Delete multiple variables at once with del by passing in array
console.log(varStore.has("a")); // true
console.log(varStore.has("b")); // true
varStore.del(["a", "b"]);
console.log(varStore.has("a")); // false
console.log(varStore.has("b")); // false

// Restricted names cannot be added using set, will throw error
try {
   varStore.set({name: "ans", value: "b"});
} catch(e) {
   console.log(e.message); // Cannot set variable to restricted name
}

// Restricted names can be added using setRestricted
varStore.setRestricted({name: "ans", value: "b"});
console.log(varStore.get("ans")); // "b"

// clear will empty all variables, including const
varStore.set({name: "a", value: "b"});
varStore.set({name: "b", value: "d"});
console.log(varStore.variableNames); // ["a", "b"]
varStore.clear();
console.log(varStore.variableNames); // []

// clearNonConst will empty all variables, except const
varStore.set({name: "a", value: "b"});
varStore.set({name: "b", value: "d"});
varStore.set({name: "c", value: "c", const: true});
console.log(varStore.variableNames); // ["a", "b", "c"]
varStore.clearNonConst();
console.log(varStore.variableNames); // ["c"]

// Variables declared as const cannot have their value change, will throw error
console.log(varStore.has("c")); // true

try {
   varStore.set({name: "c", value: "d"});
} catch(e) {
   console.log(e.message); // Cannot change const value
}
