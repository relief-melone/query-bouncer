export default (
  permissions: any
): boolean => {
  if(!permissions) return false;
  return permissions.length > 0;
};