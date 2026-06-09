// ============================================================
//  SIMPLE BOOKS CRUD API
//  • REST API at  /api/books
//  • UI served at /  (src/public/index.html)
// ============================================================

const express = require("express");
const cors    = require("cors");
const path    = require("path");
const { v4: uuidv4 } = require("uuid");

const app  = express();
const PORT = process.env.PORT || 4004;

app.use(cors());
app.use(express.json());

// Serve the UI (index.html + any static files in public/)
app.use(express.static(path.join(__dirname, "public")));

// ── IN-MEMORY DATABASE ───────────────────────────────────────
let books = [
  { id: "1", title: "Things Fall Apart",    author: "Chinua Achebe",             genre: "Fiction", year: 1958 },
  { id: "2", title: "Half of a Yellow Sun", author: "Chimamanda Ngozi Adichie",  genre: "Fiction", year: 2006 },
  { id: "3", title: "Purple Hibiscus",      author: "Chimamanda Ngozi Adichie",  genre: "Fiction", year: 2003 },
];

// ── HEALTH ───────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// ── GET all books ────────────────────────────────────────────
app.get("/api/books", (_req, res) => {
  res.json({ success: true, count: books.length, data: books });
});

// ── GET one book ─────────────────────────────────────────────
app.get("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id === req.params.id);
  if (!book) return res.status(404).json({ success: false, message: "Book not found" });
  res.json({ success: true, data: book });
});

// ── CREATE a book ────────────────────────────────────────────
app.post("/api/books", (req, res) => {
  const { title, author, genre, year } = req.body;
  if (!title || !author)
    return res.status(400).json({ success: false, message: "title and author are required" });

  const book = { id: uuidv4(), title, author, genre: genre || "Unknown", year: year || null };
  books.push(book);
  res.status(201).json({ success: true, data: book });
});

// ── UPDATE a book ────────────────────────────────────────────
app.put("/api/books/:id", (req, res) => {
  const idx = books.findIndex((b) => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Book not found" });

  const { title, author, genre, year } = req.body;
  if (!title || !author)
    return res.status(400).json({ success: false, message: "title and author are required" });

  books[idx] = { id: req.params.id, title, author, genre, year };
  res.json({ success: true, data: books[idx] });
});

// ── DELETE a book ────────────────────────────────────────────
app.delete("/api/books/:id", (req, res) => {
  const idx = books.findIndex((b) => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Book not found" });

  const deleted = books.splice(idx, 1)[0];
  res.json({ success: true, message: "Book deleted", data: deleted });
});

// ── START ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log("Server running");
});

module.exports = app;
