import { main, client } from "./index";

main()
  .then((collection) => {
    const cursor = collection.find();
    cursor.forEach((doc) => {
      console.log(doc);
    });
    const cursor2 = collection
      .find({
        age: {
          $gt: 25,
        },
      })
      .sort("name", 1)
      .limit(10)
      .skip(20)
      .project({ name: 1, _id: 0 });
    cursor.close();
  })
  .finally(() => {
    client.close();
  });
