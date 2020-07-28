import sinon from 'sinon';

import errorHandler from '../src/controllers/errors/controller.errorHandler';
import updatePermissionController from '../src/controllers/controller.permissions.update';
import Permission, { Right } from '../src/interfaces/interface.Permission';

describe('controller.permissions.update', () => {
  let res;
  let next;
  let updatePermission;
  let controller;
  const updatedPermission: Permission = {
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
    updatePermission = sinon.stub();
    controller = updatePermissionController(updatePermission, errorHandler);
  });

  it('will correctly update a permission', async () => {
    // Prepare
    updatePermission.returns(updatedPermission);
    const req = { params:{ title: '123' } };
    
    // Execute
    await controller(req as any, res, next);
    
    // Assert
    sinon.assert.calledOnce(res.status);
    sinon.assert.calledWith(res.status,200);
  });


  it('will call error handler updatePermission throws', async () => {
    // Prepare
    const mockError = new Error('Error');
    updatePermission.throws(mockError);
    const req = { params:{ title: '123' } };
    
    // Execute
    await controller(req as any, res, next);
    
    // Assert
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.status, 500);
  });

});