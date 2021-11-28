const Streamify = require('streamify-string');
const N3 = require('n3');

const NS_RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
const NS_XML = "http://www.w3.org/XML/1998/namespace";
const BLANK_NODE = "BlankNode";
const NAMED_NODE = "NamedNode";

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

function separateNamespaceAndLocalName(uri) {
  var ret = {}
  var idx = uri.lastIndexOf('#')
  if (idx <= 0) {
    idx = uri.lastIndexOf('/')
  }
  if (idx <= 0) { /* should fail? */ }
  ret['namespace'] = uri.substring(0, idx + 1)
  ret['localname'] = uri.substring(idx + 1, uri.length)
  return ret
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
      //Subject
      var xmlnode = xmldoc.createElementNS(NS_RDF,"Description");
      if (s.termType==BLANK_NODE) {
        xmlnode.setAttributeNS(NS_RDF,"nodeID",s.value);
      } else if (s.termType==NAMED_NODE) {
        xmlnode.setAttributeNS(NS_RDF,"about",s.value);
      } else {
        //Should not occur...
      }
      xmlroot.appendChild(xmlnode);
      store.forEach( quad => {
        //Predicate
        var parts = separateNamespaceAndLocalName(quad.predicate.value);
        console.log(parts['namespace']);
        var xmlelem = xmldoc.createElementNS(parts['namespace'],parts['localname']);
        xmlnode.appendChild(xmlelem);
        //Object
        if (quad.object.termType==BLANK_NODE) {
          xmlelem.setAttributeNS(NS_RDF,"nodeID",quad.object.value);
        } else if (quad.object.termType==NAMED_NODE) {
          xmlelem.setAttributeNS(NS_RDF,"resource",quad.object.value);
        } else {
          if (quad.object.language) {
            xmlelem.setAttributeNS(NS_XML,"lang",quad.object.language);
          } else if (quad.object.datatype && quad.object.datatype.value !== 'http://www.w3.org/2001/XMLSchema#string') {
            xmlelem.setAttributeNS(NS_RDF,"datatype",quad.object.datatype.value);
          }
          xmlelem.textContent = quad.object.value;
        }
      }, s);
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
