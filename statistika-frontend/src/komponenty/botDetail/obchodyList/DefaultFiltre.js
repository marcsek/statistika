const initialStart = new Date(946681200000);
const initialEnd = new Date();
const defaultFilters = {
  buy: null,
  datum: "",
  maker: null,
  ascend: { curType: "date", typeDate: false, typeNum: false, typePrice: false },
  dateStart: initialStart,
  dateEnd: initialEnd,
};

export { initialEnd, initialStart, defaultFilters };
