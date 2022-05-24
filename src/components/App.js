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
            <p className="character">- {series.character}</p>
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
            <h1 className="title">Frases de Friends</h1>
          </header>

          <form action="" className="containerform">
            <div>
              <label htmlFor="" className="labelinput">
                Filtrar por frase
              </label>
              <input
                type="search"
                autoComplete="off"
                className="rectangleinput"
                name="searchphrase"
                value={search}
                onChange={handleSearch}
              />
            </div>
            <div>
              <label htmlFor="" className="labelinput">
                Filtrar por personaje
              </label>
              <select
                className="rectangleinput"
                onChange={hadleSelectCharacter}
              >
                <option id="all">Todos</option>
                {htmlOptions}
              </select>
            </div>
          </form>
        </div>
        <ul>{html}</ul>

        <h2 className="title">Añadir una nueva frase</h2>
        <form action="" className="containerform">
          <label htmlFor="" className="labelinput">
            Frase
          </label>
          <input
            className="rectangleinput"
            type="text"
            id="quote"
            name="quote"
            value={newPhrase.quote}
            onChange={handleInputNewPhrase}
          />
          <label htmlFor="" className="labelinput">
            Personaje
          </label>
          <input
            className="rectangleinput"
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
