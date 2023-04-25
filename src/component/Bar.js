import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { signOut } from "firebase/auth";

import { auth } from "../firebase-config";

const StyledLink = styled(Link)({
  color: "inherit",
  textDecoration: "none",
});

function Bar({ onItemClick }, props) {
  return (
    <Router>
      <AppBar position="static">
        {/* {isLoggedIn && ( */}
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Button
              component={StyledLink}
              to="/SignIn"
              color="inherit"
              onClick={() => onItemClick("LogOut")}
            >
              Log Out
            </Button>
          </Typography>
          <Button
            component={StyledLink}
            to="/client"
            color="inherit"
            onClick={() => onItemClick("Client")}
          >
            Client
          </Button>
          <Button
            component={StyledLink}
            to="/product"
            color="inherit"
            onClick={() => onItemClick("Product")}
          >
            Product
          </Button>
          <Button
            component={StyledLink}
            to="/invoice"
            color="inherit"
            onClick={() => onItemClick("Invoice")}
          >
            Invoice
          </Button>
          <Button
            component={StyledLink}
            to="/invLigne"
            color="inherit"
            onClick={() => onItemClick("InvLigne")}
          >
            Invoice Ligne
          </Button>
        </Toolbar>
        {/* )} */}
      </AppBar>
    </Router>
  );
}

export default Bar;
