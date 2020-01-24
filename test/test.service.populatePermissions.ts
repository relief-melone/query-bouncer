import populatePermissions from '../src/services/queries/service.populatePermissionQueries';
import { expect } from 'chai';
import Permission from '../src/interfaces/interface.Permission';

describe('service.populatePermissionQueries', () => {
    
  it('Basic QueryRestriction will be adjusted as expected', () => {
    const permissions = [
      { QueryRestriction: { RealmId: '1234' } },
      { QueryRestriction: { Title: 'MyStuff' } }
    ] as any as Array<Permission>;
        
    const data = {};
    expect(populatePermissions(permissions, data)).to.deep.equal([
      { RealmId: '1234' },
      { Title : 'MyStuff' }
    ]);
  });

  it('Query with Placeholders will be set correctly', () => {
    const permissions = [
      { QueryRestriction: { RealmId: '${Realm}' } },
      { QueryRestriction: { Title: '${MyTitle}' } }
    ] as any as Array<Permission>;
    const data = {
      Realm: '1234',
      MyTitle: 'Hello World'
    };
        
    expect(populatePermissions(permissions, data)).to.deep.equal([
      { RealmId: '1234' },
      { Title : 'Hello World' }
    ]);
  });
});