import { User, Mission, Lesson, LeaderboardEntry, Submission } from '../types';

export const INITIAL_USER: User = {
  id: 'u-1',
  name: 'Aarav Sharma',
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
  level: 3,
  levelTitle: 'Eco Advocate',
  xp: 950,
  streak: 5,
  missionsCompleted: 14,
  learningCompleted: 3,
  wasteCollectedKg: 12.5,
  treesPlanted: 4,
  volunteerHours: 8,
  badges: [
    {
      id: 'b-1',
      title: 'Action Pioneer',
      description: 'Completed your first verified real-world environmental action',
      icon: '🌱',
      isUnlocked: true,
      unlockedAt: '2026-09-10',
      progress: 100
    },
    {
      id: 'b-2',
      title: '5-Day Streak Fire',
      description: 'Took verified environmental action 5 days in a row',
      icon: '🔥',
      isUnlocked: true,
      unlockedAt: '2026-09-22',
      progress: 100
    },
    {
      id: 'b-3',
      title: 'Waste Diverter',
      description: 'Collected and diverted over 10 kg of plastic litter',
      icon: '♻️',
      isUnlocked: true,
      unlockedAt: '2026-09-18',
      progress: 100
    },
    {
      id: 'b-4',
      title: 'Canopy Planter',
      description: 'Plant and nurture 5 native saplings',
      icon: '🌳',
      isUnlocked: false,
      progress: 80
    },
    {
      id: 'b-5',
      title: 'Master Scholar',
      description: 'Complete all 4 EcoQuest Academy modules with 100% quiz scores',
      icon: '📚',
      isUnlocked: false,
      progress: 75
    }
  ]
};

