const { mongoose }  = require('./db');

const absentDetailSchema = new mongoose.Schema({
  reason: {
    type: Number,
    min: 0,
    max: 2,
    required: true,
  },
  ps: {
    type: String,
    required: false,
  },
});

const recordSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  absentDetail: {
    type: absentDetailSchema,
    required: false,
  },
});

const attendanceSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    required: true,
  },
  records: {
    type: [recordSchema],
    required: true,
  },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

async function addAttendance(attendRecord) {
  const newRecord = new Attendance(attendRecord);
  const res = await newRecord.save();
  console.log('add attendance records', res);
}

module.exports = {
  addAttendance,
};