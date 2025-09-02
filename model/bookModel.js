const mongoose =require("mongoose")
const Schema =mongoose.Schema

const bookSchema=new Schema({
    //schema 
    bookName:{
        type:String,
        unique:true,
        required:true,
    },
    bookPrice:{
        type: Number    },
    isbnNumber:{
        type:Number
    },
    authorName:{
        type:String
    },
    publishedAt:{
        type:Date                   
    },
    publication:{
        type: String
    },
    imageURL:{
        tyoe:String
    }
    })
   const Book = mongoose.model("Book", bookSchema);
   module.exports = Book;
   