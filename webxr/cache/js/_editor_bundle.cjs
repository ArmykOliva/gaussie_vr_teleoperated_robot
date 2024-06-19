(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value2) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value: value2 }) : obj[key] = value2;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __publicField = (obj, key, value2) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value2);
    return value2;
  };
  var __accessCheck = (obj, member, msg) => {
    if (!member.has(obj))
      throw TypeError("Cannot " + msg);
  };
  var __privateGet = (obj, member, getter) => {
    __accessCheck(obj, member, "read from private field");
    return getter ? getter.call(obj) : member.get(obj);
  };
  var __privateAdd = (obj, member, value2) => {
    if (member.has(obj))
      throw TypeError("Cannot add the same private member more than once");
    member instanceof WeakSet ? member.add(obj) : member.set(obj, value2);
  };
  var __privateMethod = (obj, member, method) => {
    __accessCheck(obj, member, "access private method");
    return method;
  };

  // node_modules/howler/dist/howler.js
  var require_howler = __commonJS({
    "node_modules/howler/dist/howler.js"(exports) {
      (function() {
        "use strict";
        var HowlerGlobal2 = function() {
          this.init();
        };
        HowlerGlobal2.prototype = {
          /**
           * Initialize the global Howler object.
           * @return {Howler}
           */
          init: function() {
            var self2 = this || Howler2;
            self2._counter = 1e3;
            self2._html5AudioPool = [];
            self2.html5PoolSize = 10;
            self2._codecs = {};
            self2._howls = [];
            self2._muted = false;
            self2._volume = 1;
            self2._canPlayEvent = "canplaythrough";
            self2._navigator = typeof window !== "undefined" && window.navigator ? window.navigator : null;
            self2.masterGain = null;
            self2.noAudio = false;
            self2.usingWebAudio = true;
            self2.autoSuspend = true;
            self2.ctx = null;
            self2.autoUnlock = true;
            self2._setup();
            return self2;
          },
          /**
           * Get/set the global volume for all sounds.
           * @param  {Float} vol Volume from 0.0 to 1.0.
           * @return {Howler/Float}     Returns self or current volume.
           */
          volume: function(vol) {
            var self2 = this || Howler2;
            vol = parseFloat(vol);
            if (!self2.ctx) {
              setupAudioContext();
            }
            if (typeof vol !== "undefined" && vol >= 0 && vol <= 1) {
              self2._volume = vol;
              if (self2._muted) {
                return self2;
              }
              if (self2.usingWebAudio) {
                self2.masterGain.gain.setValueAtTime(vol, Howler2.ctx.currentTime);
              }
              for (var i2 = 0; i2 < self2._howls.length; i2++) {
                if (!self2._howls[i2]._webAudio) {
                  var ids = self2._howls[i2]._getSoundIds();
                  for (var j = 0; j < ids.length; j++) {
                    var sound = self2._howls[i2]._soundById(ids[j]);
                    if (sound && sound._node) {
                      sound._node.volume = sound._volume * vol;
                    }
                  }
                }
              }
              return self2;
            }
            return self2._volume;
          },
          /**
           * Handle muting and unmuting globally.
           * @param  {Boolean} muted Is muted or not.
           */
          mute: function(muted) {
            var self2 = this || Howler2;
            if (!self2.ctx) {
              setupAudioContext();
            }
            self2._muted = muted;
            if (self2.usingWebAudio) {
              self2.masterGain.gain.setValueAtTime(muted ? 0 : self2._volume, Howler2.ctx.currentTime);
            }
            for (var i2 = 0; i2 < self2._howls.length; i2++) {
              if (!self2._howls[i2]._webAudio) {
                var ids = self2._howls[i2]._getSoundIds();
                for (var j = 0; j < ids.length; j++) {
                  var sound = self2._howls[i2]._soundById(ids[j]);
                  if (sound && sound._node) {
                    sound._node.muted = muted ? true : sound._muted;
                  }
                }
              }
            }
            return self2;
          },
          /**
           * Handle stopping all sounds globally.
           */
          stop: function() {
            var self2 = this || Howler2;
            for (var i2 = 0; i2 < self2._howls.length; i2++) {
              self2._howls[i2].stop();
            }
            return self2;
          },
          /**
           * Unload and destroy all currently loaded Howl objects.
           * @return {Howler}
           */
          unload: function() {
            var self2 = this || Howler2;
            for (var i2 = self2._howls.length - 1; i2 >= 0; i2--) {
              self2._howls[i2].unload();
            }
            if (self2.usingWebAudio && self2.ctx && typeof self2.ctx.close !== "undefined") {
              self2.ctx.close();
              self2.ctx = null;
              setupAudioContext();
            }
            return self2;
          },
          /**
           * Check for codec support of specific extension.
           * @param  {String} ext Audio file extention.
           * @return {Boolean}
           */
          codecs: function(ext) {
            return (this || Howler2)._codecs[ext.replace(/^x-/, "")];
          },
          /**
           * Setup various state values for global tracking.
           * @return {Howler}
           */
          _setup: function() {
            var self2 = this || Howler2;
            self2.state = self2.ctx ? self2.ctx.state || "suspended" : "suspended";
            self2._autoSuspend();
            if (!self2.usingWebAudio) {
              if (typeof Audio !== "undefined") {
                try {
                  var test = new Audio();
                  if (typeof test.oncanplaythrough === "undefined") {
                    self2._canPlayEvent = "canplay";
                  }
                } catch (e) {
                  self2.noAudio = true;
                }
              } else {
                self2.noAudio = true;
              }
            }
            try {
              var test = new Audio();
              if (test.muted) {
                self2.noAudio = true;
              }
            } catch (e) {
            }
            if (!self2.noAudio) {
              self2._setupCodecs();
            }
            return self2;
          },
          /**
           * Check for browser support for various codecs and cache the results.
           * @return {Howler}
           */
          _setupCodecs: function() {
            var self2 = this || Howler2;
            var audioTest = null;
            try {
              audioTest = typeof Audio !== "undefined" ? new Audio() : null;
            } catch (err) {
              return self2;
            }
            if (!audioTest || typeof audioTest.canPlayType !== "function") {
              return self2;
            }
            var mpegTest = audioTest.canPlayType("audio/mpeg;").replace(/^no$/, "");
            var ua = self2._navigator ? self2._navigator.userAgent : "";
            var checkOpera = ua.match(/OPR\/(\d+)/g);
            var isOldOpera = checkOpera && parseInt(checkOpera[0].split("/")[1], 10) < 33;
            var checkSafari = ua.indexOf("Safari") !== -1 && ua.indexOf("Chrome") === -1;
            var safariVersion = ua.match(/Version\/(.*?) /);
            var isOldSafari = checkSafari && safariVersion && parseInt(safariVersion[1], 10) < 15;
            self2._codecs = {
              mp3: !!(!isOldOpera && (mpegTest || audioTest.canPlayType("audio/mp3;").replace(/^no$/, ""))),
              mpeg: !!mpegTest,
              opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
              ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
              oga: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
              wav: !!(audioTest.canPlayType('audio/wav; codecs="1"') || audioTest.canPlayType("audio/wav")).replace(/^no$/, ""),
              aac: !!audioTest.canPlayType("audio/aac;").replace(/^no$/, ""),
              caf: !!audioTest.canPlayType("audio/x-caf;").replace(/^no$/, ""),
              m4a: !!(audioTest.canPlayType("audio/x-m4a;") || audioTest.canPlayType("audio/m4a;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
              m4b: !!(audioTest.canPlayType("audio/x-m4b;") || audioTest.canPlayType("audio/m4b;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
              mp4: !!(audioTest.canPlayType("audio/x-mp4;") || audioTest.canPlayType("audio/mp4;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
              weba: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")),
              webm: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")),
              dolby: !!audioTest.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ""),
              flac: !!(audioTest.canPlayType("audio/x-flac;") || audioTest.canPlayType("audio/flac;")).replace(/^no$/, "")
            };
            return self2;
          },
          /**
           * Some browsers/devices will only allow audio to be played after a user interaction.
           * Attempt to automatically unlock audio on the first user interaction.
           * Concept from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
           * @return {Howler}
           */
          _unlockAudio: function() {
            var self2 = this || Howler2;
            if (self2._audioUnlocked || !self2.ctx) {
              return;
            }
            self2._audioUnlocked = false;
            self2.autoUnlock = false;
            if (!self2._mobileUnloaded && self2.ctx.sampleRate !== 44100) {
              self2._mobileUnloaded = true;
              self2.unload();
            }
            self2._scratchBuffer = self2.ctx.createBuffer(1, 1, 22050);
            var unlock = function(e) {
              while (self2._html5AudioPool.length < self2.html5PoolSize) {
                try {
                  var audioNode = new Audio();
                  audioNode._unlocked = true;
                  self2._releaseHtml5Audio(audioNode);
                } catch (e2) {
                  self2.noAudio = true;
                  break;
                }
              }
              for (var i2 = 0; i2 < self2._howls.length; i2++) {
                if (!self2._howls[i2]._webAudio) {
                  var ids = self2._howls[i2]._getSoundIds();
                  for (var j = 0; j < ids.length; j++) {
                    var sound = self2._howls[i2]._soundById(ids[j]);
                    if (sound && sound._node && !sound._node._unlocked) {
                      sound._node._unlocked = true;
                      sound._node.load();
                    }
                  }
                }
              }
              self2._autoResume();
              var source = self2.ctx.createBufferSource();
              source.buffer = self2._scratchBuffer;
              source.connect(self2.ctx.destination);
              if (typeof source.start === "undefined") {
                source.noteOn(0);
              } else {
                source.start(0);
              }
              if (typeof self2.ctx.resume === "function") {
                self2.ctx.resume();
              }
              source.onended = function() {
                source.disconnect(0);
                self2._audioUnlocked = true;
                document.removeEventListener("touchstart", unlock, true);
                document.removeEventListener("touchend", unlock, true);
                document.removeEventListener("click", unlock, true);
                document.removeEventListener("keydown", unlock, true);
                for (var i3 = 0; i3 < self2._howls.length; i3++) {
                  self2._howls[i3]._emit("unlock");
                }
              };
            };
            document.addEventListener("touchstart", unlock, true);
            document.addEventListener("touchend", unlock, true);
            document.addEventListener("click", unlock, true);
            document.addEventListener("keydown", unlock, true);
            return self2;
          },
          /**
           * Get an unlocked HTML5 Audio object from the pool. If none are left,
           * return a new Audio object and throw a warning.
           * @return {Audio} HTML5 Audio object.
           */
          _obtainHtml5Audio: function() {
            var self2 = this || Howler2;
            if (self2._html5AudioPool.length) {
              return self2._html5AudioPool.pop();
            }
            var testPlay = new Audio().play();
            if (testPlay && typeof Promise !== "undefined" && (testPlay instanceof Promise || typeof testPlay.then === "function")) {
              testPlay.catch(function() {
                console.warn("HTML5 Audio pool exhausted, returning potentially locked audio object.");
              });
            }
            return new Audio();
          },
          /**
           * Return an activated HTML5 Audio object to the pool.
           * @return {Howler}
           */
          _releaseHtml5Audio: function(audio) {
            var self2 = this || Howler2;
            if (audio._unlocked) {
              self2._html5AudioPool.push(audio);
            }
            return self2;
          },
          /**
           * Automatically suspend the Web Audio AudioContext after no sound has played for 30 seconds.
           * This saves processing/energy and fixes various browser-specific bugs with audio getting stuck.
           * @return {Howler}
           */
          _autoSuspend: function() {
            var self2 = this;
            if (!self2.autoSuspend || !self2.ctx || typeof self2.ctx.suspend === "undefined" || !Howler2.usingWebAudio) {
              return;
            }
            for (var i2 = 0; i2 < self2._howls.length; i2++) {
              if (self2._howls[i2]._webAudio) {
                for (var j = 0; j < self2._howls[i2]._sounds.length; j++) {
                  if (!self2._howls[i2]._sounds[j]._paused) {
                    return self2;
                  }
                }
              }
            }
            if (self2._suspendTimer) {
              clearTimeout(self2._suspendTimer);
            }
            self2._suspendTimer = setTimeout(function() {
              if (!self2.autoSuspend) {
                return;
              }
              self2._suspendTimer = null;
              self2.state = "suspending";
              var handleSuspension = function() {
                self2.state = "suspended";
                if (self2._resumeAfterSuspend) {
                  delete self2._resumeAfterSuspend;
                  self2._autoResume();
                }
              };
              self2.ctx.suspend().then(handleSuspension, handleSuspension);
            }, 3e4);
            return self2;
          },
          /**
           * Automatically resume the Web Audio AudioContext when a new sound is played.
           * @return {Howler}
           */
          _autoResume: function() {
            var self2 = this;
            if (!self2.ctx || typeof self2.ctx.resume === "undefined" || !Howler2.usingWebAudio) {
              return;
            }
            if (self2.state === "running" && self2.ctx.state !== "interrupted" && self2._suspendTimer) {
              clearTimeout(self2._suspendTimer);
              self2._suspendTimer = null;
            } else if (self2.state === "suspended" || self2.state === "running" && self2.ctx.state === "interrupted") {
              self2.ctx.resume().then(function() {
                self2.state = "running";
                for (var i2 = 0; i2 < self2._howls.length; i2++) {
                  self2._howls[i2]._emit("resume");
                }
              });
              if (self2._suspendTimer) {
                clearTimeout(self2._suspendTimer);
                self2._suspendTimer = null;
              }
            } else if (self2.state === "suspending") {
              self2._resumeAfterSuspend = true;
            }
            return self2;
          }
        };
        var Howler2 = new HowlerGlobal2();
        var Howl2 = function(o) {
          var self2 = this;
          if (!o.src || o.src.length === 0) {
            console.error("An array of source files must be passed with any new Howl.");
            return;
          }
          self2.init(o);
        };
        Howl2.prototype = {
          /**
           * Initialize a new Howl group object.
           * @param  {Object} o Passed in properties for this group.
           * @return {Howl}
           */
          init: function(o) {
            var self2 = this;
            if (!Howler2.ctx) {
              setupAudioContext();
            }
            self2._autoplay = o.autoplay || false;
            self2._format = typeof o.format !== "string" ? o.format : [o.format];
            self2._html5 = o.html5 || false;
            self2._muted = o.mute || false;
            self2._loop = o.loop || false;
            self2._pool = o.pool || 5;
            self2._preload = typeof o.preload === "boolean" || o.preload === "metadata" ? o.preload : true;
            self2._rate = o.rate || 1;
            self2._sprite = o.sprite || {};
            self2._src = typeof o.src !== "string" ? o.src : [o.src];
            self2._volume = o.volume !== void 0 ? o.volume : 1;
            self2._xhr = {
              method: o.xhr && o.xhr.method ? o.xhr.method : "GET",
              headers: o.xhr && o.xhr.headers ? o.xhr.headers : null,
              withCredentials: o.xhr && o.xhr.withCredentials ? o.xhr.withCredentials : false
            };
            self2._duration = 0;
            self2._state = "unloaded";
            self2._sounds = [];
            self2._endTimers = {};
            self2._queue = [];
            self2._playLock = false;
            self2._onend = o.onend ? [{ fn: o.onend }] : [];
            self2._onfade = o.onfade ? [{ fn: o.onfade }] : [];
            self2._onload = o.onload ? [{ fn: o.onload }] : [];
            self2._onloaderror = o.onloaderror ? [{ fn: o.onloaderror }] : [];
            self2._onplayerror = o.onplayerror ? [{ fn: o.onplayerror }] : [];
            self2._onpause = o.onpause ? [{ fn: o.onpause }] : [];
            self2._onplay = o.onplay ? [{ fn: o.onplay }] : [];
            self2._onstop = o.onstop ? [{ fn: o.onstop }] : [];
            self2._onmute = o.onmute ? [{ fn: o.onmute }] : [];
            self2._onvolume = o.onvolume ? [{ fn: o.onvolume }] : [];
            self2._onrate = o.onrate ? [{ fn: o.onrate }] : [];
            self2._onseek = o.onseek ? [{ fn: o.onseek }] : [];
            self2._onunlock = o.onunlock ? [{ fn: o.onunlock }] : [];
            self2._onresume = [];
            self2._webAudio = Howler2.usingWebAudio && !self2._html5;
            if (typeof Howler2.ctx !== "undefined" && Howler2.ctx && Howler2.autoUnlock) {
              Howler2._unlockAudio();
            }
            Howler2._howls.push(self2);
            if (self2._autoplay) {
              self2._queue.push({
                event: "play",
                action: function() {
                  self2.play();
                }
              });
            }
            if (self2._preload && self2._preload !== "none") {
              self2.load();
            }
            return self2;
          },
          /**
           * Load the audio file.
           * @return {Howler}
           */
          load: function() {
            var self2 = this;
            var url2 = null;
            if (Howler2.noAudio) {
              self2._emit("loaderror", null, "No audio support.");
              return;
            }
            if (typeof self2._src === "string") {
              self2._src = [self2._src];
            }
            for (var i2 = 0; i2 < self2._src.length; i2++) {
              var ext, str5;
              if (self2._format && self2._format[i2]) {
                ext = self2._format[i2];
              } else {
                str5 = self2._src[i2];
                if (typeof str5 !== "string") {
                  self2._emit("loaderror", null, "Non-string found in selected audio sources - ignoring.");
                  continue;
                }
                ext = /^data:audio\/([^;,]+);/i.exec(str5);
                if (!ext) {
                  ext = /\.([^.]+)$/.exec(str5.split("?", 1)[0]);
                }
                if (ext) {
                  ext = ext[1].toLowerCase();
                }
              }
              if (!ext) {
                console.warn('No file extension was found. Consider using the "format" property or specify an extension.');
              }
              if (ext && Howler2.codecs(ext)) {
                url2 = self2._src[i2];
                break;
              }
            }
            if (!url2) {
              self2._emit("loaderror", null, "No codec support for selected audio sources.");
              return;
            }
            self2._src = url2;
            self2._state = "loading";
            if (window.location.protocol === "https:" && url2.slice(0, 5) === "http:") {
              self2._html5 = true;
              self2._webAudio = false;
            }
            new Sound2(self2);
            if (self2._webAudio) {
              loadBuffer(self2);
            }
            return self2;
          },
          /**
           * Play a sound or resume previous playback.
           * @param  {String/Number} sprite   Sprite name for sprite playback or sound id to continue previous.
           * @param  {Boolean} internal Internal Use: true prevents event firing.
           * @return {Number}          Sound ID.
           */
          play: function(sprite, internal) {
            var self2 = this;
            var id = null;
            if (typeof sprite === "number") {
              id = sprite;
              sprite = null;
            } else if (typeof sprite === "string" && self2._state === "loaded" && !self2._sprite[sprite]) {
              return null;
            } else if (typeof sprite === "undefined") {
              sprite = "__default";
              if (!self2._playLock) {
                var num = 0;
                for (var i2 = 0; i2 < self2._sounds.length; i2++) {
                  if (self2._sounds[i2]._paused && !self2._sounds[i2]._ended) {
                    num++;
                    id = self2._sounds[i2]._id;
                  }
                }
                if (num === 1) {
                  sprite = null;
                } else {
                  id = null;
                }
              }
            }
            var sound = id ? self2._soundById(id) : self2._inactiveSound();
            if (!sound) {
              return null;
            }
            if (id && !sprite) {
              sprite = sound._sprite || "__default";
            }
            if (self2._state !== "loaded") {
              sound._sprite = sprite;
              sound._ended = false;
              var soundId = sound._id;
              self2._queue.push({
                event: "play",
                action: function() {
                  self2.play(soundId);
                }
              });
              return soundId;
            }
            if (id && !sound._paused) {
              if (!internal) {
                self2._loadQueue("play");
              }
              return sound._id;
            }
            if (self2._webAudio) {
              Howler2._autoResume();
            }
            var seek = Math.max(0, sound._seek > 0 ? sound._seek : self2._sprite[sprite][0] / 1e3);
            var duration = Math.max(0, (self2._sprite[sprite][0] + self2._sprite[sprite][1]) / 1e3 - seek);
            var timeout = duration * 1e3 / Math.abs(sound._rate);
            var start = self2._sprite[sprite][0] / 1e3;
            var stop = (self2._sprite[sprite][0] + self2._sprite[sprite][1]) / 1e3;
            sound._sprite = sprite;
            sound._ended = false;
            var setParams = function() {
              sound._paused = false;
              sound._seek = seek;
              sound._start = start;
              sound._stop = stop;
              sound._loop = !!(sound._loop || self2._sprite[sprite][2]);
            };
            if (seek >= stop) {
              self2._ended(sound);
              return;
            }
            var node = sound._node;
            if (self2._webAudio) {
              var playWebAudio = function() {
                self2._playLock = false;
                setParams();
                self2._refreshBuffer(sound);
                var vol = sound._muted || self2._muted ? 0 : sound._volume;
                node.gain.setValueAtTime(vol, Howler2.ctx.currentTime);
                sound._playStart = Howler2.ctx.currentTime;
                if (typeof node.bufferSource.start === "undefined") {
                  sound._loop ? node.bufferSource.noteGrainOn(0, seek, 86400) : node.bufferSource.noteGrainOn(0, seek, duration);
                } else {
                  sound._loop ? node.bufferSource.start(0, seek, 86400) : node.bufferSource.start(0, seek, duration);
                }
                if (timeout !== Infinity) {
                  self2._endTimers[sound._id] = setTimeout(self2._ended.bind(self2, sound), timeout);
                }
                if (!internal) {
                  setTimeout(function() {
                    self2._emit("play", sound._id);
                    self2._loadQueue();
                  }, 0);
                }
              };
              if (Howler2.state === "running" && Howler2.ctx.state !== "interrupted") {
                playWebAudio();
              } else {
                self2._playLock = true;
                self2.once("resume", playWebAudio);
                self2._clearTimer(sound._id);
              }
            } else {
              var playHtml5 = function() {
                node.currentTime = seek;
                node.muted = sound._muted || self2._muted || Howler2._muted || node.muted;
                node.volume = sound._volume * Howler2.volume();
                node.playbackRate = sound._rate;
                try {
                  var play = node.play();
                  if (play && typeof Promise !== "undefined" && (play instanceof Promise || typeof play.then === "function")) {
                    self2._playLock = true;
                    setParams();
                    play.then(function() {
                      self2._playLock = false;
                      node._unlocked = true;
                      if (!internal) {
                        self2._emit("play", sound._id);
                      } else {
                        self2._loadQueue();
                      }
                    }).catch(function() {
                      self2._playLock = false;
                      self2._emit("playerror", sound._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");
                      sound._ended = true;
                      sound._paused = true;
                    });
                  } else if (!internal) {
                    self2._playLock = false;
                    setParams();
                    self2._emit("play", sound._id);
                  }
                  node.playbackRate = sound._rate;
                  if (node.paused) {
                    self2._emit("playerror", sound._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");
                    return;
                  }
                  if (sprite !== "__default" || sound._loop) {
                    self2._endTimers[sound._id] = setTimeout(self2._ended.bind(self2, sound), timeout);
                  } else {
                    self2._endTimers[sound._id] = function() {
                      self2._ended(sound);
                      node.removeEventListener("ended", self2._endTimers[sound._id], false);
                    };
                    node.addEventListener("ended", self2._endTimers[sound._id], false);
                  }
                } catch (err) {
                  self2._emit("playerror", sound._id, err);
                }
              };
              if (node.src === "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA") {
                node.src = self2._src;
                node.load();
              }
              var loadedNoReadyState = window && window.ejecta || !node.readyState && Howler2._navigator.isCocoonJS;
              if (node.readyState >= 3 || loadedNoReadyState) {
                playHtml5();
              } else {
                self2._playLock = true;
                self2._state = "loading";
                var listener = function() {
                  self2._state = "loaded";
                  playHtml5();
                  node.removeEventListener(Howler2._canPlayEvent, listener, false);
                };
                node.addEventListener(Howler2._canPlayEvent, listener, false);
                self2._clearTimer(sound._id);
              }
            }
            return sound._id;
          },
          /**
           * Pause playback and save current position.
           * @param  {Number} id The sound ID (empty to pause all in group).
           * @return {Howl}
           */
          pause: function(id) {
            var self2 = this;
            if (self2._state !== "loaded" || self2._playLock) {
              self2._queue.push({
                event: "pause",
                action: function() {
                  self2.pause(id);
                }
              });
              return self2;
            }
            var ids = self2._getSoundIds(id);
            for (var i2 = 0; i2 < ids.length; i2++) {
              self2._clearTimer(ids[i2]);
              var sound = self2._soundById(ids[i2]);
              if (sound && !sound._paused) {
                sound._seek = self2.seek(ids[i2]);
                sound._rateSeek = 0;
                sound._paused = true;
                self2._stopFade(ids[i2]);
                if (sound._node) {
                  if (self2._webAudio) {
                    if (!sound._node.bufferSource) {
                      continue;
                    }
                    if (typeof sound._node.bufferSource.stop === "undefined") {
                      sound._node.bufferSource.noteOff(0);
                    } else {
                      sound._node.bufferSource.stop(0);
                    }
                    self2._cleanBuffer(sound._node);
                  } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
                    sound._node.pause();
                  }
                }
              }
              if (!arguments[1]) {
                self2._emit("pause", sound ? sound._id : null);
              }
            }
            return self2;
          },
          /**
           * Stop playback and reset to start.
           * @param  {Number} id The sound ID (empty to stop all in group).
           * @param  {Boolean} internal Internal Use: true prevents event firing.
           * @return {Howl}
           */
          stop: function(id, internal) {
            var self2 = this;
            if (self2._state !== "loaded" || self2._playLock) {
              self2._queue.push({
                event: "stop",
                action: function() {
                  self2.stop(id);
                }
              });
              return self2;
            }
            var ids = self2._getSoundIds(id);
            for (var i2 = 0; i2 < ids.length; i2++) {
              self2._clearTimer(ids[i2]);
              var sound = self2._soundById(ids[i2]);
              if (sound) {
                sound._seek = sound._start || 0;
                sound._rateSeek = 0;
                sound._paused = true;
                sound._ended = true;
                self2._stopFade(ids[i2]);
                if (sound._node) {
                  if (self2._webAudio) {
                    if (sound._node.bufferSource) {
                      if (typeof sound._node.bufferSource.stop === "undefined") {
                        sound._node.bufferSource.noteOff(0);
                      } else {
                        sound._node.bufferSource.stop(0);
                      }
                      self2._cleanBuffer(sound._node);
                    }
                  } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
                    sound._node.currentTime = sound._start || 0;
                    sound._node.pause();
                    if (sound._node.duration === Infinity) {
                      self2._clearSound(sound._node);
                    }
                  }
                }
                if (!internal) {
                  self2._emit("stop", sound._id);
                }
              }
            }
            return self2;
          },
          /**
           * Mute/unmute a single sound or all sounds in this Howl group.
           * @param  {Boolean} muted Set to true to mute and false to unmute.
           * @param  {Number} id    The sound ID to update (omit to mute/unmute all).
           * @return {Howl}
           */
          mute: function(muted, id) {
            var self2 = this;
            if (self2._state !== "loaded" || self2._playLock) {
              self2._queue.push({
                event: "mute",
                action: function() {
                  self2.mute(muted, id);
                }
              });
              return self2;
            }
            if (typeof id === "undefined") {
              if (typeof muted === "boolean") {
                self2._muted = muted;
              } else {
                return self2._muted;
              }
            }
            var ids = self2._getSoundIds(id);
            for (var i2 = 0; i2 < ids.length; i2++) {
              var sound = self2._soundById(ids[i2]);
              if (sound) {
                sound._muted = muted;
                if (sound._interval) {
                  self2._stopFade(sound._id);
                }
                if (self2._webAudio && sound._node) {
                  sound._node.gain.setValueAtTime(muted ? 0 : sound._volume, Howler2.ctx.currentTime);
                } else if (sound._node) {
                  sound._node.muted = Howler2._muted ? true : muted;
                }
                self2._emit("mute", sound._id);
              }
            }
            return self2;
          },
          /**
           * Get/set the volume of this sound or of the Howl group. This method can optionally take 0, 1 or 2 arguments.
           *   volume() -> Returns the group's volume value.
           *   volume(id) -> Returns the sound id's current volume.
           *   volume(vol) -> Sets the volume of all sounds in this Howl group.
           *   volume(vol, id) -> Sets the volume of passed sound id.
           * @return {Howl/Number} Returns self or current volume.
           */
          volume: function() {
            var self2 = this;
            var args = arguments;
            var vol, id;
            if (args.length === 0) {
              return self2._volume;
            } else if (args.length === 1 || args.length === 2 && typeof args[1] === "undefined") {
              var ids = self2._getSoundIds();
              var index = ids.indexOf(args[0]);
              if (index >= 0) {
                id = parseInt(args[0], 10);
              } else {
                vol = parseFloat(args[0]);
              }
            } else if (args.length >= 2) {
              vol = parseFloat(args[0]);
              id = parseInt(args[1], 10);
            }
            var sound;
            if (typeof vol !== "undefined" && vol >= 0 && vol <= 1) {
              if (self2._state !== "loaded" || self2._playLock) {
                self2._queue.push({
                  event: "volume",
                  action: function() {
                    self2.volume.apply(self2, args);
                  }
                });
                return self2;
              }
              if (typeof id === "undefined") {
                self2._volume = vol;
              }
              id = self2._getSoundIds(id);
              for (var i2 = 0; i2 < id.length; i2++) {
                sound = self2._soundById(id[i2]);
                if (sound) {
                  sound._volume = vol;
                  if (!args[2]) {
                    self2._stopFade(id[i2]);
                  }
                  if (self2._webAudio && sound._node && !sound._muted) {
                    sound._node.gain.setValueAtTime(vol, Howler2.ctx.currentTime);
                  } else if (sound._node && !sound._muted) {
                    sound._node.volume = vol * Howler2.volume();
                  }
                  self2._emit("volume", sound._id);
                }
              }
            } else {
              sound = id ? self2._soundById(id) : self2._sounds[0];
              return sound ? sound._volume : 0;
            }
            return self2;
          },
          /**
           * Fade a currently playing sound between two volumes (if no id is passed, all sounds will fade).
           * @param  {Number} from The value to fade from (0.0 to 1.0).
           * @param  {Number} to   The volume to fade to (0.0 to 1.0).
           * @param  {Number} len  Time in milliseconds to fade.
           * @param  {Number} id   The sound id (omit to fade all sounds).
           * @return {Howl}
           */
          fade: function(from, to, len4, id) {
            var self2 = this;
            if (self2._state !== "loaded" || self2._playLock) {
              self2._queue.push({
                event: "fade",
                action: function() {
                  self2.fade(from, to, len4, id);
                }
              });
              return self2;
            }
            from = Math.min(Math.max(0, parseFloat(from)), 1);
            to = Math.min(Math.max(0, parseFloat(to)), 1);
            len4 = parseFloat(len4);
            self2.volume(from, id);
            var ids = self2._getSoundIds(id);
            for (var i2 = 0; i2 < ids.length; i2++) {
              var sound = self2._soundById(ids[i2]);
              if (sound) {
                if (!id) {
                  self2._stopFade(ids[i2]);
                }
                if (self2._webAudio && !sound._muted) {
                  var currentTime = Howler2.ctx.currentTime;
                  var end = currentTime + len4 / 1e3;
                  sound._volume = from;
                  sound._node.gain.setValueAtTime(from, currentTime);
                  sound._node.gain.linearRampToValueAtTime(to, end);
                }
                self2._startFadeInterval(sound, from, to, len4, ids[i2], typeof id === "undefined");
              }
            }
            return self2;
          },
          /**
           * Starts the internal interval to fade a sound.
           * @param  {Object} sound Reference to sound to fade.
           * @param  {Number} from The value to fade from (0.0 to 1.0).
           * @param  {Number} to   The volume to fade to (0.0 to 1.0).
           * @param  {Number} len  Time in milliseconds to fade.
           * @param  {Number} id   The sound id to fade.
           * @param  {Boolean} isGroup   If true, set the volume on the group.
           */
          _startFadeInterval: function(sound, from, to, len4, id, isGroup) {
            var self2 = this;
            var vol = from;
            var diff = to - from;
            var steps = Math.abs(diff / 0.01);
            var stepLen = Math.max(4, steps > 0 ? len4 / steps : len4);
            var lastTick = Date.now();
            sound._fadeTo = to;
            sound._interval = setInterval(function() {
              var tick = (Date.now() - lastTick) / len4;
              lastTick = Date.now();
              vol += diff * tick;
              vol = Math.round(vol * 100) / 100;
              if (diff < 0) {
                vol = Math.max(to, vol);
              } else {
                vol = Math.min(to, vol);
              }
              if (self2._webAudio) {
                sound._volume = vol;
              } else {
                self2.volume(vol, sound._id, true);
              }
              if (isGroup) {
                self2._volume = vol;
              }
              if (to < from && vol <= to || to > from && vol >= to) {
                clearInterval(sound._interval);
                sound._interval = null;
                sound._fadeTo = null;
                self2.volume(to, sound._id);
                self2._emit("fade", sound._id);
              }
            }, stepLen);
          },
          /**
           * Internal method that stops the currently playing fade when
           * a new fade starts, volume is changed or the sound is stopped.
           * @param  {Number} id The sound id.
           * @return {Howl}
           */
          _stopFade: function(id) {
            var self2 = this;
            var sound = self2._soundById(id);
            if (sound && sound._interval) {
              if (self2._webAudio) {
                sound._node.gain.cancelScheduledValues(Howler2.ctx.currentTime);
              }
              clearInterval(sound._interval);
              sound._interval = null;
              self2.volume(sound._fadeTo, id);
              sound._fadeTo = null;
              self2._emit("fade", id);
            }
            return self2;
          },
          /**
           * Get/set the loop parameter on a sound. This method can optionally take 0, 1 or 2 arguments.
           *   loop() -> Returns the group's loop value.
           *   loop(id) -> Returns the sound id's loop value.
           *   loop(loop) -> Sets the loop value for all sounds in this Howl group.
           *   loop(loop, id) -> Sets the loop value of passed sound id.
           * @return {Howl/Boolean} Returns self or current loop value.
           */
          loop: function() {
            var self2 = this;
            var args = arguments;
            var loop, id, sound;
            if (args.length === 0) {
              return self2._loop;
            } else if (args.length === 1) {
              if (typeof args[0] === "boolean") {
                loop = args[0];
                self2._loop = loop;
              } else {
                sound = self2._soundById(parseInt(args[0], 10));
                return sound ? sound._loop : false;
              }
            } else if (args.length === 2) {
              loop = args[0];
              id = parseInt(args[1], 10);
            }
            var ids = self2._getSoundIds(id);
            for (var i2 = 0; i2 < ids.length; i2++) {
              sound = self2._soundById(ids[i2]);
              if (sound) {
                sound._loop = loop;
                if (self2._webAudio && sound._node && sound._node.bufferSource) {
                  sound._node.bufferSource.loop = loop;
                  if (loop) {
                    sound._node.bufferSource.loopStart = sound._start || 0;
                    sound._node.bufferSource.loopEnd = sound._stop;
                    if (self2.playing(ids[i2])) {
                      self2.pause(ids[i2], true);
                      self2.play(ids[i2], true);
                    }
                  }
                }
              }
            }
            return self2;
          },
          /**
           * Get/set the playback rate of a sound. This method can optionally take 0, 1 or 2 arguments.
           *   rate() -> Returns the first sound node's current playback rate.
           *   rate(id) -> Returns the sound id's current playback rate.
           *   rate(rate) -> Sets the playback rate of all sounds in this Howl group.
           *   rate(rate, id) -> Sets the playback rate of passed sound id.
           * @return {Howl/Number} Returns self or the current playback rate.
           */
          rate: function() {
            var self2 = this;
            var args = arguments;
            var rate, id;
            if (args.length === 0) {
              id = self2._sounds[0]._id;
            } else if (args.length === 1) {
              var ids = self2._getSoundIds();
              var index = ids.indexOf(args[0]);
              if (index >= 0) {
                id = parseInt(args[0], 10);
              } else {
                rate = parseFloat(args[0]);
              }
            } else if (args.length === 2) {
              rate = parseFloat(args[0]);
              id = parseInt(args[1], 10);
            }
            var sound;
            if (typeof rate === "number") {
              if (self2._state !== "loaded" || self2._playLock) {
                self2._queue.push({
                  event: "rate",
                  action: function() {
                    self2.rate.apply(self2, args);
                  }
                });
                return self2;
              }
              if (typeof id === "undefined") {
                self2._rate = rate;
              }
              id = self2._getSoundIds(id);
              for (var i2 = 0; i2 < id.length; i2++) {
                sound = self2._soundById(id[i2]);
                if (sound) {
                  if (self2.playing(id[i2])) {
                    sound._rateSeek = self2.seek(id[i2]);
                    sound._playStart = self2._webAudio ? Howler2.ctx.currentTime : sound._playStart;
                  }
                  sound._rate = rate;
                  if (self2._webAudio && sound._node && sound._node.bufferSource) {
                    sound._node.bufferSource.playbackRate.setValueAtTime(rate, Howler2.ctx.currentTime);
                  } else if (sound._node) {
                    sound._node.playbackRate = rate;
                  }
                  var seek = self2.seek(id[i2]);
                  var duration = (self2._sprite[sound._sprite][0] + self2._sprite[sound._sprite][1]) / 1e3 - seek;
                  var timeout = duration * 1e3 / Math.abs(sound._rate);
                  if (self2._endTimers[id[i2]] || !sound._paused) {
                    self2._clearTimer(id[i2]);
                    self2._endTimers[id[i2]] = setTimeout(self2._ended.bind(self2, sound), timeout);
                  }
                  self2._emit("rate", sound._id);
                }
              }
            } else {
              sound = self2._soundById(id);
              return sound ? sound._rate : self2._rate;
            }
            return self2;
          },
          /**
           * Get/set the seek position of a sound. This method can optionally take 0, 1 or 2 arguments.
           *   seek() -> Returns the first sound node's current seek position.
           *   seek(id) -> Returns the sound id's current seek position.
           *   seek(seek) -> Sets the seek position of the first sound node.
           *   seek(seek, id) -> Sets the seek position of passed sound id.
           * @return {Howl/Number} Returns self or the current seek position.
           */
          seek: function() {
            var self2 = this;
            var args = arguments;
            var seek, id;
            if (args.length === 0) {
              if (self2._sounds.length) {
                id = self2._sounds[0]._id;
              }
            } else if (args.length === 1) {
              var ids = self2._getSoundIds();
              var index = ids.indexOf(args[0]);
              if (index >= 0) {
                id = parseInt(args[0], 10);
              } else if (self2._sounds.length) {
                id = self2._sounds[0]._id;
                seek = parseFloat(args[0]);
              }
            } else if (args.length === 2) {
              seek = parseFloat(args[0]);
              id = parseInt(args[1], 10);
            }
            if (typeof id === "undefined") {
              return 0;
            }
            if (typeof seek === "number" && (self2._state !== "loaded" || self2._playLock)) {
              self2._queue.push({
                event: "seek",
                action: function() {
                  self2.seek.apply(self2, args);
                }
              });
              return self2;
            }
            var sound = self2._soundById(id);
            if (sound) {
              if (typeof seek === "number" && seek >= 0) {
                var playing = self2.playing(id);
                if (playing) {
                  self2.pause(id, true);
                }
                sound._seek = seek;
                sound._ended = false;
                self2._clearTimer(id);
                if (!self2._webAudio && sound._node && !isNaN(sound._node.duration)) {
                  sound._node.currentTime = seek;
                }
                var seekAndEmit = function() {
                  if (playing) {
                    self2.play(id, true);
                  }
                  self2._emit("seek", id);
                };
                if (playing && !self2._webAudio) {
                  var emitSeek = function() {
                    if (!self2._playLock) {
                      seekAndEmit();
                    } else {
                      setTimeout(emitSeek, 0);
                    }
                  };
                  setTimeout(emitSeek, 0);
                } else {
                  seekAndEmit();
                }
              } else {
                if (self2._webAudio) {
                  var realTime = self2.playing(id) ? Howler2.ctx.currentTime - sound._playStart : 0;
                  var rateSeek = sound._rateSeek ? sound._rateSeek - sound._seek : 0;
                  return sound._seek + (rateSeek + realTime * Math.abs(sound._rate));
                } else {
                  return sound._node.currentTime;
                }
              }
            }
            return self2;
          },
          /**
           * Check if a specific sound is currently playing or not (if id is provided), or check if at least one of the sounds in the group is playing or not.
           * @param  {Number}  id The sound id to check. If none is passed, the whole sound group is checked.
           * @return {Boolean} True if playing and false if not.
           */
          playing: function(id) {
            var self2 = this;
            if (typeof id === "number") {
              var sound = self2._soundById(id);
              return sound ? !sound._paused : false;
            }
            for (var i2 = 0; i2 < self2._sounds.length; i2++) {
              if (!self2._sounds[i2]._paused) {
                return true;
              }
            }
            return false;
          },
          /**
           * Get the duration of this sound. Passing a sound id will return the sprite duration.
           * @param  {Number} id The sound id to check. If none is passed, return full source duration.
           * @return {Number} Audio duration in seconds.
           */
          duration: function(id) {
            var self2 = this;
            var duration = self2._duration;
            var sound = self2._soundById(id);
            if (sound) {
              duration = self2._sprite[sound._sprite][1] / 1e3;
            }
            return duration;
          },
          /**
           * Returns the current loaded state of this Howl.
           * @return {String} 'unloaded', 'loading', 'loaded'
           */
          state: function() {
            return this._state;
          },
          /**
           * Unload and destroy the current Howl object.
           * This will immediately stop all sound instances attached to this group.
           */
          unload: function() {
            var self2 = this;
            var sounds = self2._sounds;
            for (var i2 = 0; i2 < sounds.length; i2++) {
              if (!sounds[i2]._paused) {
                self2.stop(sounds[i2]._id);
              }
              if (!self2._webAudio) {
                self2._clearSound(sounds[i2]._node);
                sounds[i2]._node.removeEventListener("error", sounds[i2]._errorFn, false);
                sounds[i2]._node.removeEventListener(Howler2._canPlayEvent, sounds[i2]._loadFn, false);
                sounds[i2]._node.removeEventListener("ended", sounds[i2]._endFn, false);
                Howler2._releaseHtml5Audio(sounds[i2]._node);
              }
              delete sounds[i2]._node;
              self2._clearTimer(sounds[i2]._id);
            }
            var index = Howler2._howls.indexOf(self2);
            if (index >= 0) {
              Howler2._howls.splice(index, 1);
            }
            var remCache = true;
            for (i2 = 0; i2 < Howler2._howls.length; i2++) {
              if (Howler2._howls[i2]._src === self2._src || self2._src.indexOf(Howler2._howls[i2]._src) >= 0) {
                remCache = false;
                break;
              }
            }
            if (cache2 && remCache) {
              delete cache2[self2._src];
            }
            Howler2.noAudio = false;
            self2._state = "unloaded";
            self2._sounds = [];
            self2 = null;
            return null;
          },
          /**
           * Listen to a custom event.
           * @param  {String}   event Event name.
           * @param  {Function} fn    Listener to call.
           * @param  {Number}   id    (optional) Only listen to events for this sound.
           * @param  {Number}   once  (INTERNAL) Marks event to fire only once.
           * @return {Howl}
           */
          on: function(event, fn, id, once) {
            var self2 = this;
            var events = self2["_on" + event];
            if (typeof fn === "function") {
              events.push(once ? { id, fn, once } : { id, fn });
            }
            return self2;
          },
          /**
           * Remove a custom event. Call without parameters to remove all events.
           * @param  {String}   event Event name.
           * @param  {Function} fn    Listener to remove. Leave empty to remove all.
           * @param  {Number}   id    (optional) Only remove events for this sound.
           * @return {Howl}
           */
          off: function(event, fn, id) {
            var self2 = this;
            var events = self2["_on" + event];
            var i2 = 0;
            if (typeof fn === "number") {
              id = fn;
              fn = null;
            }
            if (fn || id) {
              for (i2 = 0; i2 < events.length; i2++) {
                var isId = id === events[i2].id;
                if (fn === events[i2].fn && isId || !fn && isId) {
                  events.splice(i2, 1);
                  break;
                }
              }
            } else if (event) {
              self2["_on" + event] = [];
            } else {
              var keys = Object.keys(self2);
              for (i2 = 0; i2 < keys.length; i2++) {
                if (keys[i2].indexOf("_on") === 0 && Array.isArray(self2[keys[i2]])) {
                  self2[keys[i2]] = [];
                }
              }
            }
            return self2;
          },
          /**
           * Listen to a custom event and remove it once fired.
           * @param  {String}   event Event name.
           * @param  {Function} fn    Listener to call.
           * @param  {Number}   id    (optional) Only listen to events for this sound.
           * @return {Howl}
           */
          once: function(event, fn, id) {
            var self2 = this;
            self2.on(event, fn, id, 1);
            return self2;
          },
          /**
           * Emit all events of a specific type and pass the sound id.
           * @param  {String} event Event name.
           * @param  {Number} id    Sound ID.
           * @param  {Number} msg   Message to go with event.
           * @return {Howl}
           */
          _emit: function(event, id, msg) {
            var self2 = this;
            var events = self2["_on" + event];
            for (var i2 = events.length - 1; i2 >= 0; i2--) {
              if (!events[i2].id || events[i2].id === id || event === "load") {
                setTimeout(function(fn) {
                  fn.call(this, id, msg);
                }.bind(self2, events[i2].fn), 0);
                if (events[i2].once) {
                  self2.off(event, events[i2].fn, events[i2].id);
                }
              }
            }
            self2._loadQueue(event);
            return self2;
          },
          /**
           * Queue of actions initiated before the sound has loaded.
           * These will be called in sequence, with the next only firing
           * after the previous has finished executing (even if async like play).
           * @return {Howl}
           */
          _loadQueue: function(event) {
            var self2 = this;
            if (self2._queue.length > 0) {
              var task = self2._queue[0];
              if (task.event === event) {
                self2._queue.shift();
                self2._loadQueue();
              }
              if (!event) {
                task.action();
              }
            }
            return self2;
          },
          /**
           * Fired when playback ends at the end of the duration.
           * @param  {Sound} sound The sound object to work with.
           * @return {Howl}
           */
          _ended: function(sound) {
            var self2 = this;
            var sprite = sound._sprite;
            if (!self2._webAudio && sound._node && !sound._node.paused && !sound._node.ended && sound._node.currentTime < sound._stop) {
              setTimeout(self2._ended.bind(self2, sound), 100);
              return self2;
            }
            var loop = !!(sound._loop || self2._sprite[sprite][2]);
            self2._emit("end", sound._id);
            if (!self2._webAudio && loop) {
              self2.stop(sound._id, true).play(sound._id);
            }
            if (self2._webAudio && loop) {
              self2._emit("play", sound._id);
              sound._seek = sound._start || 0;
              sound._rateSeek = 0;
              sound._playStart = Howler2.ctx.currentTime;
              var timeout = (sound._stop - sound._start) * 1e3 / Math.abs(sound._rate);
              self2._endTimers[sound._id] = setTimeout(self2._ended.bind(self2, sound), timeout);
            }
            if (self2._webAudio && !loop) {
              sound._paused = true;
              sound._ended = true;
              sound._seek = sound._start || 0;
              sound._rateSeek = 0;
              self2._clearTimer(sound._id);
              self2._cleanBuffer(sound._node);
              Howler2._autoSuspend();
            }
            if (!self2._webAudio && !loop) {
              self2.stop(sound._id, true);
            }
            return self2;
          },
          /**
           * Clear the end timer for a sound playback.
           * @param  {Number} id The sound ID.
           * @return {Howl}
           */
          _clearTimer: function(id) {
            var self2 = this;
            if (self2._endTimers[id]) {
              if (typeof self2._endTimers[id] !== "function") {
                clearTimeout(self2._endTimers[id]);
              } else {
                var sound = self2._soundById(id);
                if (sound && sound._node) {
                  sound._node.removeEventListener("ended", self2._endTimers[id], false);
                }
              }
              delete self2._endTimers[id];
            }
            return self2;
          },
          /**
           * Return the sound identified by this ID, or return null.
           * @param  {Number} id Sound ID
           * @return {Object}    Sound object or null.
           */
          _soundById: function(id) {
            var self2 = this;
            for (var i2 = 0; i2 < self2._sounds.length; i2++) {
              if (id === self2._sounds[i2]._id) {
                return self2._sounds[i2];
              }
            }
            return null;
          },
          /**
           * Return an inactive sound from the pool or create a new one.
           * @return {Sound} Sound playback object.
           */
          _inactiveSound: function() {
            var self2 = this;
            self2._drain();
            for (var i2 = 0; i2 < self2._sounds.length; i2++) {
              if (self2._sounds[i2]._ended) {
                return self2._sounds[i2].reset();
              }
            }
            return new Sound2(self2);
          },
          /**
           * Drain excess inactive sounds from the pool.
           */
          _drain: function() {
            var self2 = this;
            var limit = self2._pool;
            var cnt = 0;
            var i2 = 0;
            if (self2._sounds.length < limit) {
              return;
            }
            for (i2 = 0; i2 < self2._sounds.length; i2++) {
              if (self2._sounds[i2]._ended) {
                cnt++;
              }
            }
            for (i2 = self2._sounds.length - 1; i2 >= 0; i2--) {
              if (cnt <= limit) {
                return;
              }
              if (self2._sounds[i2]._ended) {
                if (self2._webAudio && self2._sounds[i2]._node) {
                  self2._sounds[i2]._node.disconnect(0);
                }
                self2._sounds.splice(i2, 1);
                cnt--;
              }
            }
          },
          /**
           * Get all ID's from the sounds pool.
           * @param  {Number} id Only return one ID if one is passed.
           * @return {Array}    Array of IDs.
           */
          _getSoundIds: function(id) {
            var self2 = this;
            if (typeof id === "undefined") {
              var ids = [];
              for (var i2 = 0; i2 < self2._sounds.length; i2++) {
                ids.push(self2._sounds[i2]._id);
              }
              return ids;
            } else {
              return [id];
            }
          },
          /**
           * Load the sound back into the buffer source.
           * @param  {Sound} sound The sound object to work with.
           * @return {Howl}
           */
          _refreshBuffer: function(sound) {
            var self2 = this;
            sound._node.bufferSource = Howler2.ctx.createBufferSource();
            sound._node.bufferSource.buffer = cache2[self2._src];
            if (sound._panner) {
              sound._node.bufferSource.connect(sound._panner);
            } else {
              sound._node.bufferSource.connect(sound._node);
            }
            sound._node.bufferSource.loop = sound._loop;
            if (sound._loop) {
              sound._node.bufferSource.loopStart = sound._start || 0;
              sound._node.bufferSource.loopEnd = sound._stop || 0;
            }
            sound._node.bufferSource.playbackRate.setValueAtTime(sound._rate, Howler2.ctx.currentTime);
            return self2;
          },
          /**
           * Prevent memory leaks by cleaning up the buffer source after playback.
           * @param  {Object} node Sound's audio node containing the buffer source.
           * @return {Howl}
           */
          _cleanBuffer: function(node) {
            var self2 = this;
            var isIOS = Howler2._navigator && Howler2._navigator.vendor.indexOf("Apple") >= 0;
            if (!node.bufferSource) {
              return self2;
            }
            if (Howler2._scratchBuffer && node.bufferSource) {
              node.bufferSource.onended = null;
              node.bufferSource.disconnect(0);
              if (isIOS) {
                try {
                  node.bufferSource.buffer = Howler2._scratchBuffer;
                } catch (e) {
                }
              }
            }
            node.bufferSource = null;
            return self2;
          },
          /**
           * Set the source to a 0-second silence to stop any downloading (except in IE).
           * @param  {Object} node Audio node to clear.
           */
          _clearSound: function(node) {
            var checkIE = /MSIE |Trident\//.test(Howler2._navigator && Howler2._navigator.userAgent);
            if (!checkIE) {
              node.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
            }
          }
        };
        var Sound2 = function(howl) {
          this._parent = howl;
          this.init();
        };
        Sound2.prototype = {
          /**
           * Initialize a new Sound object.
           * @return {Sound}
           */
          init: function() {
            var self2 = this;
            var parent = self2._parent;
            self2._muted = parent._muted;
            self2._loop = parent._loop;
            self2._volume = parent._volume;
            self2._rate = parent._rate;
            self2._seek = 0;
            self2._paused = true;
            self2._ended = true;
            self2._sprite = "__default";
            self2._id = ++Howler2._counter;
            parent._sounds.push(self2);
            self2.create();
            return self2;
          },
          /**
           * Create and setup a new sound object, whether HTML5 Audio or Web Audio.
           * @return {Sound}
           */
          create: function() {
            var self2 = this;
            var parent = self2._parent;
            var volume = Howler2._muted || self2._muted || self2._parent._muted ? 0 : self2._volume;
            if (parent._webAudio) {
              self2._node = typeof Howler2.ctx.createGain === "undefined" ? Howler2.ctx.createGainNode() : Howler2.ctx.createGain();
              self2._node.gain.setValueAtTime(volume, Howler2.ctx.currentTime);
              self2._node.paused = true;
              self2._node.connect(Howler2.masterGain);
            } else if (!Howler2.noAudio) {
              self2._node = Howler2._obtainHtml5Audio();
              self2._errorFn = self2._errorListener.bind(self2);
              self2._node.addEventListener("error", self2._errorFn, false);
              self2._loadFn = self2._loadListener.bind(self2);
              self2._node.addEventListener(Howler2._canPlayEvent, self2._loadFn, false);
              self2._endFn = self2._endListener.bind(self2);
              self2._node.addEventListener("ended", self2._endFn, false);
              self2._node.src = parent._src;
              self2._node.preload = parent._preload === true ? "auto" : parent._preload;
              self2._node.volume = volume * Howler2.volume();
              self2._node.load();
            }
            return self2;
          },
          /**
           * Reset the parameters of this sound to the original state (for recycle).
           * @return {Sound}
           */
          reset: function() {
            var self2 = this;
            var parent = self2._parent;
            self2._muted = parent._muted;
            self2._loop = parent._loop;
            self2._volume = parent._volume;
            self2._rate = parent._rate;
            self2._seek = 0;
            self2._rateSeek = 0;
            self2._paused = true;
            self2._ended = true;
            self2._sprite = "__default";
            self2._id = ++Howler2._counter;
            return self2;
          },
          /**
           * HTML5 Audio error listener callback.
           */
          _errorListener: function() {
            var self2 = this;
            self2._parent._emit("loaderror", self2._id, self2._node.error ? self2._node.error.code : 0);
            self2._node.removeEventListener("error", self2._errorFn, false);
          },
          /**
           * HTML5 Audio canplaythrough listener callback.
           */
          _loadListener: function() {
            var self2 = this;
            var parent = self2._parent;
            parent._duration = Math.ceil(self2._node.duration * 10) / 10;
            if (Object.keys(parent._sprite).length === 0) {
              parent._sprite = { __default: [0, parent._duration * 1e3] };
            }
            if (parent._state !== "loaded") {
              parent._state = "loaded";
              parent._emit("load");
              parent._loadQueue();
            }
            self2._node.removeEventListener(Howler2._canPlayEvent, self2._loadFn, false);
          },
          /**
           * HTML5 Audio ended listener callback.
           */
          _endListener: function() {
            var self2 = this;
            var parent = self2._parent;
            if (parent._duration === Infinity) {
              parent._duration = Math.ceil(self2._node.duration * 10) / 10;
              if (parent._sprite.__default[1] === Infinity) {
                parent._sprite.__default[1] = parent._duration * 1e3;
              }
              parent._ended(self2);
            }
            self2._node.removeEventListener("ended", self2._endFn, false);
          }
        };
        var cache2 = {};
        var loadBuffer = function(self2) {
          var url2 = self2._src;
          if (cache2[url2]) {
            self2._duration = cache2[url2].duration;
            loadSound(self2);
            return;
          }
          if (/^data:[^;]+;base64,/.test(url2)) {
            var data = atob(url2.split(",")[1]);
            var dataView = new Uint8Array(data.length);
            for (var i2 = 0; i2 < data.length; ++i2) {
              dataView[i2] = data.charCodeAt(i2);
            }
            decodeAudioData(dataView.buffer, self2);
          } else {
            var xhr = new XMLHttpRequest();
            xhr.open(self2._xhr.method, url2, true);
            xhr.withCredentials = self2._xhr.withCredentials;
            xhr.responseType = "arraybuffer";
            if (self2._xhr.headers) {
              Object.keys(self2._xhr.headers).forEach(function(key) {
                xhr.setRequestHeader(key, self2._xhr.headers[key]);
              });
            }
            xhr.onload = function() {
              var code = (xhr.status + "")[0];
              if (code !== "0" && code !== "2" && code !== "3") {
                self2._emit("loaderror", null, "Failed loading audio file with status: " + xhr.status + ".");
                return;
              }
              decodeAudioData(xhr.response, self2);
            };
            xhr.onerror = function() {
              if (self2._webAudio) {
                self2._html5 = true;
                self2._webAudio = false;
                self2._sounds = [];
                delete cache2[url2];
                self2.load();
              }
            };
            safeXhrSend(xhr);
          }
        };
        var safeXhrSend = function(xhr) {
          try {
            xhr.send();
          } catch (e) {
            xhr.onerror();
          }
        };
        var decodeAudioData = function(arraybuffer, self2) {
          var error = function() {
            self2._emit("loaderror", null, "Decoding audio data failed.");
          };
          var success = function(buffer) {
            if (buffer && self2._sounds.length > 0) {
              cache2[self2._src] = buffer;
              loadSound(self2, buffer);
            } else {
              error();
            }
          };
          if (typeof Promise !== "undefined" && Howler2.ctx.decodeAudioData.length === 1) {
            Howler2.ctx.decodeAudioData(arraybuffer).then(success).catch(error);
          } else {
            Howler2.ctx.decodeAudioData(arraybuffer, success, error);
          }
        };
        var loadSound = function(self2, buffer) {
          if (buffer && !self2._duration) {
            self2._duration = buffer.duration;
          }
          if (Object.keys(self2._sprite).length === 0) {
            self2._sprite = { __default: [0, self2._duration * 1e3] };
          }
          if (self2._state !== "loaded") {
            self2._state = "loaded";
            self2._emit("load");
            self2._loadQueue();
          }
        };
        var setupAudioContext = function() {
          if (!Howler2.usingWebAudio) {
            return;
          }
          try {
            if (typeof AudioContext !== "undefined") {
              Howler2.ctx = new AudioContext();
            } else if (typeof webkitAudioContext !== "undefined") {
              Howler2.ctx = new webkitAudioContext();
            } else {
              Howler2.usingWebAudio = false;
            }
          } catch (e) {
            Howler2.usingWebAudio = false;
          }
          if (!Howler2.ctx) {
            Howler2.usingWebAudio = false;
          }
          var iOS = /iP(hone|od|ad)/.test(Howler2._navigator && Howler2._navigator.platform);
          var appVersion = Howler2._navigator && Howler2._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
          var version = appVersion ? parseInt(appVersion[1], 10) : null;
          if (iOS && version && version < 9) {
            var safari = /safari/.test(Howler2._navigator && Howler2._navigator.userAgent.toLowerCase());
            if (Howler2._navigator && !safari) {
              Howler2.usingWebAudio = false;
            }
          }
          if (Howler2.usingWebAudio) {
            Howler2.masterGain = typeof Howler2.ctx.createGain === "undefined" ? Howler2.ctx.createGainNode() : Howler2.ctx.createGain();
            Howler2.masterGain.gain.setValueAtTime(Howler2._muted ? 0 : Howler2._volume, Howler2.ctx.currentTime);
            Howler2.masterGain.connect(Howler2.ctx.destination);
          }
          Howler2._setup();
        };
        if (typeof define === "function" && define.amd) {
          define([], function() {
            return {
              Howler: Howler2,
              Howl: Howl2
            };
          });
        }
        if (typeof exports !== "undefined") {
          exports.Howler = Howler2;
          exports.Howl = Howl2;
        }
        if (typeof global !== "undefined") {
          global.HowlerGlobal = HowlerGlobal2;
          global.Howler = Howler2;
          global.Howl = Howl2;
          global.Sound = Sound2;
        } else if (typeof window !== "undefined") {
          window.HowlerGlobal = HowlerGlobal2;
          window.Howler = Howler2;
          window.Howl = Howl2;
          window.Sound = Sound2;
        }
      })();
      (function() {
        "use strict";
        HowlerGlobal.prototype._pos = [0, 0, 0];
        HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0];
        HowlerGlobal.prototype.stereo = function(pan) {
          var self2 = this;
          if (!self2.ctx || !self2.ctx.listener) {
            return self2;
          }
          for (var i2 = self2._howls.length - 1; i2 >= 0; i2--) {
            self2._howls[i2].stereo(pan);
          }
          return self2;
        };
        HowlerGlobal.prototype.pos = function(x, y, z) {
          var self2 = this;
          if (!self2.ctx || !self2.ctx.listener) {
            return self2;
          }
          y = typeof y !== "number" ? self2._pos[1] : y;
          z = typeof z !== "number" ? self2._pos[2] : z;
          if (typeof x === "number") {
            self2._pos = [x, y, z];
            if (typeof self2.ctx.listener.positionX !== "undefined") {
              self2.ctx.listener.positionX.setTargetAtTime(self2._pos[0], Howler.ctx.currentTime, 0.1);
              self2.ctx.listener.positionY.setTargetAtTime(self2._pos[1], Howler.ctx.currentTime, 0.1);
              self2.ctx.listener.positionZ.setTargetAtTime(self2._pos[2], Howler.ctx.currentTime, 0.1);
            } else {
              self2.ctx.listener.setPosition(self2._pos[0], self2._pos[1], self2._pos[2]);
            }
          } else {
            return self2._pos;
          }
          return self2;
        };
        HowlerGlobal.prototype.orientation = function(x, y, z, xUp, yUp, zUp) {
          var self2 = this;
          if (!self2.ctx || !self2.ctx.listener) {
            return self2;
          }
          var or = self2._orientation;
          y = typeof y !== "number" ? or[1] : y;
          z = typeof z !== "number" ? or[2] : z;
          xUp = typeof xUp !== "number" ? or[3] : xUp;
          yUp = typeof yUp !== "number" ? or[4] : yUp;
          zUp = typeof zUp !== "number" ? or[5] : zUp;
          if (typeof x === "number") {
            self2._orientation = [x, y, z, xUp, yUp, zUp];
            if (typeof self2.ctx.listener.forwardX !== "undefined") {
              self2.ctx.listener.forwardX.setTargetAtTime(x, Howler.ctx.currentTime, 0.1);
              self2.ctx.listener.forwardY.setTargetAtTime(y, Howler.ctx.currentTime, 0.1);
              self2.ctx.listener.forwardZ.setTargetAtTime(z, Howler.ctx.currentTime, 0.1);
              self2.ctx.listener.upX.setTargetAtTime(xUp, Howler.ctx.currentTime, 0.1);
              self2.ctx.listener.upY.setTargetAtTime(yUp, Howler.ctx.currentTime, 0.1);
              self2.ctx.listener.upZ.setTargetAtTime(zUp, Howler.ctx.currentTime, 0.1);
            } else {
              self2.ctx.listener.setOrientation(x, y, z, xUp, yUp, zUp);
            }
          } else {
            return or;
          }
          return self2;
        };
        Howl.prototype.init = function(_super) {
          return function(o) {
            var self2 = this;
            self2._orientation = o.orientation || [1, 0, 0];
            self2._stereo = o.stereo || null;
            self2._pos = o.pos || null;
            self2._pannerAttr = {
              coneInnerAngle: typeof o.coneInnerAngle !== "undefined" ? o.coneInnerAngle : 360,
              coneOuterAngle: typeof o.coneOuterAngle !== "undefined" ? o.coneOuterAngle : 360,
              coneOuterGain: typeof o.coneOuterGain !== "undefined" ? o.coneOuterGain : 0,
              distanceModel: typeof o.distanceModel !== "undefined" ? o.distanceModel : "inverse",
              maxDistance: typeof o.maxDistance !== "undefined" ? o.maxDistance : 1e4,
              panningModel: typeof o.panningModel !== "undefined" ? o.panningModel : "HRTF",
              refDistance: typeof o.refDistance !== "undefined" ? o.refDistance : 1,
              rolloffFactor: typeof o.rolloffFactor !== "undefined" ? o.rolloffFactor : 1
            };
            self2._onstereo = o.onstereo ? [{ fn: o.onstereo }] : [];
            self2._onpos = o.onpos ? [{ fn: o.onpos }] : [];
            self2._onorientation = o.onorientation ? [{ fn: o.onorientation }] : [];
            return _super.call(this, o);
          };
        }(Howl.prototype.init);
        Howl.prototype.stereo = function(pan, id) {
          var self2 = this;
          if (!self2._webAudio) {
            return self2;
          }
          if (self2._state !== "loaded") {
            self2._queue.push({
              event: "stereo",
              action: function() {
                self2.stereo(pan, id);
              }
            });
            return self2;
          }
          var pannerType = typeof Howler.ctx.createStereoPanner === "undefined" ? "spatial" : "stereo";
          if (typeof id === "undefined") {
            if (typeof pan === "number") {
              self2._stereo = pan;
              self2._pos = [pan, 0, 0];
            } else {
              return self2._stereo;
            }
          }
          var ids = self2._getSoundIds(id);
          for (var i2 = 0; i2 < ids.length; i2++) {
            var sound = self2._soundById(ids[i2]);
            if (sound) {
              if (typeof pan === "number") {
                sound._stereo = pan;
                sound._pos = [pan, 0, 0];
                if (sound._node) {
                  sound._pannerAttr.panningModel = "equalpower";
                  if (!sound._panner || !sound._panner.pan) {
                    setupPanner(sound, pannerType);
                  }
                  if (pannerType === "spatial") {
                    if (typeof sound._panner.positionX !== "undefined") {
                      sound._panner.positionX.setValueAtTime(pan, Howler.ctx.currentTime);
                      sound._panner.positionY.setValueAtTime(0, Howler.ctx.currentTime);
                      sound._panner.positionZ.setValueAtTime(0, Howler.ctx.currentTime);
                    } else {
                      sound._panner.setPosition(pan, 0, 0);
                    }
                  } else {
                    sound._panner.pan.setValueAtTime(pan, Howler.ctx.currentTime);
                  }
                }
                self2._emit("stereo", sound._id);
              } else {
                return sound._stereo;
              }
            }
          }
          return self2;
        };
        Howl.prototype.pos = function(x, y, z, id) {
          var self2 = this;
          if (!self2._webAudio) {
            return self2;
          }
          if (self2._state !== "loaded") {
            self2._queue.push({
              event: "pos",
              action: function() {
                self2.pos(x, y, z, id);
              }
            });
            return self2;
          }
          y = typeof y !== "number" ? 0 : y;
          z = typeof z !== "number" ? -0.5 : z;
          if (typeof id === "undefined") {
            if (typeof x === "number") {
              self2._pos = [x, y, z];
            } else {
              return self2._pos;
            }
          }
          var ids = self2._getSoundIds(id);
          for (var i2 = 0; i2 < ids.length; i2++) {
            var sound = self2._soundById(ids[i2]);
            if (sound) {
              if (typeof x === "number") {
                sound._pos = [x, y, z];
                if (sound._node) {
                  if (!sound._panner || sound._panner.pan) {
                    setupPanner(sound, "spatial");
                  }
                  if (typeof sound._panner.positionX !== "undefined") {
                    sound._panner.positionX.setValueAtTime(x, Howler.ctx.currentTime);
                    sound._panner.positionY.setValueAtTime(y, Howler.ctx.currentTime);
                    sound._panner.positionZ.setValueAtTime(z, Howler.ctx.currentTime);
                  } else {
                    sound._panner.setPosition(x, y, z);
                  }
                }
                self2._emit("pos", sound._id);
              } else {
                return sound._pos;
              }
            }
          }
          return self2;
        };
        Howl.prototype.orientation = function(x, y, z, id) {
          var self2 = this;
          if (!self2._webAudio) {
            return self2;
          }
          if (self2._state !== "loaded") {
            self2._queue.push({
              event: "orientation",
              action: function() {
                self2.orientation(x, y, z, id);
              }
            });
            return self2;
          }
          y = typeof y !== "number" ? self2._orientation[1] : y;
          z = typeof z !== "number" ? self2._orientation[2] : z;
          if (typeof id === "undefined") {
            if (typeof x === "number") {
              self2._orientation = [x, y, z];
            } else {
              return self2._orientation;
            }
          }
          var ids = self2._getSoundIds(id);
          for (var i2 = 0; i2 < ids.length; i2++) {
            var sound = self2._soundById(ids[i2]);
            if (sound) {
              if (typeof x === "number") {
                sound._orientation = [x, y, z];
                if (sound._node) {
                  if (!sound._panner) {
                    if (!sound._pos) {
                      sound._pos = self2._pos || [0, 0, -0.5];
                    }
                    setupPanner(sound, "spatial");
                  }
                  if (typeof sound._panner.orientationX !== "undefined") {
                    sound._panner.orientationX.setValueAtTime(x, Howler.ctx.currentTime);
                    sound._panner.orientationY.setValueAtTime(y, Howler.ctx.currentTime);
                    sound._panner.orientationZ.setValueAtTime(z, Howler.ctx.currentTime);
                  } else {
                    sound._panner.setOrientation(x, y, z);
                  }
                }
                self2._emit("orientation", sound._id);
              } else {
                return sound._orientation;
              }
            }
          }
          return self2;
        };
        Howl.prototype.pannerAttr = function() {
          var self2 = this;
          var args = arguments;
          var o, id, sound;
          if (!self2._webAudio) {
            return self2;
          }
          if (args.length === 0) {
            return self2._pannerAttr;
          } else if (args.length === 1) {
            if (typeof args[0] === "object") {
              o = args[0];
              if (typeof id === "undefined") {
                if (!o.pannerAttr) {
                  o.pannerAttr = {
                    coneInnerAngle: o.coneInnerAngle,
                    coneOuterAngle: o.coneOuterAngle,
                    coneOuterGain: o.coneOuterGain,
                    distanceModel: o.distanceModel,
                    maxDistance: o.maxDistance,
                    refDistance: o.refDistance,
                    rolloffFactor: o.rolloffFactor,
                    panningModel: o.panningModel
                  };
                }
                self2._pannerAttr = {
                  coneInnerAngle: typeof o.pannerAttr.coneInnerAngle !== "undefined" ? o.pannerAttr.coneInnerAngle : self2._coneInnerAngle,
                  coneOuterAngle: typeof o.pannerAttr.coneOuterAngle !== "undefined" ? o.pannerAttr.coneOuterAngle : self2._coneOuterAngle,
                  coneOuterGain: typeof o.pannerAttr.coneOuterGain !== "undefined" ? o.pannerAttr.coneOuterGain : self2._coneOuterGain,
                  distanceModel: typeof o.pannerAttr.distanceModel !== "undefined" ? o.pannerAttr.distanceModel : self2._distanceModel,
                  maxDistance: typeof o.pannerAttr.maxDistance !== "undefined" ? o.pannerAttr.maxDistance : self2._maxDistance,
                  refDistance: typeof o.pannerAttr.refDistance !== "undefined" ? o.pannerAttr.refDistance : self2._refDistance,
                  rolloffFactor: typeof o.pannerAttr.rolloffFactor !== "undefined" ? o.pannerAttr.rolloffFactor : self2._rolloffFactor,
                  panningModel: typeof o.pannerAttr.panningModel !== "undefined" ? o.pannerAttr.panningModel : self2._panningModel
                };
              }
            } else {
              sound = self2._soundById(parseInt(args[0], 10));
              return sound ? sound._pannerAttr : self2._pannerAttr;
            }
          } else if (args.length === 2) {
            o = args[0];
            id = parseInt(args[1], 10);
          }
          var ids = self2._getSoundIds(id);
          for (var i2 = 0; i2 < ids.length; i2++) {
            sound = self2._soundById(ids[i2]);
            if (sound) {
              var pa = sound._pannerAttr;
              pa = {
                coneInnerAngle: typeof o.coneInnerAngle !== "undefined" ? o.coneInnerAngle : pa.coneInnerAngle,
                coneOuterAngle: typeof o.coneOuterAngle !== "undefined" ? o.coneOuterAngle : pa.coneOuterAngle,
                coneOuterGain: typeof o.coneOuterGain !== "undefined" ? o.coneOuterGain : pa.coneOuterGain,
                distanceModel: typeof o.distanceModel !== "undefined" ? o.distanceModel : pa.distanceModel,
                maxDistance: typeof o.maxDistance !== "undefined" ? o.maxDistance : pa.maxDistance,
                refDistance: typeof o.refDistance !== "undefined" ? o.refDistance : pa.refDistance,
                rolloffFactor: typeof o.rolloffFactor !== "undefined" ? o.rolloffFactor : pa.rolloffFactor,
                panningModel: typeof o.panningModel !== "undefined" ? o.panningModel : pa.panningModel
              };
              var panner = sound._panner;
              if (!panner) {
                if (!sound._pos) {
                  sound._pos = self2._pos || [0, 0, -0.5];
                }
                setupPanner(sound, "spatial");
                panner = sound._panner;
              }
              panner.coneInnerAngle = pa.coneInnerAngle;
              panner.coneOuterAngle = pa.coneOuterAngle;
              panner.coneOuterGain = pa.coneOuterGain;
              panner.distanceModel = pa.distanceModel;
              panner.maxDistance = pa.maxDistance;
              panner.refDistance = pa.refDistance;
              panner.rolloffFactor = pa.rolloffFactor;
              panner.panningModel = pa.panningModel;
            }
          }
          return self2;
        };
        Sound.prototype.init = function(_super) {
          return function() {
            var self2 = this;
            var parent = self2._parent;
            self2._orientation = parent._orientation;
            self2._stereo = parent._stereo;
            self2._pos = parent._pos;
            self2._pannerAttr = parent._pannerAttr;
            _super.call(this);
            if (self2._stereo) {
              parent.stereo(self2._stereo);
            } else if (self2._pos) {
              parent.pos(self2._pos[0], self2._pos[1], self2._pos[2], self2._id);
            }
          };
        }(Sound.prototype.init);
        Sound.prototype.reset = function(_super) {
          return function() {
            var self2 = this;
            var parent = self2._parent;
            self2._orientation = parent._orientation;
            self2._stereo = parent._stereo;
            self2._pos = parent._pos;
            self2._pannerAttr = parent._pannerAttr;
            if (self2._stereo) {
              parent.stereo(self2._stereo);
            } else if (self2._pos) {
              parent.pos(self2._pos[0], self2._pos[1], self2._pos[2], self2._id);
            } else if (self2._panner) {
              self2._panner.disconnect(0);
              self2._panner = void 0;
              parent._refreshBuffer(self2);
            }
            return _super.call(this);
          };
        }(Sound.prototype.reset);
        var setupPanner = function(sound, type) {
          type = type || "spatial";
          if (type === "spatial") {
            sound._panner = Howler.ctx.createPanner();
            sound._panner.coneInnerAngle = sound._pannerAttr.coneInnerAngle;
            sound._panner.coneOuterAngle = sound._pannerAttr.coneOuterAngle;
            sound._panner.coneOuterGain = sound._pannerAttr.coneOuterGain;
            sound._panner.distanceModel = sound._pannerAttr.distanceModel;
            sound._panner.maxDistance = sound._pannerAttr.maxDistance;
            sound._panner.refDistance = sound._pannerAttr.refDistance;
            sound._panner.rolloffFactor = sound._pannerAttr.rolloffFactor;
            sound._panner.panningModel = sound._pannerAttr.panningModel;
            if (typeof sound._panner.positionX !== "undefined") {
              sound._panner.positionX.setValueAtTime(sound._pos[0], Howler.ctx.currentTime);
              sound._panner.positionY.setValueAtTime(sound._pos[1], Howler.ctx.currentTime);
              sound._panner.positionZ.setValueAtTime(sound._pos[2], Howler.ctx.currentTime);
            } else {
              sound._panner.setPosition(sound._pos[0], sound._pos[1], sound._pos[2]);
            }
            if (typeof sound._panner.orientationX !== "undefined") {
              sound._panner.orientationX.setValueAtTime(sound._orientation[0], Howler.ctx.currentTime);
              sound._panner.orientationY.setValueAtTime(sound._orientation[1], Howler.ctx.currentTime);
              sound._panner.orientationZ.setValueAtTime(sound._orientation[2], Howler.ctx.currentTime);
            } else {
              sound._panner.setOrientation(sound._orientation[0], sound._orientation[1], sound._orientation[2]);
            }
          } else {
            sound._panner = Howler.ctx.createStereoPanner();
            sound._panner.pan.setValueAtTime(sound._stereo, Howler.ctx.currentTime);
          }
          sound._panner.connect(sound._node);
          if (!sound._paused) {
            sound._parent.pause(sound._id, true).play(sound._id, true);
          }
        };
      })();
    }
  });

  // node_modules/earcut/src/earcut.js
  var require_earcut = __commonJS({
    "node_modules/earcut/src/earcut.js"(exports, module) {
      "use strict";
      module.exports = earcut2;
      module.exports.default = earcut2;
      function earcut2(data, holeIndices, dim) {
        dim = dim || 2;
        var hasHoles = holeIndices && holeIndices.length, outerLen = hasHoles ? holeIndices[0] * dim : data.length, outerNode = linkedList(data, 0, outerLen, dim, true), triangles = [];
        if (!outerNode || outerNode.next === outerNode.prev)
          return triangles;
        var minX, minY, maxX, maxY, x, y, invSize;
        if (hasHoles)
          outerNode = eliminateHoles(data, holeIndices, outerNode, dim);
        if (data.length > 80 * dim) {
          minX = maxX = data[0];
          minY = maxY = data[1];
          for (var i2 = dim; i2 < outerLen; i2 += dim) {
            x = data[i2];
            y = data[i2 + 1];
            if (x < minX)
              minX = x;
            if (y < minY)
              minY = y;
            if (x > maxX)
              maxX = x;
            if (y > maxY)
              maxY = y;
          }
          invSize = Math.max(maxX - minX, maxY - minY);
          invSize = invSize !== 0 ? 32767 / invSize : 0;
        }
        earcutLinked(outerNode, triangles, dim, minX, minY, invSize, 0);
        return triangles;
      }
      function linkedList(data, start, end, dim, clockwise) {
        var i2, last;
        if (clockwise === signedArea(data, start, end, dim) > 0) {
          for (i2 = start; i2 < end; i2 += dim)
            last = insertNode(i2, data[i2], data[i2 + 1], last);
        } else {
          for (i2 = end - dim; i2 >= start; i2 -= dim)
            last = insertNode(i2, data[i2], data[i2 + 1], last);
        }
        if (last && equals6(last, last.next)) {
          removeNode(last);
          last = last.next;
        }
        return last;
      }
      function filterPoints(start, end) {
        if (!start)
          return start;
        if (!end)
          end = start;
        var p = start, again;
        do {
          again = false;
          if (!p.steiner && (equals6(p, p.next) || area(p.prev, p, p.next) === 0)) {
            removeNode(p);
            p = end = p.prev;
            if (p === p.next)
              break;
            again = true;
          } else {
            p = p.next;
          }
        } while (again || p !== end);
        return end;
      }
      function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
        if (!ear)
          return;
        if (!pass && invSize)
          indexCurve(ear, minX, minY, invSize);
        var stop = ear, prev2, next;
        while (ear.prev !== ear.next) {
          prev2 = ear.prev;
          next = ear.next;
          if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
            triangles.push(prev2.i / dim | 0);
            triangles.push(ear.i / dim | 0);
            triangles.push(next.i / dim | 0);
            removeNode(ear);
            ear = next.next;
            stop = next.next;
            continue;
          }
          ear = next;
          if (ear === stop) {
            if (!pass) {
              earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);
            } else if (pass === 1) {
              ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
              earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);
            } else if (pass === 2) {
              splitEarcut(ear, triangles, dim, minX, minY, invSize);
            }
            break;
          }
        }
      }
      function isEar(ear) {
        var a = ear.prev, b = ear, c = ear.next;
        if (area(a, b, c) >= 0)
          return false;
        var ax = a.x, bx = b.x, cx = c.x, ay = a.y, by = b.y, cy = c.y;
        var x0 = ax < bx ? ax < cx ? ax : cx : bx < cx ? bx : cx, y0 = ay < by ? ay < cy ? ay : cy : by < cy ? by : cy, x1 = ax > bx ? ax > cx ? ax : cx : bx > cx ? bx : cx, y1 = ay > by ? ay > cy ? ay : cy : by > cy ? by : cy;
        var p = c.next;
        while (p !== a) {
          if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0)
            return false;
          p = p.next;
        }
        return true;
      }
      function isEarHashed(ear, minX, minY, invSize) {
        var a = ear.prev, b = ear, c = ear.next;
        if (area(a, b, c) >= 0)
          return false;
        var ax = a.x, bx = b.x, cx = c.x, ay = a.y, by = b.y, cy = c.y;
        var x0 = ax < bx ? ax < cx ? ax : cx : bx < cx ? bx : cx, y0 = ay < by ? ay < cy ? ay : cy : by < cy ? by : cy, x1 = ax > bx ? ax > cx ? ax : cx : bx > cx ? bx : cx, y1 = ay > by ? ay > cy ? ay : cy : by > cy ? by : cy;
        var minZ = zOrder(x0, y0, minX, minY, invSize), maxZ = zOrder(x1, y1, minX, minY, invSize);
        var p = ear.prevZ, n = ear.nextZ;
        while (p && p.z >= minZ && n && n.z <= maxZ) {
          if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c && pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0)
            return false;
          p = p.prevZ;
          if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c && pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0)
            return false;
          n = n.nextZ;
        }
        while (p && p.z >= minZ) {
          if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c && pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0)
            return false;
          p = p.prevZ;
        }
        while (n && n.z <= maxZ) {
          if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c && pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0)
            return false;
          n = n.nextZ;
        }
        return true;
      }
      function cureLocalIntersections(start, triangles, dim) {
        var p = start;
        do {
          var a = p.prev, b = p.next.next;
          if (!equals6(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {
            triangles.push(a.i / dim | 0);
            triangles.push(p.i / dim | 0);
            triangles.push(b.i / dim | 0);
            removeNode(p);
            removeNode(p.next);
            p = start = b;
          }
          p = p.next;
        } while (p !== start);
        return filterPoints(p);
      }
      function splitEarcut(start, triangles, dim, minX, minY, invSize) {
        var a = start;
        do {
          var b = a.next.next;
          while (b !== a.prev) {
            if (a.i !== b.i && isValidDiagonal(a, b)) {
              var c = splitPolygon(a, b);
              a = filterPoints(a, a.next);
              c = filterPoints(c, c.next);
              earcutLinked(a, triangles, dim, minX, minY, invSize, 0);
              earcutLinked(c, triangles, dim, minX, minY, invSize, 0);
              return;
            }
            b = b.next;
          }
          a = a.next;
        } while (a !== start);
      }
      function eliminateHoles(data, holeIndices, outerNode, dim) {
        var queue = [], i2, len4, start, end, list;
        for (i2 = 0, len4 = holeIndices.length; i2 < len4; i2++) {
          start = holeIndices[i2] * dim;
          end = i2 < len4 - 1 ? holeIndices[i2 + 1] * dim : data.length;
          list = linkedList(data, start, end, dim, false);
          if (list === list.next)
            list.steiner = true;
          queue.push(getLeftmost(list));
        }
        queue.sort(compareX);
        for (i2 = 0; i2 < queue.length; i2++) {
          outerNode = eliminateHole(queue[i2], outerNode);
        }
        return outerNode;
      }
      function compareX(a, b) {
        return a.x - b.x;
      }
      function eliminateHole(hole, outerNode) {
        var bridge = findHoleBridge(hole, outerNode);
        if (!bridge) {
          return outerNode;
        }
        var bridgeReverse = splitPolygon(bridge, hole);
        filterPoints(bridgeReverse, bridgeReverse.next);
        return filterPoints(bridge, bridge.next);
      }
      function findHoleBridge(hole, outerNode) {
        var p = outerNode, hx = hole.x, hy = hole.y, qx = -Infinity, m;
        do {
          if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
            var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
            if (x <= hx && x > qx) {
              qx = x;
              m = p.x < p.next.x ? p : p.next;
              if (x === hx)
                return m;
            }
          }
          p = p.next;
        } while (p !== outerNode);
        if (!m)
          return null;
        var stop = m, mx = m.x, my = m.y, tanMin = Infinity, tan;
        p = m;
        do {
          if (hx >= p.x && p.x >= mx && hx !== p.x && pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {
            tan = Math.abs(hy - p.y) / (hx - p.x);
            if (locallyInside(p, hole) && (tan < tanMin || tan === tanMin && (p.x > m.x || p.x === m.x && sectorContainsSector(m, p)))) {
              m = p;
              tanMin = tan;
            }
          }
          p = p.next;
        } while (p !== stop);
        return m;
      }
      function sectorContainsSector(m, p) {
        return area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
      }
      function indexCurve(start, minX, minY, invSize) {
        var p = start;
        do {
          if (p.z === 0)
            p.z = zOrder(p.x, p.y, minX, minY, invSize);
          p.prevZ = p.prev;
          p.nextZ = p.next;
          p = p.next;
        } while (p !== start);
        p.prevZ.nextZ = null;
        p.prevZ = null;
        sortLinked(p);
      }
      function sortLinked(list) {
        var i2, p, q, e, tail, numMerges, pSize, qSize, inSize = 1;
        do {
          p = list;
          list = null;
          tail = null;
          numMerges = 0;
          while (p) {
            numMerges++;
            q = p;
            pSize = 0;
            for (i2 = 0; i2 < inSize; i2++) {
              pSize++;
              q = q.nextZ;
              if (!q)
                break;
            }
            qSize = inSize;
            while (pSize > 0 || qSize > 0 && q) {
              if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
                e = p;
                p = p.nextZ;
                pSize--;
              } else {
                e = q;
                q = q.nextZ;
                qSize--;
              }
              if (tail)
                tail.nextZ = e;
              else
                list = e;
              e.prevZ = tail;
              tail = e;
            }
            p = q;
          }
          tail.nextZ = null;
          inSize *= 2;
        } while (numMerges > 1);
        return list;
      }
      function zOrder(x, y, minX, minY, invSize) {
        x = (x - minX) * invSize | 0;
        y = (y - minY) * invSize | 0;
        x = (x | x << 8) & 16711935;
        x = (x | x << 4) & 252645135;
        x = (x | x << 2) & 858993459;
        x = (x | x << 1) & 1431655765;
        y = (y | y << 8) & 16711935;
        y = (y | y << 4) & 252645135;
        y = (y | y << 2) & 858993459;
        y = (y | y << 1) & 1431655765;
        return x | y << 1;
      }
      function getLeftmost(start) {
        var p = start, leftmost = start;
        do {
          if (p.x < leftmost.x || p.x === leftmost.x && p.y < leftmost.y)
            leftmost = p;
          p = p.next;
        } while (p !== start);
        return leftmost;
      }
      function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
        return (cx - px) * (ay - py) >= (ax - px) * (cy - py) && (ax - px) * (by - py) >= (bx - px) * (ay - py) && (bx - px) * (cy - py) >= (cx - px) * (by - py);
      }
      function isValidDiagonal(a, b) {
        return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && // dones't intersect other edges
        (locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && // locally visible
        (area(a.prev, a, b.prev) || area(a, b.prev, b)) || // does not create opposite-facing sectors
        equals6(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0);
      }
      function area(p, q, r) {
        return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
      }
      function equals6(p1, p2) {
        return p1.x === p2.x && p1.y === p2.y;
      }
      function intersects(p1, q1, p2, q2) {
        var o1 = sign(area(p1, q1, p2));
        var o2 = sign(area(p1, q1, q2));
        var o3 = sign(area(p2, q2, p1));
        var o4 = sign(area(p2, q2, q1));
        if (o1 !== o2 && o3 !== o4)
          return true;
        if (o1 === 0 && onSegment(p1, p2, q1))
          return true;
        if (o2 === 0 && onSegment(p1, q2, q1))
          return true;
        if (o3 === 0 && onSegment(p2, p1, q2))
          return true;
        if (o4 === 0 && onSegment(p2, q1, q2))
          return true;
        return false;
      }
      function onSegment(p, q, r) {
        return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
      }
      function sign(num) {
        return num > 0 ? 1 : num < 0 ? -1 : 0;
      }
      function intersectsPolygon(a, b) {
        var p = a;
        do {
          if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i && intersects(p, p.next, a, b))
            return true;
          p = p.next;
        } while (p !== a);
        return false;
      }
      function locallyInside(a, b) {
        return area(a.prev, a, a.next) < 0 ? area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 : area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
      }
      function middleInside(a, b) {
        var p = a, inside = false, px = (a.x + b.x) / 2, py = (a.y + b.y) / 2;
        do {
          if (p.y > py !== p.next.y > py && p.next.y !== p.y && px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x)
            inside = !inside;
          p = p.next;
        } while (p !== a);
        return inside;
      }
      function splitPolygon(a, b) {
        var a2 = new Node(a.i, a.x, a.y), b2 = new Node(b.i, b.x, b.y), an = a.next, bp = b.prev;
        a.next = b;
        b.prev = a;
        a2.next = an;
        an.prev = a2;
        b2.next = a2;
        a2.prev = b2;
        bp.next = b2;
        b2.prev = bp;
        return b2;
      }
      function insertNode(i2, x, y, last) {
        var p = new Node(i2, x, y);
        if (!last) {
          p.prev = p;
          p.next = p;
        } else {
          p.next = last.next;
          p.prev = last;
          last.next.prev = p;
          last.next = p;
        }
        return p;
      }
      function removeNode(p) {
        p.next.prev = p.prev;
        p.prev.next = p.next;
        if (p.prevZ)
          p.prevZ.nextZ = p.nextZ;
        if (p.nextZ)
          p.nextZ.prevZ = p.prevZ;
      }
      function Node(i2, x, y) {
        this.i = i2;
        this.x = x;
        this.y = y;
        this.prev = null;
        this.next = null;
        this.z = 0;
        this.prevZ = null;
        this.nextZ = null;
        this.steiner = false;
      }
      earcut2.deviation = function(data, holeIndices, dim, triangles) {
        var hasHoles = holeIndices && holeIndices.length;
        var outerLen = hasHoles ? holeIndices[0] * dim : data.length;
        var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
        if (hasHoles) {
          for (var i2 = 0, len4 = holeIndices.length; i2 < len4; i2++) {
            var start = holeIndices[i2] * dim;
            var end = i2 < len4 - 1 ? holeIndices[i2 + 1] * dim : data.length;
            polygonArea -= Math.abs(signedArea(data, start, end, dim));
          }
        }
        var trianglesArea = 0;
        for (i2 = 0; i2 < triangles.length; i2 += 3) {
          var a = triangles[i2] * dim;
          var b = triangles[i2 + 1] * dim;
          var c = triangles[i2 + 2] * dim;
          trianglesArea += Math.abs(
            (data[a] - data[c]) * (data[b + 1] - data[a + 1]) - (data[a] - data[b]) * (data[c + 1] - data[a + 1])
          );
        }
        return polygonArea === 0 && trianglesArea === 0 ? 0 : Math.abs((trianglesArea - polygonArea) / polygonArea);
      };
      function signedArea(data, start, end, dim) {
        var sum = 0;
        for (var i2 = start, j = end - dim; i2 < end; i2 += dim) {
          sum += (data[j] - data[i2]) * (data[i2 + 1] + data[j + 1]);
          j = i2;
        }
        return sum;
      }
      earcut2.flatten = function(data) {
        var dim = data[0][0].length, result = { vertices: [], holes: [], dimensions: dim }, holeIndex = 0;
        for (var i2 = 0; i2 < data.length; i2++) {
          for (var j = 0; j < data[i2].length; j++) {
            for (var d = 0; d < dim; d++)
              result.vertices.push(data[i2][j][d]);
          }
          if (i2 > 0) {
            holeIndex += data[i2 - 1].length;
            result.holes.push(holeIndex);
          }
        }
        return result;
      };
    }
  });

  // node_modules/@wonderlandengine/components/dist/index.js
  var dist_exports = {};
  __export(dist_exports, {
    ARCamera8thwall: () => ARCamera8thwall,
    Anchor: () => Anchor,
    Cursor: () => Cursor,
    CursorTarget: () => CursorTarget,
    DebugObject: () => DebugObject,
    DeviceOrientationLook: () => DeviceOrientationLook,
    FingerCursor: () => FingerCursor,
    FixedFoveation: () => FixedFoveation,
    HandTracking: () => HandTracking,
    HitTestLocation: () => HitTestLocation,
    HowlerAudioListener: () => HowlerAudioListener,
    HowlerAudioSource: () => HowlerAudioSource,
    ImageTexture: () => ImageTexture,
    InputProfile: () => InputProfile,
    MouseLookComponent: () => MouseLookComponent,
    OrbitalCamera: () => OrbitalCamera,
    PlaneDetection: () => PlaneDetection,
    PlayerHeight: () => PlayerHeight,
    TargetFramerate: () => TargetFramerate,
    TeleportComponent: () => TeleportComponent,
    Trail: () => Trail,
    TwoJointIkSolver: () => TwoJointIkSolver,
    VideoTexture: () => VideoTexture,
    VrModeActiveSwitch: () => VrModeActiveSwitch,
    Vrm: () => Vrm,
    WasdControlsComponent: () => WasdControlsComponent,
    isPointLocalOnXRPlanePolygon: () => isPointLocalOnXRPlanePolygon,
    isPointWorldOnXRPlanePolygon: () => isPointWorldOnXRPlanePolygon
  });

  // node_modules/@wonderlandengine/api/dist/property.js
  var Type;
  (function(Type2) {
    Type2[Type2["Native"] = 0] = "Native";
    Type2[Type2["Bool"] = 1] = "Bool";
    Type2[Type2["Int"] = 2] = "Int";
    Type2[Type2["Float"] = 3] = "Float";
    Type2[Type2["String"] = 4] = "String";
    Type2[Type2["Enum"] = 5] = "Enum";
    Type2[Type2["Object"] = 6] = "Object";
    Type2[Type2["Mesh"] = 7] = "Mesh";
    Type2[Type2["Texture"] = 8] = "Texture";
    Type2[Type2["Material"] = 9] = "Material";
    Type2[Type2["Animation"] = 10] = "Animation";
    Type2[Type2["Skin"] = 11] = "Skin";
    Type2[Type2["Color"] = 12] = "Color";
    Type2[Type2["Vector2"] = 13] = "Vector2";
    Type2[Type2["Vector3"] = 14] = "Vector3";
    Type2[Type2["Vector4"] = 15] = "Vector4";
  })(Type || (Type = {}));
  var DefaultPropertyCloner = class {
    clone(type, value2) {
      switch (type) {
        case Type.Color:
        case Type.Vector2:
        case Type.Vector3:
        case Type.Vector4:
          return value2.slice();
        default:
          return value2;
      }
    }
  };
  var defaultPropertyCloner = new DefaultPropertyCloner();
  var Property = {
    /**
     * Create an boolean property.
     *
     * @param defaultValue The default value. If not provided, defaults to `false`.
     */
    bool(defaultValue = false) {
      return { type: Type.Bool, default: defaultValue };
    },
    /**
     * Create an integer property.
     *
     * @param defaultValue The default value. If not provided, defaults to `0`.
     */
    int(defaultValue = 0) {
      return { type: Type.Int, default: defaultValue };
    },
    /**
     * Create an float property.
     *
     * @param defaultValue The default value. If not provided, defaults to `0.0`.
     */
    float(defaultValue = 0) {
      return { type: Type.Float, default: defaultValue };
    },
    /**
     * Create an string property.
     *
     * @param defaultValue The default value. If not provided, defaults to `''`.
     */
    string(defaultValue = "") {
      return { type: Type.String, default: defaultValue };
    },
    /**
     * Create an enumeration property.
     *
     * @param values The list of values.
     * @param defaultValue The default value. Can be a string or an index into
     *     `values`. If not provided, defaults to the first element.
     */
    enum(values, defaultValue) {
      return { type: Type.Enum, values, default: defaultValue };
    },
    /** Create an {@link Object3D} reference property. */
    object(opts) {
      return { type: Type.Object, default: null, required: opts?.required ?? false };
    },
    /** Create a {@link Mesh} reference property. */
    mesh(opts) {
      return { type: Type.Mesh, default: null, required: opts?.required ?? false };
    },
    /** Create a {@link Texture} reference property. */
    texture(opts) {
      return { type: Type.Texture, default: null, required: opts?.required ?? false };
    },
    /** Create a {@link Material} reference property. */
    material(opts) {
      return { type: Type.Material, default: null, required: opts?.required ?? false };
    },
    /** Create an {@link Animation} reference property. */
    animation(opts) {
      return { type: Type.Animation, default: null, required: opts?.required ?? false };
    },
    /** Create a {@link Skin} reference property. */
    skin(opts) {
      return { type: Type.Skin, default: null, required: opts?.required ?? false };
    },
    /**
     * Create a color property.
     *
     * @param r The red component, in the range [0; 1].
     * @param g The green component, in the range [0; 1].
     * @param b The blue component, in the range [0; 1].
     * @param a The alpha component, in the range [0; 1].
     */
    color(r = 0, g = 0, b = 0, a = 1) {
      return { type: Type.Color, default: [r, g, b, a] };
    },
    /**
     * Create a two-element vector property.
     *
     * @param x The x component.
     * @param y The y component.
     */
    vector2(x = 0, y = 0) {
      return { type: Type.Vector2, default: [x, y] };
    },
    /**
     * Create a three-element vector property.
     *
     * @param x The x component.
     * @param y The y component.
     * @param z The z component.
     */
    vector3(x = 0, y = 0, z = 0) {
      return { type: Type.Vector3, default: [x, y, z] };
    },
    /**
     * Create a four-element vector property.
     *
     * @param x The x component.
     * @param y The y component.
     * @param z The z component.
     * @param w The w component.
     */
    vector4(x = 0, y = 0, z = 0, w = 0) {
      return { type: Type.Vector4, default: [x, y, z, w] };
    }
  };

  // node_modules/@wonderlandengine/api/dist/decorators.js
  function propertyDecorator(data) {
    return function(target, propertyKey) {
      const ctor = target.constructor;
      ctor.Properties = ctor.hasOwnProperty("Properties") ? ctor.Properties : {};
      ctor.Properties[propertyKey] = data;
    };
  }
  function enumerable() {
    return function(_, __, descriptor) {
      descriptor.enumerable = true;
    };
  }
  function nativeProperty() {
    return function(target, propertyKey, descriptor) {
      enumerable()(target, propertyKey, descriptor);
      propertyDecorator({ type: Type.Native })(target, propertyKey);
    };
  }
  var property = {};
  for (const name in Property) {
    property[name] = (...args) => {
      const functor = Property[name];
      return propertyDecorator(functor(...args));
    };
  }

  // node_modules/@wonderlandengine/api/dist/utils/object.js
  function isNumber(value2) {
    if (value2 === null || value2 === void 0)
      return false;
    return typeof value2 === "number" || value2.constructor === Number;
  }
  function isImageLike(value2) {
    return value2 instanceof HTMLImageElement || value2 instanceof HTMLVideoElement || value2 instanceof HTMLCanvasElement;
  }

  // node_modules/@wonderlandengine/api/dist/utils/event.js
  var TransactionType;
  (function(TransactionType2) {
    TransactionType2[TransactionType2["Addition"] = 1] = "Addition";
    TransactionType2[TransactionType2["Removal"] = 2] = "Removal";
  })(TransactionType || (TransactionType = {}));
  var Emitter = class {
    /**
     * List of listeners to trigger when `notify` is called.
     *
     * @hidden
     */
    _listeners = [];
    /**
     * `true` if the emitter is currently notifying listeners. This
     * is used to defer addition and removal.
     *
     * @hidden
     */
    _notifying = false;
    /**
     * Pending additions / removals, performed during a notification.
     *
     * @hidden
     */
    _transactions = [];
    /**
     * Register a new listener to be triggered on {@link Emitter.notify}.
     *
     * Basic usage:
     *
     * ```js
     * emitter.add((data) => {
     *     console.log('event received!');
     *     console.log(data);
     * });
     * ```
     *
     * Automatically remove the listener when an event is received:
     *
     * ```js
     * emitter.add((data) => {
     *     console.log('event received!');
     *     console.log(data);
     * }, {once: true});
     * ```
     *
     * @param listener The callback to register.
     * @param opts The listener options. For more information, please have a look
     *     at the {@link ListenerOptions} interface.
     *
     * @returns Reference to self (for method chaining)
     */
    add(listener, opts = {}) {
      const { once = false, id = void 0 } = opts;
      const data = { id, once, callback: listener };
      if (this._notifying) {
        this._transactions.push({ type: TransactionType.Addition, data });
        return this;
      }
      this._listeners.push(data);
      return this;
    }
    /**
     * Equivalent to {@link Emitter.add}.
     *
     * @param listeners The callback(s) to register.
     * @returns Reference to self (for method chaining).
     *
     * @deprecated Please use {@link Emitter.add} instead.
     */
    push(...listeners) {
      for (const cb of listeners)
        this.add(cb);
      return this;
    }
    /**
     * Register a new listener to be triggered on {@link Emitter.notify}.
     *
     * Once notified, the listener will be automatically removed.
     *
     * The method is equivalent to calling {@link Emitter.add} with:
     *
     * ```js
     * emitter.add(listener, {once: true});
     * ```
     *
     * @param listener The callback to register.
     *
     * @returns Reference to self (for method chaining).
     */
    once(listener) {
      return this.add(listener, { once: true });
    }
    /**
     * Remove a registered listener.
     *
     * Usage with a callback:
     *
     * ```js
     * const listener = (data) => console.log(data);
     * emitter.add(listener);
     *
     * // Remove using the callback reference:
     * emitter.remove(listener);
     * ```
     *
     * Usage with an id:
     *
     * ```js
     * emitter.add((data) => console.log(data), {id: 'my-callback'});
     *
     * // Remove using the id:
     * emitter.remove('my-callback');
     * ```
     *
     * Using identifiers, you will need to ensure your value is unique to avoid
     * removing listeners from other libraries, e.g.,:
     *
     * ```js
     * emitter.add((data) => console.log(data), {id: 'non-unique'});
     * // This second listener could be added by a third-party library.
     * emitter.add((data) => console.log('Hello From Library!'), {id: 'non-unique'});
     *
     * // Ho Snap! This also removed the library listener!
     * emitter.remove('non-unique');
     * ```
     *
     * The identifier can be any type. However, remember that the comparison will be
     * by-value for primitive types (string, number), but by reference for objects.
     *
     * Example:
     *
     * ```js
     * emitter.add(() => console.log('Hello'), {id: {value: 42}});
     * emitter.add(() => console.log('World!'), {id: {value: 42}});
     * emitter.remove({value: 42}); // None of the above listeners match!
     * emitter.notify(); // Prints 'Hello' and 'World!'.
     * ```
     *
     * Here, both emitters have id `{value: 42}`, but the comparison is made by reference. Thus,
     * the `remove()` call has no effect. We can make it work by doing:
     *
     * ```js
     * const id = {value: 42};
     * emitter.add(() => console.log('Hello'), {id});
     * emitter.add(() => console.log('World!'), {id});
     * emitter.remove(id); // Same reference, it works!
     * emitter.notify(); // Doesn't print.
     * ```
     *
     * @param listener The registered callback or a value representing the `id`.
     *
     * @returns Reference to self (for method chaining)
     */
    remove(listener) {
      if (this._notifying) {
        this._transactions.push({ type: TransactionType.Removal, data: listener });
        return this;
      }
      const listeners = this._listeners;
      for (let i2 = 0; i2 < listeners.length; ++i2) {
        const target = listeners[i2];
        if (target.callback === listener || target.id === listener) {
          listeners.splice(i2--, 1);
        }
      }
      return this;
    }
    /**
     * Check whether the listener is registered.
     *
     * @note This method performs a linear search.
     *
     * * @note Doesn't account for pending listeners, i.e.,
     * listeners added / removed during a notification.
     *
     * @param listener The registered callback or a value representing the `id`.
     * @returns `true` if the handle is found, `false` otherwise.
     */
    has(listener) {
      const listeners = this._listeners;
      for (let i2 = 0; i2 < listeners.length; ++i2) {
        const target = listeners[i2];
        if (target.callback === listener || target.id === listener)
          return true;
      }
      return false;
    }
    /**
     * Notify listeners with the given data object.
     *
     * @note This method ensures all listeners are called even if
     * an exception is thrown. For (possibly) faster notification,
     * please use {@link Emitter.notifyUnsafe}.
     *
     * @param data The data to pass to listener when invoked.
     */
    notify(...data) {
      const listeners = this._listeners;
      this._notifying = true;
      for (let i2 = 0; i2 < listeners.length; ++i2) {
        const listener = listeners[i2];
        if (listener.once)
          listeners.splice(i2--, 1);
        try {
          listener.callback(...data);
        } catch (e) {
          console.error(e);
        }
      }
      this._notifying = false;
      this._flushTransactions();
    }
    /**
     * Notify listeners with the given data object.
     *
     * @note Because this method doesn't catch exceptions, some listeners
     * will be skipped on a throw. Please use {@link Emitter.notify} for safe
     * notification.
     *
     * @param data The data to pass to listener when invoked.
     */
    notifyUnsafe(...data) {
      const listeners = this._listeners;
      for (let i2 = 0; i2 < listeners.length; ++i2) {
        const listener = listeners[i2];
        if (listener.once)
          listeners.splice(i2--, 1);
        listener.callback(...data);
      }
      this._flushTransactions();
    }
    /**
     * Return a promise that will resolve on the next event.
     *
     * @note The promise might never resolve if no event is sent.
     *
     * @returns A promise that resolves with the data passed to
     *     {@link Emitter.notify}.
     */
    promise() {
      return new Promise((res, _) => {
        this.once((...args) => {
          if (args.length > 1) {
            res(args);
          } else {
            res(args[0]);
          }
        });
      });
    }
    /**
     * Number of listeners.
     *
     * @note Doesn't account for pending listeners, i.e.,
     * listeners added / removed during a notification.
     */
    get listenerCount() {
      return this._listeners.length;
    }
    /** `true` if it has no listeners, `false` otherwise. */
    get isEmpty() {
      return this.listenerCount === 0;
    }
    /**
     * Flush all pending transactions.
     *
     * @hidden
     */
    _flushTransactions() {
      const listeners = this._listeners;
      for (const transaction of this._transactions) {
        if (transaction.type === TransactionType.Addition) {
          listeners.push(transaction.data);
        } else {
          this.remove(transaction.data);
        }
      }
      this._transactions.length = 0;
    }
  };
  var RetainEmitterUndefined = {};
  var RetainEmitter = class extends Emitter {
    /** Pre-resolved data. @hidden */
    _event = RetainEmitterUndefined;
    /**
     * Emitter target used to reset the state of this emitter.
     *
     * @hidden
     */
    _reset;
    /** @override */
    add(listener, opts) {
      const immediate = opts?.immediate ?? true;
      if (this._event !== RetainEmitterUndefined && immediate) {
        listener(...this._event);
      }
      super.add(listener, opts);
      return this;
    }
    /**
     * @override
     *
     * @param listener The callback to register.
     * @param immediate If `true`, directly resolves if the emitter retains a value.
     *
     * @returns Reference to self (for method chaining).
     */
    once(listener, immediate) {
      return this.add(listener, { once: true, immediate });
    }
    /** @override */
    notify(...data) {
      this._event = data;
      super.notify(...data);
    }
    /** @override */
    notifyUnsafe(...data) {
      this._event = data;
      super.notifyUnsafe(...data);
    }
    /**
     * Reset the state of the emitter.
     *
     * Further call to {@link Emitter.add} will not automatically resolve,
     * until a new call to {@link Emitter.notify} is performed.
     *
     * @returns Reference to self (for method chaining)
     */
    reset() {
      this._event = RetainEmitterUndefined;
      return this;
    }
    /** Returns the retained data, or `undefined` if no data was retained. */
    get data() {
      return this.isDataRetained ? this._event : void 0;
    }
    /** `true` if data is retained from the last event, `false` otherwise. */
    get isDataRetained() {
      return this._event !== RetainEmitterUndefined;
    }
  };

  // node_modules/@wonderlandengine/api/dist/resources/resource.js
  var Resource = class {
    /** Relative index in the host. @hidden */
    _index = -1;
    /** For compatibility with SceneResource. @hidden */
    _id = -1;
    /** @hidden */
    _engine;
    constructor(engine, index) {
      this._engine = engine;
      this._index = index;
      this._id = index;
    }
    /** Hosting engine instance. */
    get engine() {
      return this._engine;
    }
    /** Index of this resource in the {@link Scene}'s manager. */
    get index() {
      return this._index;
    }
    /**
     * Checks equality by comparing ids and **not** the JavaScript reference.
     *
     * @deprecated Use JavaScript reference comparison instead:
     *
     * ```js
     * const meshA = engine.meshes.create({vertexCount: 1});
     * const meshB = engine.meshes.create({vertexCount: 1});
     * const meshC = meshB;
     * console.log(meshA === meshB); // false
     * console.log(meshA === meshA); // true
     * console.log(meshB === meshC); // true
     * ```
     */
    equals(other) {
      if (!other)
        return false;
      return this._index === other._index;
    }
    /**
     * `true` if the object is destroyed, `false` otherwise.
     *
     * If {@link WonderlandEngine.erasePrototypeOnDestroy} is `true`,
     * reading a class attribute / method will throw.
     */
    get isDestroyed() {
      return this._index <= 0;
    }
  };

  // node_modules/@wonderlandengine/api/dist/utils/misc.js
  function createDestroyedProxy(type) {
    return new Proxy({}, {
      get(_, param) {
        if (param === "isDestroyed")
          return true;
        throw new Error(`Cannot read '${param}' of destroyed ${type}`);
      },
      set(_, param) {
        throw new Error(`Cannot write '${param}' of destroyed ${type}`);
      }
    });
  }

  // node_modules/@wonderlandengine/api/dist/wonderland.js
  var __decorate = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i2 = decorators.length - 1; i2 >= 0; i2--)
        if (d = decorators[i2])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var LogTag;
  (function(LogTag2) {
    LogTag2[LogTag2["Engine"] = 0] = "Engine";
    LogTag2[LogTag2["Scene"] = 1] = "Scene";
    LogTag2[LogTag2["Component"] = 2] = "Component";
  })(LogTag || (LogTag = {}));
  var Collider;
  (function(Collider2) {
    Collider2[Collider2["Sphere"] = 0] = "Sphere";
    Collider2[Collider2["AxisAlignedBox"] = 1] = "AxisAlignedBox";
    Collider2[Collider2["Box"] = 2] = "Box";
  })(Collider || (Collider = {}));
  var Alignment;
  (function(Alignment2) {
    Alignment2[Alignment2["Left"] = 0] = "Left";
    Alignment2[Alignment2["Center"] = 1] = "Center";
    Alignment2[Alignment2["Right"] = 2] = "Right";
  })(Alignment || (Alignment = {}));
  var VerticalAlignment;
  (function(VerticalAlignment2) {
    VerticalAlignment2[VerticalAlignment2["Line"] = 0] = "Line";
    VerticalAlignment2[VerticalAlignment2["Middle"] = 1] = "Middle";
    VerticalAlignment2[VerticalAlignment2["Top"] = 2] = "Top";
    VerticalAlignment2[VerticalAlignment2["Bottom"] = 3] = "Bottom";
  })(VerticalAlignment || (VerticalAlignment = {}));
  var TextEffect;
  (function(TextEffect2) {
    TextEffect2[TextEffect2["None"] = 0] = "None";
    TextEffect2[TextEffect2["Outline"] = 1] = "Outline";
  })(TextEffect || (TextEffect = {}));
  var TextWrapMode;
  (function(TextWrapMode2) {
    TextWrapMode2[TextWrapMode2["None"] = 0] = "None";
    TextWrapMode2[TextWrapMode2["Soft"] = 1] = "Soft";
    TextWrapMode2[TextWrapMode2["Hard"] = 2] = "Hard";
    TextWrapMode2[TextWrapMode2["Clip"] = 3] = "Clip";
  })(TextWrapMode || (TextWrapMode = {}));
  var InputType;
  (function(InputType2) {
    InputType2[InputType2["Head"] = 0] = "Head";
    InputType2[InputType2["EyeLeft"] = 1] = "EyeLeft";
    InputType2[InputType2["EyeRight"] = 2] = "EyeRight";
    InputType2[InputType2["ControllerLeft"] = 3] = "ControllerLeft";
    InputType2[InputType2["ControllerRight"] = 4] = "ControllerRight";
    InputType2[InputType2["RayLeft"] = 5] = "RayLeft";
    InputType2[InputType2["RayRight"] = 6] = "RayRight";
  })(InputType || (InputType = {}));
  var LightType;
  (function(LightType2) {
    LightType2[LightType2["Point"] = 0] = "Point";
    LightType2[LightType2["Spot"] = 1] = "Spot";
    LightType2[LightType2["Sun"] = 2] = "Sun";
  })(LightType || (LightType = {}));
  var AnimationState;
  (function(AnimationState2) {
    AnimationState2[AnimationState2["Playing"] = 0] = "Playing";
    AnimationState2[AnimationState2["Paused"] = 1] = "Paused";
    AnimationState2[AnimationState2["Stopped"] = 2] = "Stopped";
  })(AnimationState || (AnimationState = {}));
  var ForceMode;
  (function(ForceMode2) {
    ForceMode2[ForceMode2["Force"] = 0] = "Force";
    ForceMode2[ForceMode2["Impulse"] = 1] = "Impulse";
    ForceMode2[ForceMode2["VelocityChange"] = 2] = "VelocityChange";
    ForceMode2[ForceMode2["Acceleration"] = 3] = "Acceleration";
  })(ForceMode || (ForceMode = {}));
  var CollisionEventType;
  (function(CollisionEventType2) {
    CollisionEventType2[CollisionEventType2["Touch"] = 0] = "Touch";
    CollisionEventType2[CollisionEventType2["TouchLost"] = 1] = "TouchLost";
    CollisionEventType2[CollisionEventType2["TriggerTouch"] = 2] = "TriggerTouch";
    CollisionEventType2[CollisionEventType2["TriggerTouchLost"] = 3] = "TriggerTouchLost";
  })(CollisionEventType || (CollisionEventType = {}));
  var Shape;
  (function(Shape2) {
    Shape2[Shape2["None"] = 0] = "None";
    Shape2[Shape2["Sphere"] = 1] = "Sphere";
    Shape2[Shape2["Capsule"] = 2] = "Capsule";
    Shape2[Shape2["Box"] = 3] = "Box";
    Shape2[Shape2["Plane"] = 4] = "Plane";
    Shape2[Shape2["ConvexMesh"] = 5] = "ConvexMesh";
    Shape2[Shape2["TriangleMesh"] = 6] = "TriangleMesh";
  })(Shape || (Shape = {}));
  var MeshAttribute;
  (function(MeshAttribute2) {
    MeshAttribute2[MeshAttribute2["Position"] = 0] = "Position";
    MeshAttribute2[MeshAttribute2["Tangent"] = 1] = "Tangent";
    MeshAttribute2[MeshAttribute2["Normal"] = 2] = "Normal";
    MeshAttribute2[MeshAttribute2["TextureCoordinate"] = 3] = "TextureCoordinate";
    MeshAttribute2[MeshAttribute2["Color"] = 4] = "Color";
    MeshAttribute2[MeshAttribute2["JointId"] = 5] = "JointId";
    MeshAttribute2[MeshAttribute2["JointWeight"] = 6] = "JointWeight";
  })(MeshAttribute || (MeshAttribute = {}));
  var DestroyedObjectInstance = createDestroyedProxy("object");
  var DestroyedComponentInstance = createDestroyedProxy("component");
  var DestroyedPrefabInstance = createDestroyedProxy("prefab/scene");
  function isMeshShape(shape) {
    return shape === Shape.ConvexMesh || shape === Shape.TriangleMesh;
  }
  function isBaseComponentClass(value2) {
    return !!value2 && value2.hasOwnProperty("_isBaseComponent") && value2._isBaseComponent;
  }
  var SQRT_3 = Math.sqrt(3);
  var _Component = class {
    /**
     * Pack scene index and component id.
     *
     * @param scene Scene index.
     * @param id Component id.
     * @returns The packed id.
     *
     * @hidden
     */
    static _pack(scene, id) {
      return scene << 22 | id;
    }
    /**
     * Allows to inherit properties directly inside the editor.
     *
     * @note Do not use directly, prefer using {@link inheritProperties}.
     *
     * @hidden
     */
    static _inheritProperties() {
      inheritProperties(this);
    }
    /** Manager index. @hidden */
    _manager;
    /** Packed id, containing the scene and the local id. @hidden */
    _id;
    /** Id relative to the scene component's manager. @hidden */
    _localId;
    /**
     * Object containing this object.
     *
     * **Note**: This is cached for faster retrieval.
     *
     * @hidden
     */
    _object;
    /** Scene instance. @hidden */
    _scene;
    /**
     * Create a new instance
     *
     * @param engine The engine instance.
     * @param manager Index of the manager.
     * @param id WASM component instance index.
     *
     * @hidden
     */
    constructor(scene, manager = -1, id = -1) {
      this._scene = scene;
      this._manager = manager;
      this._localId = id;
      this._id = _Component._pack(scene._index, id);
      this._object = null;
    }
    /** Scene this component is part of. */
    get scene() {
      return this._scene;
    }
    /** Hosting engine instance. */
    get engine() {
      return this._scene.engine;
    }
    /** The name of this component's type */
    get type() {
      const ctor = this.constructor;
      return ctor.TypeName;
    }
    /** The object this component is attached to. */
    get object() {
      if (!this._object) {
        const objectId = this.engine.wasm._wl_component_get_object(this._manager, this._id);
        this._object = this._scene.wrap(objectId);
      }
      return this._object;
    }
    /**
     * Set whether this component is active.
     *
     * Activating/deactivating a component comes at a small cost of reordering
     * components in the respective component manager. This function therefore
     * is not a trivial assignment.
     *
     * Does nothing if the component is already activated/deactivated.
     *
     * @param active New active state.
     */
    set active(active) {
      this.engine.wasm._wl_component_setActive(this._manager, this._id, active);
    }
    /** `true` if the component is marked as active and its scene is active. */
    get active() {
      return this.markedActive && this._scene.isActive;
    }
    /**
     * `true` if the component is marked as active in the scene, `false` otherwise.
     *
     * @note At the opposite of {@link Component.active}, this accessor doesn't
     * take into account whether the scene is active or not.
     */
    get markedActive() {
      return this.engine.wasm._wl_component_isActive(this._manager, this._id) != 0;
    }
    /**
     * Copy all the properties from `src` into this instance.
     *
     * @note Only properties are copied. If a component needs to
     * copy extra data, it needs to override this method.
     *
     * #### Example
     *
     * ```js
     * class MyComponent extends Component {
     *     nonPropertyData = 'Hello World';
     *
     *     copy(src) {
     *         super.copy(src);
     *         this.nonPropertyData = src.nonPropertyData;
     *         return this;
     *     }
     * }
     * ```
     *
     * @note This method is called by {@link Object3D.clone}. Do not attempt to:
     *     - Create new component
     *     - Read references to other objects
     *
     * When cloning via {@link Object3D.clone}, this method will be called before
     * {@link Component.start}.
     *
     * @note JavaScript component properties aren't retargeted. Thus, references
     * inside the source object will not be retargeted to the destination object,
     * at the exception of the skin data on {@link MeshComponent} and {@link AnimationComponent}.
     *
     * @param src The source component to copy from.
     *
     * @returns Reference to self (for method chaining).
     */
    copy(src) {
      const ctor = this.constructor;
      const properties = ctor.Properties;
      if (!properties)
        return this;
      for (const name in properties) {
        const property2 = properties[name];
        const value2 = src[name];
        if (value2 === void 0)
          continue;
        const cloner = property2.cloner ?? defaultPropertyCloner;
        this[name] = cloner.clone(property2.type, value2);
      }
      return this;
    }
    /**
     * Remove this component from its objects and destroy it.
     *
     * It is best practice to set the component to `null` after,
     * to ensure it does not get used later.
     *
     * ```js
     *    c.destroy();
     *    c = null;
     * ```
     * @since 0.9.0
     */
    destroy() {
      const manager = this._manager;
      if (manager < 0 || this._id < 0)
        return;
      this.engine.wasm._wl_component_remove(manager, this._id);
    }
    /**
     * Checks equality by comparing ids and **not** the JavaScript reference.
     *
     * @deprecate Use JavaScript reference comparison instead:
     *
     * ```js
     * const componentA = obj.addComponent('mesh');
     * const componentB = obj.addComponent('mesh');
     * const componentC = componentB;
     * console.log(componentA === componentB); // false
     * console.log(componentA === componentA); // true
     * console.log(componentB === componentC); // true
     * ```
     */
    equals(otherComponent) {
      if (!otherComponent)
        return false;
      return this._manager === otherComponent._manager && this._id === otherComponent._id;
    }
    /**
     * Reset the component properties to default.
     *
     * @note This is automatically called during the component instantiation.
     *
     * @returns Reference to self (for method chaining).
     */
    resetProperties() {
      const ctor = this.constructor;
      const properties = ctor.Properties;
      if (!properties)
        return this;
      for (const name in properties) {
        const property2 = properties[name];
        const cloner = property2.cloner ?? defaultPropertyCloner;
        this[name] = cloner.clone(property2.type, property2.default);
      }
      return this;
    }
    /** @deprecated Use {@link Component.resetProperties} instead. */
    reset() {
      return this.resetProperties();
    }
    /**
     * Validate the properties on this instance.
     *
     * @throws If any of the required properties isn't initialized
     * on this instance.
     */
    validateProperties() {
      const ctor = this.constructor;
      if (!ctor.Properties)
        return;
      for (const name in ctor.Properties) {
        if (!ctor.Properties[name].required)
          continue;
        if (!this[name]) {
          throw new Error(`Property '${name}' is required but was not initialized`);
        }
      }
    }
    toString() {
      if (this.isDestroyed) {
        return "Component(destroyed)";
      }
      return `Component('${this.type}', ${this._localId})`;
    }
    /**
     * `true` if the component is destroyed, `false` otherwise.
     *
     * If {@link WonderlandEngine.erasePrototypeOnDestroy} is `true`,
     * reading a custom property will not work:
     *
     * ```js
     * engine.erasePrototypeOnDestroy = true;
     *
     * const comp = obj.addComponent('mesh');
     * comp.customParam = 'Hello World!';
     *
     * console.log(comp.isDestroyed); // Prints `false`
     * comp.destroy();
     * console.log(comp.isDestroyed); // Prints `true`
     * console.log(comp.customParam); // Throws an error
     * ```
     *
     * @since 1.1.1
     */
    get isDestroyed() {
      return this._id < 0;
    }
    /** @hidden */
    _copy(src, offsetsPtr) {
      const wasm = this.engine.wasm;
      const offsets = wasm.HEAPU32;
      const offsetsStart = offsetsPtr >>> 2;
      const destScene = this._scene;
      const ctor = this.constructor;
      for (const name in ctor.Properties) {
        const value2 = src[name];
        if (value2 === null) {
          this[name] = null;
          continue;
        }
        const prop = ctor.Properties[name];
        const offset2 = offsets[offsetsStart + prop.type];
        let retargeted;
        switch (prop.type) {
          case Type.Object: {
            const index = wasm._wl_object_index(value2._id);
            const id = wasm._wl_object_id(destScene._index, index + offset2);
            retargeted = destScene.wrap(id);
            break;
          }
          case Type.Animation:
            retargeted = destScene.animations.wrap(offset2 + value2._index);
            break;
          case Type.Skin:
            retargeted = destScene.skins.wrap(offset2 + value2._index);
            break;
          default:
            const cloner = prop.cloner ?? defaultPropertyCloner;
            retargeted = cloner.clone(prop.type, value2);
            break;
        }
        this[name] = retargeted;
      }
      return this;
    }
    /**
     * Trigger the component {@link Component.init} method.
     *
     * @note Use this method instead of directly calling {@link Component.init},
     * because this method creates an handler for the {@link Component.start}.
     *
     * @note This api is meant to be used internally.
     *
     * @hidden
     */
    _triggerInit() {
      if (this.init) {
        try {
          this.init();
        } catch (e) {
          this.engine.log.error(LogTag.Component, `Exception during ${this.type} init() on object ${this.object.name}`);
          this.engine.log.error(LogTag.Component, e);
        }
      }
      const oldActivate = this.onActivate;
      this.onActivate = function() {
        this.onActivate = oldActivate;
        let failed = false;
        try {
          this.validateProperties();
        } catch (e) {
          this.engine.log.error(LogTag.Component, `Exception during ${this.type} validateProperties() on object ${this.object.name}`);
          this.engine.log.error(LogTag.Component, e);
          failed = true;
        }
        try {
          this.start?.();
        } catch (e) {
          this.engine.log.error(LogTag.Component, `Exception during ${this.type} start() on object ${this.object.name}`);
          this.engine.log.error(LogTag.Component, e);
          failed = true;
        }
        if (failed) {
          this.active = false;
          return;
        }
        if (!this.onActivate)
          return;
        try {
          this.onActivate();
        } catch (e) {
          this.engine.log.error(LogTag.Component, `Exception during ${this.type} onActivate() on object ${this.object.name}`);
          this.engine.log.error(LogTag.Component, e);
        }
      };
    }
    /**
     * Trigger the component {@link Component.update} method.
     *
     * @note This api is meant to be used internally.
     *
     * @hidden
     */
    _triggerUpdate(dt) {
      if (!this.update)
        return;
      try {
        this.update(dt);
      } catch (e) {
        this.engine.log.error(LogTag.Component, `Exception during ${this.type} update() on object ${this.object.name}`);
        this.engine.log.error(LogTag.Component, e);
        if (this.engine.wasm._deactivate_component_on_error) {
          this.active = false;
        }
      }
    }
    /**
     * Trigger the component {@link Component.onActivate} method.
     *
     * @note This api is meant to be used internally.
     *
     * @hidden
     */
    _triggerOnActivate() {
      if (!this.onActivate)
        return;
      try {
        this.onActivate();
      } catch (e) {
        this.engine.log.error(LogTag.Component, `Exception during ${this.type} onActivate() on object ${this.object.name}`);
        this.engine.log.error(LogTag.Component, e);
      }
    }
    /**
     * Trigger the component {@link Component.onDeactivate} method.
     *
     * @note This api is meant to be used internally.
     *
     * @hidden
     */
    _triggerOnDeactivate() {
      if (!this.onDeactivate)
        return;
      try {
        this.onDeactivate();
      } catch (e) {
        this.engine.log.error(LogTag.Component, `Exception during ${this.type} onDeactivate() on object ${this.object.name}`);
        this.engine.log.error(LogTag.Component, e);
      }
    }
    /**
     * Trigger the component {@link Component.onDestroy} method.
     *
     * @note This api is meant to be used internally.
     *
     * @hidden
     */
    _triggerOnDestroy() {
      try {
        if (this.onDestroy)
          this.onDestroy();
      } catch (e) {
        this.engine.log.error(LogTag.Component, `Exception during ${this.type} onDestroy() on object ${this.object.name}`);
        this.engine.log.error(LogTag.Component, e);
      }
      this._scene._components.destroy(this);
    }
  };
  var Component = _Component;
  /**
   * `true` for every class inheriting from this class.
   *
   * @note This is a workaround for `instanceof` to prevent issues
   * that could arise when an application ends up using multiple API versions.
   *
   * @hidden
   */
  __publicField(Component, "_isBaseComponent", true);
  /**
   * Fixed order of attributes in the `Properties` array.
   *
   * @note This is used for parameter deserialization and is filled during
   * component registration.
   *
   * @hidden
   */
  __publicField(Component, "_propertyOrder", []);
  /**
   * Unique identifier for this component class.
   *
   * This is used to register, add, and retrieve components of a given type.
   */
  __publicField(Component, "TypeName");
  /**
   * Properties of this component class.
   *
   * Properties are public attributes that can be configured via the
   * Wonderland Editor.
   *
   * Example:
   *
   * ```js
   * import { Component, Type } from '@wonderlandengine/api';
   * class MyComponent extends Component {
   *     static TypeName = 'my-component';
   *     static Properties = {
   *         myBoolean: { type: Type.Boolean, default: false },
   *         myFloat: { type: Type.Float, default: false },
   *         myTexture: { type: Type.Texture, default: null },
   *     };
   * }
   * ```
   *
   * Properties are automatically added to each component instance, and are
   * accessible like any JS attribute:
   *
   * ```js
   * // Creates a new component and set each properties value:
   * const myComponent = object.addComponent(MyComponent, {
   *     myBoolean: true,
   *     myFloat: 42.0,
   *     myTexture: null
   * });
   *
   * // You can also override the properties on the instance:
   * myComponent.myBoolean = false;
   * myComponent.myFloat = -42.0;
   * ```
   *
   * #### References
   *
   * Reference types (i.e., mesh, object, etc...) can also be listed as **required**:
   *
   * ```js
   * import {Component, Property} from '@wonderlandengine/api';
   *
   * class MyComponent extends Component {
   *     static Properties = {
   *         myObject: Property.object({required: true}),
   *         myAnimation: Property.animation({required: true}),
   *         myTexture: Property.texture({required: true}),
   *         myMesh: Property.mesh({required: true}),
   *     }
   * }
   * ```
   *
   * Please note that references are validated **once** before the call to {@link Component.start} only,
   * via the {@link Component.validateProperties} method.
   */
  __publicField(Component, "Properties");
  /**
   * When set to `true`, the child class inherits from the parent
   * properties, as shown in the following example:
   *
   * ```js
   * import {Component, Property} from '@wonderlandengine/api';
   *
   * class Parent extends Component {
   *     static TypeName = 'parent';
   *     static Properties = {parentName: Property.string('parent')}
   * }
   *
   * class Child extends Parent {
   *     static TypeName = 'child';
   *     static Properties = {name: Property.string('child')}
   *     static InheritProperties = true;
   *
   *     start() {
   *         // Works because `InheritProperties` is `true`.
   *         console.log(`${this.name} inherits from ${this.parentName}`);
   *     }
   * }
   * ```
   *
   * @note Properties defined in descendant classes will override properties
   * with the same name defined in ancestor classes.
   *
   * Defaults to `true`.
   */
  __publicField(Component, "InheritProperties");
  /**
   * Called when this component class is registered.
   *
   * @example
   *
   * This callback can be used to register dependencies of a component,
   * e.g., component classes that need to be registered in order to add
   * them at runtime with {@link Object3D.addComponent}, independent of whether
   * they are used in the editor.
   *
   * ```js
   * class Spawner extends Component {
   *     static TypeName = 'spawner';
   *
   *     static onRegister(engine) {
   *         engine.registerComponent(SpawnedComponent);
   *     }
   *
   *     // You can now use addComponent with SpawnedComponent
   * }
   * ```
   *
   * @example
   *
   * This callback can be used to register different implementations of a
   * component depending on client features or API versions.
   *
   * ```js
   * // Properties need to be the same for all implementations!
   * const SharedProperties = {};
   *
   * class Anchor extends Component {
   *     static TypeName = 'spawner';
   *     static Properties = SharedProperties;
   *
   *     static onRegister(engine) {
   *         if(navigator.xr === undefined) {
   *             /* WebXR unsupported, keep this dummy component *\/
   *             return;
   *         }
   *         /* WebXR supported! Override already registered dummy implementation
   *          * with one depending on hit-test API support *\/
   *         engine.registerComponent(window.HitTestSource === undefined ?
   *             AnchorWithoutHitTest : AnchorWithHitTest);
   *     }
   *
   *     // This one implements no functions
   * }
   * ```
   */
  __publicField(Component, "onRegister");
  var BrokenComponent = class extends Component {
  };
  __publicField(BrokenComponent, "TypeName", "__broken-component__");
  function inheritProperties(target) {
    if (!target.TypeName)
      return;
    const chain = [];
    let curr = target;
    while (curr && !isBaseComponentClass(curr)) {
      const comp = curr;
      const needsMerge = comp.hasOwnProperty("InheritProperties") ? comp.InheritProperties : true;
      if (!needsMerge)
        break;
      if (comp.TypeName && comp.hasOwnProperty("Properties")) {
        chain.push(comp);
      }
      curr = Object.getPrototypeOf(curr);
    }
    if (!chain.length || chain.length === 1 && chain[0] === target) {
      return;
    }
    const merged = {};
    for (let i2 = chain.length - 1; i2 >= 0; --i2) {
      Object.assign(merged, chain[i2].Properties);
    }
    target.Properties = merged;
  }
  var CollisionComponent = class extends Component {
    getExtents(out = new Float32Array(3)) {
      const wasm = this.engine.wasm;
      const ptr = wasm._wl_collision_component_get_extents(this._id) / 4;
      out[0] = wasm.HEAPF32[ptr];
      out[1] = wasm.HEAPF32[ptr + 1];
      out[2] = wasm.HEAPF32[ptr + 2];
      return out;
    }
    /** Collision component collider */
    get collider() {
      return this.engine.wasm._wl_collision_component_get_collider(this._id);
    }
    /**
     * Set collision component collider.
     *
     * @param collider Collider of the collision component.
     */
    set collider(collider) {
      this.engine.wasm._wl_collision_component_set_collider(this._id, collider);
    }
    /**
     * Equivalent to {@link CollisionComponent.getExtents}.
     *
     * @note Prefer to use {@link CollisionComponent.getExtents} for performance.
     */
    get extents() {
      const wasm = this.engine.wasm;
      return new Float32Array(wasm.HEAPF32.buffer, wasm._wl_collision_component_get_extents(this._id), 3);
    }
    /**
     * Set collision component extents.
     *
     * If {@link collider} returns {@link Collider.Sphere}, only the first
     * component of the passed vector is used.
     *
     * Example:
     *
     * ```js
     * // Spans 1 unit on the x-axis, 2 on the y-axis, 3 on the z-axis.
     * collision.extent = [1, 2, 3];
     * ```
     *
     * @param extents Extents of the collision component, expects a
     *      3 component array.
     */
    set extents(extents) {
      const wasm = this.engine.wasm;
      const ptr = wasm._wl_collision_component_get_extents(this._id) / 4;
      wasm.HEAPF32[ptr] = extents[0];
      wasm.HEAPF32[ptr + 1] = extents[1];
      wasm.HEAPF32[ptr + 2] = extents[2];
    }
    /**
     * Get collision component radius.
     *
     * @note If {@link collider} is not {@link Collider.Sphere}, the returned value
     * corresponds to the radius of a sphere enclosing the shape.
     *
     * Example:
     *
     * ```js
     * sphere.radius = 3.0;
     * console.log(sphere.radius); // 3.0
     *
     * box.extents = [2.0, 2.0, 2.0];
     * console.log(box.radius); // 1.732...
     * ```
     *
     */
    get radius() {
      const wasm = this.engine.wasm;
      if (this.collider === Collider.Sphere)
        return wasm.HEAPF32[wasm._wl_collision_component_get_extents(this._id) >> 2];
      const extents = new Float32Array(wasm.HEAPF32.buffer, wasm._wl_collision_component_get_extents(this._id), 3);
      const x2 = extents[0] * extents[0];
      const y2 = extents[1] * extents[1];
      const z2 = extents[2] * extents[2];
      return Math.sqrt(x2 + y2 + z2) / 2;
    }
    /**
     * Set collision component radius.
     *
     * @param radius Radius of the collision component
     *
     * @note If {@link collider} is not {@link Collider.Sphere},
     * the extents are set to form a square that fits a sphere with the provided radius.
     *
     * Example:
     *
     * ```js
     * aabbCollision.radius = 2.0; // AABB fits a sphere of radius 2.0
     * boxCollision.radius = 3.0; // Box now fits a sphere of radius 3.0, keeping orientation
     * ```
     *
     */
    set radius(radius) {
      const length6 = this.collider === Collider.Sphere ? radius : 2 * radius / SQRT_3;
      this.extents.set([length6, length6, length6]);
    }
    /**
     * Collision component group.
     *
     * The groups is a bitmask that is compared to other components in {@link CollisionComponent#queryOverlaps}
     * or the group in {@link Scene#rayCast}.
     *
     * Colliders that have no common groups will not overlap with each other. If a collider
     * has none of the groups set for {@link Scene#rayCast}, the ray will not hit it.
     *
     * Each bit represents belonging to a group, see example.
     *
     * ```js
     *    // c belongs to group 2
     *    c.group = (1 << 2);
     *
     *    // c belongs to group 0
     *    c.group = (1 << 0);
     *
     *    // c belongs to group 0 *and* 2
     *    c.group = (1 << 0) | (1 << 2);
     *
     *    (c.group & (1 << 2)) != 0; // true
     *    (c.group & (1 << 7)) != 0; // false
     * ```
     */
    get group() {
      return this.engine.wasm._wl_collision_component_get_group(this._id);
    }
    /**
     * Set collision component group.
     *
     * @param group Group mask of the collision component.
     */
    set group(group) {
      this.engine.wasm._wl_collision_component_set_group(this._id, group);
    }
    /**
     * Query overlapping objects.
     *
     * Usage:
     *
     * ```js
     * const collision = object.getComponent('collision');
     * const overlaps = collision.queryOverlaps();
     * for(const otherCollision of overlaps) {
     *     const otherObject = otherCollision.object;
     *     console.log(`Collision with object ${otherObject.objectId}`);
     * }
     * ```
     *
     * @returns Collision components overlapping this collider.
     */
    queryOverlaps() {
      const count = this.engine.wasm._wl_collision_component_query_overlaps(this._id, this.engine.wasm._tempMem, this.engine.wasm._tempMemSize >> 1);
      const overlaps = new Array(count);
      for (let i2 = 0; i2 < count; ++i2) {
        const id = this.engine.wasm._tempMemUint16[i2];
        overlaps[i2] = this._scene._components.wrapCollision(id);
      }
      return overlaps;
    }
  };
  /** @override */
  __publicField(CollisionComponent, "TypeName", "collision");
  __decorate([
    nativeProperty()
  ], CollisionComponent.prototype, "collider", null);
  __decorate([
    nativeProperty()
  ], CollisionComponent.prototype, "extents", null);
  __decorate([
    nativeProperty()
  ], CollisionComponent.prototype, "group", null);
  var TextComponent = class extends Component {
    /** Text component alignment. */
    get alignment() {
      return this.engine.wasm._wl_text_component_get_horizontal_alignment(this._id);
    }
    /**
     * Set text component alignment.
     *
     * @param alignment Alignment for the text component.
     */
    set alignment(alignment) {
      this.engine.wasm._wl_text_component_set_horizontal_alignment(this._id, alignment);
    }
    /**
     * Text component vertical alignment.
     * @since 1.2.0
     */
    get verticalAlignment() {
      return this.engine.wasm._wl_text_component_get_vertical_alignment(this._id);
    }
    /**
     * Set text component vertical alignment.
     *
     * @param verticalAlignment Vertical for the text component.
     * @since 1.2.0
     */
    set verticalAlignment(verticalAlignment) {
      this.engine.wasm._wl_text_component_set_vertical_alignment(this._id, verticalAlignment);
    }
    /**
     * Text component justification.
     *
     * @deprecated Please use {@link TextComponent.verticalAlignment} instead.
     */
    get justification() {
      return this.verticalAlignment;
    }
    /**
     * Set text component justification.
     *
     * @param justification Justification for the text component.
     *
     * @deprecated Please use {@link TextComponent.verticalAlignment} instead.
     */
    set justification(justification) {
      this.verticalAlignment = justification;
    }
    /** Text component character spacing. */
    get characterSpacing() {
      return this.engine.wasm._wl_text_component_get_character_spacing(this._id);
    }
    /**
     * Set text component character spacing.
     *
     * @param spacing Character spacing for the text component.
     */
    set characterSpacing(spacing) {
      this.engine.wasm._wl_text_component_set_character_spacing(this._id, spacing);
    }
    /** Text component line spacing. */
    get lineSpacing() {
      return this.engine.wasm._wl_text_component_get_line_spacing(this._id);
    }
    /**
     * Set text component line spacing
     *
     * @param spacing Line spacing for the text component
     */
    set lineSpacing(spacing) {
      this.engine.wasm._wl_text_component_set_line_spacing(this._id, spacing);
    }
    /** Text component effect. */
    get effect() {
      return this.engine.wasm._wl_text_component_get_effect(this._id);
    }
    /**
     * Set text component effect
     *
     * @param effect Effect for the text component
     */
    set effect(effect) {
      this.engine.wasm._wl_text_component_set_effect(this._id, effect);
    }
    /**
     * Text component line wrap mode.
     * @since 1.2.1
     */
    get wrapMode() {
      return this.engine.wasm._wl_text_component_get_wrapMode(this._id);
    }
    /**
     * Set text component line wrap mode.
     *
     * @param wrapMode Line wrap mode for the text component.
     * @since 1.2.1
     */
    set wrapMode(wrapMode) {
      this.engine.wasm._wl_text_component_set_wrapMode(this._id, wrapMode);
    }
    /**
     * Text component line wrap width.
     * @since 1.2.1
     */
    get wrapWidth() {
      return this.engine.wasm._wl_text_component_get_wrapWidth(this._id);
    }
    /**
     * Set text component line wrap width.
     *
     * Only takes effect when {@link wrapMode} is something other than
     * {@link TextWrapMode.None}.
     *
     * @param width Line wrap width for the text component.
     * @since 1.2.1
     */
    set wrapWidth(width) {
      this.engine.wasm._wl_text_component_set_wrapWidth(this._id, width);
    }
    /** Text component text. */
    get text() {
      const wasm = this.engine.wasm;
      const ptr = wasm._wl_text_component_get_text(this._id);
      return wasm.UTF8ToString(ptr);
    }
    /**
     * Set text component text.
     *
     * @param text Text of the text component.
     */
    set text(text) {
      const wasm = this.engine.wasm;
      wasm._wl_text_component_set_text(this._id, wasm.tempUTF8(text.toString()));
    }
    /**
     * Set material to render the text with.
     *
     * @param material New material.
     */
    set material(material) {
      const matIndex = material ? material._id : 0;
      this.engine.wasm._wl_text_component_set_material(this._id, matIndex);
    }
    /** Material used to render the text. */
    get material() {
      const index = this.engine.wasm._wl_text_component_get_material(this._id);
      return this.engine.materials.wrap(index);
    }
    /** @overload */
    getBoundingBoxForText(text, out = new Float32Array(4)) {
      const wasm = this.engine.wasm;
      const textPtr = wasm.tempUTF8(text, 4 * 4);
      this.engine.wasm._wl_text_component_get_boundingBox(this._id, textPtr, wasm._tempMem);
      out[0] = wasm._tempMemFloat[0];
      out[1] = wasm._tempMemFloat[1];
      out[2] = wasm._tempMemFloat[2];
      out[3] = wasm._tempMemFloat[3];
      return out;
    }
    /** @overload */
    getBoundingBox(out = new Float32Array(4)) {
      const wasm = this.engine.wasm;
      this.engine.wasm._wl_text_component_get_boundingBox(this._id, 0, wasm._tempMem);
      out[0] = wasm._tempMemFloat[0];
      out[1] = wasm._tempMemFloat[1];
      out[2] = wasm._tempMemFloat[2];
      out[3] = wasm._tempMemFloat[3];
      return out;
    }
  };
  /** @override */
  __publicField(TextComponent, "TypeName", "text");
  __decorate([
    nativeProperty()
  ], TextComponent.prototype, "alignment", null);
  __decorate([
    nativeProperty()
  ], TextComponent.prototype, "verticalAlignment", null);
  __decorate([
    nativeProperty()
  ], TextComponent.prototype, "justification", null);
  __decorate([
    nativeProperty()
  ], TextComponent.prototype, "characterSpacing", null);
  __decorate([
    nativeProperty()
  ], TextComponent.prototype, "lineSpacing", null);
  __decorate([
    nativeProperty()
  ], TextComponent.prototype, "effect", null);
  __decorate([
    nativeProperty()
  ], TextComponent.prototype, "wrapMode", null);
  __decorate([
    nativeProperty()
  ], TextComponent.prototype, "wrapWidth", null);
  __decorate([
    nativeProperty()
  ], TextComponent.prototype, "text", null);
  __decorate([
    nativeProperty()
  ], TextComponent.prototype, "material", null);
  var ViewComponent = class extends Component {
    getProjectionMatrix(out = new Float32Array(16)) {
      const wasm = this.engine.wasm;
      const ptr = wasm._wl_view_component_get_projection_matrix(this._id) / 4;
      for (let i2 = 0; i2 < 16; ++i2) {
        out[i2] = wasm.HEAPF32[ptr + i2];
      }
      return out;
    }
    /**
     * Equivalent to {@link ViewComponent.getProjectionMatrix}.
     *
     * @note Prefer to use {@link ViewComponent.getProjectionMatrix} for performance.
     */
    get projectionMatrix() {
      const wasm = this.engine.wasm;
      return new Float32Array(wasm.HEAPF32.buffer, wasm._wl_view_component_get_projection_matrix(this._id), 16);
    }
    /** ViewComponent near clipping plane value. */
    get near() {
      return this.engine.wasm._wl_view_component_get_near(this._id);
    }
    /**
     * Set near clipping plane distance for the view.
     *
     * If an XR session is active, the change will apply in the
     * following frame, otherwise the change is immediate.
     *
     * @param near Near depth value.
     */
    set near(near) {
      this.engine.wasm._wl_view_component_set_near(this._id, near);
    }
    /** Far clipping plane value. */
    get far() {
      return this.engine.wasm._wl_view_component_get_far(this._id);
    }
    /**
     * Set far clipping plane distance for the view.
     *
     * If an XR session is active, the change will apply in the
     * following frame, otherwise the change is immediate.
     *
     * @param far Near depth value.
     */
    set far(far) {
      this.engine.wasm._wl_view_component_set_far(this._id, far);
    }
    /**
     * Get the horizontal field of view for the view, **in degrees**.
     *
     * If an XR session is active, this returns the field of view reported by
     * the device, regardless of the fov that was set.
     */
    get fov() {
      return this.engine.wasm._wl_view_component_get_fov(this._id);
    }
    /**
     * Set the horizontal field of view for the view, **in degrees**.
     *
     * If an XR session is active, the field of view reported by the device is
     * used and this value is ignored. After the XR session ends, the new value
     * is applied.
     *
     * @param fov Horizontal field of view, **in degrees**.
     */
    set fov(fov) {
      this.engine.wasm._wl_view_component_set_fov(this._id, fov);
    }
  };
  /** @override */
  __publicField(ViewComponent, "TypeName", "view");
  __decorate([
    enumerable()
  ], ViewComponent.prototype, "projectionMatrix", null);
  __decorate([
    nativeProperty()
  ], ViewComponent.prototype, "near", null);
  __decorate([
    nativeProperty()
  ], ViewComponent.prototype, "far", null);
  __decorate([
    nativeProperty()
  ], ViewComponent.prototype, "fov", null);
  var InputComponent = class extends Component {
    /** Input component type */
    get inputType() {
      return this.engine.wasm._wl_input_component_get_type(this._id);
    }
    /**
     * Set input component type.
     *
     * @params New input component type.
     */
    set inputType(type) {
      this.engine.wasm._wl_input_component_set_type(this._id, type);
    }
    /**
     * WebXR Device API input source associated with this input component,
     * if type {@link InputType.ControllerLeft} or {@link InputType.ControllerRight}.
     */
    get xrInputSource() {
      const xr = this.engine.xr;
      if (!xr)
        return null;
      for (let inputSource of xr.session.inputSources) {
        if (inputSource.handedness == this.handedness) {
          return inputSource;
        }
      }
      return null;
    }
    /**
     * 'left', 'right' or `null` depending on the {@link InputComponent#inputType}.
     */
    get handedness() {
      const inputType = this.inputType;
      if (inputType == InputType.ControllerRight || inputType == InputType.RayRight || inputType == InputType.EyeRight)
        return "right";
      if (inputType == InputType.ControllerLeft || inputType == InputType.RayLeft || inputType == InputType.EyeLeft)
        return "left";
      return null;
    }
  };
  /** @override */
  __publicField(InputComponent, "TypeName", "input");
  __decorate([
    nativeProperty()
  ], InputComponent.prototype, "inputType", null);
  __decorate([
    enumerable()
  ], InputComponent.prototype, "xrInputSource", null);
  __decorate([
    enumerable()
  ], InputComponent.prototype, "handedness", null);
  var LightComponent = class extends Component {
    getColor(out = new Float32Array(3)) {
      const wasm = this.engine.wasm;
      const ptr = wasm._wl_light_component_get_color(this._id) / 4;
      out[0] = wasm.HEAPF32[ptr];
      out[1] = wasm.HEAPF32[ptr + 1];
      out[2] = wasm.HEAPF32[ptr + 2];
      return out;
    }
    /**
     * Set light color.
     *
     * @param c New color array/vector, expected to have at least 3 elements.
     * @since 1.0.0
     */
    setColor(c) {
      const wasm = this.engine.wasm;
      const ptr = wasm._wl_light_component_get_color(this._id) / 4;
      wasm.HEAPF32[ptr] = c[0];
      wasm.HEAPF32[ptr + 1] = c[1];
      wasm.HEAPF32[ptr + 2] = c[2];
    }
    /**
     * View on the light color.
     *
     * @note Prefer to use {@link getColor} in performance-critical code.
     */
    get color() {
      const wasm = this.engine.wasm;
      return new Float32Array(wasm.HEAPF32.buffer, wasm._wl_light_component_get_color(this._id), 3);
    }
    /**
     * Set light color.
     *
     * @param c Color of the light component.
     *
     * @note Prefer to use {@link setColor} in performance-critical code.
     */
    set color(c) {
      this.color.set(c);
    }
    /** Light type. */
    get lightType() {
      return this.engine.wasm._wl_light_component_get_type(this._id);
    }
    /**
     * Set light type.
     *
     * @param lightType Type of the light component.
     */
    set lightType(t) {
      this.engine.wasm._wl_light_component_set_type(this._id, t);
    }
    /**
     * Light intensity.
     * @since 1.0.0
     */
    get intensity() {
      return this.engine.wasm._wl_light_component_get_intensity(this._id);
    }
    /**
     * Set light intensity.
     *
     * @param intensity Intensity of the light component.
     * @since 1.0.0
     */
    set intensity(intensity) {
      this.engine.wasm._wl_light_component_set_intensity(this._id, intensity);
    }
    /**
     * Outer angle for spot lights, in degrees.
     * @since 1.0.0
     */
    get outerAngle() {
      return this.engine.wasm._wl_light_component_get_outerAngle(this._id);
    }
    /**
     * Set outer angle for spot lights.
     *
     * @param angle Outer angle, in degrees.
     * @since 1.0.0
     */
    set outerAngle(angle2) {
      this.engine.wasm._wl_light_component_set_outerAngle(this._id, angle2);
    }
    /**
     * Inner angle for spot lights, in degrees.
     * @since 1.0.0
     */
    get innerAngle() {
      return this.engine.wasm._wl_light_component_get_innerAngle(this._id);
    }
    /**
     * Set inner angle for spot lights.
     *
     * @param angle Inner angle, in degrees.
     * @since 1.0.0
     */
    set innerAngle(angle2) {
      this.engine.wasm._wl_light_component_set_innerAngle(this._id, angle2);
    }
    /**
     * Whether the light casts shadows.
     * @since 1.0.0
     */
    get shadows() {
      return !!this.engine.wasm._wl_light_component_get_shadows(this._id);
    }
    /**
     * Set whether the light casts shadows.
     *
     * @param b Whether the light casts shadows.
     * @since 1.0.0
     */
    set shadows(b) {
      this.engine.wasm._wl_light_component_set_shadows(this._id, b);
    }
    /**
     * Range for shadows.
     * @since 1.0.0
     */
    get shadowRange() {
      return this.engine.wasm._wl_light_component_get_shadowRange(this._id);
    }
    /**
     * Set range for shadows.
     *
     * @param range Range for shadows.
     * @since 1.0.0
     */
    set shadowRange(range) {
      this.engine.wasm._wl_light_component_set_shadowRange(this._id, range);
    }
    /**
     * Bias value for shadows.
     * @since 1.0.0
     */
    get shadowBias() {
      return this.engine.wasm._wl_light_component_get_shadowBias(this._id);
    }
    /**
     * Set bias value for shadows.
     *
     * @param bias Bias for shadows.
     * @since 1.0.0
     */
    set shadowBias(bias) {
      this.engine.wasm._wl_light_component_set_shadowBias(this._id, bias);
    }
    /**
     * Normal bias value for shadows.
     * @since 1.0.0
     */
    get shadowNormalBias() {
      return this.engine.wasm._wl_light_component_get_shadowNormalBias(this._id);
    }
    /**
     * Set normal bias value for shadows.
     *
     * @param bias Normal bias for shadows.
     * @since 1.0.0
     */
    set shadowNormalBias(bias) {
      this.engine.wasm._wl_light_component_set_shadowNormalBias(this._id, bias);
    }
    /**
     * Texel size for shadows.
     * @since 1.0.0
     */
    get shadowTexelSize() {
      return this.engine.wasm._wl_light_component_get_shadowTexelSize(this._id);
    }
    /**
     * Set texel size for shadows.
     *
     * @param size Texel size for shadows.
     * @since 1.0.0
     */
    set shadowTexelSize(size) {
      this.engine.wasm._wl_light_component_set_shadowTexelSize(this._id, size);
    }
    /**
     * Cascade count for {@link LightType.Sun} shadows.
     * @since 1.0.0
     */
    get cascadeCount() {
      return this.engine.wasm._wl_light_component_get_cascadeCount(this._id);
    }
    /**
     * Set cascade count for {@link LightType.Sun} shadows.
     *
     * @param count Cascade count.
     * @since 1.0.0
     */
    set cascadeCount(count) {
      this.engine.wasm._wl_light_component_set_cascadeCount(this._id, count);
    }
  };
  /** @override */
  __publicField(LightComponent, "TypeName", "light");
  __decorate([
    nativeProperty()
  ], LightComponent.prototype, "color", null);
  __decorate([
    nativeProperty()
  ], LightComponent.prototype, "lightType", null);
  __decorate([
    nativeProperty()
  ], LightComponent.prototype, "intensity", null);
  __decorate([
    nativeProperty()
  ], LightComponent.prototype, "outerAngle", null);
  __decorate([
    nativeProperty()
  ], LightComponent.prototype, "innerAngle", null);
  __decorate([
    nativeProperty()
  ], LightComponent.prototype, "shadows", null);
  __decorate([
    nativeProperty()
  ], LightComponent.prototype, "shadowRange", null);
  __decorate([
    nativeProperty()
  ], LightComponent.prototype, "shadowBias", null);
  __decorate([
    nativeProperty()
  ], LightComponent.prototype, "shadowNormalBias", null);
  __decorate([
    nativeProperty()
  ], LightComponent.prototype, "shadowTexelSize", null);
  __decorate([
    nativeProperty()
  ], LightComponent.prototype, "cascadeCount", null);
  var AnimationComponent = class extends Component {
    /**
     * Emitter for animation events triggered on this component.
     *
     * The first argument is the name of the event.
     */
    onEvent = new Emitter();
    /**
     * Set animation to play.
     *
     * Make sure to {@link Animation#retarget} the animation to affect the
     * right objects.
     *
     * @param anim Animation to play.
     */
    set animation(anim) {
      this.scene.assertOrigin(anim);
      this.engine.wasm._wl_animation_component_set_animation(this._id, anim ? anim._id : 0);
    }
    /** Animation set for this component */
    get animation() {
      const index = this.engine.wasm._wl_animation_component_get_animation(this._id);
      return this._scene.animations.wrap(index);
    }
    /**
     * Set play count. Set to `0` to loop indefinitely.
     *
     * @param playCount Number of times to repeat the animation.
     */
    set playCount(playCount) {
      this.engine.wasm._wl_animation_component_set_playCount(this._id, playCount);
    }
    /** Number of times the animation is played. */
    get playCount() {
      return this.engine.wasm._wl_animation_component_get_playCount(this._id);
    }
    /**
     * Set speed. Set to negative values to run the animation backwards.
     *
     * Setting speed has an immediate effect for the current frame's update
     * and will continue with the speed from the current point in the animation.
     *
     * @param speed New speed at which to play the animation.
     * @since 0.8.10
     */
    set speed(speed) {
      this.engine.wasm._wl_animation_component_set_speed(this._id, speed);
    }
    /**
     * Speed factor at which the animation is played.
     *
     * @since 0.8.10
     */
    get speed() {
      return this.engine.wasm._wl_animation_component_get_speed(this._id);
    }
    /** Current playing state of the animation */
    get state() {
      return this.engine.wasm._wl_animation_component_state(this._id);
    }
    /**
     * Play animation.
     *
     * If the animation is currently paused, resumes from that position. If the
     * animation is already playing, does nothing.
     *
     * To restart the animation, {@link AnimationComponent#stop} it first.
     */
    play() {
      this.engine.wasm._wl_animation_component_play(this._id);
    }
    /** Stop animation. */
    stop() {
      this.engine.wasm._wl_animation_component_stop(this._id);
    }
    /** Pause animation. */
    pause() {
      this.engine.wasm._wl_animation_component_pause(this._id);
    }
    /**
     * Get the value of a float parameter in the attached graph.
     * Throws if the parameter is missing.
     *
     * @param name Name of the parameter.
     * @since 1.2.0
     */
    getFloatParameter(name) {
      const wasm = this.engine.wasm;
      const index = wasm._wl_animation_component_getGraphParamIndex(this._id, wasm.tempUTF8(name));
      if (index === -1) {
        throw Error(`Missing parameter '${name}'`);
      }
      wasm._wl_animation_component_getGraphParamValue(this._id, index, wasm._tempMem);
      return wasm._tempMemFloat[0];
    }
    /**
     * Set the value of a float parameter in the attached graph
     * Throws if the parameter is missing.
     *
     * @param name Name of the parameter.
     * @param value Float value to set.
     * @returns 1 if the parameter was successfully set, 0 on fail.
     * @since 1.2.0
     */
    setFloatParameter(name, value2) {
      const wasm = this.engine.wasm;
      const index = wasm._wl_animation_component_getGraphParamIndex(this._id, wasm.tempUTF8(name));
      if (index === -1) {
        throw Error(`Missing parameter '${name}'`);
      }
      wasm._tempMemFloat[0] = value2;
      wasm._wl_animation_component_setGraphParamValue(this._id, index, wasm._tempMem);
    }
  };
  /** @override */
  __publicField(AnimationComponent, "TypeName", "animation");
  __decorate([
    nativeProperty()
  ], AnimationComponent.prototype, "animation", null);
  __decorate([
    nativeProperty()
  ], AnimationComponent.prototype, "playCount", null);
  __decorate([
    nativeProperty()
  ], AnimationComponent.prototype, "speed", null);
  __decorate([
    enumerable()
  ], AnimationComponent.prototype, "state", null);
  var MeshComponent = class extends Component {
    /**
     * Set material to render the mesh with.
     *
     * @param material Material to render the mesh with.
     */
    set material(material) {
      this.engine.wasm._wl_mesh_component_set_material(this._id, material ? material._id : 0);
    }
    /** Material used to render the mesh. */
    get material() {
      const index = this.engine.wasm._wl_mesh_component_get_material(this._id);
      return this.engine.materials.wrap(index);
    }
    /** Mesh rendered by this component. */
    get mesh() {
      const index = this.engine.wasm._wl_mesh_component_get_mesh(this._id);
      return this.engine.meshes.wrap(index);
    }
    /**
     * Set mesh to rendered with this component.
     *
     * @param mesh Mesh rendered by this component.
     */
    set mesh(mesh) {
      this.engine.wasm._wl_mesh_component_set_mesh(this._id, mesh?._id ?? 0);
    }
    /** Skin for this mesh component. */
    get skin() {
      const index = this.engine.wasm._wl_mesh_component_get_skin(this._id);
      return this._scene.skins.wrap(index);
    }
    /**
     * Set skin to transform this mesh component.
     *
     * @param skin Skin to use for rendering skinned meshes.
     */
    set skin(skin) {
      this.scene.assertOrigin(skin);
      this.engine.wasm._wl_mesh_component_set_skin(this._id, skin ? skin._id : 0);
    }
    /**
     * Morph targets for this mesh component.
     *
     * @since 1.2.0
     */
    get morphTargets() {
      const index = this.engine.wasm._wl_mesh_component_get_morph_targets(this._id);
      return this.engine.morphTargets.wrap(index);
    }
    /**
     * Set morph targets to transform this mesh component.
     *
     * @param morphTargets Morph targets to use for rendering.
     *
     * @since 1.2.0
     */
    set morphTargets(morphTargets) {
      this.engine.wasm._wl_mesh_component_set_morph_targets(this._id, morphTargets?._id ?? 0);
    }
    /**
     * Equivalent to {@link getMorphTargetWeights}.
     *
     * @note Prefer to use {@link getMorphTargetWeights} for performance.
     *
     * @since 1.2.0
     */
    get morphTargetWeights() {
      return this.getMorphTargetWeights();
    }
    /**
     * Set the morph target weights to transform this mesh component.
     *
     * @param weights New weights.
     *
     * @since 1.2.0
     */
    set morphTargetWeights(weights) {
      this.setMorphTargetWeights(weights);
    }
    getMorphTargetWeights(out) {
      const wasm = this.engine.wasm;
      const count = wasm._wl_mesh_component_get_morph_target_weights(this._id, wasm._tempMem);
      if (!out) {
        out = new Float32Array(count);
      }
      for (let i2 = 0; i2 < count; ++i2) {
        out[i2] = wasm._tempMemFloat[i2];
      }
      return out;
    }
    /**
     * Get the weight of a single morph target.
     *
     * @param target Index of the morph target.
     * @returns The weight.
     *
     * @since 1.2.0
     */
    getMorphTargetWeight(target) {
      const count = this.morphTargets?.count ?? 0;
      if (target >= count) {
        throw new Error(`Index ${target} is out of bounds for ${count} targets`);
      }
      return this.engine.wasm._wl_mesh_component_get_morph_target_weight(this._id, target);
    }
    /**
     * Set morph target weights for this mesh component.
     *
     * @param weights Array of new weights, expected to have at least as many
     *     elements as {@link MorphTargets.count}.
     *
     * @since 1.2.0
     */
    setMorphTargetWeights(weights) {
      const count = this.morphTargets?.count ?? 0;
      if (weights.length !== count) {
        throw new Error(`Expected ${count} weights but got ${weights.length}`);
      }
      const wasm = this.engine.wasm;
      wasm._tempMemFloat.set(weights);
      wasm._wl_mesh_component_set_morph_target_weights(this._id, wasm._tempMem, weights.length);
    }
    /**
     * Set the weight of a single morph target.
     *
     * @param target Index of the morph target.
     * @param weight The new weight.
     *
     * ## Usage
     *
     * ```js
     * const mesh = object.getComponent('mesh');
     * const mouthTarget = mesh.morphTargets.getTargetIndex('mouth');
     * mesh.setMorphTargetWeight(mouthTarget, 0.5);
     * ```
     *
     * @since 1.2.0
     */
    setMorphTargetWeight(target, weight) {
      const count = this.morphTargets?.count ?? 0;
      if (target >= count) {
        throw new Error(`Index ${target} is out of bounds for ${count} targets`);
      }
      this.engine.wasm._wl_mesh_component_set_morph_target_weight(this._id, target, weight);
    }
  };
  /** @override */
  __publicField(MeshComponent, "TypeName", "mesh");
  __decorate([
    nativeProperty()
  ], MeshComponent.prototype, "material", null);
  __decorate([
    nativeProperty()
  ], MeshComponent.prototype, "mesh", null);
  __decorate([
    nativeProperty()
  ], MeshComponent.prototype, "skin", null);
  __decorate([
    nativeProperty()
  ], MeshComponent.prototype, "morphTargets", null);
  __decorate([
    nativeProperty()
  ], MeshComponent.prototype, "morphTargetWeights", null);
  var LockAxis;
  (function(LockAxis2) {
    LockAxis2[LockAxis2["None"] = 0] = "None";
    LockAxis2[LockAxis2["X"] = 1] = "X";
    LockAxis2[LockAxis2["Y"] = 2] = "Y";
    LockAxis2[LockAxis2["Z"] = 4] = "Z";
  })(LockAxis || (LockAxis = {}));
  var PhysXComponent = class extends Component {
    getTranslationOffset(out = new Float32Array(3)) {
      const wasm = this.engine.wasm;
      wasm._wl_physx_component_get_offsetTranslation(this._id, wasm._tempMem);
      out[0] = wasm._tempMemFloat[0];
      out[1] = wasm._tempMemFloat[1];
      out[2] = wasm._tempMemFloat[2];
      return out;
    }
    getRotationOffset(out = new Float32Array(4)) {
      const wasm = this.engine.wasm;
      const ptr = wasm._wl_physx_component_get_offsetTransform(this._id) >> 2;
      out[0] = wasm.HEAPF32[ptr];
      out[1] = wasm.HEAPF32[ptr + 1];
      out[2] = wasm.HEAPF32[ptr + 2];
      out[3] = wasm.HEAPF32[ptr + 3];
      return out;
    }
    getExtents(out = new Float32Array(3)) {
      const wasm = this.engine.wasm;
      const ptr = wasm._wl_physx_component_get_extents(this._id) / 4;
      out[0] = wasm.HEAPF32[ptr];
      out[1] = wasm.HEAPF32[ptr + 1];
      out[2] = wasm.HEAPF32[ptr + 2];
      return out;
    }
    getLinearVelocity(out = new Float32Array(3)) {
      const wasm = this.engine.wasm;
      const tempMemFloat = wasm._tempMemFloat;
      wasm._wl_physx_component_get_linearVelocity(this._id, wasm._tempMem);
      out[0] = tempMemFloat[0];
      out[1] = tempMemFloat[1];
      out[2] = tempMemFloat[2];
      return out;
    }
    getAngularVelocity(out = new Float32Array(3)) {
      const wasm = this.engine.wasm;
      const tempMemFloat = wasm._tempMemFloat;
      wasm._wl_physx_component_get_angularVelocity(this._id, wasm._tempMem);
      out[0] = tempMemFloat[0];
      out[1] = tempMemFloat[1];
      out[2] = tempMemFloat[2];
      return out;
    }
    /**
     * Set whether this rigid body is static.
     *
     * Setting this property only takes effect once the component
     * switches from inactive to active.
     *
     * @param b Whether the rigid body should be static.
     */
    set static(b) {
      this.engine.wasm._wl_physx_component_set_static(this._id, b);
    }
    /**
     * Whether this rigid body is static.
     *
     * This property returns whether the rigid body is *effectively*
     * static. If static property was set while the rigid body was
     * active, it will not take effect until the rigid body is set
     * inactive and active again. Until the component is set inactive,
     * this getter will return whether the rigid body is actually
     * static.
     */
    get static() {
      return !!this.engine.wasm._wl_physx_component_get_static(this._id);
    }
    /**
     * Equivalent to {@link PhysXComponent.getTranslationOffset}.
     *
     * Gives a quick view of the offset in a debugger.
     *
     * @note Prefer to use {@link PhysXComponent.getTranslationOffset} for performance.
     *
     * @since 1.1.1
     */
    get translationOffset() {
      return this.getTranslationOffset();
    }
    /**
     * Set the offset translation.
     *
     * The array must be a vector of at least **3** elements.
     *
     * @note The component must be re-activated to apply the change.
     *
     * @since 1.1.1
     */
    set translationOffset(offset2) {
      const wasm = this.engine.wasm;
      wasm._wl_physx_component_set_offsetTranslation(this._id, offset2[0], offset2[1], offset2[2]);
    }
    /**
     * Equivalent to {@link PhysXComponent.getRotationOffset}.
     *
     * Gives a quick view of the offset in a debugger.
     *
     * @note Prefer to use {@link PhysXComponent.getRotationOffset} for performance.
     *
     * @since 1.1.1
     */
    get rotationOffset() {
      return this.getRotationOffset();
    }
    /**
     * Set the offset rotation.
     *
     * The array must be a quaternion of at least **4** elements.
     *
     * @note The component must be re-activated to apply the change.
     *
     * @since 1.1.1
     */
    set rotationOffset(offset2) {
      const wasm = this.engine.wasm;
      wasm._wl_physx_component_set_offsetRotation(this._id, offset2[0], offset2[1], offset2[2], offset2[3]);
    }
    /**
     * Set whether this rigid body is kinematic.
     *
     * @param b Whether the rigid body should be kinematic.
     */
    set kinematic(b) {
      this.engine.wasm._wl_physx_component_set_kinematic(this._id, b);
    }
    /**
     * Whether this rigid body is kinematic.
     */
    get kinematic() {
      return !!this.engine.wasm._wl_physx_component_get_kinematic(this._id);
    }
    /**
     * Set whether this rigid body's gravity is enabled.
     *
     * @param b Whether the rigid body's gravity should be enabled.
     */
    set gravity(b) {
      this.engine.wasm._wl_physx_component_set_gravity(this._id, b);
    }
    /**
     * Whether this rigid body's gravity flag is enabled.
     */
    get gravity() {
      return !!this.engine.wasm._wl_physx_component_get_gravity(this._id);
    }
    /**
     * Set whether this rigid body's simulate flag is enabled.
     *
     * @param b Whether the rigid body's simulate flag should be enabled.
     */
    set simulate(b) {
      this.engine.wasm._wl_physx_component_set_simulate(this._id, b);
    }
    /**
     * Whether this rigid body's simulate flag is enabled.
     */
    get simulate() {
      return !!this.engine.wasm._wl_physx_component_get_simulate(this._id);
    }
    /**
     * Set whether to allow simulation of this rigid body.
     *
     * {@link allowSimulation} and {@link trigger} can not be enabled at the
     * same time. Enabling {@link allowSimulation} while {@link trigger} is enabled
     * will disable {@link trigger}.
     *
     * @param b Whether to allow simulation of this rigid body.
     */
    set allowSimulation(b) {
      this.engine.wasm._wl_physx_component_set_allowSimulation(this._id, b);
    }
    /**
     * Whether to allow simulation of this rigid body.
     */
    get allowSimulation() {
      return !!this.engine.wasm._wl_physx_component_get_allowSimulation(this._id);
    }
    /**
     * Set whether this rigid body may be queried in ray casts.
     *
     * @param b Whether this rigid body may be queried in ray casts.
     */
    set allowQuery(b) {
      this.engine.wasm._wl_physx_component_set_allowQuery(this._id, b);
    }
    /**
     * Whether this rigid body may be queried in ray casts.
     */
    get allowQuery() {
      return !!this.engine.wasm._wl_physx_component_get_allowQuery(this._id);
    }
    /**
     * Set whether this physics body is a trigger.
     *
     * {@link allowSimulation} and {@link trigger} can not be enabled at the
     * same time. Enabling trigger while {@link allowSimulation} is enabled,
     * will disable {@link allowSimulation}.
     *
     * @param b Whether this physics body is a trigger.
     */
    set trigger(b) {
      this.engine.wasm._wl_physx_component_set_trigger(this._id, b);
    }
    /**
     * Whether this physics body is a trigger.
     */
    get trigger() {
      return !!this.engine.wasm._wl_physx_component_get_trigger(this._id);
    }
    /**
     * Set the shape for collision detection.
     *
     * @param s New shape.
     * @since 0.8.5
     */
    set shape(s) {
      this.engine.wasm._wl_physx_component_set_shape(this._id, s);
    }
    /** The shape for collision detection. */
    get shape() {
      return this.engine.wasm._wl_physx_component_get_shape(this._id);
    }
    /**
     * Set additional data for the shape.
     *
     * Retrieved only from {@link PhysXComponent#shapeData}.
     * @since 0.8.10
     */
    set shapeData(d) {
      if (d == null || !isMeshShape(this.shape))
        return;
      this.engine.wasm._wl_physx_component_set_shape_data(this._id, d.index);
    }
    /**
     * Additional data for the shape.
     *
     * `null` for {@link Shape} values: `None`, `Sphere`, `Capsule`, `Box`, `Plane`.
     * `{index: n}` for `TriangleMesh` and `ConvexHull`.
     *
     * This data is currently only for passing onto or creating other {@link PhysXComponent}.
     * @since 0.8.10
     */
    get shapeData() {
      if (!isMeshShape(this.shape))
        return null;
      return {
        index: this.engine.wasm._wl_physx_component_get_shape_data(this._id)
      };
    }
    /**
     * Set the shape extents for collision detection.
     *
     * @param e New extents for the shape.
     * @since 0.8.5
     */
    set extents(e) {
      this.extents.set(e);
    }
    /**
     * Equivalent to {@link PhysXComponent.getExtents}.
     *
     * @note Prefer to use {@link PhysXComponent.getExtents} for performance.
     */
    get extents() {
      const wasm = this.engine.wasm;
      const ptr = wasm._wl_physx_component_get_extents(this._id);
      return new Float32Array(wasm.HEAPF32.buffer, ptr, 3);
    }
    /**
     * Get staticFriction.
     */
    get staticFriction() {
      return this.engine.wasm._wl_physx_component_get_staticFriction(this._id);
    }
    /**
     * Set staticFriction.
     * @param v New staticFriction.
     */
    set staticFriction(v) {
      this.engine.wasm._wl_physx_component_set_staticFriction(this._id, v);
    }
    /**
     * Get dynamicFriction.
     */
    get dynamicFriction() {
      return this.engine.wasm._wl_physx_component_get_dynamicFriction(this._id);
    }
    /**
     * Set dynamicFriction
     * @param v New dynamicDamping.
     */
    set dynamicFriction(v) {
      this.engine.wasm._wl_physx_component_set_dynamicFriction(this._id, v);
    }
    /**
     * Get bounciness.
     * @since 0.9.0
     */
    get bounciness() {
      return this.engine.wasm._wl_physx_component_get_bounciness(this._id);
    }
    /**
     * Set bounciness.
     * @param v New bounciness.
     * @since 0.9.0
     */
    set bounciness(v) {
      this.engine.wasm._wl_physx_component_set_bounciness(this._id, v);
    }
    /**
     * Get linearDamping/
     */
    get linearDamping() {
      return this.engine.wasm._wl_physx_component_get_linearDamping(this._id);
    }
    /**
     * Set linearDamping.
     * @param v New linearDamping.
     */
    set linearDamping(v) {
      this.engine.wasm._wl_physx_component_set_linearDamping(this._id, v);
    }
    /** Get angularDamping. */
    get angularDamping() {
      return this.engine.wasm._wl_physx_component_get_angularDamping(this._id);
    }
    /**
     * Set angularDamping.
     * @param v New angularDamping.
     */
    set angularDamping(v) {
      this.engine.wasm._wl_physx_component_set_angularDamping(this._id, v);
    }
    /**
     * Set linear velocity.
     *
     * [PhysX Manual - "Velocity"](https://gameworksdocs.nvidia.com/PhysX/4.1/documentation/physxguide/Manual/RigidBodyDynamics.html#velocity)
     *
     * Has no effect, if the component is not active.
     *
     * @param v New linear velocity.
     */
    set linearVelocity(v) {
      this.engine.wasm._wl_physx_component_set_linearVelocity(this._id, v[0], v[1], v[2]);
    }
    /**
     * Equivalent to {@link PhysXComponent.getLinearVelocity}.
     *
     * @note Prefer to use {@link PhysXComponent.getLinearVelocity} for performance.
     */
    get linearVelocity() {
      const wasm = this.engine.wasm;
      wasm._wl_physx_component_get_linearVelocity(this._id, wasm._tempMem);
      return new Float32Array(wasm.HEAPF32.buffer, wasm._tempMem, 3);
    }
    /**
     * Set angular velocity
     *
     * [PhysX Manual - "Velocity"](https://gameworksdocs.nvidia.com/PhysX/4.1/documentation/physxguide/Manual/RigidBodyDynamics.html#velocity)
     *
     * Has no effect, if the component is not active.
     *
     * @param v New angular velocity
     */
    set angularVelocity(v) {
      this.engine.wasm._wl_physx_component_set_angularVelocity(this._id, v[0], v[1], v[2]);
    }
    /**
     * Equivalent to {@link PhysXComponent.getAngularVelocity}.
     *
     * @note Prefer to use {@link PhysXComponent.getAngularVelocity} for performance.
     */
    get angularVelocity() {
      const wasm = this.engine.wasm;
      wasm._wl_physx_component_get_angularVelocity(this._id, wasm._tempMem);
      return new Float32Array(wasm.HEAPF32.buffer, wasm._tempMem, 3);
    }
    /**
     * Set the components groups mask.
     *
     * @param flags New flags that need to be set.
     */
    set groupsMask(flags) {
      this.engine.wasm._wl_physx_component_set_groupsMask(this._id, flags);
    }
    /**
     * Get the components groups mask flags.
     *
     * Each bit represents membership to group, see example.
     *
     * ```js
     * // Assign c to group 2
     * c.groupsMask = (1 << 2);
     *
     * // Assign c to group 0
     * c.groupsMask  = (1 << 0);
     *
     * // Assign c to group 0 and 2
     * c.groupsMask = (1 << 0) | (1 << 2);
     *
     * (c.groupsMask & (1 << 2)) != 0; // true
     * (c.groupsMask & (1 << 7)) != 0; // false
     * ```
     */
    get groupsMask() {
      return this.engine.wasm._wl_physx_component_get_groupsMask(this._id);
    }
    /**
     * Set the components blocks mask.
     *
     * @param flags New flags that need to be set.
     */
    set blocksMask(flags) {
      this.engine.wasm._wl_physx_component_set_blocksMask(this._id, flags);
    }
    /**
     * Get the components blocks mask flags.
     *
     * Each bit represents membership to the block, see example.
     *
     * ```js
     * // Block overlap with any objects in group 2
     * c.blocksMask = (1 << 2);
     *
     * // Block overlap with any objects in group 0
     * c.blocksMask  = (1 << 0)
     *
     * // Block overlap with any objects in group 0 and 2
     * c.blocksMask = (1 << 0) | (1 << 2);
     *
     * (c.blocksMask & (1 << 2)) != 0; // true
     * (c.blocksMask & (1 << 7)) != 0; // false
     * ```
     */
    get blocksMask() {
      return this.engine.wasm._wl_physx_component_get_blocksMask(this._id);
    }
    /**
     * Set axes to lock for linear velocity.
     *
     * @param lock The Axis that needs to be set.
     *
     * Combine flags with Bitwise OR:
     *
     * ```js
     * body.linearLockAxis = LockAxis.X | LockAxis.Y; // x and y set
     * body.linearLockAxis = LockAxis.X; // y unset
     * ```
     *
     * @note This has no effect if the component is static.
     */
    set linearLockAxis(lock) {
      this.engine.wasm._wl_physx_component_set_linearLockAxis(this._id, lock);
    }
    /**
     * Get the linear lock axes flags.
     *
     * To get the state of a specific flag, Bitwise AND with the LockAxis needed.
     *
     * ```js
     * if(body.linearLockAxis & LockAxis.Y) {
     *     console.log("The Y flag was set!");
     * }
     * ```
     *
     * @return axes that are currently locked for linear movement.
     */
    get linearLockAxis() {
      return this.engine.wasm._wl_physx_component_get_linearLockAxis(this._id);
    }
    /**
     * Set axes to lock for angular velocity.
     *
     * @param lock The Axis that needs to be set.
     *
     * ```js
     * body.angularLockAxis = LockAxis.X | LockAxis.Y; // x and y set
     * body.angularLockAxis = LockAxis.X; // y unset
     * ```
     *
     * @note This has no effect if the component is static.
     */
    set angularLockAxis(lock) {
      this.engine.wasm._wl_physx_component_set_angularLockAxis(this._id, lock);
    }
    /**
     * Get the angular lock axes flags.
     *
     * To get the state of a specific flag, Bitwise AND with the LockAxis needed:
     *
     * ```js
     * if(body.angularLockAxis & LockAxis.Y) {
     *     console.log("The Y flag was set!");
     * }
     * ```
     *
     * @return axes that are currently locked for angular movement.
     */
    get angularLockAxis() {
      return this.engine.wasm._wl_physx_component_get_angularLockAxis(this._id);
    }
    /**
     * Set mass.
     *
     * [PhysX Manual - "Mass Properties"](https://gameworksdocs.nvidia.com/PhysX/4.1/documentation/physxguide/Manual/RigidBodyDynamics.html#mass-properties)
     *
     * @param m New mass.
     */
    set mass(m) {
      this.engine.wasm._wl_physx_component_set_mass(this._id, m);
    }
    /** Mass */
    get mass() {
      return this.engine.wasm._wl_physx_component_get_mass(this._id);
    }
    /**
     * Set mass space interia tensor.
     *
     * [PhysX Manual - "Mass Properties"](https://gameworksdocs.nvidia.com/PhysX/4.1/documentation/physxguide/Manual/RigidBodyDynamics.html#mass-properties)
     *
     * Has no effect, if the component is not active.
     *
     * @param v New mass space interatia tensor.
     */
    set massSpaceInteriaTensor(v) {
      this.engine.wasm._wl_physx_component_set_massSpaceInertiaTensor(this._id, v[0], v[1], v[2]);
    }
    /**
     * Set the rigid body to sleep upon activation.
     *
     * When asleep, the rigid body will not be simulated until the next contact.
     *
     * @param flag `true` to sleep upon activation.
     *
     * @since 1.1.5
     */
    set sleepOnActivate(flag) {
      this.engine.wasm._wl_physx_component_set_sleepOnActivate(this._id, flag);
    }
    /**
     * `true` if the rigid body is set to sleep upon activation, `false` otherwise.
     *
     * @since 1.1.5
     */
    get sleepOnActivate() {
      return !!this.engine.wasm._wl_physx_component_get_sleepOnActivate(this._id);
    }
    /**
     * Apply a force.
     *
     * [PhysX Manual - "Applying Forces and Torques"](https://gameworksdocs.nvidia.com/PhysX/4.1/documentation/physxguide/Manual/RigidBodyDynamics.html#applying-forces-and-torques)
     *
     * Has no effect, if the component is not active.
     *
     * @param f Force vector.
     * @param m Force mode, see {@link ForceMode}, default `Force`.
     * @param localForce Whether the force vector is in local space, default `false`.
     * @param p Position to apply force at, default is center of mass.
     * @param local Whether position is in local space, default `false`.
     */
    addForce(f, m = ForceMode.Force, localForce = false, p, local = false) {
      const wasm = this.engine.wasm;
      if (!p) {
        wasm._wl_physx_component_addForce(this._id, f[0], f[1], f[2], m, localForce);
        return;
      }
      wasm._wl_physx_component_addForceAt(this._id, f[0], f[1], f[2], m, localForce, p[0], p[1], p[2], local);
    }
    /**
     * Apply torque.
     *
     * [PhysX Manual - "Applying Forces and Torques"](https://gameworksdocs.nvidia.com/PhysX/4.1/documentation/physxguide/Manual/RigidBodyDynamics.html#applying-forces-and-torques)
     *
     * Has no effect, if the component is not active.
     *
     * @param f Force vector.
     * @param m Force mode, see {@link ForceMode}, default `Force`.
     */
    addTorque(f, m = ForceMode.Force) {
      this.engine.wasm._wl_physx_component_addTorque(this._id, f[0], f[1], f[2], m);
    }
    /**
     * Add on collision callback.
     *
     * @param callback Function to call when this rigid body (un)collides with any other.
     *
     * ```js
     *  let rigidBody = this.object.getComponent('physx');
     *  rigidBody.onCollision(function(type, other) {
     *      // Ignore uncollides
     *      if(type == CollisionEventType.TouchLost) return;
     *
     *      // Take damage on collision with enemies
     *      if(other.object.name.startsWith("enemy-")) {
     *          this.applyDamage(10);
     *      }
     *  }.bind(this));
     * ```
     *
     * @returns Id of the new callback for use with {@link PhysXComponent#removeCollisionCallback}.
     */
    onCollision(callback) {
      return this.onCollisionWith(this, callback);
    }
    /**
     * Add filtered on collision callback.
     *
     * @param otherComp Component for which callbacks will
     *        be triggered. If you pass this component, the method is equivalent to.
     *        {@link PhysXComponent#onCollision}.
     * @param callback Function to call when this rigid body
     *        (un)collides with `otherComp`.
     * @returns Id of the new callback for use with {@link PhysXComponent#removeCollisionCallback}.
     */
    onCollisionWith(otherComp, callback) {
      const physics = this.engine.physics;
      physics._callbacks[this._id] = physics._callbacks[this._id] || [];
      physics._callbacks[this._id].push(callback);
      return this.engine.wasm._wl_physx_component_addCallback(this._id, otherComp._id || this._id);
    }
    /**
     * Remove a collision callback added with {@link PhysXComponent#onCollision} or {@link PhysXComponent#onCollisionWith}.
     *
     * @param callbackId Callback id as returned by {@link PhysXComponent#onCollision} or {@link PhysXComponent#onCollisionWith}.
     * @throws When the callback does not belong to the component.
     * @throws When the callback does not exist.
     */
    removeCollisionCallback(callbackId) {
      const physics = this.engine.physics;
      const r = this.engine.wasm._wl_physx_component_removeCallback(this._id, callbackId);
      if (r)
        physics._callbacks[this._id].splice(-r);
    }
  };
  /** @override */
  __publicField(PhysXComponent, "TypeName", "physx");
  __decorate([
    nativeProperty()
  ], PhysXComponent.prototype, "static", null);
  __decorate([
    nativeProperty()
  ], PhysXComponent.prototype, "translationOffset", null);
  __decorate([
    nativeProperty()
  ], PhysXComponent.prototype, "rotationOffset", null);
  __decorate([
    nativeProperty()
  ], PhysXComponent.prototype, "kinematic", null);
  __decorate([
    nativeProperty()
  ], PhysXComponent.prototype, "gravity", null);
  __decorate([
    nativeProperty()
  ], PhysXComponent.prototype, "simulate", null);
  __decorate([
    nativeProperty()
  ], PhysXComponent.prototype, "allowSimulation", null);
  __decorate([
    nativeProperty()
  ], PhysXComponent.prototype, "allowQuery", null);
  __decorate([
    nativeProperty()
  ], PhysXComponent.prototype, "trigger", null);
  __decorate([
    nativeProperty()
  ], PhysXComponent.prototype, "shape", null);
  __decorate([
    nativeProperty()
  ], PhysXComponent.prototype, "shapeData", null);
  __decorate([
    nativeProperty()
  ], PhysXComponent.prototype, "extents", null);
  __decorate([
    nativeProperty()
  ], PhysXComponent.prototype, "staticFriction", null);
  __decorate([
    nativeProperty()
  ], PhysXComponent.prototype, "dynamicFriction", null);
  __decorate([
    nativeProperty()
  ], PhysXComponent.prototype, "bounciness", null);
  __decorate([
    nativeProperty()
  ], PhysXComponent.prototype, "linearDamping", null);
  __decorate([
    nativeProperty()
  ], PhysXComponent.prototype, "angularDamping", null);
  __decorate([
    nativeProperty()
  ], PhysXComponent.prototype, "linearVelocity", null);
  __decorate([
    nativeProperty()
  ], PhysXComponent.prototype, "angularVelocity", null);
  __decorate([
    nativeProperty()
  ], PhysXComponent.prototype, "groupsMask", null);
  __decorate([
    nativeProperty()
  ], PhysXComponent.prototype, "blocksMask", null);
  __decorate([
    nativeProperty()
  ], PhysXComponent.prototype, "linearLockAxis", null);
  __decorate([
    nativeProperty()
  ], PhysXComponent.prototype, "angularLockAxis", null);
  __decorate([
    nativeProperty()
  ], PhysXComponent.prototype, "mass", null);
  __decorate([
    nativeProperty()
  ], PhysXComponent.prototype, "sleepOnActivate", null);
  var MeshIndexType;
  (function(MeshIndexType2) {
    MeshIndexType2[MeshIndexType2["UnsignedByte"] = 1] = "UnsignedByte";
    MeshIndexType2[MeshIndexType2["UnsignedShort"] = 2] = "UnsignedShort";
    MeshIndexType2[MeshIndexType2["UnsignedInt"] = 4] = "UnsignedInt";
  })(MeshIndexType || (MeshIndexType = {}));
  var MeshSkinningType;
  (function(MeshSkinningType2) {
    MeshSkinningType2[MeshSkinningType2["None"] = 0] = "None";
    MeshSkinningType2[MeshSkinningType2["FourJoints"] = 1] = "FourJoints";
    MeshSkinningType2[MeshSkinningType2["EightJoints"] = 2] = "EightJoints";
  })(MeshSkinningType || (MeshSkinningType = {}));
  var Mesh = class extends Resource {
    /**
     * @deprecated Use {@link MeshManager.create} instead, accessible via {@link WonderlandEngine.meshes}:
     *
     * ```js
     * const mesh = engine.meshes.create({vertexCount: 3, indexData: [0, 1, 2]});
     * ...
     * mesh.update();
     * ```
     */
    constructor(engine, params) {
      if (!isNumber(params)) {
        const mesh = engine.meshes.create(params);
        super(engine, mesh._index);
        return mesh;
      }
      super(engine, params);
    }
    /** Number of vertices in this mesh. */
    get vertexCount() {
      return this.engine.wasm._wl_mesh_get_vertexCount(this._id);
    }
    /** Index data (read-only) or `null` if the mesh is not indexed. */
    get indexData() {
      const wasm = this.engine.wasm;
      const tempMem = wasm._tempMem;
      const ptr = wasm._wl_mesh_get_indexData(this._id, tempMem, tempMem + 4);
      if (ptr === null)
        return null;
      const indexCount = wasm.HEAPU32[tempMem / 4];
      const indexSize = wasm.HEAPU32[tempMem / 4 + 1];
      switch (indexSize) {
        case MeshIndexType.UnsignedByte:
          return new Uint8Array(wasm.HEAPU8.buffer, ptr, indexCount);
        case MeshIndexType.UnsignedShort:
          return new Uint16Array(wasm.HEAPU16.buffer, ptr, indexCount);
        case MeshIndexType.UnsignedInt:
          return new Uint32Array(wasm.HEAPU32.buffer, ptr, indexCount);
      }
      return null;
    }
    /**
     * Apply changes to {@link attribute | vertex attributes}.
     *
     * Uploads the updated vertex attributes to the GPU and updates the bounding
     * sphere to match the new vertex positions.
     *
     * Since this is an expensive operation, call it only once you have performed
     * all modifications on a mesh and avoid calling if you did not perform any
     * modifications at all.
     */
    update() {
      this.engine.wasm._wl_mesh_update(this._id);
    }
    getBoundingSphere(out = new Float32Array(4)) {
      const wasm = this.engine.wasm;
      this.engine.wasm._wl_mesh_get_boundingSphere(this._id, wasm._tempMem);
      out[0] = wasm._tempMemFloat[0];
      out[1] = wasm._tempMemFloat[1];
      out[2] = wasm._tempMemFloat[2];
      out[3] = wasm._tempMemFloat[3];
      return out;
    }
    attribute(attr) {
      if (typeof attr != "number")
        throw new TypeError("Expected number, but got " + typeof attr);
      const wasm = this.engine.wasm;
      const tempMemUint32 = wasm._tempMemUint32;
      wasm._wl_mesh_get_attribute(this._id, attr, wasm._tempMem);
      if (tempMemUint32[0] == 255)
        return null;
      const arraySize = tempMemUint32[5];
      return new MeshAttributeAccessor(this.engine, {
        attribute: tempMemUint32[0],
        offset: tempMemUint32[1],
        stride: tempMemUint32[2],
        formatSize: tempMemUint32[3],
        componentCount: tempMemUint32[4],
        /* The WASM API returns `0` for a scalar value. We clamp it to 1 as we strictly use it as a multiplier for get/set operations */
        arraySize: arraySize ? arraySize : 1,
        length: this.vertexCount,
        bufferType: attr !== MeshAttribute.JointId ? Float32Array : Uint16Array
      });
    }
    /**
     * Destroy and free the meshes memory.
     *
     * It is best practice to set the mesh variable to `null` after calling
     * destroy to prevent accidental use:
     *
     * ```js
     *   mesh.destroy();
     *   mesh = null;
     * ```
     *
     * Accessing the mesh after destruction behaves like accessing an empty
     * mesh.
     *
     * @since 0.9.0
     */
    destroy() {
      this.engine.wasm._wl_mesh_destroy(this._id);
      this.engine.meshes._destroy(this);
    }
    toString() {
      if (this.isDestroyed) {
        return "Mesh(destroyed)";
      }
      return `Mesh(${this._index})`;
    }
  };
  var MeshAttributeAccessor = class {
    /** Max number of elements. */
    length = 0;
    /** Wonderland Engine instance. @hidden */
    _engine;
    /** Attribute index. @hidden */
    _attribute = -1;
    /** Attribute offset. @hidden */
    _offset = 0;
    /** Attribute stride. @hidden */
    _stride = 0;
    /** Format size native enum. @hidden */
    _formatSize = 0;
    /** Number of components per vertex. @hidden */
    _componentCount = 0;
    /** Number of values per vertex. @hidden */
    _arraySize = 1;
    /**
     * Class to instantiate an ArrayBuffer to get/set values.
     */
    _bufferType;
    /**
     * Function to allocate temporary WASM memory. It is cached in the accessor to avoid
     * conditionals during get/set.
     */
    _tempBufferGetter;
    /**
     * Create a new instance.
     *
     * @note Please use {@link Mesh.attribute} to create a new instance.
     *
     * @param options Contains information about how to read the data.
     * @note Do not use this constructor. Instead, please use the {@link Mesh.attribute} method.
     *
     * @hidden
     */
    constructor(engine, options) {
      this._engine = engine;
      const wasm = this._engine.wasm;
      this._attribute = options.attribute;
      this._offset = options.offset;
      this._stride = options.stride;
      this._formatSize = options.formatSize;
      this._componentCount = options.componentCount;
      this._arraySize = options.arraySize;
      this._bufferType = options.bufferType;
      this.length = options.length;
      this._tempBufferGetter = this._bufferType === Float32Array ? wasm.getTempBufferF32.bind(wasm) : wasm.getTempBufferU16.bind(wasm);
    }
    /**
     * Create a new TypedArray to hold this attribute's values.
     *
     * This method is useful to create a view to hold the data to
     * pass to {@link get} and {@link set}
     *
     * Example:
     *
     * ```js
     * const vertexCount = 4;
     * const positionAttribute = mesh.attribute(MeshAttribute.Position);
     *
     * // A position has 3 floats per vertex. Thus, positions has length 3 * 4.
     * const positions = positionAttribute.createArray(vertexCount);
     * ```
     *
     * @param count The number of **vertices** expected.
     * @returns A TypedArray with the appropriate format to access the data
     */
    createArray(count = 1) {
      count = count > this.length ? this.length : count;
      return new this._bufferType(count * this._componentCount * this._arraySize);
    }
    get(index, out = this.createArray()) {
      if (out.length % this._componentCount !== 0) {
        throw new Error(`out.length, ${out.length} is not a multiple of the attribute vector components, ${this._componentCount}`);
      }
      const dest = this._tempBufferGetter(out.length);
      const elementSize = this._bufferType.BYTES_PER_ELEMENT;
      const destSize = elementSize * out.length;
      const srcFormatSize = this._formatSize * this._arraySize;
      const destFormatSize = this._componentCount * elementSize * this._arraySize;
      this._engine.wasm._wl_mesh_get_attribute_values(this._attribute, srcFormatSize, this._offset + index * this._stride, this._stride, destFormatSize, dest.byteOffset, destSize);
      for (let i2 = 0; i2 < out.length; ++i2)
        out[i2] = dest[i2];
      return out;
    }
    /**
     * Set attribute element.
     *
     * @param i Index
     * @param v Value to set the element to
     *
     * `v.length` needs to be a multiple of the attributes component count, see
     * {@link MeshAttribute}. If `v.length` is more than one multiple, it will be
     * filled with the next n attribute elements, which can reduce overhead
     * of this call.
     *
     * @returns Reference to self (for method chaining)
     */
    set(i2, v) {
      if (v.length % this._componentCount !== 0)
        throw new Error(`out.length, ${v.length} is not a multiple of the attribute vector components, ${this._componentCount}`);
      const elementSize = this._bufferType.BYTES_PER_ELEMENT;
      const srcSize = elementSize * v.length;
      const srcFormatSize = this._componentCount * elementSize * this._arraySize;
      const destFormatSize = this._formatSize * this._arraySize;
      const wasm = this._engine.wasm;
      if (v.buffer != wasm.HEAPU8.buffer) {
        const dest = this._tempBufferGetter(v.length);
        dest.set(v);
        v = dest;
      }
      wasm._wl_mesh_set_attribute_values(this._attribute, srcFormatSize, v.byteOffset, srcSize, destFormatSize, this._offset + i2 * this._stride, this._stride);
      return this;
    }
    /** Hosting engine instance. */
    get engine() {
      return this._engine;
    }
  };
  var temp2d = null;
  var Texture = class extends Resource {
    /**
     * @deprecated Use {@link TextureManager.create} instead, accessible via
     * {@link WonderlandEngine.textures}:
     *
     * ```js
     * const image = new Image();
     * image.onload = () => {
     *     const texture = engine.textures.create(image);
     * };
     * ```
     */
    constructor(engine, param) {
      if (isImageLike(param)) {
        const texture = engine.textures.create(param);
        super(engine, texture._index);
        return texture;
      }
      super(engine, param);
    }
    /**
     * Whether this texture is valid
     *
     * @deprecated Use {@link SceneResource#isDestroyed} instead.
     */
    get valid() {
      return !this.isDestroyed;
    }
    /**
     * Index in this manager.
     *
     * @deprecated Use {@link Texture.index} instead.
     */
    get id() {
      return this.index;
    }
    /** Update the texture to match the HTML element (e.g. reflect the current frame of a video). */
    update() {
      const image = this._imageIndex;
      if (!this.valid || !image)
        return;
      this.engine.wasm._wl_renderer_updateImage(image);
    }
    /** Width of the texture. */
    get width() {
      const element = this.htmlElement;
      if (element)
        return element.width;
      const wasm = this.engine.wasm;
      wasm._wl_image_size(this._imageIndex, wasm._tempMem);
      return wasm._tempMemUint32[0];
    }
    /** Height of the texture. */
    get height() {
      const element = this.htmlElement;
      if (element)
        return element.height;
      const wasm = this.engine.wasm;
      wasm._wl_image_size(this._imageIndex, wasm._tempMem);
      return wasm._tempMemUint32[1];
    }
    /**
     * Returns the html element associated to this texture.
     *
     * @note This accessor will return `null` if the image is compressed.
     */
    get htmlElement() {
      const image = this._imageIndex;
      if (!image)
        return null;
      const wasm = this.engine.wasm;
      const jsImageIndex = wasm._wl_image_get_jsImage_index(image);
      return wasm._images[jsImageIndex];
    }
    /**
     * Update a subrange on the texture to match the HTML element (e.g. reflect the current frame of a video).
     *
     * Usage:
     *
     * ```js
     * // Copies rectangle of pixel starting from (10, 20)
     * texture.updateSubImage(10, 20, 600, 400);
     * ```
     *
     * @param x x offset
     * @param y y offset
     * @param w width
     * @param h height
     */
    updateSubImage(x, y, w, h) {
      if (this.isDestroyed)
        return;
      const image = this._imageIndex;
      if (!image)
        return;
      const wasm = this.engine.wasm;
      const jsImageIndex = wasm._wl_image_get_jsImage_index(image);
      if (!temp2d) {
        const canvas2 = document.createElement("canvas");
        const ctx = canvas2.getContext("2d");
        if (!ctx) {
          throw new Error("Texture.updateSubImage(): Failed to obtain CanvasRenderingContext2D.");
        }
        temp2d = {
          canvas: canvas2,
          ctx
        };
      }
      const img = wasm._images[jsImageIndex];
      if (!img)
        return;
      temp2d.canvas.width = w;
      temp2d.canvas.height = h;
      temp2d.ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
      const yOffset = (img.videoHeight ?? img.height) - y - h;
      wasm._images[jsImageIndex] = temp2d.canvas;
      wasm._wl_renderer_updateImage(image, x, yOffset);
      wasm._images[jsImageIndex] = img;
    }
    /**
     * Destroy and free the texture's texture altas space and memory.
     *
     * It is best practice to set the texture variable to `null` after calling
     * destroy to prevent accidental use of the invalid texture:
     *
     * ```js
     *   texture.destroy();
     *   texture = null;
     * ```
     *
     * @since 0.9.0
     */
    destroy() {
      const wasm = this.engine.wasm;
      wasm._wl_texture_destroy(this._id);
      this.engine.textures._destroy(this);
    }
    toString() {
      if (this.isDestroyed) {
        return "Texture(destroyed)";
      }
      return `Texture(${this._index})`;
    }
    get _imageIndex() {
      return this.engine.wasm._wl_texture_get_image_index(this._id);
    }
  };
  var XR = class {
    /** Wonderland WASM bridge. @hidden */
    #wasm;
    #mode;
    constructor(wasm, mode) {
      this.#wasm = wasm;
      this.#mode = mode;
    }
    /** Current WebXR session mode */
    get sessionMode() {
      return this.#mode;
    }
    /** Current WebXR session */
    get session() {
      return this.#wasm.webxr_session;
    }
    /** Current WebXR frame */
    get frame() {
      return this.#wasm.webxr_frame;
    }
    referenceSpaceForType(type) {
      return this.#wasm.webxr_refSpaces[type] ?? null;
    }
    /** Set current reference space type used for retrieving eye, head, hand and joint poses */
    set currentReferenceSpace(refSpace) {
      this.#wasm.webxr_refSpace = refSpace;
      this.#wasm.webxr_refSpaceType = null;
      for (const type of Object.keys(this.#wasm.webxr_refSpaces)) {
        if (this.#wasm.webxr_refSpaces[type] === refSpace) {
          this.#wasm.webxr_refSpaceType = type;
        }
      }
    }
    /** Current reference space type used for retrieving eye, head, hand and joint poses */
    get currentReferenceSpace() {
      return this.#wasm.webxr_refSpace;
    }
    /** Current WebXR reference space type or `null` if not a default reference space */
    get currentReferenceSpaceType() {
      return this.#wasm.webxr_refSpaceType;
    }
    /** Current WebXR base layer  */
    get baseLayer() {
      return this.#wasm.webxr_baseLayer;
    }
    /** Current WebXR framebuffer */
    get framebuffers() {
      if (!Array.isArray(this.#wasm.webxr_fbo)) {
        return [this.#wasm.GL.framebuffers[this.#wasm.webxr_fbo]];
      }
      return this.#wasm.webxr_fbo.map((id) => this.#wasm.GL.framebuffers[id]);
    }
  };

  // node_modules/@wonderlandengine/api/dist/resources/material-manager.js
  var MaterialParamType;
  (function(MaterialParamType2) {
    MaterialParamType2[MaterialParamType2["UnsignedInt"] = 0] = "UnsignedInt";
    MaterialParamType2[MaterialParamType2["Int"] = 1] = "Int";
    MaterialParamType2[MaterialParamType2["HalfFloat"] = 2] = "HalfFloat";
    MaterialParamType2[MaterialParamType2["Float"] = 3] = "Float";
    MaterialParamType2[MaterialParamType2["Sampler"] = 4] = "Sampler";
    MaterialParamType2[MaterialParamType2["Font"] = 5] = "Font";
  })(MaterialParamType || (MaterialParamType = {}));
  var Material = class extends Resource {
    /**
     * @deprecated Use {@link MaterialManager#getTemplate} via {@link WonderlandEngine.materials}
     * to create a new material with a given pipeline:
     *
     * ```js
     * const PhongMaterial = engine.materials.getTemplate('Phong Opaque');
     * const material = new PhongMaterial();
     * material.setDiffuseColor([1, 0, 0]);
     * ```
     */
    constructor(engine, params) {
      if (typeof params !== "number") {
        if (!params?.pipeline)
          throw new Error("Missing parameter 'pipeline'");
        const template = engine.materials.getTemplate(params.pipeline);
        const material = new template();
        super(engine, material._index);
        return material;
      }
      super(engine, params);
    }
    /**
     * Check whether a parameter exists on this material.
     *
     * @param name The name to check.
     * @returns `true` if the parameter with name `name` exists on this material,
     *     `false` otherwise.
     */
    hasParameter(name) {
      const parameters = this.constructor.Parameters;
      return parameters && parameters.has(name);
    }
    /** @deprecated Use {@link pipeline} instead. */
    get shader() {
      return this.pipeline;
    }
    /** Name of the pipeline used by this material. */
    get pipeline() {
      const wasm = this.engine.wasm;
      return wasm.UTF8ToString(wasm._wl_material_get_pipeline(this._id));
    }
    /**
     * Create a copy of the underlying native material.
     *
     * @returns Material clone.
     */
    clone() {
      const index = this.engine.wasm._wl_material_clone(this._id);
      return this.engine.materials.wrap(index);
    }
    toString() {
      if (this.isDestroyed) {
        return "Material(destroyed)";
      }
      return `Material('${this.pipeline}', ${this._index})`;
    }
    /**
     * Wrap a native material index.
     *
     * @param engine Engine instance.
     * @param index The index.
     * @returns Material instance or `null` if index <= 0.
     *
     * @deprecated Use the {@link WonderlandEngine.materials} instead.
     */
    static wrap(engine, index) {
      return engine.materials.wrap(index);
    }
  };
  /** Proxy used to override prototypes of destroyed materials. */
  __publicField(Material, "_destroyedPrototype", createDestroyedProxy("material"));

  // node_modules/@wonderlandengine/api/dist/scene.js
  var SceneType;
  (function(SceneType2) {
    SceneType2[SceneType2["Prefab"] = 0] = "Prefab";
    SceneType2[SceneType2["Main"] = 1] = "Main";
    SceneType2[SceneType2["Dependency"] = 2] = "Dependency";
  })(SceneType || (SceneType = {}));

  // node_modules/@wonderlandengine/api/dist/utils/bitset.js
  function assert(bit) {
    if (bit >= 32) {
      throw new Error(`BitSet.enable(): Value ${bit} is over 31`);
    }
  }
  var BitSet = class {
    /** Enabled bits. @hidden */
    _bits = 0;
    /**
     * Enable the bit at the given index.
     *
     * @param bits A spread of all the bits to enable.
     * @returns Reference to self (for method chaining).
     */
    enable(...bits) {
      for (const bit of bits) {
        assert(bit);
        this._bits |= 1 << bit >>> 0;
      }
      return this;
    }
    /**
     * Enable all bits.
     *
     * @returns Reference to self (for method chaining).
     */
    enableAll() {
      this._bits = ~0;
      return this;
    }
    /**
     * Disable the bit at the given index.
     *
     * @param bits A spread of all the bits to disable.
     * @returns Reference to self (for method chaining).
     */
    disable(...bits) {
      for (const bit of bits) {
        assert(bit);
        this._bits &= ~(1 << bit >>> 0);
      }
      return this;
    }
    /**
     * Disable all bits.
     *
     * @returns Reference to self (for method chaining).
     */
    disableAll() {
      this._bits = 0;
      return this;
    }
    /**
     * Checker whether the bit is set or not.
     *
     * @param bit The bit to check.
     * @returns `true` if it's enabled, `false` otherwise.
     */
    enabled(bit) {
      return !!(this._bits & 1 << bit >>> 0);
    }
  };

  // node_modules/@wonderlandengine/api/dist/utils/logger.js
  var LogLevel;
  (function(LogLevel2) {
    LogLevel2[LogLevel2["Info"] = 0] = "Info";
    LogLevel2[LogLevel2["Warn"] = 1] = "Warn";
    LogLevel2[LogLevel2["Error"] = 2] = "Error";
  })(LogLevel || (LogLevel = {}));
  var Logger = class {
    /**
     * Bitset of enabled levels.
     *
     * @hidden
     */
    levels = new BitSet();
    /**
     * Bitset of enabled tags.
     *
     * @hidden
     */
    tags = new BitSet().enableAll();
    /**
     * Create a new logger instance.
     *
     * @param levels Default set of levels to enable.
     */
    constructor(...levels) {
      this.levels.enable(...levels);
    }
    /**
     * Log the message(s) using `console.log`.
     *
     * @param tag Tag represented by a positive integer.
     * @param msg A spread of message to log.
     * @returns Reference to self (for method chaining).
     */
    info(tag, ...msg) {
      if (this.levels.enabled(LogLevel.Info) && this.tags.enabled(tag)) {
        console.log(...msg);
      }
      return this;
    }
    /**
     * Log the message(s) using `console.warn`.
     *
     * @param tag Tag represented by a positive integer.
     * @param msg A spread of message to log.
     * @returns Reference to self (for method chaining).
     */
    warn(tag, ...msg) {
      if (this.levels.enabled(LogLevel.Warn) && this.tags.enabled(tag)) {
        console.warn(...msg);
      }
      return this;
    }
    /**
     * Log the message(s) using `console.error`.
     *
     * @param tag Tag represented by a positive integer.
     * @param msg A spread of message to log.
     * @returns Reference to self (for method chaining).
     */
    error(tag, ...msg) {
      if (this.levels.enabled(LogLevel.Error) && this.tags.enabled(tag)) {
        console.error(...msg);
      }
      return this;
    }
  };

  // node_modules/@wonderlandengine/api/dist/utils/cbor.js
  var kCborTagBignum = 2;
  var kCborTagNegativeBignum = 3;
  var kCborTagUint8 = 64;
  var kCborTagUint16 = 69;
  var kCborTagUint32 = 70;
  var kCborTagUint64 = 71;
  var kCborTagInt8 = 72;
  var kCborTagInt16 = 77;
  var kCborTagInt32 = 78;
  var kCborTagInt64 = 79;
  var kCborTagFloat32 = 85;
  var kCborTagFloat64 = 86;
  function decode(data, tagger = (_, value2) => value2, options = {}) {
    const { dictionary = "object" } = options;
    const dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
    let offset2 = 0;
    function commitRead(length6, value2) {
      offset2 += length6;
      return value2;
    }
    function readArrayBuffer(length6) {
      return commitRead(length6, data.subarray(offset2, offset2 + length6));
    }
    function readFloat16() {
      const POW_2_24 = 5960464477539063e-23;
      const tempArrayBuffer = new ArrayBuffer(4);
      const tempDataView = new DataView(tempArrayBuffer);
      const value2 = readUint16();
      const sign = value2 & 32768;
      let exponent = value2 & 31744;
      const fraction = value2 & 1023;
      if (exponent === 31744)
        exponent = 255 << 10;
      else if (exponent !== 0)
        exponent += 127 - 15 << 10;
      else if (fraction !== 0)
        return (sign ? -1 : 1) * fraction * POW_2_24;
      tempDataView.setUint32(0, sign << 16 | exponent << 13 | fraction << 13);
      return tempDataView.getFloat32(0);
    }
    function readFloat32() {
      return commitRead(4, dataView.getFloat32(offset2));
    }
    function readFloat64() {
      return commitRead(8, dataView.getFloat64(offset2));
    }
    function readUint8() {
      return commitRead(1, data[offset2]);
    }
    function readUint16() {
      return commitRead(2, dataView.getUint16(offset2));
    }
    function readUint32() {
      return commitRead(4, dataView.getUint32(offset2));
    }
    function readUint64() {
      return commitRead(8, dataView.getBigUint64(offset2));
    }
    function readBreak() {
      if (data[offset2] !== 255)
        return false;
      offset2 += 1;
      return true;
    }
    function readLength(additionalInformation) {
      if (additionalInformation < 24)
        return additionalInformation;
      if (additionalInformation === 24)
        return readUint8();
      if (additionalInformation === 25)
        return readUint16();
      if (additionalInformation === 26)
        return readUint32();
      if (additionalInformation === 27) {
        const integer = readUint64();
        if (integer <= Number.MAX_SAFE_INTEGER)
          return Number(integer);
        return integer;
      }
      if (additionalInformation === 31)
        return -1;
      throw new Error("CBORError: Invalid length encoding");
    }
    function readIndefiniteStringLength(majorType) {
      const initialByte = readUint8();
      if (initialByte === 255)
        return -1;
      const length6 = readLength(initialByte & 31);
      if (length6 < 0 || initialByte >> 5 !== majorType) {
        throw new Error("CBORError: Invalid indefinite length element");
      }
      return Number(length6);
    }
    function appendUtf16Data(utf16data, length6) {
      for (let i2 = 0; i2 < length6; ++i2) {
        let value2 = readUint8();
        if (value2 & 128) {
          if (value2 < 224) {
            value2 = (value2 & 31) << 6 | readUint8() & 63;
            length6 -= 1;
          } else if (value2 < 240) {
            value2 = (value2 & 15) << 12 | (readUint8() & 63) << 6 | readUint8() & 63;
            length6 -= 2;
          } else {
            value2 = (value2 & 7) << 18 | (readUint8() & 63) << 12 | (readUint8() & 63) << 6 | readUint8() & 63;
            length6 -= 3;
          }
        }
        if (value2 < 65536) {
          utf16data.push(value2);
        } else {
          value2 -= 65536;
          utf16data.push(55296 | value2 >> 10);
          utf16data.push(56320 | value2 & 1023);
        }
      }
    }
    function decodeItem() {
      const initialByte = readUint8();
      const majorType = initialByte >> 5;
      const additionalInformation = initialByte & 31;
      let i2;
      let length6;
      if (majorType === 7) {
        switch (additionalInformation) {
          case 25:
            return readFloat16();
          case 26:
            return readFloat32();
          case 27:
            return readFloat64();
        }
      }
      length6 = readLength(additionalInformation);
      if (length6 < 0 && (majorType < 2 || 6 < majorType)) {
        throw new Error("CBORError: Invalid length");
      }
      switch (majorType) {
        case 0:
          return length6;
        case 1:
          if (typeof length6 === "number") {
            return -1 - length6;
          }
          return -1n - length6;
        case 2: {
          if (length6 < 0) {
            const elements = [];
            let fullArrayLength = 0;
            while ((length6 = readIndefiniteStringLength(majorType)) >= 0) {
              fullArrayLength += length6;
              elements.push(readArrayBuffer(length6));
            }
            const fullArray = new Uint8Array(fullArrayLength);
            let fullArrayOffset = 0;
            for (i2 = 0; i2 < elements.length; ++i2) {
              fullArray.set(elements[i2], fullArrayOffset);
              fullArrayOffset += elements[i2].length;
            }
            return fullArray;
          }
          return readArrayBuffer(length6).slice();
        }
        case 3: {
          const utf16data = [];
          if (length6 < 0) {
            while ((length6 = readIndefiniteStringLength(majorType)) >= 0) {
              appendUtf16Data(utf16data, length6);
            }
          } else {
            appendUtf16Data(utf16data, length6);
          }
          let string = "";
          const DECODE_CHUNK_SIZE = 8192;
          for (i2 = 0; i2 < utf16data.length; i2 += DECODE_CHUNK_SIZE) {
            string += String.fromCharCode.apply(null, utf16data.slice(i2, i2 + DECODE_CHUNK_SIZE));
          }
          return string;
        }
        case 4: {
          let retArray;
          if (length6 < 0) {
            retArray = [];
            let index = 0;
            while (!readBreak()) {
              retArray.push(decodeItem());
            }
          } else {
            retArray = new Array(length6);
            for (i2 = 0; i2 < length6; ++i2) {
              retArray[i2] = decodeItem();
            }
          }
          return retArray;
        }
        case 5: {
          if (dictionary === "map") {
            const retMap = /* @__PURE__ */ new Map();
            for (i2 = 0; i2 < length6 || length6 < 0 && !readBreak(); ++i2) {
              const key = decodeItem();
              if (retMap.has(key)) {
                throw new Error("CBORError: Duplicate key encountered");
              }
              retMap.set(key, decodeItem());
            }
            return retMap;
          }
          const retObject = {};
          for (i2 = 0; i2 < length6 || length6 < 0 && !readBreak(); ++i2) {
            const key = decodeItem();
            if (Object.prototype.hasOwnProperty.call(retObject, key)) {
              throw new Error("CBORError: Duplicate key encountered");
            }
            retObject[key] = decodeItem();
          }
          return retObject;
        }
        case 6: {
          const value2 = decodeItem();
          const tag = length6;
          if (value2 instanceof Uint8Array) {
            switch (tag) {
              case kCborTagBignum:
              case kCborTagNegativeBignum:
                let num = value2.reduce((acc, n) => (acc << 8n) + BigInt(n), 0n);
                if (tag == kCborTagNegativeBignum) {
                  num = -1n - num;
                }
                return num;
              case kCborTagUint8:
                return value2;
              case kCborTagInt8:
                return new Int8Array(value2.buffer);
              case kCborTagUint16:
                return new Uint16Array(value2.buffer);
              case kCborTagInt16:
                return new Int16Array(value2.buffer);
              case kCborTagUint32:
                return new Uint32Array(value2.buffer);
              case kCborTagInt32:
                return new Int32Array(value2.buffer);
              case kCborTagUint64:
                return new BigUint64Array(value2.buffer);
              case kCborTagInt64:
                return new BigInt64Array(value2.buffer);
              case kCborTagFloat32:
                return new Float32Array(value2.buffer);
              case kCborTagFloat64:
                return new Float64Array(value2.buffer);
            }
          }
          return tagger(tag, value2);
        }
        case 7:
          switch (length6) {
            case 20:
              return false;
            case 21:
              return true;
            case 22:
              return null;
            case 23:
              return void 0;
            default:
              return length6;
          }
      }
    }
    const ret = decodeItem();
    if (offset2 !== data.byteLength) {
      throw new Error("CBORError: Remaining bytes");
    }
    return ret;
  }
  var CBOR = {
    decode
  };

  // node_modules/@wonderlandengine/api/dist/wasm.js
  var _componentDefaults = /* @__PURE__ */ new Map([
    [Type.Bool, false],
    [Type.Int, 0],
    [Type.Float, 0],
    [Type.String, ""],
    [Type.Enum, void 0],
    [Type.Object, null],
    [Type.Mesh, null],
    [Type.Texture, null],
    [Type.Material, null],
    [Type.Animation, null],
    [Type.Skin, null],
    [Type.Color, Float32Array.from([0, 0, 0, 1])],
    [Type.Vector2, Float32Array.from([0, 0])],
    [Type.Vector3, Float32Array.from([0, 0, 0])],
    [Type.Vector4, Float32Array.from([0, 0, 0, 0])]
  ]);
  function _setupDefaults(ctor) {
    for (const name in ctor.Properties) {
      const p = ctor.Properties[name];
      if (p.type === Type.Enum) {
        if (p.values?.length) {
          if (typeof p.default !== "number") {
            p.default = p.values.indexOf(p.default);
          }
          if (p.default < 0 || p.default >= p.values.length) {
            p.default = 0;
          }
        } else {
          p.default = void 0;
        }
      } else if ((p.type === Type.Color || p.type === Type.Vector2 || p.type === Type.Vector3 || p.type === Type.Vector4) && Array.isArray(p.default)) {
        p.default = Float32Array.from(p.default);
      } else if (p.default === void 0) {
        const cloner = p.cloner ?? defaultPropertyCloner;
        p.default = cloner.clone(p.type, _componentDefaults.get(p.type));
      }
      ctor.prototype[name] = p.default;
    }
  }
  function _setPropertyOrder(ctor) {
    ctor._propertyOrder = ctor.hasOwnProperty("Properties") ? Object.keys(ctor.Properties).sort() : [];
  }
  var WASM = class {
    /**
     * Emscripten worker field.
     *
     * @note This api is meant to be used internally.
     */
    worker = "";
    /**
     * Emscripten wasm field.
     *
     * @note This api is meant to be used internally.
     */
    wasm = null;
    /**
     * Emscripten canvas.
     *
     * @note This api is meant to be used internally.
     */
    canvas = null;
    /**
     * WebGPU device.
     *
     * @note This api is meant to be used internally.
     */
    preinitializedWebGPUDevice = null;
    /** Current WebXR  */
    /**
     * Emscripten WebXR session.
     *
     * @note This api is meant to be used internally.
     */
    webxr_session = null;
    /**
     * Emscripten WebXR request session callback.
     *
     * @note This api is meant to be used internally.
     */
    webxr_requestSession = null;
    /**
     * Emscripten WebXR offer session callback.
     *
     * @note This api is meant to be used internally.
     */
    webxr_offerSession = null;
    /**
     * Emscripten WebXR frame.
     *
     * @note This api is meant to be used internally.
     */
    webxr_frame = null;
    /**
     * Emscripten current WebXR reference space.
     *
     * @note This api is meant to be used internally.
     */
    webxr_refSpace = null;
    /**
     * Emscripten WebXR reference spaces.
     *
     * @note This api is meant to be used internally.
     */
    webxr_refSpaces = null;
    /**
     * Emscripten WebXR current reference space type.
     *
     * @note This api is meant to be used internally.
     */
    webxr_refSpaceType = null;
    /**
     * Emscripten WebXR GL projection layer.
     *
     * @note This api is meant to be used internally.
     */
    webxr_baseLayer = null;
    /**
     * Emscripten WebXR framebuffer scale factor.
     *
     * @note This api is meant to be used internally.
     */
    webxr_framebufferScaleFactor = 1;
    /**
     * Emscripten WebXR framebuffer(s).
     *
     * @note This api is meant to be used internally.
     */
    /* webxr_fbo will not get overwritten if we are rendering to the
     * default framebuffer, e.g., when using WebXR emulator. */
    webxr_fbo = 0;
    /**
     * Convert a WASM memory view to a JavaScript string.
     *
     * @param ptr Pointer start
     * @param ptrEnd Pointer end
     * @returns JavaScript string
     */
    UTF8ViewToString;
    /** Logger instance. */
    _log = new Logger();
    /** If `true`, logs will not spam the console on error. */
    _deactivate_component_on_error = false;
    /** Temporary memory pointer. */
    _tempMem = null;
    /** Temporary memory size. */
    _tempMemSize = 0;
    /** Temporary float memory view. */
    _tempMemFloat = null;
    /** Temporary int memory view. */
    _tempMemInt = null;
    /** Temporary uint8 memory view. */
    _tempMemUint8 = null;
    /** Temporary uint32 memory view. */
    _tempMemUint32 = null;
    /** Temporary uint16 memory view. */
    _tempMemUint16 = null;
    /** Loading screen .bin file data */
    _loadingScreen = null;
    /** List of callbacks triggered when the scene is loaded. */
    _sceneLoadedCallback = [];
    /** Image cache. */
    _images = [null];
    /** Component instances. */
    _components = null;
    /** Component Type info. */
    _componentTypes = [];
    /** Index per component type name. */
    _componentTypeIndices = {};
    /** Wonderland engine instance. */
    _engine = null;
    /**
     * `true` if this runtime is using physx.
     *
     * @note This api is meant to be used internally.
     */
    _withPhysX = false;
    /** Decoder for UTF8 `ArrayBuffer` to JavaScript string. */
    _utf8Decoder = new TextDecoder("utf8");
    /**
     * Registration index of {@link BrokenComponent}.
     *
     * This is used to return dummy instances when a component
     * isn't registered.
     *
     * @hidden
     */
    _brokenComponentIndex = 0;
    /**
     * Create a new instance of the WebAssembly <> API bridge.
     *
     * @param threads `true` if the runtime used has threads support
     */
    constructor(threads2) {
      if (threads2) {
        this.UTF8ViewToString = (s, e) => {
          if (!s)
            return "";
          return this._utf8Decoder.decode(this.HEAPU8.slice(s, e));
        };
      } else {
        this.UTF8ViewToString = (s, e) => {
          if (!s)
            return "";
          return this._utf8Decoder.decode(this.HEAPU8.subarray(s, e));
        };
      }
      this._brokenComponentIndex = this._registerComponent(BrokenComponent);
    }
    /**
     * Reset the cache of the library.
     *
     * @note Should only be called when tearing down the runtime.
     */
    reset() {
      this._wl_reset();
      this._components = null;
      this._images.length = 1;
      this.allocateTempMemory(1024);
      this._componentTypes = [];
      this._componentTypeIndices = {};
      this._brokenComponentIndex = this._registerComponent(BrokenComponent);
    }
    /**
     * Checks whether the given component is registered or not.
     *
     * @param ctor  A string representing the component typename (e.g., `'cursor-component'`).
     * @returns `true` if the component is registered, `false` otherwise.
     */
    isRegistered(type) {
      return type in this._componentTypeIndices;
    }
    /**
     * Register a legacy component in this Emscripten instance.
     *
     * @note This api is meant to be used internally.
     *
     * @param typeName The name of the component.
     * @param params An object containing the parameters (properties).
     * @param object The object's prototype.
     * @returns The registration index
     */
    _registerComponentLegacy(typeName, params, object) {
      const ctor = class CustomComponent extends Component {
      };
      ctor.TypeName = typeName;
      ctor.Properties = params;
      Object.assign(ctor.prototype, object);
      return this._registerComponent(ctor);
    }
    /**
     * Register a class component in this Emscripten instance.
     *
     * @note This api is meant to be used internally.
     *
     * @param ctor The class to register.
     * @returns The registration index.
     */
    _registerComponent(ctor) {
      if (!ctor.TypeName)
        throw new Error("no name provided for component.");
      if (!ctor.prototype._triggerInit) {
        throw new Error(`registerComponent(): Component ${ctor.TypeName} must extend Component`);
      }
      inheritProperties(ctor);
      _setupDefaults(ctor);
      _setPropertyOrder(ctor);
      const typeIndex = ctor.TypeName in this._componentTypeIndices ? this._componentTypeIndices[ctor.TypeName] : this._componentTypes.length;
      this._componentTypes[typeIndex] = ctor;
      this._componentTypeIndices[ctor.TypeName] = typeIndex;
      if (ctor === BrokenComponent)
        return typeIndex;
      this._log.info(LogTag.Engine, "Registered component", ctor.TypeName, `(class ${ctor.name})`, "with index", typeIndex);
      if (ctor.onRegister)
        ctor.onRegister(this._engine);
      return typeIndex;
    }
    /**
     * Allocate the requested amount of temporary memory
     * in this WASM instance.
     *
     * @param size The number of bytes to allocate
     */
    allocateTempMemory(size) {
      this._log.info(LogTag.Engine, "Allocating temp mem:", size);
      this._tempMemSize = size;
      if (this._tempMem)
        this._free(this._tempMem);
      this._tempMem = this._malloc(this._tempMemSize);
      this.updateTempMemory();
    }
    /**
     * @todo: Delete this and only keep `allocateTempMemory`
     *
     * @param size Number of bytes to allocate
     */
    requireTempMem(size) {
      if (this._tempMemSize >= size)
        return;
      this.allocateTempMemory(Math.ceil(size / 1024) * 1024);
    }
    /**
     * Update the temporary memory views. This must be called whenever the
     * temporary memory address changes.
     *
     * @note This api is meant to be used internally.
     */
    updateTempMemory() {
      this._tempMemFloat = new Float32Array(this.HEAP8.buffer, this._tempMem, this._tempMemSize >> 2);
      this._tempMemInt = new Int32Array(this.HEAP8.buffer, this._tempMem, this._tempMemSize >> 2);
      this._tempMemUint32 = new Uint32Array(this.HEAP8.buffer, this._tempMem, this._tempMemSize >> 2);
      this._tempMemUint16 = new Uint16Array(this.HEAP8.buffer, this._tempMem, this._tempMemSize >> 1);
      this._tempMemUint8 = new Uint8Array(this.HEAP8.buffer, this._tempMem, this._tempMemSize);
    }
    /**
     * Returns a uint8 buffer view on temporary WASM memory.
     *
     * **Note**: this method might allocate if the requested memory is bigger
     * than the current temporary memory allocated.
     *
     * @param count The number of **elements** required
     * @returns A {@link TypedArray} over the WASM memory
     */
    getTempBufferU8(count) {
      this.requireTempMem(count);
      return this._tempMemUint8;
    }
    /**
     * Returns a uint16 buffer view on temporary WASM memory.
     *
     * **Note**: this method might allocate if the requested memory is bigger
     * than the current temporary memory allocated.
     *
     * @param count The number of **elements** required
     * @returns A {@link TypedArray} over the WASM memory
     */
    getTempBufferU16(count) {
      this.requireTempMem(count * 2);
      return this._tempMemUint16;
    }
    /**
     * Returns a uint32 buffer view on temporary WASM memory.
     *
     * **Note**: this method might allocate if the requested memory is bigger
     * than the current temporary memory allocated.
     *
     * @param count The number of **elements** required.
     * @returns A {@link TypedArray} over the WASM memory.
     */
    getTempBufferU32(count) {
      this.requireTempMem(count * 4);
      return this._tempMemUint32;
    }
    /**
     * Returns a int32 buffer view on temporary WASM memory.
     *
     * **Note**: this method might allocate if the requested memory is bigger
     * than the current temporary memory allocated.
     *
     * @param count The number of **elements** required.
     * @returns A {@link TypedArray} over the WASM memory.
     */
    getTempBufferI32(count) {
      this.requireTempMem(count * 4);
      return this._tempMemInt;
    }
    /**
     * Returns a float32 buffer view on temporary WASM memory.
     *
     * **Note**: this method might allocate if the requested memory is bigger
     * than the current temporary memory allocated.
     *
     * @param count The number of **elements** required.
     * @returns A {@link TypedArray} over the WASM memory.
     */
    getTempBufferF32(count) {
      this.requireTempMem(count * 4);
      return this._tempMemFloat;
    }
    /**
     * Copy the string into temporary WASM memory and retrieve the pointer.
     *
     * @note This method will compute the strlen and append a `\0`.
     *
     * @note The result should be used **directly** otherwise it might get
     * overridden by any next call modifying the temporary memory.
     *
     * @param str The string to write to temporary memory
     * @param byteOffset The starting byte offset in the temporary memory at which
     *     the string should be written. This is useful when using multiple temporaries.
     * @return The temporary pointer onto the WASM memory
     */
    tempUTF8(str5, byteOffset = 0) {
      const strLen = this.lengthBytesUTF8(str5) + 1;
      this.requireTempMem(strLen + byteOffset);
      const ptr = this._tempMem + byteOffset;
      this.stringToUTF8(str5, ptr, strLen);
      return ptr;
    }
    /**
     * Copy the buffer into the WASM heap.
     *
     * @note The returned pointer must be freed.
     *
     * @param buffer The buffer to copy into the heap.
     * @returns An allocated pointer, that must be free after use.
     */
    copyBufferToHeap(buffer) {
      const size = buffer.byteLength;
      const ptr = this._malloc(size);
      this.HEAPU8.set(new Uint8Array(buffer), ptr);
      return ptr;
    }
    /**
     * Returns `true` if the runtime supports physx or not.
     */
    get withPhysX() {
      return this._withPhysX;
    }
    /**
     * Set the engine instance holding this bridge.
     *
     * @note This api is meant to be used internally.
     *
     * @param engine The engine instance.
     */
    _setEngine(engine) {
      this._engine = engine;
    }
    /* WebAssembly to JS call bridge. */
    _wljs_xr_session_start(mode) {
      if (this._engine.xr === null) {
        this._engine.xr = new XR(this, mode);
        this._engine.onXRSessionStart.notify(this.webxr_session, mode);
      }
    }
    _wljs_xr_session_end() {
      const startEmitter = this._engine.onXRSessionStart;
      if (startEmitter instanceof RetainEmitter)
        startEmitter.reset();
      this._engine.onXRSessionEnd.notify();
      this._engine.xr = null;
    }
    _wljs_xr_disable() {
      this._engine.arSupported = false;
      this._engine.vrSupported = false;
    }
    _wljs_init(withPhysX) {
      this._withPhysX = withPhysX;
      this.allocateTempMemory(1024);
    }
    _wljs_scene_switch(index) {
      const scene = this._engine._scenes[index];
      this._components = scene?._jsComponents ?? null;
    }
    _wljs_destroy_image(index) {
      const img = this._images[index];
      if (!img)
        return;
      this._images[index] = null;
      if (img.src !== void 0) {
        img.src = "";
      }
      if (img.onload !== void 0) {
        img.onload = null;
      }
      if (img.onerror !== void 0) {
        img.onerror = null;
      }
    }
    _wljs_objects_markDestroyed(sceneIndex, idsPtr, count) {
      const scene = this._engine._scenes[sceneIndex];
      const start = idsPtr >>> 1;
      for (let i2 = 0; i2 < count; ++i2) {
        const id = this.HEAPU16[start + i2];
        scene._destroyObject(id);
      }
    }
    _wljs_scene_initialize(sceneIndex, idsPtr, idsEnd, paramDataPtr, paramDataEndPtr, offsetsPtr, offsetsEndPtr) {
      const cbor = this.HEAPU8.subarray(paramDataPtr, paramDataEndPtr);
      const offsets = this.HEAPU32.subarray(offsetsPtr >>> 2, offsetsEndPtr >>> 2);
      const ids = this.HEAPU16.subarray(idsPtr >>> 1, idsEnd >>> 1);
      const engine = this._engine;
      const scene = engine._scenes[sceneIndex];
      const components = scene._jsComponents;
      let decoded;
      try {
        decoded = CBOR.decode(cbor);
      } catch (e) {
        this._log.error(LogTag.Engine, "Exception during component parameter decoding");
        this._log.error(LogTag.Component, e);
        return;
      }
      if (!Array.isArray(decoded)) {
        this._log.error(LogTag.Engine, "Parameter data must be an array");
        return;
      }
      if (decoded.length !== ids.length) {
        this._log.error(LogTag.Engine, `Parameter data has size ${decoded.length} but expected ${ids.length}`);
        return;
      }
      for (let i2 = 0; i2 < decoded.length; ++i2) {
        const id = Component._pack(sceneIndex, ids[i2]);
        const index = this._wl_get_js_component_index_for_id(id);
        const component = components[index];
        const ctor = component.constructor;
        if (ctor == BrokenComponent)
          continue;
        const paramNames = ctor._propertyOrder;
        const paramValues = decoded[i2];
        if (!Array.isArray(paramValues)) {
          this._log.error(LogTag.Engine, "Component parameter data must be an array");
          continue;
        }
        if (paramValues.length !== paramNames.length) {
          this._log.error(LogTag.Engine, `Component parameter data has size ${paramValues.length} but expected ${paramNames.length}`);
          continue;
        }
        for (let j = 0; j < paramValues.length; ++j) {
          const name = paramNames[j];
          const property2 = ctor.Properties[name];
          const type = property2.type;
          let value2 = paramValues[j];
          if (value2 === void 0) {
            const cloner = property2.cloner ?? defaultPropertyCloner;
            value2 = cloner.clone(type, property2.default);
            component[name] = value2;
            continue;
          }
          if (typeof value2 === "number") {
            value2 += offsets[type];
          }
          switch (type) {
            case Type.Bool:
            case Type.Int:
            case Type.Float:
            case Type.String:
            case Type.Enum:
            case Type.Vector2:
            case Type.Vector3:
            case Type.Vector4:
              break;
            case Type.Object:
              value2 = value2 ? scene.wrap(this._wl_object_id(scene._index, value2)) : null;
              break;
            case Type.Mesh:
              value2 = engine.meshes.wrap(value2);
              break;
            case Type.Texture:
              value2 = engine.textures.wrap(value2);
              break;
            case Type.Material:
              value2 = engine.materials.wrap(value2);
              break;
            case Type.Animation:
              value2 = scene.animations.wrap(value2);
              break;
            case Type.Skin:
              value2 = scene.skins.wrap(value2);
              break;
            case Type.Color:
              const max2 = (1 << value2.BYTES_PER_ELEMENT * 8) - 1;
              value2 = Float32Array.from(value2, (f, _) => f / max2);
              break;
          }
          component[name] = value2;
        }
      }
    }
    _wljs_set_component_param_translation(scene, component, param, valuePtr, valueEndPtr) {
      const components = this._engine._scenes[scene]._jsComponents;
      const comp = components[component];
      const value2 = this.UTF8ViewToString(valuePtr, valueEndPtr);
      const ctor = comp.constructor;
      const paramName = ctor._propertyOrder[param];
      comp[paramName] = value2;
    }
    _wljs_get_component_type_index(namePtr, nameEndPtr) {
      const typename = this.UTF8ViewToString(namePtr, nameEndPtr);
      const index = this._componentTypeIndices[typename];
      if (index === void 0) {
        return this._brokenComponentIndex;
      }
      return index;
    }
    _wljs_component_create(sceneIndex, index, id, type, object) {
      const scene = this._engine._scenes[sceneIndex];
      scene._components.createJs(index, id, type, object);
    }
    _wljs_component_init(scene, component) {
      const components = this._engine._scenes[scene]._jsComponents;
      const c = components[component];
      c._triggerInit();
    }
    _wljs_component_update(component, dt) {
      const c = this._components[component];
      c._triggerUpdate(dt);
    }
    _wljs_component_onActivate(component) {
      const c = this._components[component];
      c._triggerOnActivate();
    }
    _wljs_component_onDeactivate(component) {
      const c = this._components[component];
      c._triggerOnDeactivate();
    }
    _wljs_component_markDestroyed(sceneIndex, manager, componentId) {
      const scene = this._engine._scenes[sceneIndex];
      const component = scene._components.get(manager, componentId);
      component?._triggerOnDestroy();
    }
    _wljs_swap(scene, a, b) {
      const components = this._engine._scenes[scene]._jsComponents;
      const componentA = components[a];
      components[a] = components[b];
      components[b] = componentA;
    }
    _wljs_copy(srcSceneIndex, srcIndex, dstSceneIndex, dstIndex, offsetsPtr) {
      const srcScene = this._engine._scenes[srcSceneIndex];
      const dstScene = this._engine._scenes[dstSceneIndex];
      const destComp = dstScene._jsComponents[dstIndex];
      const srcComp = srcScene._jsComponents[srcIndex];
      try {
        destComp._copy(srcComp, offsetsPtr);
      } catch (e) {
        this._log.error(LogTag.Component, `Exception during ${destComp.type} copy() on object ${destComp.object.name}`);
        this._log.error(LogTag.Component, e);
      }
    }
    /**
     * Forward an animation event to a corresponding
     * {@link AnimationComponent}
     *
     * @note This api is meant to be used internally. Please have a look at
     * {@link AnimationComponent.onEvent} instead.
     *
     * @param componentId Component id in the manager
     * @param namePtr Pointer to UTF8 event name
     * @param nameEndPtr Pointer to end of UTF8 event name
     */
    _wljs_trigger_animationEvent(componentId, namePtr, nameEndPtr) {
      const scene = this._engine.scene;
      const comp = scene._components.wrapAnimation(componentId);
      const nameStr = this.UTF8ViewToString(namePtr, nameEndPtr);
      comp.onEvent.notify(nameStr);
    }
  };
  function throwInvalidRuntime(version) {
    return function() {
      throw new Error(`Feature added in version ${version}.
	\u2192 Please use a Wonderland Engine editor version >= ${version}`);
    };
  }
  var requireRuntime1_2_1 = throwInvalidRuntime("1.2.1");
  WASM.prototype._wl_text_component_get_wrapMode = requireRuntime1_2_1;
  WASM.prototype._wl_text_component_set_wrapMode = requireRuntime1_2_1;
  WASM.prototype._wl_text_component_get_wrapWidth = requireRuntime1_2_1;
  WASM.prototype._wl_text_component_set_wrapWidth = requireRuntime1_2_1;
  WASM.prototype._wl_font_get_outlineSize = requireRuntime1_2_1;
  WASM.prototype._wl_scene_create_chunked_start = requireRuntime1_2_1;
  WASM.prototype._wl_scene_create_chunked_buffer_size = requireRuntime1_2_1;
  WASM.prototype._wl_scene_create_chunked_next = requireRuntime1_2_1;
  WASM.prototype._wl_scene_create_chunked_abort = requireRuntime1_2_1;
  WASM.prototype._wl_scene_create_chunked_end_prefab = requireRuntime1_2_1;
  WASM.prototype._wl_scene_create_chunked_end_main = requireRuntime1_2_1;
  WASM.prototype._wl_scene_create_chunked_end_queued = requireRuntime1_2_1;

  // node_modules/@wonderlandengine/components/dist/8thwall-camera.js
  var ARCamera8thwall = class extends Component {
    /* 8thwall camera pipeline module name */
    name = "wonderland-engine-8thwall-camera";
    started = false;
    view = null;
    // cache camera
    position = [0, 0, 0];
    // cache 8thwall cam position
    rotation = [0, 0, 0, -1];
    // cache 8thwall cam rotation
    glTextureRenderer = null;
    // cache XR8.GlTextureRenderer.pipelineModule
    promptForDeviceMotion() {
      return new Promise(async (resolve, reject) => {
        window.dispatchEvent(new Event("8thwall-request-user-interaction"));
        window.addEventListener("8thwall-safe-to-request-permissions", async () => {
          try {
            const motionEvent = await DeviceMotionEvent.requestPermission();
            resolve(motionEvent);
          } catch (exception) {
            reject(exception);
          }
        });
      });
    }
    async getPermissions() {
      if (DeviceMotionEvent && DeviceMotionEvent.requestPermission) {
        try {
          const result = await DeviceMotionEvent.requestPermission();
          if (result !== "granted") {
            throw new Error("MotionEvent");
          }
        } catch (exception) {
          if (exception.name === "NotAllowedError") {
            const motionEvent = await this.promptForDeviceMotion();
            if (motionEvent !== "granted") {
              throw new Error("MotionEvent");
            }
          } else {
            throw new Error("MotionEvent");
          }
        }
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      } catch (exception) {
        throw new Error("Camera");
      }
    }
    init() {
      this.view = this.object.getComponent("view");
      this.onUpdate = this.onUpdate.bind(this);
      this.onAttach = this.onAttach.bind(this);
      this.onException = this.onException.bind(this);
      this.onCameraStatusChange = this.onCameraStatusChange.bind(this);
    }
    async start() {
      this.view = this.object.getComponent("view");
      if (!this.useCustomUIOverlays) {
        OverlaysHandler.init();
      }
      try {
        await this.getPermissions();
      } catch (error) {
        window.dispatchEvent(new CustomEvent("8thwall-permission-fail", { detail: error }));
        return;
      }
      await this.waitForXR8();
      XR8.XrController.configure({
        disableWorldTracking: false
      });
      this.glTextureRenderer = XR8.GlTextureRenderer.pipelineModule();
      XR8.addCameraPipelineModules([
        this.glTextureRenderer,
        XR8.XrController.pipelineModule(),
        this
      ]);
      const config = {
        cameraConfig: {
          direction: XR8.XrConfig.camera().BACK
        },
        canvas: Module.canvas,
        allowedDevices: XR8.XrConfig.device().ANY,
        ownRunLoop: false
      };
      XR8.run(config);
    }
    /**
     * @private
     * 8thwall pipeline function
     */
    onAttach(params) {
      this.started = true;
      this.engine.scene.colorClearEnabled = false;
      const gl = Module.ctx;
      const rot = this.object.rotationWorld;
      const pos = this.object.getTranslationWorld([]);
      this.position = Array.from(pos);
      this.rotation = Array.from(rot);
      XR8.XrController.updateCameraProjectionMatrix({
        origin: { x: pos[0], y: pos[1], z: pos[2] },
        facing: { x: rot[0], y: rot[1], z: rot[2], w: rot[3] },
        cam: {
          pixelRectWidth: Module.canvas.width,
          pixelRectHeight: Module.canvas.height,
          nearClipPlane: this.view.near,
          farClipPlane: this.view.far
        }
      });
      this.engine.scene.onPreRender.push(() => {
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
        XR8.runPreRender(Date.now());
        XR8.runRender();
      });
      this.engine.scene.onPostRender.push(() => {
        XR8.runPostRender(Date.now());
      });
    }
    /**
     * @private
     * 8thwall pipeline function
     */
    onCameraStatusChange(e) {
      if (e && e.status === "failed") {
        this.onException(new Error(`Camera failed with status: ${e.status}`));
      }
    }
    /**
     * @private
     * 8thwall pipeline function
     */
    onUpdate(e) {
      if (!e.processCpuResult.reality)
        return;
      const { rotation, position, intrinsics } = e.processCpuResult.reality;
      this.rotation[0] = rotation.x;
      this.rotation[1] = rotation.y;
      this.rotation[2] = rotation.z;
      this.rotation[3] = rotation.w;
      this.position[0] = position.x;
      this.position[1] = position.y;
      this.position[2] = position.z;
      if (intrinsics) {
        const projectionMatrix = this.view.projectionMatrix;
        for (let i2 = 0; i2 < 16; i2++) {
          if (Number.isFinite(intrinsics[i2])) {
            projectionMatrix[i2] = intrinsics[i2];
          }
        }
      }
      if (position && rotation) {
        this.object.rotationWorld = this.rotation;
        this.object.setTranslationWorld(this.position);
      }
    }
    /**
     * @private
     * 8thwall pipeline function
     */
    onException(error) {
      console.error("8thwall exception:", error);
      window.dispatchEvent(new CustomEvent("8thwall-error", { detail: error }));
    }
    waitForXR8() {
      return new Promise((resolve, _rej) => {
        if (window.XR8) {
          resolve();
        } else {
          window.addEventListener("xrloaded", () => resolve());
        }
      });
    }
  };
  __publicField(ARCamera8thwall, "TypeName", "8thwall-camera");
  __publicField(ARCamera8thwall, "Properties", {
    /** Override the WL html overlays for handling camera/motion permissions and error handling */
    useCustomUIOverlays: { type: Type.Bool, default: false }
  });
  var OverlaysHandler = {
    init: function() {
      this.handleRequestUserInteraction = this.handleRequestUserInteraction.bind(this);
      this.handlePermissionFail = this.handlePermissionFail.bind(this);
      this.handleError = this.handleError.bind(this);
      window.addEventListener("8thwall-request-user-interaction", this.handleRequestUserInteraction);
      window.addEventListener("8thwall-permission-fail", this.handlePermissionFail);
      window.addEventListener("8thwall-error", this.handleError);
    },
    handleRequestUserInteraction: function() {
      const overlay = this.showOverlay(requestPermissionOverlay);
      window.addEventListener("8thwall-safe-to-request-permissions", () => {
        overlay.remove();
      });
    },
    handlePermissionFail: function(_reason) {
      this.showOverlay(failedPermissionOverlay);
    },
    handleError: function(_error) {
      this.showOverlay(runtimeErrorOverlay);
    },
    showOverlay: function(htmlContent) {
      const overlay = document.createElement("div");
      overlay.innerHTML = htmlContent;
      document.body.appendChild(overlay);
      return overlay;
    }
  };
  var requestPermissionOverlay = `
<style>
  #request-permission-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
    font-family: sans-serif;
  }

  .request-permission-overlay_title {
    margin: 30px;
    font-size: 32px;
  }

  .request-permission-overlay_button {
    background-color: #e80086;
    font-size: 22px;
    padding: 10px 30px;
    color: #fff;
    border-radius: 15px;
    border: none;
  }
</style>

<div id="request-permission-overlay">
  <div class="request-permission-overlay_title">This app requires to use your camera and motion sensors</div>

  <button class="request-permission-overlay_button" onclick="window.dispatchEvent(new Event('8thwall-safe-to-request-permissions'))">OK</button>
</div>`;
  var failedPermissionOverlay = `
<style>
  #failed-permission-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
    font-family: sans-serif;
  }

  .failed-permission-overlay_title {
    margin: 30px;
    font-size: 32px;
  }

  .failed-permission-overlay_button {
    background-color: #e80086;
    font-size: 22px;
    padding: 10px 30px;
    color: #fff;
    border-radius: 15px;
    border: none;
  }
</style>

<div id="failed-permission-overlay">
  <div class="failed-permission-overlay_title">Failed to grant permissions. Reset the the permissions and refresh the page.</div>

  <button class="failed-permission-overlay_button" onclick="window.location.reload()">Refresh the page</button>
</div>`;
  var runtimeErrorOverlay = `
<style>
  #wall-error-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
    font-family: sans-serif;
  }

  .wall-error-overlay_title {
    margin: 30px;
    font-size: 32px;
  }

  .wall-error-overlay_button {
    background-color: #e80086;
    font-size: 22px;
    padding: 10px 30px;
    color: #fff;
    border-radius: 15px;
    border: none;
  }
</style>

<div id="wall-error-overlay">
  <div class="wall-error-overlay_title">Error has occurred. Please reload the page</div>

  <button class="wall-error-overlay_button" onclick="window.location.reload()">Reload</button>
</div>`;

  // node_modules/@wonderlandengine/components/dist/utils/webxr.js
  var tempVec = new Float32Array(3);
  var tempQuat = new Float32Array(4);
  function setXRRigidTransformLocal(o, transform) {
    const r = transform.orientation;
    tempQuat[0] = r.x;
    tempQuat[1] = r.y;
    tempQuat[2] = r.z;
    tempQuat[3] = r.w;
    const t = transform.position;
    tempVec[0] = t.x;
    tempVec[1] = t.y;
    tempVec[2] = t.z;
    o.resetPositionRotation();
    o.setRotationLocal(tempQuat);
    o.translateLocal(tempVec);
  }

  // node_modules/@wonderlandengine/components/dist/anchor.js
  var __decorate2 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i2 = decorators.length - 1; i2 >= 0; i2--)
        if (d = decorators[i2])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var tempVec3 = new Float32Array(3);
  var tempQuat2 = new Float32Array(4);
  var _anchors, _addAnchor, addAnchor_fn, _removeAnchor, removeAnchor_fn, _getFrame, getFrame_fn, _createAnchor, createAnchor_fn, _onAddAnchor, onAddAnchor_fn, _onRestoreAnchor, onRestoreAnchor_fn, _onCreate, onCreate_fn;
  var _Anchor = class extends Component {
    constructor() {
      super(...arguments);
      __privateAdd(this, _getFrame);
      __privateAdd(this, _createAnchor);
      __privateAdd(this, _onAddAnchor);
      __privateAdd(this, _onRestoreAnchor);
      __privateAdd(this, _onCreate);
      __publicField(this, "persist", false);
      /** Unique identifier to load a persistent anchor from, or empty/null if unknown */
      __publicField(this, "uuid", null);
      /** The xrAnchor, if created */
      __publicField(this, "xrAnchor", null);
      /** Emits events when the anchor is created either by being restored or newly created */
      __publicField(this, "onCreate", new Emitter());
      /** Whether the anchor is currently being tracked */
      __publicField(this, "visible", false);
      /** Emits an event when this anchor starts tracking */
      __publicField(this, "onTrackingFound", new Emitter());
      /** Emits an event when this anchor stops tracking */
      __publicField(this, "onTrackingLost", new Emitter());
      /** XRFrame to use for creating the anchor */
      __publicField(this, "xrFrame", null);
      /** XRHitTestResult to use for creating the anchor */
      __publicField(this, "xrHitResult", null);
    }
    /** Retrieve all anchors of the current scene */
    static getAllAnchors() {
      return __privateGet(_Anchor, _anchors);
    }
    /**
     * Create a new anchor
     *
     * @param o Object to attach the component to
     * @param params Parameters for the anchor component
     * @param frame XRFrame to use for anchor cration, if null, will use the current frame if available
     * @param hitResult Optional hit-test result to create the anchor with
     * @returns Promise for the newly created anchor component
     */
    static create(o, params, frame, hitResult) {
      const a = o.addComponent(_Anchor, { ...params, active: false });
      if (a === null)
        return null;
      a.xrHitResult = hitResult ?? null;
      a.xrFrame = frame ?? null;
      a.onCreate.once(() => (a.xrFrame = null, a.xrHitResult = null));
      a.active = true;
      return a.onCreate.promise();
    }
    start() {
      if (this.uuid && this.engine.xr) {
        this.persist = true;
        if (this.engine.xr.session.restorePersistentAnchor === void 0) {
          console.warn("anchor: Persistent anchors are not supported by your client. Ignoring persist property.");
        }
        this.engine.xr.session.restorePersistentAnchor(this.uuid).then(__privateMethod(this, _onRestoreAnchor, onRestoreAnchor_fn).bind(this));
      } else if (__privateMethod(this, _getFrame, getFrame_fn).call(this)) {
        __privateMethod(this, _createAnchor, createAnchor_fn).call(this).then(__privateMethod(this, _onAddAnchor, onAddAnchor_fn).bind(this));
      } else {
        throw new Error("Anchors can only be created during the XR frame in an active XR session");
      }
    }
    update() {
      if (!this.xrAnchor || !this.engine.xr)
        return;
      const pose = this.engine.xr.frame.getPose(this.xrAnchor.anchorSpace, this.engine.xr.currentReferenceSpace);
      const visible = !!pose;
      if (visible != this.visible) {
        this.visible = visible;
        (visible ? this.onTrackingFound : this.onTrackingLost).notify(this);
      }
      if (pose) {
        setXRRigidTransformLocal(this.object, pose.transform);
      }
    }
    onDestroy() {
      var _a;
      __privateMethod(_a = _Anchor, _removeAnchor, removeAnchor_fn).call(_a, this);
    }
  };
  var Anchor = _Anchor;
  _anchors = new WeakMap();
  _addAnchor = new WeakSet();
  addAnchor_fn = function(anchor) {
    __privateGet(_Anchor, _anchors).push(anchor);
  };
  _removeAnchor = new WeakSet();
  removeAnchor_fn = function(anchor) {
    const index = __privateGet(_Anchor, _anchors).indexOf(anchor);
    if (index < 0)
      return;
    __privateGet(_Anchor, _anchors).splice(index, 1);
  };
  _getFrame = new WeakSet();
  getFrame_fn = function() {
    return this.xrFrame || this.engine.xr.frame;
  };
  _createAnchor = new WeakSet();
  createAnchor_fn = async function() {
    if (!__privateMethod(this, _getFrame, getFrame_fn).call(this).createAnchor) {
      throw new Error("Cannot create anchor - anchors not supported, did you enable the 'anchors' WebXR feature?");
    }
    if (this.xrHitResult) {
      if (this.xrHitResult.createAnchor === void 0) {
        throw new Error("Requested anchor on XRHitTestResult, but WebXR hit-test feature is not available.");
      }
      return this.xrHitResult.createAnchor();
    } else {
      this.object.getTranslationWorld(tempVec3);
      tempQuat2.set(this.object.rotationWorld);
      const rotation = tempQuat2;
      const anchorPose = new XRRigidTransform({ x: tempVec3[0], y: tempVec3[1], z: tempVec3[2] }, { x: rotation[0], y: rotation[1], z: rotation[2], w: rotation[3] });
      return __privateMethod(this, _getFrame, getFrame_fn).call(this)?.createAnchor(anchorPose, this.engine.xr.currentReferenceSpace);
    }
  };
  _onAddAnchor = new WeakSet();
  onAddAnchor_fn = function(anchor) {
    if (!anchor)
      return;
    if (this.persist) {
      if (anchor.requestPersistentHandle !== void 0) {
        anchor.requestPersistentHandle().then((uuid) => {
          var _a;
          this.uuid = uuid;
          __privateMethod(this, _onCreate, onCreate_fn).call(this, anchor);
          __privateMethod(_a = _Anchor, _addAnchor, addAnchor_fn).call(_a, this);
        });
        return;
      } else {
        console.warn("anchor: Persistent anchors are not supported by your client. Ignoring persist property.");
      }
    }
    __privateMethod(this, _onCreate, onCreate_fn).call(this, anchor);
  };
  _onRestoreAnchor = new WeakSet();
  onRestoreAnchor_fn = function(anchor) {
    __privateMethod(this, _onCreate, onCreate_fn).call(this, anchor);
  };
  _onCreate = new WeakSet();
  onCreate_fn = function(anchor) {
    this.xrAnchor = anchor;
    this.onCreate.notify(this);
  };
  __privateAdd(Anchor, _addAnchor);
  __privateAdd(Anchor, _removeAnchor);
  __publicField(Anchor, "TypeName", "anchor");
  /* Static management of all anchors */
  __privateAdd(Anchor, _anchors, []);
  __decorate2([
    property.bool(false)
  ], Anchor.prototype, "persist", void 0);
  __decorate2([
    property.string()
  ], Anchor.prototype, "uuid", void 0);

  // node_modules/@wonderlandengine/components/dist/cursor-target.js
  var CursorTarget = class extends Component {
    /** Emitter for events when the target is hovered */
    onHover = new Emitter();
    /** Emitter for events when the target is unhovered */
    onUnhover = new Emitter();
    /** Emitter for events when the target is clicked */
    onClick = new Emitter();
    /** Emitter for events when the cursor moves on the target */
    onMove = new Emitter();
    /** Emitter for events when the user pressed the select button on the target */
    onDown = new Emitter();
    /** Emitter for events when the user unpressed the select button on the target */
    onUp = new Emitter();
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    this.onHover.add(f);
     */
    addHoverFunction(f) {
      this.onHover.add(f);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    this.onHover.remove(f);
     */
    removeHoverFunction(f) {
      this.onHover.remove(f);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    this.onUnhover.add(f);
     */
    addUnHoverFunction(f) {
      this.onUnhover.add(f);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    this.onUnhover.remove(f);
     */
    removeUnHoverFunction(f) {
      this.onUnhover.remove(f);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    this.onClick.add(f);
     */
    addClickFunction(f) {
      this.onClick.add(f);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    component.onClick.remove(f);
     */
    removeClickFunction(f) {
      this.onClick.remove(f);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    component.onMove.add(f);
     */
    addMoveFunction(f) {
      this.onMove.add(f);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    component.onMove.remove(f);
     */
    removeMoveFunction(f) {
      this.onMove.remove(f);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    component.onDown.add(f);
     */
    addDownFunction(f) {
      this.onDown.add(f);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    component.onDown.remove(f);
     */
    removeDownFunction(f) {
      this.onDown.remove(f);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    component.onUp.add(f);
     */
    addUpFunction(f) {
      this.onUp.add(f);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    component.onUp.remove(f);
     */
    removeUpFunction(f) {
      this.onUp.remove(f);
    }
  };
  __publicField(CursorTarget, "TypeName", "cursor-target");
  __publicField(CursorTarget, "Properties", {});

  // node_modules/gl-matrix/esm/common.js
  var EPSILON = 1e-6;
  var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
  var RANDOM = Math.random;
  var degree = Math.PI / 180;
  if (!Math.hypot)
    Math.hypot = function() {
      var y = 0, i2 = arguments.length;
      while (i2--) {
        y += arguments[i2] * arguments[i2];
      }
      return Math.sqrt(y);
    };

  // node_modules/gl-matrix/esm/mat3.js
  function create() {
    var out = new ARRAY_TYPE(9);
    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[5] = 0;
      out[6] = 0;
      out[7] = 0;
    }
    out[0] = 1;
    out[4] = 1;
    out[8] = 1;
    return out;
  }

  // node_modules/gl-matrix/esm/mat4.js
  var mat4_exports = {};
  __export(mat4_exports, {
    add: () => add,
    adjoint: () => adjoint,
    clone: () => clone,
    copy: () => copy,
    create: () => create2,
    determinant: () => determinant,
    equals: () => equals,
    exactEquals: () => exactEquals,
    frob: () => frob,
    fromQuat: () => fromQuat,
    fromQuat2: () => fromQuat2,
    fromRotation: () => fromRotation,
    fromRotationTranslation: () => fromRotationTranslation,
    fromRotationTranslationScale: () => fromRotationTranslationScale,
    fromRotationTranslationScaleOrigin: () => fromRotationTranslationScaleOrigin,
    fromScaling: () => fromScaling,
    fromTranslation: () => fromTranslation,
    fromValues: () => fromValues,
    fromXRotation: () => fromXRotation,
    fromYRotation: () => fromYRotation,
    fromZRotation: () => fromZRotation,
    frustum: () => frustum,
    getRotation: () => getRotation,
    getScaling: () => getScaling,
    getTranslation: () => getTranslation,
    identity: () => identity,
    invert: () => invert,
    lookAt: () => lookAt,
    mul: () => mul,
    multiply: () => multiply,
    multiplyScalar: () => multiplyScalar,
    multiplyScalarAndAdd: () => multiplyScalarAndAdd,
    ortho: () => ortho,
    orthoNO: () => orthoNO,
    orthoZO: () => orthoZO,
    perspective: () => perspective,
    perspectiveFromFieldOfView: () => perspectiveFromFieldOfView,
    perspectiveNO: () => perspectiveNO,
    perspectiveZO: () => perspectiveZO,
    rotate: () => rotate,
    rotateX: () => rotateX,
    rotateY: () => rotateY,
    rotateZ: () => rotateZ,
    scale: () => scale,
    set: () => set,
    str: () => str,
    sub: () => sub,
    subtract: () => subtract,
    targetTo: () => targetTo,
    translate: () => translate,
    transpose: () => transpose
  });
  function create2() {
    var out = new ARRAY_TYPE(16);
    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
    }
    out[0] = 1;
    out[5] = 1;
    out[10] = 1;
    out[15] = 1;
    return out;
  }
  function clone(a) {
    var out = new ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  function copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    var out = new ARRAY_TYPE(16);
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
  }
  function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
  }
  function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function transpose(out, a) {
    if (out === a) {
      var a01 = a[1], a02 = a[2], a03 = a[3];
      var a12 = a[6], a13 = a[7];
      var a23 = a[11];
      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a01;
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a02;
      out[9] = a12;
      out[11] = a[14];
      out[12] = a03;
      out[13] = a13;
      out[14] = a23;
    } else {
      out[0] = a[0];
      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a[1];
      out[5] = a[5];
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a[2];
      out[9] = a[6];
      out[10] = a[10];
      out[11] = a[14];
      out[12] = a[3];
      out[13] = a[7];
      out[14] = a[11];
      out[15] = a[15];
    }
    return out;
  }
  function invert(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32;
    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) {
      return null;
    }
    det = 1 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
  }
  function adjoint(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
    out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
    out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
    out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
    out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
    out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
    return out;
  }
  function determinant(a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32;
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  }
  function multiply(out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
  }
  function translate(out, a, v) {
    var x = v[0], y = v[1], z = v[2];
    var a00, a01, a02, a03;
    var a10, a11, a12, a13;
    var a20, a21, a22, a23;
    if (a === out) {
      out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
      out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
      out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
      out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
      a00 = a[0];
      a01 = a[1];
      a02 = a[2];
      a03 = a[3];
      a10 = a[4];
      a11 = a[5];
      a12 = a[6];
      a13 = a[7];
      a20 = a[8];
      a21 = a[9];
      a22 = a[10];
      a23 = a[11];
      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;
      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;
      out[9] = a21;
      out[10] = a22;
      out[11] = a23;
      out[12] = a00 * x + a10 * y + a20 * z + a[12];
      out[13] = a01 * x + a11 * y + a21 * z + a[13];
      out[14] = a02 * x + a12 * y + a22 * z + a[14];
      out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }
    return out;
  }
  function scale(out, a, v) {
    var x = v[0], y = v[1], z = v[2];
    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  function rotate(out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2];
    var len4 = Math.hypot(x, y, z);
    var s, c, t;
    var a00, a01, a02, a03;
    var a10, a11, a12, a13;
    var a20, a21, a22, a23;
    var b00, b01, b02;
    var b10, b11, b12;
    var b20, b21, b22;
    if (len4 < EPSILON) {
      return null;
    }
    len4 = 1 / len4;
    x *= len4;
    y *= len4;
    z *= len4;
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    b00 = x * x * t + c;
    b01 = y * x * t + z * s;
    b02 = z * x * t - y * s;
    b10 = x * y * t - z * s;
    b11 = y * y * t + c;
    b12 = z * y * t + x * s;
    b20 = x * z * t + y * s;
    b21 = y * z * t - x * s;
    b22 = z * z * t + c;
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;
    if (a !== out) {
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    return out;
  }
  function rotateX(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a10 = a[4];
    var a11 = a[5];
    var a12 = a[6];
    var a13 = a[7];
    var a20 = a[8];
    var a21 = a[9];
    var a22 = a[10];
    var a23 = a[11];
    if (a !== out) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
  }
  function rotateY(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a03 = a[3];
    var a20 = a[8];
    var a21 = a[9];
    var a22 = a[10];
    var a23 = a[11];
    if (a !== out) {
      out[4] = a[4];
      out[5] = a[5];
      out[6] = a[6];
      out[7] = a[7];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
  }
  function rotateZ(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a03 = a[3];
    var a10 = a[4];
    var a11 = a[5];
    var a12 = a[6];
    var a13 = a[7];
    if (a !== out) {
      out[8] = a[8];
      out[9] = a[9];
      out[10] = a[10];
      out[11] = a[11];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
  }
  function fromTranslation(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
  function fromScaling(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = v[1];
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = v[2];
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromRotation(out, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2];
    var len4 = Math.hypot(x, y, z);
    var s, c, t;
    if (len4 < EPSILON) {
      return null;
    }
    len4 = 1 / len4;
    x *= len4;
    y *= len4;
    z *= len4;
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;
    out[0] = x * x * t + c;
    out[1] = y * x * t + z * s;
    out[2] = z * x * t - y * s;
    out[3] = 0;
    out[4] = x * y * t - z * s;
    out[5] = y * y * t + c;
    out[6] = z * y * t + x * s;
    out[7] = 0;
    out[8] = x * z * t + y * s;
    out[9] = y * z * t - x * s;
    out[10] = z * z * t + c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromXRotation(out, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = c;
    out[6] = s;
    out[7] = 0;
    out[8] = 0;
    out[9] = -s;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromYRotation(out, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    out[0] = c;
    out[1] = 0;
    out[2] = -s;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = s;
    out[9] = 0;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromZRotation(out, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    out[0] = c;
    out[1] = s;
    out[2] = 0;
    out[3] = 0;
    out[4] = -s;
    out[5] = c;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromRotationTranslation(out, q, v) {
    var x = q[0], y = q[1], z = q[2], w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
  function fromQuat2(out, a) {
    var translation = new ARRAY_TYPE(3);
    var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7];
    var magnitude = bx * bx + by * by + bz * bz + bw * bw;
    if (magnitude > 0) {
      translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
      translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
      translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
    } else {
      translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
      translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
      translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
    }
    fromRotationTranslation(out, a, translation);
    return out;
  }
  function getTranslation(out, mat) {
    out[0] = mat[12];
    out[1] = mat[13];
    out[2] = mat[14];
    return out;
  }
  function getScaling(out, mat) {
    var m11 = mat[0];
    var m12 = mat[1];
    var m13 = mat[2];
    var m21 = mat[4];
    var m22 = mat[5];
    var m23 = mat[6];
    var m31 = mat[8];
    var m32 = mat[9];
    var m33 = mat[10];
    out[0] = Math.hypot(m11, m12, m13);
    out[1] = Math.hypot(m21, m22, m23);
    out[2] = Math.hypot(m31, m32, m33);
    return out;
  }
  function getRotation(out, mat) {
    var scaling = new ARRAY_TYPE(3);
    getScaling(scaling, mat);
    var is1 = 1 / scaling[0];
    var is2 = 1 / scaling[1];
    var is3 = 1 / scaling[2];
    var sm11 = mat[0] * is1;
    var sm12 = mat[1] * is2;
    var sm13 = mat[2] * is3;
    var sm21 = mat[4] * is1;
    var sm22 = mat[5] * is2;
    var sm23 = mat[6] * is3;
    var sm31 = mat[8] * is1;
    var sm32 = mat[9] * is2;
    var sm33 = mat[10] * is3;
    var trace = sm11 + sm22 + sm33;
    var S = 0;
    if (trace > 0) {
      S = Math.sqrt(trace + 1) * 2;
      out[3] = 0.25 * S;
      out[0] = (sm23 - sm32) / S;
      out[1] = (sm31 - sm13) / S;
      out[2] = (sm12 - sm21) / S;
    } else if (sm11 > sm22 && sm11 > sm33) {
      S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
      out[3] = (sm23 - sm32) / S;
      out[0] = 0.25 * S;
      out[1] = (sm12 + sm21) / S;
      out[2] = (sm31 + sm13) / S;
    } else if (sm22 > sm33) {
      S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
      out[3] = (sm31 - sm13) / S;
      out[0] = (sm12 + sm21) / S;
      out[1] = 0.25 * S;
      out[2] = (sm23 + sm32) / S;
    } else {
      S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
      out[3] = (sm12 - sm21) / S;
      out[0] = (sm31 + sm13) / S;
      out[1] = (sm23 + sm32) / S;
      out[2] = 0.25 * S;
    }
    return out;
  }
  function fromRotationTranslationScale(out, q, v, s) {
    var x = q[0], y = q[1], z = q[2], w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var sx = s[0];
    var sy = s[1];
    var sz = s[2];
    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
  function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
    var x = q[0], y = q[1], z = q[2], w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var sx = s[0];
    var sy = s[1];
    var sz = s[2];
    var ox = o[0];
    var oy = o[1];
    var oz = o[2];
    var out0 = (1 - (yy + zz)) * sx;
    var out1 = (xy + wz) * sx;
    var out2 = (xz - wy) * sx;
    var out4 = (xy - wz) * sy;
    var out5 = (1 - (xx + zz)) * sy;
    var out6 = (yz + wx) * sy;
    var out8 = (xz + wy) * sz;
    var out9 = (yz - wx) * sz;
    var out10 = (1 - (xx + yy)) * sz;
    out[0] = out0;
    out[1] = out1;
    out[2] = out2;
    out[3] = 0;
    out[4] = out4;
    out[5] = out5;
    out[6] = out6;
    out[7] = 0;
    out[8] = out8;
    out[9] = out9;
    out[10] = out10;
    out[11] = 0;
    out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
    out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
    out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
    out[15] = 1;
    return out;
  }
  function fromQuat(out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var yx = y * x2;
    var yy = y * y2;
    var zx = z * x2;
    var zy = z * y2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;
    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;
    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function frustum(out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left);
    var tb = 1 / (top - bottom);
    var nf = 1 / (near - far);
    out[0] = near * 2 * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = near * 2 * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = far * near * 2 * nf;
    out[15] = 0;
    return out;
  }
  function perspectiveNO(out, fovy, aspect, near, far) {
    var f = 1 / Math.tan(fovy / 2), nf;
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }
    return out;
  }
  var perspective = perspectiveNO;
  function perspectiveZO(out, fovy, aspect, near, far) {
    var f = 1 / Math.tan(fovy / 2), nf;
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      nf = 1 / (near - far);
      out[10] = far * nf;
      out[14] = far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -near;
    }
    return out;
  }
  function perspectiveFromFieldOfView(out, fov, near, far) {
    var upTan = Math.tan(fov.upDegrees * Math.PI / 180);
    var downTan = Math.tan(fov.downDegrees * Math.PI / 180);
    var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180);
    var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180);
    var xScale = 2 / (leftTan + rightTan);
    var yScale = 2 / (upTan + downTan);
    out[0] = xScale;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = yScale;
    out[6] = 0;
    out[7] = 0;
    out[8] = -((leftTan - rightTan) * xScale * 0.5);
    out[9] = (upTan - downTan) * yScale * 0.5;
    out[10] = far / (near - far);
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = far * near / (near - far);
    out[15] = 0;
    return out;
  }
  function orthoNO(out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right);
    var bt = 1 / (bottom - top);
    var nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
  }
  var ortho = orthoNO;
  function orthoZO(out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right);
    var bt = 1 / (bottom - top);
    var nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = near * nf;
    out[15] = 1;
    return out;
  }
  function lookAt(out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len4;
    var eyex = eye[0];
    var eyey = eye[1];
    var eyez = eye[2];
    var upx = up[0];
    var upy = up[1];
    var upz = up[2];
    var centerx = center[0];
    var centery = center[1];
    var centerz = center[2];
    if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
      return identity(out);
    }
    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;
    len4 = 1 / Math.hypot(z0, z1, z2);
    z0 *= len4;
    z1 *= len4;
    z2 *= len4;
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len4 = Math.hypot(x0, x1, x2);
    if (!len4) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len4 = 1 / len4;
      x0 *= len4;
      x1 *= len4;
      x2 *= len4;
    }
    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len4 = Math.hypot(y0, y1, y2);
    if (!len4) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len4 = 1 / len4;
      y0 *= len4;
      y1 *= len4;
      y2 *= len4;
    }
    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;
    return out;
  }
  function targetTo(out, eye, target, up) {
    var eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2];
    var z0 = eyex - target[0], z1 = eyey - target[1], z2 = eyez - target[2];
    var len4 = z0 * z0 + z1 * z1 + z2 * z2;
    if (len4 > 0) {
      len4 = 1 / Math.sqrt(len4);
      z0 *= len4;
      z1 *= len4;
      z2 *= len4;
    }
    var x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
    len4 = x0 * x0 + x1 * x1 + x2 * x2;
    if (len4 > 0) {
      len4 = 1 / Math.sqrt(len4);
      x0 *= len4;
      x1 *= len4;
      x2 *= len4;
    }
    out[0] = x0;
    out[1] = x1;
    out[2] = x2;
    out[3] = 0;
    out[4] = z1 * x2 - z2 * x1;
    out[5] = z2 * x0 - z0 * x2;
    out[6] = z0 * x1 - z1 * x0;
    out[7] = 0;
    out[8] = z0;
    out[9] = z1;
    out[10] = z2;
    out[11] = 0;
    out[12] = eyex;
    out[13] = eyey;
    out[14] = eyez;
    out[15] = 1;
    return out;
  }
  function str(a) {
    return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
  }
  function frob(a) {
    return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
  }
  function add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    out[6] = a[6] + b[6];
    out[7] = a[7] + b[7];
    out[8] = a[8] + b[8];
    out[9] = a[9] + b[9];
    out[10] = a[10] + b[10];
    out[11] = a[11] + b[11];
    out[12] = a[12] + b[12];
    out[13] = a[13] + b[13];
    out[14] = a[14] + b[14];
    out[15] = a[15] + b[15];
    return out;
  }
  function subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    out[4] = a[4] - b[4];
    out[5] = a[5] - b[5];
    out[6] = a[6] - b[6];
    out[7] = a[7] - b[7];
    out[8] = a[8] - b[8];
    out[9] = a[9] - b[9];
    out[10] = a[10] - b[10];
    out[11] = a[11] - b[11];
    out[12] = a[12] - b[12];
    out[13] = a[13] - b[13];
    out[14] = a[14] - b[14];
    out[15] = a[15] - b[15];
    return out;
  }
  function multiplyScalar(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    out[4] = a[4] * b;
    out[5] = a[5] * b;
    out[6] = a[6] * b;
    out[7] = a[7] * b;
    out[8] = a[8] * b;
    out[9] = a[9] * b;
    out[10] = a[10] * b;
    out[11] = a[11] * b;
    out[12] = a[12] * b;
    out[13] = a[13] * b;
    out[14] = a[14] * b;
    out[15] = a[15] * b;
    return out;
  }
  function multiplyScalarAndAdd(out, a, b, scale6) {
    out[0] = a[0] + b[0] * scale6;
    out[1] = a[1] + b[1] * scale6;
    out[2] = a[2] + b[2] * scale6;
    out[3] = a[3] + b[3] * scale6;
    out[4] = a[4] + b[4] * scale6;
    out[5] = a[5] + b[5] * scale6;
    out[6] = a[6] + b[6] * scale6;
    out[7] = a[7] + b[7] * scale6;
    out[8] = a[8] + b[8] * scale6;
    out[9] = a[9] + b[9] * scale6;
    out[10] = a[10] + b[10] * scale6;
    out[11] = a[11] + b[11] * scale6;
    out[12] = a[12] + b[12] * scale6;
    out[13] = a[13] + b[13] * scale6;
    out[14] = a[14] + b[14] * scale6;
    out[15] = a[15] + b[15] * scale6;
    return out;
  }
  function exactEquals(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
  }
  function equals(a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
    var a8 = a[8], a9 = a[9], a10 = a[10], a11 = a[11];
    var a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    var b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
    var b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11];
    var b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= EPSILON * Math.max(1, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= EPSILON * Math.max(1, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= EPSILON * Math.max(1, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= EPSILON * Math.max(1, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= EPSILON * Math.max(1, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= EPSILON * Math.max(1, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= EPSILON * Math.max(1, Math.abs(a15), Math.abs(b15));
  }
  var mul = multiply;
  var sub = subtract;

  // node_modules/gl-matrix/esm/quat.js
  var quat_exports = {};
  __export(quat_exports, {
    add: () => add4,
    calculateW: () => calculateW,
    clone: () => clone4,
    conjugate: () => conjugate,
    copy: () => copy4,
    create: () => create5,
    dot: () => dot3,
    equals: () => equals4,
    exactEquals: () => exactEquals4,
    exp: () => exp,
    fromEuler: () => fromEuler,
    fromMat3: () => fromMat3,
    fromValues: () => fromValues4,
    getAngle: () => getAngle,
    getAxisAngle: () => getAxisAngle,
    identity: () => identity2,
    invert: () => invert2,
    len: () => len2,
    length: () => length3,
    lerp: () => lerp3,
    ln: () => ln,
    mul: () => mul3,
    multiply: () => multiply3,
    normalize: () => normalize3,
    pow: () => pow,
    random: () => random2,
    rotateX: () => rotateX3,
    rotateY: () => rotateY3,
    rotateZ: () => rotateZ3,
    rotationTo: () => rotationTo,
    scale: () => scale4,
    set: () => set4,
    setAxes: () => setAxes,
    setAxisAngle: () => setAxisAngle,
    slerp: () => slerp,
    sqlerp: () => sqlerp,
    sqrLen: () => sqrLen2,
    squaredLength: () => squaredLength3,
    str: () => str3
  });

  // node_modules/gl-matrix/esm/vec3.js
  var vec3_exports = {};
  __export(vec3_exports, {
    add: () => add2,
    angle: () => angle,
    bezier: () => bezier,
    ceil: () => ceil,
    clone: () => clone2,
    copy: () => copy2,
    create: () => create3,
    cross: () => cross,
    dist: () => dist,
    distance: () => distance,
    div: () => div,
    divide: () => divide,
    dot: () => dot,
    equals: () => equals2,
    exactEquals: () => exactEquals2,
    floor: () => floor,
    forEach: () => forEach,
    fromValues: () => fromValues2,
    hermite: () => hermite,
    inverse: () => inverse,
    len: () => len,
    length: () => length,
    lerp: () => lerp,
    max: () => max,
    min: () => min,
    mul: () => mul2,
    multiply: () => multiply2,
    negate: () => negate,
    normalize: () => normalize,
    random: () => random,
    rotateX: () => rotateX2,
    rotateY: () => rotateY2,
    rotateZ: () => rotateZ2,
    round: () => round,
    scale: () => scale2,
    scaleAndAdd: () => scaleAndAdd,
    set: () => set2,
    sqrDist: () => sqrDist,
    sqrLen: () => sqrLen,
    squaredDistance: () => squaredDistance,
    squaredLength: () => squaredLength,
    str: () => str2,
    sub: () => sub2,
    subtract: () => subtract2,
    transformMat3: () => transformMat3,
    transformMat4: () => transformMat4,
    transformQuat: () => transformQuat,
    zero: () => zero
  });
  function create3() {
    var out = new ARRAY_TYPE(3);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }
    return out;
  }
  function clone2(a) {
    var out = new ARRAY_TYPE(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
  }
  function length(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    return Math.hypot(x, y, z);
  }
  function fromValues2(x, y, z) {
    var out = new ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  function copy2(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
  }
  function set2(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  function add2(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
  }
  function subtract2(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
  }
  function multiply2(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
  }
  function divide(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
  }
  function ceil(out, a) {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    out[2] = Math.ceil(a[2]);
    return out;
  }
  function floor(out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    out[2] = Math.floor(a[2]);
    return out;
  }
  function min(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
  }
  function max(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
  }
  function round(out, a) {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    out[2] = Math.round(a[2]);
    return out;
  }
  function scale2(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
  }
  function scaleAndAdd(out, a, b, scale6) {
    out[0] = a[0] + b[0] * scale6;
    out[1] = a[1] + b[1] * scale6;
    out[2] = a[2] + b[2] * scale6;
    return out;
  }
  function distance(a, b) {
    var x = b[0] - a[0];
    var y = b[1] - a[1];
    var z = b[2] - a[2];
    return Math.hypot(x, y, z);
  }
  function squaredDistance(a, b) {
    var x = b[0] - a[0];
    var y = b[1] - a[1];
    var z = b[2] - a[2];
    return x * x + y * y + z * z;
  }
  function squaredLength(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    return x * x + y * y + z * z;
  }
  function negate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
  }
  function inverse(out, a) {
    out[0] = 1 / a[0];
    out[1] = 1 / a[1];
    out[2] = 1 / a[2];
    return out;
  }
  function normalize(out, a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var len4 = x * x + y * y + z * z;
    if (len4 > 0) {
      len4 = 1 / Math.sqrt(len4);
    }
    out[0] = a[0] * len4;
    out[1] = a[1] * len4;
    out[2] = a[2] * len4;
    return out;
  }
  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  function cross(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2];
    var bx = b[0], by = b[1], bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  }
  function lerp(out, a, b, t) {
    var ax = a[0];
    var ay = a[1];
    var az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
  }
  function hermite(out, a, b, c, d, t) {
    var factorTimes2 = t * t;
    var factor1 = factorTimes2 * (2 * t - 3) + 1;
    var factor2 = factorTimes2 * (t - 2) + t;
    var factor3 = factorTimes2 * (t - 1);
    var factor4 = factorTimes2 * (3 - 2 * t);
    out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
    out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
    out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
    return out;
  }
  function bezier(out, a, b, c, d, t) {
    var inverseFactor = 1 - t;
    var inverseFactorTimesTwo = inverseFactor * inverseFactor;
    var factorTimes2 = t * t;
    var factor1 = inverseFactorTimesTwo * inverseFactor;
    var factor2 = 3 * t * inverseFactorTimesTwo;
    var factor3 = 3 * factorTimes2 * inverseFactor;
    var factor4 = factorTimes2 * t;
    out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
    out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
    out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
    return out;
  }
  function random(out, scale6) {
    scale6 = scale6 || 1;
    var r = RANDOM() * 2 * Math.PI;
    var z = RANDOM() * 2 - 1;
    var zScale = Math.sqrt(1 - z * z) * scale6;
    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z * scale6;
    return out;
  }
  function transformMat4(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    var w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
  }
  function transformMat3(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
  }
  function transformQuat(out, a, q) {
    var qx = q[0], qy = q[1], qz = q[2], qw = q[3];
    var x = a[0], y = a[1], z = a[2];
    var uvx = qy * z - qz * y, uvy = qz * x - qx * z, uvz = qx * y - qy * x;
    var uuvx = qy * uvz - qz * uvy, uuvy = qz * uvx - qx * uvz, uuvz = qx * uvy - qy * uvx;
    var w2 = qw * 2;
    uvx *= w2;
    uvy *= w2;
    uvz *= w2;
    uuvx *= 2;
    uuvy *= 2;
    uuvz *= 2;
    out[0] = x + uvx + uuvx;
    out[1] = y + uvy + uuvy;
    out[2] = z + uvz + uuvz;
    return out;
  }
  function rotateX2(out, a, b, rad) {
    var p = [], r = [];
    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2];
    r[0] = p[0];
    r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
    r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad);
    out[0] = r[0] + b[0];
    out[1] = r[1] + b[1];
    out[2] = r[2] + b[2];
    return out;
  }
  function rotateY2(out, a, b, rad) {
    var p = [], r = [];
    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2];
    r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
    r[1] = p[1];
    r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad);
    out[0] = r[0] + b[0];
    out[1] = r[1] + b[1];
    out[2] = r[2] + b[2];
    return out;
  }
  function rotateZ2(out, a, b, rad) {
    var p = [], r = [];
    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2];
    r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
    r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
    r[2] = p[2];
    out[0] = r[0] + b[0];
    out[1] = r[1] + b[1];
    out[2] = r[2] + b[2];
    return out;
  }
  function angle(a, b) {
    var ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2], mag1 = Math.sqrt(ax * ax + ay * ay + az * az), mag2 = Math.sqrt(bx * bx + by * by + bz * bz), mag = mag1 * mag2, cosine = mag && dot(a, b) / mag;
    return Math.acos(Math.min(Math.max(cosine, -1), 1));
  }
  function zero(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
  }
  function str2(a) {
    return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
  }
  function exactEquals2(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  }
  function equals2(a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2];
    var b0 = b[0], b1 = b[1], b2 = b[2];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2));
  }
  var sub2 = subtract2;
  var mul2 = multiply2;
  var div = divide;
  var dist = distance;
  var sqrDist = squaredDistance;
  var len = length;
  var sqrLen = squaredLength;
  var forEach = function() {
    var vec = create3();
    return function(a, stride, offset2, count, fn, arg) {
      var i2, l;
      if (!stride) {
        stride = 3;
      }
      if (!offset2) {
        offset2 = 0;
      }
      if (count) {
        l = Math.min(count * stride + offset2, a.length);
      } else {
        l = a.length;
      }
      for (i2 = offset2; i2 < l; i2 += stride) {
        vec[0] = a[i2];
        vec[1] = a[i2 + 1];
        vec[2] = a[i2 + 2];
        fn(vec, vec, arg);
        a[i2] = vec[0];
        a[i2 + 1] = vec[1];
        a[i2 + 2] = vec[2];
      }
      return a;
    };
  }();

  // node_modules/gl-matrix/esm/vec4.js
  function create4() {
    var out = new ARRAY_TYPE(4);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
    }
    return out;
  }
  function clone3(a) {
    var out = new ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
  }
  function fromValues3(x, y, z, w) {
    var out = new ARRAY_TYPE(4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
  }
  function copy3(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
  }
  function set3(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
  }
  function add3(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
  }
  function scale3(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
  }
  function length2(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var w = a[3];
    return Math.hypot(x, y, z, w);
  }
  function squaredLength2(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var w = a[3];
    return x * x + y * y + z * z + w * w;
  }
  function normalize2(out, a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var w = a[3];
    var len4 = x * x + y * y + z * z + w * w;
    if (len4 > 0) {
      len4 = 1 / Math.sqrt(len4);
    }
    out[0] = x * len4;
    out[1] = y * len4;
    out[2] = z * len4;
    out[3] = w * len4;
    return out;
  }
  function dot2(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  }
  function lerp2(out, a, b, t) {
    var ax = a[0];
    var ay = a[1];
    var az = a[2];
    var aw = a[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return out;
  }
  function exactEquals3(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  }
  function equals3(a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3));
  }
  var forEach2 = function() {
    var vec = create4();
    return function(a, stride, offset2, count, fn, arg) {
      var i2, l;
      if (!stride) {
        stride = 4;
      }
      if (!offset2) {
        offset2 = 0;
      }
      if (count) {
        l = Math.min(count * stride + offset2, a.length);
      } else {
        l = a.length;
      }
      for (i2 = offset2; i2 < l; i2 += stride) {
        vec[0] = a[i2];
        vec[1] = a[i2 + 1];
        vec[2] = a[i2 + 2];
        vec[3] = a[i2 + 3];
        fn(vec, vec, arg);
        a[i2] = vec[0];
        a[i2 + 1] = vec[1];
        a[i2 + 2] = vec[2];
        a[i2 + 3] = vec[3];
      }
      return a;
    };
  }();

  // node_modules/gl-matrix/esm/quat.js
  function create5() {
    var out = new ARRAY_TYPE(4);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }
    out[3] = 1;
    return out;
  }
  function identity2(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
  }
  function setAxisAngle(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
  }
  function getAxisAngle(out_axis, q) {
    var rad = Math.acos(q[3]) * 2;
    var s = Math.sin(rad / 2);
    if (s > EPSILON) {
      out_axis[0] = q[0] / s;
      out_axis[1] = q[1] / s;
      out_axis[2] = q[2] / s;
    } else {
      out_axis[0] = 1;
      out_axis[1] = 0;
      out_axis[2] = 0;
    }
    return rad;
  }
  function getAngle(a, b) {
    var dotproduct = dot3(a, b);
    return Math.acos(2 * dotproduct * dotproduct - 1);
  }
  function multiply3(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3];
    var bx = b[0], by = b[1], bz = b[2], bw = b[3];
    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
  }
  function rotateX3(out, a, rad) {
    rad *= 0.5;
    var ax = a[0], ay = a[1], az = a[2], aw = a[3];
    var bx = Math.sin(rad), bw = Math.cos(rad);
    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
  }
  function rotateY3(out, a, rad) {
    rad *= 0.5;
    var ax = a[0], ay = a[1], az = a[2], aw = a[3];
    var by = Math.sin(rad), bw = Math.cos(rad);
    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
  }
  function rotateZ3(out, a, rad) {
    rad *= 0.5;
    var ax = a[0], ay = a[1], az = a[2], aw = a[3];
    var bz = Math.sin(rad), bw = Math.cos(rad);
    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
  }
  function calculateW(out, a) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = Math.sqrt(Math.abs(1 - x * x - y * y - z * z));
    return out;
  }
  function exp(out, a) {
    var x = a[0], y = a[1], z = a[2], w = a[3];
    var r = Math.sqrt(x * x + y * y + z * z);
    var et = Math.exp(w);
    var s = r > 0 ? et * Math.sin(r) / r : 0;
    out[0] = x * s;
    out[1] = y * s;
    out[2] = z * s;
    out[3] = et * Math.cos(r);
    return out;
  }
  function ln(out, a) {
    var x = a[0], y = a[1], z = a[2], w = a[3];
    var r = Math.sqrt(x * x + y * y + z * z);
    var t = r > 0 ? Math.atan2(r, w) / r : 0;
    out[0] = x * t;
    out[1] = y * t;
    out[2] = z * t;
    out[3] = 0.5 * Math.log(x * x + y * y + z * z + w * w);
    return out;
  }
  function pow(out, a, b) {
    ln(out, a);
    scale4(out, out, b);
    exp(out, out);
    return out;
  }
  function slerp(out, a, b, t) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3];
    var bx = b[0], by = b[1], bz = b[2], bw = b[3];
    var omega, cosom, sinom, scale0, scale1;
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    if (cosom < 0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }
    if (1 - cosom > EPSILON) {
      omega = Math.acos(cosom);
      sinom = Math.sin(omega);
      scale0 = Math.sin((1 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    } else {
      scale0 = 1 - t;
      scale1 = t;
    }
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    return out;
  }
  function random2(out) {
    var u1 = RANDOM();
    var u2 = RANDOM();
    var u3 = RANDOM();
    var sqrt1MinusU1 = Math.sqrt(1 - u1);
    var sqrtU1 = Math.sqrt(u1);
    out[0] = sqrt1MinusU1 * Math.sin(2 * Math.PI * u2);
    out[1] = sqrt1MinusU1 * Math.cos(2 * Math.PI * u2);
    out[2] = sqrtU1 * Math.sin(2 * Math.PI * u3);
    out[3] = sqrtU1 * Math.cos(2 * Math.PI * u3);
    return out;
  }
  function invert2(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var dot5 = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
    var invDot = dot5 ? 1 / dot5 : 0;
    out[0] = -a0 * invDot;
    out[1] = -a1 * invDot;
    out[2] = -a2 * invDot;
    out[3] = a3 * invDot;
    return out;
  }
  function conjugate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
  }
  function fromMat3(out, m) {
    var fTrace = m[0] + m[4] + m[8];
    var fRoot;
    if (fTrace > 0) {
      fRoot = Math.sqrt(fTrace + 1);
      out[3] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      out[0] = (m[5] - m[7]) * fRoot;
      out[1] = (m[6] - m[2]) * fRoot;
      out[2] = (m[1] - m[3]) * fRoot;
    } else {
      var i2 = 0;
      if (m[4] > m[0])
        i2 = 1;
      if (m[8] > m[i2 * 3 + i2])
        i2 = 2;
      var j = (i2 + 1) % 3;
      var k = (i2 + 2) % 3;
      fRoot = Math.sqrt(m[i2 * 3 + i2] - m[j * 3 + j] - m[k * 3 + k] + 1);
      out[i2] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
      out[j] = (m[j * 3 + i2] + m[i2 * 3 + j]) * fRoot;
      out[k] = (m[k * 3 + i2] + m[i2 * 3 + k]) * fRoot;
    }
    return out;
  }
  function fromEuler(out, x, y, z) {
    var halfToRad = 0.5 * Math.PI / 180;
    x *= halfToRad;
    y *= halfToRad;
    z *= halfToRad;
    var sx = Math.sin(x);
    var cx = Math.cos(x);
    var sy = Math.sin(y);
    var cy = Math.cos(y);
    var sz = Math.sin(z);
    var cz = Math.cos(z);
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
    return out;
  }
  function str3(a) {
    return "quat(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
  }
  var clone4 = clone3;
  var fromValues4 = fromValues3;
  var copy4 = copy3;
  var set4 = set3;
  var add4 = add3;
  var mul3 = multiply3;
  var scale4 = scale3;
  var dot3 = dot2;
  var lerp3 = lerp2;
  var length3 = length2;
  var len2 = length3;
  var squaredLength3 = squaredLength2;
  var sqrLen2 = squaredLength3;
  var normalize3 = normalize2;
  var exactEquals4 = exactEquals3;
  var equals4 = equals3;
  var rotationTo = function() {
    var tmpvec3 = create3();
    var xUnitVec3 = fromValues2(1, 0, 0);
    var yUnitVec3 = fromValues2(0, 1, 0);
    return function(out, a, b) {
      var dot5 = dot(a, b);
      if (dot5 < -0.999999) {
        cross(tmpvec3, xUnitVec3, a);
        if (len(tmpvec3) < 1e-6)
          cross(tmpvec3, yUnitVec3, a);
        normalize(tmpvec3, tmpvec3);
        setAxisAngle(out, tmpvec3, Math.PI);
        return out;
      } else if (dot5 > 0.999999) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        return out;
      } else {
        cross(tmpvec3, a, b);
        out[0] = tmpvec3[0];
        out[1] = tmpvec3[1];
        out[2] = tmpvec3[2];
        out[3] = 1 + dot5;
        return normalize3(out, out);
      }
    };
  }();
  var sqlerp = function() {
    var temp1 = create5();
    var temp2 = create5();
    return function(out, a, b, c, d, t) {
      slerp(temp1, a, d, t);
      slerp(temp2, b, c, t);
      slerp(out, temp1, temp2, 2 * t * (1 - t));
      return out;
    };
  }();
  var setAxes = function() {
    var matr = create();
    return function(out, view, right, up) {
      matr[0] = right[0];
      matr[3] = right[1];
      matr[6] = right[2];
      matr[1] = up[0];
      matr[4] = up[1];
      matr[7] = up[2];
      matr[2] = -view[0];
      matr[5] = -view[1];
      matr[8] = -view[2];
      return normalize3(out, fromMat3(out, matr));
    };
  }();

  // node_modules/gl-matrix/esm/quat2.js
  var quat2_exports = {};
  __export(quat2_exports, {
    add: () => add5,
    clone: () => clone5,
    conjugate: () => conjugate2,
    copy: () => copy5,
    create: () => create6,
    dot: () => dot4,
    equals: () => equals5,
    exactEquals: () => exactEquals5,
    fromMat4: () => fromMat4,
    fromRotation: () => fromRotation2,
    fromRotationTranslation: () => fromRotationTranslation2,
    fromRotationTranslationValues: () => fromRotationTranslationValues,
    fromTranslation: () => fromTranslation2,
    fromValues: () => fromValues5,
    getDual: () => getDual,
    getReal: () => getReal,
    getTranslation: () => getTranslation2,
    identity: () => identity3,
    invert: () => invert3,
    len: () => len3,
    length: () => length4,
    lerp: () => lerp4,
    mul: () => mul4,
    multiply: () => multiply4,
    normalize: () => normalize4,
    rotateAroundAxis: () => rotateAroundAxis,
    rotateByQuatAppend: () => rotateByQuatAppend,
    rotateByQuatPrepend: () => rotateByQuatPrepend,
    rotateX: () => rotateX4,
    rotateY: () => rotateY4,
    rotateZ: () => rotateZ4,
    scale: () => scale5,
    set: () => set5,
    setDual: () => setDual,
    setReal: () => setReal,
    sqrLen: () => sqrLen3,
    squaredLength: () => squaredLength4,
    str: () => str4,
    translate: () => translate2
  });
  function create6() {
    var dq = new ARRAY_TYPE(8);
    if (ARRAY_TYPE != Float32Array) {
      dq[0] = 0;
      dq[1] = 0;
      dq[2] = 0;
      dq[4] = 0;
      dq[5] = 0;
      dq[6] = 0;
      dq[7] = 0;
    }
    dq[3] = 1;
    return dq;
  }
  function clone5(a) {
    var dq = new ARRAY_TYPE(8);
    dq[0] = a[0];
    dq[1] = a[1];
    dq[2] = a[2];
    dq[3] = a[3];
    dq[4] = a[4];
    dq[5] = a[5];
    dq[6] = a[6];
    dq[7] = a[7];
    return dq;
  }
  function fromValues5(x1, y1, z1, w1, x2, y2, z2, w2) {
    var dq = new ARRAY_TYPE(8);
    dq[0] = x1;
    dq[1] = y1;
    dq[2] = z1;
    dq[3] = w1;
    dq[4] = x2;
    dq[5] = y2;
    dq[6] = z2;
    dq[7] = w2;
    return dq;
  }
  function fromRotationTranslationValues(x1, y1, z1, w1, x2, y2, z2) {
    var dq = new ARRAY_TYPE(8);
    dq[0] = x1;
    dq[1] = y1;
    dq[2] = z1;
    dq[3] = w1;
    var ax = x2 * 0.5, ay = y2 * 0.5, az = z2 * 0.5;
    dq[4] = ax * w1 + ay * z1 - az * y1;
    dq[5] = ay * w1 + az * x1 - ax * z1;
    dq[6] = az * w1 + ax * y1 - ay * x1;
    dq[7] = -ax * x1 - ay * y1 - az * z1;
    return dq;
  }
  function fromRotationTranslation2(out, q, t) {
    var ax = t[0] * 0.5, ay = t[1] * 0.5, az = t[2] * 0.5, bx = q[0], by = q[1], bz = q[2], bw = q[3];
    out[0] = bx;
    out[1] = by;
    out[2] = bz;
    out[3] = bw;
    out[4] = ax * bw + ay * bz - az * by;
    out[5] = ay * bw + az * bx - ax * bz;
    out[6] = az * bw + ax * by - ay * bx;
    out[7] = -ax * bx - ay * by - az * bz;
    return out;
  }
  function fromTranslation2(out, t) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = t[0] * 0.5;
    out[5] = t[1] * 0.5;
    out[6] = t[2] * 0.5;
    out[7] = 0;
    return out;
  }
  function fromRotation2(out, q) {
    out[0] = q[0];
    out[1] = q[1];
    out[2] = q[2];
    out[3] = q[3];
    out[4] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    return out;
  }
  function fromMat4(out, a) {
    var outer = create5();
    getRotation(outer, a);
    var t = new ARRAY_TYPE(3);
    getTranslation(t, a);
    fromRotationTranslation2(out, outer, t);
    return out;
  }
  function copy5(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    return out;
  }
  function identity3(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    return out;
  }
  function set5(out, x1, y1, z1, w1, x2, y2, z2, w2) {
    out[0] = x1;
    out[1] = y1;
    out[2] = z1;
    out[3] = w1;
    out[4] = x2;
    out[5] = y2;
    out[6] = z2;
    out[7] = w2;
    return out;
  }
  var getReal = copy4;
  function getDual(out, a) {
    out[0] = a[4];
    out[1] = a[5];
    out[2] = a[6];
    out[3] = a[7];
    return out;
  }
  var setReal = copy4;
  function setDual(out, q) {
    out[4] = q[0];
    out[5] = q[1];
    out[6] = q[2];
    out[7] = q[3];
    return out;
  }
  function getTranslation2(out, a) {
    var ax = a[4], ay = a[5], az = a[6], aw = a[7], bx = -a[0], by = -a[1], bz = -a[2], bw = a[3];
    out[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
    out[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
    out[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
    return out;
  }
  function translate2(out, a, v) {
    var ax1 = a[0], ay1 = a[1], az1 = a[2], aw1 = a[3], bx1 = v[0] * 0.5, by1 = v[1] * 0.5, bz1 = v[2] * 0.5, ax2 = a[4], ay2 = a[5], az2 = a[6], aw2 = a[7];
    out[0] = ax1;
    out[1] = ay1;
    out[2] = az1;
    out[3] = aw1;
    out[4] = aw1 * bx1 + ay1 * bz1 - az1 * by1 + ax2;
    out[5] = aw1 * by1 + az1 * bx1 - ax1 * bz1 + ay2;
    out[6] = aw1 * bz1 + ax1 * by1 - ay1 * bx1 + az2;
    out[7] = -ax1 * bx1 - ay1 * by1 - az1 * bz1 + aw2;
    return out;
  }
  function rotateX4(out, a, rad) {
    var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7], ax1 = ax * bw + aw * bx + ay * bz - az * by, ay1 = ay * bw + aw * by + az * bx - ax * bz, az1 = az * bw + aw * bz + ax * by - ay * bx, aw1 = aw * bw - ax * bx - ay * by - az * bz;
    rotateX3(out, a, rad);
    bx = out[0];
    by = out[1];
    bz = out[2];
    bw = out[3];
    out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
    out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
    out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
    out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
    return out;
  }
  function rotateY4(out, a, rad) {
    var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7], ax1 = ax * bw + aw * bx + ay * bz - az * by, ay1 = ay * bw + aw * by + az * bx - ax * bz, az1 = az * bw + aw * bz + ax * by - ay * bx, aw1 = aw * bw - ax * bx - ay * by - az * bz;
    rotateY3(out, a, rad);
    bx = out[0];
    by = out[1];
    bz = out[2];
    bw = out[3];
    out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
    out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
    out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
    out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
    return out;
  }
  function rotateZ4(out, a, rad) {
    var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7], ax1 = ax * bw + aw * bx + ay * bz - az * by, ay1 = ay * bw + aw * by + az * bx - ax * bz, az1 = az * bw + aw * bz + ax * by - ay * bx, aw1 = aw * bw - ax * bx - ay * by - az * bz;
    rotateZ3(out, a, rad);
    bx = out[0];
    by = out[1];
    bz = out[2];
    bw = out[3];
    out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
    out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
    out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
    out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
    return out;
  }
  function rotateByQuatAppend(out, a, q) {
    var qx = q[0], qy = q[1], qz = q[2], qw = q[3], ax = a[0], ay = a[1], az = a[2], aw = a[3];
    out[0] = ax * qw + aw * qx + ay * qz - az * qy;
    out[1] = ay * qw + aw * qy + az * qx - ax * qz;
    out[2] = az * qw + aw * qz + ax * qy - ay * qx;
    out[3] = aw * qw - ax * qx - ay * qy - az * qz;
    ax = a[4];
    ay = a[5];
    az = a[6];
    aw = a[7];
    out[4] = ax * qw + aw * qx + ay * qz - az * qy;
    out[5] = ay * qw + aw * qy + az * qx - ax * qz;
    out[6] = az * qw + aw * qz + ax * qy - ay * qx;
    out[7] = aw * qw - ax * qx - ay * qy - az * qz;
    return out;
  }
  function rotateByQuatPrepend(out, q, a) {
    var qx = q[0], qy = q[1], qz = q[2], qw = q[3], bx = a[0], by = a[1], bz = a[2], bw = a[3];
    out[0] = qx * bw + qw * bx + qy * bz - qz * by;
    out[1] = qy * bw + qw * by + qz * bx - qx * bz;
    out[2] = qz * bw + qw * bz + qx * by - qy * bx;
    out[3] = qw * bw - qx * bx - qy * by - qz * bz;
    bx = a[4];
    by = a[5];
    bz = a[6];
    bw = a[7];
    out[4] = qx * bw + qw * bx + qy * bz - qz * by;
    out[5] = qy * bw + qw * by + qz * bx - qx * bz;
    out[6] = qz * bw + qw * bz + qx * by - qy * bx;
    out[7] = qw * bw - qx * bx - qy * by - qz * bz;
    return out;
  }
  function rotateAroundAxis(out, a, axis, rad) {
    if (Math.abs(rad) < EPSILON) {
      return copy5(out, a);
    }
    var axisLength = Math.hypot(axis[0], axis[1], axis[2]);
    rad = rad * 0.5;
    var s = Math.sin(rad);
    var bx = s * axis[0] / axisLength;
    var by = s * axis[1] / axisLength;
    var bz = s * axis[2] / axisLength;
    var bw = Math.cos(rad);
    var ax1 = a[0], ay1 = a[1], az1 = a[2], aw1 = a[3];
    out[0] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
    out[1] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
    out[2] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
    out[3] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
    var ax = a[4], ay = a[5], az = a[6], aw = a[7];
    out[4] = ax * bw + aw * bx + ay * bz - az * by;
    out[5] = ay * bw + aw * by + az * bx - ax * bz;
    out[6] = az * bw + aw * bz + ax * by - ay * bx;
    out[7] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
  }
  function add5(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    out[6] = a[6] + b[6];
    out[7] = a[7] + b[7];
    return out;
  }
  function multiply4(out, a, b) {
    var ax0 = a[0], ay0 = a[1], az0 = a[2], aw0 = a[3], bx1 = b[4], by1 = b[5], bz1 = b[6], bw1 = b[7], ax1 = a[4], ay1 = a[5], az1 = a[6], aw1 = a[7], bx0 = b[0], by0 = b[1], bz0 = b[2], bw0 = b[3];
    out[0] = ax0 * bw0 + aw0 * bx0 + ay0 * bz0 - az0 * by0;
    out[1] = ay0 * bw0 + aw0 * by0 + az0 * bx0 - ax0 * bz0;
    out[2] = az0 * bw0 + aw0 * bz0 + ax0 * by0 - ay0 * bx0;
    out[3] = aw0 * bw0 - ax0 * bx0 - ay0 * by0 - az0 * bz0;
    out[4] = ax0 * bw1 + aw0 * bx1 + ay0 * bz1 - az0 * by1 + ax1 * bw0 + aw1 * bx0 + ay1 * bz0 - az1 * by0;
    out[5] = ay0 * bw1 + aw0 * by1 + az0 * bx1 - ax0 * bz1 + ay1 * bw0 + aw1 * by0 + az1 * bx0 - ax1 * bz0;
    out[6] = az0 * bw1 + aw0 * bz1 + ax0 * by1 - ay0 * bx1 + az1 * bw0 + aw1 * bz0 + ax1 * by0 - ay1 * bx0;
    out[7] = aw0 * bw1 - ax0 * bx1 - ay0 * by1 - az0 * bz1 + aw1 * bw0 - ax1 * bx0 - ay1 * by0 - az1 * bz0;
    return out;
  }
  var mul4 = multiply4;
  function scale5(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    out[4] = a[4] * b;
    out[5] = a[5] * b;
    out[6] = a[6] * b;
    out[7] = a[7] * b;
    return out;
  }
  var dot4 = dot3;
  function lerp4(out, a, b, t) {
    var mt = 1 - t;
    if (dot4(a, b) < 0)
      t = -t;
    out[0] = a[0] * mt + b[0] * t;
    out[1] = a[1] * mt + b[1] * t;
    out[2] = a[2] * mt + b[2] * t;
    out[3] = a[3] * mt + b[3] * t;
    out[4] = a[4] * mt + b[4] * t;
    out[5] = a[5] * mt + b[5] * t;
    out[6] = a[6] * mt + b[6] * t;
    out[7] = a[7] * mt + b[7] * t;
    return out;
  }
  function invert3(out, a) {
    var sqlen = squaredLength4(a);
    out[0] = -a[0] / sqlen;
    out[1] = -a[1] / sqlen;
    out[2] = -a[2] / sqlen;
    out[3] = a[3] / sqlen;
    out[4] = -a[4] / sqlen;
    out[5] = -a[5] / sqlen;
    out[6] = -a[6] / sqlen;
    out[7] = a[7] / sqlen;
    return out;
  }
  function conjugate2(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    out[4] = -a[4];
    out[5] = -a[5];
    out[6] = -a[6];
    out[7] = a[7];
    return out;
  }
  var length4 = length3;
  var len3 = length4;
  var squaredLength4 = squaredLength3;
  var sqrLen3 = squaredLength4;
  function normalize4(out, a) {
    var magnitude = squaredLength4(a);
    if (magnitude > 0) {
      magnitude = Math.sqrt(magnitude);
      var a0 = a[0] / magnitude;
      var a1 = a[1] / magnitude;
      var a2 = a[2] / magnitude;
      var a3 = a[3] / magnitude;
      var b0 = a[4];
      var b1 = a[5];
      var b2 = a[6];
      var b3 = a[7];
      var a_dot_b = a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3;
      out[0] = a0;
      out[1] = a1;
      out[2] = a2;
      out[3] = a3;
      out[4] = (b0 - a0 * a_dot_b) / magnitude;
      out[5] = (b1 - a1 * a_dot_b) / magnitude;
      out[6] = (b2 - a2 * a_dot_b) / magnitude;
      out[7] = (b3 - a3 * a_dot_b) / magnitude;
    }
    return out;
  }
  function str4(a) {
    return "quat2(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ")";
  }
  function exactEquals5(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7];
  }
  function equals5(a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7));
  }

  // node_modules/@wonderlandengine/components/dist/hit-test-location.js
  var __decorate3 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i2 = decorators.length - 1; i2 >= 0; i2--)
        if (d = decorators[i2])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var HitTestLocation = class extends Component {
    tempScaling = new Float32Array(3);
    visible = false;
    xrHitTestSource = null;
    /** Reference space for creating the hit test when the session starts */
    xrReferenceSpace = null;
    /**
     * For maintaining backwards compatibility: Whether to scale the object to 0 and back.
     * @deprecated Use onHitLost and onHitFound instead.
     */
    scaleObject = true;
    /** Emits an event when the hit test switches from visible to invisible */
    onHitLost = new Emitter();
    /** Emits an event when the hit test switches from invisible to visible */
    onHitFound = new Emitter();
    onSessionStartCallback = null;
    onSessionEndCallback = null;
    start() {
      this.onSessionStartCallback = this.onXRSessionStart.bind(this);
      this.onSessionEndCallback = this.onXRSessionEnd.bind(this);
      if (this.scaleObject) {
        this.tempScaling.set(this.object.scalingLocal);
        this.object.scale([0, 0, 0]);
        this.onHitLost.add(() => {
          this.tempScaling.set(this.object.scalingLocal);
          this.object.scale([0, 0, 0]);
        });
        this.onHitFound.add(() => {
          this.object.scalingLocal.set(this.tempScaling);
          this.object.setDirty();
        });
      }
    }
    onActivate() {
      this.engine.onXRSessionStart.add(this.onSessionStartCallback);
      this.engine.onXRSessionEnd.add(this.onSessionEndCallback);
    }
    onDeactivate() {
      this.engine.onXRSessionStart.remove(this.onSessionStartCallback);
      this.engine.onXRSessionEnd.remove(this.onSessionEndCallback);
    }
    update() {
      const wasVisible = this.visible;
      if (this.xrHitTestSource) {
        const frame = this.engine.xrFrame;
        if (!frame)
          return;
        let hitTestResults = frame.getHitTestResults(this.xrHitTestSource);
        if (hitTestResults.length > 0) {
          let pose = hitTestResults[0].getPose(this.engine.xr.currentReferenceSpace);
          this.visible = !!pose;
          if (pose) {
            setXRRigidTransformLocal(this.object, pose.transform);
          }
        } else {
          this.visible = false;
        }
      }
      if (this.visible != wasVisible) {
        (this.visible ? this.onHitFound : this.onHitLost).notify(this);
      }
    }
    getHitTestResults(frame = this.engine.xr?.frame ?? null) {
      if (!frame)
        return [];
      if (!this.xrHitTestSource)
        return [];
      return frame.getHitTestResults(this.xrHitTestSource);
    }
    onXRSessionStart(session) {
      if (session.requestHitTestSource === void 0) {
        console.error("hit-test-location: hit test feature not available. Deactivating component.");
        this.active = false;
        return;
      }
      session.requestHitTestSource({
        space: this.xrReferenceSpace ?? this.engine.xr.referenceSpaceForType("viewer")
      }).then((hitTestSource) => {
        this.xrHitTestSource = hitTestSource;
      }).catch(console.error);
    }
    onXRSessionEnd() {
      if (!this.xrHitTestSource)
        return;
      this.xrHitTestSource.cancel();
      this.xrHitTestSource = null;
    }
  };
  __publicField(HitTestLocation, "TypeName", "hit-test-location");
  __decorate3([
    property.bool(true)
  ], HitTestLocation.prototype, "scaleObject", void 0);

  // node_modules/@wonderlandengine/components/dist/cursor.js
  var __decorate4 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i2 = decorators.length - 1; i2 >= 0; i2--)
        if (d = decorators[i2])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var tempVec2 = new Float32Array(3);
  var ZERO = [0, 0, 0];
  var CursorTargetEmitters = class {
    /** Emitter for events when the target is hovered */
    onHover = new Emitter();
    /** Emitter for events when the target is unhovered */
    onUnhover = new Emitter();
    /** Emitter for events when the target is clicked */
    onClick = new Emitter();
    /** Emitter for events when the cursor moves on the target */
    onMove = new Emitter();
    /** Emitter for events when the user pressed the select button on the target */
    onDown = new Emitter();
    /** Emitter for events when the user unpressed the select button on the target */
    onUp = new Emitter();
  };
  var Cursor = class extends Component {
    static onRegister(engine) {
      engine.registerComponent(HitTestLocation);
    }
    _collisionMask = 0;
    _onDeactivateCallbacks = [];
    _input = null;
    _origin = new Float32Array(3);
    _cursorObjScale = new Float32Array(3);
    _direction = new Float32Array(3);
    _projectionMatrix = new Float32Array(16);
    _viewComponent = null;
    _isDown = false;
    _lastIsDown = false;
    _arTouchDown = false;
    _lastPointerPos = new Float32Array(2);
    _lastCursorPosOnTarget = new Float32Array(3);
    _hitTestLocation = null;
    _hitTestObject = null;
    _onSessionStartCallback = null;
    /**
     * Whether the cursor (and cursorObject) is visible, i.e. pointing at an object
     * that matches the collision group
     */
    visible = true;
    /** Currently hovered object */
    hoveringObject = null;
    /** CursorTarget component of the currently hovered object */
    hoveringObjectTarget = null;
    /** Whether the cursor is hovering reality via hit-test */
    hoveringReality = false;
    /**
     * Global target lets you receive global cursor events on any object.
     */
    globalTarget = new CursorTargetEmitters();
    /**
     * Hit test target lets you receive cursor events for "reality", if
     * `useWebXRHitTest` is set to `true`.
     *
     * @example
     * ```js
     * cursor.hitTestTarget.onClick.add((hit, cursor) => {
     *     // User clicked on reality
     * });
     * ```
     */
    hitTestTarget = new CursorTargetEmitters();
    /** World position of the cursor */
    cursorPos = new Float32Array(3);
    /** Collision group for the ray cast. Only objects in this group will be affected by this cursor. */
    collisionGroup = 1;
    /** (optional) Object that visualizes the cursor's ray. */
    cursorRayObject = null;
    /** Axis along which to scale the `cursorRayObject`. */
    cursorRayScalingAxis = 2;
    /** (optional) Object that visualizes the cursor's hit location. */
    cursorObject = null;
    /** Handedness for VR cursors to accept trigger events only from respective controller. */
    handedness = 0;
    /** Mode for raycasting, whether to use PhysX or simple collision components */
    rayCastMode = 0;
    /** Maximum distance for the cursor's ray cast. */
    maxDistance = 100;
    /** Whether to set the CSS style of the mouse cursor on desktop */
    styleCursor = true;
    /**
     * Use WebXR hit-test if available.
     *
     * Attaches a hit-test-location component to the cursorObject, which will be used
     * by the cursor to send events to the hitTestTarget with HitTestResult.
     */
    useWebXRHitTest = false;
    _onViewportResize = () => {
      if (!this._viewComponent)
        return;
      mat4_exports.invert(this._projectionMatrix, this._viewComponent.projectionMatrix);
    };
    start() {
      this._collisionMask = 1 << this.collisionGroup;
      if (this.handedness == 0) {
        const inputComp = this.object.getComponent("input");
        if (!inputComp) {
          console.warn("cursor component on object", this.object.name, 'was configured with handedness "input component", but object has no input component.');
        } else {
          this.handedness = inputComp.handedness || "none";
          this._input = inputComp;
        }
      } else {
        this.handedness = ["left", "right", "none"][this.handedness - 1];
      }
      this._viewComponent = this.object.getComponent(ViewComponent);
      if (this.useWebXRHitTest) {
        this._hitTestObject = this.engine.scene.addObject(this.object);
        this._hitTestLocation = this._hitTestObject.addComponent(HitTestLocation, {
          scaleObject: false
        }) ?? null;
      }
      this._onSessionStartCallback = this.setupVREvents.bind(this);
    }
    onActivate() {
      this.engine.onXRSessionStart.add(this._onSessionStartCallback);
      this.engine.onResize.add(this._onViewportResize);
      this._setCursorVisibility(true);
      if (this._viewComponent != null) {
        const canvas2 = this.engine.canvas;
        const onClick = this.onClick.bind(this);
        const onPointerMove = this.onPointerMove.bind(this);
        const onPointerDown = this.onPointerDown.bind(this);
        const onPointerUp = this.onPointerUp.bind(this);
        canvas2.addEventListener("click", onClick);
        canvas2.addEventListener("pointermove", onPointerMove);
        canvas2.addEventListener("pointerdown", onPointerDown);
        canvas2.addEventListener("pointerup", onPointerUp);
        this._onDeactivateCallbacks.push(() => {
          canvas2.removeEventListener("click", onClick);
          canvas2.removeEventListener("pointermove", onPointerMove);
          canvas2.removeEventListener("pointerdown", onPointerDown);
          canvas2.removeEventListener("pointerup", onPointerUp);
        });
      }
      this._onViewportResize();
    }
    _setCursorRayTransform(hitPosition) {
      if (!this.cursorRayObject)
        return;
      const dist2 = vec3_exports.dist(this._origin, hitPosition);
      this.cursorRayObject.setPositionLocal([0, 0, -dist2 / 2]);
      if (this.cursorRayScalingAxis != 4) {
        tempVec2.fill(1);
        tempVec2[this.cursorRayScalingAxis] = dist2 / 2;
        this.cursorRayObject.setScalingLocal(tempVec2);
      }
    }
    _setCursorVisibility(visible) {
      if (this.visible == visible)
        return;
      this.visible = visible;
      if (!this.cursorObject)
        return;
      if (visible) {
        this.cursorObject.setScalingWorld(this._cursorObjScale);
      } else {
        this.cursorObject.getScalingWorld(this._cursorObjScale);
        this.cursorObject.scaleLocal([0, 0, 0]);
      }
    }
    update() {
      if (this.engine.xr && this._arTouchDown && this._input && this.engine.xr.session.inputSources[0].handedness === "none" && this.engine.xr.session.inputSources[0].gamepad) {
        const p = this.engine.xr.session.inputSources[0].gamepad.axes;
        this._direction[0] = p[0];
        this._direction[1] = -p[1];
        this._direction[2] = -1;
        this.applyTransformAndProjectDirection();
      } else if (this.engine.xr && this._input && this._input.xrInputSource) {
        this._direction[0] = 0;
        this._direction[1] = 0;
        this._direction[2] = -1;
        this.applyTransformToDirection();
      } else if (this._viewComponent) {
        this.updateDirection();
      }
      this.rayCast(null, this.engine.xr?.frame);
      if (this.cursorObject) {
        if (this.hoveringObject && (this.cursorPos[0] != 0 || this.cursorPos[1] != 0 || this.cursorPos[2] != 0)) {
          this._setCursorVisibility(true);
          this.cursorObject.setPositionWorld(this.cursorPos);
          this._setCursorRayTransform(this.cursorPos);
        } else {
          this._setCursorVisibility(false);
        }
      }
    }
    /* Returns the hovered cursor target, if available */
    notify(event, originalEvent) {
      const target = this.hoveringObject;
      if (target) {
        const cursorTarget = this.hoveringObjectTarget;
        if (cursorTarget)
          cursorTarget[event].notify(target, this, originalEvent ?? void 0);
        this.globalTarget[event].notify(target, this, originalEvent ?? void 0);
      }
    }
    hoverBehaviour(rayHit, hitTestResult, doClick, originalEvent) {
      const hit = !this.hoveringReality && rayHit.hitCount > 0 ? rayHit.objects[0] : null;
      if (hit) {
        if (!this.hoveringObject || !this.hoveringObject.equals(hit)) {
          if (this.hoveringObject) {
            this.notify("onUnhover", originalEvent);
          }
          this.hoveringObject = hit;
          this.hoveringObjectTarget = this.hoveringObject.getComponent(CursorTarget);
          if (this.styleCursor)
            this.engine.canvas.style.cursor = "pointer";
          this.notify("onHover", originalEvent);
        }
      } else if (this.hoveringObject) {
        this.notify("onUnhover", originalEvent);
        this.hoveringObject = null;
        this.hoveringObjectTarget = null;
        if (this.styleCursor)
          this.engine.canvas.style.cursor = "default";
      }
      if (this.hoveringObject) {
        if (this._isDown !== this._lastIsDown) {
          this.notify(this._isDown ? "onDown" : "onUp", originalEvent);
        }
        if (doClick)
          this.notify("onClick", originalEvent);
      } else if (this.hoveringReality) {
        if (this._isDown !== this._lastIsDown) {
          (this._isDown ? this.hitTestTarget.onDown : this.hitTestTarget.onUp).notify(hitTestResult, this, originalEvent ?? void 0);
        }
        if (doClick)
          this.hitTestTarget.onClick.notify(hitTestResult, this, originalEvent ?? void 0);
      }
      if (hit) {
        if (this.hoveringObject) {
          this.hoveringObject.transformPointInverseWorld(tempVec2, this.cursorPos);
        } else {
          tempVec2.set(this.cursorPos);
        }
        if (!vec3_exports.equals(this._lastCursorPosOnTarget, tempVec2)) {
          this.notify("onMove", originalEvent);
          this._lastCursorPosOnTarget.set(tempVec2);
        }
      } else if (this.hoveringReality) {
        if (!vec3_exports.equals(this._lastCursorPosOnTarget, this.cursorPos)) {
          this.hitTestTarget.onMove.notify(hitTestResult, this, originalEvent ?? void 0);
          this._lastCursorPosOnTarget.set(this.cursorPos);
        }
      } else {
        this._lastCursorPosOnTarget.set(this.cursorPos);
      }
      this._lastIsDown = this._isDown;
    }
    /**
     * Setup event listeners on session object
     * @param s WebXR session
     *
     * Sets up 'select' and 'end' events.
     */
    setupVREvents(s) {
      if (!s)
        console.error("setupVREvents called without a valid session");
      if (!this.active)
        return;
      const onSelect = this.onSelect.bind(this);
      s.addEventListener("select", onSelect);
      const onSelectStart = this.onSelectStart.bind(this);
      s.addEventListener("selectstart", onSelectStart);
      const onSelectEnd = this.onSelectEnd.bind(this);
      s.addEventListener("selectend", onSelectEnd);
      this._onDeactivateCallbacks.push(() => {
        if (!this.engine.xr)
          return;
        s.removeEventListener("select", onSelect);
        s.removeEventListener("selectstart", onSelectStart);
        s.removeEventListener("selectend", onSelectEnd);
      });
      this._onViewportResize();
    }
    onDeactivate() {
      this.engine.onXRSessionStart.remove(this._onSessionStartCallback);
      this.engine.onResize.remove(this._onViewportResize);
      this._setCursorVisibility(false);
      if (this.hoveringObject)
        this.notify("onUnhover", null);
      if (this.cursorRayObject)
        this.cursorRayObject.setScalingLocal(ZERO);
      for (const f of this._onDeactivateCallbacks)
        f();
      this._onDeactivateCallbacks.length = 0;
    }
    onDestroy() {
      this._hitTestObject?.destroy();
    }
    /** 'select' event listener */
    onSelect(e) {
      if (e.inputSource.handedness != this.handedness)
        return;
      this.rayCast(e, e.frame, true);
    }
    /** 'selectstart' event listener */
    onSelectStart(e) {
      this._arTouchDown = true;
      if (e.inputSource.handedness == this.handedness) {
        this._isDown = true;
        this.rayCast(e, e.frame);
      }
    }
    /** 'selectend' event listener */
    onSelectEnd(e) {
      this._arTouchDown = false;
      if (e.inputSource.handedness == this.handedness) {
        this._isDown = false;
        this.rayCast(e, e.frame);
      }
    }
    /** 'pointermove' event listener */
    onPointerMove(e) {
      if (!e.isPrimary)
        return;
      this.updateMousePos(e);
      this.rayCast(e, null);
    }
    /** 'click' event listener */
    onClick(e) {
      this.updateMousePos(e);
      this.rayCast(e, null, true);
    }
    /** 'pointerdown' event listener */
    onPointerDown(e) {
      if (!e.isPrimary || e.button !== 0)
        return;
      this.updateMousePos(e);
      this._isDown = true;
      this.rayCast(e);
    }
    /** 'pointerup' event listener */
    onPointerUp(e) {
      if (!e.isPrimary || e.button !== 0)
        return;
      this.updateMousePos(e);
      this._isDown = false;
      this.rayCast(e);
    }
    /**
     * Update mouse position in non-VR mode and raycast for new position
     * @returns @ref RayHit for new position.
     */
    updateMousePos(e) {
      this._lastPointerPos[0] = e.clientX;
      this._lastPointerPos[1] = e.clientY;
      this.updateDirection();
    }
    updateDirection() {
      const bounds = this.engine.canvas.getBoundingClientRect();
      const left = this._lastPointerPos[0] / bounds.width;
      const top = this._lastPointerPos[1] / bounds.height;
      this._direction[0] = left * 2 - 1;
      this._direction[1] = -top * 2 + 1;
      this._direction[2] = -1;
      this.applyTransformAndProjectDirection();
    }
    applyTransformAndProjectDirection() {
      vec3_exports.transformMat4(this._direction, this._direction, this._projectionMatrix);
      vec3_exports.normalize(this._direction, this._direction);
      this.applyTransformToDirection();
    }
    applyTransformToDirection() {
      this.object.transformVectorWorld(this._direction, this._direction);
      this.object.getPositionWorld(this._origin);
    }
    rayCast(originalEvent, frame = null, doClick = false) {
      const rayHit = this.rayCastMode == 0 ? this.engine.scene.rayCast(this._origin, this._direction, this._collisionMask) : this.engine.physics.rayCast(this._origin, this._direction, this._collisionMask, this.maxDistance);
      let hitResultDistance = Infinity;
      let hitTestResult = null;
      if (this._hitTestLocation?.visible) {
        this._hitTestObject.getPositionWorld(this.cursorPos);
        hitResultDistance = vec3_exports.distance(this.object.getPositionWorld(tempVec2), this.cursorPos);
        hitTestResult = this._hitTestLocation?.getHitTestResults(frame)[0];
      }
      let hoveringReality = false;
      if (rayHit.hitCount > 0) {
        const d = rayHit.distances[0];
        if (hitResultDistance >= d) {
          this.cursorPos.set(rayHit.locations[0]);
        } else {
          hoveringReality = true;
        }
      } else if (hitResultDistance < Infinity) {
      } else {
        this.cursorPos.fill(0);
      }
      if (hoveringReality && !this.hoveringReality) {
        this.hitTestTarget.onHover.notify(hitTestResult, this);
      } else if (!hoveringReality && this.hoveringReality) {
        this.hitTestTarget.onUnhover.notify(hitTestResult, this);
      }
      this.hoveringReality = hoveringReality;
      this.hoverBehaviour(rayHit, hitTestResult, doClick, originalEvent);
      return rayHit;
    }
  };
  __publicField(Cursor, "TypeName", "cursor");
  /* Dependencies is deprecated, but we keep it here for compatibility
   * with 1.0.0-rc2 until 1.0.0 is released */
  __publicField(Cursor, "Dependencies", [HitTestLocation]);
  __decorate4([
    property.int(1)
  ], Cursor.prototype, "collisionGroup", void 0);
  __decorate4([
    property.object()
  ], Cursor.prototype, "cursorRayObject", void 0);
  __decorate4([
    property.enum(["x", "y", "z", "none"], "z")
  ], Cursor.prototype, "cursorRayScalingAxis", void 0);
  __decorate4([
    property.object()
  ], Cursor.prototype, "cursorObject", void 0);
  __decorate4([
    property.enum(["input component", "left", "right", "none"], "input component")
  ], Cursor.prototype, "handedness", void 0);
  __decorate4([
    property.enum(["collision", "physx"], "collision")
  ], Cursor.prototype, "rayCastMode", void 0);
  __decorate4([
    property.float(100)
  ], Cursor.prototype, "maxDistance", void 0);
  __decorate4([
    property.bool(true)
  ], Cursor.prototype, "styleCursor", void 0);
  __decorate4([
    property.bool(false)
  ], Cursor.prototype, "useWebXRHitTest", void 0);

  // node_modules/@wonderlandengine/components/dist/debug-object.js
  var __decorate5 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i2 = decorators.length - 1; i2 >= 0; i2--)
        if (d = decorators[i2])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var DebugObject = class extends Component {
    /** A second object to print the name of */
    obj = null;
    start() {
      let origin = new Float32Array(3);
      quat2_exports.getTranslation(origin, this.object.transformWorld);
      console.log("Debug object:", this.object.name);
      console.log("Other object:", this.obj?.name);
      console.log("	translation", origin);
      console.log("	transformWorld", this.object.transformWorld);
      console.log("	transformLocal", this.object.transformLocal);
    }
  };
  __publicField(DebugObject, "TypeName", "debug-object");
  __decorate5([
    property.object()
  ], DebugObject.prototype, "obj", void 0);

  // node_modules/@wonderlandengine/components/dist/device-orientation-look.js
  function quatFromEulerYXZ(out, x, y, z) {
    const c1 = Math.cos(x / 2);
    const c2 = Math.cos(y / 2);
    const c3 = Math.cos(z / 2);
    const s1 = Math.sin(x / 2);
    const s2 = Math.sin(y / 2);
    const s3 = Math.sin(z / 2);
    out[0] = s1 * c2 * c3 + c1 * s2 * s3;
    out[1] = c1 * s2 * c3 - s1 * c2 * s3;
    out[2] = c1 * c2 * s3 - s1 * s2 * c3;
    out[3] = c1 * c2 * c3 + s1 * s2 * s3;
  }
  var DeviceOrientationLook = class extends Component {
    start() {
      this.rotationX = 0;
      this.rotationY = 0;
      this.lastClientX = -1;
      this.lastClientY = -1;
    }
    init() {
      this.deviceOrientation = [0, 0, 0, 1];
      this.screenOrientation = window.innerHeight > window.innerWidth ? 0 : 90;
      this._origin = [0, 0, 0];
      window.addEventListener("deviceorientation", function(e) {
        let alpha = e.alpha || 0;
        let beta = e.beta || 0;
        let gamma = e.gamma || 0;
        const toRad = Math.PI / 180;
        quatFromEulerYXZ(this.deviceOrientation, beta * toRad, alpha * toRad, -gamma * toRad);
      }.bind(this));
      window.addEventListener("orientationchange", function(e) {
        this.screenOrientation = window.orientation || 0;
      }.bind(this), false);
    }
    update() {
      if (this.engine.xr)
        return;
      this.object.getTranslationLocal(this._origin);
      this.object.resetTransform();
      if (this.screenOrientation != 0) {
        this.object.rotateAxisAngleDeg([0, 0, -1], this.screenOrientation);
      }
      this.object.rotate([-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)]);
      this.object.rotate(this.deviceOrientation);
      this.object.translate(this._origin);
    }
  };
  __publicField(DeviceOrientationLook, "TypeName", "device-orientation-look");
  __publicField(DeviceOrientationLook, "Properties", {});

  // node_modules/@wonderlandengine/components/dist/finger-cursor.js
  var FingerCursor = class extends Component {
    init() {
      this.lastTarget = null;
    }
    start() {
      this.tip = this.object.getComponent("collision");
    }
    update() {
      const overlaps = this.tip.queryOverlaps();
      let overlapFound = null;
      for (let i2 = 0; i2 < overlaps.length; ++i2) {
        const o = overlaps[i2].object;
        const target = o.getComponent("cursor-target");
        if (target) {
          if (!target.equals(this.lastTarget)) {
            target.onHover(o, this);
            target.onClick(o, this);
          }
          overlapFound = target;
          break;
        }
      }
      if (!overlapFound) {
        if (this.lastTarget)
          this.lastTarget.onUnhover(this.lastTarget.object, this);
        this.lastTarget = null;
        return;
      } else {
        this.lastTarget = overlapFound;
      }
    }
  };
  __publicField(FingerCursor, "TypeName", "finger-cursor");
  __publicField(FingerCursor, "Properties", {});

  // node_modules/@wonderlandengine/components/dist/fixed-foveation.js
  var FixedFoveation = class extends Component {
    start() {
      this.onSessionStartCallback = this.setFixedFoveation.bind(this);
    }
    onActivate() {
      this.engine.onXRSessionStart.add(this.onSessionStartCallback);
    }
    onDeactivate() {
      this.engine.onXRSessionStart.remove(this.onSessionStartCallback);
    }
    setFixedFoveation() {
      this.engine.xr.baseLayer.fixedFoveation = this.fixedFoveation;
    }
  };
  __publicField(FixedFoveation, "TypeName", "fixed-foveation");
  __publicField(FixedFoveation, "Properties", {
    /** Amount to apply from 0 (none) to 1 (full) */
    fixedFoveation: { type: Type.Float, default: 0.5 }
  });

  // node_modules/@wonderlandengine/components/dist/hand-tracking.js
  var __decorate6 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i2 = decorators.length - 1; i2 >= 0; i2--)
        if (d = decorators[i2])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var ORDERED_JOINTS = [
    "wrist",
    "thumb-metacarpal",
    "thumb-phalanx-proximal",
    "thumb-phalanx-distal",
    "thumb-tip",
    "index-finger-metacarpal",
    "index-finger-phalanx-proximal",
    "index-finger-phalanx-intermediate",
    "index-finger-phalanx-distal",
    "index-finger-tip",
    "middle-finger-metacarpal",
    "middle-finger-phalanx-proximal",
    "middle-finger-phalanx-intermediate",
    "middle-finger-phalanx-distal",
    "middle-finger-tip",
    "ring-finger-metacarpal",
    "ring-finger-phalanx-proximal",
    "ring-finger-phalanx-intermediate",
    "ring-finger-phalanx-distal",
    "ring-finger-tip",
    "pinky-finger-metacarpal",
    "pinky-finger-phalanx-proximal",
    "pinky-finger-phalanx-intermediate",
    "pinky-finger-phalanx-distal",
    "pinky-finger-tip"
  ];
  var invTranslation = vec3_exports.create();
  var invRotation = quat_exports.create();
  var tempVec0 = vec3_exports.create();
  var tempVec1 = vec3_exports.create();
  var HandTracking = class extends Component {
    /** Handedness determining whether to receive tracking input from right or left hand */
    handedness = 0;
    /** (optional) Mesh to use to visualize joints */
    jointMesh = null;
    /** Material to use for display. Applied to either the spawned skinned mesh or the joint spheres. */
    jointMaterial = null;
    /** (optional) Skin to apply tracked joint poses to. If not present,
     * joint spheres will be used for display instead. */
    handSkin = null;
    /** Deactivate children if no pose was tracked */
    deactivateChildrenWithoutPose = true;
    /** Controller objects to activate including children if no pose is available */
    controllerToDeactivate = null;
    init() {
      this.handedness = ["left", "right"][this.handedness];
    }
    joints = {};
    session = null;
    /* Whether last update had a hand pose */
    hasPose = false;
    _childrenActive = true;
    start() {
      if (!("XRHand" in window)) {
        console.warn("WebXR Hand Tracking not supported by this browser.");
        this.active = false;
        return;
      }
      if (this.handSkin) {
        const skin = this.handSkin;
        const jointIds = skin.jointIds;
        this.joints[ORDERED_JOINTS[0]] = this.engine.wrapObject(jointIds[0]);
        for (let j = 0; j < jointIds.length; ++j) {
          const joint = this.engine.wrapObject(jointIds[j]);
          this.joints[joint.name] = joint;
        }
        return;
      }
      const jointObjects = this.engine.scene.addObjects(ORDERED_JOINTS.length, this.object, ORDERED_JOINTS.length);
      for (let j = 0; j < ORDERED_JOINTS.length; ++j) {
        const joint = jointObjects[j];
        joint.addComponent(MeshComponent, {
          mesh: this.jointMesh,
          material: this.jointMaterial
        });
        this.joints[ORDERED_JOINTS[j]] = joint;
        joint.name = ORDERED_JOINTS[j];
      }
    }
    update(dt) {
      if (!this.engine.xr)
        return;
      this.hasPose = false;
      if (this.engine.xr.session.inputSources) {
        for (let i2 = 0; i2 < this.engine.xr.session.inputSources.length; ++i2) {
          const inputSource = this.engine.xr.session.inputSources[i2];
          if (!inputSource?.hand || inputSource?.handedness != this.handedness)
            continue;
          const wristSpace = inputSource.hand.get("wrist");
          if (wristSpace) {
            const p = this.engine.xr.frame.getJointPose(wristSpace, this.engine.xr.currentReferenceSpace);
            if (p) {
              setXRRigidTransformLocal(this.object, p.transform);
            }
          }
          this.object.getRotationLocal(invRotation);
          quat_exports.conjugate(invRotation, invRotation);
          this.object.getPositionLocal(invTranslation);
          this.joints["wrist"].resetTransform();
          for (let j = 0; j < ORDERED_JOINTS.length; ++j) {
            const jointName = ORDERED_JOINTS[j];
            const joint = this.joints[jointName];
            if (!joint)
              continue;
            let jointPose = null;
            const jointSpace = inputSource.hand.get(jointName);
            if (jointSpace) {
              jointPose = this.engine.xr.frame.getJointPose(jointSpace, this.engine.xr.currentReferenceSpace);
            }
            if (jointPose) {
              this.hasPose = true;
              joint.resetPositionRotation();
              joint.translateLocal([
                jointPose.transform.position.x - invTranslation[0],
                jointPose.transform.position.y - invTranslation[1],
                jointPose.transform.position.z - invTranslation[2]
              ]);
              joint.rotateLocal(invRotation);
              joint.rotateObject([
                jointPose.transform.orientation.x,
                jointPose.transform.orientation.y,
                jointPose.transform.orientation.z,
                jointPose.transform.orientation.w
              ]);
              if (!this.handSkin) {
                const r = jointPose.radius || 7e-3;
                joint.setScalingLocal([r, r, r]);
              }
            }
          }
        }
      }
      if (!this.hasPose && this._childrenActive) {
        this._childrenActive = false;
        if (this.deactivateChildrenWithoutPose) {
          this.setChildrenActive(false);
        }
        if (this.controllerToDeactivate) {
          this.controllerToDeactivate.active = true;
          this.setChildrenActive(true, this.controllerToDeactivate);
        }
      } else if (this.hasPose && !this._childrenActive) {
        this._childrenActive = true;
        if (this.deactivateChildrenWithoutPose) {
          this.setChildrenActive(true);
        }
        if (this.controllerToDeactivate) {
          this.controllerToDeactivate.active = false;
          this.setChildrenActive(false, this.controllerToDeactivate);
        }
      }
    }
    setChildrenActive(active, object) {
      object = object || this.object;
      const children = object.children;
      for (const o of children) {
        o.active = active;
        this.setChildrenActive(active, o);
      }
    }
    isGrabbing() {
      this.joints["index-finger-tip"].getPositionLocal(tempVec0);
      this.joints["thumb-tip"].getPositionLocal(tempVec1);
      return vec3_exports.sqrDist(tempVec0, tempVec1) < 1e-3;
    }
  };
  __publicField(HandTracking, "TypeName", "hand-tracking");
  __decorate6([
    property.enum(["left", "right"])
  ], HandTracking.prototype, "handedness", void 0);
  __decorate6([
    property.mesh()
  ], HandTracking.prototype, "jointMesh", void 0);
  __decorate6([
    property.material()
  ], HandTracking.prototype, "jointMaterial", void 0);
  __decorate6([
    property.skin()
  ], HandTracking.prototype, "handSkin", void 0);
  __decorate6([
    property.bool(true)
  ], HandTracking.prototype, "deactivateChildrenWithoutPose", void 0);
  __decorate6([
    property.object()
  ], HandTracking.prototype, "controllerToDeactivate", void 0);

  // node_modules/@wonderlandengine/components/dist/howler-audio-listener.js
  var import_howler = __toESM(require_howler(), 1);
  var HowlerAudioListener = class extends Component {
    init() {
      this.origin = new Float32Array(3);
      this.fwd = new Float32Array(3);
      this.up = new Float32Array(3);
    }
    update() {
      if (!this.spatial)
        return;
      this.object.getTranslationWorld(this.origin);
      this.object.getForward(this.fwd);
      this.object.getUp(this.up);
      Howler.pos(this.origin[0], this.origin[1], this.origin[2]);
      Howler.orientation(this.fwd[0], this.fwd[1], this.fwd[2], this.up[0], this.up[1], this.up[2]);
    }
  };
  __publicField(HowlerAudioListener, "TypeName", "howler-audio-listener");
  __publicField(HowlerAudioListener, "Properties", {
    /** Whether audio should be spatialized/positional. */
    spatial: { type: Type.Bool, default: true }
  });

  // node_modules/@wonderlandengine/components/dist/howler-audio-source.js
  var import_howler2 = __toESM(require_howler(), 1);
  var HowlerAudioSource = class extends Component {
    start() {
      this.audio = new Howl({
        src: [this.src],
        loop: this.loop,
        volume: this.volume,
        autoplay: this.autoplay
      });
      this.lastPlayedAudioId = null;
      this.origin = new Float32Array(3);
      this.lastOrigin = new Float32Array(3);
      if (this.spatial && this.autoplay) {
        this.updatePosition();
        this.play();
      }
    }
    update() {
      if (!this.spatial || !this.lastPlayedAudioId)
        return;
      this.object.getTranslationWorld(this.origin);
      if (Math.abs(this.lastOrigin[0] - this.origin[0]) > 5e-3 || Math.abs(this.lastOrigin[1] - this.origin[1]) > 5e-3 || Math.abs(this.lastOrigin[2] - this.origin[2]) > 5e-3) {
        this.updatePosition();
      }
    }
    updatePosition() {
      this.audio.pos(this.origin[0], this.origin[1], this.origin[2], this.lastPlayedAudioId);
      this.lastOrigin.set(this.origin);
    }
    play() {
      if (this.lastPlayedAudioId)
        this.audio.stop(this.lastPlayedAudioId);
      this.lastPlayedAudioId = this.audio.play();
      if (this.spatial)
        this.updatePosition();
    }
    stop() {
      if (!this.lastPlayedAudioId)
        return;
      this.audio.stop(this.lastPlayedAudioId);
      this.lastPlayedAudioId = null;
    }
    onDeactivate() {
      this.stop();
    }
  };
  __publicField(HowlerAudioSource, "TypeName", "howler-audio-source");
  __publicField(HowlerAudioSource, "Properties", {
    /** Volume */
    volume: { type: Type.Float, default: 1 },
    /** Whether audio should be spatialized/positional */
    spatial: { type: Type.Bool, default: true },
    /** Whether to loop the sound */
    loop: { type: Type.Bool, default: false },
    /** Whether to start playing automatically */
    autoplay: { type: Type.Bool, default: false },
    /** URL to a sound file to play */
    src: { type: Type.String, default: "" }
  });

  // node_modules/@wonderlandengine/components/dist/utils/utils.js
  function setFirstMaterialTexture(mat, texture, customTextureProperty) {
    if (customTextureProperty !== "auto") {
      mat[customTextureProperty] = texture;
      return true;
    }
    const shader = mat.shader;
    if (shader === "Flat Opaque Textured") {
      mat.flatTexture = texture;
      return true;
    } else if (shader === "Phong Opaque Textured" || shader === "Foliage" || shader === "Phong Normalmapped" || shader === "Phong Lightmapped") {
      mat.diffuseTexture = texture;
      return true;
    } else if (shader === "Particle") {
      mat.mainTexture = texture;
      return true;
    } else if (shader === "DistanceFieldVector") {
      mat.vectorTexture = texture;
      return true;
    } else if (shader === "Background" || shader === "Sky") {
      mat.texture = texture;
      return true;
    } else if (shader === "Physical Opaque Textured") {
      mat.albedoTexture = texture;
      return true;
    }
    return false;
  }
  function deg2rad(value2) {
    return value2 * Math.PI / 180;
  }
  function rad2deg(value2) {
    return value2 * 180 / Math.PI;
  }

  // node_modules/@wonderlandengine/components/dist/image-texture.js
  var ImageTexture = class extends Component {
    start() {
      if (!this.material) {
        throw Error("image-texture: material property not set");
      }
      this.engine.textures.load(this.url, "anonymous").then((texture) => {
        const mat = this.material;
        if (!setFirstMaterialTexture(mat, texture, this.textureProperty)) {
          console.error("Shader", mat.shader, "not supported by image-texture");
        }
      }).catch(console.err);
    }
  };
  __publicField(ImageTexture, "TypeName", "image-texture");
  __publicField(ImageTexture, "Properties", {
    /** URL to download the image from */
    url: Property.string(),
    /** Material to apply the video texture to */
    material: Property.material(),
    /** Name of the texture property to set */
    textureProperty: Property.string("auto")
  });

  // node_modules/@wonderlandengine/components/dist/mouse-look.js
  var __decorate7 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i2 = decorators.length - 1; i2 >= 0; i2--)
        if (d = decorators[i2])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var preventDefault = (e) => {
    e.preventDefault();
  };
  var MouseLookComponent = class extends Component {
    /** Mouse look sensitivity */
    sensitity = 0.25;
    /** Require a mouse button to be pressed to control view.
     * Otherwise view will allways follow mouse movement */
    requireMouseDown = true;
    /** If "moveOnClick" is enabled, mouse button which should
     * be held down to control view */
    mouseButtonIndex = 0;
    /** Enables pointer lock on "mousedown" event on canvas */
    pointerLockOnClick = false;
    currentRotationY = 0;
    currentRotationX = 0;
    origin = new Float32Array(3);
    parentOrigin = new Float32Array(3);
    rotationX = 0;
    rotationY = 0;
    mouseDown = false;
    onActivate() {
      document.addEventListener("mousemove", this.onMouseMove);
      const canvas2 = this.engine.canvas;
      if (this.pointerLockOnClick) {
        canvas2.addEventListener("mousedown", this.requestPointerLock);
      }
      if (this.requireMouseDown) {
        if (this.mouseButtonIndex === 2) {
          canvas2.addEventListener("contextmenu", preventDefault, false);
        }
        canvas2.addEventListener("mousedown", this.onMouseDown);
        canvas2.addEventListener("mouseup", this.onMouseUp);
      }
    }
    onDeactivate() {
      document.removeEventListener("mousemove", this.onMouseMove);
      const canvas2 = this.engine.canvas;
      if (this.pointerLockOnClick) {
        canvas2.removeEventListener("mousedown", this.requestPointerLock);
      }
      if (this.requireMouseDown) {
        if (this.mouseButtonIndex === 2) {
          canvas2.removeEventListener("contextmenu", preventDefault, false);
        }
        canvas2.removeEventListener("mousedown", this.onMouseDown);
        canvas2.removeEventListener("mouseup", this.onMouseUp);
      }
    }
    requestPointerLock = () => {
      const canvas2 = this.engine.canvas;
      canvas2.requestPointerLock = canvas2.requestPointerLock || canvas2.mozRequestPointerLock || canvas2.webkitRequestPointerLock;
      canvas2.requestPointerLock();
    };
    onMouseDown = (e) => {
      if (e.button === this.mouseButtonIndex) {
        this.mouseDown = true;
        document.body.style.cursor = "grabbing";
        if (e.button === 1) {
          e.preventDefault();
          return false;
        }
      }
    };
    onMouseUp = (e) => {
      if (e.button === this.mouseButtonIndex) {
        this.mouseDown = false;
        document.body.style.cursor = "initial";
      }
    };
    onMouseMove = (e) => {
      if (this.active && (this.mouseDown || !this.requireMouseDown)) {
        this.rotationY = -this.sensitity * e.movementX / 100;
        this.rotationX = -this.sensitity * e.movementY / 100;
        this.currentRotationX += this.rotationX;
        this.currentRotationY += this.rotationY;
        this.currentRotationX = Math.min(1.507, this.currentRotationX);
        this.currentRotationX = Math.max(-1.507, this.currentRotationX);
        this.object.getPositionWorld(this.origin);
        const parent = this.object.parent;
        if (parent) {
          parent.getPositionWorld(this.parentOrigin);
          vec3_exports.sub(this.origin, this.origin, this.parentOrigin);
        }
        this.object.resetPositionRotation();
        this.object.rotateAxisAngleRadLocal([1, 0, 0], this.currentRotationX);
        this.object.rotateAxisAngleRadLocal([0, 1, 0], this.currentRotationY);
        this.object.translateLocal(this.origin);
      }
    };
  };
  __publicField(MouseLookComponent, "TypeName", "mouse-look");
  __decorate7([
    property.float(0.25)
  ], MouseLookComponent.prototype, "sensitity", void 0);
  __decorate7([
    property.bool(true)
  ], MouseLookComponent.prototype, "requireMouseDown", void 0);
  __decorate7([
    property.int()
  ], MouseLookComponent.prototype, "mouseButtonIndex", void 0);
  __decorate7([
    property.bool(false)
  ], MouseLookComponent.prototype, "pointerLockOnClick", void 0);

  // node_modules/@wonderlandengine/components/dist/player-height.js
  var __decorate8 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i2 = decorators.length - 1; i2 >= 0; i2--)
        if (d = decorators[i2])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var PlayerHeight = class extends Component {
    height = 1.75;
    onSessionStartCallback;
    onSessionEndCallback;
    start() {
      this.object.resetPositionRotation();
      this.object.translateLocal([0, this.height, 0]);
      this.onSessionStartCallback = this.onXRSessionStart.bind(this);
      this.onSessionEndCallback = this.onXRSessionEnd.bind(this);
    }
    onActivate() {
      this.engine.onXRSessionStart.add(this.onSessionStartCallback);
      this.engine.onXRSessionEnd.add(this.onSessionEndCallback);
    }
    onDeactivate() {
      this.engine.onXRSessionStart.remove(this.onSessionStartCallback);
      this.engine.onXRSessionEnd.remove(this.onSessionEndCallback);
    }
    onXRSessionStart() {
      const type = this.engine.xr?.currentReferenceSpaceType;
      if (type !== "local" && type !== "viewer") {
        this.object.resetPositionRotation();
      }
    }
    onXRSessionEnd() {
      const type = this.engine.xr?.currentReferenceSpaceType;
      if (type !== "local" && type !== "viewer") {
        this.object.resetPositionRotation();
        this.object.translateLocal([0, this.height, 0]);
      }
    }
  };
  __publicField(PlayerHeight, "TypeName", "player-height");
  __decorate8([
    property.float(1.75)
  ], PlayerHeight.prototype, "height", void 0);

  // node_modules/@wonderlandengine/components/dist/target-framerate.js
  var TargetFramerate = class extends Component {
    start() {
      this.onSessionStartCallback = this.setTargetFramerate.bind(this);
    }
    onActivate() {
      this.engine.onXRSessionStart.add(this.onSessionStartCallback);
    }
    onDeactivate() {
      this.engine.onXRSessionStart.remove(this.onSessionStartCallback);
    }
    setTargetFramerate(s) {
      if (s.supportedFrameRates && s.updateTargetFrameRate) {
        const a = this.engine.xr.session.supportedFrameRates;
        a.sort((a2, b) => Math.abs(a2 - this.framerate) - Math.abs(b - this.framerate));
        this.engine.xr.session.updateTargetFrameRate(a[0]);
      }
    }
  };
  __publicField(TargetFramerate, "TypeName", "target-framerate");
  __publicField(TargetFramerate, "Properties", {
    framerate: { type: Type.Float, default: 90 }
  });

  // node_modules/@wonderlandengine/components/dist/teleport.js
  var TeleportComponent = class extends Component {
    init() {
      this._prevThumbstickAxis = new Float32Array(2);
      this._tempVec = new Float32Array(3);
      this._tempVec0 = new Float32Array(3);
      this._currentIndicatorRotation = 0;
      this.input = this.object.getComponent("input");
      if (!this.input) {
        console.error(this.object.name, "generic-teleport-component.js: input component is required on the object");
        return;
      }
      if (!this.teleportIndicatorMeshObject) {
        console.error(this.object.name, "generic-teleport-component.js: Teleport indicator mesh is missing");
        return;
      }
      if (!this.camRoot) {
        console.error(this.object.name, "generic-teleport-component.js: camRoot not set");
        return;
      }
      this.isIndicating = false;
      this.indicatorHidden = true;
      this.hitSpot = new Float32Array(3);
      this._hasHit = false;
      this._extraRotation = 0;
      this._currentStickAxes = new Float32Array(2);
    }
    start() {
      if (this.cam) {
        this.isMouseIndicating = false;
        canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
        canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
      }
      if (this.handedness == 0) {
        const inputComp = this.object.getComponent("input");
        if (!inputComp) {
          console.warn("teleport component on object", this.object.name, 'was configured with handedness "input component", but object has no input component.');
        } else {
          this.handedness = inputComp.handedness;
          this.input = inputComp;
        }
      } else {
        this.handedness = ["left", "right"][this.handedness - 1];
      }
      this.onSessionStartCallback = this.setupVREvents.bind(this);
      this.teleportIndicatorMeshObject.active = false;
    }
    onActivate() {
      this.engine.onXRSessionStart.add(this.onSessionStartCallback);
    }
    onDeactivate() {
      this.engine.onXRSessionStart.remove(this.onSessionStartCallback);
    }
    /* Get current camera Y rotation */
    _getCamRotation() {
      this.eyeLeft.getForward(this._tempVec);
      this._tempVec[1] = 0;
      vec3_exports.normalize(this._tempVec, this._tempVec);
      return Math.atan2(this._tempVec[0], this._tempVec[2]);
    }
    update() {
      let inputLength = 0;
      if (this.gamepad && this.gamepad.axes) {
        this._currentStickAxes[0] = this.gamepad.axes[2];
        this._currentStickAxes[1] = this.gamepad.axes[3];
        inputLength = Math.abs(this._currentStickAxes[0]) + Math.abs(this._currentStickAxes[1]);
      }
      if (!this.isIndicating && this._prevThumbstickAxis[1] >= this.thumbstickActivationThreshhold && this._currentStickAxes[1] < this.thumbstickActivationThreshhold) {
        this.isIndicating = true;
      } else if (this.isIndicating && inputLength < this.thumbstickDeactivationThreshhold) {
        this.isIndicating = false;
        this.teleportIndicatorMeshObject.active = false;
        if (this._hasHit) {
          this._teleportPlayer(this.hitSpot, this._extraRotation);
        }
      }
      if (this.isIndicating && this.teleportIndicatorMeshObject && this.input) {
        const origin = this._tempVec0;
        this.object.getPositionWorld(origin);
        const direction2 = this.object.getForwardWorld(this._tempVec);
        let rayHit = this.rayHit = this.rayCastMode == 0 ? this.engine.scene.rayCast(origin, direction2, 1 << this.floorGroup) : this.engine.physics.rayCast(origin, direction2, 1 << this.floorGroup, this.maxDistance);
        if (rayHit.hitCount > 0) {
          this.indicatorHidden = false;
          this._extraRotation = Math.PI + Math.atan2(this._currentStickAxes[0], this._currentStickAxes[1]);
          this._currentIndicatorRotation = this._getCamRotation() + (this._extraRotation - Math.PI);
          this.teleportIndicatorMeshObject.resetPositionRotation();
          this.teleportIndicatorMeshObject.rotateAxisAngleRad([0, 1, 0], this._currentIndicatorRotation);
          this.teleportIndicatorMeshObject.translate(rayHit.locations[0]);
          this.teleportIndicatorMeshObject.translate([
            0,
            this.indicatorYOffset,
            0
          ]);
          this.teleportIndicatorMeshObject.active = true;
          this.hitSpot.set(rayHit.locations[0]);
          this._hasHit = true;
        } else {
          if (!this.indicatorHidden) {
            this.teleportIndicatorMeshObject.active = false;
            this.indicatorHidden = true;
          }
          this._hasHit = false;
        }
      } else if (this.teleportIndicatorMeshObject && this.isMouseIndicating) {
        this.onMousePressed();
      }
      this._prevThumbstickAxis.set(this._currentStickAxes);
    }
    setupVREvents(s) {
      this.session = s;
      s.addEventListener("end", function() {
        this.gamepad = null;
        this.session = null;
      }.bind(this));
      if (s.inputSources && s.inputSources.length) {
        for (let i2 = 0; i2 < s.inputSources.length; i2++) {
          let inputSource = s.inputSources[i2];
          if (inputSource.handedness == this.handedness) {
            this.gamepad = inputSource.gamepad;
          }
        }
      }
      s.addEventListener("inputsourceschange", function(e) {
        if (e.added && e.added.length) {
          for (let i2 = 0; i2 < e.added.length; i2++) {
            let inputSource = e.added[i2];
            if (inputSource.handedness == this.handedness) {
              this.gamepad = inputSource.gamepad;
            }
          }
        }
      }.bind(this));
    }
    onMouseDown() {
      this.isMouseIndicating = true;
    }
    onMouseUp() {
      this.isMouseIndicating = false;
      this.teleportIndicatorMeshObject.active = false;
      if (this._hasHit) {
        this._teleportPlayer(this.hitSpot, 0);
      }
    }
    onMousePressed() {
      let origin = [0, 0, 0];
      this.cam.getPositionWorld(origin);
      const direction2 = this.cam.getForward(this._tempVec);
      let rayHit = this.rayHit = this.rayCastMode == 0 ? this.engine.scene.rayCast(origin, direction2, 1 << this.floorGroup) : this.engine.physics.rayCast(origin, direction2, 1 << this.floorGroup, this.maxDistance);
      if (rayHit.hitCount > 0) {
        this.indicatorHidden = false;
        direction2[1] = 0;
        vec3_exports.normalize(direction2, direction2);
        this._currentIndicatorRotation = -Math.sign(direction2[2]) * Math.acos(direction2[0]) - Math.PI * 0.5;
        this.teleportIndicatorMeshObject.resetPositionRotation();
        this.teleportIndicatorMeshObject.rotateAxisAngleRad([0, 1, 0], this._currentIndicatorRotation);
        this.teleportIndicatorMeshObject.translate(rayHit.locations[0]);
        this.teleportIndicatorMeshObject.active = true;
        this.hitSpot = rayHit.locations[0];
        this._hasHit = true;
      } else {
        if (!this.indicatorHidden) {
          this.teleportIndicatorMeshObject.active = false;
          this.indicatorHidden = true;
        }
        this._hasHit = false;
      }
    }
    _teleportPlayer(newPosition, rotationToAdd) {
      this.camRoot.rotateAxisAngleRad([0, 1, 0], rotationToAdd);
      const p = this._tempVec;
      const p1 = this._tempVec0;
      if (this.session) {
        this.eyeLeft.getPositionWorld(p);
        this.eyeRight.getPositionWorld(p1);
        vec3_exports.add(p, p, p1);
        vec3_exports.scale(p, p, 0.5);
      } else {
        this.cam.getPositionWorld(p);
      }
      this.camRoot.getPositionWorld(p1);
      vec3_exports.sub(p, p1, p);
      p[0] += newPosition[0];
      p[1] = newPosition[1];
      p[2] += newPosition[2];
      this.camRoot.setPositionWorld(p);
    }
  };
  __publicField(TeleportComponent, "TypeName", "teleport");
  __publicField(TeleportComponent, "Properties", {
    /** Object that will be placed as indiciation forwhere the player will teleport to. */
    teleportIndicatorMeshObject: { type: Type.Object },
    /** Root of the player, the object that will be positioned on teleportation. */
    camRoot: { type: Type.Object },
    /** Non-vr camera for use outside of VR */
    cam: { type: Type.Object },
    /** Left eye for use in VR*/
    eyeLeft: { type: Type.Object },
    /** Right eye for use in VR*/
    eyeRight: { type: Type.Object },
    /** Handedness for VR cursors to accept trigger events only from respective controller. */
    handedness: {
      type: Type.Enum,
      values: ["input component", "left", "right", "none"],
      default: "input component"
    },
    /** Collision group of valid "floor" objects that can be teleported on */
    floorGroup: { type: Type.Int, default: 1 },
    /** How far the thumbstick needs to be pushed to have the teleport target indicator show up */
    thumbstickActivationThreshhold: { type: Type.Float, default: -0.7 },
    /** How far the thumbstick needs to be released to execute the teleport */
    thumbstickDeactivationThreshhold: { type: Type.Float, default: 0.3 },
    /** Offset to apply to the indicator object, e.g. to avoid it from Z-fighting with the floor */
    indicatorYOffset: { type: Type.Float, default: 0.01 },
    /** Mode for raycasting, whether to use PhysX or simple collision components */
    rayCastMode: {
      type: Type.Enum,
      values: ["collision", "physx"],
      default: "collision"
    },
    /** Max distance for PhysX raycast */
    maxDistance: { type: Type.Float, default: 100 }
  });

  // node_modules/@wonderlandengine/components/dist/trail.js
  var __decorate9 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i2 = decorators.length - 1; i2 >= 0; i2--)
        if (d = decorators[i2])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var direction = vec3_exports.create();
  var offset = vec3_exports.create();
  var normal = vec3_exports.create();
  var UP = vec3_exports.fromValues(0, 1, 0);
  var Trail = class extends Component {
    /** The material to apply to the trail mesh */
    material = null;
    /** The number of segments in the trail mesh */
    segments = 50;
    /** The time interval before recording a new point */
    interval = 0.1;
    /** The width of the trail (in world space) */
    width = 1;
    /** Whether or not the trail should taper off */
    taper = true;
    /**
     * The maximum delta time in seconds, above which the trail resets.
     * This prevents the trail from jumping around when updates happen
     * infrequently (e.g. when the tab doesn't have focus).
     */
    resetThreshold = 0.5;
    _currentPointIndex = 0;
    _timeTillNext = 0;
    _points = [];
    _trailContainer = null;
    _meshComp = null;
    _mesh = null;
    _indexData = null;
    start() {
      this._points = new Array(this.segments + 1);
      for (let i2 = 0; i2 < this._points.length; ++i2) {
        this._points[i2] = vec3_exports.create();
      }
      this._timeTillNext = this.interval;
      this._trailContainer = this.engine.scene.addObject();
      this._meshComp = this._trailContainer.addComponent("mesh");
      this._meshComp.material = this.material;
      const vertexCount = 2 * this._points.length;
      this._indexData = new Uint32Array(6 * this.segments);
      for (let i2 = 0, v = 0; i2 < vertexCount - 2; i2 += 2, v += 6) {
        this._indexData.subarray(v, v + 6).set([i2 + 1, i2 + 0, i2 + 2, i2 + 2, i2 + 3, i2 + 1]);
      }
      this._mesh = new Mesh(this.engine, {
        vertexCount,
        indexData: this._indexData,
        indexType: MeshIndexType.UnsignedInt
      });
      this._meshComp.mesh = this._mesh;
    }
    updateVertices() {
      if (!this._mesh)
        return;
      const positions = this._mesh.attribute(MeshAttribute.Position);
      const texCoords = this._mesh.attribute(MeshAttribute.TextureCoordinate);
      const normals = this._mesh.attribute(MeshAttribute.Normal);
      vec3_exports.set(direction, 0, 0, 0);
      for (let i2 = 0; i2 < this._points.length; ++i2) {
        const curr = this._points[(this._currentPointIndex + i2 + 1) % this._points.length];
        const next = this._points[(this._currentPointIndex + i2 + 2) % this._points.length];
        if (i2 !== this._points.length - 1) {
          vec3_exports.sub(direction, next, curr);
        }
        vec3_exports.cross(offset, UP, direction);
        vec3_exports.normalize(offset, offset);
        const timeFraction = 1 - this._timeTillNext / this.interval;
        const fraction = (i2 - timeFraction) / this.segments;
        vec3_exports.scale(offset, offset, (this.taper ? fraction : 1) * this.width / 2);
        positions.set(i2 * 2, [
          curr[0] - offset[0],
          curr[1] - offset[1],
          curr[2] - offset[2]
        ]);
        positions.set(i2 * 2 + 1, [
          curr[0] + offset[0],
          curr[1] + offset[1],
          curr[2] + offset[2]
        ]);
        if (normals) {
          vec3_exports.cross(normal, direction, offset);
          vec3_exports.normalize(normal, normal);
          normals.set(i2 * 2, normal);
          normals.set(i2 * 2 + 1, normal);
        }
        if (texCoords) {
          texCoords.set(i2 * 2, [0, fraction]);
          texCoords.set(i2 * 2 + 1, [1, fraction]);
        }
      }
      this._mesh.update();
    }
    resetTrail() {
      this.object.getPositionWorld(this._points[0]);
      for (let i2 = 1; i2 < this._points.length; ++i2) {
        vec3_exports.copy(this._points[i2], this._points[0]);
      }
      this._currentPointIndex = 0;
      this._timeTillNext = this.interval;
    }
    update(dt) {
      this._timeTillNext -= dt;
      if (dt > this.resetThreshold) {
        this.resetTrail();
      }
      if (this._timeTillNext < 0) {
        this._currentPointIndex = (this._currentPointIndex + 1) % this._points.length;
        this._timeTillNext = this._timeTillNext % this.interval + this.interval;
      }
      this.object.getPositionWorld(this._points[this._currentPointIndex]);
      this.updateVertices();
    }
    onActivate() {
      this.resetTrail();
      if (this._meshComp)
        this._meshComp.active = true;
    }
    onDeactivate() {
      if (this._meshComp)
        this._meshComp.active = false;
    }
    onDestroy() {
      if (this._trailContainer)
        this._trailContainer.destroy();
      if (this._meshComp)
        this._meshComp.destroy();
      if (this._mesh)
        this._mesh.destroy();
    }
  };
  __publicField(Trail, "TypeName", "trail");
  __decorate9([
    property.material()
  ], Trail.prototype, "material", void 0);
  __decorate9([
    property.int(50)
  ], Trail.prototype, "segments", void 0);
  __decorate9([
    property.float(50)
  ], Trail.prototype, "interval", void 0);
  __decorate9([
    property.float(1)
  ], Trail.prototype, "width", void 0);
  __decorate9([
    property.bool(true)
  ], Trail.prototype, "taper", void 0);
  __decorate9([
    property.float(1)
  ], Trail.prototype, "resetThreshold", void 0);

  // node_modules/@wonderlandengine/components/dist/two-joint-ik-solver.js
  function clamp2(v, a, b) {
    return Math.max(a, Math.min(v, b));
  }
  var rootScaling = new Float32Array(3);
  var tempQuat3 = new Float32Array(4);
  var middlePos = new Float32Array(3);
  var endPos = new Float32Array(3);
  var targetPos = new Float32Array(3);
  var helperPos = new Float32Array(3);
  var rootTransform = new Float32Array(8);
  var middleTransform = new Float32Array(8);
  var endTransform = new Float32Array(8);
  var twoJointIK = function() {
    const ta = new Float32Array(3);
    const ca = new Float32Array(3);
    const ba = new Float32Array(3);
    const ab = new Float32Array(3);
    const cb = new Float32Array(3);
    const axis0 = new Float32Array(3);
    const axis1 = new Float32Array(3);
    const temp = new Float32Array(3);
    return function(root, middle, b, c, targetPos2, eps, helper) {
      ba.set(b);
      const lab = vec3_exports.length(ba);
      vec3_exports.sub(ta, b, c);
      const lcb = vec3_exports.length(ta);
      ta.set(targetPos2);
      const lat = clamp2(vec3_exports.length(ta), eps, lab + lcb - eps);
      ca.set(c);
      vec3_exports.scale(ab, b, -1);
      vec3_exports.sub(cb, c, b);
      vec3_exports.normalize(ca, ca);
      vec3_exports.normalize(ba, ba);
      vec3_exports.normalize(ab, ab);
      vec3_exports.normalize(cb, cb);
      vec3_exports.normalize(ta, ta);
      const ac_ab_0 = Math.acos(clamp2(vec3_exports.dot(ca, ba), -1, 1));
      const ba_bc_0 = Math.acos(clamp2(vec3_exports.dot(ab, cb), -1, 1));
      const ac_at_0 = Math.acos(clamp2(vec3_exports.dot(ca, ta), -1, 1));
      const ac_ab_1 = Math.acos(clamp2((lcb * lcb - lab * lab - lat * lat) / (-2 * lab * lat), -1, 1));
      const ba_bc_1 = Math.acos(clamp2((lat * lat - lab * lab - lcb * lcb) / (-2 * lab * lcb), -1, 1));
      if (helper) {
        vec3_exports.sub(ba, helper, b);
        vec3_exports.normalize(ba, ba);
      }
      vec3_exports.cross(axis0, ca, ba);
      vec3_exports.normalize(axis0, axis0);
      vec3_exports.cross(axis1, c, targetPos2);
      vec3_exports.normalize(axis1, axis1);
      middle.transformVectorInverseLocal(temp, axis0);
      root.rotateAxisAngleRadObject(axis1, ac_at_0);
      root.rotateAxisAngleRadObject(axis0, ac_ab_1 - ac_ab_0);
      middle.rotateAxisAngleRadObject(axis0, ba_bc_1 - ba_bc_0);
    };
  }();
  var TwoJointIkSolver = class extends Component {
    time = 0;
    start() {
      this.root.getTransformLocal(rootTransform);
      this.middle.getTransformLocal(middleTransform);
      this.end.getTransformLocal(endTransform);
    }
    update(dt) {
      this.time += dt;
      this.root.setTransformLocal(rootTransform);
      this.middle.setTransformLocal(middleTransform);
      this.end.setTransformLocal(endTransform);
      this.root.getScalingWorld(rootScaling);
      this.middle.getPositionLocal(middlePos);
      this.end.getPositionLocal(endPos);
      this.middle.transformPointLocal(endPos, endPos);
      if (this.helper) {
        this.helper.getPositionWorld(helperPos);
        this.root.transformPointInverseWorld(helperPos, helperPos);
        vec3_exports.div(helperPos, helperPos, rootScaling);
      }
      this.target.getPositionWorld(targetPos);
      this.root.transformPointInverseWorld(targetPos, targetPos);
      vec3_exports.div(targetPos, targetPos, rootScaling);
      twoJointIK(this.root, this.middle, middlePos, endPos, targetPos, 0.01, this.helper ? helperPos : null, this.time);
      if (this.copyTargetRotation) {
        this.end.setRotationWorld(this.target.getRotationWorld(tempQuat3));
      }
    }
  };
  __publicField(TwoJointIkSolver, "TypeName", "two-joint-ik-solver");
  __publicField(TwoJointIkSolver, "Properties", {
    /** Root bone, never moves */
    root: Property.object(),
    /** Bone attached to the root */
    middle: Property.object(),
    /** Bone attached to the middle */
    end: Property.object(),
    /** Target the joins should reach for */
    target: Property.object(),
    /** Flag for copying rotation from target to end */
    copyTargetRotation: Property.bool(true),
    /** Helper object to use to determine joint rotation axis */
    helper: Property.object()
  });

  // node_modules/@wonderlandengine/components/dist/video-texture.js
  var VideoTexture = class extends Component {
    init() {
      if (!this.material) {
        throw Error("video-texture: material property not set");
      }
      this.loaded = false;
      this.frameUpdateRequested = true;
    }
    start() {
      this.video = document.createElement("video");
      this.video.src = this.url;
      this.video.crossOrigin = "anonymous";
      this.video.playsInline = true;
      this.video.loop = this.loop;
      this.video.muted = this.muted;
      this.video.addEventListener("playing", () => {
        this.loaded = true;
      });
      if (this.autoplay) {
        const playAfterUserGesture = () => {
          this.video.play();
          window.removeEventListener("click", playAfterUserGesture);
          window.removeEventListener("touchstart", playAfterUserGesture);
        };
        window.addEventListener("click", playAfterUserGesture);
        window.addEventListener("touchstart", playAfterUserGesture);
      }
    }
    applyTexture() {
      const mat = this.material;
      const shader = mat.shader;
      const texture = this.texture = new Texture(this.engine, this.video);
      if (!setFirstMaterialTexture(mat, texture, this.textureProperty)) {
        console.error("Shader", shader, "not supported by video-texture");
      }
      if ("requestVideoFrameCallback" in this.video) {
        this.video.requestVideoFrameCallback(this.updateVideo.bind(this));
      } else {
        this.video.addEventListener("timeupdate", () => {
          this.frameUpdateRequested = true;
        });
      }
    }
    update(dt) {
      if (this.loaded && this.frameUpdateRequested) {
        if (this.texture) {
          this.texture.update();
        } else {
          this.applyTexture();
        }
        this.frameUpdateRequested = false;
      }
    }
    updateVideo() {
      this.frameUpdateRequested = true;
      this.video.requestVideoFrameCallback(this.updateVideo.bind(this));
    }
  };
  __publicField(VideoTexture, "TypeName", "video-texture");
  __publicField(VideoTexture, "Properties", {
    /** URL to download video from */
    url: Property.string(),
    /** Material to apply the video texture to */
    material: Property.material(),
    /** Whether to loop the video */
    loop: Property.bool(true),
    /** Whether to automatically start playing the video */
    autoplay: Property.bool(true),
    /** Whether to mute sound */
    muted: Property.bool(true),
    /** Name of the texture property to set */
    textureProperty: Property.string("auto")
  });

  // node_modules/@wonderlandengine/components/dist/vr-mode-active-switch.js
  var VrModeActiveSwitch = class extends Component {
    start() {
      this.components = [];
      this.getComponents(this.object);
      this.onXRSessionEnd();
      this.onSessionStartCallback = this.onXRSessionStart.bind(this);
      this.onSessionEndCallback = this.onXRSessionEnd.bind(this);
    }
    onActivate() {
      this.engine.onXRSessionStart.add(this.onSessionStartCallback);
      this.engine.onXRSessionEnd.add(this.onSessionEndCallback);
    }
    onDeactivate() {
      this.engine.onXRSessionStart.remove(this.onSessionStartCallback);
      this.engine.onXRSessionEnd.remove(this.onSessionEndCallback);
    }
    getComponents(obj) {
      const comps = obj.getComponents().filter((c) => c.type !== "vr-mode-active-switch");
      this.components = this.components.concat(comps);
      if (this.affectChildren) {
        let children = obj.children;
        for (let i2 = 0; i2 < children.length; ++i2) {
          this.getComponents(children[i2]);
        }
      }
    }
    setComponentsActive(active) {
      const comps = this.components;
      for (let i2 = 0; i2 < comps.length; ++i2) {
        comps[i2].active = active;
      }
    }
    onXRSessionStart() {
      this.setComponentsActive(this.activateComponents == 0);
    }
    onXRSessionEnd() {
      this.setComponentsActive(this.activateComponents != 0);
    }
  };
  __publicField(VrModeActiveSwitch, "TypeName", "vr-mode-active-switch");
  __publicField(VrModeActiveSwitch, "Properties", {
    /** When components should be active: In VR or when not in VR */
    activateComponents: {
      type: Type.Enum,
      values: ["in VR", "in non-VR"],
      default: "in VR"
    },
    /** Whether child object's components should be affected */
    affectChildren: { type: Type.Bool, default: true }
  });

  // node_modules/@wonderlandengine/components/dist/plane-detection.js
  var import_earcut = __toESM(require_earcut(), 1);
  var __decorate10 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i2 = decorators.length - 1; i2 >= 0; i2--)
        if (d = decorators[i2])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var tempVec32 = new Float32Array(3);
  function extentsFromContour(out, points) {
    if (points.length == 0)
      return out;
    let absMaxX = Math.abs(points[0].x);
    let absMaxZ = Math.abs(points[0].z);
    for (let i2 = 1; i2 < points.length; ++i2) {
      absMaxX = Math.max(absMaxX, Math.abs(points[i2].x));
      absMaxZ = Math.max(absMaxZ, Math.abs(points[i2].z));
    }
    out[0] = absMaxX;
    out[1] = 0;
    out[2] = absMaxZ;
  }
  function within(x, a, b) {
    if (a > b)
      return x < a && x > b;
    return x > a && x < b;
  }
  function isPointLocalOnXRPlanePolygon(p, plane) {
    const points = plane.polygon;
    if (points.length < 3)
      return false;
    const pX = p[0];
    const pZ = p[2];
    let intersections = 0;
    for (let n = 0, l = points.length - 1; n < points.length; ++n) {
      const aX = points[l].x;
      const aZ = points[l].z;
      const s = (points[n].z - aZ) / (points[n].x - aX);
      const x = Math.abs((pZ - aZ) / s);
      if (x >= 0 && x <= 1 && within(x + pX, aX, points[n].x))
        ++intersections;
      l = n;
    }
    return (intersections & 1) == 0;
  }
  function isPointWorldOnXRPlanePolygon(object, p, plane) {
    if (plane.polygon.length < 3)
      return false;
    isPointLocalOnXRPlanePolygon(object.transformPointInverseWorld(tempVec32, p), plane);
  }
  function planeMeshFromContour(engine, points, meshToUpdate = null) {
    const vertexCount = points.length;
    const vertices = new Float32Array(vertexCount * 2);
    for (let i2 = 0, d = 0; i2 < vertexCount; ++i2, d += 2) {
      vertices[d] = points[i2].x;
      vertices[d + 1] = points[i2].z;
    }
    const triangles = (0, import_earcut.default)(vertices);
    const mesh = meshToUpdate || new Mesh(engine, {
      vertexCount,
      /* Assumption here that we will never have more than 256 points
       * in the detected plane meshes! */
      indexType: MeshIndexType.UnsignedByte,
      indexData: triangles
    });
    if (mesh.vertexCount !== vertexCount) {
      console.warn("vertexCount of meshToUpdate did not match required vertexCount");
      return mesh;
    }
    const positions = mesh.attribute(MeshAttribute.Position);
    const textureCoords = mesh.attribute(MeshAttribute.TextureCoordinate);
    const normals = mesh.attribute(MeshAttribute.Normal);
    tempVec32[1] = 0;
    for (let i2 = 0, s = 0; i2 < vertexCount; ++i2, s += 2) {
      tempVec32[0] = vertices[s];
      tempVec32[2] = vertices[s + 1];
      positions.set(i2, tempVec32);
    }
    textureCoords?.set(0, vertices);
    if (normals) {
      tempVec32[0] = 0;
      tempVec32[1] = 1;
      tempVec32[2] = 0;
      for (let i2 = 0; i2 < vertexCount; ++i2) {
        normals.set(i2, tempVec32);
      }
    }
    if (meshToUpdate)
      mesh.update();
    return mesh;
  }
  var _planeLost, planeLost_fn, _planeFound, planeFound_fn, _planeUpdate, planeUpdate_fn, _planeUpdatePose, planeUpdatePose_fn;
  var PlaneDetection = class extends Component {
    constructor() {
      super(...arguments);
      __privateAdd(this, _planeLost);
      __privateAdd(this, _planeFound);
      __privateAdd(this, _planeUpdate);
      __privateAdd(this, _planeUpdatePose);
      /**
       * Material to assign to created plane meshes or `null` if meshes should not be created.
       */
      __publicField(this, "planeMaterial", null);
      /**
       * Collision mask to assign to newly created collision components or a negative value if
       * collision components should not be created.
       */
      __publicField(this, "collisionMask", -1);
      /** Map of all planes and their last updated timestamps */
      __publicField(this, "planes", /* @__PURE__ */ new Map());
      /** Objects generated for each XRPlane */
      __publicField(this, "planeObjects", /* @__PURE__ */ new Map());
      /** Called when a plane starts tracking */
      __publicField(this, "onPlaneFound", new Emitter());
      /** Called when a plane stops tracking */
      __publicField(this, "onPlaneLost", new Emitter());
    }
    update() {
      if (!this.engine.xr?.frame)
        return;
      if (this.engine.xr.frame.detectedPlanes === void 0) {
        console.error("plane-detection: WebXR feature not available.");
        this.active = false;
        return;
      }
      const detectedPlanes = this.engine.xr.frame.detectedPlanes;
      for (const [plane, _] of this.planes) {
        if (!detectedPlanes.has(plane)) {
          __privateMethod(this, _planeLost, planeLost_fn).call(this, plane);
        }
      }
      detectedPlanes.forEach((plane) => {
        if (this.planes.has(plane)) {
          if (plane.lastChangedTime > this.planes.get(plane)) {
            __privateMethod(this, _planeUpdate, planeUpdate_fn).call(this, plane);
          }
        } else {
          __privateMethod(this, _planeFound, planeFound_fn).call(this, plane);
        }
        __privateMethod(this, _planeUpdatePose, planeUpdatePose_fn).call(this, plane);
      });
    }
  };
  _planeLost = new WeakSet();
  planeLost_fn = function(plane) {
    this.planes.delete(plane);
    const o = this.planeObjects.get(plane);
    this.onPlaneLost.notify(plane, o);
    if (o.objectId > 0)
      o.destroy();
  };
  _planeFound = new WeakSet();
  planeFound_fn = function(plane) {
    this.planes.set(plane, plane.lastChangedTime);
    const o = this.engine.scene.addObject(this.object);
    this.planeObjects.set(plane, o);
    if (this.planeMaterial) {
      o.addComponent(MeshComponent, {
        mesh: planeMeshFromContour(this.engine, plane.polygon),
        material: this.planeMaterial
      });
    }
    if (this.collisionMask >= 0) {
      extentsFromContour(tempVec32, plane.polygon);
      tempVec32[1] = 0.025;
      o.addComponent(CollisionComponent, {
        group: this.collisionMask,
        collider: Collider.Box,
        extents: tempVec32
      });
    }
    this.onPlaneFound.notify(plane, o);
  };
  _planeUpdate = new WeakSet();
  planeUpdate_fn = function(plane) {
    this.planes.set(plane, plane.lastChangedTime);
    const planeMesh = this.planeObjects.get(plane).getComponent(MeshComponent);
    if (!planeMesh)
      return;
    planeMeshFromContour(this.engine, plane.polygon, planeMesh.mesh);
  };
  _planeUpdatePose = new WeakSet();
  planeUpdatePose_fn = function(plane) {
    const o = this.planeObjects.get(plane);
    const pose = this.engine.xr.frame.getPose(plane.planeSpace, this.engine.xr.currentReferenceSpace);
    if (!pose) {
      o.active = false;
      return;
    }
    setXRRigidTransformLocal(o, pose.transform);
  };
  __publicField(PlaneDetection, "TypeName", "plane-detection");
  __decorate10([
    property.material()
  ], PlaneDetection.prototype, "planeMaterial", void 0);
  __decorate10([
    property.int()
  ], PlaneDetection.prototype, "collisionMask", void 0);

  // node_modules/@wonderlandengine/components/dist/vrm.js
  var VRM_ROLL_AXES = {
    X: [1, 0, 0],
    Y: [0, 1, 0],
    Z: [0, 0, 1]
  };
  var VRM_AIM_AXES = {
    PositiveX: [1, 0, 0],
    NegativeX: [-1, 0, 0],
    PositiveY: [0, 1, 0],
    NegativeY: [0, -1, 0],
    PositiveZ: [0, 0, 1],
    NegativeZ: [0, 0, -1]
  };
  var Vrm = class extends Component {
    /** Meta information about the VRM model */
    meta = null;
    /** The humanoid bones of the VRM model */
    bones = {
      /* Torso */
      hips: null,
      spine: null,
      chest: null,
      upperChest: null,
      neck: null,
      /* Head */
      head: null,
      leftEye: null,
      rightEye: null,
      jaw: null,
      /* Legs */
      leftUpperLeg: null,
      leftLowerLeg: null,
      leftFoot: null,
      leftToes: null,
      rightUpperLeg: null,
      rightLowerLeg: null,
      rightFoot: null,
      rightToes: null,
      /* Arms */
      leftShoulder: null,
      leftUpperArm: null,
      leftLowerArm: null,
      leftHand: null,
      rightShoulder: null,
      rightUpperArm: null,
      rightLowerArm: null,
      rightHand: null,
      /* Fingers */
      leftThumbMetacarpal: null,
      leftThumbProximal: null,
      leftThumbDistal: null,
      leftIndexProximal: null,
      leftIndexIntermediate: null,
      leftIndexDistal: null,
      leftMiddleProximal: null,
      leftMiddleIntermediate: null,
      leftMiddleDistal: null,
      leftRingProximal: null,
      leftRingIntermediate: null,
      leftRingDistal: null,
      leftLittleProximal: null,
      leftLittleIntermediate: null,
      leftLittleDistal: null,
      rightThumbMetacarpal: null,
      rightThumbProximal: null,
      rightThumbDistal: null,
      rightIndexProximal: null,
      rightIndexIntermediate: null,
      rightIndexDistal: null,
      rightMiddleProximal: null,
      rightMiddleIntermediate: null,
      rightMiddleDistal: null,
      rightRingProximal: null,
      rightRingIntermediate: null,
      rightRingDistal: null,
      rightLittleProximal: null,
      rightLittleIntermediate: null,
      rightLittleDistal: null
    };
    /** Rotations of the bones in the rest pose (T-pose) */
    restPose = {};
    /* All node constraints, ordered to deal with dependencies */
    _nodeConstraints = [];
    /* VRMC_springBone chains */
    _springChains = [];
    /* Spherical colliders for spring bones */
    _sphereColliders = [];
    /* Capsule shaped colliders for spring bones */
    _capsuleColliders = [];
    /* Indicates which meshes are rendered in first/third person views */
    _firstPersonAnnotations = [];
    /* Contains details for (bone type) lookAt behaviour */
    _lookAt = null;
    /* Whether or not the VRM component has been initialized with `initializeVrm` */
    _initialized = false;
    init() {
      this._tempV3 = vec3_exports.create();
      this._tempV3A = vec3_exports.create();
      this._tempV3B = vec3_exports.create();
      this._tempQuat = quat_exports.create();
      this._tempQuatA = quat_exports.create();
      this._tempQuatB = quat_exports.create();
      this._tempMat4A = mat4_exports.create();
      this._tempQuat2 = quat2_exports.create();
      this._tailToShape = vec3_exports.create();
      this._headToTail = vec3_exports.create();
      this._inertia = vec3_exports.create();
      this._stiffness = vec3_exports.create();
      this._external = vec3_exports.create();
      this._rightVector = vec3_exports.set(vec3_exports.create(), 1, 0, 0);
      this._upVector = vec3_exports.set(vec3_exports.create(), 0, 1, 0);
      this._forwardVector = vec3_exports.set(vec3_exports.create(), 0, 0, 1);
      this._identityQuat = quat_exports.identity(quat_exports.create());
      this._rad2deg = 180 / Math.PI;
    }
    start() {
      if (!this.src) {
        console.error("vrm: src property not set");
        return;
      }
      this.engine.scene.append(this.src, { loadGltfExtensions: true }).then(({ root, extensions }) => {
        root.children.forEach((child) => child.parent = this.object);
        this._initializeVrm(extensions);
        root.destroy();
      });
    }
    /**
     * Parses the VRM glTF extensions and initializes the vrm component.
     * @param {GLTFExtensions} extensions The glTF extensions for the VRM model
     */
    _initializeVrm(extensions) {
      if (this._initialized) {
        throw Error("VRM component has already been initialized");
      }
      const VRMC_vrm = extensions.root["VRMC_vrm"];
      if (!VRMC_vrm) {
        throw Error("Missing VRM extensions");
      }
      if (VRMC_vrm.specVersion !== "1.0") {
        throw Error(`Unsupported VRM version, only 1.0 is supported, but encountered '${VRMC_vrm.specVersion}'`);
      }
      this.meta = VRMC_vrm.meta;
      this._parseHumanoid(VRMC_vrm.humanoid, extensions);
      if (VRMC_vrm.firstPerson) {
        this._parseFirstPerson(VRMC_vrm.firstPerson, extensions);
      }
      if (VRMC_vrm.lookAt) {
        this._parseLookAt(VRMC_vrm.lookAt);
      }
      this._findAndParseNodeConstraints(extensions);
      const springBone = extensions.root["VRMC_springBone"];
      if (springBone) {
        this._parseAndInitializeSpringBones(springBone, extensions);
      }
      this._initialized = true;
    }
    _parseHumanoid(humanoid, extensions) {
      for (const boneName in humanoid.humanBones) {
        if (!(boneName in this.bones)) {
          console.warn(`Unrecognized bone '${boneName}'`);
          continue;
        }
        const node = humanoid.humanBones[boneName].node;
        const objectId = extensions.idMapping[node];
        this.bones[boneName] = this.engine.wrapObject(objectId);
        this.restPose[boneName] = quat_exports.copy(quat_exports.create(), this.bones[boneName].rotationLocal);
      }
    }
    _parseFirstPerson(firstPerson, extensions) {
      for (const meshAnnotation of firstPerson.meshAnnotations) {
        const annotation = {
          node: this.engine.wrapObject(extensions.idMapping[meshAnnotation.node]),
          firstPerson: true,
          thirdPerson: true
        };
        switch (meshAnnotation.type) {
          case "firstPersonOnly":
            annotation.thirdPerson = false;
            break;
          case "thirdPersonOnly":
            annotation.firstPerson = false;
            break;
          case "both":
            break;
          case "auto":
            console.warn("First person mesh annotation type 'auto' is not supported, treating as 'both'!");
            break;
          default:
            console.error(`Invalid mesh annotation type '${meshAnnotation.type}'`);
            break;
        }
        this._firstPersonAnnotations.push(annotation);
      }
    }
    _parseLookAt(lookAt2) {
      if (lookAt2.type !== "bone") {
        console.warn(`Unsupported lookAt type '${lookAt2.type}', only 'bone' is supported`);
        return;
      }
      const parseRangeMap = (rangeMap) => {
        return {
          inputMaxValue: rangeMap.inputMaxValue,
          outputScale: rangeMap.outputScale
        };
      };
      this._lookAt = {
        offsetFromHeadBone: lookAt2.offsetFromHeadBone || [0, 0, 0],
        horizontalInner: parseRangeMap(lookAt2.rangeMapHorizontalInner),
        horizontalOuter: parseRangeMap(lookAt2.rangeMapHorizontalOuter),
        verticalDown: parseRangeMap(lookAt2.rangeMapVerticalDown),
        verticalUp: parseRangeMap(lookAt2.rangeMapVerticalUp)
      };
    }
    _findAndParseNodeConstraints(extensions) {
      const traverse = (object) => {
        const nodeExtensions = extensions.node[object.objectId];
        if (nodeExtensions && "VRMC_node_constraint" in nodeExtensions) {
          const nodeConstraintExtension = nodeExtensions["VRMC_node_constraint"];
          const constraint = nodeConstraintExtension.constraint;
          let type, axis;
          if ("roll" in constraint) {
            type = "roll";
            axis = VRM_ROLL_AXES[constraint.roll.rollAxis];
          } else if ("aim" in constraint) {
            type = "aim";
            axis = VRM_AIM_AXES[constraint.aim.aimAxis];
          } else if ("rotation" in constraint) {
            type = "rotation";
          }
          if (type) {
            const source = this.engine.wrapObject(extensions.idMapping[constraint[type].source]);
            this._nodeConstraints.push({
              type,
              source,
              destination: object,
              axis,
              weight: constraint[type].weight,
              /* Rest pose */
              destinationRestLocalRotation: quat_exports.copy(quat_exports.create(), object.rotationLocal),
              sourceRestLocalRotation: quat_exports.copy(quat_exports.create(), source.rotationLocal),
              sourceRestLocalRotationInv: quat_exports.invert(quat_exports.create(), source.rotationLocal)
            });
          } else {
            console.warn("Unrecognized or invalid VRMC_node_constraint, ignoring it");
          }
        }
        for (const child of object.children) {
          traverse(child);
        }
      };
      traverse(this.object);
    }
    _parseAndInitializeSpringBones(springBone, extensions) {
      const colliders = (springBone.colliders || []).map((collider, i2) => {
        const shapeType = "capsule" in collider.shape ? "capsule" : "sphere";
        return {
          id: i2,
          object: this.engine.wrapObject(extensions.idMapping[collider.node]),
          shape: {
            isCapsule: shapeType === "capsule",
            radius: collider.shape[shapeType].radius,
            offset: collider.shape[shapeType].offset,
            tail: collider.shape[shapeType].tail
          },
          cache: {
            head: vec3_exports.create(),
            tail: vec3_exports.create()
          }
        };
      });
      this._sphereColliders = colliders.filter((c) => !c.shape.isCapsule);
      this._capsuleColliders = colliders.filter((c) => c.shape.isCapsule);
      const colliderGroups = (springBone.colliderGroups || []).map((group) => ({
        name: group.name,
        colliders: group.colliders.map((c) => colliders[c])
      }));
      for (const spring of springBone.springs) {
        const joints = [];
        for (const joint of spring.joints) {
          const springJoint = {
            hitRadius: 0,
            stiffness: 1,
            gravityPower: 0,
            gravityDir: [0, -1, 0],
            dragForce: 0.5,
            node: null,
            state: null
          };
          Object.assign(springJoint, joint);
          springJoint.node = this.engine.wrapObject(extensions.idMapping[springJoint.node]);
          joints.push(springJoint);
        }
        const springChainColliders = (spring.colliderGroups || []).flatMap((cg) => colliderGroups[cg].colliders);
        this._springChains.push({
          name: spring.name,
          center: spring.center ? this.engine.wrapObject(extensions.idMapping[spring.center]) : null,
          joints,
          sphereColliders: springChainColliders.filter((c) => !c.shape.isCapsule),
          capsuleColliders: springChainColliders.filter((c) => c.shape.isCapsule)
        });
      }
      for (const springChain of this._springChains) {
        for (let i2 = 0; i2 < springChain.joints.length - 1; ++i2) {
          const springBoneJoint = springChain.joints[i2];
          const childSpringBoneJoint = springChain.joints[i2 + 1];
          const springBonePosition = springBoneJoint.node.getTranslationWorld(vec3_exports.create());
          const childSpringBonePosition = childSpringBoneJoint.node.getTranslationWorld(vec3_exports.create());
          const boneDirection = vec3_exports.subtract(this._tempV3A, springBonePosition, childSpringBonePosition);
          const state = {
            prevTail: childSpringBonePosition,
            currentTail: vec3_exports.copy(vec3_exports.create(), childSpringBonePosition),
            initialLocalRotation: quat_exports.copy(quat_exports.create(), springBoneJoint.node.rotationLocal),
            initialLocalTransformInvert: quat2_exports.invert(quat2_exports.create(), springBoneJoint.node.transformLocal),
            boneAxis: vec3_exports.normalize(vec3_exports.create(), childSpringBoneJoint.node.getTranslationLocal(this._tempV3)),
            /* Ensure bone length is at least 1cm to avoid jittery behaviour from zero-length bones */
            boneLength: Math.max(0.01, vec3_exports.length(boneDirection)),
            /* Tail positions in center space, if needed */
            prevTailCenter: null,
            currentTailCenter: null
          };
          if (springChain.center) {
            state.prevTailCenter = springChain.center.transformPointInverseWorld(vec3_exports.create(), childSpringBonePosition);
            state.currentTailCenter = vec3_exports.copy(vec3_exports.create(), childSpringBonePosition);
          }
          springBoneJoint.state = state;
        }
      }
    }
    update(dt) {
      if (!this._initialized) {
        return;
      }
      this._resolveLookAt();
      this._resolveConstraints();
      this._updateSpringBones(dt);
    }
    _rangeMap(rangeMap, input) {
      const maxValue = rangeMap.inputMaxValue;
      const outputScale = rangeMap.outputScale;
      return Math.min(input, maxValue) / maxValue * outputScale;
    }
    _resolveLookAt() {
      if (!this._lookAt || !this.lookAtTarget) {
        return;
      }
      const lookAtSource = this.bones.head.transformPointWorld(this._tempV3A, this._lookAt.offsetFromHeadBone);
      const lookAtTarget = this.lookAtTarget.getTranslationWorld(this._tempV3B);
      const lookAtDirection = vec3_exports.sub(this._tempV3A, lookAtTarget, lookAtSource);
      vec3_exports.normalize(lookAtDirection, lookAtDirection);
      this.bones.head.parent.transformVectorInverseWorld(lookAtDirection);
      const z = vec3_exports.dot(lookAtDirection, this._forwardVector);
      const x = vec3_exports.dot(lookAtDirection, this._rightVector);
      const yaw = Math.atan2(x, z) * this._rad2deg;
      const xz = Math.sqrt(x * x + z * z);
      const y = vec3_exports.dot(lookAtDirection, this._upVector);
      let pitch = Math.atan2(-y, xz) * this._rad2deg;
      if (pitch > 0) {
        pitch = this._rangeMap(this._lookAt.verticalDown, pitch);
      } else {
        pitch = -this._rangeMap(this._lookAt.verticalUp, -pitch);
      }
      if (this.bones.leftEye) {
        let yawLeft = yaw;
        if (yawLeft > 0) {
          yawLeft = this._rangeMap(this._lookAt.horizontalInner, yawLeft);
        } else {
          yawLeft = -this._rangeMap(this._lookAt.horizontalOuter, -yawLeft);
        }
        const eyeRotation = quat_exports.fromEuler(this._tempQuatA, pitch, yawLeft, 0);
        this.bones.leftEye.rotationLocal = quat_exports.multiply(eyeRotation, this.restPose.leftEye, eyeRotation);
      }
      if (this.bones.rightEye) {
        let yawRight = yaw;
        if (yawRight > 0) {
          yawRight = this._rangeMap(this._lookAt.horizontalOuter, yawRight);
        } else {
          yawRight = -this._rangeMap(this._lookAt.horizontalInner, -yawRight);
        }
        const eyeRotation = quat_exports.fromEuler(this._tempQuatA, pitch, yawRight, 0);
        this.bones.rightEye.rotationLocal = quat_exports.multiply(eyeRotation, this.restPose.rightEye, eyeRotation);
      }
    }
    _resolveConstraints() {
      for (const nodeConstraint of this._nodeConstraints) {
        this._resolveConstraint(nodeConstraint);
      }
    }
    _resolveConstraint(nodeConstraint) {
      const dstRestQuat = nodeConstraint.destinationRestLocalRotation;
      const srcRestQuatInv = nodeConstraint.sourceRestLocalRotationInv;
      const targetQuat = quat_exports.identity(this._tempQuatA);
      switch (nodeConstraint.type) {
        case "roll":
          {
            const deltaSrcQuat = quat_exports.multiply(this._tempQuatA, srcRestQuatInv, nodeConstraint.source.rotationLocal);
            const deltaSrcQuatInParent = quat_exports.multiply(this._tempQuatA, nodeConstraint.sourceRestLocalRotation, deltaSrcQuat);
            quat_exports.mul(deltaSrcQuatInParent, deltaSrcQuatInParent, srcRestQuatInv);
            const dstRestQuatInv = quat_exports.invert(this._tempQuatB, dstRestQuat);
            const deltaSrcQuatInDst = quat_exports.multiply(this._tempQuatB, dstRestQuatInv, deltaSrcQuatInParent);
            quat_exports.multiply(deltaSrcQuatInDst, deltaSrcQuatInDst, dstRestQuat);
            const toVec = vec3_exports.transformQuat(this._tempV3A, nodeConstraint.axis, deltaSrcQuatInDst);
            const fromToQuat = quat_exports.rotationTo(this._tempQuatA, nodeConstraint.axis, toVec);
            quat_exports.mul(targetQuat, dstRestQuat, quat_exports.invert(this._tempQuat, fromToQuat));
            quat_exports.mul(targetQuat, targetQuat, deltaSrcQuatInDst);
          }
          break;
        case "aim":
          {
            const dstParentWorldQuat = nodeConstraint.destination.parent.rotationWorld;
            const fromVec = vec3_exports.transformQuat(this._tempV3A, nodeConstraint.axis, dstRestQuat);
            vec3_exports.transformQuat(fromVec, fromVec, dstParentWorldQuat);
            const toVec = nodeConstraint.source.getTranslationWorld(this._tempV3B);
            vec3_exports.sub(toVec, toVec, nodeConstraint.destination.getTranslationWorld(this._tempV3));
            vec3_exports.normalize(toVec, toVec);
            const fromToQuat = quat_exports.rotationTo(this._tempQuatA, fromVec, toVec);
            quat_exports.mul(targetQuat, quat_exports.invert(this._tempQuat, dstParentWorldQuat), fromToQuat);
            quat_exports.mul(targetQuat, targetQuat, dstParentWorldQuat);
            quat_exports.mul(targetQuat, targetQuat, dstRestQuat);
          }
          break;
        case "rotation":
          {
            const srcDeltaQuat = quat_exports.mul(targetQuat, srcRestQuatInv, nodeConstraint.source.rotationLocal);
            quat_exports.mul(targetQuat, dstRestQuat, srcDeltaQuat);
          }
          break;
      }
      quat_exports.slerp(targetQuat, dstRestQuat, targetQuat, nodeConstraint.weight);
      nodeConstraint.destination.rotationLocal = targetQuat;
    }
    _updateSpringBones(dt) {
      this._sphereColliders.forEach(({ object, shape, cache: cache2 }) => {
        const offset2 = vec3_exports.copy(cache2.head, shape.offset);
        object.transformVectorWorld(offset2);
        vec3_exports.add(cache2.head, object.getTranslationWorld(this._tempV3), offset2);
      });
      this._capsuleColliders.forEach(({ object, shape, cache: cache2 }) => {
        const shapeCenter = object.getTranslationWorld(this._tempV3A);
        const headOffset = vec3_exports.copy(cache2.head, shape.offset);
        object.transformVectorWorld(headOffset);
        vec3_exports.add(cache2.head, shapeCenter, headOffset);
        const tailOffset = vec3_exports.copy(cache2.tail, shape.tail);
        object.transformVectorWorld(tailOffset);
        vec3_exports.add(cache2.tail, shapeCenter, tailOffset);
      });
      this._springChains.forEach((springChain) => {
        for (let i2 = 0; i2 < springChain.joints.length - 1; ++i2) {
          const joint = springChain.joints[i2];
          const parentWorldRotation = joint.node.parent ? joint.node.parent.rotationWorld : this._identityQuat;
          const inertia = this._inertia;
          if (springChain.center) {
            vec3_exports.sub(inertia, joint.state.currentTailCenter, joint.state.prevTailCenter);
            springChain.center.transformVectorWorld(inertia);
          } else {
            vec3_exports.sub(inertia, joint.state.currentTail, joint.state.prevTail);
          }
          vec3_exports.scale(inertia, inertia, 1 - joint.dragForce);
          const stiffness = vec3_exports.copy(this._stiffness, joint.state.boneAxis);
          vec3_exports.transformQuat(stiffness, stiffness, joint.state.initialLocalRotation);
          vec3_exports.transformQuat(stiffness, stiffness, parentWorldRotation);
          vec3_exports.scale(stiffness, stiffness, dt * joint.stiffness);
          const external = vec3_exports.scale(this._external, joint.gravityDir, dt * joint.gravityPower);
          const nextTail = vec3_exports.copy(this._tempV3A, joint.state.currentTail);
          vec3_exports.add(nextTail, nextTail, inertia);
          vec3_exports.add(nextTail, nextTail, stiffness);
          vec3_exports.add(nextTail, nextTail, external);
          const worldPosition = joint.node.getTranslationWorld(this._tempV3B);
          vec3_exports.sub(nextTail, nextTail, worldPosition);
          vec3_exports.normalize(nextTail, nextTail);
          vec3_exports.scaleAndAdd(nextTail, worldPosition, nextTail, joint.state.boneLength);
          for (const { shape, cache: cache2 } of springChain.sphereColliders) {
            let tailToShape = this._tailToShape;
            const sphereCenter = cache2.head;
            tailToShape = vec3_exports.sub(tailToShape, nextTail, sphereCenter);
            const radius = shape.radius + joint.hitRadius;
            const dist2 = vec3_exports.length(tailToShape) - radius;
            if (dist2 < 0) {
              vec3_exports.normalize(tailToShape, tailToShape);
              vec3_exports.scaleAndAdd(nextTail, nextTail, tailToShape, -dist2);
              vec3_exports.sub(nextTail, nextTail, worldPosition);
              vec3_exports.normalize(nextTail, nextTail);
              vec3_exports.scaleAndAdd(nextTail, worldPosition, nextTail, joint.state.boneLength);
            }
          }
          for (const { shape, cache: cache2 } of springChain.capsuleColliders) {
            let tailToShape = this._tailToShape;
            const head = cache2.head;
            const tail = cache2.tail;
            tailToShape = vec3_exports.sub(tailToShape, nextTail, head);
            const headToTail = vec3_exports.sub(this._headToTail, tail, head);
            const dot5 = vec3_exports.dot(headToTail, tailToShape);
            if (vec3_exports.squaredLength(headToTail) <= dot5) {
              vec3_exports.sub(tailToShape, nextTail, tail);
            } else if (dot5 > 0) {
              vec3_exports.scale(headToTail, headToTail, dot5 / vec3_exports.squaredLength(headToTail));
              vec3_exports.sub(tailToShape, tailToShape, headToTail);
            }
            const radius = shape.radius + joint.hitRadius;
            const dist2 = vec3_exports.length(tailToShape) - radius;
            if (dist2 < 0) {
              vec3_exports.normalize(tailToShape, tailToShape);
              vec3_exports.scaleAndAdd(nextTail, nextTail, tailToShape, -dist2);
              vec3_exports.sub(nextTail, nextTail, worldPosition);
              vec3_exports.normalize(nextTail, nextTail);
              vec3_exports.scaleAndAdd(nextTail, worldPosition, nextTail, joint.state.boneLength);
            }
          }
          vec3_exports.copy(joint.state.prevTail, joint.state.currentTail);
          vec3_exports.copy(joint.state.currentTail, nextTail);
          if (springChain.center) {
            vec3_exports.copy(joint.state.prevTailCenter, joint.state.currentTailCenter);
            vec3_exports.copy(joint.state.currentTailCenter, nextTail);
            springChain.center.transformPointInverseWorld(joint.state.currentTailCenter);
          }
          joint.node.parent.transformPointInverseWorld(nextTail);
          const nextTailDualQuat = quat2_exports.fromTranslation(this._tempQuat2, nextTail);
          quat2_exports.multiply(nextTailDualQuat, joint.state.initialLocalTransformInvert, nextTailDualQuat);
          quat2_exports.getTranslation(nextTail, nextTailDualQuat);
          vec3_exports.normalize(nextTail, nextTail);
          const jointRotation = quat_exports.rotationTo(this._tempQuatA, joint.state.boneAxis, nextTail);
          joint.node.rotationLocal = quat_exports.mul(this._tempQuatA, joint.state.initialLocalRotation, jointRotation);
        }
      });
    }
    /**
     * @param {boolean} firstPerson Whether the model should render for first person or third person views
     */
    set firstPerson(firstPerson) {
      this._firstPersonAnnotations.forEach((annotation) => {
        const visible = firstPerson == annotation.firstPerson || firstPerson != annotation.thirdPerson;
        annotation.node.getComponents("mesh").forEach((mesh) => {
          mesh.active = visible;
        });
      });
    }
  };
  __publicField(Vrm, "TypeName", "vrm");
  __publicField(Vrm, "Properties", {
    /** URL to a VRM file to load */
    src: { type: Type.String },
    /** Object the VRM is looking at */
    lookAtTarget: { type: Type.Object }
  });

  // node_modules/@wonderlandengine/components/dist/wasd-controls.js
  var _direction = new Float32Array(3);
  var WasdControlsComponent = class extends Component {
    init() {
      this.up = false;
      this.right = false;
      this.down = false;
      this.left = false;
      window.addEventListener("keydown", this.press.bind(this));
      window.addEventListener("keyup", this.release.bind(this));
    }
    start() {
      this.headObject = this.headObject || this.object;
    }
    update() {
      vec3_exports.zero(_direction);
      if (this.up)
        _direction[2] -= 1;
      if (this.down)
        _direction[2] += 1;
      if (this.left)
        _direction[0] -= 1;
      if (this.right)
        _direction[0] += 1;
      vec3_exports.normalize(_direction, _direction);
      _direction[0] *= this.speed;
      _direction[2] *= this.speed;
      vec3_exports.transformQuat(_direction, _direction, this.headObject.transformWorld);
      if (this.lockY) {
        _direction[1] = 0;
        vec3_exports.normalize(_direction, _direction);
        vec3_exports.scale(_direction, _direction, this.speed);
      }
      this.object.translateLocal(_direction);
    }
    press(e) {
      if (e.keyCode === 38 || e.keyCode === 87 || e.keyCode === 90) {
        this.up = true;
      } else if (e.keyCode === 39 || e.keyCode === 68) {
        this.right = true;
      } else if (e.keyCode === 40 || e.keyCode === 83) {
        this.down = true;
      } else if (e.keyCode === 37 || e.keyCode === 65 || e.keyCode === 81) {
        this.left = true;
      }
    }
    release(e) {
      if (e.keyCode === 38 || e.keyCode === 87 || e.keyCode === 90) {
        this.up = false;
      } else if (e.keyCode === 39 || e.keyCode === 68) {
        this.right = false;
      } else if (e.keyCode === 40 || e.keyCode === 83) {
        this.down = false;
      } else if (e.keyCode === 37 || e.keyCode === 65 || e.keyCode === 81) {
        this.left = false;
      }
    }
  };
  __publicField(WasdControlsComponent, "TypeName", "wasd-controls");
  __publicField(WasdControlsComponent, "Properties", {
    /** Movement speed in m/s. */
    speed: { type: Type.Float, default: 0.1 },
    /** Flag for only moving the object on the global x & z planes */
    lockY: { type: Type.Bool, default: false },
    /** Object of which the orientation is used to determine forward direction */
    headObject: { type: Type.Object }
  });

  // node_modules/@wonderlandengine/components/dist/input-profile.js
  var __decorate11 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i2 = decorators.length - 1; i2 >= 0; i2--)
        if (d = decorators[i2])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var _tempVec = vec3_exports.create();
  var _tempQuat = quat_exports.create();
  var _tempRotation1 = new Float32Array(4);
  var _tempRotation2 = new Float32Array(4);
  var minTemp = new Float32Array(3);
  var maxTemp = new Float32Array(3);
  var hands = ["left", "right"];
  var _InputProfile = class extends Component {
    _gamepadObjects = {};
    _controllerModel = null;
    _defaultControllerComponents;
    _handedness;
    _profileJSON = null;
    _buttons = [];
    _axes = [];
    /**
     * The XR gamepad associated with the current input source.
     */
    gamepad;
    /**
     * A reference to the emitter which triggered on model lodaed event.
     */
    onModelLoaded = new Emitter();
    /**
     * Returns url of input profile json file
     */
    url;
    /**
     * A set of components to filter during component retrieval.
     */
    toFilter = /* @__PURE__ */ new Set(["vr-mode-active-mode-switch"]);
    /**
     * The index representing the handedness of the controller (0 for left, 1 for right).
     */
    handedness = 0;
    /**
     * The base path where XR input profiles are stored.
     */
    defaultBasePath;
    /**
     * An optional folder path for loading custom XR input profiles.
     */
    customBasePath;
    /**
     * The default 3D controller model used when a custom model fails to load.
     */
    defaultController;
    /**
     * The object which has HandTracking component added to it.
     */
    trackedHand;
    /**
     * If true, the input profile will be mapped to the default controller, and no dynamic 3D model of controller will be loaded.
     */
    mapToDefaultController;
    /**
     * If true, adds a VR mode switch component to the loaded controller model.
     */
    addVrModeSwitch;
    onActivate() {
      this._handedness = hands[this.handedness];
      const defaultHandName = "Hand" + this._handedness.charAt(0).toUpperCase() + this._handedness.slice(1);
      this.trackedHand = this.trackedHand ?? this.object.parent?.findByNameRecursive(defaultHandName)[0];
      this.defaultController = this.defaultController || this.object.children[0];
      this._defaultControllerComponents = this._getComponents(this.defaultController);
      this.engine.onXRSessionStart.add(() => {
        this.engine.xr?.session.addEventListener("inputsourceschange", this._onInputSourcesChange.bind(this));
      });
    }
    onDeactivate() {
      this.engine.xr?.session?.removeEventListener("inputsourceschange", this._onInputSourcesChange.bind(this));
    }
    /**
     * Sets newly loaded controllers for the HandTracking component to proper switching.
     * @param controllerObject The controller object.
     * @hidden
     */
    _setHandTrackingControllers(controllerObject) {
      const handtrackingComponent = this.trackedHand.getComponent(HandTracking);
      if (!handtrackingComponent)
        return;
      handtrackingComponent.controllerToDeactivate = controllerObject;
    }
    /**
     * Retrieves all components from the specified object and its children.
     * @param obj The object to retrieve components from.
     * @return An array of components.
     * @hidden
     */
    _getComponents(obj) {
      const components = [];
      if (obj == null)
        return components;
      const stack = [obj];
      while (stack.length > 0) {
        const currentObj = stack.pop();
        const comps = currentObj.getComponents().filter((c) => !this.toFilter.has(c.type));
        components.push(...comps);
        const children = currentObj.children;
        for (let i2 = children.length - 1; i2 >= 0; --i2) {
          stack.push(children[i2]);
        }
      }
      return components;
    }
    /**
     * Activates or deactivates components based on the specified boolean value.
     * @param active If true, components are set to active; otherwise, they are set to inactive.
     * @hidden
     */
    _setComponentsActive(active) {
      const comps = this._defaultControllerComponents;
      if (comps == void 0)
        return;
      for (let i2 = 0; i2 < comps.length; ++i2) {
        comps[i2].active = active;
      }
    }
    /**
     * Event handler triggered when XR input sources change.
     * Detects new XR input sources and initiates the loading of input profiles.
     * @param event The XR input source change event.
     * @hidden
     */
    _onInputSourcesChange(event) {
      if (this._isModelLoaded() && !this.mapToDefaultController) {
        this._setComponentsActive(false);
      }
      event.added.forEach((xrInputSource) => {
        if (xrInputSource.hand != null)
          return;
        if (this._handedness != xrInputSource.handedness)
          return;
        this.gamepad = xrInputSource.gamepad;
        const profile = this.customBasePath !== "" ? this.customBasePath : this.defaultBasePath + xrInputSource.profiles[0];
        this.url = profile + "/profile.json";
        this._profileJSON = _InputProfile.Cache.get(this.url) ?? null;
        if (this._profileJSON != null)
          return;
        fetch(this.url).then((res) => res.json()).then((out) => {
          this._profileJSON = out;
          _InputProfile.Cache.set(this.url, this._profileJSON);
          if (!this._isModelLoaded())
            this._loadAndMapGamepad(profile);
        }).catch((e) => {
          console.error(`Failed to load profile from ${this.url}. Reason:`, e);
        });
      });
    }
    /**
     * Checks if the 3D controller model is loaded.
     * @return True if the model is loaded; otherwise, false.
     * @hidden
     */
    _isModelLoaded() {
      return this._controllerModel !== null;
    }
    /**
     * Loads the 3D controller model and caches the mapping to the gamepad.
     * @param profile The path to the input profile.
     * @hidden
     */
    async _loadAndMapGamepad(profile) {
      const assetPath = profile + "/" + this._handedness + ".glb";
      this._controllerModel = this.defaultController;
      if (!this.mapToDefaultController) {
        try {
          this._controllerModel = await this.engine.scene.append(assetPath);
        } catch (e) {
          console.error(`Failed to load i-p controller model. Reason:`, e, `Continuing with ${this._handedness} default controller.`);
          this._setComponentsActive(true);
        }
        this._controllerModel.parent = this.object;
        this._controllerModel.setPositionLocal([0, 0, 0]);
        this._setComponentsActive(false);
        if (this.addVrModeSwitch)
          this._controllerModel.addComponent(VrModeActiveSwitch);
        this.onModelLoaded.notify();
      }
      this._cacheGamepadObjectsFromProfile(this._profileJSON, this._controllerModel);
      this._setHandTrackingControllers(this._controllerModel);
      this.update = () => this._mapGamepadInput();
    }
    /**
     * Caches gamepad objects (buttons, axes) from the loaded input profile.
     * @hidden
     */
    _cacheGamepadObjectsFromProfile(profile, obj) {
      const components = profile.layouts[this._handedness].components;
      if (!components)
        return;
      this._buttons = [];
      this._axes = [];
      for (const i2 in components) {
        const visualResponses = components[i2].visualResponses;
        for (const j in visualResponses) {
          const visualResponse = visualResponses[j];
          const valueNode = visualResponse.valueNodeName;
          const minNode = visualResponse.minNodeName;
          const maxNode = visualResponse.maxNodeName;
          this._gamepadObjects[valueNode] = obj.findByNameRecursive(valueNode)[0];
          this._gamepadObjects[minNode] = obj.findByNameRecursive(minNode)[0];
          this._gamepadObjects[maxNode] = obj.findByNameRecursive(maxNode)[0];
          const indice = visualResponses[j].componentProperty;
          const response = {
            target: this._gamepadObjects[valueNode],
            min: this._gamepadObjects[minNode],
            max: this._gamepadObjects[maxNode],
            id: components[i2].gamepadIndices[indice]
            // Assign a unique ID
          };
          switch (indice) {
            case "button":
              this._buttons.push(response);
              break;
            case "xAxis":
            case "yAxis":
              this._axes.push(response);
              break;
          }
        }
      }
    }
    /**
     * Assigns a transformed position and rotation to the target based on minimum and maximum values and a normalized input value.
     * @param target The target object to be transformed.
     * @param min The minimum object providing transformation limits.
     * @param max The maximum object providing transformation limits.
     * @param value The normalized input value.
     * @hidden
     */
    _assignTransform(target, min2, max2, value2) {
      vec3_exports.lerp(_tempVec, min2.getPositionWorld(minTemp), max2.getPositionWorld(maxTemp), value2);
      target.setPositionWorld(_tempVec);
      quat_exports.lerp(_tempQuat, min2.getRotationWorld(_tempRotation1), max2.getRotationWorld(_tempRotation2), value2);
      quat_exports.normalize(_tempQuat, _tempQuat);
      target.setRotationWorld(_tempQuat);
    }
    /**
     * Maps input values (buttons, axes) to the 3D controller model.
     * @hidden
     */
    _mapGamepadInput() {
      for (const button of this._buttons) {
        const buttonValue = this.gamepad.buttons[button.id].value;
        this._assignTransform(button.target, button.min, button.max, buttonValue);
      }
      for (const axis of this._axes) {
        const axisValue = this.gamepad.axes[axis.id];
        const normalizedAxisValue = (axisValue + 1) / 2;
        this._assignTransform(axis.target, axis.min, axis.max, normalizedAxisValue);
      }
    }
  };
  var InputProfile = _InputProfile;
  __publicField(InputProfile, "TypeName", "input-profile");
  /**
   * A cache to store loaded profiles for reuse.
   */
  __publicField(InputProfile, "Cache", /* @__PURE__ */ new Map());
  __decorate11([
    property.enum(hands, 0)
  ], InputProfile.prototype, "handedness", void 0);
  __decorate11([
    property.string("https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@latest/dist/profiles/")
  ], InputProfile.prototype, "defaultBasePath", void 0);
  __decorate11([
    property.string()
  ], InputProfile.prototype, "customBasePath", void 0);
  __decorate11([
    property.object()
  ], InputProfile.prototype, "defaultController", void 0);
  __decorate11([
    property.object()
  ], InputProfile.prototype, "trackedHand", void 0);
  __decorate11([
    property.bool(false)
  ], InputProfile.prototype, "mapToDefaultController", void 0);
  __decorate11([
    property.bool(true)
  ], InputProfile.prototype, "addVrModeSwitch", void 0);

  // node_modules/@wonderlandengine/components/dist/orbital-camera.js
  var __decorate12 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i2 = decorators.length - 1; i2 >= 0; i2--)
        if (d = decorators[i2])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var preventDefault2 = (e) => {
    e.preventDefault();
  };
  var tempVec4 = [0, 0, 0];
  var tempquat = quat_exports.create();
  var tempquat2 = quat_exports.create();
  var tempVec33 = vec3_exports.create();
  var OrbitalCamera = class extends Component {
    mouseButtonIndex = 0;
    radial = 5;
    minElevation = 0;
    maxElevation = 89.99;
    minZoom = 0.01;
    maxZoom = 10;
    xSensitivity = 0.5;
    ySensitivity = 0.5;
    zoomSensitivity = 0.02;
    damping = 0.9;
    _mouseDown = false;
    _origin = [0, 0, 0];
    _azimuth = 0;
    _polar = 45;
    _initialPinchDistance = 0;
    _touchStartX = 0;
    _touchStartY = 0;
    _azimuthSpeed = 0;
    _polarSpeed = 0;
    init() {
      this.object.getPositionWorld(this._origin);
    }
    start() {
      this._updateCamera();
    }
    onActivate() {
      const canvas2 = this.engine.canvas;
      if (this.mouseButtonIndex === 2) {
        canvas2.addEventListener("contextmenu", preventDefault2, { passive: false });
      }
      canvas2.addEventListener("mousedown", this._onMouseDown);
      canvas2.addEventListener("wheel", this._onMouseScroll, { passive: false });
      canvas2.addEventListener("touchstart", this._onTouchStart, { passive: false });
      canvas2.addEventListener("touchmove", this._onTouchMove, { passive: false });
      canvas2.addEventListener("touchend", this._onTouchEnd);
    }
    onDeactivate() {
      const canvas2 = this.engine.canvas;
      if (this.mouseButtonIndex === 2) {
        canvas2.removeEventListener("contextmenu", preventDefault2);
      }
      canvas2.removeEventListener("mousemove", this._onMouseMove);
      canvas2.removeEventListener("mousedown", this._onMouseDown);
      canvas2.removeEventListener("wheel", this._onMouseScroll);
      canvas2.removeEventListener("touchstart", this._onTouchStart);
      canvas2.removeEventListener("touchmove", this._onTouchMove);
      canvas2.removeEventListener("touchend", this._onTouchEnd);
      this._mouseDown = false;
      this._initialPinchDistance = 0;
      this._touchStartX = 0;
      this._touchStartY = 0;
      this._azimuthSpeed = 0;
      this._polarSpeed = 0;
    }
    update() {
      this._azimuthSpeed *= this.damping;
      this._polarSpeed *= this.damping;
      if (Math.abs(this._azimuthSpeed) < 0.01)
        this._azimuthSpeed = 0;
      if (Math.abs(this._polarSpeed) < 0.01)
        this._polarSpeed = 0;
      this._azimuth += this._azimuthSpeed;
      this._polar += this._polarSpeed;
      this._polar = Math.min(this.maxElevation, Math.max(this.minElevation, this._polar));
      if (this._azimuthSpeed !== 0 || this._polarSpeed !== 0) {
        this._updateCamera();
      }
    }
    /**
     * Get the closest position to the given position on the orbit sphere of the camera.
     * This can be used to get a position and rotation to transition to.
     *
     * You pass this a position object. The method calculates the closest positition and updates the position parameter.
     * It also sets the rotation parameter to reflect the rotate the camera will have when it is on the orbit sphere,
     * pointing towards the center.
     * @param position the position to get the closest position to
     * @param rotation the rotation to get the closest position to
     */
    getClosestPosition(position, rotation) {
      this.object.getRotationWorld(tempquat);
      this.object.lookAt(this._origin);
      this.object.getRotationWorld(tempquat2);
      if (quat_exports.dot(tempquat, tempquat2) < 0) {
        quat_exports.scale(tempquat2, tempquat2, -1);
      }
      this.object.setRotationWorld(tempquat);
      const directionToCamera = vec3_exports.create();
      vec3_exports.subtract(directionToCamera, position, this._origin);
      vec3_exports.normalize(directionToCamera, directionToCamera);
      const nearestPointOnSphere = vec3_exports.create();
      vec3_exports.scale(nearestPointOnSphere, directionToCamera, this.radial);
      vec3_exports.add(nearestPointOnSphere, nearestPointOnSphere, this._origin);
      vec3_exports.copy(position, nearestPointOnSphere);
      quat_exports.copy(rotation, tempquat2);
    }
    /**
     * Set the camera position based on the given position and calculate the rotation.
     * @param cameraPosition the position to set the camera to
     */
    setPosition(cameraPosition) {
      const centerOfOrbit = this._origin;
      vec3_exports.subtract(tempVec33, cameraPosition, centerOfOrbit);
      vec3_exports.normalize(tempVec33, tempVec33);
      const azimuth = Math.atan2(tempVec33[0], tempVec33[2]);
      const polar = Math.acos(tempVec33[1]);
      const azimuthDeg = rad2deg(azimuth);
      const polarDeg = 90 - rad2deg(polar);
      this._azimuth = azimuthDeg;
      this._polar = polarDeg;
    }
    /**
     * Update the camera position based on the current azimuth,
     * polar and radial values
     */
    _updateCamera() {
      const azimuthInRadians = deg2rad(this._azimuth);
      const polarInRadians = deg2rad(this._polar);
      tempVec4[0] = this.radial * Math.sin(azimuthInRadians) * Math.cos(polarInRadians);
      tempVec4[1] = this.radial * Math.sin(polarInRadians);
      tempVec4[2] = this.radial * Math.cos(azimuthInRadians) * Math.cos(polarInRadians);
      this.object.setPositionWorld(tempVec4);
      this.object.translateWorld(this._origin);
      this.object.lookAt(this._origin);
    }
    /* Mouse Event Handlers */
    _onMouseDown = (e) => {
      window.addEventListener("mouseup", this._onMouseUp);
      window.addEventListener("mousemove", this._onMouseMove);
      if (e.button === this.mouseButtonIndex) {
        this._mouseDown = true;
        document.body.style.cursor = "grabbing";
        if (e.button === 1) {
          e.preventDefault();
          return false;
        }
      }
    };
    _onMouseUp = (e) => {
      window.removeEventListener("mouseup", this._onMouseUp);
      window.removeEventListener("mousemove", this._onMouseMove);
      if (e.button === this.mouseButtonIndex) {
        this._mouseDown = false;
        document.body.style.cursor = "initial";
      }
    };
    _onMouseMove = (e) => {
      if (this.active && this._mouseDown) {
        if (this.active && this._mouseDown) {
          this._azimuthSpeed = -(e.movementX * this.xSensitivity);
          this._polarSpeed = e.movementY * this.ySensitivity;
        }
      }
    };
    _onMouseScroll = (e) => {
      e.preventDefault();
      this.radial *= 1 - e.deltaY * this.zoomSensitivity * -1e-3;
      this.radial = Math.min(this.maxZoom, Math.max(this.minZoom, this.radial));
      this._updateCamera();
    };
    /* Touch event handlers */
    _onTouchStart = (e) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        this._touchStartX = e.touches[0].clientX;
        this._touchStartY = e.touches[0].clientY;
        this._mouseDown = true;
      } else if (e.touches.length === 2) {
        this._initialPinchDistance = this._getDistanceBetweenTouches(e.touches);
        e.preventDefault();
      }
    };
    _onTouchMove = (e) => {
      if (!this.active || !this._mouseDown) {
        return;
      }
      e.preventDefault();
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - this._touchStartX;
        const deltaY = e.touches[0].clientY - this._touchStartY;
        this._azimuthSpeed = -(deltaX * this.xSensitivity);
        this._polarSpeed = deltaY * this.ySensitivity;
        this._touchStartX = e.touches[0].clientX;
        this._touchStartY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        const currentPinchDistance = this._getDistanceBetweenTouches(e.touches);
        const pinchScale = this._initialPinchDistance / currentPinchDistance;
        this.radial *= pinchScale;
        this.radial = Math.min(this.maxZoom, Math.max(this.minZoom, this.radial));
        this._updateCamera();
        this._initialPinchDistance = currentPinchDistance;
      }
    };
    _onTouchEnd = (e) => {
      if (e.touches.length < 2) {
        this._mouseDown = false;
      }
      if (e.touches.length === 1) {
        this._touchStartX = e.touches[0].clientX;
        this._touchStartY = e.touches[0].clientY;
      }
    };
    /**
     * Helper function to calculate the distance between two touch points
     * @param touches list of touch points
     * @returns distance between the two touch points
     */
    _getDistanceBetweenTouches(touches) {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }
  };
  __publicField(OrbitalCamera, "TypeName", "orbital-camera");
  __decorate12([
    property.int()
  ], OrbitalCamera.prototype, "mouseButtonIndex", void 0);
  __decorate12([
    property.float(5)
  ], OrbitalCamera.prototype, "radial", void 0);
  __decorate12([
    property.float()
  ], OrbitalCamera.prototype, "minElevation", void 0);
  __decorate12([
    property.float(89.99)
  ], OrbitalCamera.prototype, "maxElevation", void 0);
  __decorate12([
    property.float()
  ], OrbitalCamera.prototype, "minZoom", void 0);
  __decorate12([
    property.float(10)
  ], OrbitalCamera.prototype, "maxZoom", void 0);
  __decorate12([
    property.float(0.5)
  ], OrbitalCamera.prototype, "xSensitivity", void 0);
  __decorate12([
    property.float(0.5)
  ], OrbitalCamera.prototype, "ySensitivity", void 0);
  __decorate12([
    property.float(0.02)
  ], OrbitalCamera.prototype, "zoomSensitivity", void 0);
  __decorate12([
    property.float(0.9)
  ], OrbitalCamera.prototype, "damping", void 0);

  // js/ImgTexture.js
  var ImgTexture_exports = {};
  __export(ImgTexture_exports, {
    ImgTexture: () => ImgTexture
  });
  var ImgTexture = class extends Component {
    start() {
      this.loadAndApplyTexture(this.imageUrl);
    }
    async loadAndApplyTexture(url2) {
      try {
        const texture = await this.engine.textures.load(url2, "anonymous");
        const mesh = this.object.getComponent("mesh");
        if (!mesh) {
          console.error("Missing mesh component on the object.");
          return;
        }
        this.material = mesh.material.clone();
        mesh.material = this.material;
        this.material.diffuseTexture = texture;
      } catch (error) {
        console.error("Failed to load texture:", error);
      }
    }
    update(dt) {
    }
  };
  __publicField(ImgTexture, "TypeName", "ImgTexture");
  /* Properties that are configurable in the editor */
  __publicField(ImgTexture, "Properties", {
    imageUrl: Property.string("https://cdn.prod.website-files.com/64e92a8556392a3ffbfe138c/64ea0306862892bff88fac03_aichat-p-500.png", "Image URL")
  });

  // js/InputSender.js
  var InputSender_exports = {};
  __export(InputSender_exports, {
    InputSender: () => InputSender
  });

  // node_modules/engine.io-parser/build/esm/commons.js
  var PACKET_TYPES = /* @__PURE__ */ Object.create(null);
  PACKET_TYPES["open"] = "0";
  PACKET_TYPES["close"] = "1";
  PACKET_TYPES["ping"] = "2";
  PACKET_TYPES["pong"] = "3";
  PACKET_TYPES["message"] = "4";
  PACKET_TYPES["upgrade"] = "5";
  PACKET_TYPES["noop"] = "6";
  var PACKET_TYPES_REVERSE = /* @__PURE__ */ Object.create(null);
  Object.keys(PACKET_TYPES).forEach((key) => {
    PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
  });
  var ERROR_PACKET = { type: "error", data: "parser error" };

  // node_modules/engine.io-parser/build/esm/encodePacket.browser.js
  var withNativeBlob = typeof Blob === "function" || typeof Blob !== "undefined" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]";
  var withNativeArrayBuffer = typeof ArrayBuffer === "function";
  var isView = (obj) => {
    return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj && obj.buffer instanceof ArrayBuffer;
  };
  var encodePacket = ({ type, data }, supportsBinary, callback) => {
    if (withNativeBlob && data instanceof Blob) {
      if (supportsBinary) {
        return callback(data);
      } else {
        return encodeBlobAsBase64(data, callback);
      }
    } else if (withNativeArrayBuffer && (data instanceof ArrayBuffer || isView(data))) {
      if (supportsBinary) {
        return callback(data);
      } else {
        return encodeBlobAsBase64(new Blob([data]), callback);
      }
    }
    return callback(PACKET_TYPES[type] + (data || ""));
  };
  var encodeBlobAsBase64 = (data, callback) => {
    const fileReader = new FileReader();
    fileReader.onload = function() {
      const content = fileReader.result.split(",")[1];
      callback("b" + (content || ""));
    };
    return fileReader.readAsDataURL(data);
  };
  function toArray(data) {
    if (data instanceof Uint8Array) {
      return data;
    } else if (data instanceof ArrayBuffer) {
      return new Uint8Array(data);
    } else {
      return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    }
  }
  var TEXT_ENCODER;
  function encodePacketToBinary(packet, callback) {
    if (withNativeBlob && packet.data instanceof Blob) {
      return packet.data.arrayBuffer().then(toArray).then(callback);
    } else if (withNativeArrayBuffer && (packet.data instanceof ArrayBuffer || isView(packet.data))) {
      return callback(toArray(packet.data));
    }
    encodePacket(packet, false, (encoded) => {
      if (!TEXT_ENCODER) {
        TEXT_ENCODER = new TextEncoder();
      }
      callback(TEXT_ENCODER.encode(encoded));
    });
  }

  // node_modules/engine.io-parser/build/esm/contrib/base64-arraybuffer.js
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var lookup = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
  for (let i2 = 0; i2 < chars.length; i2++) {
    lookup[chars.charCodeAt(i2)] = i2;
  }
  var decode2 = (base64) => {
    let bufferLength = base64.length * 0.75, len4 = base64.length, i2, p = 0, encoded1, encoded2, encoded3, encoded4;
    if (base64[base64.length - 1] === "=") {
      bufferLength--;
      if (base64[base64.length - 2] === "=") {
        bufferLength--;
      }
    }
    const arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
    for (i2 = 0; i2 < len4; i2 += 4) {
      encoded1 = lookup[base64.charCodeAt(i2)];
      encoded2 = lookup[base64.charCodeAt(i2 + 1)];
      encoded3 = lookup[base64.charCodeAt(i2 + 2)];
      encoded4 = lookup[base64.charCodeAt(i2 + 3)];
      bytes[p++] = encoded1 << 2 | encoded2 >> 4;
      bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
      bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
    }
    return arraybuffer;
  };

  // node_modules/engine.io-parser/build/esm/decodePacket.browser.js
  var withNativeArrayBuffer2 = typeof ArrayBuffer === "function";
  var decodePacket = (encodedPacket, binaryType) => {
    if (typeof encodedPacket !== "string") {
      return {
        type: "message",
        data: mapBinary(encodedPacket, binaryType)
      };
    }
    const type = encodedPacket.charAt(0);
    if (type === "b") {
      return {
        type: "message",
        data: decodeBase64Packet(encodedPacket.substring(1), binaryType)
      };
    }
    const packetType = PACKET_TYPES_REVERSE[type];
    if (!packetType) {
      return ERROR_PACKET;
    }
    return encodedPacket.length > 1 ? {
      type: PACKET_TYPES_REVERSE[type],
      data: encodedPacket.substring(1)
    } : {
      type: PACKET_TYPES_REVERSE[type]
    };
  };
  var decodeBase64Packet = (data, binaryType) => {
    if (withNativeArrayBuffer2) {
      const decoded = decode2(data);
      return mapBinary(decoded, binaryType);
    } else {
      return { base64: true, data };
    }
  };
  var mapBinary = (data, binaryType) => {
    switch (binaryType) {
      case "blob":
        if (data instanceof Blob) {
          return data;
        } else {
          return new Blob([data]);
        }
      case "arraybuffer":
      default:
        if (data instanceof ArrayBuffer) {
          return data;
        } else {
          return data.buffer;
        }
    }
  };

  // node_modules/engine.io-parser/build/esm/index.js
  var SEPARATOR = String.fromCharCode(30);
  var encodePayload = (packets, callback) => {
    const length6 = packets.length;
    const encodedPackets = new Array(length6);
    let count = 0;
    packets.forEach((packet, i2) => {
      encodePacket(packet, false, (encodedPacket) => {
        encodedPackets[i2] = encodedPacket;
        if (++count === length6) {
          callback(encodedPackets.join(SEPARATOR));
        }
      });
    });
  };
  var decodePayload = (encodedPayload, binaryType) => {
    const encodedPackets = encodedPayload.split(SEPARATOR);
    const packets = [];
    for (let i2 = 0; i2 < encodedPackets.length; i2++) {
      const decodedPacket = decodePacket(encodedPackets[i2], binaryType);
      packets.push(decodedPacket);
      if (decodedPacket.type === "error") {
        break;
      }
    }
    return packets;
  };
  function createPacketEncoderStream() {
    return new TransformStream({
      transform(packet, controller) {
        encodePacketToBinary(packet, (encodedPacket) => {
          const payloadLength = encodedPacket.length;
          let header;
          if (payloadLength < 126) {
            header = new Uint8Array(1);
            new DataView(header.buffer).setUint8(0, payloadLength);
          } else if (payloadLength < 65536) {
            header = new Uint8Array(3);
            const view = new DataView(header.buffer);
            view.setUint8(0, 126);
            view.setUint16(1, payloadLength);
          } else {
            header = new Uint8Array(9);
            const view = new DataView(header.buffer);
            view.setUint8(0, 127);
            view.setBigUint64(1, BigInt(payloadLength));
          }
          if (packet.data && typeof packet.data !== "string") {
            header[0] |= 128;
          }
          controller.enqueue(header);
          controller.enqueue(encodedPacket);
        });
      }
    });
  }
  var TEXT_DECODER;
  function totalLength(chunks) {
    return chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  }
  function concatChunks(chunks, size) {
    if (chunks[0].length === size) {
      return chunks.shift();
    }
    const buffer = new Uint8Array(size);
    let j = 0;
    for (let i2 = 0; i2 < size; i2++) {
      buffer[i2] = chunks[0][j++];
      if (j === chunks[0].length) {
        chunks.shift();
        j = 0;
      }
    }
    if (chunks.length && j < chunks[0].length) {
      chunks[0] = chunks[0].slice(j);
    }
    return buffer;
  }
  function createPacketDecoderStream(maxPayload, binaryType) {
    if (!TEXT_DECODER) {
      TEXT_DECODER = new TextDecoder();
    }
    const chunks = [];
    let state = 0;
    let expectedLength = -1;
    let isBinary2 = false;
    return new TransformStream({
      transform(chunk, controller) {
        chunks.push(chunk);
        while (true) {
          if (state === 0) {
            if (totalLength(chunks) < 1) {
              break;
            }
            const header = concatChunks(chunks, 1);
            isBinary2 = (header[0] & 128) === 128;
            expectedLength = header[0] & 127;
            if (expectedLength < 126) {
              state = 3;
            } else if (expectedLength === 126) {
              state = 1;
            } else {
              state = 2;
            }
          } else if (state === 1) {
            if (totalLength(chunks) < 2) {
              break;
            }
            const headerArray = concatChunks(chunks, 2);
            expectedLength = new DataView(headerArray.buffer, headerArray.byteOffset, headerArray.length).getUint16(0);
            state = 3;
          } else if (state === 2) {
            if (totalLength(chunks) < 8) {
              break;
            }
            const headerArray = concatChunks(chunks, 8);
            const view = new DataView(headerArray.buffer, headerArray.byteOffset, headerArray.length);
            const n = view.getUint32(0);
            if (n > Math.pow(2, 53 - 32) - 1) {
              controller.enqueue(ERROR_PACKET);
              break;
            }
            expectedLength = n * Math.pow(2, 32) + view.getUint32(4);
            state = 3;
          } else {
            if (totalLength(chunks) < expectedLength) {
              break;
            }
            const data = concatChunks(chunks, expectedLength);
            controller.enqueue(decodePacket(isBinary2 ? data : TEXT_DECODER.decode(data), binaryType));
            state = 0;
          }
          if (expectedLength === 0 || expectedLength > maxPayload) {
            controller.enqueue(ERROR_PACKET);
            break;
          }
        }
      }
    });
  }
  var protocol = 4;

  // node_modules/@socket.io/component-emitter/lib/esm/index.js
  function Emitter2(obj) {
    if (obj)
      return mixin(obj);
  }
  function mixin(obj) {
    for (var key in Emitter2.prototype) {
      obj[key] = Emitter2.prototype[key];
    }
    return obj;
  }
  Emitter2.prototype.on = Emitter2.prototype.addEventListener = function(event, fn) {
    this._callbacks = this._callbacks || {};
    (this._callbacks["$" + event] = this._callbacks["$" + event] || []).push(fn);
    return this;
  };
  Emitter2.prototype.once = function(event, fn) {
    function on2() {
      this.off(event, on2);
      fn.apply(this, arguments);
    }
    on2.fn = fn;
    this.on(event, on2);
    return this;
  };
  Emitter2.prototype.off = Emitter2.prototype.removeListener = Emitter2.prototype.removeAllListeners = Emitter2.prototype.removeEventListener = function(event, fn) {
    this._callbacks = this._callbacks || {};
    if (0 == arguments.length) {
      this._callbacks = {};
      return this;
    }
    var callbacks = this._callbacks["$" + event];
    if (!callbacks)
      return this;
    if (1 == arguments.length) {
      delete this._callbacks["$" + event];
      return this;
    }
    var cb;
    for (var i2 = 0; i2 < callbacks.length; i2++) {
      cb = callbacks[i2];
      if (cb === fn || cb.fn === fn) {
        callbacks.splice(i2, 1);
        break;
      }
    }
    if (callbacks.length === 0) {
      delete this._callbacks["$" + event];
    }
    return this;
  };
  Emitter2.prototype.emit = function(event) {
    this._callbacks = this._callbacks || {};
    var args = new Array(arguments.length - 1), callbacks = this._callbacks["$" + event];
    for (var i2 = 1; i2 < arguments.length; i2++) {
      args[i2 - 1] = arguments[i2];
    }
    if (callbacks) {
      callbacks = callbacks.slice(0);
      for (var i2 = 0, len4 = callbacks.length; i2 < len4; ++i2) {
        callbacks[i2].apply(this, args);
      }
    }
    return this;
  };
  Emitter2.prototype.emitReserved = Emitter2.prototype.emit;
  Emitter2.prototype.listeners = function(event) {
    this._callbacks = this._callbacks || {};
    return this._callbacks["$" + event] || [];
  };
  Emitter2.prototype.hasListeners = function(event) {
    return !!this.listeners(event).length;
  };

  // node_modules/engine.io-client/build/esm/globalThis.browser.js
  var globalThisShim = (() => {
    if (typeof self !== "undefined") {
      return self;
    } else if (typeof window !== "undefined") {
      return window;
    } else {
      return Function("return this")();
    }
  })();

  // node_modules/engine.io-client/build/esm/util.js
  function pick(obj, ...attr) {
    return attr.reduce((acc, k) => {
      if (obj.hasOwnProperty(k)) {
        acc[k] = obj[k];
      }
      return acc;
    }, {});
  }
  var NATIVE_SET_TIMEOUT = globalThisShim.setTimeout;
  var NATIVE_CLEAR_TIMEOUT = globalThisShim.clearTimeout;
  function installTimerFunctions(obj, opts) {
    if (opts.useNativeTimers) {
      obj.setTimeoutFn = NATIVE_SET_TIMEOUT.bind(globalThisShim);
      obj.clearTimeoutFn = NATIVE_CLEAR_TIMEOUT.bind(globalThisShim);
    } else {
      obj.setTimeoutFn = globalThisShim.setTimeout.bind(globalThisShim);
      obj.clearTimeoutFn = globalThisShim.clearTimeout.bind(globalThisShim);
    }
  }
  var BASE64_OVERHEAD = 1.33;
  function byteLength(obj) {
    if (typeof obj === "string") {
      return utf8Length(obj);
    }
    return Math.ceil((obj.byteLength || obj.size) * BASE64_OVERHEAD);
  }
  function utf8Length(str5) {
    let c = 0, length6 = 0;
    for (let i2 = 0, l = str5.length; i2 < l; i2++) {
      c = str5.charCodeAt(i2);
      if (c < 128) {
        length6 += 1;
      } else if (c < 2048) {
        length6 += 2;
      } else if (c < 55296 || c >= 57344) {
        length6 += 3;
      } else {
        i2++;
        length6 += 4;
      }
    }
    return length6;
  }

  // node_modules/engine.io-client/build/esm/contrib/parseqs.js
  function encode(obj) {
    let str5 = "";
    for (let i2 in obj) {
      if (obj.hasOwnProperty(i2)) {
        if (str5.length)
          str5 += "&";
        str5 += encodeURIComponent(i2) + "=" + encodeURIComponent(obj[i2]);
      }
    }
    return str5;
  }
  function decode3(qs) {
    let qry = {};
    let pairs = qs.split("&");
    for (let i2 = 0, l = pairs.length; i2 < l; i2++) {
      let pair = pairs[i2].split("=");
      qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return qry;
  }

  // node_modules/engine.io-client/build/esm/transport.js
  var TransportError = class extends Error {
    constructor(reason, description, context) {
      super(reason);
      this.description = description;
      this.context = context;
      this.type = "TransportError";
    }
  };
  var Transport = class extends Emitter2 {
    /**
     * Transport abstract constructor.
     *
     * @param {Object} opts - options
     * @protected
     */
    constructor(opts) {
      super();
      this.writable = false;
      installTimerFunctions(this, opts);
      this.opts = opts;
      this.query = opts.query;
      this.socket = opts.socket;
    }
    /**
     * Emits an error.
     *
     * @param {String} reason
     * @param description
     * @param context - the error context
     * @return {Transport} for chaining
     * @protected
     */
    onError(reason, description, context) {
      super.emitReserved("error", new TransportError(reason, description, context));
      return this;
    }
    /**
     * Opens the transport.
     */
    open() {
      this.readyState = "opening";
      this.doOpen();
      return this;
    }
    /**
     * Closes the transport.
     */
    close() {
      if (this.readyState === "opening" || this.readyState === "open") {
        this.doClose();
        this.onClose();
      }
      return this;
    }
    /**
     * Sends multiple packets.
     *
     * @param {Array} packets
     */
    send(packets) {
      if (this.readyState === "open") {
        this.write(packets);
      } else {
      }
    }
    /**
     * Called upon open
     *
     * @protected
     */
    onOpen() {
      this.readyState = "open";
      this.writable = true;
      super.emitReserved("open");
    }
    /**
     * Called with data.
     *
     * @param {String} data
     * @protected
     */
    onData(data) {
      const packet = decodePacket(data, this.socket.binaryType);
      this.onPacket(packet);
    }
    /**
     * Called with a decoded packet.
     *
     * @protected
     */
    onPacket(packet) {
      super.emitReserved("packet", packet);
    }
    /**
     * Called upon close.
     *
     * @protected
     */
    onClose(details) {
      this.readyState = "closed";
      super.emitReserved("close", details);
    }
    /**
     * Pauses the transport, in order not to lose packets during an upgrade.
     *
     * @param onPause
     */
    pause(onPause) {
    }
    createUri(schema, query = {}) {
      return schema + "://" + this._hostname() + this._port() + this.opts.path + this._query(query);
    }
    _hostname() {
      const hostname = this.opts.hostname;
      return hostname.indexOf(":") === -1 ? hostname : "[" + hostname + "]";
    }
    _port() {
      if (this.opts.port && (this.opts.secure && Number(this.opts.port !== 443) || !this.opts.secure && Number(this.opts.port) !== 80)) {
        return ":" + this.opts.port;
      } else {
        return "";
      }
    }
    _query(query) {
      const encodedQuery = encode(query);
      return encodedQuery.length ? "?" + encodedQuery : "";
    }
  };

  // node_modules/engine.io-client/build/esm/contrib/yeast.js
  var alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split("");
  var length5 = 64;
  var map = {};
  var seed = 0;
  var i = 0;
  var prev;
  function encode2(num) {
    let encoded = "";
    do {
      encoded = alphabet[num % length5] + encoded;
      num = Math.floor(num / length5);
    } while (num > 0);
    return encoded;
  }
  function yeast() {
    const now = encode2(+/* @__PURE__ */ new Date());
    if (now !== prev)
      return seed = 0, prev = now;
    return now + "." + encode2(seed++);
  }
  for (; i < length5; i++)
    map[alphabet[i]] = i;

  // node_modules/engine.io-client/build/esm/contrib/has-cors.js
  var value = false;
  try {
    value = typeof XMLHttpRequest !== "undefined" && "withCredentials" in new XMLHttpRequest();
  } catch (err) {
  }
  var hasCORS = value;

  // node_modules/engine.io-client/build/esm/transports/xmlhttprequest.browser.js
  function XHR(opts) {
    const xdomain = opts.xdomain;
    try {
      if ("undefined" !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
        return new XMLHttpRequest();
      }
    } catch (e) {
    }
    if (!xdomain) {
      try {
        return new globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
      } catch (e) {
      }
    }
  }
  function createCookieJar() {
  }

  // node_modules/engine.io-client/build/esm/transports/polling.js
  function empty() {
  }
  var hasXHR2 = function() {
    const xhr = new XHR({
      xdomain: false
    });
    return null != xhr.responseType;
  }();
  var Polling = class extends Transport {
    /**
     * XHR Polling constructor.
     *
     * @param {Object} opts
     * @package
     */
    constructor(opts) {
      super(opts);
      this.polling = false;
      if (typeof location !== "undefined") {
        const isSSL = "https:" === location.protocol;
        let port = location.port;
        if (!port) {
          port = isSSL ? "443" : "80";
        }
        this.xd = typeof location !== "undefined" && opts.hostname !== location.hostname || port !== opts.port;
      }
      const forceBase64 = opts && opts.forceBase64;
      this.supportsBinary = hasXHR2 && !forceBase64;
      if (this.opts.withCredentials) {
        this.cookieJar = createCookieJar();
      }
    }
    get name() {
      return "polling";
    }
    /**
     * Opens the socket (triggers polling). We write a PING message to determine
     * when the transport is open.
     *
     * @protected
     */
    doOpen() {
      this.poll();
    }
    /**
     * Pauses polling.
     *
     * @param {Function} onPause - callback upon buffers are flushed and transport is paused
     * @package
     */
    pause(onPause) {
      this.readyState = "pausing";
      const pause = () => {
        this.readyState = "paused";
        onPause();
      };
      if (this.polling || !this.writable) {
        let total = 0;
        if (this.polling) {
          total++;
          this.once("pollComplete", function() {
            --total || pause();
          });
        }
        if (!this.writable) {
          total++;
          this.once("drain", function() {
            --total || pause();
          });
        }
      } else {
        pause();
      }
    }
    /**
     * Starts polling cycle.
     *
     * @private
     */
    poll() {
      this.polling = true;
      this.doPoll();
      this.emitReserved("poll");
    }
    /**
     * Overloads onData to detect payloads.
     *
     * @protected
     */
    onData(data) {
      const callback = (packet) => {
        if ("opening" === this.readyState && packet.type === "open") {
          this.onOpen();
        }
        if ("close" === packet.type) {
          this.onClose({ description: "transport closed by the server" });
          return false;
        }
        this.onPacket(packet);
      };
      decodePayload(data, this.socket.binaryType).forEach(callback);
      if ("closed" !== this.readyState) {
        this.polling = false;
        this.emitReserved("pollComplete");
        if ("open" === this.readyState) {
          this.poll();
        } else {
        }
      }
    }
    /**
     * For polling, send a close packet.
     *
     * @protected
     */
    doClose() {
      const close = () => {
        this.write([{ type: "close" }]);
      };
      if ("open" === this.readyState) {
        close();
      } else {
        this.once("open", close);
      }
    }
    /**
     * Writes a packets payload.
     *
     * @param {Array} packets - data packets
     * @protected
     */
    write(packets) {
      this.writable = false;
      encodePayload(packets, (data) => {
        this.doWrite(data, () => {
          this.writable = true;
          this.emitReserved("drain");
        });
      });
    }
    /**
     * Generates uri for connection.
     *
     * @private
     */
    uri() {
      const schema = this.opts.secure ? "https" : "http";
      const query = this.query || {};
      if (false !== this.opts.timestampRequests) {
        query[this.opts.timestampParam] = yeast();
      }
      if (!this.supportsBinary && !query.sid) {
        query.b64 = 1;
      }
      return this.createUri(schema, query);
    }
    /**
     * Creates a request.
     *
     * @param {String} method
     * @private
     */
    request(opts = {}) {
      Object.assign(opts, { xd: this.xd, cookieJar: this.cookieJar }, this.opts);
      return new Request(this.uri(), opts);
    }
    /**
     * Sends data.
     *
     * @param {String} data to send.
     * @param {Function} called upon flush.
     * @private
     */
    doWrite(data, fn) {
      const req = this.request({
        method: "POST",
        data
      });
      req.on("success", fn);
      req.on("error", (xhrStatus, context) => {
        this.onError("xhr post error", xhrStatus, context);
      });
    }
    /**
     * Starts a poll cycle.
     *
     * @private
     */
    doPoll() {
      const req = this.request();
      req.on("data", this.onData.bind(this));
      req.on("error", (xhrStatus, context) => {
        this.onError("xhr poll error", xhrStatus, context);
      });
      this.pollXhr = req;
    }
  };
  var Request = class extends Emitter2 {
    /**
     * Request constructor
     *
     * @param {Object} options
     * @package
     */
    constructor(uri, opts) {
      super();
      installTimerFunctions(this, opts);
      this.opts = opts;
      this.method = opts.method || "GET";
      this.uri = uri;
      this.data = void 0 !== opts.data ? opts.data : null;
      this.create();
    }
    /**
     * Creates the XHR object and sends the request.
     *
     * @private
     */
    create() {
      var _a;
      const opts = pick(this.opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
      opts.xdomain = !!this.opts.xd;
      const xhr = this.xhr = new XHR(opts);
      try {
        xhr.open(this.method, this.uri, true);
        try {
          if (this.opts.extraHeaders) {
            xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
            for (let i2 in this.opts.extraHeaders) {
              if (this.opts.extraHeaders.hasOwnProperty(i2)) {
                xhr.setRequestHeader(i2, this.opts.extraHeaders[i2]);
              }
            }
          }
        } catch (e) {
        }
        if ("POST" === this.method) {
          try {
            xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
          } catch (e) {
          }
        }
        try {
          xhr.setRequestHeader("Accept", "*/*");
        } catch (e) {
        }
        (_a = this.opts.cookieJar) === null || _a === void 0 ? void 0 : _a.addCookies(xhr);
        if ("withCredentials" in xhr) {
          xhr.withCredentials = this.opts.withCredentials;
        }
        if (this.opts.requestTimeout) {
          xhr.timeout = this.opts.requestTimeout;
        }
        xhr.onreadystatechange = () => {
          var _a2;
          if (xhr.readyState === 3) {
            (_a2 = this.opts.cookieJar) === null || _a2 === void 0 ? void 0 : _a2.parseCookies(xhr);
          }
          if (4 !== xhr.readyState)
            return;
          if (200 === xhr.status || 1223 === xhr.status) {
            this.onLoad();
          } else {
            this.setTimeoutFn(() => {
              this.onError(typeof xhr.status === "number" ? xhr.status : 0);
            }, 0);
          }
        };
        xhr.send(this.data);
      } catch (e) {
        this.setTimeoutFn(() => {
          this.onError(e);
        }, 0);
        return;
      }
      if (typeof document !== "undefined") {
        this.index = Request.requestsCount++;
        Request.requests[this.index] = this;
      }
    }
    /**
     * Called upon error.
     *
     * @private
     */
    onError(err) {
      this.emitReserved("error", err, this.xhr);
      this.cleanup(true);
    }
    /**
     * Cleans up house.
     *
     * @private
     */
    cleanup(fromError) {
      if ("undefined" === typeof this.xhr || null === this.xhr) {
        return;
      }
      this.xhr.onreadystatechange = empty;
      if (fromError) {
        try {
          this.xhr.abort();
        } catch (e) {
        }
      }
      if (typeof document !== "undefined") {
        delete Request.requests[this.index];
      }
      this.xhr = null;
    }
    /**
     * Called upon load.
     *
     * @private
     */
    onLoad() {
      const data = this.xhr.responseText;
      if (data !== null) {
        this.emitReserved("data", data);
        this.emitReserved("success");
        this.cleanup();
      }
    }
    /**
     * Aborts the request.
     *
     * @package
     */
    abort() {
      this.cleanup();
    }
  };
  Request.requestsCount = 0;
  Request.requests = {};
  if (typeof document !== "undefined") {
    if (typeof attachEvent === "function") {
      attachEvent("onunload", unloadHandler);
    } else if (typeof addEventListener === "function") {
      const terminationEvent = "onpagehide" in globalThisShim ? "pagehide" : "unload";
      addEventListener(terminationEvent, unloadHandler, false);
    }
  }
  function unloadHandler() {
    for (let i2 in Request.requests) {
      if (Request.requests.hasOwnProperty(i2)) {
        Request.requests[i2].abort();
      }
    }
  }

  // node_modules/engine.io-client/build/esm/transports/websocket-constructor.browser.js
  var nextTick = (() => {
    const isPromiseAvailable = typeof Promise === "function" && typeof Promise.resolve === "function";
    if (isPromiseAvailable) {
      return (cb) => Promise.resolve().then(cb);
    } else {
      return (cb, setTimeoutFn) => setTimeoutFn(cb, 0);
    }
  })();
  var WebSocket = globalThisShim.WebSocket || globalThisShim.MozWebSocket;
  var usingBrowserWebSocket = true;
  var defaultBinaryType = "arraybuffer";

  // node_modules/engine.io-client/build/esm/transports/websocket.js
  var isReactNative = typeof navigator !== "undefined" && typeof navigator.product === "string" && navigator.product.toLowerCase() === "reactnative";
  var WS = class extends Transport {
    /**
     * WebSocket transport constructor.
     *
     * @param {Object} opts - connection options
     * @protected
     */
    constructor(opts) {
      super(opts);
      this.supportsBinary = !opts.forceBase64;
    }
    get name() {
      return "websocket";
    }
    doOpen() {
      if (!this.check()) {
        return;
      }
      const uri = this.uri();
      const protocols = this.opts.protocols;
      const opts = isReactNative ? {} : pick(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
      if (this.opts.extraHeaders) {
        opts.headers = this.opts.extraHeaders;
      }
      try {
        this.ws = usingBrowserWebSocket && !isReactNative ? protocols ? new WebSocket(uri, protocols) : new WebSocket(uri) : new WebSocket(uri, protocols, opts);
      } catch (err) {
        return this.emitReserved("error", err);
      }
      this.ws.binaryType = this.socket.binaryType;
      this.addEventListeners();
    }
    /**
     * Adds event listeners to the socket
     *
     * @private
     */
    addEventListeners() {
      this.ws.onopen = () => {
        if (this.opts.autoUnref) {
          this.ws._socket.unref();
        }
        this.onOpen();
      };
      this.ws.onclose = (closeEvent) => this.onClose({
        description: "websocket connection closed",
        context: closeEvent
      });
      this.ws.onmessage = (ev) => this.onData(ev.data);
      this.ws.onerror = (e) => this.onError("websocket error", e);
    }
    write(packets) {
      this.writable = false;
      for (let i2 = 0; i2 < packets.length; i2++) {
        const packet = packets[i2];
        const lastPacket = i2 === packets.length - 1;
        encodePacket(packet, this.supportsBinary, (data) => {
          const opts = {};
          if (!usingBrowserWebSocket) {
            if (packet.options) {
              opts.compress = packet.options.compress;
            }
            if (this.opts.perMessageDeflate) {
              const len4 = (
                // @ts-ignore
                "string" === typeof data ? Buffer.byteLength(data) : data.length
              );
              if (len4 < this.opts.perMessageDeflate.threshold) {
                opts.compress = false;
              }
            }
          }
          try {
            if (usingBrowserWebSocket) {
              this.ws.send(data);
            } else {
              this.ws.send(data, opts);
            }
          } catch (e) {
          }
          if (lastPacket) {
            nextTick(() => {
              this.writable = true;
              this.emitReserved("drain");
            }, this.setTimeoutFn);
          }
        });
      }
    }
    doClose() {
      if (typeof this.ws !== "undefined") {
        this.ws.close();
        this.ws = null;
      }
    }
    /**
     * Generates uri for connection.
     *
     * @private
     */
    uri() {
      const schema = this.opts.secure ? "wss" : "ws";
      const query = this.query || {};
      if (this.opts.timestampRequests) {
        query[this.opts.timestampParam] = yeast();
      }
      if (!this.supportsBinary) {
        query.b64 = 1;
      }
      return this.createUri(schema, query);
    }
    /**
     * Feature detection for WebSocket.
     *
     * @return {Boolean} whether this transport is available.
     * @private
     */
    check() {
      return !!WebSocket;
    }
  };

  // node_modules/engine.io-client/build/esm/transports/webtransport.js
  var WT = class extends Transport {
    get name() {
      return "webtransport";
    }
    doOpen() {
      if (typeof WebTransport !== "function") {
        return;
      }
      this.transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]);
      this.transport.closed.then(() => {
        this.onClose();
      }).catch((err) => {
        this.onError("webtransport error", err);
      });
      this.transport.ready.then(() => {
        this.transport.createBidirectionalStream().then((stream) => {
          const decoderStream = createPacketDecoderStream(Number.MAX_SAFE_INTEGER, this.socket.binaryType);
          const reader = stream.readable.pipeThrough(decoderStream).getReader();
          const encoderStream = createPacketEncoderStream();
          encoderStream.readable.pipeTo(stream.writable);
          this.writer = encoderStream.writable.getWriter();
          const read = () => {
            reader.read().then(({ done, value: value2 }) => {
              if (done) {
                return;
              }
              this.onPacket(value2);
              read();
            }).catch((err) => {
            });
          };
          read();
          const packet = { type: "open" };
          if (this.query.sid) {
            packet.data = `{"sid":"${this.query.sid}"}`;
          }
          this.writer.write(packet).then(() => this.onOpen());
        });
      });
    }
    write(packets) {
      this.writable = false;
      for (let i2 = 0; i2 < packets.length; i2++) {
        const packet = packets[i2];
        const lastPacket = i2 === packets.length - 1;
        this.writer.write(packet).then(() => {
          if (lastPacket) {
            nextTick(() => {
              this.writable = true;
              this.emitReserved("drain");
            }, this.setTimeoutFn);
          }
        });
      }
    }
    doClose() {
      var _a;
      (_a = this.transport) === null || _a === void 0 ? void 0 : _a.close();
    }
  };

  // node_modules/engine.io-client/build/esm/transports/index.js
  var transports = {
    websocket: WS,
    webtransport: WT,
    polling: Polling
  };

  // node_modules/engine.io-client/build/esm/contrib/parseuri.js
  var re = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
  var parts = [
    "source",
    "protocol",
    "authority",
    "userInfo",
    "user",
    "password",
    "host",
    "port",
    "relative",
    "path",
    "directory",
    "file",
    "query",
    "anchor"
  ];
  function parse(str5) {
    if (str5.length > 2e3) {
      throw "URI too long";
    }
    const src = str5, b = str5.indexOf("["), e = str5.indexOf("]");
    if (b != -1 && e != -1) {
      str5 = str5.substring(0, b) + str5.substring(b, e).replace(/:/g, ";") + str5.substring(e, str5.length);
    }
    let m = re.exec(str5 || ""), uri = {}, i2 = 14;
    while (i2--) {
      uri[parts[i2]] = m[i2] || "";
    }
    if (b != -1 && e != -1) {
      uri.source = src;
      uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ":");
      uri.authority = uri.authority.replace("[", "").replace("]", "").replace(/;/g, ":");
      uri.ipv6uri = true;
    }
    uri.pathNames = pathNames(uri, uri["path"]);
    uri.queryKey = queryKey(uri, uri["query"]);
    return uri;
  }
  function pathNames(obj, path) {
    const regx = /\/{2,9}/g, names = path.replace(regx, "/").split("/");
    if (path.slice(0, 1) == "/" || path.length === 0) {
      names.splice(0, 1);
    }
    if (path.slice(-1) == "/") {
      names.splice(names.length - 1, 1);
    }
    return names;
  }
  function queryKey(uri, query) {
    const data = {};
    query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function($0, $1, $2) {
      if ($1) {
        data[$1] = $2;
      }
    });
    return data;
  }

  // node_modules/engine.io-client/build/esm/socket.js
  var Socket = class extends Emitter2 {
    /**
     * Socket constructor.
     *
     * @param {String|Object} uri - uri or options
     * @param {Object} opts - options
     */
    constructor(uri, opts = {}) {
      super();
      this.binaryType = defaultBinaryType;
      this.writeBuffer = [];
      if (uri && "object" === typeof uri) {
        opts = uri;
        uri = null;
      }
      if (uri) {
        uri = parse(uri);
        opts.hostname = uri.host;
        opts.secure = uri.protocol === "https" || uri.protocol === "wss";
        opts.port = uri.port;
        if (uri.query)
          opts.query = uri.query;
      } else if (opts.host) {
        opts.hostname = parse(opts.host).host;
      }
      installTimerFunctions(this, opts);
      this.secure = null != opts.secure ? opts.secure : typeof location !== "undefined" && "https:" === location.protocol;
      if (opts.hostname && !opts.port) {
        opts.port = this.secure ? "443" : "80";
      }
      this.hostname = opts.hostname || (typeof location !== "undefined" ? location.hostname : "localhost");
      this.port = opts.port || (typeof location !== "undefined" && location.port ? location.port : this.secure ? "443" : "80");
      this.transports = opts.transports || [
        "polling",
        "websocket",
        "webtransport"
      ];
      this.writeBuffer = [];
      this.prevBufferLen = 0;
      this.opts = Object.assign({
        path: "/engine.io",
        agent: false,
        withCredentials: false,
        upgrade: true,
        timestampParam: "t",
        rememberUpgrade: false,
        addTrailingSlash: true,
        rejectUnauthorized: true,
        perMessageDeflate: {
          threshold: 1024
        },
        transportOptions: {},
        closeOnBeforeunload: false
      }, opts);
      this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : "");
      if (typeof this.opts.query === "string") {
        this.opts.query = decode3(this.opts.query);
      }
      this.id = null;
      this.upgrades = null;
      this.pingInterval = null;
      this.pingTimeout = null;
      this.pingTimeoutTimer = null;
      if (typeof addEventListener === "function") {
        if (this.opts.closeOnBeforeunload) {
          this.beforeunloadEventListener = () => {
            if (this.transport) {
              this.transport.removeAllListeners();
              this.transport.close();
            }
          };
          addEventListener("beforeunload", this.beforeunloadEventListener, false);
        }
        if (this.hostname !== "localhost") {
          this.offlineEventListener = () => {
            this.onClose("transport close", {
              description: "network connection lost"
            });
          };
          addEventListener("offline", this.offlineEventListener, false);
        }
      }
      this.open();
    }
    /**
     * Creates transport of the given type.
     *
     * @param {String} name - transport name
     * @return {Transport}
     * @private
     */
    createTransport(name) {
      const query = Object.assign({}, this.opts.query);
      query.EIO = protocol;
      query.transport = name;
      if (this.id)
        query.sid = this.id;
      const opts = Object.assign({}, this.opts, {
        query,
        socket: this,
        hostname: this.hostname,
        secure: this.secure,
        port: this.port
      }, this.opts.transportOptions[name]);
      return new transports[name](opts);
    }
    /**
     * Initializes transport to use and starts probe.
     *
     * @private
     */
    open() {
      let transport;
      if (this.opts.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1) {
        transport = "websocket";
      } else if (0 === this.transports.length) {
        this.setTimeoutFn(() => {
          this.emitReserved("error", "No transports available");
        }, 0);
        return;
      } else {
        transport = this.transports[0];
      }
      this.readyState = "opening";
      try {
        transport = this.createTransport(transport);
      } catch (e) {
        this.transports.shift();
        this.open();
        return;
      }
      transport.open();
      this.setTransport(transport);
    }
    /**
     * Sets the current transport. Disables the existing one (if any).
     *
     * @private
     */
    setTransport(transport) {
      if (this.transport) {
        this.transport.removeAllListeners();
      }
      this.transport = transport;
      transport.on("drain", this.onDrain.bind(this)).on("packet", this.onPacket.bind(this)).on("error", this.onError.bind(this)).on("close", (reason) => this.onClose("transport close", reason));
    }
    /**
     * Probes a transport.
     *
     * @param {String} name - transport name
     * @private
     */
    probe(name) {
      let transport = this.createTransport(name);
      let failed = false;
      Socket.priorWebsocketSuccess = false;
      const onTransportOpen = () => {
        if (failed)
          return;
        transport.send([{ type: "ping", data: "probe" }]);
        transport.once("packet", (msg) => {
          if (failed)
            return;
          if ("pong" === msg.type && "probe" === msg.data) {
            this.upgrading = true;
            this.emitReserved("upgrading", transport);
            if (!transport)
              return;
            Socket.priorWebsocketSuccess = "websocket" === transport.name;
            this.transport.pause(() => {
              if (failed)
                return;
              if ("closed" === this.readyState)
                return;
              cleanup();
              this.setTransport(transport);
              transport.send([{ type: "upgrade" }]);
              this.emitReserved("upgrade", transport);
              transport = null;
              this.upgrading = false;
              this.flush();
            });
          } else {
            const err = new Error("probe error");
            err.transport = transport.name;
            this.emitReserved("upgradeError", err);
          }
        });
      };
      function freezeTransport() {
        if (failed)
          return;
        failed = true;
        cleanup();
        transport.close();
        transport = null;
      }
      const onerror = (err) => {
        const error = new Error("probe error: " + err);
        error.transport = transport.name;
        freezeTransport();
        this.emitReserved("upgradeError", error);
      };
      function onTransportClose() {
        onerror("transport closed");
      }
      function onclose() {
        onerror("socket closed");
      }
      function onupgrade(to) {
        if (transport && to.name !== transport.name) {
          freezeTransport();
        }
      }
      const cleanup = () => {
        transport.removeListener("open", onTransportOpen);
        transport.removeListener("error", onerror);
        transport.removeListener("close", onTransportClose);
        this.off("close", onclose);
        this.off("upgrading", onupgrade);
      };
      transport.once("open", onTransportOpen);
      transport.once("error", onerror);
      transport.once("close", onTransportClose);
      this.once("close", onclose);
      this.once("upgrading", onupgrade);
      if (this.upgrades.indexOf("webtransport") !== -1 && name !== "webtransport") {
        this.setTimeoutFn(() => {
          if (!failed) {
            transport.open();
          }
        }, 200);
      } else {
        transport.open();
      }
    }
    /**
     * Called when connection is deemed open.
     *
     * @private
     */
    onOpen() {
      this.readyState = "open";
      Socket.priorWebsocketSuccess = "websocket" === this.transport.name;
      this.emitReserved("open");
      this.flush();
      if ("open" === this.readyState && this.opts.upgrade) {
        let i2 = 0;
        const l = this.upgrades.length;
        for (; i2 < l; i2++) {
          this.probe(this.upgrades[i2]);
        }
      }
    }
    /**
     * Handles a packet.
     *
     * @private
     */
    onPacket(packet) {
      if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
        this.emitReserved("packet", packet);
        this.emitReserved("heartbeat");
        this.resetPingTimeout();
        switch (packet.type) {
          case "open":
            this.onHandshake(JSON.parse(packet.data));
            break;
          case "ping":
            this.sendPacket("pong");
            this.emitReserved("ping");
            this.emitReserved("pong");
            break;
          case "error":
            const err = new Error("server error");
            err.code = packet.data;
            this.onError(err);
            break;
          case "message":
            this.emitReserved("data", packet.data);
            this.emitReserved("message", packet.data);
            break;
        }
      } else {
      }
    }
    /**
     * Called upon handshake completion.
     *
     * @param {Object} data - handshake obj
     * @private
     */
    onHandshake(data) {
      this.emitReserved("handshake", data);
      this.id = data.sid;
      this.transport.query.sid = data.sid;
      this.upgrades = this.filterUpgrades(data.upgrades);
      this.pingInterval = data.pingInterval;
      this.pingTimeout = data.pingTimeout;
      this.maxPayload = data.maxPayload;
      this.onOpen();
      if ("closed" === this.readyState)
        return;
      this.resetPingTimeout();
    }
    /**
     * Sets and resets ping timeout timer based on server pings.
     *
     * @private
     */
    resetPingTimeout() {
      this.clearTimeoutFn(this.pingTimeoutTimer);
      this.pingTimeoutTimer = this.setTimeoutFn(() => {
        this.onClose("ping timeout");
      }, this.pingInterval + this.pingTimeout);
      if (this.opts.autoUnref) {
        this.pingTimeoutTimer.unref();
      }
    }
    /**
     * Called on `drain` event
     *
     * @private
     */
    onDrain() {
      this.writeBuffer.splice(0, this.prevBufferLen);
      this.prevBufferLen = 0;
      if (0 === this.writeBuffer.length) {
        this.emitReserved("drain");
      } else {
        this.flush();
      }
    }
    /**
     * Flush write buffers.
     *
     * @private
     */
    flush() {
      if ("closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
        const packets = this.getWritablePackets();
        this.transport.send(packets);
        this.prevBufferLen = packets.length;
        this.emitReserved("flush");
      }
    }
    /**
     * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
     * long-polling)
     *
     * @private
     */
    getWritablePackets() {
      const shouldCheckPayloadSize = this.maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1;
      if (!shouldCheckPayloadSize) {
        return this.writeBuffer;
      }
      let payloadSize = 1;
      for (let i2 = 0; i2 < this.writeBuffer.length; i2++) {
        const data = this.writeBuffer[i2].data;
        if (data) {
          payloadSize += byteLength(data);
        }
        if (i2 > 0 && payloadSize > this.maxPayload) {
          return this.writeBuffer.slice(0, i2);
        }
        payloadSize += 2;
      }
      return this.writeBuffer;
    }
    /**
     * Sends a message.
     *
     * @param {String} msg - message.
     * @param {Object} options.
     * @param {Function} callback function.
     * @return {Socket} for chaining.
     */
    write(msg, options, fn) {
      this.sendPacket("message", msg, options, fn);
      return this;
    }
    send(msg, options, fn) {
      this.sendPacket("message", msg, options, fn);
      return this;
    }
    /**
     * Sends a packet.
     *
     * @param {String} type: packet type.
     * @param {String} data.
     * @param {Object} options.
     * @param {Function} fn - callback function.
     * @private
     */
    sendPacket(type, data, options, fn) {
      if ("function" === typeof data) {
        fn = data;
        data = void 0;
      }
      if ("function" === typeof options) {
        fn = options;
        options = null;
      }
      if ("closing" === this.readyState || "closed" === this.readyState) {
        return;
      }
      options = options || {};
      options.compress = false !== options.compress;
      const packet = {
        type,
        data,
        options
      };
      this.emitReserved("packetCreate", packet);
      this.writeBuffer.push(packet);
      if (fn)
        this.once("flush", fn);
      this.flush();
    }
    /**
     * Closes the connection.
     */
    close() {
      const close = () => {
        this.onClose("forced close");
        this.transport.close();
      };
      const cleanupAndClose = () => {
        this.off("upgrade", cleanupAndClose);
        this.off("upgradeError", cleanupAndClose);
        close();
      };
      const waitForUpgrade = () => {
        this.once("upgrade", cleanupAndClose);
        this.once("upgradeError", cleanupAndClose);
      };
      if ("opening" === this.readyState || "open" === this.readyState) {
        this.readyState = "closing";
        if (this.writeBuffer.length) {
          this.once("drain", () => {
            if (this.upgrading) {
              waitForUpgrade();
            } else {
              close();
            }
          });
        } else if (this.upgrading) {
          waitForUpgrade();
        } else {
          close();
        }
      }
      return this;
    }
    /**
     * Called upon transport error
     *
     * @private
     */
    onError(err) {
      Socket.priorWebsocketSuccess = false;
      this.emitReserved("error", err);
      this.onClose("transport error", err);
    }
    /**
     * Called upon transport close.
     *
     * @private
     */
    onClose(reason, description) {
      if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
        this.clearTimeoutFn(this.pingTimeoutTimer);
        this.transport.removeAllListeners("close");
        this.transport.close();
        this.transport.removeAllListeners();
        if (typeof removeEventListener === "function") {
          removeEventListener("beforeunload", this.beforeunloadEventListener, false);
          removeEventListener("offline", this.offlineEventListener, false);
        }
        this.readyState = "closed";
        this.id = null;
        this.emitReserved("close", reason, description);
        this.writeBuffer = [];
        this.prevBufferLen = 0;
      }
    }
    /**
     * Filters upgrades, returning only those matching client transports.
     *
     * @param {Array} upgrades - server upgrades
     * @private
     */
    filterUpgrades(upgrades) {
      const filteredUpgrades = [];
      let i2 = 0;
      const j = upgrades.length;
      for (; i2 < j; i2++) {
        if (~this.transports.indexOf(upgrades[i2]))
          filteredUpgrades.push(upgrades[i2]);
      }
      return filteredUpgrades;
    }
  };
  Socket.protocol = protocol;

  // node_modules/engine.io-client/build/esm/index.js
  var protocol2 = Socket.protocol;

  // node_modules/socket.io-client/build/esm/url.js
  function url(uri, path = "", loc) {
    let obj = uri;
    loc = loc || typeof location !== "undefined" && location;
    if (null == uri)
      uri = loc.protocol + "//" + loc.host;
    if (typeof uri === "string") {
      if ("/" === uri.charAt(0)) {
        if ("/" === uri.charAt(1)) {
          uri = loc.protocol + uri;
        } else {
          uri = loc.host + uri;
        }
      }
      if (!/^(https?|wss?):\/\//.test(uri)) {
        if ("undefined" !== typeof loc) {
          uri = loc.protocol + "//" + uri;
        } else {
          uri = "https://" + uri;
        }
      }
      obj = parse(uri);
    }
    if (!obj.port) {
      if (/^(http|ws)$/.test(obj.protocol)) {
        obj.port = "80";
      } else if (/^(http|ws)s$/.test(obj.protocol)) {
        obj.port = "443";
      }
    }
    obj.path = obj.path || "/";
    const ipv6 = obj.host.indexOf(":") !== -1;
    const host = ipv6 ? "[" + obj.host + "]" : obj.host;
    obj.id = obj.protocol + "://" + host + ":" + obj.port + path;
    obj.href = obj.protocol + "://" + host + (loc && loc.port === obj.port ? "" : ":" + obj.port);
    return obj;
  }

  // node_modules/socket.io-parser/build/esm/index.js
  var esm_exports = {};
  __export(esm_exports, {
    Decoder: () => Decoder,
    Encoder: () => Encoder,
    PacketType: () => PacketType,
    protocol: () => protocol3
  });

  // node_modules/socket.io-parser/build/esm/is-binary.js
  var withNativeArrayBuffer3 = typeof ArrayBuffer === "function";
  var isView2 = (obj) => {
    return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj.buffer instanceof ArrayBuffer;
  };
  var toString = Object.prototype.toString;
  var withNativeBlob2 = typeof Blob === "function" || typeof Blob !== "undefined" && toString.call(Blob) === "[object BlobConstructor]";
  var withNativeFile = typeof File === "function" || typeof File !== "undefined" && toString.call(File) === "[object FileConstructor]";
  function isBinary(obj) {
    return withNativeArrayBuffer3 && (obj instanceof ArrayBuffer || isView2(obj)) || withNativeBlob2 && obj instanceof Blob || withNativeFile && obj instanceof File;
  }
  function hasBinary(obj, toJSON) {
    if (!obj || typeof obj !== "object") {
      return false;
    }
    if (Array.isArray(obj)) {
      for (let i2 = 0, l = obj.length; i2 < l; i2++) {
        if (hasBinary(obj[i2])) {
          return true;
        }
      }
      return false;
    }
    if (isBinary(obj)) {
      return true;
    }
    if (obj.toJSON && typeof obj.toJSON === "function" && arguments.length === 1) {
      return hasBinary(obj.toJSON(), true);
    }
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
        return true;
      }
    }
    return false;
  }

  // node_modules/socket.io-parser/build/esm/binary.js
  function deconstructPacket(packet) {
    const buffers = [];
    const packetData = packet.data;
    const pack = packet;
    pack.data = _deconstructPacket(packetData, buffers);
    pack.attachments = buffers.length;
    return { packet: pack, buffers };
  }
  function _deconstructPacket(data, buffers) {
    if (!data)
      return data;
    if (isBinary(data)) {
      const placeholder = { _placeholder: true, num: buffers.length };
      buffers.push(data);
      return placeholder;
    } else if (Array.isArray(data)) {
      const newData = new Array(data.length);
      for (let i2 = 0; i2 < data.length; i2++) {
        newData[i2] = _deconstructPacket(data[i2], buffers);
      }
      return newData;
    } else if (typeof data === "object" && !(data instanceof Date)) {
      const newData = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          newData[key] = _deconstructPacket(data[key], buffers);
        }
      }
      return newData;
    }
    return data;
  }
  function reconstructPacket(packet, buffers) {
    packet.data = _reconstructPacket(packet.data, buffers);
    delete packet.attachments;
    return packet;
  }
  function _reconstructPacket(data, buffers) {
    if (!data)
      return data;
    if (data && data._placeholder === true) {
      const isIndexValid = typeof data.num === "number" && data.num >= 0 && data.num < buffers.length;
      if (isIndexValid) {
        return buffers[data.num];
      } else {
        throw new Error("illegal attachments");
      }
    } else if (Array.isArray(data)) {
      for (let i2 = 0; i2 < data.length; i2++) {
        data[i2] = _reconstructPacket(data[i2], buffers);
      }
    } else if (typeof data === "object") {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          data[key] = _reconstructPacket(data[key], buffers);
        }
      }
    }
    return data;
  }

  // node_modules/socket.io-parser/build/esm/index.js
  var RESERVED_EVENTS = [
    "connect",
    "connect_error",
    "disconnect",
    "disconnecting",
    "newListener",
    "removeListener"
    // used by the Node.js EventEmitter
  ];
  var protocol3 = 5;
  var PacketType;
  (function(PacketType2) {
    PacketType2[PacketType2["CONNECT"] = 0] = "CONNECT";
    PacketType2[PacketType2["DISCONNECT"] = 1] = "DISCONNECT";
    PacketType2[PacketType2["EVENT"] = 2] = "EVENT";
    PacketType2[PacketType2["ACK"] = 3] = "ACK";
    PacketType2[PacketType2["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
    PacketType2[PacketType2["BINARY_EVENT"] = 5] = "BINARY_EVENT";
    PacketType2[PacketType2["BINARY_ACK"] = 6] = "BINARY_ACK";
  })(PacketType || (PacketType = {}));
  var Encoder = class {
    /**
     * Encoder constructor
     *
     * @param {function} replacer - custom replacer to pass down to JSON.parse
     */
    constructor(replacer) {
      this.replacer = replacer;
    }
    /**
     * Encode a packet as a single string if non-binary, or as a
     * buffer sequence, depending on packet type.
     *
     * @param {Object} obj - packet object
     */
    encode(obj) {
      if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
        if (hasBinary(obj)) {
          return this.encodeAsBinary({
            type: obj.type === PacketType.EVENT ? PacketType.BINARY_EVENT : PacketType.BINARY_ACK,
            nsp: obj.nsp,
            data: obj.data,
            id: obj.id
          });
        }
      }
      return [this.encodeAsString(obj)];
    }
    /**
     * Encode packet as string.
     */
    encodeAsString(obj) {
      let str5 = "" + obj.type;
      if (obj.type === PacketType.BINARY_EVENT || obj.type === PacketType.BINARY_ACK) {
        str5 += obj.attachments + "-";
      }
      if (obj.nsp && "/" !== obj.nsp) {
        str5 += obj.nsp + ",";
      }
      if (null != obj.id) {
        str5 += obj.id;
      }
      if (null != obj.data) {
        str5 += JSON.stringify(obj.data, this.replacer);
      }
      return str5;
    }
    /**
     * Encode packet as 'buffer sequence' by removing blobs, and
     * deconstructing packet into object with placeholders and
     * a list of buffers.
     */
    encodeAsBinary(obj) {
      const deconstruction = deconstructPacket(obj);
      const pack = this.encodeAsString(deconstruction.packet);
      const buffers = deconstruction.buffers;
      buffers.unshift(pack);
      return buffers;
    }
  };
  function isObject(value2) {
    return Object.prototype.toString.call(value2) === "[object Object]";
  }
  var Decoder = class extends Emitter2 {
    /**
     * Decoder constructor
     *
     * @param {function} reviver - custom reviver to pass down to JSON.stringify
     */
    constructor(reviver) {
      super();
      this.reviver = reviver;
    }
    /**
     * Decodes an encoded packet string into packet JSON.
     *
     * @param {String} obj - encoded packet
     */
    add(obj) {
      let packet;
      if (typeof obj === "string") {
        if (this.reconstructor) {
          throw new Error("got plaintext data when reconstructing a packet");
        }
        packet = this.decodeString(obj);
        const isBinaryEvent = packet.type === PacketType.BINARY_EVENT;
        if (isBinaryEvent || packet.type === PacketType.BINARY_ACK) {
          packet.type = isBinaryEvent ? PacketType.EVENT : PacketType.ACK;
          this.reconstructor = new BinaryReconstructor(packet);
          if (packet.attachments === 0) {
            super.emitReserved("decoded", packet);
          }
        } else {
          super.emitReserved("decoded", packet);
        }
      } else if (isBinary(obj) || obj.base64) {
        if (!this.reconstructor) {
          throw new Error("got binary data when not reconstructing a packet");
        } else {
          packet = this.reconstructor.takeBinaryData(obj);
          if (packet) {
            this.reconstructor = null;
            super.emitReserved("decoded", packet);
          }
        }
      } else {
        throw new Error("Unknown type: " + obj);
      }
    }
    /**
     * Decode a packet String (JSON data)
     *
     * @param {String} str
     * @return {Object} packet
     */
    decodeString(str5) {
      let i2 = 0;
      const p = {
        type: Number(str5.charAt(0))
      };
      if (PacketType[p.type] === void 0) {
        throw new Error("unknown packet type " + p.type);
      }
      if (p.type === PacketType.BINARY_EVENT || p.type === PacketType.BINARY_ACK) {
        const start = i2 + 1;
        while (str5.charAt(++i2) !== "-" && i2 != str5.length) {
        }
        const buf = str5.substring(start, i2);
        if (buf != Number(buf) || str5.charAt(i2) !== "-") {
          throw new Error("Illegal attachments");
        }
        p.attachments = Number(buf);
      }
      if ("/" === str5.charAt(i2 + 1)) {
        const start = i2 + 1;
        while (++i2) {
          const c = str5.charAt(i2);
          if ("," === c)
            break;
          if (i2 === str5.length)
            break;
        }
        p.nsp = str5.substring(start, i2);
      } else {
        p.nsp = "/";
      }
      const next = str5.charAt(i2 + 1);
      if ("" !== next && Number(next) == next) {
        const start = i2 + 1;
        while (++i2) {
          const c = str5.charAt(i2);
          if (null == c || Number(c) != c) {
            --i2;
            break;
          }
          if (i2 === str5.length)
            break;
        }
        p.id = Number(str5.substring(start, i2 + 1));
      }
      if (str5.charAt(++i2)) {
        const payload = this.tryParse(str5.substr(i2));
        if (Decoder.isPayloadValid(p.type, payload)) {
          p.data = payload;
        } else {
          throw new Error("invalid payload");
        }
      }
      return p;
    }
    tryParse(str5) {
      try {
        return JSON.parse(str5, this.reviver);
      } catch (e) {
        return false;
      }
    }
    static isPayloadValid(type, payload) {
      switch (type) {
        case PacketType.CONNECT:
          return isObject(payload);
        case PacketType.DISCONNECT:
          return payload === void 0;
        case PacketType.CONNECT_ERROR:
          return typeof payload === "string" || isObject(payload);
        case PacketType.EVENT:
        case PacketType.BINARY_EVENT:
          return Array.isArray(payload) && (typeof payload[0] === "number" || typeof payload[0] === "string" && RESERVED_EVENTS.indexOf(payload[0]) === -1);
        case PacketType.ACK:
        case PacketType.BINARY_ACK:
          return Array.isArray(payload);
      }
    }
    /**
     * Deallocates a parser's resources
     */
    destroy() {
      if (this.reconstructor) {
        this.reconstructor.finishedReconstruction();
        this.reconstructor = null;
      }
    }
  };
  var BinaryReconstructor = class {
    constructor(packet) {
      this.packet = packet;
      this.buffers = [];
      this.reconPack = packet;
    }
    /**
     * Method to be called when binary data received from connection
     * after a BINARY_EVENT packet.
     *
     * @param {Buffer | ArrayBuffer} binData - the raw binary data received
     * @return {null | Object} returns null if more binary data is expected or
     *   a reconstructed packet object if all buffers have been received.
     */
    takeBinaryData(binData) {
      this.buffers.push(binData);
      if (this.buffers.length === this.reconPack.attachments) {
        const packet = reconstructPacket(this.reconPack, this.buffers);
        this.finishedReconstruction();
        return packet;
      }
      return null;
    }
    /**
     * Cleans up binary packet reconstruction variables.
     */
    finishedReconstruction() {
      this.reconPack = null;
      this.buffers = [];
    }
  };

  // node_modules/socket.io-client/build/esm/on.js
  function on(obj, ev, fn) {
    obj.on(ev, fn);
    return function subDestroy() {
      obj.off(ev, fn);
    };
  }

  // node_modules/socket.io-client/build/esm/socket.js
  var RESERVED_EVENTS2 = Object.freeze({
    connect: 1,
    connect_error: 1,
    disconnect: 1,
    disconnecting: 1,
    // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
    newListener: 1,
    removeListener: 1
  });
  var Socket2 = class extends Emitter2 {
    /**
     * `Socket` constructor.
     */
    constructor(io, nsp, opts) {
      super();
      this.connected = false;
      this.recovered = false;
      this.receiveBuffer = [];
      this.sendBuffer = [];
      this._queue = [];
      this._queueSeq = 0;
      this.ids = 0;
      this.acks = {};
      this.flags = {};
      this.io = io;
      this.nsp = nsp;
      if (opts && opts.auth) {
        this.auth = opts.auth;
      }
      this._opts = Object.assign({}, opts);
      if (this.io._autoConnect)
        this.open();
    }
    /**
     * Whether the socket is currently disconnected
     *
     * @example
     * const socket = io();
     *
     * socket.on("connect", () => {
     *   console.log(socket.disconnected); // false
     * });
     *
     * socket.on("disconnect", () => {
     *   console.log(socket.disconnected); // true
     * });
     */
    get disconnected() {
      return !this.connected;
    }
    /**
     * Subscribe to open, close and packet events
     *
     * @private
     */
    subEvents() {
      if (this.subs)
        return;
      const io = this.io;
      this.subs = [
        on(io, "open", this.onopen.bind(this)),
        on(io, "packet", this.onpacket.bind(this)),
        on(io, "error", this.onerror.bind(this)),
        on(io, "close", this.onclose.bind(this))
      ];
    }
    /**
     * Whether the Socket will try to reconnect when its Manager connects or reconnects.
     *
     * @example
     * const socket = io();
     *
     * console.log(socket.active); // true
     *
     * socket.on("disconnect", (reason) => {
     *   if (reason === "io server disconnect") {
     *     // the disconnection was initiated by the server, you need to manually reconnect
     *     console.log(socket.active); // false
     *   }
     *   // else the socket will automatically try to reconnect
     *   console.log(socket.active); // true
     * });
     */
    get active() {
      return !!this.subs;
    }
    /**
     * "Opens" the socket.
     *
     * @example
     * const socket = io({
     *   autoConnect: false
     * });
     *
     * socket.connect();
     */
    connect() {
      if (this.connected)
        return this;
      this.subEvents();
      if (!this.io["_reconnecting"])
        this.io.open();
      if ("open" === this.io._readyState)
        this.onopen();
      return this;
    }
    /**
     * Alias for {@link connect()}.
     */
    open() {
      return this.connect();
    }
    /**
     * Sends a `message` event.
     *
     * This method mimics the WebSocket.send() method.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
     *
     * @example
     * socket.send("hello");
     *
     * // this is equivalent to
     * socket.emit("message", "hello");
     *
     * @return self
     */
    send(...args) {
      args.unshift("message");
      this.emit.apply(this, args);
      return this;
    }
    /**
     * Override `emit`.
     * If the event is in `events`, it's emitted normally.
     *
     * @example
     * socket.emit("hello", "world");
     *
     * // all serializable datastructures are supported (no need to call JSON.stringify)
     * socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
     *
     * // with an acknowledgement from the server
     * socket.emit("hello", "world", (val) => {
     *   // ...
     * });
     *
     * @return self
     */
    emit(ev, ...args) {
      if (RESERVED_EVENTS2.hasOwnProperty(ev)) {
        throw new Error('"' + ev.toString() + '" is a reserved event name');
      }
      args.unshift(ev);
      if (this._opts.retries && !this.flags.fromQueue && !this.flags.volatile) {
        this._addToQueue(args);
        return this;
      }
      const packet = {
        type: PacketType.EVENT,
        data: args
      };
      packet.options = {};
      packet.options.compress = this.flags.compress !== false;
      if ("function" === typeof args[args.length - 1]) {
        const id = this.ids++;
        const ack = args.pop();
        this._registerAckCallback(id, ack);
        packet.id = id;
      }
      const isTransportWritable = this.io.engine && this.io.engine.transport && this.io.engine.transport.writable;
      const discardPacket = this.flags.volatile && (!isTransportWritable || !this.connected);
      if (discardPacket) {
      } else if (this.connected) {
        this.notifyOutgoingListeners(packet);
        this.packet(packet);
      } else {
        this.sendBuffer.push(packet);
      }
      this.flags = {};
      return this;
    }
    /**
     * @private
     */
    _registerAckCallback(id, ack) {
      var _a;
      const timeout = (_a = this.flags.timeout) !== null && _a !== void 0 ? _a : this._opts.ackTimeout;
      if (timeout === void 0) {
        this.acks[id] = ack;
        return;
      }
      const timer = this.io.setTimeoutFn(() => {
        delete this.acks[id];
        for (let i2 = 0; i2 < this.sendBuffer.length; i2++) {
          if (this.sendBuffer[i2].id === id) {
            this.sendBuffer.splice(i2, 1);
          }
        }
        ack.call(this, new Error("operation has timed out"));
      }, timeout);
      const fn = (...args) => {
        this.io.clearTimeoutFn(timer);
        ack.apply(this, args);
      };
      fn.withError = true;
      this.acks[id] = fn;
    }
    /**
     * Emits an event and waits for an acknowledgement
     *
     * @example
     * // without timeout
     * const response = await socket.emitWithAck("hello", "world");
     *
     * // with a specific timeout
     * try {
     *   const response = await socket.timeout(1000).emitWithAck("hello", "world");
     * } catch (err) {
     *   // the server did not acknowledge the event in the given delay
     * }
     *
     * @return a Promise that will be fulfilled when the server acknowledges the event
     */
    emitWithAck(ev, ...args) {
      return new Promise((resolve, reject) => {
        const fn = (arg1, arg2) => {
          return arg1 ? reject(arg1) : resolve(arg2);
        };
        fn.withError = true;
        args.push(fn);
        this.emit(ev, ...args);
      });
    }
    /**
     * Add the packet to the queue.
     * @param args
     * @private
     */
    _addToQueue(args) {
      let ack;
      if (typeof args[args.length - 1] === "function") {
        ack = args.pop();
      }
      const packet = {
        id: this._queueSeq++,
        tryCount: 0,
        pending: false,
        args,
        flags: Object.assign({ fromQueue: true }, this.flags)
      };
      args.push((err, ...responseArgs) => {
        if (packet !== this._queue[0]) {
          return;
        }
        const hasError = err !== null;
        if (hasError) {
          if (packet.tryCount > this._opts.retries) {
            this._queue.shift();
            if (ack) {
              ack(err);
            }
          }
        } else {
          this._queue.shift();
          if (ack) {
            ack(null, ...responseArgs);
          }
        }
        packet.pending = false;
        return this._drainQueue();
      });
      this._queue.push(packet);
      this._drainQueue();
    }
    /**
     * Send the first packet of the queue, and wait for an acknowledgement from the server.
     * @param force - whether to resend a packet that has not been acknowledged yet
     *
     * @private
     */
    _drainQueue(force = false) {
      if (!this.connected || this._queue.length === 0) {
        return;
      }
      const packet = this._queue[0];
      if (packet.pending && !force) {
        return;
      }
      packet.pending = true;
      packet.tryCount++;
      this.flags = packet.flags;
      this.emit.apply(this, packet.args);
    }
    /**
     * Sends a packet.
     *
     * @param packet
     * @private
     */
    packet(packet) {
      packet.nsp = this.nsp;
      this.io._packet(packet);
    }
    /**
     * Called upon engine `open`.
     *
     * @private
     */
    onopen() {
      if (typeof this.auth == "function") {
        this.auth((data) => {
          this._sendConnectPacket(data);
        });
      } else {
        this._sendConnectPacket(this.auth);
      }
    }
    /**
     * Sends a CONNECT packet to initiate the Socket.IO session.
     *
     * @param data
     * @private
     */
    _sendConnectPacket(data) {
      this.packet({
        type: PacketType.CONNECT,
        data: this._pid ? Object.assign({ pid: this._pid, offset: this._lastOffset }, data) : data
      });
    }
    /**
     * Called upon engine or manager `error`.
     *
     * @param err
     * @private
     */
    onerror(err) {
      if (!this.connected) {
        this.emitReserved("connect_error", err);
      }
    }
    /**
     * Called upon engine `close`.
     *
     * @param reason
     * @param description
     * @private
     */
    onclose(reason, description) {
      this.connected = false;
      delete this.id;
      this.emitReserved("disconnect", reason, description);
      this._clearAcks();
    }
    /**
     * Clears the acknowledgement handlers upon disconnection, since the client will never receive an acknowledgement from
     * the server.
     *
     * @private
     */
    _clearAcks() {
      Object.keys(this.acks).forEach((id) => {
        const isBuffered = this.sendBuffer.some((packet) => String(packet.id) === id);
        if (!isBuffered) {
          const ack = this.acks[id];
          delete this.acks[id];
          if (ack.withError) {
            ack.call(this, new Error("socket has been disconnected"));
          }
        }
      });
    }
    /**
     * Called with socket packet.
     *
     * @param packet
     * @private
     */
    onpacket(packet) {
      const sameNamespace = packet.nsp === this.nsp;
      if (!sameNamespace)
        return;
      switch (packet.type) {
        case PacketType.CONNECT:
          if (packet.data && packet.data.sid) {
            this.onconnect(packet.data.sid, packet.data.pid);
          } else {
            this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
          }
          break;
        case PacketType.EVENT:
        case PacketType.BINARY_EVENT:
          this.onevent(packet);
          break;
        case PacketType.ACK:
        case PacketType.BINARY_ACK:
          this.onack(packet);
          break;
        case PacketType.DISCONNECT:
          this.ondisconnect();
          break;
        case PacketType.CONNECT_ERROR:
          this.destroy();
          const err = new Error(packet.data.message);
          err.data = packet.data.data;
          this.emitReserved("connect_error", err);
          break;
      }
    }
    /**
     * Called upon a server event.
     *
     * @param packet
     * @private
     */
    onevent(packet) {
      const args = packet.data || [];
      if (null != packet.id) {
        args.push(this.ack(packet.id));
      }
      if (this.connected) {
        this.emitEvent(args);
      } else {
        this.receiveBuffer.push(Object.freeze(args));
      }
    }
    emitEvent(args) {
      if (this._anyListeners && this._anyListeners.length) {
        const listeners = this._anyListeners.slice();
        for (const listener of listeners) {
          listener.apply(this, args);
        }
      }
      super.emit.apply(this, args);
      if (this._pid && args.length && typeof args[args.length - 1] === "string") {
        this._lastOffset = args[args.length - 1];
      }
    }
    /**
     * Produces an ack callback to emit with an event.
     *
     * @private
     */
    ack(id) {
      const self2 = this;
      let sent = false;
      return function(...args) {
        if (sent)
          return;
        sent = true;
        self2.packet({
          type: PacketType.ACK,
          id,
          data: args
        });
      };
    }
    /**
     * Called upon a server acknowledgement.
     *
     * @param packet
     * @private
     */
    onack(packet) {
      const ack = this.acks[packet.id];
      if (typeof ack !== "function") {
        return;
      }
      delete this.acks[packet.id];
      if (ack.withError) {
        packet.data.unshift(null);
      }
      ack.apply(this, packet.data);
    }
    /**
     * Called upon server connect.
     *
     * @private
     */
    onconnect(id, pid) {
      this.id = id;
      this.recovered = pid && this._pid === pid;
      this._pid = pid;
      this.connected = true;
      this.emitBuffered();
      this.emitReserved("connect");
      this._drainQueue(true);
    }
    /**
     * Emit buffered events (received and emitted).
     *
     * @private
     */
    emitBuffered() {
      this.receiveBuffer.forEach((args) => this.emitEvent(args));
      this.receiveBuffer = [];
      this.sendBuffer.forEach((packet) => {
        this.notifyOutgoingListeners(packet);
        this.packet(packet);
      });
      this.sendBuffer = [];
    }
    /**
     * Called upon server disconnect.
     *
     * @private
     */
    ondisconnect() {
      this.destroy();
      this.onclose("io server disconnect");
    }
    /**
     * Called upon forced client/server side disconnections,
     * this method ensures the manager stops tracking us and
     * that reconnections don't get triggered for this.
     *
     * @private
     */
    destroy() {
      if (this.subs) {
        this.subs.forEach((subDestroy) => subDestroy());
        this.subs = void 0;
      }
      this.io["_destroy"](this);
    }
    /**
     * Disconnects the socket manually. In that case, the socket will not try to reconnect.
     *
     * If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
     *
     * @example
     * const socket = io();
     *
     * socket.on("disconnect", (reason) => {
     *   // console.log(reason); prints "io client disconnect"
     * });
     *
     * socket.disconnect();
     *
     * @return self
     */
    disconnect() {
      if (this.connected) {
        this.packet({ type: PacketType.DISCONNECT });
      }
      this.destroy();
      if (this.connected) {
        this.onclose("io client disconnect");
      }
      return this;
    }
    /**
     * Alias for {@link disconnect()}.
     *
     * @return self
     */
    close() {
      return this.disconnect();
    }
    /**
     * Sets the compress flag.
     *
     * @example
     * socket.compress(false).emit("hello");
     *
     * @param compress - if `true`, compresses the sending data
     * @return self
     */
    compress(compress) {
      this.flags.compress = compress;
      return this;
    }
    /**
     * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
     * ready to send messages.
     *
     * @example
     * socket.volatile.emit("hello"); // the server may or may not receive it
     *
     * @returns self
     */
    get volatile() {
      this.flags.volatile = true;
      return this;
    }
    /**
     * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
     * given number of milliseconds have elapsed without an acknowledgement from the server:
     *
     * @example
     * socket.timeout(5000).emit("my-event", (err) => {
     *   if (err) {
     *     // the server did not acknowledge the event in the given delay
     *   }
     * });
     *
     * @returns self
     */
    timeout(timeout) {
      this.flags.timeout = timeout;
      return this;
    }
    /**
     * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
     * callback.
     *
     * @example
     * socket.onAny((event, ...args) => {
     *   console.log(`got ${event}`);
     * });
     *
     * @param listener
     */
    onAny(listener) {
      this._anyListeners = this._anyListeners || [];
      this._anyListeners.push(listener);
      return this;
    }
    /**
     * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
     * callback. The listener is added to the beginning of the listeners array.
     *
     * @example
     * socket.prependAny((event, ...args) => {
     *   console.log(`got event ${event}`);
     * });
     *
     * @param listener
     */
    prependAny(listener) {
      this._anyListeners = this._anyListeners || [];
      this._anyListeners.unshift(listener);
      return this;
    }
    /**
     * Removes the listener that will be fired when any event is emitted.
     *
     * @example
     * const catchAllListener = (event, ...args) => {
     *   console.log(`got event ${event}`);
     * }
     *
     * socket.onAny(catchAllListener);
     *
     * // remove a specific listener
     * socket.offAny(catchAllListener);
     *
     * // or remove all listeners
     * socket.offAny();
     *
     * @param listener
     */
    offAny(listener) {
      if (!this._anyListeners) {
        return this;
      }
      if (listener) {
        const listeners = this._anyListeners;
        for (let i2 = 0; i2 < listeners.length; i2++) {
          if (listener === listeners[i2]) {
            listeners.splice(i2, 1);
            return this;
          }
        }
      } else {
        this._anyListeners = [];
      }
      return this;
    }
    /**
     * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
     * e.g. to remove listeners.
     */
    listenersAny() {
      return this._anyListeners || [];
    }
    /**
     * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
     * callback.
     *
     * Note: acknowledgements sent to the server are not included.
     *
     * @example
     * socket.onAnyOutgoing((event, ...args) => {
     *   console.log(`sent event ${event}`);
     * });
     *
     * @param listener
     */
    onAnyOutgoing(listener) {
      this._anyOutgoingListeners = this._anyOutgoingListeners || [];
      this._anyOutgoingListeners.push(listener);
      return this;
    }
    /**
     * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
     * callback. The listener is added to the beginning of the listeners array.
     *
     * Note: acknowledgements sent to the server are not included.
     *
     * @example
     * socket.prependAnyOutgoing((event, ...args) => {
     *   console.log(`sent event ${event}`);
     * });
     *
     * @param listener
     */
    prependAnyOutgoing(listener) {
      this._anyOutgoingListeners = this._anyOutgoingListeners || [];
      this._anyOutgoingListeners.unshift(listener);
      return this;
    }
    /**
     * Removes the listener that will be fired when any event is emitted.
     *
     * @example
     * const catchAllListener = (event, ...args) => {
     *   console.log(`sent event ${event}`);
     * }
     *
     * socket.onAnyOutgoing(catchAllListener);
     *
     * // remove a specific listener
     * socket.offAnyOutgoing(catchAllListener);
     *
     * // or remove all listeners
     * socket.offAnyOutgoing();
     *
     * @param [listener] - the catch-all listener (optional)
     */
    offAnyOutgoing(listener) {
      if (!this._anyOutgoingListeners) {
        return this;
      }
      if (listener) {
        const listeners = this._anyOutgoingListeners;
        for (let i2 = 0; i2 < listeners.length; i2++) {
          if (listener === listeners[i2]) {
            listeners.splice(i2, 1);
            return this;
          }
        }
      } else {
        this._anyOutgoingListeners = [];
      }
      return this;
    }
    /**
     * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
     * e.g. to remove listeners.
     */
    listenersAnyOutgoing() {
      return this._anyOutgoingListeners || [];
    }
    /**
     * Notify the listeners for each packet sent
     *
     * @param packet
     *
     * @private
     */
    notifyOutgoingListeners(packet) {
      if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
        const listeners = this._anyOutgoingListeners.slice();
        for (const listener of listeners) {
          listener.apply(this, packet.data);
        }
      }
    }
  };

  // node_modules/socket.io-client/build/esm/contrib/backo2.js
  function Backoff(opts) {
    opts = opts || {};
    this.ms = opts.min || 100;
    this.max = opts.max || 1e4;
    this.factor = opts.factor || 2;
    this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
    this.attempts = 0;
  }
  Backoff.prototype.duration = function() {
    var ms = this.ms * Math.pow(this.factor, this.attempts++);
    if (this.jitter) {
      var rand = Math.random();
      var deviation = Math.floor(rand * this.jitter * ms);
      ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
    }
    return Math.min(ms, this.max) | 0;
  };
  Backoff.prototype.reset = function() {
    this.attempts = 0;
  };
  Backoff.prototype.setMin = function(min2) {
    this.ms = min2;
  };
  Backoff.prototype.setMax = function(max2) {
    this.max = max2;
  };
  Backoff.prototype.setJitter = function(jitter) {
    this.jitter = jitter;
  };

  // node_modules/socket.io-client/build/esm/manager.js
  var Manager = class extends Emitter2 {
    constructor(uri, opts) {
      var _a;
      super();
      this.nsps = {};
      this.subs = [];
      if (uri && "object" === typeof uri) {
        opts = uri;
        uri = void 0;
      }
      opts = opts || {};
      opts.path = opts.path || "/socket.io";
      this.opts = opts;
      installTimerFunctions(this, opts);
      this.reconnection(opts.reconnection !== false);
      this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
      this.reconnectionDelay(opts.reconnectionDelay || 1e3);
      this.reconnectionDelayMax(opts.reconnectionDelayMax || 5e3);
      this.randomizationFactor((_a = opts.randomizationFactor) !== null && _a !== void 0 ? _a : 0.5);
      this.backoff = new Backoff({
        min: this.reconnectionDelay(),
        max: this.reconnectionDelayMax(),
        jitter: this.randomizationFactor()
      });
      this.timeout(null == opts.timeout ? 2e4 : opts.timeout);
      this._readyState = "closed";
      this.uri = uri;
      const _parser = opts.parser || esm_exports;
      this.encoder = new _parser.Encoder();
      this.decoder = new _parser.Decoder();
      this._autoConnect = opts.autoConnect !== false;
      if (this._autoConnect)
        this.open();
    }
    reconnection(v) {
      if (!arguments.length)
        return this._reconnection;
      this._reconnection = !!v;
      return this;
    }
    reconnectionAttempts(v) {
      if (v === void 0)
        return this._reconnectionAttempts;
      this._reconnectionAttempts = v;
      return this;
    }
    reconnectionDelay(v) {
      var _a;
      if (v === void 0)
        return this._reconnectionDelay;
      this._reconnectionDelay = v;
      (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMin(v);
      return this;
    }
    randomizationFactor(v) {
      var _a;
      if (v === void 0)
        return this._randomizationFactor;
      this._randomizationFactor = v;
      (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setJitter(v);
      return this;
    }
    reconnectionDelayMax(v) {
      var _a;
      if (v === void 0)
        return this._reconnectionDelayMax;
      this._reconnectionDelayMax = v;
      (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMax(v);
      return this;
    }
    timeout(v) {
      if (!arguments.length)
        return this._timeout;
      this._timeout = v;
      return this;
    }
    /**
     * Starts trying to reconnect if reconnection is enabled and we have not
     * started reconnecting yet
     *
     * @private
     */
    maybeReconnectOnOpen() {
      if (!this._reconnecting && this._reconnection && this.backoff.attempts === 0) {
        this.reconnect();
      }
    }
    /**
     * Sets the current transport `socket`.
     *
     * @param {Function} fn - optional, callback
     * @return self
     * @public
     */
    open(fn) {
      if (~this._readyState.indexOf("open"))
        return this;
      this.engine = new Socket(this.uri, this.opts);
      const socket = this.engine;
      const self2 = this;
      this._readyState = "opening";
      this.skipReconnect = false;
      const openSubDestroy = on(socket, "open", function() {
        self2.onopen();
        fn && fn();
      });
      const onError = (err) => {
        this.cleanup();
        this._readyState = "closed";
        this.emitReserved("error", err);
        if (fn) {
          fn(err);
        } else {
          this.maybeReconnectOnOpen();
        }
      };
      const errorSub = on(socket, "error", onError);
      if (false !== this._timeout) {
        const timeout = this._timeout;
        const timer = this.setTimeoutFn(() => {
          openSubDestroy();
          onError(new Error("timeout"));
          socket.close();
        }, timeout);
        if (this.opts.autoUnref) {
          timer.unref();
        }
        this.subs.push(() => {
          this.clearTimeoutFn(timer);
        });
      }
      this.subs.push(openSubDestroy);
      this.subs.push(errorSub);
      return this;
    }
    /**
     * Alias for open()
     *
     * @return self
     * @public
     */
    connect(fn) {
      return this.open(fn);
    }
    /**
     * Called upon transport open.
     *
     * @private
     */
    onopen() {
      this.cleanup();
      this._readyState = "open";
      this.emitReserved("open");
      const socket = this.engine;
      this.subs.push(on(socket, "ping", this.onping.bind(this)), on(socket, "data", this.ondata.bind(this)), on(socket, "error", this.onerror.bind(this)), on(socket, "close", this.onclose.bind(this)), on(this.decoder, "decoded", this.ondecoded.bind(this)));
    }
    /**
     * Called upon a ping.
     *
     * @private
     */
    onping() {
      this.emitReserved("ping");
    }
    /**
     * Called with data.
     *
     * @private
     */
    ondata(data) {
      try {
        this.decoder.add(data);
      } catch (e) {
        this.onclose("parse error", e);
      }
    }
    /**
     * Called when parser fully decodes a packet.
     *
     * @private
     */
    ondecoded(packet) {
      nextTick(() => {
        this.emitReserved("packet", packet);
      }, this.setTimeoutFn);
    }
    /**
     * Called upon socket error.
     *
     * @private
     */
    onerror(err) {
      this.emitReserved("error", err);
    }
    /**
     * Creates a new socket for the given `nsp`.
     *
     * @return {Socket}
     * @public
     */
    socket(nsp, opts) {
      let socket = this.nsps[nsp];
      if (!socket) {
        socket = new Socket2(this, nsp, opts);
        this.nsps[nsp] = socket;
      } else if (this._autoConnect && !socket.active) {
        socket.connect();
      }
      return socket;
    }
    /**
     * Called upon a socket close.
     *
     * @param socket
     * @private
     */
    _destroy(socket) {
      const nsps = Object.keys(this.nsps);
      for (const nsp of nsps) {
        const socket2 = this.nsps[nsp];
        if (socket2.active) {
          return;
        }
      }
      this._close();
    }
    /**
     * Writes a packet.
     *
     * @param packet
     * @private
     */
    _packet(packet) {
      const encodedPackets = this.encoder.encode(packet);
      for (let i2 = 0; i2 < encodedPackets.length; i2++) {
        this.engine.write(encodedPackets[i2], packet.options);
      }
    }
    /**
     * Clean up transport subscriptions and packet buffer.
     *
     * @private
     */
    cleanup() {
      this.subs.forEach((subDestroy) => subDestroy());
      this.subs.length = 0;
      this.decoder.destroy();
    }
    /**
     * Close the current socket.
     *
     * @private
     */
    _close() {
      this.skipReconnect = true;
      this._reconnecting = false;
      this.onclose("forced close");
      if (this.engine)
        this.engine.close();
    }
    /**
     * Alias for close()
     *
     * @private
     */
    disconnect() {
      return this._close();
    }
    /**
     * Called upon engine close.
     *
     * @private
     */
    onclose(reason, description) {
      this.cleanup();
      this.backoff.reset();
      this._readyState = "closed";
      this.emitReserved("close", reason, description);
      if (this._reconnection && !this.skipReconnect) {
        this.reconnect();
      }
    }
    /**
     * Attempt a reconnection.
     *
     * @private
     */
    reconnect() {
      if (this._reconnecting || this.skipReconnect)
        return this;
      const self2 = this;
      if (this.backoff.attempts >= this._reconnectionAttempts) {
        this.backoff.reset();
        this.emitReserved("reconnect_failed");
        this._reconnecting = false;
      } else {
        const delay = this.backoff.duration();
        this._reconnecting = true;
        const timer = this.setTimeoutFn(() => {
          if (self2.skipReconnect)
            return;
          this.emitReserved("reconnect_attempt", self2.backoff.attempts);
          if (self2.skipReconnect)
            return;
          self2.open((err) => {
            if (err) {
              self2._reconnecting = false;
              self2.reconnect();
              this.emitReserved("reconnect_error", err);
            } else {
              self2.onreconnect();
            }
          });
        }, delay);
        if (this.opts.autoUnref) {
          timer.unref();
        }
        this.subs.push(() => {
          this.clearTimeoutFn(timer);
        });
      }
    }
    /**
     * Called upon successful reconnect.
     *
     * @private
     */
    onreconnect() {
      const attempt = this.backoff.attempts;
      this._reconnecting = false;
      this.backoff.reset();
      this.emitReserved("reconnect", attempt);
    }
  };

  // node_modules/socket.io-client/build/esm/index.js
  var cache = {};
  function lookup2(uri, opts) {
    if (typeof uri === "object") {
      opts = uri;
      uri = void 0;
    }
    opts = opts || {};
    const parsed = url(uri, opts.path || "/socket.io");
    const source = parsed.source;
    const id = parsed.id;
    const path = parsed.path;
    const sameNamespace = cache[id] && path in cache[id]["nsps"];
    const newConnection = opts.forceNew || opts["force new connection"] || false === opts.multiplex || sameNamespace;
    let io;
    if (newConnection) {
      io = new Manager(source, opts);
    } else {
      if (!cache[id]) {
        cache[id] = new Manager(source, opts);
      }
      io = cache[id];
    }
    if (parsed.query && !opts.query) {
      opts.query = parsed.queryKey;
    }
    return io.socket(parsed.path, opts);
  }
  Object.assign(lookup2, {
    Manager,
    Socket: Socket2,
    io: lookup2,
    connect: lookup2
  });

  // js/InputSender.js
  var InputSender = class extends Component {
    start() {
      this.setupSocketIO();
    }
    setupSocketIO() {
      this.socket = lookup2(this.serverURL);
      this.socket.on("connect", () => {
        console.log("Socket.IO connection established");
      });
      this.socket.on("response", (data) => {
        console.log("Server response:", data);
      });
      this.socket.on("disconnect", () => {
        console.log("Socket.IO connection closed");
      });
    }
    update(dt) {
      if (this.socket.connected) {
        this.socket.emit("controller_data", "hello");
      }
    }
    onDestroy() {
      if (this.socket) {
        this.socket.disconnect();
      }
    }
    sendControllerData() {
      let leftController = this.engine.input.getLeftController();
      let rightController = this.engine.input.getRightController();
      let data = {
        leftController: {
          position: leftController.position.toArray(),
          rotation: leftController.rotation.toArray(),
          joystick: leftController.joystick,
          buttons: {
            trigger: leftController.buttons.trigger.pressed,
            grip: leftController.buttons.grip.pressed,
            touchpad: leftController.buttons.touchpad.pressed
          }
        },
        rightController: {
          position: rightController.position.toArray(),
          rotation: rightController.rotation.toArray(),
          joystick: rightController.joystick,
          buttons: {
            trigger: rightController.buttons.trigger.pressed,
            grip: rightController.buttons.grip.pressed,
            touchpad: rightController.buttons.touchpad.pressed
          }
        }
      };
      this.socket.send(JSON.stringify(data));
    }
  };
  __publicField(InputSender, "TypeName", "InputSender");
  __publicField(InputSender, "Properties", {
    serverURL: Property.string("http://10.0.0.69:8001", "Server URL")
  });

  // js/VideoTexture.js
  var VideoTexture_exports = {};
  __export(VideoTexture_exports, {
    VideoTexture: () => VideoTexture2
  });
  var VideoTexture2 = class extends Component {
    start() {
      if (!this.streamUrl) {
        console.error("Stream URL is not set.");
        return;
      }
      this.img = new Image();
      this.img.crossOrigin = "Anonymous";
      this.img.onload = () => {
        if (this.texture) {
          this.texture.destroy();
        }
        this.texture = this.engine.textures.create(this.img);
        const mesh = this.object.getComponent("mesh");
        if (mesh) {
          if (!this.material) {
            this.material = mesh.material.clone();
            mesh.material = this.material;
          }
          this.material.diffuseTexture = this.texture;
        }
      };
      this.img.onerror = (error) => {
        console.error("Error loading image:", error);
      };
      this.img.src = this.streamUrl;
    }
    update(dt) {
      if (this.img.src !== this.streamUrl) {
        this.img.src = this.streamUrl;
      }
    }
    onStop() {
      if (this.texture) {
        this.texture.destroy();
      }
    }
  };
  __publicField(VideoTexture2, "TypeName", "VideoTexture");
  __publicField(VideoTexture2, "Properties", {
    streamUrl: Property.string("http://10.0.0.69:8000", "Stream URL")
  });

  // js/button.js
  var button_exports = {};
  __export(button_exports, {
    ButtonComponent: () => ButtonComponent,
    hapticFeedback: () => hapticFeedback
  });
  function hapticFeedback(object, strength, duration) {
    const input = object.getComponent(InputComponent);
    if (input && input.xrInputSource) {
      const gamepad = input.xrInputSource.gamepad;
      if (gamepad && gamepad.hapticActuators)
        gamepad.hapticActuators[0].pulse(strength, duration);
    }
  }
  var ButtonComponent = class extends Component {
    static onRegister(engine) {
      engine.registerComponent(HowlerAudioSource);
      engine.registerComponent(CursorTarget);
    }
    /* Position to return to when "unpressing" the button */
    returnPos = new Float32Array(3);
    start() {
      this.mesh = this.buttonMeshObject.getComponent(MeshComponent);
      this.defaultMaterial = this.mesh.material;
      this.buttonMeshObject.getTranslationLocal(this.returnPos);
      this.target = this.object.getComponent(CursorTarget) || this.object.addComponent(CursorTarget);
      this.soundClick = this.object.addComponent(HowlerAudioSource, {
        src: "sfx/click.wav",
        spatial: true
      });
      this.soundUnClick = this.object.addComponent(HowlerAudioSource, {
        src: "sfx/unclick.wav",
        spatial: true
      });
    }
    onActivate() {
      this.target.onHover.add(this.onHover);
      this.target.onUnhover.add(this.onUnhover);
      this.target.onDown.add(this.onDown);
      this.target.onUp.add(this.onUp);
    }
    onDeactivate() {
      this.target.onHover.remove(this.onHover);
      this.target.onUnhover.remove(this.onUnhover);
      this.target.onDown.remove(this.onDown);
      this.target.onUp.remove(this.onUp);
    }
    /* Called by 'cursor-target' */
    onHover = (_, cursor) => {
      this.mesh.material = this.hoverMaterial;
      if (cursor.type === "finger-cursor") {
        this.onDown(_, cursor);
      }
      hapticFeedback(cursor.object, 0.5, 50);
    };
    /* Called by 'cursor-target' */
    onDown = (_, cursor) => {
      this.soundClick.play();
      this.buttonMeshObject.translate([0, -0.1, 0]);
      hapticFeedback(cursor.object, 1, 20);
    };
    /* Called by 'cursor-target' */
    onUp = (_, cursor) => {
      this.soundUnClick.play();
      this.buttonMeshObject.setTranslationLocal(this.returnPos);
      hapticFeedback(cursor.object, 0.7, 20);
    };
    /* Called by 'cursor-target' */
    onUnhover = (_, cursor) => {
      this.mesh.material = this.defaultMaterial;
      if (cursor.type === "finger-cursor") {
        this.onUp(_, cursor);
      }
      hapticFeedback(cursor.object, 0.3, 50);
    };
  };
  __publicField(ButtonComponent, "TypeName", "button");
  __publicField(ButtonComponent, "Properties", {
    /** Object that has the button's mesh attached */
    buttonMeshObject: Property.object(),
    /** Material to apply when the user hovers the button */
    hoverMaterial: Property.material()
  });

  // cache/js/_editor_index.js
  _registerEditor(dist_exports);
  _registerEditor(ImgTexture_exports);
  _registerEditor(InputSender_exports);
  _registerEditor(VideoTexture_exports);
  _registerEditor(button_exports);
})();
/*! Bundled license information:

howler/dist/howler.js:
  (*!
   *  howler.js v2.2.4
   *  howlerjs.com
   *
   *  (c) 2013-2020, James Simpson of GoldFire Studios
   *  goldfirestudios.com
   *
   *  MIT License
   *)
  (*!
   *  Spatial Plugin - Adds support for stereo and 3D audio where Web Audio is supported.
   *  
   *  howler.js v2.2.4
   *  howlerjs.com
   *
   *  (c) 2013-2020, James Simpson of GoldFire Studios
   *  goldfirestudios.com
   *
   *  MIT License
   *)
*/