import React, { useRef, useState } from "react";
import axios from "axios";
import api from "../helpers/api";

const App = () => {
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

  return (
    <div>
      <h1 className="text-lg font-bold w-full text-center my-5">What's the password?</h1>
      <div className="flex justify-center">
        <input ref={inputRef} className="bg-blue-200 rounded mx-5 p-1" type="text" />
        <button onClick={() => login()}>Submit</button>
      </div>
      {showError && <p className="text-red-500 text-center my-5">Wrong password</p>}
    </div>
  );
};

export default App;
