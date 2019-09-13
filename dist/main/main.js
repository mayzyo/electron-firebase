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
/******/ 	var hotCurrentHash = "a2980544c2dd8017bc96";
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

/***/ "./src/main/core/authentication.ts":
/*!*****************************************!*\
  !*** ./src/main/core/authentication.ts ***!
  \*****************************************/
/*! exports provided: Authentication */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Authentication\", function() { return Authentication; });\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! inversify */ \"inversify\");\n/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var firebase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase */ \"firebase\");\n/* harmony import */ var firebase__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(firebase__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! crypto */ \"crypto\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var electron_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! electron-store */ \"electron-store\");\n/* harmony import */ var electron_store__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(electron_store__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _utilities_types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utilities/types */ \"./src/main/utilities/types.ts\");\nvar __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\n\n\n\n\n\n\nconst SALT = 'salt';\nlet Authentication = class Authentication {\n    constructor() {\n        this.localStorage = new electron_store__WEBPACK_IMPORTED_MODULE_4___default.a();\n        // Initialize Firebase\n        this.firebaseApp = Object(firebase__WEBPACK_IMPORTED_MODULE_2__[\"initializeApp\"])({\n            apiKey: \"AIzaSyBVlpmxj7PGBO5THWvBagfq612KpismVvo\",\n            authDomain: \"hello-firebase-1d6fc.firebaseapp.com\",\n            databaseURL: \"https://hello-firebase-1d6fc.firebaseio.com\",\n            projectId: \"hello-firebase-1d6fc\",\n            storageBucket: \"hello-firebase-1d6fc.appspot.com\",\n            messagingSenderId: \"760507585405\",\n            appId: \"1:760507585405:web:521de7303a07a749\"\n        });\n        // // this.database = firestore()\n        // auth().onAuthStateChanged(user => this.fetchCollection(user))\n    }\n    show() {\n        const storeItem = this.localStorage.get('AUTH');\n        if (storeItem) { // Check for Persisted User\n            const key = crypto__WEBPACK_IMPORTED_MODULE_3___default.a.scryptSync(SALT, SALT, 32);\n            const decipher = crypto__WEBPACK_IMPORTED_MODULE_3___default.a.createDecipheriv('aes-256-cbc', key, Buffer.alloc(16, 0));\n            let decrypted = decipher.update(storeItem, 'hex', 'utf8');\n            decrypted += decipher.final('utf8');\n            return new Promise(async (resolve, reject) => {\n                const form = JSON.parse(decrypted);\n                const res = await this.signin(form.username, form.password);\n                if (typeof res == 'string') { // Account was changed on the server-side\n                    this.localStorage.delete('AUTH');\n                    await this.show();\n                }\n                resolve();\n            });\n        }\n        const authWindow = this.userInterface.createWindow({ width: 400, height: 600, resizable: false });\n        return new Promise((resolve, reject) => {\n            authWindow.configure({ route: 'Auth' }, () => this.onReady(authWindow, resolve));\n        });\n    }\n    async signin(email, password) {\n        let response;\n        try {\n            this.firebaseApp.auth().signInAndRetrieveDataWithCredential;\n            response = await this.firebaseApp.auth().signInWithEmailAndPassword(email, password);\n        }\n        catch (err) {\n            console.error(err);\n            return 'Signin unsuccessful, connection error';\n        }\n        return response.user || 'Signin unsuccessful, email and password mismatch';\n    }\n    async logout() {\n        try {\n            await this.firebaseApp.auth().signOut();\n            this.localStorage.delete('AUTH');\n        }\n        catch (err) {\n            console.error(err);\n            return 'Logout unsuccessful, connection error';\n        }\n        return true;\n    }\n    onReady(window, resolve) {\n        let authing = false;\n        window.once('close', () => authing || electron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].quit());\n        electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].once('AUTHENTICATION', async (event, payload) => {\n            authing = true;\n            window.hide();\n            if (payload) {\n                const res = await this.signin(payload.username, payload.password);\n                if (typeof res != 'string') {\n                    this.persistUser(payload);\n                    window.close();\n                    resolve();\n                }\n                else {\n                    window.show();\n                    this.onReady(window, resolve);\n                }\n            }\n            else {\n                resolve();\n            }\n        });\n    }\n    persistUser(form) {\n        const key = crypto__WEBPACK_IMPORTED_MODULE_3___default.a.scryptSync(SALT, SALT, 32);\n        const cipher = crypto__WEBPACK_IMPORTED_MODULE_3___default.a.createCipheriv('aes-256-cbc', key, Buffer.alloc(16, 0));\n        let encrypted = cipher.update(JSON.stringify(form), 'utf8', 'hex');\n        encrypted = encrypted += cipher.final('hex');\n        console.log('encrypted', encrypted);\n        this.localStorage.set('AUTH', encrypted);\n    }\n};\n__decorate([\n    Object(inversify__WEBPACK_IMPORTED_MODULE_1__[\"inject\"])(_utilities_types__WEBPACK_IMPORTED_MODULE_5__[\"TYPES\"].UserInterface)\n], Authentication.prototype, \"userInterface\", void 0);\nAuthentication = __decorate([\n    Object(inversify__WEBPACK_IMPORTED_MODULE_1__[\"injectable\"])()\n], Authentication);\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9jb3JlL2F1dGhlbnRpY2F0aW9uLnRzPzYyMGUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFxRTtBQUN2QjtBQUMwQjtBQUM3QztBQUNlO0FBQ0E7QUFJMUMsTUFBTSxJQUFJLEdBQUcsTUFBTTtBQVNuQixJQUFhLGNBQWMsR0FBM0IsTUFBYSxjQUFjO0lBTXZCO1FBRlMsaUJBQVksR0FBRyxJQUFJLHFEQUFhLEVBQUU7UUFHdkMsc0JBQXNCO1FBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsOERBQWEsQ0FBQztZQUM3QixNQUFNLEVBQUUseUNBQXlDO1lBQ2pELFVBQVUsRUFBRSxzQ0FBc0M7WUFDbEQsV0FBVyxFQUFFLDZDQUE2QztZQUMxRCxTQUFTLEVBQUUsc0JBQXNCO1lBQ2pDLGFBQWEsRUFBRSxrQ0FBa0M7WUFDakQsaUJBQWlCLEVBQUUsY0FBYztZQUNqQyxLQUFLLEVBQUUscUNBQXFDO1NBQy9DLENBQUM7UUFDRixpQ0FBaUM7UUFDakMsZ0VBQWdFO0lBQ3BFLENBQUM7SUFFRCxJQUFJO1FBQ0EsTUFBTSxTQUFTLEdBQWtCLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUM5RCxJQUFHLFNBQVMsRUFBRSxFQUFFLDJCQUEyQjtZQUN2QyxNQUFNLEdBQUcsR0FBRyw2Q0FBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQztZQUM3QyxNQUFNLFFBQVEsR0FBRyw2Q0FBTSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDakYsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQztZQUN6RCxTQUFTLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFFbkMsT0FBTyxJQUFJLE9BQU8sQ0FBTyxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO2dCQUMvQyxNQUFNLElBQUksR0FBYSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztnQkFDNUMsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFFM0QsSUFBRyxPQUFPLEdBQUcsSUFBSSxRQUFRLEVBQUUsRUFBRSx5Q0FBeUM7b0JBQ2xFLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztvQkFDaEMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFO2lCQUNwQjtnQkFFRCxPQUFPLEVBQUU7WUFDYixDQUFDLENBQUM7U0FDTDtRQUVELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUVqRyxPQUFPLElBQUksT0FBTyxDQUFPLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3pDLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbkYsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBYSxFQUFFLFFBQWdCO1FBQ3hDLElBQUksUUFBNkI7UUFDakMsSUFBSTtZQUNBLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsbUNBQW1DO1lBQzNELFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsMEJBQTBCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQztTQUN2RjtRQUFDLE9BQU0sR0FBRyxFQUFFO1lBQ1QsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7WUFDbEIsT0FBTyx1Q0FBdUM7U0FDakQ7UUFFRCxPQUFPLFFBQVEsQ0FBQyxJQUFJLElBQUksa0RBQWtEO0lBQzlFLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBTTtRQUNSLElBQUk7WUFDQSxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztTQUNuQztRQUFDLE9BQU0sR0FBRyxFQUFFO1lBQ1QsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7WUFDbEIsT0FBTyx1Q0FBdUM7U0FDakQ7UUFFRCxPQUFPLElBQUk7SUFDZixDQUFDO0lBRU8sT0FBTyxDQUFDLE1BQXFCLEVBQUUsT0FBOEI7UUFDakUsSUFBSSxPQUFPLEdBQVksS0FBSztRQUM1QixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLElBQUksNENBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUV6RCxnREFBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBZSxFQUFFLE9BQTZCLEVBQUUsRUFBRTtZQUVwRixPQUFPLEdBQUcsSUFBSTtZQUNkLE1BQU0sQ0FBQyxJQUFJLEVBQUU7WUFFYixJQUFHLE9BQU8sRUFBRTtnQkFDUixNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDO2dCQUNqRSxJQUFHLE9BQU8sR0FBRyxJQUFJLFFBQVEsRUFBRTtvQkFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUM7b0JBQ3pCLE1BQU0sQ0FBQyxLQUFLLEVBQUU7b0JBQ2QsT0FBTyxFQUFFO2lCQUNaO3FCQUFNO29CQUNILE1BQU0sQ0FBQyxJQUFJLEVBQUU7b0JBQ2IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDO2lCQUNoQzthQUNKO2lCQUFNO2dCQUNILE9BQU8sRUFBRTthQUNaO1FBQ0wsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUVPLFdBQVcsQ0FBQyxJQUFjO1FBQzlCLE1BQU0sR0FBRyxHQUFHLDZDQUFNLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDO1FBQzdDLE1BQU0sTUFBTSxHQUFHLDZDQUFNLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDN0UsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUM7UUFDbEUsU0FBUyxHQUFHLFNBQVMsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUU1QyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUM7UUFDbkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQztJQUM1QyxDQUFDO0NBQ0o7QUExR2dDO0lBQTVCLHdEQUFNLENBQUMsc0RBQUssQ0FBQyxhQUFhLENBQUM7cURBQXVDO0FBRjFELGNBQWM7SUFEMUIsNERBQVUsRUFBRTtHQUNBLGNBQWMsQ0E0RzFCO0FBNUcwQiIsImZpbGUiOiIuL3NyYy9tYWluL2NvcmUvYXV0aGVudGljYXRpb24udHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpcGNNYWluLCBCcm93c2VyV2luZG93LCBhcHAgYXMgRWxlY3Ryb25BcHAgfSBmcm9tIFwiZWxlY3Ryb25cIlxyXG5pbXBvcnQgeyBpbmplY3RhYmxlLCBpbmplY3QgfSBmcm9tIFwiaW52ZXJzaWZ5XCJcclxuaW1wb3J0IHsgaW5pdGlhbGl6ZUFwcCwgYXBwIGFzIEZpcmViYXNlQXBwLCBVc2VyLCBhdXRoIH0gZnJvbSAnZmlyZWJhc2UnXHJcbmltcG9ydCBDcnlwdG8gZnJvbSAnY3J5cHRvJ1xyXG5pbXBvcnQgRWxlY3Ryb25TdG9yZSBmcm9tICdlbGVjdHJvbi1zdG9yZSdcclxuaW1wb3J0IHsgVFlQRVMgfSBmcm9tIFwiLi4vdXRpbGl0aWVzL3R5cGVzXCJcclxuaW1wb3J0IEF1dGhGb3JtIGZyb20gXCIuLi8uLi9jb21tb24vYXV0aC1mb3JtXCJcclxuaW1wb3J0IElVc2VySW50ZXJmYWNlLCB7IElwY0V2ZW50IH0gZnJvbSBcIi4vdXNlci1pbnRlcmZhY2VcIlxyXG5cclxuY29uc3QgU0FMVCA9ICdzYWx0J1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIElBdXRoZW50aWNhdGlvbiB7XHJcbiAgICBzaG93KCk6IFByb21pc2U8dm9pZD5cclxuICAgIHNpZ25pbihlbWFpbDogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogUHJvbWlzZTxVc2VyIHwgc3RyaW5nPlxyXG4gICAgbG9nb3V0KCk6IFByb21pc2U8dHJ1ZSB8IHN0cmluZz5cclxufVxyXG5cclxuQGluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQXV0aGVudGljYXRpb24gaW1wbGVtZW50cyBJQXV0aGVudGljYXRpb24ge1xyXG5cclxuICAgIEBpbmplY3QoVFlQRVMuVXNlckludGVyZmFjZSkgcHJpdmF0ZSB1c2VySW50ZXJmYWNlITogSVVzZXJJbnRlcmZhY2VcclxuICAgIHJlYWRvbmx5IGZpcmViYXNlQXBwOiBGaXJlYmFzZUFwcC5BcHBcclxuICAgIHJlYWRvbmx5IGxvY2FsU3RvcmFnZSA9IG5ldyBFbGVjdHJvblN0b3JlKClcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAvLyBJbml0aWFsaXplIEZpcmViYXNlXHJcbiAgICAgICAgdGhpcy5maXJlYmFzZUFwcCA9IGluaXRpYWxpemVBcHAoe1xyXG4gICAgICAgICAgICBhcGlLZXk6IFwiQUl6YVN5QlZscG14ajdQR0JPNVRIV3ZCYWdmcTYxMktwaXNtVnZvXCIsXHJcbiAgICAgICAgICAgIGF1dGhEb21haW46IFwiaGVsbG8tZmlyZWJhc2UtMWQ2ZmMuZmlyZWJhc2VhcHAuY29tXCIsXHJcbiAgICAgICAgICAgIGRhdGFiYXNlVVJMOiBcImh0dHBzOi8vaGVsbG8tZmlyZWJhc2UtMWQ2ZmMuZmlyZWJhc2Vpby5jb21cIixcclxuICAgICAgICAgICAgcHJvamVjdElkOiBcImhlbGxvLWZpcmViYXNlLTFkNmZjXCIsXHJcbiAgICAgICAgICAgIHN0b3JhZ2VCdWNrZXQ6IFwiaGVsbG8tZmlyZWJhc2UtMWQ2ZmMuYXBwc3BvdC5jb21cIixcclxuICAgICAgICAgICAgbWVzc2FnaW5nU2VuZGVySWQ6IFwiNzYwNTA3NTg1NDA1XCIsXHJcbiAgICAgICAgICAgIGFwcElkOiBcIjE6NzYwNTA3NTg1NDA1OndlYjo1MjFkZTczMDNhMDdhNzQ5XCJcclxuICAgICAgICB9KVxyXG4gICAgICAgIC8vIC8vIHRoaXMuZGF0YWJhc2UgPSBmaXJlc3RvcmUoKVxyXG4gICAgICAgIC8vIGF1dGgoKS5vbkF1dGhTdGF0ZUNoYW5nZWQodXNlciA9PiB0aGlzLmZldGNoQ29sbGVjdGlvbih1c2VyKSlcclxuICAgIH1cclxuXHJcbiAgICBzaG93KCkge1xyXG4gICAgICAgIGNvbnN0IHN0b3JlSXRlbTogc3RyaW5nIHwgbnVsbCA9IHRoaXMubG9jYWxTdG9yYWdlLmdldCgnQVVUSCcpXHJcbiAgICAgICAgaWYoc3RvcmVJdGVtKSB7IC8vIENoZWNrIGZvciBQZXJzaXN0ZWQgVXNlclxyXG4gICAgICAgICAgICBjb25zdCBrZXkgPSBDcnlwdG8uc2NyeXB0U3luYyhTQUxULCBTQUxULCAzMilcclxuICAgICAgICAgICAgY29uc3QgZGVjaXBoZXIgPSBDcnlwdG8uY3JlYXRlRGVjaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBrZXksIEJ1ZmZlci5hbGxvYygxNiwgMCkpXHJcbiAgICAgICAgICAgIGxldCBkZWNyeXB0ZWQgPSBkZWNpcGhlci51cGRhdGUoc3RvcmVJdGVtLCAnaGV4JywgJ3V0ZjgnKVxyXG4gICAgICAgICAgICBkZWNyeXB0ZWQgKz0gZGVjaXBoZXIuZmluYWwoJ3V0ZjgnKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZvcm06IEF1dGhGb3JtID0gSlNPTi5wYXJzZShkZWNyeXB0ZWQpXHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCB0aGlzLnNpZ25pbihmb3JtLnVzZXJuYW1lLCBmb3JtLnBhc3N3b3JkKVxyXG5cclxuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiByZXMgPT0gJ3N0cmluZycpIHsgLy8gQWNjb3VudCB3YXMgY2hhbmdlZCBvbiB0aGUgc2VydmVyLXNpZGVcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5kZWxldGUoJ0FVVEgnKVxyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuc2hvdygpXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBhdXRoV2luZG93ID0gdGhpcy51c2VySW50ZXJmYWNlLmNyZWF0ZVdpbmRvdyh7IHdpZHRoOiA0MDAsIGhlaWdodDogNjAwLCByZXNpemFibGU6IGZhbHNlIH0pXHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGF1dGhXaW5kb3cuY29uZmlndXJlKHsgcm91dGU6ICdBdXRoJ30sICgpID0+IHRoaXMub25SZWFkeShhdXRoV2luZG93LCByZXNvbHZlKSlcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHNpZ25pbihlbWFpbDogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IHJlc3BvbnNlOiBhdXRoLlVzZXJDcmVkZW50aWFsXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5maXJlYmFzZUFwcC5hdXRoKCkuc2lnbkluQW5kUmV0cmlldmVEYXRhV2l0aENyZWRlbnRpYWxcclxuICAgICAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmZpcmViYXNlQXBwLmF1dGgoKS5zaWduSW5XaXRoRW1haWxBbmRQYXNzd29yZChlbWFpbCwgcGFzc3dvcmQpXHJcbiAgICAgICAgfSBjYXRjaChlcnIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpXHJcbiAgICAgICAgICAgIHJldHVybiAnU2lnbmluIHVuc3VjY2Vzc2Z1bCwgY29ubmVjdGlvbiBlcnJvcidcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXNwb25zZS51c2VyIHx8ICdTaWduaW4gdW5zdWNjZXNzZnVsLCBlbWFpbCBhbmQgcGFzc3dvcmQgbWlzbWF0Y2gnXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgbG9nb3V0KCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZmlyZWJhc2VBcHAuYXV0aCgpLnNpZ25PdXQoKVxyXG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5kZWxldGUoJ0FVVEgnKVxyXG4gICAgICAgIH0gY2F0Y2goZXJyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxyXG4gICAgICAgICAgICByZXR1cm4gJ0xvZ291dCB1bnN1Y2Nlc3NmdWwsIGNvbm5lY3Rpb24gZXJyb3InXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25SZWFkeSh3aW5kb3c6IEJyb3dzZXJXaW5kb3csIHJlc29sdmU6ICh2YWx1ZT86IGFueSkgPT4gdm9pZCkge1xyXG4gICAgICAgIGxldCBhdXRoaW5nOiBib29sZWFuID0gZmFsc2VcclxuICAgICAgICB3aW5kb3cub25jZSgnY2xvc2UnLCAoKSA9PiBhdXRoaW5nIHx8IEVsZWN0cm9uQXBwLnF1aXQoKSlcclxuICAgICAgICBcclxuICAgICAgICBpcGNNYWluLm9uY2UoJ0FVVEhFTlRJQ0FUSU9OJywgYXN5bmMgKGV2ZW50OiBJcGNFdmVudCwgcGF5bG9hZDogQXV0aEZvcm0gfCB1bmRlZmluZWQpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGF1dGhpbmcgPSB0cnVlXHJcbiAgICAgICAgICAgIHdpbmRvdy5oaWRlKClcclxuXHJcbiAgICAgICAgICAgIGlmKHBheWxvYWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IHRoaXMuc2lnbmluKHBheWxvYWQudXNlcm5hbWUsIHBheWxvYWQucGFzc3dvcmQpXHJcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgcmVzICE9ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wZXJzaXN0VXNlcihwYXlsb2FkKVxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jbG9zZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zaG93KClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUmVhZHkod2luZG93LCByZXNvbHZlKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcGVyc2lzdFVzZXIoZm9ybTogQXV0aEZvcm0pIHsgICAgICAgXHJcbiAgICAgICAgY29uc3Qga2V5ID0gQ3J5cHRvLnNjcnlwdFN5bmMoU0FMVCwgU0FMVCwgMzIpXHJcbiAgICAgICAgY29uc3QgY2lwaGVyID0gQ3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIGtleSwgQnVmZmVyLmFsbG9jKDE2LCAwKSlcclxuICAgICAgICBsZXQgZW5jcnlwdGVkID0gY2lwaGVyLnVwZGF0ZShKU09OLnN0cmluZ2lmeShmb3JtKSwgJ3V0ZjgnLCAnaGV4JylcclxuICAgICAgICBlbmNyeXB0ZWQgPSBlbmNyeXB0ZWQgKz0gY2lwaGVyLmZpbmFsKCdoZXgnKVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygnZW5jcnlwdGVkJywgZW5jcnlwdGVkKVxyXG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNldCgnQVVUSCcsIGVuY3J5cHRlZClcclxuICAgIH1cclxufSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/main/core/authentication.ts\n");

