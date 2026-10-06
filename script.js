const newEntryBtn = document.querySelector(".new-entry-btn");
const board = document.querySelector(".main");
const emptyState = document.querySelector(".lone");
const userNameInput = document.getElementById("user-name");

const saveIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>`;
const trashIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>`;

// Click event listener
newEntryBtn.addEventListener("click", function () {
    addNote();
});

// Show or hide the "nothing here yet" message
const updateEmptyState = () => {
    const hasNotes = board.children.length > 0;
    emptyState.classList.toggle("is-hidden", hasNotes);
};

// Save button function
const saveNotes = () => {
    const notes = document.querySelectorAll(".note .content");
    const titles = document.querySelectorAll(".note .title");

    const data = [];

    notes.forEach((note, index) => {
        const content = note.value.trim();
        const title = titles[index].value.trim();
        if (content !== "") {
            data.push({ title, content });
        }
    });

    localStorage.setItem("titles", JSON.stringify(data.map((item) => item.title)));
    localStorage.setItem("notes", JSON.stringify(data.map((item) => item.content)));
};

// Add note button function
const addNote = (text = "", title = "") => {
    const note = document.createElement("div");
    note.classList.add("note");
    note.innerHTML = `
    <div class="icons">
        <button class="icon-btn save" type="button" aria-label="Save entry">${saveIcon}</button>
        <button class="icon-btn trash" type="button" aria-label="Delete entry">${trashIcon}</button>
    </div>
    <div class="title-div">
        <textarea class="title" placeholder="Untitled"></textarea>
    </div>
    <textarea class="content" placeholder="Write down your thoughts…"></textarea>
    `;

    // Set values via JS (avoids stray whitespace from template indentation)
    note.querySelector(".title").value = title;
    note.querySelector(".content").value = text;

    function handleTrashClick() {
        note.remove();
        saveNotes();
        updateEmptyState();
    }
    function handleSaveClick() {
        saveNotes();
    }

    note.querySelector(".trash").addEventListener("click", handleTrashClick);
    note.querySelector(".save").addEventListener("click", handleSaveClick);

    board.appendChild(note);
    updateEmptyState();
    saveNotes();

    if (text === "" && title === "") {
        note.querySelector(".title").focus();
    }
};

// Loading all the notes saved in localStorage
function loadNotes() {
    const titlesData = JSON.parse(localStorage.getItem("titles")) || [];
    const contentData = JSON.parse(localStorage.getItem("notes")) || [];

    for (let i = 0; i < Math.max(titlesData.length, contentData.length); i++) {
        addNote(contentData[i] || "", titlesData[i] || "");
    }
    updateEmptyState();
}

loadNotes();
