<xsl:stylesheet 
  xmlns:model='local:model' 
  xmlns:xsl='http://www.w3.org/1999/XSL/Transform' 
  version='2.0'
>
  <xsl:output method='text' encoding='UTF-8' indent='no'/>

  <!-- default: copy -->
  <xsl:template match='*|/' mode='#all'>
    <xsl:apply-templates mode='#current'/>
  </xsl:template>

  <xsl:template match='text()|@*' mode='#all'>
    <xsl:value-of select='.'/>
  </xsl:template>

  <!--
    process the list
  -->
  <xsl:template match='model:list'>
    <xsl:apply-templates/>
  </xsl:template>

  <xsl:template match='model:instance'>
    <xsl:result-document href='{@target}'>
      <xsl:apply-templates select='document(@model)' mode='model'>
        <xsl:with-param name='instance' select='.' tunnel='yes' as='node()'/>
      </xsl:apply-templates>
    </xsl:result-document>
  </xsl:template>

  <!-- 
    mode: model, ignore the model:model container 
  -->
  <xsl:template match='model:model' mode='model'>
    <xsl:apply-templates mode='#current'/>
  </xsl:template>

  <!--
    mode: model, substitute the rest, using tunnel parameter instance (the
    instance from the auto.xml file, containing the substitutions)
  -->
  <xsl:template match='model:*' mode='model'>
    <xsl:param name='instance' as='node()' tunnel='yes'/>

    <xsl:variable name='local-name' select='local-name()'/>
    <xsl:choose>
      <xsl:when test='$instance/*[local-name()=$local-name]'>
        <xsl:value-of select='$instance/*[local-name()=$local-name]'/>
      </xsl:when>
      <xsl:otherwise>
        <!-- no substitution found, produce a warning instead -->
        <xsl:message>
          <xsl:text>Could not find entry for </xsl:text>
          <xsl:value-of select='$local-name'/>
          <xsl:text>, when generating </xsl:text>
          <xsl:value-of select='$instance/@target'/>
          <xsl:text> from </xsl:text>
          <xsl:value-of select='$instance/@model'/>
          <xsl:text>.</xsl:text>
        </xsl:message>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
</xsl:stylesheet>

