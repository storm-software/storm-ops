import { Initializable } from "../types";

/**
 * Decorator to ensure the class is initialized before executing a method
 *
 * @param {any} target
 * @param {string} propertyKey
 * @param {PropertyDescriptor} descriptor
 * @returns {PropertyDescriptor}
 */
export const ensureInitialized = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor => {
  const originalMethod = descriptor.value;
  descriptor.value = async function (...arguments_: any[]) {
    const self = this as Initializable;

    if (
      self.initialized === undefined ||
      typeof self.initialize !== "function"
    ) {
      throw new TypeError(
        `The ensureInitialized decorator can only be applied in classes with an 'initialized' property and 'initialize' method.`
      );
    }

    if (!self.initialized) {
      await self.initialize();
    }

    return originalMethod.apply(this, arguments_);
  };

  return descriptor;
};
