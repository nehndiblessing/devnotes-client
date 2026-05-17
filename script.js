// ==========================
// Load Saved Theme
// ==========================

const savedTheme =
  localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-theme");
}


// ==========================
// State
// ==========================

let notes =
  JSON.parse(localStorage.getItem("notes")) || [];


// ==========================
// DOM Elements
// ==========================

const notesGrid =
  document.getElementById("notesGrid");

const noteForm =
  document.querySelector(".note-form");

const titleInput =
  document.getElementById("titleInput");

const contentInput =
  document.getElementById("contentInput");

const searchInput =
  document.querySelector(".search-input");

const newNoteBtn =
  document.querySelector(".new-note-btn");

const themeToggle =
  document.querySelector(".theme-toggle");

const previewContent =
  document.querySelector(".preview-content");


// ==========================
// Save Notes
// ==========================

function saveNotes() {

  localStorage.setItem(
    "notes",
    JSON.stringify(notes)
  );
}


// ==========================
// Delete Note
// ==========================

function deleteNote(id) {

  notes = notes.filter(
    (note) => note.id !== id
  );

  saveNotes();

  renderNotes(searchInput.value);
}


// ==========================
// Edit Note
// ==========================

function editNote(id) {

  const noteToEdit = notes.find(
    (note) => note.id === id
  );

  if (!noteToEdit) return;

  titleInput.value =
    noteToEdit.title;

  contentInput.value =
    noteToEdit.content;

  updatePreview();

  notes = notes.filter(
    (note) => note.id !== id
  );

  saveNotes();

  renderNotes(searchInput.value);
}


// ==========================
// Update Live Preview
// ==========================

function updatePreview() {

  const content =
    contentInput.value.trim();

  if (content === "") {

    previewContent.textContent =
      "Start typing to preview...";

    return;
  }

  previewContent.textContent =
    content;
}


// ==========================
// Render Notes
// ==========================

function renderNotes(searchTerm = "") {

  notesGrid.innerHTML = "";

  const filteredNotes = notes.filter((note) => {

    return (
      note.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      note.content
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });


  // Empty State

  if (filteredNotes.length === 0) {

    notesGrid.innerHTML = `
      <div class="empty-state">
        <h2>No Notes Found</h2>

        <p>
          Try creating a new note.
        </p>
      </div>
    `;

    return;
  }


  // Render Notes

  filteredNotes.forEach((note) => {

    const noteCard =
      document.createElement("article");

    noteCard.classList.add("note-card");

    noteCard.innerHTML = `
      <h2>${note.title}</h2>

      <p>${note.content}</p>

      <div class="note-actions">

        <button
          class="edit-btn"
          type="button"
        >
          Edit
        </button>

        <button
          class="delete-btn"
          type="button"
        >
          Delete
        </button>

      </div>
    `;


    // Delete Button

    const deleteBtn =
      noteCard.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", () => {
      deleteNote(note.id);
    });


    // Edit Button

    const editBtn =
      noteCard.querySelector(".edit-btn");

    editBtn.addEventListener("click", () => {
      editNote(note.id);
    });


    notesGrid.appendChild(noteCard);
  });
}


// ==========================
// Add Note
// ==========================

noteForm.addEventListener("submit", (e) => {

  e.preventDefault();

  const title =
    titleInput.value.trim();

  const content =
    contentInput.value.trim();


  // Prevent Empty Notes

  if (!title || !content) {
    return;
  }

  const newNote = {
    id: Date.now(),

    title,

    content
  };

  notes.push(newNote);

  saveNotes();

  renderNotes(searchInput.value);

  noteForm.reset();

  updatePreview();
});


// ==========================
// Search Notes
// ==========================

searchInput.addEventListener("input", (e) => {

  renderNotes(e.target.value);
});


// ==========================
// Quick New Note
// ==========================

newNoteBtn.addEventListener("click", () => {

  titleInput.value =
    "New Note";

  contentInput.value =
    "Start writing here...";

  updatePreview();

  titleInput.focus();
});


// ==========================
// Live Preview
// ==========================

contentInput.addEventListener("input", () => {

  updatePreview();
});


// ==========================
// Theme Toggle
// ==========================

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle(
    "dark-theme"
  );

  const isDarkMode =
    document.body.classList.contains(
      "dark-theme"
    );

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