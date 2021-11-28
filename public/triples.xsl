<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
	xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
	xmlns:sh="http://www.w3.org/ns/shacl#"
  xmlns:skos="http://www.w3.org/2004/02/skos/core#"
>

<xsl:template match="/">
  <xmlroot>
    <xsl:for-each select="rdf:RDF/*">
      <node id="{@rdf:about}"><xsl:value-of select="rdfs:label"/></node>
    </xsl:for-each>
  </xmlroot>
</xsl:template>

</xsl:stylesheet>
