import { useState, useEffect } from "react";
import { getAllUserData } from "./helpers/fetchHelpers";

// styles
import "./App.css";

//components
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";

import { checkAuth } from "./helpers/fetchHelpers";

function App() {
  // const [userData, setUserData] = useState(null);

  // useEffect(() => {
  //   (async () => setUserData(await getAllUserData()))();
  // }, []);

  /* ~~~~~~~~~~ LOGGING ~~~~~~~~~~ */
  // useEffect(() => {
  //   console.log(userData);
  // }, [userData]);
  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  return (
    <>
      <h1>Board Game Meet Up App</h1>
      <LoginPage />
      <RegisterPage />
      <button onClick={checkAuth}>Check Auth</button>
    </>
  );
}

export default App;
