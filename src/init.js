function init() {
  const libdiv = document.getElementById('xslt-js');

  libdiv.appendChild(document.createElement('p')).textContent = 'Upload turtle file';
  var input = libdiv.appendChild(document.createElement('input'));
  input.type = 'file';
  input.id = 'file-selector';
  libdiv.appendChild(document.createElement('div')).id = 'output';

  return
}

export default init;
