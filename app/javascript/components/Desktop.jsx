import React, { useRef, useState } from "react";
import api from "../helpers/api";
import Cookies from "js-cookie";
import FileIcon from "../components/shared/FileIcon";

const Desktop = () => {
  const [token, setToken] = useState(Cookies.get("kangaroo_token"));
  const [fileList, setFileList] = useState();
  const [authorized, setAuthorized] = useState(false);
  const [file, setFile] = useState();
  const inputRef = useRef();

  function uploadFile() {
    let formData = new FormData();
    formData.append("file", file);
    api.post("/upload", formData, { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } }).then((res) => {
      console.log(res);
    });
  }

  if (!token && !authorized) {
    window.location.href = "/";
    return null;
  } else {
    api.post("/authorized", { token }).then((res) => {
      if (!res.data.authorized) {
        window.location.href = "/";
        return null;
      } else {
        setAuthorized(true);
        api.get("/files", { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
          setFileList(res.data.files);
        });
      }
    });
  }

  const renderFileList = (files) => {
    return files.map((file) => {
      return <FileIcon name={file} />;
    });
  };

  return (
    <div className="p-5">
      <input className="block m-auto mt-5" ref={inputRef} type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button className="block m-auto bg-orange-200 p-1 rounded my-5" onClick={uploadFile}>
        Upload
      </button>
      {fileList && renderFileList(fileList)}
    </div>
  );
};

export default Desktop;
