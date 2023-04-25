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

import "./App.css";

function App() {
  const [activeItem, setActiveItem] = useState("");
  const [sign, setSign] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showBackground, setShowBackground] = useState(true); // new state variable

  useEffect(() => {
    const authToken = localStorage.getItem("user");
    if (authToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleItemClick = (item) => {
    setActiveItem(item);
    setShowBackground(false);
    if (item === "LogOut") {
      const confirmLogOut = window.confirm("Are you sure to log out");
      if (confirmLogOut) {
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
      } else {
        setShowBackground(true);
      }
    }
  };

  const handleSignIn = () => {
    setSign(true);
    setShowBackground(true); // set the state to true after signing in
  };

  return (
    <>
      <CssBaseline />
      {isLoggedIn || sign ? (
        <>
          {/* Render the Bar component with background image conditionally */}
          {showBackground && (
            <div className="showback">
              <Bar onItemClick={handleItemClick} />
            </div>
          )}
          {!showBackground && <Bar onItemClick={handleItemClick} />}
          {/* Render the appropriate component based on the activeItem state */}
          {activeItem === "Client" && <Client />}
          {activeItem === "Product" && <Product />}
          {activeItem === "Invoice" && <Invoice />}
          {activeItem === "InvLigne" && <InvLigne />}
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
