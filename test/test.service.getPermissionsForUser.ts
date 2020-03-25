import GetPopulatedPermissionsForCurrentUser from '../src/services/queries/service.getPermissionsForUser';
import Permission, { Right } from '../src/interfaces/interface.Permission';
import sinon from 'sinon';
import chai,{ expect } from 'chai';
import * as _ from 'lodash';
import chaiExclude from 'chai-exclude';

chai.use(chaiExclude);

describe('get permissions for current user',()=>{

  let roleModelMock: any;
  let roleAssignmentModelMock: any;
  let permissionModelMock: any;
  let getPopulatedPermissionsForCurrentUser: (user: string|null) => Promise<Permission[]>;

  beforeEach(()=>{
    roleModelMock = { collection:{ name:'123' } };
    permissionModelMock = { collection:{ name:'123' } };
    roleAssignmentModelMock = { aggregate:sinon.stub() };
    getPopulatedPermissionsForCurrentUser=GetPopulatedPermissionsForCurrentUser(permissionModelMock, roleAssignmentModelMock, roleModelMock);

  });


  it('should fill query restriction with given data',async ()=> {
    const expectedPermission: Permission= {
      Title:'ReadBlog',
      Right:Right.read,
      QueryRestriction:{ Author:'${AuthorId}' },
      PayloadRestriction:{},
      Collection:'Blogs',
      ExcludedPaths:[]
    };
    const permission = _.cloneDeep(expectedPermission);

    roleAssignmentModelMock.aggregate.returns({ exec:sinon.stub().resolves([{ Permissions:[permission], Data:{ AuthorId:'123' } }]) });
    const result =await getPopulatedPermissionsForCurrentUser('123456');
    expect(result[0]).excluding('QueryRestriction').to.be.deep.equal(expectedPermission);
    expect(result[0].QueryRestriction).to.be.deep.equal({ Author:'123' });

  });
  
  it('should fill payload restriction with given data',async ()=> {
    const expectedPermission: Permission= {
      Title:'ReadBlog',
      Right:Right.read,
      QueryRestriction:{},
      PayloadRestriction:{ Author:'${AuthorId}' },
      Collection:'Blogs',
      ExcludedPaths:[]
    };

    const permission = _.cloneDeep(expectedPermission);
    roleAssignmentModelMock.aggregate.returns({ exec:sinon.stub().resolves([{ Permissions:[permission], Data:{ AuthorId:'123' } }]) });
    const result =await getPopulatedPermissionsForCurrentUser('123456');
    expect(result[0]).excluding('PayloadRestriction').to.be.deep.equal(expectedPermission);
    expect(result[0].PayloadRestriction).to.be.deep.equal({ Author:'123' });
  });

});