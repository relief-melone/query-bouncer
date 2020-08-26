import servicesLogUserChange,{ isGetOrNoSucess } from '../src/services/middleware/services.middleware.logRoleAssignmentChange';
import IRoleAssignment from '../src/interfaces/interface.RoleAssignment';
import sinon from 'sinon';
import { expect } from 'chai';

describe('log role assignment changes',()=>{
  let res;
  let next;
  let logger;

  const user={
    _id:'123'
  };

  const roleAssignment: IRoleAssignment = {
    User: 'SomeUser',
    Role: 'someRole',
    Data: {
      Blod:'Food'
    }
  };
  beforeEach(()=>{
    res = sinon.stub();
    next = sinon.stub();
    logger = {
      info:sinon.stub() 
    };
  });

  it('should log call with correct metadata',async ()=>{
    const req ={
      user:user,
      roleAssignment: roleAssignment,
      method:'POST'
    } as any;

    servicesLogUserChange(logger)({},req, res);
    sinon.assert.calledOnce(logger.info);
    sinon.assert.calledWith(logger.info, sinon.match.string, 
           
      sinon.match({
        role:roleAssignment.Role,
        changedUser: roleAssignment.User,
        data:roleAssignment.Data,
        user:user._id,
        method:'POST'
      }));
  });
  it('should not log get calls',async ()=>{
    const req ={
      method:'GET'
    } as any;

    const result = isGetOrNoSucess(req, res);
    expect(result).to.be.true;
  });

  it('should not log unsuccessfull calls',async ()=>{
    const req: any ={
      method:'POST'
    } as any;
    const res: any = {
      statusCode:403
    };
    const result = isGetOrNoSucess(req, res);
    expect(result).to.be.true;
  });



  const methods =[{ method:'DELETE', expected:`Role ${roleAssignment.Role} of user ${roleAssignment.User} was deleted by user ${user._id}` },
    { method:'POST', expected:`Role ${roleAssignment.Role} was added to user ${roleAssignment.User} by user ${user._id}` },
    { method:'PUT', expected:`Role ${roleAssignment.Role} of user ${roleAssignment.User} was changed by user ${user._id}` }];

  methods.forEach(testargs=>{
    it(`should log ${testargs.method} call with correct message`,async ()=>{
      const req ={
        user:user,
        roleAssignment: roleAssignment,
        method:testargs.method
      } as any;
  
      servicesLogUserChange(logger)({},req, res);
      sinon.assert.calledOnce(logger.info);
      sinon.assert.calledWith(logger.info, testargs.expected, sinon.match.any);
    });
  });
});