/* Helper function for fetching data */

// checks if in development or production
const URL =
  import.meta.env.MODE === "development" ? "http://localhost:8080" : "";
console.log("ENVIRONMENT", import.meta.env.MODE);
console.log("URL: ", URL);

export const getAllUserData = async () => {
  const response = await fetch(`${URL}/api/user`);
  const result = await response.json();
  return result;
};
