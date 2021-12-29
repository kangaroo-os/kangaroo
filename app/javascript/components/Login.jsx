import React, { useState, useRef } from "react";
import api from "../helpers/api";
import Cookies from "js-cookie";

const Login = () => {
  const inputRef = useRef();
  const userRef = useRef();
  const passwordRef = useRef();
  const [showError, setShowError] = useState();

  function password() {
    api.post("/login", { password: inputRef.current.value }).then((res) => {
      if (res.data.logged_in) {
        window.location.href = "/desktop";
        setShowError(false);
      } else {
        setShowError(true);
      }
    });
  }

  function login() {
    api.post("/login", {
      username: userRef.current.value,
      password: passwordRef.current.value,
    }).then((res) => {
      if (res.data.logged_in) {
        window.location.href = "/desktop";
        setShowError(false);
      } else {
        setShowError(true);
      }
    });
  }

  const handleKeyLogin = (e) => {
    if (e.key === "Enter") {
      login();
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      password();
    }
  };

  return (
    <div>
      <h1 className="text-lg font-bold w-full text-center my-5">What's the password?</h1>
      <div className="flex justify-center">
        <input ref={inputRef} onKeyDown={handleKeyDown} className="bg-blue-200 rounded mx-5 p-1" type="text" />
        <button className="bg-gray-300 p-2 rounded" onClick={() => login()}>Submit</button>
      </div>
      {showError && <p className="text-red-500 text-center my-5">Wrong password</p>}
      <div className="mt-12">
        <h1 className="text-center font-bold text-lg">Olivia only stuff</h1>
        <div>
          <div className="flex justify-center my-2">
            <label for="">email</label>
            <input ref={userRef} onKeyDown={handleKeyLogin} className="bg-blue-200 rounded mx-5 p-1" type="text" />
          </div>
          <div className="flex justify-center my-2">
            <label for="">password</label>
            <input ref={passwordRef} onKeyDown={handleKeyLogin} className="bg-blue-200 rounded mx-5 p-1" type="text" />
          </div>
          <div className="flex justify-center my-2">
            <button className="m-auto rounded bg-gray-300 p-2">Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
