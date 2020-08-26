import sinon from 'sinon';
import updateRoleController from '../src/controllers/controller.roles.update';
import IRole from '../src/interfaces/interface.Role';
import Permission, { Right } from '../src/interfaces/interface.Permission';

describe('controller.roles.update', () => {
  let res;
  let next;
  let errorHandler;
  let updateRole;
  let getPermissionsByTitle;

  const updatedRole: IRole = {
    Title: 'BlogReader',
    Permissions: ['12345','2345']
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
    updateRole = sinon.stub();
    getPermissionsByTitle = sinon.stub();
  });

  it('will create role for an admin', async () => {
    // Prepare
    updateRole.returns(updatedRole);
    getPermissionsByTitle.returns(foundPermission);
    const req = { 
      body: updatedRole,
      params:{ title:'123' }
    };
    
    // Execute
    await updateRoleController(req as any, res, next, errorHandler, updateRole, getPermissionsByTitle);
    
    // Assert
    sinon.assert.calledTwice(getPermissionsByTitle);
    sinon.assert.calledOnce(res.status);
    sinon.assert.calledWith(res.status,200);
  });


  it('will return 500 if user admin but createRole throws', async () => {
    // Prepare
    const mockError = new Error('Error');
    updateRole.throws(mockError);
    getPermissionsByTitle.returns(foundPermission);
    const req = { 
      body: updatedRole,
      params:{ title:'123' }
    };
    
    // Execute
    await updateRoleController(req as any, res, next, errorHandler, updateRole, getPermissionsByTitle);
    
    // Assert
    sinon.assert.calledWith(res.status, 500);
  });

  it('will call the errorHandler if at least one Permission cannot be found', async () => {
    // Prepare
    updateRole.returns(updatedRole);
    getPermissionsByTitle.returns(null);
    const req = { 
      body: updatedRole,
      params:{ title:'123' }
    };
    
    // Execute
    await updateRoleController(req as any, res, next, errorHandler, updateRole, getPermissionsByTitle);
    
    // Assert
    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWithMatch(res.json, sinon.match({ details:'No Permission with that _id was found!' }));
  });
});