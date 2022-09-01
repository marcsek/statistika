const formatPrice = (price, separator) => {
  let rounded = Math.round(price * 100) / 100;
  rounded = rounded % 1 === 0 ? rounded : rounded.toFixed(2);
  return numberWithSpaces(rounded, separator);
};

const formatCrypto = (amount, decimal) => {
  let numberOfDecimals = 1;
  if (decimal) {
    for (let i = 0; i < decimal; i++) {
      numberOfDecimals *= 10;
    }
  } else {
    numberOfDecimals = 10000;
  }
  return Math.round((amount + Number.EPSILON) * numberOfDecimals) / numberOfDecimals;
};

const numberWithSpaces = (number, separator) => {
  let parts = number.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator ? separator : " ");
  return parts.join(".");
};

function getPercentageChange(newNumber, oldNumber) {
  let decreaseValue = oldNumber - newNumber;

  return formatPrice((decreaseValue / oldNumber) * 100);
}

function isPositiveInteger(str) {
  if (/^[0-9]+$/.test(str) || str === "") {
    return true;
  }
  return false;
}

export { formatPrice, formatCrypto, getPercentageChange, isPositiveInteger };
