if !filereadable( $HOME . '/.eslint_d' ) | call syntastic#util#system( 'yarn eslint_d start' ) | endif
let b:syntastic_javascript_eslint_exec = 'yarn'
let g:syntastic_javascript_eslint_command = 'echo `cat ~/.eslint_d | cut -d" " -f2` $PWD -f compact %s | nc localhost `cat ~/.eslint_d | cut -d" " -f1`'
