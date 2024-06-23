import { singular as pluralizeSingular } from "pluralize";

/**
Singularizes a word/name, i.e. `items` to `item`.

@param {string} original - The word/name to singularize.
@returns {string|undefined} - The singularized result, or `undefined` if attempting singularization resulted in no change.
*/
export const singular = original => {
  const singularized = pluralizeSingular(original);
  if (singularized !== original) {
    return singularized;
  }
};

export default singular;
