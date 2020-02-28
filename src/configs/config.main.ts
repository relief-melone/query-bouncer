import ConfigMain from '@/interfaces/interface.configMain';

const config: ConfigMain = {
  userPrimaryKey: process.env.QBOUNCER_USER_PRIMARY_KEY || '_id',
  adminToken: process.env.QBOUNCER_ADMIN_TOKEN || 'youw0ntgu3ss',
  logLevel: process.env.LOGLEVEL || 'warn',
  supressLogging: process.env.LOG_SUPRESS === 'true' || false
};

export default config;