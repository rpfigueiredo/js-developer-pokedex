const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const pokemonDetails = document.getElementById('pokemonDetails')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" onclick="redirectToDetails(${pokemon.number})">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function convertDetails(pokemon) {
    return `
    <section class="content ${pokemon.type}"" >
    <div class="back-button">
    <a href="javascript:history.back()">
        <img src="/assets/img/seta.png" alt="Voltar">
    </a>
</div>
    <div class="poke" >
        <div class="info">
            <span class="name">${pokemon.name}</span>
            <div class="detail">
                <ol class="types">
                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
            </div>
            </div>
            <span class="number">#${pokemon.number}</span>
            <img src="${pokemon.photo}">
       
    </div>
    <div class="about">
        <ul class="tabs">
            <li class="active text-color-${pokemon.type}">Sobre</li>
        </ul>
        <div class="stats">
            <span class="character uppercase"><span class="name">Categoria:</span>${pokemon.species}</span>
            <span class="character"><span class="name">Altura:</span>${pokemon.height.toFixed(1)} ${pokemon.height === 1 ? 'metro' : 'metros'} (${pokemon.centimeters.toFixed(1)} cm)</span>
            <span class="character"><span class="name">Peso:</span> ${pokemon.weight} kg</span>
            <span class="character uppercase"><span class="name">Habilidades:</span>${pokemon.abilities.map((abilities) => `${abilities}`).join(', ')}</span>
            <h2>Reprodução</h2>
            <span class="character gender"><span class="name">Gênero:</span><img src="/assets/img/male.png" class="gender-icon">${pokemon.malePercentage}% <img src="/assets/img/famale.png" class="gender-right">${pokemon.femalePercentage}%</span>
            <span class="character uppercase"><span class="name">Grupos de ovos:</span>${pokemon.eggGroups.map((egg) => `${egg}`).join(', ')}</span>
            <span class="character uppercase"><span class="name">Habitat:</span>${pokemon.habitat}</span>
        </div>
    </div>
</section>
`
}



function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml

    })
}

window.redirectToDetails = function (pokemonNumber) {
    window.location.href = `details.html?pokemon=${pokemonNumber}`;
}

window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonNumber = urlParams.get('pokemon');

    if (pokemonNumber) {
        pokeApi.getPokemonDetailByNumber(pokemonNumber).then((pokemon) => {
            const newHtml = convertDetails(pokemon);
            pokemonDetails.innerHTML = newHtml;
        });        
    }
}

loadPokemonItens(offset, limit)


loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

