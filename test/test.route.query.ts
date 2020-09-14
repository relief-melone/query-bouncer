import sinon from 'sinon';
import routeFunction from '../src/routes/route.main.function';

describe('route.query', () => {
  let res;
  let next;
  let queryController, payloadController, queryAndPayloadController;

  beforeEach(() => {
    res = sinon.stub({
      json(){return this;},
      status(){return this;}
    });
    res.json.returns(res);
    res.status.returns(res);
    next = function(): any{return this;};
    queryController = sinon.fake();
    payloadController = sinon.fake();
    queryAndPayloadController = sinon.fake();

  });
  it('will correctly call the QueryController if action is read', () => {      

    const req: any = {
      params: { Right : 'read',
        Collection: 'MyCollection' }
    };

    routeFunction(req, res, next, queryController, payloadController, queryAndPayloadController);
    sinon.assert.calledOnce(queryController);
    sinon.assert.notCalled(queryAndPayloadController);
    sinon.assert.notCalled(payloadController);
  });
  it('will correctly call the QueryController if action is read', () => {
        

    const req: any = {
      params: { Right : 'delete',
        Collection: 'MyCollection' }
    };

    routeFunction(req, res, next, queryController, payloadController, queryAndPayloadController);
    
    sinon.assert.calledOnce(queryController);
    sinon.assert.notCalled(queryAndPayloadController);
    sinon.assert.notCalled(payloadController);
  });
  it('will correctly call the PayloadController if action is create', () => {
        

    const req: any = {
      params: { Right : 'create',
        Collection: 'MyCollection' }
    };

    routeFunction(req, res, next, queryController, payloadController, queryAndPayloadController);
    sinon.assert.notCalled(queryController);
    sinon.assert.notCalled(queryAndPayloadController);
    sinon.assert.calledOnce(payloadController);
  });
  it('will correctly call the PayloadController if action is update', () => {
        

    const req: any = {
      params: { Right : 'update',
        Collection: 'MyCollection' }
    };

    routeFunction(req, res, next, queryController, payloadController, queryAndPayloadController);
    sinon.assert.notCalled(queryController);
    sinon.assert.calledOnce(queryAndPayloadController);
    sinon.assert.notCalled(payloadController);
  });
  it('will correctly return an error if no correct action beeing sent', () => {
        

    const req: any = {
      params: { Right : 'make',
        Collection: 'MyCollection' }
    };

    routeFunction(req, res, next, queryController, payloadController, queryAndPayloadController);
    sinon.assert.calledOnce(res.status);
    sinon.assert.calledOnce(res.json);
    sinon.assert.notCalled(queryController);
    sinon.assert.notCalled(queryAndPayloadController);
    sinon.assert.notCalled(payloadController);
  });
});