/***/ }),

/***/ "./src/main/core/user-interface.ts":
/*!*****************************************!*\
  !*** ./src/main/core/user-interface.ts ***!
  \*****************************************/
/*! exports provided: UserInterface */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"UserInterface\", function() { return UserInterface; });\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! url */ \"url\");\n/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! inversify */ \"inversify\");\n/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_3__);\nvar __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\n\n\n\n\nconst isDevelopment = \"development\" !== 'production';\nlet UserInterface = class UserInterface {\n    createWindow(options) {\n        let window = new BrowserWindowExtension(Object.assign({ webPreferences: { nodeIntegration: true, enableRemoteModule: false } }, options));\n        window.setMenu(null);\n        if (isDevelopment) {\n            window.webContents.openDevTools();\n            window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);\n        }\n        else {\n            window.loadURL(Object(url__WEBPACK_IMPORTED_MODULE_2__[\"format\"])({\n                pathname: path__WEBPACK_IMPORTED_MODULE_1__[\"join\"](__dirname, 'index.html'),\n                protocol: 'file',\n                slashes: true\n            }));\n        }\n        window.webContents.on('devtools-opened', () => {\n            window.focus();\n            setImmediate(() => {\n                window.focus();\n            });\n        });\n        return window;\n    }\n    closeAll() {\n        electron__WEBPACK_IMPORTED_MODULE_0__[\"BrowserWindow\"].getAllWindows().forEach(el => el.close());\n    }\n};\nUserInterface = __decorate([\n    Object(inversify__WEBPACK_IMPORTED_MODULE_3__[\"injectable\"])()\n], UserInterface);\n\nclass BrowserWindowExtension extends electron__WEBPACK_IMPORTED_MODULE_0__[\"BrowserWindow\"] {\n    constructor(options) {\n        super(options);\n    }\n    configure(options, onReady) {\n        electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].once('READY', (event) => {\n            onReady();\n            event.returnValue = options;\n        });\n    }\n}\n\n/* WEBPACK VAR INJECTION */}.call(this, \"src\\\\main\\\\core\"))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9jb3JlL3VzZXItaW50ZXJmYWNlLnRzPzUyOGIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUErRjtBQUNuRTtBQUNhO0FBQ0g7QUFHdEMsTUFBTSxhQUFhLEdBQUcsYUFBb0IsS0FBSyxZQUFZO0FBTzNELElBQWEsYUFBYSxHQUExQixNQUFhLGFBQWE7SUFFdEIsWUFBWSxDQUFDLE9BQXlDO1FBQ2xELElBQUksTUFBTSxHQUFHLElBQUksc0JBQXNCLGlCQUNuQyxjQUFjLEVBQUUsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBRSxJQUNqRSxPQUFPLEVBQ1o7UUFFRixNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztRQUVwQixJQUFJLGFBQWEsRUFBRTtZQUNmLE1BQU0sQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFO1lBQ2pDLE1BQU0sQ0FBQyxPQUFPLENBQUMsb0JBQW9CLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLEVBQUUsQ0FBQztTQUM5RTthQUNJO1lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxrREFBUyxDQUFDO2dCQUNyQixRQUFRLEVBQUUseUNBQVMsQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDO2dCQUM1QyxRQUFRLEVBQUUsTUFBTTtnQkFDaEIsT0FBTyxFQUFFLElBQUk7YUFDaEIsQ0FBQyxDQUFDO1NBQ047UUFFRCxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7WUFDMUMsTUFBTSxDQUFDLEtBQUssRUFBRTtZQUNkLFlBQVksQ0FBQyxHQUFHLEVBQUU7Z0JBQ2QsTUFBTSxDQUFDLEtBQUssRUFBRTtZQUNsQixDQUFDLENBQUM7UUFDTixDQUFDLENBQUM7UUFFRixPQUFPLE1BQU07SUFDakIsQ0FBQztJQUVELFFBQVE7UUFDSixzREFBYSxDQUFDLGFBQWEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMzRCxDQUFDO0NBQ0o7QUFuQ1ksYUFBYTtJQUR6Qiw0REFBVSxFQUFFO0dBQ0EsYUFBYSxDQW1DekI7QUFuQ3lCO0FBcUMxQixNQUFNLHNCQUF1QixTQUFRLHNEQUFhO0lBRTlDLFlBQVksT0FBcUQ7UUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDO0lBRW5GLENBQUM7SUFFRCxTQUFTLENBQUMsT0FBdUIsRUFBRSxPQUFpQjtRQUNoRCxnREFBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFtQyxFQUFFLEVBQUU7WUFDMUQsT0FBTyxFQUFFO1lBQ1QsS0FBSyxDQUFDLFdBQVcsR0FBRyxPQUFPO1FBQy9CLENBQUMsQ0FBQztJQUNOLENBQUM7Q0FDSiIsImZpbGUiOiIuL3NyYy9tYWluL2NvcmUvdXNlci1pbnRlcmZhY2UudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCcm93c2VyV2luZG93LCBXZWJDb250ZW50cywgQnJvd3NlcldpbmRvd0NvbnN0cnVjdG9yT3B0aW9ucywgaXBjTWFpbiB9IGZyb20gJ2VsZWN0cm9uJ1xyXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnXHJcbmltcG9ydCB7IGZvcm1hdCBhcyBmb3JtYXRVcmwgfSBmcm9tICd1cmwnXHJcbmltcG9ydCB7IGluamVjdGFibGUgfSBmcm9tICdpbnZlcnNpZnknXHJcbmltcG9ydCBSZW5kZXJlck9wdGlvbiBmcm9tICcuLi8uLi9jb21tb24vcmVuZGVyZXItb3B0aW9uJ1xyXG5cclxuY29uc3QgaXNEZXZlbG9wbWVudCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBJVXNlckludGVyZmFjZSB7XHJcbiAgICBjcmVhdGVXaW5kb3cob3B0aW9ucz86IEJyb3dzZXJXaW5kb3dDb25zdHJ1Y3Rvck9wdGlvbnMpOiBCcm93c2VyV2luZG93RXh0ZW5zaW9uXHJcbn1cclxuXHJcbkBpbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFVzZXJJbnRlcmZhY2UgaW1wbGVtZW50cyBJVXNlckludGVyZmFjZSB7XHJcblxyXG4gICAgY3JlYXRlV2luZG93KG9wdGlvbnM/OiBCcm93c2VyV2luZG93Q29uc3RydWN0b3JPcHRpb25zKSB7XHJcbiAgICAgICAgbGV0IHdpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93RXh0ZW5zaW9uKHsgXHJcbiAgICAgICAgICAgIHdlYlByZWZlcmVuY2VzOiB7IG5vZGVJbnRlZ3JhdGlvbjogdHJ1ZSwgZW5hYmxlUmVtb3RlTW9kdWxlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAuLi5vcHRpb25zXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgd2luZG93LnNldE1lbnUobnVsbClcclxuXHJcbiAgICAgICAgaWYgKGlzRGV2ZWxvcG1lbnQpIHtcclxuICAgICAgICAgICAgd2luZG93LndlYkNvbnRlbnRzLm9wZW5EZXZUb29scygpXHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2FkVVJMKGBodHRwOi8vbG9jYWxob3N0OiR7cHJvY2Vzcy5lbnYuRUxFQ1RST05fV0VCUEFDS19XRFNfUE9SVH1gKVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgd2luZG93LmxvYWRVUkwoZm9ybWF0VXJsKHtcclxuICAgICAgICAgICAgICAgIHBhdGhuYW1lOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnaW5kZXguaHRtbCcpLFxyXG4gICAgICAgICAgICAgICAgcHJvdG9jb2w6ICdmaWxlJyxcclxuICAgICAgICAgICAgICAgIHNsYXNoZXM6IHRydWVcclxuICAgICAgICAgICAgfSkpXHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgd2luZG93LndlYkNvbnRlbnRzLm9uKCdkZXZ0b29scy1vcGVuZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5mb2N1cygpXHJcbiAgICAgICAgICAgIHNldEltbWVkaWF0ZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuZm9jdXMoKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICBcclxuICAgICAgICByZXR1cm4gd2luZG93XHJcbiAgICB9XHJcblxyXG4gICAgY2xvc2VBbGwoKSB7XHJcbiAgICAgICAgQnJvd3NlcldpbmRvdy5nZXRBbGxXaW5kb3dzKCkuZm9yRWFjaChlbCA9PiBlbC5jbG9zZSgpKVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBCcm93c2VyV2luZG93RXh0ZW5zaW9uIGV4dGVuZHMgQnJvd3NlcldpbmRvdyB7XHJcblxyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucz86IEJyb3dzZXJXaW5kb3dDb25zdHJ1Y3Rvck9wdGlvbnMgfCB1bmRlZmluZWQpIHsgc3VwZXIob3B0aW9ucylcclxuXHJcbiAgICB9XHJcblxyXG4gICAgY29uZmlndXJlKG9wdGlvbnM6IFJlbmRlcmVyT3B0aW9uLCBvblJlYWR5OiBGdW5jdGlvbikge1xyXG4gICAgICAgIGlwY01haW4ub25jZSgnUkVBRFknLCAoZXZlbnQ6IElwY1N5bmNFdmVudDxSZW5kZXJlck9wdGlvbj4pID0+IHtcclxuICAgICAgICAgICAgb25SZWFkeSgpXHJcbiAgICAgICAgICAgIGV2ZW50LnJldHVyblZhbHVlID0gb3B0aW9uc1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSXBjRXZlbnQge1xyXG4gICAgcHJldmVudERlZmF1bHQ6IEZ1bmN0aW9uXHJcbiAgICBzZW5kZXI6IHsgV2ViQ29udGVudHM6IFdlYkNvbnRlbnRzIH1cclxuICAgIGZyYW1lSWQ6IG51bWJlclxyXG4gICAgcmVwbHk6IEZ1bmN0aW9uXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSXBjU3luY0V2ZW50PFQ+IGV4dGVuZHMgSXBjRXZlbnQge1xyXG4gICAgcmV0dXJuVmFsdWU6IFRcclxufSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/main/core/user-interface.ts\n");

