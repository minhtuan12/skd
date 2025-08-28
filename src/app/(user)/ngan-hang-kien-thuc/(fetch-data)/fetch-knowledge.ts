import {KnowledgeType} from "@/models/knowledge";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

export async function fetchKnowledge(category: KnowledgeType, page = 1) {
    const res = await fetch(`${baseUrl}/api/config/knowledge?category=${category}&page=${page}`,
        {cache: 'no-store', credentials: 'include'}
    );

    if (!res.ok) {
        throw new Error('Failed to fetch config');
    }

    const result = await res.json();
    return result.knowledge || null;
}
