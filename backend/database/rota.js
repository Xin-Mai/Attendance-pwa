const { mongoose } = require('./db');

const rotaRecordSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  }
});

const rotaSchema = new mongoose.Schema({
  username: {
    type: String,
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
  rota: {
    type: [rotaRecordSchema],
    default: [],
  },
});

const Rota = mongoose.model('Rota', rotaSchema);

/**
 *
 * @param { username: string, course: string, className: string } classInfo
 */
async function getClassRota(rotaInfo) {
  const { rota } = await Rota.findOne(rotaInfo, { 'rota._id': 0 }) || { rota: [] };
  console.log('get class rota', rota);
  return rota;
}

/**
 *
 * @param { username: string, course: string, className: string, rota: [] } newRota
 */
async function addRota(newRota) {
  // eslint-disable-next-line no-unused-vars
  const { rota, ...rotaInfo } = newRota;
  let existed = await Rota.findOne(rotaInfo);
  if (existed) {
    return '已存在不可重复添加';
  }
  existed = new Rota(newRota);
  await existed.save();
}


/**
 *
 * @param { username: string, course: string, className: string } rotaInfo
 * @returns { document }
 */
async function removeRota(rotaInfo) {
  const res = await Rota.findOneAndRemove(rotaInfo, { new: true });
  return res;
}

/**
 *
 * @param { string } username
 * @param { string } course
 * @param { string[] } classes
 */
async function removeManyRota(username, course, classes) {
  const res = await Rota.deleteMany(
    {
      username,
      course,
      className: {
        $in: classes,
      },
    },
    {
      new: true,
    }
  );
  console.log('remove many rotas', res);
  return res;
}

/**
 *
 * @param { username: string, course: string, className: string } rotaInfo
 * @param { { uid: string, name: string }[] } newRota
 * @returns
 */
async function setRota(rotaInfo, newRota) {
  const res = await Rota.findOneAndUpdate(
    rotaInfo,
    {
      $set: {
        rota: [],
      }
    },
    {
      new: true,
      lean: true
    }
  );
  await addToRota(rotaInfo, newRota);
  console.log('update rota', res);
  return res;
}

async function addToRota(rotaInfo, newRota) {
  const res = await Rota.findOneAndUpdate(
    rotaInfo,
    {
      $addToSet: {
        rota: {
          $each: newRota,
        },
      },
    },
    {
      new: true,
      lean: true
    }
  );
  console.log('add to rota', res);
  return res;
}

module.exports = {
  addRota,
  getClassRota,
  removeRota,
  removeManyRota,
  setRota,
  addToRota,
};