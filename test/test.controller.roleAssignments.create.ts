import sinon from 'sinon';
import createRoleAsssignmentController from '../src/controllers/controller.roleAssignment.create';
import IRoleAssignment from '../src/interfaces/interface.RoleAssignment';
import Role from '@/interfaces/interface.Role';
import errorHandler from '../src/controllers/errors/controller.errorHandler';

describe('controller.roleAssignments.create', () => {
  let res;
  let next;
  let createRoleAssignment;
  let getRoleByTitle;

  const createdRoleAssignment: IRoleAssignment = {
    User: 'Some_User',
    Role: 'someRole',
    Data: {}
  };

  const foundRole: Promise<Role> = Promise.resolve({
    _id: '12345',
    Title: 'admin',
    Permissions: [ 'DoSomething' ]
  });


  beforeEach(() => {
    res = sinon.stub({        
      json() { },
      status(){ },
    });
    res.json.returns(res);
    res.status.returns(res);
    next = sinon.stub();
    createRoleAssignment = sinon.stub();
    getRoleByTitle = sinon.stub();
  });

  it('will create roleAssignment', async () => {
    // Prepare
    const originalRoleAssignment = Object.assign({}, createdRoleAssignment);
    const req = {
      roleAssignment:  createdRoleAssignment
    };
    const nonLowerCasingMainConfig = { adminToken: 'correctAdminToken', userPrimaryKey: '_id', forceUserToLowerCase:false };
    getRoleByTitle.returns(foundRole);
    createRoleAssignment.returns(createdRoleAssignment);

    // Execute
    await createRoleAsssignmentController(
      req as any, 
      res, 
      next, 
      errorHandler, 
      createRoleAssignment, 
      getRoleByTitle,  
      nonLowerCasingMainConfig
    );

    // Assert
    sinon.assert.calledWith(createRoleAssignment, originalRoleAssignment);
    sinon.assert.calledWith(res.status,201);
    sinon.assert.calledWith(res.json, originalRoleAssignment);
  });
  it('will change username to lowercase', async () => {
    // Prepare
    const req = {
      roleAssignment:  createdRoleAssignment
    };
    getRoleByTitle.returns(foundRole);
    const lowerCasedRoleAssignment: IRoleAssignment = {
      User: 'some_user',
      Role: 'someRole',
      Data: { }
    };
    createRoleAssignment.returns(lowerCasedRoleAssignment);


    // Execute
    await createRoleAsssignmentController(
      req as any, 
      res, 
      next, 
      errorHandler, 
      createRoleAssignment, 
      getRoleByTitle,  
    );

    // Assert
    sinon.assert.calledWith(createRoleAssignment, lowerCasedRoleAssignment);
    sinon.assert.calledWith(res.status,201);
    sinon.assert.calledWith(res.json, lowerCasedRoleAssignment);
  });

  it('will return an error if the desired role does not exist', async () => {
    // Prepare
    const req = {
      roleAssignment:  createdRoleAssignment
    };
    getRoleByTitle.returns(null);

    // Execute
    await createRoleAsssignmentController(
      req as any, 
      res, 
      next, 
      errorHandler, 
      createRoleAssignment, 
      getRoleByTitle,  
    );

    // Assert
    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWithMatch(res.json, sinon.match({ details:'This Role does not exist!' }));
  });
});