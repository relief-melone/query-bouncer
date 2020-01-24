import safeCompare from 'safe-compare';
import MainConfig from '../../configs/config.main';

export default (token: string | null | undefined, mainConfig=MainConfig): boolean => {
  if(!token) return false;
  return safeCompare(token.replace('Bearer ', ''), mainConfig.adminToken);
};