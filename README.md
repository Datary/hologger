# hologger
Holistic logging library



## Installation

```bash
$ npm install hologger
```



## Log Levels

 Mirror that of syslog, but reversing ordering:
 
  - `8` `EMERGENCY`   system unusable
  - `7` `ALERT`       immediate action required
  - `6` `CRITICAL`    condition critical
  - `5` `ERROR`       condition error
  - `4` `WARNING`     condition warning
  - `3` `NOTICE`      condition normal, but significant 
  - `2` `INFO`        a purely informational message
  - `1` `DEBUG`       debugging information



## TODO 

La libreria deberia permitir indistintamente su invocacion de tres formas:
+ hologger(3, {})            => la mas completa
+ hologger("some message")   => para mensajes sobre la marcha
+ hologger({})               => igualmente sobre la marcha, pero con info estructurada
+ hologger(Error)            => logueo de errores  

@vid https://github.com/tj/log.js/blob/master/Readme.md  
@vid https://github.com/nomiddlename/log4js-node



## License 

(The MIT License)

Copyright (c) 2014-2016 pekebuda;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
