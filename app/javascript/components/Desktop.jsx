import React, { useRef, useState } from "react";
import api from "../helpers/api";
import Cookies from "js-cookie";

const Desktop = () => {
  const [token, setToken] = useState(Cookies.get("kangaroo_token"));

  if (!token) {
    window.location.href = "/";
    return null;
  } else {
    api.post("/authorized", { token }).then((res) => {
      if (!res.data.authorized) {
        window.location.href = "/";
        return null;
      }
    });
  }
  return (
    <div className="p-5">
      <input type="file" />
    </div>
  );
};

export default Desktop;
