// Remote image helper (Unsplash) + curated pools per category.
export const unsplash = (id, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const imagePools = {
  'Graphic Design': [
    'photo-1561070791-2526d30994b5',
    'photo-1626785774573-4b799315345d',
    'photo-1558655146-9f40138edfeb',
    'photo-1572044162444-ad60f128bdea',
  ],
  'Web Development': [
    'photo-1498050108023-c5249f4df085',
    'photo-1461749280684-dccba630e2f6',
    'photo-1517180102446-f3ece451e9d8',
    'photo-1555066931-4365d14bab8c',
  ],
  'UI/UX Design': [
    'photo-1551650975-87deedd944c3',
    'photo-1586717791821-3f44a563fa4c',
    'photo-1559028012-481c04fa702d',
    'photo-1581291518857-4e27b48ff24e',
  ],
  'Video Editing': [
    'photo-1574717024653-61fd2cf4d44d',
    'photo-1536240478700-b869070f9279',
    'photo-1492619375914-88005aa9e8fb',
    'photo-1478720568477-152d9b164e26',
  ],
  'Content Writing': [
    'photo-1455390582262-044cdead277a',
    'photo-1499750310107-5fef28a66643',
    'photo-1486312338219-ce68d2c6f44d',
    'photo-1457369804613-52c61a468e7d',
  ],
  'Digital Marketing': [
    'photo-1460925895917-afdab827c52f',
    'photo-1611162617213-7d7a39e9b1d7',
    'photo-1432888498266-38ffec3eaf0a',
    'photo-1551288049-bebda4e38f71',
  ],
  Photography: [
    'photo-1452587925148-ce544e77e70d',
    'photo-1516035069371-29a1b244cc32',
    'photo-1502920917128-1aa500764cbd',
    'photo-1554048612-b6a482bc67e5',
  ],
  Animation: [
    'photo-1618005182384-a83a8bd57fbe',
    'photo-1633356122544-f134324a6cee',
    'photo-1550745165-9bc0b252726f',
    'photo-1578632767115-351597cf2477',
  ],
}

export const avatarIds = [
  'photo-1494790108377-be9c29b29330',
  'photo-1500648767791-00dcc994a43e',
  'photo-1438761681033-6461ffad8d80',
  'photo-1507003211169-0a1dd7228f2d',
  'photo-1573496359142-b8d87734a5a2',
  'photo-1472099645785-5658abf4ff4e',
  'photo-1534528741775-53994a69daeb',
  'photo-1506794778202-cad84cf45f1d',
]

export const poolImage = (category, index = 0, w = 800) => {
  const pool = imagePools[category] || imagePools['Graphic Design']
  return unsplash(pool[index % pool.length], w)
}
