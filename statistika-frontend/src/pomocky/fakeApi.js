import { faker } from "@faker-js/faker";

const getPage = async (number) => {
  let data = [];
  console.log(number);
  for (let i = (number - 1) * 10 + 1; i < number * 10 + 1; i++) {
    data.push({
      cislo: i.toString(),
      datum: faker.datatype.datetime({ min: 1047500000000, max: 1658500000000 }),
      obPar: "ETH - USDT",
    });
  }

  return { totalItems: 150, data: [...data] };
};

export { getPage };
