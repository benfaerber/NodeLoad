function getFullpath() {
  const name = $('#folder-name').val();
  const subdir = $('#subdir').text();
  const path = $('#filepath').val();
  let fullpath = `E:/${subdir}/${path}${name}`;
  fullpath = fullpath.replace('//', '/');
  return fullpath;
}

function newFolder() {
  $.get('/api/newFolder?path=' + getFullpath(), data => {
    const {status} = data;
    if (status === "ok") {
      $('#folder-success').addClass('text-success').removeClass('text-danger').text('Folder created!');
    } else {
      $('#folder-success').addClass('text-danger').removeClass('text-success').text('Folder already exists!');
    }
  });
}

function updateNewFolder() {
  const name = $('#folder-name').val();
  if (name.length !== 0) {
    $('#folder-location').text("This folder will be located at " +  getFullpath());
    $('#new-folder-btn').prop('disabled', false);
  } else {
    $('#folder-location').text("");
    $('#new-folder-btn').prop('disabled', true);
  }
}