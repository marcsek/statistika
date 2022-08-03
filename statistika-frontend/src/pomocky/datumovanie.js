const filterDate = (duration) => {
  let requestData = { tick: "", amount: "" };

  if (typeof duration === "object") {
    const newDuration = Math.abs(duration.dateEnd.getTime() - duration.dateStart.getTime());
    requestData = { tick: "day", amount: Math.round(newDuration / (1000 * 3600 * 24)) - 1 };
    return requestData;
  }

  switch (duration) {
    case typeof Object:
      console.log("object");
      break;
    case "1d":
      requestData.tick = "hour";
      requestData.amount = "24";
      break;
    case "7d":
      requestData.tick = "hour";
      requestData.amount = "168";
      break;
    case "1m":
      requestData.tick = "day";
      requestData.amount = "30";
      break;
    case "3m":
      requestData.tick = "day";
      requestData.amount = "90";
      break;
    case "1y":
      requestData.tick = "day";
      requestData.amount = "365";
      break;
    case "all":
      requestData.tick = "day";
      requestData.amount = "365";
      break;
    default:
      console.log(duration);
      break;
  }

  return requestData;
};

const formatDate = (date) => {
  if (!date) {
    return;
  }
  let cas = [date.getHours().toString().padStart(2, "0"), date.getMinutes().toString().padStart(2, "0")].join(":");
  let datum = [
    date.getDate().toString().padStart(2, "0"),
    (date.getMonth() + 1).toString().padStart(2, "0"),
    date.getFullYear().toString().slice(-2),
  ].join("/");

  return [datum, cas].join(" ");
};

const getCompatibleValue = (stringDate) => {
  let datum = stringDate.split(" ")[0];
  let cas = stringDate.split(" ")[1].split(":");

  let dateSpread = datum.split("/");
  let doc = dateSpread[1];
  dateSpread[1] = dateSpread[0];
  dateSpread[0] = doc;
  datum = dateSpread.join("/");

  datum = new Date(datum).setHours(cas[0]);
  datum = new Date(datum).setMinutes(cas[1]);

  return datum;
};

export { filterDate, formatDate, getCompatibleValue };
