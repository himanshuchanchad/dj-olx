const mysql2 = require("mysql2");


const pool = mysql2.createPool({
    host :'localhost',
    user : 'root',
    port :'3306',
    password :'password',
    database : 'olx',
});

pool.getConnection(err => {
    if (err) {
      console.error(err,'Error connecting database');
      return;
    }
    console.log('Database connected...');
  });
  
module.exports=pool.promise();