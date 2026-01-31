# Phase 1: Minimum Viable Pet

> The simplest possible version that proves the core concept works.

---

## Goal

**One sentence:** Mint pets, feed them daily, or they die forever.

---

## Scope - What We Build

| Include | Exclude (for later) |
|---------|---------------------|
| Mint multiple pets | Gacha/randomness |
| ONE stat (Satiety) | Happiness, Energy, Hygiene |
| ONE action (Feed) | Play, Rest, Bath |
| Transfer pets | Danger zone warnings |
| Death = Burn | Animations, sound |
| Pet collection view | Leaderboards, social |
| Wallet connect | |

---

## Smart Contract (Move)

### Single File: `mochi_pet.move`

```move
module mochi_pets::pet {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::clock::{Self, Clock};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use std::string::{Self, String};

    // ============ Constants ============
    const MINT_PRICE: u64 = 100_000_000; // 0.1 SUI
    const MAX_SATIETY: u64 = 100;
    const SATIETY_DECAY_PER_DAY: u64 = 10;
    const MS_PER_DAY: u64 = 86_400_000;

    // ============ Errors ============
    const EInsufficientPayment: u64 = 0;
    const EPetIsDead: u64 = 1;
    const EAlreadyFedToday: u64 = 2;

    // ============ Objects ============
    struct MochiPet has key, store {
        id: UID,
        name: String,
        satiety: u64,
        born_at: u64,
        last_fed: u64,
    }

    struct GameTreasury has key {
        id: UID,
        balance: u64,
    }

    // ============ Init ============
    fun init(ctx: &mut TxContext) {
        transfer::share_object(GameTreasury {
            id: object::new(ctx),
            balance: 0,
        });
    }

    // ============ Mint ============
    public entry fun mint(
        payment: Coin<SUI>,
        name: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(coin::value(&payment) >= MINT_PRICE, EInsufficientPayment);

        // Handle payment (simplified - just destroy for MVP)
        transfer::public_transfer(payment, @treasury_address);

        let now = clock::timestamp_ms(clock);

        let pet = MochiPet {
            id: object::new(ctx),
            name: string::utf8(name),
            satiety: MAX_SATIETY,
            born_at: now,
            last_fed: now,
        };

        transfer::transfer(pet, tx_context::sender(ctx));
    }

    // ============ Feed ============
    public entry fun feed(
        pet: &mut MochiPet,
        clock: &Clock,
    ) {
        let now = clock::timestamp_ms(clock);
        let current_satiety = calculate_current_satiety(pet, now);

        assert!(current_satiety > 0, EPetIsDead);

        // Update satiety (cap at MAX)
        pet.satiety = if (current_satiety + 30 > MAX_SATIETY) {
            MAX_SATIETY
        } else {
            current_satiety + 30
        };
        pet.last_fed = now;
    }

    // ============ Transfer ============
    public entry fun transfer_pet(
        pet: MochiPet,
        recipient: address,
        clock: &Clock,
    ) {
        // Can only transfer living pets
        let current_satiety = calculate_current_satiety(&pet, clock::timestamp_ms(clock));
        assert!(current_satiety > 0, EPetIsDead);

        transfer::public_transfer(pet, recipient);
    }

    // ============ Check & Burn ============
    public entry fun check_and_burn(
        pet: MochiPet,
        clock: &Clock,
    ) {
        let now = clock::timestamp_ms(clock);
        let current_satiety = calculate_current_satiety(&pet, now);

        assert!(current_satiety == 0, EPetIsDead);

        // Burn the pet
        let MochiPet { id, name: _, satiety: _, born_at: _, last_fed: _ } = pet;
        object::delete(id);
    }

    // ============ View Functions ============
    public fun get_current_satiety(pet: &MochiPet, clock: &Clock): u64 {
        calculate_current_satiety(pet, clock::timestamp_ms(clock))
    }

    public fun is_alive(pet: &MochiPet, clock: &Clock): bool {
        get_current_satiety(pet, clock) > 0
    }

    // ============ Internal ============
    fun calculate_current_satiety(pet: &MochiPet, now: u64): u64 {
        let time_passed = now - pet.last_fed;
        let days_passed = time_passed / MS_PER_DAY;
        let decay = days_passed * SATIETY_DECAY_PER_DAY;

        if (decay >= pet.satiety) {
            0
        } else {
            pet.satiety - decay
        }
    }
}
```

### Contract Summary

| Function | What it does |
|----------|--------------|
| `mint()` | Pay 0.1 SUI → Get pet with 100 satiety (no limit, mint as many as you want) |
| `feed()` | Add +30 satiety (max 100) |
| `transfer_pet()` | Send pet to another wallet (only if alive) |
| `check_and_burn()` | If satiety = 0, delete pet forever |
| `get_current_satiety()` | Calculate live satiety based on time |

