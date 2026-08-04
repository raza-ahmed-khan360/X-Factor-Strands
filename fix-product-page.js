const fs = require('fs');
let file = 'src/app/products/[id]/page.tsx';
let c = fs.readFileSync(file, 'utf8');
c = c.replace(/import\s*\{\s*useRoute\s*\}\s*from\s*['"]wouter['"];?/, "import { useParams } from 'next/navigation';");
c = c.replace(/import\s+\{([^}]*)\bLink\b([^}]*)\}\s+from\s+['"]wouter['"];?/g, "import Link from 'next/link';");
c = c.replace(/import\s*\{\s*Link\s*\}\s*from\s*['"]wouter['"];?/, "import Link from 'next/link';");
c = c.replace(/const \[match, params\] = useRoute\('\/products\/:id'\);/, 'const params = useParams();');
c = c.replace(/const productId = params\?\.id;/, 'const productId = params?.id as string;');
if (!c.includes('use client')) {
  c = '"use client";\n' + c;
}
fs.writeFileSync(file, c);
console.log('Fixed page.tsx');
