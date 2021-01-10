import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "myFire";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      setInit(true);
    })
  })
  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn}></AppRouter> : "Loading ..."}
      <div>Footer?</div>
    </>
  )
}

export default App;
