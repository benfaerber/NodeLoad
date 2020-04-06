$(() => {
	$('#upload-btn').click(() => {
    onUpload();
		$.ajax({
			url: '/upload',
			type: 'POST',
			data: new FormData($('#upload-form')[0]),
			cache: false,
			contentType: false,
			processData: false,

			xhr: () => {
				let xhr = $.ajaxSettings.xhr();
				if (xhr.upload) {
					xhr.upload.addEventListener(
						'progress',
						(e) => {
							if (e.lengthComputable) {
								uploading(e.loaded, e.total);
							}
						},
						false
					);
				}
				return xhr;
			}
		});
	});
});

function onUpload() {
  $('#uploading').show();
  $('#upload-bar').removeClass('bg-success');
  $('#upload-complete').text('');
}

function onComplete() {
  $('#upload-bar').addClass('bg-success');
  $('#upload-complete').text('Upload complete!');
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function uploading(loaded, total) {
	let percent = (loaded / total) * 100;
	percent = percent.toFixed(2).toString() + "%";
  $('#upload-bar').width(percent);
  $("#upload-percentage").text(percent);

  const loadedSize = formatBytes(loaded);
  const totalSize = formatBytes(total);

  $('#upload-size').text(`${loadedSize} / ${totalSize}`);

  if (Math.floor(loaded / total) === 1) {
    onComplete();
  }
}