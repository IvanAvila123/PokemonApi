document.addEventListener('DOMContentLoaded', async () => {
  const pokemonIds = [...Array(898).keys()].map(id => id + 1);
  const cardContainer = document.querySelector('.card-container');
  const searchInput = document.getElementById('buscar');

  async function getPokemonInfoById(pokemonId) {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener información del Pokémon ${pokemonId}:`, error);
      return null;
    }
  }

  //se crea una funcion para crear las cards 

  async function createPokemonCard(pokemonData) {
    const card = document.createElement('div');
    card.classList.add('card', 'card-pokemon');

    const img = document.createElement('img');
    img.classList.add('img-pokemon');
    img.alt = '...';
    img.src = pokemonData.sprites.front_default;

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const cardTitle = document.createElement('h3');
    cardTitle.classList.add('card-title', 'text-center');
    cardTitle.textContent = pokemonData.name;

    const statsRow = document.createElement('div');
    statsRow.classList.add('row', 'justify-content-between');

    const hpCol = document.createElement('div');
    hpCol.classList.add('col-4');
    hpCol.textContent = `HP: ${pokemonData.stats[0].base_stat}%`;

    const damageCol = document.createElement('div');
    damageCol.classList.add('col-4');
    damageCol.textContent = `Damage: ${pokemonData.stats[1].base_stat}%`;

    const experienceCol = document.createElement('div');
    experienceCol.classList.add('col-4');
    experienceCol.textContent = `Experience: ${pokemonData.base_experience}%`;

    statsRow.appendChild(hpCol);
    statsRow.appendChild(damageCol);
    statsRow.appendChild(experienceCol);

    cardBody.appendChild(cardTitle);
    card.appendChild(img);
    card.appendChild(cardBody);
    card.appendChild(statsRow);

    const moreInfoButton = document.createElement('button');
    moreInfoButton.classList.add('btn', 'btn-primary', 'btn-sm');
    moreInfoButton.textContent = 'Mas Informacion';
    moreInfoButton.addEventListener('click', () => openPokemonModal(pokemonData));
    cardBody.appendChild(moreInfoButton);

    cardContainer.appendChild(card);
  }

  async function fetchAndFillPokemonInfo() {
    for (const pokemonId of pokemonIds) {
      const pokemonData = await getPokemonInfoById(pokemonId);
      if (pokemonData) {
        createPokemonCard(pokemonData);
      }
    }
  }

  fetchAndFillPokemonInfo();

  function openPokemonModal(pokemonData) {
    const modal = new bootstrap.Modal(document.getElementById('pokemonModal'));
    const modalTitle = document.getElementById('pokemonName');
    const modalWeight = document.getElementById('pokemonWeight');
    const modalAttacks = document.getElementById('pokemonAttacks');
    const modalType = document.getElementById('pokemonType');

    modalTitle.textContent = pokemonData.name;
    modalWeight.textContent = `${pokemonData.weight}`;
    modalAttacks.textContent = `${pokemonData.attacks}`;
    modalType.textContent = `${pokemonData.types.map(type => type.type.name).join(', ')}`

    modal.show();
  }

  //este codigo es el buscador en tiempo real

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const cards = cardContainer.getElementsByClassName('card-pokemon');
    Array.from(cards).forEach(card => {
      const pokemonName = card.querySelector('.card-title').textContent.toLowerCase();
      if (pokemonName.includes(searchTerm)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});








