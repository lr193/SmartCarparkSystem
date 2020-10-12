const { MongoClient } = require("mongodb");
 
const url = "mongodb+srv://hjayatilleke:hjayatilleke@cluster0.elbtc.mongodb.net/register?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true";

const client = new MongoClient(url);
 
 // The database to use
 const dbName = "register";
                      
 async function run() {
    try {
         await client.connect();
         console.log("Connected correctly to server");
         const db = client.db(dbName);

         const col = db.collection("slots");
                                                                                                                                                        
         let personDocument = {
             "carparkNo": 1, // June 23, 1912                                                                                                                                 
             "slotNo": 6,  // June 7, 1954                                                                                                                                  
             "level": 1,
             "status": false
         }
         

         // Insert a single document, wait for promise so we can read it back
         const p = await col.insertOne(personDocument);
         // Find one document
         const myDoc = await col.findOne();
         // Print to the console
         console.log(myDoc);

        } catch (err) {
         console.log(err.stack);
     }
 
     finally {
        await client.close();
    }
}

run().catch(console.dir);