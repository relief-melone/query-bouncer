const populatePermission = (permissionQuery: any, data: any): any => {
  Object.keys(permissionQuery).map( key => {
    Object.keys(data).map( dataKey => {
      if(typeof(permissionQuery[key]) === 'object'){
        permissionQuery[key] = populatePermission(permissionQuery[key], data);
      } else {
        permissionQuery[key] = replacePlaceholder(permissionQuery[key], dataKey, data[dataKey]);
      }
    });
  });
  return permissionQuery;
};

const replacePlaceholder = (unpopulated: string|boolean|number, key: string, value: string): string|boolean|number => {
  return typeof unpopulated === 'string' 
    ? unpopulated.replace( '${'+ key +'}',value )
    : unpopulated;
};

export default populatePermission;