define("environment", ["require", "exports"], function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.default = {
        debug: !1,
        testing: !1,
        gaTrackingId: "UA-100219353-1"
    }
}), define("main", ["require", "exports", "tslib", "aurelia-logging-console", "electron", "./environment", "aurelia-logging"], function(e, t, i, r, o, n, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), Promise.config({
        longStackTraces: n.default.debug,
        warnings: {
            wForgottenReturn: !1
        }
    }), t.configure = function(e) {
        return i.__awaiter(this, void 0, void 0, function() {
            return i.__generator(this, function(t) {
                switch (t.label) {
                    case 0:
                        return console.info("Vantage v" + o.remote.app.getVersion()), e.use.standardConfiguration().feature("resources").feature("editor").plugin("aurelia-dialog", function(e) {
                            e.useDefaults(), e.settings.lock = !1, e.settings.enableEscClose = !0
                        }), e.use.preTask(function() {
                            return a.addAppender(new r.ConsoleAppender), n.default.debug && a.setLevel(a.logLevel.debug), Promise.resolve()
                        }), n.default.testing && e.use.plugin("aurelia-testing"), [4, e.start()];
                    case 1:
                        return t.sent(), e.setRoot("./app/app"), [2]
                }
            })
        })
    }
}), define("app/app", ["require", "exports", "tslib", "../utility/electron", "aurelia-event-aggregator", "../editor/editor-manager", "./install-dialog", "aurelia-dialog", "../utility/config", "../utility/ga", "aurelia-framework", "./routes"], function(e, t, i, r, o, n, a, s, l, c, d, u) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var p = function() {
        function e(e, t, i) {
            this.dialog = e, this.config = t, this.editorManager = i
        }
        return e.prototype.configureRouter = function(e, t) {
            e.title = "Vantage", e.options.root = "/", e.addPipelineStep("postcomplete", h), e.addPipelineStep("preActivate", f), e.map(u.default), e.mapUnknownRoutes("default"), e.fallbackRoute("default"), this.router = t
        }, e.prototype.activate = function() {
            c.reportEvent("App", "Start")
        }, e.prototype.attached = function() {
            return i.__awaiter(this, void 0, void 0, function() {
                var e, t = this;
                return i.__generator(this, function(i) {
                    switch (i.label) {
                        case 0:
                            return [4, this.editorManager.refresh()];
                        case 1:
                            i.sent(), i.label = 2;
                        case 2:
                            return i.trys.push([2, 5, , 6]), [4, this.config.refresh()];
                        case 3:
                            return e = i.sent(), [4, Promise.all(e.officialEditors.map(function(e) {
                                var i = e.indexOf(":");
                                return t.editorManager.install(e.substr(0, i), e.substr(i + 1), !0)
                            }))];
                        case 4:
                            return i.sent(), this.editorManager.editors.filter(function(t) {
                                return t.official && !e.officialEditors.includes(t.provider + ":" + t.locator)
                            }).forEach(function(e) {
                                return t.editorManager.uninstall(e)
                            }), [3, 6];
                        case 5:
                            return i.sent(), [3, 6];
                        case 6:
                            return r.registerUriHandler(function(e) {
                                return t.handleUri(e)
                            }), this.handleUri(r.getLaunchUri()), setInterval(function() {
                                return t.editorManager.checkForUpdates()
                            }, 6e5), this.editorManager.checkForUpdates(), [2]
                    }
                })
            })
        }, e.prototype.handleUri = function(e) {
            if (e && e.startsWith("vantage://")) {
                var t = e.substr("vantage://".length);
                t.startsWith("install/") && this.dialog.open({
                    viewModel: a.InstallDialog,
                    model: t.substr("install/".length)
                })
            }
        }, e = i.__decorate([d.inject(s.DialogService, l.AppConfigService, n.EditorManager), i.__metadata("design:paramtypes", [s.DialogService, l.AppConfigService, n.EditorManager])], e)
    }();
    t.App = p;
    var h = function() {
            function e() {}
            return e.prototype.run = function(e, t) {
                var i = document.querySelector("router-view");
                return i && (i.scrollTop = 0), t()
            }, e
        }(),
        f = function() {
            function e(e) {
                this.ea = e
            }
            return e.prototype.run = function(e, t) {
                return this.ea.publish("router:pipeline:preActivate"), t()
            }, e = i.__decorate([d.inject(o.EventAggregator), i.__metadata("design:paramtypes", [o.EventAggregator])], e)
        }()
}), define("app/install-dialog", ["require", "exports", "tslib", "aurelia-dialog", "aurelia-framework", "aurelia-router", "electron", "../editor/editor-manager", "../utility/dialog"], function(e, t, i, r, o, n, a, s, l) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var c = function() {
        function e(e, t, i) {
            this.controller = e, this.editorManager = t, this.router = i, this.editorPath = [], this.editorUrl = "", this.fetching = !1, this.installing = !1, this.installed = !1
        }
        return e.prototype.activate = function(e) {
            e && this.fetchEditor(e)
        }, e.prototype.fetchEditor = function(e) {
            return i.__awaiter(this, void 0, void 0, function() {
                var t, r, o, n, a, s = this;
                return i.__generator(this, function(i) {
                    switch (i.label) {
                        case 0:
                            if (!(t = e.match(/(^github|npm|disk):(.+)/))) return l.showErrorDialog("Editor paths must start with github: or npm:"), [2];
                            t[0], r = t[1], o = t[2], this.fetching = !0, i.label = 1;
                        case 1:
                            return i.trys.push([1, 5, 6, 7]), (n = this.editorManager.editors.find(function(e) {
                                return e.provider === r && e.locator === o
                            })) ? (this.editor = n, this.installed = !0, [3, 4]) : [3, 2];
                        case 2:
                            return a = this, [4, this.editorManager.fetchEditorInfo(r, o)];
                        case 3:
                            a.editor = i.sent(), this.installed = this.editorManager.editors.some(function(e) {
                                return e.provider === s.editor.provider && e.locator === s.editor.locator
                            }), i.label = 4;
                        case 4:
                            return [3, 7];
                        case 5:
                            return i.sent(), l.showErrorDialog("The editor you want to install could not be found."), [3, 7];
                        case 6:
                            return this.fetching = !1, [7];
                        case 7:
                            return [2]
                    }
                })
            })
        }, e.prototype.installEditor = function(e, t) {
            var i = this;
            this.installing || (this.installing = !0, this.editorManager.install(e, t).then(function(e) {
                i.installing = !1, i.controller.ok(), i.router.navigateToRoute("editor", {
                    id: e.id
                })
            }, function() {
                i.installing = !1, l.showErrorDialog("There was a problem installing the editor.")
            }))
        }, e.prototype.uninstallEditor = function(e) {
            this.installing || (this.editorManager.uninstall(e), this.controller.ok())
        }, e.prototype.installLocalEditor = function() {
            var e = this,
                t = this.editorPath[0].path;
            this.fetching = !0, this.editorManager.fetchEditorInfo("disk", t).then(function(i) {
                e.fetching = !1, e.installEditor("disk", t)
            }, function() {
                l.showErrorDialog('Editor not found or contains invalid metadata. Check the "vantage" property of package.json.'), e.fetching = !1
            })
        }, e.prototype.close = function() {
            this.controller.ok()
        }, e.prototype.openHomepage = function(e) {
            a.remote.shell.openExternal(e.homepage)
        }, e = i.__decorate([o.inject(r.DialogController, s.EditorManager, n.Router), i.__metadata("design:paramtypes", [r.DialogController, s.EditorManager, n.Router])], e)
    }();
    t.InstallDialog = c
}), define("app/routes", ["require", "exports", "aurelia-router"], function(e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.default = [{
        route: "",
        name: "default",
        moduleId: "welcome/welcome"
    }, {
        route: "editor/:id",
        name: "editor",
        moduleId: "editor/editor",
        activationStrategy: i.activationStrategy.replace
    }]
}), define("editor/development", ["require", "exports", "tslib"], function(e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.portInUse = function(e) {
        return i.__awaiter(this, void 0, void 0, function() {
            return i.__generator(this, function(t) {
                return [2, Promise.race([function(e) {
                    return i.__awaiter(this, void 0, void 0, function() {
                        return i.__generator(this, function(t) {
                            switch (t.label) {
                                case 0:
                                    return t.trys.push([0, 2, , 3]), [4, fetch(e)];
                                case 1:
                                    return t.sent(), [2, !0];
                                case 2:
                                    return t.sent(), [2, !1];
                                case 3:
                                    return [2]
                            }
                        })
                    })
                }("http://127.0.0.1:" + e), new Promise(function(e) {
                    return setTimeout(function() {
                        return e(!1)
                    }, 500)
                })])]
            })
        })
    }
}), define("editor/editor-manager", ["require", "exports", "tslib", "../utility/fs", "../environment", "electron", "semver"], function(e, t, i, r, o, n, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var s = function() {
        function e() {
            this.providers = new Map;
            try {
                this.editors = JSON.parse(localStorage.getItem("editors"))
            } catch (e) {}
            Array.isArray(this.editors) || (this.editors = []), this.fixEditorsWithDuplicateIds()
        }
        return e.prototype.fixEditorsWithDuplicateIds = function() {
            for (var e = 1, t = new Set, i = 0, r = this.editors; i < r.length; i++) {
                for (var o = r[i]; t.has(o.id);) o.id = e++;
                t.add(o.id)
            }
        }, e.prototype.parseFullLocator = function(e) {
            var t = e.indexOf(":");
            return [e.substr(0, t), e.substr(t + 1)]
        }, e.prototype.persist = function() {
            localStorage.setItem("editors", JSON.stringify(this.editors))
        }, e.prototype.registerProvider = function(e, t) {
            this.providers.set(e, t)
        }, e.prototype.findEditor = function(e) {
            return this.editors.find(function(t) {
                return t.locator === e
            })
        }, e.prototype.fetchEditorInfo = function(e, t) {
            return i.__awaiter(this, void 0, void 0, function() {
                var r, o;
                return i.__generator(this, function(i) {
                    switch (i.label) {
                        case 0:
                            return o = this.readEditorInfo, [4, this.getProvider(e).fetchPackageInfo(t)];
                        case 1:
                            return (r = o.apply(this, [i.sent()])).provider = e, r.locator = t, [2, r]
                    }
                })
            })
        }, e.prototype.getProvider = function(e) {
            var t = this.providers.get(e);
            if (!t) throw new Error("Unknown provider " + e + ".");
            return t
        }, e.prototype.uninstall = function(e) {
            return i.__awaiter(this, void 0, void 0, function() {
                var t;
                return i.__generator(this, function(i) {
                    switch (i.label) {
                        case 0:
                            if (-1 === (t = this.editors.indexOf(e))) return [2];
                            this.editors.splice(t, 1), this.persist(), window.localStorage.removeItem("editor-history-" + e.id), i.label = 1;
                        case 1:
                            return i.trys.push([1, 3, , 4]), [4, this.destroyBrowserSession(e)];
                        case 2:
                            return i.sent(), [3, 4];
                        case 3:
                            return i.sent(), [3, 4];
                        case 4:
                            return "disk" === e.provider ? [3, 6] : [4, r.deleteDir(e.location)];
                        case 5:
                            i.sent(), i.label = 6;
                        case 6:
                            return [2]
                    }
                })
            })
        }, e.prototype.destroyBrowserSession = function(e) {
            return new Promise(function(t) {
                n.remote.session.fromPartition(e.partition, void 0).clearStorageData(void 0, t)
            })
        }, e.prototype.nextId = function() {
            return this.editors.reduce(function(e, t) {
                return t.id >= e ? t.id + 1 : e
            }, 1)
        }, e.prototype.install = function(e, t, r, o) {
            return void 0 === r && (r = !1), i.__awaiter(this, void 0, void 0, function() {
                var n, a, s, l;
                return i.__generator(this, function(i) {
                    switch (i.label) {
                        case 0:
                            return (n = this.editors.find(function(i) {
                                return i.provider === e && i.locator === t
                            })) ? [2, n] : [4, (a = this.getProvider(e)).fetchEditor(t)];
                        case 1:
                            return s = i.sent(), [4, this.readLocalEditorInfo(s)];
                        case 2:
                            return (l = i.sent()).location = s, l.provider = e, l.locator = t, l.official = r, l.homepage || (l.homepage = a.getUrl(t)), l.partition = "persist:" + e + ":" + t, l.id = o || this.nextId(), this.editors.push(l), this.persist(), [2, l]
                    }
                })
            })
        }, e.prototype.refresh = function() {
            return i.__awaiter(this, void 0, void 0, function() {
                var e, t = this;
                return i.__generator(this, function(r) {
                    switch (r.label) {
                        case 0:
                            return e = this.editors.slice(0), [4, Promise.all(e.map(function(e) {
                                return i.__awaiter(t, void 0, void 0, function() {
                                    var t, r, n, a;
                                    return i.__generator(this, function(i) {
                                        switch (i.label) {
                                            case 0:
                                                return i.trys.push([0, 2, , 3]), r = (t = Object).assign, n = [e], [4, this.readLocalEditorInfo(e.location)];
                                            case 1:
                                                return r.apply(t, n.concat([i.sent()])), e.homepage || (e.homepage = this.getProvider(e.provider).getUrl(e.locator)), e.id || (e.id = this.nextId()), [3, 3];
                                            case 2:
                                                return a = i.sent(), o.default.debug && console.log(a), this.editors.splice(this.editors.indexOf(a), 1), [3, 3];
                                            case 3:
                                                return [2]
                                        }
                                    })
                                })
                            }))];
                        case 1:
                            return r.sent(), this.persist(), [2]
                    }
                })
            })
        }, e.prototype.checkForUpdates = function() {
            return i.__awaiter(this, void 0, void 0, function() {
                var e, t = this;
                return i.__generator(this, function(r) {
                    switch (r.label) {
                        case 0:
                            return e = this.editors.filter(function(e) {
                                return "disk" !== e.provider
                            }), [4, Promise.all(e.map(function(e) {
                                return i.__awaiter(t, void 0, void 0, function() {
                                    var t, r;
                                    return i.__generator(this, function(i) {
                                        switch (i.label) {
                                            case 0:
                                                t = this.getProvider(e.provider), i.label = 1;
                                            case 1:
                                                return i.trys.push([1, 3, , 4]), [4, t.fetchPackageInfo(e.locator)];
                                            case 2:
                                                return r = i.sent(), [3, 4];
                                            case 3:
                                                return i.sent(), [2];
                                            case 4:
                                                return a.gt(r.version, e.version) ? [4, this.uninstall(e)] : [3, 7];
                                            case 5:
                                                return i.sent(), [4, this.install(e.provider, e.locator, e.official, e.id)];
                                            case 6:
                                                i.sent(), i.label = 7;
                                            case 7:
                                                return [2]
                                        }
                                    })
                                })
                            }))];
                        case 1:
                            return r.sent(), [2]
                    }
                })
            })
        }, e.prototype.readLocalEditorInfo = function(e) {
            return i.__awaiter(this, void 0, void 0, function() {
                var t, o, n;
                return i.__generator(this, function(i) {
                    switch (i.label) {
                        case 0:
                            return t = this.readEditorInfo, n = (o = JSON).parse, [4, r.readFile(e + "/package.json", "utf8")];
                        case 1:
                            return [2, t.apply(this, [n.apply(o, [i.sent()])])]
                    }
                })
            })
        }, e.prototype.readEditorInfo = function(e) {
            if (!e.hasOwnProperty("vantage")) throw new Error("Editor metadata not found in package.");
            var t = e.vantage;
            return t.author = t.author || e.author || "Unknown", t.version = t.version || e.version, t.homepage = e.homepage, this.validateEditorInfo(t), delete t.id, delete t.location, delete t.locator, delete t.provider, delete t.partition, t
        }, e.prototype.validateEditorInfo = function(e) {
            this.ensureString(e, "thumbnailUrl"), e.thumbnailUrl.startsWith("https://") || e.thumbnailUrl.startsWith("http://") || this.throwValidationError("thumbnailUrl"), e.homepage && this.ensureString(e, "homepage"), this.ensureString(e, "version"), a.valid(e.version) || this.throwValidationError("version"), this.ensureString(e, "author"), this.ensureString(e, "game"), this.ensureString(e, "name")
        }, e.prototype.ensureString = function(e, t) {
            e && "string" == typeof e[t] || this.throwValidationError(t)
        }, e.prototype.throwValidationError = function(e) {
            throw new Error('Invalid "' + e + '" property in package.')
        }, e
    }();
    t.EditorManager = s
}), define("editor/editor-provider", ["require", "exports"], function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    })
}), define("editor/editor", ["require", "exports", "tslib", "../utility/fs", "../utility/dialog", "./editor-manager", "aurelia-event-aggregator", "aurelia-framework", "../app/install-dialog", "aurelia-dialog", "./development", "aurelia-router", "path"], function(e, t, i, r, o, n, a, s, l, c, d, u, p) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var h = function() {
        function e(e, t, i, r) {
            this.editorManager = e, this.dialogService = t, this.router = i, this.ea = r, this.editorLoaded = !1, this.editorInitialized = !1, this.localDevMode = !1, this.fileSelectorOpen = !1, this.localFiles = []
        }
        return e.prototype.persistLocalHistory = function() {
            localStorage.setItem("editor-history-" + this.editorInfo.id, JSON.stringify(this.localFiles))
        }, e.prototype.attached = function() {
            var e = this;
            this.frame.addEventListener("ipc-message", function(t) {
                "editor" === t.channel && e.handleEditorMessage(t.args.shift(), t.args)
            }), this.frame.addEventListener("dom-ready", function() {
                e.editorInitialized = !1, e.selectedFile = null, e.disableEditor(), "disk" === e.editorInfo.provider && e.frame.getWebContents().openDevTools()
            })
        }, e.prototype.activate = function(e) {
            return i.__awaiter(this, void 0, void 0, function() {
                var t, r;
                return i.__generator(this, function(i) {
                    switch (i.label) {
                        case 0:
                            return this.editorInfo = this.editorManager.editors.find(function(t) {
                                return t.id == e.id
                            }), this.loadLocalHistory(), t = this, (r = "disk" === this.editorInfo.provider) ? [4, d.portInUse(9050)] : [3, 2];
                        case 1:
                            r = i.sent(), i.label = 2;
                        case 2:
                            return t.localDevMode = r, this.localDevMode ? this.editorLocation = "http://127.0.0.1:9050" : this.editorLocation = this.editorInfo.location.replace("#", "%23"), [2]
                    }
                })
            })
        }, e.prototype.loadLocalHistory = function() {
            var e = this;
            try {
                var t = JSON.parse(window.localStorage.getItem("editor-history-" + this.editorInfo.id));
                this.localFiles = t.slice(0), t.forEach(function(t) {
                    return i.__awaiter(e, void 0, void 0, function() {
                        var e, r;
                        return i.__generator(this, function(i) {
                            switch (i.label) {
                                case 0:
                                    return [4, this.getLocalFile(t.path, t.lastUsed)];
                                case 1:
                                    return (e = i.sent()) ? Object.assign(t, e) : -1 !== (r = this.localFiles.indexOf(t)) && this.localFiles.splice(r, 1), [2]
                            }
                        })
                    })
                })
            } catch (e) {
                this.localFiles = []
            }
        }, e.prototype.handleEditorMessage = function(e, t) {
            "initialized" !== e ? "dev-tools" !== e ? this.statusResolve && this.statusReject && ("loaded" === e && "loading" === this.status ? (t[0] ? this.statusReject(t[0]) : this.statusResolve(!0), this.statusResolve = null, this.statusReject = null) : "saved" === e && "saving" === this.status && (!t[0] && t[1] instanceof Uint8Array ? this.statusResolve(Buffer.from(t[1])) : this.statusReject(t[0]), this.statusResolve = null, this.statusReject = null)) : this.frame.getWebContents().openDevTools() : this.editorInitialized = !0
        }, e.prototype.toggleFileSelector = function() {
            this.fileSelectorOpen = !this.fileSelectorOpen
        }, e.prototype.openLocalFile = function() {
            return i.__awaiter(this, void 0, void 0, function() {
                var e, t;
                return i.__generator(this, function(i) {
                    switch (i.label) {
                        case 0:
                            return [4, r.openFileDialog({})];
                        case 1:
                            return (e = i.sent()) && e[0] ? [4, this.getLocalFile(e[0], Date.now())] : [3, 4];
                        case 2:
                            return (t = i.sent()) ? [4, this.loadLocalSave(t)] : [3, 4];
                        case 3:
                            i.sent(), i.label = 4;
                        case 4:
                            return [2]
                    }
                })
            })
        }, e.prototype.getLocalFile = function(e, t) {
            return i.__awaiter(this, void 0, void 0, function() {
                var o;
                return i.__generator(this, function(i) {
                    switch (i.label) {
                        case 0:
                            return i.trys.push([0, 2, , 3]), [4, r.stat(e)];
                        case 1:
                            return o = i.sent(), [2, {
                                path: e,
                                name: p.basename(e),
                                size: o.size,
                                lastUsed: t
                            }];
                        case 2:
                            return i.sent(), [2, null];
                        case 3:
                            return [2]
                    }
                })
            })
        }, e.prototype.loadLocalSave = function(e) {
            return i.__awaiter(this, void 0, void 0, function() {
                return i.__generator(this, function(t) {
                    switch (t.label) {
                        case 0:
                            return [4, this.load(e, function() {
                                return r.readFile(e.path)
                            })];
                        case 1:
                            return t.sent(), this.localFiles = this.localFiles.filter(function(t) {
                                return t.path !== e.path
                            }), e.lastUsed = Date.now(), this.localFiles.push(e), this.persistLocalHistory(), [2]
                    }
                })
            })
        }, e.prototype.load = function(e, t) {
            return i.__awaiter(this, void 0, void 0, function() {
                var r, o = this;
                return i.__generator(this, function(n) {
                    switch (n.label) {
                        case 0:
                            if (this.fileSelectorOpen = !1, this.editorLoaded && this.selectedFile === e) return [2];
                            this.disableEditor(), this.selectedFile = e, n.label = 1;
                        case 1:
                            return n.trys.push([1, 3, , 4]), [4, this.executeWithStatus(function() {
                                return i.__awaiter(o, void 0, void 0, function() {
                                    var e;
                                    return i.__generator(this, function(i) {
                                        switch (i.label) {
                                            case 0:
                                                return e = this.loadSaveIntoEditor, [4, t()];
                                            case 1:
                                                return [4, e.apply(this, [i.sent()])];
                                            case 2:
                                                return i.sent() ? this.enableEditor() : this.selectedFile = null, [2]
                                        }
                                    })
                                })
                            }, "loading")];
                        case 2:
                            return n.sent(), [3, 4];
                        case 3:
                            throw r = n.sent(), this.selectedFile = null, alert("An error occurred while loading your save."), r;
                        case 4:
                            return [2]
                    }
                })
            })
        }, e.prototype.loadSaveIntoEditor = function(e) {
            var t, r = this,
                n = new Promise(function(e, i) {
                    var o = function(e) {
                        return function(i) {
                            clearTimeout(t), e(i)
                        }
                    };
                    r.statusResolve = o(e), r.statusReject = o(i)
                });
            if (!this.localDevMode) {
                var a = function() {
                    return i.__awaiter(r, void 0, void 0, function() {
                        var e;
                        return i.__generator(this, function(i) {
                            switch (i.label) {
                                case 0:
                                    return [4, o.showYesNoDialog("The saved game is taking a while to load. Do you want to cancel?")];
                                case 1:
                                    return (e = i.sent()) && this.statusReject ? this.statusResolve(!1) : e || (t = setTimeout(a, 1e4)), [2]
                            }
                        })
                    })
                };
                t = setTimeout(a, 1e4)
            }
            return this.frame.send("editor", "load", e), n
        }, e.prototype.save = function() {
            return i.__awaiter(this, void 0, void 0, function() {
                return i.__generator(this, function(e) {
                    switch (e.label) {
                        case 0:
                            if (!this.editorLoaded) return [2];
                            if (!this.selectedFile) return [2];
                            this.disableEditor(), e.label = 1;
                        case 1:
                            return e.trys.push([1, , 3, 4]), [4, this.saveLocalSave(this.selectedFile)];
                        case 2:
                            return e.sent(), [3, 4];
                        case 3:
                            return this.enableEditor(), [7];
                        case 4:
                            return [2]
                    }
                })
            })
        }, e.prototype.saveLocalSave = function(e) {
            return i.__awaiter(this, void 0, void 0, function() {
                var t, n;
                return i.__generator(this, function(i) {
                    switch (i.label) {
                        case 0:
                            return i.trys.push([0, 2, , 3]), [4, this.executeWithStatus(this.getBufferFromEditor(), "saving")];
                        case 1:
                            return t = i.sent(), [3, 3];
                        case 2:
                            return i.sent(), o.showErrorDialog("An error occurred while saving your data."), [3, 3];
                        case 3:
                            return i.trys.push([3, 5, , 6]), [4, this.executeWithStatus(r.writeFile(e.path, t), "saving")];
                        case 4:
                            return i.sent(), [3, 6];
                        case 5:
                            throw n = i.sent(), alert("An error occurred while saving your file."), n;
                        case 6:
                            return [2]
                    }
                })
            })
        }, e.prototype.getBufferFromEditor = function() {
            var e = this,
                t = new Promise(function(t, i) {
                    e.statusResolve = t, e.statusReject = i
                });
            return this.frame.send("editor", "save"), t
        }, e.prototype.executeWithStatus = function(e, t) {
            return i.__awaiter(this, void 0, void 0, function() {
                return i.__generator(this, function(i) {
                    switch (i.label) {
                        case 0:
                            if (this.status) return [2, !1];
                            this.status = t, i.label = 1;
                        case 1:
                            return i.trys.push([1, , 6, 7]), e instanceof Promise ? [4, e] : [3, 3];
                        case 2:
                            return [2, i.sent()];
                        case 3:
                            return [4, e()];
                        case 4:
                            return [2, i.sent()];
                        case 5:
                            return [3, 7];
                        case 6:
                            return this.forceClearStatus(), [7];
                        case 7:
                            return [2]
                    }
                })
            })
        }, e.prototype.forceClearStatus = function() {
            this.statusResolve = null, this.statusReject = null, this.status = null
        }, e.prototype.enableEditor = function() {
            this.frame && (this.editorLoaded = !0, this.frame.executeJavaScript('document.body.classList.remove("disabled")', !1))
        }, e.prototype.disableEditor = function() {
            this.editorLoaded = !1, this.frame && this.frame.executeJavaScript('document.body.classList.add("disabled")', !1)
        }, e.prototype.editorFocused = function(e) {
            this.ea.publish("editor-focused", e)
        }, e.prototype.manage = function() {
            return i.__awaiter(this, void 0, void 0, function() {
                var e = this;
                return i.__generator(this, function(t) {
                    switch (t.label) {
                        case 0:
                            return [4, new Promise(function(t, i) {
                                e.dialogService.open({
                                    viewModel: l.InstallDialog,
                                    model: e.editorInfo.provider + ":" + e.editorInfo.locator
                                }).whenClosed(t, i)
                            })];
                        case 1:
                            return t.sent(), this.editorManager.editors.includes(this.editorInfo) || this.router.navigateToRoute("default"), [2]
                    }
                })
            })
        }, e.prototype.clearLocalSaves = function() {
            this.disableEditor(), this.selectedFile = null, this.localFiles = [], this.persistLocalHistory()
        }, e.prototype.removeLocalSave = function(e, t) {
            t.preventDefault(), t.stopPropagation(), this.selectedFile === e && (this.disableEditor(), this.selectedFile = null), this.localFiles.splice(this.localFiles.indexOf(e), 1), this.persistLocalHistory()
        }, e = i.__decorate([s.inject(n.EditorManager, c.DialogService, u.Router, a.EventAggregator), i.__metadata("design:paramtypes", [n.EditorManager, c.DialogService, u.Router, a.EventAggregator])], e)
    }();
    t.Editor = h
}), define("editor/index", ["require", "exports", "tslib", "./providers/github-editor-provider", "./providers/disk-editor-provider", "./providers/npm-editor-provider", "./editor-manager", "../utility/fs", "electron", "path"], function(e, t, i, r, o, n, a, s, l, c) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.configure = function(e) {
        return i.__awaiter(this, void 0, void 0, function() {
            var t, d;
            return i.__generator(this, function(i) {
                switch (i.label) {
                    case 0:
                        return [4, s.makeDir(c.join(l.remote.app.getPath("userData"), "Editors"))];
                    case 1:
                        return t = i.sent(), [4, Promise.all([s.makeDir(c.join(t, "github")), s.makeDir(c.join(t, "npm"))])];
                    case 2:
                        return i.sent(), (d = new a.EditorManager).registerProvider("disk", new o.DiskEditorProvider), d.registerProvider("github", new r.GitHubEditorProvider(c.join(t, "github"))), d.registerProvider("npm", new n.NpmEditorProvider(c.join(t, "npm"))), e.instance(a.EditorManager, d), [2]
                }
            })
        })
    }
}), define("resources/index", ["require", "exports"], function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.configure = function(e) {
        e.globalResources(["./custom-attributes/close-if-click-outside", "./custom-attributes/external-href", "./elements/inline-svg", "./elements/status-ring.html", "./elements/status-tip.html", "./value-converters/env", "./value-converters/array", "./value-converters/number", "./value-converters/object", "./value-converters/string", "./value-converters/time"])
    }
}), define("utility/async", ["require", "exports"], function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.promisifyAll = function(e) {
        return Promise.promisifyAll(e)
    }, t.promisify = function(e) {
        return Promise.promisify(e)
    };
    var i = function() {
        function e(e) {
            var t = this;
            this.resolvers = [], this.rejectors = [], this.resolved = !1, this.rejected = !1, e.then(function(e) {
                if (t.resolved = !0, t.result = e, t.resolvers) {
                    for (var i = 0, r = t.resolvers; i < r.length; i++) {
                        var o = r[i];
                        try {
                            o(e)
                        } catch (e) {
                            console.warn("Uncaught exception thrown in MultiPromise fulfillment handler.", e)
                        }
                    }
                    t.dispose()
                }
            }).catch(function(e) {
                if (t.rejected = !0, t.result = e, t.rejectors) {
                    for (var i = 0, r = t.rejectors; i < r.length; i++) {
                        var o = r[i];
                        try {
                            o(e)
                        } catch (e) {
                            console.warn("Uncaught exception thrown in MultiPromise rejection handler.", e)
                        }
                    }
                    t.dispose()
                }
            })
        }
        return e.wrap = function(t) {
            return new e(t)
        }, e.prototype.await = function() {
            var e = this;
            return this.resolved ? Promise.resolve(this.result) : this.rejected ? Promise.reject(this.result) : new Promise(function(t, i) {
                e.resolvers && e.rejectors && (e.resolvers.push(t), e.rejectors.push(i))
            })
        }, e.prototype.dispose = function() {
            this.resolvers = null, this.rejectors = null
        }, e
    }();
    t.MultiPromise = i
}), define("utility/config", ["require", "exports"], function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = function() {
        function e() {
            this.officialEditors = ["github:vantagemods/gears-of-war-4", "github:unknownv2/vantage-cuphead", "github:unknownv2/vantage-fallout-shelter", "github:unknownv2/vantage-resident-evil-7", "github:unknownv2/vantage-ark-SE"]
        }
        return e.prototype.refresh = function() {
            return Promise.resolve(this)
        }, e
    }();
    t.AppConfigService = i
}), define("utility/dialog", ["require", "exports", "electron"], function(e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.showYesNoDialog = function(e) {
        return new Promise(function(t) {
            i.remote.dialog.showMessageBox(i.remote.getCurrentWindow(), {
                type: "question",
                message: e,
                buttons: ["Yes", "No"]
            }, function(e) {
                return t(0 === e)
            })
        })
    }, t.showErrorDialog = function(e) {
        return new Promise(function(t) {
            i.remote.dialog.showMessageBox(i.remote.getCurrentWindow(), {
                type: "error",
                message: e
            }, function(e) {
                return t()
            })
        })
    }, t.showDialog = function(e, t) {
        return new Promise(function(r) {
            i.remote.dialog.showMessageBox(i.remote.getCurrentWindow(), {
                type: "info",
                message: e,
                buttons: t
            }, r)
        })
    }
}), define("utility/disposable", ["require", "exports"], function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    })
}), define("utility/electron", ["require", "exports", "electron"], function(e, t, i) {
    "use strict";
    var r;

    function o(e) {
        return e.length <= 1 || -1 === e[1].indexOf("://") ? null : e[1].trim()
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), i.ipcRenderer.removeAllListeners("argv"), i.ipcRenderer.addListener("argv", function(e, t) {
        i.remote.getCurrentWindow().isMinimized() && i.remote.getCurrentWindow().restore();
        i.remote.getCurrentWindow().focus();
        var n = o(t);
        n && r && r(n)
    }), t.registerUriHandler = function(e) {
        r = e
    }, t.getLaunchUri = function() {
        return o(i.remote.process.argv)
    }
}), define("utility/fs", ["require", "exports", "tslib", "./async", "electron", "fs", "https", "url", "path"], function(e, t, i, r, o, n, a, s, l) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var c = r.promisifyAll(n);

    function d(e, t) {
        return i.__awaiter(this, void 0, void 0, function() {
            var r, o, n, a = this;
            return i.__generator(this, function(s) {
                switch (s.label) {
                    case 0:
                        return r = [], n = (o = Promise).all, [4, c.readdirAsync(e)];
                    case 1:
                        return [4, n.apply(o, [s.sent().map(function(o) {
                            return i.__awaiter(a, void 0, void 0, function() {
                                return i.__generator(this, function(i) {
                                    switch (i.label) {
                                        case 0:
                                            return [4, c.statAsync(e + "/" + o)];
                                        case 1:
                                            return i.sent()["is" + t]() && r.push(o), [2]
                                    }
                                })
                            })
                        })])];
                    case 2:
                        return s.sent(), [2, r]
                }
            })
        })
    }

    function u(e) {
        return c.statAsync(e)
    }

    function p(e) {
        return c.unlinkAsync(e)
    }
    t.getFilesInDirectory = function(e) {
        return d(e, "File")
    }, t.getSubdirectories = function(e) {
        return d(e, "Directory")
    }, t.stat = u, t.unlink = p, t.makeDir = function e(t) {
        return i.__awaiter(this, void 0, void 0, function() {
            var r;
            return i.__generator(this, function(i) {
                switch (i.label) {
                    case 0:
                        return i.trys.push([0, 2, , 4]), [4, u(t)];
                    case 1:
                        return (r = i.sent()).isDirectory ? [2, t] : [3, 4];
                    case 2:
                        return i.sent(), [4, e(l.dirname(t))];
                    case 3:
                        return i.sent(), [3, 4];
                    case 4:
                        if (r && r.isFile) throw new Error("Path exists as file.");
                        return [4, c.mkdirAsync(t)];
                    case 5:
                        return i.sent(), [2, t]
                }
            })
        })
    }, t.deleteDir = function(e) {
        return i.__awaiter(this, void 0, void 0, function() {
            var t;
            return i.__generator(this, function(r) {
                switch (r.label) {
                    case 0:
                        return r.trys.push([0, 2, , 3]), [4, u(e)];
                    case 1:
                        return t = r.sent(), [3, 3];
                    case 2:
                        return r.sent(), [2];
                    case 3:
                        return t.isDirectory ? [4, function e(t) {
                            return i.__awaiter(this, void 0, void 0, function() {
                                var r, o, n, a, s;
                                return i.__generator(this, function(i) {
                                    switch (i.label) {
                                        case 0:
                                            return [4, c.readdirAsync(t)];
                                        case 1:
                                            r = i.sent(), o = 0, n = r, i.label = 2;
                                        case 2:
                                            return o < n.length ? (a = n[o], [4, u(s = l.join(t, a))]) : [3, 8];
                                        case 3:
                                            return i.sent().isDirectory() ? [4, e(s)] : [3, 5];
                                        case 4:
                                            return i.sent(), [3, 7];
                                        case 5:
                                            return [4, p(s)];
                                        case 6:
                                            i.sent(), i.label = 7;
                                        case 7:
                                            return o++, [3, 2];
                                        case 8:
                                            return [4, c.rmdirAsync(t)];
                                        case 9:
                                            return i.sent(), [2]
                                    }
                                })
                            })
                        }(e)] : [3, 5];
                    case 4:
                        return r.sent(), [3, 7];
                    case 5:
                        return [4, p(e)];
                    case 6:
                        r.sent(), r.label = 7;
                    case 7:
                        return [2]
                }
            })
        })
    }, t.readFile = function(e, t) {
        return c.readFileAsync(e, t)
    }, t.writeFile = function(e, t, i) {
        return c.writeFileAsync(e, t, i)
    }, t.openFileDialog = function(e) {
        return new Promise(function(t) {
            return o.remote.dialog.showOpenDialog(o.remote.getCurrentWindow(), e, t)
        })
    }, t.saveFileDialog = function(e) {
        return new Promise(function(t) {
            return o.remote.dialog.showSaveDialog(o.remote.getCurrentWindow(), e, t)
        })
    }, t.downloadFile = function e(t, r) {
        var o = this;
        return new Promise(function(n, l) {
            var d = "string" == typeof r ? c.createWriteStream(r) : r,
                u = s.parse(t);
            a.get({
                protocol: u.protocol,
                host: u.host,
                path: u.path,
                headers: {
                    "User-Agent": "Vantage"
                }
            }, function(t) {
                return i.__awaiter(o, void 0, void 0, function() {
                    var r, o;
                    return i.__generator(this, function(i) {
                        switch (i.label) {
                            case 0:
                                if (302 !== t.statusCode) return [3, 5];
                                i.label = 1;
                            case 1:
                                return i.trys.push([1, 3, , 4]), r = n, [4, e(t.headers.location, d)];
                            case 2:
                                return r.apply(void 0, [i.sent()]), [3, 4];
                            case 3:
                                return o = i.sent(), l(o), [3, 4];
                            case 4:
                                return [2];
                            case 5:
                                return 200 !== t.statusCode ? (l(t), t.destroy(), [2]) : (t.pipe(d), d.on("finish", function() {
                                    return d.close(n)
                                }), [2])
                        }
                    })
                })
            }).on("error", function(e) {
                c.unlink(r), l(e)
            })
        })
    }
}), define("utility/ga", ["require", "exports", "tslib", "aurelia-fetch-client", "../environment", "electron", "./uuid", "aurelia-path"], function(e, t, i, r, o, n, a, s) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var l, c = "1",
        d = new r.HttpClient;

    function u(e) {
        return i.__awaiter(this, void 0, void 0, function() {
            return i.__generator(this, function(t) {
                switch (t.label) {
                    case 0:
                        if (!o.default.gaTrackingId) return [2];
                        e = Object.assign({
                            v: c,
                            tid: o.default.gaTrackingId,
                            cid: (i = localStorage.getItem("gaClientId"), i || (i = a.v4(), localStorage.setItem("gaClientId", i)), i),
                            an: "Vantage",
                            av: n.remote.app.getVersion(),
                            sr: screen.width + "x" + screen.height,
                            vp: screen.availWidth + "x" + screen.availHeight,
                            sd: screen.colorDepth + "-bits",
                            ua: navigator.userAgent,
                            ds: "app"
                        }, e), t.label = 1;
                    case 1:
                        return t.trys.push([1, 3, , 4]), [4, d.fetch("/collect", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            body: s.buildQueryString(e),
                            cache: "no-cache"
                        })];
                    case 2:
                        return t.sent(), [3, 4];
                    case 3:
                        return t.sent(), [3, 4];
                    case 4:
                        return [2]
                }
                var i
            })
        })
    }
    d.baseUrl = "https://www.google-analytics.com", o.default.debug && (d.baseUrl += "/debug"), t.reportEvent = function(e, t, i, r) {
        return u({
            t: "event",
            ec: e,
            ea: t,
            el: i,
            ev: r,
            cd: l
        })
    }, t.reportScreen = function(e) {
        return l = e, u({
            t: "screenview",
            cd: e
        })
    }
}), define("utility/uuid", ["require", "exports", "crypto"], function(e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    for (var r = [], o = 0; o < 256; o++) r[o] = (o + 256).toString(16).substr(1);
    t.v4 = function(e) {
        var t, o, n = ((e = e || {}).rng || function() {
            return i.randomBytes(20)
        })();
        return n[6] = 15 & n[6] | 64, n[8] = 63 & n[8] | 128, e.binary ? n : (o = 0, r[(t = n)[o++]] + r[t[o++]] + r[t[o++]] + r[t[o++]] + "-" + r[t[o++]] + r[t[o++]] + "-" + r[t[o++]] + r[t[o++]] + "-" + r[t[o++]] + r[t[o++]] + "-" + r[t[o++]] + r[t[o++]] + r[t[o++]] + r[t[o++]] + r[t[o++]] + r[t[o++]])
    }, t.validateUuid = function(e) {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(e)
    }
}), define("welcome/welcome", ["require", "exports"], function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = function() {
        return function() {}
    }();
    t.Welcome = i
}), define("editor/providers/disk-editor-provider", ["require", "exports", "tslib", "../../utility/fs"], function(e, t, i, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var o = function() {
        function e() {}
        return e.prototype.getUrl = function(e) {
            return e
        }, e.prototype.fetchPackageInfo = function(e) {
            return i.__awaiter(this, void 0, void 0, function() {
                var t, o;
                return i.__generator(this, function(i) {
                    switch (i.label) {
                        case 0:
                            return o = (t = JSON).parse, [4, r.readFile(e + "/package.json", "utf8")];
                        case 1:
                            return [2, o.apply(t, [i.sent()])]
                    }
                })
            })
        }, e.prototype.fetchEditor = function(e) {
            return i.__awaiter(this, void 0, void 0, function() {
                return i.__generator(this, function(t) {
                    return [2, e]
                })
            })
        }, e
    }();
    t.DiskEditorProvider = o
}), define("editor/providers/github-editor-provider", ["require", "exports", "tslib", "../../utility/async", "../../utility/fs", "aurelia-fetch-client", "yauzl", "path", "os", "fs"], function(e, t, i, r, o, n, a, s, l, c) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var d = 0,
        u = function() {
            function e(e) {
                this.cacheDir = e, this.http = (new n.HttpClient).configure(function(e) {
                    e.rejectErrorResponses().withBaseUrl("https://api.github.com").withDefaults({
                        headers: {
                            Accept: "application/vnd.github.v3+json"
                        }
                    })
                })
            }
            return e.prototype.checkFormat = function(e) {
                return /[a-z0-9_\-]+\/[a-z0-9_\-]+#?[a-z0-9_\-]+/.test(e)
            }, e.prototype.fetchPackageInfo = function(e) {
                return i.__awaiter(this, void 0, void 0, function() {
                    var t, r, o, n, a;
                    return i.__generator(this, function(i) {
                        switch (i.label) {
                            case 0:
                                return (t = this.getRepoAndTag(e)).tag ? [3, 2] : (r = t, [4, this.getRelease(e)]);
                            case 1:
                                r.tag = i.sent().tag_name, i.label = 2;
                            case 2:
                                return n = (o = JSON).parse, a = atob, [4, this.get("/repos/" + t.repo + "/contents/package.json?ref=" + encodeURIComponent(t.tag))];
                            case 3:
                                return [2, n.apply(o, [a.apply(void 0, [i.sent().content])])]
                        }
                    })
                })
            }, e.prototype.fetchEditor = function(e) {
                return i.__awaiter(this, void 0, void 0, function() {
                    var t, n, l, d, u = this;
                    return i.__generator(this, function(p) {
                        switch (p.label) {
                            case 0:
                                return t = s.join(this.cacheDir, e), [4, Promise.all([this.getRelease(e), o.deleteDir(t)])];
                            case 1:
                                return n = p.sent()[0], l = this.getTempDownloadPath(), [4, o.downloadFile(n.zipball_url, l)];
                            case 2:
                                p.sent(), p.label = 3;
                            case 3:
                                return p.trys.push([3, 5, 7, 8]), [4, new Promise(function(e, n) {
                                    return i.__awaiter(u, void 0, void 0, function() {
                                        var n, d, u = this;
                                        return i.__generator(this, function(p) {
                                            switch (p.label) {
                                                case 0:
                                                    return [4, r.promisify(a.open)(l, {
                                                        lazyEntries: !0
                                                    })];
                                                case 1:
                                                    return n = p.sent(), d = r.promisify(n.openReadStream.bind(n)), n.readEntry(), n.on("entry", function(e) {
                                                        return i.__awaiter(u, void 0, void 0, function() {
                                                            var r, a;
                                                            return i.__generator(this, function(i) {
                                                                switch (i.label) {
                                                                    case 0:
                                                                        return e.fileName.endsWith("/") ? (n.readEntry(), [3, 4]) : [3, 1];
                                                                    case 1:
                                                                        return r = s.join(t, e.fileName.substr(e.fileName.indexOf("/") + 1)), [4, o.makeDir(s.dirname(r))];
                                                                    case 2:
                                                                        return i.sent(), [4, d(e)];
                                                                    case 3:
                                                                        (a = i.sent()).on("end", function() {
                                                                            return n.readEntry()
                                                                        }), a.pipe(c.createWriteStream(r)), i.label = 4;
                                                                    case 4:
                                                                        return [2]
                                                                }
                                                            })
                                                        })
                                                    }), n.on("end", function() {
                                                        return e(t)
                                                    }), [2]
                                            }
                                        })
                                    })
                                })];
                            case 4:
                                return [2, p.sent()];
                            case 5:
                                return d = p.sent(), [4, o.deleteDir(t)];
                            case 6:
                                throw p.sent(), d;
                            case 7:
                                return o.unlink(l), [7];
                            case 8:
                                return [2]
                        }
                    })
                })
            }, e.prototype.getRelease = function(e) {
                var t = this.getRepoAndTag(e),
                    i = "/repos/" + t.repo + "/releases/" + (t.tag ? "tags/" + t.tag : "latest");
                return this.get(i)
            }, e.prototype.getUrl = function(e) {
                return "https://github.com/" + this.getRepoAndTag(e).repo
            }, e.prototype.getRepoAndTag = function(e) {
                var t = e.split("#");
                return {
                    repo: t[0],
                    tag: t[1] || void 0
                }
            }, e.prototype.getTempDownloadPath = function() {
                return s.join(l.tmpdir(), "vantage-editor-" + Date.now() + "-" + d++ + ".zip")
            }, e.prototype.get = function(e) {
                return i.__awaiter(this, void 0, void 0, function() {
                    return i.__generator(this, function(t) {
                        switch (t.label) {
                            case 0:
                                return [4, this.http.fetch(e)];
                            case 1:
                                return [4, t.sent().json()];
                            case 2:
                                return [2, t.sent()]
                        }
                    })
                })
            }, e
        }();
    t.GitHubEditorProvider = u
}), define("editor/providers/npm-editor-provider", ["require", "exports", "tslib", "../../utility/fs", "aurelia-fetch-client", "../../utility/async", "tarball-extract", "semver", "path", "os"], function(e, t, i, r, o, n, a, s, l, c) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var d = 0,
        u = function() {
            function e(e) {
                this.cacheDir = e, this.http = (new o.HttpClient).configure(function(e) {
                    e.rejectErrorResponses().withBaseUrl("https://registry.npmjs.org").withDefaults({
                        headers: {
                            Accept: "application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*"
                        }
                    })
                })
            }
            return e.prototype.fetchEditor = function(e) {
                return i.__awaiter(this, void 0, void 0, function() {
                    var t, o, s, c;
                    return i.__generator(this, function(i) {
                        switch (i.label) {
                            case 0:
                                return t = l.join(this.cacheDir, e), [4, Promise.all([this.fetchPackageInfo(e), r.deleteDir(t)])];
                            case 1:
                                return o = i.sent()[0], [4, r.makeDir(t)];
                            case 2:
                                i.sent(), s = this.getTempDownloadPath(), i.label = 3;
                            case 3:
                                return i.trys.push([3, 5, 7, 8]), [4, n.promisify(a.extractTarballDownload)(o.dist.tarball, s, t, {})];
                            case 4:
                                return i.sent(), [3, 8];
                            case 5:
                                return c = i.sent(), [4, r.deleteDir(t)];
                            case 6:
                                throw i.sent(), c;
                            case 7:
                                return r.unlink(s), [7];
                            case 8:
                                return [2, l.join(t, "package")]
                        }
                    })
                })
            }, e.prototype.fetchPackageInfo = function(e) {
                return i.__awaiter(this, void 0, void 0, function() {
                    var t;
                    return i.__generator(this, function(i) {
                        switch (i.label) {
                            case 0:
                                return [4, this.get(this.getPackageUrl(this.parseLocator(e)))];
                            case 1:
                                return (t = i.sent()).author = t.author.name, [2, t]
                        }
                    })
                })
            }, e.prototype.getPackageUrl = function(e) {
                return "/" + encodeURIComponent((e.org ? "@" + e.org + "/" : "") + e.name) + "/" + encodeURIComponent(e.version || "latest")
            }, e.prototype.parseLocator = function(e) {
                var t, i;
                if (e.startsWith("@")) {
                    var r = e.split("/");
                    2 !== r.length && this.throwPackageNameError(), t = r[0], e = r[1], t && /^[-_a-z0-9]+$/.test(t) || this.throwPackageNameError()
                }
                var o = e.split("@");
                2 === o.length ? (i = o[1], s.valid(i) || this.throwPackageNameError()) : o.length > 2 && this.throwPackageNameError();
                var n = o[0];
                return n && /^[-_a-z0-9]+$/.test(n) || this.throwPackageNameError(), {
                    org: t,
                    name: n,
                    version: i
                }
            }, e.prototype.getUrl = function(e) {
                var t = this.parseLocator(e);
                return "https://npmjs.com/packages/" + (t.org ? "@" + t.org + "/" : "") + t.name
            }, e.prototype.get = function(e) {
                return i.__awaiter(this, void 0, void 0, function() {
                    return i.__generator(this, function(t) {
                        switch (t.label) {
                            case 0:
                                return [4, this.http.fetch(e)];
                            case 1:
                                return [4, t.sent().json()];
                            case 2:
                                return [2, t.sent()]
                        }
                    })
                })
            }, e.prototype.throwPackageNameError = function() {
                throw new Error("Invalid npm package name.")
            }, e.prototype.getTempDownloadPath = function() {
                return l.join(c.tmpdir(), "vantage-editor-" + Date.now() + "-" + d++ + ".tar.gz")
            }, e
        }();
    t.NpmEditorProvider = u
}), define("resources/custom-attributes/close-if-click-outside", ["require", "exports", "tslib", "aurelia-event-aggregator", "aurelia-framework", "aurelia-dialog"], function(e, t, i, r, o, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var a = function() {
        function e(e, t, i) {
            this.element = e, this.dialogService = t, this.ea = i, this.closeIfClickOutside = this.closeIfClickOutside.bind(this)
        }
        return e.prototype.unbind = function() {
            this.editorListener && (this.editorListener.dispose(), this.editorListener = null), document.removeEventListener("click", this.closeIfClickOutside)
        }, e.prototype.valueChanged = function() {
            this.value ? (this.editorListener = this.ea.subscribe("editor-focused", this.closeIfClickOutside), document.addEventListener("click", this.closeIfClickOutside)) : this.unbind()
        }, e.prototype.closeIfClickOutside = function(e) {
            if (!this.dialogService.hasActiveDialog && !this.element.contains(e.target)) {
                for (var t = e.target; t.parentNode;)
                    if (11 == (t = t.parentNode).nodeType) return;
                this.value = !1
            }
        }, e = i.__decorate([o.inject(Element, n.DialogService, r.EventAggregator), o.noView, i.__metadata("design:paramtypes", [Element, n.DialogService, r.EventAggregator])], e)
    }();
    t.CloseIfClickOutsideCustomAttribute = a
}), define("resources/custom-attributes/external-href", ["require", "exports", "tslib", "aurelia-framework", "electron"], function(e, t, i, r, o) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n = function() {
        function e(e) {
            var t = this;
            this.element = e, this.onClick = function(e) {
                return e.preventDefault(), o.remote.shell.openExternal(t.value), !1
            }
        }
        return e.prototype.attached = function() {
            this.element.addEventListener("click", this.onClick)
        }, e.prototype.detached = function() {
            this.element.removeEventListener("click", this.onClick)
        }, e = i.__decorate([r.inject(Element), r.noView, i.__metadata("design:paramtypes", [Element])], e)
    }();
    t.ExternalHrefCustomAttribute = n
}), define("resources/elements/inline-svg", ["require", "exports", "tslib", "aurelia-framework", "aurelia-http-client", "../../utility/async"], function(e, t, i, r, o, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var a = new Map,
        s = new Map,
        l = function() {
            function e(e, t) {
                this.el = e, this.http = t, this.isAttached = !1
            }
            return e.prototype.attached = function() {
                var e = this;
                if (this.isAttached = !0, this.src) {
                    var t = s.get(this.src);
                    if (t) return t.await().then(function() {
                        return e.setDomIfAttached(e.src)
                    });
                    this.setDomIfAttached(this.src)
                }
            }, e.prototype.detached = function() {
                this.isAttached = !1
            }, e.prototype.setDomIfAttached = function(e) {
                var t = this.el.parentNode;
                this.isAttached && t && (t.innerHTML = a.get(e) || "")
            }, e.prototype.isPathAbsolute = function(e) {
                return e.startsWith("https://") || e.startsWith("http://") || e.startsWith("file://") || e.startsWith("/")
            }, e.prototype.srcChanged = function(e) {
                if (e)
                    if (a.has(e)) this.setDomIfAttached(e);
                    else if (!s.has(e)) {
                    var t = this.isPathAbsolute(e) ? e : "static/images/" + e;
                    s.set(e, new n.MultiPromise(this.http.createRequest(t).asGet().withResponseType("text").send().then(function(t) {
                        s.delete(e), t.isSuccess && a.set(e, t.content)
                    })))
                }
            }, i.__decorate([r.bindable, i.__metadata("design:type", String)], e.prototype, "src", void 0), e = i.__decorate([r.containerless(), r.inlineView("<template></template>"), r.customElement("inline-svg"), r.inject(Element, o.HttpClient), i.__metadata("design:paramtypes", [HTMLElement, o.HttpClient])], e)
        }();
    t.InlineSvgCustomElement = l
}), define("resources/elements/number-input", ["require", "exports", "tslib", "aurelia-framework"], function(e, t, i, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var o = function() {
        function e() {}
        return e.prototype.matchPrecision = function(e, t) {
            var i = (e.toString().split(".")[1] || []).length;
            return i > 0 ? parseFloat(t.toPrecision(i)) : t
        }, e.prototype.add = function() {
            this.value = parseFloat(this.value.toString()), this.value += this.step, this.value = this.matchPrecision(this.step, this.value), this.value > this.max && (this.value = this.max)
        }, e.prototype.subtract = function() {
            this.value = parseFloat(this.value.toString()), this.value -= this.step, this.value = this.matchPrecision(this.step, this.value), this.value < this.min && (this.value = this.min)
        }, i.__decorate([r.bindable, i.__metadata("design:type", Number)], e.prototype, "value", void 0), i.__decorate([r.bindable, i.__metadata("design:type", Number)], e.prototype, "min", void 0), i.__decorate([r.bindable, i.__metadata("design:type", Number)], e.prototype, "max", void 0), i.__decorate([r.bindable, i.__metadata("design:type", Number)], e.prototype, "step", void 0), i.__decorate([r.bindable, i.__metadata("design:type", Boolean)], e.prototype, "disabled", void 0), e
    }();
    t.NumberInput = o
}), define("resources/elements/selection-input", ["require", "exports", "tslib", "aurelia-framework"], function(e, t, i, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var o = function() {
        function e(e) {
            this.element = e, this.opened = !1, this.closeIfClickOutside = this.closeIfClickOutside.bind(this)
        }
        return e.prototype.open = function() {
            this.opened = !0, document.addEventListener("click", this.closeIfClickOutside)
        }, e.prototype.close = function() {
            this.opened = !1, document.removeEventListener("click", this.closeIfClickOutside)
        }, e.prototype.closeIfClickOutside = function(e) {
            this.element.contains(e.target) || this.close()
        }, e.prototype.setValue = function(e) {
            this.value = e, this.opened = !1
        }, e.prototype.detached = function() {
            this.close()
        }, i.__decorate([r.bindable, i.__metadata("design:type", String)], e.prototype, "value", void 0), i.__decorate([r.bindable, i.__metadata("design:type", Array)], e.prototype, "options", void 0), i.__decorate([r.bindable, i.__metadata("design:type", Boolean)], e.prototype, "disabled", void 0), e = i.__decorate([r.inject(Element), i.__metadata("design:paramtypes", [HTMLElement])], e)
    }();
    t.SelectionInput = o
}), define("resources/value-converters/array", ["require", "exports"], function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = function() {
        function e() {}
        return e.prototype.toView = function(e, t, i) {
            return e ? e.map(function(e) {
                return e.hasOwnProperty(t) ? e[t] : i
            }) : []
        }, e
    }();
    t.PluckValueConverter = i;
    var r = function() {
        function e() {}
        return e.prototype.toView = function(e, t) {
            return e && 0 != e.length ? e.slice(0, t) : []
        }, e
    }();
    t.TakeValueConverter = r;
    var o = function() {
        function e() {}
        return e.prototype.toView = function(e, t) {
            return e && 0 !== e.length ? t ? "number" == typeof e[0][t] ? e.sort(function(e, i) {
                return e[t] > i[t] ? 1 : e[t] < i[t] ? -1 : 0
            }) : e.sort(function(e, i) {
                return e[t] && i[t] ? e[t].toString().localeCompare(i[t].toString()) : 0
            }) : e.sort() : []
        }, e
    }();
    t.SortValueConverter = o;
    var n = function() {
        function e() {}
        return e.prototype.toView = function(e) {
            return e && e.slice(0).reverse()
        }, e
    }();
    t.ReverseValueConverter = n;
    var a = function() {
        function e() {}
        return e.prototype.toView = function(e, t) {
            return void 0 === t && (t = ","), e ? e.join(t).replace(/\r/g, "") : ""
        }, e.prototype.fromView = function(e, t) {
            return void 0 === t && (t = ","), e ? e.replace(/\r/g, "").split(t) : []
        }, e
    }();
    t.StringArrayValueConverter = a
}), define("resources/value-converters/env", ["require", "exports", "../../environment"], function(e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var r = function() {
        function e() {}
        return e.prototype.toView = function(e, t, r) {
            var o = !!i.default[e];
            return void 0 === t ? o : o ? t : r
        }, e
    }();
    t.EnvValueConverter = r
}), define("resources/value-converters/number", ["require", "exports"], function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = function() {
        function e() {}
        return e.prototype.toView = function(e) {
            return e.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,")
        }, e.prototype.fromView = function(e) {
            return parseFloat(e.replace(/,/, ""))
        }, e
    }();
    t.NumberWithCommasValueConverter = i;
    var r = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        o = function() {
            function e() {}
            return e.prototype.toView = function(e, t) {
                if (void 0 === t && (t = 2), 0 === e) return "0 " + r[0];
                var i = Math.floor(Math.log(e) / Math.log(1024));
                return parseFloat((e / Math.pow(1024, i)).toFixed(t)) + " " + r[i]
            }, e
        }();
    t.ByteFormatValueConverter = o
}), define("resources/value-converters/object", ["require", "exports"], function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = function() {
        function e() {}
        return e.prototype.toView = function(e) {
            return e ? Object.getOwnPropertyNames(e).filter(function(e) {
                return !e.startsWith("__")
            }) : []
        }, e
    }();
    t.ObjectKeysValueConverter = i
}), define("resources/value-converters/string", ["require", "exports", "path"], function(e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var r = function() {
        function e() {}
        return e.prototype.toView = function(e, t, i) {
            return e.replace(t, i)
        }, e
    }();
    t.ReplaceValueConverter = r;
    var o = function() {
        function e() {}
        return e.prototype.toView = function(e, t) {
            if (!e || e.length <= t) return e;
            var r = i.basename(e);
            if (r.length === t) return r;
            if (r.length >= t - 3) return "..." + r.substr(3);
            if (r.length >= t - 4) return "..." + i.sep + r.substr(3);
            var o = i.dirname(e),
                n = t - r.length - 4,
                a = o.substr(0, n / 2 - 3),
                s = a.lastIndexOf(i.sep); - 1 !== s && (a = a.substr(0, s) + i.sep);
            var l = o.substr(o.length - (n / 2 + 3)),
                c = l.indexOf("\\");
            return -1 !== c && (l = l.substr(c)), a + "..." + l + i.sep + r
        }, e
    }();
    t.LimitPathValueConverter = o
}), define("resources/value-converters/time", ["require", "exports", "moment"], function(e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var r = function() {
        function e() {}
        return e.prototype.toView = function(e, t, r) {
            return e ? i(e).format(t || "MMMM DD, YYYY") : r
        }, e
    }();
    t.FriendlyDateValueConverter = r;
    var o = function() {
        function e() {}
        return e.prototype.toView = function(e, t) {
            return "number" == typeof e && (e = new Date(e)), e ? i.utc(e).fromNow() : t || ""
        }, e
    }();
    t.RelativeTimeValueConverter = o;
    var n = function() {
        function e() {}
        return e.prototype.toView = function(e, t, r) {
            return e ? i(e).format(t || "M/D/YY") : r
        }, e
    }();
    t.ShortDateValueConverter = n
}), define("app/resources/elements/app-header", ["require", "exports"], function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = function() {
        return function() {}
    }();
    t.AppHeader = i
}), define("app/resources/elements/donation", ["require", "exports", "electron"], function(e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var r = function() {
        function e() {
            this.disabled = !1
        }
        return e.prototype.visit = function() {
            var e = this;
            this.disabled || (this.disabled = !0, i.remote.shell.openExternal("https://www.patreon.com/vantage"), setTimeout(function() {
                return e.disabled = !1
            }, 1e3))
        }, e
    }();
    t.Donation = r
}), define("app/resources/elements/games", ["require", "exports", "tslib", "../../../editor/editor-manager", "aurelia-router", "aurelia-framework", "aurelia-dialog", "../../install-dialog"], function(e, t, i, r, o, n, a, s) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var l = function() {
        function e(e, t, i) {
            this.router = e, this.editorManager = t, this.dialog = i
        }
        return e.prototype.addGame = function() {
            return i.__awaiter(this, void 0, void 0, function() {
                var e = this;
                return i.__generator(this, function(t) {
                    switch (t.label) {
                        case 0:
                            return [4, new Promise(function(t, i) {
                                e.dialog.open({
                                    viewModel: s.InstallDialog
                                }).whenClosed(t, i)
                            })];
                        case 1:
                            return t.sent(), [2]
                    }
                })
            })
        }, e = i.__decorate([n.inject(o.Router, r.EditorManager, a.DialogService), i.__metadata("design:paramtypes", [o.Router, r.EditorManager, a.DialogService])], e)
    }();
    t.GamesCustomElement = l
}), define("app/resources/elements/support", ["require", "exports", "electron"], function(e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var r = function() {
        function e() {
            this.disabled = !1
        }
        return e.prototype.visit = function() {
            var e = this;
            this.disabled || (this.disabled = !0, i.remote.shell.openExternal("https://www.thetechgame.com/Forums/t=7706816/vantage.html"), setTimeout(function() {
                return e.disabled = !1
            }, 1e3))
        }, e
    }();
    t.Support = r
}), define("app/resources/elements/window-controls", ["require", "exports", "electron"], function(e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var r = function() {
        function e() {
            var e = this;
            this.addIpcListener("main-window-state", function() {
                return e.refresh()
            }), this.refresh()
        }
        return e.prototype.addIpcListener = function(e, t) {
            i.ipcRenderer.removeAllListeners(e), i.ipcRenderer.addListener(e, t)
        }, e.prototype.refresh = function() {
            var e = i.remote.getCurrentWindow();
            this.minimized = e.isMinimized(), this.maximized = e.isMaximized()
        }, e.prototype.minimize = function() {
            i.remote.getCurrentWindow().minimize()
        }, e.prototype.maximize = function() {
            i.remote.getCurrentWindow().maximize()
        }, e.prototype.restore = function() {
            i.remote.getCurrentWindow().unmaximize()
        }, e.prototype.close = function() {
            i.remote.getCurrentWindow().close()
        }, e
    }();
    t.WindowControlsCustomElement = r
}), define("text!app/app.html", ["module"], function(e) {
    e.exports = '<template><require from="./app.css"></require><require from="./resources/elements/app-header"></require><require from="./resources/elements/sidebar.html"></require><div class="app-layout"><app-header></app-header><div class="app-bottom"><sidebar></sidebar><div class="app-content"><router-view></router-view></div></div></div></template>'
}), define("text!app/app.css", ["module"], function(e) {
    e.exports = '@import url(../static/fonts/lato/lato.css);@import url(../static/fonts/gotham/gotham.css);.hide{display:none !important}.clearfix:after{content:"";display:block;clear:both}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}body{margin:0;padding:0;width:100%;overflow:hidden}*{cursor:default;box-sizing:border-box;-webkit-user-select:none;font-family:Lato}a,img{-webkit-user-drag:none}a,a *,button,button *{cursor:pointer;outline:none}input[type=text],input[type=password]{cursor:initial}.app-layout{width:100vw;height:100vh;display:flex;flex-direction:column}.app-layout app-header{flex:0}.app-layout .app-bottom{flex:1;display:flex;flex-direction:row}.app-layout .app-bottom sidebar{flex:0}.app-layout .app-bottom .app-content{flex:1;position:relative;min-width:0}.app-layout .app-bottom .app-content router-view{display:block;width:100%;height:100%;overflow-y:hidden;position:relative;background-color:#EFF1F3}ux-dialog-overlay{background:transparent;opacity:1 !important}ux-dialog-container{overflow:hidden}ux-dialog-container{overflow:hidden;background:rgba(0,0,0,0.5)}ux-dialog-container>div{animation:dialog-zoom 0.4s ease-out}@keyframes dialog-fade{from{opacity:0}to{opacity:1}}@keyframes dialog-zoom{0%{opacity:0;transform:scale(0)}70%{opacity:1;transform:scale(1.02)}100%{transform:scale(1)}}\n'
}), define("text!app/install-dialog.html", ["module"], function(e) {
    e.exports = '<template><require from="./install-dialog.css"></require><div class="install-dialog"><button class="close-button" click.delegate="close()"><inline-svg src="icons/close.svg"></inline-svg></button><section if.bind="!fetching && !editor"><div class="install-url"><form submit.delegate="fetchEditor(editorUrl)"><input type="text" value.bind="editorUrl" placeholder="github:username/repo"> <button disabled.bind="!editorUrl">Install</button></form></div><div class="actions"><a external-href="https://www.thetechgame.com/Forums/f=312/prefix=vantage/vantage.html" class="ttg">Browse on TTG</a> <a external-href="https://github.com/vantagemods/editor-skeleton">Create an Editor</a> <button class="install-button install-local-button"><label><input type="file" webkitdirectory files.bind="editorPath" change.delegate="installLocalEditor()"> <span>Install Local Editor</span></label></button></div></section><section if.bind="fetching" class="loading"><status-ring></status-ring></section><section if.bind="!fetching && editor" class="install"><img src.bind="editor.thumbnailUrl"><div class="info"><h1 class="title">${editor.game}</h1><h2>${editor.name} by ${editor.author}</h2><button if.bind="!installed" class="install-button ${installing ? \'installing\' : \'\'}" click.delegate="installEditor(editor.provider, editor.locator)"> ${installing ? \'Installing\' : \'Install Editor\'} <status-ring if.bind="installing"></status-ring></button> <button if.bind="installed && !editor.official" class="install-button" click.delegate="uninstallEditor(editor)">Uninstall<status-ring if.bind="installing"></status-ring></button> <button if.bind="editor.homepage" class="install-button" click.delegate="openHomepage(editor)">Homepage</button></div></section></div></template>'
}), define("text!app/constants.css", ["module"], function(e) {
    e.exports = ""
}), define("text!editor/editor.html", ["module"], function(e) {
    e.exports = '<template><require from="./editor.css"></require><div class="editor"><div class="editor-header"><div class="thumbnail"><img src.bind="editorInfo.thumbnailUrl"></div><div click.delegate="manage()" class="title"> ${editorInfo.game} <div class="editor-name">${editorInfo.name} by ${editorInfo.author}</div></div><div if.bind="editorInitialized" class="actions"><div class="select ${fileSelectorOpen ? \'open\' : \'\'}" close-if-click-outside.two-way="fileSelectorOpen"><div class="value-wrapper"><div class="value" click.delegate="toggleFileSelector()">${selectedFile ? selectedFile.name : \'Select a file...\'}</div><i class="select-arrow"><inline-svg src="icons/caret-down.svg"></inline-svg></i></div><div class="dropdown"><div class="column local"><header><img src="static/images/local-saves.svg"> <span>Local Saves</span> <button click.delegate="openLocalFile()" class="right">Open</button></header><div class="empty" if.bind="localFiles.length === 0">No history</div><div class="container"><header><span>Recent</span> <span if.bind="localFiles.length > 0"><a href="#" click.delegate="clearLocalSaves()">Clear</a></span></header><template repeat.for="file of localFiles | sort:\'lastUsed\' | reverse"><button class="file ${file == selectedFile ? \'selected\' : \'\'}" click.delegate="loadLocalSave(file)"><div class="info"><div class="name"> ${file.path | limitPath:50} </div><div class="meta"> ${file.size | byteFormat} <span class="bullet">•</span> ${file.lastUsed | relativeTime} </div></div><div class="actions"><a href="#" click.delegate="removeLocalSave(file, $event)"><i><inline-svg src="icons/close.svg"></inline-svg></i></a></div></button></template></div></div></div></div><button disabled.bind="!editorLoaded" class="action-button" click.trigger="save()">Save</button></div></div><div class="categories"><webview class="editor-frame" ref="frame" focus.trigger="editorFocused($event)" partition.bind="editorInfo.partition" preload="./editor-bridge.js" src="${editorLocation}/index.html"></webview></div></div><status-tip if.bind="status === \'loading\'" title="Reading..." message="Reading your saved game file..."></status-tip><status-tip if.bind="status === \'saving\'" title="Saving..." message="Saving your saved game file..."></status-tip></template>'
}), define("text!app/install-dialog.css", ["module"], function(e) {
    e.exports = '.hide{display:none !important}.clearfix:after,.install-dialog section.install:after{content:"";display:block;clear:both}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.install-dialog{width:450px;height:155px;padding:25px;border-radius:3px;background-color:#fff;color:#0C272C;position:relative}.install-dialog h1{font-weight:bold;font-size:18px;color:#0C272C;letter-spacing:1px;margin-top:25px}.install-dialog h1:first-child{margin-top:0}.install-dialog h2{font-weight:normal;font-size:18px;color:#0C272C;letter-spacing:1px}.install-dialog .close-button{border:none;background:transparent;position:absolute;right:10px;top:10px}.install-dialog .close-button svg *{fill:#0C272C}.install-dialog section.loading{text-align:center;margin-top:32px}.install-dialog section.loading h1{margin-bottom:0}.install-dialog section.install img{width:105px;height:105px;float:left;margin-right:20px;border-radius:3px}.install-dialog section.install .info{float:left;margin-top:5px;width:275px}.install-dialog section.install h1{margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.install-dialog section.install h2{margin:2px 0 15px 0;font-size:11px}.install-dialog a,.install-dialog .install-button{display:inline-block;background:transparent;border-radius:3px;height:40px;font-weight:900;font-size:12px;color:#39AF45;letter-spacing:0.5px;line-height:40px;padding:0 13px;border:1px solid #39AF45;transition:background 0.15s, color 0.15s;cursor:pointer;text-decoration:none;margin-right:auto}.install-dialog a.ttg,.install-dialog .install-button.ttg{background:#31B24A;color:#fff}.install-dialog a.ttg:hover,.install-dialog .install-button.ttg:hover{background:#37c652;border-color:#37c652}.install-dialog a:hover,.install-dialog .install-button:hover{background:#39AF45;color:#fff}.install-dialog .install-button status-ring{width:20px;height:20px;margin-left:10px;margin-top:10px;float:right}.install-dialog .install-button status-ring svg{width:20px;height:20px}.install-dialog .install-button status-ring svg *{stroke:#fff}.install-dialog .install-button.installing{background:#39AF45;color:#fff}.install-dialog .install-button.installing,.install-dialog .install-button.installing *{cursor:default}.install-dialog .actions{display:flex;flex-direction:horizontal}.install-dialog .install-local-button{padding:0;margin-right:0}.install-dialog .install-local-button label{display:block;padding:0 13px}.install-dialog .install-local-button input{display:none}.install-dialog .install-url{position:relative;margin-bottom:20px;margin-top:3px}.install-dialog .install-url input{line-height:40px;border-radius:0;border:0;width:100%;display:block;padding:0 10px;outline:none;border-bottom:2px solid #39AF45;font-size:16px}.install-dialog .install-url input,.install-dialog .install-url input::placeholder{letter-spacing:1px}.install-dialog .install-url button{position:absolute;top:8px;right:0;width:70px;height:25px;cursor:pointer;display:block;border-radius:3px;background:#39AF45;border:0;transition:background 0.15s;font-weight:900;font-size:11px;color:#fff;letter-spacing:0.5px;padding-top:2px}.install-dialog .install-url button:disabled{cursor:default;opacity:0.5}.install-dialog .install-url button:hover:not([disabled]){background:#54c760}\n'
}), define("text!welcome/welcome.html", ["module"], function(e) {
    e.exports = '<template><require from="./welcome.css"></require><section class="welcome"><div class="welcome"><h1>Welcome!</h1><h3><img src="static/images/welcome-arrow.svg" class="arrow"> Select a game to start modding</h3></div></section></template>'
}), define("text!app/utilities.css", ["module"], function(e) {
    e.exports = '.hide{display:none !important}.clearfix:after{content:"";display:block;clear:both}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}\n'
}), define("text!resources/elements/close-button.html", ["module"], function(e) {
    e.exports = '<template><i><inline-svg src="icons/close.svg"></inline-svg></i></template>'
}), define("text!resources/elements/number-input.html", ["module"], function(e) {
    e.exports = '<template class="${disabled ? \'disabled\' : \'\'}"><button click.delegate="subtract()" class="decrement">-</button> <input type="number" value.bind="value"> <button click.delegate="add()" class="increment">+</button></template>'
}), define("text!resources/elements/progress-bar.html", ["module"], function(e) {
    e.exports = '<template bindable="progress"><div class="value" css.bind="{width: (progress * 100) +\'%\'}"></div></template>'
}), define("text!editor/editor.css", ["module"], function(e) {
    e.exports = '.hide{display:none !important}.clearfix:after{content:"";display:block;clear:both}.ellipsis,.editor .editor-header .title,.editor .editor-header .actions .select .value,.editor .editor-header .actions .select .dropdown .container>header>span,.editor .editor-header .actions .select .dropdown .container .file .name{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.editor{position:relative;display:flex;flex-direction:column;height:100%}.editor .editor-header{display:flex;flex-direction:row;align-items:center;height:72px;background:#31B24A}.editor .editor-header .thumbnail{flex:0;align-self:center}.editor .editor-header .thumbnail img{margin:0 24px;width:40px;height:40px}.editor .editor-header .title{flex:1;font-weight:bold;font-size:16px;color:#fff;letter-spacing:1px;cursor:pointer}.editor .editor-header .title .editor-name{padding-top:5px;font-weight:200;font-size:11px;cursor:pointer}.editor .editor-header .actions{flex:0;white-space:nowrap;display:flex;padding:0 24px}.editor .editor-header .actions .refresh-button{width:30px}.editor .editor-header .actions .refresh-button i{cursor:pointer;display:inline-block;margin-top:7px}.editor .editor-header .actions .refresh-button i *{cursor:pointer}.editor .editor-header .actions .refresh-button i:hover svg *{fill:#79e297;transition:fill 0.15s}.editor .editor-header .actions .action-button{height:30px;padding:0 20px;margin-left:16px;border:0;background:#0C272C;border-radius:3px;font-weight:900;font-size:12px;color:#fff;letter-spacing:0.5px;line-height:16.67px;transition:background 0.15s}.editor .editor-header .actions .action-button:hover{background:#174b54}.editor .editor-header .actions .action-button:disabled{cursor:not-allowed;background:#0C272C}.editor .editor-header .actions .no-saves{color:#fff;font-weight:300;font-size:14px;line-height:30px}.editor .editor-header .actions .select{display:inline-block;width:186px;height:30px}.editor .editor-header .actions .select .value-wrapper{position:relative}.editor .editor-header .actions .select .value-wrapper,.editor .editor-header .actions .select .value-wrapper *{cursor:pointer}.editor .editor-header .actions .select .value-wrapper:hover .value{background:#071E22;color:#fff}.editor .editor-header .actions .select .value-wrapper:hover .select-arrow svg *{fill:#526173}.editor .editor-header .actions .select .value{height:30px;width:100%;padding:0 16px;font-size:12px;color:#02394A;letter-spacing:0.5px;line-height:30px;background:#fff;padding-right:40px;border-radius:3px}.editor .editor-header .actions .select .select-arrow{pointer-events:none;position:absolute;right:10px;top:3px}.editor .editor-header .actions .select .select-arrow svg *{fill:#526173}.editor .editor-header .actions .select .dropdown{display:flex;position:absolute;top:64px;right:24px;min-height:135px;max-height:calc(100% - 64px - 24px);max-width:400px;min-width:270px;width:50%;z-index:2;background:#0C272C;border-radius:3px;visibility:hidden;opacity:0;overflow:hidden;transition:opacity 0.3s, visibility 0s linear 0.3s}.editor .editor-header .actions .select .dropdown .column{width:100%;float:left;position:relative;display:flex;flex-direction:column;padding-bottom:10px}.editor .editor-header .actions .select .dropdown .column:first-child{border-right:1px solid #485D60}.editor .editor-header .actions .select .dropdown .column .right{float:right}.editor .editor-header .actions .select .dropdown .column .loading{position:absolute;left:50%;top:calc(50% + 24px);transform:translate(-50%, -50%)}.editor .editor-header .actions .select .dropdown .column .empty{font-family:Lato;font-weight:900;font-size:9px;color:#fff;letter-spacing:0.38px;line-height:12.5px;position:absolute;left:50%;top:calc(50% + 24px);transform:translate(-50%, -50%)}.editor .editor-header .actions .select .dropdown .column>header{height:48px;background:#071E22;line-height:44px;padding:0 16px}.editor .editor-header .actions .select .dropdown .column>header>span{font-family:Lato;font-weight:900;font-size:10px;color:#4B6469;letter-spacing:2px;text-transform:uppercase}.editor .editor-header .actions .select .dropdown .column>header img{vertical-align:middle;margin-right:8px}.editor .editor-header .actions .select .dropdown .column>header>button{border-radius:2.25px;background:#103137;font-family:Lato;font-weight:900;font-size:9px;color:#fff;letter-spacing:0.38px;line-height:24px;height:24px;border:0;padding:0 16px;margin-top:12px;transition:background 0.15s}.editor .editor-header .actions .select .dropdown .column>header>button:hover{background:#16434b}.editor .editor-header .actions .select .dropdown .container{padding:0 16px;flex:1;overflow-y:auto}.editor .editor-header .actions .select .dropdown .container::-webkit-scrollbar{background-color:#142328;width:10px;box-shadow:inset 2px 2px 5px 0px rgba(0,0,0,0.3)}.editor .editor-header .actions .select .dropdown .container::-webkit-scrollbar-thumb:window-inactive,.editor .editor-header .actions .select .dropdown .container::-webkit-scrollbar-thumb{background:#295666}.editor .editor-header .actions .select .dropdown .container::-webkit-scrollbar-thumb:window-inactive:hover,.editor .editor-header .actions .select .dropdown .container::-webkit-scrollbar-thumb:hover{background:#306578}.editor .editor-header .actions .select .dropdown .container>header{padding:10px 0 7px 0;display:flex}.editor .editor-header .actions .select .dropdown .container>header>span{height:12px}.editor .editor-header .actions .select .dropdown .container>header>span:first-child{padding-right:5px;flex:1}.editor .editor-header .actions .select .dropdown .container>header,.editor .editor-header .actions .select .dropdown .container>header a{font-family:"Lato";font-weight:bold;font-size:9px;color:#485D60;line-height:12px;letter-spacing:1px;text-decoration:none}.editor .editor-header .actions .select .dropdown .container>header a:hover{text-decoration:underline}.editor .editor-header .actions .select .dropdown .container .file{display:block;width:100%;height:40px;background:#103137;border:1px solid #194249;border-radius:3px;margin-bottom:8px;padding:8px 16px;text-align:left;transition:background 0.15s}.editor .editor-header .actions .select .dropdown .container .file .name{font-family:Lato;font-size:10px;color:#fff;letter-spacing:0.5px;line-height:12px;margin-bottom:2px}.editor .editor-header .actions .select .dropdown .container .file .meta{font-family:Lato;font-weight:bold;font-size:9px;color:#485D60;letter-spacing:1px}.editor .editor-header .actions .select .dropdown .container .file:hover,.editor .editor-header .actions .select .dropdown .container .file.selected{background:#16434b}.editor .editor-header .actions .select .local .container{min-height:77px}.editor .editor-header .actions .select .local .container>header{text-transform:uppercase}.editor .editor-header .actions .select .local .container .file{display:flex;flex-direction:row}.editor .editor-header .actions .select .local .container .file .info{flex:1}.editor .editor-header .actions .select .local .container .file .actions{padding:4px 0 0 0}.editor .editor-header .actions .select .local .container .file .actions svg{width:10px;height:10px}.editor .editor-header .actions .select .local .container .file .actions svg *{fill:rgba(255,255,255,0.5);transition:fill 0.15s}.editor .editor-header .actions .select .local .container .file .actions a:hover svg *{fill:#fff}.editor .editor-header .actions .select.open .dropdown{opacity:1;visibility:visible;transition-delay:0s}.editor .categories{height:100%;flex:1}.editor .categories .editor-frame{height:100%}\n'
}), define("text!resources/elements/range-input.html", ["module"], function(e) {
    e.exports = '<template bindable="value, min, max, step, disabled" class="${disabled ? \'disabled\' : \'\'}"><input type="range" min.bind="min" max.bind="max" step.bind="step" value.bind="value"><label>${value || 0}</label></template>'
}), define("text!welcome/welcome.css", ["module"], function(e) {
    e.exports = "section.welcome{position:relative;width:100%;height:100%;display:flex;align-items:center}section.welcome .welcome{text-align:center;margin:0 auto}section.welcome .welcome h1{margin:20px 0 0 0;font-weight:bold;font-size:31.25px;color:#39AF45;letter-spacing:0.78px}section.welcome .welcome h3{margin:7px 0 0 0;opacity:0.75;font-size:21.88px;color:#0C272C;letter-spacing:0.78px;position:relative}section.welcome .welcome h3 .arrow{position:absolute;right:100%;top:50%;transform:translate(-20px, -50%);width:calc()}\n"
}), define("text!resources/elements/selection-input.html", ["module"], function(e) {
    e.exports = '<template class="${opened ? \'opened\' : \'\'} ${disabled ? \'disabled\' : \'\'}"><div click.delegate="open()" class="selection-value">${value || \'---\'}</div><ul class="selection-options"><li repeat.for="option of options" click.delegate="setValue(option)">${option}</li></ul></template>'
}), define("text!resources/elements/status-ring.css", ["module"], function(e) {
    e.exports = "status-ring{position:relative;width:38px;height:38px;transform-origin:50% 50%;animation:status-ring-rotate 1s linear infinite;display:inline-block}status-ring svg{width:100%;height:100%;position:absolute;left:0;top:0}status-ring path{animation:status-ring-dash 4s infinite ease-in-out;stroke-dasharray:100}\n"
}), define("text!resources/elements/status-ring.html", ["module"], function(e) {
    e.exports = '<template><require from="./status-ring.css"></require><inline-svg src="spinner.svg"></inline-svg></template>'
}), define("text!resources/elements/status-tip.css", ["module"], function(e) {
    e.exports = "status-tip{position:absolute;left:50%;bottom:0;z-index:2;transform:translate(-50%, 100%);padding:18px;width:280px;background:#fff;border-top-left-radius:6px;border-top-right-radius:6px;border:1px solid #D9E2EB;font-family:Lato-Regular;font-size:10px;color:rgba(16,49,55,0.5);letter-spacing:0.5px;transform:translate(-50%, 0);transition-delay:0s}status-tip strong{display:block;font-weight:900;font-size:14px;color:#02394A;letter-spacing:0.5px;margin-bottom:7px}status-tip .status-ring{float:left;margin-right:18px;display:block}@keyframes status-ring-dash{0%{stroke-dashoffset:100}50%{stroke-dashoffset:25}100%{stroke-dashoffset:100}}@keyframes status-ring-rotate{to{transform:rotate(360deg)}}\n"
}), define("text!resources/elements/status-tip.html", ["module"], function(e) {
    e.exports = '<template bindable="title,message"><require from="./status-tip.css"></require><div class="status-ring"><status-ring></status-ring></div><div><strong>${title}</strong> ${message} </div></template>'
}), define("text!app/resources/elements/app-header.css", ["module"], function(e) {
    e.exports = "app-header{display:block;background:#001011;width:100%;height:56px;-webkit-app-region:drag}app-header .sizer{position:absolute;width:100%;height:6px;-webkit-app-region:no-drag}app-header img{width:118px;height:27px;margin:14.5px 24px}app-header window-controls{float:right;margin:21px;-webkit-app-region:no-drag}\n"
}), define("text!app/resources/elements/app-header.html", ["module"], function(e) {
    e.exports = '<template><require from="./app-header.css"></require><require from="./window-controls"></require><div class="sizer"></div><img src="static/images/logo.svg"><window-controls></window-controls></template>'
}), define("text!app/resources/elements/donation.html", ["module"], function(e) {
    e.exports = '<template><require from="./donation.css"></require><button click.delegate="visit()"><img src="static/images/patreon-logo.svg"> Donate on Patreon</button></template>'
}), define("text!app/resources/elements/donation.css", ["module"], function(e) {
    e.exports = '.hide{display:none !important}.clearfix:after,donation .goal:after{content:"";display:block;clear:both}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}donation{display:block;width:100%;padding:16px 24px;background:#0C272C}donation .goal .label{font-size:11px;color:#fff;letter-spacing:0.5px;float:left}donation .goal .value{font-weight:bold;font-size:11px;color:#39AF45;float:right}donation .goal .value .slash{color:#275B65}donation .goal .value .total{color:#fff}donation .progress{width:100%;height:7px;border-radius:3.5px;background:#103137;margin:10px 0 16px 0}donation .progress .value{height:7px;border-radius:3.5px;background:#40AC3F;transition:width 0.5s}donation button{display:block;width:100%;height:40px;position:relative;text-align:center;background-image:linear-gradient(-133deg, #d74921 0%, #e6461a 100%);border-radius:3px;border:0;font-weight:900;font-size:12px;color:#fff;letter-spacing:0.5px;transition:box-shadow 0.3s;line-height:40px}donation button img{float:left;margin:9px 10px;width:20px;height:20px;vertical-align:middle}donation button,donation button *{cursor:pointer}donation button:after{content:"";width:40px;height:40px;background:url(static/images/icons/caret-right.svg) 25px center no-repeat;display:inline-block;float:right}donation button:hover{box-shadow:0 0 10px rgba(215,73,33,0.8)}\n'
}), define("text!app/resources/elements/games.html", ["module"], function(e) {
    e.exports = '<template><require from="./games.css"></require><header>Mods</header><div class="games"><a repeat.for="editor of editorManager.editors | sort:\'game\'" route-href="route: editor; params.bind: {id: editor.id}" class="game ${router.currentInstruction.config.name === \'editor\' && router.currentInstruction.params.id == editor.id ? \'highlight\' : \'\'}"><div><img src.bind="editor.thumbnailUrl" style="width:32px"><div class="label"> ${editor.game} <div class="editor-name">${editor.provider === \'disk\' ? \'Local Project\' : editor.name}</div></div></div></a><button class="add-game-button" click.delegate="addGame()"><inline-svg src="icons/plus.svg"></inline-svg></button></div></template>'
}), define("text!app/resources/elements/games.css", ["module"], function(e) {
    e.exports = '.hide{display:none !important}.clearfix:after{content:"";display:block;clear:both}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}games{display:flex;flex-flow:column;width:100%}games header{display:flex;justify-content:center;align-content:center;flex-direction:column;height:24px;background:#103137;padding-left:24px;font-weight:900;font-size:10px;color:rgba(255,255,255,0.25);letter-spacing:2px;text-transform:uppercase}games .games{flex:1;overflow-y:auto}games .games::-webkit-scrollbar{background-color:transparent;width:10px;box-shadow:inset 2px 2px 5px 0px rgba(0,0,0,0.3)}games .games::-webkit-scrollbar-thumb:window-inactive,games .games::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.25)}games .games::-webkit-scrollbar-thumb:window-inactive:hover,games .games::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.25)}games .add-game-button{cursor:pointer;display:block;margin:20px auto;width:40px;height:40px;border-radius:50%;background:#103137;border:0;transition:background 0.15s}games .add-game-button svg{width:18px;height:18px;margin:auto;display:block}games .add-game-button svg *{fill:#fff}games .add-game-button:hover{background:#1b545f}games .game{position:relative;display:block;height:60px;position:relative;background:#071E22;border-bottom:1px solid #103137;font-weight:bold;font-size:12px;color:#fff;letter-spacing:0.5px;text-decoration:none;padding-right:24px}games .game:before{content:"";display:block;position:absolute;left:0;top:50%;bottom:50%;width:4px;background:#39AF45;z-index:1;opacity:0;transition:top 0.3s, bottom 0.3s, opacity 0.15s}games .game:hover:before,games .game.highlight:before{top:0;bottom:0;opacity:1}games .game img{width:33px;height:33px;margin:13px 16px 13px 24px;float:left}games .game .label{padding-top:14px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}games .game .label .editor-name{font-size:10px;font-weight:200;padding-top:5px}games .game>div{opacity:0.5;transition:opacity 0.15s}games .game:hover>div,games .game.highlight>div{opacity:1}\n'
}), define("text!app/resources/elements/sidebar.html", ["module"], function(e) {
    e.exports = '<template><require from="./sidebar.css"></require><require from="./games"></require><require from="./support"></require><require from="./donation"></require><games></games><support></support><donation></donation></template>'
}), define("text!app/resources/elements/sidebar.css", ["module"], function(e) {
    e.exports = "sidebar{display:flex;flex-flow:column;width:280px;min-width:280px;height:calc(100vh - 56px);background:#071E22;position:relative}sidebar games{position:relative;left:0;height:100%}sidebar support{padding-bottom:0px}\n"
}), define("text!app/resources/elements/support.html", ["module"], function(e) {
    e.exports = '<template><require from="./support.css"></require><button click.delegate="visit()"><img src="static/images/icons/speech-bubble.svg"> Join the Discussion</button></template>'
}), define("text!app/resources/elements/support.css", ["module"], function(e) {
    e.exports = '.hide{display:none !important}.clearfix:after{content:"";display:block;clear:both}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}support{display:block;width:100%;padding:16px 24px;background:#0C272C}support button{display:block;width:100%;height:40px;position:relative;text-align:center;background-image:linear-gradient(-133deg, #238bb6 0%, #29abe1 100%);border-radius:3px;border:0;font-weight:900;font-size:12px;color:#fff;letter-spacing:0.5px;transition:box-shadow 0.3s;line-height:40px}support button img{float:left;margin:10px;width:20px;height:20px;vertical-align:middle}support button,support button *{cursor:pointer}support button:after{content:"";width:40px;height:40px;background:url(static/images/icons/caret-right.svg) 25px center no-repeat;display:inline-block;float:right}support button:hover{box-shadow:0 0 10px rgba(35,139,182,0.8)}\n'
}), define("text!app/resources/elements/window-controls.html", ["module"], function(e) {
    e.exports = '<template class="window-controls"><require from="./window-controls.css"></require><ul><li if.bind="!minimized" click.trigger="minimize()"><inline-svg src="icons/app-minimize.svg"></inline-svg></li><li if.bind="!maximized" click.trigger="maximize()"><inline-svg src="icons/app-maximize.svg"></inline-svg></li><li if.bind="maximized" click.trigger="restore()"><inline-svg src="icons/app-restore.svg"></inline-svg></li><li click.trigger="close()"><inline-svg src="icons/app-close.svg"></inline-svg></li></ul></template>'
}), define("text!app/resources/elements/window-controls.css", ["module"], function(e) {
    e.exports = "window-controls{display:inline-block}window-controls ul{list-style:none;margin:0;padding:0;transform:translate(0, -3px)}window-controls ul li{display:inline-block;margin-right:14px;width:14px;height:14px}window-controls ul li:last-child{margin-right:0}window-controls ul li *{cursor:pointer}window-controls ul li svg{width:14px;height:14px}window-controls ul li svg *{transition:opacity 0.15s}window-controls ul li:hover svg *{opacity:1}\n"
});
//# sourceMappingURL=app-bundle.js.map