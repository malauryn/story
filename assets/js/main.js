// main.js

console.log("Hello, World!");

let STORY = null;
let currentId = "start";

const imgEl = document.getElementById("storyImage");
const textEl = document.getElementById("storyText");
const choicesEl = document.getElementById("choices");

function renderNode(id) {
  currentId = id;
  const node = STORY[id];

  if (!node) {
    textEl.textContent = `Missing story node: "${id}"`;
    imgEl.src = "";
    choicesEl.innerHTML = "";
    return;
  }

  // Image
  imgEl.src = node.image || "";
  imgEl.alt = node.alt || "Story image";

  // Text (support line breaks)
  textEl.innerHTML = (node.text || "").replaceAll("\n", "<br>");

  // Choices (buttons)
  choicesEl.innerHTML = "";
  (node.choices || []).forEach(choice => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-outline-dark"; // Bootstrap styling
    btn.textContent = choice.label;

    btn.addEventListener("click", () => renderNode(choice.next));
    choicesEl.appendChild(btn);
  });
}

async function init() {
  const res = await fetch("story.json");
  STORY = await res.json();
  renderNode("start");
}

init();