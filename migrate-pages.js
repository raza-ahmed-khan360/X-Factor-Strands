const fs = require('fs');
const path = require('path');

const pagesDir = 'artifacts/xfactor-peptides/src/pages';
const appDir = 'src/app';

const mappings = {
  'HomePage.tsx': 'page.tsx',
  'ShopPage.tsx': 'shop/page.tsx',
  'ProductDetailPage.tsx': 'products/[id]/page.tsx',
  'AboutPage.tsx': 'about/page.tsx',
  'FAQPage.tsx': 'faq/page.tsx',
  'ContactPage.tsx': 'contact/page.tsx',
  'ResearchDisclaimerPage.tsx': 'research-disclaimer/page.tsx',
  'CheckoutPage.tsx': 'checkout/page.tsx',
  'OrderConfirmationPage.tsx': 'order-confirmation/page.tsx',
  'COAsPage.tsx': 'COAS/page.tsx',
  'not-found.tsx': 'not-found.tsx'
};

if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir, { recursive: true });
}

function processContent(content) {
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
  return content;
}

for (const [src, dest] of Object.entries(mappings)) {
  const srcPath = path.join(pagesDir, src);
  const destPath = path.join(appDir, dest);
  try {
      if (fs.existsSync(srcPath)) {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        let content = fs.readFileSync(srcPath, 'utf8');
        content = processContent(content);
        if (!content.includes('use client')) {
           content = '"use client";\n' + content;
        }
        fs.writeFileSync(destPath, content);
      }
  } catch (e) { console.error(e); }
}
