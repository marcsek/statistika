const formatPrice = (price, separator) => {
  let rounded = Math.round(price * 100) / 100;
  rounded = rounded % 1 === 0 ? rounded : rounded.toFixed(2);
  return numberWithSpaces(rounded, separator);
};

const formatCrypto = (amount) => {
  return Math.round((amount + Number.EPSILON) * 10000) / 10000;
};

const numberWithSpaces = (number, separator) => {
  let parts = number.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator ? separator : " ");
  return parts.join(".");
};

export { formatPrice, formatCrypto };
