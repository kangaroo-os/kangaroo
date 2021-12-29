import React, { useRef } from "react";
import axios from "axios";
import api from "../helpers/api";

const App = () => {
  const inputRef = useRef();
  function login() {
    api.post("/login", { password: inputRef.current.value }).then((res) => {
      console.log(res);
    });
  }

  return (
    <div>
      <h1 className="text-lg font-bold w-full text-center my-5">What's the password?</h1>
      <div className="flex justify-center">
        <input ref={inputRef} className="bg-blue-200 rounded mx-5 p-1" type="text" />
        <button onClick={() => login()}>Submit</button>
      </div>
    </div>
  );
};

export default App;
