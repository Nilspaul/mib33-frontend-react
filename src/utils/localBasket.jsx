const basket_key = 'basket';


export const isInBasket = (id, category) => {
  const savedItems = JSON.parse(localStorage.getItem(basket_key)) || [];
  return savedItems.some(item => item.id === id && item.category === category);
};

export const getItemsByCategory = (category = false) => {
  const savedItems = JSON.parse(localStorage.getItem(basket_key)) || [];
  if (category) {
    return savedItems.filter(item => item.category === category);
  }
  return savedItems;
};