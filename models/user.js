import mongoose from 'mongoose'

const inv_reqSchema = new mongoose.Schema({
    title: { type: String },
    content: { type: String },
    addressedTo: { type: String, enum: ['admin', 'manager', 'worker'] }
})

//best practices user schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    googleID: { type: String, unique: true },
    phone: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    role: {
        type: String,
        enum: ['admin', 'manager', 'worker', 'customer'],
        required: true
    },
    createdAt: { type: Date, default: Date.now }, // add flexible or role-specific fields later
    managerNotes: { type: String }, // for managers only maybe
    customerPreferences: { type: Object }, // for customers
    manager: { type: String }, //whos is this user's manager if they are worker
    inv_req: inv_reqSchema, //invitation from admin manager or worker
    isVerified: { type: Boolean, default: false }, //rimma- added for email verification
    verificationToken: { type: String }
});

//

const User = mongoose.model('User', UserSchema)
export default User