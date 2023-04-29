const {Pool} =require("pg");

const pool=new Pool({
    host:"localhost",
    user:"postgres",
    port:"5432",
    password:"2003",
    database:"signup"
})
pool.connect()
module.exports=pool