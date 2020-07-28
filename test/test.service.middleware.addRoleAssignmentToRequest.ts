import addRoleAssignmentToRequest from '../src/services/middleware/service.middleware.addRoleAssignmentToRequest';
import sinon, { SinonStub } from 'sinon';
import IRoleAssignment from '../src/interfaces/interface.RoleAssignment';
import { expect } from 'chai';

describe('add role assignment middleware',()=>{
  let res;
  let next;
  let req;
  let mainConfig;
  let getRoleAssignmentById: SinonStub;

  const createdRoleAssignment: IRoleAssignment = {
    User: 'someUser',
    Role: 'someRole',
    Data: {}
  };

  const roleAssignmentToDelete: IRoleAssignment = {
    User: 'someOtheruser',
    Role: 'someOtherRole',
    Data: {}
  };

  beforeEach(()=>{
    res = sinon.stub({        
      json() { },
      status(){ },
    });
    res.json.returns(res);
    res.status.returns(res);
    next = sinon.stub();
    mainConfig = {
      userPrimaryKey: '_id'
    };
    getRoleAssignmentById = sinon.stub();
  });


  it('should get roleAssignment from DB on delete', async ()=> {
    req = {
      user: { _id: '123455' },
      headers: { authorization: 'Bearer iAmAdmin' },
      path:'12334',
      method:'DELETE'
    };
    getRoleAssignmentById.resolves(roleAssignmentToDelete);

    await addRoleAssignmentToRequest(getRoleAssignmentById)(req, res, next ); 
    sinon.assert.calledOnce(next);
    expect(req.roleAssignment).to.be.eq(roleAssignmentToDelete);

  });


  const methodConversionTestCases = [
    { args: 'POST' },
    { args:'PUT' },
    { args:'GET' }
  ];

  methodConversionTestCases.forEach((test)=> {
    it(`should get roleassginment from body on http ${test.args}`, async ()=> {
      req = {
        user: { _id: '123455' },
        headers: { authorization: 'Bearer iAmAdmin' },
        path:'12334',
        body:  createdRoleAssignment,
        method:test.args
      };

      await addRoleAssignmentToRequest(getRoleAssignmentById)(req, res, next ); 

      sinon.assert.calledOnce(next);
      sinon.assert.notCalled(getRoleAssignmentById);
      expect(req.roleAssignment).to.be.eq(createdRoleAssignment);
    });
  });
  
});