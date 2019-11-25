import { isFunc, UID } from "./internals";

export const callable = x => isFunc(x);

export const chr = x => String.fromCodePoint(x);

export const ord = (x: string) => x.codePointAt(0).toString(16);

export const dir = x => Object.getOwnPropertyNames(x);

export const divmod = (x, y) => {
  return [Math.floor(x / y), x % y];
};

export function* enumerate(iter) {
  let i = 0;
  for (let item of iter) {
    yield [i, item];
  }
}

export const filter = (fn, ...args) => args.filter(fn);

export const map = (fn, ...args) => args.map(fn);

const HASH_KEY = Symbol("__obj_symbol_uid__");

export const hash = obj => {
  if (!obj[HASH_KEY]) {
    obj[HASH_KEY] = UID();
  }
  return obj[HASH_KEY];
};

export const hex = n => n.toString(16);

export const oct = n => n.toString(8);

export const int = (x, base) => parseInt(x, base);

export const float = x => parseFloat(x);

export const list = (...args) => {
  return Array.from(args);
};

export const next = (iterator: Iterator<any>) => {
  return iterator.next();
};

export const object = () => {};
