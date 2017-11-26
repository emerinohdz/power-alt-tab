var nuevebit = nuevebit || {};
nuevebit.gs = nuevebit.gs || {};

(function (gs) {
    const Meta = imports.gi.Meta;
    const Main = imports.ui.main;
    const Lang = imports.lang;
    const Mainloop = imports.mainloop;
    const Clutter = imports.gi.Clutter;
    const St = imports.gi.St;
    const Shell = imports.gi.Shell;
    const Tweener = imports.ui.tweener;
    const AltTab = imports.ui.altTab;
    const WorkspaceThumbnail = imports.ui.workspaceThumbnail;
    const SwitcherPopup = imports.ui.switcherPopup; 

    gs.WorkspaceThumbnailList = new Lang.Class({
        Name: 'WorkspaceThumbnailList',
        Extends: SwitcherPopup.SwitcherList,
    
        _init: function (workspaces) {
            this.parent(true);
    
            let activeWorkspace = global.screen.get_active_workspace();
            let panelHeight = Main.panel.actor.height;
            let monitor = Main.layoutManager.primaryMonitor;
    
            this._labels = [];
            this._thumbnailBins = [];
            this._clones = [];
            this._workspaces = workspaces;
            this._availHeight = 0;
    
            this._porthole = {
                x: monitor.x,
                y: monitor.y + panelHeight,
                width: monitor.width,
                height: monitor.height - panelHeight
            };
    
            for (let i = 0; i < workspaces.length; i++) {
                let box = new St.BoxLayout({style_class: 'thumbnail-box',
                    vertical: true});
    
                let bin = new St.Bin({style_class: 'thumbnail'});
    
                box.add_actor(bin);
                this._thumbnailBins.push(bin);
    
                let title = workspaces[i].index() + 1;
                title = title.toString();
    
                let name = new St.Label({text: title});
                // St.Label doesn't support text-align so use a Bin
                let bin2 = new St.Bin({x_align: St.Align.MIDDLE});
                this._labels.push(bin2);
                bin2.add_actor(name);
                box.add_actor(bin2);
    
                this.addItem(box, name);
    
            }
        },
    
        // We need to scale the workspaces here
        _allocate: function (actor, box, flags) {
            this.parent(actor, box, flags);
    
            let panelHeight = Main.panel.actor.height;
            let scale = Math.min(1.0,
                    AltTab.THUMBNAIL_DEFAULT_SIZE / this._porthole.width,
                    this._availHeight / this._porthole.height);
    
            let childBox = new Clutter.ActorBox();
    
            childBox.x1 = 0;
            childBox.x2 = this._porthole.width;
            childBox.y1 = panelHeight;
            childBox.y2 = this._porthole.height;
    
            for (let i = 0; i < this._clones.length; i++) {
                this._clones[i].set_scale(scale, scale);
                this._clones[i].allocate(childBox, flags);
            }
        },
    
        addClones: function (availHeight) {
            if (!this._thumbnailBins.length)
                return;
            let totalPadding = this._items[0].get_theme_node().get_horizontal_padding() + this._items[0].get_theme_node().get_vertical_padding();
            totalPadding += this.actor.get_theme_node().get_horizontal_padding() + this.actor.get_theme_node().get_vertical_padding();
            let [labelMinHeight, labelNaturalHeight] = this._labels[0].get_preferred_height(-1);
            let spacing = this._items[0].child.get_theme_node().get_length('spacing');
    
            availHeight = Math.min(availHeight - labelNaturalHeight - totalPadding - spacing, AltTab.THUMBNAIL_DEFAULT_SIZE);
            let binHeight = availHeight + this._items[0].get_theme_node().get_vertical_padding() + this.actor.get_theme_node().get_vertical_padding() - spacing;
            binHeight = Math.min(AltTab.THUMBNAIL_DEFAULT_SIZE, binHeight);
    
            for (let i = 0; i < this._thumbnailBins.length; i++) {
                let workspace = this._workspaces[i];
    
                let clone = new WorkspaceThumbnail.WorkspaceThumbnail(workspace);
                clone.setPorthole(this._porthole.x, this._porthole.y,
                        this._porthole.width, this._porthole.height);
    
                this._thumbnailBins[i].set_height(binHeight);
                this._thumbnailBins[i].add_actor(clone.actor);
                this._clones.push(clone.actor);
            }
    
            // Make sure we only do this once
            this._thumbnailBins = [];
            this._availHeight = availHeight;
        }
    });

})(nuevebit.gs);



