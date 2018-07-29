/** vim: et:ts=4:sw=4:sts=4
 * @license RequireJS 2.1.8 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
if ((typeof console) === "undefined") {
  var console = (function() {
    function b() {}
    var a = {
      log: b,
      dir: b,
      info: b
    };
    return a
  })()
};
var requirejs, require, define, __BUST = "bust=184",
__DEV_ENV = (location.host === "v2.pps.tv" ? false: true); !
function(global) {
  function isFunction(it) {
    return "[object Function]" === ostring.call(it)
  }
  function isArray(it) {
    return "[object Array]" === ostring.call(it)
  }
  function each(ary, func) {
    if (ary) {
      var i;
      for (i = 0; i < ary.length && (!ary[i] || !func(ary[i], i, ary)); i += 1);
    }
  }
  function eachReverse(ary, func) {
    if (ary) {
      var i;
      for (i = ary.length - 1; i > -1 && (!ary[i] || !func(ary[i], i, ary)); i -= 1);
    }
  }
  function hasProp(obj, prop) {
    return hasOwn.call(obj, prop)
  }
  function getOwn(obj, prop) {
    return hasProp(obj, prop) && obj[prop]
  }
  function eachProp(obj, func) {
    var prop;
    for (prop in obj) if (hasProp(obj, prop) && func(obj[prop], prop)) break
  }
  function mixin(target, source, force, deepStringMixin) {
    source && eachProp(source,
    function(value, prop) {
      if (force || !hasProp(target, prop)) if (deepStringMixin && "string" != typeof value) {
        target[prop] || (target[prop] = {});
        mixin(target[prop], value, force, deepStringMixin)
      } else target[prop] = value
    });
    return target
  }
  function bind(obj, fn) {
    return function() {
      return fn.apply(obj, arguments)
    }
  }
  function scripts() {
    return document.getElementsByTagName("script")
  }
  function defaultOnError(err) {
    throw err
  }
  function getGlobal(value) {
    if (!value) return value;
    var g = global;
    each(value.split("."),
    function(part) {
      g = g[part]
    });
    return g
  }
  function makeError(id, msg, err, requireModules) {
    var e = new Error(msg + "\nhttp://requirejs.org/docs/errors.html#" + id);
    e.requireType = id;
    e.requireModules = requireModules;
    err && (e.originalError = err);
    return e
  }
  function newContext(contextName) {
    function trimDots(ary) {
      var i, part;
      for (i = 0; ary[i]; i += 1) {
        part = ary[i];
        if ("." === part) {
          ary.splice(i, 1);
          i -= 1
        } else if (".." === part) {
          if (1 === i && (".." === ary[2] || ".." === ary[0])) break;
          if (i > 0) {
            ary.splice(i - 1, 2);
            i -= 2
          }
        }
      }
    }
    function normalize(name, baseName, applyMap) {
      var pkgName, pkgConfig, mapValue, nameParts, i, j, nameSegment, foundMap, foundI, foundStarMap, starI, baseParts = baseName && baseName.split("/"),
      normalizedBaseParts = baseParts,
      map = config.map,
      starMap = map && map["*"];
      if (name && "." === name.charAt(0)) if (baseName) {
        normalizedBaseParts = getOwn(config.pkgs, baseName) ? baseParts = [baseName] : baseParts.slice(0, baseParts.length - 1);
        name = normalizedBaseParts.concat(name.split("/"));
        trimDots(name);
        pkgConfig = getOwn(config.pkgs, pkgName = name[0]);
        name = name.join("/");
        pkgConfig && name === pkgName + "/" + pkgConfig.main && (name = pkgName)
      } else 0 === name.indexOf("./") && (name = name.substring(2));
      if (applyMap && map && (baseParts || starMap)) {
        nameParts = name.split("/");
        for (i = nameParts.length; i > 0; i -= 1) {
          nameSegment = nameParts.slice(0, i).join("/");
          if (baseParts) for (j = baseParts.length; j > 0; j -= 1) {
            mapValue = getOwn(map, baseParts.slice(0, j).join("/"));
            if (mapValue) {
              mapValue = getOwn(mapValue, nameSegment);
              if (mapValue) {
                foundMap = mapValue;
                foundI = i;
                break
              }
            }
          }
          if (foundMap) break;
          if (!foundStarMap && starMap && getOwn(starMap, nameSegment)) {
            foundStarMap = getOwn(starMap, nameSegment);
            starI = i
          }
        }
        if (!foundMap && foundStarMap) {
          foundMap = foundStarMap;
          foundI = starI
        }
        if (foundMap) {
          nameParts.splice(0, foundI, foundMap);
          name = nameParts.join("/")
        }
      }
      return name
    }
    function removeScript(name) {
      isBrowser && each(scripts(),
      function(scriptNode) {
        if (scriptNode.getAttribute("data-requiremodule") === name && scriptNode.getAttribute("data-requirecontext") === context.contextName) {
          scriptNode.parentNode.removeChild(scriptNode);
          return ! 0
        }
      })
    }
    function hasPathFallback(id) {
      var pathConfig = getOwn(config.paths, id);
      if (pathConfig && isArray(pathConfig) && pathConfig.length > 1) {
        removeScript(id);
        pathConfig.shift();
        context.require.undef(id);
        context.require([id]);
        return ! 0
      }
    }
    function splitPrefix(name) {
      var prefix, index = name ? name.indexOf("!") : -1;
      if (index > -1) {
        prefix = name.substring(0, index);
        name = name.substring(index + 1, name.length)
      }
      return [prefix, name]
    }
    function makeModuleMap(name, parentModuleMap, isNormalized, applyMap) {
      var url, pluginModule, suffix, nameParts, prefix = null,
      parentName = parentModuleMap ? parentModuleMap.name: null,
      originalName = name,
      isDefine = !0,
      normalizedName = "";
      if (!name) {
        isDefine = !1;
        name = "_@r" + (requireCounter += 1)
      }
      nameParts = splitPrefix(name);
      prefix = nameParts[0];
      name = nameParts[1];
      if (prefix) {
        prefix = normalize(prefix, parentName, applyMap);
        pluginModule = getOwn(defined, prefix)
      }
      if (name) if (prefix) normalizedName = pluginModule && pluginModule.normalize ? pluginModule.normalize(name,
      function(name) {
        return normalize(name, parentName, applyMap)
      }) : normalize(name, parentName, applyMap);
      else {
        normalizedName = normalize(name, parentName, applyMap);
        nameParts = splitPrefix(normalizedName);
        prefix = nameParts[0];
        normalizedName = nameParts[1];
        isNormalized = !0;
        url = context.nameToUrl(normalizedName)
      }
      suffix = !prefix || pluginModule || isNormalized ? "": "_unnormalized" + (unnormalizedCounter += 1);
      return {
        prefix: prefix,
        name: normalizedName,
        parentMap: parentModuleMap,
        unnormalized: !!suffix,
        url: url,
        originalName: originalName,
        isDefine: isDefine,
        id: (prefix ? prefix + "!" + normalizedName: normalizedName) + suffix
      }
    }
    function getModule(depMap) {
      var id = depMap.id,
      mod = getOwn(registry, id);
      mod || (mod = registry[id] = new context.Module(depMap));
      return mod
    }
    function on(depMap, name, fn) {
      var id = depMap.id,
      mod = getOwn(registry, id);
      if (!hasProp(defined, id) || mod && !mod.defineEmitComplete) {
        mod = getModule(depMap);
        mod.error && "error" === name ? fn(mod.error) : mod.on(name, fn)
      } else "defined" === name && fn(defined[id])
    }
    function onError(err, errback) {
      var ids = err.requireModules,
      notified = !1;
      if (errback) errback(err);
      else {
        each(ids,
        function(id) {
          var mod = getOwn(registry, id);
          if (mod) {
            mod.error = err;
            if (mod.events.error) {
              notified = !0;
              mod.emit("error", err)
            }
          }
        });
        notified || req.onError(err)
      }
    }
    function takeGlobalQueue() {
      if (globalDefQueue.length) {
        apsp.apply(defQueue, [defQueue.length - 1, 0].concat(globalDefQueue));
        globalDefQueue = []
      }
    }
    function cleanRegistry(id) {
      delete registry[id];
      delete enabledRegistry[id]
    }
    function breakCycle(mod, traced, processed) {
      var id = mod.map.id;
      if (mod.error) mod.emit("error", mod.error);
      else {
        traced[id] = !0;
        each(mod.depMaps,
        function(depMap, i) {
          var depId = depMap.id,
          dep = getOwn(registry, depId);
          if (dep && !mod.depMatched[i] && !processed[depId]) if (getOwn(traced, depId)) {
            mod.defineDep(i, defined[depId]);
            mod.check()
          } else breakCycle(dep, traced, processed)
        });
        processed[id] = !0
      }
    }
    function checkLoaded() {
      var map, modId, err, usingPathFallback, waitInterval = 1e3 * config.waitSeconds,
      expired = waitInterval && context.startTime + waitInterval < (new Date).getTime(),
      noLoads = [],
      reqCalls = [],
      stillLoading = !1,
      needCycleCheck = !0;
      if (!inCheckLoaded) {
        inCheckLoaded = !0;
        eachProp(enabledRegistry,
        function(mod) {
          map = mod.map;
          modId = map.id;
          if (mod.enabled) {
            map.isDefine || reqCalls.push(mod);
            if (!mod.error) if (!mod.inited && expired) if (hasPathFallback(modId)) {
              usingPathFallback = !0;
              stillLoading = !0
            } else {
              noLoads.push(modId);
              removeScript(modId)
            } else if (!mod.inited && mod.fetched && map.isDefine) {
              stillLoading = !0;
              if (!map.prefix) return needCycleCheck = !1
            }
          }
        });
        if (expired && noLoads.length) {
          err = makeError("timeout", "Load timeout for modules: " + noLoads, null, noLoads);
          err.contextName = context.contextName;
          return onError(err)
        }
        needCycleCheck && each(reqCalls,
        function(mod) {
          breakCycle(mod, {},
          {})
        });
        expired && !usingPathFallback || !stillLoading || !isBrowser && !isWebWorker || checkLoadedTimeoutId || (checkLoadedTimeoutId = setTimeout(function() {
          checkLoadedTimeoutId = 0;
          checkLoaded()
        },
        50));
        inCheckLoaded = !1
      }
    }
    function callGetModule(args) {
      hasProp(defined, args[0]) || getModule(makeModuleMap(args[0], null, !0)).init(args[1], args[2])
    }
    function removeListener(node, func, name, ieName) {
      node.detachEvent && !isOpera ? ieName && node.detachEvent(ieName, func) : node.removeEventListener(name, func, !1)
    }
    function getScriptData(evt) {
      var node = evt.currentTarget || evt.srcElement;
      removeListener(node, context.onScriptLoad, "load", "onreadystatechange");
      removeListener(node, context.onScriptError, "error");
      return {
        node: node,
        id: node && node.getAttribute("data-requiremodule")
      }
    }
    function intakeDefines() {
      var args;
      takeGlobalQueue();
      for (; defQueue.length;) {
        args = defQueue.shift();
        if (null === args[0]) return onError(makeError("mismatch", "Mismatched anonymous define() module: " + args[args.length - 1]));
        callGetModule(args)
      }
    }
    var inCheckLoaded, Module, context, handlers, checkLoadedTimeoutId, config = {
      waitSeconds: 7,
      baseUrl: "./",
      paths: {},
      pkgs: {},
      shim: {},
      config: {}
    },
    registry = {},
    enabledRegistry = {},
    undefEvents = {},
    defQueue = [],
    defined = {},
    urlFetched = {},
    requireCounter = 1,
    unnormalizedCounter = 1;
    handlers = {
      require: function(mod) {
        return mod.require ? mod.require: mod.require = context.makeRequire(mod.map)
      },
      exports: function(mod) {
        mod.usingExports = !0;
        return mod.map.isDefine ? mod.exports ? mod.exports: mod.exports = defined[mod.map.id] = {}: void 0
      },
      module: function(mod) {
        return mod.module ? mod.module: mod.module = {
          id: mod.map.id,
          uri: mod.map.url,
          config: function() {
            var c, pkg = getOwn(config.pkgs, mod.map.id);
            c = pkg ? getOwn(config.config, mod.map.id + "/" + pkg.main) : getOwn(config.config, mod.map.id);
            return c || {}
          },
          exports: defined[mod.map.id]
        }
      }
    };
    Module = function(map) {
      this.events = getOwn(undefEvents, map.id) || {};
      this.map = map;
      this.shim = getOwn(config.shim, map.id);
      this.depExports = [];
      this.depMaps = [];
      this.depMatched = [];
      this.pluginMaps = {};
      this.depCount = 0
    };
    Module.prototype = {
      init: function(depMaps, factory, errback, options) {
        options = options || {};
        if (!this.inited) {
          this.factory = factory;
          errback ? this.on("error", errback) : this.events.error && (errback = bind(this,
          function(err) {
            this.emit("error", err)
          }));
          this.depMaps = depMaps && depMaps.slice(0);
          this.errback = errback;
          this.inited = !0;
          this.ignore = options.ignore;
          options.enabled || this.enabled ? this.enable() : this.check()
        }
      },
      defineDep: function(i, depExports) {
        if (!this.depMatched[i]) {
          this.depMatched[i] = !0;
          this.depCount -= 1;
          this.depExports[i] = depExports
        }
      },
      fetch: function() {
        if (!this.fetched) {
          this.fetched = !0;
          context.startTime = (new Date).getTime();
          var map = this.map;
          if (!this.shim) return map.prefix ? this.callPlugin() : this.load();
          context.makeRequire(this.map, {
            enableBuildCallback: !0
          })(this.shim.deps || [], bind(this,
          function() {
            return map.prefix ? this.callPlugin() : this.load()
          }));
          return void 0
        }
      },
      load: function() {
        var url = this.map.url;
        if (!urlFetched[url]) {
          urlFetched[url] = !0;
          context.load(this.map.id, url)
        }
      },
      check: function() {
        if (this.enabled && !this.enabling) {
          var err, cjsModule, id = this.map.id,
          depExports = this.depExports,
          exports = this.exports,
          factory = this.factory;
          if (this.inited) {
            if (this.error) this.emit("error", this.error);
            else if (!this.defining) {
              this.defining = !0;
              if (this.depCount < 1 && !this.defined) {
                if (isFunction(factory)) {
                  if (this.events.error && this.map.isDefine || req.onError !== defaultOnError) try {
                    exports = context.execCb(id, factory, depExports, exports)
                  } catch(e) {
                    err = e
                  } else exports = context.execCb(id, factory, depExports, exports);
                  if (this.map.isDefine) {
                    cjsModule = this.module;
                    cjsModule && void 0 !== cjsModule.exports && cjsModule.exports !== this.exports ? exports = cjsModule.exports: void 0 === exports && this.usingExports && (exports = this.exports)
                  }
                  if (err) {
                    err.requireMap = this.map;
                    err.requireModules = this.map.isDefine ? [this.map.id] : null;
                    err.requireType = this.map.isDefine ? "define": "require";
                    return onError(this.error = err)
                  }
                } else exports = factory;
                this.exports = exports;
                if (this.map.isDefine && !this.ignore) {
                  defined[id] = exports;
                  req.onResourceLoad && req.onResourceLoad(context, this.map, this.depMaps)
                }
                cleanRegistry(id);
                this.defined = !0
              }
              this.defining = !1;
              if (this.defined && !this.defineEmitted) {
                this.defineEmitted = !0;
                this.emit("defined", this.exports);
                this.defineEmitComplete = !0
              }
            }
          } else this.fetch()
        }
      },
      callPlugin: function() {
        var map = this.map,
        id = map.id,
        pluginMap = makeModuleMap(map.prefix);
        this.depMaps.push(pluginMap);
        on(pluginMap, "defined", bind(this,
        function(plugin) {
          var load, normalizedMap, normalizedMod, name = this.map.name,
          parentName = this.map.parentMap ? this.map.parentMap.name: null,
          localRequire = context.makeRequire(map.parentMap, {
            enableBuildCallback: !0
          });
          if (this.map.unnormalized) {
            plugin.normalize && (name = plugin.normalize(name,
            function(name) {
              return normalize(name, parentName, !0)
            }) || "");
            normalizedMap = makeModuleMap(map.prefix + "!" + name, this.map.parentMap);
            on(normalizedMap, "defined", bind(this,
            function(value) {
              this.init([],
              function() {
                return value
              },
              null, {
                enabled: !0,
                ignore: !0
              })
            }));
            normalizedMod = getOwn(registry, normalizedMap.id);
            if (normalizedMod) {
              this.depMaps.push(normalizedMap);
              this.events.error && normalizedMod.on("error", bind(this,
              function(err) {
                this.emit("error", err)
              }));
              normalizedMod.enable()
            }
          } else {
            load = bind(this,
            function(value) {
              this.init([],
              function() {
                return value
              },
              null, {
                enabled: !0
              })
            });
            load.error = bind(this,
            function(err) {
              this.inited = !0;
              this.error = err;
              err.requireModules = [id];
              eachProp(registry,
              function(mod) {
                0 === mod.map.id.indexOf(id + "_unnormalized") && cleanRegistry(mod.map.id)
              });
              onError(err)
            });
            load.fromText = bind(this,
            function(text, textAlt) {
              var moduleName = map.name,
              moduleMap = makeModuleMap(moduleName),
              hasInteractive = useInteractive;
              textAlt && (text = textAlt);
              hasInteractive && (useInteractive = !1);
              getModule(moduleMap);
              hasProp(config.config, id) && (config.config[moduleName] = config.config[id]);
              try {
                req.exec(text)
              } catch(e) {
                return onError(makeError("fromtexteval", "fromText eval for " + id + " failed: " + e, e, [id]))
              }
              hasInteractive && (useInteractive = !0);
              this.depMaps.push(moduleMap);
              context.completeLoad(moduleName);
              localRequire([moduleName], load)
            });
            plugin.load(map.name, localRequire, load, config)
          }
        }));
        context.enable(pluginMap, this);
        this.pluginMaps[pluginMap.id] = pluginMap
      },
      enable: function() {
        enabledRegistry[this.map.id] = this;
        this.enabled = !0;
        this.enabling = !0;
        each(this.depMaps, bind(this,
        function(depMap, i) {
          var id, mod, handler;
          if ("string" == typeof depMap) {
            depMap = makeModuleMap(depMap, this.map.isDefine ? this.map: this.map.parentMap, !1, !this.skipMap);
            this.depMaps[i] = depMap;
            handler = getOwn(handlers, depMap.id);
            if (handler) {
              this.depExports[i] = handler(this);
              return
            }
            this.depCount += 1;
            on(depMap, "defined", bind(this,
            function(depExports) {
              this.defineDep(i, depExports);
              this.check()
            }));
            this.errback && on(depMap, "error", bind(this, this.errback))
          }
          id = depMap.id;
          mod = registry[id];
          hasProp(handlers, id) || !mod || mod.enabled || context.enable(depMap, this)
        }));
        eachProp(this.pluginMaps, bind(this,
        function(pluginMap) {
          var mod = getOwn(registry, pluginMap.id);
          mod && !mod.enabled && context.enable(pluginMap, this)
        }));
        this.enabling = !1;
        this.check()
      },
      on: function(name, cb) {
        var cbs = this.events[name];
        cbs || (cbs = this.events[name] = []);
        cbs.push(cb)
      },
      emit: function(name, evt) {
        each(this.events[name],
        function(cb) {
          cb(evt)
        });
        "error" === name && delete this.events[name]
      }
    };
    context = {
      config: config,
      contextName: contextName,
      registry: registry,
      defined: defined,
      urlFetched: urlFetched,
      defQueue: defQueue,
      Module: Module,
      makeModuleMap: makeModuleMap,
      nextTick: req.nextTick,
      onError: onError,
      configure: function(cfg) {
        cfg.baseUrl && "/" !== cfg.baseUrl.charAt(cfg.baseUrl.length - 1) && (cfg.baseUrl += "/");
        var pkgs = config.pkgs,
        shim = config.shim,
        objs = {
          paths: !0,
          config: !0,
          map: !0
        };
        eachProp(cfg,
        function(value, prop) {
          if (objs[prop]) if ("map" === prop) {
            config.map || (config.map = {});
            mixin(config[prop], value, !0, !0)
          } else mixin(config[prop], value, !0);
          else config[prop] = value
        });
        if (cfg.shim) {
          eachProp(cfg.shim,
          function(value, id) {
            isArray(value) && (value = {
              deps: value
            }); ! value.exports && !value.init || value.exportsFn || (value.exportsFn = context.makeShimExports(value));
            shim[id] = value
          });
          config.shim = shim
        }
        if (cfg.packages) {
          each(cfg.packages,
          function(pkgObj) {
            var location;
            pkgObj = "string" == typeof pkgObj ? {
              name: pkgObj
            }: pkgObj;
            location = pkgObj.location;
            pkgs[pkgObj.name] = {
              name: pkgObj.name,
              location: location || pkgObj.name,
              main: (pkgObj.main || "main").replace(currDirRegExp, "").replace(jsSuffixRegExp, "")
            }
          });
          config.pkgs = pkgs
        }
        eachProp(registry,
        function(mod, id) {
          mod.inited || mod.map.unnormalized || (mod.map = makeModuleMap(id))
        }); (cfg.deps || cfg.callback) && context.require(cfg.deps || [], cfg.callback)
      },
      makeShimExports: function(value) {
        function fn() {
          var ret;
          value.init && (ret = value.init.apply(global, arguments));
          return ret || value.exports && getGlobal(value.exports)
        }
        return fn
      },
      makeRequire: function(relMap, options) {
        function localRequire(deps, callback, errback) {
          var id, map, requireMod;
          options.enableBuildCallback && callback && isFunction(callback) && (callback.__requireJsBuild = !0);
          if ("string" == typeof deps) {
            if (isFunction(callback)) return onError(makeError("requireargs", "Invalid require call"), errback);
            if (relMap && hasProp(handlers, deps)) return handlers[deps](registry[relMap.id]);
            if (req.get) return req.get(context, deps, relMap, localRequire);
            map = makeModuleMap(deps, relMap, !1, !0);
            id = map.id;
            return hasProp(defined, id) ? defined[id] : onError(makeError("notloaded", 'Module name "' + id + '" has not been loaded yet for context: ' + contextName + (relMap ? "": ". Use require([])")))
          }
          intakeDefines();
          context.nextTick(function() {
            intakeDefines();
            requireMod = getModule(makeModuleMap(null, relMap));
            requireMod.skipMap = options.skipMap;
            requireMod.init(deps, callback, errback, {
              enabled: !0
            });
            checkLoaded()
          });
          return localRequire
        }
        options = options || {};
        mixin(localRequire, {
          isBrowser: isBrowser,
          toUrl: function(moduleNamePlusExt) {
            var ext, index = moduleNamePlusExt.lastIndexOf("."),
            segment = moduleNamePlusExt.split("/")[0],
            isRelative = "." === segment || ".." === segment;
            if ( - 1 !== index && (!isRelative || index > 1)) {
              ext = moduleNamePlusExt.substring(index, moduleNamePlusExt.length);
              moduleNamePlusExt = moduleNamePlusExt.substring(0, index)
            }
            return context.nameToUrl(normalize(moduleNamePlusExt, relMap && relMap.id, !0), ext, !0)
          },
          defined: function(id) {
            return hasProp(defined, makeModuleMap(id, relMap, !1, !0).id)
          },
          specified: function(id) {
            id = makeModuleMap(id, relMap, !1, !0).id;
            return hasProp(defined, id) || hasProp(registry, id)
          }
        });
        relMap || (localRequire.undef = function(id) {
          takeGlobalQueue();
          var map = makeModuleMap(id, relMap, !0),
          mod = getOwn(registry, id);
          delete defined[id];
          delete urlFetched[map.url];
          delete undefEvents[id];
          if (mod) {
            mod.events.defined && (undefEvents[id] = mod.events);
            cleanRegistry(id)
          }
        });
        return localRequire
      },
      enable: function(depMap) {
        var mod = getOwn(registry, depMap.id);
        mod && getModule(depMap).enable()
      },
      completeLoad: function(moduleName) {
        var found, args, mod, shim = getOwn(config.shim, moduleName) || {},
        shExports = shim.exports;
        takeGlobalQueue();
        for (; defQueue.length;) {
          args = defQueue.shift();
          if (null === args[0]) {
            args[0] = moduleName;
            if (found) break;
            found = !0
          } else args[0] === moduleName && (found = !0);
          callGetModule(args)
        }
        mod = getOwn(registry, moduleName);
        if (!found && !hasProp(defined, moduleName) && mod && !mod.inited) {
          if (! (!config.enforceDefine || shExports && getGlobal(shExports))) return hasPathFallback(moduleName) ? void 0 : onError(makeError("nodefine", "No define call for " + moduleName, null, [moduleName]));
          callGetModule([moduleName, shim.deps || [], shim.exportsFn])
        }
        checkLoaded()
      },
      nameToUrl: function(moduleName, ext, skipExt) {
        var paths, pkgs, pkg, pkgPath, syms, i, parentModule, url, parentPath;
        if (req.jsExtRegExp.test(moduleName)) url = moduleName + (ext || "");
        else {
          paths = config.paths;
          pkgs = config.pkgs;
          syms = moduleName.split("/");
          for (i = syms.length; i > 0; i -= 1) {
            parentModule = syms.slice(0, i).join("/");
            pkg = getOwn(pkgs, parentModule);
            parentPath = getOwn(paths, parentModule);
            if (parentPath) {
              isArray(parentPath) && (parentPath = parentPath[0]);
              syms.splice(0, i, parentPath);
              break
            }
            if (pkg) {
              pkgPath = moduleName === pkg.name ? pkg.location + "/" + pkg.main: pkg.location;
              syms.splice(0, i, pkgPath);
              break
            }
          }
          url = syms.join("/");
          url += ext || (/\?/.test(url) || skipExt ? "": ".js");
          url = ("/" === url.charAt(0) || url.match(/^[\w\+\.\-]+:/) ? "": config.baseUrl) + url
        }
        return config.urlArgs ? url + (( - 1 === url.indexOf("?") ? "?": "&") + config.urlArgs) : url
      },
      load: function(id, url) {
        req.load(context, id, url)
      },
      execCb: function(name, callback, args, exports) {
        return callback.apply(exports, args)
      },
      onScriptLoad: function(evt) {
        if ("load" === evt.type || readyRegExp.test((evt.currentTarget || evt.srcElement).readyState)) {
          interactiveScript = null;
          var data = getScriptData(evt);
          context.completeLoad(data.id)
        }
      },
      onScriptError: function(evt) {
        var data = getScriptData(evt);
        return hasPathFallback(data.id) ? void 0 : onError(makeError("scripterror", "Script error for: " + data.id, evt, [data.id]))
      }
    };
    context.require = context.makeRequire();
    return context
  }
  function getInteractiveScript() {
    if (interactiveScript && "interactive" === interactiveScript.readyState) return interactiveScript;
    eachReverse(scripts(),
    function(script) {
      return "interactive" === script.readyState ? interactiveScript = script: void 0
    });
    return interactiveScript
  }
  var req, s, head, baseElement, dataMain, src, interactiveScript, currentlyAddingScript, mainScript, subPath, version = "2.1.8",
  commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm,
  cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
  jsSuffixRegExp = /\.js$/,
  currDirRegExp = /^\.\//,
  op = Object.prototype,
  ostring = op.toString,
  hasOwn = op.hasOwnProperty,
  ap = Array.prototype,
  apsp = ap.splice,
  isBrowser = !("undefined" == typeof window || !navigator || !window.document),
  isWebWorker = !isBrowser && "undefined" != typeof importScripts,
  readyRegExp = isBrowser && "PLAYSTATION 3" === navigator.platform ? /^complete$/: /^(complete|loaded)$/,
  defContextName = "_",
  isOpera = "undefined" != typeof opera && "[object Opera]" === opera.toString(),
  contexts = {},
  cfg = {},
  globalDefQueue = [],
  useInteractive = !1;
  if ("undefined" == typeof define) {
    if ("undefined" != typeof requirejs) {
      if (isFunction(requirejs)) return;
      cfg = requirejs;
      requirejs = void 0
    }
    if ("undefined" != typeof require && !isFunction(require)) {
      cfg = require;
      require = void 0
    }
    req = requirejs = function(deps, callback, errback, optional) {
      var context, config, contextName = defContextName;
      if (!isArray(deps) && "string" != typeof deps) {
        config = deps;
        if (isArray(callback)) {
          deps = callback;
          callback = errback;
          errback = optional
        } else deps = []
      }
      config && config.context && (contextName = config.context);
      context = getOwn(contexts, contextName);
      context || (context = contexts[contextName] = req.s.newContext(contextName));
      config && context.configure(config);
      return context.require(deps, callback, errback)
    };
    req.config = function(config) {
      return req(config)
    };
    req.nextTick = "undefined" != typeof setTimeout ?
    function(fn) {
      setTimeout(fn, 4)
    }: function(fn) {
      fn()
    };
    require || (require = req);
    req.version = version;
    req.jsExtRegExp = /^\/|:|\?|\.js$/;
    req.isBrowser = isBrowser;
    s = req.s = {
      contexts: contexts,
      newContext: newContext
    };
    req({});
    each(["toUrl", "undef", "defined", "specified"],
    function(prop) {
      req[prop] = function() {
        var ctx = contexts[defContextName];
        return ctx.require[prop].apply(ctx, arguments)
      }
    });
    if (isBrowser) {
      head = s.head = document.getElementsByTagName("head")[0];
      baseElement = document.getElementsByTagName("base")[0];
      baseElement && (head = s.head = baseElement.parentNode)
    }
    req.onError = defaultOnError;
    req.createNode = function(config) {
      var node = config.xhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "html:script") : document.createElement("script");
      node.type = config.scriptType || "text/javascript";
      node.charset = __DEV_ENV ? "gbk": "utf-8";
      node.async = !0;
      return node
    };
    req.load = function(context, moduleName, url) {
      var node, config = context && context.config || {};
      if (isBrowser) {
        node = req.createNode(config, moduleName, url);
        node.setAttribute("data-requirecontext", context.contextName);
        node.setAttribute("data-requiremodule", moduleName);
        if (!node.attachEvent || node.attachEvent.toString && node.attachEvent.toString().indexOf("[native code") < 0 || isOpera) {
          node.addEventListener("load", context.onScriptLoad, !1);
          node.addEventListener("error", context.onScriptError, !1)
        } else {
          useInteractive = !0;
          node.attachEvent("onreadystatechange", context.onScriptLoad)
        }
        node.src = url;
        currentlyAddingScript = node;
        baseElement ? head.insertBefore(node, baseElement) : head.appendChild(node);
        currentlyAddingScript = null;
        return node
      }
      if (isWebWorker) try {
        importScripts(url);
        context.completeLoad(moduleName)
      } catch(e) {
        context.onError(makeError("importscripts", "importScripts failed for " + moduleName + " at " + url, e, [moduleName]))
      }
    };
    isBrowser && eachReverse(scripts(),
    function(script) {
      head || (head = script.parentNode);
      dataMain = script.getAttribute("data-main");
      if (dataMain) {
        mainScript = dataMain;
        if (!cfg.baseUrl) {
          src = mainScript.split("/");
          mainScript = src.pop();
          subPath = src.length ? src.join("/") + "/": "./";
          cfg.baseUrl = subPath
        }
        mainScript = mainScript.replace(jsSuffixRegExp, "");
        req.jsExtRegExp.test(mainScript) && (mainScript = dataMain);
        cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [mainScript];
        return ! 0
      }
    });
    define = function(name, deps, callback) {
      var node, context;
      if ("string" != typeof name) {
        callback = deps;
        deps = name;
        name = null
      }
      if (!isArray(deps)) {
        callback = deps;
        deps = null
      }
      if (!deps && isFunction(callback)) {
        deps = [];
        if (callback.length) {
          callback.toString().replace(commentRegExp, "").replace(cjsRequireRegExp,
          function(match, dep) {
            deps.push(dep)
          });
          deps = (1 === callback.length ? ["require"] : ["require", "exports", "module"]).concat(deps)
        }
      }
      if (useInteractive) {
        node = currentlyAddingScript || getInteractiveScript();
        if (node) {
          name || (name = node.getAttribute("data-requiremodule"));
          context = contexts[node.getAttribute("data-requirecontext")]
        }
      } (context ? context.defQueue: globalDefQueue).push([name, deps, callback])
    };
    define.amd = {
      jQuery: !0
    };
    req.exec = function(text) {
      return eval(text)
    };
    req(cfg)
  }
} (this);
require.config({
  baseUrl: !__DEV_ENV ? "http://v2.pps.tv/ugc/js/com/": "http://image1.webscache.com/js/com/",
  shim: {
    "jquery.easing": {
      deps: ["jquery", "jquery_easing"]
    }
  },
  paths: {
    jquery: "bower_components/jquery/jquery",
    jquery_easing: "bower_components/jquery-easing/jquery.easing",
    md5: "bower_components/js-md5/js/md5.min",
    detect: "bower_components/detect/detect.min",
    swfobject: "bower_components/swfobject/swfobject",
    underscore: "bower_components/underscore-amd/underscore-min",
    Backbone: "bower_components/backbone-amd/backbone-min",
    JSON: "bower_components/json2/json2-min",
    handlebars: "bower_components/handlebars/handlebars.amd.min"
  },
  urlArgs: __BUST
});