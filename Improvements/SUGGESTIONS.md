# Delta Squad — findings & suggestions

Scope: every file in the repo root was read (`index.html`, `base.html`, `invintory.html`,
`invintory - Copy.html`, `Atachments.html`, `Implants.html`, `skils.html`,
`Codex_Enemy.html`, `Codex_Allies.html`, `Codex_Personal.html`,
`Codex_MemoryRoom.html`, `script.js`, `styles.css`), on the `DM_first_tach` branch.

Nothing in the live site was changed. Everything actionable from this pass lives
in this `Improvements/` folder: `game-data.js` + `render-engine.js` are a
drop-in, opt-in replacement for the hand-written item lists, and
`demo-invintory-fragment.html` proves it works against your real `styles.css`
and `script.js`. See the bottom of this file for how to adopt them.

A follow-up pass (§5) also reconciled `game-data.js` against the weapons
chapter (pages 28-43) of `Delta_Main_Players_Info/X-COM D&D.pdf`, the
project's canonical rulebook, and added the 15 weapons from it that weren't
on the site yet. A second follow-up pass (§6) added `perks-data.js`, covering
the Classes & Perks chapter (pages 2-14): 7 classes' full rank-gated perk
trees, MEC-suit rules, the Commander's Order abilities, and the mission
XP/resource table — and turned up a real bug (§6.2): Artemis and Tiffany's
abilities are swapped in `skils.html` relative to their own bios in
`script.js`. A third pass (§7) added the Ammunition chapter (pages 21-22):
special arrow types for the Bow and special firearm cartridges, staged in
`game-data.js` the same way as the MEC/Legendary weapons. A fourth pass (§8)
added `mechanics-data.js` — a new file for core-rules glossaries, starting
with the Damage Types chapter (page 51).

---

## 1. Real bugs (things that are currently wrong for players)

### 1.1 Character cost-discounts silently never apply — `script.js:522-529` — **FIXED 2026-07-30, see §17**

Every character (`Nomad`, `FatMan`, `Artemis`, `Tiffany`) is supposed to get a
1-point discount on their starter weapons (Pistol, Knife, Dildo, Dildo_Purple),
defined as:

```js
costReductions: [
    { itemNames: ["Pistol"], reduction: 1 },
    { itemNames: ["Dildo_Purple"], reduction: 1 },
    ...
]
```

But the code that applies it checks a different, singular key that doesn't
exist on these objects:

```js
const reductionRule = currentChar.costReductions.find(rule => rule.itemName === itemName);
```

`rule.itemName` is `undefined` on every entry (the data uses `itemNames`,
plural), so `undefined === itemName` is always `false` and **the discount
never fires for anyone, on anything** — the point-cost math is currently
identical to a character with no discounts at all. (The separate
`combinedCostReductions` list, e.g. Pistol+Knife together, uses `itemNames`
consistently in both the data and the lookup code, so that one path *does*
work — only the simple single-item discounts are broken.)

**Update:** applying the one-line fix above turned out to be insufficient by
itself — see §17.1 for why (a second, deeper bug in the same function meant
Pistol/Knife/Dildo's cost was being triple-counted through
`combinedCostReductions` regardless of this fix). Both are now fixed
together in `script.js`.

### 1.2 Wrong item description from copy-paste drift — `invintory.html` equipment2 & equipment3

The "Breach Drone Beaver" entry is defined 3 times (once per equipment slot).
In slot 1 it correctly reads *"...has a better communication system, which
increases the chance of breaching through the drone by +2."* In slots 2 and 3
it was never updated after being copy-pasted and instead shows the **Oxygen
Tank's** description ("Provides up to 4 hours of clean air..."). Any player
who opens equipment slot 2 or 3 sees the wrong item text.

Fixed in `game-data.js` (single definition, so this class of bug becomes
structurally impossible — see §3).

### 1.3 Two codex entries mislabeled with the wrong name — `Codex_Enemy.html`

The "Fugu" and "Ghost" enemy entries both have `data-name="Tearer"` — copied
from the real Tearer entry above them and never renamed:

```html
<button class="codex-btn" data-image="...Fugu.png" data-name="Tearer" data-description="????">
<button class="codex-btn" data-image="...Ghost.png" data-name="Tearer" data-description="Better than Nomad .">
```

So the sidebar/title for those two monsters both display "Tearer" instead of
"Fugu" / "Ghost". Fixed in `game-data.js`'s `codex.enemies` array (kept the
joke/placeholder description text, only corrected the `name` field).

### 1.4 `Codex_MemoryRoom.html` shows the Enemies codex, not memory-room content — **BLANKED OUT 2026-07-30, see §17**

`Codex_MemoryRoom.html` is byte-for-byte the same 20 enemy entries as
`Codex_Enemy.html` (down to the default preview image). It looks like the
page was cloned from Codex_Enemy as a starting point and never had its own
content written. `game-data.js` leaves `codex.memoryRoom` as an empty array
with a comment rather than guessing — once you write the real memories, drop
them in there and the page picks them up.

