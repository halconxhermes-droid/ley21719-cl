/**
 * Mini renderizador de markdown (mismo alcance que el mockup: headings,
 * listas, negrita, código, párrafos) + resaltado de términos del glosario
 * como botones que abren el modal.
 */

function escapeHtml(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Convierte markdown simple a HTML seguro (entrada escapada). */
export function mdToHtml(md: string): string {
  const lines = escapeHtml(md).split("\n");
  const html: string[] = [];
  let inList = false;
  let inCode = false;
  const codeBuf: string[] = [];

  const flushList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };

  for (const raw of lines) {
    if (/^```/.test(raw.trim())) {
      if (inCode) {
        html.push(`<pre><code>${codeBuf.join("\n")}</code></pre>`);
        codeBuf.length = 0;
        inCode = false;
      } else {
        flushList();
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      codeBuf.push(raw);
      continue;
    }
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }
    // Negrita **text** (la entrada ya está escapada)
    const bolded = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    let m: RegExpMatchArray | null;
    if ((m = bolded.match(/^>\s*<strong>(.+?)<\/strong>\s*$/))) {
      flushList();
      html.push(`<blockquote class="reader-callout reader-callout-title"><strong>${m[1]}</strong></blockquote>`);
    } else if (bolded.startsWith("> ")) {
      flushList();
      html.push(`<blockquote class="reader-callout">${bolded.slice(2)}</blockquote>`);
    } else if ((m = bolded.match(/^(💡|⚠️|✅|📌)\s*(.+)$/))) {
      flushList();
      html.push(`<aside class="reader-highlight"><strong>${m[1]}</strong> ${m[2]}</aside>`);
    } else if ((m = bolded.match(/^(#{1,4})\s+(.*)$/))) {
      flushList();
      const lvl = Math.min(m[1].length + 1, 5); // # → h2 … #### → h5
      html.push(`<h${lvl}>${m[2]}</h${lvl}>`);
    } else if ((m = bolded.match(/^[-*]\s+(.*)$/))) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${m[1]}</li>`);
    } else {
      flushList();
      html.push(`<p>${bolded}</p>`);
    }
  }
  flushList();
  if (inCode && codeBuf.length) {
    html.push(`<pre><code>${codeBuf.join("\n")}</code></pre>`);
  }
  return html.join("\n");
}

/**
 * Envuelve las ocurrencias de los términos dados en botones term-link
 * que abren el modal del glosario. Opera sobre HTML ya generado.
 */
export function linkifyTerms(html: string, terms: string[]): string {
  const names = [...terms]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!names.length) return html;
  const re = new RegExp(`(${names.join("|")})(?![^<]*>)`, "gi");
  return html.replace(re, '<button type="button" class="term-link" data-term-name="$1">$1</button>');
}