/***/ }),

/***/ "./src/main/index.ts":
/*!***************************!*\
  !*** ./src/main/index.ts ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _utilities_container__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utilities/container */ \"./src/main/utilities/container.ts\");\n/* harmony import */ var _utilities_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utilities/types */ \"./src/main/utilities/types.ts\");\n\n\n\nconst authentication = _utilities_container__WEBPACK_IMPORTED_MODULE_1__[\"default\"].get(_utilities_types__WEBPACK_IMPORTED_MODULE_2__[\"TYPES\"].Authentication);\nconst userInterface = _utilities_container__WEBPACK_IMPORTED_MODULE_1__[\"default\"].get(_utilities_types__WEBPACK_IMPORTED_MODULE_2__[\"TYPES\"].UserInterface);\nlet mainWindow;\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].on('ERROR', (event, args) => {\n    console.log('error', args);\n    if (electron__WEBPACK_IMPORTED_MODULE_0__[\"BrowserWindow\"].getAllWindows().length <= 1) {\n        electron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].quit();\n    }\n    else {\n        electron__WEBPACK_IMPORTED_MODULE_0__[\"BrowserWindow\"].fromWebContents(event.sender.WebContents).close();\n    }\n});\nconst loadMain = () => {\n    const window = userInterface.createWindow({ width: 1100, height: 600 });\n    window.configure({ route: 'Home' }, () => window.once('close', () => electron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].quit()));\n    mainWindow = window;\n    electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].once('LOGOUT', async (event) => {\n        mainWindow = null;\n        window.close();\n        await authentication.logout();\n        await authentication.show();\n        loadMain();\n    });\n};\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].on('activate', async () => {\n    // on macOS it is common to re-create a window even after all windows have been closed\n    if (mainWindow === null) {\n        await authentication.show();\n        loadMain();\n    }\n});\n// create main BrowserWindow when electron is ready\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].on('ready', async () => {\n    await authentication.show();\n    loadMain();\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pbmRleC50cz8wNWI2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBc0Q7QUFDVDtBQUNKO0FBSXpDLE1BQU0sY0FBYyxHQUFHLDREQUFTLENBQUMsR0FBRyxDQUFrQixzREFBSyxDQUFDLGNBQWMsQ0FBQztBQUMzRSxNQUFNLGFBQWEsR0FBRyw0REFBUyxDQUFDLEdBQUcsQ0FBaUIsc0RBQUssQ0FBQyxhQUFhLENBQUM7QUFFeEUsSUFBSSxVQUFnQztBQUVwQyxnREFBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFlLEVBQUUsSUFBeUIsRUFBRSxFQUFFO0lBQy9ELE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQztJQUMxQixJQUFHLHNEQUFhLENBQUMsYUFBYSxFQUFFLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtRQUMxQyw0Q0FBRyxDQUFDLElBQUksRUFBRTtLQUNiO1NBQU07UUFDSCxzREFBYSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssRUFBRTtLQUNsRTtBQUNMLENBQUMsQ0FBQztBQUVGLE1BQU0sUUFBUSxHQUFHLEdBQUcsRUFBRTtJQUNsQixNQUFNLE1BQU0sR0FBRyxhQUFhLENBQUMsWUFBWSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDdkUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyw0Q0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDakYsVUFBVSxHQUFHLE1BQU07SUFDbkIsZ0RBQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxLQUFlLEVBQUUsRUFBRTtRQUM3QyxVQUFVLEdBQUcsSUFBSTtRQUNqQixNQUFNLENBQUMsS0FBSyxFQUFFO1FBQ2QsTUFBTSxjQUFjLENBQUMsTUFBTSxFQUFFO1FBQzdCLE1BQU0sY0FBYyxDQUFDLElBQUksRUFBRTtRQUMzQixRQUFRLEVBQUU7SUFDZCxDQUFDLENBQUM7QUFDTixDQUFDO0FBRUQsNENBQUcsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLEtBQUssSUFBSSxFQUFFO0lBQzFCLHNGQUFzRjtJQUN0RixJQUFJLFVBQVUsS0FBSyxJQUFJLEVBQUU7UUFDckIsTUFBTSxjQUFjLENBQUMsSUFBSSxFQUFFO1FBQzNCLFFBQVEsRUFBRTtLQUNiO0FBQ0wsQ0FBQyxDQUFDO0FBRUYsbURBQW1EO0FBQ25ELDRDQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLElBQUksRUFBRTtJQUN2QixNQUFNLGNBQWMsQ0FBQyxJQUFJLEVBQUU7SUFDM0IsUUFBUSxFQUFFO0FBQ2QsQ0FBQyxDQUFDIiwiZmlsZSI6Ii4vc3JjL21haW4vaW5kZXgudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhcHAsIEJyb3dzZXJXaW5kb3csIGlwY01haW4gfSBmcm9tICdlbGVjdHJvbidcclxuaW1wb3J0IENvbnRhaW5lciBmcm9tIFwiLi91dGlsaXRpZXMvY29udGFpbmVyXCJcclxuaW1wb3J0IHsgVFlQRVMgfSBmcm9tIFwiLi91dGlsaXRpZXMvdHlwZXNcIlxyXG5pbXBvcnQgeyBJQXV0aGVudGljYXRpb24sIElVc2VySW50ZXJmYWNlIH0gZnJvbSAnLi9jb3JlJ1xyXG5pbXBvcnQgeyBJcGNFdmVudCB9IGZyb20gJy4vY29yZS91c2VyLWludGVyZmFjZSdcclxuXHJcbmNvbnN0IGF1dGhlbnRpY2F0aW9uID0gQ29udGFpbmVyLmdldDxJQXV0aGVudGljYXRpb24+KFRZUEVTLkF1dGhlbnRpY2F0aW9uKVxyXG5jb25zdCB1c2VySW50ZXJmYWNlID0gQ29udGFpbmVyLmdldDxJVXNlckludGVyZmFjZT4oVFlQRVMuVXNlckludGVyZmFjZSlcclxuXHJcbmxldCBtYWluV2luZG93OiBCcm93c2VyV2luZG93IHwgbnVsbFxyXG5cclxuaXBjTWFpbi5vbignRVJST1InLCAoZXZlbnQ6IElwY0V2ZW50LCBhcmdzOiB7IG1lc3NhZ2U6IHN0cmluZyB9KSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnZXJyb3InLCBhcmdzKVxyXG4gICAgaWYoQnJvd3NlcldpbmRvdy5nZXRBbGxXaW5kb3dzKCkubGVuZ3RoIDw9IDEpIHtcclxuICAgICAgICBhcHAucXVpdCgpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIEJyb3dzZXJXaW5kb3cuZnJvbVdlYkNvbnRlbnRzKGV2ZW50LnNlbmRlci5XZWJDb250ZW50cykuY2xvc2UoKVxyXG4gICAgfVxyXG59KVxyXG5cclxuY29uc3QgbG9hZE1haW4gPSAoKSA9PiB7XHJcbiAgICBjb25zdCB3aW5kb3cgPSB1c2VySW50ZXJmYWNlLmNyZWF0ZVdpbmRvdyh7IHdpZHRoOiAxMTAwLCBoZWlnaHQ6IDYwMCB9KVxyXG4gICAgd2luZG93LmNvbmZpZ3VyZSh7IHJvdXRlOiAnSG9tZScgfSwgKCkgPT4gd2luZG93Lm9uY2UoJ2Nsb3NlJywgKCkgPT4gYXBwLnF1aXQoKSkpXHJcbiAgICBtYWluV2luZG93ID0gd2luZG93XHJcbiAgICBpcGNNYWluLm9uY2UoJ0xPR09VVCcsIGFzeW5jIChldmVudDogSXBjRXZlbnQpID0+IHtcclxuICAgICAgICBtYWluV2luZG93ID0gbnVsbFxyXG4gICAgICAgIHdpbmRvdy5jbG9zZSgpXHJcbiAgICAgICAgYXdhaXQgYXV0aGVudGljYXRpb24ubG9nb3V0KClcclxuICAgICAgICBhd2FpdCBhdXRoZW50aWNhdGlvbi5zaG93KClcclxuICAgICAgICBsb2FkTWFpbigpXHJcbiAgICB9KVxyXG59XHJcblxyXG5hcHAub24oJ2FjdGl2YXRlJywgYXN5bmMgKCkgPT4ge1xyXG4gICAgLy8gb24gbWFjT1MgaXQgaXMgY29tbW9uIHRvIHJlLWNyZWF0ZSBhIHdpbmRvdyBldmVuIGFmdGVyIGFsbCB3aW5kb3dzIGhhdmUgYmVlbiBjbG9zZWRcclxuICAgIGlmIChtYWluV2luZG93ID09PSBudWxsKSB7XHJcbiAgICAgICAgYXdhaXQgYXV0aGVudGljYXRpb24uc2hvdygpXHJcbiAgICAgICAgbG9hZE1haW4oKVxyXG4gICAgfVxyXG59KVxyXG5cclxuLy8gY3JlYXRlIG1haW4gQnJvd3NlcldpbmRvdyB3aGVuIGVsZWN0cm9uIGlzIHJlYWR5XHJcbmFwcC5vbigncmVhZHknLCBhc3luYyAoKSA9PiB7XHJcbiAgICBhd2FpdCBhdXRoZW50aWNhdGlvbi5zaG93KClcclxuICAgIGxvYWRNYWluKClcclxufSkiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/main/index.ts\n");

