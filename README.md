[Uploading README.md…]()
# 张文老师学术主页 · 运行与维护说明

网站地址：  
https://zhangwendaisy.github.io/zhangwen06.github.io/

GitHub 仓库：  
https://github.com/zhangwendaisy/zhangwen06.github.io

## 1. 运行与发布

### 在线访问
网站通过 GitHub Pages 运行。只要仓库中保存了网页文件并启用了 Pages，就可以直接访问上面的网址。

### 本地预览
如需在本地预览，在网站项目目录打开终端并执行：

```bash
python -m http.server 8000
```

然后在浏览器打开：

```text
http://localhost:8000
```

不要直接双击 `index.html`，否则浏览器可能无法读取 `data/*.json` 数据文件。

### GitHub Pages 设置
在仓库中进入：

- `Settings`
- `Pages`

然后设置：

- **Source**: `Deploy from a branch`
- **Branch**: `main`
- **Folder**: `/(root)`

保存后，GitHub 会自动发布网站。以后每次提交文件，网站都会自动重新部署。

## 2. 网站主要文件

- `index.html`：主页结构
- `assets/styles.css`：网页样式
- `assets/app.js`：前端数据读取与页面渲染
- `data/profile.json`：个人简介、研究方向、邮箱、头像等
- `data/works.json`：论文与专利数据
- `data/academic.json`：专著、竞赛奖项、学术服务等
- `tools/editor.html`：浏览器端维护工具

## 3. 如何维护网站内容

打开维护工具：

```text
https://zhangwendaisy.github.io/zhangwen06.github.io/tools/editor.html
```

### 3.1 修改个人简介
在编辑器中可修改：

- 英文名 / 中文名
- 职称
- 单位与院系
- 个人简介
- 联系邮箱
- Google Scholar / ORCID / 个人主页链接
- 研究方向
- 个人照片

修改完成后点击：

- **Apply profile changes**
- **Download profile.json**

然后到 GitHub 仓库中替换 `data/profile.json` 的内容并提交。

### 3.2 新增或修改论文
在编辑器中选择：

- `Journal article`
- `Conference paper`

填写标题、作者、年份、期刊 / 会议名称、DOI、链接等信息。  
保存后下载：

- `works.json`

再到 GitHub 仓库中替换 `data/works.json` 并提交。

网页会自动把：

- 期刊论文
- 会议论文

分别显示，并按年份从新到旧排序。

### 3.3 新增或修改专著
在编辑器中选择：

- `Book / monograph`

可以填写：

- 专著题名
- 作者
- 出版社
- 出版年份
- 外部链接
- 封面图片

专著封面支持两种方式：

1. 填写图片 URL
2. 直接上传本地图片（编辑器会把图片写入 `academic.json`）

保存后下载：

- `academic.json`

再到 GitHub 仓库中替换 `data/academic.json` 并提交。

### 3.4 新增或修改竞赛奖项
在编辑器中选择：

- `Competition award`

填写奖项名称、赛事名称、年份、说明等。  
保存后下载 `academic.json`，替换 GitHub 中对应文件并提交。

### 3.5 新增或修改学术服务 / 审稿人任职
在编辑器中选择：

- `Academic service`

填写任职名称、服务机构、年份或时间段、说明等。  
保存后下载 `academic.json`，替换 GitHub 中对应文件并提交。

### 3.6 专利数据
专利保存在 `data/works.json` 中。  
编辑器支持录入专利，但当前主页默认不展示专利板块；数据保留在后台文件中，后续如需展示可再调整页面。

## 4. 每次更新后的操作

每次在编辑器中改完数据后，需要：

1. 下载更新后的 JSON 文件
2. 打开 GitHub 仓库中的对应文件
3. 点击右上角铅笔图标进行编辑
4. 用下载文件的内容替换原内容
5. 点击 **Commit changes**
6. 等待 GitHub Pages 自动部署
7. 刷新网站查看结果（如有缓存，可按 `Ctrl + F5`）

## 5. 注意事项

- 编辑器只是浏览器内工具，不会自动把数据写入 GitHub。
- 任何公开到网站上的邮箱、照片、论文、奖项和任职信息，都应事先确认可以公开。
- 若页面未更新，请先检查 GitHub Pages 是否部署完成，再强制刷新浏览器。
