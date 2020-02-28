import 'module-alias/register';

import { describe } from 'mocha';
import getPermissions from '../src/controllers/controller.permissions.get';
import sinon from 'sinon';
import { Request  } from 'express';
import errorHandler from '../src/controllers/errors/controller.errorHandler';


describe('get permissions should',()=>{
  let res;
  let next;
  let getPermission;
  let controller;
  beforeEach(() => {
    res = sinon.stub({        
      json() { },
      status(){ },
    });
    res.json.returns(res);
    res.status.returns(res);
    next = sinon.stub();
    getPermission = sinon.stub();
    controller = getPermissions(getPermission, errorHandler);
  });

  it('should return objects on objects found',async ()=>{
    // arrange
    const req = {} as Request;
    getPermission.resolves([{ Title:'123' }]);

    // act
    await controller(req, res, next);

    // assert
    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json,[{ Title: '123' }]);
  });
  
  it('should return an empty array on no permissions found',async ()=>{
    // arrange
    const req= {} as Request;
    
    getPermission.returns(Promise.resolve([]));
    // act
    await controller(req, res, next);

    // assert
    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json,[]);
  });

  it('should return 500 when an exception is raised',async ()=>{
    // arrange
    getPermission.throws(new Error());
    const req = {} as Request;
    
    // act
    await controller(req, res, next);
    
    // assert
    sinon.assert.calledWith(res.status, 500);
    sinon.assert.calledOnce(res.json);
  });
});