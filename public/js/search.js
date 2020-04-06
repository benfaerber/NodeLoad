function updateSubdir() {
  const newDir = $('#subdir-select').val();
  $('#subdir').text(newDir);
  $('#subdir-form').val(newDir);
  $('#filepath').val('');
}

function searchBlur() {
  setTimeout(() => $('#search-results').removeClass('show'), 250);
 
}

function search() {
  const path = $('#filepath').val();
  const subdir = $('#subdir').text();

  $.get(`/api/search?path=${path}&subdir=${subdir}`, data => {
    const {files} = data;
    $('#search-results').addClass('show');
    $('#search-results').css('left', subdir === 'Deutsche Musik' ? '135px' : '80px');

    $('#search-results').html('');
    if (files.length !== 0 && files[0] !== "file") {    
      files.forEach(file => {
        searchResult(file);
      });
    } else if (files[0] === "file") {
      $('#search-results').append('<a class="dropdown-item" href="#">This is a file.</a>')
    } else {
      $('#search-results').append('<a class="dropdown-item" href="#">No directories found</a>');
    }

    if (path.length !== 0) {
      $('#search-results').append('<div class="dropdown-divider"></div><a class="dropdown-item" id="go-back" href="#">Go Back</a>');
      $('#go-back').click(() => goBack());
    }
  });
}

function goBack() {
  let path = $('#filepath').val();
  if (path.slice(-1) === '/') {
    path = path.slice(0, -1);
  }
  let split = path.split('/');
  split.pop();
  const joined = split.join('/');
  const extra = joined.length !== 0 ? '/' : '';
  $('#filepath').val(joined + extra);
}

function searchResult(file) {
  const id = randomId();
  const html = `<a class="dropdown-item" href="#" id="${id}"></a>`;
  $('#search-results').append(html);
  let $result = $(`#${id}`);
  $result.text(file);
  $result.click(() => clickResult(file));
}

function isFolder(name) {
  const ext = name.slice(-4);
  return ext.split('')[0] !== '.';
}

function randomId() {
  return Math.random().toString(36).substring(7);
}

function clickResult(file) {
  let curr = $('#filepath').val();
  if (curr.slice(-1) !== '/' && curr.length !== 0) {
    curr += '/';
  }

  let extra = '/';
  if (!isFolder(file)) {
    extra = '';
  }

  $('#filepath').val(curr + file + extra);
}