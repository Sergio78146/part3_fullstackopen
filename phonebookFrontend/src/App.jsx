import React, { useState, useEffect } from "react";
import servicio from "./servicios/servicio";

const Filter = ({ searchTerm, handleSearchChange }) => {
  return (
    <div>
      Search: <input value={searchTerm} onChange={handleSearchChange} />
    </div>
  );
};

const PersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        Name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        Number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons, deletePerson }) => {
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this person?")) {
      deletePerson(id);
    }
  };

  return (
    <div>
      {persons.map((person) => (
        <div key={person.id}>
          <p>
            {person.name} {person.number}
            <button onClick={() => handleDelete(person.id)}>Delete</button>
          </p>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState(null);

  const showMessage = (text) => {
    setMessage({ text, visible: true });

    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  useEffect(() => {
    servicio.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();

    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        servicio
          .update(existingPerson.id, updatedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id === returnedPerson.id ? returnedPerson : person
              )
            );
            setNewName("");
            setNewNumber("");
            showMessage(`Updated ${returnedPerson.name}'s number`);
          })
          .catch((error) => {
            showMessage(`Failed to update ${existingPerson.name}'s number`);
            console.error("Error updating person:", error);
          });
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      };

      servicio
        .create(newPerson)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setNewName("");
          setNewNumber("");
          showMessage(`Added ${returnedPerson.name}`);
        })
        .catch((error) => {
          showMessage(`Failed to add ${newPerson.name}`);
          console.error("Error adding person:", error);
        });
    }
  };

  const deletePerson = (id) => {
    servicio
      .remove(id)
      .then(() => {
        setPersons(persons.filter((person) => person.id !== id));
        showMessage("Person deleted");
      })
      .catch((error) => {
        showMessage("Failed to delete person");
        console.error("Error deleting person:", error);
      });
  };

  const filteredPersons = Array.isArray(persons)
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div>
      <h2>Phonebook</h2>
      {message && message.visible && (
        <div className="messageClass">
          <p>{message.text}</p>
        </div>
      )}
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <h3>Add a new person</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
