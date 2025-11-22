import recipes from './recipes.mjs';

function getRandomNumber(max) {
    return Math.floor(Math.random() * max);
}

function getRandomListEntry(list) {
    return list[getRandomNumber(list.length)];
}

function tagsTemplate(tags) {
  return tags
    .map(tag => `<span class="recipe-tag">${tag}</span>`)
    .join('');
}

function ratingTemplate(rating) {
  let html = `<span class="rating" role="img" aria-label="Rating: ${rating} out of 5 stars">`;

  const rounded = Math.round(rating);

  for (let i = 1; i <= 5; i++) {
    if (i <= rounded) {
      html += `<span aria-hidden="true">⭐</span>`;
    } else {
      html += `<span aria-hidden="true">☆</span>`;
    }
  }

  html += `</span>`;
  return html;
}

function recipeTemplate(recipe) {
  return `
    <section class="recipe-card">
      <img src="${recipe.image}" alt="${recipe.name}">
      <div class="recipe-info">
        ${tagsTemplate(recipe.tags)}
        <h2>${recipe.name}</h2>
        ${ratingTemplate(recipe.rating)}
        <p class="recipe-description">${recipe.description}</p>
      </div>
    </section>
  `;
}

function renderRecipes(recipeList) {
  const container = document.querySelector('#recipes');
  container.innerHTML = recipeList.map(recipeTemplate).join('');
}

function init() {
  const recipe = getRandomListEntry(recipes);
  renderRecipes([recipe]);

  const form = document.querySelector('.search-form');
  form.addEventListener('submit', searchHandler);
}

init();




function filterRecipes(query) {
  const q = query.toLowerCase();

  const filtered = recipes.filter((recipe) => {
    const inName = recipe.name.toLowerCase().includes(q);
    const inDesc = recipe.description.toLowerCase().includes(q);

    const inTags = recipe.tags.find((tag) =>
      tag.toLowerCase().includes(q)
    );

    const inIngredients = recipe.recipeIngredient.find((ing) =>
      ing.toLowerCase().includes(q)
    );

    return inName || inDesc || inTags || inIngredients;
  });

  return filtered.sort((a, b) => a.name.localeCompare(b.name));
}

function searchHandler(event) {
  event.preventDefault();
  const input = document.querySelector('#search');
  const query = input.value.trim();
  const results = filterRecipes(query);
  renderRecipes(results);
}

