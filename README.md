# MochiPets - Kawaii NFT Companions on SUI

> A Tamagotchi-inspired NFT game where you mint, nurture, and care for adorable anime-style creatures. Neglect them and they're gone forever.

---

## Game Overview

**MochiPets** is a digital pet game built on the SUI blockchain. Players mint random cute companions through a gacha system, then must care for them daily to keep them alive. If a pet's satiety reaches zero, it's permanently burned - creating real stakes and emotional attachment.

### Theme & Aesthetic
- **Style:** Kawaii/Cute Anime
- **Colors:** Soft pastels (pink, lavender, mint, peach, baby blue)
- **Characters:** Round, squishy creatures with big eyes and simple expressions
- **UI:** Bubbly buttons, smooth animations, sparkle effects, soft shadows
- **Sound:** Gentle chimes, happy squeaks, satisfying feedback sounds

---

## Core Mechanics

### 1. Gacha Minting System
Players spend SUI to pull from the gacha and receive a random MochiPet.

| Rarity | Drop Rate | Base Stats | Visual |
|--------|-----------|------------|--------|
| Common | 60% | Low | Simple design, 1-2 colors |
| Rare | 25% | Medium | More details, accessories |
| Epic | 12% | High | Special effects, unique patterns |
| Legendary | 3% | Very High | Animated elements, rare species |

**Gacha Features:**
- Single pull or 10-pull (with guaranteed Rare+ on 10-pull)
- Pity system: Legendary guaranteed after 100 pulls without one
- Limited-time seasonal banners (Halloween, Christmas, etc.)

### 2. Pet Stats System

Each MochiPet has the following stats:

| Stat | Description | Decay Rate | Effect at 0 |
|------|-------------|------------|-------------|
| **Satiety** | Hunger level | -10/day | **DEATH (Burn)** |
| **Happiness** | Mood level | -5/day | Reduced rewards |
| **Energy** | Activity level | -8/day | Can't play games |
| **Hygiene** | Cleanliness | -3/day | Happiness decays faster |

### 3. Daily Care Actions

| Action | Effect | Cost | Cooldown |
|--------|--------|------|----------|
| Feed | +30 Satiety | Food Token | 8 hours |
| Play | +20 Happiness, -10 Energy | Free | 4 hours |
| Rest | +30 Energy | Free | 6 hours |
| Bath | +50 Hygiene | Free | 24 hours |
| Pet/Cuddle | +10 Happiness | Free | 1 hour |

### 4. Death & Burning
- When Satiety = 0, a 24-hour "Danger Zone" begins
- Visual warning: Pet looks sad, screen turns red/gray
- Push notification sent (if enabled)
- After 24 hours with 0 satiety: **Permanent burn**
- Burned pets are gone forever - creates scarcity and stakes

---

## Additional Fun Features

### 5. Food Token Economy
Instead of direct SUI payments for feeding, introduce a **Food Token** system:

**Earning Food Tokens:**
- Daily login bonus
- Complete mini-games
- Achievement rewards
- Trading/marketplace

**Food Types (different effects):**
| Food | Satiety | Bonus Effect | Rarity |
|------|---------|--------------|--------|
| Rice Ball | +20 | None | Common |
| Sushi | +30 | +5 Happiness | Common |
| Ramen | +40 | +10 Energy | Rare |
| Mochi | +50 | +15 All Stats | Rare |
| Golden Apple | +100 | Full heal | Legendary |

### 6. Mini-Games (Earn Food Tokens)

**a) Memory Match**
- Flip cards to match MochiPet pairs
- Higher scores = more tokens

**b) Catch the Stars**
- Tap falling stars, avoid bombs
- Simple but addictive

**c) Pet Race**
- Your pet auto-runs, tap to jump obstacles
- Endless runner style

### 7. Evolution System
Pets can evolve when conditions are met:

```
Stage 1 (Baby) → Stage 2 (Teen) → Stage 3 (Adult) → Stage 4 (Mythic)
```

