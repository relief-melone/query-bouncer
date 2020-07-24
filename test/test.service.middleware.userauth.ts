import userAuth from '../src/services/middleware/service.middleware.userauth';
import sinon, { SinonStub } from 'sinon';
import IRoleAssignment from '../src/interfaces/interface.RoleAssignment';
import { Right } from '../src/interfaces/interface.Permission';

describe('user auth middleware',()=>{
  let res;
  let next;
  let req;
  let mainConfig;
  let authRoleAssignment: SinonStub;
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
    authRoleAssignment = sinon.stub();
    getRoleAssignmentById = sinon.stub();
  });

  it('should call next on authorized users',async ()=>{

    req = {
      user: { _id: '123455' },
      headers: { authorization: 'Bearer iAmAdmin' },
      body:  createdRoleAssignment,
      method:'POST'
    };
    authRoleAssignment.returns(true);

    await userAuth(mainConfig, authRoleAssignment)(req, res, next ); 
    sinon.assert.calledOnce(next);
    sinon.assert.calledWith(authRoleAssignment, createdRoleAssignment, Right.create, req.headers.authorization, req.user._id);

  });
  
  it('should call respond with 403 on not authorized users',async ()=>{

    req = {
      user: { _id: 'i may not pass' },
      headers: { authorization: 'Bearer whoever' },
      body:  createdRoleAssignment,
      method:'POST'
    };
    authRoleAssignment.returns(false);

    await userAuth(mainConfig, authRoleAssignment)(req, res, next ); 
    sinon.assert.notCalled(next);
    sinon.assert.calledWith(res.status, 403);
    sinon.assert.calledWith(authRoleAssignment, createdRoleAssignment, Right.create, req.headers.authorization, req.user._id);

  });


  it('should get roleAssignment from DB on delete', async ()=> {
    req = {
      user: { _id: '123455' },
      headers: { authorization: 'Bearer iAmAdmin' },
      path:'12334',
      body:  createdRoleAssignment,
      method:'DELETE'
    };
    getRoleAssignmentById.resolves(roleAssignmentToDelete);
    authRoleAssignment.returns(true);
    await userAuth(mainConfig, authRoleAssignment, getRoleAssignmentById)(req, res, next ); 
    sinon.assert.calledOnce(next);
    sinon.assert.calledWith(authRoleAssignment, roleAssignmentToDelete, Right.delete, req.headers.authorization, req.user._id);
  });

  const methodConversionTestCases = [
    { args: 'POST',
      expected: Right.create },
    { args:'PUT',
      expected: Right.update },
    { args:'DELETE',
      expected: Right.delete },
    { args:'GET',
      expected: Right.read }
  ];

  methodConversionTestCases.forEach((test)=> {
    it(`correctly converts http method ${test.args} to right ${Right[test.expected]}`, async ()=> {
      req = {
        user: { _id: '123455' },
        headers: { authorization: 'Bearer iAmAdmin' },
        path:'12334',
        body:  createdRoleAssignment,
        method:test.args
      };
      getRoleAssignmentById.resolves(createdRoleAssignment);
      authRoleAssignment.returns(true);
      
      await userAuth(mainConfig, authRoleAssignment, getRoleAssignmentById)(req, res, next ); 

      sinon.assert.calledOnce(next);
      sinon.assert.calledWith(authRoleAssignment, createdRoleAssignment, test.expected, req.headers.authorization, req.user._id);
    });
  });
  
});