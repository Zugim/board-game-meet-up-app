import { useState, useEffect } from "react";
import { getAllUserData } from "./helpers/fetchHelpers";
import "./App.css";

function App() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    (async () => setUserData(await getAllUserData()))();
  }, []);

  /* ~~~~~~~~~~ LOGGING ~~~~~~~~~~ */
  useEffect(() => {
    console.log(userData);
  }, [userData]);
  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  return <h1>Board Game Meet Up App</h1>;
}

export default App;
