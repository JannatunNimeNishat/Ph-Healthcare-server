// ei function ta check kortece amra je field gula tik kore rekhaci oigulai input e astece ki na
// amader tik kore deya field er bahirer field gulo asle ai function pick korbe na
const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Partial<T> => {
  const finalObj: Partial<T> = {};
  for (const key of keys) {
    //object er modde property ase ki na abar property tar value o ase ki na eita check kora hosce
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
  }
  return finalObj;
};

export default pick;
