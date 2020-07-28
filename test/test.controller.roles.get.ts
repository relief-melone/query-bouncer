import { describe } from 'mocha';
import getRolesController from '../src/controllers/controller.roles.get';
import sinon from 'sinon';
import { Request  } from 'express';
import errorHandler from '../src/controllers/errors/controller.errorHandler';


describe('get roles should',()=>{
  let res;
  let next;
  let getRoles;

  beforeEach(() => {
    res = sinon.stub({        
      json() { },
      status(){ },
    });
    res.json.returns(res);
    res.status.returns(res);
    next = sinon.stub();
    getRoles = sinon.stub();
  });

  it('should return objects on objects found',async ()=>{
    // arrange
    const req = {} as Request;
    getRoles.resolves([{ Title:'MyPersonalRole' }]);

    // act
    await getRolesController(req, res, next,errorHandler , getRoles);

    // assert
    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json,[{ Title: 'MyPersonalRole' }]);
  });
  
  it('should return an empty array on no permissions found',async ()=>{
    // arrange
    const req= {} as Request;
    
    getRoles.returns(Promise.resolve([]));
    // act
    await getRolesController(req, res, next, errorHandler, getRoles);

    // assert
    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json,[]);
  });

  it('should return 500 when an exception is raised',async ()=>{
    // arrange
    getRoles.throws(new Error());
    const req = {} as Request;
    
    // act
    await getRolesController(req, res, ()=>{},errorHandler , ()=>{throw Error;});
    
    // assert
    sinon.assert.calledWith(res.status, 500);
    sinon.assert.calledOnce(res.json);
  });
});