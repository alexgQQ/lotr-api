// const bcrypt = require("bcryptjs");
// const preProcessNewUser = require("../api/util/userFunctions")
//   .preProcessNewUser;
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      exclude: true,
      allowOnUpdate: false,
    },
    access_token: {
      type: String,
      required: true,
    },
  },
  {
    collection: "user",
  },
  { timestamps: true }
);

// userSchema.statics.findByLogin = async function (login) {
//   let user = await this.findOne({
//     username: login,
//   });

//   if (!user) {
//     user = await this.findOne({ email: login });
//   }

//   return user;
// };

const User = mongoose.model("user", userSchema);

module.exports = User;

// module.exports = function () {
//   let modelName = "user";
//   let Types = mongoose.Schema.Types;
//   let Schema = new mongoose.Schema(
//     {
//       email: {
//         type: Types.String,
//         unique: true,
//       },
//       password: {
//         type: Types.String,
//         required: true,
//         exclude: true,
//         allowOnUpdate: false,
//       },
//       access_token: {
//         type: Types.String,
//         required: true,
//       },
//     },
//     {
//       collection: "user",
//     }
//   );

// Schema.statics = {
//   collectionName: modelName,
//   routeOptions: {
//     allowRead: false,
//     allowCreate: false,
//     allowUpdate: false,
//     allowDelete: false,
//     create: {
//       // TODO: Before the route handler runs, verify that the user is unique
//       pre: function(payload, request, Log) {
//         return preProcessNewUser(payload, mongoose);
//       }
//     }
//   },

//   generatePasswordHash: function(password) {
//     let hash = password;
//     let salt = bcrypt.genSaltSync(10);
//     hash = bcrypt.hashSync(password, salt);
//     return hash;
//   },

//   findByCredentials: async function(email, password) {
//     const self = this;

//     const query = {
//       email: email.toLowerCase()
//     };

//     let mongooseQuery = self.findOne(query);

//     let user = await mongooseQuery.lean();

//     if (!user) {
//       return false;
//     }

//     const source = user.password;

//     let passwordMatch = await bcrypt.compare(password, source);
//     if (passwordMatch) {
//       return user;
//     } else {
//       return false;
//     }
//   }
// };

//   return Schema;
// };
