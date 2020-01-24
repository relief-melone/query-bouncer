import { Right } from '../../interfaces/interface.Permission';

export default (right: string): Right => {
  if(Object.values(Right).includes(right)) return Right[right] as Right;
  throw new Error('Wrong type of Right');
};