import axios from "axios";

function getCSRFToken() {
  return document.querySelector('meta[name="csrf-token"]').getAttribute("content");
}

const api = axios.create({
  xsrfHeaderName: "X-CSRFToken",
  headers: {
    common: {
      "X-CSRF-TOKEN": getCSRFToken(),
    },
  },
});

export default api;
