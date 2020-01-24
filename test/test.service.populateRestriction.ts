import populateRestriction from '../src/services/service.populateRestriction';

import { expect } from 'chai';

describe('service.populateRestriction.ts', () => {
  it('will correctly convert a flat query with no data parameters',() => {
    const query = { Realm: 'Somerealm' };
    const data = {};
        
    expect(populateRestriction(query, data)).to.deep.equal({
      Realm: 'Somerealm' 
    });
  });

  it('will correctly replace a paramater with the given data', () => {
    const query = { Realm: '${RealmId}' };
    const data = { RealmId: '123456' };

    expect(populateRestriction(query, data)).to.deep.equal({
      Realm: '123456'
    });
  });

  it('will correctly replace parameters in a nested query', () => {
    const query = {
      Realm : '${RealmId}',
      $or: [
        { Title: 'Test1' },
        { Title: '${MyTitle}' }
      ]
    };
    const data = {
      RealmId: '1234',
      MyTitle: 'Super Title'
    };

    expect(populateRestriction(query,data)).to.deep.equal({
      Realm: '1234',
      $or: [
        { Title: 'Test1' },
        { Title: 'Super Title' }
      ]
    });
  });

  it('will keep empty queries as empty objects', () => {
    const query = {};
    const data = {};
    expect(populateRestriction(query,data)).to.deep.equal({});
  });
});