# Math Archive：可编辑的数学资料站模板

这是一个参考 [SDU 数院试题页](https://nicolaskeng.github.io/miscellanies/SDUMath-Exams) 与 [USTC 数学课程往年试卷](https://ustcmathexam.github.io/) 信息结构制作的 GitHub Pages 模板。它采用与参考站接近的纯黑白学术主页排版：顶部分类导航、左侧站点信息、右侧窄栏课程资料与普通表格；同时保留搜索、分类筛选、深色模式和移动端适配。

页面内容与参考站点相互独立，不含对方的姓名、头像、试卷或原创文字。

## 最常用的编辑方式

平时只需要修改 [`content/site.json`](content/site.json)：

- `site`：站名、介绍、更新时间和页脚；
- `profile`：维护者、学校、邮箱和 GitHub；
- `categories`：课程分类、课程与资料；
- `submission`：投稿说明；
- `thanks`：致谢名单。

新增一份资料时，在对应课程的 `materials` 中复制一条记录：

```json
{
  "year": "2026",
  "term": "春",
  "type": "期末试题",
  "format": "PDF",
  "teacher": "教师姓名",
  "note": "含参考答案",
  "url": "files/analysis/2026/2026-analysis-final.pdf"
}
```

然后把文件上传到 `public/files/analysis/2026/`。建议文件名只使用英文、数字和短横线，避免空格。

## 发布到 GitHub Pages

1. 在 GitHub 新建仓库，推荐命名为 `你的用户名.github.io`；普通仓库名也可以。
2. 把本项目所有文件上传到仓库的 `main` 分支。
3. 打开仓库的 **Settings → Pages**，将 **Source** 设为 **GitHub Actions**。
4. 每次编辑并提交后，`.github/workflows/pages.yml` 会自动构建和发布网页。

工作流会自动判断这是用户主页还是普通项目页，所以不需要手工修改资源路径。

## 本地预览

需要 Node.js 22 或更新版本：

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:3000/`。

正式构建：

```bash
npm run build
```

GitHub Pages 会发布 `dist/client` 目录。

## 文件大小提示

大量试卷会让仓库迅速变大。单个 PDF 尽量控制在 20 MB 以内；较大的资料建议放到 GitHub Releases、网盘或对象存储，再把外部链接填写到 `url`。

## 自定义样式

颜色、字号、间距和响应式布局都在 [`app/globals.css`](app/globals.css) 中。页面结构与搜索逻辑在 [`app/ExamArchive.tsx`](app/ExamArchive.tsx) 中。

## 许可

模板代码可按 MIT License 使用和修改。上传试卷、讲义或其他资料前，请确认你有权公开传播它们。
