module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var filename = require("path").join(__dirname, "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 			if (err) {
/******/ 				if (__webpack_require__.onError) return __webpack_require__.oe(err);
/******/ 				throw err;
/******/ 			}
/******/ 			var chunk = {};
/******/ 			require("vm").runInThisContext(
/******/ 				"(function(exports) {" + content + "\n})",
/******/ 				{ filename: filename }
/******/ 			)(chunk);
/******/ 			hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		var filename = require("path").join(__dirname, "" + hotCurrentHash + ".hot-update.json");
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 				if (err) return resolve();
/******/ 				try {
/******/ 					var update = JSON.parse(content);
/******/ 				} catch (e) {
/******/ 					return reject(e);
/******/ 				}
/******/ 				resolve(update);
/******/ 			});
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "79283539f6262445a6aa";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js":
/*!*************************************************************************!*\
  !*** ./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n__webpack_require__(/*! source-map-support/source-map-support.js */ \"source-map-support/source-map-support.js\").install();\n\nconst socketPath = process.env.ELECTRON_HMR_SOCKET_PATH;\n\nif (socketPath == null) {\n  throw new Error(`[HMR] Env ELECTRON_HMR_SOCKET_PATH is not set`);\n} // module, but not relative path must be used (because this file is used as entry)\n\n\nconst HmrClient = __webpack_require__(/*! electron-webpack/out/electron-main-hmr/HmrClient */ \"electron-webpack/out/electron-main-hmr/HmrClient\").HmrClient; // tslint:disable:no-unused-expression\n\n\nnew HmrClient(socketPath, module.hot, () => {\n  return __webpack_require__.h();\n}); \n// __ts-babel@6.0.4\n//# sourceMappingURL=main-hmr.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24td2VicGFjay9vdXQvZWxlY3Ryb24tbWFpbi1obXIvbWFpbi1obXIuanM/MWJkYyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBYTs7QUFFYixtQkFBTyxDQUFDLDBGQUEwQzs7QUFFbEQ7O0FBRUE7QUFDQTtBQUNBLENBQUM7OztBQUdELGtCQUFrQixtQkFBTyxDQUFDLDBHQUFrRCxZQUFZOzs7QUFHeEY7QUFDQSxTQUFTLHVCQUFnQjtBQUN6QixDQUFDLEU7QUFDRDtBQUNBIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL21haW4taG1yLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnJlcXVpcmUoXCJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzXCIpLmluc3RhbGwoKTtcblxuY29uc3Qgc29ja2V0UGF0aCA9IHByb2Nlc3MuZW52LkVMRUNUUk9OX0hNUl9TT0NLRVRfUEFUSDtcblxuaWYgKHNvY2tldFBhdGggPT0gbnVsbCkge1xuICB0aHJvdyBuZXcgRXJyb3IoYFtITVJdIEVudiBFTEVDVFJPTl9ITVJfU09DS0VUX1BBVEggaXMgbm90IHNldGApO1xufSAvLyBtb2R1bGUsIGJ1dCBub3QgcmVsYXRpdmUgcGF0aCBtdXN0IGJlIHVzZWQgKGJlY2F1c2UgdGhpcyBmaWxlIGlzIHVzZWQgYXMgZW50cnkpXG5cblxuY29uc3QgSG1yQ2xpZW50ID0gcmVxdWlyZShcImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudFwiKS5IbXJDbGllbnQ7IC8vIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC1leHByZXNzaW9uXG5cblxubmV3IEhtckNsaWVudChzb2NrZXRQYXRoLCBtb2R1bGUuaG90LCAoKSA9PiB7XG4gIHJldHVybiBfX3dlYnBhY2tfaGFzaF9fO1xufSk7IFxuLy8gX190cy1iYWJlbEA2LjAuNFxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFpbi1obXIuanMubWFwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js\n");

/***/ }),

