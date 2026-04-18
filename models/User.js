import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    name: {type:String, required: true},
    email: {type: String, required:true,unique: true},
    password: {type: String, required:true}
}
,
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
}

)


userSchema.virtual("books",{
    ref: "Book",
    localField:"_id",
    foreignField:"author",
    as: "books"
})

export const User = mongoose.model("User",userSchema)