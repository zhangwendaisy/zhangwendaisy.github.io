/* Academic homepage renderer with book-cover support and classic section layout. */
"use strict";

const $ = (id) => document.getElementById(id);
const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));
const safeUrl = (value) => {
  if (!value) return "";
  if (String(value).startsWith("data:image/")) return String(value);
  try {
    const parsed = new URL(String(value), document.baseURI);
    return ["http:", "https:", "file:"].includes(parsed.protocol) ? parsed.href : "";
  } catch { return ""; }
};
const scholarSearch = (title) => "https://scholar.google.com/scholar?q=" + encodeURIComponent('"' + title + '"');
const safeYear = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1900 && n <= 2100 ? n : null;
};
const yearDesc = (a, b) => (safeYear(b.year) || 0) - (safeYear(a.year) || 0) || String(a.title||"").localeCompare(String(b.title||""), "en");
const emphasizeAuthor = (value) => escapeHTML(value).replace(
  /张文|(?<![A-Za-z])(?:Wen\s+Zhang|Zhang\s*,?\s+Wen)(?![A-Za-z])/gi,
  (match) => `<span class="person-highlight">${match}</span>`
);
const doiFromMetadata = (item) => {
  const raw = String(item.doi || "");
  if (/^10\.\d{4,9}\/\S+/i.test(raw)) return raw;
  const m = String(item.publication || "").match(/(?:DOI\s*:\s*)(10\.\d{4,9}\/[\w.()/:;-]+)/i);
  return m ? m[1].replace(/[.,;]+$/, "") : "";
};

function setProfile(profile){
  const en = profile.name_en || "Zhang Wen";
  const zh = profile.name_zh ? ` <span class="native-name">(${escapeHTML(profile.name_zh)})</span>` : "";
  $("person-name").innerHTML = `${escapeHTML(en)}${zh}`;
  $("title-line").textContent = profile.title ? String(profile.title) : "";
  $("title-line").hidden = !profile.title;
  $("affiliation").textContent = profile.institution_en || profile.institution || "";
  $("department").textContent = profile.department_en || profile.department || "";
  $("biography").textContent = profile.biography_en || "";
  $("biography").hidden = !(profile.biography_en || "").trim();

  const email = profile.email || "zhangwen06@nudt.edu.cn";
  $("email-link").textContent = email;
  $("email-link").href = "mailto:" + email;

  const photo = safeUrl(profile.photo_url) || "./assets/profile-placeholder.svg";
  $("profile-photo").src = photo;

  const links = [];
  if (profile.website_url && safeUrl(profile.website_url)) links.push(["Website", profile.website_url]);
  if (profile.scholar_url && safeUrl(profile.scholar_url)) links.push(["Google Scholar", profile.scholar_url]);
  if (profile.orcid && /^(\d{4}-){3}[\dX]{4}$/i.test(profile.orcid)) links.push(["ORCID", "https://orcid.org/" + profile.orcid]);
  const line = $("links-line");
  line.innerHTML = links.map(([t,u]) => `<a href="${escapeHTML(safeUrl(u))}" target="_blank" rel="noopener noreferrer">${escapeHTML(t)}</a>`).join("");
  line.hidden = links.length === 0;

  const interests = profile.research_interests_en || profile.research_interests || [];
  $("interest-list").innerHTML = interests.map((x) => `<li>${escapeHTML(x)}</li>`).join("");
}

function renderPaper(item){
  const year = safeYear(item.year);
  const doi = doiFromMetadata(item);
  const url = safeUrl(item.url);
  const links = [];
  if (doi) links.push(`<a href="https://doi.org/${escapeHTML(doi)}" target="_blank" rel="noopener noreferrer">DOI</a>`);
  if (url && !String(url).includes("doi.org/")) links.push(`<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">Link</a>`);
  links.push(`<a href="${escapeHTML(scholarSearch(item.title || ""))}" target="_blank" rel="noopener noreferrer">Search</a>`);
  return `<li>
    <div class="publication-title">${escapeHTML(item.title || "Untitled")}${year ? ` <span class="publication-year">(${year})</span>` : ""}</div>
    ${item.authors ? `<div class="publication-authors">${emphasizeAuthor(item.authors)}</div>` : ""}
    ${item.publication ? `<div class="publication-venue">${escapeHTML(item.publication)}</div>` : ""}
    <div class="publication-actions">${links.join("")}</div>
  </li>`;
}

