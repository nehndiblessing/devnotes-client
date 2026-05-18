export async function fetchNotes() {

  return new Promise((resolve) => {

    setTimeout(() => {

      const notes =
        JSON.parse(localStorage.getItem("notes"))
        || [];

      resolve(notes);

    }, 1000);
  });
}