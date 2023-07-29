import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();

const connectDb = async() =>{
    try{
        const CONNECTION_STRING = process.env.CONNECTION_STRING
        const connect = await mongoose.connect(CONNECTION_STRING)
        console.log("connected", connect.connection.host, connect.connection.name)
    }
    catch(err){
        console.log(err)
    }
}
export default connectDb
// module.exports = connectDb