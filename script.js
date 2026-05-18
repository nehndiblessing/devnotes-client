// ==========================
// Load Theme
// ==========================

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-theme");
}

// ==========================
// State
// ==========================

let notes = JSON.parse(localStorage.getItem("notes")) || [];

// ==========================
// DOM Elements
// ==========================

const notesGrid = document.getElementById("notesGrid");

const noteForm = document.querySelector(".note-form");

const titleInput = document.getElementById("titleInput");

const contentInput = document.getElementById("contentInput");

const searchInput = document.querySelector(".search-input");

const newNoteBtn = document.querySelector(".new-note-btn");

const themeToggle = document.querySelector(".theme-toggle");

const previewContent = document.querySelector(".preview-content");

// ==========================
// Save Notes
// ==========================

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// ==========================
// Update Stats
// ==========================

function updateStats() {

  document.getElementById("totalNotes").textContent =
    notes.length;

  const totalCharacters = notes.reduce((total, note) => {
    return total + note.content.length;
  }, 0);

  document.getElementById("totalCharacters").textContent =
    totalCharacters;
}

// ==========================
// Update Preview
// ==========================

function updatePreview() {

  const content = contentInput.value.trim();

  previewContent.textContent =
    content || "Start typing to preview...";
}

// ==========================
// Delete Note
// ==========================

function deleteNote(id) {

  notes = notes.filter(note => note.id !== id);

  saveNotes();

  renderNotes(searchInput.value);
}

// ==========================
// Edit Note
// ==========================

function editNote(id) {

  const note = notes.find(note => note.id === id);

  if (!note) return;

  titleInput.value = note.title;

  contentInput.value = note.content;

  updatePreview();

  notes = notes.filter(note => note.id !== id);

  saveNotes();

  renderNotes(searchInput.value);
}

// ==========================
// Toggle Pin
// ==========================

function togglePin(id) {

  const note = notes.find(note => note.id === id);

  if (!note) return;

  note.pinned = !note.pinned;

  notes.sort((a, b) => b.pinned - a.pinned);

  saveNotes();

  renderNotes(searchInput.value);
}

// ==========================
// Render Notes
// ==========================

function renderNotes(searchTerm = "") {

  notesGrid.innerHTML = "";

  const search = searchTerm.toLowerCase();

  const filteredNotes = notes.filter(note => {

    return (
      note.title.toLowerCase().includes(search) ||
      note.content.toLowerCase().includes(search)
    );
  });

  if (filteredNotes.length === 0) {

    notesGrid.innerHTML = `
      <div class="empty-state">
        <h2>No Notes Found</h2>
        <p>Try creating a new note.</p>
      </div>
    `;

    updateStats();

    return;
  }

  filteredNotes.forEach(note => {

    const noteCard = document.createElement("article");

    noteCard.classList.add("note-card");

    noteCard.innerHTML = `
      <h2>${note.title}</h2>

      <p>${note.content}</p>

      <small>
        Created: ${note.createdAt}
      </small>

      <div class="note-actions">

        <button class="pin-btn">
          ${note.pinned ? "Unpin" : "Pin"}
        </button>

        <button class="edit-btn">
          Edit
        </button>

        <button class="delete-btn">
          Delete
        </button>

      </div>
    `;

    // Delete
    noteCard
      .querySelector(".delete-btn")
      .addEventListener("click", () => {
        deleteNote(note.id);
      });

    // Edit
    noteCard
      .querySelector(".edit-btn")
      .addEventListener("click", () => {
        editNote(note.id);
      });

    // Pin
    noteCard
      .querySelector(".pin-btn")
      .addEventListener("click", () => {
        togglePin(note.id);
      });

    notesGrid.appendChild(noteCard);
  });

  updateStats();
}

// ==========================
// Add Note
// ==========================

noteForm.addEventListener("submit", (e) => {

  e.preventDefault();

  const title = titleInput.value.trim();

  const content = contentInput.value.trim();

  if (!title || !content) return;

  const newNote = {

    id: Date.now(),

    title,

    content,

    pinned: false,

    createdAt:
      new Date().toLocaleDateString()
  };

  notes.unshift(newNote);

  saveNotes();

  renderNotes(searchInput.value);

  noteForm.reset();

  updatePreview();
});

// ==========================
// Search
// ==========================

searchInput.addEventListener("input", (e) => {

  renderNotes(e.target.value);
});

// ==========================
// Quick Note
// ==========================

newNoteBtn.addEventListener("click", () => {

  titleInput.value = "New Note";

  contentInput.value = "Start writing here...";

  updatePreview();

  titleInput.focus();
});

// ==========================
// Live Preview
// ==========================

contentInput.addEventListener("input", updatePreview);

// ==========================
// Theme Toggle
// ==========================

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("dark-theme");

  const isDarkMode =
    document.body.classList.contains("dark-theme");

  localStorage.setItem(
    "theme",
    isDarkMode ? "dark" : "light"
  );
});

// ==========================
// Keyboard Shortcut
// Ctrl + N
// ==========================

document.addEventListener("keydown", (e) => {

  if (e.ctrlKey && e.key === "n") {

    e.preventDefault();

    titleInput.focus();
  }
});

// ==========================
// Initial Render
// ==========================

renderNotes();

updatePreview();