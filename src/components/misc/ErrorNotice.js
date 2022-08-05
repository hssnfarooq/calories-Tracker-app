import React from "react";
export default function ErrorNotice({ message }) {
  console.log("coming inside error", message);
  return (
    message.length > 0 &&
    message.map((msg, index) => (
      // <div className="error-notice" key={index}>
      //   <span>{msg.msg}</span>
      // </div>
      <div key={index} className="alert alert-danger fade show" role="alert">
        <span
          className="fa fa-exclamation-triangle"
          style={{ marginRight: "10px" }}
        ></span>
        {msg.msg}
      </div>
    ))
  );
}
