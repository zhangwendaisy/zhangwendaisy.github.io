/* Minimal, data-driven academic homepage. No external libraries. */
"use strict";

const $ = (id) => document.getElementById(id);
const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));
const safeUrl = (value) => {
  if (!value) return "";
  try {
    const parsed = new URL(String(value), document.baseURI);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : "";
  } catch { return ""; }
};
const scholarSearch = (title) => "https://scholar.google.com/scholar?q=" +
  encodeURIComponent('"' + title + '"');
const safeYear = (value) => {
  const number = Number(value);
  return Number.isInteger(number) && number >= 1900 && number <= 2100 ? number : null;
};
const yearDesc = (a, b) => (safeYear(b.year) || 0) - (safeYear(a.year) || 0);
const doiFromMetadata = (item) => {
  const raw = String(item.doi || "");
  if (/^10\.\d{4,9}\/\S+/i.test(raw)) return raw;
  const m = String(item.publication || "").match(/(?:DOI\s*:\s*)(10\.\d{4,9}\/[\w.()/:;-]+)/i);
  return m ? m[1].replace(/[.,;]+$/, "") : "";
};
const emphasizeAuthor = (value) => {
  const escaped = escapeHTML(value);
  return escaped.replace(
    /张文|(?<![A-Za-z])(?:Wen\s+Zhang|Zhang\s*,?\s+Wen)(?![A-Za-z])/gi,
    (match) => `<strong class="person-highlight">${match}</strong>`
  );
};
function linkHTML(text, href) {
  const target = safeUrl(href);
  return target ? `<a href="${escapeHTML(target)}" target="_blank" rel="noopener noreferrer">${escapeHTML(text)}</a>` : "";
}
function renderProfile(profile) {
  const en = profile.name_en || "Zhang Wen";
  const zh = profile.name_zh || "";
  $("person-name").innerHTML = escapeHTML(en) +
    (zh ? ` <span class="native-name">(${escapeHTML(zh)})</span>` : "");
  $("affiliation").textContent = profile.institution_en || profile.institution || "";
  $("department").textContent = profile.department_en || profile.department || "";
  const bio = profile.biography_en || "";
  $("biography").textContent = bio;
  $("biography").hidden = !bio;

  const interests = profile.research_interests_en || profile.research_interests || [];
  $("interest-list").replaceChildren();
  for (const interest of interests) {
    const li = document.createElement("li");
    li.textContent = interest;
    $("interest-list").append(li);
  }
  const contact = $("contact-links");
  contact.replaceChildren();
  const contacts = [];
  if (profile.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
    contacts.push(["Email", "mailto:" + profile.email]);
  }
  if (profile.orcid && /^(\d{4}-){3}[\dX]{4}$/i.test(profile.orcid)) {
    contacts.push(["ORCID", "https://orcid.org/" + profile.orcid]);
  }
  if (safeUrl(profile.scholar_url)) {
    contacts.push(["Google Scholar", profile.scholar_url]);
  }
  if (safeUrl(profile.website_url)) {
    contacts.push(["Website", profile.website_url]);
  }
  contacts.forEach(([text, href], i) => {
    if (i) contact.append(document.createTextNode("  |  "));
    const a = document.createElement("a"); a.textContent = text; a.href = href;
    if (!href.startsWith("mailto:")) {
      a.target = "_blank"; a.rel = "noopener noreferrer";
    }
    contact.append(a);
  });
  contact.hidden = contacts.length === 0;
}
function paperHTML(paper) {
  const doi = doiFromMetadata(paper);
  const url = safeUrl(paper.url);
  let links = "";
  if (doi) links += linkHTML("DOI", `https://doi.org/${doi}`);
  if (url && !url.startsWith("https://doi.org/")) {
    links += (links ? " &nbsp; " : "") + linkHTML("Link", url);
  }
  links += (links ? " &nbsp; " : "") + linkHTML("Search", scholarSearch(paper.title));
  const date = safeYear(paper.year);
  const citation = paper.publication ? `<p class="publication-venue">${escapeHTML(paper.publication)}</p>` : "";
  return `<li>
    <p class="publication-title">${escapeHTML(paper.title || "Untitled")}${date ? ` <span class="publication-year">(${date})</span>` : ""}</p>
    ${paper.authors ? `<p class="publication-authors">${emphasizeAuthor(paper.authors)}</p>` : ""}
    ${citation}
    <p class="publication-actions">${links}</p>
  </li>`;
}
function genericHTML(item, section) {
  const title = escapeHTML(item.title || item.name || item.role || "Untitled");
  const date = safeYear(item.year);
  const name = item.authors || "";
  const publication = item.publisher || item.publication || item.organization || item.competition || "";
  const award = item.award || "";
  const period = item.period || "";
  let out = `<li><p class="publication-title">${title}${date ? ` <span class="publication-year">(${date})</span>` : ""}</p>`;
  if (name && section === "books") out += `<p class="publication-authors">${emphasizeAuthor(name)}</p>`;
  if (publication || award || period) {
    out += `<p class="publication-venue">${[publication, award, period].filter(Boolean).map(escapeHTML).join(" · ")}</p>`;
  }
  if (item.url && safeUrl(item.url)) out += `<p class="publication-actions">${linkHTML("Link", item.url)}</p>`;
  if (item.description) out += `<p class="publication-venue">${escapeHTML(item.description)}</p>`;
  return out + "</li>";
}
function drawEntries(entries, elementId, emptyId, type) {
  const output = $(elementId);
  const data = Array.isArray(entries) ? [...entries] : [];
  data.sort(yearDesc); // Stable for equal years; recent entries first.
  output.innerHTML = data.map(item => type === "paper" ? paperHTML(item) : genericHTML(item, type)).join("");
  $(emptyId).hidden = data.length !== 0;
}
async function readJSON(path) {
  const response = await fetch(path, {cache: "no-store"});
  if (!response.ok) throw Error("Could not load " + path);
  return response.json();
}
async function main() {
  try {
    const [profile, works, academic] = await Promise.all([
      readJSON("./data/profile.json"),
      readJSON("./data/works.json"),
      readJSON("./data/academic.json")
    ]);
    renderProfile(profile);
    if (!Array.isArray(works)) throw Error("Invalid publications format.");
    const journals = works.filter((w) => w.type === "期刊论文");
    const conferences = works.filter((w) => w.type === "会议论文");
    $("journal-count").textContent = `(${journals.length})`;
    $("conference-count").textContent = `(${conferences.length})`;
    drawEntries(journals, "journal-list", "journal-empty", "paper");
    drawEntries(conferences, "conference-list", "conference-empty", "paper");
    drawEntries(academic.books || [], "book-list", "book-empty", "books");
    drawEntries(academic.awards || [], "award-list", "award-empty", "awards");
    drawEntries(academic.services || [], "service-list", "service-empty", "services");
  } catch (error) {
    console.error("Academic homepage: ", error);
    $("journal-count").textContent = "";
    $("conference-count").textContent = "";
    $("journal-empty").hidden = false;
    $("journal-empty").textContent = "Publication data could not be loaded. Check data/works.json and data/academic.json.";
  }
}
document.addEventListener("DOMContentLoaded", main);
