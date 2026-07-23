const fs = require('fs');

const path = 'D:\\MAK-solutions\\x-factor\\artifacts\\xfactor-peptides\\src\\components\\products\\ProductData.tsx';
let content = fs.readFileSync(path, 'utf8');

const categoriesMap = {
  "semaglutide-glp1": "Weight Management",
  "tirzepatide-glp2": "Weight Management",
  "retatrutide-glp3": "Weight Management",
  "cagrilintide": "Weight Management",
  "tesamorelin": "Weight Management",
  "mots-c": "Energy",
  "sermorelin": "Sleep",
  "bpc157": "Recovery",
  "tb-500": "Recovery",
  "bpc157-tb500-wolverine": "Recovery",
  "klow": "Weight Management", 
  "ipamorelin": "Recovery",
  "cjc-1295-ipa": "Recovery",
  "cjc-1295-w-dac": "Performance",
  "cjc-1295-wo-dac": "Performance",
  "igf-1-lr3": "Performance",
  "hgh-191-aa": "Performance",
  "ghk-cu": "Recovery",
  "nad-plus": "Focus & Cognitive",
  "kpv": "Recovery",
  "5-amino-1mq": "Weight Management",
  "aod-9604": "Weight Management",
  "ara-290": "Recovery",
  "ss-31": "Energy",
  "epithalon": "Sleep",
  "pt-141": "Performance",
  "dsip": "Sleep",
  "melanotan-2": "Performance",
  "lipo-c": "Weight Management",
  "bac-water": "Recovery"
};

for (const [id, category] of Object.entries(categoriesMap)) {
  const regex = new RegExp(`(id:\\s*"${id}",[\\s\\S]*?category:\\s*)"Research Peptide"`);
  content = content.replace(regex, `$1"${category}"`);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Categories updated successfully!');
