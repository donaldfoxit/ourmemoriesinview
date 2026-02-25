export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export interface Memory {
    id: string
    title: string
    date: string          // ISO date string e.g. "2024-06-15"
    location: string
    caption: string
    images: string[]      // First image = cover, rest = gallery
    tags: string[]
    season: Season
}

// ── Sample memories (replace images with your own!) ──
export const memories: Memory[] = [
    {
        id: 'beach-sunset',
        title: 'That sunset we almost missed',
        date: '2024-08-12',
        location: 'Lekki Beach, Lagos',
        caption: 'We were running late but the sky waited for us. Golden hour never looked this good.',
        images: [
            '/memories/beach-sunset/1.webp',
            'https://images.unsplash.com/photo-1476673160081-cf065607f449?w=800&q=80',
            'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
            'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=80',
        ],
        tags: ['Beach', 'Sunset', 'Date Night'],
        season: 'summer',
    },
    {
        id: 'rooftop-night',
        title: 'Rooftop conversations at 2am',
        date: '2024-11-03',
        location: 'Victoria Island, Lagos',
        caption: 'The city lights below us, your laughter above everything. Best night ever.',
        images: [
            'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80',
            'https://images.unsplash.com/photo-1444084316824-dc26d6657664?w=800&q=80',
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
        ],
        tags: ['Night Out', 'City Views'],
        season: 'autumn',
    },
    {
        id: 'first-trip',
        title: 'Our first trip together',
        date: '2024-03-22',
        location: 'Calabar, Nigeria',
        caption: 'Two suitcases, one playlist, and zero plans. The best kind of adventure.',
        images: [
            'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
            'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
            'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
            'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=80',
            'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&q=80',
        ],
        tags: ['Travel', 'Adventure', 'First Time'],
        season: 'spring',
    },
    {
        id: 'cozy-sunday',
        title: 'Cozy Sundays are our thing',
        date: '2024-12-15',
        location: 'Home',
        caption: 'Matching socks, bad movies, and the best jollof rice argument of the year.',
        images: [
            'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80',
            'https://images.unsplash.com/photo-1522264373430-3c3979642a82?w=800&q=80',
            'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80',
        ],
        tags: ['Home', 'Chill', 'Sunday'],
        season: 'winter',
    },
    {
        id: 'birthday-surprise',
        title: 'The surprise that made you cry',
        date: '2024-07-20',
        location: 'Ikeja, Lagos',
        caption: 'I had to lie for two weeks straight to pull this off. Worth every single one.',
        images: [
            'https://images.unsplash.com/photo-1529543544282-ea57407bc2e3?w=800&q=80',
            'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
            'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=800&q=80',
            'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800&q=80',
        ],
        tags: ['Birthday', 'Surprise', 'Celebration'],
        season: 'summer',
    },
    {
        id: 'random-wednesday',
        title: 'That random Wednesday',
        date: '2024-05-08',
        location: 'Ikoyi, Lagos',
        caption: 'No reason. No occasion. Just us deciding the middle of the week needed saving.',
        images: [
            'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
            'https://images.unsplash.com/photo-1496024840928-4c417adf211d?w=800&q=80',
            'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80',
        ],
        tags: ['Spontaneous', 'Just Because'],
        season: 'spring',
    },
]

// Helper: format date for display
export function formatMemoryDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}

// Helper: get days since a given start date
export function daysSince(startDate: string): number {
    const start = new Date(startDate)
    const now = new Date()
    return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}
