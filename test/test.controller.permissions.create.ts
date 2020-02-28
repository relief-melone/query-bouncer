import 'module-alias/register';

import sinon from 'sinon';
import errorHandler from '../src/controllers/errors/controller.errorHandler';
import createPermissionController from '../src/controllers/controller.permissions.create';
import Permission, { Right } from '../src/interfaces/interface.Permission';

describe('controller.permissions.create', () => {
  let res;
  let next;
  let createPermission;
  let controller;

  const createdPermission: Permission = {
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
    createPermission = sinon.stub();
    controller = createPermissionController(createPermission, errorHandler);
  });

  it('will correctly create a permission', async () => {
    // Prepare
    createPermission.returns(createdPermission);
    const req = { };
    
    // Execute
    await controller(req as any, res, next);
    
    // Assert
    sinon.assert.calledOnce(res.status);
    sinon.assert.calledWith(res.status,201);
  });


  it('will call error handler createPermission throws', async () => {
    // Prepare
    const mockError = new Error('Error');
    createPermission.throws(mockError);
    const req = { };
    
    // Execute
    await controller(req as any, res, next);
    
    // Assert
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.status, 500);
  });

});