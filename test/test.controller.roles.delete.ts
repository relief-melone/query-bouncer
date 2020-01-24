
import sinon from 'sinon';
import errorHandler from '../src/controllers/errors/controller.errorHandler';
import deleteRolesController from '../src/controllers/controller.roles.delete';
import Role from '../src/interfaces/interface.Role';

describe('controller.roles.delete', () => {
  let res;
  let next;
  let deleteRoles;
  const role: Role = {
    Title: 'BlogReader',
    Permissions: ['ReadSomething']
  };
  

  beforeEach(() => {
    res = sinon.stub({        
      json() { },
      status(){ },
    });
    res.json.returns(res);
    res.status.returns(res);
    next = sinon.stub();
    deleteRoles = sinon.stub();
  });

  it('will correctly delete a role', async () => {
    // Prepare
    deleteRoles.returns(role);
    const req = { params:{ Title:'SomeRole' } };
    
    // Execute
    await deleteRolesController(req as any, res, next,errorHandler, deleteRoles);
    
    // Assert
    sinon.assert.calledOnce(res.status);
    sinon.assert.calledWith(res.status,200);
  });


  it('will call error handler if deleteRole throws', async () => {
    // Prepare
    const mockError = new Error('Error');
    deleteRoles.throws(mockError);
    const req = { params:{ Title:'SomeOtherRole' } };
    
    // Execute
    await deleteRolesController(req as any, res, next,errorHandler, deleteRoles);
    
    // Assert
    sinon.assert.calledWith(res.status,500);
    sinon.assert.calledOnce(res.json);
  });

});