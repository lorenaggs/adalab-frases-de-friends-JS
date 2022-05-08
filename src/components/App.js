import "../styles/App.scss";
import { useState, useEffect } from "react";
import callToApi from "../services/ApiData";
import localStorage from "../services/localStorage";

function App() {
    const localStoragePhrases = localStorage.get("addPhrase", []);
    const [seriesTvApi, setSeriesTvApi] = useState(localStoragePhrases);
    const [newPhrase, setnewPhrase] = useState({
      quote: "",
      character: "",
    });
    const [search, setSearch] = useState("");
    const [characterSelect, setCharacterSelect] = useState("");

    useEffect(() => {
      callToApi().then((response) => {
        setSeriesTvApi([...response, ...seriesTvApi]);
      });
    }, []);

    const html = seriesTvApi
      .filter((oneSerie) =>
        oneSerie.quote.toLowerCase().includes(search.toLowerCase())
      )
      .filter((searchCharacter) => {
        if (characterSelect === "Todos") {
          return searchCharacter;
        }
        return searchCharacter.character.includes(characterSelect);
      })
      .map((series, index) => {
        return (
          <li className="listApi" key={index} id={series.character}>
            <p>{series.quote}</p>
            <p>{series.character}</p>
          </li>
        );
      });

    const htmlOptions = seriesTvApi
      .reduce((characters, actual) => {
        const validate = !characters.includes(actual.character);
        if (validate) {
          characters.push(actual.character);
        }
        return characters;
      }, [])
      .map((character, index) => {
        return (
          <option key={index} id={character}>
            {character}
          </option>
        );
      });

    const handleInputNewPhrase = (ev) => {
      setnewPhrase({ ...newPhrase, [ev.target.id]: ev.target.value });
    };

    const hadleSelectCharacter = (ev) => {
      setCharacterSelect(ev.target.value);
    };

    const handleAddNewPhrase = (ev) => {
      ev.preventDefault();
      setSeriesTvApi([...seriesTvApi, newPhrase]);

      localStorage.set("addPhrase", [...localStoragePhrases, newPhrase]);

      setnewPhrase({
        quote: "",
        character: "",
      });
    };

  const handleSearch = (ev) => {
    setSearch(ev.target.value);
  };

  return (
    <div className="App">
      <div className="phraseFriends">
        <header>
          <h1>Frases de Friends</h1>
        </header>

        <form action="">
          <label htmlFor=""> Filtrar por frase</label>
          <input
            type="search"
            autoComplete="off"
            name="searchphrase"
            value={search}
            onChange={handleSearch}
          />
          <label htmlFor="">Filtrar por personaje</label>
          <select onChange={hadleSelectCharacter}>
            <option id="all">Todos</option>
            {htmlOptions}
          </select>
        </form>
      </div>
      <ul>{html}</ul>

      <h2>Añadir una nueva frase</h2>
      <form action="">
        <label htmlFor="">Frase</label>
        <input
          type="text"
          id="quote"
          name="quote"
          value={newPhrase.quote}
          onChange={handleInputNewPhrase}
        />
        <label htmlFor="">Personaje</label>
        <input
          type="text"
          id="character"
          name="character"
          value={newPhrase.character}
          onChange={handleInputNewPhrase}
        />
      </form>
      <input
        className="btnAdd"
        type="submit"
        value="Añadir una nueva frase"
        onClick={handleAddNewPhrase}
      ></input>
    </div>
  );
}

export default App;
