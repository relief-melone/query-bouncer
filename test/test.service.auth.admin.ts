import 'module-alias/register';
import isAdmin from '../src/services/auth/service.auth.admin';
import { expect } from 'chai';

describe('service.auth.admin.ts', () => {
  it('will correctly tell is admin if tokens match', () => {
    const mainConfig = {
      adminToken: '12345678910',
      userPrimaryKey: '_id',
      logLevel: 'error'
    };

    expect(isAdmin('12345678910', mainConfig)).to.be.true;
  });

  it('will correctly tell is not admin if tokens mismatch', () => {
    const mainConfig = {
      adminToken: '00000000',
      userPrimaryKey: '_id',
      logLevel: 'error'
    };

    expect(isAdmin('12345678910', mainConfig)).to.be.false;
  });
});