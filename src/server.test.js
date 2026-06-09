const request = require("supertest");
const app     = require("../src/server");

test("GET /health → 200", async () => {
  const res = await request(app).get("/health");
  expect(res.status).toBe(200);
  expect(res.body.status).toBe("ok");
});

test("GET /api/books → list", async () => {
  const res = await request(app).get("/api/books");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body.data)).toBe(true);
});

test("GET /api/books/1 → one book", async () => {
  const res = await request(app).get("/api/books/1");
  expect(res.status).toBe(200);
  expect(res.body.data.id).toBe("1");
});

test("GET /api/books/999 → 404", async () => {
  const res = await request(app).get("/api/books/999");
  expect(res.status).toBe(404);
});

test("POST /api/books → 201", async () => {
  const res = await request(app).post("/api/books")
    .send({ title: "Arrow of God", author: "Chinua Achebe", genre: "Fiction", year: 1964 });
  expect(res.status).toBe(201);
  expect(res.body.data.id).toBeDefined();
});

test("POST /api/books → 400 missing title", async () => {
  const res = await request(app).post("/api/books").send({ author: "No Title" });
  expect(res.status).toBe(400);
});

test("PUT /api/books/1 → update", async () => {
  const res = await request(app).put("/api/books/1")
    .send({ title: "Updated Title", author: "Chinua Achebe", genre: "Classic", year: 1958 });
  expect(res.status).toBe(200);
  expect(res.body.data.title).toBe("Updated Title");
});

test("DELETE /api/books/2 → deleted", async () => {
  const res = await request(app).delete("/api/books/2");
  expect(res.status).toBe(200);
});

test("DELETE /api/books/999 → 404", async () => {
  const res = await request(app).delete("/api/books/999");
  expect(res.status).toBe(404);
});