/***/ "./src/main/MainWindow/index.ts":
/*!**************************************!*\
  !*** ./src/main/MainWindow/index.ts ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return MainWindow; });\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var firebase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase */ \"firebase\");\n/* harmony import */ var firebase__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(firebase__WEBPACK_IMPORTED_MODULE_1__);\n\n\nclass MainWindow extends electron__WEBPACK_IMPORTED_MODULE_0__[\"BrowserWindow\"] {\n    constructor(options) {\n        super(options);\n        this.loginAuth = async (event, arg) => {\n            console.log('login request received', arg);\n            try {\n                var res = await firebase__WEBPACK_IMPORTED_MODULE_1___default.a.auth().signInWithEmailAndPassword(arg.email, arg.pass);\n                console.log('login request completed', res && ' successfully');\n                event.returnValue = res.user ? `Welcome ${res.user.email}` : `Login Unsuccessful`;\n            }\n            catch (_a) {\n                event.returnValue = 'something went wrong';\n            }\n        };\n        this.logout = async (event, arg) => {\n            try {\n                await firebase__WEBPACK_IMPORTED_MODULE_1___default.a.auth().signOut();\n                event.returnValue = 'Securely Logged out';\n            }\n            catch (_a) {\n                event.returnValue = 'something went wrong';\n            }\n        };\n        var firebaseConfig = {\n            apiKey: \"AIzaSyBVlpmxj7PGBO5THWvBagfq612KpismVvo\",\n            authDomain: \"hello-firebase-1d6fc.firebaseapp.com\",\n            databaseURL: \"https://hello-firebase-1d6fc.firebaseio.com\",\n            projectId: \"hello-firebase-1d6fc\",\n            storageBucket: \"hello-firebase-1d6fc.appspot.com\",\n            messagingSenderId: \"760507585405\",\n            appId: \"1:760507585405:web:521de7303a07a749\"\n        };\n        // Initialize Firebase\n        firebase__WEBPACK_IMPORTED_MODULE_1___default.a.initializeApp(firebaseConfig);\n        this.database = firebase__WEBPACK_IMPORTED_MODULE_1___default.a.firestore();\n        firebase__WEBPACK_IMPORTED_MODULE_1___default.a.auth().onAuthStateChanged(user => this.fetchCollection(user));\n        electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].on('loginAuth', this.loginAuth);\n        electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].on('logout', this.logout);\n    }\n    fetchCollection(user) {\n        console.log('fetching collection', user && user.email);\n        if (user) {\n            this.database.collection('todos').get()\n                .then(querySnapshot => {\n                querySnapshot.forEach(el => this.todo = el.data());\n                console.log('collection fetched', this.todo);\n            });\n        }\n        else {\n            this.todo = undefined;\n            console.log('collection cleared');\n        }\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9NYWluV2luZG93L2luZGV4LnRzP2FhMTciXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQWtGO0FBQ3BDO0FBRS9CLE1BQU0sVUFBVyxTQUFRLHNEQUFhO0lBSWpELFlBQVksT0FBeUM7UUFDakQsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQW9CbEIsY0FBUyxHQUFHLEtBQUssRUFBRSxLQUFVLEVBQUUsR0FBUSxFQUFFLEVBQUU7WUFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLENBQUM7WUFDMUMsSUFBSTtnQkFDQSxJQUFJLEdBQUcsR0FBRyxNQUFNLCtDQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsMEJBQTBCLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDO2dCQUMvRSxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixFQUFFLEdBQUcsSUFBSSxlQUFlLENBQUM7Z0JBQzlELEtBQUssQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxvQkFBb0I7YUFDcEY7WUFBQyxXQUFNO2dCQUNKLEtBQUssQ0FBQyxXQUFXLEdBQUcsc0JBQXNCO2FBQzdDO1FBRUwsQ0FBQztRQUVELFdBQU0sR0FBRyxLQUFLLEVBQUUsS0FBVSxFQUFFLEdBQVEsRUFBRSxFQUFFO1lBQ3BDLElBQUk7Z0JBQ0EsTUFBTSwrQ0FBUSxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRTtnQkFDL0IsS0FBSyxDQUFDLFdBQVcsR0FBRyxxQkFBcUI7YUFDNUM7WUFBQyxXQUFNO2dCQUNKLEtBQUssQ0FBQyxXQUFXLEdBQUcsc0JBQXNCO2FBQzdDO1FBQ0wsQ0FBQztRQXJDRyxJQUFJLGNBQWMsR0FBRztZQUNqQixNQUFNLEVBQUUseUNBQXlDO1lBQ2pELFVBQVUsRUFBRSxzQ0FBc0M7WUFDbEQsV0FBVyxFQUFFLDZDQUE2QztZQUMxRCxTQUFTLEVBQUUsc0JBQXNCO1lBQ2pDLGFBQWEsRUFBRSxrQ0FBa0M7WUFDakQsaUJBQWlCLEVBQUUsY0FBYztZQUNqQyxLQUFLLEVBQUUscUNBQXFDO1NBQy9DO1FBQ0Qsc0JBQXNCO1FBQ3RCLCtDQUFRLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQztRQUN0QyxJQUFJLENBQUMsUUFBUSxHQUFHLCtDQUFRLENBQUMsU0FBUyxFQUFFO1FBQ3BDLCtDQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXRFLGdEQUFPLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3ZDLGdEQUFPLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JDLENBQUM7SUF1QkQsZUFBZSxDQUFDLElBQVM7UUFDckIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN0RCxJQUFJLElBQUksRUFBRTtZQUNOLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRTtpQkFDdEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFO2dCQUNsQixhQUFhLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDbkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2hELENBQUMsQ0FBQztTQUNMO2FBQU07WUFDSCxJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVM7WUFDckIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQztTQUNwQztJQUNMLENBQUM7Q0FLSiIsImZpbGUiOiIuL3NyYy9tYWluL01haW5XaW5kb3cvaW5kZXgudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpcGNNYWluLCBCcm93c2VyV2luZG93LCBCcm93c2VyV2luZG93Q29uc3RydWN0b3JPcHRpb25zIH0gZnJvbSBcImVsZWN0cm9uXCJcclxuaW1wb3J0IGZpcmViYXNlLCB7IGZpcmVzdG9yZSB9IGZyb20gJ2ZpcmViYXNlJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFpbldpbmRvdyBleHRlbmRzIEJyb3dzZXJXaW5kb3cge1xyXG4gICAgZGF0YWJhc2U6IGZpcmVzdG9yZS5GaXJlc3RvcmVcclxuICAgIHRvZG86IGFueVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBCcm93c2VyV2luZG93Q29uc3RydWN0b3JPcHRpb25zKSB7XHJcbiAgICAgICAgc3VwZXIob3B0aW9ucylcclxuXHJcbiAgICAgICAgdmFyIGZpcmViYXNlQ29uZmlnID0ge1xyXG4gICAgICAgICAgICBhcGlLZXk6IFwiQUl6YVN5QlZscG14ajdQR0JPNVRIV3ZCYWdmcTYxMktwaXNtVnZvXCIsXHJcbiAgICAgICAgICAgIGF1dGhEb21haW46IFwiaGVsbG8tZmlyZWJhc2UtMWQ2ZmMuZmlyZWJhc2VhcHAuY29tXCIsXHJcbiAgICAgICAgICAgIGRhdGFiYXNlVVJMOiBcImh0dHBzOi8vaGVsbG8tZmlyZWJhc2UtMWQ2ZmMuZmlyZWJhc2Vpby5jb21cIixcclxuICAgICAgICAgICAgcHJvamVjdElkOiBcImhlbGxvLWZpcmViYXNlLTFkNmZjXCIsXHJcbiAgICAgICAgICAgIHN0b3JhZ2VCdWNrZXQ6IFwiaGVsbG8tZmlyZWJhc2UtMWQ2ZmMuYXBwc3BvdC5jb21cIixcclxuICAgICAgICAgICAgbWVzc2FnaW5nU2VuZGVySWQ6IFwiNzYwNTA3NTg1NDA1XCIsXHJcbiAgICAgICAgICAgIGFwcElkOiBcIjE6NzYwNTA3NTg1NDA1OndlYjo1MjFkZTczMDNhMDdhNzQ5XCJcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gSW5pdGlhbGl6ZSBGaXJlYmFzZVxyXG4gICAgICAgIGZpcmViYXNlLmluaXRpYWxpemVBcHAoZmlyZWJhc2VDb25maWcpXHJcbiAgICAgICAgdGhpcy5kYXRhYmFzZSA9IGZpcmViYXNlLmZpcmVzdG9yZSgpXHJcbiAgICAgICAgZmlyZWJhc2UuYXV0aCgpLm9uQXV0aFN0YXRlQ2hhbmdlZCh1c2VyID0+IHRoaXMuZmV0Y2hDb2xsZWN0aW9uKHVzZXIpKVxyXG5cclxuICAgICAgICBpcGNNYWluLm9uKCdsb2dpbkF1dGgnLCB0aGlzLmxvZ2luQXV0aClcclxuICAgICAgICBpcGNNYWluLm9uKCdsb2dvdXQnLCB0aGlzLmxvZ291dClcclxuICAgIH1cclxuXHJcbiAgICBsb2dpbkF1dGggPSBhc3luYyAoZXZlbnQ6IGFueSwgYXJnOiBhbnkpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZygnbG9naW4gcmVxdWVzdCByZWNlaXZlZCcsIGFyZylcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB2YXIgcmVzID0gYXdhaXQgZmlyZWJhc2UuYXV0aCgpLnNpZ25JbldpdGhFbWFpbEFuZFBhc3N3b3JkKGFyZy5lbWFpbCwgYXJnLnBhc3MpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdsb2dpbiByZXF1ZXN0IGNvbXBsZXRlZCcsIHJlcyAmJiAnIHN1Y2Nlc3NmdWxseScpXHJcbiAgICAgICAgICAgIGV2ZW50LnJldHVyblZhbHVlID0gcmVzLnVzZXIgPyBgV2VsY29tZSAke3Jlcy51c2VyLmVtYWlsfWAgOiBgTG9naW4gVW5zdWNjZXNzZnVsYFxyXG4gICAgICAgIH0gY2F0Y2gge1xyXG4gICAgICAgICAgICBldmVudC5yZXR1cm5WYWx1ZSA9ICdzb21ldGhpbmcgd2VudCB3cm9uZydcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGxvZ291dCA9IGFzeW5jIChldmVudDogYW55LCBhcmc6IGFueSkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGZpcmViYXNlLmF1dGgoKS5zaWduT3V0KClcclxuICAgICAgICAgICAgZXZlbnQucmV0dXJuVmFsdWUgPSAnU2VjdXJlbHkgTG9nZ2VkIG91dCdcclxuICAgICAgICB9IGNhdGNoIHtcclxuICAgICAgICAgICAgZXZlbnQucmV0dXJuVmFsdWUgPSAnc29tZXRoaW5nIHdlbnQgd3JvbmcnXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZldGNoQ29sbGVjdGlvbih1c2VyOiBhbnkpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnZmV0Y2hpbmcgY29sbGVjdGlvbicsIHVzZXIgJiYgdXNlci5lbWFpbClcclxuICAgICAgICBpZiAodXNlcikge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFiYXNlLmNvbGxlY3Rpb24oJ3RvZG9zJykuZ2V0KClcclxuICAgICAgICAgICAgLnRoZW4ocXVlcnlTbmFwc2hvdCA9PiB7XHJcbiAgICAgICAgICAgICAgICBxdWVyeVNuYXBzaG90LmZvckVhY2goZWwgPT4gdGhpcy50b2RvID0gZWwuZGF0YSgpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjb2xsZWN0aW9uIGZldGNoZWQnLCB0aGlzLnRvZG8pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy50b2RvID0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjb2xsZWN0aW9uIGNsZWFyZWQnKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBjb25zb2xlTXNnKG1zZzpzdHJpbmcpIHtcclxuICAgIC8vICAgICB0aGlzLndlYkNvbnRlbnRzLnNlbmQoJ2NvbnNvbGVNc2cnLCBtc2cpXHJcbiAgICAvLyB9XHJcbn0iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/main/MainWindow/index.ts\n");

