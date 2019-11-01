const debug = require("./debug");
const env = require("./env");
const db = require("./database");
const uuid = require("uuid/v1")

//export db agnostic services
module.exports={
     deposit: async (filename, contents)=>{
          return db.deposit(filename, contents);
     },
     retrieve: async(filename, res)=>{
          return db.retrieve(filename, res)
     }
}
