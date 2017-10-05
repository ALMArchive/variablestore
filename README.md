# VariableStore
A variable data store using to privately store variables using a map like interface.

```javascript
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
```

## Installing
`npm install variablestore`

## Main Example
Setup.
```javascript
// Initialize your rejex and restrictedNames, and create a new varStore
const regex    = /^[a-zA-Z\_]\w*$/;
const restrictedNames = ["ans"];
const varStore = new VariableStore(regex, restrictedNames);
```

Add variables to data store.
```javascript
// Variables can be added to VariableStore with set, of the form
const varObj = {name: "a", value: "b"};
varStore.set(varObj);

// Variable names that violate the regex passed will throw error
try {
   varStore.set({name:"1a", value: "b"});
} catch(e) {
   console.log(e.message); // Invalid variable name, must satisfy regex
}
```

Check for membership, and return value from VariableStore.
```javascript
// Can see if VariableStore has variable with has
console.log(varStore.has("a")); // true

// Can get variable from VariableStore with get
console.log(varStore.get("a")); // b
```

Retrieve all variable names or variable objects.
```javascript
// Add another variable
varStore.set({name: "b", value: "b"}); // undefined

// Can get all variable names with variableNames;
console.log(varStore.variableNames); // ["a", "b"]

// Can get all stored objects with variables
console.log(varStore.variables); // [a: {value: "b", const: false}, b: {name: "b", const: false}]
```

Delete elements
```javascript
// Can delete a variable with del
console.log(varStore.has("a")); // true
varStore.del("a");
console.log(varStore.has("a")); // false
```

Delete multiple elements at once
```javascript
// Add variable back
varStore.set({name: "a", value: "b"});

// Delete multiple variables at once with del by passing in array
console.log(varStore.has("a")); // true
console.log(varStore.has("b")); // true
varStore.del(["a", "b"]);
console.log(varStore.has("a")); // false
console.log(varStore.has("b")); // false
```

Cannot set variable names to restricted values using set.
```javascript
// Restricted names cannot be added using set, will throw error
try {
   varStore.set({name: "ans", value: "b"});
} catch(e) {
   console.log(e.message); // Cannot set variable to restricted name
}
```

Can set variable names to restricted values using setRestricted.
```javascript
// Restricted names can be added using setRestricted
varStore.setRestricted({name: "ans", value: "b"});
console.log(varStore.get("ans")); // "b"
```

clear will clear all variables, including const
```javascript
// Clear will empty all variables, including const
varStore.set({name: "a", value: "b"});
varStore.set({name: "b", value: "d"});
console.log(varStore.variableNames); // ["a", "b"]
varStore.clear();
console.log(varStore.variableNames); // []
```

clearNonConst will clear all variables except const
```javascript
// clearNonConst will empty all variables, except const
varStore.set({name: "a", value: "b"});
varStore.set({name: "b", value: "d"});
varStore.set({name: "c", value: "c", const: true});
console.log(varStore.variableNames); // ["a", "b", "c"]
varStore.clearNonConst();
console.log(varStore.variableNames); // ["c"]
```

Cannot over write const values
```javascript
// Variables declared as const cannot have their value change, will throw error
console.log(varStore.has("c")); // true

try {
   varStore.set({name: "c", value: "d"});
} catch(e) {
   console.log(e.message); // Cannot change const value
}
```

## API

### VariableStore
Constructor takes a valid regex and array of restricted variable names.
Invalid regexs will throw an error on construction.
If second parameter is not an array an error will throw.

#### Construction
```javascript
const regex    = /^[a-zA-Z\_]\w*$/;
const restrictedNames = ["ans"];

const varStore1 = new VariableStore();
const varStore2 = new VariableStore(regex);
const varStore3 = new VariableStore(regex, restrictedNames);
```
Returns VariableStore object.

#### Computer Properties

#### variableNames
Returns an array of all variable names currently in store.
```javascript
const regex    = /^[a-zA-Z\_]\w*$/;
const restrictedNames = ["ans"];
const varStore = new VariableStore(regex, restrictedNames);

// Insert variables
varStore.set({name: "a", value: 2});
varStore.set({name: "b", value: 3});

// Get all variable names
console.log(varStore.variableNames); // ["a", "b"]
```

#### variables
Returns an array of all variable names currently in store.
```javascript
const regex    = /^[a-zA-Z\_]\w*$/;
const restrictedNames = ["ans"];
const varStore = new VariableStore(regex, restrictedNames);

// Insert variables
varStore.set({name: "a", value: 2});
varStore.set({name: "b", value: 3});

// Get all variable objects
console.log(varStore.variables); // [{a: {value: 2, const: false}}, {b: {value: 3, const: false}}]
```

#### Methods

##### set
Set adds a value to the variable store. Must be specific form, and not be a reserved word.
```javascript
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

// Attempt to overwrite a constant variable
try {
   varStore.set({name: "b", value: 3});
} catch(e) {
   console.log(e.message);
}
```
Will throw an error if the variable name doesn't match the regex or the name is a restricted value;

#### setRestricted
Allows for setting restrictedValues as variable names
```javascript
// Restricted names can be set with setRestricted
varStore.setRestricted({name: "ans", value: "f"});
console.log(varStore.get("ans")); // f
```
Will throw an error if the variable name doesn't match the regex.

#### has
Returns boolen value of whether value is in variable store.
```javascript
const regex    = /^[a-zA-Z\_]\w*$/;
const restrictedNames = ["ans"];
const varStore = new VariableStore(regex, restrictedNames);

// Insert a variable
varStore.set({name: "a", value: 2});

// See if the variable is in the store
console.log(varStore.has("a")); // true

// See if random variable is in the store
console.log(varStore.has("foo")); // false
```

#### get
Will retrieve the variable value from the store, or throw an error if it does not contain variable.
```javascript
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
```
Throws error if an invalid variable is accessed.

#### del
Used to delete variables from VariableStore, either single name, or array of names.
```javascript
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
```

#### clear
Used to clear variables, including constants.
```javascript
const regex    = /^[a-zA-Z\_]\w*$/;
const restrictedNames = ["ans"];
const varStore = new VariableStore(regex, restrictedNames);

// Insert variables
varStore.set({name: "a", value: 2});
varStore.set({name: "b", value: 3});
console.log(varStore.has("a")); // true
console.log(varStore.has("b")); // true

// Clear will clear all variables including constant
varStore.clear();
console.log(varStore.has("a")); // false
console.log(varStore.has("b")); // false
```

#### clearNonConst
Used to clear variables except constants
```javascript
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
```

## Scripts

#### Testing
To run mocha/chai tests.
`npm run test`

#### Examples
To run the main example.
`npm run ex`

## License
VariableStore.js is released under the MIT license.
