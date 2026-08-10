import { Product } from '@/components/products/ProductData';

const SYNONYM_MAP: Record<string, string[]> = {
  // Weight & GLP-1
  weight: ['semaglutide', 'tirzepatide', 'retatrutide', 'slu-pp-332', 'cagrilintide', 'aod-9604', 'weight management'],
  fat: ['semaglutide', 'tirzepatide', 'retatrutide', 'slu-pp-332', 'cagrilintide', 'aod-9604', 'weight management'],
  slim: ['semaglutide', 'tirzepatide', 'retatrutide', 'slu-pp-332'],
  glp: ['semaglutide', 'tirzepatide', 'retatrutide', 'cagrilintide'],
  glp1: ['semaglutide', 'tirzepatide', 'retatrutide'],
  'glp-1': ['semaglutide', 'tirzepatide', 'retatrutide'],
  gip: ['tirzepatide', 'retatrutide'],
  gcgr: ['retatrutide'],
  appetite: ['semaglutide', 'tirzepatide', 'cagrilintide'],

  // Recovery & Healing
  heal: ['bpc-157', 'tb-500', 'glow pro', 'kpv', 'ghk-cu', 'recovery'],
  healing: ['bpc-157', 'tb-500', 'glow pro', 'kpv', 'ghk-cu', 'recovery'],
  injury: ['bpc-157', 'tb-500', 'glow pro', 'kpv'],
  joint: ['bpc-157', 'tb-500', 'glow pro'],
  repair: ['bpc-157', 'tb-500', 'glow pro', 'kpv', 'ghk-cu'],
  tissue: ['bpc-157', 'tb-500'],
  gut: ['bpc-157', 'kpv'],
  skin: ['ghk-cu', 'glow pro'],

  // Muscle & Performance
  muscle: ['igf-1 lr3', 'sermorelin', 'ipamorelin', 'cjc-1295', 'tesamorelin', 'performance'],
  mass: ['igf-1 lr3', 'sermorelin', 'ipamorelin', 'cjc-1295'],
  growth: ['igf-1 lr3', 'sermorelin', 'ipamorelin', 'cjc-1295', 'tesamorelin', 'ghrp-6'],
  hgh: ['sermorelin', 'ipamorelin', 'cjc-1295', 'tesamorelin', 'ghrp-6'],
  gh: ['sermorelin', 'ipamorelin', 'cjc-1295', 'tesamorelin'],
  strength: ['igf-1 lr3', 'tesamorelin'],

  // Sleep & Rest
  sleep: ['dsip', 'epitalon', 'sleep'],
  rest: ['dsip', 'sleep'],
  insomnia: ['dsip', 'sleep'],

  // Brain & Focus
  brain: ['semax', 'selank', 'nad+', 'focus & cognitive'],
  focus: ['semax', 'selank', 'nad+', 'focus & cognitive'],
  memory: ['semax', 'selank', 'nad+'],
  mind: ['semax', 'selank'],
  anxiety: ['selank'],
  energy: ['nad+', 'energy'],
};

export function normalizeSearchTerm(str: string): string {
  return str
    .toLowerCase()
    .replace(/[-_/,.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function smartSearchProducts(products: Product[], rawQuery: string): Product[] {
  if (!rawQuery || !rawQuery.trim()) return [];

  const queryClean = normalizeSearchTerm(rawQuery);
  const queryTokens = queryClean.split(' ').filter(Boolean);

  const scoredProducts: { product: Product; score: number }[] = [];

  for (const product of products) {
    let score = 0;
    const pNameNorm = normalizeSearchTerm(product.name);
    const pIdNorm = normalizeSearchTerm(product.id);
    const pCatNorm = normalizeSearchTerm(product.category);
    const pDescNorm = normalizeSearchTerm(product.shortDesc + ' ' + product.longDesc);
    const pVariantsNorm = normalizeSearchTerm(
      (product.variants || []).map((v) => `${v.size} ${v.price}`).join(' ')
    );

    // 1. Exact or Prefix Matches on Name & ID
    if (pNameNorm === queryClean || pIdNorm === queryClean) {
      score += 200;
    } else if (pNameNorm.startsWith(queryClean) || pIdNorm.startsWith(queryClean)) {
      score += 120;
    } else if (pNameNorm.includes(queryClean) || pIdNorm.includes(queryClean)) {
      score += 80;
    }

    // 2. Category Matches
    if (pCatNorm.includes(queryClean)) {
      score += 60;
    }

    // 3. Synonym & Keyword Matcher
    for (const token of queryTokens) {
      const synonyms = SYNONYM_MAP[token] || [];
      for (const syn of synonyms) {
        const synNorm = normalizeSearchTerm(syn);
        if (pNameNorm.includes(synNorm) || pCatNorm.includes(synNorm) || pIdNorm.includes(synNorm)) {
          score += 50;
        }
      }
    }

    // 4. Token substring matching across Name, Category, Description, & Variants
    for (const token of queryTokens) {
      if (token.length < 2) continue; // Ignore 1-letter tokens
      if (pNameNorm.includes(token)) score += 30;
      else if (pCatNorm.includes(token)) score += 20;
      else if (pDescNorm.includes(token)) score += 10;
      else if (pVariantsNorm.includes(token)) score += 10;
    }

    if (score > 0) {
      scoredProducts.push({ product, score });
    }
  }

  // Sort by highest relevance score
  return scoredProducts
    .sort((a, b) => b.score - a.score)
    .map((item) => item.product);
}

export const POPULAR_SUGGESTION_TAGS = [
  { label: 'Weight Loss', query: 'weight' },
  { label: 'GLP-1', query: 'glp' },
  { label: 'BPC-157', query: 'bpc-157' },
  { label: 'Tirzepatide', query: 'tirzepatide' },
  { label: 'Recovery', query: 'recovery' },
  { label: 'Kisspeptin', query: 'kisspeptin' },
  { label: 'NAD+', query: 'nad+' },
  { label: 'Sleep & DSIP', query: 'sleep' },
];