/***/ }),

/***/ "./src/main/index.ts":
/*!***************************!*\
  !*** ./src/main/index.ts ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! url */ \"url\");\n/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _MainWindow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MainWindow */ \"./src/main/MainWindow/index.ts\");\n\n\n\n\nconst isDevelopment = \"development\" !== 'production';\n// global reference to mainWindow (necessary to prevent window from being garbage collected)\nlet mainWindow;\nfunction createMainWindow() {\n    const window = new _MainWindow__WEBPACK_IMPORTED_MODULE_3__[\"default\"]({ webPreferences: { nodeIntegration: true } });\n    if (isDevelopment) {\n        window.webContents.openDevTools();\n    }\n    if (isDevelopment) {\n        window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);\n    }\n    else {\n        window.loadURL(Object(url__WEBPACK_IMPORTED_MODULE_2__[\"format\"])({\n            pathname: path__WEBPACK_IMPORTED_MODULE_1__[\"join\"](__dirname, 'index.html'),\n            protocol: 'file',\n            slashes: true\n        }));\n    }\n    window.on('closed', () => {\n        mainWindow = null;\n    });\n    window.webContents.on('devtools-opened', () => {\n        window.focus();\n        setImmediate(() => {\n            window.focus();\n        });\n    });\n    return window;\n}\n// quit application when all windows are closed\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].on('window-all-closed', () => {\n    // on macOS it is common for applications to stay open until the user explicitly quits\n    if (process.platform !== 'darwin') {\n        electron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].quit();\n    }\n});\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].on('activate', () => {\n    // on macOS it is common to re-create a window even after all windows have been closed\n    if (mainWindow === null) {\n        mainWindow = createMainWindow();\n    }\n});\n// create main BrowserWindow when electron is ready\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].on('ready', () => {\n    mainWindow = createMainWindow();\n});\n\n/* WEBPACK VAR INJECTION */}.call(this, \"src\\\\main\"))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pbmRleC50cz8wNWI2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBNkM7QUFDakI7QUFDYTtBQUNIO0FBRXRDLE1BQU0sYUFBYSxHQUFHLGFBQW9CLEtBQUssWUFBWTtBQUUzRCw0RkFBNEY7QUFDNUYsSUFBSSxVQUE0QixDQUFDO0FBRWpDLFNBQVMsZ0JBQWdCO0lBQ3JCLE1BQU0sTUFBTSxHQUFHLElBQUksbURBQVUsQ0FBQyxFQUFFLGNBQWMsRUFBRSxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDO0lBRTVFLElBQUksYUFBYSxFQUFFO1FBQ2YsTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUU7S0FDcEM7SUFFRCxJQUFJLGFBQWEsRUFBRTtRQUNmLE1BQU0sQ0FBQyxPQUFPLENBQUMsb0JBQW9CLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLEVBQUUsQ0FBQztLQUM5RTtTQUNJO1FBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxrREFBUyxDQUFDO1lBQ3JCLFFBQVEsRUFBRSx5Q0FBUyxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUM7WUFDNUMsUUFBUSxFQUFFLE1BQU07WUFDaEIsT0FBTyxFQUFFLElBQUk7U0FDaEIsQ0FBQyxDQUFDO0tBQ047SUFFRCxNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7UUFDckIsVUFBVSxHQUFHLElBQUk7SUFDckIsQ0FBQyxDQUFDO0lBRUYsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO1FBQzFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7UUFDZCxZQUFZLENBQUMsR0FBRyxFQUFFO1lBQ2QsTUFBTSxDQUFDLEtBQUssRUFBRTtRQUNsQixDQUFDLENBQUM7SUFDTixDQUFDLENBQUM7SUFFRixPQUFPLE1BQU07QUFDakIsQ0FBQztBQUVELCtDQUErQztBQUMvQyw0Q0FBRyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7SUFDN0Isc0ZBQXNGO0lBQ3RGLElBQUksT0FBTyxDQUFDLFFBQVEsS0FBSyxRQUFRLEVBQUU7UUFDL0IsNENBQUcsQ0FBQyxJQUFJLEVBQUU7S0FDYjtBQUNMLENBQUMsQ0FBQztBQUVGLDRDQUFHLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUU7SUFDcEIsc0ZBQXNGO0lBQ3RGLElBQUksVUFBVSxLQUFLLElBQUksRUFBRTtRQUNyQixVQUFVLEdBQUcsZ0JBQWdCLEVBQUU7S0FDbEM7QUFDTCxDQUFDLENBQUM7QUFFRixtREFBbUQ7QUFDbkQsNENBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtJQUNqQixVQUFVLEdBQUcsZ0JBQWdCLEVBQUU7QUFDbkMsQ0FBQyxDQUFDIiwiZmlsZSI6Ii4vc3JjL21haW4vaW5kZXgudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhcHAsIEJyb3dzZXJXaW5kb3cgfSBmcm9tICdlbGVjdHJvbidcclxuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJ1xyXG5pbXBvcnQgeyBmb3JtYXQgYXMgZm9ybWF0VXJsIH0gZnJvbSAndXJsJ1xyXG5pbXBvcnQgTWFpbldpbmRvdyBmcm9tICcuL01haW5XaW5kb3cnO1xyXG5cclxuY29uc3QgaXNEZXZlbG9wbWVudCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbidcclxuXHJcbi8vIGdsb2JhbCByZWZlcmVuY2UgdG8gbWFpbldpbmRvdyAobmVjZXNzYXJ5IHRvIHByZXZlbnQgd2luZG93IGZyb20gYmVpbmcgZ2FyYmFnZSBjb2xsZWN0ZWQpXHJcbmxldCBtYWluV2luZG93Ok1haW5XaW5kb3cgfCBudWxsO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlTWFpbldpbmRvdygpIHtcclxuICAgIGNvbnN0IHdpbmRvdyA9IG5ldyBNYWluV2luZG93KHsgd2ViUHJlZmVyZW5jZXM6IHsgbm9kZUludGVncmF0aW9uOiB0cnVlIH0gfSlcclxuXHJcbiAgICBpZiAoaXNEZXZlbG9wbWVudCkge1xyXG4gICAgICAgIHdpbmRvdy53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc0RldmVsb3BtZW50KSB7XHJcbiAgICAgICAgd2luZG93LmxvYWRVUkwoYGh0dHA6Ly9sb2NhbGhvc3Q6JHtwcm9jZXNzLmVudi5FTEVDVFJPTl9XRUJQQUNLX1dEU19QT1JUfWApXHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB3aW5kb3cubG9hZFVSTChmb3JtYXRVcmwoe1xyXG4gICAgICAgICAgICBwYXRobmFtZTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2luZGV4Lmh0bWwnKSxcclxuICAgICAgICAgICAgcHJvdG9jb2w6ICdmaWxlJyxcclxuICAgICAgICAgICAgc2xhc2hlczogdHJ1ZVxyXG4gICAgICAgIH0pKVxyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvdy5vbignY2xvc2VkJywgKCkgPT4ge1xyXG4gICAgICAgIG1haW5XaW5kb3cgPSBudWxsXHJcbiAgICB9KVxyXG5cclxuICAgIHdpbmRvdy53ZWJDb250ZW50cy5vbignZGV2dG9vbHMtb3BlbmVkJywgKCkgPT4ge1xyXG4gICAgICAgIHdpbmRvdy5mb2N1cygpXHJcbiAgICAgICAgc2V0SW1tZWRpYXRlKCgpID0+IHtcclxuICAgICAgICAgICAgd2luZG93LmZvY3VzKClcclxuICAgICAgICB9KVxyXG4gICAgfSlcclxuXHJcbiAgICByZXR1cm4gd2luZG93XHJcbn1cclxuXHJcbi8vIHF1aXQgYXBwbGljYXRpb24gd2hlbiBhbGwgd2luZG93cyBhcmUgY2xvc2VkXHJcbmFwcC5vbignd2luZG93LWFsbC1jbG9zZWQnLCAoKSA9PiB7XHJcbiAgICAvLyBvbiBtYWNPUyBpdCBpcyBjb21tb24gZm9yIGFwcGxpY2F0aW9ucyB0byBzdGF5IG9wZW4gdW50aWwgdGhlIHVzZXIgZXhwbGljaXRseSBxdWl0c1xyXG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XHJcbiAgICAgICAgYXBwLnF1aXQoKVxyXG4gICAgfVxyXG59KVxyXG5cclxuYXBwLm9uKCdhY3RpdmF0ZScsICgpID0+IHtcclxuICAgIC8vIG9uIG1hY09TIGl0IGlzIGNvbW1vbiB0byByZS1jcmVhdGUgYSB3aW5kb3cgZXZlbiBhZnRlciBhbGwgd2luZG93cyBoYXZlIGJlZW4gY2xvc2VkXHJcbiAgICBpZiAobWFpbldpbmRvdyA9PT0gbnVsbCkge1xyXG4gICAgICAgIG1haW5XaW5kb3cgPSBjcmVhdGVNYWluV2luZG93KClcclxuICAgIH1cclxufSlcclxuXHJcbi8vIGNyZWF0ZSBtYWluIEJyb3dzZXJXaW5kb3cgd2hlbiBlbGVjdHJvbiBpcyByZWFkeVxyXG5hcHAub24oJ3JlYWR5JywgKCkgPT4ge1xyXG4gICAgbWFpbldpbmRvdyA9IGNyZWF0ZU1haW5XaW5kb3coKVxyXG59KSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/main/index.ts\n");

