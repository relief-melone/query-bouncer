import 'module-alias/register';
import GetRoleAssignmentsForUser from '../src/services/queries/service.getRoleAssignmentsForUser';
import specialUsers from '../src/interfaces/enum.specialUsers';

import { expect } from 'chai';
import sinon from 'sinon';

describe('service.getRoleAssignmetsForUser', () => {
  const defaultUser = 'someUser@hotmail.com';

  const roleAssignmentsAnyone = [{
    User: '$anyone',
    Role: 'Guest',
    Data: {},
    toObject(): any{return this;}
  }];

  const roleAssignmentsAuthenticated = [{
    User: '$authenticated',
    Role: 'ReadBlogPosts',
    Data: {},
    toObject(): any{return this;}
  }];

  const roleAssignmentsUser = [{
    User: 'someUser@hotmail.com',
    Role: 'SpecialGuy',
    Data: {},
    toObject(): any{return this;}
  }];

  let roleAssignmentModel;
  beforeEach( () => {
    roleAssignmentModel = { find: sinon.stub() };
    
    roleAssignmentModel.find.onFirstCall().resolves(roleAssignmentsAnyone);
    roleAssignmentModel.find.onSecondCall().resolves(roleAssignmentsAuthenticated);
    roleAssignmentModel.find.onThirdCall().resolves(roleAssignmentsUser);
  });

  it('will return all the RoleAssignments if a user was present on call', async () => {    
    expect(await GetRoleAssignmentsForUser(defaultUser, roleAssignmentModel)).to.deep.equal([
      ...roleAssignmentsAnyone,
      ...roleAssignmentsAuthenticated,
      ...roleAssignmentsUser
    ]);

    sinon.assert.calledThrice(roleAssignmentModel.find);
    sinon.assert.calledWith(roleAssignmentModel.find, { User: specialUsers.anyone });
    sinon.assert.calledWith(roleAssignmentModel.find, { User: specialUsers.authenticated });
    sinon.assert.calledWith(roleAssignmentModel.find, { User: 'someUser@hotmail.com' });
  });

  it('will return just the RoleAssignments for anyone if no registered user was present', async () => {
    expect(await GetRoleAssignmentsForUser(null, roleAssignmentModel)).to.deep.equal([
      ...roleAssignmentsAnyone,
    ]);

    sinon.assert.calledOnce(roleAssignmentModel.find);
    sinon.assert.calledWith(roleAssignmentModel.find, { User: specialUsers.anyone });
    sinon.assert.neverCalledWith(roleAssignmentModel.find, { User: specialUsers.authenticated } );
    sinon.assert.neverCalledWith(roleAssignmentModel.find, { User: 'someUser@hotmail.com' } );
  });

  it('will return just the RoleAssignments for anyone and authenticated if the user is known but has no role assignment', async () => {
    roleAssignmentModel.find.onThirdCall().resolves([]);
    
    expect(await GetRoleAssignmentsForUser('hansPeter@outlook.de', roleAssignmentModel)).to.deep.equal([
      ...roleAssignmentsAnyone,
      ...roleAssignmentsAuthenticated,
    ]);    

    sinon.assert.calledThrice(roleAssignmentModel.find);
    sinon.assert.calledWith(roleAssignmentModel.find, { User: specialUsers.anyone });
    sinon.assert.calledWith(roleAssignmentModel.find, { User: specialUsers.authenticated } );
    sinon.assert.calledWith(roleAssignmentModel.find, { User: 'hansPeter@outlook.de' } );
    sinon.assert.neverCalledWith(roleAssignmentModel.find, { User: 'someUser@hotmail.com' } );    
  });
});