import React, { useState, useRef } from "react";
import api from "../helpers/api";
import Cookies from "js-cookie";

const Login = () => {
  const inputRef = useRef();
  const [showError, setShowError] = useState();

  function login() {
    api.post("/login", { password: inputRef.current.value }).then((res) => {
      if (res.data.logged_in) {
        window.location.href = "/desktop";
        setShowError(false);
      } else {
        setShowError(true);
      }
    });
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      login();
    }
  };

  return (
    <div>
      <h1 className="text-lg font-bold w-full text-center my-5">What's the password?</h1>
      <div className="flex justify-center">
        <input ref={inputRef} onKeyDown={handleKeyDown} className="bg-blue-200 rounded mx-5 p-1" type="text" />
        <button onClick={() => login()}>Submit</button>
      </div>
      {showError && <p className="text-red-500 text-center my-5">Wrong password</p>}
    </div>
  );
};

export default Login;
