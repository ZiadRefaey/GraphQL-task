
import bcrypt from 'bcrypt'
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'tobeaddedsecret';
export const resolvers = {
    Query:{
        hello: ()=> 'Hello World !',
        books:async (parent,args,{req,models})=>{
            const books  = await models.Book.find().populate("author");
            return books;
        },
        book: async (parent,{id})=>{
            // if(last){
            //     const books  = await book.find().orderBy({createdAt:-1}).limit(last)
            // }
            const book = await models.Book.findById(id);
            return book;
        },
        me: async(parent,args,{user,models})=>{
            // console.log("user",user)
            // const books = await models.Book.find({author: user._id})
            // console.log("books",books)
            // const userAFterDiscturcutre  = {...user.toObject(),books}
            // console.log("userAFterDiscturcutre",userAFterDiscturcutre);
            return user.populate("books")
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
    Mutation: {
        addBook: async (parent,{input},{user,models})=>{
            if(!user){
                throw new GraphQLError("invalid token")
            }
            console.log("user data",user)
            console.log("Input incoming",input);
            return models.Book.create(input)
            // const createdBook = await Book.create(input);
            // console.log("")
            // return createdBook;
        },
        signup: async (parent,{input},{models})=>{
            const hashedPassowrd = await bcrypt.hash(input.password,8);
            await models.User.create({name: input.name, email: input.email, password:hashedPassowrd});
            return "User Signed up successfully";
        },
        login: async (parent,{input},{models})=>{
            const {email,password} =  input;
            // find user by email
            const user = await models.User.findOne({email})
            console.log("incoming data", {email,password})
            // compare user existence & compare password
            const isCredentialsOk = user &&  (await bcrypt.compare(password,user.password)); 
            console.log("isCredentialsOk",isCredentialsOk)
            if(!isCredentialsOk){
                throw new GraphQLError('invalid username or password')
            }
            const token = jwt.sign({user: user.id},JWT_SECRET);
            // sign the token  


            // return the result 
            return {token}
        }
    }
}
