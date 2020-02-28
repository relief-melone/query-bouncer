import 'module-alias/register';
import sinon from 'sinon';

import updateRoleAsssignmentController from '../src/controllers/controller.roleAssignment.update';
import IRoleAssignment from '../src/interfaces/interface.RoleAssignment';
import Role from '../src/interfaces/interface.Role';
import errorHandler from '../src/controllers/errors/controller.errorHandler';

describe('controller.roleAssignments.update', () => {
  let res;
  let next;
  let updateRoleAssignment;
  let getRoleByTitle;

  const createdRoleAssignment: IRoleAssignment = {
    User: 'some_user',
    Role: 'someRole',
    Data: {}
  };

  const foundRole: Promise<Role> = Promise.resolve({
    _id: '12345',
    Title: 'admin',
    Permissions: ['DoSomething']
  });

  beforeEach(() => {
    res = sinon.stub({        
      json() { },
      status(){ },
    });
    res.json.returns(res);
    res.status.returns(res);
    next = sinon.stub();
    updateRoleAssignment = sinon.stub();
    getRoleByTitle = sinon.stub();
  });

  it('will create roleAssignment', async () => {
    // Prepare
    const req = {
      params:{ id:'123' },
      body:  createdRoleAssignment
    };
    getRoleByTitle.returns(foundRole);
    updateRoleAssignment.returns(createdRoleAssignment);

    // Execute
    await updateRoleAsssignmentController(
      req as any, 
      res, 
      next, 
      errorHandler, 
      updateRoleAssignment, 
      getRoleByTitle,  
    );

    // Assert
    sinon.assert.calledWith(updateRoleAssignment, req.params.id, createdRoleAssignment);
    sinon.assert.calledWith(res.status,200);
    sinon.assert.calledWith(res.json, createdRoleAssignment);
  });


  it('will return an error if the role assignment does not exist', async () => {
    // Prepare
    const req = {
      params:{ id:'123' },
      body:  createdRoleAssignment
    };
    getRoleByTitle.returns(foundRole);

    updateRoleAssignment.returns(null);
    // Execute
    await updateRoleAsssignmentController(
      req as any, 
      res, 
      next, 
      errorHandler, 
      updateRoleAssignment, 
      getRoleByTitle,  
    );

    // Assert
    sinon.assert.calledWith(res.status, 404);
    sinon.assert.calledWithMatch(res.json, sinon.match(
      { details:{ roleAssignmentId:req.params.id },
        msg:'The requested Document could not be found' } ));
  });
  
  it('will return an error if the desired role does not exist', async () => {
    // Prepare
    const req = {
      params:{ id:'123' },
      body:  createdRoleAssignment
    };
    getRoleByTitle.returns(null);

    // Execute
    await updateRoleAsssignmentController(
      req as any, 
      res, 
      next, 
      errorHandler, 
      updateRoleAssignment, 
      getRoleByTitle,  
    );

    // Assert
    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWithMatch(res.json, sinon.match({ details:'This Role does not exist!' }));
  });
});