const fs = require('fs');

let file = 'src/components/shared/Footer.tsx';
let c = fs.readFileSync(file, 'utf8');

// Replace lucide-react brand imports
c = c.replace(/import\s*\{\s*Instagram,\s*Linkedin,\s*Twitter:\s*TwitterIcon\s*\}\s*from\s*['"]lucide-react['"];?/, '');

// Replace the icon usages
c = c.replace(/<Twitter className="w-4 h-4" \/>/g, '<span className="text-xs font-bold">X</span>');
c = c.replace(/<Instagram className="w-4 h-4" \/>/g, '<span className="text-xs font-bold">IG</span>');
c = c.replace(/<Linkedin className="w-4 h-4" \/>/g, '<span className="text-xs font-bold">IN</span>');

fs.writeFileSync(file, c);
console.log('Fixed Footer.tsx');
