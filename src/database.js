const env = require("./env");
const debug = require("./debug");

var cassandra = require('cassandra-driver');
var client;

/*
 * GET home page.
 */
module.exports={
     init_cassandra: async (client_in)=>{
     	  client = client_in
	      client_in.connect()
     		.then(function () {
     			const query = "CREATE KEYSPACE IF NOT EXISTS hw6 WITH replication =" +
     			  "{'class': 'SimpleStrategy', 'replication_factor': '1' }";
     			return client.execute(query);
     		})
     		.then(function () {
     			const query = "CREATE TABLE IF NOT EXISTS hw6.imgs2" +
     				" (filename ascii, contents blob, used ascii, PRIMARY KEY(filename))";
     			return client.execute(query);
     		})
     		.then(function () {
     			return client.metadata.getTable('hw6', 'imgs2');
     		})
     		.then(function (table) {
     			console.log('Table information');
     			console.log('- Name: %s', table.name);
     			console.log('- Columns:', table.columns);

     		})
     		.catch(function (err) {
     			console.error('There was an error', err);
     			res.status(404).send({msg: err});
     			return client.shutdown();
     		});

    },
    getUsed: async(filename, res)=>{
       let ret = {};
        const query = 'SELECT used FROM hw6.imgs2 WHERE filename = ?';
        return client.execute(query, [ filename ]).then((result)=>{
            res.send(result.rows[0]);
        }).catch((err)=>{
             ret = env.statusError;
             ret.error = err;
             res.send(ret);
        });
    },
    setUsed: async(filename, res)=>{
        let ret = {};
        const query = 'UPDATE hw6.imgs2 SET used = ? WHERE filename = ?';
        return client.execute(query, [ '1' , filename ]).then((result)=>{
            res.send(env.statusOk);
        }).catch((err)=>{
            console.log(err)
            ret = env.statusError;
            ret.error = err;
            res.send(ret);
        });
    },
    deposit: async(filename, contents, res, used)=>{
	        contents = JSON.stringify(contents);
          const query = "INSERT INTO \"hw6\".\"imgs2\" (filename, contents, used) VALUES (?, ?, ?)";
          let ret = {};
          return client.execute(query, [ filename, contents, '0' ]).then((resp)=>{
                ret = env.statusOk;
                ret.id = filename;
                res.send(ret);
          }).catch((err)=>{
                ret = env.statusError;
                ret.error = err;
                res.send(ret);
          });
    },
    retrieve: async(filename, res)=>{
        let ret = {};
        const query = 'SELECT contents FROM hw6.imgs2 WHERE filename = ?';
        return client.execute(query, [ filename ]).then((result)=>{
			       res.setHeader("Content-Type" ,   JSON.parse(result.rows[0].contents).mimetype)
			       res.send(new Buffer(JSON.parse(result.rows[0].contents).buffer.data));
  		  }).catch((err)=>{
             ret = env.statusError;
             res.status("400").send(env.statusError);
        });
    },
    delete: async(filename, res)=>{
         const query = 'DELETE contents FROM hw6.imgs2 WHERE filename = ?';
         return client.execute(query, [ filename ]).then((result)=>{
            res.send(env.statusOk);
         }).catch((err)=>{
            res.send(env.statusError);
         });
    }


}
