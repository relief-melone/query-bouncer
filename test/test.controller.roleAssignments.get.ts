import sinon from 'sinon';

import getRoleAsssignmentsController from '../src/controllers/controller.roleAssignment.get';
import IRoleAssignment from '../src/interfaces/interface.RoleAssignment';
import errorHandler from '../src/controllers/errors/controller.errorHandler';

describe('controller.roleAssignments.get', () => {
  let res;
  let next;
  let getRoleAssignments;

  const createdRoleAssignment: IRoleAssignment = {
    User: 'some_user',
    Role: 'someRole',
    Data: {}
  };


  beforeEach(() => {
    res = sinon.stub({        
      json() { },
      status(){ },
    });
    res.json.returns(res);
    res.status.returns(res);
    next = sinon.stub();
    getRoleAssignments = sinon.stub();
  });

  it('will get roleAssignments', async () => {
    // Prepare
    const req = { };
    getRoleAssignments.returns([createdRoleAssignment]);

    // Execute
    await getRoleAsssignmentsController(
      req as any, 
      res, 
      next, 
      errorHandler, 
      getRoleAssignments 
    );

    // Assert
    sinon.assert.calledOnce(getRoleAssignments);
    sinon.assert.calledWith(res.status,200);
    sinon.assert.calledWith(res.json, [createdRoleAssignment]);
  });


  it('will return an error if the desired role does not exist', async () => {
    // Prepare
    const req = {
    };
    getRoleAssignments.throws();
    
    // Execute
    await getRoleAsssignmentsController(
      req as any, 
      res, 
      next, 
      errorHandler, 
      getRoleAssignments, 
    );

    // Assert
    sinon.assert.calledWith(res.status, 500);
  });
});