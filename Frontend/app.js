let parent = document.querySelector("#main");
let button = document.querySelector("#add");
let container = document.querySelector("#container");
let searchInput = document.querySelector("#search");
 
button.addEventListener("click", function () {
  container.remove();
  add();
});
 
function add() {
  if (document.querySelector("#container") === null) {
    let header = document.querySelector("#header");
    header.innerHTML = "Add";
 
    let container = document.createElement('div');
    container.setAttribute("id", "container");
 
    let title = document.createElement("h2");
    title.innerHTML = "Geben Sie hier den Titel für diese Notiz ein.";
    let title_input = document.createElement("input");
    title_input.setAttribute("type", "text");
 
    let text_input = document.createElement("h2");
    text_input.innerHTML = "Geben Sie hier den Text für diese Notiz ein.";
    let input = document.createElement("input");
    input.setAttribute("type", "text");
 
    let button = document.createElement("button");
    button.innerHTML = "Add";
    button.setAttribute("id", "button");
 
    container.appendChild(title);
    container.appendChild(title_input);
    container.appendChild(text_input);
    container.appendChild(input);
    container.appendChild(button);
 
    let parent = document.querySelector("#main");
    parent.appendChild(container);
 
    button.addEventListener("click", function () {
      let newNote = {
        title: title_input.value,
        mainText: input.value
      };
      if (newNote.title && newNote.mainText) {
        addNoteToDatabase(newNote);
      }
      container.remove();
      home();
    });
 
  } else {
    let container = document.querySelector("#container");
    container.remove();
    add();
  }
}
 
function home() {
  let header = document.querySelector("#header");
  header.innerHTML = "Notitzwebseite";
  let container = document.createElement('div');
  container.setAttribute("id", "container");
  let top = document.createElement("div");
  top.setAttribute("id", "top");
  let input = document.createElement("input");
  input.setAttribute("id", "search");
  let button = document.createElement("button");
  button.innerHTML = "Add";
  button.setAttribute("id", "add");
  let notes = document.createElement("div");
  notes.setAttribute("id", "note");
  top.appendChild(input);
  top.appendChild(button);
  container.appendChild(top);
  container.appendChild(notes);
  parent.appendChild(container);
  fetchAndDisplayNotes();  // Initiales Laden der Notizen
  button.addEventListener("click", function () {
    container.remove();
    add();
  });
}
 
async function fetchAndDisplayNotes(query = "") {
  try {
    const response = await fetch('http://localhost:3000/notes?search=' + query, {
      mode: 'cors'
    });
 
    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Daten');
    }
 
    const notes = await response.json();
    let notesContainer = document.querySelector("#note");
    notesContainer.innerHTML = ""; // Clear the notes container
 
    // Notizen anzeigen
    notes.forEach(note => {
      let noteDiv = document.createElement("div");
      noteDiv.className = "note";
 
      let title = document.createElement("h2");
      title.textContent = note.title;
 
      let mainText = document.createElement("p");
      mainText.textContent = note.mainText;
       let buttonD = document.createElement("button");
      buttonD.setAttribute("id", "delet");
      buttonD.innerHTML = "Delet";

      let buttonE = document.createElement("button");
      buttonE.setAttribute("id", "edit")
      buttonE.innerHTML = "Edit";

      buttonD.addEventListener("click", function () {
        container.remove();
        home();
      });

      buttonE.addEventListener("click", function () {
        container.remove();
        edit();
      });


      // Elemente hinzufügen
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
 
function searchNotes() {
  const query = searchInput.value;
  fetchAndDisplayNotes(query); // Mit Suchbegriff die Notizen filtern
}
 
async function addNoteToDatabase(note) {
  try {
    const response = await fetch('http://localhost:3000/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note)
    });
    if (response.ok) {
      console.log("Notiz hinzugefügt");
      searchNotes;
    } else {
      console.error("Fehler beim Hinzufügen der Notiz");
    }
  } catch (error) {
    console.error("Fehler:", error);
  }
}

function edit(){
    if(document.querySelector("#container") === null){
      let header = document.querySelector("#header");
      header.innerHTML = "Edit";

      let container = document.createElement('div');
      container.setAttribute("id", "container");

      let title = document.createElement("h2");
      title.innerHTML = "Titel";
      let title_input = document.createElement("input");
      title_input.setAttribute("type", "text");

      let text_input = document.createElement("h2");
      text_input.innerHTML = "Titel";
      let input = document.createElement("input");
      input.setAttribute("type", "text");

      let button = document.createElement("button");
      button.innerHTML = "Edit";
      button.setAttribute("id", "button");

      container.appendChild(title);
      container.appendChild(title_input);
      container.appendChild(text_input);
      container.appendChild(input);
      container.appendChild(button);

      let parent = document.querySelector("#main");
      parent.appendChild(container);

      button.addEventListener("click", function () {
          container.remove();
          home();
      });

  }else{
      let container = document.querySelector("#container")
      container.remove();
      edit();
  }
  }

  