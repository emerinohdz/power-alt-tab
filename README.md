# Power Alt-Tab

Gnome-Shell extension that replaces predefined Alt-Tab behaviour.

Replacing means two things:

1) The binding for "switch_group" now iterates over the available workspaces, ordered by most recently used.
2) The binding for "switch_windows" now iterates over the windows in the current workspace, ordered by most recently used (old alt-tab behaviour). Additionally, it allows to close the selected window in the pager by typing the "q" key.

When iterating over windows/workspaces, a list of thumbnails for each is displayed on the screen.

This is useful when you have lots of workspaces available, with specific windows on each, so navigating through all your windows is much easier. The idea was taken from the Xmonad contrib module that does the same thing (iterates over workspaces using alt-tab).

# Installation

*You need to have NodeJS (npm) for all of the following to work:*

First step is to download source code and build dependencies:

    git clone git@github.com:emerinohdz/PowerAltTab.git && cd PowerAltTab
    npm install

There are two ways to install from sources:

* Install directly to ~/.local/share/gnome-shell/extensions

    node_modules/.bin/gulp install

* Create ZIP file in dist/ for installation through Gnome Tweak Tool

    node_modules/.bin/gulp dist

# Author

[Edgar Merino](https://github.com/emerinohdz) (emerino at nuevebit dot com)
