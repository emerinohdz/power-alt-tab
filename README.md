# Power Alt-Tab

Gnome-Shell extension that provides an MRU Workspace Switcher. The switcher
is bound to the "switch_group" event, which means that you need to assign
a keybinding for this under gnome settings.

When iterating over workspaces, a list of thumbnails for each is displayed 
on the screen.

This is useful when you have lots of workspaces available, with specific 
windows on each, so navigating through all your windows is much easier. 
The idea was taken from the Xmonad contrib module that does the same thing 
(iterates over workspaces using alt-tab: http://xmonad.org/xmonad-docs/xmonad-contrib/XMonad-Actions-CycleWS.html).

It is named Power Alt Tab because it was made back in gs 3.2, when there
was no MRU Window Switcher available (only App Switcher), this extension
used to replace the app switcher with a window switcher, but over the time
gs added its own window switcher so we only support the MRU WS switcher now.

# Installation

*You need to have NodeJS (npm) for all of the following to work:*

First step is to download source code and build dependencies:

    git clone git@github.com:emerinohdz/power-alt-tab.git && cd power-alt-tab
    npm install

There are two ways to install from sources:

Install directly to ~/.local/share/gnome-shell/extensions and enable extension

    node_modules/.bin/gulp install

Create ZIP file in dist/ for installation through Gnome Tweak Tool

    node_modules/.bin/gulp dist

# Author

[Edgar Merino](https://github.com/emerinohdz) (emerino at nuevebit dot com)
