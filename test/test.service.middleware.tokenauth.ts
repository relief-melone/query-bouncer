import authPermission from '../src/services/middleware/service.middleware.tokenauth';
import { expect } from 'chai';
import sinon from 'sinon';
import { Request } from 'express-serve-static-core';

describe('service.auth.permission', () => {
  let res;
  let next;


  beforeEach(() => {
    res = sinon.stub({        
      json() { },
      status(){ },
    });
    res.json.returns(res);
    res.status.returns(res);
    next = sinon.stub();
  });
  it('it will correctly tell user can create permission if he is admin', async () => {
    // Prepare
    const mainConfig = {
      adminToken: 'correctAdminToken',
      userPrimaryKey: '_id',
      forceUserToLowerCase:true
    };

    const req ={ headers:{ authorization:'correctAdminToken' } } as Request;
    await authPermission(req, res,next, mainConfig);
    expect(next.callCount).to.equal(1);
  });

  it('it will correctly tell user cannot create permission if he is not admin', async () => {
    // Prepare
    const mainConfig = {
      adminToken: 'correctAdminToken',
      userPrimaryKey: '_id',
      forceUserToLowerCase:true
    };
    const req ={ headers:{ authorization:'incorrectAdminToken' } } as Request;
    await authPermission(req,res,next, mainConfig);
    expect(res.status.calledWith(403)).to.be.true;
    expect(next.notCalled).to.be.true;
    
  });
});