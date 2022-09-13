import { getPokemons } from "./helpers/getPokemons.js";

var swiper = new Swiper(".mySwiper", {
/*scrollbar: {
    el: '.swiper-scrollbar',
    draggable: true,
  },*/
  preventClicksPropagation: true,
  hashNavigation: {
    replaceState: false,
    watchState:true,
  },
    keyboard: {
        enabled: true,
        onlyInViewport: false,
      },
    direction: "vertical",
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 3.5,
    coverflowEffect: {
      rotate: 0,
      stretch: 10,
      depth: 100,
      modifier: 2,
      slideShadows: false,
    },
    pagination: {
      el: ".swiper-pagination",
    },
    mousewheel: {
        invert: true,
        sensitivity: 100,
        releaseOnEdges: true
      },
    spaceBetween: 0,
    //ir a la diapositiva al hacer click
    slideToClickedSlide: true,
    speed: 500,
    // este parametro de zoom la verdad es que no se si sirve :/
    zoom: {
        maxRatio: 100,
      },
  });

let params = new URLSearchParams(location.search);

let id = Number(params.get('id'));

console.log(  )


const pokemonSprite = document.getElementById('pokemonSprite');

const changePokemonImage = () =>{
    const activeIndex = swiper.activeIndex;
    const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${ 387 + activeIndex}.png`
    pokemonSprite.removeAttribute('src');
    pokemonSprite.setAttribute('src' , url );
}

swiper.on( 'doubleClick', function () {
    console.log('doubleClick');
});

swiper.on('slideChange', function () {
    changePokemonImage();
});

// limitar el tiempo en que se puede hacer click para que no se deforme la diapositiva
swiper.on('keyPress',function () {
  swiper.keyboard.disable();

  setTimeout(() => {
    swiper.keyboard.enable();
  }, 100);

});




//------------------------------------------------------------------

const url = "https://pokeapi.co/api/v2/pokemon?limit=101&offset=386";

const pokemonsList = await getPokemons(url);

const swiperWrapperContainer = document.getElementById('swiper-wrapper');

//reprensentar la lista de pokemons

pokemonsList.forEach( ( pokemon, i ) => {
    const indice = `${i + 1}` ;
    const div = document.createElement('div');
    div.setAttribute('class', 'swiper-slide');
    div.setAttribute( "data-hash", `slide${i + 1}`);
    const pokemonName = ( name ) => {
        name.slice
    }
    div.innerHTML = `
    <span class="poke-ball-icon"></span>
    <p>${ indice.padStart(3,'0') } ${ pokemon.name.toUpperCase() }</p>
    `
    swiperWrapperContainer.appendChild(div);
});


const primeraDiapositiva = document.getElementById('primeraDiapositiva');
const ultimaDiapositiva = document.getElementById('ultimaDiapositiva');
 
primeraDiapositiva.onclick = () => {
  location.replace( `./#slide${ 1 }` );
  //history.replaceState( null, 'pokemons', `./#slide${ 1 }`);
}

ultimaDiapositiva.onclick = () => {
  location.replace( `./#slide${ 101 }` )
  //history.replaceState( null, 'pokemons',`./#slide${ 101 }`);
}

const fiveBefore = document.getElementById('fiveBefore');
const fiveNext = document.getElementById('fiveNext');

const calcularSalto = (obtion) => {
      if( obtion === 'before' ){
        
        return ( swiper.activeIndex <= 5 ) ? 1 : (swiper.activeIndex - 5); 
      }
      if( obtion === 'next'){
        console.log( swiper.activeIndex );
        const jum = swiper.activeIndex + 5
        return ( 101 < jum ) ? 101 : (swiper.activeIndex + 5) ;
      }
}

fiveBefore.onclick = () =>   location.replace( `./#slide${ calcularSalto('before') }` )
fiveNext.onclick = () => location.replace( `./#slide${ calcularSalto('next') }` );


const verPokemon = document.getElementById('verPokemon');

verPokemon.onclick = ( ) => location.replace(`./views/pokemon.html?id=${ swiper.activeIndex + 1 }`);



const gigaPokeball = document.getElementById('gigaPokeball');

//progreso 

swiper.on( 'progress' , (e) =>{
  //girar la gigaPokeball
  const progreso = e.progress ;
  //1080 porque darar 3 vueltas, si fuera una sola seria 360
  gigaPokeball.style.transform = `rotate(${ 1080 * progreso }deg)`; 
});