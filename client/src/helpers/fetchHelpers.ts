/* Helper function for fetching data */

// checks if in development or production
const URL =
  import.meta.env.MODE === "development" ? "http://localhost:8080" : "";

console.log("ENVIRONMENT:", import.meta.env.MODE);
console.log("URL:", URL);

// fetches related to users
export const getAllUserData = async () => {
  const response = await fetch(`${URL}/api/user`);
  const result = await response.json();
  return result;
};

// fetches realted to auth
// logs the user in
export const login = async (formData: FormData) => {
  console.log("LOGGING IN");

  const response = await fetch(`${URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: formData.get("username"),
      password: formData.get("password"),
    }),
    credentials: "include",
  });
  const result = await response.json();
  console.log(result.message, result.user);
  return result;
};

//registers the user
export const register = async (formData: FormData) => {
  console.log("REGISTERING");

  const response = await fetch(`${URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: formData.get("username"),
      password: formData.get("password"),
      city: formData.get("city"),
    }),
    credentials: "include",
  });
  const result = await response.json();
  console.log(result.message, result.user);
  return result;
};

//checks if user is logged in and authorized
export const checkAuth = async () => {
  const response = await fetch(`${URL}/api/auth/user`, {
    credentials: "include",
  });
  const result = await response.json();
  console.log(result.message, result.user);
  return result;
};
