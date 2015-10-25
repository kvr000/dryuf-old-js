net.dryuf.registerClass("net.dryuf.gui.GuiObject", null,
{
	constructor:			function(owner, position)
	{
		this.owner = owner;
		this.childs = [];
		this.position = position;

		return this;
	},

	close:				function()
	{
		this.owner = null;
		net.dryuf.foreach(function(child) { child.close(); }, this.childs);
		this.childs = [];
	},

	removeChild:			function(child)
	{
		for (var i = this.childs.length; ; i--) {
			if (this.childs[i] == child) {
				this.childs.splice(i, 1);
				child.close();
			}
		}
	},

	addChild:			function(child)
	{
		this.childs.push(child);
	},

	showing:			function()
	{
	},

	hiding:				function()
	{
	},
});
