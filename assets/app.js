
"use strict";
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const escapeHTML = (s) => String(s ?? "").replace(/[&<>"']/g,(ch)=>(
  {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]
));
const safeUrl = (url) => {
  try {
    const u = new URL(String(url), document.baseURI);
    return ["https:","http:"].includes(u.protocol) ? u.href : "";
  } catch { return ""; }
};
const emphName = (text) => escapeHTML(text).replace(
  /张文|(?<![A-Za-z])(?:Wen\s+Zhang|Zhang[,\s]+Wen)(?![A-Za-z])/gi,
  (match)=> `<span class="name-highlight">${match}</span>`
);
const scholarlySearch = (title) =>
  "https://scholar.google.com/scholar?q=" + encodeURIComponent('"' + title + '"');
const patentsSearch = (record) =>
  "https://patents.google.com/?q=" + encodeURIComponent(record.application_no || record.title);

let works = [];
let activeType = "全部";
let limit = 9;
const countryLocale="zh-CN";

function setText(id,val) { const el=document.getElementById(id); if(el) el.textContent=val; }

function kindBadge(record) {
  return `<span class="badge-kind ${record.type==="专利"?"patent":""}">${escapeHTML(record.type)}</span>`;
}
function citationText(record) {
  if(record.type==="专利")
    return `${record.authors}. ${record.title}[P]. ${record.application_no || ""}.`;
  return `${record.authors}. ${record.title}${record.type==="会议论文"?"[C]":"[J]"}. ${record.publication||""}.`;
}
function recordHtml(record) {
  const isPatent=record.type==="专利";
  const title=escapeHTML(record.title);
  let url=record.url ? safeUrl(record.url) : "";
  if(!url && record.doi) url=safeUrl("https://doi.org/"+record.doi);
  const isDirect=!!url;
  if(!url) url=isPatent ? patentsSearch(record) : scholarlySearch(record.title);
  const primaryLabel=isDirect ? (record.doi ? "论文 DOI ↗" : "查看原始链接 ↗") : (isPatent ? "检索专利文献 ↗" : "按题名检索论文 ↗");
  const number = isPatent && record.application_no
    ? `<span>申请号：${escapeHTML(record.application_no)}</span>` : "";
  const publication = record.publication ?
    `<p class="work-meta">${escapeHTML(record.publication)} ${number}</p>` :
    `<p class="work-meta">${number}</p>`;
  const summary = record.description ?
    `<details class="work-summary"><summary>研究内容与主要贡献</summary><p>${escapeHTML(record.description)}</p></details>`:"";
  return `<article class="work-card">
    <div class="work-top">${kindBadge(record)}<span class="work-year">${record.year ?? "年份待核"}</span></div>
    <h3 class="work-title">${title}</h3>
    <p class="work-authors">${emphName(record.authors || "作者待补充")}</p>
    ${publication}
    ${summary}
    <div class="work-bottom">
      <a class="work-link" target="_blank" rel="noopener noreferrer" href="${escapeHTML(url)}">${primaryLabel}</a>
      <button class="copy-btn" type="button" data-copy="${escapeHTML(record.id)}" aria-label="复制文献引用">复制引用</button>
      <span class="work-tag">${escapeHTML(record.category||"未分类")}</span>
    </div>
  </article>`;
}
function selectedWorks() {
  const year=$("#year-filter").value;
  const cat=$("#category-filter").value;
  const term=$("#search").value.trim().toLocaleLowerCase(countryLocale);
  return works.filter((record) => {
    if(activeType!=="全部" && record.type!==activeType) return false;
    if(year!=="全部" && String(record.year)!==year) return false;
    if(cat!=="全部" && record.category!==cat) return false;
    if(term && ![record.title,record.authors,record.category,record.publication,
        record.application_no,record.description].join(" ").toLocaleLowerCase(countryLocale).includes(term))return false;
    return true;
  });
}
function render() {
  const result=selectedWorks();
  setText("result-count",`当前显示 ${Math.min(limit,result.length)} / ${result.length} 项`);
  $("#works-list").innerHTML=result.length
    ? result.slice(0,limit).map(recordHtml).join("")
    : '<div class="empty">没有找到匹配的成果。可以尝试更换关键词或筛选条件。</div>';
  $("#load-more").hidden=limit>=result.length;
  $("#works-list").querySelectorAll("[data-copy]").forEach((btn)=>btn.addEventListener("click",async()=>{
    const work=works.find(w=>w.id===btn.dataset.copy);
    if(!work)return;
    const txt=citationText(work);
    try{
      if(!navigator.clipboard)throw Error("clipboard unavailable");
      await navigator.clipboard.writeText(txt);
      btn.textContent="已复制 ✓";
    }catch{
      const t=document.createElement("textarea");t.value=txt;
      document.body.append(t);t.select();document.execCommand("copy");t.remove();
      btn.textContent="已复制 ✓";
    }
    setTimeout(()=>{if(btn.isConnected)btn.textContent="复制引用";},1800);
  }));
}
function configureFilters() {
  const years=[...new Set(works.map(w=>w.year).filter(Boolean))].sort((a,b)=>b-a);
  for(const year of years){
    const opt=document.createElement("option");opt.value=year;opt.textContent=year;$("#year-filter").append(opt);
  }
  const cats=[...new Set(works.map(w=>w.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"zh-CN"));
  for(const category of cats){
    const opt=document.createElement("option");opt.value=category;opt.textContent=category;
    $("#category-filter").append(opt);
  }
  $$(".tab").forEach((button)=>button.addEventListener("click",()=>{
    $$(".tab").forEach(el=>el.classList.remove("active"));
    button.classList.add("active");activeType=button.dataset.type;limit=9;render();
  }));
  ["#search","#year-filter","#category-filter"].forEach((selector)=>{
    $(selector).addEventListener(selector==="#search"?"input":"change",()=>{
      limit=9;render();
    });
  });
  $("#load-more").addEventListener("click",()=>{limit+=9;render();});
}
function showProfile(profile) {
  const n1=profile.name_zh || "张文", n2=profile.name_en||"Zhang Wen";
  $("#profile-name").innerHTML=escapeHTML(n1)+" <span>"+escapeHTML(n2)+"</span>";
  setText("profile-institution", [profile.institution,profile.department].filter(Boolean).join(" · "));
  setText("contact-institution",[profile.institution,profile.department].filter(Boolean).join(" · "));
  setText("profile-note",profile.website_note||"本网站由团队维护。");
  const areas=profile.research_interests||[];
  $("#interest-grid").innerHTML=areas.map((area,i)=>
    `<article class="interest-card"><span class="interest-num">${String(i+1).padStart(2,"0")} / RESEARCH</span>
     <h3 class="interest-title">${escapeHTML(area)}</h3><p class="interest-sub">UNDERWATER ACOUSTICS</p></article>`).join("");
  if(profile.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)){
    $("#contact-email").hidden=false;const a=$("#contact-email-link");a.textContent=profile.email;a.href="mailto:"+profile.email;
  }
  if(profile.orcid && /^(\d{4}-){3}[\dX]{4}$/i.test(profile.orcid)){
    $("#contact-orcid").hidden=false;const a=$("#contact-orcid-link");
    a.textContent=profile.orcid;a.href="https://orcid.org/"+profile.orcid;
  }
  if(profile.scholar_url && safeUrl(profile.scholar_url)){
    $("#contact-scholar").hidden=false;$("#contact-scholar-link").href=safeUrl(profile.scholar_url);
  }
}
async function load() {
  setText("this-year",new Date().getFullYear());
  try{
    const [workRes, profileRes] = await Promise.all([
      fetch("./data/works.json",{cache:"no-cache"}),
      fetch("./data/profile.json",{cache:"no-cache"})
    ]);
    if(!workRes.ok || !profileRes.ok)throw Error("数据读取失败");
    const [workData,profile]=await Promise.all([workRes.json(),profileRes.json()]);
    if(!Array.isArray(workData))throw Error("works.json 不是数组");
    works=workData
      .filter(rec=>rec && rec.title && rec.type)
      .sort((a,b)=>(Number(b.year||0)-Number(a.year||0)) || a.title.localeCompare(b.title,"zh-CN"));
    showProfile(profile);
    setText("count-all",works.length);
    setText("count-papers",works.filter(w=>w.type==="期刊论文" || w.type==="会议论文").length);
    setText("count-patents",works.filter(w=>w.type==="专利").length);
    setText("count-categories",new Set(works.map(w=>w.category)).size);
    configureFilters();render();
  }catch(error){
    console.error(error);
    $("#works-list").innerHTML='<div class="empty">读取成果数据失败。请使用 GitHub Pages 打开网站，或在本地运行 python -m http.server。</div>';
    setText("result-count","暂时无法显示成果数据");
  }
}
document.addEventListener("DOMContentLoaded",load);
