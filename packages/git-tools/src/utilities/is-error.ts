export const getObjectTag = (value: unknown): string => {
  if (value == null) {
    return value === undefined ? "[object Undefined]" : "[object Null]";
  }
  return Object.prototype.toString.call(value);
};

export const isObjectLike = (obj: unknown) => {
  return typeof obj === "object" && obj !== null;
};

export const isPlainObject = (obj: unknown) => {
  if (!isObjectLike(obj) || getObjectTag(obj) !== "[object Object]") {
    return false;
  }
  if (Object.getPrototypeOf(obj) === null) {
    return true;
  }
  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto;
};

export const isObject = (value: unknown): value is object => {
  try {
    return (
      typeof value === "object" || (!!value && value.constructor === Object) || isPlainObject(value)
    );
  } catch (_) {
    return false;
  }
};

export const isError = (obj: unknown): obj is Error => {
  if (!isObject(obj)) {
    return false;
  }

  const tag = getObjectTag(obj);
  return (
    tag === "[object Error]" ||
    tag === "[object DOMException]" ||
    (typeof (obj as Error)?.message === "string" &&
      typeof (obj as Error)?.name === "string" &&
      !isPlainObject(obj))
  );
};
