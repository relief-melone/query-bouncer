import sinon from 'sinon';

import getRoleAsssignmentsController from '../src/controllers/controller.roleAssignment.get';
import IRoleAssignment from '../src/interfaces/interface.RoleAssignment';
import errorHandler from '../src/controllers/errors/controller.errorHandler';

describe('controller.roleAssignments.get', () => {
  let res;
  let next;
  let getRoleAssignments;

  const roleAssignmentToGet: IRoleAssignment = {
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
    getRoleAssignments.returns([roleAssignmentToGet]);

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
    sinon.assert.calledWith(res.json, [roleAssignmentToGet]);
  });
  
  it('will get roleAssignments in lowercase', async () => {
    // Prepare
    const req = { };
    const uppercasedRoleAssignment: IRoleAssignment = {
      User: 'Some_User',
      Role: 'someRole',
      Data: {}
    };

    getRoleAssignments.returns([uppercasedRoleAssignment]);

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
    sinon.assert.calledWith(res.json, [roleAssignmentToGet]);
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