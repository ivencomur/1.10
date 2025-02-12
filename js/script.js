let pokeRepo = (function() {
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
  function getAll() {
    return pokemonList;
    }
  
    function add(pokemon) {
      pokemonList.push(pokemon);
    }
  
    function loadList() {
      return fetch(apiUrl)
        .then(function(response) {
          return response.json();
        })
        .then(function(json) {
          json.results.forEach(function(item) {
            let pokemon = {
              name: item.name,
              detailsUrl: item.url
            };
            add(pokemon);
          });
        })
        .catch(function(error) {
          console.error(error);
        });
    }  
    function loadDetails(pokemon) {
      return fetch(pokemon.detailsUrl)
        .then(function(response) {
          return response.json();
        })
        .then(function(details) {
          pokemon.height = details.height / 10;
          pokemon.types = details.types.map(function(type) {
            return type.type.name;
          }).join(", ");
          pokemon.imageUrl = details.sprites.front_default;
        })
        .catch(function(error) {
          console.error(error);
        });
    }  
    function showDetails(pokemon) {
      loadDetails(pokemon).then(function() {
        document.getElementById("pokemonModalLabel").innerText = pokemon.name;
        document.getElementById("modal-image").src = pokemon.imageUrl;
        document.getElementById("modal-height").innerText = 'Height: ' + pokemon.height + 'm';
        document.getElementById("modal-types").innerText = 'Types: ' + pokemon.types;
        $('#pokemonModal').modal('show');
      });
    }  
    function addButtonEvent(button, pokemon) {
      button.addEventListener("click", function() {
        showDetails(pokemon);
      });
    }  
    function addListItem(pokemon) {
      let pokemonList = document.querySelector(".pokemon-list");
      let listItem = document.createElement("li");
      listItem.classList.add("list-group-item");
      let button = document.createElement("button");
      button.classList.add("btn", "btn-primary", "pokemon-button");
      button.setAttribute("data-toggle", "modal");
      button.setAttribute("data-target", "#pokemonModal");
      button.innerText = pokemon.name;
      listItem.appendChild(button);
      pokemonList.appendChild(listItem);
      addButtonEvent(button, pokemon);
    }  
    return {
      getAll: getAll,
      add: add,
      addListItem: addListItem,
      loadList: loadList,
      loadDetails: loadDetails,
      showDetails: showDetails
    };
  })();
  
  pokeRepo.loadList().then(function() {
    pokeRepo.getAll().forEach(function(pokemon) {
      pokeRepo.addListItem(pokemon);
    });
  });
