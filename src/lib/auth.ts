
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

const mongoConnectionString = process.env.MONGODB_URI;

if (!mongoConnectionString) {
  throw new Error("MONGODB_URI is missing from environment variables");
}

const client = new MongoClient(mongoConnectionString);

const database = client.db("booknook_auth");

export const auth = betterAuth({
  database: mongodbAdapter(database, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
});
