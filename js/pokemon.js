import colors from '../helpers/typesColors.js';

const pokemonSprite = document.getElementById('pokemonSprite');
const pokemonGroup = document.getElementById('pokemonGroup');

const antPokemon = document.getElementById('antPokemon');
const sigPokemon = document.getElementById('sigPokemon');



const sliderContainer = document.getElementById('sliderContainer');
const pantallaUnoContainer = document.getElementById('pantallaUnoContainer');
const pantallaUnoMain = document.getElementById( 'pantallaUnoMain' );



let params = new URLSearchParams(location.search);

let id = Number(params.get('id'));


let pokemon =  null;
let pokemonSpecies = null;

//refericia de si estamos en la info, o en las stats options
let info = true;

const changePokemonImage = () => {
  const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${ 386 + id}.png`
  pokemonSprite.removeAttribute('src');
  pokemonSprite.setAttribute('src' , url );
}

const fetchingPromises = async () => {

  const pokemonID = 386 + id;     
  const URL1 = `https://pokeapi.co/api/v2/pokemon/${ pokemonID  }`
  const URL2 = `https://pokeapi.co/api/v2/pokemon-species/${ pokemonID  }`;
  //const URL3 = `https://pokeapi.co/api/v2/pokemon/${ pokemonID }`
  
  //la primera promesa es para traer el nombre
  
  const promise1 = axios.get( URL1 )
  .then(function (response) {
    return response.data;
  }).catch(function (error) {console.log(error)});
  
  //la segunda promesa es para traer los grupos 
  
  const promise2 = axios.get(URL2)
  .then(function (response) {
    return response.data
  }).catch(function (error) {console.log(error);});
  

const promesasArray = [promise1, promise2];
  console.log( 'se ejecuto el fetch' );
  const [ res1 , res2 ] = await Promise.all( promesasArray );
  pokemon = res1;
  pokemonSpecies = res2;

} 

await fetchingPromises();


