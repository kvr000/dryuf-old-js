(function() { var cls = net.dryuf.registerClass("net.dryuf.gui.ItemList", "net.dryuf.gui.GuiObject",
			{
				constructor:			function(owner, position, items)
	{
		superc.constructor.apply(this, [ owner, position ]);
		var this_ = this;

		net.dryuf.foreach(function(item) { net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElement(this_.position, "a", { href: "#", item: item, onclick: function() { item.handler(this); } }), item.name); net.dryuf.gui.GuiDom.addElement(this_.position, "br"); }, items);

		return this;
	},
}); var superc = cls.superclass; })();
