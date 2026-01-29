import React from 'react';
import { Destination, Phrase, SafetyTip, UserPersona, LocalHost, Trivia, CulturalNorm } from './types';

export const MOOD_DETAILS: Record<string, { title: string; description: string; image: string }> = {
  adventure: {
    title: 'Adventure',
    description: 'Adventure in Morocco is a journey through dramatic contrasts and unforgettable landscapes. Trek through the High Atlas Mountains with local guides, crossing remote Berber villages and panoramic passes. Ride camels across golden Sahara dunes, sleep under star-filled skies, and wake to desert silence. Along the Atlantic coast, surf powerful waves or try kitesurfing in breezy seaside towns. From off-road desert drives to hidden canyon hikes, every experience blends thrill with cultural depth, offering authentic encounters that turn adrenaline into lasting memories.',
    image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80&w=800'
  },
  relaxation: {
    title: 'Relaxation',
    description: 'Relaxation in Morocco is an art shaped by tradition, atmosphere, and time. Unwind in a centuries-old hammam as warm steam, black soap, and expert hands restore body and spirit. Retreat to peaceful riads hidden behind medina walls, where fountains murmur and courtyards glow at sunset. Along the coast, ocean breezes and quiet beaches invite slow mornings and reflective walks. Whether in a mountain lodge or desert camp, Morocco offers space to breathe, reset, and reconnect with yourself.',
    image: 'https://images.unsplash.com/photo-1534234828563-025c27633c7f?auto=format&fit=crop&q=80&w=800'
  },
  food: {
    title: 'Food',
    description: 'Moroccan food is a feast of flavor, history, and hospitality. Savor slow-cooked tagines infused with spices, enjoy fluffy couscous shared on Fridays, and discover delicate pastilla blending sweet and savory traditions. Each region adds its own signature, from coastal seafood to mountain comfort dishes. Wander lively markets tasting olives, breads, and sizzling street snacks, then pause for mint tea poured with ritual and care. Every meal is a story, inviting you to taste Morocco’s soul.',
    image: 'https://images.unsplash.com/photo-1541518738315-bb945a90e580?auto=format&fit=crop&q=80&w=800'
  },
  culture: {
    title: 'Culture',
    description: 'Moroccan culture is a rich tapestry woven from centuries of history and shared traditions. Walk through ancient medinas where craftsmanship, call to prayer, and daily life blend seamlessly. Discover Berber heritage in mountain villages, Andalusian echoes in music and architecture, and storytelling passed through generations. Festivals fill streets with color, rhythm, and celebration, while simple gestures—greetings, shared tea, respectful customs—create deep human connection. Experiencing Morocco means stepping into a living culture that welcomes curiosity and respect.',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=800'
  },
  shopping: {
    title: 'Shopping',
    description: 'Shopping in Morocco is an adventure of color, craft, and connection. Wander vibrant souks where artisans shape leather, weave carpets, paint ceramics, and hammer metal by hand. Each item carries a story, and bargaining becomes a friendly cultural exchange rather than a transaction. Beyond the markets, modern boutiques reinterpret tradition with contemporary design. Whether you seek timeless craftsmanship or unique gifts, shopping here is about discovery, dialogue, and taking home a piece of Moroccan artistry.',
    image: 'https://images.unsplash.com/photo-1544977421-4d1421691942?auto=format&fit=crop&q=80&w=800'
  }
};

