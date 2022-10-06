const mongosee = require("mongoose");
const url = process.env.MONGODB_URI;

mongosee
  .connect(url)
  .then(() => console.log("connected to MongoDB"))
  .catch((reason) =>
    console.log(`error connecting to MongoDB: ${reason.message} `)
  );

const personSchema = new mongosee.Schema({
  name: {
    type: String,
    minLength: 5,
    required: [true, 'name missing"'],
    unique: true,
  },
  number: {
    type: String,
    required: [true, 'number missing"'],
    minLength: 8,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-?\d+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id.toString();
    delete returnObject._id;
    delete returnObject.__v;
  },
});

const Person = mongosee.model("Person", personSchema);

module.exports = Person;
