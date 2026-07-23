const fs = require('fs');
const path = require('path');

const dir = 'D:\\MAK-solutions\\x-factor\\artifacts\\xfactor-peptides\\public\\new-products';

const map = {
  "WhatsApp Image 2026-07-24 at 2.30.58 AM.jpeg": "semaglutide-glp1.jpeg",
  "WhatsApp Image 2026-07-24 at 2.30.59 AM (1).jpeg": "retatrutide-glp3.jpeg",
  "WhatsApp Image 2026-07-24 at 2.30.59 AM.jpeg": "tirzepatide-glp2.jpeg",
  "WhatsApp Image 2026-07-24 at 2.31.01 AM.jpeg": "cagrilintide.jpeg",
  "WhatsApp Image 2026-07-24 at 2.31.02 AM (1).jpeg": "mots-c.jpeg",
  "WhatsApp Image 2026-07-24 at 2.31.02 AM.jpeg": "tesamorelin.jpeg",
  "WhatsApp Image 2026-07-24 at 2.31.03 AM.jpeg": "sermorelin.jpeg",
  "WhatsApp Image 2026-07-24 at 2.31.04 AM.jpeg": "bpc157.jpeg",
  "WhatsApp Image 2026-07-24 at 2.31.05 AM.jpeg": "tb-500.jpeg",
  "WhatsApp Image 2026-07-24 at 2.31.06 AM (1).jpeg": "klow.jpeg",
  "WhatsApp Image 2026-07-24 at 2.31.06 AM.jpeg": "bpc157-tb500-wolverine.jpeg",
  "WhatsApp Image 2026-07-24 at 2.31.07 AM.jpeg": "ipamorelin.jpeg",
  "WhatsApp Image 2026-07-24 at 2.31.08 AM.jpeg": "cjc-1295-ipa.jpeg",
  "WhatsApp Image 2026-07-24 at 2.31.09 AM.jpeg": "cjc-1295-w-dac.jpeg",
  "WhatsApp Image 2026-07-24 at 2.31.10 AM.jpeg": "cjc-1295-wo-dac.jpeg",
  "WhatsApp Image 2026-07-24 at 2.31.11 AM.jpeg": "igf-1-lr3.jpeg",
  "WhatsApp Image 2026-07-24 at 2.31.13 AM.jpeg": "hgh-191-aa.jpeg",
  "WhatsApp Image 2026-07-24 at 2.31.14 AM (1).jpeg": "nad-plus.jpeg",
  "WhatsApp Image 2026-07-24 at 2.31.14 AM.jpeg": "ghk-cu.jpeg",
  "WhatsApp Image 2026-07-24 at 2.31.15 AM (1).jpeg": "5-amino-1mq.jpeg",
  "WhatsApp Image 2026-07-24 at 2.31.15 AM.jpeg": "kpv.jpeg",
  "WhatsApp Image 2026-07-24 at 2.31.17 AM.jpeg": "aod-9604.jpeg",
  "WhatsApp Image 2026-07-24 at 2.31.18 AM (1).jpeg": "ss-31.jpeg",
  "WhatsApp Image 2026-07-24 at 2.31.18 AM.jpeg": "ara-290.jpeg",
  "WhatsApp Image 2026-07-24 at 2.31.19 AM (1).jpeg": "pt-141.jpeg",
  "WhatsApp Image 2026-07-24 at 2.31.19 AM.jpeg": "epithalon.jpeg",
  "WhatsApp Image 2026-07-24 at 2.31.20 AM (1).jpeg": "melanotan-2.jpeg",
  "WhatsApp Image 2026-07-24 at 2.31.20 AM.jpeg": "dsip.jpeg",
  "WhatsApp Image 2026-07-24 at 2.31.21 AM (1).jpeg": "bac-water.jpeg",
  "WhatsApp Image 2026-07-24 at 2.31.21 AM.jpeg": "lipo-c.jpeg"
};

for (const [oldName, newName] of Object.entries(map)) {
  const oldPath = path.join(dir, oldName);
  const newPath = path.join(dir, newName);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed ${oldName} to ${newName}`);
  }
}
