# Vim Introduction


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


# Spell Check

```vim
autocmd BufRead,BufNewFile *.md setlocal spell spelllang=en_us
autocmd BufRead,BufNewFile *.txt setlocal spell spelllang=en_us
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
