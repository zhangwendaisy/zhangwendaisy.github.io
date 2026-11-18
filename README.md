# 张文老师学术主页 · GitHub Pages 可编辑模板

> 已按用户提供的《学术成果 张文 国防科技大学》Word 正文初始化 **26 篇论文（5 篇期刊、21 篇会议）与 8 条专利**。
> **这是待审核的初始资料，不代表老师全部成果。**
> 参考 Word 中的“科研项目”部分为占位文字，没有真实项目记录，因此没有虚构项目展示。
> 请在对外公开前征得老师授权并逐条核对作者、成果、年份、专利号、DOI 与联系信息。

## 1. 网站如何上线（无需购买服务器）

1. 注册或登录 GitHub：https://github.com/
2. 建立一个 **Public（公开）** 仓库。
   - 如果需要 `https://你的用户名.github.io/` 这样的个人主站，仓库必须命名为 `你的用户名.github.io`。
   - 如果仓库名为 `zhangwen-academic`，地址通常是 `https://你的用户名.github.io/zhangwen-academic/`。
3. 将本压缩包**解压后**，把 `index.html`、`assets`、`data`、`tools`、`.github`、`.nojekyll` **一起上传到仓库根目录**。
   > 注意：不能只上传 `.zip`，要上传解压后的实际文件。不要漏传 `data/works.json`。
4. 打开仓库的 **Settings → Pages → Build and deployment**。
5. **Source** 选择 **Deploy from a branch**；Branch 选择 **main**、文件夹 **/(root)**，然后保存。
6. 等 GitHub Pages 构建后，按 Pages 页面提示访问公开网站。

GitHub 官方教程：https://docs.github.com/zh/pages/getting-started-with-github-pages/creating-a-github-pages-site

## 2. 日常手动更新成果（推荐）

### 方法 A：使用图形化录入工具

1. 打开网站的 `https://你的用户名.github.io/.../tools/editor.html`。
2. 载入现有网站成果数据。
3. 填入题名、作者、类别、年份、期刊、DOI 或专利申请号、主要贡献。
4. 如果知道 DOI，可点击“根据 DOI 自动补全题录”，系统会通过 Crossref 读取可获取的论文元数据；仍需人工确认。
5. 在页面底部点击“下载更新后的 works.json”。
6. 返回 GitHub 仓库，点击 `data/works.json` → 右上角铅笔图标（Edit this file），**把整个文件内容替换为刚下载的 JSON 内容** → Commit changes。
7. GitHub Pages 将重新发布网页。更新不是秒级实时，通常需要数分钟，具体以 GitHub 页面构建状态为准。

此录入工具是浏览器本地编辑器，**不能无登录权限直接修改 GitHub 服务器上的仓库**；不会偷偷上传数据。

### 方法 B：直接在 GitHub 修改数据

打开 `data/works.json`，找到对应条目，照现有字段添加：
```json
{
  "id": "paper-new-example",
  "type": "期刊论文",
  "category": "目标识别",
  "title": "你的论文正式题名",
  "authors": "Zhang Wen, 其他作者",
  "year": 2026,
  "publication": "正式期刊名称, 卷(期): 页码",
  "doi": "10.xxxx/xxx",
  "url": "https://doi.org/10.xxxx/xxx",
  "description": "只写已核实的贡献，避免编造实验数据",
  "source": "人工录入",
  "verified": false
}
```
注意：上方只是**格式示例**，不是已发表的真实论文。

## 3. 更新个人简介和研究方向

编辑 `data/profile.json`：

- `name_zh` 和 `name_en`：中文、英文姓名
- `institution` 和 `department`：单位、院系
- `title`：职称（请核实后填写）
- `research_interests`：研究方向数组
- `email`：本人批准公开的电子邮箱（默认留空）
- `orcid`：老师本人的 ORCID（自动查新依赖它，必须先核实）
- `scholar_url`：Google Scholar 个人主页 URL
- `website_note`：网站页脚提示

不要把身份证号、住址、内部联系方式、涉密项目或尚未允许公开的资料放进公开仓库。

## 4. 自动检查新论文（可选）

本模板附带：
- `.github/workflows/weekly_check.yml`：GitHub Actions 每周查新任务
- `tools/check_updates.py`：Crossref 按已核实 ORCID 检索的新论文候选报告

**注意：这是自动查找候选论文，不是未经审核就自动公开。**

启用步骤：
1. 先由老师确认正确的 ORCID，填入 `data/profile.json` 的 `orcid` 字段。
2. GitHub 仓库打开 **Actions → Weekly paper discovery (review required) → Run workflow** 手动执行一次。
3. 检查执行摘要，或下载 `paper-candidates` 报告。
4. 核对作者是否真的是张文老师、论文是否重复、DOI 与出版信息是否准确。
5. 审核通过后，用录入工具加入 `works.json` 并 Commit。
6. 配置文件中也包含每周一计划检索，执行时间受 GitHub Actions 排队影响，并非严格实时。

该步骤不会修改已经发布的网站，也不会自动向老师的 ORCID 写入数据。
同名作者很多；不建议按“张文 / Zhang Wen”姓名直接抓取并自动上线。
部分会议论文、中文论文、专利不会完整出现在 Crossref，仍需人工补充。

## 5. 本地预览

安装 Python 3 后，在项目目录执行：
```bash
python -m http.server 8000
```
浏览器打开 `http://localhost:8000`。

直接双击 `index.html` 使用 `file://` 打开时，浏览器出于安全设置可能阻止读取 `data/works.json`，这是正常情况。使用上述本地服务器或 GitHub Pages 即可。

## 6. 目录结构

```
index.html                  网站主页面
assets/styles.css           网站外观
assets/app.js               搜索、分类和展示逻辑
data/profile.json           姓名、院系、研究方向和联系信息
data/works.json             论文与专利条目（核心数据）
tools/editor.html           成果新增/修改/删除编辑器（下载JSON）
tools/check_updates.py      可选的 Crossref 新论文候选检查脚本
.github/workflows/weekly_check.yml    每周检测候选论文
.nojekyll                   让 GitHub Pages 直接发布静态文件
```

## 7. 推荐维护流程

**最稳妥：** 录入成果 → 老师审核 → GitHub Commit → 网页自动发布。

如果强烈需要“真正实时在线表单录入后网站立即变化”，则要额外开发带认证、数据库和写入权限的管理系统（如 Supabase/Firebase 等），不属于 GitHub Pages 单独提供的能力。多数个人学术主页没必要承担这份维护成本。

## 8. 资料准确性及版权

- 原始成果信息来自用户上传的张文老师成果 Word。
- 刊物、DOI、专利号、学术身份与对外展示内容须通过发表原文及老师本人核实。
- 本项目是原创静态模板，仅参考了王勇献老师网站的“个人简介＋研究方向＋成果列表”的信息组织方式，没有复制其网页代码、照片或其他素材。
- 图书封面、论文 PDF 首页、未经授权的照片或内部文件，不应自动公开上传。

GitHub Pages 文档：https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

Crossref API：https://www.crossref.org/documentation/retrieve-metadata/rest-api

GitHub Actions 定时事件：https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows
