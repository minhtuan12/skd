const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

export async function fetchHomeConfig() {
    const res = await fetch(`${baseUrl}/api/config?page=home`,
        {cache: 'no-store', credentials: 'include'}
    );

    if (!res.ok) {
        throw new Error('Failed to fetch config');
    }
    return res.json();
}