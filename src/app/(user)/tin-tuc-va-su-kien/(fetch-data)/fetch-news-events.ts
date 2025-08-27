const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

export async function fetchNewsEvents(type: 'news' | 'events' | 'researches', page = 1) {
    const res = await fetch(`${baseUrl}/api/config?page=news-events&type=${type}&pageNumber=${page}`,
        {cache: 'no-store', credentials: 'include'}
    );

    if (!res.ok) {
        throw new Error('Failed to fetch config');
    }

    let {config} = await res.json();
    return config[type];
}
