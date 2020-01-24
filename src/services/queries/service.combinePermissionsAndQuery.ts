export default (query: Record<string, any>, PopulatedPermissions: Array<Record<string, any>>): object => {
  return Object.assign({}, query, {
    $or : PopulatedPermissions
  });
};