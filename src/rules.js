export const rules = [
  {
    id: "secret",
    severity: "high",
    title: "Possible secret or credential",
    pattern: /(sk-[A-Za-z0-9_-]{16,}|AKIA[0-9A-Z]{16}|(?:api[_ -]?key|token|password)\s*[:=]\s*[^\s<]{8,})/i,
    advice: "Remove credentials from the file, rotate exposed values, and reference environment variables instead."
  },
  {
    id: "destructive-command",
    severity: "high",
    title: "Potentially destructive command",
    pattern: /\b(rm\s+-rf|git\s+reset\s+--hard|git\s+clean\s+-[a-z]*f|drop\s+(table|database)|mkfs\b)/i,
    advice: "Require confirmation, scope the target precisely, and document a recovery path before running this command."
  },
  {
    id: "remote-pipe",
    severity: "high",
    title: "Remote script piped to a shell",
    pattern: /\b(curl|wget)\b[^\n|]*\|\s*(ba)?sh\b/i,
    advice: "Pin and inspect the downloaded script instead of piping network output directly into a shell."
  },
  {
    id: "broad-permissions",
    severity: "medium",
    title: "Overly broad file permissions",
    pattern: /\bchmod\s+(777|666)\b/i,
    advice: "Use the narrowest permissions required for the task."
  },
  {
    id: "prompt-injection",
    severity: "medium",
    title: "Prompt-injection-like instruction",
    pattern: /\b(ignore|disregard|forget)\b.{0,60}\b(previous|prior|system|developer)\b.{0,60}\b(instruction|prompt|rule)/i,
    advice: "Treat copied instructions as untrusted data and keep project rules explicit and reviewable."
  }
];

export function scanText(text) {
  const findings = [];
  const lines = text.split(/\r?\n/);

  for (const [index, line] of lines.entries()) {
    for (const rule of rules) {
      if (rule.pattern.test(line)) {
        findings.push({
          rule: rule.id,
          severity: rule.severity,
          title: rule.title,
          advice: rule.advice,
          line: index + 1,
          excerpt: line.trim().slice(0, 180)
        });
      }
    }
  }
  return findings;
}
