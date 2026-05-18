import { fetchNotes } from "./api.js";
async function initializeApp() {

  const loadingState =
    document.querySelector(".loading-state");

  try {

    loadingState.classList.remove("hidden");

    notes = await fetchNotes();

    renderNotes();

  } catch (error) {

    console.error(error);

  } finally {

    loadingState.classList.add("hidden");
  }
}
initializeApp();