### 1.5 Cosmetic text bugs

- Weapon title literally includes the file extension: `data-info-title="Riot
  Shield.jpg"` — present in **both** `invintory.html` and `Atachments.html`
  (another symptom of the copy-pasted weapon list). Fixed to `"Riot Shield"`.
- `data-info-title="Pistol ( 911)"` has a stray leading space before `911`.
  Fixed to `"Pistol (911)"`.
- `Codex_Personal.html`: `data-name="Senior Officer Bradfordr"` (trailing
  "r"). Fixed to `"Senior Officer Bradford"`.
- `Codex_Allies.html`: the `data-name` is correctly "Alina Petrova" but the
  visible thumbnail caption text next to her image reads "Alina Petrovar".
  In the new data model there's one `name` field feeding both, so this typo
  class can't reoccur.
- `Codex_Personal.html`: image path has a double slash,
  `Codex/Personal//Full/Dr. Raymond Shen.png` — browsers normalize it so it
  still loads, but worth tidying.

---

## 2. Things that work today but are fragile

- **The vest dropdown has no "Nothing" option.** Every other slot (weapons,
  equipment, grenades) lets you pick "Nothing" to unequip; vests jump
  straight to "Civilian Clothes" as the first option, so there's no way to
  remove a vest once one is chosen. `game-data.js` adds a `"Nothing"` vest
  entry to close this gap — delete it from the array if that was deliberate.

- **`base.html` is dead code.** It's not linked from any other page (verified
  with a repo-wide search), references a stylesheet that doesn't exist
  (`styleD.css` — the real file is `styles.css`) and a page that doesn't
  exist (`DeltaProtocol.html`), hotlinks a clock icon from a third-party CDN
  (`static.vecteezy.com`, meaning that button silently breaks if that site
  ever goes down or blocks hotlinking), and its HTML isn't even closed
  properly (`<head>` and `<html>` never close). Safe to delete unless it's a
  work-in-progress you're keeping around intentionally.

- **`invintory - Copy.html` is a stale backup**, not a meaningful variant: it
  has only 3 vest options (vs. 11 in the current one), no equipment or
  grenade sections at all, and an older `<button class="info_con">` markup
  pattern. No unique content worth preserving — safe to delete once you've
  confirmed you don't need it as a rollback point.

- **`Implants.html` looks unfinished** — it's just the nav chrome and the
  character-swipe widget with an empty `#CharStats` div; there's no actual
  implant-selection UI on it yet (unlike `Atachments.html`, which is the
  fully-built equivalent for weapon attachments).

- **`deltaCharacters` in `script.js` references images that don't exist.**
  Each character has `implants.image`, `characteristics.image`,
  `abilities.image` pointing at `Media/UiElements/Implants/`,
  `Media/UiElements/Characteristics/`, `Media/UiElements/Abilities/` —
  none of these folders exist in `Media/`. It's currently harmless because
  `updateDeltaCharDisplay()` only ever reads the `.text` fields, never
  `.image`, but if someone wires up an image display later expecting these
  paths to work, it'll quietly fail. Either populate the folders or drop the
  unused `.image` fields.

- **`skils.html`'s class picker uses names that don't match the characters.**
  The dropdown shows *Nomad / Artemis / Tiffany / Fat Man*, but the
  underlying data keys are `sniper / medic / engineer / grenaider` — an
  arbitrary pairing that only works because the `<option>` order happens to
  match the object's key order today. Reorder the dropdown options without
  also reordering `abilities{}` and the wrong ability set silently attaches
  to the wrong character. Also, `skils.html` has its own completely separate
  character picker from the swipe-based one in `invintory.html` /
  `Atachments.html` — two different UIs for the same concept on different
  pages.

- **Menu inconsistency:** the sidebar "DataBase" icon links to
  `Codex_Enemy.html` on literally every page, including the other three
  Codex pages — so from `Codex_Allies.html`, clicking it takes you to
  Enemies instead of, say, staying put or cycling. Probably intentional
  (Enemies as the "front page" of the codex) but worth confirming.

- **Inconsistent language** across ability descriptions in `skils.html`
  (mix of Hebrew, Russian, and English) — not a bug, just worth knowing if
  you want the sheet consistently in one language for players.

---

## 3. The bigger issue: duplicated HTML is why the bugs above keep happening

`invintory.html` and `Atachments.html` don't store item data once each — they
store it as copy-pasted `<li>` blocks, repeated every time a slot needs the
same list:

| List | Copies today | Where |
|---|---|---|
| Main/secondary weapons (13 items) | **4x** | `invintory.html` weapon1 & weapon2, `Atachments.html` weapon1 & weapon2 |
| Grenades (12 items) | **5x** | `invintory.html` granade1–granade5 |
| Equipment (16 items) | **3x** | `invintory.html` equipment1–3 |
| Vests, melee, each attachment type | 1x each | already single-copy |
| Codex entry markup (same `image`/`name`/`description` shape) | identical structure × 4 files | `Codex_Enemy/Allies/Personal/MemoryRoom.html` |

