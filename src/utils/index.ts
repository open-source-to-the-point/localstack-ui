export const timeout = (milliSeconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliSeconds));
};