**Evolution Requirements:**
- Days alive: 7 → 14 → 30
- Total happiness accumulated: 500 → 2000 → 10000
- Special items (rare drops from games)

Evolution changes:
- New appearance
- Boosted base stats
- Slower decay rates
- Unique abilities

### 8. Accessories & Customization
- Hats, bows, glasses, costumes
- Purchasable with Food Tokens
- Some are NFTs tradeable on marketplace
- Seasonal limited editions

### 9. Achievements & Badges
- "First Steps" - Mint your first pet
- "Dedicated Parent" - Keep a pet alive for 30 days
- "Collector" - Own 5 different species
- "Survivor" - Rescue a pet from Danger Zone
- "Legendary Luck" - Pull a Legendary

### 10. Social Features
- **Pet Showcase:** Share your pets on a public gallery
- **Friend System:** Visit friends' pets
- **Leaderboards:** Oldest pets, highest stats, most achievements
- **Gifting:** Send food tokens to friends

### 11. Seasonal Events
- **Cherry Blossom Festival:** Limited pink pets
- **Summer Beach:** Water-type pets, beach accessories
- **Halloween:** Spooky cute pets, costume items
- **Winter Holidays:** Snow pets, festive items

---

## Technical Architecture

### Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript |
| Blockchain | SUI Network |
| Wallet | SUI DappKit |
| Styling | TailwindCSS + Framer Motion |
| State | Zustand or React Query |
| Backend (optional) | Supabase (for notifications, leaderboards) |

### Smart Contract Structure (Move)

```
mochi_pets/
├── sources/
│   ├── pet.move           # Pet NFT object & core logic
│   ├── gacha.move         # Minting/gacha system
│   ├── food.move          # Food token & feeding
│   ├── stats.move         # Stats management & decay
│   ├── evolution.move     # Evolution logic
│   ├── accessories.move   # Customization items
│   └── game.move          # Mini-game rewards
```

### Key Contract Functions

```move
// Minting
public entry fun gacha_pull(payment: Coin<SUI>, ctx: &mut TxContext)
public entry fun gacha_pull_ten(payment: Coin<SUI>, ctx: &mut TxContext)

// Care Actions
public entry fun feed(pet: &mut MochiPet, food: FoodToken, clock: &Clock)
public entry fun play(pet: &mut MochiPet, clock: &Clock)
public entry fun rest(pet: &mut MochiPet, clock: &Clock)
public entry fun bathe(pet: &mut MochiPet, clock: &Clock)

// Stats
public fun check_and_update_stats(pet: &mut MochiPet, clock: &Clock)
public fun is_dead(pet: &MochiPet, clock: &Clock): bool

// Death
public entry fun check_death_and_burn(pet: MochiPet, clock: &Clock)
```

### Pet NFT Object Structure

```move
struct MochiPet has key, store {
    id: UID,
    name: String,
    species: u8,
    rarity: u8,

    // Stats (0-100)
    satiety: u64,
    happiness: u64,
    energy: u64,
    hygiene: u64,

    // Timestamps
    born_at: u64,
    last_fed: u64,
    last_played: u64,
    last_rested: u64,
    last_bathed: u64,

    // Evolution
    stage: u8,
    total_happiness: u64,

    // Visual
    accessories: vector<ID>,
    image_url: String,
}
```

---

## UI/UX Design Guidelines

### Color Palette
```
Primary:    #FFB6C1 (Light Pink)
Secondary:  #E6E6FA (Lavender)
Accent:     #98FB98 (Pale Green)
Background: #FFF5EE (Seashell)
Text:       #4A4A4A (Dark Gray)
Danger:     #FFB4B4 (Soft Red)
```

### Key Screens

1. **Home/Pet View**
   - Large animated pet in center
   - Stats bars visible (colorful, with icons)
   - Quick action buttons (Feed, Play, Rest, Bath)
   - Danger alert if stats critical

2. **Gacha Screen**
   - Spinning machine animation
   - Dramatic reveal animation for pulls
   - Confetti for rare+ pulls
   - Pull history

