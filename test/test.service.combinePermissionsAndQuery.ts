import combinePermissionsAndQuery from '../src/services/queries/service.combinePermissionsAndQuery';
import { expect } from 'chai';

describe('service.combinePermissionsAndQuery', () => {
  it('will correctly combine a query and some permissions', () => {
    const query = { Title: 'New Training' };
    const permissions = [
      { RealmId: '12345' },
      { RealmId: '45678' }
    ];
    expect(combinePermissionsAndQuery(query, permissions)).to.deep.equal({
      Title: 'New Training',
      $or: [
        { RealmId: '12345' },
        { RealmId: '45678' }
      ]
    });
  });
});