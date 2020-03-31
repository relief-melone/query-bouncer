import GetRoleAssignmentsForUser from '../src/services/queries/service.getRoleAssignmentsForUser';
import specialUsers from '../src/interfaces/enum.specialUsers';

import { expect } from 'chai';
import sinon from 'sinon';

describe('service.getRoleAssignmetsForUser', () => {
  const defaultUser = 'someUser@hotmail.com';

  const roleAssignmentAnyone = {
    User: '$anyone',
    Role: 'Guest',
    Data: {},
    toObject(): any{return this;}
  };

  const roleAssignmentAuthenticated = {
    User: '$authenticated',
    Role: 'ReadBlogPosts',
    Data: {},
    toObject(): any{return this;}
  };

  const roleAssignmentUser = {
    User: 'someUser@hotmail.com',
    Role: 'SpecialGuy',
    Data: {},
    toObject(): any{return this;}
  };

  let roleAssignmentModel;
  beforeEach( () => {
    roleAssignmentModel = { find: sinon.stub() };
  });

  it('will return all the RoleAssignments if a user was present on call', async () => {    
    // arrange
    roleAssignmentModel.find.resolves([roleAssignmentAnyone, roleAssignmentAuthenticated, roleAssignmentUser]);

    expect(await GetRoleAssignmentsForUser(defaultUser, roleAssignmentModel)).to.deep.equal([
      roleAssignmentAnyone,roleAssignmentAuthenticated,roleAssignmentUser
    ]);

    sinon.assert.calledOnce(roleAssignmentModel.find);
    sinon.assert.calledWith(roleAssignmentModel.find, { User: { $in:[defaultUser,specialUsers.anyone, specialUsers.authenticated ] } });
  });

  it('will return just the RoleAssignments for anyone if no registered user was present', async () => {
    roleAssignmentModel.find.resolves([roleAssignmentAnyone]);
    expect(await GetRoleAssignmentsForUser(null, roleAssignmentModel)).to.deep.equal([
      roleAssignmentAnyone,
    ]);

    sinon.assert.calledOnce(roleAssignmentModel.find);
    sinon.assert.calledWith(roleAssignmentModel.find, { User: { $in:[specialUsers.anyone ] } });
  });

  it('will return just the RoleAssignments for anyone and authenticated if the user is known but has no role assignment', async () => {
    
    roleAssignmentModel.find.resolves([roleAssignmentAnyone, roleAssignmentAuthenticated]);
    const user = 'hansPeter@outlook.de';
    expect(await GetRoleAssignmentsForUser(user, roleAssignmentModel)).to.deep.equal([
      roleAssignmentAnyone,
      roleAssignmentAuthenticated,
    ]);    

    sinon.assert.calledOnce(roleAssignmentModel.find);
    sinon.assert.calledWith(roleAssignmentModel.find, { User: { $in:[user,specialUsers.anyone, specialUsers.authenticated ] } });
  });
});