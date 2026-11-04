# Forest Workshop (숲결 공방)

A portrait cozy workshop game for ME-personal, in development. `forest-workshop` is the development ID; the display
name 숲결 공방 is provisional. The design contract is *Development_Plan_FINAL_v1_6* (숲속 공방 독립 에이전트 최종
개발계획서 v1.6); `docs/forest-workshop/` in this repository records what has been implemented and verified.

## What 0.9.2 includes

- Delete existing worlds from the world picker after confirming the named world. This removes that world's package records while preserving other worlds, original source cards, shared gallery images, and exported backups.

- On first entry, review the AI connections and choose a starting resident before opening the welcome kit. Register characters and personas as workshop residents. Selecting a source automatically prepares a full adapted profile; confirm it or edit it before registering. Original cards stay unchanged.
- Five production fields with all recipes enabled by default. Production settings starts with a four-item recipe page, one shared stock target for all facilities, a separate apply action and one automatic-production action; manual recipe switches, stock and priorities remain in the same tab under an explicit disclosure. Applying a goal configures its ingredient tree across facilities and returns to work status; counted queues have been removed. A minimum input batch above protected stock prevents low shared targets from blocking a recipe. Protection and automatic-sale retention keep needed materials available; locked facilities still need unlocking.
- Assigning a pair generates its current relationship from both workshop profiles through the selected story connection, with retry on failure and no invented shared history. Existing progressed relationships remain intact. Saved worlds upgrade to schema 15; older packages cannot read the upgraded save.
- Pair-specific three-episode story plans, followed by scenes that use the canonical workshop profiles and shared memories. Already published scenes remain unchanged.
- Survey and patrol activities prepare a resident letter automatically when their result reaches the game. Open the mailbox to read it; generation failures retain the activity record and show a local error, an inline connection selector for the failing purpose and explicit retry. A failure while adapting an older resident profile directs to the profile connection instead of the letter connection. Letters receive non-romantic trust, typed known memories and at most two earlier letters from the same resident as optional style references; published letters remain unchanged. Whole fenced JSON responses are supported. Generation uses up to 2,048 output tokens within the connection limits; the duplicated system report slot is reused while its activity summary and archive selection are preserved. Opening a known failure does not automatically call the model again.
- Home samples from every recruited resident, keeps that selection stable during the visit and lets you choose 1–6 visible residents under Settings → 표시. Their size and shared ground movement range stay the same at every display count. Weather and season sit in the header, above the expanded stage; compact work reports, absence time and daily requests remain below. Click the bulletin board standing beside the Home workshop to open today's delivery requests; move its position with the ground editor. Residents stay in front of the board and sort by foot position so the lower resident appears in front. Wandering takes 42 seconds per loop; size and range remain independent of count. Touching a resident shows a mood mark while movement continues.
- Real weather from Open-Meteo for the selected preset city, refreshed every 15 minutes. Choose the city under Settings → 내 공방; Seoul is the default. Weather effects can be disabled separately.
- Bundled, licensed Jua typography, readable profile paragraphs, responsive mobile spacing, and nine selectable story backgrounds, including the bundled forest trail and four seasonal workshop yards.
- Arrow page navigation, centered resident-detail popups and editable workshop display names. Original source names stay unchanged.
- Storage and sale items are grouped by gathering, growing, processed products, crafted goods and other materials. Long read-story titles occupy their own row above replay buttons; resident summaries use larger portraits and always show abilities.
- A free ticket shop with repeatable 10/100/1,000-ticket packs and no payment, ads or daily refill cap; duplicate network retries grant a pack only once. Its Gold exchange tab spends one ticket for 100 gold, with server-side balance/overflow checks and idempotent payment. Open it from the ticket counter; there is no duplicate refill button on the invitation page.
- Original procedural pentatonic background music and soft interaction sounds, with separate mute controls and volume. Playback starts after interaction and pauses when the page is hidden.
- Multiple worlds, memory and AI guideline management, invitations, automatic selling, and backups that carry resident pictures and stored stories.

Schema 14 migration adopts the highest prior recipe target as the shared target while retaining running work, switches, priorities, stock and currency. Older package versions cannot read schema 14; keep a backup before downgrading. Schema 13 migration enables all existing recipes once and clears unstarted counted requests while preserving targets, priorities and in-flight jobs. Subsequent manual off choices remain unchanged. Back up before downgrading; older package versions cannot read schema 13.

Choose Engine model connections under Settings → 관리 → AI 모델 연결 설정. Profile, story and letter connections remain separate. A failed generation does not consume another expedition or replace saved stories. Legacy profiles explicitly edited by the player are preserved; existing published chapters retain their original plan until the next chapter.

The package never calls character avatar generation or `integrations.images.*`, never copies a character or persona avatar, and never edits a character card or persona. Resident pictures are uploaded by the player.

## Install

Forest Workshop is published from the owner's fork, not the official Pasta-Devs catalog. The Engine reads it
through a catalog override:

```text
MARINARA_AGENT_CATALOG_URL=https://raw.githubusercontent.com/marittini/ME-personal-A/main/catalog/v2/catalog.json
```

The override replaces the whole official list; this catalog lists Forest Workshop only. Keep the
original value before changing it. Then open **Agents → Download Agents**, install Forest Workshop, restart when
prompted, and open **Home → 숲결 공방**.

## Compatibility

Built and checked against ME-personal 2.5.1 (`7f341f9186db8e08f21d63cc47ec458deff250d5`) with capability API 1.341.
Engine versions below 2.5.1 are not offered the package.

## Data

Package documents use kinds `fw-world` (one per world), `fw-command` (one per accepted command, for idempotency), `fw-story` (one immutable generated scene), `fw-p0` (the connection-check picture slot) and `fw-p0-probe` (temporary, removed by each check).
Uninstalling the package does not delete the gallery picture; the Global Gallery protects a picture while a package
document references it.

## Source

Package-owned source lives under `src/engine/` in the Engine tree layout the feature builder expects. Rebuild with
`node scripts/build-feature-packages.mjs forest-workshop` from an Engine checkout set in `MARINARA_ENGINE_ROOT`; never
hand-edit `server.mjs`, `client.js`, `manifest.json` or the artifact.
