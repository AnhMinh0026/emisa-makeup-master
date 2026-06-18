import GalleryGrid from '../../components/Gallery/GalleryGrid.jsx';

/* ── 9 editorial images, heights vary to create masonry rhythm ── */
const ALL_MOCKUP_IMAGES = [
  {
    id:       1,
    src:      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=90',
    alt:      'Editorial portrait — woman, pearl collar',
    height:   520,
    category: 'editorial',
  },
  {
    id:       2,
    src:      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=90',
    alt:      'Editorial — dramatic metallic eye makeup',
    height:   380,
    category: 'editorial',
  },
  {
    id:       3,
    src:      'https://images.unsplash.com/photo-1508341591423-4347099e1f19?w=800&q=90',
    alt:      'Fashion — oversized black suit, full body',
    height:   620,
    category: 'fashion',
  },
  {
    id:       4,
    src:      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=90',
    alt:      'Editorial — structured blazer, sharp tailoring',
    height:   440,
    category: 'editorial',
  },
  {
    id:       5,
    src:      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=90',
    alt:      'Portrait — male model, chiaroscuro lighting',
    height:   560,
    category: 'bridal',
  },
  {
    id:       6,
    src:      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=90',
    alt:      'Editorial — woman, avant-garde black attire',
    height:   400,
    category: 'creative',
  },
  {
    id:       7,
    src:      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=90',
    alt:      'Editorial — woman in white minimal dress',
    height:   480,
    category: 'bridal',
  },
  {
    id:       8,
    src:      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=90',
    alt:      'Fashion — model in structured coat',
    height:   360,
    category: 'fashion',
  },
  {
    id:       9,
    src:      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=90',
    alt:      'Abstract — architectural negative space',
    height:   300,
    category: 'creative',
  },
];

export { ALL_MOCKUP_IMAGES };

export default function Home() {
  return <GalleryGrid images={ALL_MOCKUP_IMAGES} />;
}
