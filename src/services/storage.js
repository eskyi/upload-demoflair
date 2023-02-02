import axios from "axios";

const baseUrl = "/api";

const create = (newObject) => {
  const request = axios.put(baseUrl, newObject);
  return request.then((response) => response.data);
};

const exportedObject = { create };

export default exportedObject;
