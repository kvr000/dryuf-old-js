(function() { var cls = net.dryuf.registerClass("net.dryuf.gui.control.SuggestInput", "net.dryuf.gui.control.Control",
{
	constructor:			function(owner, position, options)
	{
		superc.constructor.apply(this, arguments);

		if (!options.viewName)
			options.viewName = "Ref";
		this.composKey = options.composKey != null ? options.composKey : null;
		this.webMeta = options.webMeta = (net.dryuf.require("net.dryuf.meta.WebMeta")).openCached(options.dataClassName, options.viewName);
		this.options = options;
		this.old_text = "";

		this.gui_value = net.dryuf.gui.GuiDom.addElement(position, "input", { this_: this, onfocus: function(ev) { this.this_.initList(ev); }, onblur: function() { this.this_.hideList(); return true; }, onkeyup: function() { this.this_.changedText(); } });
		if (options.value)
			this.setValue(options.value);

		return this;
	},

	close:				function()
	{
		if (this.list_div)
			net.dryuf.gui.GuiDom.removeElement(this.list_div);
		net.dryuf.gui.GuiUtil.releaseZIndex(this.z_index);
	},

	getValue:			function()
	{
		return this.options.value;
	},

	setValue:			function(value)
	{
		this.options.value = value;
		this.gui_value.value = value[this.webMeta.getRefName()];
	},

	initList:			function(ev)
	{
		if (this.list_div)
			return;
		this.z_index = net.dryuf.gui.GuiUtil.advZIndex();
		/*
		var pos = net.dryuf.gui.GuiUtil.getDocumentElementPos(this.gui_value);
		this.list_div = net.dryuf.gui.GuiDom.createElement("div", { $class: "net-dryuf-gui-control-SuggestInput-list", $style: "position: absolute; z-index: "+this.z_index+"; left: "+pos[0]+"px; top: "+(pos[1]+25)+"px;" });
		net.dryuf.gui.GuiUtil.addGuiElement(this.list_div);
		*/
		this.list_div = net.dryuf.gui.GuiDom.addElement(this.position, "div", { $class: "net-dryuf-gui-control-SuggestInput", $style: "" });
		if (net.dryuf.defvalue(this.getValue(), "") == "")
			this.changedText();
	},

	hideList:			function()
	{
		var this_ = this;
		setTimeout(function() {
				if (!this_.list_div)
					return;
				net.dryuf.gui.GuiDom.removeElement(this_.list_div);
				this_.list_div = null;
				if (this_.gui_value.value == "") {
					this_.options.value = null;
					if (this_.options.onchange)
						setTimeout(function() { this_.options.onchange(this_.options); }, 0);
				}
			}, 500);
	},

	changedText:			function()
	{
		var this_ = this;
		if (this.suggest_timer)
			clearTimeout(this.suggest_timer);
		this.suggest_timer = setTimeout(function() { this_.runSuggester(); }, 700);
	},

	runSuggester:			function()
	{
		var this_ = this;
		if (!this_.list_div)
			return;
		this.suggest_timer = null;
		this.webMeta.suggestAsync(null, this.composKey, this.gui_value.value, function(list) {
				if (!this_.list_div)
					return;
				var fields = this_.webMeta.getFields();
				var ul = net.dryuf.gui.GuiDom.createElement("ul", { $class: "list" });
				net.dryuf.foreach(function(obj) {
					var text = net.dryuf.map(function(a) { return this_.webMeta.getFieldValue(obj.entity, a.name); }, fields).join(" ");
					net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElements(ul, "li,a", { href: '#', obj: obj, onclick: function() { this_.updateValue(obj, net.dryuf.gui.GuiDom.getText(this)); return false; } }), text);
				}, list);
				net.dryuf.gui.GuiDom.resetElement(this_.list_div, ul);
			});
	},

	updateValue:			function(obj, text)
	{
		var options = this.options;
		this.gui_value.value = text;
		options.value = obj.entity;
		this.hideList();
		if (options.onchange)
			setTimeout(function() { options.onchange(options); }, 0);
	},

	_$require:			[ "net.dryuf.gui.GuiUtil" ],
	_$css:				[ "net/dryuf/gui/control/SuggestInput.css" ],

}); var superc = cls.superclass; })();
