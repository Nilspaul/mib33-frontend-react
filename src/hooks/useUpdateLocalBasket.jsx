import { useEffect, useRef } from 'react';

const basket_key = 'basket';

export async function useUpdateLocalBasket(id, category, setBasketItems) {
  console.log('useUpdateLocalBasket', id, category);


  // Hole die aktuelle Liste der gespeicherten Produkte aus dem Local Storage
  const savedItems = JSON.parse(localStorage.getItem(basket_key)) || [];

  // Finde das Produkt im Warenkorb
  const index = savedItems.findIndex(item => item.id === id && item.category === category);

  if (index !== -1) {
    // Wenn das Produkt bereits vorhanden ist, entferne es aus der Liste
    savedItems.splice(index, 1);
  } else {
    // Wenn das Produkt nicht vorhanden ist, füge es zur Liste hinzu
    savedItems.push({ id, category });
  }

  setBasketItems(savedItems);
  localStorage.setItem(basket_key, JSON.stringify(savedItems));
}