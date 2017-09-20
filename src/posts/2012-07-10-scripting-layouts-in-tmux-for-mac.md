---
layout : post 
title: Scripting layouts in Tmux for Mac
categories: shells tmux mac
summary: User configs for tmux
---
`tmux` should be the default terminal multiplexer, replacing `screen`. It should be viewed as a knock-down-rebuild of the standard, supporting local and remote sessions, fast context switching, key-binding and layout scripting.

I've found it hard to find a decent guide on scripting your conf file, so this post was born. As usual with Unix-compliant terminal tools, it sees itself primarily as a GNU/BSD/Linux application so when working with the Mac platform you need to make a few tweaks to your core conf file.

For the uninitiated, most terminal tools draw their configurations from a dotfile, Tmux's is `~/.tmux.conf`. For the sysadmins, the global conf files are in `/etc/tmux.conf`. The rest of the blog will just walk you through my conf file, noting points for extension where important. My file is the child of an orphaned conf file from the Gentoo lib and the ArchLinux entry, both are valuable references for the advanced user.

As a preface to the exposition, here are some key points to keep in mind:

  - The Tmux command key is re-bound to the back-tick and the screen access keys are re-indexed to 1. This one pedestrian directive will have your hands wringing in ecstasy. 
  - I have several environments set up and each is atomic. Whilst my work primarily involves LAMP development, my free time frequently involves Python and Java development. Whilst I won't go through the Python and Java set ups as I'm unhappy with the way they're organized and show far too much fluidity across projects, I will show you how to separate your development environments like Eclipse Workspaces.
  - My LAMP environment is very specific. I use my first screen as a focus for debugging and environment issues. It contains tailed Apache and PHP logs, a mysql and bash prompt and a small Vim editor for accessing host files and environment variables. If I weren't so opposed to live edits on development and production servers that aren't channeled through source control / continus integration services I'd have window #2 as a dedicated SSH window.

  - Subsequent screens are used as file-oriented slaves. They primarily contain full-screen Vim editors but given how flexible sessions are in Tmux, they can contain bash prompts or tailed logs where relevant.
  - Colour, the most important attribute for some people, should be seen as uniquely specified within tmux. Instead of the GNU approach where you're supposed to memorize hex/octal combinations like it makes sense, Tmux uses the colorXXX scheme. To see all the available colors, run this as a bash script within tmux itself:

```bash
    #!/bin/bash
    for i in {0..255} ; do
        printf "\x1b[38;5;${i}mcolour${i}\n"
    done
```

All props to cYrus for that one. For the pragmatic, here's a quick and dirty screenie of some popular colors. Please note that in order to test the colour schemes you'll have to stop all instances of tmux. If you're looking for transparent colour schemes, you'll need to run the script for yourself. Tmux gets sticky (not it's fault!) in OS X 10.8 so you'll probably have to manually kill threads when opening new consoles and not seeing your changes.

As for what colors I've chosen, well that's my poor taste innit?

```bash
## `prefix
set-option -g prefix `


#### COLOUR
set -g default-terminal "screen-256color"

# default statusbar colors

set-option -g status-bg colour235 #base02
set-option -g status-fg colour136 #yellow

set-option -g status-attr default 10 

# default window title colors
set-window-option -g window-status-fg colour244
set-window-option -g window-status-bg default
#set-window-option -g window-status-attr dim 15 
# active window title colors
set-window-option -g window-status-current-fg colour166 #orange
set-window-option -g window-status-current-bg default
#set-window-option -g window-status-current-attr bright

# pane border
set-option -g pane-border-fg colour235 #base02
set-option -g pane-active-border-fg colour240 #base01

# message text
set-option -g message-bg colour235 #base02
set-option -g message-fg colour166 #orange

# pane number display
set-option -g display-panes-active-colour colour33 #blue
set-option -g display-panes-colour colour166 #orange

# clock
set-window-option -g clock-mode-colour colour64 #green

# Allows use of hotkeys for resizing panes
bind-key + resize-pane -D 3
bind-key / resize-pane -L 3
bind-key - resize-pane -U 3
bind-key * resize-pane -R 3

# set-option -g default-terminal "screen-256color"
set-option -g mouse-select-pane on
set-option -g status-keys vi
set-option -g bell-action any
set-option -g set-titles on
set-option -g set-titles-string '#H:#S.#I.#P #W #T' # window number,program name,active (or not)
set-option -g visual-bell on
# Visual styles

set-option -g pane-active-border-fg green
set-option -g pane-active-border-bg black
set-option -g pane-border-fg white
set-option -g pane-border-bg black

set-option -g message-fg black
set-option -g message-bg green

#setw -g mode-bg black

setw -g window-status-bg black
setw -g window-status-current-fg green

set -g status-left '#[fg=red]#H#[fg=green]:#[fg=white]#S #[fg=green]][#[default]'

set -g status-right '#[fg=green]][#[fg=white] #T #[fg=green]][ #[fg=blue]%Y-%m-%d #[fg=white]%H:%M#[default]'
#set -g status-right '#[fg=green]][ #[fg=blue]%Y-%m-%d #[fg=white]%H:%M#[default]'

# 0 is too far from ;)
set -g base-index
```

**Update 6/26/2016**: Added syntax highlighting.
