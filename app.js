/* CineMatch - a lightweight content-based recommendation engine. */
(() => {
  const MOVIES = [
    { id: "inception", title: "Inception", year: 2010, genres: ["Sci-Fi", "Thriller"], tags: ["mind-bending", "dream", "heist", "cerebral", "stylish"], symbol: "◒", art: "linear-gradient(135deg, #14284c, #4e8ee5)" },
    { id: "interstellar", title: "Interstellar", year: 2014, genres: ["Sci-Fi", "Drama"], tags: ["space", "cosmic", "time", "family", "epic"], symbol: "✦", art: "linear-gradient(135deg, #151a35, #8575b7)" },
    { id: "matrix", title: "The Matrix", year: 1999, genres: ["Sci-Fi", "Action"], tags: ["simulation", "cyberpunk", "rebellion", "mind-bending", "stylish"], symbol: "▣", art: "linear-gradient(135deg, #09251a, #4f9367)" },
    { id: "arrival", title: "Arrival", year: 2016, genres: ["Sci-Fi", "Drama"], tags: ["alien", "language", "cerebral", "emotional", "mystery"], symbol: "◯", art: "linear-gradient(135deg, #413334, #c38463)" },
    { id: "blade-runner", title: "Blade Runner 2049", year: 2017, genres: ["Sci-Fi", "Mystery"], tags: ["cyberpunk", "noir", "futuristic", "investigation", "atmospheric"], symbol: "◐", art: "linear-gradient(135deg, #54304f, #e48555)" },
    { id: "mad-max", title: "Mad Max: Fury Road", year: 2015, genres: ["Action", "Adventure"], tags: ["post-apocalyptic", "chase", "survival", "explosive", "dystopian"], symbol: "≋", art: "linear-gradient(135deg, #9a331f, #d59a43)" },
    { id: "dark-knight", title: "The Dark Knight", year: 2008, genres: ["Action", "Crime"], tags: ["superhero", "crime", "moral", "city", "thriller"], symbol: "◖", art: "linear-gradient(135deg, #1f3345, #6e7881)" },
    { id: "parasite", title: "Parasite", year: 2019, genres: ["Thriller", "Drama"], tags: ["class", "tension", "dark", "satire", "family"], symbol: "⌂", art: "linear-gradient(135deg, #1f463c, #6ea685)" },
    { id: "knives-out", title: "Knives Out", year: 2019, genres: ["Mystery", "Comedy"], tags: ["detective", "family", "whodunit", "clever", "estate"], symbol: "♢", art: "linear-gradient(135deg, #633033, #c89965)" },
    { id: "grand-budapest", title: "The Grand Budapest Hotel", year: 2014, genres: ["Comedy", "Adventure"], tags: ["quirky", "colorful", "hotel", "friendship", "whimsical"], symbol: "▤", art: "linear-gradient(135deg, #a94d71, #e9a49e)" },
    { id: "spirited-away", title: "Spirited Away", year: 2001, genres: ["Animation", "Fantasy"], tags: ["magical", "journey", "coming-of-age", "wonder", "spirit"], symbol: "❋", art: "linear-gradient(135deg, #268390, #76b7af)" },
    { id: "coco", title: "Coco", year: 2017, genres: ["Animation", "Family"], tags: ["music", "family", "emotional", "afterlife", "colorful"], symbol: "♫", art: "linear-gradient(135deg, #943d47, #e6a845)" },
    { id: "la-la-land", title: "La La Land", year: 2016, genres: ["Romance", "Drama"], tags: ["music", "dream", "creative", "bittersweet", "city"], symbol: "♬", art: "linear-gradient(135deg, #305ba4, #d96786)" },
    { id: "notebook", title: "The Notebook", year: 2004, genres: ["Romance", "Drama"], tags: ["love", "period", "emotional", "memory", "family"], symbol: "♥", art: "linear-gradient(135deg, #825764, #d7a582)" },
    { id: "whiplash", title: "Whiplash", year: 2014, genres: ["Drama", "Music"], tags: ["ambition", "music", "tension", "teacher", "intense"], symbol: "◖", art: "linear-gradient(135deg, #2e2534, #b9684c)" },
    { id: "dune", title: "Dune", year: 2021, genres: ["Sci-Fi", "Adventure"], tags: ["desert", "politics", "epic", "destiny", "action"], symbol: "⌇", art: "linear-gradient(135deg, #856145, #d8b271)" },
    { id: "social-network", title: "The Social Network", year: 2010, genres: ["Drama", "Biography"], tags: ["ambition", "startup", "rivalry", "clever", "city"], symbol: "⌘", art: "linear-gradient(135deg, #23394d, #6c9bb6)" },
    { id: "everything-everywhere", title: "Everything Everywhere All at Once", year: 2022, genres: ["Sci-Fi", "Action"], tags: ["multiverse", "family", "surreal", "emotional", "rebellion"], symbol: "∞", art: "linear-gradient(135deg, #6e3c61, #d77672)" },
  ];

  const GENRES = [...new Set(MOVIES.flatMap((movie) => movie.genres))].sort();

  function featureWeights(movie) {
    const weights = new Map();
    for (const genre of movie.genres) weights.set(`genre:${genre.toLowerCase()}`, 3);
    for (const tag of movie.tags) weights.set(`tag:${tag.toLowerCase()}`, 1);
    return weights;
  }

  function cosineSimilarity(first, second) {
    const firstWeights = featureWeights(first);
    const secondWeights = featureWeights(second);
    let dotProduct = 0;
    let firstMagnitude = 0;
    let secondMagnitude = 0;

    for (const value of firstWeights.values()) firstMagnitude += value ** 2;
    for (const value of secondWeights.values()) secondMagnitude += value ** 2;
    for (const [feature, weight] of firstWeights) dotProduct += weight * (secondWeights.get(feature) || 0);
    return dotProduct / Math.sqrt(firstMagnitude * secondMagnitude);
  }

  function preferenceScore(movie, preferredGenres) {
    if (!preferredGenres.length) return 0;
    const matches = movie.genres.filter((genre) => preferredGenres.includes(genre)).length;
    return matches / preferredGenres.length;
  }

  function getRecommendations(favoriteId, preferredGenres = [], limit = 6) {
    const favorite = MOVIES.find((movie) => movie.id === favoriteId);
    if (!favorite) throw new Error("Choose a movie from the available collection.");

    return MOVIES
      .filter((movie) => movie.id !== favorite.id)
      .map((movie) => {
        const similarity = cosineSimilarity(favorite, movie);
        const preference = preferenceScore(movie, preferredGenres);
        const score = similarity * 0.78 + preference * 0.22;
        return { ...movie, score, similarity, preference };
      })
      .sort((first, second) => second.score - first.score || first.title.localeCompare(second.title))
      .slice(0, limit);
  }

  const engine = { MOVIES, GENRES, cosineSimilarity, getRecommendations };
  if (typeof module !== "undefined" && module.exports) module.exports = engine;
  if (typeof document === "undefined") return;

  const favoriteSelect = document.querySelector("#favorite-select");
  const genreChips = document.querySelector("#genre-chips");
  const recommendButton = document.querySelector("#recommend-button");
  const recommendationsElement = document.querySelector("#recommendations");
  const profileSummary = document.querySelector("#profile-summary");
  const selectedGenres = new Set();

  function renderSelect() {
    favoriteSelect.innerHTML = MOVIES.map((movie) => `<option value="${movie.id}">${movie.title} (${movie.year})</option>`).join("");
    favoriteSelect.value = "inception";
  }

  function renderGenreChips() {
    genreChips.innerHTML = GENRES.map((genre) => `<button class="genre-chip" data-genre="${genre}" type="button" aria-pressed="false">${genre}</button>`).join("");
    genreChips.querySelectorAll(".genre-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const { genre } = chip.dataset;
        if (selectedGenres.has(genre)) selectedGenres.delete(genre);
        else selectedGenres.add(genre);
        chip.classList.toggle("is-selected", selectedGenres.has(genre));
        chip.setAttribute("aria-pressed", String(selectedGenres.has(genre)));
      });
    });
  }

  function matchPercent(score) {
    return Math.max(12, Math.round(score * 100));
  }

  function renderRecommendations() {
    const favorite = MOVIES.find((movie) => movie.id === favoriteSelect.value);
    const genres = [...selectedGenres];
    const results = getRecommendations(favorite.id, genres);
    const preferenceText = genres.length ? `plus your ${genres.join(", ")} preference${genres.length > 1 ? "s" : ""}` : "using its genres and story tags";
    profileSummary.textContent = `Because you enjoyed ${favorite.title}, these picks are matched ${preferenceText}.`;

    recommendationsElement.innerHTML = results.map((movie) => {
      const tags = movie.genres.concat(movie.tags.slice(0, 2)).map((tag) => `<span>${tag}</span>`).join("");
      const match = matchPercent(movie.score);
      return `<article class="movie-card">
        <div class="movie-art" style="background: ${movie.art}"><span class="movie-symbol">${movie.symbol}</span><p>${movie.title}</p></div>
        <div class="movie-body"><p class="movie-meta">${movie.year} · ${movie.genres.join(" / ")}</p><div class="movie-tags">${tags}</div>
          <div class="match-row"><span>${match}% match</span><span class="match-bar"><i style="width:${match}%"></i></span></div>
        </div>
      </article>`;
    }).join("");
  }

  renderSelect();
  renderGenreChips();
  renderRecommendations();
  recommendButton.addEventListener("click", renderRecommendations);
})();
