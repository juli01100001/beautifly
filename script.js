function unminify(code) {
  let out = "", indent = 0, inString = false, s = "", last = "";
  for (let i = 0; i < code.length; i++) {
    const c = code[i];
    if ((c === '"' || c === "'" || c === "`") && last !== "\\" && !inString) { inString = true; s = c; }
    else if (inString && c === s && last !== "\\") inString = false;
    out += c;
    if (!inString) {
      if (c === "{") out += "\n" + "  ".repeat(++indent);
      else if (c === "}") out = out.trimEnd() + "\n" + "  ".repeat(--indent) + "}";
      else if (c === ";" || c === ",") out += "\n" + "  ".repeat(indent);
      else if (c === "\n") out += "  ".repeat(indent);
    }
    last = c;
  }
  return out.replace(/\n\s*\n+/g, "\n").trim();
}

function highlight(code) {
  code = code
    .replace(/"(.*?)"|\'(.*?)\'|\`([\s\S]*?)\`/g, m => `<span class="str">${m}</span>`)
    .replace(/\b(\d+)\b/g, m => `<span class="num">${m}</span>`)
    .replace(/\b(await|break|case|catch|const|continue|default|delete|do|else|export|for|from|function|if|import|let|new|return|switch|throw|try|var|while|yield)\b/g,
             m => `<span class="kw">${m}</span>`)
    .replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, m => `<span class="func">${m}</span>`)
    .replace(/\bhttps?:\/\/[^\s"']+/g, m => `<span class="url">${m}</span>`)
    .replace(/\b(api[_-]?key|secret|token|auth|bearer|passwd|pwd|session)\b/gi,
             m => `<span class="sus">${m}</span>`);
  return code;
}

const ed = document.getElementById("editor");

function process() {
  let raw = ed.innerText;
  let pretty = unminify(raw);
  ed.innerHTML = highlight(pretty);
}

ed.addEventListener("input", process);

ed.addEventListener("dragover", e => e.preventDefault());
ed.addEventListener("drop", e => {
  e.preventDefault();
  const f = e.dataTransfer.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = ev => {
    ed.innerText = ev.target.result;
    process();
  };
  r.readAsText(f);
});

document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
  const b = document.getElementById("themeToggle");
  b.textContent = document.body.classList.contains("dark") ? "🌙" : "☀️";
};
