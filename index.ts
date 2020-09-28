import cookieParser from 'cookie-parser';
import express from 'express';
import sessionPopulate from 'rm-session-populator';
import expressConfig from './src/configs/config.express';
import configSessionPopulator from './src/configs/config.sessionPopulator';
import routeMain from './src/routes/route.main';
import { createInternalPermissionRouter, createPermissionRouter } from './src/routes/route.permissions';
import routeRoleAssignments from './src/routes/route.roleAssignments';
import routeRoles from './src/routes/route.roles';
import grantPreflight from './src/services/middleware/grantPreflight';
import setCorsHeaders from './src/services/middleware/setCorsHeaders';
import { connectToDb } from './src/services/mongodb/service.mongodbConnector';

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
app.use('/', (_, res) => res.send('<h1>Query Bouncer is running!</h1>'));

app.listen(expressConfig.httpPort, () => {
  console.log(`HTTP Server listening on ${expressConfig.httpPort}`);
});

