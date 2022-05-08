const callToApi = () => {
  return fetch(
    "https://beta.adalab.es/curso-intensivo-fullstack-recursos/apis/quotes-friends-tv-v1/quotes.json"
  )
    .then((response) => response.json())
    .then((response) => {
      const result = response.map((item) => {
        return {
          quote: item.quote,
          character: item.character,
        };
      });
      console.log(result);
      return result;
    });
};

export default callToApi;