/***/ }),

/***/ "./src/main/utilities/container.ts":
/*!*****************************************!*\
  !*** ./src/main/utilities/container.ts ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! inversify */ \"inversify\");\n/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ \"./src/main/utilities/types.ts\");\n/* harmony import */ var _core_authentication__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/authentication */ \"./src/main/core/authentication.ts\");\n/* harmony import */ var _core_user_interface__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/user-interface */ \"./src/main/core/user-interface.ts\");\n\n\n\n\nconst container = new inversify__WEBPACK_IMPORTED_MODULE_0__[\"Container\"]();\n// Core Library\ncontainer.bind(_types__WEBPACK_IMPORTED_MODULE_1__[\"TYPES\"].Authentication).to(_core_authentication__WEBPACK_IMPORTED_MODULE_2__[\"Authentication\"]).inSingletonScope();\ncontainer.bind(_types__WEBPACK_IMPORTED_MODULE_1__[\"TYPES\"].UserInterface).to(_core_user_interface__WEBPACK_IMPORTED_MODULE_3__[\"UserInterface\"]);\n/* harmony default export */ __webpack_exports__[\"default\"] = (container);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi91dGlsaXRpZXMvY29udGFpbmVyLnRzP2Q4MjMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQXFDO0FBQ047QUFDeUM7QUFDRjtBQUV0RSxNQUFNLFNBQVMsR0FBRyxJQUFJLG1EQUFTLEVBQUU7QUFFakMsZUFBZTtBQUNmLFNBQVMsQ0FBQyxJQUFJLENBQWtCLDRDQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLG1FQUFjLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRTtBQUMzRixTQUFTLENBQUMsSUFBSSxDQUFpQiw0Q0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxrRUFBYSxDQUFDO0FBRXRELHdFQUFTIiwiZmlsZSI6Ii4vc3JjL21haW4vdXRpbGl0aWVzL2NvbnRhaW5lci50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gXCJpbnZlcnNpZnlcIlxyXG5pbXBvcnQgeyBUWVBFUyB9IGZyb20gXCIuL3R5cGVzXCJcclxuaW1wb3J0IElBdXRoZW50aWNhdGlvbiwgeyBBdXRoZW50aWNhdGlvbiB9IGZyb20gXCIuLi9jb3JlL2F1dGhlbnRpY2F0aW9uXCJcclxuaW1wb3J0IElVc2VySW50ZXJmYWNlLCB7IFVzZXJJbnRlcmZhY2UgfSBmcm9tIFwiLi4vY29yZS91c2VyLWludGVyZmFjZVwiXHJcblxyXG5jb25zdCBjb250YWluZXIgPSBuZXcgQ29udGFpbmVyKClcclxuXHJcbi8vIENvcmUgTGlicmFyeVxyXG5jb250YWluZXIuYmluZDxJQXV0aGVudGljYXRpb24+KFRZUEVTLkF1dGhlbnRpY2F0aW9uKS50byhBdXRoZW50aWNhdGlvbikuaW5TaW5nbGV0b25TY29wZSgpXHJcbmNvbnRhaW5lci5iaW5kPElVc2VySW50ZXJmYWNlPihUWVBFUy5Vc2VySW50ZXJmYWNlKS50byhVc2VySW50ZXJmYWNlKVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY29udGFpbmVyIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/main/utilities/container.ts\n");

