[README.md](https://github.com/user-attachments/files/35020852/README.md)
# 张文老师学术主页｜运行与维护说明

**网站地址：** https://zhangwendaisy.github.io/zhangwen06.github.io/  
**GitHub 仓库：** https://github.com/zhangwendaisy/zhangwen06.github.io

## 1. 网站运行与发布

1. 确认仓库根目录有 `index.html`、`assets/`、`data/`、`tools/` 和 `.nojekyll`。
2. 在 GitHub 仓库进入 **Settings → Pages**。
3. 在 **Build and deployment** 中设置：**Source = Deploy from a branch**、**Branch = main**、**Folder = /(root)**，点击 **Save**。
4. 等待 GitHub Pages 完成部署后，打开上方网站地址。之后每次提交文件，网站都会重新部署；可以在 **Actions** 或 **Settings → Pages** 查看部署情况。

### 本地预览（可选）

在解压后的项目文件夹打开终端，运行：

```bash
python -m http.server 8000
```

浏览器访问 http://localhost:8000 。不要直接双击 `index.html` 预览，因为浏览器可能阻止本地 JSON 数据读取。

## 2. 新增、修改或删除论文及专利

1. 打开 [成果录入工具](https://zhangwendaisy.github.io/zhangwen06.github.io/tools/editor.html)。
2. 点击 **载入网站现有数据**，选择需要新增、修改或删除的成果。
3. 填写并核对题名、作者、年份、刊物、DOI、文章链接或专利申请号等信息；有 DOI 的论文可以尝试自动补全题录。
4. 点击 **下载更新后的 works.json**。
5. 打开 GitHub 仓库中的 [`data/works.json`](https://github.com/zhangwendaisy/zhangwen06.github.io/blob/main/data/works.json)，点击右上角的 **Edit（铅笔图标）**，将文件全文替换成刚下载的 `works.json` 内容。
6. 点击 **Commit changes** 提交。部署完成后刷新网站，检查成果是否正确显示。

**注意：** 录入工具只在浏览器内编辑数据，不会自动写入 GitHub；必须提交 `data/works.json`，网站才会更新。修改前建议备份原文件。

## 3. 修改个人简介和研究方向

在仓库中打开 [`data/profile.json`](https://github.com/zhangwendaisy/zhangwen06.github.io/blob/main/data/profile.json)，点击 **Edit** 修改，完成后点击 **Commit changes**。

常用字段：

- `name_zh` / `name_en`：中文名与英文名
- `institution` / `department`：单位与院系
- `research_interests`：研究方向
- `email` / `orcid` / `scholar_url`：对外联系与学术主页链接
- `website_note`：网站说明

## 4. 日常维护与检查

- **成果不显示：** 检查 `data/works.json` 是否存在且为有效 JSON，确认 `assets/app.js` 已上传。
- **网页样式异常：** 检查 `assets/styles.css` 是否存在。
- **修改后没更新：** 先查看仓库 **Actions** 或 **Settings → Pages** 的部署状态，再强制刷新网页（Windows：`Ctrl + F5`）。
- **需要修改网页布局：** 编辑 `index.html`；需要修改配色和排版：编辑 `assets/styles.css`。提交后自动重新部署。
- **自动查新（可选）：** 如已上传 `.github/workflows/weekly_check.yml`，并在 `data/profile.json` 填入老师本人已确认的 ORCID，可以在 **Actions** 查看查新候选报告。查新不会自动发布成果，仍需人工审核并录入。

公开仓库里的内容任何人都能看到，更新前请确认论文、专利及个人信息允许公开。
