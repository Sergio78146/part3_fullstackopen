import axios from 'axios';

const baseUrl = 'http://localhost:3001/api/persons';  // Asegúrate de que la URL base sea correcta

const getAll = () => {
  return axios.get(baseUrl).then(response => response.data);
};

const create = (newPerson) => {
  return axios.post(baseUrl, newPerson).then(response => response.data);
};

const remove = (id) => {
  const url = `${baseUrl}/${id}`;
  return axios.delete(url);
};

const update = (id, updatedPerson) => {
  const url = `${baseUrl}/${id}`;
  return axios.put(url, updatedPerson).then(response => response.data);
};

export default { getAll, create, remove, update };
