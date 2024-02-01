export const rng = (lo: number, hi: number) =>
  Math.floor(Math.random() * (hi - lo + 1)) + lo;

export const shuffle = (arr: any[]) => {
  const shuffledArr = [];

  while (arr.length != 0) {
    const el = arr.splice(rng(0, arr.length - 1), 1);
    shuffledArr.push(el[0]);
  }

  return shuffledArr;
};

export const sortByKey = (
  data: any,
  elements: { name: string }[],
  key: string | number
) => {
  const work: string[] = [];
  const values: { [key: string]: any } = {};

  typeof key == "string"
    ? elements.forEach((el) => {
        values[el.name] = data[el.name][key];
        work.push(el.name);
      })
    : elements.forEach((el) => {
        values[el.name] = data[el.name]["stats"][key];
        work.push(el.name);
      });

  let i = 0;
  while (i < elements.length) {
    let j = i;
    let currElement = values[work[j]];
    let prevElement = values[work[j - 1]];
    while (j > 0 && currElement < prevElement) {
      const temp = work[j];
      work[j] = work[j - 1];
      work[j - 1] = temp;
      j--;
      currElement = values[work[j]];
      prevElement = values[work[j - 1]];
    }
    i++;
  }

  return work;
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
