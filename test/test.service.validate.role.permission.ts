import rolePermissionValidator from '../src/services/validation/service.validate.role.permission';
import { expect } from 'chai';

describe('service.validate.role.permission', () => {
  it('will return false if no permissions have been set', () => {
    expect(rolePermissionValidator(undefined)).to.be.false;
  });

  it('will return false if permissions are empty', () => {
    expect(rolePermissionValidator([])).to.be.false;
  });

  it('will return true if permissions have been set correctly', () => {
    expect(rolePermissionValidator(['somePermissionId'])).to.be.true;
  });
});