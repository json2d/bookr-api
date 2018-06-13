var mongoose = require('mongoose');
var {DB_URI, DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT} = process.env;


const init = () => {
  // connect to mongodb using env vars from config
  if(DB_URI) {
      mongoose.connect(DB_URI);
  }else{
      mongoose.connect(DB_HOST, DB_NAME, DB_PORT, {
        user: DB_USER,
        pass: DB_PASS
      });
  }

  // mongoose.Promise = global.Promise

  var db = mongoose.connection;

  function onConnected() {
      console.info('Connection has successfully established with MongoDB');
  }

  function onError(err) {
      console.error(err);
      console.warn('No connection with database');
  }

  db.once('connected', onConnected);
  db.on('error', onError);

}
module.exports = {init};
