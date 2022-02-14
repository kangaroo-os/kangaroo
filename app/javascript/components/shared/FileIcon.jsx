import React from "react";

export const FileIcon = ({ name }) => {
  return (
    <div>
      <img src="https://kangarooo.s3.amazonaws.com/kangaroo/fileicon.png" className="rounded max-h-[50px]"/>
      <p>{name}</p>
    </div>
  );
};

export default FileIcon;
