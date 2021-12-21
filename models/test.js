const { MongoClient } = require("mongodb");

// This whole file is really just a test to see if I can make a quick method to enter clicks to the database in specific format
// ie., Title, location, route: {name: stop#}

 

// Replace the following with your Atlas connection string                                                                                                                                        

const url = "mongodb+srv://<user:pass>@cluster0.aln1v.mongodb.net/mapData?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true";

const client = new MongoClient(url);

// The database to use

const dbName = "mapData";

                      

async function run() {

   try {

        await client.connect();

        console.log("Connected correctly to server");

        const db = client.db(dbName);

        // Use the collection "people"

        const col = db.collection("testData");

        // Construct a document                                                                                                                                                              

        let personDocument = {

            "name": { "first": "Alan", "last": "Turing" },

            "birth": new Date(1912, 5, 23), // June 23, 1912                                                                                                                                 

            "death": new Date(1954, 5, 7),  // June 7, 1954                                                                                                                                  

            "contribs": [ "Turing machine", "Turing test", "Turingery" ],

            "views": 1250000

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