import axios from "axios";

// URL de API
const API_URL = import.meta.env.VITE_APP_API_URL;
const TOKEN_KEY = "token";
const token = localStorage.getItem(TOKEN_KEY);
// Exporta cada función de forma individual.
export const getLista = async () => {
  try {
    const response = await axios.get(API_URL + "/hotel/configuracion/tarifas/lista", {
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
export const getListaPaginate = async (page:number, limit:number) => {
  try {
    const response = await axios.get(API_URL + "/hotel/configuracion/tarifas/lista?page="+page+"&limit="+limit, {
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
    const response = await axios.get(API_URL + "/hotel/configuracion/tarifas/ver/" + id, {
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
    const response = await axios.post(API_URL + "/hotel/configuracion/tarifas/guardar",data,  {
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
    const response = await axios.post(API_URL + "/hotel/configuracion/tarifas/eliminar",data,  {
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
