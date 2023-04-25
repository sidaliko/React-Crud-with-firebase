import Bar from "./component/Bar";
import Client from "./component/Client";
import Product from "./component/Product";
import Invoice from "./component/Invoice";
import InvLigne from "./component/InvLigne";
import SignIn from "./component/SignIn";
import CssBaseline from "@mui/material/CssBaseline";
import * as React from "react";

import { signOut } from "firebase/auth";

import { auth } from "./firebase-config";
import { useState, useEffect } from "react";

function App() {
  const [activeItem, setActiveItem] = useState("");
  const [sign, setSign] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem("user");
    if (authToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleItemClick = (item) => {
    setActiveItem(item);
    if (item === "LogOut") {
      signOut(auth)
        .then(() => {
          localStorage.removeItem("user");
          setSign(false);
          setIsLoggedIn(false);

          // Sign-out successful.
        })
        .catch((error) => {
          // An error happened.
        });
    }
  };

  const handleSignIn = () => {
    setSign(true);
  };

  return (
    <>
      <CssBaseline />
      {isLoggedIn || sign ? (
        <>
          {" "}
          <Bar onItemClick={handleItemClick} />
          {activeItem === "Client" && <Client />}
          {activeItem === "Product" && <Product />}
          {activeItem === "Invoice" && <Invoice />}
          {activeItem === "InvLigne" && <InvLigne />}
          {/* {activeItem === "LogOut" && <SignIn />} */}
        </>
      ) : (
        <SignIn
          onSignIn={handleSignIn}
          setSign={setSign}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
    </>
  );
}

export default App;
