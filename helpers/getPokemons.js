

const getPokemons = async (url) => {
    try {
      const res = await axios(url);
      //pokemonCard(res.data);
      return res.data.results;
    } catch (error) {
      console.log(error);
     location.reload();
    }
};



export {
  getPokemons
}