import authRoleAssignment from '../src/services/auth/service.auth.roleAssignment';
import { Right } from '../src/interfaces/interface.Permission';
import { expect } from 'chai';
import sinon from 'sinon';
import RoleAssignment from '../src/interfaces/interface.RoleAssignment';

describe('service.auth.roleAssignment', () => {
  let internalRoleAssignment;

  const correctMainConfig = {
    adminToken: 'correctAdminToken',
    userPrimaryKey: '_id'
  };

  const correctRoleAssignment: RoleAssignment = {
    User: 'dr_jones',
    Role: 'standard',
    Data: {
      personalCategory: '0000001',
      allowedCollection: 'myCollection'
    }
  };

  const correctRoleAssignmentForUser = { 
    User: 'userThatCanCreatePermission',
    Role: 'standard',
    Data: {
      personalCategory: '0000001',
      allowedCollection: 'myCollection'
    } 
  };

  const correctRoleForUser = {
    Title: 'standard',
    Permissions: ['createRoleAssignments']
  };

  const correctPermission = {
    Title: 'createRoleAssignments',
    Collection: 'internal_roleAssignments',
    Right: 'create',
    ExcludedPaths: [],
    PayloadRestriction: { 
      Data: {
        personalCategory: '${personalCategory}',
        Collection: '${allowedCollection}'
      },
      
    } 
  };
  
  beforeEach(() => {
    internalRoleAssignment = sinon.stub();
    internalRoleAssignment.collection = { name: 'internal_roleAssignments' };
  });

  it('it will correctly tell user can create roleAssignment if he is admin', async () => {
    // Prepare
    const mainConfig = Object.assign({}, correctMainConfig);
    const roleAssignment: RoleAssignment = Object.assign({},correctRoleAssignment);
    
    const getRoleAssignmentsForUser = sinon.stub().returns(Promise.resolve([
      Object.assign({},correctRoleAssignmentForUser)
    ]));
    
    const getRoleByTitle = sinon.stub().returns(Promise.resolve(correctRoleForUser));
    const getPermissions = sinon.stub().returns(Promise.resolve([
      Object.assign({},correctPermission)
    ]));

    // Execute/Assert
    expect(await authRoleAssignment(
      roleAssignment, 
      Right.create, 
      'correctAdminToken', 
      'userThatCanCreatePermission', 
      mainConfig, 
      getRoleAssignmentsForUser, 
      getRoleByTitle, 
      getPermissions,
      internalRoleAssignment,
    )).to.be.true;
  });

  it('it will correctly tell user can create roleAssignment if he has the internal permission', async () => {
    // Prepare
    const mainConfig = Object.assign({}, correctMainConfig);
    const roleAssignment: RoleAssignment = Object.assign({},correctRoleAssignment);
     
    const getRoleAssignmentsForUser = sinon.stub().returns(Promise.resolve([
      Object.assign({},correctRoleAssignmentForUser)
    ]));
     
    const getRoleByTitle = sinon.stub().returns(Promise.resolve(
      Object.assign({},correctRoleForUser)));
    const getPermissions = sinon.stub().returns(Promise.resolve([
      Object.assign({},correctPermission)
    ]));

    expect(await authRoleAssignment(
      roleAssignment, 
      Right.create, 
      'wrongAdminToken', 
      'userThatCanCreatePermission', 
      mainConfig, 
      getRoleAssignmentsForUser, 
      getRoleByTitle, 
      getPermissions,
      internalRoleAssignment,
    )).to.be.true;
  });

  it('it will correctly tell user cannot create roleAssignment if the data restriction does not match', async () => {
    // Prepare
    const mainConfig = Object.assign({}, correctMainConfig);
    const roleAssignment: RoleAssignment = Object.assign({},correctRoleAssignment, {
      Data: {
        allowedCollection: 'myCollection',
        personalCategory: 'oneThatIDontHaveAccessTo'
      }
    });     
    const getRoleAssignmentsForUser = sinon.stub().returns(Promise.resolve([
      Object.assign({},correctRoleAssignmentForUser)
    ]));
     
    const getRoleByTitle = sinon.stub().returns(Promise.resolve(
      Object.assign({},correctRoleForUser)));
    const getPermissions = sinon.stub().returns(Promise.resolve([
      Object.assign({},correctPermission)
    ]));

    expect(await authRoleAssignment(
      roleAssignment, 
      Right.create, 
      'wrongAdminToken', 
      'userThatCanCreatePermission', 
      mainConfig, 
      getRoleAssignmentsForUser, 
      getRoleByTitle, 
      getPermissions,
      internalRoleAssignment,
    )).to.be.false;
  });
});