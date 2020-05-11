//META{"name":"InstantDelete","source":"https://raw.githubusercontent.com/Slappy826/BdPlugins/master/InstantDelete.plugin.js"}*//

class InstantDelete {

	getName() { return "Instant Delete"; }
	getDescription() { return "Instantly delete messages after sending them." }
	getVersion() { return "0.0.4"; }
	getAuthor() { return "Slappy826#0001"; }

	getEyeHidden() {
		var map = BdApi.findAllModules(x => x.resolve != undefined && x.keys != undefined); 
		for(var i = 0; i < map.length; i++) { 
			try {
				return map[i].resolve("./EyeHidden");
			} catch {}
		}
		return 0;
	}

	load() {
		this.active = false;

		this.pluginDir=(()=>{const e=require("process"),r=require("path");if(e.env.injDir)return r.resolve(e.env.injDir,"plugins/");switch(e.platform){case"win32":return r.resolve(e.env.appdata,"BetterDiscord/plugins/");case"darwin":return r.resolve(e.env.HOME,"Library/Preferences/","BetterDiscord/plugins/");default:return r.resolve(e.env.XDG_CONFIG_HOME?e.env.XDG_CONFIG_HOME:e.env.HOME+"/.config","BetterDiscord/plugins/")}})();let e=!1;if(!global.ZLibrary||!global.ZeresPluginLibrary||bdplugins.ZeresPluginLibrary&&(e=ZeresPluginLibrary.PluginUpdater.defaultComparator(bdplugins.ZeresPluginLibrary.plugin._config.info.version,"1.2.6"))){const r=e?"Library outdated":"Library Missing",i=BdApi.findModuleByProps("push","update","pop","popWithKey"),n=BdApi.findModuleByProps("Sizes","Weights"),t=BdApi.findModule(e=>e.defaultProps&&e.key&&"confirm-modal"==e.key()),o=()=>{require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",async(e,r,i)=>{if(e)return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");require("fs").writeFile(require("path").join(this.pluginDir,"0PluginLibrary.plugin.js"),i,()=>{setTimeout(()=>{if(!global.bdplugins.ZeresPluginLibrary)return BdApi.alert("Notice",`Due to you using EnhancedDiscord instead of BetterDiscord, you'll have to reload your Discord before ${this.getName()} starts working. Just press CTRL + R to reload and ${this.getName()} will begin to work!`);onLoaded()},1e3)})})};if(!i||!t||!n)return BdApi.alert("Uh oh",`Looks like you${e?"r Zeres Plugin Library was outdated!":" were missing Zeres Plugin Library!"} Also, failed to show a modal, so it has been ${e?"updated":"downloaded and loaded"} automatically.`),void o();i.push(i=>BdApi.React.createElement(t,Object.assign({header:r,children:[n({color:n.Colors.PRIMARY,children:[`The library plugin needed for ${this.getName()} is ${e?"outdated":"missing"}. Please click Download Now to ${e?"update":"install"} it.`]})],red:!1,confirmText:"Download Now",cancelText:"Cancel",onConfirm:()=>o()},i)))}
		this.iconClass = webpackJsonp.push([[], {}, [[this.getEyeHidden()]]]).default;
	}

	start() {
		ZLibrary.PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), 'https://raw.githubusercontent.com/Slappy826/BdPlugins/master/InstantDelete.plugin.js');
		
		var textArea = BdApi.findAllModules(x => x.default != undefined && x.default.type != undefined && x.default.type.render != undefined && x.default.type.render.displayName == "ChannelTextAreaContainer")[0];
		this.unpatchRender = BdApi.monkeyPatch(textArea.default.type, "render", {
			after: e => {
				var createElement = BdApi.React.createElement;
				var children = e.returnValue.props.children[0].props.children.props.children[2].props.children;
				children.unshift(createElement(BdApi.findModuleByDisplayName("Tooltip"), {
					text: "Instant Delete Toggle"
				}, e => {
					return createElement(BdApi.findModuleByDisplayName("ChannelTextAreaButton"), {
						className: BdApi.findModuleByProps("button", "channelTextArea", "textArea").button,
						icon: this.iconClass, // GAME_LIBRARY_PRIVATE_TOOLTIP
						onClick: () => {
							this.active = !this.active;
						},
						isActive: this.active,
						label: "Instant Delete",
						onMouseEnter: e.onMouseEnter,
						onMouseLeave: e.onMouseLeave,
					})
				}));
				return e.returnValue;
			}
		});

		this.unpatchSend = BdApi.monkeyPatch(BdApi.findModuleByProps("sendMessage"), "sendMessage", {
			after: e => {
				if(this.active) {
					e.returnValue.then(x => {
						e.thisObject.deleteMessage(e.methodArguments[0], x.body.id);
					});
				}
				return e.returnValue;
			}
		});
	}

	stop() {
		this.unpatchRender();
	}
}
