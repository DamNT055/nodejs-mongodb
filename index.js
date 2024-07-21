import { MongoClient, MongoServerError } from "mongodb";
const url = "mongodb://0.0.0.0:27017";
const client = new MongoClient(url, {
  retryReads: true,
  retryWrites: true,
});
const dbName = "myProject";

async function main() {
  await client.connect();
  console.log("Connected Successfully to Server");
  const db = client.db(dbName);
  const collection = db.collection("documents");
  return collection;
}

main()
  .then(async (collection) => {
    // Bulk write
    const orderedBulk = collection.initializeOrderedBulkOp();
    orderedBulk.insert({
      _id: 1,
      name: "Jonhny",
    });
    orderedBulk
      .find({
        _id: 2,
      })
      .updateOne({
        $set: {
          name: "Micheal",
        },
      });
    orderedBulk
      .find({
        _id: 3,
      })
      .remove();
    orderedBulk.execute((err, result) => {
      // Handle error or result
    });
    // Unordered bulk write
    const unorderedBulk = collection.initializeUnorderedBulkOp();
    unorderedBulk.insert({
      _id: 1,
      name: "David",
    });
    unorderedBulk
      .find({
        _id: 2,
      })
      .updateOne({
        $set: {
          name: "Beckham",
        },
      });
    unorderedBulk
      .find({
        _id: 3,
      })
      .deleteOne();
    unorderedBulk.execute((err, result) => {
      // handle error or result
    });

    // Insert Document
    try {
      const insertResult = await collection.insertMany([
        {
          a: 1,
        },
        {
          b: 2,
        },
        {
          c: 3,
        },
      ]);
      console.log("Inserted Documents", insertResult);
    } catch (error) {
      if (error instanceof MongoServerError) {
        console.log(`Error worth logging: ${error}`);
      }
      throw error;
    }

    // Find Result With a Query filter
    const filterResult = await collection
      .find({
        a: 1,
      })
      .toArray();
    console.log("Find Documents with Filter", filterResult);
    // Update a Documents
    const updateResult = await collection.updateOne(
      { a: 1 },
      {
        $set: {
          b: 5,
        },
      }
    );
    console.log("Update Documents Result", updateResult);
    // Create index a collection
    const indexName = await collection.createIndex({ a: 1 });
    console.log("Index name", indexName);
    // Remove Documents
    const deleteResult = await collection.deleteMany({
      $or: [
        {
          a: 1,
        },
        {
          b: 2,
        },
        {
          c: 3,
        },
      ],
    });
    console.log("Remove Documents", deleteResult);
    // Find All Documents
    const findResult = await collection.find({}).toArray();
    console.log("Find All Documents", findResult);
  })
  .catch(console.error)
  .finally(() => client.close());

export { main, client };
