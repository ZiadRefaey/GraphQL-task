import express from "express";
import books from "./data.js";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";
import mongoose from "mongoose";
import { connectToDB, models } from "./db.js";
import { resolvers } from "./resolvers.js";
import { typeDefs } from "./schema.js";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import "dotenv/config";

await connectToDB();

const apollo = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
});
await apollo.start();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded());

const getUserFromRequest = async (req, models) => {
  const tokenWtihBearer = req.headers.authorization;

  try {
    const token = tokenWtihBearer.startsWith("Bearer")
      ? tokenWtihBearer.slice(7)
      : null;
    if (!token) {
      throw new GraphQLError("please provide valid token");
    }
    const Response = await jwt.verify(token, process.env["JWT_SECRET"]);
    const user = await models.User.findById(Response.user);
    return user;
  } catch (err) {
    return null;
  }
};

app.use(
  "/graphql",
  expressMiddleware(apollo, {
    context: async ({ req }) => {
      const user = await getUserFromRequest(req, models);
      return { req, models, user };
    },
  }),
);
app.listen(5000, () => {
  console.log("Apollo Server connected on http://localhost:4000/graphql");
});
