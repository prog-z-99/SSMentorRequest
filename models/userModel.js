import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    discordID: {
      type: String,
      required: true,
    },
    discordName: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
