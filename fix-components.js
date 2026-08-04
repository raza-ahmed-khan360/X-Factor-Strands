const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (content.includes('wouter')) {
    content = content.replace(/import\s+\{([^}]*)\bLink\b([^}]*)\}\s+from\s+['"]wouter['"];?/g, (match, p1, p2) => {
      let newImport = `import Link from 'next/link';\n`;
      let remaining = (p1 + p2).replace(/,/g, ' ').trim().split(/\s+/).filter(Boolean);
      if (remaining.length > 0) {
        newImport += `import { ${remaining.join(', ')} } from 'wouter';\n`;
      }
      return newImport;
    });
    content = content.replace(/import\s*\{\s*Link\s*\}\s*from\s*['"]wouter['"];?/, "import Link from 'next/link';");
    content = content.replace(/import\s+\{\s*useLocation\s*\}\s+from\s+['"]wouter['"];?/g, "import { usePathname, useRouter } from 'next/navigation';");
    
    changed = true;
  }
  
  if (content.includes('lucide-react')) {
    content = content.replace(/import\s*\{\s*([^}]*)\s*\}\s*from\s*['"]lucide-react['"];?/g, (match, imports) => {
      let newImports = imports;
      newImports = newImports.replace(/\bTwitter\b/g, 'Twitter: TwitterIcon'); // or just standard replacements
      // Actually it's easier to replace Instagram, Linkedin, Twitter with something else or just remove them if not used. 
      // Next.js uses different lucide-react? No, lucide-react might just have renamed `Twitter` to `TwitterIcon` or `X`.
      return `import { ${newImports} } from 'lucide-react';`;
    });
    // For lucide-react we will manually fix them using replace_file_content since we can see the exact error.
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed wouter in ' + filePath);
  }
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walk('src/components');
walk('src/hooks');
walk('src/lib');
