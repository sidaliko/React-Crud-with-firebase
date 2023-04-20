import Bar from "./component/Bar";
import Client from "./component/Client";
import Product from "./component/Product";
import Invoice from "./component/Invoice";
import InvLigne from "./component/InvLigne";
import CssBaseline from "@mui/material/CssBaseline";
import * as React from "react";

import { useState } from "react";
function App() {
  const [activeItem, setActiveItem] = useState("");

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <>
      <CssBaseline />
      {<Bar onItemClick={handleItemClick} />}
      {activeItem === "Client" && <Client />}
      {activeItem === "Product" && <Product />}
      {activeItem === "Invoice" && <Invoice />}
      {activeItem === "InvLigne" && <InvLigne />}
    </>
  );
}

export default App;
