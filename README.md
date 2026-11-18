[README.md](https://github.com/user-attachments/files/35023058/README.md)
# 张文老师学术主页 · 运行与维护

网站地址：https://zhangwendaisy.github.io/zhangwen06.github.io/  
GitHub 仓库：https://github.com/zhangwendaisy/zhangwen06.github.io

## 1. 将新版网站发布到现有仓库

1. 先在 GitHub 中备份现有仓库文件，尤其是 `data/works.json` 和 `data/profile.json`。
2. 将本 ZIP 解压，打开解压后的文件夹；**上传里面的文件和文件夹到仓库根目录，不要把 ZIP 或外层文件夹直接上传**。
3. 在现有仓库中覆盖同名文件，并补充新增的 `data/academic.json`：
   - `index.html`
   - `assets/styles.css`
   - `assets/app.js`
   - `data/profile.json`
   - `data/works.json`
   - `data/academic.json`（新版增加）
   - `tools/editor.html`
   - `README.md`
4. 点击 **Commit changes** 保存。原仓库中已有的 `.github`、`.nojekyll`、`tools/check_updates.py` 可保留，不必反复上传。
5. 确认仓库的 **Settings → Pages → Build and deployment** 为 `Deploy from a branch / main / (root)`。
6. 等待部署完成，刷新网站；如看到旧版布局，按 `Ctrl + F5` 强制刷新。

此版本保留了 26 篇论文及 8 项专利的原始数据。主页只展示用户指定的五类内容：个人信息与研究方向、专著、论文（期刊/会议分开）、竞赛奖项、学术服务。**专利数据仍在 `works.json` 中，不在此次主页上展示。**

## 2. 网站如何运行

线上打开：https://zhangwendaisy.github.io/zhangwen06.github.io/

如需在本地预览，在解压目录打开终端并执行：

```bash
python -m http.server 8000
```

浏览器访问 http://localhost:8000 。不要直接双击 `index.html`，否则浏览器可能阻止读取 JSON 数据。

## 3. 新增或修改论文、专著、竞赛奖项及审稿人任职信息

1. 打开英文成果编辑器：  
   https://zhangwendaisy.github.io/zhangwen06.github.io/tools/editor.html
2. 点击 **Load files from website**。
3. 在 **Record type** 选择相应类别：
   - **Journal article**：期刊论文
   - **Conference paper**：会议论文
   - **Book / monograph**：专著
   - **Competition award**：竞赛奖项
   - **Academic service / reviewer role**：学术任职、审稿人等
4. 填写英文显示信息，并在保存前核实作者、年份、出处及链接。
5. 点击 **Add record** 或 **Save changes**。
6. 期刊论文、会议论文和专利：下载 `works.json`；专著、竞赛奖项、学术服务：下载 `academic.json`。
7. 打开 GitHub 仓库对应的 `data/*.json`，点击铅笔图标，将文件全文替换为下载后的文件内容，再点击 **Commit changes**。
8. GitHub Pages 部署完成后，网页会更新。论文在网页中自动按年份从新到旧排列。

**注意：** 编辑器不会自动写入 GitHub；必须手动提交 JSON 才能公开更新。修改前请备份数据文件。

## 4. 修改个人简介与研究方向

打开 `tools/editor.html` 中的 **Profile and research interests**，修改后点击 **Apply profile changes**、**Download profile.json**，再上传替换仓库的 `data/profile.json`。

也可以直接在 GitHub 打开 `data/profile.json` 编辑。网页会读取英文的 `name_en`、`institution_en`、`department_en`、`biography_en` 和 `research_interests_en` 等字段。

## 5. 日常维护检查

- **论文未显示**：检查 `data/works.json` 的 JSON 格式、数据类型以及 `assets/app.js`。
- **专著、奖项或审稿记录未显示**：检查 `data/academic.json`，确认 `books`、`awards`、`services` 数组已经添加记录。
- **网站仍显示旧版**：查看 GitHub **Actions** / **Settings → Pages** 是否部署完成，之后按 `Ctrl + F5`。
- **无法在本地打开数据**：用 `python -m http.server 8000` 预览。
- **自动查新（可选）**：已有 `.github/workflows/weekly_check.yml` 时，可在填入老师本人确认的 ORCID 后，通过 Actions 生成候选论文报告，审核后再手动录入。

发布前请确认所有个人信息、论文、奖项及学术任职资料可以对外公开。
