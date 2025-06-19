import mongoose from 'mongoose'

// const UserScheema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password:{
//         type: String,
//         required: true,
//     },
//     type:{
//         type: String,
//         required: true
//     }
// })

// const User = mongoose.model('User', UserScheema)
// export default User


//best practices schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: {type: String },
  googleID: {type: String, unique: true},
  phone: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  role: {
    type: String,
    enum: ['admin', 'manager', 'worker', 'customer'],
    required: true
  },
  createdAt: { type: Date, default: Date.now },  // add flexible or role-specific fields later
  managerNotes: { type: String }, // for managers only maybe
  customerPreferences: { type: Object }, // for customers
});

const User = mongoose.model('User', UserSchema)
export default User