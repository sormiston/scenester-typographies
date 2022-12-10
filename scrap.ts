// HMM!!  Looks hard as fuck to do recursive programming with TS
// const transformString = Object.entries(styleData.transform).reduce(
//   (acc, [k, v]) => {
//     return (acc + `${k}: ${v[0] + " " + v[1]}; `).trim();
//   },
//   ""
// );
// function flattenStyleData(input) {
//   if (Array.isArray(input)) {
//     return `${input[0]}${input[1]}`;
//   } else {
//     return Object.entries(input)
//       .map(([k, v]) => `${k}(${v[0] + v[1]})`)
//       .join(" ")
//       .trim();
// return Object.fromEntries(
//   Object.entries(input).map(([k, v]) => [
//     k,
//     mapStyles(v as Array<number | string> | Record<string, unknown>),
//   ])
// );
