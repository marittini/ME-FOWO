# Forest Workshop (숲결 공방)

A portrait cozy workshop game for ME-personal, in development. `forest-workshop` is the development ID; the display
name 숲결 공방 is provisional. The design contract is *Development_Plan_FINAL_v1_6* (숲속 공방 독립 에이전트 최종
개발계획서 v1.6); `docs/forest-workshop/` in this repository records what has been implemented and verified.

## What 0.8.0 includes

- On first entry, review the AI connections and choose a starting resident before opening the welcome kit. Register characters and personas as workshop residents. Selecting a source automatically prepares a full adapted profile; confirm it or edit it before registering. Original cards stay unchanged.
- Five production fields with all recipes enabled by default. Production settings contains recipes, stock targets and priorities; counted queues have been removed. Pick a goal recipe to configure its ingredient tree across facilities. Protection and automatic-sale retention keep needed materials available; locked facilities still need unlocking.
- Pair-specific three-episode story plans, followed by scenes that use the canonical workshop profiles and shared memories. Already published scenes remain unchanged.
- Survey and patrol activities prepare a resident letter automatically when their result reaches the game. Open the mailbox to read it; generation failures retain the activity record and offer a retry.
- Click the bulletin board standing beside the Home workshop to open today's delivery requests; move its position with the ground editor. Residents stay in front of the board. Touching a resident shows a mood mark while movement continues.
- Real weather from Open-Meteo for the selected preset city, refreshed every 15 minutes. Choose the city under Settings → 내 공방; Seoul is the default. Weather effects can be disabled separately.
- Bundled, licensed Jua typography, readable profile paragraphs, responsive mobile spacing, and three quiet outdoor story backgrounds.
- Arrow page navigation, centered resident-detail popups and editable workshop display names. Original source names stay unchanged.
- A free ticket shop with repeatable 10/100/1,000-ticket packs and no payment, ads or daily refill cap; duplicate network retries grant a pack only once.
- Original procedural pentatonic background music and soft interaction sounds, with separate mute controls and volume. Playback starts after interaction and pauses when the page is hidden.
- Multiple worlds, memory and AI guideline management, invitations, automatic selling, and backups that carry resident pictures and stored stories.

Schema 13 migration enables all existing recipes once and clears unstarted counted requests while preserving targets, priorities and in-flight jobs. Subsequent manual off choices remain unchanged. Back up before downgrading; older package versions cannot read schema 13.

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
