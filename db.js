import mongoose from 'mongoose';
import { Book } from './models/Book.js';
import {User} from './models/User.js'
export const connectToDB = async ()=>{
    // http://localhost:27017
    await mongoose.connect("mongodb+srv://alislimaly_db_user:dJy9p2yX7WVkuX7W@cluster0.lkqlno6.mongodb.net/?appName=Cluster0");

    console.log(" Mongoose Connected successfully")
}

export const models = {Book,User}