That's roughly **900 of `invintory.html`'s 809 lines** and most of
`Atachments.html`'s 429 lines being the same handful of item lists retyped
over and over. Every time an item's cost, description, or image needs a
tweak, it has to be found and edited in every copy — miss one and you get
exactly the kind of drift in §1.2 and §1.5. Adding a brand-new weapon today
means pasting a new `<li>` into 4 different places by hand.

### The fix: `game-data.js` + `render-engine.js`

- **`game-data.js`** — every item (vests, melee, weapons, equipment,
  grenades, attachments) and every codex entry, defined **exactly once**, as
  plain data (`{ image, name, cost, description }`). This is the file you
  edit from now on to add/change/remove an item — one edit, everywhere it's
  used, updates together.

- **`render-engine.js`** — reads `game-data.js` and builds the exact same
  `<li class="dropdown-item" data-image=... data-cost=... ...>` markup
  `script.js` already expects. **`script.js` itself needs zero changes** —
  it only ever reads `data-*` attributes off whatever `<li>`s exist in the
  DOM, and doesn't care whether a human typed them or a script generated
  them at page load.

Adopting it on a real page is a pure subtraction: a block like this in
`invintory.html`...

```html
<ul class="dropdown-list" id="dropdown_weapon1">
  <li class="dropdown-item" data-image="Media/UiElements/Weapons/MainWeapon/M-16.jpg" data-cost="2" ...> ... </li>
  <!-- ...12 more hand-written items... -->
</ul>
```

...becomes this, with the item list now living in `game-data.js` instead:

```html
<ul class="dropdown-list" id="dropdown_weapon1" data-source="mainWeapons"></ul>
```

The same `data-source="mainWeapons"` also goes on `dropdown_weapon2` (and
both weapon slots in `Atachments.html`) — one list, four slots, zero
duplication. Grenades become `data-source="grenades"` on all five slots,
equipment becomes `data-source="equipment"` on all three. A Codex page's
20-button `.Codex_Selector` block becomes:

```html
<div class="Codex_Selector" data-codex-source="codex.enemies"></div>
```

**`demo-invintory-fragment.html`** in this folder wires up a vest slot,
melee slot, one weapon slot, two grenade slots, one equipment slot, and a
codex grid this way, loading the project's real `styles.css` and `script.js`
unmodified. Open it in a browser to see it behave identically to
`invintory.html`, then compare its ~120 lines of HTML to the ~250 lines the
same content takes today (and that's without even touching the 4x-duplicated
weapon list).

### Migration is incremental and low-risk

Because `script.js` doesn't change, you can convert one page (or even one
slot) at a time and leave the rest hand-written until you get to it — nothing
breaks in between. Suggested order: `invintory.html`'s weapon slots first
(biggest duplication win), then grenades/equipment, then the 4 Codex pages,
then `Atachments.html`.

Include order matters, and mirrors the demo file:

```html
<script src="game-data.js"></script>
<script src="render-engine.js"></script>
<script src="script.js"></script>
```

---

## 5. Weapons chapter pulled from `Delta_Main_Players_Info/X-COM D&D.pdf`

You asked for the weapons chapter (PDF pages 28-43: "Weapons", "Arsenal
Expansion", "Legendary Weapons") to be reconciled against the site. Findings:

### 5.1 The site mistranslates "spare magazines" as "Accuracy" — every weapon

Cross-referencing the PDF against the site's existing weapon text turned up a
systemic mistranslation, not just missing content. Every weapon entry
currently on the site has a line like `Accuracy: 1-2`. In the PDF, that
number is under the Hebrew label **מאצור** ("storage") — the number of spare
magazines you can carry for that specific weapon (distinct from the
vest-level magazine-slot counts already tracked in `script.js`'s
`vestConfigurations`) — not a to-hit modifier at all. Confirmed by
cross-checking M-16, ShotGun, and Negev's numbers against the PDF's מאצור
values, which match exactly. A player reading "Accuracy: 1-2" today would
reasonably assume it affects their hit chance, when it actually says how many
reloads they're carrying.

Left the 13 already-live weapon entries' text untouched in `game-data.js` (not
in scope for this pass, and changing wording on already-reviewed data seemed
worth flagging rather than doing silently) — but the 9 new weapon-chapter
entries added below use the correct **"Spare Magazines"** label instead of
repeating the same mistranslation, so expect that wording difference in the
dropdown until the older entries get the same fix. Recommend fixing all of
them together in one pass so the whole weapon list reads consistently.

### 5.2 15 weapons from the PDF aren't implemented on the site yet

The PDF's weapons chapter has entries the site doesn't: mostly "magnetic"/
upgraded tiers of weapons already implemented, plus MEC-suit-gated weapons and
a "Legendary Weapons" section. All added to `game-data.js`, translated from
Hebrew, in the same style as the existing entries:

