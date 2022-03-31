import stringToXML from './stringToXML';

function init() {
  const libdiv = document.getElementById('xslt-js');

  libdiv.appendChild(document.createElement('p')).textContent = 'Upload turtle file';
  var input = libdiv.appendChild(document.createElement('input'));
  input.type = 'file';
  input.id = 'file-selector';

  document.getElementById('file-selector').addEventListener('change', event => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', event => {
      XJS.stringToXML(event.target.result,"triples.xsl");
    });
    reader.readAsText(file);
  });

  return
}

export default init;
