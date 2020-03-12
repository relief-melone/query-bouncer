import { QueryController } from '../src/controllers/controller.query';
import sinon from 'sinon';
import mainConfig from '../src/configs/config.main';
import errorFactory from '../src/services/error/service.errors';

describe('controller.query', () => {
  let res;
  let next;
  beforeEach(() => {
    res = sinon.stub({        
      json() { },
      status(){ },
    });
    res.json.returns(res);
    res.status.returns(res);
    next = function(): any{return this;};
  });
  it('will correctly return an error if no permission was found', async () => {
    // Prepare
    const req: any = {
      user : { _id: 'someUser' },
      body : { query: {} },
      params: { Right: 'read',
        Collection: 'myCollection' }
    };
    const getRoleAssignmentsForUser = sinon.stub().returns(Promise.resolve([
      { User: 'someUser',
        Role: 'admin',
        Data: { someData: 'myVal' } }
    ]));
    const getRoleByTitle = sinon.stub().returns(Promise.resolve({
      Title: 'admin',
      Permissions: ['someId1', 'someId2']
    }));
    const getPermissions = sinon.stub().returns(Promise.resolve([]));
    // Execute
    await QueryController(req, res, next, mainConfig, getRoleAssignmentsForUser, getRoleByTitle, getPermissions );

    // Assert
    sinon.assert.callCount(res.status,1);
    sinon.assert.calledWith(res.status,403);
    sinon.assert.callCount(res.json,1);
    sinon.assert.calledWith(res.json, errorFactory.unauthorized('No Permission was found'));   
  });

  it('will correctly return the populated permission queries with valid input', async () => {
    // Prepare
    const req: any = {
      user : { _id: 'someUser' },
      body : { query: {} },
      params: { Right: 'read',
        Collection: 'myCollection' }
    };
    const getRoleAssignmentsForUser = sinon.stub().returns(Promise.resolve([
      { User: 'someUser',
        Role: 'admin',
        Data: { someData: 'myVal',
          someOtherData: 'moreData' } }
    ]));
    const getRoleByTitle = sinon.stub().returns(Promise.resolve({
      Title: 'admin',
      Permissions: ['someTitle1', 'someTitle2']
    }));
    const getPermissions = sinon.stub().returns(Promise.resolve([
      { Title: 'someTitle1',
        Collection: 'myCollection',
        Right: 'read',
        ExcludedPaths: [],
        QueryRestriction: { SpecialVal: '${someData}' } },
      { Title: 'someTitle2',
        Collection: 'myCollection',
        Right: 'read',
        ExcludedPaths: [],
        QueryRestriction: { NewVal: '${someOtherData}' } }
    ]));

    // Execute
    await QueryController(req, res, next, mainConfig, getRoleAssignmentsForUser, getRoleByTitle, getPermissions );

    // Assert
    sinon.assert.calledOnce(res.status);
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.status,200);
    sinon.assert.calledWith(res.json, {
      query: { $or: [{ SpecialVal: 'myVal' }, { NewVal: 'moreData' }] }
    });
    sinon.assert.calledWith(res.json, {
      query: {
        $or : [{ SpecialVal: 'myVal' }, { NewVal: 'moreData' }]
      }      
    });
  });
});