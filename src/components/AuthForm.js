import React, { useState } from "react";
import { authService } from "fb_info";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [newAccount, setNewAccount] = useState("");
  const [error, setError] = useState("");
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "nickname") {
      setNickname(value);
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (newAccount) {
        // create account
        await authService
          .createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            user.updateProfile({
              displayName: nickname,
            });
          });
      } else {
        // log in
        await authService.signInWithEmailAndPassword(email, password);
      }
    } catch (error) {
      setError(error.message);
    }
  };
  const toggleAccount = () => setNewAccount((prev) => !prev);
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <br />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <br />
        {newAccount && (
          <>
            <input
              name="nickname"
              type="text"
              placeholder="nickname"
              required
              value={nickname}
              onChange={onChange}
            />
            <br />
          </>
        )}
        <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
        <br />
        {error}
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? "Sign In" : "Create Account"}
      </span>
    </>
  );
};

export default AuthForm;
