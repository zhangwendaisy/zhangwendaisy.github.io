#!/usr/bin/env python3
"""检索张文老师可能新增的论文：只生成待审核报告，不修改公开页面。

前提：data/profile.json 的 orcid 是老师本人确认的 ORCID。
源：Crossref REST API（按 ORCID 匹配公开元数据）。
"""
import json
import re
import urllib.parse
import urllib.request
from pathlib import Path
from datetime import datetime, timezone

ROOT=Path(__file__).resolve().parents[1]
PROFILE=ROOT/"data"/"profile.json"
WORKS=ROOT/"data"/"works.json"
REPORT=ROOT/"auto_candidates.md"

def write_report(lines):
    REPORT.write_text("\n".join(lines).rstrip()+"\n",encoding="utf-8")
    print("报告路径:",REPORT)
    print("\n".join(lines[:8]))

def norm_doi(s):
    return re.sub(r"^https?://(?:dx\.)?doi\.org/","",str(s or "").strip(),flags=re.I).lower()

def main():
    profile=json.loads(PROFILE.read_text(encoding="utf-8"))
    works=json.loads(WORKS.read_text(encoding="utf-8"))
    orcid=(profile.get("orcid") or "").strip()
    header=["# 新成果候选清单（人工审核后录入）",
            "",
            "本报告不改变网站上的论文条目，也不证明候选论文属于张文老师。",
            "生成日期："+datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
            ""]
    if not re.fullmatch(r"\d{4}-\d{4}-\d{4}-[\dX]{4}",orcid):
        header.append("尚未在 `data/profile.json` 填写并验证老师本人的 ORCID，已跳过自动检索。")
        write_report(header);return

    known_dois={norm_doi(w.get("doi")) for w in works if w.get("doi")}
    query=urllib.parse.urlencode({
        "filter":"orcid:"+orcid,
        "rows":"150",
        "sort":"published",
        "order":"desc"
    })
    url="https://api.crossref.org/works?"+query
    req=urllib.request.Request(url,headers={
        "User-Agent":"AcademicHomepageCandidateChecker/1.0 (contact: repository maintainer)",
        "Accept":"application/json"})
    try:
        with urllib.request.urlopen(req,timeout=30) as response:
            payload=json.load(response)
        results=payload["message"]["items"]
    except Exception as error:
        header.extend(["Crossref 查询失败：`"+str(error)+"`。","请到 Actions 日志查看接口异常或限流情况。"])
        write_report(header);raise SystemExit(1)

    new=[]
    for item in results:
        doi=norm_doi(item.get("DOI"))
        if not doi or doi in known_dois:continue
        title=(item.get("title") or [""])[0].strip()
        if not title:continue
        parts=(item.get("published") or item.get("issued") or {}).get("date-parts",[])
        year=parts[0][0] if parts and parts[0] else "待核"
        authors=", ".join(
            " ".join([author.get("given",""),author.get("family","")]).strip()
            for author in item.get("author",[])
        )
        venue=(item.get("container-title") or [""])[0]
        new.append((title,doi,year,authors,venue))

    header.append(f"Crossref 本次返回 {len(results)} 条，按本地 DOI 去重后有 {len(new)} 条待审核。")
    header.append("")
    if not new:
        header.append("没有发现新候选；若论文尚未同步到 Crossref，仍需人工录入。")
    else:
        for title,doi,year,authors,venue in new:
            header.extend([
                "### "+title,
                "- 年份："+str(year),
                "- 作者："+(authors or "待核"),
                "- 刊物："+(venue or "待核"),
                "- DOI：https://doi.org/"+doi,
                "- 审核：请核对作者身份、DOI、标题、是否重复、与老师的真实关系；通过后再进入 `tools/editor.html` 录入。",
                ""
            ])
    write_report(header)

if __name__=="__main__":
    main()
