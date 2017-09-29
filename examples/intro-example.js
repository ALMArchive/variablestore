const VariableStore = require('../variablestore.js');

const regex    = /^[a-zA-Z\_]\w*$/;
const restrictedNames = ["ans"];
const varStore = new VariableStore(regex, restrictedNames);

varStore.set({name: "a1", value: 2});
if(varStore.has("a1")) {
   console.log(varStore.get("a1")); // 2
}

try {
   varStore.set({name: "1a", value: 2});
} catch(e) {
   console.log(e.message) // Must satisfy regex
}

try {
   varStore.set({name: "ans", value: 2});
} catch(e) {
   console.log(e.message); // Variable cannot be reserved word
}