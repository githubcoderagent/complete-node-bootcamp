// function getAllKeysConditionally(
//   obj,
//   includeSelf = true,
//   includePrototypeChain = true,
//   includeTop = false,
//   includeEnumerables = true,
//   includeNonenumerables = true,
//   includeStrings = true,
//   includeSymbols = true,
// ) {
//   // Boolean (mini-)functions to determine any given key's eligibility:
//   const isEnumerable = (obj, key) => Object.propertyIsEnumerable.call(obj, key);
//   const isString = (key) => typeof key === 'string';
//   const isSymbol = (key) => typeof key === 'symbol';
//   const includeBasedOnEnumerability = (obj, key) =>
//     (includeEnumerables && isEnumerable(obj, key)) ||
//     (includeNonenumerables && !isEnumerable(obj, key));
//   const includeBasedOnKeyType = (key) =>
//     (includeStrings && isString(key)) || (includeSymbols && isSymbol(key));
//   const include = (obj, key) =>
//     includeBasedOnEnumerability(obj, key) && includeBasedOnKeyType(key);
//   const notYetRetrieved = (keys, key) => !keys.includes(key);

//   // filter function putting all the above together:
//   const filterFn = (key) => notYetRetrieved(keys, key) && include(obj, key);

//   // conditional chooses one of two functions to determine whether to exclude the top level or not:
//   const stopFn = includeTop
//     ? (obj) => obj === null
//     : (obj) => Object.getPrototypeOf(obj) === null;

//   // and now the loop to collect and filter everything:
//   let keys = [];
//   while (!stopFn(obj, includeTop)) {
//     if (includeSelf) {
//       const ownKeys = Reflect.ownKeys(obj).filter(filterFn);
//       keys = keys.concat(ownKeys);
//     }
//     if (!includePrototypeChain) {
//       break;
//     } else {
//       includeSelf = true;
//       obj = Object.getPrototypeOf(obj);
//     }
//   }
//   return keys;
// }

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