export const SAMPLE_MISSIONS: Mission[] = [
  {
    id: 'm-1',
    title: 'Clean a Public Area or Park',
    category: 'Cleanup',
    difficulty: 'Medium',
    xpReward: 150,
    estimatedTime: '60 min',
    location: 'Local Park, Lake Trail, or Street Verge',
    description: 'Find a public open space suffering from discarded plastic packaging and litter. Safely collect at least one full bag of trash, segregate recyclables, and leave the area visibly cleaner.',
    whyItMatters: 'Uncollected urban plastic washes into storm drains and local water bodies during rains, breaking down into toxic microplastics that enter the food chain.',
    steps: [
      'Equip yourself with puncture-proof gardening gloves and heavy-duty bags.',
      'Take a clear, wide-angle "Before" photo showing the littered ground.',
      'Collect and segregate plastics, cans, and wrappers from organic debris.',
      'Deposit the trash into an authorized municipal collection bin.',
      'Take an "After" photo from the identical vantage point showing the clean area.'
    ],
    safetyGuidelines: [
      'Always wear sturdy protective gloves.',
      'Do not pick up broken glass or medical waste; report hazardous items to local municipal authorities.',
      'Stay hydrated and avoid high heat hours.'
    ],
    verificationRequirements: 'Before and After photos from the same angle + GPS location confirmation.',
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
    completions: 342
  },
  {
    id: 'm-2',
    title: 'Plant a Native Sapling',
    category: 'Planting',
    difficulty: 'Medium',
    xpReward: 200,
    estimatedTime: '45 min',
    location: 'Community Garden, Campus, or Permitted Plot',
    description: 'Plant a native tree species (such as Neem, Peepal, or Jamun) suited to your regional soil. Create a deep watering basin and secure the sapling with a protective stake.',
    whyItMatters: 'Native trees sequester carbon, recharge groundwater aquifers, and provide vital habitat for urban pollinators and birds.',
    steps: [
      'Obtain a healthy native sapling (minimum 2.5 feet tall).',
      'Dig a pit twice as wide as the root ball and just as deep.',
      'Snap a "Before" photo showing the sapling alongside the dug pit.',
      'Plant the sapling, refill with soil and compost, and water deeply.',
      'Snap the "After" photo showing the planted tree with its supportive stake.'
    ],
    safetyGuidelines: [
      'Confirm planting permission from campus administration or municipal office.',
      'Ensure the site is clear of underground utility pipes and overhead cables.'
    ],
    verificationRequirements: 'Photo of the dug pit/sapling + Photo of the planted tree with support stake + GPS tag.',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    completions: 512
  },
  {
    id: 'm-3',
    title: 'Collect & Segregate Recyclable Waste',
    category: 'Recycling',
    difficulty: 'Easy',
    xpReward: 100,
    estimatedTime: '30 min',
    location: 'Home, Hostel, or Canteen',
    description: 'Conduct a thorough waste segregation audit. Separate clean dry plastics, paper, and glass from wet organic waste to ensure high recycling efficiency.',
    whyItMatters: 'Over 80% of recyclable material ends up in open landfills simply because it gets contaminated by wet food waste at the source.',
    steps: [
      'Gather mixed household or hostel recyclables.',
      'Take a "Before" photo of the mixed waste.',
      'Rinse plastic bottles and sort into paper, plastics, and metals.',
      'Deliver to a local recycler or deposit in designated dry waste bins.',
      'Take an "After" photo showing the neatly sorted bins.'
    ],
    safetyGuidelines: [
      'Wash hands thoroughly after handling unsegregated materials.',
      'Store any broken glass in a labeled rigid container.'
    ],
    verificationRequirements: 'Before photo of mixed waste vs. After photo of clean segregated categories.',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    completions: 689
  },
  {
    id: 'm-4',
    title: 'Audit & Stop Water Wastage',
    category: 'Water',
    difficulty: 'Easy',
    xpReward: 80,
    estimatedTime: '20 min',
    location: 'Campus, Workplace, or Community Faucets',
    description: 'Inspect public faucets and coolers. Detect leaking valves, tighten loose fixtures, install a water aerator, or file an actionable maintenance ticket with photo proof.',
    whyItMatters: 'A single faucet leaking one drip per second wastes over 11,000 liters of clean drinking water every year.',
    steps: [
      'Inspect 5-10 water faucets in your area.',
      'Photograph any continuously dripping tap ("Before").',
      'Tighten the fixture, install an aerator, or submit a formal facility repair request.',
      'Take an "After" photo of the sealed faucet or approved maintenance receipt.'
    ],
    safetyGuidelines: [
      'Do not apply excessive force to brittle plastic plumbing.',
      'Report large pipe bursts to emergency facilities immediately.'
    ],
    verificationRequirements: 'Before photo of the leak + After photo of the repaired fixture or maintenance ticket.',
    imageUrl: 'https://images.unsplash.com/photo-1584772186835-71bf9e691230?auto=format&fit=crop&w=800&q=80',
    completions: 278
  },
  {
    id: 'm-5',
    title: 'Zero-Emission Commute Challenge',
    category: 'Transit',
    difficulty: 'Medium',
    xpReward: 120,
    estimatedTime: '45 min',
    location: 'City Route / Campus Transit',
    description: 'Swap personal motorized transit for a zero-emission commute. Walk, cycle, or use pedal-assist transit for a trip of at least 5 kilometers.',
    whyItMatters: 'Short vehicular trips produce disproportionate ground-level PM2.5 and carbon emissions in Indian metropolises.',
    steps: [
      'Plan a safe cycling or walking route.',
      'Start your tracking app (Strava, Google Fit, Apple Fitness).',
      'Take a photo of your bike/shoes at departure ("Before").',
      'Complete the 5km journey and take a screenshot of your GPS route ("After").'
    ],
    safetyGuidelines: [
      'Always wear a certified bicycle helmet and reflective accessories.',
      'Follow designated cycling paths and obey local traffic signals.'
    ],
    verificationRequirements: 'Departure photo + Route tracker screenshot showing >= 5km non-motorized commute.',
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    completions: 520
  },
  {
    id: 'm-6',
    title: 'Maintain & Adopt a Planted Tree',
    category: 'Planting',
    difficulty: 'Easy',
    xpReward: 90,
    estimatedTime: '25 min',
    location: 'Neighborhood Park or Roadside Tree',
    description: 'Adopting a young sapling during dry periods dramatically increases its survival rate. Clear weed competition, apply natural mulch, and provide 15 liters of water.',
    whyItMatters: 'Planting is only half the battle; without care during the first 18 months, tree mortality rates exceed 60%.',
    steps: [
      'Locate a young tree in need of water or weed clearing.',
      'Take a "Before" photo showing dry soil or weed overgrowth.',
      'Clear weeds in a 1-meter radius and apply organic dry-leaf mulch.',
      'Water thoroughly with 15 liters of water.',
      'Take the "After" photo showcasing the refreshed basin.'
    ],
    safetyGuidelines: [
      'Watch for thorns and stinging insects in dense underbrush.',
      'Avoid damaging tree bark when clearing weeds.'
    ],
    verificationRequirements: 'Before photo of neglected basin + After photo of weeded, mulched, and watered tree.',
    imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
    completions: 415
  }
];

