export const typeDefs = `#graphql 
    enum Genre {
        TECH
        PHYCHOLOGY
        COOKING
    }
    type Book {
        id: ID!,
        title: String,
        pages: Int,
        genre: Genre
        author: User
    }
    type User {
        id: ID,
        name: String,
        email: String,
        books: [Book]
        hamada: String
    }
    type Query {
        hello:String
        books: [Book]
        book(id: ID,last:Int): Book
        me: User
    }
    input AddBookInput {
        title: String!,
        pages: Int!
        author:String
    }
    
    input updateBookInput {
        id: ID!,
        title: String,
        pages: Int
    }
    input SingupInput {
        name: String!,
        email: String!,
        password: String!
    }
    input loginInput {
        email:String,
        password:String
    }
    type AuthPayload{
        token: String,
    }
    type Mutation {
        addBook(input: AddBookInput): Book
        signup(input:SingupInput): String
        login(input: loginInput): AuthPayload
    }

`