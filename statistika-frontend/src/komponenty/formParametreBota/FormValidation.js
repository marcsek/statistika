//vsetko bere event
const obParValidation = (e) => {
  if (/^[a-zA-Z/]+$/.test(e.target.value) && e.target.value.split("/").length === 2) {
    return true;
  }
};

const isPositiveInt = (e) => {
  if (/^[0-9]+$/.test(e.target.value) || e.target.value === "") {
    return true;
  }
};

const isNumber = (e) => {
  if (!isNaN(e.target.value)) {
    return true;
  }
};

const isPercent = (e) => {
  if ((isPositiveInt(e.target.value) && parseInt(e.target.value) <= 100) || e.target.value === "") {
    return true;
  }
};

const isNonNullString = (e) => {
  if (/^[a-zA-Z]+$/.test(e.target.value) || e.target.value === "") {
    return true;
  }
};

const isVarChar = (e) => {
  if (!/\s/.test(e.target.value) || e.target.value === "") {
    return true;
  }
};

export { obParValidation, isPositiveInt, isNumber, isNonNullString, isPercent, isVarChar };