const capitalizarPrimeraLetra = (str)=> {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/*-------------------------------------------------------------------*/

const cleanPokemonInfo = (infoContainer, pokemonType) =>{
  //limpiamos el nombre de el pokemon
  Array.from(infoContainer.children).forEach( (element ) => {
    infoContainer.removeChild( element );
  });
  //limpiamos los tipos
  Array.from(pokemonType.children).forEach( ( type ) => {
    pokemonType.removeChild( type );
  });
}

/*-------------------------------------------------------------------*/

const clasesInfo = () =>{
  pantallaUnoContainer.classList.remove( 'pantalla-uno-stats' );
  pantallaUnoContainer.classList.add( 'pantalla-uno' );

  pantallaUnoMain.classList.add( 'pantalla-uno_main' );
  pantallaUnoMain.classList.remove( 'pantalle-uno_main-stats' );

  sliderContainer.classList.add('pantalla-uno_main_slider');
  sliderContainer.classList.remove('pantalla-uno_main_stats');

  pokemonSprite.parentNode.classList.remove('img-container-stat');
  pokemonSprite.parentNode.classList.add('img-container');
}

const construirInfoMenu = () => {
  /* reconstruir el menu de la info, luego que se llamara a las stats options*/
  sliderContainer.innerHTML = `
  <div class="info-container" id="infoContainer">        
  </div>
                        
  <div class="pokemon-types" id="pokemonTypes">
  </div>

  <div class="peso-altura-container" id="pesoAlturaContainer">    
  </div>
  `
  /* reconstruir footer */
  const footer = document.createElement( 'div' );
  footer.classList.add('pantalla-uno_footer');
  footer.setAttribute( 'id', 'pantallaUnoFooter' );
  footer.innerHTML = `
  <span></span>
  <div id="flavorText"></div>
  <span></span>
  `
  pantallaUnoContainer.appendChild(footer)

  return {
    infoContainer: Array.from(sliderContainer.children)[0],
    pokemonType: Array.from(sliderContainer.children)[1],
    pesoAlturaContainer: Array.from( sliderContainer.children)[2],
    flavorText: Array.from( footer.children )[1]
  }
}

/*-------------------------------------------------------------------*/

const changePokemonInfo=(infoContainer, pokemonType, pesoAlturaContainer,flavorText)=>{

  if( Array.from(infoContainer).length === 0 ){
    const infoName = document.createElement('div');
    infoName.classList.add( 'info-name' );
    infoName.innerHTML = `
    <span class="poke-ball-icon"></span>
    <p id="pokemonName">
    ${ id.toString().padStart(3,"0")} ${ pokemon.name.toUpperCase()}
    </p>
    `
    const p = document.createElement('p');
    p.setAttribute( 'id', 'pokemonGroup' );
    infoContainer.appendChild(infoName);
    infoContainer.appendChild(p); 
  }


    //const pokemonName = document.getElementById('pokemonName');
    //                          el numero de el pokemon           el nombre de el pokemon
    //pokemonName.innerText = `${ id.toString().padStart(3,"0")} ${ pokemon.name.toUpperCase() }`;
    //ya luego volvere a colocar esto de arriba
      const types = pokemon.types.map((type) => type.type.name);

      types.forEach( type => {
  
        const divType = document.createElement('div');
        divType.classList.add('type');
        divType.style.backgroundColor = `${colors[type]}`;
        divType.innerHTML = `<p>${type}</p>`

        pokemonType.appendChild(divType);

      });
  
    

    const altura = pokemon.height/10
    const peso = pokemon.weight /10;

    pesoAlturaContainer.innerHTML = `
      <p> <spam>ALT. </span> ${altura}m</p>
      <p> <spam>PESO </span> ${peso}kg</p>
    `

    //description
    const pokemonDescription = pokemonSpecies["flavor_text_entries"]
          .find( (objeto) =>{
          return objeto.language.name === 'en'
          }).flavor_text ;
    
    flavorText.innerHTML = `
    <p>
    ${pokemonDescription}
    </p>
    `
}

changePokemonImage();

const { infoContainer, 
  pokemonType, 
  pesoAlturaContainer,
  flavorText } = construirInfoMenu();

changePokemonInfo(infoContainer, 
  pokemonType, 
  pesoAlturaContainer,
  flavorText);


  const getContainers = () => {
    const infoContainer = document.getElementById('infoContainer');
    const pokemonType = document.getElementById('pokemonTypes');
    const pesoAlturaContainer = document.getElementById('pesoAlturaContainer');
    const flavorText = document.getElementById('flavorText');

    return {
    infoContainer, 
    pokemonType, 
    pesoAlturaContainer,
    flavorText
    }
  }
  

antPokemon.onclick = async () => {
  if( 1 < id  ){
    if(info){
      id = id - 1 ;
      await fetchingPromises();
      changePokemonImage();
      const { 
        infoContainer, 
        pokemonType, 
        pesoAlturaContainer,
        flavorText 
      } = getContainers();
  
      cleanPokemonInfo(
        infoContainer, 
        pokemonType,
      );
      
      changePokemonInfo(
        infoContainer, 
        pokemonType, 
        pesoAlturaContainer,
        flavorText
      );
      history.replaceState(null , 'pokemon', `./pokemon.html?id=${ id - 1 }`);
    }else{
      if(!info){
        id = id - 1 ;
        await fetchingPromises();
        changePokemonImage();
        clasesInfo();
        const { infoContainer, 
        pokemonType, 
        pesoAlturaContainer,
        flavorText } = construirInfoMenu();
        changePokemonInfo(infoContainer, 
        pokemonType, 
        pesoAlturaContainer,
        flavorText);
        updateButtonStyles();
        info = !info;
      }
    }
    
  }
  //location.replace(`./pokemon.html?id=${ id + 1 }`);  
}

sigPokemon.onclick = async () =>{
  if( id <= 100 ){
    if(info){
      id = id + 1 ;
    await fetchingPromises();
    changePokemonImage();
    const { 
      infoContainer, 
      pokemonType, 
      pesoAlturaContainer,
      flavorText 
    } = getContainers();
    
    
    cleanPokemonInfo(
      infoContainer, 
      pokemonType, 
    );
    
    changePokemonInfo(
      infoContainer, 
      pokemonType, 
      pesoAlturaContainer,
      flavorText
    );

    history.replaceState(null , 'pokemon', `./pokemon.html?id=${ id + 1 }`);

    }else{
      if( !info ){
        id = id + 1 ;
        await fetchingPromises();
        changePokemonImage();
        clasesInfo();

        const { infoContainer, 
        pokemonType, 
        pesoAlturaContainer,
        flavorText } = construirInfoMenu();
        
        changePokemonInfo(infoContainer, 
        pokemonType, 
        pesoAlturaContainer,
        flavorText);
    
        updateButtonStyles();
        
        info = !info;
      }
    }
  }
  //location.replace(`./pokemon.html?id=${ id + 1 }`);
}

const goBack = document.getElementById('goBack');

goBack.onclick = () =>{
  //history.back();
  location.replace(`../`);
}

const infoButton = document.getElementById("infoButton");
const statsButton = document.getElementById("statsButton");

const updateButtonStyles = () => {
  if(!info){
    infoButton.classList.remove("info-inactive");
    infoButton.classList.add("info-active");
    statsButton.classList.remove("stats-active");
    statsButton.classList.add("stats-inactive");
    return true
  } 
  if(info){
    infoButton.classList.remove("info-active");
    infoButton.classList.add("info-inactive");
    statsButton.classList.remove("stats-inactive");
    statsButton.classList.add("stats-active");
    return true
  }
}

infoButton.onclick = () => {
  if(info){
    return true
  } else {

    clasesInfo();

    const { infoContainer, 
    pokemonType, 
    pesoAlturaContainer,
    flavorText } = construirInfoMenu();
    
    changePokemonInfo(infoContainer, 
    pokemonType, 
    pesoAlturaContainer,
    flavorText);

    updateButtonStyles();
    
    info = !info;
  }

}



const sapperStats = () => {
  Array.from( sliderContainer.children ).forEach( (element)=> {
    sliderContainer.removeChild( element );
  });

  const pantallaUnoFooter = document.getElementById('pantallaUnoFooter');
  pantallaUnoContainer.removeChild(pantallaUnoFooter);

  pantallaUnoContainer.classList.remove( 'pantalla-uno' );
  pantallaUnoContainer.classList.add( 'pantalla-uno-stats' );

  pantallaUnoMain.classList.remove( 'pantalla-uno_main' );
  pantallaUnoMain.classList.add( 'pantalle-uno_main-stats' );

  pokemonSprite.parentNode.classList.remove('img-container');
  pokemonSprite.parentNode.classList.add('img-container-stat');
}

const addCharts = () => {

  sliderContainer.classList.remove('pantalla-uno_main_slider');
  sliderContainer.classList.add('pantalla-uno_main_stats');
  
  sliderContainer.innerHTML = `
  
  ${ /* <span>Puntos base</span> */  '' } 

  <div class="charts-container">
      <div class="chart">
          <span class="bar"><span class="fill" id="ps"></span></span>
          <span>HP</span>
      </div>
  </div>

  <div class="charts-container">
      <div class="chart">
          <span class="bar"><span class="fill" id="ataque"></span></span>
          <span>Attack</span>
      </div>
  </div>

  <div class="charts-container">
      <div class="chart">
          <span class="bar"><span class="fill" id="defensa"></span></span>
          <span>Defense</span>
      </div>
  </div>

  <div class="charts-container">
      <div class="chart">
          <span class="bar"><span class="fill" id="ataqueEspecial"></span></span>
          <span>Special Attack</span>
      </div>
  </div>

  <div class="charts-container">
      <div class="chart">
          <span class="bar"><span class="fill" id="defensaEspecial"></span></span>
          <span>Special Defense</span>
      </div>
  </div>

  <div class="charts-container">
      <div class="chart">
          <span class="bar"><span class="fill" id="velocidad"></span></span>
          <span>Speed</span>
      </div>
  </div>
  `
}

const fill = () =>{

  const ps = document.getElementById('ps');
  const ataque = document.getElementById('ataque');
  const defensa = document.getElementById('defensa');
  const ataqueEspecial = document.getElementById('ataqueEspecial');
  const defensaEspecial = document.getElementById('defensaEspecial');
  const velocidad = document.getElementById('velocidad');
  
 const arrayStats = [
    {
      name: 'hp',
      stat: ps,
    },
    {
      name: 'attack',
      stat: ataque
    },
    {
      name: 'defense',
      stat: defensa
    },
    {
      name: 'special-attack',
      stat: ataqueEspecial
    },
    {
      name: 'special-defense',
      stat: defensaEspecial
    }, 
    {
      name: 'speed',
      stat: velocidad
    }
  ];

  pokemon.stats.forEach( ( elemento, i ) => {
    const porcentaje = (elemento.base_stat / 255) * 100
    if(arrayStats[i].name === elemento.stat.name){

      arrayStats[i].stat.style.height = `${porcentaje}%`;

    } else{
      console.log(' La API fallo -.- ');
      console.log('no dio las stat en orden');

      const statCorrecta = pokemon.stats.find( ( element ) => {
      return  element.stat.name === arrayStats[i].name;
      });

      const porcentaje = (statCorrecta.base_stat / 255) * 100;
      arrayStats[i].stat.style.height = `${porcentaje}%`;
    }
  });
}

statsButton.onclick = () => {
  if(!info){
    return true
  } else {
    updateButtonStyles();
    info = !info;
    sapperStats();
    addCharts();
    fill();
  }
}
