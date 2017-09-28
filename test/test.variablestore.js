"use strict"

const chai = require('chai');
const VariableStore = require('../variablestore.js');

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

describe("VariableStore", function() {
   describe("Construction", function() {
      it('Returned object should be VariableStore on empty parameters', function() {
         let varStore = new VariableStore();
         chai.expect(varStore.constructor.name === "VariableStore");
      });
      it('Returned object should be VariableStore on (Regex)', function() {
         let varStore = new VariableStore(/s/);
         chai.expect(varStore.constructor.name === "VariableStore");
      });
      it('Returned object should be VariableStore on (Regex, [])', function() {
         let varStore = new VariableStore(/s/, []);
         chai.expect(varStore.constructor.name === "VariableStore");
      });
      it('Error thrown when VariableStore passed object to first parameter', function() {
         chai.expect(() => new VariableStore({})).to.throw(Error);
      });
      it('Error thrown when VariableStore passed number to first parameter', function() {
         chai.expect(() => new VariableStore(1)).to.throw(Error);
      });
      it('Error thrown when VariableStore passed string to first parameter', function() {
         chai.expect(() => new VariableStore("")).to.throw(Error);
      });
      it('Error thrown when VariableStore passed array to first parameter', function() {
         chai.expect(() => new VariableStore([])).to.throw(Error);
      });
      it('Error thrown when VariableStore passed null to first parameter', function() {
         chai.expect(() => new VariableStore(null)).to.throw(Error);
      });
      it('Error thrown when VariableStore given (Regex, {})', function() {
         chai.expect(() => new VariableStore(/s/, {})).to.throw(Error);
      });
      it('Error thrown when VariableStore given (Regex, "")', function() {
         chai.expect(() => new VariableStore(/s/, "")).to.throw(Error);
      });
      it('Error thrown when VariableStore given (Regex, 0)', function() {
         chai.expect(() => new VariableStore(/s/, 0)).to.throw(Error);
      });
      it('Error thrown when VariableStore given (Regex, null)', function() {
         chai.expect(() => new VariableStore(/s/, "")).to.throw(Error);
      });
   });
   describe("No Variables in Store", function() {
      it('getVariableNames should return empty array on empty VariableStore', function() {
         let varStore = new VariableStore();
         chai.expect(varStore.getVariableNames().length).to.equal(0);
      });
      it('getVariableObjects should return empty array on empty VariableStore', function() {
         let varStore = new VariableStore();
         chai.expect(isEmpty(varStore.getVariableObjects())).to.be.true;
      });
      it('clear should leave object with no variables', function() {
         let varStore = new VariableStore();
         varStore.clear();
         chai.expect(varStore.getVariableNames().length).to.equal(0);
         chai.expect(isEmpty(varStore.getVariableObjects())).to.be.true;
      });
   });
   describe("Adding Variables to Store", function() {
      it('set on empty object should throw error', function() {
         let varStore = new VariableStore();
         chai.expect(() => varStore.set({})).to.throw(Error);
      });
      it('set on object with name but no value should throw error', function() {
         let varStore = new VariableStore();
         chai.expect(() => varStore.set({name:"a"})).to.throw(Error);
      });
      it('set on object with name but no value should throw error', function() {
         let varStore = new VariableStore();
         chai.expect(() => varStore.set({name:"a"})).to.throw(Error);
      });
      it('set on object with name and value should return undefined', function() {
         let varStore = new VariableStore();
         chai.expect(varStore.set({name:"a", value:"b"})).to.equal(undefined);
      });
      it('default regex should throw error on variables that begin with numbers', function() {
         let varStore = new VariableStore();
         chai.expect(() => varStore.set({name:"1s", value:"b"})).to.throw(Error);
      });
      it('default regex should throw error on variables that begin with symbols', function() {
         let varStore = new VariableStore();
         chai.expect(() => varStore.set({name:"$s", value:"b"})).to.throw(Error);
      });
      it('set should not be able to set using restricted names', function() {
         let varStore = new VariableStore(/s/g,["ans","bob"]);
         chai.expect(() => varStore.set({name:"ans", value:"b"})).to.throw(Error);
         chai.expect(() => varStore.set({name:"bob", value:"b"})).to.throw(Error);
      });
      it('setRestricted should be able to set using restricted names', function() {
         let varStore = new VariableStore(/\S+/g,["ans"]);
         chai.expect(() => varStore.set({name:"ans", value:"b"})).to.throw(Error);
         chai.expect(varStore.setRestricted({name:"ans", value:"b"})).to.equal(undefined);
      });
      it('set should not be able to change constant variables', function() {
         let varStore = new VariableStore();
         varStore.set({name:"a", value:"b", const: true});
         chai.expect(() => varStore.set({name:"a", value:"b"})).to.throw(Error);
      });
      it('set should be able to overwrite non-constant values', function() {
         let varStore = new VariableStore();
         varStore.set({name:"a", value:"b"});
         chai.expect(varStore.get("a")).to.equal("b");
         varStore.set({name:"a", value:"c"});
         chai.expect(varStore.get("a")).to.equal("c");
      });
   });
   describe("Interacting with loaded store", function() {
      it('has should return true for variables in store.', function() {
         let varStore = new VariableStore();
         varStore.set({name:"a", value:"b"});
         chai.expect(varStore.has("a")).to.be.true;
      });
      it('variable store should have both elements entered into variable store', function() {
         let varStore = new VariableStore();
         varStore.set({name:"a", value:"b"});
         varStore.set({name:"c", value:"d"});
         chai.expect(varStore.has("a")).to.be.true;
         chai.expect(varStore.has("c")).to.be.true;
      });
      it('clear should empty out the variable store', function() {
         let varStore = new VariableStore();
         varStore.set({name:"a", value:"b"});
         varStore.set({name:"c", value:"d"});
         chai.expect(varStore.has("a")).to.be.true;
         chai.expect(varStore.has("c")).to.be.true;
         chai.expect(varStore.getVariableNames().length).to.equal(2);
         chai.expect(!isEmpty(varStore));
         varStore.clear();
         chai.expect(varStore.has("a")).to.be.false;
         chai.expect(varStore.has("c")).to.be.false;
         chai.expect(varStore.getVariableNames().length).to.equal(0);
         chai.expect(isEmpty(varStore));
      });
      it('get should return the same value that was entered', function() {
         let varStore = new VariableStore();
         varStore.set({name:"a", value:"b"});
         varStore.set({name:"c", value:"d"});
         chai.expect(varStore.get("a")).to.equal("b");
         chai.expect(varStore.get("c")).to.equal("d");
      });
      it('delete should remove an element from variablestore', function() {
         let varStore = new VariableStore();
         varStore.set({name:"a", value:"b"});
         chai.expect(varStore.has("a")).to.be.true;
         varStore.del("a");
         chai.expect(varStore.has("a")).to.be.false;
      });
      it('delete passed an array should delete multiple variables at once.', function() {
         let varStore = new VariableStore();
         varStore.set({name:"a", value:"b"});
         varStore.set({name:"c", value:"d"});
         chai.expect(varStore.has("a")).to.be.true;
         chai.expect(varStore.has("c")).to.be.true;
         varStore.del(["a","c"]);
         chai.expect(varStore.has("a")).to.be.false;
         chai.expect(varStore.has("c")).to.be.false;
      });
      it('getVariableNames should return all variable names entered', function() {
         let varStore = new VariableStore();
         varStore.set({name:"a", value:"b"});
         varStore.set({name:"c", value:"d"});
         let varNames = varStore.getVariableNames();
         chai.expect(varNames.indexOf("a") != -1 && varNames.indexOf("c") != -1).to.be.true;
      });
      it('getVariableObjects should return all variable objects entered', function() {
         let varStore = new VariableStore();
         varStore.set({name:"a", value:"b"});
         varStore.set({name:"c", value:"d"});
         let variables = varStore.getVariableObjects();
         chai.expect(variables["a"].value === "b").to.be.true;
         chai.expect(variables["c"].value === "d").to.be.true;
      });
   });
});