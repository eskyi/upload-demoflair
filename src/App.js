import "./App.css";
import { useState } from "react";
import axios from "axios";

const App = () => {
  const [link, setLink] = useState("");
  const [button, showButton] = useState(true);
  const [file, setFile] = useState([]);
  const [progress, setProgress] = useState("");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const baseUrl = "https://storage.demoflair.com.au/";

  const uploadFile = (file, updateProgress) => {
    return axios
      .post(baseUrl + encodeURIComponent(file.name), file, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          let percent = Math.floor(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          updateProgress(percent + "%");
          if (percent === 100) {
            setSuccess(true);
            setMessage("Please wait...");
          }
        },
      })
      .then((response) => {
        setMessage("");
        setLink(response.data);
      })
      .catch((error) => {
        setSuccess(false);
        setProgress("");
        showButton(true);
        console.log(error);
        if (error.message === "Network Error") {
          setMessage("Sorry, please try again later.");
        } else {
          setMessage(error.message);
        }
      });
  };

  const uploadHandler = (e) => {
    const MAX_FILE_SIZE = 4950000;
    setProgress("");
    let fileSizeKiloBytes = file.size / 1024; // File Size in KB
    e.preventDefault();
    if (file.length === 0) {
      setMessage("Please select a file.");
    } else if (fileSizeKiloBytes > MAX_FILE_SIZE) {
      setMessage("Sorry, your file must be less than 4.95GB");
    } else {
      uploadFile(file, setProgress);
      showButton(false);
      setMessage("");
    }
  };

  const fileHandler = (e) => {
    setFile(e.target.files[0]);
    showButton(true);
    setSuccess(false);
    setProgress("");
    setMessage("");
    setLink("");
  };

  return (
    <>
      <h2>Upload a file</h2>
      <p>Max 4.95GB, 7 Day Retention</p>
      <form onSubmit={uploadHandler}>
        <input type="file" id="file" onChange={fileHandler} name="file"></input>
        {!success && <p id="status">{progress}</p>}
        {button && !success && (
          <button onClick={uploadHandler}>Get a link</button>
        )}
      </form>
      <p>{message}</p>
      <p>{success && <a href={link}>{link}</a>}</p>
    </>
  );
};

export default App;