- **`mainWeapons`** (+9): M-Pistol, MR-19, MAG-STORM, Railstorm, Magnetic RPG,
  VECTOR SMG-7, Riot Shield II (a 2nd, stronger shield tier — the PDF reuses
  the name "Riot Shield" for it, kept distinct here so both remain selectable),
  Magnetic Handheld Shotgun, and the Long-Range Experimental Magnetic Rifle
  (LRE-MR).
- **`melee`** (+2): Red Sting, Zeus.
- **`mecWeapons`** (new array, +3): Magnetic MEC-Minigun, MEC Retractable
  Blade, MEC 2TX-98 — **do not wire these into the weapon1/weapon2 dropdowns
  as-is.** All three (like the existing Minigun) are gated behind a "MEC
  suit," and there's currently no MEC-suit slot/equipment anywhere in
  `invintory.html`. This array is staged data for whenever that slot gets
  built.
- **`legendaryWeapons`** (new array, +1): Last Bet, a unique revolver with two
  named special abilities ("All In", "Aura Farm"). The PDF's other Legendary
  Weapon, Dildo, is already on the site (as `Dildo`/`Dildo_Purple` under
  `melee`) — worth knowing the PDF treats it as *one* weapon with 3
  limited-quantity color variants (including a yellow one the site doesn't
  have) rather than 2 separate unlimited items; not changed here since
  enforcing scarcity/limited-quantity items is a bigger feature than a data
  fix.

### 5.3 Reference art: used where clean, skipped where copyrighted

The PDF has a photo/render embedded for most weapons. Extracted and reused 7
that are generic, unbranded stock-style renders (same spirit as the gun
photos already in `Media/`): M-Pistol, MAG-STORM, Red Sting, Zeus, Magnetic
RPG, Magnetic MEC-Minigun, VECTOR SMG-7 — now under
`Media/UiElements/Weapons/{MainWeapon,Melee,SecondartWeapon,MEC}/`.

The rest turned out to be copyrighted concept art with visible studio
branding baked into the image itself, not something to quietly copy into a
shared local tool: MR-19/Railstorm's reference is an unrelated Titanfall
"TITAN WEAPONS" concept sheet, MEC Retractable Blade's is watermarked
"Respawn Entertainment," MEC 2TX-98's is watermarked Ubisoft/Massive
Entertainment ("The Division 2"), Riot Shield II's is watermarked EA/DICE
("Battlefield 2042"), Magnetic Handheld Shotgun's is watermarked Guerrilla
Games ("Killzone"), and Last Bet's has a visible "kitana.ru" store watermark.
Those 7 entries point at the existing `Nothing.jpg` placeholder in
`game-data.js` instead — replace with your own art (or licensed stock) when
you have it; nothing else needs to change since the render engine just reads
whatever `image` path is in the data.

### 5.4 Rest of the PDF

Pages 28-43 were only the weapons chapter. Every other chapter has since
been pulled in too — see §15 for the full rundown and final status.

---

## 6. Classes & Perks chapter pulled from the PDF (pages 2-14)

Added `Improvements/perks-data.js`: the 7 base classes' full perk trees (each
gated behind a rank + XP threshold, with a choice of 2 abilities per tier),
the MEC-suit rules (its own 8th "class," unlocked via a Major-rank perk in
any tree), the Commander's 8 named "Order" abilities, and the mission
XP/resource-reward table. This is a genuinely dense, mostly-Hebrew table (8
classes × 6 rank tiers), so a handful of cells are marked
`(translation uncertain)` right in the data — worth proofreading against the
PDF before treating any single ability as gospel at the table, especially
those.

### 6.1 `skils.html` is a simplified placeholder, not the real system

