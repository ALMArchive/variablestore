import VariableStore from '../variablestore';

const regex    = /^[a-zA-Z\_]\w*$/;
const restrictedNames = ["ans"];

const varStore1 = new VariableStore();
const varStore2 = new VariableStore(regex);
const varStore3 = new VariableStore(regex, restrictedNames);
