export function operatorImpl(operator, a, ...args) {
  if (!isNull(a) && isFunc(a[operator])) {
    return a[operator](...args)
  }
}

export function typeOf(value) {
  const _type = typeof value
  if (_type == 'object') {
    if (value) {
      if (value instanceof String) return 'string'
      if (value instanceof Boolean) return 'boolean'
      if (value instanceof Function) return 'function'
      // IE improperly marshals typeof across execution contexts, but a
      // cross-context object will still return false for "instanceof Object".
      if (value instanceof Array) return 'array'

      const className = str(value)
      // In Firefox 3.6, attempting to access iframe window objects' length
      // property throws an NS_ERROR_FAILURE, so we need to special-case it
      // here.
      if (className == '[object Window]') return 'object'

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
      if (className.endsWith('Array]') || Array.isArray(value)) {
        return 'array'
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
      if (className.endsWith('Function]') || typeof value.call == 'function') {
        return 'function'
      }
      if (className == '[object Promise]' || value instanceof Promise) {
        return 'promise'
      }
      if (className == '[object Symbol]') {
        return 'symbol'
      }
    } else {
      return 'null'
    }
  } else if (_type == 'function' && typeof value.call == 'undefined') {
    // In Safari typeof nodeList returns 'function', and on Firefox typeof
    // behaves similarly for HTML{Applet,Embed,Object}, Elements and RegExps. We
    // would like to return object for those and we can detect an invalid
    // function by making sure that the function object has a call method.
    return 'object'
  } else {
    if (Number.isNaN(value)) return 'NaN'
  }
  return _type
}

export const str = (any) => Object.prototype.toString.call(any)

export const isBool = (x) => typeOf(x) === 'boolean'

export const isObject = (x) => typeOf(x) == 'object'

export const isString = (x) => typeOf(x) == 'string'

export const isArray = (x) => typeOf(x) == 'array'

export const isArrayLike = (x) => {
  const T = typeOf(x)
  return T === 'array' || (T === 'object' && isNumber(x.length))
}

export const isFunc = (x) => typeOf(x) == 'function'

export const isNumber = (x) => typeOf(x) == 'number'

export const isBigint = (x) => typeOf(x) == 'bigint'

export const isNaN = (x) => Number.isNaN(x)

export const isPromise = (x) => typeOf(x) === 'promise'

export const isAsync = (x) => str(x) == '[object AsyncFunction]'

export const isNull = (x) => x == null

export const isValue = (x) => !isNull(x)

export const isSymbol = (x) => typeOf(x) === 'symbol'

/**
 * Unique id generator function (pseudo-random)
 */
export const UID = () => (Math.random() * 1e10) >>> 0
