const mongosee = require("mongoose");
const url = process.env.MONGODB_URI;

mongosee
  .connect(url)
  .then(() => console.log("connected to MongoDB"))
  .catch((reason) =>
    console.log(`error connecting to MongoDB: ${reason.message} `)
  );

const personSchema = new mongosee.Schema({ name: String, number: String });

personSchema.set("toJSON", {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id.toString();
    delete returnObject._id;
    delete returnObject.__v;
  },
});

const Person = mongosee.model("Person", personSchema);

module.exports = Person;
