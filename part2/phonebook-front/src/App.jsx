import { useState, useEffect } from "react";
import personService from "./services/persons";
import Person from "./components/Person";
import PersonForm from "./components/PersonForm";
import SearchForm from "./components/SearchForm";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [successfulMessage, setSuccessfulMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    personService
      .getAll()
      .then((response) => {
        setPersons(response.data);
      })
      .catch((error) => console.log(error.response.data.error));
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
      id: `${persons.length + 1}`,
    };
    if (persons.some((person) => person.number === personObject.number)) {
      alert(`${newNumber} is already added to phonebook`);
      return;
    } else if (persons.some((person) => person.name === personObject.name)) {
      if (
        window.confirm(
          `${personObject.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const person = persons.find((person) => person.name === newName);
        personService
          .update(person.id, { ...personObject, id: person.id })
          .then((response) => {
            setPersons(
              persons.map((p) => (p.id !== person.id ? p : response.data))
            );
            setMessageType("success");
            setSuccessfulMessage(
              `Changed ${response.data.name}'s number to ${response.data.number}`
            );
            setTimeout(() => {
              setSuccessfulMessage(null);
            }, 5000);
          })
          .catch(() => {
            alert(`person ${person.name} already deleted from server`);
            setPersons(persons.filter((p) => p.id !== person.id));
          });
      }
      return;
    }
    personService
      .create(personObject)
      .then((response) => {
        setPersons(persons.concat(response.data));
        setNewName("");
        setNewNumber("");
        setMessageType("success");
        setSuccessfulMessage(`Added ${response.data.name}`);
        setTimeout(() => {
          setSuccessfulMessage(null);
        }, 5000);
      })
      .catch((error) => {
        setMessageType("error");
        setSuccessfulMessage(error.response.data.error);
        setTimeout(() => {
          setSuccessfulMessage(null);
        }, 5000);
      });
  };

  const searchPerson = (event) => {
    event.preventDefault();
    const searchedPerson = persons.find((person) =>
      person.name
        .toLocaleLowerCase()
        .includes(event.target.children[0].value.toLocaleLowerCase())
    );
    if (searchedPerson) {
      document.querySelector(
        ".searchedName"
      ).innerHTML = `${searchedPerson.name} ${searchedPerson.number}`;
    } else {
      alert(`Couldn't find that name`);
    }
  };

  const deletePerson = (person) => {
    const handler = () => {
      if (window.confirm(`Delete ${person.name} ?`)) {
        personService
          .erase(person.id)
          .then(() => {
            setPersons(persons.filter((p) => person.id !== p.id));
          })
          .catch((error) => {
            setMessageType("error");
            setSuccessfulMessage(error.response.data.error);
            setTimeout(() => {
              setSuccessfulMessage(null);
            }, 5000);
          });
      }
    };
    return handler;
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successfulMessage} type={messageType} />
      <SearchForm searchPerson={searchPerson} />
      <h2>Add a new person</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <ul>
        {persons.map((person) => (
          <li key={person.id}>
            <Person person={person} />
            <button onClick={deletePerson(person)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
