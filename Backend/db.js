import mongoose from "mongoose";
import DBName from "./constants.js";


const DBConnections = async () =>{
    try{
        await mongoose.connect(`${process.env.MONGOOSE_URI}/${DBName}`);
        console.log("DataBase connect SucessFully");
    }
    catch(error){
        console.log(`Failed to connect to MongoDB: ${error.message}`);
    }
}

export default DBConnections;