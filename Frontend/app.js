// Base URL for backend API
const backendUrl = 'http://localhost:3000';

// Select elements
let button = document.querySelector("#add");
let searchInput = document.querySelector("#search");

// Event listener for "Add" button
button.addEventListener("click", function () {
  const container = document.querySelector("#container");
  if (container) container.remove();
  add();
});

function add() {
  const existingContainer = document.querySelector("#container");
  if (existingContainer !== null) {
    existingContainer.remove();
  }
  if (document.querySelector("#container") === null) {
    let header = document.querySelector("#header");
    header.innerHTML = "Add";

    let container = document.createElement('div');
    container.setAttribute("id", "container");

    let title = document.createElement("h2");
    title.innerHTML = "Geben Sie hier den Titel für diese Notiz ein.";
    let titleInput = document.createElement("input");
    titleInput.setAttribute("type", "text");

    let textInput = document.createElement("h2");
    textInput.innerHTML = "Geben Sie hier den Text für diese Notiz ein.";
    let input = document.createElement("input");
    input.setAttribute("type", "text");

    let button = document.createElement("button");
    button.innerHTML = "Add";
    button.setAttribute("id", "button");

    container.appendChild(title);
    container.appendChild(titleInput);
    container.appendChild(textInput);
    container.appendChild(input);
    container.appendChild(button);

    let parent = document.querySelector("#main");
    parent.appendChild(container);

    button.addEventListener("click", async function () {
      const newNote = {
        title: titleInput.value,
        mainText: input.value,
      };
      await fetch(`${backendUrl}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote),
      });

      container.remove();
      home();
    });
  }
}

function home() {
  console.log("home() wird aufgerufen");

  let parent = document.querySelector("#main");

  // Clear previous content to prevent duplicates
  parent.innerHTML = "";

  let header = document.querySelector("#header");
  header.innerHTML = "Notizwebseite";

  let container = document.createElement("div");
  container.setAttribute("id", "container");

  let top = document.createElement("div");
  top.setAttribute("id", "top");

  let input = document.createElement("input");
  input.setAttribute("id", "search");
  input.setAttribute("placeholder", "Notizen durchsuchen...");

  let button = document.createElement("button");
  button.innerHTML = "Add";
  button.setAttribute("id", "add");

  let notes = document.createElement("div");
  notes.setAttribute("id", "note");

  // Append elements
  top.appendChild(input);
  top.appendChild(button);
  container.appendChild(top);
  container.appendChild(notes);
  parent.appendChild(container);

  // Event listener for "Add" button
  button.addEventListener("click", function () {
    container.remove();
    add();
  });

  // Display notes
  fetchAndDisplayNotes();
}

async function fetchAndDisplayNotes(query = "") {
  try {
    const response = await fetch(`${backendUrl}/notes`);

    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Daten');
    }

    const notes = await response.json();
    let notesContainer = document.querySelector("#note");
    notesContainer.innerHTML = ""; // Clear the notes container

    // Display notes
    notes.forEach(note => {
      let noteDiv = document.createElement("div");
      noteDiv.className = "note";

      let title = document.createElement("h2");
      title.textContent = note.title;

      let mainText = document.createElement("p");
      mainText.textContent = note.mainText;

      let buttonD = document.createElement("button");
      buttonD.innerHTML = "Delete";

      let buttonE = document.createElement("button");
      buttonE.innerHTML = "Edit";

      // Event listener for delete
      buttonD.addEventListener("click", async function () {
        await deleteNoteFromDatabase(note._id);
        fetchAndDisplayNotes(); // Reload notes
      });

      // Event listener for edit
      buttonE.addEventListener("click", function () {
        editNote(note._id, note.title, note.mainText);
      });

      // Add elements
      noteDiv.appendChild(title);
      noteDiv.appendChild(mainText);
      noteDiv.appendChild(buttonE);
      noteDiv.appendChild(buttonD);
      notesContainer.appendChild(noteDiv);
    });
  } catch (error) {
    console.error("Fehler:", error);
  }
}

async function deleteNoteFromDatabase(noteId) {
  try {
    const response = await fetch(`${backendUrl}/notes/${noteId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      console.log("Notiz gelöscht");
    } else {
      console.error("Fehler beim Löschen der Notiz");
    }
  } catch (error) {
    console.error("Fehler:", error);
  }
}

function editNote(noteId, currentTitle, currentMainText) {
  const existingContainer = document.querySelector("#container");
  if (existingContainer !== null) {
    existingContainer.remove();
  }

  let header = document.querySelector("#header");
  header.innerHTML = "Edit";

  let container = document.createElement('div');
  container.setAttribute("id", "container");

  let title = document.createElement("h2");
  title.innerHTML = "Titel";
  let title_input = document.createElement("input");
  title_input.setAttribute("type", "text");
  title_input.value = currentTitle;

  let text_input = document.createElement("h2");
  text_input.innerHTML = "Text";
  let input = document.createElement("input");
  input.setAttribute("type", "text");
  input.value = currentMainText;

  let button = document.createElement("button");
  button.innerHTML = "Save";

  container.appendChild(title);
  container.appendChild(title_input);
  container.appendChild(text_input);
  container.appendChild(input);
  container.appendChild(button);

  let parent = document.querySelector("#main");
  parent.appendChild(container);

  button.addEventListener("click", async function () {
    const updatedNote = {
      title: title_input.value,
      mainText: input.value,
    };
    await updateNoteInDatabase(noteId, updatedNote);
    container.remove();
    home();
  });
}

async function updateNoteInDatabase(noteId, note) {
  try {
    const response = await fetch(`${backendUrl}/notes/${noteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note)
    });
    if (response.ok) {
      console.log("Notiz aktualisiert");
    } else {
      console.error("Fehler beim Aktualisieren der Notiz");
    }
  } catch (error) {
    console.error("Fehler:", error);
  }
}

// Initialize the app
window.onload = function () {
  fetchAndDisplayNotes();
};
