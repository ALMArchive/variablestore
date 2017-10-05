const files = [
   "ex01-construction.js",
   "ex02-set.js",
   "ex03-has.js",
   "ex04-get.js",
   "ex05-del.js",
   "ex06-clear.js",
   "ex07-getVars.js",
   "ex08-clearNonConst.js",
   "intro-example.js",
   "main-example.js"
]

for(const x of files) {
   require(`./${x}`);
}