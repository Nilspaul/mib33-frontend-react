import { useEffect, useRef } from 'react';

export default async function useFetchCategories(category) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/categories?sort=order`);
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
