# CODSOFT_TASK4 - CineMatch Recommendation System

CineMatch is an offline, browser-based movie recommendation system. It recommends movies through **content-based filtering**, comparing a film's genres and story tags with the user's selected preferences.

## Features

- Polished, responsive graphical interface
- Curated catalogue of 18 movies across multiple genres
- Recommendations driven by a movie the user enjoyed
- Optional genre-preference chips to guide the results
- Feature-weighted cosine similarity algorithm
- No installation, API key, or internet connection required

## Run the project

Open `index.html` in any modern browser. The app works immediately and runs entirely on the device.

## Test the recommendation engine

```bash
node test_engine.js
```

The tests check that similar movies score higher than unrelated movies, the source movie is excluded, results are ranked correctly, a genre preference affects results, and unknown movie IDs are rejected.

## How the recommendation engine works

1. Every movie is represented by a feature profile consisting of **genres** and **story tags**.
2. Genres receive a weight of 3 because they are broad, highly meaningful signals. Story tags receive a weight of 1.
3. The system calculates cosine similarity between the favourite movie and every other movie.
4. Selected genres add an additional preference score.
5. The final ranking is 78% similarity and 22% selected-genre preference.
6. The six highest-scoring movies are presented as recommendations.

The relevant functions are `featureWeights()`, `cosineSimilarity()`, and `getRecommendations()` in `app.js`.

## Suggested video demo

1. Open the app and introduce the content-based filtering approach.
2. Choose **Inception** and show the recommended science-fiction and thriller films.
3. Add **Romance** as a genre preference and regenerate the recommendations to show that the profile changes.
4. Point out the match percentages and the explanation panel.
5. Briefly show `getRecommendations()` in `app.js` and explain the weighted cosine similarity calculation.
