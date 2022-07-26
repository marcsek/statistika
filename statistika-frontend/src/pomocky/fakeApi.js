import { faker } from "@faker-js/faker";
import { formatDate } from "../pomocky/datumovanie";

var dataGen = [];
var dataFilter = [];
for (let i = 1; i < 151; i++) {
  dataGen.push({
    cislo: i.toString(),
    datum: faker.datatype.datetime({ min: 1047500000000, max: 1658500000000 }),
    obPar: "ETH - USDT",
    cena: faker.datatype.float({
      min: 1000,
      max: 500000,
    }),
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
    newData = newData.sort((a, b) =>
      !filters.ascend.typeNum ? parseFloat(a.cislo) - parseFloat(b.cislo) : parseFloat(b.cislo) - parseFloat(a.cislo)
    );
  } else if (filters.ascend.curType === "price") {
    console.log(filters.ascend);
    newData = newData.sort((a, b) => (!filters.ascend.typePrice ? a.cena - b.cena : b.cena - a.cena));
    console.log(newData);
  }
  dataFilter = newData;
  return getPage(1);
};

var textValues = ["0.24", "434349", "Neviem", "434", "434", "434", "434", "434", "434", "434"];

const getTextValues = async () => {
  await sleep(400);
  return textValues;
};

const setNewTextValues = async (newTextValues) => {
  await sleep(400);
  textValues = newTextValues;
  return textValues;
};

var celkovyVyvinData = {
  h24: { e: 1300.45, b: 0.24544, p: 10 },
  d7: { e: 16433.35, b: 0.24544, p: 10 },
  m3: { e: -344333.64, b: -0.24544, p: -10 },
  cc: { e: 143300, b: 3.24544 },
};
const getCelkovyVyvinData = async () => {
  await sleep(100);
  return celkovyVyvinData;
};

const getFakeListData = async () => {
  let burzi = [];
  for (let i = 0; i < 5; i++) {
    let boti = [];
    for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
      boti.push({
        bMeno: `Bot ${i + 1}`,
        cena: {
          e: faker.datatype.float({
            min: 1000,
            max: 500000,
          }),
          b: faker.datatype.float({
            min: 0.00025,
            max: 10.0,
            precision: 0.0001,
          }),
        },
        botPar: "ETH-USDT",
        zmena: {
          h24: faker.datatype.float({
            min: -100,
            max: 100.0,
            precision: 0.01,
          }),
          d7: faker.datatype.float({
            min: -100,
            max: 100.0,
            precision: 0.01,
          }),
          d30: faker.datatype.float({
            min: -100,
            max: 100.0,
            precision: 0.01,
          }),
          cc: faker.datatype.float({
            min: -100,
            max: 100.0,
            precision: 0.01,
          }),
        },
        chart: Math.round(Math.random()),
      });
    }
    burzi.push({ meno: `Burza ${i + 1}`, boti: [...boti] });
  }
  await sleep(100);
  return burzi;
};

export { getPage, filtrujData, getTextValues, setNewTextValues, getCelkovyVyvinData, getFakeListData };
