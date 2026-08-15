# 资料文件夹

把 PDF、图片或压缩包上传到这个文件夹，再在 `content/site.json` 的对应资料记录中填写相对路径。

建议按分类和年份建立子文件夹，例如：

```text
files/
  analysis/
    2025/
      2025-math-analysis-midterm.pdf
```

对应的链接写成：

```json
"url": "files/analysis/2025/2025-math-analysis-midterm.pdf"
```
