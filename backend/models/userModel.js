import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  }, 
  {
    timestamps: true // Mongoose will automatically create the 'Updated at' and 'Created at' time fields.
  }
);

// Use bcrypt to compare a user's plain-text 'enteredPassword' with the hashed password in the database (this is done here so that 'userController.js' is cleaner).
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

// Before we save a new user to the database, encrypt the user's password. 
userSchema.pre('save', async function (next) {
  // We only want to encrypt if the password field is sent or modified (e.g. if the user's name and email are changed but the password isn't, then we don't want to encrypt the password again).
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt); // 'this.password' is initially the user's plain-text password.
})

const User = mongoose.model('User', userSchema);

export default User;