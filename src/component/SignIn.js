import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useState } from "react";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../firebase-config";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Firebase
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignup = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        props.onSignIn();
        setEmail("");
        setPassword("");
        localStorage.setItem("user", JSON.stringify(user));
        props.setSign(false);
        props.setIsLoggedIn(true);

        // ...
      })
      .catch((error) => {
        handleError(error);
        // ..
      });
  };

  const handleSignin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        props.onSignIn();
        setEmail("");
        setPassword("");
        localStorage.setItem("user", JSON.stringify(user));
        props.setSign(false);
        props.setIsLoggedIn(true);

        // ...
      })
      .catch((error) => {
        handleError(error);
      });
  };
  function isValidEmail(email) {
    // Use a regular expression to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPassword(password) {
    return password.length >= 8;
  }

  const handleError = () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }
    if (!isValidPassword(password)) {
      setError("Please enter a password with at least 8 characters");
      return;
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>

          <Box
            component="form"
            // onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              value={password}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <Box
                component="span"
                sx={{ display: "block", color: "red", textAlign: "center" }}
              >
                {error}
              </Box>
            )}

            <Button
              type="submit"
              size="medium"
              variant="contained"
              onClick={handleSignin}
              sx={{ mt: 3, mb: 2, width: 190, marginRight: 2 }}
            >
              Sign In
            </Button>
            <Button
              type="submit"
              variant="contained"
              onClick={handleSignup}
              sx={{ mt: 3, mb: 2, width: 190 }}
            >
              Sign UP
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
