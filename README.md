# Minidril App v0.7.0

## Introduction

English learning app focused on maximum repetition per given practice time. By using flashcards, you can get up to 400 repetitions in 20 minutes of practice.

## Technologies Used

- **Frontend:** React, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js, PostgreSQL
- **Mobile:** Expo, SQLite, React Native

## Documentation

branching strategy
feat(auth): add JWT login
feat - feature
fix
chore - project setup and organization
docs - changes to documentatino
refactor
test - adding test

## Basic Principles

The app provides continuous practice of vocabulary and grammar with flashcards.

## Database

**Basic tables:**

- `users` - identifies user, link firebase uid with databaser users.id
- `user_score` - to save daily practice blocks
- `items` — vocabulary items or grammar items
- `user_items` - saves user item's progress
- `blocks` — blocks with linked notes
  - Blocks of category 1 and 2 should be the same size as `backend/config.round` (10), but this is not a necessity
- `block_items` - connects items to helper blocks N:N, primary blocks are linked directly with items.block_id 1:N
- `user_blocks` - saves user block's progress, block is meant to go together only first time
- `notes` — grammar explanation
- `languages` - to identify different target languages
- `levels` - sorting items and grammar blocks into different levels, so purpose is to provide user feedback of overall progress
- `categories` — categories of blocks grouping; every item should belong only to one of 1, 2, or 4 groups
- `parts_of_speech` - to distinquish verbs, nouns etc.

**Category meanings:**

- `1` — grammar explanation, basic grammar for given topic with linked note
- `2` — grammar practice, additional grammar practice for given topic with linked note
- `4` — vocabulary, links all non-grammar items for given language
- `10` — semantic field, links together similar sounding words
- `11` — lemmatization, grouping together words with same word roots (e.g. run, running, runner); strictly for developer data management

## Backend Principles

### getItemsRepository

Crucial function of practice logic. Returns the most practice round of items (10).

Items sorting is a key part of logic. Vocabulary `items.sequence` provides basic sequence and blocks are mixed in between them with `blocks.sequence`.

**Sort Order Principles:**

- Already practiced items
- New items by block or item sequence

\*\*
