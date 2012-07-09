<!--
  stylesheet for very basic menu navigation
  supported tags: title, toc, tocdiv, tocentry, ulink
-->
<xsl:stylesheet 
  version="2.0"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
>
  <xsl:output method="xml" encoding="iso-8859-1" indent="yes"/>
        
  <xsl:template match="/toc">
    <xhtml:div id='menu'>
      <xsl:apply-templates select='title'/>
      <xsl:apply-templates/>
      <xhtml:script language="JavaScript">
        (function () {
          var thislink = document.getElementById( 'footermenulink_' + 
            location.href.substring(location.href.lastIndexOf("/")+1));
          if (thislink != null) {
            thislink.className='selected';
          }
	})();
      </xhtml:script>

    </xhtml:div>
  </xsl:template>

  <xsl:template match="toc/title">
    <xhtml:div id='menutitle'>
      <xsl:apply-templates/>
    </xhtml:div>
  </xsl:template>

  <xsl:template match='tocdiv'>
    <xhtml:div class='menucontent'>
      <xsl:apply-templates/>
    </xhtml:div>
  </xsl:template>

  <xsl:template match='tocdiv/title'>
    <xhtml:p class='title'>
      <xsl:apply-templates/>
    </xhtml:p>
  </xsl:template>

  <xsl:template match='tocentry'>
    <xhtml:p>
      <xsl:apply-templates/>
    </xhtml:p>
  </xsl:template>

  <xsl:template name='link'>
    <xsl:param name='target'/>
    <xhtml:a>
      <xsl:attribute name='href' select='$target'/>
      <xsl:attribute name='id'>
        <xsl:text>footermenulink_</xsl:text>
        <xsl:if test='not(contains($target,"/"))'>
          <xsl:value-of select='$target'/>
        </xsl:if>
      </xsl:attribute>
      <xsl:apply-templates/>
    </xhtml:a>
   </xsl:template>

  <xsl:template match='ulink'>
    <xsl:call-template name='link'>
      <xsl:with-param name='target' select='@url'/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template match='link[@xlink:href]'>
    <xsl:call-template name='link'>
      <xsl:with-param name='target' select='@xlink:href'/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template match='*'>
    <xsl:copy>
      <xsl:copy-of select='@*'/>
      <xsl:apply-templates/>
    </xsl:copy>
  </xsl:template>

  <xsl:template match='text()'>
    <xsl:value-of select='.'/>
  </xsl:template>

</xsl:stylesheet>

