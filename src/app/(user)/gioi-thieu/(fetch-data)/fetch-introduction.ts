const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

export async function fetchIntroduction(page: string) {
    const res = await fetch(`${baseUrl}/api/config/introduction?page=${page}`,
        {cache: 'no-store', credentials: 'include'}
    );

    if (!res.ok) {
        throw new Error('Failed to fetch introduction');
    }
    return res.json();
}
