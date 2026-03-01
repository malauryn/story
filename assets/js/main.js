let STORY = null;

const imgEl = document.getElementById("storyImage");
const textEl = document.getElementById("storyText");
const choicesEl = document.getElementById("choices");
const errorEl = document.getElementById("errorBox");

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.classList.remove("d-none");
}

function clearError() {
  errorEl.textContent = "";
  errorEl.classList.add("d-none");
}

function renderNode(id) {
  const node = STORY?.[id];

  if (!node) {
    showError(`Missing story node: "${id}". Check your story.json keys and choice.next values.`);
    return;
  }

  clearError();

  imgEl.src = node.image || "";
  imgEl.alt = node.alt || "Story image";

  // Convert \n into <br> for readable paragraphs
  textEl.innerHTML = (node.text || "").replaceAll("\n", "<br>");

  choicesEl.innerHTML = "";
  (node.choices || []).forEach(choice => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-outline-dark";
    btn.textContent = choice.label;

    btn.addEventListener("click", () => renderNode(choice.next));
    choicesEl.appendChild(btn);
  });
}

async function init() {
  try {
    if (!imgEl || !textEl || !choicesEl || !errorEl) {
      alert("Missing required HTML elements. Make sure ids are: storyImage, storyText, choices, errorBox.");
      return;
    }

    const res = await fetch("story.json", { cache: "no-store" });

    if (!res.ok) {
      showError(`Could not load story.json (HTTP ${res.status}). Make sure story.json is in the same folder as index.html.`);
      return;
    }

    STORY = await res.json();

    if (!STORY.start) {
      showError(`story.json loaded, but no "start" node found. Add a "start" key at the top level.`);
      return;
    }

    renderNode("start");
  } catch (err) {
    showError("JS error: " + err.message);
  }
}

init();