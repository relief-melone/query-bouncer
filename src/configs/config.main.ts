export default {
  userPrimaryKey: process.env.QBOUNCER_USER_PRIMARY_KEY || '_id',
  forceUserToLowerCase :process.env.FORCE_USER_LOWERCASE?.toLowerCase()==='false'? false :true,
  adminToken: process.env.QBOUNCER_ADMIN_TOKEN || 'youw0ntgu3ss',
};