function renderBookCards(books){
  if (!books.length) { $("book-grid").innerHTML = ""; return; }
  $("book-grid").innerHTML = books.map((book) => {
    const img = safeUrl(book.image_url) || "./assets/book-placeholder.svg";
    const year = safeYear(book.year);
    return `<div class="book-card">
      <div class="book-cover-wrap">
        <img class="book-cover" src="${escapeHTML(img)}" alt="${escapeHTML(book.title || 'Book cover')}">
      </div>
      <div class="book-year">${year || ""}</div>
      <div class="book-title">${escapeHTML(book.title || "Untitled")}</div>
    </div>`;
  }).join("");
}
function renderBookDetails(books){
  const list = $("book-list");
  if (!books.length){
    list.innerHTML = "";
    $("book-empty").hidden = false;
    return;
  }
  $("book-empty").hidden = true;
  list.innerHTML = books.map((book) => {
    const parts = [];
    if (book.authors) parts.push(emphasizeAuthor(book.authors));
    if (book.publisher || book.publication) parts.push(escapeHTML(book.publisher || book.publication));
    if (safeYear(book.year)) parts.push(escapeHTML(book.year));
    const links = [];
    if (book.url && safeUrl(book.url)) links.push(`<a href="${escapeHTML(safeUrl(book.url))}" target="_blank" rel="noopener noreferrer">Link</a>`);
    return `<li>
      <span class="publication-title">${escapeHTML(book.title || "Untitled")}</span>
      ${parts.length ? `<div class="publication-venue">${parts.join(", ")}</div>` : ""}
      ${links.length ? `<div class="publication-actions">${links.join("")}</div>` : ""}
    </li>`;
  }).join("");
  renderBookCards(books);
}

function renderAwards(awards){
  const list = $("award-list");
  if (!awards.length){
    list.innerHTML = "";
    $("award-empty").hidden = false;
    return;
  }
  $("award-empty").hidden = true;
  list.innerHTML = awards.map((a) => {
    const year = safeYear(a.year);
    const meta = [a.competition || a.publication, a.award, a.organization].filter(Boolean).map(escapeHTML).join(" · ");
    return `<li>
      <div class="publication-title">${escapeHTML(a.title || a.name || "Award")}${year ? ` <span class="publication-year">(${year})</span>` : ""}</div>
      ${meta ? `<div class="publication-venue">${meta}</div>` : ""}
      ${a.description ? `<div class="publication-venue">${escapeHTML(a.description)}</div>` : ""}
      ${a.url && safeUrl(a.url) ? `<div class="publication-actions"><a href="${escapeHTML(safeUrl(a.url))}" target="_blank" rel="noopener noreferrer">Link</a></div>` : ""}
    </li>`;
  }).join("");
}
function renderServices(services){
  const list = $("service-list");
  if (!services.length){
    list.innerHTML = "";
    $("service-empty").hidden = false;
    return;
  }
  $("service-empty").hidden = true;
  list.innerHTML = services.map((s) => {
    const year = safeYear(s.year);
    const meta = [s.organization || s.publication, s.period].filter(Boolean).map(escapeHTML).join(" · ");
    return `<li>
      <div class="publication-title">${escapeHTML(s.title || s.role || "Academic service")}${year ? ` <span class="publication-year">(${year})</span>` : ""}</div>
      ${meta ? `<div class="publication-venue">${meta}</div>` : ""}
      ${s.description ? `<div class="publication-venue">${escapeHTML(s.description)}</div>` : ""}
      ${s.url && safeUrl(s.url) ? `<div class="publication-actions"><a href="${escapeHTML(safeUrl(s.url))}" target="_blank" rel="noopener noreferrer">Link</a></div>` : ""}
    </li>`;
  }).join("");
}
function fillPaperSection(records, typeName, listId, emptyId, countId){
  const subset = records.filter((x) => x.type === typeName).sort(yearDesc);
  $(countId).textContent = `(${subset.length})`;
  $(listId).innerHTML = subset.map(renderPaper).join("");
  $(emptyId).hidden = subset.length !== 0;
}
async function readJSON(path){
  const response = await fetch(path, {cache:"no-store"});
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}
async function boot(){
  try{
    const [profile, works, academic] = await Promise.all([
      readJSON("./data/profile.json"),
      readJSON("./data/works.json"),
      readJSON("./data/academic.json")
    ]);
    setProfile(profile);
    fillPaperSection(works, "期刊论文", "journal-list", "journal-empty", "journal-count");
    fillPaperSection(works, "会议论文", "conference-list", "conference-empty", "conference-count");
    renderBookDetails((academic.books || []).sort(yearDesc));
    renderAwards((academic.awards || []).sort(yearDesc));
    renderServices((academic.services || []).sort(yearDesc));
  }catch(error){
    console.error(error);
    $("journal-empty").hidden = false;
    $("journal-empty").textContent = "Publication data could not be loaded. Please check the data files.";
  }
}
document.addEventListener("DOMContentLoaded", boot);
