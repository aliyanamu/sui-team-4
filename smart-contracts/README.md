# MochiPets Smart Contract

SUI Move smart contract for the MochiPets NFT game.

## Contract Summary

| Function | Description |
|----------|-------------|
| `mint(payment, name, clock)` | Pay 0.1 SUI, get pet with 100 satiety |
| `feed(pet, clock)` | Add +30 satiety (max 100) |
| `transfer_pet(pet, recipient, clock)` | Send living pet to another wallet |
| `check_and_burn(pet, clock)` | Delete dead pet (satiety = 0) |
| `get_current_satiety(pet, clock)` | View current satiety |
| `is_alive(pet, clock)` | Check if pet is alive |

## MochiPet NFT Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `UID` | Unique identifier |
| `name` | `String` | Pet name |
| `satiety` | `u64` | Hunger level (0-100) |
| `born_at` | `u64` | Birth timestamp (ms) |
| `last_fed` | `u64` | Last feeding timestamp (ms) |

## Game Mechanics

- **Satiety decay:** 10 points per day
- **Feeding:** Adds 30 points (capped at 100)
- **Death:** When satiety reaches 0, pet dies
- **Burn:** Dead pets can be permanently deleted
- **Transfer:** Only living pets can be transferred

## Constants

```move
MINT_PRICE: 100_000_000          // 0.1 SUI
MAX_SATIETY: 100
SATIETY_DECAY_PER_DAY: 10
MS_PER_DAY: 86_400_000
FEED_AMOUNT: 30
```

## Build

```bash
sui move build
```

## Deploy to Testnet

```bash
sui client publish --gas-budget 100000000
```

After deployment, update `MOCHI_PETS_PACKAGE_ID` in `frontend/src/lib/contracts.ts` with the published package ID.

## Events

| Event | Fields | Description |
|-------|--------|-------------|
| `PetMinted` | `pet_id`, `owner`, `name` | Emitted when a new pet is minted |
| `PetFed` | `pet_id`, `new_satiety` | Emitted when a pet is fed |
| `PetTransferred` | `pet_id`, `from`, `to` | Emitted when a pet is transferred |
| `PetBurned` | `pet_id`, `name` | Emitted when a dead pet is burned |
