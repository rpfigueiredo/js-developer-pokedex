
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {

    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    pokemon.height = pokeDetail.height * 0.1

    pokemon.centimeters = pokemon.height * 100;

    pokemon.weight = pokeDetail.weight / 10;

    const abilities = pokeDetail.abilities.map((abilitySlot) => abilitySlot.ability.name)

    pokemon.abilities = abilities

    return fetch(pokeDetail.species.url)
        .then(response => response.json())
        .then(speciesDetail => {
            const genusEntry = speciesDetail.genera[7];
            pokemon.species = genusEntry.genus.replace(' Pokémon', '');;

            const eggsEntry = speciesDetail.egg_groups.map((egg) => egg.name)
            pokemon.eggGroups = eggsEntry

            // Calcular a porcentagem de macho e fêmea com base na taxa de gênero (rate)
            const rate = speciesDetail.gender_rate;
            let malePercentage, femalePercentage;
            if (rate === -1) {
                malePercentage = 0;
                femalePercentage = 0; 
            } else if (rate === 0) {
                malePercentage = 100; 
                femalePercentage = 0; 
            } else if (rate === 8) {
                malePercentage = 0; 
                femalePercentage = 100; 
            } else {
                femalePercentage = (rate / 8) * 100; 
                malePercentage = 100 - femalePercentage; 
            }

            pokemon.malePercentage = malePercentage;
            pokemon.femalePercentage = femalePercentage; 

            pokemon.habitat = speciesDetail.habitat.name;

            return pokemon;
        })

}

pokeApi.getPokemonDetailByNumber = (pokemonNumber) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}/`

    return fetch(url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}


pokeApi.getPokemonDetail = (pokemon) => {
    
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)

}