3. **Inventory**
   - Food items with quantities
   - Accessories grid
   - Equip/unequip interface

4. **Mini-Games Hub**
   - Card-based selection
   - High scores displayed
   - Reward preview

5. **Profile/Collection**
   - All owned pets (grid view)
   - Pet graveyard (burned pets memorial)
   - Achievement badges
   - Stats and playtime

### Animation Priorities
- Pet idle animations (breathing, blinking, small movements)
- Stat change feedback (numbers floating, bar animations)
- Feeding/playing reaction animations
- Gacha pull sequences
- Evolution transformation
- Death sequence (sad but not traumatic)

---

## Development Phases

### Phase 1: MVP (Core Loop)
- [ ] Basic SUI smart contract for Pet NFT
- [ ] Simple gacha minting (single pull)
- [ ] Satiety stat + feeding mechanic
- [ ] Death/burn mechanism
- [ ] Basic React UI with one pet view
- [ ] Wallet connection with DappKit

### Phase 2: Full Stats & Care
- [ ] All four stats (satiety, happiness, energy, hygiene)
- [ ] All care actions with cooldowns
- [ ] Food token system
- [ ] Danger zone warnings
- [ ] Improved UI with animations

### Phase 3: Engagement Features
- [ ] 10-pull gacha with pity system
- [ ] Mini-games (start with 1)
- [ ] Daily login rewards
- [ ] Achievement system
- [ ] Pet collection view

### Phase 4: Growth & Social
- [ ] Evolution system
- [ ] Accessories/customization
- [ ] Public pet gallery
- [ ] Leaderboards
- [ ] Friend system

### Phase 5: Polish & Events
- [ ] Full animation pass
- [ ] Sound effects & music
- [ ] First seasonal event
- [ ] Mobile responsiveness
- [ ] Push notifications

---

## File Structure (Frontend)

```
src/
├── components/
│   ├── pet/
│   │   ├── PetDisplay.tsx      # Main pet view with animations
│   │   ├── StatsBar.tsx        # Health/stat bars
│   │   └── ActionButtons.tsx   # Feed, play, rest, bath
│   ├── gacha/
│   │   ├── GachaMachine.tsx    # Pull animation
│   │   └── RevealCard.tsx      # New pet reveal
│   ├── games/
│   │   ├── MemoryMatch.tsx
│   │   └── CatchStars.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── Card.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Navigation.tsx
├── hooks/
│   ├── usePet.ts               # Pet data & actions
│   ├── useGacha.ts             # Minting logic
│   ├── useWallet.ts            # DappKit integration
│   └── useFoodTokens.ts        # Token balance
├── contracts/
│   └── interactions.ts         # Contract call wrappers
├── stores/
│   └── gameStore.ts            # Zustand state
├── types/
│   └── index.ts                # TypeScript types
├── utils/
│   └── helpers.ts
└── pages/
    ├── Home.tsx
    ├── Gacha.tsx
    ├── Games.tsx
    ├── Collection.tsx
    └── Profile.tsx
```

---

## Questions to Resolve

1. **Mint Price:** How much SUI per gacha pull?
2. **Max Pets:** Limit on how many pets one wallet can own?
3. **Species Count:** How many different pet designs for MVP?
4. **Decay Timing:** Real-time or epoch-based (cheaper on chain)?
5. **Multiplayer:** Any pet-vs-pet features planned?

---

## Name Alternatives

If "MochiPets" doesn't feel right:
- **Chibi Keepers**
- **Sui Spirits**
- **PetVerse**
- **Kawaii Companions**
- **FluffyChain**

---

## Summary

MochiPets combines the nostalgic Tamagotchi care loop with modern NFT mechanics on SUI. The permanent death creates real emotional stakes, while the gacha system and cute aesthetic make it addictive and shareable. The daily care loop is casual-friendly but the consequences are real.

**Core Hook:** "Your cute pet will die forever if you don't take care of it."

---

*Built with love on SUI Network*