export const LOCAL_HOSTS: LocalHost[] = [
  {
    id: 'h1',
    name: 'Fatima Zahra',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    location: 'Marrakech',
    address: 'Derb Dabachi, N 12, Medina',
    verified: true,
    rating: 4.9,
    reviewCount: 124,
    experienceType: 'food',
    languages: ['English', 'French', 'Darija'],
    price: '350 MAD',
    bio: 'Passionate home cook sharing secret family recipes in my Riad. Join me for an authentic market-to-table experience.'
  },
  {
    id: 'h2',
    name: 'Hassan',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    location: 'Imlil / Atlas',
    address: 'Douar Mzik, Imlil Center',
    verified: true,
    rating: 5.0,
    reviewCount: 89,
    experienceType: 'trekking',
    languages: ['English', 'Berber', 'Spanish'],
    price: '600 MAD',
    bio: 'Certified mountain guide with 15 years experience in the High Atlas. I know every trail and hidden valley.'
  },
  {
    id: 'h3',
    name: 'Youssef',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    location: 'Fes',
    address: 'Talaa Kebira, N 45',
    verified: true,
    rating: 4.8,
    reviewCount: 210,
    experienceType: 'history',
    languages: ['English', 'French', 'Arabic'],
    price: '300 MAD',
    bio: 'Historian and storyteller specializing in the spiritual heritage of Fes Medina and Islamic architecture.'
  },
  {
    id: 'h4',
    name: 'Khadija',
    image: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=200',
    location: 'Essaouira',
    address: 'Avenue Mohamed V, Apt 4',
    verified: false,
    rating: 4.7,
    reviewCount: 45,
    experienceType: 'artisan',
    languages: ['French', 'English'],
    price: '250 MAD',
    bio: 'Artist and weaver. I will take you to meet the best local woodworkers and silver jewelers in town.'
  },
  {
    id: 'h5',
    name: 'Omar',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    location: 'Merzouga',
    address: 'Hassi Labied, Merzouga Center',
    verified: true,
    rating: 5.0,
    reviewCount: 156,
    experienceType: 'trekking',
    languages: ['English', 'Italian', 'Berber'],
    price: '400 MAD',
    bio: 'Born in the dunes. Expert camel guide and astronomer. I will show you the Sahara like no one else.'
  }
];

