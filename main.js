const STORAGE_KEY = "BOOKSHELF_APPS";
let books = [];
let searchQuery = "";

// Storage
function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}
function loadBooks() {
  const data = localStorage.getItem(STORAGE_KEY);
  books = data ? JSON.parse(data) : [];
}
function generateId() {
  return Date.now();
}

// CRUD
function addBook({ title, author, year, isComplete }) {
  const book = {
    id: generateId(),
    title,
    author,
    year: Number(year),
    isComplete,
  };
  books.push(book);
  saveBooks();
  renderBooks();
}
function toggleBook(id) {
  const book = books.find((b) => b.id === id);
  if (!book) return;
  book.isComplete = !book.isComplete;
  saveBooks();
  renderBooks();
}
function deleteBook(id) {
  books = books.filter((b) => b.id !== id);
  saveBooks();
  renderBooks();
}
function editBook(id, { title, author, year }) {
  const book = books.find((b) => b.id === id);
  if (!book) return;
  book.title = title.trim();
  book.author = author.trim();
  book.year = Number(year);
  saveBooks();
  renderBooks();
}

// Rendering
function createBookElement(book) {
  const wrapper = document.createElement("div");
  wrapper.dataset.bookid = book.id;
  wrapper.dataset.testid = "bookItem";
  wrapper.className = "book-card";

  wrapper.innerHTML = `
    <h3 data-testid="bookItemTitle">${book.title}</h3>
    <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
    <p data-testid="bookItemYear">Tahun: ${book.year}</p>
    <div class="actions">
      <button data-testid="bookItemIsCompleteButton">
        ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
      </button>
      <button data-testid="bookItemDeleteButton">Hapus Buku</button>
      <button data-testid="bookItemEditButton">Edit Buku</button>
    </div>
  `;
  return wrapper;
}

function renderBooks() {
  const incompleteList = document.getElementById("incompleteBookList");
  const completeList = document.getElementById("completeBookList");
  incompleteList.innerHTML = "";
  completeList.innerHTML = "";

  const filtered = searchQuery
    ? books.filter((b) =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : books;

  for (const book of filtered) {
    const el = createBookElement(book);
    if (book.isComplete) completeList.appendChild(el);
    else incompleteList.appendChild(el);
  }
}

// Events
function bindEvents() {
  document.getElementById("bookForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = document.getElementById("bookFormYear").value;
    const isComplete = document.getElementById("bookFormIsComplete").checked;
    if (!title || !author || !year) return;
    addBook({ title, author, year, isComplete });
    e.target.reset();
  });

  document.getElementById("searchBook").addEventListener("submit", (e) => {
    e.preventDefault();
    searchQuery = document.getElementById("searchBookTitle").value;
    renderBooks();
  });

  document.body.addEventListener("click", (e) => {
    const item = e.target.closest('[data-testid="bookItem"]');
    if (!item) return;
    const id = Number(item.dataset.bookid);
    const book = books.find((b) => b.id === id);

    if (e.target.dataset.testid === "bookItemIsCompleteButton") {
      toggleBook(id);
    }
    if (e.target.dataset.testid === "bookItemDeleteButton") {
      if (confirm("Hapus buku ini?")) deleteBook(id);
    }
    if (e.target.dataset.testid === "bookItemEditButton") {
      const newTitle = prompt("Judul:", book.title);
      const newAuthor = prompt("Penulis:", book.author);
      const newYear = prompt("Tahun:", book.year);
      if (newTitle && newAuthor && newYear) {
        editBook(id, { title: newTitle, author: newAuthor, year: newYear });
      }
    }
  });
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  loadBooks();
  bindEvents();
  renderBooks();
});