Comparing what's already on the site to what the PDF actually specifies:
`skils.html` has 4 classes (keyed `sniper`/`medic`/`grenaider`/`engineer`),
each with 4 flat abilities and no cooldown gating beyond a simple per-ability
counter, no XP thresholds, and no rank progression. The PDF has 7 base
classes (an 8th, Commander, isn't in `skils.html` at all) each with a full
6-tier rank ladder (`רב טוראי` → `אלוף משנה`) where XP unlocks a *choice*
between two mutually exclusive abilities per tier — a meaningfully different
system, not just "more content." If you want the character sheet to actually
track rank/XP and perk choices instead of a flat ability list, that's a
bigger feature built on top of `perks-data.js`, not a data-entry job — flagging
the gap rather than attempting it here.

### 6.2 Found while cross-referencing: Artemis and Tiffany's abilities are swapped in `skils.html` — **FIXED 2026-07-30, see §17**

This is a clean, high-confidence bug, not a judgment call. `script.js`'s own
`deltaCharacters` array describes:
- **Artemis**: "Neural interface, +2 to hacking and tech skills" / "System
  Override — Disable enemy electronics" — that's the **Specialist** (`מומחה`)
  archetype, whose PDF kit is entirely hacking/drone-themed.
- **Tiffany**: "Biometric scanner, +3 to medical and support actions" /
  "Healing Aura — Heals all allies" — that's the **Medic** (`חובש`) archetype.

But `skils.html`'s dropdown assigns `<option value="medic">Artemis</option>`
and `<option value="engineer">Tiffany</option>` — the opposite pairing. Open
the ability tracker as Artemis today and you get the Medic's medpack/healing
abilities; open it as Tiffany and you get the Specialist's hacking/drone
abilities — backwards from what their own character bios say. Likely just
the two `<option>` values got transposed at some point. (Softer, lower-confidence
note: Nomad's own flavor text — "Ghost Walk, become invisible" — reads more
like the PDF's Scout (`סקאוט`) than the Sharpshooter (`קלה`) class
`skils.html` assigns him to, though Nomad's actual weapon-cost discounts
[Pistol/Knife] fit Sharpshooter well enough that this could be intentional —
worth a second look, not asserting it's wrong the way the Artemis/Tiffany
swap clearly is.)

---

## 7. Ammunition chapter pulled from the PDF (pages 21-22)

Added `Improvements/game-data.js`'s new `ammunition` section: 7 special
arrow types (all Bow-only — this is exactly what the Bow's existing flavor
text refers to: "Special Attack: ... [Types of Arrows]") plus 3 special
firearm cartridge types (Fire, Fragmentation, Electric — each trades
shots-per-magazine for a situational damage bonus, e.g. bonus damage to
robots vs. biological enemies). This was a short, clean chapter — no
ambiguous cells this time, and no watermarked reference art to skip (the
PDF's only images here are small generic arrowhead/cartridge stock icons, so
all 10 fall back to the placeholder rather than copying in something that
low-effort).

Like `mecWeapons`/`legendaryWeapons` before it, **nothing on the site has an
ammo/arrow slot to put these in yet** — this is staged data for whenever
that UI exists, not something that changes any dropdown today.

---

## 8. Damage Types chapter pulled from the PDF (page 51)

Added a new file, `Improvements/mechanics-data.js`, for core-rules glossaries
that other data references by name rather than equippable items or class
perks — starting with Damage Types: Regular, Fire, Electric, Acid, Freeze,
Bleed. This was overdue: several weapons/grenades already in `game-data.js`
use these damage types in their flavor text (Red Sting's FIRE damage, Zeus's
shock/Electric damage, Flame Grenade's persistent burn, EMP Grenade's
robot-disabling effect) without the underlying rule ("Fire ticks at the end
of the round until put out," "Electric only bonus-damages robots," etc.)
being written down anywhere the site — now it is, in one place. Kept the
PDF's own color-coding per type (`color` field) in case you want matching
badge colors in a future UI.

`Improvements/perks-data.js` is class progression, `game-data.js` is
equippable items, and this new `mechanics-data.js` is where the next
core-rules chapters (Mechanics p.46-49, "The Consequence of My Decisions"
p.50) would naturally land too, if you want those next.

---

## 9. Correction: there is no separate "Ranks" chapter, plus page 44

Last pass's "what's still not covered" list called out a "Ranks" chapter,
guessed from its position in the table of contents (right after Weapons,
right before Characteristics). That guess was wrong — there is no standalone
Ranks chapter. The military rank ladder (`רב טוראי` → `אלוף משנה`, with XP
thresholds) is already fully captured: it's the same tier gating used in
every class's `perkTree` in `perks-data.js` from the Classes & Perks pass.
Nothing new needed there.

The page at that position (44, headed "מרפ"א") turned out to be something
else: a short, apparently-unfinished catalog (2 filled rows, then one blank
row in the source itself) of one-off consumables — a vaccine and a
mechanical-limb reconstruction — bought with the harvested material
currencies (Infected Material, MELD) from the mission XP table, not points.
Added as `researchRewards` in `mechanics-data.js` since it was already read
and translated; flagged clearly as presumably tied to the Base/research
system (pages 52-66, not pulled in yet) rather than being a complete chapter
on its own.

---

## 10. Characteristics chapter pulled from the PDF (page 45)

Added `characteristics` + `creationRule` to `mechanics-data.js`: the 6 core
stats (WILL, ENGINEERING SKILLS, DETAIL, STRENGTH, MEDICAL SKILLS, STEALTH)
every character has, and the character-creation rule that generates them
(roll 6d4, distribute the six results across the six stats as you choose —
not one die per stat individually). Short, clean chapter, no ambiguity.

Nice cross-check this turned up: `STRENGTH` is already referenced elsewhere
on the site — the MEC Retractable Blade's damage in `game-data.js`
(`1D12+2+STR`, from the Weapons-chapter pass) uses this exact stat, so it's
good confirmation these characteristics are the same STR the weapons chapter
assumes, not a naming coincidence.

---

## 11. Core Mechanics chapter pulled from the PDF (pages 46-49)

Added a `coreMechanics` section to `mechanics-data.js`: turn structure and
action economy, the hit-chance/cover math, crit, flanking, darkness/
disadvantage, evasion, armor-as-damage-reduction, fear/panic saves,
Overwatch, healing/robot-repair, and starting equipment points. Also added
`mecPilot` to `perks-data.js` — a separate, weaker remote-piloting ability
tree for the MEC suit (page 49), distinct from `mecFighter`'s tree for
actually wearing it.

Three things worth your attention here:

### 11.1 Confirms the מאצור/"Accuracy" mistranslation, and sharpens it

Page 49 spells out what running out of a weapon's מאצור (spare magazines)
actually does: the weapon stops firing, wasting your action, until you spend
another action reloading it. This adds mechanical teeth to the finding from
§5.1 (every weapon's "Accuracy: X" line on the site is really this stat) —
it's not just a mislabeled flavor number, it's a resource that can leave you
with a dead gun mid-fight if it hits zero.

### 11.2 The site's point cap doesn't match either number the PDF states — **RESOLVED 2026-07-30, see §17**

`invintory.html`'s Total Points field shows a hardcoded `/15`. Page 48 says
character creation actually starts with **14** points, or **16** after your
Base's bonuses — neither matches the site's 15. Resolution: user confirmed
16 (post-Base-bonus value) is correct for this table, and asked for the cap
to be modular going forward — see §17.2.

### 11.3 Possible mismatch: PDF says everyone starts with 20 HP — **CONFIRMED INTENTIONAL, no fix needed**

Page 49 states flatly "every soldier starts with 20 HP." But `script.js`'s
`deltaCharacters` give Nomad/FatMan/Artemis/Tiffany 30/33/30/29 MaxHP
respectively — noticeably higher and non-uniform. User confirmed this is
correct as-is: the higher numbers already include each character's rolled
stat increases from leveling up, not a missing base-HP source. No code
change needed.

---

## 12. Starting/Unique Equipment chapters pulled from the PDF (pages 15-20)

This pass was mostly a validation exercise, which is a good outcome: pages
15-16 ("ציוד עזר," the grenade catalog) and page 17 ("שיבצור לנשק," weapon
attachments) turned out to be the canonical source for the `grenades` and
`attachments` entries already in `game-data.js` — all 12 grenades and all 7
attachment types matched the PDF's cost/description exactly, item for item.
That's a meaningful confirmation that those two lists were transcribed
correctly from the live site the first time around, with nothing missing and
nothing invented.

Pages 18-20 ("ציוד מיוחד," Unique Equipment) covers the same ground as the
site's `equipment` array — 16 of its 17 rows matched existing entries
exactly, including the one already flagged as a copy-paste bug back in §1.2:
the PDF's Breach Drone 'Beaver' description ("better communication system...
+2 to breaching") matches the *corrected* text in `game-data.js`, not the
version still live on the site's equipment2/equipment3 dropdowns — good
confirmation that fix was right.

### 12.1 One genuinely new item: Chryssalid-Plate Light Armor (page 20)

Added to `game-data.js`'s `equipment` array. Unlike everything else in that
list, it's not a simple point-buy item: it costs 2 points *and* consumes
harvested Chryssalid corpses (4 bodies = 1 armor point, so this +2 version
costs 8), *and* has a hard stock limit of 32 total. The current
`{image, cost, description}` shape has no fields for a crafting-resource cost
or a global stock cap, so those facts are folded into the prose description
rather than silently dropped — if you want the site to actually enforce
"only 32 of these can ever exist across the whole campaign," that needs a
schema change, not just a data entry.

Small fun cross-reference: "Chryssalid" is the classic X-COM name for the
creature the site's own Enemies codex already has under a different name,
"Cristolide" (armored carapace, poisonous mandibles, resembles a giant ant) —
same monster, and now the site has an item that explicitly requires
harvesting its corpses.

---

## 13. Additional Items chapter pulled from the PDF (pages 23-27)

Translation note first: this chapter is headed "ווסתים," which literally
means "regulators/thermostats" — but that's a phonetic spelling of the
English word "vest" (Hebrew has no native word for a tactical vest), not its
literal meaning. It's the **Vests** chapter, and the canonical source for
`game-data.js`'s `vests` array.

Like §12, this was mostly validation: all 11 vests already on the site
(Civilian Clothes and LVL2, Light/Medium/Heavy Vest and their LVL2s, Chemical
Defense Suit, Medical Vest, Spider suit) matched the PDF's cost, slot counts,
and bonuses exactly.

### 13.1 New: the MEC Suit itself, as an equippable item (page 27)

This is the real find. Every previous pass on the MEC system (§6's
`mecFighter` perk tree, its per-class suit bonuses, §11's `mecPilot` remote
tier) assumed a soldier is already wearing a MEC suit, but nothing captured
**the actual vest-slot item you equip to become one** — until this page.
Added both tiers to a new `mecSuits` array in `game-data.js` (kept separate
from `vests` since these grant STRENGTH and a built-in punch attack, not
just slot counts and a flat HP bonus, and would want gating behind
"reached Major rank" rather than sitting in the same picker as a starting
Civilian Clothes choice):

- **MEC Suit** (5 pts): +8 HP, +2 armor, +5 STRENGTH, 'Living Cover' stance,
  3 rounds of flight, built-in 1D10+STR punch.
- **MEC Suit LVL2** (6 pts): +16 HP, +4 armor, +6 STRENGTH, same 'Living
  Cover', 6 rounds of flight, built-in 1D12+STR punch.

No clean reference art again: the base tier's PDF image is an uncredited
XCOM 2 game screenshot, and the LVL2 tier's is BioWare/EA-watermarked Anthem
concept art. Both fall back to the placeholder, same policy as the Weapons
chapter.

---

## 14. Base chapter pulled from the PDF (pages 52-66) — the biggest one yet

Added a new file, `Improvements/base-data.js`. The Base is the last major
chunk of the rulebook and it's dense: 3 department heads — Dr. Raymond Shen
(Engineering), Dr. Moira Vahlen (Laboratory), Senior Officer Bradford
(Command) — already on the site as-is (they're exactly `game-data.js`'s
`codex.personal` array, same names, matching one-liners), each running a
research tree plus their own unique system on top:

- **Shen**: 4 research projects (weapons, grenades/equipment/drones, MEC/
  armor upgrades, biotech), plus **4 cybernetic enhancements** (Adaptive
  Skin, Nano-Heart, Hybrid Bionic Prosthesis with a built-in "Mantis" bladed
  weapon, Bionic Lungs) and the **Tarantula combat robot** (30 HP, rocket
  launcher, repair drone, defense stance).
- **Vahlen**: 2 research projects (stimulants, virus research — the latter
  is what unlocks the Vaccine V-04 already captured back in §9's
  `researchRewards`), plus a **gene-mod system**: 16 mods across 5 body
  slots (brain/eyes/chest/skin/legs), most gated behind capturing a specific
  enemy alive, and a **mutant combat dog** (18 HP).
- **Bradford**: 2 research projects (intel/tactics, training/simulations),
  plus a **War Dog** unit (12 HP, distinct stat block from Vahlen's dog).

### 14.1 Confirms skils.html's `baseAbilities` are sourced correctly

Every one of the 6 entries in `skils.html`'s `baseAbilities` array (Artillery,
Air Support, Teamwork, Return Fire, Run and Gun, Simulator Training) matches
a Command-tree research unlock in this chapter word-for-word. Good
confirmation that part of `skils.html` was transcribed correctly, unlike the
Artemis/Tiffany swap found back in §6.2.

### 14.2 Likely explains why the broken cost-discount bug (§1.1) exists at all

The Command tree's "Trained Hand" unlock reads: *"you can take a pistol or
knife without risking wasted points."* That's almost certainly the intended
rule behind `script.js`'s per-character `costReductions` (every character
gets a discount on Pistol/Knife/Dildo) — except, per §1.1, that discount
code has a key-name bug and never actually fires. This doesn't change the
fix, but it does explain *why* that mechanic exists: it's gating a Command
research unlock, not an arbitrary character flavor bonus.

### 14.3 Two new creature names surfaced, not yet in the Enemies codex

Two gene mods are unlocked by capturing an enemy alive that doesn't match
anything in `game-data.js`'s `codex.enemies`: **"Bloodthirsty Leviathan"**
(Depth Perception eye mod) and **"Vennomorph"** (Power Jump leg mod). Also,
one mod ("Mental Shield") is unlocked by capturing a live **"MEC Fighter"**
— implying hostile MEC troopers exist as enemies somewhere, which isn't
documented anywhere else on the site either. None of these were invented
here; they're just named as prerequisites without their own codex write-up
existing yet.

### 14.4 Campaign-specific state embedded in the rulebook itself

The War Dog page ends with a checklist of 4 named dogs — Shaked and Igor
crossed off, Elit and Milena still open — which reads as this specific
campaign's actual play history (dogs already recruited/lost), not a generic
game rule. Noted in `base-data.js` as a comment rather than modeled as data,
since it's campaign state, not a reusable mechanic.

With this, all of the PDF's substantive chapters have now been pulled in
except "The Consequence of My Decisions" (page 50) — a short, distinctly
named system whose scope wasn't clear from the table of contents alone.

---

## 15. "The Consequence of My Decisions" pulled from the PDF (page 50) — last chapter

Added `coreMechanics.consequenceOfMyDecisions` to `mechanics-data.js`,
alongside Fear/Panic since the two are related but distinct: Fear/Panic
(§11) is a same-encounter effect that ends once you recover; this is a
persistent, cross-session scarring system. If a character is mortally
wounded but saved, they carry a debuff for the next few sessions, themed to
how they nearly died — debuffs stack with each further near-death and fade
one at a time for each session survived without dying. Die repeatedly to the
same enemy type, and that fear becomes permanent. Short chapter, already in
English in the source, no translation needed.

**This closes out the PDF.** Every chapter from the table of contents has
now been pulled into `Improvements/`: Classes & Perks (§6), Ammunition (§7),
Damage Types (§8), Characteristics (§10), core Mechanics (§11, plus this
entry), Starting/Unique Equipment (§12), Additional Items/Vests (§13), Base
(§14), and now Consequence of My Decisions. The two mid-series corrections
(§9's mistaken "Ranks" guess, and confirming there's no such chapter) are
folded in too. What's left is the stuff flagged along the way as its own
follow-up, not new PDF content: reconciling the Codex_MemoryRoom.html
placeholder (§1.4), deciding on the two rank/HP mismatches (§11.2-11.3), and
whether to build real UI for the now-fully-documented but not-yet-wired-in
systems (ammunition slots, MEC gear, gene mods, the Base's research trees).

---

## 16. Minor style note

`skils.html`'s `renderAbilities()` builds ability cards with string-concatenated
`innerHTML` (`onclick="useAbility('${ability.name}', ...)"` inline in the
template). It's not exploitable today because the data is all
developer-authored, not user input — but it's worth knowing the pattern, since
the same habit becomes a real injection risk the moment any of that text ever
comes from a player-editable field (e.g. if custom abilities become
user-creatable later). `render-engine.js` in this folder builds its elements
with `document.createElement`/`textContent` instead, specifically to model the
safer alternative.

---

## 17. Fixes applied to the live site (2026-07-30)

After finishing the full PDF pass, went back and fixed the concrete bugs on
the user's direction rather than leaving them staged. Unlike everything
above, these are real edits to `script.js`, `skils.html`,
`Codex_MemoryRoom.html`, and the point-cap display on `invintory.html`/
`Atachments.html`/`Implants.html` — verified by starting a local static
server and driving headless Chrome against it (desktop + a 390×844 mobile
viewport), checking the browser console for errors, and running the actual
`recalculateTotalPointsBasedOnSelections()` function through several
scenarios in an isolated test harness before/after the fix.

### 17.1 `costReductions` — two bugs, not one

The `rule.itemName` → `rule.itemNames.includes(...)` fix from §1.1 was
necessary but not sufficient. Testing (buy a lone Pistol as Nomad, expect
cost 2−1=1) returned **3**, not 1. Root cause: Nomad's
`combinedCostReductions` has three rules that all name "Pistol" (paired with
Knife, Dildo, and Dildo_Purple respectively — one rule per melee option,
since a character can only equip one melee weapon at a time). The original
code pre-populated a lookup table with every item name mentioned in *any*
combo rule, so a lone Pistol (with no matching melee item equipped) still
matched the lookup and got diverted away from its individual discount —
and then, in the closing pass, its cost was re-summed and re-discounted once
per rule that named it, because the code never checked whether the *other*
item in each pair was actually present. Rewrote
`recalculateTotalPointsBasedOnSelections()` in `script.js` so a combo
discount only applies when every item in that rule is actually selected, and
every item's cost is counted exactly once (via combo discount, individual
discount, or full price — never more than one of the three). Verified with 5
scenarios: Pistol alone → 1 (was 3), Pistol+Knife together → 2, Knife alone →
0, two Pistols in both weapon slots with no melee → 2, an unrelated item
(M-16) → 2 unchanged. Also fixed a matching data typo while in there:
Tiffany's Drone discount used `itemName: [...]` (singular key, array value)
instead of `itemNames: [...]` like every other rule — with the lookup fixed
to actually call `.includes()` on that field, the old typo would have thrown
a runtime error instead of silently no-op'ing.

### 17.2 Point cap made modular, set to 16

Added `const MAX_STARTING_POINTS = 16;` near the top of `script.js` as the
single source of truth (was hardcoded as a red/white color-threshold `> 15`
inline, with no connection to the displayed cap text at all). The three
pages that show the cap (`invintory.html`, `Atachments.html` — both were
`/15` — and `Implants.html`, which was `/14`, a third, previously-unnoticed
inconsistency) now wrap the number in `<span class="MaxPointsDisplay">`,
which `script.js`'s `DOMContentLoaded` handler sets to
`MAX_STARTING_POINTS` on every page load. Change the one constant to change
the cap everywhere.

### 17.3 Artemis/Tiffany ability swap fixed

Swapped `skils.html`'s two `<option>` values so Artemis now maps to
`engineer` (matching her hacking/tech bio in `script.js`) and Tiffany maps
to `medic` (matching her healing bio) — previously backwards.

### 17.4 `Codex_MemoryRoom.html` blanked out

Per the user's direction ("blank it out for now"), replaced the ~180 lines
of duplicated Enemies-codex buttons with an empty `.Codex_Selector` and a
plain "No memories recorded yet / This room is empty for now." placeholder,
using the shared `Nothing.jpg` empty-slot graphic for the preview image.
Also dropped the page's redundant inline `<script>` block (the same
codex-button wiring `script.js` already does globally for every Codex page —
harmless with zero buttons, but no longer needed either way).

### 17.5 Deferred by request

New UI for ammunition slots, MEC gear, and gene mods/cybernetics — the user
asked to hold off on all of these for now ("we'll work on the interface a
little later... bare minimum... core functionality works on both PCs and
mobile devices locally with Git"). Confirmed the *existing* functionality
(inventory point math, character switching, codex browsing) still renders
and works correctly on both a desktop and a mobile viewport size after the
fixes above, with a clean browser console.
