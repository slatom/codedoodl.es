#!/usr/bin/env node

var fs              = require('fs');
var mkdirp          = require('mkdirp');
var slug            = require('slug');
var figlet          = require('figlet');
var colors          = require('colors');
var manifestCreator = require('./manifestCreator.js');
var getDoodleDir    = require('./getDoodleDir.js');

var fullDoodleDir;

var indexTmpl = [
  "<!DOCTYPE html>\n",
  "<html lang=\"en\">\n",
  "<head>\n",
    "\t<title>{{ name }}</title>\n",
  "</head>\n",
  "<body></body>\n",
  "</html>\n",
].join('');

function writeManifestFile(manifest) {

  var manifestFilename = fullDoodleDir+'/manifest.json';

  fs.writeFile(manifestFilename, JSON.stringify(manifest, null, 4), function(err) {
    if(err) {
      console.dir(err);
    } else {
      console.log(colors.green('Manifest written to %s'), manifestFilename);
    }
  });
    
}

function writeIndexFile(manifest) {

  var indexFilePath = fullDoodleDir+'/index.html';
  var html          = indexTmpl.replace('{{ name }}', manifest.name+' | '+manifest.author.name);

  fs.writeFile(indexFilePath, html, function(err) {
    if(err) {
      console.dir(err);
    } else {
      console.log(colors.green('Index HTML written to %s'), indexFilePath);
    }
}); 

}

function main() {

  manifestCreator.create(function(manifest) {

    fullDoodleDir = getDoodleDir.getFullPath(manifest);

    manifest.slug = getDoodleDir.getSlug(manifest);

    mkdirp(fullDoodleDir, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log(colors.green('Doodle directory created at %s'), fullDoodleDir);
        writeManifestFile(manifest);
        writeIndexFile(manifest);
      }
    });

  });

}

figlet('codedoodl.es', { font: 'digital' }, function(err, data) {

  if (err) {
    console.dir(err);
  } else {
    console.log('');
    console.log(data);
    console.log('');
    console.log('  Use this tool to generate directory structure and doodle manifest');
    console.log('  Don\'t worry - you can edit it anytime after initial generation')
    console.log('');
    main();
  }

});
