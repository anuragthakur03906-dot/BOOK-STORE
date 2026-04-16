
import fs from 'fs';
let code = fs.readFileSync('src/components/layout/Footer.jsx', 'utf8');

// Remove imports
code = code.replace(/import\s+[A-Za-z0-9_]+Icon\s+from\s+['"]@mui\/icons-material\/[^'"]+['"];?\r?\n/g, '');

// Remove JSX elements mapping to icons
// Matches <MenuBookIcon ... /> or <MenuBookIcon>...</MenuBookIcon>
code = code.replace(/<[A-Za-z0-9_]+Icon[^>]*(\/>|<\/[A-Za-z0-9_]+Icon>)/g, '');

console.log(code);

