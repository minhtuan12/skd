const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

export async function fetchDetailNews(id: string) {
    const res = await fetch(`${baseUrl}/api/config/news/${id}`,
        {cache: 'no-store', credentials: 'include'}
    );

    if (!res.ok) {
        throw new Error('Failed to fetch detail news');
    }

    const result = await res.json();
    return result?.news || null;
}
