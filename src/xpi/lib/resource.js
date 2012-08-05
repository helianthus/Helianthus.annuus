(function()
{
	exports.setResource = function(URI)
	{
		Services.io.getProtocolHandler("resource").QueryInterface(Ci.nsIResProtocolHandler).setSubstitution('annuus', URI || null);
	};
})();
