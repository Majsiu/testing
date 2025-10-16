const fs = require('fs');
const path = require('path');
const markdownIt = require('markdown-it')();

// Configuration
const ARTICLES_DIR = path.join(__dirname, 'articles');
const OUTPUT_DIR = path.join(__dirname, 'ex_art');
const CSS_FILE = path.join(__dirname, 'gallery.css');

// Create output directory if not exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
  console.log(`Created directory: ${OUTPUT_DIR}`);
}

// Read and embed CSS
let cssContent = '';
try {
  cssContent = fs.readFileSync(CSS_FILE, 'utf8');
  console.log(`Using CSS from: ${CSS_FILE}`);
} catch (err) {
  console.error(`Error reading CSS file: ${err.message}`);
  process.exit(1);
}

// Process markdown files
fs.readdir(ARTICLES_DIR, (err, files) => {
  if (err) {
    console.error(`Error reading articles directory: ${err.message}`);
    return;
  }

  files.forEach(file => {
    if (file.match(/^\d{2}\.\d{2}\.\d{4}\.md$/)) {
      const filePath = path.join(ARTICLES_DIR, file);
      const outputFile = file.replace('.md', '.html');
      const outputPath = path.join(OUTPUT_DIR, outputFile);

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(`Error reading ${file}: ${err.message}`);
          return;
        }

        // Convert markdown to HTML
        const htmlContent = markdownIt.render(data);
        
        // Create full HTML document
        const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${file.slice(0, -3)}</title>
  <style>${cssContent}</style>
</head>
<body>
${htmlContent}
</body>
</html>`;

        // Write to output file
        fs.writeFile(outputPath, fullHtml, err => {
          if (err) {
            console.error(`Error writing ${outputFile}: ${err.message}`);
          } else {
            console.log(`Exported: ${outputFile}`);
          }
        });
      });
    }
  });
});