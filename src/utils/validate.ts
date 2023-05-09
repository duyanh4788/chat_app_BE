export enum TypeOfValue {
  STRING = 'String',
  NUMBER = 'Number',
  BOOLEAN = 'Boolean',
  ARRAY = 'Array',
  OBJECT = 'Object'
}

export const isCheckedTypeValues = (value: any, types: TypeOfValue, noneChecked: boolean = true): boolean => {
  const typeOf = Object.prototype.toString.call(value).slice(8, -1);
  switch (types) {
    case TypeOfValue.STRING:
      if (value === '' && noneChecked) return false;
      break;
    case TypeOfValue.NUMBER:
      if (value <= 0 && noneChecked) return false;
      break;
    case TypeOfValue.ARRAY:
      if (value.length <= 0 && noneChecked) return false;
      break;
    default:
      break;
  }
  return Object.values(TypeOfValue).includes(typeOf as TypeOfValue);
};
