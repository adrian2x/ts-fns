import {
  operatorImpl,
  typeOf,
  isNull,
  isValue,
  isObject,
  isFunc,
  isNumber,
  isArray,
  isString,
} from './internals'

export const idx = (x) => x

export const False = () => false

export const True = () => true

export const bool = (x) => !!x

const not = (x) => !x

const is_ = (x, y) => x instanceof y

const isinstance = (x, y) => x instanceof y

const isNot = (x, y) => !is_(x, y)

export const all = (...args) => args.every((x) => bool(x))

export const and_ = (...args) => all(...args)

export const any = (...args) => args.some((x) => bool(x))

export const or_ = (...args) => any(...args)

/**
 * Returns a function that throws an error with a given message.
 * @param msg The error message
 */
export const error = (msg: string) => () => {
  throw new Error(msg)
}

export const now = new Date().getTime()

const lt = (x, y) => {
  const impl = operatorImpl('__lt__', x, y)
  if (isValue(impl)) return impl
  return x < y
}

const lte = (x, y) => {
  let impl = operatorImpl('__lte__', x, y)
  if (isValue(impl)) return impl
  impl = operatorImpl('__eq__', x, y)
  if (impl === true) return impl
  impl = operatorImpl('__lt__', x, y)
  if (isValue(impl)) return impl
  return x <= y
}

const eq = (x, y) => {
  const impl = operatorImpl('__eq__', x, y)
  if (isValue(impl)) return impl
  return x === y
}

const ne = (x, y) => !eq(x, y)

const gte = (x, y) => {
  let impl = operatorImpl('__gte__', x, y)
  if (isValue(impl)) return impl
  impl = operatorImpl('__eq__', x, y)
  if (impl === true) return impl
  impl = operatorImpl('__gt__', x, y)
  if (isValue(impl)) return impl
  return x >= y
}

const gt = (x, y) => {
  const impl = operatorImpl('__gt__', x, y)
  if (isValue(impl)) return impl
  return x > y
}

const add = (x, y) => {
  const impl = operatorImpl('__add__', x, y)
  if (isValue(impl)) return impl
  return x + y
}

const sub = (x, y) => {
  const impl = operatorImpl('__sub__', x, y)
  if (isValue(impl)) return impl
  return x - y
}

const div = (x, y) => {
  const impl = operatorImpl('__div__', x, y)
  if (isValue(impl)) return impl
  return x / y
}

const mult = (x, y) => {
  const impl = operatorImpl('__mult__', x, y)
  if (isValue(impl)) return impl
  return x * y
}

const mod = (x, y) => {
  const impl = operatorImpl('__mod__', x, y)
  if (isValue(impl)) return impl
  return x % y
}

const pow = (x, y) => {
  const impl = operatorImpl('__pow__', x, y)
  if (isValue(impl)) return impl
  return Math.pow(x, y)
}

const abs = (x: number) => {
  const impl = operatorImpl('__pow__', x)
  if (isValue(impl)) return impl
  return Math.abs(x)
}

const contains = (arr, y) => {
  const impl = operatorImpl('__contains__', arr, y)
  if (isValue(impl)) return impl
  return indexOf(arr, y) >= 0
}

const comp = (x, y) => {
  let impl = operatorImpl('__compare__', x, y)
  if (isNumber(impl)) return impl
  if (eq(x, y)) return 0
  impl = lte(x, y)
  if (impl) return -1
  impl = gte(x, y)
  if (impl) return 1
  return 0
}

const compKey =
  (cmp = comp, key = idx) =>
  (...args) =>
    cmp.apply([], args.map(key))

export const sorted = (args: any[], key = idx, reverse = false, cmp = comp) => {
  if (isObject(args)) args = Object.keys(args)
  const compareFn = compKey(cmp, key)
  args.sort(compareFn)
  if (reverse) {
    args.reverse()
  }
  return args
}

export const min = (...args) => {
  // Uses lte by default
  let cmp = comp
  // First argument can be a comparer func
  if (isFunc(args[0])) {
    cmp = args.shift()
  }
  args.sort(cmp)
  return args[0]
}

export const max = (...args) => {
  // Uses lte by default
  let cmp = comp
  // First argument can be a comparer func
  if (isFunc(args[0])) {
    cmp = args.shift()
  }
  args.sort(cmp)
  return args[args.length - 1]
}

export const len = (x) => {
  if (isValue(x.length)) {
    return x.length
  }
  if (isValue(x.size)) {
    return x.size
  }
  const impl = operatorImpl('__len__', x)
  if (impl) return impl
  if (isObject(x)) {
    return Object.keys(x).length
  }
}

export const indexOf = (arr, x, fromIndex = 0) => {
  const length = arr.length
  if (fromIndex < 0) {
    fromIndex = Math.max(fromIndex + length, 0)
  }
  if (isString(arr)) {
    if (fromIndex >= length) return -1
    return arr.indexOf(x, fromIndex)
  }
  for (let i = fromIndex; i < length; i++) {
    if (arr[i] === x) return i
  }
  return -1
}

export const clone = (obj, deep = false) => {
  if (isArray(obj)) {
    return cloneArray(obj, deep)
  }
  if (isObject(obj)) {
    if (isFunc(obj.clone)) {
      return obj.clone()
    }
    const copyObj = {}
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (deep) {
          copyObj[key] = clone(obj[key], deep)
        } else {
          copyObj[key] = obj[key]
        }
      }
    }
    return copyObj
  }
  return obj
}

export const cloneArray = (arr, deep = false) => {
  if (!deep) return [].concat(arr)
  return arr.map((item) => clone(item, deep))
}

export const bind = (fn, self, ...args) => {
  return fn.bind(self, ...args)
}

export const partial = (fn, ...args) => {
  return bind(fn, undefined, ...args)
}

export const getattr = (x, attr) => {
  return x[attr]
}

export const setattr = (x, attr, value) => {
  x[attr] = value
  return x
}

export const delattr = (x, attr) => {
  delete x[attr]
  return x
}
