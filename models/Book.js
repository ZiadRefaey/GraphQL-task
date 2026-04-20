import mongoose from 'mongoose';


const bookSchema = new mongoose.Schema({
    title: {type:String, required: true},
    pages: {type: Number, required:true},
    genre: {type: String},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
}, { timestamps: true })


export const Book = mongoose.model("Book",bookSchema)
