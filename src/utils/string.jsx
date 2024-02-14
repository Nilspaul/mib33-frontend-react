export const truncate = (str, num, addEllipsis = '...') => {
  if (str && str.length > num) {
    if (addEllipsis) {
      return str.slice(0, num) + '...';
    } else {
      return str.slice(0, num);
    }
  }
  return str;
}

export const removeSpaces = (str) => {
  if(!str) {
    return str;
  }
  return str.replace(/\s+/g, '');
}

export const isStringEmpty = (str) => {
  if(!str) {
    return str;
  }
  return str.trim().length === 0;
}

export const slug = (str) => {
  if(!str) {
    return str;
  }
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export const nl2br = (str) => {
  if(!str) {
    return str;
  }
  return str.replace(/\n/g, '<br>');
}