const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

export async function fetchKnowledgeCategory(categoryId: string) {
    const res = await fetch(`${baseUrl}/api/config/knowledge-category/${categoryId}`,
        {cache: 'no-store', credentials: 'include'}
    );

    if (!res.ok) {
        throw new Error('Failed to fetch knowledge category');
    }

    const result = await res.json();
    return result.pages || null;
}
