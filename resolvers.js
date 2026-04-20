import bcrypt from "bcrypt";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const resolvers = {
  Query: {
    hello: () => "Hello World !",
    books: async (parent, { genre, limit = 10, skip = 0 }, { req, models }) => {
      const filter = genre ? { genre } : {};
      const books = await models.Book.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      return books;
    },
    book: async (parent, { id }) => {
      // if(last){
      //     const books  = await book.find().orderBy({createdAt:-1}).limit(last)
      // }
      const book = await models.Book.findById(id);
      return book;
    },
    me: async (parent, args, { user, models }) => {
      if (!user) {
        throw new GraphQLError("You must be logged in");
      }

      // console.log("user",user)
      // const books = await models.Book.find({author: user._id})
      // console.log("books",books)
      // const userAFterDiscturcutre  = {...user.toObject(),books}
      // console.log("userAFterDiscturcutre",userAFterDiscturcutre);
      return user.populate("books");
    },
    myBooks: async (parent, args, { user, models }) => {
      if (!user) {
        throw new GraphQLError("You must be logged in");
      }

      return models.Book.find({ author: user._id });
    },
  },
  // User: {
  //     books: async (user,args,{models})=>{
  //         console.log("hamadaaaaaaaaaaaaaaaaaaaaaaa")
  //         const books = await models.Book.find({author: user._id})
  //         return books;
  //     }
  // },
  // Book:{
  //     author: (Book)
  // },
  Book: {
    author: async (book, args, { models }) => {
      console.log("Loading author for book", book.id);
      return models.User.findById(book.author);
    },
  },
  Mutation: {
    addBook: async (parent, { input }, { user, models }) => {
      if (!user) {
        throw new GraphQLError("You must be logged in");
      }
      console.log("user data", user);
      console.log("Input incoming", input);
      return models.Book.create(input);
      // const createdBook = await Book.create(input);
      // console.log("")
      // return createdBook;
    },
    updateBook: async (parent, { input }, { user, models }) => {
      if (!user) {
        throw new GraphQLError("You must be logged in");
      }

      const book = await models.Book.findById(input.id);
      if (!book) {
        return null;
      }

      if (book.author.toString() !== user.id) {
        throw new GraphQLError("Not authorized");
      }

      if (input.title !== undefined) {
        book.title = input.title;
      }

      if (input.pages !== undefined) {
        book.pages = input.pages;
      }

      return book.save();
    },
    deleteBook: async (parent, { id }, { user, models }) => {
      if (!user) {
        throw new GraphQLError("You must be logged in");
      }

      const book = await models.Book.findById(id);
      if (!book) {
        return null;
      }

      if (book.author.toString() !== user.id) {
        throw new GraphQLError("Not authorized");
      }

      await book.deleteOne();
      return "Book deleted successfully";
    },
    signup: async (parent, { input }, { models }) => {
      const hashedPassowrd = await bcrypt.hash(input.password, 8);
      await models.User.create({
        name: input.name,
        email: input.email,
        password: hashedPassowrd,
      });
      return "User Signed up successfully";
    },
    login: async (parent, { input }, { models }) => {
      const { email, password } = input;
      // find user by email
      const user = await models.User.findOne({ email });
      console.log("incoming data", { email, password });
      // compare user existence & compare password
      const isCredentialsOk =
        user && (await bcrypt.compare(password, user.password));
      console.log("isCredentialsOk", isCredentialsOk);
      if (!isCredentialsOk) {
        throw new GraphQLError("invalid username or password");
      }
      const token = jwt.sign({ user: user.id }, process.env["MONGO_URL"]);
      // sign the token

      // return the result
      return { token };
    },
  },
};
