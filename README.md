# RecordSeek Browser Extensions

## To Develop
`npm install`


#### Run single browser
`gulp BROWSER`, IE `gulp chrome`

## Build Location
- `~/tmp/build` 
  - A scratch directory. Leave be.
- `~/tmp/dev`
  - Unpacked version of the built extensions
- `~/tmp/dist` 
  - Packaged versions of the extensions
  
  
### How to Override per browser?
~/src/vendor contains directories for each browser. If you add files that exist elsewhere in there, then reference 
them in the gulp file, it will override the default files.