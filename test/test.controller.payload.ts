import PayloadController from '../src/controllers/controller.payload.function';
import sinon from 'sinon';
import mainConfig from '../src/configs/config.main';
import errorHandler from '../src/controllers/errors/controller.errorHandler';

describe('controller.payload', () => {
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
  
  it('will return 403 error if user is not authorized to send the requested payload', async () => {
    // Prepare
    const req: any = {
      user : { _id: 'someUser' },
      params: { Right: 'create',
        Collection: 'myCollection' },
      body: {
        payload: {
          Title: 'A new Blogpost',
          CategoryId: '12345'
        }
      }
    };
    
    const getRoleAssignmentsForUser = sinon.stub().returns(Promise.resolve([
      { User: 'someUser',
        Role: 'standard',
        Data: { personalCategory: '111111' } }
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
        PayloadRestriction: { CategoryId: '${personalCategory}' } }
    ]));
    

    // Execute
    await PayloadController(req, res, next, mainConfig, getRoleAssignmentsForUser, getRoleByTitle, getPermissions, errorHandlerSpy);

    // Assert
    sinon.assert.calledOnce(res.status);
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.status, 403);
    sinon.assert.calledOnce(errorHandlerSpy);
  });

  it('will return 200 if user is authorized to send the requested payload', async () => {
    // Prepare
    const req: any = {
      user : { _id: 'someUser' },
      params: { Right: 'create',
        Collection: 'myCollection' },
      body: {
        payload: {
          Title: 'A new Blogpost',
          CategoryId: '111111'
        }
      }
    };
    
    const getRoleAssignmentsForUser = sinon.stub().returns(Promise.resolve([
      { User: 'someUser',
        Role: 'standard',
        Data: { personalCategory: '111111' } }
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
        PayloadRestriction: { CategoryId: '${personalCategory}' } }
    ]));

    // Execute
    await PayloadController(req, res, next, mainConfig, getRoleAssignmentsForUser, getRoleByTitle, getPermissions, errorHandlerSpy);

    // Assert
    sinon.assert.calledOnce(res.status);
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json,{ payload: { CategoryId: '111111', Title: 'A new Blogpost' } });
    sinon.assert.notCalled(errorHandlerSpy);
  });
});