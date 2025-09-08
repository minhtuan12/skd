const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

export async function fetchKnowledge(categoryId: string, page = 1) {
    const res = await fetch(`${baseUrl}/api/config/knowledge?category=${categoryId}&page=${page}`,
        {cache: 'no-store', credentials: 'include'}
    );

    if (!res.ok) {
        throw new Error('Failed to fetch knowledge');
    }

    const result = await res.json();
    return result.knowledge || null;
}
