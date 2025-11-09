// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const userSchema = new mongoose.Schema(
//   {
//     email: { type: String, unique: true, required: true, lowercase: true, index: true },
//     password: { type: String, required: true },
//     name: { type: String }
//   },
//   { timestamps: true }
// );

// userSchema.pre("save", async function(next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userSchema.methods.comparePassword = async function(candidate) {
//   return bcrypt.compare(candidate, this.password);
// };

// export const User = mongoose.model("User", userSchema);



import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true, lowercase: true, index: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['zilla_panchayat', 'mrf_operator', 'mrf_driver'],
      required: true,
      default: 'mrf_driver'
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Method to check if user has required role
userSchema.methods.hasRole = function(roles) {
  if (Array.isArray(roles)) {
    return roles.includes(this.role);
  }
  return this.role === roles;
};

export const User = mongoose.model("User", userSchema);