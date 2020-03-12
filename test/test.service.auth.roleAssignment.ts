import authRoleAssignment from '../src/services/auth/service.auth.roleAssignment';
import { Right } from '../src/interfaces/interface.Permission';
import { expect } from 'chai';
import sinon from 'sinon';
import RoleAssignment from '../src/interfaces/interface.RoleAssignment';

describe('service.auth.roleAssignment', () => {
  let internalRoleAssignment;

  let getRoleAssignmentsForUser; 
  let getRoleByTitle;
  let getPermissions; 

  const correctMainConfig = {
    adminToken: 'correctAdminToken',
    userPrimaryKey: '_id',
    forceUserToLowerCase:true
  };

  const correctRoleAssignment: RoleAssignment = {
    User: 'dr_jones',
    Role: 'standard',
    Data: {
      personalCategory: '0000001',
      allowedCollection: 'myCollection'
    }
  };

  const currentUserRoleAssignment: RoleAssignment = { 
    User: 'userThatCanCreateRoleAssignment',
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
        allowedCollection: '${allowedCollection}'
      },
      
    } 
  };
  
  beforeEach(() => {
    internalRoleAssignment = sinon.stub();
    internalRoleAssignment.collection = { name: 'internal_roleAssignments' };

    getRoleAssignmentsForUser=sinon.stub(); 
    getRoleByTitle=sinon.stub();
    getPermissions =sinon.stub();

  });

  it('it will correctly tell user can create roleAssignment if he is admin', async () => {
    // Prepare
    getRoleAssignmentsForUser.returns([currentUserRoleAssignment]);
    getRoleByTitle.returns(correctRoleForUser);
    getPermissions.returns([correctPermission]);

    // Execute/Assert
    expect(await authRoleAssignment(
      correctRoleAssignment, 
      Right.create, 
      'correctAdminToken', 
      'userThatCanCreatePermission', 
      correctMainConfig, 
      getRoleAssignmentsForUser, 
      getRoleByTitle, 
      getPermissions,
      internalRoleAssignment,
    )).to.be.true;
  });

  it('it will correctly tell user can create roleAssignment if he has the internal permission', async () => {
    // Prepare
     
    getRoleAssignmentsForUser.returns([currentUserRoleAssignment]);
     
    getRoleByTitle.returns(correctRoleForUser);
    getPermissions.returns([correctPermission]);

    expect(await authRoleAssignment(
      correctRoleAssignment, 
      Right.create, 
      'wrongAdminToken', 
      'userThatCanCreatePermission', 
      correctMainConfig, 
      getRoleAssignmentsForUser, 
      getRoleByTitle, 
      getPermissions,
      internalRoleAssignment,
    )).to.be.true;
  });

  it('it will correctly tell user cannot create roleAssignment if the data restriction does not match', async () => {
    // Prepare
    const roleAssignment: RoleAssignment = Object.assign({},correctRoleAssignment, {
      Data: {
        allowedCollection: 'myCollection',
        personalCategory: 'oneThatIDontHaveAccessTo'
      }
    });     
    getRoleAssignmentsForUser.returns([currentUserRoleAssignment]);
    getRoleByTitle.returns(correctRoleForUser);
    getPermissions.returns([correctPermission]);

    expect(await authRoleAssignment(
      roleAssignment, 
      Right.create, 
      'wrongAdminToken', 
      'userThatCanCreatePermission', 
      correctMainConfig, 
      getRoleAssignmentsForUser, 
      getRoleByTitle, 
      getPermissions,
      internalRoleAssignment,
    )).to.be.false;
  });
});