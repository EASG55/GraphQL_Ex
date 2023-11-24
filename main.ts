import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import mongoose from "mongoose";

import {typeDefs} from "./schema.ts";
import { Query } from "./resolvers/query.ts";
import { Mutation } from "./resolvers/mutation.ts";

try{
  const MONGO_URL = Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  console.log("No mongo URL found");
  Deno.exit(1);
}

await mongoose.connect(MONGO_URL);


const resolvers = { Mutation, Query};
  
  const server = new ApolloServer({
    typeDefs,
    resolvers: resolvers,
  });

const { url } = await startStandaloneServer(server, {
  listen: {
    port: 3000,
  },
});
console.log(`🚀 Server ready at ${url}`);

}catch(err){
  console.log(err);
}