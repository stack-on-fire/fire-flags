const getAppUrl = () =>
  (process.env.NODE_ENV === "development" && "http://localhost:3000") ||
  (process.env.NODE_ENV === "production" && "https://flags.stackonfire.dev") ||
  "http://localhost:3000";

const useAppUrl = () => {
  return getAppUrl();
};

export { useAppUrl, getAppUrl };
