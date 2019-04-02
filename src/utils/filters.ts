export const numberFilter = (value: number, format: number): number => {
  return Number(value.toPrecision(format));
};

const patterns = {
  normal: [2, 4, 6, 8],
  plus: [3, 4, 6, 8, 10],
};
const regex = /^(?:(?:\+)\d{2})/;

export const formatPhone = (value: string) => {
  let paternToUse = patterns.normal;
  let tempVal = value
    .trim()
    .split(/ +/)
    .join('')
    .split('');
  if (regex.test(value)) {
    paternToUse = patterns.plus;
  }
  paternToUse.forEach((val, index) => {
    if (index + val < tempVal.length) {
      tempVal.splice(index + val, 0, ' ');
    }
  });
  return tempVal.join('');
};
