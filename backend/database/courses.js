const { mongoose } = require('./db.js');
const rotaDA = require('./rota');

// const classSchema = new mongoose.Schema({
//   className: {
//     type: String,
//     required: true,
//   }
// });

const courseItemSchema = new mongoose.Schema({
  course: {
    type: String,
    required: true,
  },
  classes: {
    type: [String],
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
 * @param { username: string, course: string } courseInfo
 */
async function removeCourse(courseInfo) {
  const { username, course } = courseInfo;
  const res = await findOneAndUpdate(
    {
      username,
    },
    {
      $pull: {
        courseList: {
          course,
        },
      },
    },
    {
      new: true,
    }
  );
  console.log('remove course', res);
  return res;
}

/**
 *
 * @param { string } username
 * @param { string[] } courses
 */
// async function removeManyCourse(username, courses) {
//   // const remove_id = [];
//   const res = await Course.find(
//     {
//       username,
//       'courseList.course': {
//         $in: courses,
//       },
//     }
//   );
//   console.log(res);
// }

// removeManyClass('xin', [{course: '软件工程', classes: ['1807']}]);

/**
 *
 * @param { string } username
 * @param { { course: string, classes: string[] }[] } classes
 */
async function removeManyClass(username, classes) {
  // const remove_id = [];
  for(const item of classes) {
    const res = await Course.findOneAndUpdate(
      {
        username,
        'courseList.course': item.course,
      },
      {
        $pull: {
          'courseList.$.classes': {
            $in: item.classes,
          },
        },
      },
      {
        new: true,
      }
    );
    await rotaDA.removeManyRota(username, item.course, item.classes);
    console.log(res);
  }
}

/**
 *
 * @param { username: string, course: string, newVal: { course: string }} courseInfo
 */
async function updateCourse(courseInfo) {
  const { username, course, newVal } = courseInfo;
  const res = await findOneAndUpdate(
    {
      username,
      'courseList.course': course,
    },
    {
      $set: {
        'courseList.$.course': newVal.course,
      },
    }
  );
  return res;
}

/**
 *
 * @param {username: string} query
 * @returns
 */
async function getCoursesList(query) {
  const { courseList } = await findOne(query, { _id: 0, __v: 0, 'courseList._id': 0 }, { lean: true });
  console.log('get list', courseList);
  return courseList;
}

/**
 *
 * @param { username: string, course: string, className: string } classInfo
 */
async function addClass(classInfo) {
  const { username, course, className } = classInfo;
  const res = await Course.findOneAndUpdate(
    {
      username,
      'courseList.course': course,
    },
    {
      $push: {
        'courseList.$.classes': className,
      }
    },
    {
      new: true,
    }
  );
  await rotaDA.addRota({ username, course, className });
  console.log('add class', res);
}

/**
 *
 * @param { username: string, course: string, className: string } classInfo
 */
async function removeClass(classInfo) {
  const { username, course, className } = classInfo;
  const res = await findOneAndUpdate(
    {
      username,
      'courseList.course': course,
    },
    {
      $pull: {
        'courseList.$.classes': className,
      }
    }
  );
  await rotaDA.removeRota({ username, course, className });
  console.log('remove class', res);
}


/**
 *
 * @param { username: string, course: string, className: string, newVal: { className: string }} classInfo
 */
async function updateClass(classInfo) {
  const { username, course, className, newVal } = classInfo;
  const res = await findOneAndUpdate(
    {
      username,
      'courseList.course': course,
    },
    {
      $set: {
        'courseList.$[a].classes.$[b]': newVal.className,
      },
    },
    {
      arrayFilters: [
        {
          'a.course': course,
        },
        {
          'b': className
        }
      ],
      new: true,
    }
  );
  await rotaDA.updateRota({ username, course, className }, newVal);
  return res;
}

// 查找
async function findOne(query, projection = {}, options = { lean: false }) {
  const res = await Course.findOne(query, projection, options);
  console.log('findOne', res);
  return res;
}

async function findOneAndUpdate(condition, update, options = { new: true} ) {
  if ( typeof condition === 'string') {
    condition = {
      username: condition,
    };
  }
  const res = await Course.findOneAndUpdate(condition, update, options);
  return res;
}
// async function find(query, projection = {}) {
//   const res = await Course.find(query, projection);
//   console.log('find', res);
//   return res;
// }


module.exports = {
  addCourse,
  removeCourse,
  updateCourse,
  getCoursesList,
  addClass,
  removeClass,
  removeManyClass,
  updateClass,
};