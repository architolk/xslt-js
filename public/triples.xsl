<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
	xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
	xmlns:sh="http://www.w3.org/ns/shacl#"
  xmlns:skos="http://www.w3.org/2004/02/skos/core#"
	xmlns:g="http://graphml.graphdrawing.org/xmlns"
	xmlns:y="http://www.yworks.com/xml/graphml"
>

<xsl:key name="subject" match="rdf:RDF/rdf:Description" use="@rdf:about"/>

<xsl:template match="/">
	<g:graphml>
	  <g:key for="node" id="node" yfiles.type="nodegraphics"/>
	  <g:key for="edge" id="edge" yfiles.type="edgegraphics"/>
	  <g:graph edgedefault="directed" id="G">
			<xsl:apply-templates select="rdf:RDF/rdf:Description"/>
			<xsl:for-each select="rdf:RDF/rdf:Description/*">
			</xsl:for-each>
	  </g:graph>
	</g:graphml>
</xsl:template>

<xsl:template match="rdf:Description">
	<xsl:variable name="label">
		<xsl:choose>
			<xsl:when test="rdfs:label[1]!=''"><xsl:value-of select="rdfs:label[1]"/></xsl:when>
			<xsl:otherwise><xsl:value-of select="@rdf:about"/></xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<g:node id="{@rdf:about}">
		<g:data key="node">
			<y:ShapeNode>
				<y:Geometry height="30.0" width="100.0"/>
				<y:Fill color="#FFCC00" transparent="false"/>
				<y:BorderStyle color="#000000" type="line" width="1.0"/>
				<y:NodeLabel><xsl:value-of select="$label"/><y:LabelModel><y:SmartNodeLabelModel/></y:LabelModel><y:ModelParameter><y:SmartNodeLabelModelParameter/></y:ModelParameter></y:NodeLabel>
				<y:Shape type="ellipse"/>
			</y:ShapeNode>
		</g:data>
	</g:node>
</xsl:template>

</xsl:stylesheet>
