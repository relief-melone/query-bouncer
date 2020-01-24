import M = require('mongoose');
import mongodbConfig = require('../../configs/config.mongodb');

const mongoose = new M.Mongoose({
  useUnifiedTopology: true
});

// Connect to MongoDB

function connect(mongoose): void {
  console.log('Connecting to ' + mongodbConfig.getConnectionString());
  mongoose.connect(mongodbConfig.getConnectionString(), {
    useNewUrlParser: true,
    autoReconnect: false,
    useFindAndModify: false,
  });
}

export default mongoose;

export const connectToDb = (): void => {
  connect(mongoose);

  mongoose.connection.on('open', () => {
    console.log('\x1b[32m', 'Successfully connected to database', '\u001b[0m');
  });

  mongoose.connection.on('error', () => {
    console.log('Connection to database lost. Good Bye...');
    setTimeout(() => {
      process.exit();
    }, 500);
  });

  mongoose.connection.on('disconnect', () => {
    console.log('Database got disconnected. Good Bye...');
    setTimeout(() => {
      process.exit();
    }, 500);
  });

  mongoose.connection.on('close', () => {
    console.log('Connection to database was closed. Good Bye..');
    setTimeout(() => {
      process.exit();
    }, 500);
  });
};