---

## Frontend Structure

```
src/
├── App.tsx                 # Main app
├── main.tsx               # Entry point
├── index.css              # Tailwind + global styles
│
├── components/
│   ├── WalletButton.tsx   # Connect wallet
│   ├── PetGrid.tsx        # Grid of all user's pets
│   ├── PetCard.tsx        # Single pet display
│   ├── SatietyBar.tsx     # Stat bar component
│   ├── MintForm.tsx       # Mint new pet form
│   ├── TransferModal.tsx  # Send pet to another wallet
│   └── EmptyState.tsx     # No pets message
│
├── hooks/
│   ├── useWallet.ts       # DappKit wallet hook
│   └── usePets.ts         # Fetch ALL owned pets
│
├── lib/
│   └── contracts.ts       # Contract addresses & calls
│
└── types/
    └── index.ts           # TypeScript types
```

---

## UI Screens (2 Total)

### Screen 1: Home / Collection

Shows all user's pets in a grid. Mint button always visible.

```
┌─────────────────────────────────────────────────────┐
│  MochiPets            [Wallet: 0x1a2b...] [Disconnect]
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │            Mint New Pet (0.1 SUI)            │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Your Pets (3)                                      │
│                                                     │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ │
│  │    (◕‿◕)      │ │    (◕‿◕)      │ │    (✖_✖)      │ │
│  │   "Fluffy"    │ │   "Mochi"     │ │   "Boba"      │ │
│  │  ████████░░   │ │  ██████░░░░   │ │  ░░░░░░░░░░   │ │
│  │    80/100     │ │    60/100     │ │    DEAD       │ │
│  │ [Feed] [Send] │ │ [Feed] [Send] │ │    [Burn]     │ │
│  └───────────────┘ └───────────────┘ └───────────────┘ │
│                                                     │
│  ─────────────────────────────────────────────────  │
│  No pets yet? Mint your first companion above!      │
└─────────────────────────────────────────────────────┘
```

### Screen 2: Pet Detail (Modal or Expanded View)

When user clicks on a pet card:

```
┌─────────────────────────────────────┐
│  ← Back                             │
│                                     │
│         (◕‿◕)                       │
│        MochiPet                     │
│       "Fluffy"                      │
│                                     │
│  Satiety: ████████░░ 80/100         │
│                                     │
│  Status: Happy & Healthy            │
│  Born: 3 days ago                   │
│  ID: 0x7f8a...                      │
│                                     │
│    ┌───────────┐  ┌───────────┐     │
│    │  🍙 Feed  │  │  📤 Send  │     │
│    └───────────┘  └───────────┘     │
│                                     │
└─────────────────────────────────────┘
```

### Screen 3: Transfer Modal

When user clicks "Send":

```
┌─────────────────────────────────────┐
│  Send "Fluffy" to another wallet    │
│                                     │
│  Recipient Address:                 │
│  ┌─────────────────────────────┐    │
│  │ 0x...                       │    │
│  └─────────────────────────────┘    │
│                                     │
│  ⚠️  This action cannot be undone   │
│                                     │
│    ┌───────────┐  ┌───────────┐     │
│    │  Cancel   │  │  Confirm  │     │
│    └───────────┘  └───────────┘     │
│                                     │
└─────────────────────────────────────┘
```

### Empty State (No Pets)

```
┌─────────────────────────────────────────────────────┐
│  MochiPets            [Wallet: 0x1a2b...] [Disconnect]
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │            Mint New Pet (0.1 SUI)            │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│                      🥚                             │
│                                                     │
│            You don't have any pets yet!             │
│         Mint your first companion above.            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Dead Pet State (in card)

```
┌─────────────┐
│   (✖_✖)     │
│  "Boba"     │
│  ░░░░░░░░░░ │
│   DEAD      │
│  [Burn]     │  ← Burns NFT, removes from collection
└─────────────┘
```

---

## Component Specs

### `WalletButton.tsx`
- Uses `@mysten/dapp-kit`
- Shows "Connect Wallet" or truncated address
- Disconnect option

### `PetGrid.tsx`
```tsx
interface PetGridProps {
  pets: Pet[];
  onFeed: (petId: string) => void;
  onTransfer: (petId: string, recipient: string) => void;
  onBurn: (petId: string) => void;
}
```
- Renders grid of `PetCard` components
- Responsive: 1 col mobile, 2 col tablet, 3+ col desktop
- Shows empty state if no pets

### `PetCard.tsx`
```tsx
interface PetCardProps {
  id: string;
  name: string;
  satiety: number;      // 0-100
  bornAt: number;       // timestamp
  isAlive: boolean;
  onFeed: () => void;
  onTransfer: () => void;
  onBurn: () => void;
}
```
- Shows pet emoji/image based on status
- Satiety bar with color gradient (green → yellow → red)
- Feed + Transfer buttons (if alive) or Burn button (if dead)
- Compact card design for grid view

### `TransferModal.tsx`
```tsx
interface TransferModalProps {
  petId: string;
  petName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (recipient: string) => void;
}
```
- Input field for recipient wallet address
- Confirm/cancel buttons
- Validates SUI address format

### `MintForm.tsx`
- Input field for pet name
- Calls `mint()` with 0.1 SUI
- Loading state during transaction
- Always visible at top of page

### `SatietyBar.tsx`
```tsx
interface SatietyBarProps {
  value: number;        // 0-100
  showLabel?: boolean;
}
```
- Color changes: green (>50) → yellow (20-50) → red (<20)
- Animated fill

---

## User Flow

```
1. User visits site
   ↓
