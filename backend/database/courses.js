const { mongoose } = require('./db.js');

const rotaSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  }
});

const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  rota: {
    type: [rotaSchema],
    default: [],
  }
});

const courseItemSchema = new mongoose.Schema({
  course: {
    type: String,
    required: true,
  },
  classes: {
    type: [classSchema],
    default: [],
  }
});

const courseSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  courseList: {
    type: [courseItemSchema],
    default: [],
  }
});

const Course = mongoose.model('Course', courseSchema);

/**
 *
 * @param { course: string, username: string } courseInfo
 * @returns
 */
async function addCourse(courseInfo) {
  console.log('courseInfo', courseInfo);
  const { username, course } = courseInfo;
  if (!username || !course) return;
  let existed = await findOne({ username });
  // 查重并插入现有记录
  if (existed) {
    for (let courseItem of existed.courseList) {
      if (courseItem.course === course) {
        // 查重
        return '课程名重复';
      }
    }
    existed.courseList.push({ course });
  } else {
    existed = new Course({ username, courseList: [{ course }] });
  }
  const record = await existed.save();
  console.log('add record', record);
  return record;
}

/**
 *
 * @param {username: string} query
 * @returns
 */
async function getCoursesList(query) {
  const { courseList } = await findOne(query, { _id: 0, __v: 0 }, { lean: true });
  console.log('get list', courseList);
  return courseList;
}

async function addClass(classInfo) {
  const { username, course, className } = classInfo;
  // const record = await findOne({ username});
  // for (let courseItem of record.courseList) {
  //   if (courseItem.course === course) {
  //     console.log(courseItem);
  //     courseItem.classes.push({ className });
  //     break;
  //   }
  // }
  // const res = await record.save();
  const res = await Course.findOneAndUpdate(
    {
      username,
      'courseList.course': course,
    },
    {
      $push: {
        'courseList.$.classes': { className },
      }
    },
    {
      new: true,
    }
  );
  console.log('add class', res);
}

async function removeClass(classInfo) {
  const { username, course, className } = classInfo;
  const res = await Course.findOneAndUpdate(
    {
      username,
      'courseList.course': course,
    },
    {
      $pull: {
        'courseList.$.classes': { className },
      }
    },
    {
      new: true,
    }
  );
  console.log('remove class', res);
}

// 查找
async function findOne(query, projection = {}, options = { lean: false }) {
  const res = await Course.findOne(query, projection, options);
  console.log('findOne', res);
  return res;
}

// async function find(query, projection = {}) {
//   const res = await Course.find(query, projection);
//   console.log('find', res);
//   return res;
// }


module.exports = {
  addCourse,
  getCoursesList,
  addClass,
  removeClass,
};