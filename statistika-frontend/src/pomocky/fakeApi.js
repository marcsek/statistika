import { faker } from "@faker-js/faker";
import { formatDate } from "../pomocky/datumovanie";

var dataGen = [];
var dataFilter = [];
for (let i = 1; i < 151; i++) {
  dataGen.push({
    cislo: i.toString(),
    datum: faker.datatype.datetime({ min: 1047500000000, max: 1658500000000 }),
    obPar: "ETH - USDT",
  });
}
dataFilter = [...dataGen];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getPage = async (number) => {
  let data = [];
  let lastFullPage = Math.trunc(dataFilter.length / 15);

  for (let i = (number - 1) * 15; i < (lastFullPage < number ? dataFilter.length : number * 15); i++) {
    data.push({ ...dataFilter[i] });
  }
  await sleep(500);
  return { totalItems: dataFilter.length, data: [...data] };
};

const filtrujData = async (filters) => {
  await sleep(500);
  let newData = [];
  newData = dataGen.filter(({ obPar }) => obPar.toLowerCase().includes(filters.obPar.toLowerCase()));
  newData = newData.filter(({ cislo }) => cislo.includes(filters.cislo));
  newData = newData.filter(({ datum }) => {
    let filterPass = true;
    const date = new Date(datum);
    const dateStart = new Date(filters.dateStart ? filters.dateStart : "07/22/1977");
    const dateEnd = new Date(filters.dateEnd ? filters.dateEnd : formatDate(new Date()));

    if (dateStart) {
      filterPass = filterPass && dateStart < date;
    }
    if (dateEnd && filterPass) {
      filterPass = filterPass && dateEnd > date;
    }
    return filterPass;
  });

  if (filters.ascend.curType === "date") {
    newData = newData.sort((a, b) => (filters.ascend.typeDate ? Number(a.datum) - Number(b.datum) : Number(b.datum) - Number(a.datum)));
  } else if (filters.ascend.curType === "num") {
    console.log(filters.ascend.typeNum);
    newData = newData.sort((a, b) =>
      !filters.ascend.typeNum ? parseFloat(a.cislo) - parseFloat(b.cislo) : parseFloat(b.cislo) - parseFloat(a.cislo)
    );
  }
  dataFilter = newData;
  return getPage(1);
};

export { getPage, filtrujData };
