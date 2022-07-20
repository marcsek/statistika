export default function filterDate(duration) {
  let requestData = { tick: "", amount: "" };

  switch (duration) {
    case "1d":
      requestData.tick = "hour";
      requestData.amount = "24";
      break;
    case "7d":
      requestData.tick = "hour";
      requestData.amount = "168";
      break;
    case "1m,":
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
      break;
  }

  return requestData;
}
