import { useEffect, useRef } from 'react';

export default async function useFetchCategorie(id) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/categories/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if(data) {
      return data;
    }
  } catch (e) {
    return false;
  }
}
