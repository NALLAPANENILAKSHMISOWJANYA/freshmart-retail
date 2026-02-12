import productsData from './products.json';
import faqsData from './faqs.json';

// Types for our data
export interface JsonProduct {
    barcode: string;
    name: string;
    category: string;
    price: number;
    discount: string;
    availability: string;
    aisle: number;
    shelf: string;
    description: string;
}

export interface Faq {
    question: string;
    answer: string;
}

// Convert JSON product to the format the Chatbot expects (partial matching)
// The Chatbot currently expects a 'Product' type from '@/data/products'
// We will create a mapped type or just return the relevant info.
// For now, let's return a unified SearchResult type.

export interface SearchResult {
    type: 'product' | 'faq';
    content: string;
    data?: JsonProduct | Faq;
}

export const searchService = (query: string): SearchResult[] => {
    const normalizedQuery = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    if (!normalizedQuery) return results;

    // Helper function to check if strings are similar (handles typos)
    const isSimilar = (str1: string, str2: string): boolean => {
        const s1 = str1.toLowerCase();
        const s2 = str2.toLowerCase();

        // Exact match
        if (s1.includes(s2) || s2.includes(s1)) return true;

        // Check for common typos (missing one character)
        if (Math.abs(s1.length - s2.length) <= 2) {
            let matches = 0;
            const shorter = s1.length < s2.length ? s1 : s2;
            const longer = s1.length >= s2.length ? s1 : s2;

            for (let i = 0; i < shorter.length; i++) {
                if (longer.includes(shorter[i])) matches++;
            }

            // If at least 70% of characters match and length is similar
            if (matches / shorter.length >= 0.7) return true;
        }

        return false;
    };

    // Extract meaningful words from query (remove common words like where, is, the, etc.)
    const cleanQuery = normalizedQuery
        .replace(/where|which|is|are|the|a|an|in|at|on|located|location|find|floor|aisle|shelf/g, '')
        .trim();

    const searchTerms = cleanQuery.split(/\s+/).filter(term => term.length > 2);

    // 1. Search FAQs
    const faqMatch = faqsData.find(faq =>
        faq.question.toLowerCase().includes(normalizedQuery) ||
        normalizedQuery.includes(faq.question.toLowerCase())
    );

    if (faqMatch) {
        results.push({
            type: 'faq',
            content: faqMatch.answer,
            data: faqMatch
        });
        return results;
    }

    // 2. Search Products with fuzzy matching
    const productMatches = productsData.filter(product => {
        const productName = product.name.toLowerCase();
        const productCategory = product.category.toLowerCase();
        const productDesc = product.description.toLowerCase();

        // Direct match
        if (productName.includes(normalizedQuery) ||
            productCategory.includes(normalizedQuery) ||
            productDesc.includes(normalizedQuery)) {
            return true;
        }

        // Try cleaned query
        if (cleanQuery && (
            productName.includes(cleanQuery) ||
            productCategory.includes(cleanQuery) ||
            productDesc.includes(cleanQuery))) {
            return true;
        }

        // Check individual search terms
        for (const term of searchTerms) {
            if (isSimilar(productName, term) ||
                isSimilar(productCategory, term) ||
                productCategory.includes(term) ||
                productName.includes(term)) {
                return true;
            }
        }

        return false;
    });

    if (productMatches.length > 0) {
        // Return top 5 matches
        productMatches.slice(0, 5).forEach(product => {
            results.push({
                type: 'product',
                content: `${product.name} is available in Aisle ${product.aisle}, ${product.shelf} shelf. Price: ₹${product.price}`,
                data: product
            });
        });
    }

    return results;
};
