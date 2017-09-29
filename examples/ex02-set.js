const VariableStore = require('../variablestore.js');

const regex    = /^[a-zA-Z\_]\w*$/;
const restrictedNames = ["ans"];
const varStore = new VariableStore(regex, restrictedNames);

// Variables must inserted as objects with {name (req), value (req), const (optional)}
const var1 = {name: "a", value: 1};
const var2 = {name: "b", value: 2, const: true};
varStore.set(var1);
varStore.set(var2);

// Attempt to set variable with object missing name and value
try {
   varStore.set({foo: 1, bar: 2});
} catch(e) {
   console.log(e.message); // insert object must have name and value
}

// Attempt to set variable with reserved name
try {
   varStore.set({name: "ans", value: 2});
} catch(e) {
   console.log(e.message); // Variable cannot be a reserved word: ans
}

// Restricted names can be set with setRestricted
varStore.setRestricted({name: "ans", value: "f"});
console.log(varStore.get("ans")); // f

// Attempt to overwrite a constant variable
try {
   varStore.set({name: "b", value: 3});
} catch(e) {
   console.log(e.message); // Cannot overwrite constant values
}
