const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config()

const { initializeDatabase } = require("./db/db.connection");
const { Books } = require("./models/books.model");

const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
  };

app.use(cors(corsOptions));
app.use(express.json());

initializeDatabase();

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.get("/books", async (req, res) => {
  try {
    const allbooks = await Books.find();
    res.json(allbooks);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/books", async (req, res) => {
  const { title, author, genre } = req.body;

  try {
    const bookData = new Books({ title, author, genre });
    await bookData.save();
    res.status(201).json(bookData);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/books/:id", async (req, res) => {
  const bookId = req.params.id;
  try {
    const deletedBook = await Books.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json({
      message: "Book deleted successfully",
      book: deletedBook,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/books/:id", async (req, res) => {
  const bookId = req.params.id

  try {
    const updatedBook = await Books.findByIdAndUpdate(bookId, req.body, {new: true})

    if(!updatedBook) {
      res.status(404).json({error: "Book not found"})
    }

    res.status(200).json({
      message: "Book updated successfully",
      book: updatedBook
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({error: "Internal Server Error."})
  }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
