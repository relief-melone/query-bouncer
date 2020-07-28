import sinon from 'sinon';
import createRoleController from '../src/controllers/controller.roles.create';
import IRole from '../src/interfaces/interface.Role';
import Permission, { Right } from '../src/interfaces/interface.Permission';

describe('controller.roles.create', () => {
  let res;
  let next;
  let errorHandler;
  let createRole;
  let getPermissionByTitle;

  const createdRole: IRole = {
    Title: 'BlogReader',
    Permissions: ['ReadBlogPost','WriteSomething']
  };

  const foundPermission: Promise<Permission> = Promise.resolve({
    _id: '12345',
    Title: 'ReadBlogPost',
    Collection: 'internal_permissions',
    Right: Right.create,
    ExcludedPaths: [],
    QueryRestriction: {},
    PayloadRestriction: {}
  });

  beforeEach(() => {
    res = sinon.stub({        
      json() { },
      status(){ },
    });
    res.json.returns(res);
    res.status.returns(res);
    next = function(): any{return this;};
    createRole = sinon.stub();
    getPermissionByTitle = sinon.stub();
  });

  it('will create role', async () => {
    // Prepare
    createRole.returns(createdRole);
    getPermissionByTitle.returns(foundPermission);
    const req = { 
      body: createdRole
    };
    
    // Execute
    await createRoleController(req as any, res, next, errorHandler, createRole, getPermissionByTitle);
    
    // Assert
    sinon.assert.calledTwice(getPermissionByTitle);
    sinon.assert.calledOnce(res.status);
    sinon.assert.calledWith(res.status,201);
  });


  it('will return 500 if createRole throws', async () => {
    // Prepare
    const mockError = new Error('Error');
    createRole.throws(mockError);
    getPermissionByTitle.returns(foundPermission);
    const req = { 
      body: createdRole
    };
    
    // Execute
    await createRoleController(req as any, res, next, errorHandler, createRole, getPermissionByTitle);
    
    // Assert
    sinon.assert.calledWith(res.status, 500);
  });

  it('will call the errorHandler if at least one Permission cannot be found', async () => {
    // Prepare
    createRole.returns(createdRole);
    getPermissionByTitle.returns(null);
    const req = { 
      body: createdRole
    };
    
    // Execute
    await createRoleController(req as any, res, next, errorHandler, createRole, getPermissionByTitle);
    
    // Assert
    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWithMatch(res.json, sinon.match({ details:'At least one Permission was not found' }));
  });
});