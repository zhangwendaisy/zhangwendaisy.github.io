[README.md](https://github.com/user-attachments/files/35024750/README.1.md)
# 张文老师学术主页｜运行与维护说明

## 一、网站地址

- **英文成果展示主页：** [https://zhangwendaisy.github.io/zhangwen06.github.io/](https://zhangwendaisy.github.io/zhangwen06.github.io/)
- **中文成果管理页面：** [点击进入成果管理后台](https://zhangwendaisy.github.io/zhangwen06.github.io/tools/editor.html)
- **GitHub 代码仓库：** [zhangwendaisy/zhangwen06.github.io](https://github.com/zhangwendaisy/zhangwen06.github.io)

> 对外展示主页保持英文；成果录入、个人信息修改和图片上传的管理页面为中文。该管理页面是浏览器端编辑器，不是带登录和数据库的服务器后台。修改后仍需下载 JSON 文件并提交到 GitHub 才能发布。

## 二、网站运行与发布

### 1. 在线运行

打开上方英文成果展示主页地址即可访问网站。

首次发布时，进入 GitHub 仓库的 **Settings → Pages**，将 **Build and deployment** 设为：

- **Source：** Deploy from a branch
- **Branch：** main
- **Folder：** /(root)

点击 **Save**，等待 GitHub Pages 完成发布。

### 2. 本地预览（可选）

在解压后的网站项目根目录打开命令行，执行：

```bash
python -m http.server 8000
```

在浏览器访问：

- 英文主页：<http://localhost:8000/>
- 中文成果管理：<http://localhost:8000/tools/editor.html>

请使用本地 HTTP 服务预览，避免直接双击 HTML 文件导致 JSON 数据加载失败。

## 三、中文成果管理页面怎么使用

直接打开：[中文成果管理页面](https://zhangwendaisy.github.io/zhangwen06.github.io/tools/editor.html)。

### 第一步：读取已有内容

进入管理页面后，点击 **“读取网站现有数据”**，读取当前网站的个人信息、论文、专著、奖项及任职记录。

如果自动读取失败，可在“**一、加载现有数据**”中，分别导入：

- `profile.json`：个人简介、研究方向、联系方式与照片
- `works.json`：期刊论文、会议论文及专利
- `academic.json`：专著、竞赛奖项及学术任职

### 第二步：修改个人资料与上传照片

在“**二、编辑个人简介**”中，可修改姓名、职称、邮箱、单位、研究方向和简介。

个人照片可以：

1. 在“**个人照片地址**”填写图片链接；
2. 或点击“**上传个人照片**”选择本地图片，查看预览效果。

填写完后依次点击：

1. **保存个人信息到当前浏览器**
2. **下载 profile.json**

然后将下载文件的内容提交到 GitHub 仓库的 `data/profile.json`。

### 第三步：录入、编辑或删除学术成果

在“**三、新增或修改成果**”中，选择“**成果类型**”：

- **期刊论文**：Journal Articles
- **会议论文**：Conference Papers
- **专著 / 教材**：Books
- **竞赛奖项**：Competition Awards
- **学术任职 / 审稿人**：Academic Service
- **专利**：可以录入保存，但目前不在英文主页展示

填写成果题目、作者、年份、期刊或出版社、DOI、成果链接等信息，点击 **“添加成果”**。

如需修改已有成果，找到“**四、已录入的成果**”，点击对应记录右侧的 **“编辑”**，修改后点击 **“保存修改”**；如需移除则点击 **“删除”**。

有 DOI 的论文可以点击 **“根据 DOI 查询题录”** 自动填写部分信息，但仍需人工核对准确性。

### 第四步：上传专著封面

将成果类型选为 **“专著 / 教材”**，除填写题录信息外，还可以：

- 在“**专著封面地址**”填写图片 URL；
- 或通过“**上传专著封面**”直接选择本地 JPG/PNG 图片。

上传后可查看封面预览。建议使用压缩过的图片，避免 JSON 文件过大。

保存成果后，点击 **“下载 academic.json（专著/奖项/任职）”**，后续提交到 GitHub。

### 第五步：下载并发布修改结果

修改完成后，按内容类别下载对应文件：

| 修改内容 | 点击下载 | GitHub 仓库中的目标文件 |
|---|---|---|
| 个人简介、头像、邮箱、研究方向 | 下载 profile.json | `data/profile.json` |
| 期刊论文、会议论文、专利 | 下载 works.json（论文/专利） | `data/works.json` |
| 专著及封面、竞赛奖项、学术任职 | 下载 academic.json（专著/奖项/任职） | `data/academic.json` |

随后：

1. 打开 [GitHub 仓库](https://github.com/zhangwendaisy/zhangwen06.github.io)。
2. 进入对应的 `data` 文件夹和 JSON 文件。
3. 点击文件右上角的**铅笔图标（Edit）**。
4. 用刚下载的 JSON 内容替换原内容。
5. 点击 **Commit changes** 保存。
6. 等 GitHub Pages 完成部署后，刷新英文展示主页查看更新。

**重要：** 点击管理页面中的“添加成果”“保存修改”或“上传图片”并不会立即修改公开网站。只有提交对应 JSON 文件后，GitHub Pages 才会使用新数据。

## 四、网站文件及维护位置

| 文件 | 用途 |
|---|---|
| `index.html` | 英文学术主页页面结构 |
| `assets/styles.css` | 主页字体、边框和排版 |
| `assets/app.js` | 读取成果数据、按年份排序并展示 |
| `tools/editor.html` | **中文成果管理页面** |
| `data/profile.json` | 个人信息、联系邮箱、照片及研究方向 |
| `data/works.json` | 论文及专利数据 |
| `data/academic.json` | 专著、竞赛奖项及学术任职数据 |

## 五、常见问题

**1. README 已改，但后台仍显示英文？**

README 只是使用说明。还需要在 GitHub 中确认 `tools/editor.html` 已经替换为中文版，提交后等待 Pages 更新。可按 `Ctrl + F5` 强制刷新。

**2. 修改论文后，英文主页为什么没有变化？**

检查是否下载并提交了新版 `data/works.json`，以及 GitHub Pages 是否已经完成部署。

**3. 专著封面上传后不显示？**

检查是否先保存该专著，再下载并提交了 `data/academic.json`。如果使用外部图片链接，确认该链接可公开访问。

**4. 管理页面的网址会随着改成中文而改变吗？**

不会。中文版仍然使用：

`https://zhangwendaisy.github.io/zhangwen06.github.io/tools/editor.html`

**5. 上传新版压缩包会不会覆盖现在已经录入的成果？**

可能会。因此，网站已经运行并且手动更新过数据时，**建议只替换需要修改的文件**，不要用旧 ZIP 中的 `data/*.json` 覆盖当前正式数据。

网站公开信息、个人照片和成果资料在上传前应确认已获得公开发布许可。
