/**
 * @summary Generate a random Id
 */
export const generateRandomId = () => {
  return (Math.random().toString(36) + Date.now().toString(36)).substring(
    2,
    10
  );
};
