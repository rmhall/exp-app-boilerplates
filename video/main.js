'use strict';
/* global exp */


var video;

function play () {
  return new Promise(function (resolve, reject) {
    video.play();
    video.addEventListener('error', function(e) { reject(e.target.error); });
    video.addEventListener('ended', resolve);
  });
}

function unload () {
  video.setAttribute('src', '');
}

function load () {
  video = document.getElementById('video');
  return Promise.resolve().then(function () {

    // If loop wasn't explicitly set. Infer from playback context.
    if (exp.app.config.loop !== true && exp.app.config.loop !== false) {
      exp.app.config.loop = !exp.app.context.once;
    }

    if (exp.app.config.loop) {
      video.setAttribute('loop', ' ');
    }

    if (exp.app.config.url) {
      return exp.app.config.url;
    } else if (exp.app.config.content && exp.app.config.content.uuid) {
      return exp.getContent(exp.app.config.content.uuid).then(function (content) {
        if (!content) throw new Error('Content lookup failed.');
        if (content.hasVariant('video.mp4')) {
          return content.getVariantUrl('video.mp4');
        }
        else {
          return content.getUrl();
        }
      });
    } else {
      throw new Error('Received no content.');
    }
  }).then(function (src) {
    return new Promise (function (resolve, reject) {
      video.setAttribute('src', src);
      if (exp.app.config && (exp.app.config.volume || exp.app.config.volume === 0)) video.volume = exp.app.config.volume;
      video.addEventListener('error', function(e) { reject(e.target.error); });
      video.addEventListener('canplaythrough', resolve);
      video.load();
    });
  });
}


function stop () {
  video.volume = 0;
}
