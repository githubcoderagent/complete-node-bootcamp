//console.log(arguments);

const C = require('./test-module-1');

const calc1 = new C();
console.log(calc1.add(2, 5));

const calc2 = require('./test-module-2');
console.log(calc2.add(2,5));

require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();