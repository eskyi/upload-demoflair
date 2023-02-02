import "./App.css";
import { useState } from "react";
import storageService from "./services/storage";

const App = () => {
  const [message, setMessage] = useState("");
  const [button, showButton] = useState(true);
  const [file, setFile] = useState([]);

  const uploadHandler = (e) => {
    // Start the upload. Use storageService and use axios put to send PUT request to
    // storageWorker.js which is hosted at storage.demoflair.com.au to help GET and PUT files
    // Check file size before uploading
    storageService.create(file);
    // Capture error and send error message to message, 429, other errors?
  };

  const fileHandler = (e) => {
    setFile(e.value);
  };

  return (
    <>
      <h2>Upload a file</h2>
      <p>Max 4.95GB, 7 Day Retention</p>
      <input type="file" id="file" onChange={fileHandler} name="file"></input>
      <h3 id="status"></h3>
      {button && (
        <button onClick={uploadHandler} name="submit" className="btn">
          Get a link
        </button>
      )}
      <p>{message}</p>
    </>
  );
};

export default App;
