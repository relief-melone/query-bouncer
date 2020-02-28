import 'module-alias/register';
import isAdmin from '../src/services/auth/service.auth.admin';
import { expect } from 'chai';
import ConfigMain from '@/interfaces/interface.configMain';

describe('service.auth.admin.ts', () => {
  it('will correctly tell is admin if tokens match', () => {
    const mainConfig: ConfigMain = {
      adminToken: '12345678910',
      userPrimaryKey: '_id',
      logLevel: 'error',
      supressLogging: true
    };

    expect(isAdmin('12345678910', mainConfig)).to.be.true;
  });

  it('will correctly tell is not admin if tokens mismatch', () => {
    const mainConfig: ConfigMain = {
      adminToken: '00000000',
      userPrimaryKey: '_id',
      logLevel: 'error',
      supressLogging: true
    };

    expect(isAdmin('12345678910', mainConfig)).to.be.false;
  });
});