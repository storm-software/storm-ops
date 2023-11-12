/**
 * This is a boilerplate custom hasher that matches
 * the default Nx hasher. If you need to extend the behavior,
 * you can consume workspace details from the context.
 */
export const buildHasher = async (task, context) => {
  return context.hasher.hashTask(task, context.taskGraph);
};

export default buildHasher;
