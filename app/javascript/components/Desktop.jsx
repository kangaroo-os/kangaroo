import React, { useRef, useState, useEffect } from "react";
import api from "../helpers/api";
import Cookies from "js-cookie";
import FileIcon from "../components/shared/FileIcon";

const Desktop = () => {
  const [initialMount, setInitialMount] = useState(true);
  const [fileList, setFileList] = useState();
  const [authorized, setAuthorized] = useState(false);
  const [file, setFile] = useState();
  const inputRef = useRef();

  const token = Cookies.get("kangaroo_token");

  useEffect(() => {
    if (initialMount) {
      if (!token) {
        window.location.href = "/";
      } else {
        api.post("/authorized", { token: token }).then((res) => {
          if (!res.data.authorized) {
            window.location.href = "/";
            return null;
          } else {
            getFiles();
          }
        });
      }
    }
    setInitialMount(false);
  }, []);

  function getFiles() {
    api.get("/files", { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
      setFileList(res.data.files);
    });
  }

  function uploadFile() {
    let formData = new FormData();
    formData.append("file", file);
    api.post("/upload", formData, { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } }).then((res) => {
      console.log(res);
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
