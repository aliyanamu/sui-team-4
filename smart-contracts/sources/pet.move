module mochi_pets::pet;

use std::string::String;
use sui::clock::{Self, Clock};
use sui::coin::{Self, Coin};
use sui::event;
use sui::sui::SUI;

// ============ Constants ============
const MINT_PRICE: u64 = 100_000_000; // 0.1 SUI
const MAX_SATIETY: u64 = 100;
const SATIETY_DECAY_PER_DAY: u64 = 10;
const MS_PER_DAY: u64 = 86_400_000;
const FEED_AMOUNT: u64 = 30;

// ============ Errors ============
const EInsufficientPayment: u64 = 0;
const EPetIsDead: u64 = 1;
const EPetIsAlive: u64 = 2;

// ============ Objects ============
public struct MochiPet has key, store {
    id: UID,
    name: String,
    satiety: u64,
    born_at: u64,
    last_fed: u64,
}

// ============ Events ============
public struct PetMinted has copy, drop {
    pet_id: ID,
    owner: address,
    name: String,
}

public struct PetFed has copy, drop {
    pet_id: ID,
    new_satiety: u64,
}

public struct PetTransferred has copy, drop {
    pet_id: ID,
    from: address,
    to: address,
}

public struct PetBurned has copy, drop {
    pet_id: ID,
    name: String,
}

// ============ Mint ============
#[allow(lint(self_transfer))]
public fun mint(
    payment: Coin<SUI>,
    name: String,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    assert!(coin::value(&payment) >= MINT_PRICE, EInsufficientPayment);

    // Transfer payment to treasury (for MVP, just transfer to @0x0 to burn it)
    transfer::public_transfer(payment, @0x0);

    let now = clock::timestamp_ms(clock);
    let sender = ctx.sender();

    let pet = MochiPet {
        id: object::new(ctx),
        name,
        satiety: MAX_SATIETY,
        born_at: now,
        last_fed: now,
    };

    event::emit(PetMinted {
        pet_id: object::id(&pet),
        owner: sender,
        name: pet.name,
    });

    transfer::public_transfer(pet, sender);
}

// ============ Feed ============
public fun feed(
    pet: &mut MochiPet,
    clock: &Clock,
) {
    let now = clock::timestamp_ms(clock);
    let current_satiety = calculate_current_satiety(pet, now);

    assert!(current_satiety > 0, EPetIsDead);

    // Update satiety (cap at MAX)
    pet.satiety = if (current_satiety + FEED_AMOUNT > MAX_SATIETY) {
        MAX_SATIETY
    } else {
        current_satiety + FEED_AMOUNT
    };
    pet.last_fed = now;

    event::emit(PetFed {
        pet_id: object::uid_to_inner(&pet.id),
        new_satiety: pet.satiety,
    });
}

// ============ Transfer ============
public fun transfer_pet(
    pet: MochiPet,
    recipient: address,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    // Can only transfer living pets
    let current_satiety = calculate_current_satiety(&pet, clock::timestamp_ms(clock));
    assert!(current_satiety > 0, EPetIsDead);

    let sender = ctx.sender();

    event::emit(PetTransferred {
        pet_id: object::id(&pet),
        from: sender,
        to: recipient,
    });

    transfer::public_transfer(pet, recipient);
}

// ============ Check & Burn ============
public fun check_and_burn(
    pet: MochiPet,
    clock: &Clock,
) {
    let now = clock::timestamp_ms(clock);
    let current_satiety = calculate_current_satiety(&pet, now);

    // Can only burn dead pets
    assert!(current_satiety == 0, EPetIsAlive);

    event::emit(PetBurned {
        pet_id: object::id(&pet),
        name: pet.name,
    });

    // Burn the pet
    let MochiPet { id, name: _, satiety: _, born_at: _, last_fed: _ } = pet;
    id.delete();
}

// ============ View Functions ============
public fun get_current_satiety(pet: &MochiPet, clock: &Clock): u64 {
    calculate_current_satiety(pet, clock::timestamp_ms(clock))
}

public fun is_alive(pet: &MochiPet, clock: &Clock): bool {
    get_current_satiety(pet, clock) > 0
}

public fun name(pet: &MochiPet): &String {
    &pet.name
}

public fun born_at(pet: &MochiPet): u64 {
    pet.born_at
}

public fun last_fed(pet: &MochiPet): u64 {
    pet.last_fed
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
