(function() { var cls = net.dryuf.registerClass("net.dryuf.gui.control.DateTimeIntervalControl", "net.dryuf.gui.control.Control",
			{
				constructor:			function(owner, position, options)
	{
		var this_ = this;
		superc.constructor.apply(this, arguments);

		this.dt_textual = new (net.dryuf.require("net.dryuf.textual.DateTimeTextual"));
		if (!options)
			options = {};
		if (!options.step)
			options.step = 86400000;
		if (!options.value_from)
			options.value_from = (new Date()).getTime();
		if (!options.value_to)
			options.value_to = options.value_from+options.step;
		this.options = options;

		var tr = net.dryuf.gui.GuiDom.addElements(position, "table,tr");
		net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElements(tr, "td,a", { $class: "commandHref", href: "#", onclick: function() { this_.addInterval(-this_.options.step); return false; } }), "←");
		this.gui_from = net.dryuf.gui.GuiDom.addElements(tr, "td,input", { type: "text", $style: "width: 150px;", onchange: function() { return this_.readGui(this); } });
		this.gui_to = net.dryuf.gui.GuiDom.addElements(tr, "td,input", { type: "text", $style: "width: 150px;", onchange: function() { return this_.readGui(this); } });
		net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElements(tr, "td,a", { $class: "commandHref", href: "#", onclick: function() { this_.addInterval(this_.options.step); return false; } }), "→");

		this.updateGui();

		return this;
	},
	getFrom:			function()
	{
		return this.options.value_from;
	},

	getTo:				function()
	{
		return this.options.value_to;
	},

	addInterval:			function(msecs)
	{
		var this_ = this;
		this.options.value_from += msecs;
		this.options.value_to += msecs;
		this.updateGui();
		if (this.options.onchange)
			setTimeout(function() { this_.options.onchange(this_.options); }, 0);
	},

	updateGui:			function()
	{
		this.gui_from.value = this.dt_textual.format(this.options.value_from);
		this.gui_to.value = this.dt_textual.format(this.options.value_to);
	},

	readGui:			function(input)
	{
		var this_ = this;
		var err = null;
		var val;
		var changed = false;
		if ((this.gui_from.value = this.dt_textual.prepare(this.gui_from.value)) == "" || (err = this.dt_textual.check(this.gui_from.value)) != null) {
			alert(err ? err : net.dryuf.clocalize(cls, "from value mandatory"));
			input.focus();
			return false;
		}
		if ((val = this.dt_textual.convert(this.gui_from.value)) != this.options.value_from) {
			this.options.value_from = val;
			changed = true;
		}
		if ((this.gui_to.value = this.dt_textual.prepare(this.gui_to.value)) == "" || (err = this.dt_textual.check(this.gui_to.value)) != null) {
			alert(err ? err : net.dryuf.clocalize(cls, "to value mandatory"));
			input.focus();
			return false;
		}
		if ((val = this.dt_textual.convert(this.gui_to.value)) != this.options.value_to) {
			this.options.value_to = val;
			changed = true;
		}
		if (changed && this.options.onchange)
			setTimeout(function() { this_.options.onchange(this_.options); }, 0);
	},
}); var superc = cls.superclass; })();
