export const idx = x => x;

export const not = fn => (...args) => !fn(...args);

export const False = () => false;

export const True = () => true;

export const isTruthy = x => !!x;

export const and = (...args) => args.every(x => isTruthy(x));

export const or = (...args) => args.some(x => isTruthy(x));

// export const error = (msg) => () => new Error(msg);

export const str = any => Object.prototype.toString.call(any);

// const isValue = (x) => x != null;

const type = value => {
  const _type = typeof value;
  if (_type == "object") {
    if (value) {
      if (value instanceof String) return "string";
      if (value instanceof Boolean) return "boolean";
      if (value instanceof Function) return "function";
      // IE improperly marshals typeof across execution contexts, but a
      // cross-context object will still return false for "instanceof Object".
      if (value instanceof Array) return "array";

      const className = str(value);
      // In Firefox 3.6, attempting to access iframe window objects' length
      // property throws an NS_ERROR_FAILURE, so we need to special-case it
      // here.
      if (className == "[object Window]") return "object";

      // We cannot always use constructor == Array or instanceof Array because
      // different frames have different Array objects.
      // Mark Miller noticed that Object.prototype.toString
      // allows access to the unforgeable [[Class]] property.
      //  15.2.4.2 Object.prototype.toString ( )
      //  When the toString method is called, the following steps are taken:
      //      1. Get the [[Class]] property of this object.
      //      2. Compute a string value by concatenating the three strings
      //         "[object ", Result(1), and "]".
      //      3. Return Result(2).
      // and this behavior survives the destruction of the execution context.
      if (className.endsWith("Array]") || Array.isArray(value)) {
        return "array";
      }
      // HACK: There is still an array case that fails.
      //     function ArrayImpostor() {}
      //     ArrayImpostor.prototype = [];
      //     var impostor = new ArrayImpostor;
      // this can be fixed by getting rid of the fast path
      // (value instanceof Array) and solely relying on
      // (value && Object.prototype.toString.vall(value) === '[object Array]')
      // but that would require many more function calls and is not warranted
      // unless closure code is receiving objects from untrusted sources.

      // IE in cross-window calls does not correctly marshal the function type
      // (it appears just as an object) so we cannot use just typeof val ==
      // 'function'. However, if the object has a call property, it is a
      // function.
      if (className.endsWith("Function]") || typeof value.call == "function") {
        return "function";
      }
      if (className == "[object Promise]" || value instanceof Promise) {
        return "promise";
      }
    } else {
      return "null";
    }
  } else if (_type == "function" && typeof value.call == "undefined") {
    // In Safari typeof nodeList returns 'function', and on Firefox typeof
    // behaves similarly for HTML{Applet,Embed,Object}, Elements and RegExps. We
    // would like to return object for those and we can detect an invalid
    // function by making sure that the function object has a call method.
    return "object";
  } else {
    if (Number.isNaN(value)) return "NaN";
  }
  return _type;
};

export const now = new Date().getTime();

/**
 * Unique id generator function (pseudo-random)
 */
export const UID = (Math.random() * 1e9) >>> 0;

const isObject = x => type(x) == "object";

const isString = x => type(x) == "string";

const isArray = x => type(x) == "array";

const isFunction = x => type(x) == "function";

const isNumber = x => type(x) == "number";

const isAsync = x => str(x) == "[object AsyncFunction]";

export const isNone = x => x == null;

const eq = (x, y) => x === y;

const ne = (x, y) => x !== y;

const lte = (x, y) => x <= y;

const lt = (x, y) => x < y;

const gte = (x, y) => x >= y;

const gt = (x, y) => x > y;

const comp = (x, y) => (lte(x, y) ? -1 : 1);

const compKey = (cmp = comp, key = idx) => (...args) =>
  cmp.apply([], args.map(key));

export const map = (fn, ...args) => args.map(fn);

export const sorted = (args, key = idx, reverse = false, cmp = comp) => {
  if (isObject(args)) args = Object.keys(args);
  const compareFn = compKey(cmp, key);
  args.sort(compareFn);
  if (reverse) {
    args.reverse();
  }
  return args;
};

export const min = (...args) => {
  let cmp = comp; // use lte by default
  if (isFunction(args[0])) {
    cmp = args.shift();
  }
  args.sort(cmp);
  return args[0];
};

export const max = (...args) => {
  let cmp = comp;
  if (isFunction(args[0])) {
    cmp = args.shift();
  }
  args.sort(cmp);
  return args[args.length - 1];
};

export const len = x => {
  if (x["__len__"]) {
    return x.__len__();
  }
  if (x.length != undefined) {
    return x.length;
  }
  if (x.size != undefined) {
    return x.size;
  }
  if (isObject(x)) {
    return Object.keys(x).length;
  }
};
