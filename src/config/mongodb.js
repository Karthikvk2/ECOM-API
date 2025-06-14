
import { MongoClient } from "mongodb";

// const url = "mongodb://localhost:27017/ecomdb";
// If the above url gives error (error may be caused due to IPv4/IPv6 configuration conflict), then try the url given below
// const url = "mongodb://127.0.0.1:27017/ecomdb";

let client;
export const connectToMongoDB = ()=>{
     MongoClient.connect(process.env.DB_URL)
        .then(clientInstance=>{
            client=clientInstance
            console.log("Mongodb is connected");
            createCounter(client.db());
            createindexes(client.db());
        })
        .catch(err=>{
            console.log(err);
        })
}

export const getClient = () => {
    return client
}

export const getDB = ()=>{
    return client.db();
}

const createCounter =  async(db) => {
    const existingCounter = await db.collection("counters").findOne({_id:'cartItemId'})
    if(!existingCounter){
        await db.collection("counters").insertOne({_id:'cartItemId', value:0});
    }
}

const createindexes = async (db)=>{
    try {
        await db.collection("products").createIndex({price:1});
        await db.collection("products").createIndex({name:1, category:-1});
        await db.collection("products").createIndex({desc:"text"});
    } catch (err) {
        console.log(err);
    }
    console.log("Index are created")
}