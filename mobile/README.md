# Zdeněk Barth's English Learning App

## Description

A personal English learning app designed with simplicity similar to ANKI, but with a prebuilt English learning progression. Originally tested as a web app, it is now being converted to mobile using Expo.

I believe many features in existing English learning apps can hinder progress. When learners are presented with options, they often choose what feels easiest, like games or reading. However, the most critical aspects of learning any language are **listening** and **speaking**. This app focuses on hard, effective methods to help users progress faster.

Development and user testing of the web version provided insights into what works and what doesn’t. The mobile version will be significantly simplified and polished, focusing only on features that are proven to be effective.

### Goals of the App:

1. **Maximize Practice Density**  
   Drill as many practice attempts as possible within a given time. This is best achieved with flashcards and a continuous sequence of items without interruptions.
2. **Alternating Practice in Both Directions**  
   Listening and speaking are the most important parts of language learning. Flashcards alternate between two directions:

   - Listening to English and translating to Czech.
   - Reading Czech and translating to English.

3. **Spaced Repetition System (SRS)**  
   With dense practice repetition, each item is repeated at least five times on the first day.

4. **User Feedback**

   - **Daily Practice Count:** Encourages users to start practicing. The recommended minimum is 400 items or approximately 20 minutes.
   - **Progression Levels:** Items are organized into levels of 100 items to provide granular progress feedback.

5. **Flexible Practice Duration**  
   While there is a recommended minimum, the practice sequence is continuous. Users can practice for as long as they want, even for 10 hours straight.

6. **Contextual Learning**  
   Vocabulary is first learned independently and then reinforced in sentence contexts.

---

## Prerequisites

To run the app, you need the following:

- **Expo**
- **React Native**
- **Native Wind**
- **expo-sqlite**
- **expo-audio**
- **expo-file-system**
- **uid**

---

## Database

### Database Structure

The app uses an SQLite database to store user progress, vocabulary, and grammar data. Below is a high-level overview of the database structure:

- **users**: Stores user information.
- **items**: Stores practice items (vocabulary and grammar sentences).
- **blocks**: Groups items into vocabulary or grammar group. Recommended size is 10 items.
- **grammar**: Stores grammar explanations.
- **user_items**: Tracks user progress for individual items.
- **user_score**: Tracks daily practice scores for users.

For detailed table definitions and column explanations, see the `database-sqlite.sql` file.

### Data Structure

Each item represents a single vocabulary word or a sentence for practicing grammar. Items are sequenced starting from 1, with 1 being the learning start point.

---

## Git Guidelines

### Branching Strategies

- **master**: Production branch  
  ├── **v0.9.0**: Development branch

### Commit Message Standard

Format: `<type>: <description>`

#### Commit Types:

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation updates
- **style**: UI or design changes
- **refactor**: Code refactoring
- **chore**: Dependency or installation updates
- **test**: Adding or updating tests
- **perf**: Performance optimizations
- **ios**: iOS-specific changes
- **android**: Android-specific changes

---

## Possible Future Development

### v0.10.0

- Push notifications
- Audio pause functionality

### v0.11.0

- Synchronization
- Authentication and online sync database

### v0.12.0

- Support for multiple learned languages

### v0.13.0

- Support for multiple source languages
