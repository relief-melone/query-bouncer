import 'module-alias/register';

import express from 'express';
import configSessionPopulator from './src/configs/config.sessionPopulator';
import cookieParser from 'cookie-parser';
import sessionPopulate from 'rm-session-populator';

import configMain from '@/configs/config.main';
import configExpress from '@/configs/config.express';

import { connectToDb } from  './src/services/mongodb/service.mongodbConnector';
import { createInternalPermissionRouter, createPermissionRouter } from './src/routes/route.permissions';
import routeRoleAssignments from './src/routes/route.roleAssignments';
import routeRoles from './src/routes/route.roles';
import routeMain from './src/routes/route.main';
import setCorsHeaders from './src/services/middleware/setCorsHeaders';
import grantPreflight from './src/services/middleware/grantPreflight';
import logger from '@/services/log/logger';

const app = express();

app.use(setCorsHeaders);
app.use(grantPreflight);
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(cookieParser());
app.use(sessionPopulate(configSessionPopulator));

// Connect To Database
connectToDb();

// Routes
app.use('/api/admin/internalPermissions', createInternalPermissionRouter());
app.use('/api/admin/permissions', createPermissionRouter());
app.use('/api/admin/roles', routeRoles);
app.use('/api/admin/roleAssignments', routeRoleAssignments);
app.use('/api/v1', routeMain);
app.use('/', (req,res,next) => res.send('<h1>Query Bouncer is running!</h1>'));

app.listen(configExpress.httpPort, () => {
  logger.info(`HTTP Server listening on ${configExpress.httpPort}`,{
    configMain,
    configExpress,
    configSessionPopulator
  });  
});

