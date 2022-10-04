const mongosee = require("mongoose");

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log(
    "Please provide the argument format: node mongo.js <password>, or node mongo.js <password> <name> <number>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstackopen2022:${password}@cluster0.c0usgt2.mongodb.net/?retryWrites=true&w=majority`;

mongosee.connect(url);

const personSchema = new mongosee.Schema({ name: String, number: String });

const Person = mongosee.model("Person", personSchema);

switch (process.argv.length) {
  case 5:
    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    });

    person.save().then((result) => {
      console.log(`added ${result.name} number ${result.number} to phonebook`);
      mongosee.connection.close();
    });
    break;

  case 3:
    Person.find({}).then((result) => {
      console.log("phonebook:");
      result.forEach((note) => {
        console.log(note.name, note.number);
      });
      mongosee.connection.close();
    });
    break;

  default:
    break;
}
