import { PayloadAndQueryController } from '../src/controllers/controller.payloadAndQuery';
import sinon from 'sinon';
import mainConfig from '../src/configs/config.main';
import errorHandler from '../src/controllers/errors/controller.errorHandler';

describe('controller.payloadAndQuery', () => {
  let res;
  let next;
  let errorHandlerSpy;
  beforeEach(() => {
    res = sinon.stub({        
      json() { },
      status(){ },
    });
    res.json.returns(res);
    res.status.returns(res);
    next = function(): any{return this;};
    errorHandlerSpy = sinon.spy(errorHandler);
  });
  
  it('will return 200 status and the query if payload matches the permissions, and user has access to collection', async () => {
    // Prepare
    const req: any = {
      user : { _id: 'someUser' },
      params: { 
        Right: 'create',
        Collection: 'myCollection' },
      body: {
        payload: {
          Title: 'A new Blogpost',
          Area: '12345',
          CategoryId: '00001'
        },
        query: {
          Title: 'A new Blogpost',
          Area: '12345'
        }        
      }
    };
    
    const getRoleAssignmentsForUser = sinon.stub().returns(Promise.resolve([
      { User: 'someUser',
        Role: 'standard',
        Data: { 
          personalCategory: '00001',
          allowedArea: '12345'
        } 
      }
    ]));
    const getRoleByTitle = sinon.stub().returns(Promise.resolve({
      Title: 'standard',
      Permissions: ['readBlogPost', 'createInBasicCategory']
    }));
    const getPermissions = sinon.stub().returns(Promise.resolve([
      { Title: 'createInBasicCategory',
        Collection: 'myCollection',
        Right: 'create',
        ExcludedPaths: [],
        PayloadRestriction: { CategoryId: '${personalCategory}' },
        QueryRestriction: { Area: '${allowedArea}' }
      }      
    ]));    

    // Execute
    await PayloadAndQueryController(req, res, next, mainConfig, getRoleAssignmentsForUser, getRoleByTitle, getPermissions, errorHandlerSpy);

    // Assert
    sinon.assert.calledOnce(res.status);
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json, {
      payload: { Area: '12345', CategoryId: '00001', Title: 'A new Blogpost' },
      query: { $or: [{ Area: '12345' }], Area: '12345', Title: 'A new Blogpost' }
    });
    sinon.assert.notCalled(errorHandlerSpy);
  });

  it('will return 403 status if the payload does not meet the restrictions', async () => {
    // Prepare
    const req: any = {
      user : { _id: 'someUser' },
      params: { 
        Right: 'create',
        Collection: 'myCollection' },
      body: {
        payload: {
          Title: 'A new Blogpost',
          Area: '12345',
          CategoryId: '00002'
        },
        query: {
          Title: 'A new Blogpost',
          Area: '12345'
        }        
      }
    };
    
    const getRoleAssignmentsForUser = sinon.stub().returns(Promise.resolve([
      { User: 'someUser',
        Role: 'standard',
        Data: { 
          personalCategory: '00001',
          allowedArea: '12345'
        } 
      }
    ]));
    const getRoleByTitle = sinon.stub().returns(Promise.resolve({
      Title: 'standard',
      Permissions: ['readBlogPost', 'createInBasicCategory']
    }));
    const getPermissions = sinon.stub().returns(Promise.resolve([
      { Title: 'createInBasicCategory',
        Collection: 'myCollection',
        Right: 'create',
        ExcludedPaths: [],
        PayloadRestriction: { CategoryId: '${personalCategory}' },
        QueryRestriction: { Area: '${allowedArea}' }
      }      
    ]));    

    // Execute
    await PayloadAndQueryController(req, res, next, mainConfig, getRoleAssignmentsForUser, getRoleByTitle, getPermissions, errorHandlerSpy);

    // Assert
    sinon.assert.calledOnce(res.status);
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.status, 403);
    sinon.assert.calledOnce(errorHandlerSpy);
  });

  it('will return 403 status if no permissions for the collection have been found', async () => {
    // Prepare
    const req: any = {
      user : { _id: 'someUser' },
      params: { 
        Right: 'create',
        Collection: 'myCollection' },
      body: {
        payload: {
          Title: 'A new Blogpost',
          Area: '12345',
          CategoryId: '00001'
        },
        query: {
          Title: 'A new Blogpost',
          Area: '12345'
        }        
      }
    };
    
    const getRoleAssignmentsForUser = sinon.stub().returns(Promise.resolve([
      { User: 'someUser',
        Role: 'standard',
        Data: { 
          personalCategory: '00001',
          allowedArea: '12345'
        } 
      }
    ]));
    const getRoleByTitle = sinon.stub().returns(Promise.resolve({
      Title: 'standard',
      Permissions: ['readBlogPost', 'createInBasicCategory']
    }));
    const getPermissions = sinon.stub().returns(Promise.resolve([]));    

    // Execute
    await PayloadAndQueryController(req, res, next, mainConfig, getRoleAssignmentsForUser, getRoleByTitle, getPermissions, errorHandlerSpy);

    // Assert
    sinon.assert.calledOnce(res.status);
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.status, 403);
    sinon.assert.calledOnce(errorHandlerSpy);
  });
});