# Vim Configuration

Stock vim is pretty boring.
The good news is that vim has a very comprehensive configuration file which
allows you to tweak it to your liking.
To make changes to vim you simply modify the ~/.vimrc file in your home
directory.
By adding simple commands this file you can easily change the way your text editor looks.

When most people get started with vim configurations, they will simply heave
a few massive vim configurations into their vimrc file.
In addition to basic vim configurations, there are also hundreds of plugins
which you can install.
The problem with shoveling a ton of stuff in your vim configuration and installing a ton
of plugins is that it becomes a pain maintain.
Making simple changes is more difficult when you have to wade through a sea of gobble 
gook configurations that you did not write.
Also, if you have a ton of vim plugins it is difficult to transfer them to a new system
since you have to look up how to install all the dependencies.

When designing my vim configuration I decided to use the minimum amount
configurations as possible to make vim the most usable for me.
I feel that it is important for everyone to know exactly what every line of their
vim configuration does. 
This will ensure that you are only adding the things that you want and you can
customize it for your workflow. 

As a small disclaimer, I want to mention that I don't use vim as my primary
IDE.
When working on any large project I tend to use a JetBrains product or VSCode 
because of the auto complete functionality and code generation.
There are great vim configurations out there on the internet; however, most
tend to be a bit overkill for what most people want to do. 


# Spell Check

```vim
autocmd BufRead,BufNewFile *.md setlocal spell spelllang=en_us
autocmd BufRead,BufNewFile *.txt setlocal spell spelllang=en_us
```


# Appearance

```vim
syntax enable
```


```vim
" Enable 256 colors palette in Gnome Terminal
if $COLORTERM == 'gnome-terminal'
    set t_Co=256
endif

try
    colorscheme desert
catch
endtry

set background=dark

" Set extra options when running in GUI mode
if has("gui_running")
    set guioptions-=T
    set guioptions-=e
    set t_Co=256
    set guitablabel=%M\ %t
endif
```

# Indentation and Tabs

```vim
" search as characters are entered
set incsearch
" highlight matched characters
set hlsearch

" Ignore case when searching
set ignorecase
```


# Useful UI Tweaks

```vim
" Set Line Numbers to show
set number

" Highlights the current line with a underscore
set cursorline

" Displays a red bar at 80 characters
set colorcolumn=80
```


# Searching and Auto Complete

```vim
" Shows a auto complete tab when you are typing a command
" like :sp <tab>
set wildmenu
set wildignorecase

"  Searching when in command mode type /words to find
" search as characters are entered
set incsearch
" highlight matched characters
set hlsearch

" Ignore case when searching
set ignorecase
```

# Useful Things to Have


```vim
"Disable ding sound on error, flashes cursor instead
set visualbell

" Display ruler on bottom right -- should be there by default
set ruler

" Enables mouse support
set mouse=a

" Auto updates file if an external source edits the file
set autoread

" Improves performance by only redrawing screen when needed
set lazyredraw
```


```vim
" Set utf8 as standard encoding and en_US as the standard language
set encoding=utf8

" Use Unix as the standard file type
set ffs=unix,dos,mac
```

