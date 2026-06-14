export const createID = (): number => {
  return Math.floor(Math.random() * 1000000);
};
// Must have the .flat() in the resultant array
export function randomChoice(array: any[]) {
  const indexSelected = Math.floor(Math.random() * array.length);
  const choice = array[indexSelected];
  const arraytmp = array.filter((e) => {
    return e !== choice;
  });
  array.length = 0;
  array.push(arraytmp);
  return choice;
}


