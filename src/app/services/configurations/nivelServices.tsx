import axios from "axios";

// URL de API
const API_URL = import.meta.env.VITE_APP_API_URL;
const TOKEN_KEY = "token";
const token = localStorage.getItem(TOKEN_KEY);

// Exporta cada función de forma individual.
export const getLista = async () => {
  try {
    const response = await axios.get(API_URL + "/hotel/configuracion/niveles/lista", {
      headers: {
        Authorization: `Bearer ${token}`, // Send the token in the Authorization header
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
export const getFind = async (id:number) => {
  try {
    const response = await axios.get(API_URL + "/hotel/configuracion/niveles/ver/" + id, {
      headers: {
        Authorization: `Bearer ${token}`, // Send the token in the Authorization header
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
export const postGuardar = async (data: { nombre: string, id:number }) => {
  try {
    const response = await axios.post(API_URL + "/hotel/configuracion/niveles/guardar",data,  {
      headers: {
        Authorization: `Bearer ${token}`, // Send the token in the Authorization header
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
export const deletRegister = async (data: { id:number }) => {
  try {
    const response = await axios.post(API_URL + "/hotel/configuracion/niveles/eliminar",data,  {
      headers: {
        Authorization: `Bearer ${token}`, // Send the token in the Authorization header
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
