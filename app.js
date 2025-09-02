require('dotenv').config();
const express = require('express');
const ConnectToDatabase = require('./database/database.js');
const Book = require('./model/bookModel.js');
const { multer,storage} =require('./middleware/multerConfig');
const upload = multer({ storage: storage }); 
const fs=require('fs')
const PORT= process.env.PORT || 4000
const cors =require('cors');

const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // Adjust this to your frontend's URL 
}))
app.use(express.json());
ConnectToDatabase();

// Root route
app.get("/", (req, res) => {
    res.status(200).json({ message: "success" });
});

// Create book
app.post("/book",upload.single('image'), async (req, res) => {
    let fileName;
    if(!req.file){
       fileName="https://www.google.com/imgres?q=book%20cover&imgurl=https%3A%2F%2Fwww.designforwriters.com%2Fwp-content%2Fuploads%2F2017%2F10%2Fdesign-for-writers-book-cover-tf-2-a-million-to-one.jpg&imgrefurl=https%3A%2F%2Fwww.designforwriters.com%2Fbook-cover-design%2F&docid=5lDXrUyP8nyODM&tbnid=DpVKHmP3IWQHGM&vet=12ahUKEwieqqCjrNWOAxVxamwGHUriAVMQM3oECA0QAA..i&w=384&h=600&hcb=2&ved=2ahUKEwieqqCjrNWOAxVxamwGHUriAVMQM3oECA0QAA"
    }
    else{
          fileName = "http://localhost:4000/" + req.file.filename;
}
    const { bookPrice, bookName  } = req.body;
    try {
        const book = await Book.create({ bookName,
             bookPrice,
              imageURL:fileName
            });
        res.status(201).json({
            message: "Book created successfully",
            data: book
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating book",
            error: error.message
        });
    }
});
// Get all books
app.get("/book", async (req, res) => {
    const books = await Book.find()
    res.status(200).json({
        message: "Books fetched successfully",
        data: books
    });
});

// Get single book
app.get("/book/:id", async (req, res) => {
    const id =req.params.id
    const book = await Book.findById(id);
    if (!book) {
        return res.status(404).json({ message: "Nothing found" });
    }
    res.status(200).json({
        message: "Single Book Fetched Successfully",
        data: book,
    });
});

// Delete book
app.delete("/book/:id", async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Book Deleted Successfully" });
});

// Update book
// app.patch("/book/:id", upload.single('image'), async (req, res) => {
//     const id =req.params.id
//     const{ bookPrice, bookName ,imageURL} = req.body;
//     const oldData = await Book.findById(id);
//       let fileName;
//     if(req.file){
//         const oldImagePath=oldData.imageURL;
//         console.log(oldImagePath);
//         const localHostUrLength = "http://localhost:4000/".length
//         const newImagePath = oldImagePath.slice(localHostUrLength);
//         // console.log(newOldImagePath);
// fs.unlink(`storage/${newOldImagePath}`,(err)=>{
//             if(err){
//                 console.log(err)
//             }
//             else{
//                 console.log("file deleted successfully")
//             }
//         })

//     }
//     fileName="http://localhost:4000/"+req.file.filename

//     const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.status(200).json({
//         message: "Book Updated Successfully",
//         data: updatedBook
//     });
// });
// Update book
app.patch("/book/:id", upload.single("image"), async (req, res) => {
  try {
    const id = req.params.id;
    const oldData = await Book.findById(id);
    if (!oldData) {
      return res.status(404).json({ message: "Book not found" });
    }

    let fileName = oldData.imageURL; // keep old one by default

    // If new file is uploaded
    if (req.file) {
      // delete old file if it was stored locally
      if (oldData.imageURL && oldData.imageURL.startsWith("http://localhost:4000/")) {
        const localHostUrlLength = "http://localhost:4000/".length;
        const oldFilePath = oldData.imageURL.slice(localHostUrlLength);
        fs.unlink(`storage/${oldFilePath}`, (err) => {
          if (err) {
            console.log("Error deleting old file:", err);
          } else {
            console.log("Old file deleted successfully");
          }
        });
      }

      fileName = "http://localhost:4000/" + req.file.filename;
    }

    // Build update object
    const updateData = {
      bookName: req.body.bookName,
      bookPrice: req.body.bookPrice,
      isbnNumber: req.body.isbnNumber,
      authorName: req.body.authorName,
      publication: req.body.publication,
      publishedAt: req.body.publishedAt,
      imageURL: fileName,
    };

    const updatedBook = await Book.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({
      message: "Book Updated Successfully",
      data: updatedBook,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating book", error: error.message });
  }
});

app.delete("/book/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    try {
      // Only delete local files, not placeholder/external URLs
      if (book.imageURL && book.imageURL.startsWith("http://localhost:4000/")) {
        const localHostUrlLength = "http://localhost:4000/".length;
        const imagePath = book.imageURL.slice(localHostUrlLength);

        fs.unlink(`storage/${imagePath}`, (err) => {
          if (err) {
            console.error("Error deleting file:", err.message);
          } else {
            console.log("Image file deleted successfully");
          }
        });
      }
    } catch (fileError) {
      console.error("File deletion error:", fileError.message);
    }

    await Book.findByIdAndDelete(id);

    res.status(200).json({
      message: "Book Deleted Successfully",
    });
  } catch (error) {
    console.error("Error deleting book:", error.message);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});


// Start server
app.listen(PORT, async () => {
    await ConnectToDatabase();
    app.use("/storage", express.static("storage"));

    console.log(`Node.js server is running on port ${PORT}`);
    
});

