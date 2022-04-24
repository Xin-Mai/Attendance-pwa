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

/**
 *
 * @param { username, course, className } attendInfo
 * @returns { date, present, presentPercent }
 */
async function getHistory(attendInfo) {
  const documents = await Attendance.find(attendInfo, { _id: 0 }, { lean: true }) || [];
  const history = documents.reduce((val, cur) => {
    const { present, presentPercent } = getPresent(cur.records);
    console.log(cur.date, Object.prototype.toString.apply(cur.date));
    val.push({
      date: cur.date.toISOString(),
      present,
      presentPercent: presentPercent.toFixed(2),
    });
    return val;
  }, []);
  console.log('get History', history);
  return history;
}

/**
 *
 * @param {recordSchema[]} records
 * @returns {present, presentPercent}
 */
function getPresent(records) {
  const len = records.length;
  const present = records.reduce((val, cur) => cur.status ? val + 1 : val, 0);
  return {
    present,
    presentPercent: present/len,
  };
}

/**
 *
 * @param {username, course, className, date} recordInfo
 */
async function getRecord(recordInfo) {
  const { records } = await Attendance.findOne(
    recordInfo,
    {
      _id: 0,
      'records._id': 0,
      'records.absentDetail._id': 0},
    { lean: true }
  ) || { records: [] };
  console.log('getRecords', records);
  return records;
}


/**
 *
 * @param { username: string; course: string; className: string; records: [] } historyInfo
 */
async function modifyHistory(historyInfo) {
  const { records, ...info } = historyInfo;
  const res = await Attendance.findOneAndUpdate(
    info,
    {
      $set: {
        records,
      },
    },
    {
      new: true,
    }
  );
  console.log('modify history', res);
  return res;
}
// getHistory({ username: 'xin', className: '1806', course: '软件工程'});
// getRecord({ username: 'xin', className: '1806', course: '软件工程', date: '2022-04-16T14:28:34.421Z'});
module.exports = {
  addAttendance,
  getHistory,
  getRecord,
  modifyHistory,
};