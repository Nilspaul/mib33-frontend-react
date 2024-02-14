export const formatPrice = (number, locale = 'de-DE') =>  {
  if(number) {
    return number.toLocaleString(locale, {
        style: 'currency',
        currency: 'EUR'
    });
  }
  return '';
}