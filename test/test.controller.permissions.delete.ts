
import sinon from 'sinon';
import errorHandler from '../src/controllers/errors/controller.errorHandler';
import deletePermissionController from '../src/controllers/controller.permissions.delete';
import Permission, { Right } from '../src/interfaces/interface.Permission';

describe('controller.permissions.delete', () => {
  let res;
  let next;
  let deletePermission;
  let controller;

  const deletedPermission: Permission = {
    Title: 'ReadBlogposts',
    Collection: 'BlogPosts',
    Right: Right.read,
    ExcludedPaths: [],
    QueryRestriction:{},
    PayloadRestriction:{} 
  };

  beforeEach(() => {
    res = sinon.stub({        
      json() { },
      status(){ },
    });
    res.json.returns(res);
    res.status.returns(res);
    next = sinon.stub();
    deletePermission = sinon.stub();
    controller = deletePermissionController(deletePermission, errorHandler);
  });

  it('will correctly delete a permission', async () => {
    // Prepare
    deletePermission.returns(deletedPermission);
    const req = { params:{ Title:'ReadSomething' } };
    
    // Execute
    await controller(req as any, res, next);
    
    // Assert
    sinon.assert.calledOnce(res.status);
    sinon.assert.calledWith(res.status,200);
  });


  it('will call error handler if createPermission throws', async () => {
    // Prepare
    const mockError = new Error('Error');
    deletePermission.throws(mockError);
    const req = { params:{ Title:'ReadSomething' } };
    
    // Execute
    await controller(req as any, res, next);
    
    // Assert
    sinon.assert.calledWith(res.status,500);
    sinon.assert.calledOnce(res.json);
  });

});