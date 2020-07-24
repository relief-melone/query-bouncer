import { Right } from '../../interfaces/interface.Permission';

export default (right: string): Right => {
  if(right in Right) return Right[right] as Right;
  throw new Error('Wrong type of Right');
};