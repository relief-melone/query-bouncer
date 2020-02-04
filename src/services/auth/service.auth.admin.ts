import safeCompare from 'safe-compare';
import MainConfig from '../../configs/config.main';

export default (token: string | null | undefined, mainConfig=MainConfig): boolean => {
  if(!token) return false;
  console.log(`Checking token ${token}`);
  const result = safeCompare(token.replace('Bearer ', ''), mainConfig.adminToken);
  if(result){
    console.log('Admin access using token granted');
  }
  else{
    console.log('Admin access by token denied');
  }
  return result;
};