export const DESTINATIONS: Destination[] = [
  {
    id: 'marrakech',
    name: 'Marrakech',
    image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&q=80&w=800',
    shortDescription: 'The Red City, famous for its bustling souks and Jemaa el-Fnaa.',
    fullDescription: 'Marrakech is a sensory overload in the best way possible. Explore the winding alleys of the Medina, relax in the Majorelle Garden, and witness the storytellers at Jemaa el-Fnaa square. The city blends ancient traditions with modern luxury, offering everything from historic palaces to chic rooftop bars. Be prepared for the vibrant chaos of the souks and the enchanting call to prayer echoing at sunset.',
    highlights: ['Jemaa el-Fnaa', 'Majorelle Garden', 'Bahia Palace'],
    bestTime: 'Spring (Mar-May) or Autumn (Sep-Nov)',
    type: 'city',
    coordinates: { lat: 31.6295, lng: -7.9811 },
    gallery: [
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1512101962386-36940d517838?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [
      {
        id: 'r1',
        userName: 'Sarah Jenkins',
        rating: 5,
        text: 'The Medina is intense but incredible. Make sure to download an offline map, it is easy to get lost in the souks! The food tour was the highlight.',
        date: '2024-02-15',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
      },
      {
        id: 'r2',
        userName: 'Marco Rossi',
        rating: 4,
        text: 'Beautiful architecture. Jemaa el-Fnaa is very crowded at night, keep your belongings close. The fresh orange juice stands are a must!',
        date: '2024-01-20',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100'
      }
    ]
  },
  {
    id: 'chefchaouen',
    name: 'Chefchaouen',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800',
    shortDescription: 'The Blue Pearl, nestled in the Rif Mountains.',
    fullDescription: 'Famous for its blue-washed buildings, Chefchaouen is a photographer’s dream and a peaceful retreat from the busier imperial cities. Great for hiking and relaxing. The town offers a unique blend of Moroccan and Andalusian influences, with red-tiled roofs, bright blue buildings, and narrow lanes converging on Plaza Uta el-Hammam and its restored kasbah.',
    highlights: ['The Blue Medina', 'Spanish Mosque', 'Kasbah Museum'],
    bestTime: 'Spring and Autumn',
    type: 'nature',
    coordinates: { lat: 35.1716, lng: -5.2697 },
    trekking: {
      routes: [
        { name: 'Spanish Mosque Trail', difficulty: 'Easy', duration: '45 mins', elevation: '+150m', desc: 'A gentle uphill walk paved with stairs leading to a historic mosque with the best sunset views over the blue city.' },
        { name: 'Akchour Waterfalls', difficulty: 'Moderate', duration: '3-4 hours', elevation: '+300m', desc: 'A scenic hike through the Rif mountains leading to the majestic God’s Bridge rock formation and crystal clear waterfalls.' },
        { name: 'Jebel al-Kalaa', difficulty: 'Hard', duration: '6-7 hours', elevation: '+800m', desc: 'A challenging summit hike offering panoramic views of the entire region. Requires good fitness and plenty of water.' }
      ],
      tips: ['Start Akchour early (8 AM) to avoid crowds.', 'Wear shoes with good grip; limestone can be slippery.', 'Respect local farmers along the trails.'],
      gear: ['Hiking boots', 'Swimsuit (for waterfalls)', 'Sun hat']
    },
    gallery: [
      'https://images.unsplash.com/photo-1534234828563-025c27633c7f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1539656247385-d72b26090c23?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [
      {
        id: 'r3',
        userName: 'Elena Petrova',
        rating: 5,
        text: 'Absolutely magical. Every corner is a photo opportunity. The hike up to the Spanish Mosque for sunset is mandatory!',
        date: '2024-03-10',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'
      }
    ]
  },
  {
    id: 'fes',
    name: 'Fes',
    image: 'https://images.unsplash.com/photo-1565538964724-4f06ed963624?auto=format&fit=crop&q=80&w=800',
    shortDescription: 'The spiritual and cultural heart of Morocco.',
    fullDescription: 'Home to the world’s oldest university and the largest car-free urban area. The Fes Medina is a labyrinth of history, craft, and tradition. It is a place where donkeys are the main mode of transport and ancient techniques are still used in tanneries and workshops. Losing yourself in its thousands of alleyways is part of the authentic experience.',
    highlights: ['Al Quaraouiyine University', 'Chouara Tannery', 'Bou Inania Madrasa'],
    bestTime: 'Spring or Autumn',
    type: 'city',
    coordinates: { lat: 34.0181, lng: -5.0078 },
    gallery: [
      'https://images.unsplash.com/photo-1535268065057-0b15b3c0c056?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1558258695-1e35a1cb3638?auto=format&fit=crop&q=80&w=800'
    ],
    reviews: [
      {
        id: 'r4',
        userName: 'Ahmed Al-Fayed',
        rating: 5,
        text: 'Fes feels like time travel. The craftsmanship in the woodworking museum is stunning. The tanneries smell strong, take the mint sprig they offer you!',
        date: '2023-11-05',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
      }
    ]
  },
  {
    id: 'merzouga',
    name: 'Merzouga',
    image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=800',
    shortDescription: 'Gateway to the Erg Chebbi dunes of the Sahara.',
    fullDescription: 'Experience the magic of the Sahara Desert. Ride camels into the sunset and sleep under a blanket of stars in a luxury desert camp. The dunes of Erg Chebbi rise dramatically from the desert floor, changing color with the moving sun. It is a profound place of silence and beauty, perfect for disconnecting from the modern world.',
    highlights: ['Camel Trekking', 'Star Gazing', 'Sandboarding'],
    bestTime: 'Winter (Oct-Feb)',
    type: 'nature',
    coordinates: { lat: 31.0802, lng: -4.0134 },
    gallery: [
      'https://images.unsplash.com/photo-1512591290618-974c500f0ddf?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1506466395995-1f9dfec9f345?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'essaouira',
    name: 'Essaouira',
    image: 'https://images.unsplash.com/photo-1575010666014-9989cb23b9d0?auto=format&fit=crop&q=80&w=800',
    shortDescription: 'A windy coastal town with a relaxed vibe.',
    fullDescription: 'Known as the "Wind City of Africa", it’s perfect for kitesurfing. The medina is a UNESCO site, and the fresh seafood is unmissable. With its blue boats, white-washed ramparts, and artist workshops, Essaouira offers a laid-back alternative to the intensity of Marrakech. The Gnawa music festival in summer is a major cultural highlight.',
    highlights: ['Skala de la Ville', 'Fresh Fish Market', 'Kitesurfing'],
    bestTime: 'Summer (Jun-Aug) for cool breezes',
    type: 'coastal',
    coordinates: { lat: 31.5085, lng: -9.7595 },
    gallery: [
      'https://images.unsplash.com/photo-1590324391672-03c6e919630c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1605218427368-3d1f03df52f8?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'tangier',
    name: 'Tangier',
    image: 'https://images.unsplash.com/photo-1582236357400-058df8385050?auto=format&fit=crop&q=80&w=800',
    shortDescription: 'Gateway to Africa, where the Mediterranean meets the Atlantic.',
    fullDescription: 'Tangier has long been a haven for artists and writers. Strategically located on the Strait of Gibraltar, it offers a fascinating mix of cultures. Explore the Kasbah, visit the Caves of Hercules, and enjoy the views from the legendary Cafe Hafa. The city is revitalized, boasting a new marina while keeping its historic charm.',
    highlights: ['Caves of Hercules', 'Cap Spartel', 'Kasbah Museum'],
    bestTime: 'Spring or Summer',
    type: 'coastal',
    coordinates: { lat: 35.7595, lng: -5.8340 },
    gallery: [
      'https://images.unsplash.com/photo-1627918344696-224855474320?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1559586616-361e18714958?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'dakhla',
    name: 'Dakhla',
    image: 'https://images.unsplash.com/photo-1621516943781-a1854c867a5e?auto=format&fit=crop&q=80&w=800',
    shortDescription: 'A desert peninsula meeting the Atlantic Ocean.',
    fullDescription: 'Dakhla is a unique paradise where golden sand dunes meet the turquoise waters of the lagoon. It is a world-class destination for kitesurfing and windsurfing. The serene atmosphere, fresh seafood (especially oysters), and desert landscapes make it a perfect escape for nature lovers and adventurers.',
    highlights: ['Kitesurfing', 'Dragon Island', 'White Dune'],
    bestTime: 'All year round',
    type: 'coastal',
    coordinates: { lat: 23.7095, lng: -15.9452 },
    gallery: [
      'https://images.unsplash.com/photo-1586943101559-4cdcf86a6f87?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1599925232773-4555d4978a30?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'casablanca',
    name: 'Casablanca',
    image: 'https://images.unsplash.com/photo-1577147443647-81856d5151af?auto=format&fit=crop&q=80&w=800',
    shortDescription: 'The modern economic hub and home to Hassan II Mosque.',
    fullDescription: 'Casablanca is Morocco’s largest city and economic powerhouse. It blends Mauresque architecture with modern art deco. The Hassan II Mosque, with its soaring minaret, is one of the few mosques in Morocco open to non-Muslims and is a masterpiece of craftsmanship. The Corniche offers a lively seaside promenade.',
    highlights: ['Hassan II Mosque', 'The Corniche', 'Art Deco Architecture'],
    bestTime: 'Spring or Autumn',
    type: 'city',
    coordinates: { lat: 33.5731, lng: -7.5898 },
    gallery: [
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1534008897995-27a23e859048?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'rabat',
    name: 'Rabat',
    image: 'https://images.unsplash.com/photo-1534017646733-149826f498c4?auto=format&fit=crop&q=80&w=800',
    shortDescription: 'The elegant capital city with deep history.',
    fullDescription: 'Rabat is a relaxed capital city with plenty of green spaces and historic sites. The Kasbah of the Udayas offers stunning ocean views and blue-white streets. The Hassan Tower and the Mausoleum of Mohammed V are iconic landmarks. It’s cleaner and calmer than other imperial cities, making it a pleasant stop.',
    highlights: ['Hassan Tower', 'Kasbah of the Udayas', 'Chellah Necropolis'],
    bestTime: 'Spring',
    type: 'city',
    coordinates: { lat: 34.0209, lng: -6.8416 },
    gallery: [
      'https://images.unsplash.com/photo-1594806820546-566b7c07b01d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'azilal',
    name: 'Azilal',
    image: 'https://images.unsplash.com/photo-1593365611681-70ee979c09c1?auto=format&fit=crop&q=80&w=800',
    shortDescription: 'Gateway to the stunning Ouzoud Waterfalls.',
    fullDescription: 'Located in the High Atlas mountains, Azilal is the capital of the M\'Goun Geopark. It is the perfect base for visiting the spectacular Ouzoud Waterfalls, the second tallest in Africa. The region offers incredible hiking opportunities, dinosaur tracks, and authentic Berber culture in a rugged, beautiful landscape.',
    highlights: ['Ouzoud Waterfalls', 'M\'Goun Geopark', 'Bin El Ouidane Dam'],
    bestTime: 'Spring (for water flow)',
    type: 'nature',
    coordinates: { lat: 31.9657, lng: -6.5716 },
    trekking: {
      routes: [
        { name: 'Ouzoud Falls Loop', difficulty: 'Easy', duration: '1.5 hours', elevation: '-110m', desc: 'Walk down to the bottom of the falls through olive groves and take the boat across. Watch out for wild monkeys!' },
        { name: 'Aït Bouguemez Valley', difficulty: 'Moderate', duration: '4-5 hours', elevation: '+200m', desc: 'Known as the "Happy Valley", this trek winds through traditional Berber villages and lush apple orchards.' },
        { name: 'M\'Goun Summit', difficulty: 'Hard', duration: '2 Days', elevation: '+4068m', desc: 'The second highest peak in North Africa. A serious expedition requiring a certified guide and mules.' }
      ],
      tips: ['Hire a mule for heavy packs in the valley.', 'Nights get very cold even in summer.', 'Carry water purification tablets.'],
      gear: ['Thermal layers', 'Trekking poles', 'Water filter']
    },
    gallery: [
      'https://images.unsplash.com/photo-1601051515222-261895a97573?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1590418606746-018840f9cd0f?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'beni-mellal',
    name: 'Beni Mellal',
    image: 'https://images.unsplash.com/photo-1628172944038-d698f192080a?auto=format&fit=crop&q=80&w=800',
    shortDescription: 'Located at the foot of Mount Tassemit.',
    fullDescription: 'Beni Mellal sits between the Middle Atlas plain and the mountains. It is famous for its oranges, olives, and the Ain Asserdoun spring and gardens, which offer panoramic views of the region. The Kasbah Bel-Kush overlooks the city. It is a refreshing stop for nature lovers exploring the interior of Morocco.',
    highlights: ['Ain Asserdoun', 'Kasbah Ras el Ain', 'Bin El Ouidane Lake'],
    bestTime: 'Spring',
    type: 'nature',
    coordinates: { lat: 32.3394, lng: -6.3608 },
    gallery: [
      'https://images.unsplash.com/photo-1634571936577-4b7194d8011c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1629831675765-b152d13b7768?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'ouarzazate',
    name: 'Ouarzazate',
    image: 'https://images.unsplash.com/photo-1535202636928-1b204e389df9?auto=format&fit=crop&q=80&w=800',
    shortDescription: 'The Hollywood of Africa and gateway to the Sahara.',
    fullDescription: 'Famous for its film studios and the nearby Ait Ben Haddou ksar (a UNESCO World Heritage site), Ouarzazate is a striking city of clay architecture against a desert backdrop. It is the primary staging point for expeditions into the desert and the Dadès Valley. The Taourirt Kasbah is another architectural gem within the city.',
    highlights: ['Ait Ben Haddou', 'Atlas Film Studios', 'Taourirt Kasbah'],
    bestTime: 'Autumn or Spring',
    type: 'nature',
    coordinates: { lat: 30.9189, lng: -6.8934 },
    trekking: {
      routes: [
        { name: 'Fint Oasis', difficulty: 'Easy', duration: '2 hours', elevation: 'Flat', desc: 'A peaceful walk through a lush green palm oasis hidden in the middle of the rocky desert landscape.' },
        { name: 'Todra Gorges', difficulty: 'Moderate', duration: '3 hours', elevation: '+150m', desc: 'Hike along the rim of the massive limestone river canyons. Spectacular geological formations.' }
      ],
      tips: ['Sun protection is critical; there is little shade.', 'Flash floods can occur in canyons when it rains.', 'Carry extra water.'],
      gear: ['Sunscreen (SPF 50)', 'Lightweight breathable clothes', 'Sand-proof shoes']
    },
    gallery: [
      'https://images.unsplash.com/photo-1518182170546-0766ce6fec56?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1549487532-6a84c600cb8e?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'agadir',
    name: 'Agadir',
    image: 'https://images.unsplash.com/photo-1541355444516-7788448f8041?auto=format&fit=crop&q=80&w=800',
    shortDescription: 'Modern beach resort city with over 300 days of sunshine.',
    fullDescription: 'Agadir is Morocco’s premier beach destination, rebuilt completely after the 1960 earthquake. It feels very modern compared to other Moroccan cities, with wide boulevards and a large marina. The long sandy beach is perfect for relaxing, and the nearby Taghazout area is a world-famous surfing spot. The Agadir Oufella ruins offer a great view of the bay.',
    highlights: ['Agadir Beach', 'Souk El Had', 'Valley of Birds'],
    bestTime: 'All year (Winter is mild)',
    type: 'coastal',
    coordinates: { lat: 30.4278, lng: -9.5981 },
    gallery: [
      'https://images.unsplash.com/photo-1580665324634-11005b6326c5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1647466542037-c1c431b9134c?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'meknes',
    name: 'Meknes',
    image: 'https://images.unsplash.com/photo-1576426863777-1a06700c5c46?auto=format&fit=crop&q=80&w=800',
    shortDescription: 'One of the four Imperial cities, known for its grand gates.',
    fullDescription: 'Meknes, often overshadowed by Fes, is a quieter imperial city with impressive architecture from the reign of Sultan Moulay Ismail. The Bab Mansour gate is arguably the most beautiful in Morocco. Nearby, the Roman ruins of Volubilis are the best-preserved in the country. The medina is easy to navigate and full of local charm.',
    highlights: ['Bab Mansour', 'Volubilis (nearby)', 'Heri es-Souani'],
    bestTime: 'Spring',
    type: 'city',
    coordinates: { lat: 33.8938, lng: -5.5516 },
    gallery: [
      'https://images.unsplash.com/photo-1591873268832-520626353d2d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1622312684824-340871899127?auto=format&fit=crop&q=80&w=800'
    ]
  }
];

export const PHRASES: Phrase[] = [
  { id: '1', english: 'Hello / Peace be upon you', darija: 'Salam Alaykum', pronunciation: 'Sah-lam Ah-lay-kum', category: 'greetings' },
  { id: '2', english: 'Thank you', darija: 'Shukran', pronunciation: 'Shouk-ran', category: 'greetings' },
  { id: '3', english: 'How much?', darija: 'Bshhal?', pronunciation: 'Bish-hal', category: 'shopping' },
  { id: '4', english: 'Too expensive', darija: 'Ghali bezzaf', pronunciation: 'Gha-lee bez-zaf', category: 'shopping' },
  { id: '5', english: 'Delicious', darija: 'Bnin', pronunciation: 'B-neen', category: 'dining' },
  { id: '6', english: 'No sugar', darija: 'Bla skar', pronunciation: 'Blah skar', category: 'dining' },
  { id: '7', english: 'Help!', darija: '3awnooni!', pronunciation: 'Ow-noo-nee', category: 'emergency' },
];

export const SAFETY_TIPS: SafetyTip[] = [
  { id: '1', title: 'Grand Taxis', content: 'Agree on a price before entering if there is no meter. For "Grand Taxis", you pay for a seat, or buy all 6 to hire the car.', icon: 'taxi' },
  { id: '2', title: 'Unofficial Guides', content: 'Avoid people offering unrequested directions. Use Google Maps or hire an official badge-wearing guide.', icon: 'map' },
  { id: '3', title: 'Drinking Water', content: 'Stick to bottled water to avoid stomach issues. Ensure the seal is unbroken.', icon: 'water' },
  { id: '4', title: 'The "Closed Road"', content: 'A common scam: Someone says "that street is closed" to divert you to their shop. Verify with your map.', icon: 'alert' },
  { id: '5', title: 'Henna Tattoos', content: 'Avoid "Black Henna" which can contain PPD and cause burns. Natural henna is orange/brown.', icon: 'alert' },
];

export const TRIVIA: Trivia[] = [
  { id: 't1', q: "What is the national drink often playfully called 'Berber Whiskey'?", a: "Mint Tea! It is served hot and sweet as a symbol of hospitality." },
  { id: 't2', q: "Which Moroccan city contains the world's largest car-free urban area?", a: "Fes (specifically Fes el Bali). You'll see donkeys instead of cars!" },
  { id: 't3', q: "Why is Chefchaouen painted blue?", a: "Theories range from repelling mosquitoes to symbolizing the sky and heaven." },
  { id: 't4', q: "What is the currency of Morocco?", a: "The Moroccan Dirham (MAD)." },
  { id: 't5', q: "Which movie famous for the line 'Here's looking at you, kid' is set in Morocco?", a: "Casablanca (1942), though it was mostly filmed in Hollywood!" }
];

export const CULTURAL_NORMS: CulturalNorm[] = [
  { id: 'c1', title: "Dress Modestly", content: "Cover shoulders and knees, especially in rural areas and Medinas. It's a sign of respect.", icon: 'shirt' },
  { id: 'c2', title: "Public Affection", content: "Kissing or hugging in public is culturally frowned upon. Hand-holding is okay for friends of same gender.", icon: 'handshake' },
  { id: 'c3', title: "Right Hand Rule", content: "Always use your right hand for eating (from communal plates) and greeting. The left is considered unclean.", icon: 'hand' },
  { id: 'c4', title: "Mosque Entry", content: "Non-Muslims generally cannot enter mosques, except for the Hassan II Mosque in Casablanca.", icon: 'moon' },
  { id: 'c5', title: "Photos", content: "Always ask permission before taking photos of people. Some may ask for a small tip.", icon: 'camera' },
];

export const THEME_COLORS = {
  terracotta: 'bg-orange-800',
  terracottaText: 'text-orange-900',
  saffron: 'bg-yellow-500',
  indigo: 'bg-blue-900',
  paper: 'bg-stone-50',
};

export const ZelligePattern = () => (
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 opacity-10 pointer-events-none">
    <pattern id="zellige" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
       <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="currentColor" />
       <circle cx="20" cy="20" r="5" fill="currentColor" />
    </pattern>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#zellige)" />
  </svg>
);