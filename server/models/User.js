import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
    {
        name: String,
        email: { type: String, required: true, unique: true },
        password: { type: String },
        profilePicture: String,
        resetToken: String,
        resetTokenExpiry: Date,
        googleId: String,
        resetPasswordToken: String,
        resetPasswordExpires: Date,
    },
    { timestamps: true }
);

UserSchema.pre("save", async function (next) {
    if (this.password && this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = mongoose.model("User", UserSchema);

export default User;
