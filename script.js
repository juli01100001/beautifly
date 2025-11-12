function unminify() {
  const code = document.getElementById("input").value;
  let out = "", indent = 0, inString = false, strChar = "", last = "";
  for (let i = 0; i < code.length; i++) {
    const c = code[i];
    if ((c === '"' || c === "'" || c === "`") && last !== "\\" && !inString) { inString = true; strChar = c; }
    else if (inString && c === strChar && last !== "\\") inString = false;
    out += c;
    if (!inString) {
      if (c === "{") { out += "\n" + "  ".repeat(++indent); }
      else if (c === "}") { out = out.trimEnd() + "\n" + "  ".repeat(--indent) + "}"; }
      else if (c === ";") { out += "\n" + "  ".repeat(indent); }
      else if (c === ",") { out += "\n" + "  ".repeat(indent); }
      else if (c === "\n") { out += "  ".repeat(indent); }
    }
    last = c;
  }
  document.getElementById("output").value = out.replace(/\n\s*\n+/g, "\n").trim();
}