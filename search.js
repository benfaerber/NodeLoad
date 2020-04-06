const fs = require('fs');

const base = 'E:/';
const allowedDirs = [
  'Books',
  'Deutsche Musik',
  'Music',
  'Videos'
]

function isFolder(name) {
  const ext = name.slice(-4);
  return ext.split('')[0] !== '.';
}

exports.search = (req, res) => {
  const {path, subdir} = req.query;

  if (!allowedDirs.includes(subdir)) {
    res.end('');
    return;
  }
  
  const fullpath = base + subdir + '/' + path;

  fs.exists(fullpath, exists => {
    if (exists) {
      fs.readdir(fullpath, (err, files) => {
        files = files.filter(elem => {
          const first = elem.slice(0,1);
          return first !== '$' && first !== '.' && isFolder(elem);
        })
        res.json({files: files});
        return;
      });
    } else {
      res.json({files: []})
      return;
    }
  });
};