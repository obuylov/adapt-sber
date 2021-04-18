/**
 * @return {string}
 */
function OBJtoXML(obj) {
  let xml = '';

  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      xml += obj[prop] instanceof Array ? '' : '<' + prop + '>';
      if (obj[prop] instanceof Array) {
        for (let arrayElement in obj[prop]) {
          if (obj[prop].hasOwnProperty(arrayElement)) {
            xml += '<' + prop + '>';
            xml += OBJtoXML(new Object(obj[prop][arrayElement]));
            xml += '</' + prop + '>';
          }
        }
      } else if (typeof obj[prop] === 'object') {
        xml += OBJtoXML(new OBJtoXML(obj[prop]));
      } else {
        xml += obj[prop];
      }
      xml += obj[prop] instanceof Array ? '' : '</' + prop + '>';
    }
  }

  return xml.replace(/<\/?[0-9]+>/g, '');
}

/**
 * Вводит данные из файла в переменную
 * @param data Что именно заносить
 * @param where В какую переменную записывать
 * */
function setData(data, where) {
  let info = JSON.parse(data);
  for (let prop of info) {
    where.push({
      id: prop._id,
      parentId: prop._parentId,
      title: prop.title,
      lettersCount: prop.body.replace(/(<([^>]+)>)/ig, '').split(' ').join('').length,
    });
  }
}

module.exports = function (fs, path, log, options, done) {
  const async = require('async');
  const pathToCourseFolder = options.outputdir
    ? path.join(options.outputdir, 'course')
    : path.join(process.cwd(), 'course');
  let configJson;
  let articles = [], blocks = [], components = [];
  let strings = [`<?xml version="1.0" encoding="utf-8" ?><tincan xmlns="http://projecttincan.com/tincan.xsd"><activities>`, `<activity id="@@config._xapi._activityID" type="http://adlnet.gov/expapi/activities/course"><name><![CDATA[@@course.title]]></name><description lang="en-US"><![CDATA[@@course.description]]></description><launch lang="en-US">index.html</launch></activity><activity id="articles">`, `</activity></activities></tincan>`];

  async.series([
    // Retrieve the config.json file.
    function (callback) {
      fs.readFile(path.join(pathToCourseFolder, 'config.json'), function (err, data) {
        if (err) {
          return callback(err);
        }

        configJson = JSON.parse(data.toString());
        callback();
      });
    },
    // Remove tincan.xml or cmi5.xml, depending on the configuration.
    function (callback) {
      if (!configJson._xapi || !configJson._xapi._isEnabled) {
        log('xAPI settings not found or not enabled');
        return callback();
      }

      // xAPI has been enabled, check if the activityID has been set.
      if (configJson._xapi.hasOwnProperty('_activityID') && configJson._xapi._activityID === '') {
        log('WARNING: xAPI activityID has not been set');
      }

      // cmi5 is a profile of the xAPI specification and some systems, e.g. SCORM Cloud
      // do not work well with both manifest types, so remove the one which is not being used.
      if (!configJson._xapi.hasOwnProperty('_specification') || configJson._xapi._specification === 'xAPI') {
        // TODO - This will change once cmi5 is supported.
        // Remove the cmi5.xml file (default behaviour).
        // fs.unlink(path.join(options.outputdir, 'cmi5.xml'), callback);
        callback();
      } else if (configJson._xapi._specification === 'cmi5') {
        // Remove the tincan.xml file.
        fs.unlink(path.join(options.outputdir, 'tincan.xml'), callback);
      }
    },
    function (callback) {
      // reading articles.json
      fs.readFile(path.join(pathToCourseFolder, configJson._defaultLanguage + '/articles.json'), function (err, data) {
        if (err) throw err;
        setData(data, articles);
        callback();
      });
    },
    function (callback) {
      // reading blocks.json
      fs.readFile(path.join(pathToCourseFolder, configJson._defaultLanguage + '/blocks.json'), function (err, data) {
        if (err) throw err;
        setData(data, blocks);
        callback();
      });
    },
    function (callback) {
      // reading components.json
      fs.readFile(path.join(pathToCourseFolder, configJson._defaultLanguage + '/components.json'), function (err, data) {
        if (err) throw err;

        setData(data, components);
        callback();
      });
    },
    function (callback) {
      // добавляем в блоки дочерние компоненты
      blocks.forEach(function (block) {
        block.component = [];

        components.forEach(function (comp) {
          if (comp.parentId === block.id) {
            block.component.push(comp);
          }
        });
      });

      // добавляем в статьи их блоки
      articles.forEach(function (art) {
        art.block = [];

        blocks.forEach(function (block) {
          if (block.parentId === art.id) {
            art.block.push(block);
          }
        });
      });

      callback();
    },
    function (callback) {
      let resultString = strings[0] + strings[1] + OBJtoXML({ 'article': articles }) + strings[2];

      fs.writeFile(path.join(options.outputdir, 'tincan.xml'), resultString, function (error) {
        if (error) throw error;
        console.log('tincan.xml was changed!');
      });
      callback();
    }
  ], function (err) {
    if (err) {
      return done(err);
    }

    done();
  });
};