2. Connects wallet (DappKit)
   ↓
3. App fetches ALL MochiPets owned by wallet
   ↓
4. Display collection page:
   ├─ Mint form always at top (can always mint more)
   │
   ├─ If 0 pets → Show empty state + encourage minting
   │
   └─ If 1+ pets → Show pet grid
                   ↓
                   Each pet card shows:
                   ├─ Current satiety (calculated from time)
                   ├─ If alive → Feed button
                   └─ If dead (satiety=0) → Burn button

5. User interactions:
   ├─ Mint → Pays 0.1 SUI, new pet appears in grid
   ├─ Feed → Pet's satiety restored, card updates
   ├─ Transfer → Pet sent to another wallet, removed from grid
   └─ Burn → Dead pet removed from grid forever
```

---

## Task Checklist

### 1. Project Setup
- [ ] Initialize React project with Vite
- [ ] Install dependencies: `@mysten/dapp-kit`, `@mysten/sui`, `tailwindcss`
- [ ] Configure Tailwind with pastel color palette
- [ ] Set up DappKit provider

### 2. Smart Contract
- [ ] Create `mochi_pet.move` with structs
- [ ] Implement `mint()` function
- [ ] Implement `feed()` function
- [ ] Implement `check_and_burn()` function
- [ ] Implement `get_current_satiety()` view
- [ ] Deploy to SUI testnet
- [ ] Save package ID

### 3. Wallet Integration
- [ ] Create `WalletButton` component
- [ ] Test connect/disconnect flow
- [ ] Display wallet address

### 4. Pet Display
- [ ] Create `usePets` hook to fetch ALL owned pets
- [ ] Create `PetGrid` component for collection view
- [ ] Create `PetCard` component
- [ ] Create `SatietyBar` component
- [ ] Show alive/dead state per pet

### 5. Actions
- [ ] Create `MintForm` with name input
- [ ] Wire mint to contract
- [ ] Create `FeedButton`
- [ ] Wire feed to contract
- [ ] Create `TransferModal` with address input
- [ ] Wire transfer to contract
- [ ] Add burn flow for dead pets

### 6. Polish
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add success toasts
- [ ] Basic responsive design

---

## Dependencies

```json
{
  "dependencies": {
    "@mysten/dapp-kit": "^0.14.0",
    "@mysten/sui": "^1.0.0",
    "@tanstack/react-query": "^5.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}
```

---

## Tailwind Config (Pastel Theme)

```js
// tailwind.config.js
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mochi: {
          pink: '#FFB6C1',
          lavender: '#E6E6FA',
          mint: '#98FB98',
          peach: '#FFDAB9',
          cream: '#FFF5EE',
        }
      },
      fontFamily: {
        cute: ['Nunito', 'Comic Sans MS', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
```

---

## What Success Looks Like

At the end of Phase 1:

1. User can connect wallet
2. User can mint multiple pets (each costs 0.1 SUI)
3. All pets displayed in a grid
4. Each pet has its own satiety bar
5. Satiety decreases over time (calculated on-chain)
6. User can feed any pet to restore its satiety
7. User can transfer living pets to other wallets
8. If user neglects a pet, its satiety hits 0
9. Dead pets can be burned (deleted forever)
10. User can keep minting more pets anytime

**That's it. Nothing else.**

---

## Timeline Suggestion

| Day | Task |
|-----|------|
| 1 | Project setup + Tailwind + DappKit |
| 2 | Smart contract + deploy to testnet |
| 3 | Wallet integration + pet fetching |
| 4 | Mint flow |
| 5 | Feed flow + satiety display |
| 6 | Death/burn flow |
| 7 | Polish + testing |

---

## Next Phase Preview

After Phase 1 works, Phase 2 adds:
- More stats (happiness, energy, hygiene)
- More actions (play, rest, bath)
- Gacha randomness (different pet types)
- Better animations
