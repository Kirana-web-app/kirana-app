// Utility function to combine class names
export const classNames = (
  ...classes: (string | undefined | null | boolean)[]
): string => {
  return classes.filter(Boolean).join(" ");
};