/***/ }),

/***/ 0:
/*!************************************************************************************************!*\
  !*** multi ./node_modules/electron-webpack/out/electron-main-hmr/main-hmr ./src/main/index.ts ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! C:\Users\micha\Documents\Projects\electron-firebase\node_modules\electron-webpack\out\electron-main-hmr\main-hmr */"./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js");
module.exports = __webpack_require__(/*! C:\Users\micha\Documents\Projects\electron-firebase\src\main\index.ts */"./src/main/index.ts");


/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvblwiPzA0ZjMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiZWxlY3Ryb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron\n");

/***/ }),

/***/ "electron-webpack/out/electron-main-hmr/HmrClient":
/*!*******************************************************************!*\
  !*** external "electron-webpack/out/electron-main-hmr/HmrClient" ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron-webpack/out/electron-main-hmr/HmrClient\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvbi13ZWJwYWNrL291dC9lbGVjdHJvbi1tYWluLWhtci9IbXJDbGllbnRcIj9kZTY3Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6ImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron-webpack/out/electron-main-hmr/HmrClient\n");

/***/ }),

/***/ "firebase":
/*!***************************!*\
  !*** external "firebase" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"firebase\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmaXJlYmFzZVwiPzYyNDIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiZmlyZWJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmaXJlYmFzZVwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///firebase\n");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCI/NzRiYiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJwYXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///path\n");

/***/ }),

/***/ "source-map-support/source-map-support.js":
/*!***********************************************************!*\
  !*** external "source-map-support/source-map-support.js" ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"source-map-support/source-map-support.js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzXCI/OWM1ZiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic291cmNlLW1hcC1zdXBwb3J0L3NvdXJjZS1tYXAtc3VwcG9ydC5qc1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///source-map-support/source-map-support.js\n");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"url\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1cmxcIj82MWU4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6InVybC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInVybFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///url\n");

/***/ })

/******/ });