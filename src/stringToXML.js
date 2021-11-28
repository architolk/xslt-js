const Streamify = require('streamify-string');
const N3 = require('n3');

const NS_RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";

function loadXMLDoc(filename) {
  var xhttp;
  if (window.ActiveXObject)
    {
    xhttp = new ActiveXObject("Msxml2.XMLHTTP");
    }
  else
    {
    xhttp = new XMLHttpRequest();
    }
  xhttp.open("GET", filename, false);
  try {xhttp.responseType = "msxml-document"} catch(err) {} // Helping IE11
  xhttp.send("");
  return xhttp.responseXML;
}

function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function stringToXML(ttltext, xslname) {

const xmlparser = new DOMParser();
var xmldoc = xmlparser.parseFromString("<rdf:RDF xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#'/>","text/xml");
var xmlroot = xmldoc.getElementsByTagNameNS(NS_RDF,"RDF")[0];

const store = new N3.Store();
const parser = new N3.Parser();
var quads = parser.parse(ttltext);

  store.addQuads(quads);
  store.forSubjects( s => {
      var xmlnode = xmldoc.createElementNS(NS_RDF,"Description");
      xmlnode.setAttributeNS(NS_RDF,"about",s.value);
      xmlroot.appendChild(xmlnode);
  });

  var xsl = loadXMLDoc(xslname);

  var xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(xsl);
  var resultDocument = xsltProcessor.transformToFragment(xmldoc, document);

  var serializer = new XMLSerializer();
  var serialized = serializer.serializeToString(resultDocument);
  download(serialized,"resultaat.xml","text/xml");

  return
}


export default stringToXML;