export const SAMPLE_LESSONS: Lesson[] = [
  {
    id: 'les-1',
    title: 'The Microplastic Crisis: Why Single-Use Plastic Matters',
    category: 'Waste Management',
    readTime: '4 min',
    xpReward: 50,
    summary: 'How everyday single-use plastics fragment into microscopic particles that contaminate oceans, soil, and human bloodstreams.',
    icon: '🥤',
    slides: [
      {
        title: 'The Modern Plastic Paradox',
        content: 'Nearly 40% of all plastic produced worldwide is designed to be used exactly once and discarded within minutes. However, petroleum-based polymers do not biodegrade—they persist for centuries.',
        keyStat: '400 Million Tons of plastic waste produced annually; less than 9% is recycled.',
        takeaway: 'Recycling alone cannot solve the plastic crisis; source reduction and refusal of single-use items is essential.'
      },
      {
        title: 'The Invisible Infiltration of Microplastics',
        content: 'Under solar UV radiation and physical abrasion, bottles and bags break down into microplastics (< 5mm). These particles absorb heavy toxic metals and have been found in drinking water, sea salt, and human lung tissue.',
        keyStat: '5 Grams of microplastics ingested by an average adult weekly (roughly the weight of a credit card).',
        takeaway: 'Removing plastic litter before it reaches water drains directly prevents toxic microplastic formation.'
      }
    ],
    quiz: [
      {
        question: 'Approximately what percentage of all plastic produced globally has actually been recycled?',
        options: ['Around 9%', 'About 45%', 'Over 75%', 'Almost 90%'],
        correctIndex: 0,
        explanation: 'Only about 9% of all plastic waste has been recycled; the vast majority ends up in landfills, incinerators, or open ecosystems.'
      },
      {
        question: 'What happens to plastic items when exposed to sun and outdoor elements?',
        options: ['They biodegrade into natural fertilizer', 'They shatter into microscopic microplastic fragments', 'They dissolve harmlessly in rainwater', 'They turn into clean energy'],
        correctIndex: 1,
        explanation: 'Solar UV rays and friction fragment plastic into microplastics that persist indefinitely.'
      },
      {
        question: 'What is the highest-impact first step an individual can take?',
        options: ['Refusing single-use plastics and adopting circular reusables', 'Buying more plastic trash bins', 'Burning plastics at home', 'Waiting for new laws'],
        correctIndex: 0,
        explanation: 'Refusing single-use items cuts plastic demand at the source with immediate results.'
      }
    ],
    actionMissionId: 'm-3'
  },
  {
    id: 'les-2',
    title: 'Miyawaki Urban Forests: Cooling Cities Naturally',
    category: 'Urban Biodiversity',
    readTime: '4 min',
    xpReward: 50,
    summary: 'How planting dense, multi-layered native micro-forests grows trees 10x faster and combats urban heat islands.',
    icon: '🌳',
    slides: [
      {
        title: 'The Urban Heat Island Phenomenon',
        content: 'Concrete, asphalt, and tall buildings absorb solar heat throughout the day, raising city temperatures by 3°C to 7°C compared to surrounding green countryside. Mature tree canopies provide nature\'s most effective natural cooling.',
        keyStat: 'Tree canopy shade lowers localized ground surface temperatures by up to 12°C.',
        takeaway: 'Cities need dense, multi-tiered green buffers right in urban neighborhoods.'
      },
      {
        title: 'The Miyawaki Method Explained',
        content: 'Developed by botanist Akira Miyawaki, this method plants 30+ native species in close proximity across 4 tiers: shrubs, sub-trees, canopy trees, and canopy giants. Natural competition for sunlight accelerates upward growth by 10x.',
        keyStat: '10x faster growth and 30x higher biodiversity than conventional monoculture plantations.',
        takeaway: 'High density and native soil preparation allow micro-forests to become self-sustaining in just 2 years.'
      }
    ],
    quiz: [
      {
        question: 'Why do Miyawaki micro-forests grow up to 10 times faster?',
        options: ['Dense co-planting of diverse native species that compete for sunlight', 'Chemical growth hormones', 'Artificial ultraviolet lights', 'Flooding roots with salt water'],
        correctIndex: 0,
        explanation: 'Simulating natural forest competition by co-planting native species encourages rapid vertical canopy growth.'
      },
      {
        question: 'What is the "Urban Heat Island" effect?',
        options: ['Higher temperatures in urban areas caused by concrete, asphalt, and low tree cover', 'A resort built inside a city', 'Geothermal energy under metro tracks', 'Heat caused only by solar flares'],
        correctIndex: 0,
        explanation: 'Dense urban surfaces trap heat and re-radiate it, causing cities to be significantly hotter than surrounding rural areas.'
      }
    ],
    actionMissionId: 'm-2'
  },
  {
    id: 'les-3',
    title: 'The Virtual Water Footprint: Beyond the Tap',
    category: 'Water Conservation',
    readTime: '4 min',
    xpReward: 50,
    summary: 'Discover virtual water: the staggering thousands of liters hidden inside everyday consumer goods, food, and clothes.',
    icon: '💧',
    slides: [
      {
        title: 'Direct vs. Virtual Water Consumption',
        content: 'While you may use 150 liters directly each day for drinking and showers, your indirect "virtual water" consumption averages 3,500 to 4,000 liters daily embedded in food, cotton garments, and manufactured electronics.',
        keyStat: '2,700 Liters of freshwater required to manufacture a single cotton t-shirt.',
        takeaway: 'True water conservation requires looking at production lifecycles, not just turning off the tap.'
      },
      {
        title: 'Simple Interventions with Giant Impact',
        content: 'Installing a water aerator nozzle onto standard faucets cuts flow volume by 50% without reducing water pressure. Fixing one leaking toilet flapper saves up to 750 liters every week.',
        keyStat: 'A leaking tap dripping once per second wastes over 11,000 liters per year.',
        takeaway: 'Auditing and fixing small leaks across your campus or home creates massive collective water savings.'
      }
    ],
    quiz: [
      {
        question: 'What is "virtual water"?',
        options: ['The hidden freshwater used throughout the supply chain of goods and food', 'Water simulated in video games', 'Desalinated seawater for cooling data centers', 'Mineral water in digital bottles'],
        correctIndex: 0,
        explanation: 'Virtual water accounts for all freshwater consumed to grow, manufacture, and transport products.'
      },
      {
        question: 'How much water volume can a faucet aerator save?',
        options: ['Up to 50% without loss of perceived water pressure', 'Less than 2%', '100% (stops water completely)', 'Aerators increase water usage'],
        correctIndex: 0,
        explanation: 'Aerators mix air into the flow, cutting actual water volume by 30-50% while maintaining strong stream force.'
      }
    ],
    actionMissionId: 'm-4'
  },
  {
    id: 'les-4',
    title: 'Clean Urban Air: Mitigating PM2.5 at the Source',
    category: 'Clean Air',
    readTime: '4 min',
    xpReward: 50,
    summary: 'The science of fine particulate matter and why zero-emission transit is the most effective solution for city smog.',
    icon: '🚲',
    slides: [
      {
        title: 'Understanding PM2.5 Particulates',
        content: 'PM2.5 particles are under 2.5 microns wide—30 times smaller than the diameter of a human hair. Because of their tiny size, they bypass nasal filters and penetrate deep into lung alveoli and the bloodstream.',
        keyStat: 'Over 90% of urban residents breathe air exceeding WHO annual safety guidelines.',
        takeaway: 'Tailpipe emissions and road dust are the leading contributors to urban smog.'
      },
      {
        title: 'Shifting to Zero-Emission Commutes',
        content: 'A single 5 km cycling or walking trip eliminates ~1.2 kg of direct vehicular CO2 and harmful nitrogen oxides. Shifting short urban trips to active transit dramatically reduces localized neighborhood pollution.',
        keyStat: 'Replacing one short car trip daily cuts personal transport carbon by over 0.5 tons annually.',
        takeaway: 'Every kilometer traveled without an engine is a breath of clean air for your community.'
      }
    ],
    quiz: [
      {
        question: 'Why are PM2.5 particles particularly hazardous to human health?',
        options: ['They penetrate deep into the lungs and enter the bloodstream', 'They turn rainwater bright green', 'They only harm outdoor plants', 'They have a strong sour smell'],
        correctIndex: 0,
        explanation: 'Their microscopic size allows PM2.5 particles to bypass human airway filters and enter the bloodstream.'
      },
      {
        question: 'What is the most effective way to cut ground-level urban pollution?',
        options: ['Shifting short trips to walking, cycling, or public electric transit', 'Outdoor giant fans', 'Spraying perfume across roads', 'Leaving indoor AC on 24/7'],
        correctIndex: 0,
        explanation: 'Preventing emissions at the source through zero-emission transit creates lasting air quality dividends.'
      }
    ],
    actionMissionId: 'm-5'
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Rohit Verma', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80', city: 'Delhi NCR', xp: 2450, missions: 28 },
  { rank: 2, name: 'Priya Patel', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80', city: 'Bengaluru', xp: 2180, missions: 25 },
  { rank: 3, name: 'Ananya Deshmukh', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80', city: 'Pune', xp: 1840, missions: 21 },
  { rank: 4, name: 'Karthik Raja', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80', city: 'Chennai', xp: 1420, missions: 16 },
  { rank: 5, name: 'Aarav Sharma (You)', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=128&q=80', city: 'Hyderabad', xp: 950, missions: 14, isCurrentUser: true },
  { rank: 6, name: 'Neha Banerjee', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=128&q=80', city: 'Kolkata', xp: 820, missions: 11 }
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-1',
    missionId: 'm-1',
    missionTitle: 'Clean a Public Area or Park',
    beforePhoto: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80',
    afterPhoto: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    location: 'KBR Park Perimeter Trail, Hyderabad',
    timestamp: '2026-09-22 15:30 IST',
    notes: 'Collected 2 full bags of PET bottles and plastic snack packaging from the walkway.',
    status: 'verified',
    xpEarned: 150
  },
  {
    id: 'sub-2',
    missionId: 'm-2',
    missionTitle: 'Plant a Native Sapling',
    beforePhoto: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    afterPhoto: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    location: 'Campus Green Belt, Hyderabad',
    timestamp: '2026-09-19 10:15 IST',
    notes: 'Planted native Neem tree with support stake and soil mulch basin.',
    status: 'verified',
    xpEarned: 200
  }
];
