const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

export async function fetchPolicyDocument(page = 1) {
    const res = await fetch(`${baseUrl}/api/config/policy-document?page=${page}`,
        {cache: 'no-store', credentials: 'include'}
    );

    if (!res.ok) {
        throw new Error('Failed to fetch document');
    }

    const result = await res.json();
    return result.documents || null;
}