/***/ }),

/***/ "./src/main/utilities/types.ts":
/*!*************************************!*\
  !*** ./src/main/utilities/types.ts ***!
  \*************************************/
/*! exports provided: TYPES */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TYPES\", function() { return TYPES; });\n/* harmony import */ var reflect_metadata__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! reflect-metadata */ \"reflect-metadata\");\n/* harmony import */ var reflect_metadata__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(reflect_metadata__WEBPACK_IMPORTED_MODULE_0__);\n\nconst TYPES = {\n    Authentication: Symbol.for(\"Authentication\"),\n    UserInterface: Symbol.for(\"UserInterface\"),\n};\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi91dGlsaXRpZXMvdHlwZXMudHM/YWYxYSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUF5QjtBQUV6QixNQUFNLEtBQUssR0FBRztJQUNWLGNBQWMsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDO0lBQzVDLGFBQWEsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQztDQUM3QyxDQUFDO0FBRWMiLCJmaWxlIjoiLi9zcmMvbWFpbi91dGlsaXRpZXMvdHlwZXMudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXCJyZWZsZWN0LW1ldGFkYXRhXCJcclxuXHJcbmNvbnN0IFRZUEVTID0ge1xyXG4gICAgQXV0aGVudGljYXRpb246IFN5bWJvbC5mb3IoXCJBdXRoZW50aWNhdGlvblwiKSxcclxuICAgIFVzZXJJbnRlcmZhY2U6IFN5bWJvbC5mb3IoXCJVc2VySW50ZXJmYWNlXCIpLFxyXG59O1xyXG4gXHJcbmV4cG9ydCB7IFRZUEVTIH0iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/main/utilities/types.ts\n");

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

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"crypto\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJjcnlwdG9cIj80Yzc2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6ImNyeXB0by5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNyeXB0b1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///crypto\n");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvblwiPzA0ZjMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiZWxlY3Ryb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron\n");

/***/ }),

/***/ "electron-store":
/*!*********************************!*\
  !*** external "electron-store" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron-store\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvbi1zdG9yZVwiP2NmYzEiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiZWxlY3Ryb24tc3RvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvbi1zdG9yZVwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron-store\n");

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

/***/ "inversify":
/*!****************************!*\
  !*** external "inversify" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"inversify\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJpbnZlcnNpZnlcIj8yYTc3Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6ImludmVyc2lmeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImludmVyc2lmeVwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///inversify\n");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCI/NzRiYiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJwYXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///path\n");

/***/ }),

/***/ "reflect-metadata":
/*!***********************************!*\
  !*** external "reflect-metadata" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"reflect-metadata\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJyZWZsZWN0LW1ldGFkYXRhXCI/MGFiYiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJyZWZsZWN0LW1ldGFkYXRhLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVmbGVjdC1tZXRhZGF0YVwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///reflect-metadata\n");

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