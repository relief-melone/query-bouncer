import sinon from 'sinon';

import deleteRoleAsssignmentController from '../src/controllers/controller.roleAssignment.delete';
import IRoleAssignment from '../src/interfaces/interface.RoleAssignment';
import errorHandler from '../src/controllers/errors/controller.errorHandler';

describe('controller.roleAssignments.delete', () => {
  let res;
  let next;
  let deleteRoleAssignment;

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
    deleteRoleAssignment = sinon.stub();
  });

  it('will delete roleAssignment', async () => {
    // Prepare
    const req = {
      params:{ id:'123' },
    };
    deleteRoleAssignment.returns(createdRoleAssignment);

    // Execute
    await deleteRoleAsssignmentController(
      req as any, 
      res, 
      next, 
      errorHandler, 
      deleteRoleAssignment, 
    );

    // Assert
    sinon.assert.calledWith(deleteRoleAssignment, req.params.id );
    sinon.assert.calledWith(res.status,200);
    sinon.assert.calledWith(res.json, createdRoleAssignment);
  });


  it('will return an error if the role assignment does not exist', async () => {
    // Prepare
    const req = {
      params:{ id:'123' },
    };

    deleteRoleAssignment.returns(null);
    // Execute
    await deleteRoleAsssignmentController(
      req as any, 
      res, 
      next, 
      errorHandler, 
      deleteRoleAssignment, 
    );

    // Assert
    sinon.assert.calledWith(res.status, 404);
    sinon.assert.calledWithMatch(res.json, sinon.match(
      { details:{ roleAssignmentId:req.params.id },
        msg:'The requested Document could not be found' } ));
  });
  
  it('will return status 500 on error during deletion', async () => {
    // Prepare
    const req = {
      params:{ id:'123' },
    };
    deleteRoleAssignment.throws(new Error());

    // Execute
    await deleteRoleAsssignmentController(
      req as any, 
      res, 
      next, 
      errorHandler, 
      deleteRoleAssignment, 
    );

    // Assert
    sinon.assert.calledWith(res.status, 500);
  });
});