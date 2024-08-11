import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    $match: {
      product: new ObjectId("66acde5a17d7af8d16b7160f"),
    },
  },
  {
    $group: {
      _id: null,
      averageRating: {
        $avg: "$rating",
      },
      NumOfReviews: {
        $sum: 1,
      },
    },
  },
];

const client = await MongoClient.connect("");
const coll = client.db("E-commerce").collection("review_schemas");
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
await client.close();
