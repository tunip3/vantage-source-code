define("environment", ["require", "exports"], function(e, _) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    }), _.default = {
        debug: !1,
        testing: !1,
        storageExplorer: !1,
        apiUrl: "https://api.vantagemods.com",
        gaTrackingId: "UA-100219353-1"
    }
}), define("api", ["require", "exports", "tslib", "aurelia-fetch-client", "aurelia-event-aggregator", "./environment", "url"], function(e, _, t, a, r, i, o) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var n = function() {
        function e() {
            this.ea = new r.EventAggregator, this.http = (new a.HttpClient).configure(function(e) {
                e.baseUrl = i.default.apiUrl, e.rejectErrorResponses()
            })
        }
        return e.prototype.setAuthToken = function(e) {
            this.token = "Theory " + e
        }, e.prototype.clearAuthToken = function() {
            this.token = null
        }, e.prototype.onAuthTokenUpdated = function(e) {
            return this.ea.subscribe("token", e)
        }, e.prototype.onUnauthorized = function(e) {
            return this.ea.subscribe("unauthorized", e)
        }, e.prototype.getProxiedAuthUrl = function(e) {
            var _ = o.parse(e),
                t = _.query ? "&" + _.query : "";
            return i.default.apiUrl + "/auth/proxy?path=" + encodeURIComponent(_.pathname) + t
        }, e.prototype.fetch = function(e, _) {
            return void 0 === _ && (_ = {}), t.__awaiter(this, void 0, void 0, function() {
                var a, r, i, o, n, l;
                return t.__generator(this, function(t) {
                    switch (t.label) {
                        case 0:
                            this.token && (_.headers ? _.headers.Authorization = this.token : _.headers = {
                                Authorization: this.token
                            }), t.label = 1;
                        case 1:
                            return t.trys.push([1, 3, , 4]), [4, this.http.fetch(e, _)];
                        case 2:
                            return a = t.sent(), [3, 4];
                        case 3:
                            throw r = t.sent(), 401 !== r.status && 403 !== r.status || this.ea.publish("unauthorized"), r;
                        case 4:
                            return i = a.headers.get("X-Token"), i && (this.setAuthToken(i), this.ea.publish("token", i)), o = a.headers.get("Content-Type"), o && o.includes("application/json") ? [4, a.json()] : [3, 6];
                        case 5:
                            return [2, t.sent()];
                        case 6:
                            return l = (n = Buffer).from, [4, a.arrayBuffer()];
                        case 7:
                            return [2, l.apply(n, [t.sent()])]
                    }
                })
            })
        }, e.prototype.get = function(e) {
            return this.fetch(e, {
                method: "GET"
            })
        }, e.prototype.delete = function(e) {
            return this.fetch(e, {
                method: "DELETE"
            })
        }, e.prototype.post = function(e, _) {
            return this.fetchWithBody("POST", e, _)
        }, e.prototype.put = function(e, _) {
            return this.fetchWithBody("PUT", e, _)
        }, e.prototype.patch = function(e, _) {
            return this.fetchWithBody("PATCH", e, _)
        }, e.prototype.fetchWithBody = function(e, _, t) {
            var a = {
                method: e,
                body: t
            };
            return t instanceof Buffer ? (a.body = t.buffer, a.headers = {
                "Content-Type": "application/octet-stream"
            }) : (a.body = JSON.stringify(t), a.headers = {
                "Content-Type": "application/json"
            }), this.fetch(_, a)
        }, e
    }();
    _.Api = n
}), define("storage/save-storage", ["require", "exports"], function(e, _) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    })
}), define("editor/titles", ["require", "exports"], function(e, _) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    }), _.testTitle = {
        name: "Component Test",
        scid: "component-test",
        thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Component_video_jack.jpg/220px-Component_video_jack.jpg",
        editors: [{
            src: "component-test/index",
            name: "Luminance Editor",
            fileFilter: null
        }]
    }, _.default = [{
        name: "Modern Warfare Remastered",
        scid: "d8890100-b864-45cd-b20e-62d40020e1b2",
        thumbnailUrl: "http://images-eds.xboxlive.com/image?url=8Oaj9Ryq1G1_p3lLnXlsaZgGzAie6Mnu24_PawYuDYIoH77pJ.X5Z.MqQPibUVTcK_gPjzG5w4baW6ZxZj7nSNBN2cXpgreRaLIiMBc_..oxHoGRtiI.Rxrwbv0dcLCqCVVUy3ocIr0kykyEoCjviw741jh0CN0aACy2XTrrvBn706wClzfQ1H9Xck59sA9RDDIsrvN7DLJq1bWhmY_fv0ZRH8fPnUp_54hCkEdZKqM-&w=128&h=128",
        editors: [{
            src: "modern-warfare/index",
            name: "Campaign Editor",
            fileFilter: function(e, _) {
                return "save" === e.name && "savegame.svg" === _.name
            }
        }]
    }]
}), define("main", ["require", "exports", "tslib", "./editor/titles", "aurelia-logging-console", "aurelia-logging", "./api", "electron", "./environment", "aurelia-logging", "aurelia-binding"], function(e, _, t, a, r, i, o, n, l, s, p) {
    "use strict";

    function c(e) {
        return t.__awaiter(this, void 0, void 0, function() {
            return t.__generator(this, function(_) {
                switch (_.label) {
                    case 0:
                        return console.info("Vantage v" + n.remote.app.getVersion()), e.use.standardConfiguration().feature("resources").feature("editor/resources").plugin("aurelia-dialog", function(e) {
                            e.useDefaults(), e.settings.lock = !1, e.settings.enableEscClose = !0
                        }), e.use.preTask(function() {
                            if (s.addAppender(new r.ConsoleAppender), l.default.debug) a.default.push(a.testTitle), s.setLevel(s.logLevel.debug), m();
                            else if (!d()) return Promise.reject(new Error);
                            return Promise.resolve()
                        }), l.default.debug && e.use.postTask(function() {
                            return window.test = function() {
                                return e.container.get(o.Api).get("/test").then(function(e) {
                                    return console.info(e), e
                                })
                            }, Promise.resolve()
                        }), l.default.testing && e.use.plugin("aurelia-testing"), [4, e.start()];
                    case 1:
                        return _.sent(), e.setRoot("./app/app"), [2]
                }
            })
        })
    }

    function d() {
        var e = function() {};
        if (console.debug = e, s.addAppender = e, console.debug !== e || s.addAppender !== e) return !1;
        var _ = {
            configurable: !1,
            writable: !1
        };
        return Object.defineProperty(s, "addAppender", _), Object.defineProperty(console, "debug", _), Object.defineProperty(window, "console", _), setInterval(function() {
            n.remote.getCurrentWindow().webContents.closeDevTools(), console.clear()
        }, 250), !0
    }

    function m() {
        var e = i.getLogger("dirty-check"),
            _ = p.DirtyCheckProperty;
        _.prototype.standardSubscribe = _.prototype.subscribe, _.prototype.subscribe = function(_, t) {
            this.standardSubscribe(_, t), e.warn("'" + this.obj.constructor.name + "." + this.propertyName + "' is being dirty checked.", this.obj)
        }
    }
    Object.defineProperty(_, "__esModule", {
        value: !0
    }), Promise.config({
        longStackTraces: l.default.debug,
        warnings: {
            wForgottenReturn: !1
        }
    }), _.configure = c
}), define("util/updater", ["require", "exports", "tslib", "aurelia-framework", "../api", "electron", "semver"], function(e, _, t, a, r, i, o) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var n = function() {
        function e(e) {
            this.api = e, this.updateAvailable = !1, this.currentVersion = i.remote.app.getVersion()
        }
        return e.prototype.checkForUpdate = function() {
            return t.__awaiter(this, void 0, void 0, function() {
                var e;
                return t.__generator(this, function(_) {
                    switch (_.label) {
                        case 0:
                            return [4, this.api.get("/config")];
                        case 1:
                            return e = _.sent(), o.gt(e.version, this.currentVersion) && (this.updateAvailable = !0, this.updateVersion = e.version, this.downloadUrl = e.downloadUrl), [2, this]
                    }
                })
            })
        }, e
    }();
    n = t.__decorate([a.inject(r.Api), t.__metadata("design:paramtypes", [r.Api])], n), _.Updater = n
}), define("app/update-dialog", ["require", "exports", "tslib", "../util/updater", "aurelia-dialog", "aurelia-framework", "electron"], function(e, _, t, a, r, i, o) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var n = function() {
        function e(e, _) {
            this.controller = e, this.updater = _, e.settings.lock = !0
        }
        return e.prototype.downloadNow = function() {
            try {
                o.remote.shell.openExternal(this.updater.downloadUrl), o.remote.app.quit()
            } catch (e) {
                alert("Please visit vantagemods.com to download."), this.controller.ok()
            }
        }, e
    }();
    n = t.__decorate([i.inject(r.DialogController, a.Updater), t.__metadata("design:paramtypes", [r.DialogController, a.Updater])], n), _.UpdateDialog = n
}), define("app/disclaimer-dialog", ["require", "exports", "tslib", "aurelia-dialog", "aurelia-framework", "electron"], function(e, _, t, a, r, i) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var o = n = function() {
        function e(e) {
            this.controller = e, e.settings.lock = !0
        }
        return e.prototype.exit = function() {
            i.remote.app.quit()
        }, e.prototype.agree = function() {
            this.controller.ok(), n.onAgree && n.onAgree()
        }, e
    }();
    o = n = t.__decorate([r.inject(a.DialogController), t.__metadata("design:paramtypes", [a.DialogController])], o), _.DisclaimerDialog = o;
    var n
}), define("util/uuid", ["require", "exports", "crypto"], function(e, _, t) {
    "use strict";

    function a() {
        return t.randomBytes(20)
    }

    function r(e) {
        var _ = 0;
        return o[e[_++]] + o[e[_++]] + o[e[_++]] + o[e[_++]] + "-" + o[e[_++]] + o[e[_++]] + "-" + o[e[_++]] + o[e[_++]] + "-" + o[e[_++]] + o[e[_++]] + "-" + o[e[_++]] + o[e[_++]] + o[e[_++]] + o[e[_++]] + o[e[_++]] + o[e[_++]]
    }

    function i(e) {
        e = e || {};
        var _ = (e.rng || a)();
        return _[6] = 15 & _[6] | 64, _[8] = 63 & _[8] | 128, e.binary ? _ : r(_)
    }
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    for (var o = [], n = 0; n < 256; n++) o[n] = (n + 256).toString(16).substr(1);
    _.v4 = i
}), define("util/ga", ["require", "exports", "tslib", "aurelia-fetch-client", "../environment", "electron", "./uuid", "aurelia-path"], function(e, _, t, a, r, i, o, n) {
    "use strict";

    function l() {
        return screen.width + "x" + screen.height
    }

    function s() {
        return navigator.userAgent
    }

    function p() {
        return screen.colorDepth + "-bits"
    }

    function c() {
        return screen.availWidth + "x" + screen.availHeight
    }

    function d() {
        var e = localStorage.getItem("gaClientId");
        return e || (e = o.v4(), localStorage.setItem("gaClientId", e)), e
    }

    function m(e) {
        return t.__awaiter(this, void 0, void 0, function() {
            var _;
            return t.__generator(this, function(t) {
                switch (t.label) {
                    case 0:
                        if (!r.default.gaTrackingId) return [2];
                        e = Object.assign({
                            v: f,
                            tid: r.default.gaTrackingId,
                            cid: d(),
                            an: "Vantage",
                            av: i.remote.app.getVersion(),
                            sr: l(),
                            vp: c(),
                            sd: p(),
                            ua: s(),
                            ds: "app"
                        }, e), t.label = 1;
                    case 1:
                        return t.trys.push([1, 3, , 4]), [4, b.fetch("/collect", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            body: n.buildQueryString(e),
                            cache: "no-cache"
                        })];
                    case 2:
                        return t.sent(), [3, 4];
                    case 3:
                        return _ = t.sent(), [3, 4];
                    case 4:
                        return [2]
                }
            })
        })
    }

    function u(e, _, t, a) {
        return m({
            t: "event",
            ec: e,
            ea: _,
            el: t,
            ev: a,
            cd: h
        })
    }

    function g(e) {
        return h = e, m({
            t: "screenview",
            cd: e
        })
    }
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var h, f = "1",
        b = new a.HttpClient;
    b.baseUrl = "https://www.google-analytics.com", r.default.debug && (b.baseUrl += "/debug"), _.reportEvent = u, _.reportScreen = g
}), define("app/routes", ["require", "exports"], function(e, _) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    }), _.default = [{
        route: "",
        name: "default",
        moduleId: "welcome/welcome"
    }, {
        route: "editor/:scid/:index",
        name: "editor",
        moduleId: "editor/editor",
        activationStrategy: "replace"
    }]
}), define("app/app", ["require", "exports", "tslib", "./update-dialog", "aurelia-event-aggregator", "./disclaimer-dialog", "aurelia-dialog", "aurelia-framework", "../util/updater", "../util/ga", "../environment", "./routes"], function(e, _, t, a, r, i, o, n, l, s, p, c) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var d = function() {
        function e(e, _) {
            this.dialog = e, this.updater = _
        }
        return e.prototype.configureRouter = function(e, _) {
            e.title = "Vantage", e.options.root = "/", e.addPipelineStep("postcomplete", m), e.addPipelineStep("preActivate", u), e.map(c.default), e.mapUnknownRoutes("default"), e.fallbackRoute("default"), this.router = _
        }, e.prototype.activate = function() {
            s.reportEvent("App", "Start")
        }, e.prototype.attached = function() {
            return t.__awaiter(this, void 0, void 0, function() {
                var e;
                return t.__generator(this, function(_) {
                    switch (_.label) {
                        case 0:
                            return p.default.debug ? [3, 2] : [4, this.dialog.open({
                                viewModel: i.DisclaimerDialog
                            })];
                        case 1:
                            return _.sent(), [3, 3];
                        case 2:
                            i.DisclaimerDialog.onAgree && i.DisclaimerDialog.onAgree(), _.label = 3;
                        case 3:
                            return [4, this.updater.checkForUpdate()];
                        case 4:
                            return e = _.sent(), e.updateAvailable && this.dialog.open({
                                viewModel: a.UpdateDialog
                            }), [2]
                    }
                })
            })
        }, e
    }();
    d = t.__decorate([n.inject(o.DialogService, l.Updater), t.__metadata("design:paramtypes", [o.DialogService, l.Updater])], d), _.App = d;
    var m = function() {
            function e() {}
            return e.prototype.run = function(e, _) {
                var t = document.querySelector("router-view");
                return t && (t.scrollTop = 0), _()
            }, e
        }(),
        u = function() {
            function e(e) {
                this.ea = e
            }
            return e.prototype.run = function(e, _) {
                return this.ea.publish("router:pipeline:preActivate"), _()
            }, e
        }();
    u = t.__decorate([n.inject(r.EventAggregator), t.__metadata("design:paramtypes", [r.EventAggregator])], u)
}), define("util/dialog", ["require", "exports", "electron"], function(e, _, t) {
    "use strict";

    function a(e) {
        return new Promise(function(_) {
            t.remote.dialog.showMessageBox(t.remote.getCurrentWindow(), {
                type: "question",
                message: e,
                buttons: ["Yes", "No"]
            }, function(e) {
                return _(0 === e)
            })
        })
    }
    Object.defineProperty(_, "__esModule", {
        value: !0
    }), _.showYesNoDialog = a
}), define("auth/gamercard", ["require", "exports"], function(e, _) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var t = function() {
        function e() {}
        return e
    }();
    _.Gamercard = t
}), define("auth/auth-dialog", ["require", "exports", "tslib", "../util/dialog", "aurelia-dialog", "aurelia-framework", "electron", "../api"], function(e, _, t, a, r, i, o, n) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var l = "https://login.live.com/ppsecure/InlineLogin.srf?Platform=Windows10&cxh=0",
        s = function() {
            function e(e, _) {
                this.controller = e, this.api = _
            }
            return e.prototype.attached = function() {
                var e = this;
                this.frame.addEventListener("ipc-message", function(_) {
                    "invoke" === _.channel && e.invoke.apply(e, [_.args[0]].concat(_.args.slice(1)))
                }), this.frame.addEventListener("dom-ready", function() {
                    e.frame.insertCSS("\n    html, body {\n        width: 100%;\n        height: 99% !important;\n        margin: 0;\n        padding: 0;\n    }\n    header {\n        margin-top: 0 !important;\n    }\n    #idLogos, #msaSignupLink, #idPrivacyLink {\n        display: none;\n    }\n")
                });
                var _ = {
                    urls: ["https://login.live.com/ppsecure/*"]
                };
                o.remote.session.fromPartition("persist:auth", void 0).webRequest.onBeforeRequest(_, function(_, t) {
                    t({
                        cancel: !1,
                        redirectURL: e.api.getProxiedAuthUrl(_.url)
                    })
                }), this.frame.src = l
            }, e.prototype.invoke = function(e) {
                for (var _ = [], t = 1; t < arguments.length; t++) _[t - 1] = arguments[t];
                switch (e) {
                    case "CloudExperienceHost.MSA.createConnectedAccount":
                        this.handleBinaryDAToken0(_[2])
                }
            }, e.prototype.handleBinaryDAToken0 = function(e) {
                return t.__awaiter(this, void 0, void 0, function() {
                    var _, r;
                    return t.__generator(this, function(t) {
                        switch (t.label) {
                            case 0:
                                return [4, this.api.post("/auth", {
                                    token: e
                                })];
                            case 1:
                                return _ = t.sent(), "token" in _ ? (this.controller.ok(_), [2]) : [4, a.showYesNoDialog("Your login requires extra verification. You can perform this in your Microsoft account security settings. Do you want to go there now?")];
                            case 2:
                                return r = t.sent(), r ? (o.remote.shell.openExternal("https://account.live.com/Activity?refp=security"), this.frame.src = l) : this.controller.cancel(), [2]
                        }
                    })
                })
            }, e
        }();
    s = t.__decorate([i.inject(r.DialogController, n.Api), t.__metadata("design:paramtypes", [r.DialogController, n.Api])], s), _.AuthDialog = s
}), define("auth/auth", ["require", "exports", "tslib", "../app/disclaimer-dialog", "aurelia-event-aggregator", "./auth-dialog", "aurelia-dialog", "aurelia-framework", "../api"], function(e, _, t, a, r, i, o, n, l) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var s = function() {
        function e(e, _) {
            var t = this;
            this.dialogService = e, this.api = _, this.ea = new r.EventAggregator, this.gamercard = this.loadFromStorage("gamercard"), this.token = this.loadFromStorage("token"), this.api.onAuthTokenUpdated(function(e) {
                t.token = e, t.persist()
            }), this.api.onUnauthorized(function() {
                t.token && (t.signOut(), alert("Your login is no longer valid. Please sign in again."), t.signIn())
            }), this.token && (this.api.setAuthToken(this.token), a.DisclaimerDialog.onAgree = function() {
                return t.refresh()
            })
        }
        return e.prototype.refresh = function() {
            return t.__awaiter(this, void 0, void 0, function() {
                var e;
                return t.__generator(this, function(_) {
                    switch (_.label) {
                        case 0:
                            return this.token ? (e = this, [4, this.api.get("/gamercard")]) : [3, 2];
                        case 1:
                            e.gamercard = _.sent(), this.persist(), _.label = 2;
                        case 2:
                            return [2]
                    }
                })
            })
        }, e.prototype.persist = function() {
            localStorage.setItem("token", JSON.stringify(this.token)), localStorage.setItem("gamercard", JSON.stringify(this.gamercard))
        }, e.prototype.loadFromStorage = function(e) {
            var _ = localStorage.getItem(e);
            if (_) try {
                return JSON.parse(_)
            } catch (e) {}
            return null
        }, e.prototype.signIn = function() {
            return t.__awaiter(this, void 0, void 0, function() {
                var e;
                return t.__generator(this, function(_) {
                    switch (_.label) {
                        case 0:
                            return this.gamercard ? [2, this.gamercard] : this.dialogService.hasActiveDialog ? [2, null] : [4, this.requestAuth()];
                        case 1:
                            return (e = _.sent()) ? (this.set(e.token, e.gamercard), [2, e.gamercard]) : [2, null]
                    }
                })
            })
        }, e.prototype.requestAuth = function() {
            return t.__awaiter(this, void 0, void 0, function() {
                var e;
                return t.__generator(this, function(_) {
                    switch (_.label) {
                        case 0:
                            return [4, this.dialogService.open({
                                viewModel: i.AuthDialog
                            })];
                        case 1:
                            return e = _.sent(), [2, e.wasCancelled ? null : e.output]
                    }
                })
            })
        }, e.prototype.signOut = function() {
            this.token && this.set(null, null)
        }, e.prototype.set = function(e, _) {
            this.token = e, this.gamercard = _, this.token ? this.api.setAuthToken(this.token) : this.api.clearAuthToken(), this.ea.publish("change", _), this.persist()
        }, e.prototype.onGamerChanged = function(e) {
            return this.ea.subscribe("change", e)
        }, e
    }();
    s = t.__decorate([n.inject(o.DialogService, l.Api), t.__metadata("design:paramtypes", [o.DialogService, l.Api])], s), _.Auth = s
}), define("util/disposable", ["require", "exports"], function(e, _) {
    "use strict";

    function t(e, _) {
        try {
            return _(e)
        } finally {
            e.dispose()
        }
    }
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var a = function() {
        function e(e) {
            void 0 === e && (e = []), this.objects = e, this.disposed = !1
        }
        return e.prototype.push = function(e) {
            this.objects.push(e)
        }, e.prototype.dispose = function() {
            if (!this.disposed) {
                for (var e = 0, _ = this.objects; e < _.length; e++) {
                    _[e].dispose()
                }
                this.objects = [], this.disposed = !0
            }
        }, e
    }();
    _.DisposableContainer = a, _.using = t;
    var r = function() {
        function e(e, _) {
            this.timeout = setTimeout(_, e)
        }
        return e.prototype.dispose = function() {
            this.timeout && clearTimeout(this.timeout), this.timeout = null
        }, e
    }();
    _.DisposableTimeout = r;
    var i = function() {
        function e(e, _) {
            this.interval = setInterval(_, e)
        }
        return e.prototype.dispose = function() {
            this.interval && clearInterval(this.interval), this.interval = null
        }, e
    }();
    _.DisposableInterval = i
}), define("storage/cloud/cloud-save-storage", ["require", "exports", "tslib", "aurelia-framework", "../../auth/auth", "../../api"], function(e, _, t, a, r, i) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var o = function() {
        function e(e, _) {
            this.api = e, this.auth = _
        }
        return e.prototype.getTitles = function() {
            return Promise.resolve(this.auth.gamercard.titles)
        }, e.prototype.getContainers = function(e) {
            return t.__awaiter(this, void 0, void 0, function() {
                var _, a;
                return t.__generator(this, function(t) {
                    switch (t.label) {
                        case 0:
                            if (!this.auth.gamercard) return [2, []];
                            t.label = 1;
                        case 1:
                            return t.trys.push([1, 3, , 4]), [4, this.api.get("/titles/" + e + "/storage")];
                        case 2:
                            return _ = t.sent(), _.forEach(function(e) {
                                return e.files.forEach(function(_) {
                                    return _.container = e
                                })
                            }), [2, _];
                        case 3:
                            return a = t.sent(), [2, []];
                        case 4:
                            return [2]
                    }
                })
            })
        }, e.prototype.readFile = function(e, _, t) {
            return this.api.get("/titles/" + e + "/storage/" + encodeURIComponent(_) + "/" + encodeURIComponent(t))
        }, e.prototype.writeFile = function(e, _, a, r) {
            return t.__awaiter(this, void 0, void 0, function() {
                var i, o, n, l = this;
                return t.__generator(this, function(s) {
                    switch (s.label) {
                        case 0:
                            return [4, this.api.post("/titles/" + e + "/storage/" + encodeURIComponent(_) + "/" + encodeURIComponent(a), {
                                size: r.length
                            })];
                        case 1:
                            i = s.sent(), o = "/titles/" + e + "/storage/" + encodeURIComponent(_) + "/" + encodeURIComponent(a), s.label = 2;
                        case 2:
                            return s.trys.push([2, 5, , 7]), [4, Promise.all(i.chunks.map(function(e) {
                                return t.__awaiter(l, void 0, void 0, function() {
                                    var _, a;
                                    return t.__generator(this, function(t) {
                                        switch (t.label) {
                                            case 0:
                                                return _ = r.slice(e.offset, e.offset + e.size), [4, fetch(e.url, {
                                                    method: "PUT",
                                                    headers: {
                                                        "Content-Length": _.length.toString()
                                                    },
                                                    body: _,
                                                    keepalive: !0
                                                })];
                                            case 1:
                                                if (a = t.sent(), !a.ok) throw new Error("Faled to upload chunk.");
                                                return [2]
                                        }
                                    })
                                })
                            }))];
                        case 3:
                            return s.sent(), [4, this.api.patch(o, {
                                commit: i.commit
                            })];
                        case 4:
                            return s.sent(), [3, 7];
                        case 5:
                            return n = s.sent(), [4, this.api.patch(o, {
                                cancel: !0
                            })];
                        case 6:
                            return s.sent(), [3, 7];
                        case 7:
                            return [2]
                    }
                })
            })
        }, e.prototype.deleteFile = function(e, _, t) {
            throw new Error("Not implemented yet.")
        }, e
    }();
    o = t.__decorate([a.inject(i.Api, r.Auth), t.__metadata("design:paramtypes", [i.Api, r.Auth])], o), _.CloudSaveStorage = o
}), define("util/async", ["require", "exports"], function(e, _) {
    "use strict";

    function t(e) {
        return Promise.promisifyAll(e)
    }
    Object.defineProperty(_, "__esModule", {
        value: !0
    }), _.promisifyAll = t;
    var a = function() {
        function e(e) {
            var _ = this;
            this.resolvers = [], this.rejectors = [], this.resolved = !1, this.rejected = !1, e.then(function(e) {
                if (_.resolved = !0, _.result = e, _.resolvers) {
                    for (var t = 0, a = _.resolvers; t < a.length; t++) {
                        var r = a[t];
                        try {
                            r(e)
                        } catch (e) {
                            console.warn("Uncaught exception thrown in MultiPromise fulfillment handler.", e)
                        }
                    }
                    _.dispose()
                }
            }).catch(function(e) {
                if (_.rejected = !0, _.result = e, _.rejectors) {
                    for (var t = 0, a = _.rejectors; t < a.length; t++) {
                        var r = a[t];
                        try {
                            r(e)
                        } catch (e) {
                            console.warn("Uncaught exception thrown in MultiPromise rejection handler.", e)
                        }
                    }
                    _.dispose()
                }
            })
        }
        return e.wrap = function(_) {
            return new e(_)
        }, e.prototype.await = function() {
            var e = this;
            return this.resolved ? Promise.resolve(this.result) : this.rejected ? Promise.reject(this.result) : new Promise(function(_, t) {
                e.resolvers && e.rejectors && (e.resolvers.push(_), e.rejectors.push(t))
            })
        }, e.prototype.dispose = function() {
            this.resolvers = null, this.rejectors = null
        }, e
    }();
    _.MultiPromise = a
}), define("util/stream", ["require", "exports", "tslib", "long"], function(e, _, t, a) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var r;
    ! function(e) {
        e[e.Current = 0] = "Current", e[e.Begin = 1] = "Begin", e[e.End = 2] = "End"
    }(r = _.SeekOrigin || (_.SeekOrigin = {}));
    var i = (Buffer.alloc(4), function() {
        function e(e) {
            this._buffer = e, this._position = 0, this._length = e.length
        }
        return e.alloc = function(_) {
            return new e(Buffer.alloc(_))
        }, e.reserve = function(_) {
            var t = e.alloc(_);
            return t._length = 0, t
        }, e.prototype.getBuffer = function() {
            return this._buffer.slice(0, this.length)
        }, e.prototype.dispose = function() {
            this._buffer = null
        }, Object.defineProperty(e.prototype, "eof", {
            get: function() {
                return this.position >= this.length
            },
            enumerable: !0,
            configurable: !0
        }), Object.defineProperty(e.prototype, "length", {
            get: function() {
                return this._length
            },
            enumerable: !0,
            configurable: !0
        }), Object.defineProperty(e.prototype, "position", {
            get: function() {
                return this._position
            },
            set: function(e) {
                if (e > this.length) throw new Error("Cannot seek past end of stream.");
                this._position = e
            },
            enumerable: !0,
            configurable: !0
        }), e.prototype.seek = function(e, _) {
            switch (void 0 === _ && (_ = r.Begin), _) {
                case r.Begin:
                    this.position = e;
                    break;
                case r.End:
                    this.position = this.length - e;
                    break;
                case r.Current:
                    this.position += e
            }
            return this
        }, e.prototype.skip = function(e) {
            return this.seek(e, r.Current), this
        }, e.prototype.resize = function(e) {
            return e > this._buffer.length && (this._buffer = Buffer.concat([this._buffer], e)), this._length = e, this
        }, e.prototype.expand = function(e) {
            var _ = this.position + e;
            _ > this._length && (_ > this._buffer.length && (this._buffer = Buffer.concat([this._buffer], Math.max(_, 1.5 * this._buffer.length))), this._length = _)
        }, e.prototype.readBytes = function(e) {
            var _ = this._buffer.slice(this.position, this.position + e);
            return this.position += e, _
        }, e.prototype.readToEnd = function() {
            return this.readBytes(this.length - this.position)
        }, e.prototype.readNumber = function(e, _) {
            var t = this._buffer["read" + e](this.position);
            return this.position += _, t
        }, e.prototype.readByte = function() {
            return this.readNumber("UInt8", 1)
        }, e.prototype.readBoolean = function() {
            return 0 !== this.readByte()
        }, e.prototype.readUInt16 = function() {
            return this.readNumber("UInt16LE", 2)
        }, e.prototype.readInt16 = function() {
            return this.readNumber("Int16LE", 2)
        }, e.prototype.readUInt32 = function() {
            return this.readNumber("UInt32LE", 4)
        }, e.prototype.readInt32 = function() {
            return this.readNumber("Int32LE", 4)
        }, e.prototype.readInt64 = function() {
            return a.default.fromBits(this.readUInt32(), this.readUInt32(), !1)
        }, e.prototype.readUInt64 = function() {
            return a.default.fromBits(this.readUInt32(), this.readUInt32(), !0)
        }, e.prototype.readFloat = function() {
            return this.readNumber("FloatLE", 4)
        }, e.prototype.readDouble = function() {
            return this.readNumber("DoubleLE", 8)
        }, e.prototype.getCStringLength = function(e) {
            for (var _ = this.position, t = Buffer.byteLength("\0", e); _ + t <= this.length;) {
                if (this._buffer.slice(_, _ + t).every(function(e) {
                        return 0 === e
                    })) return _ - this.position;
                _++
            }
            return this.length - this.position
        }, e.prototype.readString = function(e, _) {
            void 0 === _ && (_ = -1);
            var t = -1 === _ ? this.getCStringLength(e) : Buffer.byteLength("\0", e) * _,
                a = this._buffer.toString(e, this.position, this.position + t);
            return this.position += t, a
        }, e.prototype.writeBytes = function(e) {
            return this.expand(e.length), e.copy(this._buffer, this.position), this.position += e.length, this
        }, e.prototype.writeNumber = function(e, _, t) {
            return this.expand(t), this._buffer["write" + e](_, this.position), this.position += t, this
        }, e.prototype.writeByte = function(e) {
            return this.expand(1), this.writeNumber("UInt8", 255 & e, 1)
        }, e.prototype.writeUInt16 = function(e) {
            return this.expand(2), this.writeNumber("UInt16LE", e >>> 0, 2)
        }, e.prototype.writeInt16 = function(e) {
            return this.expand(2), this.writeNumber("Int16LE", e, 2)
        }, e.prototype.writeUInt32 = function(e) {
            return this.expand(4), this.writeNumber("UInt32LE", e >>> 0, 4)
        }, e.prototype.writeInt32 = function(e) {
            return this.expand(4), this.writeNumber("Int32LE", e, 4)
        }, e.prototype.writeUInt64 = function(e) {
            return this.expand(8), this.writeUInt32(e.getHighBitsUnsigned()), this.writeUInt32(e.getLowBitsUnsigned()), this
        }, e.prototype.writeInt64 = function(e) {
            return this.expand(8), this.writeInt32(e.getHighBits()), this.writeInt32(e.getLowBits()), this
        }, e.prototype.writeFloat = function(e) {
            return this.expand(4), this.writeNumber("FloatLE", e, 4)
        }, e.prototype.writeDouble = function(e) {
            return this.expand(8), this.writeNumber("DoubleLE", e, 8)
        }, e.prototype.writeString = function(e, _, t) {
            void 0 === _ && (_ = "utf8"), void 0 === t && (t = !1), t && (e += "\0");
            var a = Buffer.byteLength(e, _);
            return this.expand(a), this._buffer.write(e, this.position, e.length, _), this.position += a, this
        }, e
    }());
    _.Stream = i;
    var o = function(e) {
        function _(_) {
            return e.call(this, _.getBuffer()) || this
        }
        return t.__extends(_, e), Object.defineProperty(_.prototype, "Position", {
            get: function() {
                return this.position
            },
            set: function(e) {
                this.position = e
            },
            enumerable: !0,
            configurable: !0
        }), Object.defineProperty(_.prototype, "Length", {
            get: function() {
                return this.position
            },
            enumerable: !0,
            configurable: !0
        }), _.prototype.Close = function() {}, Object.defineProperty(_.prototype, "Stream", {
            get: function() {
                return this
            },
            enumerable: !0,
            configurable: !0
        }), Object.defineProperty(_.prototype, "In", {
            get: function() {
                return this
            },
            enumerable: !0,
            configurable: !0
        }), Object.defineProperty(_.prototype, "Out", {
            get: function() {
                return this
            },
            enumerable: !0,
            configurable: !0
        }), _.prototype.SeekTo = function(e, _) {
            void 0 === _ && (_ = r.Begin), this.seek(e, _)
        }, _.prototype.ToArray = function() {
            return this.getBuffer()
        }, _.prototype.Read = function(e, _, t) {
            return this.readBytes(t).copy(e, _)
        }, _.prototype.ReadBytes = function(e) {
            return this.readBytes(e)
        }, _.prototype.ReadInt24 = function() {
            return 16777215 & this.readInt32()
        }, _.prototype.ReadUInt24 = function() {
            return 16777215 & this.readUInt32()
        }, _.prototype.ReadByte = function() {
            return this.readByte()
        }, _.prototype.ReadInt16 = function() {
            return this.readInt16()
        }, _.prototype.ReadUInt16 = function() {
            return this.readUInt16()
        }, _.prototype.ReadInt32 = function() {
            return this.readInt32()
        }, _.prototype.ReadUInt32 = function() {
            return this.readUInt32()
        }, _.prototype.ReadInt64 = function() {
            return this.readInt64()
        }, _.prototype.ReadUInt64 = function() {
            return this.readUInt64()
        }, _.prototype.ReadSingle = function() {
            return this.readFloat()
        }, _.prototype.ReadDouble = function() {
            return this.readDouble()
        }, _.prototype.ReadString = function(e) {
            return this.readString("ascii", e).replace(/\0/, "")
        }, _.prototype.ReadUnicodeString = function(e) {
            return this.readString("utf16le", length / 2).replace(/\0/, "")
        }, _.prototype.ReadAsciiString = function(e) {
            var _ = this.position + e,
                t = this.readString("ascii");
            return this.position = _, t
        }, _.prototype.ReadStringNullTerminated = function() {
            return this.readString("ascii")
        }, _.prototype.ReadNullTerminatedString = function() {
            return this.ReadStringNullTerminated()
        }, _.prototype.ReadUnicodeNullTermString = function() {
            return this.readString("utf16le")
        }, _.prototype.SkipByte = function() {
            this.position++
        }, _.prototype.SkipInt16 = function() {
            this.position += 2
        }, _.prototype.SkipInt32 = function() {
            this.position += 4
        }, _.prototype.SkipInt64 = function() {
            this.position += 8
        }, _.prototype.SeekNPeekByte = function(e) {
            var _ = this.position;
            this.position = e;
            var t = this.readByte();
            return this.position = _, t
        }, _.prototype.PeekByte = function() {
            var e = this.readByte();
            return this.position -= 1, e
        }, _.prototype.PeekInt32 = function() {
            var e = this.readInt32();
            return this.position -= 4, e
        }, _.prototype.PeekUInt32 = function() {
            var e = this.readUInt32();
            return this.position -= 4, e
        }, _.prototype.SeekNReadInt16 = function(e) {
            return this.position = e, this.readInt16()
        }, _.prototype.SeekNReadUInt16 = function(e) {
            return this.position = e, this.readUInt16()
        }, _.prototype.SeekNReadInt32 = function(e) {
            return this.position = e, this.readInt32()
        }, _.prototype.SeekNReadUInt32 = function(e) {
            return this.position = e, this.readUInt32()
        }, _.prototype.SeekNReadInt64 = function(e) {
            return this.position = e, this.readInt64()
        }, _.prototype.SeekNReadUInt64 = function(e) {
            return this.position = e, this.readUInt64()
        }, _.prototype.WriteByte = function(e) {
            this.writeByte(e)
        }, _.prototype.WriteBytes = function(e, _, t) {
            void 0 === _ && (_ = -1), void 0 === t && (t = -1), this.writeBytes(-1 === _ ? e : e.slice(_, _ + t))
        }, _.prototype.WriteInt24 = function(e) {
            e &= 16777215, this.writeBytes(Buffer.from([255 & e, e >> 8 & 255, e >> 16 & 255]))
        }, _.prototype.WriteUInt24 = function(e) {
            this.WriteInt24(e)
        }, _.prototype.StoreByte = function(e, _) {
            void 0 === _ && (_ = this.position);
            var t = this.position;
            this.position = _, this.writeByte(e), this.position = t
        }, _.prototype.WriteUnicodeString = function(e) {
            this.writeString(e, "utf16le")
        }, _.prototype.WriteUnicodeNullTermString = function(e) {
            this.writeString(e, "utf16le", !0)
        }, _.prototype.WriteAsciiString = function(e, _) {
            e.length > _ && (e = e.substr(0, _)), this.writeString(e, "ascii")
        }, _
    }(i);
    _.EndianIO = o
}), define("util/fs", ["require", "exports", "tslib", "./async", "./stream", "electron", "fs"], function(e, _, t, a, r, i, o) {
    "use strict";

    function n(e, _) {
        return t.__awaiter(this, void 0, void 0, function() {
            var a, r, i, o = this;
            return t.__generator(this, function(n) {
                switch (n.label) {
                    case 0:
                        return a = [], i = (r = Promise).all, [4, h.readdirAsync(e)];
                    case 1:
                        return [4, i.apply(r, [n.sent().map(function(r) {
                            return t.__awaiter(o, void 0, void 0, function() {
                                return t.__generator(this, function(t) {
                                    switch (t.label) {
                                        case 0:
                                            return [4, h.statAsync(e + "/" + r)];
                                        case 1:
                                            return t.sent()["is" + _]() && a.push(r), [2]
                                    }
                                })
                            })
                        })])];
                    case 2:
                        return n.sent(), [2, a]
                }
            })
        })
    }

    function l(e) {
        return n(e, "File")
    }

    function s(e) {
        return n(e, "Directory")
    }

    function p(e) {
        return h.statAsync(e)
    }

    function c(e) {
        return h.unlinkAsync(e)
    }

    function d(e, _) {
        return h.readFileAsync(e, _)
    }

    function m(e, _, t) {
        return _ instanceof r.Stream && (_ = _.getBuffer()), h.writeFileAsync(e, _, t)
    }

    function u(e) {
        return new Promise(function(_) {
            return i.remote.dialog.showOpenDialog(i.remote.getCurrentWindow(), e, _)
        })
    }

    function g(e) {
        return new Promise(function(_) {
            return i.remote.dialog.showSaveDialog(i.remote.getCurrentWindow(), e, _)
        })
    }
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var h = a.promisifyAll(o);
    _.getFilesInDirectory = l, _.getSubdirectories = s, _.stat = p, _.unlink = c, _.readFile = d, _.writeFile = m, _.openFileDialog = u, _.saveFileDialog = g
}), define("storage/local/local-save-storage", ["require", "exports", "tslib", "../../util/fs", "path"], function(e, _, t, a, r) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var i = function() {
        function e() {
            this.dir = localStorage.getItem("localSaves")
        }
        return Object.defineProperty(e.prototype, "directory", {
            get: function() {
                return this.dir
            },
            set: function(e) {
                e ? localStorage.setItem("localSaves", e) : localStorage.removeItem("localSaves")
            },
            enumerable: !0,
            configurable: !0
        }), e.prototype.getTitles = function() {
            return t.__awaiter(this, void 0, void 0, function() {
                var e, _, i, o = this;
                return t.__generator(this, function(n) {
                    switch (n.label) {
                        case 0:
                            return this.dir ? (e = [], i = (_ = Promise).all, [4, a.getSubdirectories(this.dir)]) : [2, []];
                        case 1:
                            return [4, i.apply(_, [n.sent().map(function(_) {
                                return t.__awaiter(o, void 0, void 0, function() {
                                    var a, i, o;
                                    return t.__generator(this, function(t) {
                                        return a = r.join(this.dir, _), i = _.split("-"), i.length < 2 ? [2] : (o = i.shift().trim(), e.push({
                                            dir: a,
                                            scid: i.join("-").trim(),
                                            name: o,
                                            imageUrl: "/static/images/logo.svg"
                                        }), [2])
                                    })
                                })
                            })])];
                        case 2:
                            return n.sent(), [2, e]
                    }
                })
            })
        }, e.prototype.findTitle = function(e) {
            return t.__awaiter(this, void 0, void 0, function() {
                var _;
                return t.__generator(this, function(t) {
                    switch (t.label) {
                        case 0:
                            return [4, this.getTitles()];
                        case 1:
                            if (!(_ = t.sent().find(function(_) {
                                    return _.scid === e
                                }))) throw new Error("Title not found.");
                            return [2, _]
                    }
                })
            })
        }, e.prototype.getContainers = function(e) {
            return t.__awaiter(this, void 0, void 0, function() {
                var _, i, o, n, l, s = this;
                return t.__generator(this, function(p) {
                    switch (p.label) {
                        case 0:
                            return p.trys.push([0, 2, , 3]), [4, this.findTitle(e)];
                        case 1:
                            return _ = p.sent(), [3, 3];
                        case 2:
                            return i = p.sent(), [2, []];
                        case 3:
                            return o = [], l = (n = Promise).all, [4, a.getSubdirectories(_.dir)];
                        case 4:
                            return [4, l.apply(n, [p.sent().map(function(e) {
                                return t.__awaiter(s, void 0, void 0, function() {
                                    var i, n, l, s, p, c = this;
                                    return t.__generator(this, function(d) {
                                        switch (d.label) {
                                            case 0:
                                                return i = r.join(_.dir, e), [4, a.stat(i)];
                                            case 1:
                                                return n = d.sent(), l = {
                                                    name: decodeURIComponent(e),
                                                    size: 0,
                                                    modifiedAt: n.mtime.toISOString(),
                                                    files: []
                                                }, p = (s = Promise).all, [4, a.getFilesInDirectory(i)];
                                            case 2:
                                                return [4, p.apply(s, [d.sent().map(function(e) {
                                                    return t.__awaiter(c, void 0, void 0, function() {
                                                        var _, o;
                                                        return t.__generator(this, function(t) {
                                                            switch (t.label) {
                                                                case 0:
                                                                    return _ = r.join(i, e), [4, a.stat(_)];
                                                                case 1:
                                                                    return o = t.sent(), l.size += o.size, l.files.push({
                                                                        container: l,
                                                                        name: decodeURIComponent(e),
                                                                        size: o.size
                                                                    }), [2]
                                                            }
                                                        })
                                                    })
                                                })])];
                                            case 3:
                                                return d.sent(), o.push(l), [2]
                                        }
                                    })
                                })
                            })])];
                        case 5:
                            return p.sent(), [2, o]
                    }
                })
            })
        }, e.prototype.buildFilePath = function(e, _, t) {
            return r.join(e.dir, encodeURIComponent(_), encodeURIComponent(t))
        }, e.prototype.readFile = function(e, _, r) {
            return t.__awaiter(this, void 0, void 0, function() {
                var i, o;
                return t.__generator(this, function(t) {
                    switch (t.label) {
                        case 0:
                            return i = a.readFile, o = this.buildFilePath, [4, this.findTitle(e)];
                        case 1:
                            return [4, i.apply(void 0, [o.apply(this, [t.sent(), _, r])])];
                        case 2:
                            return [2, t.sent()]
                    }
                })
            })
        }, e.prototype.writeFile = function(e, _, r, i) {
            return t.__awaiter(this, void 0, void 0, function() {
                var o, n;
                return t.__generator(this, function(t) {
                    switch (t.label) {
                        case 0:
                            return o = a.writeFile, n = this.buildFilePath, [4, this.findTitle(e)];
                        case 1:
                            return [4, o.apply(void 0, [n.apply(this, [t.sent(), _, r]), i])];
                        case 2:
                            return t.sent(), [2]
                    }
                })
            })
        }, e.prototype.deleteFile = function(e, _, r) {
            return t.__awaiter(this, void 0, void 0, function() {
                var i, o;
                return t.__generator(this, function(t) {
                    switch (t.label) {
                        case 0:
                            return i = a.unlink, o = this.buildFilePath, [4, this.findTitle(e)];
                        case 1:
                            return [4, i.apply(void 0, [o.apply(this, [t.sent(), _, r])])];
                        case 2:
                            return t.sent(), [2]
                    }
                })
            })
        }, e
    }();
    _.LocalSaveStorage = i
}), define("editor/save-editor", ["require", "exports"], function(e, _) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    })
}), define("editor/editor", ["require", "exports", "tslib", "aurelia-framework", "../storage/cloud/cloud-save-storage", "../storage/local/local-save-storage", "./titles", "../util/stream", "../auth/auth", "../environment", "./titles"], function(e, _, t, a, r, i, o, n, l, s, p) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var c = function() {
        function e(e, _, t) {
            this.auth = e, this.cloudStorage = _, this.localStorage = t, this.editorLoaded = !1, this.fileSelectorOpen = !1, this.isTestEditor = !1
        }
        return e.prototype.activate = function(e) {
            return t.__awaiter(this, void 0, void 0, function() {
                var _ = this;
                return t.__generator(this, function(t) {
                    return this.isTestEditor = e.scid === o.testTitle.scid, this.title = this.isTestEditor ? o.testTitle : p.default.find(function(_) {
                        return _.scid === e.scid
                    }), this.editor = this.title.editors[parseInt(e.index)], s.default.debug, this.refreshContainers(), this.authListener = this.auth.onGamerChanged(function() {
                        return _.refreshContainers()
                    }), [2]
                })
            })
        }, e.prototype.deactivate = function() {
            this.authListener.dispose()
        }, e.prototype.refreshContainers = function() {
            return t.__awaiter(this, void 0, void 0, function() {
                var e, _ = this;
                return t.__generator(this, function(a) {
                    switch (a.label) {
                        case 0:
                            this.selectedFile = null, this.editorLoaded = !1, this.containers = [], a.label = 1;
                        case 1:
                            return a.trys.push([1, 3, , 4]), [4, this.executeWithStatus(function() {
                                return t.__awaiter(_, void 0, void 0, function() {
                                    var e;
                                    return t.__generator(this, function(_) {
                                        switch (_.label) {
                                            case 0:
                                                return [4, this.cloudStorage.getContainers(this.title.scid)];
                                            case 1:
                                                return e = _.sent(), this.containers = this.removeUnsupportedFiles(e).filter(function(e) {
                                                    return 0 !== e.files.length
                                                }), [2]
                                        }
                                    })
                                })
                            }, "reading")];
                        case 2:
                            return a.sent(), [3, 4];
                        case 3:
                            throw e = a.sent(), alert("An error occurred while reading your saves from the cloud."), e;
                        case 4:
                            return [2]
                    }
                })
            })
        }, e.prototype.load = function(e) {
            return t.__awaiter(this, void 0, void 0, function() {
                var _, a = this;
                return t.__generator(this, function(r) {
                    switch (r.label) {
                        case 0:
                            if (this.fileSelectorOpen = !1, this.editorLoaded && this.selectedFile === e) return [2];
                            this.editorLoaded = !1, this.selectedFile = e, r.label = 1;
                        case 1:
                            return r.trys.push([1, 3, , 4]), [4, this.executeWithStatus(function() {
                                return t.__awaiter(a, void 0, void 0, function() {
                                    var e;
                                    return t.__generator(this, function(_) {
                                        switch (_.label) {
                                            case 0:
                                                return [4, this.cloudStorage.readFile(this.title.scid, this.selectedFile.container.name, this.selectedFile.name)];
                                            case 1:
                                                return e = _.sent(), [4, this.editorElement.currentViewModel.load(e instanceof Buffer ? new n.Stream(e) : e)];
                                            case 2:
                                                return _.sent(), this.editorLoaded = !0, [2]
                                        }
                                    })
                                })
                            }, "loading")];
                        case 2:
                            return r.sent(), [3, 4];
                        case 3:
                            throw _ = r.sent(), this.selectedFile = null, alert("An error occurred while loading your save."), _;
                        case 4:
                            return [2]
                    }
                })
            })
        }, e.prototype.removeUnsupportedFiles = function(e) {
            var _ = this;
            return this.editor.fileFilter && ("string" == typeof this.editor.fileFilter ? e.forEach(function(e) {
                return e.files = e.files.filter(function(e) {
                    return e.name === _.editor.fileFilter
                })
            }) : this.editor.fileFilter instanceof RegExp ? e.forEach(function(e) {
                return e.files = e.files.filter(function(e) {
                    return e.name.match(_.editor.fileFilter)
                })
            }) : e.forEach(function(e) {
                return e.files = e.files.filter(function(t) {
                    return _.editor.fileFilter(t, e)
                })
            })), e
        }, e.prototype.save = function() {
            return t.__awaiter(this, void 0, void 0, function() {
                var e, _, a;
                return t.__generator(this, function(t) {
                    switch (t.label) {
                        case 0:
                            if (!this.editorLoaded) return [2];
                            t.label = 1;
                        case 1:
                            return t.trys.push([1, 3, , 4]), [4, this.executeWithStatus(this.getBuffer(), "saving")];
                        case 2:
                            return e = t.sent(), [3, 4];
                        case 3:
                            throw _ = t.sent(), alert("An error occurred while saving your data. Your changes have NOT been synced to the cloud."), _;
                        case 4:
                            return t.trys.push([4, 6, , 7]), [4, this.executeWithStatus(this.uploadSave(e), "saving")];
                        case 5:
                            return t.sent(), [3, 7];
                        case 6:
                            throw a = t.sent(), alert("An error occurred while syncing your save to the cloud."), a;
                        case 7:
                            return [2]
                    }
                })
            })
        }, e.prototype.getBuffer = function() {
            return t.__awaiter(this, void 0, void 0, function() {
                var e;
                return t.__generator(this, function(_) {
                    switch (_.label) {
                        case 0:
                            return [4, this.editorElement.currentViewModel.save()];
                        case 1:
                            return e = _.sent(), e instanceof n.Stream ? [2, e.getBuffer()] : e instanceof Buffer ? [2, e] : [2, Buffer.from(JSON.stringify(e), "utf8")]
                    }
                })
            })
        }, e.prototype.uploadSave = function(e) {
            return this.cloudStorage.writeFile(this.title.scid, this.selectedFile.container.name, this.selectedFile.name, e)
        }, e.prototype.executeWithStatus = function(e, _) {
            return t.__awaiter(this, void 0, void 0, function() {
                return t.__generator(this, function(t) {
                    switch (t.label) {
                        case 0:
                            if (this.status) return [2, !1];
                            this.status = _, t.label = 1;
                        case 1:
                            return t.trys.push([1, , 6, 7]), e instanceof Promise ? [4, e] : [3, 3];
                        case 2:
                            return [2, t.sent()];
                        case 3:
                            return [4, e()];
                        case 4:
                            return [2, t.sent()];
                        case 5:
                            return [3, 7];
                        case 6:
                            return this.status = null, [7];
                        case 7:
                            return [2]
                    }
                })
            })
        }, e
    }();
    c = t.__decorate([a.inject(l.Auth, r.CloudSaveStorage, i.LocalSaveStorage), t.__metadata("design:paramtypes", [l.Auth, r.CloudSaveStorage, i.LocalSaveStorage])], c), _.Editor = c
}), define("resources/index", ["require", "exports"], function(e, _) {
    "use strict";

    function t(e) {
        e.globalResources(["./elements/inline-svg", "./elements/status-ring.html", "./elements/status-tip.html", "./custom-attributes/close-if-click-outside", "./value-converters/env", "./value-converters/array", "./value-converters/number", "./value-converters/object", "./value-converters/time"])
    }
    Object.defineProperty(_, "__esModule", {
        value: !0
    }), _.configure = t
}), define("util/crypto", ["require", "exports", "crc-32"], function(e, _, t) {
    "use strict";

    function a(e, _, a, r) {
        return void 0 === _ && (_ = 0), void 0 === a && (a = -1), 0 === _ && -1 !== a || (-1 === a && (a = e.length - _), e = e.slice(_, _ + a)), new Uint32Array([t.buf(e, r)])[0]
    }

    function r(e, _) {
        void 0 === _ && (_ = 1);
        for (var t = 65535 & _, a = _ >>> 16 & 65535, r = 0, i = e.length; i > 0;) {
            var o = Math.min(i, 3800);
            for (i -= o; --o >= 0;) t += 255 & e[r++], a += t;
            t %= 65521, a %= 65521
        }
        return (a << 16 | t) >>> 0
    }

    function i(e, _, t) {
        for (var a = 0, r = e; a < r.length; a++) {
            _ ^= r[a].charCodeAt(0), _ = Math.imul(_, t)
        }
        return _ >>> 0
    }
    Object.defineProperty(_, "__esModule", {
        value: !0
    }), _.crc32 = a, _.adler32 = r, _.fnv0 = i
}), define("welcome/welcome", ["require", "exports", "tslib", "aurelia-framework", "../auth/auth"], function(e, _, t, a, r) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var i = function() {
        function e(e) {
            this.auth = e
        }
        return e
    }();
    i = t.__decorate([a.inject(r.Auth), t.__metadata("design:paramtypes", [r.Auth])], i), _.Welcome = i
}), define("editor/resources/index", ["require", "exports"], function(e, _) {
    "use strict";

    function t(e) {
        e.globalResources(["./elements/v-button", "./elements/v-number", "./elements/v-selection", "./elements/v-slider", "./elements/v-switch", "./elements/v-text", "./elements/v-tree", "./elements/card.html"])
    }
    Object.defineProperty(_, "__esModule", {
        value: !0
    }), _.configure = t
}), define("resources/custom-attributes/close-if-click-outside", ["require", "exports", "tslib", "aurelia-dialog", "aurelia-framework"], function(e, _, t, a, r) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var i = function() {
        function e(e, _) {
            this.element = e, this.dialogService = _, this.closeIfClickOutside = this.closeIfClickOutside.bind(this)
        }
        return e.prototype.unbind = function() {
            document.removeEventListener("click", this.closeIfClickOutside)
        }, e.prototype.valueChanged = function() {
            this.value ? document.addEventListener("click", this.closeIfClickOutside) : document.removeEventListener("click", this.closeIfClickOutside)
        }, e.prototype.closeIfClickOutside = function(e) {
            if (!this.dialogService.hasActiveDialog && !this.element.contains(e.target)) {
                for (var _ = e.target; _.parentNode;)
                    if (_ = _.parentNode, 11 == _.nodeType) return;
                this.value = !1
            }
        }, e
    }();
    i = t.__decorate([r.inject(Element, a.DialogService), r.noView, t.__metadata("design:paramtypes", [Element, a.DialogService])], i), _.CloseIfClickOutsideCustomAttribute = i
}), define("resources/elements/inline-svg", ["require", "exports", "tslib", "aurelia-framework", "aurelia-http-client", "../../util/async"], function(e, _, t, a, r, i) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var o = new Map,
        n = new Map,
        l = function() {
            function e(e, _) {
                this.el = e, this.http = _, this.isAttached = !1
            }
            return e.prototype.attached = function() {
                var e = this;
                if (this.isAttached = !0, this.src) {
                    var _ = n.get(this.src);
                    if (_) return _.await().then(function() {
                        return e.setDomIfAttached(e.src)
                    });
                    this.setDomIfAttached(this.src)
                }
            }, e.prototype.detached = function() {
                this.isAttached = !1
            }, e.prototype.setDomIfAttached = function(e) {
                var _ = this.el.parentNode;
                this.isAttached && _ && (_.innerHTML = o.get(e) || "")
            }, e.prototype.isPathAbsolute = function(e) {
                return e.startsWith("https://") || e.startsWith("http://") || e.startsWith("file://") || e.startsWith("/")
            }, e.prototype.srcChanged = function(e) {
                if (e) {
                    if (o.has(e)) return void this.setDomIfAttached(e);
                    if (!n.has(e)) {
                        var _ = this.isPathAbsolute(e) ? e : "static/images/" + e;
                        n.set(e, new i.MultiPromise(this.http.createRequest(_).asGet().withResponseType("text").send().then(function(_) {
                            n.delete(e), _.isSuccess && o.set(e, _.content)
                        })))
                    }
                }
            }, e
        }();
    t.__decorate([a.bindable, t.__metadata("design:type", String)], l.prototype, "src", void 0), l = t.__decorate([a.containerless(), a.inlineView("<template></template>"), a.customElement("inline-svg"), a.inject(Element, r.HttpClient), t.__metadata("design:paramtypes", [HTMLElement, r.HttpClient])], l), _.InlineSvgCustomElement = l
}), define("resources/elements/number-input", ["require", "exports", "tslib", "aurelia-framework"], function(e, _, t, a) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var r = function() {
        function e() {}
        return e.prototype.matchPrecision = function(e, _) {
            var t = (e.toString().split(".")[1] || []).length;
            return t > 0 ? parseFloat(_.toPrecision(t)) : _
        }, e.prototype.add = function() {
            this.value = parseFloat(this.value.toString()), this.value += this.step, this.value = this.matchPrecision(this.step, this.value), this.value > this.max && (this.value = this.max)
        }, e.prototype.subtract = function() {
            this.value = parseFloat(this.value.toString()), this.value -= this.step, this.value = this.matchPrecision(this.step, this.value), this.value < this.min && (this.value = this.min)
        }, e
    }();
    t.__decorate([a.bindable, t.__metadata("design:type", Number)], r.prototype, "value", void 0), t.__decorate([a.bindable, t.__metadata("design:type", Number)], r.prototype, "min", void 0), t.__decorate([a.bindable, t.__metadata("design:type", Number)], r.prototype, "max", void 0), t.__decorate([a.bindable, t.__metadata("design:type", Number)], r.prototype, "step", void 0), t.__decorate([a.bindable, t.__metadata("design:type", Boolean)], r.prototype, "disabled", void 0), _.NumberInput = r
}), define("resources/elements/selection-input", ["require", "exports", "tslib", "aurelia-framework"], function(e, _, t, a) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var r = function() {
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
        }, e
    }();
    t.__decorate([a.bindable, t.__metadata("design:type", String)], r.prototype, "value", void 0), t.__decorate([a.bindable, t.__metadata("design:type", Array)], r.prototype, "options", void 0), t.__decorate([a.bindable, t.__metadata("design:type", Boolean)], r.prototype, "disabled", void 0), r = t.__decorate([a.inject(Element), t.__metadata("design:paramtypes", [HTMLElement])], r), _.SelectionInput = r
}), define("resources/value-converters/array", ["require", "exports"], function(e, _) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var t = function() {
        function e() {}
        return e.prototype.toView = function(e, _, t) {
            return e ? e.map(function(e) {
                return e.hasOwnProperty(_) ? e[_] : t
            }) : []
        }, e
    }();
    _.PluckValueConverter = t;
    var a = function() {
        function e() {}
        return e.prototype.toView = function(e, _) {
            return e && 0 != e.length ? e.slice(0, _) : []
        }, e
    }();
    _.TakeValueConverter = a;
    var r = function() {
        function e() {}
        return e.prototype.toView = function(e, _) {
            return e && 0 !== e.length ? _ ? "number" == typeof e[0][_] ? e.sort(function(e, t) {
                return e[_] > t[_] ? 1 : e[_] < t[_] ? -1 : 0
            }) : e.sort(function(e, t) {
                return e[_] && t[_] ? e[_].toString().localeCompare(t[_].toString()) : 0
            }) : e.sort() : []
        }, e
    }();
    _.SortValueConverter = r;
    var i = function() {
        function e() {}
        return e.prototype.toView = function(e, _) {
            return void 0 === _ && (_ = ","), e ? e.join(_).replace(/\r/g, "") : ""
        }, e.prototype.fromView = function(e, _) {
            return void 0 === _ && (_ = ","), e ? e.replace(/\r/g, "").split(_) : []
        }, e
    }();
    _.StringArrayValueConverter = i
}), define("resources/value-converters/env", ["require", "exports", "../../environment"], function(e, _, t) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var a = function() {
        function e() {}
        return e.prototype.toView = function(e, _, a) {
            var r = !!t.default[e];
            return void 0 === _ ? r : r ? _ : a
        }, e
    }();
    _.EnvValueConverter = a
}), define("resources/value-converters/number", ["require", "exports"], function(e, _) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var t = function() {
        function e() {}
        return e.prototype.toView = function(e) {
            return e.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,")
        }, e.prototype.fromView = function(e) {
            return parseFloat(e.replace(/,/, ""))
        }, e
    }();
    _.NumberWithCommasValueConverter = t;
    var a = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        r = function() {
            function e() {}
            return e.prototype.toView = function(e, _) {
                if (void 0 === _ && (_ = 2), 0 === e) return "0 " + a[0];
                var t = Math.floor(Math.log(e) / Math.log(1024));
                return parseFloat((e / Math.pow(1024, t)).toFixed(_)) + " " + a[t]
            }, e
        }();
    _.ByteFormatValueConverter = r
}), define("resources/value-converters/object", ["require", "exports"], function(e, _) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var t = function() {
        function e() {}
        return e.prototype.toView = function(e) {
            return e ? Object.getOwnPropertyNames(e).filter(function(e) {
                return !e.startsWith("__")
            }) : []
        }, e
    }();
    _.ObjectKeysValueConverter = t
}), define("resources/value-converters/time", ["require", "exports", "moment"], function(e, _, t) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var a = function() {
        function e() {}
        return e.prototype.toView = function(e, _, a) {
            return e ? t(e).format(_ || "MMMM DD, YYYY") : a
        }, e
    }();
    _.FriendlyDateValueConverter = a;
    var r = function() {
        function e() {}
        return e.prototype.toView = function(e, _) {
            return e ? t.utc(e).fromNow() : _ || ""
        }, e
    }();
    _.RelativeTimeValueConverter = r
}), define("app/resources/elements/app-header", ["require", "exports"], function(e, _) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var t = function() {
        function e() {}
        return e
    }();
    _.AppHeader = t
}), define("app/resources/elements/donation", ["require", "exports", "electron"], function(e, _, t) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var a = function() {
        function e() {
            this.disabled = !1
        }
        return e.prototype.visit = function() {
            var e = this;
            this.disabled || (this.disabled = !0, t.remote.shell.openExternal("https://www.patreon.com/vantage"), setTimeout(function() {
                return e.disabled = !1
            }, 1e3))
        }, e
    }();
    _.Donation = a
}), define("app/resources/elements/games", ["require", "exports", "tslib", "aurelia-router", "aurelia-framework", "../../../editor/titles"], function(e, _, t, a, r, i) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var o = function() {
        function e(e) {
            this.router = e, this.titles = i.default
        }
        return e
    }();
    o = t.__decorate([r.inject(a.Router), t.__metadata("design:paramtypes", [a.Router])], o), _.GamesCustomElement = o
}), define("app/resources/elements/profile", ["require", "exports", "tslib", "../../../util/dialog", "aurelia-framework", "../../../auth/auth"], function(e, _, t, a, r, i) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var o = function() {
        function e(e) {
            this.auth = e
        }
        return e.prototype.signOut = function() {
            return t.__awaiter(this, void 0, void 0, function() {
                return t.__generator(this, function(e) {
                    switch (e.label) {
                        case 0:
                            return [4, a.showYesNoDialog("Are you sure you want to sign out?")];
                        case 1:
                            return e.sent() && this.auth.signOut(), [2]
                    }
                })
            })
        }, e
    }();
    o = t.__decorate([r.inject(i.Auth), t.__metadata("design:paramtypes", [i.Auth])], o), _.ProfileCustomElement = o
}), define("app/resources/elements/storage-explorer", ["require", "exports", "tslib", "../../../util/fs", "../../../storage/cloud/cloud-save-storage", "../../../auth/auth", "aurelia-framework", "electron"], function(e, _, t, a, r, i, o, n) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var l = function() {
        function e(e, _) {
            this.cloud = e, this.auth = _, this.opened = !1, this.containers = {}, this.expandedContainers = {}, this.expandedTitles = {}, this.isDownloading = !1, this.isUploading = !1
        }
        return e.prototype.toggle = function() {
            return t.__awaiter(this, void 0, void 0, function() {
                return t.__generator(this, function(e) {
                    switch (e.label) {
                        case 0:
                            return this.opened ? (this.opened = !1, [3, 3]) : [3, 1];
                        case 1:
                            return [4, this.auth.signIn()];
                        case 2:
                            e.sent() && (this.opened = !0), e.label = 3;
                        case 3:
                            return [2]
                    }
                })
            })
        }, e.prototype.toggleTitle = function(e) {
            return t.__awaiter(this, void 0, void 0, function() {
                var _, a;
                return t.__generator(this, function(t) {
                    switch (t.label) {
                        case 0:
                            return this.expandedTitles[e] = !this.expandedTitles[e], this.containers[e] ? [3, 2] : (_ = this.containers, a = e, [4, this.cloud.getContainers(e)]);
                        case 1:
                            _[a] = t.sent(), t.label = 2;
                        case 2:
                            return [2]
                    }
                })
            })
        }, e.prototype.toggleContainer = function(e, _) {
            var t = e + "." + _.name;
            this.expandedContainers[t] = !this.expandedContainers[t]
        }, e.prototype.saveAs = function(e, _, r) {
            var i = this;
            n.remote.dialog.showSaveDialog({
                defaultPath: r.name
            }, function(o) {
                return t.__awaiter(i, void 0, void 0, function() {
                    var i, n, l;
                    return t.__generator(this, function(t) {
                        switch (t.label) {
                            case 0:
                                if (!o) return [2];
                                this.isDownloading = !0, t.label = 1;
                            case 1:
                                return t.trys.push([1, 4, 5, 6]), i = a.writeFile, n = [o], [4, this.cloud.readFile(e, _.name, r.name)];
                            case 2:
                                return [4, i.apply(void 0, n.concat([t.sent()]))];
                            case 3:
                                return t.sent(), [3, 6];
                            case 4:
                                throw l = t.sent(), alert("An error occurred while downloading your file."), l;
                            case 5:
                                return this.isDownloading = !1, [7];
                            case 6:
                                return [2]
                        }
                    })
                })
            })
        }, e.prototype.replace = function(e, _, r) {
            var i = this;
            n.remote.dialog.showOpenDialog({
                defaultPath: r.name
            }, function(o) {
                return t.__awaiter(i, void 0, void 0, function() {
                    var i, n;
                    return t.__generator(this, function(t) {
                        switch (t.label) {
                            case 0:
                                if (!o || !o[0]) return [2];
                                this.isUploading = !0, t.label = 1;
                            case 1:
                                return t.trys.push([1, 4, 5, 6]), [4, a.readFile(o[0])];
                            case 2:
                                return i = t.sent(), [4, this.cloud.writeFile(e, _.name, r.name, i)];
                            case 3:
                                return t.sent(), _.size = _.size - r.size + i.length, r.size = i.length, [3, 6];
                            case 4:
                                throw n = t.sent(), alert("An error occurred while uploading your file."), n;
                            case 5:
                                return this.isUploading = !1, [7];
                            case 6:
                                return [2]
                        }
                    })
                })
            })
        }, e
    }();
    l = t.__decorate([o.inject(r.CloudSaveStorage, i.Auth), t.__metadata("design:paramtypes", [r.CloudSaveStorage, i.Auth])], l), _.StorageExplorer = l
}), define("app/resources/elements/support", ["require", "exports", "electron"], function(e, _, t) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var a = function() {
        function e() {
            this.disabled = !1
        }
        return e.prototype.visit = function() {
            var e = this;
            this.disabled || (this.disabled = !0, t.remote.shell.openExternal("https://www.thetechgame.com/Forums/t=7706816/first-ever-xbox-one-saved-game-mods-teaser-team-vantage.html"), setTimeout(function() {
                return e.disabled = !1
            }, 1e3))
        }, e
    }();
    _.Support = a
}), define("app/resources/elements/window-controls", ["require", "exports", "electron"], function(e, _, t) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var a = function() {
        function e() {
            var e = this;
            this.addIpcListener("main-window-state", function() {
                return e.refresh()
            }), this.refresh()
        }
        return e.prototype.addIpcListener = function(e, _) {
            t.ipcRenderer.removeAllListeners(e), t.ipcRenderer.addListener(e, _)
        }, e.prototype.refresh = function() {
            var e = t.remote.getCurrentWindow();
            this.minimized = e.isMinimized(), this.maximized = e.isMaximized()
        }, e.prototype.minimize = function() {
            t.remote.getCurrentWindow().minimize()
        }, e.prototype.maximize = function() {
            t.remote.getCurrentWindow().maximize()
        }, e.prototype.restore = function() {
            t.remote.getCurrentWindow().unmaximize()
        }, e.prototype.close = function() {
            t.remote.getCurrentWindow().close()
        }, e
    }();
    _.WindowControlsCustomElement = a
}), define("editor/resources/elements/v-button", ["require", "exports", "tslib", "aurelia-framework"], function(e, _, t, a) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var r = function() {
        function e() {}
        return e
    }();
    t.__decorate([a.bindable, t.__metadata("design:type", Boolean)], r.prototype, "disabled", void 0), _.VButtonCustomElement = r
}), define("editor/resources/elements/v-number", ["require", "exports", "tslib", "aurelia-framework"], function(e, _, t, a) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var r = function() {
        function e() {
            this.placeholder = ""
        }
        return e.prototype.matchPrecision = function(e, _) {
            var t = (e.toString().split(".")[1] || []).length;
            return t > 0 ? parseFloat(_.toPrecision(t)) : _
        }, e.prototype.getValue = function() {
            return void 0 === this.value || null === this.value || Number.isNaN(this.value) ? parseFloat(this.placeholder) : this.value
        }, e.prototype.increase = function() {
            var e = this.getValue();
            Number.isNaN(e) || (this.value = this.matchPrecision(this.step, parseFloat(e.toString()) + this.step), this.value > this.max && (this.value = this.max))
        }, e.prototype.decrease = function() {
            var e = this.getValue();
            Number.isNaN(e) || (this.value = this.matchPrecision(this.step, parseFloat(e.toString()) - this.step), this.value < this.min && (this.value = this.min))
        }, e
    }();
    t.__decorate([a.bindable({
        defaultBindingMode: a.bindingMode.twoWay
    }), t.__metadata("design:type", Number)], r.prototype, "value", void 0), t.__decorate([a.bindable, t.__metadata("design:type", String)], r.prototype, "placeholder", void 0), t.__decorate([a.bindable, t.__metadata("design:type", Number)], r.prototype, "min", void 0), t.__decorate([a.bindable, t.__metadata("design:type", Number)], r.prototype, "max", void 0), t.__decorate([a.bindable, t.__metadata("design:type", Number)], r.prototype, "step", void 0), _.VNumberCustomElement = r
}), define("editor/resources/elements/v-selection", ["require", "exports", "tslib", "aurelia-framework"], function(e, _, t, a) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var r = function() {
        function e() {
            this.open = !1
        }
        return e.prototype.bind = function() {
            this.valueChanged()
        }, e.prototype.select = function(e) {
            this.selectedOption = e, this.open = !1
        }, e.prototype.selectedOptionChanged = function() {
            this.value = this.selectedOption.value
        }, e.prototype.valueChanged = function() {
            var e = this;
            this.selectedOption = this.options.find(function(_) {
                return e.value == _.value
            })
        }, e
    }();
    t.__decorate([a.bindable({
        defaultBindingMode: a.bindingMode.twoWay
    }), t.__metadata("design:type", Object)], r.prototype, "value", void 0), t.__decorate([a.bindable, t.__metadata("design:type", Array)], r.prototype, "options", void 0), t.__decorate([a.observable, t.__metadata("design:type", Object)], r.prototype, "selectedOption", void 0), _.VSelectionCustomElement = r
}), define("editor/resources/elements/v-slider", ["require", "exports", "tslib", "aurelia-framework"], function(e, _, t, a) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var r = function() {
        function e(e) {
            this.element = e, this.rangeValue = Number.NaN
        }
        return e.prototype.rangeValueChanged = function() {
            this.isValid(this.rangeValue) && (this.isValid(this.value) || this.isValid(this.placeholder) ? this.rangeValue !== this.placeholder && (this.value = this.rangeValue) : this.placeholder = this.rangeValue), this.refreshLabel()
        }, e.prototype.valueChanged = function() {
            this.isValid(this.value) ? this.rangeValue = this.value : this.rangeValue = this.placeholder, this.refreshLabel()
        }, e.prototype.refreshLabel = function() {
            if (this.labelElement && this.isValid(this.rangeValue) && (this.labelElement.style.marginLeft = (this.rangeValue - this.min) / (this.max - this.min) * 100 + "%", this.label = this.rangeValue.toString(), -1 === this.label.indexOf("."))) {
                var e = this.step.toString(),
                    _ = e.indexOf("."); - 1 !== _ && (this.label += "." + "0".repeat(e.length - _ - 1))
            }
        }, e.prototype.isValid = function(e) {
            return void 0 !== e && null !== e && !Number.isNaN(e)
        }, e
    }();
    t.__decorate([a.bindable({
        defaultBindingMode: a.bindingMode.twoWay
    }), t.__metadata("design:type", Number)], r.prototype, "value", void 0), t.__decorate([a.bindable, t.__metadata("design:type", Number)], r.prototype, "placeholder", void 0), t.__decorate([a.bindable, t.__metadata("design:type", Number)], r.prototype, "min", void 0), t.__decorate([a.bindable, t.__metadata("design:type", Number)], r.prototype, "max", void 0), t.__decorate([a.bindable, t.__metadata("design:type", Number)], r.prototype, "step", void 0), t.__decorate([a.bindable, t.__metadata("design:type", Object)], r.prototype, "rangeValue", void 0), r = t.__decorate([a.inject(Element), t.__metadata("design:paramtypes", [Element])], r), _.VSliderCustomElement = r
}), define("editor/resources/elements/v-switch", ["require", "exports", "tslib", "aurelia-framework"], function(e, _, t, a) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var r = function() {
        function e() {}
        return e
    }();
    t.__decorate([a.bindable({
        defaultBindingMode: a.bindingMode.twoWay
    }), t.__metadata("design:type", Boolean)], r.prototype, "value", void 0), _.VSwitchCustomElement = r
}), define("editor/resources/elements/v-text", ["require", "exports", "tslib", "aurelia-framework"], function(e, _, t, a) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var r = function() {
        function e() {}
        return e
    }();
    t.__decorate([a.bindable({
        defaultBindingMode: a.bindingMode.twoWay
    }), t.__metadata("design:type", String)], r.prototype, "value", void 0), t.__decorate([a.bindable, t.__metadata("design:type", String)], r.prototype, "placeholder", void 0), t.__decorate([a.bindable, t.__metadata("design:type", String)], r.prototype, "style", void 0), _.VTextCustomElement = r
}), define("editor/resources/elements/v-tree", ["require", "exports", "tslib", "aurelia-framework"], function(e, _, t, a) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var r = function() {
        function e() {}
        return e.prototype.filterNodesRecursive = function(e, _, t) {
            var a = this;
            return _ && _.forEach(function(r) {
                e(r) && t.push(r), a.filterNodesRecursive(e, _, t)
            }), t
        }, e.prototype.filterNodes = function(e) {
            return this.filterNodesRecursive(e, this.nodes, [])
        }, e.prototype.findNodeRecursive = function(e, _) {
            if (!_) return null;
            for (var t = 0, a = _; t < a.length; t++) {
                var r = a[t];
                if (e(r)) return r;
                var i = this.findNodeRecursive(e, r.nodes);
                if (i) return i
            }
            return null
        }, e.prototype.findNode = function(e) {
            return this.findNodeRecursive(e, this.nodes)
        }, e.prototype.findNodeById = function(e) {
            return this.findNode(function(_) {
                return _.id === e
            })
        }, e.prototype.findNodeByPathRecursive = function(e, _) {
            if (!_ || !_.length || !e) return null;
            var t = _.shift(),
                a = e.find(function(e) {
                    return e.id === t
                });
            if (!a) return null;
            if (!_.length) return a;
            for (var r = 0, i = e; r < i.length; r++) {
                var o = i[r],
                    n = this.findNodeByPathRecursive(o.nodes, _);
                if (n) return n
            }
            return null
        }, e.prototype.findNodeByPath = function(e) {
            return this.findNodeByPathRecursive(this.nodes, "string" == typeof e ? e.split(".") : e)
        }, e
    }();
    t.__decorate([a.bindable({
        defaultBindingMode: a.bindingMode.twoWay
    }), t.__metadata("design:type", Array)], r.prototype, "nodes", void 0), _.VTreeCustomElement = r
}), define("editor/resources/elements/v-tree-node", ["require", "exports", "tslib", "aurelia-framework"], function(e, _, t, a) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var r = function() {
        function e(e) {
            this.element = e, this.expanded = !1
        }
        return e.prototype.toggle = function() {
            this.expanded = !this.expanded
        }, e
    }();
    t.__decorate([a.bindable({
        defaultBindingMode: a.bindingMode.twoWay
    }), t.__metadata("design:type", Object)], r.prototype, "node", void 0), r = t.__decorate([a.inject(Element), t.__metadata("design:paramtypes", [Element])], r), _.VTreeNodeCustomElement = r
}), define("editor/titles/component-test/index", ["require", "exports"], function(e, _) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var t = function() {
        function e() {
            this.textValue = "Text", this.selectValue = 1, this.selectOptions = [{
                label: "Foo",
                value: 1
            }, {
                label: "Bar",
                value: 2
            }, {
                label: "Three",
                value: 3
            }, {
                label: "Four",
                value: 4
            }], this.switchValue = !0, this.sliderMin = 100, this.sliderMax = 1e3, this.sliderValue = 300, this.sliderStep = 5, this.buttonLabel = "Button", this.numberValue = null, this.numberMin = 0, this.numberMax = 10, this.numberStep = 2, this.treeNodes = [{
                id: "weapon-stats",
                name: "Weapon Stats",
                nodes: [{
                    id: "bayonet",
                    name: "Bayonet",
                    component: {
                        type: "number",
                        value: 123
                    }
                }, {
                    id: "boltok-pistol",
                    name: "Boltok Pistol",
                    component: {
                        type: "text",
                        value: "foo"
                    }
                }, {
                    id: "button-text",
                    name: "Button",
                    component: {
                        type: "button",
                        label: "Click Me",
                        callback: this.buttonCallback
                    }
                }, {
                    id: "boomshot",
                    name: "Boomshot",
                    nodes: [{
                        id: "deaths-holding",
                        name: "Boltok Pistol",
                        component: {
                            type: "slider",
                            value: this.sliderValue,
                            min: this.sliderMin,
                            max: this.sliderMax,
                            step: this.sliderStep
                        }
                    }]
                }]
            }]
        }
        return e.prototype.buttonCallback = function() {
            alert("Callback")
        }, e.prototype.load = function() {}, e.prototype.save = function() {}, e
    }();
    _.ComponentTest = t
}), define("editor/titles/gears-of-war-4/util", ["require", "exports"], function(e, _) {
    "use strict";

    function t(e) {
        var _ = e.readUInt32();
        if (0 === _) return "";
        var t = e.readString("ascii", _ - 1);
        return e.position++, t
    }

    function a(e, _) {
        e.writeUInt32(_.length + 1), e.writeString(_, "ascii", !0)
    }
    Object.defineProperty(_, "__esModule", {
        value: !0
    }), _.readString = t, _.writeString = a
}), define("editor/titles/gears-of-war-4/savepoint", ["require", "exports", "../../../util/stream", "./util"], function(e, _, t, a) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var r = function() {
        function e(e, _) {
            this.save = e;
            var r = new t.Stream(_);
            this.unknownZeroes = r.readBytes(16), this.floatOne = r.readFloat(), this.type = a.readString(r), this.locationData1 = r.readBytes(32), this.mesh = a.readString(r), this.unknownBytes1 = r.readBytes(5), this.squadName = e.strings[r.readUInt32()], this.unknownBytes2 = r.readBytes(12);
            var i = r.readUInt32();
            for (this.weapons = []; i--;) this.weapons.push(this.readWeapon(r));
            this.objectives = [];
            for (var o = r.readUInt32(); o--;) this.objectives.push(this.readObjective(r));
            this.locationData2 = r.readToEnd()
        }
        return e.prototype.readWeapon = function(e) {
            return {
                unknown1: e.readInt32(),
                slot: e.readByte(),
                unknown2: e.readInt32(),
                ammo: e.readUInt32(),
                unknown3: e.readInt32()
            }
        }, e.prototype.readObjective = function(e) {
            for (var _ = {
                    type: this.save.strings[e.readUInt32()],
                    unknown1: e.readInt32(),
                    unknown2: e.readInt32(),
                    unknown3: e.readByte(),
                    descriptionContext: a.readString(e),
                    descriptionId: a.readString(e),
                    name: a.readString(e),
                    data: e.readBytes(33),
                    targets: []
                }, t = e.readUInt32(); t--;) _.targets.push(a.readString(e));
            return _
        }, e.prototype.toBuffer = function() {
            return null
        }, e
    }();
    _.GearPC = r;
    var i = {
            "/Script/GearGame.GearPC_SP": r
        },
        o = function() {
            function e(e, _, t) {
                this.parent = e, this.name = _, this.sequence = t
            }
            return e.prototype.isInstance = function() {
                return 0 !== this.sequence
            }, Object.defineProperty(e.prototype, "fullName", {
                get: function() {
                    return null === this.parent ? this.name : this.parent.toString() + "." + this.name
                },
                enumerable: !0,
                configurable: !0
            }), e.prototype.toString = function() {
                return this.fullName
            }, e
        }();
    _.UEObject = o;
    var n = function() {
        function e(e) {
            var _ = new t.Stream(e);
            this.readHeader(_), this.readObjects(_), this.readGraphicsObjects(_), this.readObjectStructs(_), this.readFlags(_), this.readAiFactories(_), this.readNavComponents(_), this.readObjectScripts(_), this.readClassList(_), this.unknownBytes2 = _.readBytes(_.readUInt32()), this.readObjectTypes(_), this.footer = _.readToEnd()
        }
        return e.prototype.getObjectInstances = function() {
            return this.objects.filter(function(e) {
                return e.isInstance()
            })
        }, e.prototype.getFactoryObjects = function() {
            return this.objects.filter(function(e) {
                return !!e.factoryData
            })
        }, e.prototype.getScriptedObjects = function() {
            return this.objects.filter(function(e) {
                return !!e.script
            })
        }, e.prototype.getSerializedObjects = function() {
            return this.objects.filter(function(e) {
                return !!e.struct
            })
        }, e.prototype.readHeader = function(e) {
            this.mapName = a.readString(e), this.mapId = e.readBytes(16), this.unknownBytes1 = e.readBytes(16)
        }, e.prototype.readObjectDefinitions = function(e) {
            for (var _ = [], t = e.readInt32(); t--;) _.push({
                nameStringIndex: e.readInt32(),
                id: e.readInt32(),
                parentIndex: e.readInt32()
            });
            return _
        }, e.prototype.readObjects = function(e) {
            var _ = this,
                t = this.readObjectDefinitions(e);
            this.strings = [];
            for (var r = e.readUInt32(); r--;) this.strings.push(a.readString(e));
            this.objects = t.map(function(e) {
                return new o(e.parentIndex, _.strings[e.nameStringIndex], e.id)
            }), this.objects.forEach(function(e) {
                return e.parent = -1 !== e.parent ? _.objects[e.parent] : null
            })
        }, e.prototype.readGraphicsObjects = function(e) {
            this.graphicsObjects = [];
            for (var _ = e.readUInt32(); _--;) this.graphicsObjects.push({
                name: a.readString(e),
                unknown1: e.readInt32(),
                unknown2: e.readInt32()
            })
        }, e.prototype.readObjectStructs = function(e) {
            for (var _ = e.readUInt32(); _--;) {
                var t = this.objects[e.readUInt32()];
                t.type = this.objects[e.readUInt32()], t.struct = e.readBytes(e.readUInt32() + 45), i.hasOwnProperty(t.type.fullName) && (t.struct = new i[t.type.fullName](this, t.struct))
            }
        }, e.prototype.readFlags = function(e) {
            var _ = e.readUInt32();
            for (this.flags = new Map; _--;) this.flags.set(this.strings[e.readUInt32()], e.readBoolean())
        }, e.prototype.readAiFactories = function(e) {
            for (var _ = e.readUInt32(); _--;) {
                var t = this.objects[e.readUInt32()];
                if (t.factoryData) throw new Error("Duplicate factory data encountered.");
                t.factoryData = e.readBytes(e.readUInt32())
            }
        }, e.prototype.readNavComponents = function(e) {
            var _ = e.readUInt32();
            for (this.navComponents = []; _--;) this.navComponents.push({
                object: this.objects[e.readUInt32()],
                unknown: e.readInt32(),
                data: e.readBytes(e.readUInt32())
            })
        }, e.prototype.readObjectScripts = function(e) {
            for (var _ = e.readUInt32(); _--;) {
                var t = this.objects[e.readUInt32()];
                if (t.script) throw new Error("Duplicate object script encountered.");
                t.script = {
                    entryPoint: e.readBytes(e.readUInt32()),
                    uberGraphFrame: e.readBytes(e.readUInt32())
                };
                a.readString(e)
            }
        }, e.prototype.readClassList = function(e) {
            var _ = e.readUInt32();
            for (this.classList = []; _--;) this.classList.push(this.objects[e.readUInt32()])
        }, e.prototype.readObjectTypes = function(e) {
            for (var _ = e.readUInt32(); _--;) {
                var t = this.objects[e.readUInt32()],
                    a = this.objects[e.readUInt32()];
                if (t.type && t.type !== a) throw new Error("Struct/object type mismatch.");
                t.type = a
            }
        }, e.prototype.toBuffer = function() {
            return t.Stream.alloc(512e3).getBuffer()
        }, e
    }();
    _.SavepointBinaryBlob = n
}), define("editor/titles/gears-of-war-4/save", ["require", "exports", "tslib", "./util", "../../../util/stream"], function(e, _, t, a, r) {
    "use strict";

    function i(e, t) {
        for (; !e.eof;) {
            var r = a.readString(e),
                i = a.readString(e);
            if (0 === i.length) {
                t[r] = null;
                break
            }
            t[r] = new _.structs[i](e)
        }
    }

    function o(e, _) {
        for (var t = 0, r = Object.getOwnPropertyNames(_); t < r.length; t++) {
            var i = r[t];
            a.writeString(e, i), null === _[i] ? e.writeUInt32(0) : (a.writeString(e, _[i].constructor.name), _[i].write(e))
        }
    }
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var n = 1396790855,
        l = function() {
            function e(e) {
                if (e.readUInt32() !== n) throw new Error("Invalid magic.");
                this.header = e.readBytes(18);
                var _ = {};
                i(e, _), this.releaseName = Object.getOwnPropertyNames(_)[0], this.root = _[this.releaseName]
            }
            return e.prototype.toBuffer = function() {
                var e = r.Stream.reserve(512e3);
                return e.writeUInt32(n), e.writeBytes(this.header), o(e, (_ = {}, _[this.releaseName] = this.root, _)), e.getBuffer();
                var _
            }, e
        }();
    _.GearSave = l;
    var s = function() {
        function e(e) {
            if (e.position += 8, this.elementType = a.readString(e), "ByteProperty" !== this.elementType) throw new Error("Unsupported for now.");
            this.buffer = e.readBytes(e.readUInt32())
        }
        return e.prototype.write = function(e) {
            e.writeUInt32(this.buffer.length + 4), e.writeUInt32(0), e.writeString(this.elementType, "ascii", !0), e.writeUInt32(this.buffer.length), e.writeBytes(this.buffer)
        }, e
    }();
    _.ArrayProperty = s;
    var p = function() {
        function e(e) {
            e.position += 8, this.value = e.readInt32()
        }
        return e.prototype.write = function(e) {
            e.writeUInt32(4), e.writeUInt32(0), e.writeInt32(this.value)
        }, e
    }();
    _.Int32Property = p;
    var c = function(e) {
        function _(_) {
            return e.call(this, _) || this
        }
        return t.__extends(_, e), _
    }(p);
    _.IntProperty = c;
    var d = function() {
        function e(e) {
            e.position += 8, this.value = e.readUInt32()
        }
        return e.prototype.write = function(e) {
            e.writeUInt32(4), e.writeUInt32(0), e.writeUInt32(this.value)
        }, e
    }();
    _.UInt32Property = d;
    var m = function() {
        function e(e) {
            i(e, this)
        }
        return e.prototype.write = function(e) {
            o(e, this)
        }, e
    }();
    _.GearSavepointSaveGame = m, _.structs = {
        GearSavepointSaveGame: m,
        ArrayProperty: s,
        IntProperty: c,
        Int32Property: p,
        UInt32Property: d
    }
}), define("editor/titles/gears-of-war-4/index", ["require", "exports", "./savepoint", "../../../util/crypto", "./save"], function(e, _, t, a, r) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var i = function() {
        function e() {}
        return e.prototype.load = function(e) {
            this.savedGame = new r.GearSave(e);
            var _ = this.savedGame.root.SavepointBinaryBlob.buffer;
            if (!this.savedGame.root.ChecksumKey) throw new Error("Checksum not found.");
            if (a.crc32(_) !== this.savedGame.root.ChecksumKey.value) throw new Error("Invalid checksum.");
            this.savePoint = new t.SavepointBinaryBlob(_), this.player = this.savePoint.getObjectInstances().find(function(e) {
                return "/Game/Maps/SP/GearCampaign_P.GearCampaign_P.PersistentLevel.GearPC_SP" === e.fullName
            }).struct
        }, e.prototype.save = function() {
            var e = this.savePoint.toBuffer();
            return this.savedGame.root.SavepointBinaryBlob.buffer = e, this.savedGame.root.ChecksumKey.value = a.crc32(e), this.savedGame.toBuffer()
        }, e
    }();
    _.GearsOfWar4 = i
}), define("editor/titles/modern-warfare/campaign-save", ["require", "exports", "../../../util/stream"], function(e, _, t) {
    "use strict";

    function a(e) {
        var _ = new t.Stream(e);
        _.readByte();
        for (var a = t.Stream.reserve(65536), r = 0, i = _.length, o = 0, n = 0;;) {
            if (0 != r) {
                do {
                    if (r--, _.position >= i) break;
                    a.writeByte(_.readByte())
                } while (0 != r);
                n = o
            }
            for (; 0 != n;) n--, a.writeByte(0), o = n;
            if (_.position >= i) break;
            var l = _.readByte();
            0 == (192 & l) ? (r = 1 + (63 & l), n = 0) : (n = 1 + (63 & l), r = l >> 6), o = n
        }
        return a.getBuffer()
    }

    function r(e) {
        var _ = new t.Stream(e),
            a = t.Stream.alloc(65536),
            r = 0,
            i = 0,
            o = -1,
            n = 1,
            l = _.length,
            s = 0,
            p = 0,
            c = 0,
            d = !0;
        do {
            if (0 == i) {
                do {
                    if (c = _.readByte(), 63 == o) a.seek(p), a.writeByte(63), p += n, p + 65 > 1835008 && console.log("invalid cache size detected."), a.seek(p + 1), a.writeByte(c), o = 0, i = 0, n = 2, r = 0 == c ? 1 : 0;
                    else {
                        if (0 != c) r = 0;
                        else {
                            if (r++, o <= 2 && o >= 0) {
                                i = o + 1;
                                break
                            }
                            if (o > 2 && r >= 3) {
                                var m = o + 253;
                                n -= 3, a.seek(p + n), c = a.readByte(), a.seek(p), a.writeByte(m), p += n, p + 65 > 1835008 && console.log("invalid cache size detected."), i = 1, r = 0, a.seek(p + 1), a.writeByte(c), o = 2, n = 2, d = !1;
                                break
                            }
                        }
                        a.seek(p + n), a.writeByte(c), o++, n++
                    }
                } while (++s < l);
                if (d && s >= l) break
            } else {
                do {
                    if (0 != (c = _.readByte())) {
                        r = 0;
                        break
                    }
                    if (r++, 63 == o) {
                        r = 1;
                        break
                    }
                    o++
                } while (++s < l);
                if (s >= l) break;
                o += (i << 6 & 4294967295) >>> 0, a.seek(p), a.writeByte(o), p += n, p + 65 > 1835008 && console.log("invalid cache size detected."), a.seek(p + 1), a.writeByte(c), i = 0, n = 2
            }
            d ? o = 0 : d = !0, s++
        } while (s < l);
        var u = a.position;
        n > 1 && (o += i << 6, a.seek(p), a.writeByte(o), p += n), p + 65 > 1835008 && console.log("invalid cache size detected."), u != p && console.log("invalid cache size detected."), a.seek(0);
        var g = a.readBytes(p),
            h = t.Stream.alloc(g.length + 1);
        return h.seek(0), h.writeByte(1), h.writeBytes(g), h.seek(0), h.readBytes(p + 1)
    }
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var i = 8,
        o = 1228,
        n = 1280,
        l = 38,
        s = function() {
            function e(e) {
                this.segments = [], this.header = e.readBytes(n), e.position = o;
                var _ = e.readUInt32();
                e.position = n;
                var a = e.readBytes(_);
                e.position = i, e.readUInt32() !== this.calculateChecksum(a) && console.warn("Save data has been tampered with."), e = new t.Stream(a);
                for (var r = 0; r < l; r++) this.segments.push(e.readBytes(e.readUInt32() - 4))
            }
            return e.prototype.getSegment = function(e) {
                return a(this.segments[e])
            }, e.prototype.setSegment = function(e, _) {
                return this.segments[e] = r(_), this
            }, e.prototype.toBuffer = function() {
                for (var e = this.segments.reduce(function(e, _) {
                        return e + _.length + 4
                    }, 0), _ = t.Stream.alloc(this.header.length + e).writeBytes(this.header).seek(o).writeUInt32(e).seek(n), a = 0, r = this.segments; a < r.length; a++) {
                    var l = r[a];
                    _.writeUInt32(l.length + 4), _.writeBytes(l)
                }
                _.seek(n);
                var s = this.calculateChecksum(_.readBytes(e));
                return _.seek(i), _.writeUInt32(s), _.getBuffer()
            }, e.prototype.calculateChecksum = function(e) {
                for (var _ = e.length, t = 0, a = 1, r = 0; _ > 0;) {
                    var i = 3800;
                    for (i > _ && (i = _), _ -= i; --i >= 0;) a += 255 & e[t++], r += a;
                    a %= 65521, r %= 65521
                }
                return (r << 16 | a) >>> 0
            }, e
        }();
    _.CampaignSave = s
}), define("editor/titles/modern-warfare/dvars", ["require", "exports"], function(e, _) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
            value: !0
        }),
        _.default = ["CG_EjectWeaponBrass", "CG_FakeFireWeapon", "CG_FireWeapon", "CG_FreeLocalEntity", "CG_NotifyLevelQueue_ProcessQueue", "CG_Obituary", "CG_Player_Render", "CG_ProcessSnapshots", "CG_ReadField", "CG_RegisterWeapon", "CG_Scr_PlayXCam", "CG_Spawn", "CG_UpdateWeaponVisibility", "CG_Vehicle_SetupCollisionCache", "CG_WriteField", "FoFIconMaxSize", "FoFIconMinSize", "FoFIconScale", "FoFIconSpawnTimeDelay", "FoFIconSpawnTimeFade", "GAME_ALLIES", "GAME_AXIS", "GAME_CALLEDAVOTE", "GAME_CANNOTUSEVEHICLE", "GAME_CANT_GET_PRIMARY_WEAP_MESSAGE", "GAME_CHAT_MESSAGE", "GAME_CLIENTNOTONSERVER", "GAME_CROUCH_BLOCKED", "GAME_DEAD", "GAME_ERR_SAVEGAME_BAD", "GAME_GET_TO_COVER", "GAME_INVALIDGAMETYPE", "GAME_INVALIDPASSWORD", "GAME_INVALIDVOTESTRING", "GAME_LOBBY", "GAME_MAXVOTESCALLED", "GAME_NOSPECTATORCALLVOTE", "GAME_NOSPECTATORVOTE", "GAME_NOVOTEINPROGRESS", "GAME_PICKUP_AMMO", "GAME_PICKUP_CANTCARRYMOREAMMO", "GAME_PICKUP_CLIPONLY_AMMO", "GAME_PLAYING", "GAME_SECURITY_ID", "GAME_SPECTATOR", "GAME_STAND_BLOCKED", "GAME_THREE", "GAME_TYPEMAP_NOCHANGE", "GAME_VOTEALREADYCAST", "GAME_VOTEALREADYINPROGRESS", "GAME_VOTECAST", "GAME_VOTECOMMANDSARE", "GAME_VOTEFAILED", "GAME_VOTEPASSED", "GAME_VOTE_GAMETYPE", "GAME_VOTE_KICK", "GAME_VOTE_MAP", "GAME_VOTE_MAPRESTART", "GAME_VOTE_NEXTMAP", "GAME_VOTINGNOTENABLED", "GAME_VOTINGNOTENOUGHPLAYERS", "HttpNetFS", "LUI_ALIGNMENT_BOTTOM", "LUI_ALIGNMENT_CENTER", "LUI_ALIGNMENT_HORIZONTAL_MASK", "LUI_ALIGNMENT_LEFT", "LUI_ALIGNMENT_MIDDLE", "LUI_ALIGNMENT_NONE", "LUI_ALIGNMENT_RIGHT", "LUI_ALIGNMENT_SCREEN_SPACE", "LUI_ALIGNMENT_TOP", "LUI_ALIGNMENT_VERTICAL_MASK", "LUI_BUTTON_COUNT", "LUI_KEY_BACK", "LUI_KEY_DOWN", "LUI_KEY_LB", "LUI_KEY_LEFT", "LUI_KEY_LSTICK_PRESSED", "LUI_KEY_LTRIG", "LUI_KEY_NONE", "LUI_KEY_PCKEY_", "LUI_KEY_PCKEY_MWHEELDOWN", "LUI_KEY_PCKEY_MWHEELUP", "LUI_KEY_RB", "LUI_KEY_RIGHT", "LUI_KEY_RSTICK_PRESSED", "LUI_KEY_RTRIG", "LUI_KEY_START", "LUI_KEY_UP", "LUI_KEY_XBA_PSCROSS", "LUI_KEY_XBB_PSCIRCLE", "LUI_KEY_XBX_PSSQUARE", "LUI_KEY_XBY_PSTRIANGLE", "LUI_Main", "MOD_BULLET", "MOD_BURNED", "MOD_CRUSH", "MOD_DROWN", "MOD_ELECTROCUTED", "MOD_EXPLOSIVE", "MOD_EXPLOSIVE_SPLASH", "MOD_FALLING", "MOD_GAS", "MOD_GRENADE", "MOD_GRENADE_SPLASH", "MOD_HEAD_SHOT", "MOD_HIT_BY_OBJECT", "MOD_IMPACT", "MOD_MELEE", "MOD_MELEE_ASSASSINATE", "MOD_MELEE_WEAPON_BUTT", "MOD_PISTOL_BULLET", "MOD_POST_GAME", "MOD_PROJECTILE", "MOD_PROJECTILE_SPLASH", "MOD_RIFLE_BULLET", "MOD_SUICIDE", "MOD_TELEFRAG", "MOD_TRIGGER_HURT", "MOD_UNKNOWN", "MP_ACOUSTIC_SENSOR_HACKING", "MP_ACOUSTIC_SENSOR_HACKINGk", "MP_ACOUSTIC_SENSOR_PICKUP", "MP_ALL_TEAMS_ELIMINATED", "MP_AUTOBALANCE_NOW", "MP_BALL_CAPTURE", "MP_BALL_DROPPED", "MP_BALL_OVERTIME_ROUND_", "MP_BALL_PICKED_UP", "MP_BANKRUPTED", "MP_BANKRUPTED_OTHER", "MP_BETACLOSED", "MP_BLACK_OPS_ELIMINATED", "MP_BLACK_OPS_FORFEITED", "MP_BLACK_OPS_MISSION_ACCOMPLISHED", "MP_BLACK_OPS_NAME", "MP_BLACK_OPS_WIN_MATCH", "MP_BLACK_OPS_WIN_ROUND", "MP_BOMB_DEFUSED", "MP_BONUS_ACQUIRED", "MP_BOUNCINGBETTY_HACKING", "MP_BOUNCINGBETTY_PICKUP", "MP_CAMERA_SPIKE_HACKING", "MP_CAMERA_SPIKE_PICKUP", "MP_CANNOT_LOCKON_TO_TARGET", "MP_CANT_PLANT_WITHOUT_BOMB", "MP_CANT_PLANT_WITHOUT_BOMBs", "MP_CAPTURED_THE_FLAG", "MP_CAPTURED_THE_FLAGs", "MP_CAPTURE_HQ", "MP_CAPTURE_KOTH", "MP_CAPTURING_FLAG", "MP_CAPTURING_HQ", "MP_CAPTURING_OBJECTIVE", "MP_CAP_LIMIT_REACHED", "MP_CDP_ELIMINATED", "MP_CDP_ELIMINATEDs", "MP_CDP_FORFEITED", "MP_CDP_MISSION_ACCOMPLISHED", "MP_CDP_NAME", "MP_CDP_WIN_MATCH", "MP_CDP_WIN_MATCHg", "MP_CDP_WIN_ROUND", "MP_CHALLENGE_COMPLETED", "MP_CHANGE_CLASS_NEXT_SPAWN", "MP_CLAYMORE_HACKING", "MP_CLAYMORE_HACKINGZ", "MP_CLAYMORE_PICKUP", "MP_CODNOTALLOWED", "MP_CODPOINTS_MATCH_BONUS_IS", "MP_CODPOINTS_MATCH_BONUS_ISs", "MP_CONNECTED", "MP_CONNECTING_NEW_HOST", "MP_CONTROL_HQ", "MP_CONTROL_KOTH", "MP_CTF_CANT_CAPTURE_FLAG", "MP_CTF_OVERTIME_ROUND_", "MP_CTF_OVERTIME_WIN", "MP_CTF_OVERTIME_WINs", "MP_DEFEAT_CAPS", "MP_DEFEND_HQ", "MP_DEFEND_KOTH", "MP_DEFUSING_EXPLOSIVE", "MP_DESTROYED_HELICOPTER", "MP_DESTROYING_HQ", "MP_DESTROY_HQ", "MP_DOM_ENEMY_FLAG_CAPTURED", "MP_DOM_ENEMY_FLAG_CAPTUREDs", "MP_DOM_FLAG_A_CAPTURED_BY", "MP_DOM_FLAG_A_NEUTRALIZED_BY", "MP_DOM_FLAG_B_CAPTURED_BY", "MP_DOM_FLAG_B_NEUTRALIZED_BY", "MP_DOM_FLAG_C_CAPTURED_BY", "MP_DOM_FLAG_C_NEUTRALIZED_BY", "MP_DOM_FLAG_D_CAPTURED_BY", "MP_DOM_FLAG_D_NEUTRALIZED_BY", "MP_DOM_FLAG_E_CAPTURED_BY", "MP_DOM_FLAG_E_NEUTRALIZED_BY", "MP_DOM_NEUTRAL_FLAG_CAPTURED", "MP_DOM_YOUR_FLAG_WAS_CAPTURED", "MP_DRAW_CAPS", "MP_DRAW_CAPSs", "MP_EARNED_PLANEMORTAR", "MP_ENDED_GAME", "MP_ENEMIES_ELIMINATED", "MP_ENEMY_FLAG_CAPTURED", "MP_ENEMY_FLAG_CAPTURED_BY", "MP_ENEMY_FLAG_DROPPED", "MP_ENEMY_FLAG_RETURNED", "MP_ENEMY_FLAG_RETURNING_IN", "MP_ENEMY_FLAG_TAKEN", "MP_ENEMY_FLAG_TAKENs", "MP_ESCORT_OVERTIME_ROUND_", "MP_ESCORT_ROBOT_DISABLED", "MP_EXPLOSIVES_BLOWUP_BY", "MP_EXPLOSIVES_BLOWUP_BYs", "MP_EXPLOSIVES_DEFUSED_BY", "MP_EXPLOSIVES_DROPPED_BY", "MP_EXPLOSIVES_PLANTED_BY", "MP_EXPLOSIVES_PLANTED_BYs", "MP_EXPLOSIVES_RECOVERED_BY", "MP_FIRSTPLACE_NAME", "MP_FIRST_BLOOD", "MP_FLAG_CAPTURED_BY", "MP_FLAG_RETURNED", "MP_FLAG_RETURNED_BY", "MP_FLAG_RETURNEDs", "MP_FLAG_TAKEN_BY", "MP_FRIENDLY_FIRE_WILL_NOT", "MP_FRIENDLY_FLAG_CAPTURED", "MP_FRIENDLY_FLAG_CAPTURED_BY", "MP_FRIENDLY_FLAG_DROPPED", "MP_FRIENDLY_FLAG_DROPPED_BY", "MP_FRIENDLY_FLAG_RETURNED", "MP_FRIENDLY_FLAG_TAKEN", "MP_FRIENDLY_FLAG_TAKENs", "MP_GAME_OVER_CAPS", "MP_GENERIC_DESTROY", "MP_GENERIC_HACKING", "MP_GENERIC_HACKINGk", "MP_GENERIC_PICKUP", "MP_GRABBING_FLAG", "MP_GRENADE_UNAVAILABLE_FOR_N", "MP_GUN_NEXT_LEVEL", "MP_GUN_PREV_LEVEL", "MP_GUN_PREV_LEVEL_OTHER", "MP_HACKING", "MP_HALFTIME", "MP_HALFTIME_CAPS", "MP_HATCHET_PICKUP", "MP_HEADS_UP", "MP_HEADS_UPs", "MP_HOSTING", "MP_HOST_COMMS_FAILURE", "MP_HOST_ENDED_GAME", "MP_HOST_ENDGAME_RESPONSE", "MP_HOST_SUCKS", "MP_HQ_AVAILABLE_IN", "MP_HQ_CAPTURED_BY", "MP_HQ_DESPAWN_IN", "MP_HQ_DESTROYED_BY", "MP_HQ_REINFORCEMENTS_IN", "MP_HUMILIATED", "MP_HUMILIATION", "MP_HUMILIATIONs", "MP_INTERMISSION", "MP_INTERMISSION_CAPS", "MP_INVALID_TURRET_LOCATION", "MP_JOIN_IN_PROGRESS_LOSS", "MP_KILLED_FLAG_CARRIER", "MP_KILLSTREAK_N", "MP_KILL_DENIED", "MP_KOTH_AVAILABLE_IN", "MP_KOTH_CAPTURED_BY", "MP_KOTH_CAPTURED_BY_ENEMY", "MP_KOTH_CAPTURED_BY_ENEMYs", "MP_KOTH_CONTESTED_BY_ENEMY", "MP_KOTH_MOVING_IN", "MP_LAUNCHER_UNAVAILABLE_FOR_N", "MP_LOSING_FLAG", "MP_MAPDIFFERSFROMSERVER", "MP_MAPS", "MP_MATCH_BONUS_IS", "MP_MATCH_STARTING", "MP_MATCH_STARTING_IN", "MP_MATCH_TIE", "MP_MULTI_KILL_MEDALS", "MP_MUSIC_TRACKS_DEFAULT", "MP_MUSIC_TRACKS_FIRST_TRACK", "MP_MUSIC_TRACKS_MAX", "MP_MUSIC_TRACKS_NONE", "MP_MUSIC_TRACKS_RANDOM", "MP_NEUTRAL_FLAG_CAPTURED_BY", "MP_NEUTRAL_FLAG_CAPTURED_BYs", "MP_NEUTRAL_FLAG_DROPPED_BY", "MP_NO_RESPAWN", "MP_OIC_SURVIVOR_BONUS", "MP_OPPONENT_FORFEITING_IN", "MP_ORIGINAL_MAPS", "MP_OTHER_TEAMS_FORFEITED", "MP_OVERTIME", "MP_OVERTIME_CAPS", "MP_PICKING_NEW_HOST", "MP_PLANTING_EXPLOSIVE", "MP_PLANTING_EXPLOSIVEs", "MP_PLAYERS_FORFEITED", "MP_PLAYER_DISCONNECT", "MP_PLAYLIST_MAPS_NOT_ENABLED", "MP_PLUS", "MP_PLUS_ONE_BULLET", "MP_PMC_ELIMINATED", "MP_PMC_FORFEITED", "MP_PMC_MISSION_ACCOMPLISHED", "MP_PMC_NAME", "MP_PMC_WIN_MATCH", "MP_PMC_WIN_ROUND", "MP_PMC_WIN_ROUNDs", "MP_PUBLIC_MATCH", "MP_PURGATORY_ENEMY_COUNT", "MP_PURGATORY_NEXT_SPAWN", "MP_PURGATORY_QUEUE_POSITION", "MP_PURGATORY_TEAMMATE_COUNT", "MP_RAMPAGE", "MP_REACH_ARENA", "MP_REACH_SERGEANT", "MP_REBOOTING_ROBOT", "MP_REMOTE_EXIT", "MP_REMOTE_UAV_CANNOT_PLACE", "MP_REMOTE_UAV_PLACE", "MP_REMOTE_UAV_PLACEs", "MP_REMOTE_USE_TANK", "MP_REMOTE_USE_TANKZ", "MP_REMOTE_USE_TURRET", "MP_RES_ENEMY_FLAG_CAPTURED", "MP_RES_NEUTRAL_FLAG_CAPTURED", "MP_RES_YOUR_FLAG_WAS_CAPTURED", "MP_ROUNDEND", "MP_ROUNDEND_CAPS", "MP_ROUND_DRAW", "MP_ROUND_DRAW_CAPS", "MP_ROUND_LIMIT_REACHED", "MP_ROUND_LIMIT_REACHEDs", "MP_ROUND_LOSS_CAPS", "MP_ROUND_WIN_CAPS", "MP_SATCHEL_CHARGE_HACKING", "MP_SATCHEL_CHARGE_PICKUP", "MP_SCORE_LIMIT_REACHED", "MP_SCRAMBLER_HACKING", "MP_SCRAMBLER_PICKUP", "MP_SEALS_ELIMINATED", "MP_SEALS_FORFEITED", "MP_SEALS_MISSION_ACCOMPLISHED", "MP_SEALS_NAME", "MP_SEALS_WIN_MATCH", "MP_SEALS_WIN_MATCHs", "MP_SEALS_WIN_ROUND", "MP_SECONDPLACE_NAME", "MP_SENSOR_GRENADE_DESTROY", "MP_SENSOR_GRENADE_DESTROYZ", "MP_SHOCK_CHARGE_PICKUP", "MP_SHRP_COUNTDOWN", "MP_SHRP_FINAL_MULTIPLIER", "MP_SHRP_PENULTIMATE_MULTIPLIER", "MP_SHRP_PENULTIMATE_RND", "MP_SHRP_RND", "MP_SHRP_WEAPONS_CYCLED", "MP_SHRP_WEAPONS_CYCLEDs", "MP_SPAWN_NEXT_ROUND", "MP_SPECIALIST_MEDALS", "MP_SPLIT_SCREEN", "MP_SUDDEN_DEATH", "MP_SWITCHING_SIDES_CAPS", "MP_TACTICAL_INSERTION_DESTROY", "MP_TACTICAL_INSERTION_PICKUP", "MP_TARGET_DESTROYED", "MP_THIRDPLACE_NAME", "MP_TIE_BREAKER", "MP_TIME_EXTENDED", "MP_TIME_LIMIT_REACHED", "MP_TIME_LIMIT_REACHEDs", "MP_TOO_MANY_VEHICLES", "MP_TOP", "MP_TROPHY_SYSTEM_DESTROY", "MP_TROPHY_SYSTEM_DESTROYk", "MP_TROPHY_SYSTEM_HACKING", "MP_TROPHY_SYSTEM_PICKUP", "MP_U", "MP_UNAVAILABLE_FOR_N", "MP_VICTORY_CAPS", "MP_WAGER_IN_THE_MONEY", "MP_WAGER_IN_THE_MONEY_CAPS", "MP_WAGER_LOSS_CAPS", "MP_WAGER_PLACE_NAME", "MP_WAGER_SIDEBET_WINNINGS_ARE", "MP_WAGER_SIDEBET_WINNINGS_AREs", "MP_WAGER_TOPWINNERS", "MP_WAGER_WINNINGS_ARE", "MP_WAITING_FOR_HQ", "MP_WAITING_FOR_PLAYERS", "MP_WAITING_FOR_PLAYERS_SHOUTCASTER", "MP_WAITING_FOR_TEAMS", "MP_WAITING_NEW_HOST", "MP_WAITING_TO_SPAWN", "MP_WAITING_TO_SPAWN_SS", "MP_WAR_PLANEMORTAR_INBOUND", "MP_WAR_PLANEMORTAR_INBOUND_NEAR_YOUR_POSITION", "MP_WAR_PLANEMORTAR_INBOUNDs", "MP_YOUR_FLAG_RETURNING_IN", "MP_YOU_HAVE_RECOVERED_THE_BOMB", "MP_YOU_WILL_RESPAWN", "PlayerCmd_MurderLine", "PlayerCmd_SetActionSlot", "PlayerCmd_SetClientFlag", "RemoteCameraSounds_DryLevel", "RemoteCameraSounds_RoomType", "RemoteCameraSounds_WetLevel", "TIME_PLAYED_TOTAL", "XBOXLIVE_CANTJOINSESSION", "XBOXLIVE_GENERICDISCONNECT", "XBOXLIVE_LOBBY_CONNECTION_ERR", "XBOXLIVE_MPNOTALLOWED", "XBOXLIVE_MUSTLOGIN", "XBOXLIVE_NETCONNECTION", "XBOXLIVE_NETCONNECTION_STORE", "XBOXLIVE_NOGUESTACCOUNTS", "XBOXLIVE_SIGNEDOUT", "XBOXLIVE_SIGNEDOUTOFLIVE", "XBOXLIVE_SIGNEDOUTOFLIVE_STORE", "XBOXLIVE_SIGNEDOUT_SPLITSCREEN", "XBOXLIVE_SIGNINCHANGED", "YouTube_Get", "YouTube_Set", "accessToSubscriberContent", "actionSlotsHide", "ai_accuracyDistScale", "ai_am", "ai_asm", "ai_ast", "ai_base_rifle_crc_exposed_cybercom_activate", "ai_base_rifle_crc_exposed_rifle_malfunction", "ai_base_rifle_crc_exposed_rifle_malfunction_", "ai_base_rifle_crc_exposed_sens_overload_react_intro", "ai_base_rifle_crc_exposed_sens_overload_react_intro_", "ai_base_rifle_crc_exposed_sens_overload_react_loop", "ai_base_rifle_crc_exposed_sens_overload_react_loop_", "ai_base_rifle_crc_exposed_sens_overload_react_outro", "ai_base_rifle_crc_exposed_sens_overload_react_outro_", "ai_base_rifle_crc_exposed_suit_overload_react_intro", "ai_base_rifle_crc_exposed_suit_overload_react_intro_", "ai_base_rifle_crc_exposed_suit_overload_react_outro", "ai_base_rifle_crc_exposed_suit_overload_react_outro_", "ai_base_rifle_crc_exposed_swarm_react_intro", "ai_base_rifle_crc_exposed_swarm_react_intro_", "ai_base_rifle_crc_exposed_swarm_react_outro", "ai_base_rifle_crc_exposed_swarm_react_outro_", "ai_base_rifle_crc_exposed_swarm_upg_react_intro", "ai_base_rifle_crc_exposed_swarm_upg_react_intro_", "ai_base_rifle_stn_assassination_counter_front", "ai_base_rifle_stn_assassination_death_back_v", "ai_base_rifle_stn_assassination_death_left", "ai_base_rifle_stn_assassination_death_right", "ai_base_rifle_stn_exposed_cybercom_activate", "ai_base_rifle_stn_exposed_dth_pose", "ai_base_rifle_stn_exposed_immolate_explode_midthrow", "ai_base_rifle_stn_exposed_rifle_malfunction", "ai_base_rifle_stn_exposed_rifle_malfunction_", "ai_base_rifle_stn_exposed_sens_overload_react_intro", "ai_base_rifle_stn_exposed_sens_overload_react_intro_", "ai_base_rifle_stn_exposed_sens_overload_react_loop", "ai_base_rifle_stn_exposed_sens_overload_react_loop_", "ai_base_rifle_stn_exposed_sens_overload_react_outro", "ai_base_rifle_stn_exposed_sens_overload_react_outro_", "ai_base_rifle_stn_exposed_suit_overload_react_intro", "ai_base_rifle_stn_exposed_suit_overload_react_intro_", "ai_base_rifle_stn_exposed_suit_overload_react_outro", "ai_base_rifle_stn_exposed_suit_overload_react_outro_", "ai_base_rifle_stn_exposed_swarm_react_intro", "ai_base_rifle_stn_exposed_swarm_react_intro_", "ai_base_rifle_stn_exposed_swarm_react_outro", "ai_base_rifle_stn_exposed_swarm_react_outro_", "ai_base_rifle_stn_exposed_swarm_upg_react_intro", "ai_base_rifle_stn_exposed_swarm_upg_react_intro_", "ai_bsm", "ai_bt", "ai_civ_base_alert_stn_idle_twitch_", "ai_civ_base_cover_stn_pointidle", "ai_civ_base_standidle_officer", "ai_claw_mk", "ai_clientFacialCullDist", "ai_codeGameskill", "ai_corpseCount", "ai_crew_crobot_vtolrider_highdrop_intro_left", "ai_crew_crobot_vtolrider_highdrop_land", "ai_crew_crobot_vtolrider_highdrop_loop", "ai_crew_crobot_vtolrider_idle_left", "ai_crew_escortrobot_vtolrider_highdrop_intro_left", "ai_crew_escortrobot_vtolrider_highdrop_land", "ai_crew_escortrobot_vtolrider_highdrop_loop", "ai_crew_escortrobot_vtolrider_idle_left", "ai_crew_vtol_", "ai_crew_vtol_captain_idle", "ai_face_male_aim_fire_", "ai_face_male_aim_idle_", "ai_face_male_death_", "ai_face_male_death_electro_prox", "ai_face_male_death_pukey", "ai_face_male_generic_idle_", "ai_face_male_melee_", "ai_face_male_pain_", "ai_face_male_pain_immolate_death", "ai_face_male_pain_overload", "ai_face_male_pain_overload_death", "ai_face_male_pain_wpn_malfunction", "ai_face_zombie_generic_attack_", "ai_face_zombie_generic_death_", "ai_face_zombie_generic_idle_", "ai_face_zombie_generic_pain_", "ai_fem_rifle_crc_exposed_rifle_malfunction", "ai_fem_rifle_crc_exposed_rifle_malfunction_", "ai_fem_rifle_crc_exposed_sens_overload_react_intro", "ai_fem_rifle_crc_exposed_sens_overload_react_intro_", "ai_fem_rifle_crc_exposed_sens_overload_react_loop", "ai_fem_rifle_crc_exposed_sens_overload_react_loop_", "ai_fem_rifle_crc_exposed_sens_overload_react_outro", "ai_fem_rifle_crc_exposed_sens_overload_react_outro_", "ai_fem_rifle_crc_exposed_suit_overload_react_intro", "ai_fem_rifle_crc_exposed_suit_overload_react_intro_", "ai_fem_rifle_crc_exposed_suit_overload_react_outro", "ai_fem_rifle_crc_exposed_suit_overload_react_outro_", "ai_fem_rifle_crc_exposed_swarm_react_intro", "ai_fem_rifle_crc_exposed_swarm_react_intro_", "ai_fem_rifle_crc_exposed_swarm_react_outro", "ai_fem_rifle_crc_exposed_swarm_react_outro_", "ai_fem_rifle_crc_exposed_swarm_upg_react_intro", "ai_fem_rifle_crc_exposed_swarm_upg_react_intro_", "ai_fem_rifle_stn_exposed_dth_pose", "ai_fem_rifle_stn_exposed_rifle_malfunction", "ai_fem_rifle_stn_exposed_rifle_malfunction_", "ai_fem_rifle_stn_exposed_sens_overload_react_intro", "ai_fem_rifle_stn_exposed_sens_overload_react_intro_", "ai_fem_rifle_stn_exposed_sens_overload_react_loop", "ai_fem_rifle_stn_exposed_sens_overload_react_loop_", "ai_fem_rifle_stn_exposed_sens_overload_react_outro", "ai_fem_rifle_stn_exposed_sens_overload_react_outro_", "ai_fem_rifle_stn_exposed_suit_overload_react_intro", "ai_fem_rifle_stn_exposed_suit_overload_react_intro_", "ai_fem_rifle_stn_exposed_suit_overload_react_outro", "ai_fem_rifle_stn_exposed_suit_overload_react_outro_", "ai_fem_rifle_stn_exposed_swarm_react_intro", "ai_fem_rifle_stn_exposed_swarm_react_intro_", "ai_fem_rifle_stn_exposed_swarm_react_outro", "ai_fem_rifle_stn_exposed_swarm_react_outro_", "ai_fem_rifle_stn_exposed_swarm_upg_react_intro", "ai_fem_rifle_stn_exposed_swarm_upg_react_intro_", "ai_grenadeReturn_approachMinDot", "ai_grenadeReturn_debug", "ai_grenadeReturn_extraFuseTime", "ai_grenadeReturn_minFuseTime", "ai_grenadeReturn_orientToToss", "ai_grenadeReturn_stationary", "ai_grenadeReturn_stationaryMaxDistSqr", "ai_grenadeReturn_traceToGrenade", "ai_grenadeReturn_tryReturnFriendly", "ai_horse_idle", "ai_horse_idle_graze", "ai_horse_idle_turn_l", "ai_horse_idle_turn_r", "ai_horse_jump_land", "ai_horse_jump_takeoff", "ai_horse_run_f", "ai_horse_run_f_lean_l", "ai_horse_run_f_lean_r", "ai_horse_sprint_f", "ai_horse_sprint_f_lean_l", "ai_horse_sprint_f_lean_r", "ai_horse_trot_f", "ai_horse_trot_f_lean_l", "ai_horse_trot_f_lean_r", "ai_horse_walk_b", "ai_horse_walk_f", "ai_horse_walk_f_lean_l", "ai_horse_walk_f_lean_r", "ai_margwa_head_l_closed_add", "ai_margwa_head_l_open_add", "ai_margwa_head_l_smash_attack_", "ai_margwa_head_m_closed_add", "ai_margwa_head_m_open_add", "ai_margwa_head_m_smash_attack_", "ai_margwa_head_r_closed_add", "ai_margwa_head_r_open_add", "ai_margwa_head_r_smash_attack_", "ai_margwa_jaw_l_idle_", "ai_margwa_jaw_l_idle_pain_body", "ai_margwa_jaw_l_idle_pain_head_l_explode", "ai_margwa_jaw_l_idle_pain_head_m_explode", "ai_margwa_jaw_l_idle_pain_head_r_explode", "ai_margwa_jaw_l_react_idgun", "ai_margwa_jaw_l_react_idgun_pack", "ai_margwa_jaw_l_react_stun", "ai_margwa_jaw_l_run_charge_f", "ai_margwa_jaw_l_run_charge_turn_", "ai_margwa_jaw_l_run_f", "ai_margwa_jaw_l_smash_attack_", "ai_margwa_jaw_l_swipe", "ai_margwa_jaw_l_swipe_player", "ai_margwa_jaw_l_teleport_in", "ai_margwa_jaw_l_teleport_out", "ai_margwa_jaw_l_trv_jump_across_", "ai_margwa_jaw_l_trv_jump_down_", "ai_margwa_jaw_l_trv_jump_up_", "ai_margwa_jaw_l_turn_", "ai_margwa_jaw_m_idle_", "ai_margwa_jaw_m_idle_pain_body", "ai_margwa_jaw_m_idle_pain_head_l_explode", "ai_margwa_jaw_m_idle_pain_head_m_explode", "ai_margwa_jaw_m_idle_pain_head_r_explode", "ai_margwa_jaw_m_react_idgun", "ai_margwa_jaw_m_react_idgun_pack", "ai_margwa_jaw_m_react_stun", "ai_margwa_jaw_m_run_charge_f", "ai_margwa_jaw_m_run_charge_turn_", "ai_margwa_jaw_m_run_f", "ai_margwa_jaw_m_smash_attack_", "ai_margwa_jaw_m_swipe", "ai_margwa_jaw_m_swipe_player", "ai_margwa_jaw_m_teleport_in", "ai_margwa_jaw_m_teleport_out", "ai_margwa_jaw_m_trv_jump_across_", "ai_margwa_jaw_m_trv_jump_down_", "ai_margwa_jaw_m_trv_jump_up_", "ai_margwa_jaw_m_turn_", "ai_margwa_jaw_r_idle_", "ai_margwa_jaw_r_idle_pain_body", "ai_margwa_jaw_r_idle_pain_head_l_explode", "ai_margwa_jaw_r_idle_pain_head_m_explode", "ai_margwa_jaw_r_idle_pain_head_r_explode", "ai_margwa_jaw_r_react_idgun", "ai_margwa_jaw_r_react_idgun_pack", "ai_margwa_jaw_r_react_stun", "ai_margwa_jaw_r_run_charge_f", "ai_margwa_jaw_r_run_charge_turn_", "ai_margwa_jaw_r_run_f", "ai_margwa_jaw_r_smash_attack_", "ai_margwa_jaw_r_swipe", "ai_margwa_jaw_r_swipe_player", "ai_margwa_jaw_r_teleport_in", "ai_margwa_jaw_r_teleport_out", "ai_margwa_jaw_r_trv_jump_across_", "ai_margwa_jaw_r_trv_jump_down_", "ai_margwa_jaw_r_trv_jump_up_", "ai_margwa_jaw_r_turn_", "ai_margwa_tentacle_l_", "ai_margwa_tentacle_r_", "ai_mp_robot_cmpn_run_sprint_f", "ai_mp_robot_cmpn_run_sprint_f_aim_", "ai_nosight", "ai_pc_amws_armored_turret_extend", "ai_pc_amws_armored_turret_extended_pose", "ai_pc_amws_armored_turret_retract", "ai_pc_amws_armored_turret_retracted_pose", "ai_puppeteer", "ai_quadtank_mlrs_rocket_doors_close", "ai_quadtank_mlrs_rocket_doors_open", "ai_riotshield_crc_exposed_rifle_malfunction", "ai_riotshield_crc_exposed_rifle_malfunction_", "ai_riotshield_crc_exposed_swarm_upg_react_intro", "ai_riotshield_crc_exposed_swarm_upg_react_intro_", "ai_riotshield_stn_exposed_rifle_malfunction", "ai_riotshield_stn_exposed_rifle_malfunction_", "ai_riotshield_stn_exposed_suit_overload_react_intro", "ai_riotshield_stn_exposed_suit_overload_react_intro_", "ai_riotshield_stn_exposed_suit_overload_react_loop", "ai_riotshield_stn_exposed_suit_overload_react_loop_", "ai_riotshield_stn_exposed_suit_overload_react_outro", "ai_riotshield_stn_exposed_suit_overload_react_outro_", "ai_riotshield_stn_exposed_swarm_upg_react_intro", "ai_riotshield_stn_exposed_swarm_upg_react_intro_", "ai_robotForceCrawler", "ai_robot_base_charge_melee_l_hand", "ai_robot_base_charge_melee_r_hand", "ai_robot_base_cover_alert_death_", "ai_robot_base_cover_alert_idle", "ai_robot_base_cover_alert_idle_", "ai_robot_base_cover_alert_over_", "ai_robot_base_cover_alert_pain_chest_l", "ai_robot_base_cover_alert_pain_chest_r", "ai_robot_base_cover_alert_pain_head", "ai_robot_base_cover_alert_pain_head_b", "ai_robot_base_cover_alert_pain_head_c", "ai_robot_base_cover_alert_reload", "ai_robot_base_cover_alert_twitch_", "ai_robot_base_cover_grenade_throw", "ai_robot_base_cover_left_alert_", "ai_robot_base_cover_left_crc_lean_", "ai_robot_base_cover_left_grenade_throw", "ai_robot_base_cover_left_lean_", "ai_robot_base_cover_left_scan_", "ai_robot_base_cover_over_aim_", "ai_robot_base_cover_over_idle", "ai_robot_base_cover_over_shoot_burst_", "ai_robot_base_cover_over_shoot_semi", "ai_robot_base_cover_over_shoot_single", "ai_robot_base_cover_react_b", "ai_robot_base_cover_react_f", "ai_robot_base_cover_react_l", "ai_robot_base_cover_react_r", "ai_robot_base_cover_right_alert_", "ai_robot_base_cover_right_crc_lean_", "ai_robot_base_cover_right_lean_", "ai_robot_base_cover_right_scan_", "ai_robot_base_crc_alert_shoot_aim_", "ai_robot_base_crc_casual_idle", "ai_robot_base_crc_casual_idle_twitch_", "ai_robot_base_crc_exposed_", "ai_robot_base_crc_exposed_alert_idle", "ai_robot_base_crc_exposed_alert_reload", "ai_robot_base_crc_exposed_alert_shoot_burst_", "ai_robot_base_crc_exposed_alert_shoot_semi", "ai_robot_base_crc_exposed_alert_shoot_single", "ai_robot_base_crc_exposed_alert_twitch_", "ai_robot_base_crc_exposed_death_f", "ai_robot_base_crc_exposed_death_head", "ai_robot_base_crc_exposed_death_head_", "ai_robot_base_crc_exposed_death_juiced_ammo", "ai_robot_base_crc_exposed_death_l", "ai_robot_base_crc_exposed_forced_malfunction", "ai_robot_base_crc_exposed_forced_malfunction_", "ai_robot_base_crc_exposed_forced_malfunction_alt_a", "ai_robot_base_crc_exposed_forced_malfunction_alt_b", "ai_robot_base_crc_exposed_immolate_react_", "ai_robot_base_crc_exposed_immolate_react_dth", "ai_robot_base_crc_exposed_immolate_react_dth_", "ai_robot_base_crc_exposed_pain_chest", "ai_robot_base_crc_exposed_pain_groin", "ai_robot_base_crc_exposed_pain_head_a", "ai_robot_base_crc_exposed_pain_head_b", "ai_robot_base_crc_exposed_pain_juiced_ammo", "ai_robot_base_crc_exposed_pain_juiced_ammo_", "ai_robot_base_crc_exposed_pain_l_arm", "ai_robot_base_crc_exposed_pain_legs", "ai_robot_base_crc_exposed_pain_r_arm", "ai_robot_base_crc_exposed_surge_pain_a", "ai_robot_base_crc_exposed_surge_pain_b", "ai_robot_base_crc_exposed_turn_l_", "ai_robot_base_crc_exposed_turn_r_", "ai_robot_base_crc_shutdown", "ai_robot_base_crc_shutdown_", "ai_robot_base_crc_shutdown_idle", "ai_robot_base_march_f_aim_", "ai_robot_base_scan_", "ai_robot_base_stn_casual_", "ai_robot_base_stn_death_alt_", "ai_robot_base_stn_death_chest_", "ai_robot_base_stn_death_headshot", "ai_robot_base_stn_death_leg_alt_", "ai_robot_base_stn_exposed_", "ai_robot_base_stn_exposed_aim_", "ai_robot_base_stn_exposed_alert_idle_", "ai_robot_base_stn_exposed_alert_idle_twitch_", "ai_robot_base_stn_exposed_alert_scan_center", "ai_robot_base_stn_exposed_alert_scan_left", "ai_robot_base_stn_exposed_alert_scan_right", "ai_robot_base_stn_exposed_b_", "ai_robot_base_stn_exposed_burst_", "ai_robot_base_stn_exposed_chnmelee_react_b", "ai_robot_base_stn_exposed_chnmelee_react_f", "ai_robot_base_stn_exposed_chnmelee_react_l", "ai_robot_base_stn_exposed_chnmelee_react_r", "ai_robot_base_stn_exposed_death_juiced_ammo", "ai_robot_base_stn_exposed_dth_pose", "ai_robot_base_stn_exposed_f_", "ai_robot_base_stn_exposed_forced_malfunction", "ai_robot_base_stn_exposed_forced_malfunction_", "ai_robot_base_stn_exposed_forced_malfunction_alt_a", "ai_robot_base_stn_exposed_forced_malfunction_alt_b", "ai_robot_base_stn_exposed_forced_malfunction_alt_d", "ai_robot_base_stn_exposed_forced_malfunction_alt_e", "ai_robot_base_stn_exposed_forced_malfunction_alt_f", "ai_robot_base_stn_exposed_forced_malfunction_alt_g", "ai_robot_base_stn_exposed_gib_legs_idle_l_arm_crawl", "ai_robot_base_stn_exposed_gib_legs_r_arm_aim", "ai_robot_base_stn_exposed_gib_legs_r_arm_crawl", "ai_robot_base_stn_exposed_gib_legs_r_arm_death", "ai_robot_base_stn_exposed_gib_legs_r_arm_idle", "ai_robot_base_stn_exposed_gib_legs_r_arm_shoot_burst_", "ai_robot_base_stn_exposed_gib_legs_r_arm_shoot_semi", "ai_robot_base_stn_exposed_gib_legs_r_arm_shoot_single", "ai_robot_base_stn_exposed_gib_legs_r_arm_twitch_", "ai_robot_base_stn_exposed_grenade_throw_", "ai_robot_base_stn_exposed_immolate_react_", "ai_robot_base_stn_exposed_immolate_react_dth", "ai_robot_base_stn_exposed_immolate_react_dth_", "ai_robot_base_stn_exposed_immolate_react_dth_alt_a", "ai_robot_base_stn_exposed_immolate_react_dth_alt_b", "ai_robot_base_stn_exposed_immolate_react_loop", "ai_robot_base_stn_exposed_juke_left", "ai_robot_base_stn_exposed_juke_right", "ai_robot_base_stn_exposed_juke_short_left", "ai_robot_base_stn_exposed_juke_short_right", "ai_robot_base_stn_exposed_l_", "ai_robot_base_stn_exposed_pain_back", "ai_robot_base_stn_exposed_pain_face", "ai_robot_base_stn_exposed_pain_face_b", "ai_robot_base_stn_exposed_pain_juiced_ammo", "ai_robot_base_stn_exposed_pain_juiced_ammo_", "ai_robot_base_stn_exposed_pain_left_arm", "ai_robot_base_stn_exposed_pain_left_chest", "ai_robot_base_stn_exposed_pain_left_leg", "ai_robot_base_stn_exposed_pain_right_arm", "ai_robot_base_stn_exposed_pain_right_chest", "ai_robot_base_stn_exposed_pain_right_leg", "ai_robot_base_stn_exposed_r_", "ai_robot_base_stn_exposed_ravage_core_death", "ai_robot_base_stn_exposed_ravage_core_death_alt_a", "ai_robot_base_stn_exposed_reload_", "ai_robot_base_stn_exposed_semi", "ai_robot_base_stn_exposed_semi_", "ai_robot_base_stn_exposed_single", "ai_robot_base_stn_exposed_surge_pain_a", "ai_robot_base_stn_exposed_surge_pain_b", "ai_robot_base_stn_exposed_turn_l_", "ai_robot_base_stn_exposed_turn_r_", "ai_robot_base_stn_melee_", "ai_robot_base_stn_melee_l_hand", "ai_robot_base_stn_melee_r_hand", "ai_robot_base_stn_shutdown", "ai_robot_base_stn_shutdown_", "ai_robot_base_stn_shutdown_idle", "ai_robot_base_tac_fast_walk_b", "ai_robot_base_tac_fast_walk_f", "ai_robot_base_tac_fast_walk_l", "ai_robot_base_tac_fast_walk_r", "ai_robot_base_tac_walk_b", "ai_robot_base_tac_walk_b_aim_", "ai_robot_base_tac_walk_b_pain_chest_f", "ai_robot_base_tac_walk_f", "ai_robot_base_tac_walk_f_aim_", "ai_robot_base_tac_walk_f_pain_chest_f", "ai_robot_base_tac_walk_juke_left", "ai_robot_base_tac_walk_juke_right", "ai_robot_base_tac_walk_l", "ai_robot_base_tac_walk_l_aim_", "ai_robot_base_tac_walk_l_pain_chest_f", "ai_robot_base_tac_walk_r", "ai_robot_base_tac_walk_r_aim_", "ai_robot_base_tac_walk_r_pain_chest_f", "ai_robot_base_tac_walk_scan_f", "ai_robot_base_trv_jump_across_", "ai_robot_base_trv_jump_down_", "ai_robot_base_trv_jump_up_", "ai_robot_base_trv_ladder_down_", "ai_robot_base_trv_ladder_up_", "ai_robot_base_trv_mantle_over_", "ai_robot_base_trv_multiplayer_idle", "ai_robot_base_trv_multiplayer_jump", "ai_robot_base_trv_multiplayer_jump_idle_aim_", "ai_robot_base_trv_multiplayer_land", "ai_robot_base_vs_player_run_", "ai_robot_base_wallrun_air_left_down_idle", "ai_robot_base_wallrun_air_left_up_idle", "ai_robot_base_wallrun_air_right_down_idle", "ai_robot_base_wallrun_air_right_up_idle", "ai_robot_base_wallrun_jump_left_ground_up", "ai_robot_base_wallrun_jump_left_wall_out", "ai_robot_base_wallrun_jump_left_wall_up", "ai_robot_base_wallrun_jump_right_ground_up", "ai_robot_base_wallrun_jump_right_wall_out", "ai_robot_base_wallrun_jump_right_wall_up", "ai_robot_base_wallrun_land_left_ground_down", "ai_robot_base_wallrun_land_left_wall_down", "ai_robot_base_wallrun_land_left_wall_in", "ai_robot_base_wallrun_land_right_ground_down", "ai_robot_base_wallrun_land_right_wall_down", "ai_robot_base_wallrun_land_right_wall_in", "ai_robot_base_wallrun_run_left", "ai_robot_base_wallrun_run_left_aim_", "ai_robot_base_wallrun_run_right", "ai_robot_base_wallrun_run_right_aim_", "ai_robot_mind_ctrl_override", "ai_robot_rogue_ctrl_crc_shutdown_", "ai_robot_rogue_ctrl_crc_shutdown_idle", "ai_robot_rogue_ctrl_dmg_fastwalk_f", "ai_robot_rogue_ctrl_dmg_fastwalk_f_alt_a", "ai_robot_rogue_ctrl_dmg_fastwalk_f_alt_b", "ai_robot_rogue_ctrl_dmg_walk_f", "ai_robot_rogue_ctrl_dmg_walk_f_alt_a", "ai_robot_rogue_ctrl_dmg_walk_f_alt_b", "ai_robot_rogue_ctrl_exposed_idle", "ai_robot_rogue_ctrl_exposed_idle_twitch", "ai_robot_rogue_ctrl_exposed_pain_face", "ai_robot_rogue_ctrl_fastwalk_f", "ai_robot_rogue_ctrl_fastwalk_f_pain_chest", "ai_robot_rogue_ctrl_fastwalk_f_pain_head", "ai_robot_rogue_ctrl_fastwalk_f_pain_legs", "ai_robot_rogue_ctrl_melee_left_arm_b", "ai_robot_rogue_ctrl_melee_left_arm_c", "ai_robot_rogue_ctrl_melee_right_arm_a", "ai_robot_rogue_ctrl_melee_right_arm_b", "ai_robot_rogue_ctrl_melee_right_arm_c", "ai_robot_rogue_ctrl_riotshield_exposed_idle", "ai_robot_rogue_ctrl_riotshield_exposed_pain_face", "ai_robot_rogue_ctrl_riotshield_fastwalk_f", "ai_robot_rogue_ctrl_riotshield_fastwalk_f_pain_chest_f", "ai_robot_rogue_ctrl_riotshield_fastwalk_f_pain_head_f", "ai_robot_rogue_ctrl_riotshield_fastwalk_f_pain_legs_f", "ai_robot_rogue_ctrl_riotshield_stn_shutdown", "ai_robot_rogue_ctrl_riotshield_stn_shutdown_", "ai_robot_rogue_ctrl_riotshield_stn_shutdown_idle", "ai_robot_rogue_ctrl_riotshield_walk_f", "ai_robot_rogue_ctrl_riotshield_walk_f_pain_chest_f", "ai_robot_rogue_ctrl_riotshield_walk_f_pain_head_f", "ai_robot_rogue_ctrl_riotshield_walk_f_pain_legs_f", "ai_robot_rogue_ctrl_run_lowready_f_death_chest_a", "ai_robot_rogue_ctrl_run_lowready_f_death_head_a", "ai_robot_rogue_ctrl_run_lowready_f_death_legs_a", "ai_robot_rogue_ctrl_run_lowready_f_death_legs_b", "ai_robot_rogue_ctrl_run_lowready_f_dmg_alt_a", "ai_robot_rogue_ctrl_run_lowready_f_dmg_alt_b", "ai_robot_rogue_ctrl_run_lowready_f_dmg_alt_c", "ai_robot_rogue_ctrl_run_lowready_f_pain_chest", "ai_robot_rogue_ctrl_run_lowready_f_pain_head", "ai_robot_rogue_ctrl_run_lowready_f_pain_legs", "ai_robot_rogue_ctrl_run_lowready_f_v", "ai_robot_rogue_ctrl_run_turn_", "ai_robot_rogue_ctrl_stn_", "ai_robot_rogue_ctrl_stn_melee_left_arm_a", "ai_robot_rogue_ctrl_stn_melee_right_arm_a", "ai_robot_rogue_ctrl_walk_f", "ai_robot_rogue_ctrl_walk_f_death_a", "ai_robot_rogue_ctrl_walk_f_death_b", "ai_robot_rogue_ctrl_walk_f_pain_chest", "ai_robot_rogue_ctrl_walk_f_pain_head", "ai_robot_rogue_ctrl_walk_f_pain_legs", "ai_robot_rogue_ctrl_walk_turn_", "ai_robot_rogue_trv_jump_across_", "ai_robot_rogue_trv_jump_down_", "ai_robot_rogue_trv_jump_up_", "ai_robot_rogue_trv_ladder_down_", "ai_robot_rogue_trv_ladder_up_", "ai_robot_rogue_trv_mantle_over_", "ai_secondary_facial_anim", "ai_siegebot_base_rocket_doors_close", "ai_siegebot_base_rocket_doors_open", "ai_spider_idle", "ai_spider_idle_turn_l", "ai_spider_idle_turn_r", "ai_spider_run_f", "ai_spider_sprint_f", "ai_spider_strafe_l", "ai_spider_strafe_r", "ai_spider_strafe_run_l", "ai_spider_strafe_run_r", "ai_spider_walk_b", "ai_spider_walk_f", "ai_squads", "ai_tank", "ai_tank_death", "ai_tank_drone_gun", "ai_tank_drone_gun_mp", "ai_tank_drone_mp", "ai_tank_drone_nondrivable_mp", "ai_tank_drone_rocket", "ai_tank_drop", "ai_tank_drop_hint", "ai_tank_drop_marker", "ai_tank_drop_used", "ai_tank_marker", "ai_tank_marker_mp", "ai_tank_missile_fire", "ai_tank_stun", "ai_tank_update_hud", "ai_tank_waypoint", "ai_threatUpdateInterval", "ai_useLeanRunAnimations", "ai_wrlrd_stn_combat_doa_plant_mine", "ai_wrlrd_stn_combat_dth_pose", "ai_zombie_barricade_enter_l", "ai_zombie_barricade_enter_m_nolegs", "ai_zombie_barricade_enter_m_v", "ai_zombie_barricade_enter_r", "ai_zombie_barricade_enter_run_l", "ai_zombie_barricade_enter_run_r", "ai_zombie_barricade_enter_sprint_l", "ai_zombie_barricade_enter_sprint_r", "ai_zombie_base_dth_pose", "ai_zombie_base_idle_ad_v", "ai_zombie_base_idle_au_v", "ai_zombie_base_walk_fast_ad_v", "ai_zombie_boardtear_aligned_l_", "ai_zombie_boardtear_aligned_m_", "ai_zombie_boardtear_aligned_r_", "ai_zombie_boss_enrage_start", "ai_zombie_crawl_barricade_enter_l", "ai_zombie_crawl_barricade_enter_r", "ai_zombie_crawl_barricade_enter_run_l", "ai_zombie_crawl_barricade_enter_run_r", "ai_zombie_crawl_barricade_enter_sprint_l", "ai_zombie_crawl_barricade_enter_sprint_r", "ai_zombie_crawl_boardtear_aligned_l_", "ai_zombie_crawl_boardtear_aligned_m_", "ai_zombie_crawl_boardtear_aligned_r_", "ai_zombie_crawl_death_v", "ai_zombie_doa_cheer_v", "ai_zombie_doa_simianaut_attack_swing_overhead", "ai_zombie_doa_simianaut_attack_v", "ai_zombie_doa_simianaut_chestbeat", "ai_zombie_doa_simianaut_ground_pound", "ai_zombie_doa_simianaut_mech_idle", "ai_zombie_doa_simianaut_mech_idle_eject", "ai_zombie_doa_simianaut_mech_idle_taunt", "ai_zombie_doa_simianaut_taunt", "ai_zombie_inf_boardtear_aligned_m_", "ai_zombie_inf_ceiling_aligned_m_", "ai_zombie_inf_furniture_aligned_m_", "ai_zombie_inf_wallbreak_aligned_m_", "ai_zombie_inf_window_aligned_m_", "ai_zombie_taunts_", "ai_zombie_traverse_ground_climbout_fast", "ai_zombie_traverse_ground_v", "ai_zombie_window_attack_arm_l_out", "ai_zombie_window_attack_arm_r_out", "ai_zombie_zod_gateworm_idle_loop", "ai_zombie_zod_gateworm_large_idle_loop", "ai_zombie_zod_gateworm_large_idle_loop_active", "ai_zombie_zod_insanity_elemental_idle", "ai_zombie_zod_keeper_give_egg_intro", "ai_zombie_zod_keeper_give_egg_loop", "ai_zombie_zod_keeper_give_egg_outro", "ai_zombie_zod_keeper_give_me_sword_intro", "ai_zombie_zod_keeper_give_me_sword_loop", "ai_zombie_zod_keeper_give_me_sword_outro", "ai_zombie_zod_keeper_idle", "ai_zombie_zod_keeper_sword_quest_attack_idle", "ai_zombie_zod_keeper_sword_quest_attack_intro", "ai_zombie_zod_keeper_sword_quest_injured_idle", "ai_zombie_zod_keeper_sword_quest_injured_intro", "ai_zombie_zod_keeper_sword_quest_intro_idle", "ai_zombie_zod_keeper_sword_quest_ready_idle", "ai_zombie_zod_keeper_sword_quest_revived", "ai_zombie_zod_keeper_sword_quest_take_sword", "ai_zombie_zod_keeper_upgrade_sword", "ai_zombie_zod_raps_dth_f_id_gun_crush", "ai_zombie_zod_ritual_sacrifice_intro", "ai_zombie_zod_ritual_sacrifice_loop", "ai_zombie_zod_ritual_sacrifice_outro", "ai_zombie_zod_shadowman_captured_intro", "ai_zombie_zod_shadowman_captured_loop", "ai_zombie_zod_shadowman_captured_outro", "ai_zombie_zod_shadowman_float_attack_aoe_charge_intro", "ai_zombie_zod_shadowman_float_attack_aoe_charge_loop", "ai_zombie_zod_shadowman_float_attack_aoe_deploy", "ai_zombie_zod_shadowman_float_attack_projectile_charge_intro", "ai_zombie_zod_shadowman_float_attack_projectile_charge_loop", "ai_zombie_zod_shadowman_float_attack_projectile_throw", "ai_zombie_zod_shadowman_float_idle_loop", "ai_zombie_zod_shadowman_human_stand_idle_loop", "ai_zombie_zod_shadowman_stand_idle_loop", "ai_zombie_zod_sword_pain_reaction", "ai_zombie_zod_train_win_trav_from_roof_b", "ai_zombie_zod_train_win_trav_from_roof_f", "ai_zombie_zod_train_win_trav_from_roof_l", "ai_zombie_zod_train_win_trav_from_roof_r", "aim_additive", "aim_additive_over", "aim_assist", "aim_autoAimRangeScale", "aim_autoaim_enabled", "aim_delta", "aim_down", "aim_down_limit", "aim_left", "aim_right", "aim_tag", "aim_target_sentient_radius", "aim_up", "aim_updated", "all_cracks_off", "all_cracks_on", "all_knowing", "all_player", "all_players_are_connected", "all_players_connected", "all_players_spawned", "all_proxy", "all_run_puta", "all_run_rai", "all_run_rais", "all_run_raise", "ammoCounterHide", "anim_alertness", "anim_all_jnt", "anim_charge_in_left_arm_melee", "anim_charge_in_left_arm_walk_melee", "anim_charge_in_right_arm_melee", "anim_charge_in_right_arm_walk_melee", "anim_charge_melee_attack", "anim_charge_melee_left", "anim_charge_melee_right", "anim_charge_run_to_enemy", "anim_charge_run_to_enemy_alt", "anim_charge_to_enemy", "anim_charge_to_enemy_alt", "anim_charge_walk_to_enemy_alt", "anim_climb_down_combat_", "anim_climb_up_combat_", "anim_cover_crouch_alert_to_over", "anim_cover_crouch_over_aim_down", "anim_cover_crouch_over_aim_left", "anim_cover_crouch_over_aim_right", "anim_cover_crouch_over_aim_up", "anim_cover_crouch_pain_chest", "anim_cover_crouch_pain_head", "anim_cover_crouch_scan_", "anim_cover_crouch_shoot_burst", "anim_cover_crouch_shoot_semiauto", "anim_cover_crouch_shoot_singleshot", "anim_cover_death", "anim_cover_grenade_throw", "anim_cover_grenade_throw_left", "anim_cover_grenade_throw_right", "anim_cover_idle", "anim_cover_left_alert_", "anim_cover_left_scan_", "anim_cover_over", "anim_cover_over_", "anim_cover_react_back", "anim_cover_react_front", "anim_cover_react_left", "anim_cover_react_right", "anim_cover_reload", "anim_cover_right_alert_", "anim_cover_right_scan_", "anim_cover_stand_scan", "anim_cover_stand_scan_left", "anim_cover_stand_scan_right", "anim_cover_step_in_left", "anim_cover_step_in_left_crouch", "anim_cover_step_in_right", "anim_cover_step_in_right_crouch", "anim_cover_step_out_left", "anim_cover_step_out_left_crouch", "anim_cover_step_out_right", "anim_cover_step_out_right_crouch", "anim_death_crc_es_strike", "anim_death_es_strike", "anim_death_stand_rapid_strike_back", "anim_death_stand_rapid_strike_front", "anim_death_stand_rapid_strike_left", "anim_death_stand_rapid_strike_right", "anim_death_stand_ravage_core", "anim_emp_crouch_idle", "anim_emp_crouch_shutdown", "anim_emp_crouch_startup", "anim_emp_idle", "anim_emp_shutdown", "anim_emp_startup", "anim_exposed_crouch_", "anim_exposed_crouch_aim_down", "anim_exposed_crouch_aim_left", "anim_exposed_crouch_aim_right", "anim_exposed_crouch_aim_up", "anim_exposed_crouch_death", "anim_exposed_crouch_greande_throw", "anim_exposed_crouch_idle", "anim_exposed_crouch_pain_chest", "anim_exposed_crouch_pain_flinch", "anim_exposed_crouch_pain_groin", "anim_exposed_crouch_pain_headsnap", "anim_exposed_crouch_pain_left_arm", "anim_exposed_crouch_pain_legs", "anim_exposed_crouch_pain_right_arm", "anim_exposed_crouch_reload", "anim_exposed_crouch_shoot_", "anim_exposed_crouch_shoot_burst", "anim_exposed_crouch_shoot_semi", "anim_exposed_crouch_shoot_single", "anim_exposed_crouch_turn", "anim_exposed_death", "anim_exposed_death_crawl_right", "anim_exposed_death_crc_immolate", "anim_exposed_death_stn_immolate", "anim_exposed_grenade_throw", "anim_exposed_idle", "anim_exposed_melee_left", "anim_exposed_melee_right", "anim_exposed_mind_control_idle", "anim_exposed_pain_back", "anim_exposed_pain_chest", "anim_exposed_pain_crc_force_malfunction", "anim_exposed_pain_crc_immolate", "anim_exposed_pain_crc_juiced", "anim_exposed_pain_crc_surge", "anim_exposed_pain_crc_system_overload", "anim_exposed_pain_groin", "anim_exposed_pain_head", "anim_exposed_pain_left_arm", "anim_exposed_pain_leg", "anim_exposed_pain_right_arm", "anim_exposed_pain_stn_forced_malfunction", "anim_exposed_pain_stn_immolate", "anim_exposed_pain_stn_juiced", "anim_exposed_pain_stn_surge", "anim_exposed_pain_stn_system_overload", "anim_exposed_reload", "anim_exposed_rifle_stand_casual_", "anim_exposed_shoot_", "anim_exposed_shoot_burst", "anim_exposed_shoot_semi", "anim_exposed_shoot_semi_", "anim_exposed_shoot_single", "anim_exposed_stand_", "anim_exposed_stand_aim_down", "anim_exposed_stand_aim_left", "anim_exposed_stand_aim_right", "anim_exposed_stand_aim_up", "anim_exposed_stand_back_", "anim_exposed_stand_death_electrified", "anim_exposed_stand_front_", "anim_exposed_stand_left_", "anim_exposed_stand_right_", "anim_exposed_to_crawl_right", "anim_exposed_tracking_turn", "anim_gib_stand_death_legs", "anim_gunhand", "anim_idle_crawl", "anim_jump_across_combat_", "anim_jump_down_combat_", "anim_jump_idle_aim_down", "anim_jump_idle_aim_left", "anim_jump_idle_aim_right", "anim_jump_idle_aim_up", "anim_jump_up_combat_", "anim_locomotion_run_pain_chest", "anim_locomotion_run_pain_head", "anim_locomotion_run_pain_legs", "anim_locomotion_sprint_pain_chest", "anim_locomotion_sprint_pain_head", "anim_locomotion_sprint_pain_legs", "anim_locomotion_walk_pain_chest", "anim_locomotion_walk_pain_head", "anim_locomotion_walk_pain_legs", "anim_mantle_over_", "anim_mantle_over_combat_", "anim_melee", "anim_mind_control_explode_death", "anim_mind_control_locomotion_death", "anim_mind_control_locomotion_walk_death", "anim_mind_control_take_over_level_", "anim_move_combat_juke_forward_left", "anim_move_combat_juke_forward_right", "anim_move_combat_juke_left", "anim_move_combat_juke_right", "anim_move_crawl_left", "anim_move_crawl_right", "anim_move_rifle_combat_march_f", "anim_move_rifle_combat_march_f_aim_down", "anim_move_rifle_combat_march_f_aim_left", "anim_move_rifle_combat_march_f_aim_right", "anim_move_rifle_combat_march_f_aim_up", "anim_move_rifle_combat_sprint_f_aim_down", "anim_move_rifle_combat_sprint_f_aim_left", "anim_move_rifle_combat_sprint_f_aim_right", "anim_move_rifle_combat_sprint_f_aim_up", "anim_move_rifle_combat_super_sprint_f", "anim_move_rifle_combat_tactical_b", "anim_move_rifle_combat_tactical_b_aim_down", "anim_move_rifle_combat_tactical_b_aim_left", "anim_move_rifle_combat_tactical_b_aim_right", "anim_move_rifle_combat_tactical_b_aim_up", "anim_move_rifle_combat_tactical_b_pain", "anim_move_rifle_combat_tactical_f", "anim_move_rifle_combat_tactical_f_aim_down", "anim_move_rifle_combat_tactical_f_aim_left", "anim_move_rifle_combat_tactical_f_aim_right", "anim_move_rifle_combat_tactical_f_aim_up", "anim_move_rifle_combat_tactical_f_pain", "anim_move_rifle_combat_tactical_l", "anim_move_rifle_combat_tactical_l_aim_down", "anim_move_rifle_combat_tactical_l_aim_left", "anim_move_rifle_combat_tactical_l_aim_right", "anim_move_rifle_combat_tactical_l_aim_up", "anim_move_rifle_combat_tactical_l_pain", "anim_move_rifle_combat_tactical_r", "anim_move_rifle_combat_tactical_r_aim_down", "anim_move_rifle_combat_tactical_r_aim_left", "anim_move_rifle_combat_tactical_r_aim_right", "anim_move_rifle_combat_tactical_r_aim_up", "anim_move_rifle_combat_tactical_r_pain", "anim_move_rifle_combat_tactical_scan_f", "anim_move_rifle_combat_tactical_sprint_b", "anim_move_rifle_combat_tactical_sprint_f", "anim_move_rifle_combat_tactical_sprint_l", "anim_move_rifle_combat_tactical_sprint_r", "anim_movement", "anim_pose", "anim_reach", "anim_rogue_climb_down_combat_", "anim_rogue_climb_up_combat_", "anim_rogue_emp_idle", "anim_rogue_emp_shutdown", "anim_rogue_emp_startup", "anim_rogue_exposed_pain", "anim_rogue_jump_across_combat_", "anim_rogue_jump_down_combat_", "anim_rogue_jump_up_combat_", "anim_rogue_mantle_over_", "anim_rogue_mantle_over_combat_", "anim_rogue_melee_left", "anim_rogue_melee_right", "anim_rogue_run_turn_", "anim_rogue_traverse_jump_up_", "anim_rogue_walk_turn_", "anim_rogue_window_combat", "anim_shoot_crawl_aim", "anim_shoot_crawl_burst", "anim_shoot_crawl_semi", "anim_shoot_crawl_single", "anim_shoot_idle", "anim_shoot_idle_crouch", "anim_traverse_idle", "anim_traverse_jump", "anim_traverse_jump_up_", "anim_traverse_land", "anim_wallrun_air_left_down", "anim_wallrun_air_left_up", "anim_wallrun_air_right_down", "anim_wallrun_air_right_up", "anim_wallrun_jump_left_ground_up", "anim_wallrun_jump_left_wall_out", "anim_wallrun_jump_left_wall_up", "anim_wallrun_jump_right_ground_up", "anim_wallrun_jump_right_wall_out", "anim_wallrun_jump_right_wall_up", "anim_wallrun_land_left_ground_down", "anim_wallrun_land_left_wall_down", "anim_wallrun_land_left_wall_in", "anim_wallrun_land_right_ground_down", "anim_wallrun_land_right_wall_down", "anim_wallrun_land_right_wall_in", "anim_wallrun_left_aim_down", "anim_wallrun_left_aim_left", "anim_wallrun_left_aim_right", "anim_wallrun_left_aim_up", "anim_wallrun_right_aim_down", "anim_wallrun_right_aim_left", "anim_wallrun_right_aim_right", "anim_wallrun_right_aim_up", "anim_wallrun_run_left", "anim_wallrun_run_right", "anim_window_combat", "auto_ai", "auto_change", "auto_gun_turret", "auto_gun_turret_mp", "auto_nonai", "auto_tow", "auto_turret", "auto_turret_close", "auto_turret_init", "auto_turret_open", "auto_turret_used", "axis_assault", "axis_base", "axis_eliminated", "axis_flag", "axis_forfeited", "axis_lives", "axis_mission_accomplished", "axis_name", "axis_rifle", "axis_smg", "axis_turret", "axis_win", "axis_win_round", "axis_x", "axis_y", "axis_z", "back_left", "back_low", "back_mid", "back_right", "back_right_shin_d", "back_up", "badHost_detectMinServerTime", "bad_address", "bad_file_descriptor", "bad_path", "badhost_maxDoISuckFrames", "ball_ball", "ball_capture_assist", "ball_capture_carry", "ball_capture_throw", "ball_goal_allies", "ball_goal_axis", "ball_intercept", "ball_mp", "ball_on_notify_", "ball_pass", "ball_world_mps", "ball_world_pass_mp", "band_12players", "band_18players", "band_2players", "band_4players", "band_8players", "bandwidth_up", "battery_ability", "battery_weapon", "begin_custom_anim", "begin_firing", "bg_allowScuffFootsteps", "bg_bulletExplDmgFactor", "bg_bulletExplRadius", "bg_checkpoint_client_save_size", "bg_checkpoint_server_save_size", "bg_collectibles", "bg_compassShowEnemies", "bg_fallDamageMaxHeight", "bg_fallDamageMinHeight", "bg_gravity", "bg_meleeWeaponMinQuickDropTime", "bg_mpGameplayActive", "bg_shieldHitEncodeHeightVM", "bg_shieldHitEncodeHeightWorld", "bg_shieldHitEncodeWidthVM", "bg_shieldHitEncodeWidthWorld", "bg_shock_fadeOverride", "bg_shock_lookControl", "bg_shock_lookControl_fadeTime", "bg_shock_lookControl_maxpitchspeed", "bg_shock_lookControl_maxyawspeed", "bg_shock_lookControl_mousesensitivityscale", "bg_shock_movement", "bg_shock_screenBlurBlendFadeTime", "bg_shock_screenBlurBlendTime", "bg_shock_screenFlashShotFadeTime", "bg_shock_screenFlashWhiteFadeTime", "bg_shock_screenType", "bg_shock_sound", "bg_shock_soundDryLevel", "bg_shock_soundEnd", "bg_shock_soundEndAbort", "bg_shock_soundFadeInTime", "bg_shock_soundFadeOutTime", "bg_shock_soundLoop", "bg_shock_soundLoopEndDelay", "bg_shock_soundLoopFadeTime", "bg_shock_soundLoopSilent", "bg_shock_soundModEndDelay", "bg_shock_soundRoomType", "bg_shock_soundSubmix", "bg_shock_soundWetLevel", "bg_shock_viewKickFadeTime", "bg_shock_viewKickPeriod", "bg_shock_viewKickRadius", "bg_swingSpeed", "bg_torsoSwingSpeed", "bg_viewBobAmplitudeBa", "bg_weaponBobAmplitudeBase", "body_animate", "body_animate_jnt", "body_armor", "body_d", "bomb_detonated", "bomb_timer", "bomb_timer_a", "bomb_timer_b", "boostcheatHeadshotsTotalCoef", "boostcheatHeadshotsTotalStddev", "boostcheatKillerXAnomalyCoef", "boostcheatKillerXAnomalyMean", "boostcheatKillerXAnomalyStddev", "boostcheatKillerYAnomalyCoef", "boostcheatKillerYAnomalyMean", "boostcheatKillerYAnomalyStddev", "boostcheatMeanDistanceMostKilledPlayerTraveledCoef", "boostcheatMeanDistanceMostKilledPlayerTraveledMean", "boostcheatMeanDistanceMostKilledPlayerTraveledStddev", "boostcheatMeanDistanceVictimTraveledCoef", "boostcheatMeanDistanceVictimTraveledMean", "boostcheatMeanDistanceVictimTraveledStddev", "boostcheatMeanMostKilledPlayerLifetimeMillisecondsCoef", "boostcheatMeanMostKilledPlayerLifetimeMillisecondsMean", "boostcheatMeanMostKilledPlayerLifetimeMillisecondsStddev", "boostcheatMostKilledPlayerHKRatioCoef", "boostcheatMostKilledPlayerHKRatioMean", "boostcheatMostKilledPlayerHKRatioStddev", "boostcheatMostKilledPlayerKillTimestampsAnomalyCoef", "boostcheatMostKilledPlayerKillTimestampsAnomalyMean", "boostcheatMostKilledPlayerKillTimestampsAnomalyStddev", "boostcheatMostKilledPlayerKillsRatioCoef", "boostcheatMostKilledPlayerKillsRatioMean", "boostcheatMostKilledPlayerKillsRatioStddev", "boostcheatMostKilledPlayerKillsTotalCoef", "boostcheatMostKilledPlayerKillsTotalMean", "boostcheatMostKilledPlayerKillsTotalStddev", "boostcheatVictimXAnomalyCoef", "boostcheatVictimXAnomalyMean", "boostcheatVictimXAnomalyStddev", "boostcheatVictimYAnomalyCoef", "boostcheatVictimYAnomalyMean", "boostcheatVictimYAnomalyStddev", "bot_AllowGrenades", "bot_AllowHeroGadgets", "bot_AllowKillstreaks", "bot_AllowMelee", "bot_Fov", "bot_FovAds", "bot_PitchSensitivity", "bot_PitchSpeed", "bot_PitchSpeedAds", "bot_YawSensitivity", "bot_YawSpeed", "bot_YawSpeedAds", "bot_base_rocket_", "bot_construct_loadout", "bot_corner", "bot_default", "bot_difficulty", "bot_goal_reached", "bot_loadout", "bot_maxAllies", "bot_maxAxis", "bot_maxFree", "bot_mp", "bot_mp_easy", "bot_mp_hard", "bot_mp_normal", "bot_mp_veteran", "bot_path_failed", "bot_path_success", "build_data_cl", "bulletPenetrationPatchFix", "bullet_alert_distance", "bullet_ap", "bullet_default_distance", "bullet_default_height", "bullet_feed", "bullet_large", "bullet_lifespan", "bullet_penetration", "bullet_pool_value", "bullet_priority", "bullet_react", "bullet_react_alert_distance", "bullet_react_default_distance", "bullet_react_default_height", "bullet_shotgun_lod", "bullet_small", "bullet_xtreme", "cSplineDebugRenderCorridor", "cSplineDebugRenderSplineId", "ca_auto_signin", "ca_do_mlc", "ca_intra_only", "ca_require_signin", "ca_show_signup_request", "cac_mods_acog", "cac_mods_barrel_extend", "cac_mods_bors", "cac_mods_dual_clip", "cac_mods_extended_mag", "cac_mods_extended_stock", "cac_mods_fmj", "cac_mods_foregrip", "cac_mods_laser", "cac_mods_pistol_grip", "cac_mods_rapid_fire", "cac_mods_red_dot_tu", "cac_mods_reflex", "cac_mods_suppressor", "cachedContentDebug", "cachedContentStreamRequestTimeout", "call_in_", "call_of_duty_news", "call_vote", "cameraShakeRemoteHelo_Angles", "cameraShakeRemoteHelo_Freqs", "cameraShakeRemoteHelo_SpeedRange", "cameraShakeRemoteMissile_Angles", "cameraShakeRemoteMissile_Freqs", "cameraShakeRemoteMissile_SpeedRange", "camera_set_lens_id", "camera_spike", "camera_thirdPerson", "cancel_location", "cg_ColorBlind_EnemyTeam", "cg_ColorBlind_MyParty", "cg_ColorBlind_MyTeam", "cg_IsWarnedAZERTY", "cg_TeamColor_Allies", "cg_TeamColor_Axis", "cg_TeamColor_EnemyTeam", "cg_TeamColor_Free", "cg_TeamColor_MyParty", "cg_TeamColor_MyTeam", "cg_TeamColor_Spectator", "cg_airstrikeCamFstop", "cg_airstrikeKillCamFarBlur", "cg_airstrikeKillCamFarBlurDist", "cg_airstrikeKillCamFarBlurStart", "cg_airstrikeKillCamFov", "cg_airstrikeKillCamNearBlur", "cg_airstrikeKillCamNearBlurEnd", "cg_airstrikeKillCamNearBlurStart", "cg_blood", "cg_bloodThickColor", "cg_bloodThinColor", "cg_brass", "cg_cameraUseTagCamera", "cg_centertime", "cg_chatHeight", "cg_chatTime", "cg_connectionIconSize", "cg_constantSizeHeadIcons", "cg_crosshairAlpha", "cg_crosshairAlphaMin", "cg_crosshairDynamic", "cg_crosshairEnemyColor", "cg_cullBulletAngle", "cg_cullBullets", "cg_cursorHints", "cg_deadChatWithDead", "cg_deadChatWithTeam", "cg_deadHearAllLiving", "cg_deadHearTeamLiving", "cg_descriptiveText", "cg_draw2D", "cg_drawBreathHint", "cg_drawBuildName", "cg_drawCrosshair", "cg_drawCrosshairNames", "cg_drawCrosshairNamesPosX", "cg_drawCrosshairNamesPosY", "cg_drawCrosshairOption", "cg_drawDamageDirection", "cg_drawDamageFeedbackOption", "cg_drawDamageFlash", "cg_drawDoubleTapDetonateHint", "cg_drawEffectNum", "cg_drawFPS", "cg_drawFPSLabels", "cg_drawFriendlyHUDGrenades", "cg_drawFriendlyNames", "cg_drawFriendlyNamesAlways", "cg_drawGun", "cg_drawHealth", "cg_drawMantleHint", "cg_drawMaterial", "cg_drawScriptUsage", "cg_drawSnapshot", "cg_drawSpectatorMessages", "cg_drawStatsSource", "cg_drawTalk", "cg_drawTurretCrosshair", "cg_drawViewpos", "cg_drawpaused", "cg_e3TrailerHacks", "cg_enableUGC", "cg_equipmentSounds", "cg_errordecay", "cg_everyoneHearsEveryone", "cg_explosiveKillCamBackDist", "cg_explosiveKillCamGroundBackDist", "cg_explosiveKillCamGroundUpDist", "cg_explosiveKillCamStopDecelDist", "cg_explosiveKillCamStopDist", "cg_explosiveKillCamUpDist", "cg_explosiveKillCamWallOutDist", "cg_explosiveKillCamWallSideDist", "cg_flashbangNameFadeIn", "cg_flashbangNameFadeOut", "cg_foliagesnd_alias", "cg_footsteps", "cg_footstepsSprint", "cg_fov", "cg_fovMin", "cg_fovScale", "cg_fov_default", "cg_fov_default_thirdperson", "cg_friendlyNameFadeIn", "cg_friendlyNameFadeOut", "cg_gameBoldMessageWidth", "cg_gameMessageWidth", "cg_gibs", "cg_headIconMinScreenRadius", "cg_hearKillerTime", "cg_hearVictimEnabled", "cg_hearVictimTime", "cg_heliKillCamFarBlur", "cg_heliKillCamFarBlurDist", "cg_heliKillCamFarBlurStart", "cg_heliKillCamFov", "cg_heliKillCamFstop", "cg_heliKillCamNearBlur", "cg_heliKillCamNearBlurEnd", "cg_heliKillCamNearBlurStart", "cg_hintFadeTime", "cg_hudChatIntermissionPosition", "cg_hudChatPosition", "cg_hudDamageIconHeight", "cg_hudDamageIconInScope", "cg_hudDamageIconOffset", "cg_hudDamageIconOverlayTime", "cg_hudDamageIconStartFadeTime", "cg_hudDamageIconTime", "cg_hudDamageIconWidth", "cg_hudGrenadeIconEnabledFlash", "cg_hudGrenadeIconHeight", "cg_hudGrenadeIconInScope", "cg_hudGrenadeIconMaxRangeFlash", "cg_hudGrenadeIconMaxRangeFrag", "cg_hudGrenadeIconOffset", "cg_hudGrenadeIconWidth", "cg_hudGrenadePointerHeight", "cg_hudGrenadePointerPivot", "cg_hudGrenadePointerPulseFreq", "cg_hudGrenadePointerPulseMax", "cg_hudGrenadePointerPulseMin", "cg_hudGrenadePointerWidth", "cg_hudLighting_basic_additiveLumOffset", "cg_hudLighting_basic_additiveLumScale", "cg_hudLighting_basic_additiveOffset", "cg_hudLighting_basic_additiveScale", "cg_hudLighting_basic_ambientLumOffset", "cg_hudLighting_basic_ambientLumScale", "cg_hudLighting_basic_ambientOffset", "cg_hudLighting_basic_ambientScale", "cg_hudLighting_basic_diffuseLumOffset", "cg_hudLighting_basic_diffuseLumScale", "cg_hudLighting_basic_diffuseOffset", "cg_hudLighting_basic_diffuseScale", "cg_hudLighting_basic_specExponent", "cg_hudLighting_basic_specLumOffset", "cg_hudLighting_basic_specLumScale", "cg_hudLighting_basic_specOffset", "cg_hudLighting_basic_specScale", "cg_hudLighting_blood_additiveLumOffset", "cg_hudLighting_blood_additiveLumScale", "cg_hudLighting_blood_additiveOffset", "cg_hudLighting_blood_additiveScale", "cg_hudLighting_blood_ambientLumOffset", "cg_hudLighting_blood_ambientLumScale", "cg_hudLighting_blood_ambientOffset", "cg_hudLighting_blood_ambientScale", "cg_hudLighting_blood_diffuseLumOffset", "cg_hudLighting_blood_diffuseLumScale", "cg_hudLighting_blood_diffuseOffset", "cg_hudLighting_blood_diffuseScale", "cg_hudLighting_blood_specExponent", "cg_hudLighting_blood_specLumOffset", "cg_hudLighting_blood_specLumScale", "cg_hudLighting_blood_specOffset", "cg_hudLighting_blood_specScale", "cg_hudMapBorderWidth", "cg_hudMapFriendlyHeight", "cg_hudMapFriendlyWidth", "cg_hudMapPlayerHeight", "cg_hudMapPlayerWidth", "cg_hudMapRadarLineThickness", "cg_hudObjectiveTextScale", "cg_hudProneY", "cg_hudSayPosition", "cg_hudStanceFlash", "cg_hudVotePosition", "cg_hudlegacysplitscreenscale", "cg_hudsplitscreencompassscale", "cg_hudsplitscreenstancescale", "cg_invalidCmdHintBlinkInterval", "cg_invalidCmdHintDuration", "cg_javelinKillCamCloseZDist", "cg_javelinKillCamDownDist", "cg_javelinKillCamFov", "cg_javelinKillCamLookLerpDist", "cg_javelinKillCamPassDist", "cg_javelinKillCamPassTime", "cg_javelinKillCamUpDist", "cg_killCamDefaultLerpTime", "cg_killCamTurretLerpTime", "cg_landingSounds", "cg_largeExplosiveKillCamBackDist", "cg_largeExplosiveKillCamUpDist", "cg_laserforceon", "cg_mapLocationSelectionCursorSpeed", "cg_marks_ents_player_only", "cg_mature", "cg_meleeWeaponActivateBumperMaxTime", "cg_meleeWeaponActivateHoldTime", "cg_meleeWeaponActivateType", "cg_minCullBulletDist", "cg_overheadIconSize", "cg_overheadNamesFarDist", "cg_overheadNamesFarScale", "cg_overheadNamesFont", "cg_overheadNamesGlow", "cg_overheadNamesMaxDist", "cg_overheadNamesNearDist", "cg_overheadNamesSize", "cg_overheadRankSize", "cg_playerAnimStartTime", "cg_playerState", "cg_remoteMissileKillCamBackDist", "cg_remoteMissileKillCamUpDist", "cg_rocketKillCamBackDist", "cg_rocketKillCamUpDist", "cg_scriptIconSize", "cg_shellshock", "cg_shellshock_load", "cg_shellshock_save", "cg_showmiss", "cg_spectateThirdPerson", "cg_sprintMeterDisabledColor", "cg_sprintMeterEmptyColor", "cg_sprintMeterFullColor", "cg_subtitleMinTime", "cg_subtitleWidthStandard", "cg_subtitleWidthWidescreen", "cg_subtitles", "cg_t", "cg_teamChatsOnly", "cg_thirdPersonAngle", "cg_thirdperson", "cg_threatDetectorRadius", "cg_toggleScores", "cg_turretKillCamBackDist", "cg_turretKillCamFov", "cg_turretKillCamUpDist", "cg_turretRemoteKillCamBackDist", "cg_turretRemoteKillCamFov", "cg_turretRemoteKillCamUpDist", "cg_usingClientScripts", "cg_viewModelFov", "cg_viewVehicleInfluence", "cg_viewZSmoothingMax", "cg_viewZSmoothingMin", "cg_viewZSmoothingTime", "cg_voiceIconSize", "cg_waterSheeting_distortionScaleFactor", "cg_waterSheeting_magnitude", "cg_waterSheeting_radius", "cg_weapHitCullAngle", "cg_weapHitCullEnable", "cg_weaponCycleDelay", "cg_weaponHintsCoD1Style", "cg_weaponVisInterval", "cg_youInKillCamSize", "ch_l", "ch_lot_", "ch_new_", "ch_over_f", "ch_putaway", "ch_ram_", "ch_right", "ch_run_", "ch_run_b", "ch_run_fr", "ch_run_rb", "ch_shoot_ru", "ch_wal", "ch_walk_", "churnscore_cap_previoustitlematches", "churnscore_cap_totalkills", "churnscore_scaling_param1", "churnscore_scaling_param2", "churnscore_scoring_multiplier_currenttitlematches", "churnscore_scoring_multiplier_daysbetweentitles", "churnscore_scoring_multiplier_dayssincelaunch", "churnscore_scoring_multiplier_disconnectflag", "churnscore_scoring_multiplier_gameperformance", "churnscore_scoring_multiplier_previoustitlematches", "churnscore_scoring_multiplier_spflag", "churnscore_scoring_multiplier_timesincelastmatch", "churnscore_scoring_multiplier_totalkillscap", "churnscore_scoring_param1", "chyron_active", "cl_anglespeedkey", "cl_bypassMouseInput", "cl_connectTimeout", "cl_connectionAttempts", "cl_demo_uploadfb", "cl_dirSelConvergenceTime", "cl_force_paused", "cl_freelook", "cl_hudDrawsBehindUI", "cl_ingame", "cl_inhibit_stats_upload", "cl_maxPing", "cl_maxpackets", "cl_migrationTimeout", "cl_modifiedDebugPlacement", "cl_motdString", "cl_mouseAccel", "cl_noprint", "cl_packetdup", "cl_pauseAudioZoneEnabled", "cl_paused", "cl_pitchspeed", "cl_pranks", "cl_pushToTalk", "cl_serverStatusResendTime", "cl_showmouserate", "cl_smoothSnapInterval", "cl_textChatEnabled", "cl_thunderhead_prefix", "cl_timeout", "cl_voice", "cl_yawspeed", "clientSideEffects", "client_added", "client_content_sent", "client_count", "client_entity_offload", "client_flag", "client_fx", "client_removed", "client_server", "client_tagfxset", "client_ticket", "client_version", "cod_ads", "cod_anywhere_showPopup", "cod_anywhere_single_task_popup_text", "cod_hipfire", "cod_hold_breath", "cod_matureduck", "cod_menu", "cod_mpl_combat_awareness", "cod_xcam", "code_image_count", "code_image_size", "code_move", "code_pre_gfx", "code_warning_bandwidth", "code_warning_bandwidthlimited", "code_warning_collision", "code_warning_file", "code_warning_fps", "code_warning_gamestate", "code_warning_netchanclientwait", "code_warning_netchanlongframe", "code_warning_netchanlongsleep", "code_warning_netchanwait", "code_warning_scripterrors", "code_warning_serverfps", "code_warning_snapshotents", "color_clear", "color_clear_stenciled", "color_spawner", "com_animCheck", "com_churnscore_sendclientparams", "com_cinematicEndInWhite", "com_completionResolveCommand", "com_drawFPS_PC", "com_error", "com_errorMessage", "com_errorResolveCommand", "com_error]", "com_filter_output", "com_first_time", "com_first_time_account_linked", "com_first_time_mission_select", "com_first_time_privategame_host_zm", "com_firsttime_blackmarket", "com_firsttime_freerun", "com_hardwareSurveyed", "com_map", "com_maxFrameTime", "com_maxclients", "com_maxfps", "com_playerProfile", "com_privategame_ranked_zm", "com_recommendedSet", "com_report_syserrors", "com_smoothFrames", "commerce_dl_retry_step", "commerce_manifest_file_max_retry_time", "commerce_manifest_file_retry_step", "commerce_max_dl_retry_time", "commerce_max_retry_time", "commerce_retry_step", "compass", "compassClampIcons", "compassCoords", "compassECoordCutoff", "compassFriendlyHeight", "compassFriendlyWidth", "compassHideSansObjectivePointer", "compassHideVehicles", "compassMaxRange", "compassMinRadius", "compassMinRange", "compassObjectiveArrowHeight", "compassObjectiveArrowOffset", "compassObjectiveArrowRotateDist", "compassObjectiveArrowWidth", "compassObjectiveDetailDist", "compassObjectiveDrawLines", "compassObjectiveHeight", "compassObjectiveIconHeight", "compassObjectiveIconWidth", "compassObjectiveMaxHeight", "compassObjectiveMaxRange", "compassObjectiveMinAlpha", "compassObjectiveMinDistRange", "compassObjectiveMinHeight", "compassObjectiveNearbyDist", "compassObjectiveNumRings", "compassObjectiveRingSize", "compassObjectiveRingTime", "compassObjectiveTextHeight", "compassObjectiveTextScale", "compassObjectiveWidth", "compassObjectiveWraparoundTime", "compassPlayerHeight", "compassPlayerWidth", "compassRadarLineThickness", "compassRadarPingFadeTime", "compassRotation", "compassSize", "compassSoundPingFadeTime", "compassTickertapeStretch", "comscore_active", "comscore_hardware_survey_active", "con_gameMsgWindow", "con_gameMsgWindow0FadeInTime", "con_gameMsgWindow0FadeOutTime", "con_gameMsgWindow0Filter", "con_gameMsgWindow0LineCount", "con_gameMsgWindow0MsgTime", "con_gameMsgWindow0ScrollTime", "con_gameMsgWindow1FadeInTime", "con_gameMsgWindow1FadeOutTime", "con_gameMsgWindow1Filter", "con_gameMsgWindow1LineCount", "con_gameMsgWindow1MsgTime", "con_gameMsgWindow1ScrollTime", "con_gameMsgWindow2FadeInTime", "con_gameMsgWindow2FadeOutTime", "con_gameMsgWindow2Filter", "con_gameMsgWindow2LineCount", "con_gameMsgWindow2MsgTime", "con_gameMsgWindow2ScrollTime", "con_gameMsgWindow3FadeInTime", "con_gameMsgWindow3FadeOutTime", "con_gameMsgWindow3Filter", "con_gameMsgWindow3LineCount", "con_gameMsgWindow3MsgTime", "con_gameMsgWindow3ScrollTime", "con_hidelabel", "con_labellist", "con_showlabel", "con_typewriterColorBase", "con_typewriterColorGlowCheckpoint", "con_typewriterColorGlowCompleted", "con_typewriterColorGlowFailed", "con_typewriterColorGlowUpdated", "con_typewriterColorInteriorCheckpoint", "con_typewriterColorInteriorCompleted", "con_typewriterColorInteriorFailed", "con_typewriterColorInteriorUpdated", "con_typewriterDecayDuration", "con_typewriterDecayStartTime", "con_typewriterPrintSpeed", "confirm_hit", "confirm_location", "connect_host", "connect_lobby", "connect_to_lobby", "connect_type", "cpu_speed_12players", "cpu_speed_18players", "cpu_speed_8players", "csdRewardMasterKillswitch", "csdRewardRanks64", "custom_killstreak_", "custom_killstreak_mode", "custom_traversal", "custom_traversal_anim_finished", "dailychallenge_killswitch", "dailychallenge_killswitch2", "dailychallenge_period", "data_old", "data_version", "dc_lobbymerge", "dcacheThrottleEnabled", "dcacheThrottleKBytesPerSec", "death_alert_distance", "death_anim", "death_back", "death_back_", "death_default_distance", "death_dodger", "death_dynent_count", "death_dynent_elec_fx", "death_dynent_fire_fx", "death_dynent_force_maxscale", "death_dynent_force_minscale", "death_dynent_force_pitch", "death_dynent_force_yaw", "death_dynent_fx", "death_dynent_gib", "death_dynent_offsetX", "death_dynent_offsetY", "death_dynent_offsetZ", "death_dynmodel", "death_front", "death_front_", "death_left", "death_left_", "death_lifespan", "death_neckgrab_spurt", "death_or_disconnect", "death_pool_value", "death_priority", "death_right", "death_streak", "debug", "debug_anim_shared", "debug_color", "debug_crash_type", "debug_inspect", "demo_abortfilesharedownload", "demo_activatefreecameralockon", "demo_adddollycammarker", "demo_addlightmanmarker", "demo_applynewdollycammarkerposition", "demo_applynewlightmanmarkerposition", "demo_archived_animtree_count", "demo_back", "demo_backing", "demo_bg_cache_info_buffer_size", "demo_bg_cache_info_compressed_buffer_size", "demo_bundled_anims_count", "demo_button_outline", "demo_cancelhighlightreelcreation", "demo_cancelpreview", "demo_capturesegmentthumbnail", "demo_clearrenderflag", "demo_close_save_popup", "demo_controllerConfig", "demo_deactivatefreecameralockon", "demo_default_playback_keyframe_size", "demo_deleteclip", "demo_deletesegment", "demo_dollycam_marker_keyframe_size", "demo_editdollycammarker", "demo_editlightmanmarker", "demo_fileblockWriteRate", "demo_forward", "demo_jump", "demo_jumptostart", "demo_keyboard", "demo_keyboard_complete", "demo_mergesegments", "demo_movesegment", "demo_pause", "demo_pausecliprecord", "demo_play", "demo_player_switch", "demo_preview_point", "demo_previewclip", "demo_previewsegment", "demo_rebuildhighlightreeltimeline", "demo_regeneratehighlightreel", "demo_removedollycammarker", "demo_removelightmanmarker", "demo_repositiondollycammarker", "demo_repositionlightmanmarker", "demo_save_clip", "demo_save_screenshot", "demo_saveanduploadclip", "demo_savescreenshot", "demo_savesegment", "demo_screenshot", "demo_setlagflag", "demo_snapshot_bytes", "demo_start", "demo_startcliprecord", "demo_stop", "demo_switchcontrols", "demo_switchdollycammarker", "demo_switchlightmanmarker", "demo_switchplayer", "demo_switchtransition", "demo_timescale", "demo_toggledemohud", "demo_togglegamehud", "demo_uncomp_snapshot_bits", "demo_updatedollycammarkerparameters", "demo_updatelightmanmarkerparameters", "demonwareConsideredConnectedTime", "deploy_axe", "deploy_last", "deploy_riotshield", "developer", "device_id", "device_path", "device_type", "didyouknow", "disable_aivsai_melee", "disable_assist_", "disable_cybercom", "disable_fx", "discard_playerstats_on_suspend", "dof_ads_combine_near_far_coc", "dof_ads_combine_near_far_scope_coc", "dof_ads_near_coc", "dof_ads_near_scope_coc", "dof_blur_mip", "dof_blur_smooth", "dof_blur_upsample_mip", "dof_combine_near_far_coc", "dof_downsample_rgb_coc_mip", "dof_far_coc", "dof_final_blend_hi", "dof_final_blend_lo", "dof_final_blend_peaking", "dof_near_coc", "dof_near_coc_blur_x", "dof_near_coc_blur_y", "dof_near_coc_downsample", "dof_near_coc_upsample_mix", "dog_MeleeDamage", "dog_bite", "dog_bite_cp", "dog_health", "dog_hits_before_kill", "dog_kills", "dog_melee", "dog_presstime", "dog_spawner", "drawEntityCount", "drawEntityCountPos", "drawEntityCountSize", "drawKillcamData", "drawKillcamDataPos", "drawKillcamDataSize", "drawServerBandwidth", "drawServerBandwidthPos", "ds_Eds_Fds_G", "ds_acquirePeriod", "ds_bolt", "ds_dcid", "ds_dcid_override", "ds_info", "ds_info_enable", "ds_introRequestTimeout", "ds_keepaliveInterval", "ds_keepaliveTimeout", "ds_pingclient_max_reping_distance", "ds_pingclient_max_repings", "ds_pingclient_maxpings_per_tick", "ds_pingclient_min_reping_delay", "ds_pingclient_min_reping_latency", "ds_pingclient_odsf", "ds_pingclient_packets_lost_max", "ds_pingclient_resend_max", "ds_pingclient_resend_min", "dtp_end", "dtp_land", "dtp_rumble", "dtp_start", "dtp_through_glass", "duck_atten_value", "duck_group", "duck_lpf_value", "dwBandwidthTestTaskTimeout", "dw_addrHandleTimeout", "dw_leaderboard_show", "dw_leaderboard_write_active", "dw_presence_active", "dw_presence_coop_join_active", "dw_presence_get_delay", "dw_presence_get_rate", "dw_presence_put_delay", "dw_presence_put_rate", "dw_shared_presence_active", "dw_shared_presence_get_delay", "dw_shared_presence_get_rate", "dw_shared_presence_put_delay", "dw_shared_presence_put_rate", "dynEnt_active", "dynEnt_playerWakeUpZOffset", "elite_clan_active", "elite_clan_cool_off_time", "elite_clan_delay", "elite_clan_division_icon_active", "elite_clan_get_blob_profile_max_retry_time", "elite_clan_get_blob_profile_retry_step", "elite_clan_get_clan_max_retry_time", "elite_clan_get_clan_retry_step", "elite_clan_get_members_max_retry_time", "elite_clan_get_members_retry_step", "elite_clan_get_private_member_profile_max_retry_time", "elite_clan_get_private_member_profile_retry_step", "elite_clan_get_public_profile_max_retry_time", "elite_clan_get_public_profile_retry_step", "elite_clan_get_team_stats_max_retry_time", "elite_clan_get_team_stats_retry_step", "elite_clan_motd_throttle_time", "elite_clan_remote_view_active", "elite_clan_remote_view_max_retry_time", "elite_clan_remote_view_retry_step", "elite_clan_send_message_to_members_max_retry_time", "elite_clan_send_message_to_members_retry_step", "elite_clan_set_private_member_profile_max_retry_time", "elite_clan_set_private_member_profile_retry_step", "email_address", "emblems_active", "enable_dwnet", "enable_global_wind", "enable_popups", "enable_recordRecentActivity", "enable_video_options_preload_shader_controls", "end_damage_filter", "end_data", "end_date", "end_dealer", "end_death_delay", "end_enemy_gravity_spike_attack", "end_enemy_psychosis", "end_enemy_specialist_ability_with_emp", "end_enemy_specialist_weapon", "end_firing", "end_game_flow", "end_gametype", "end_killcam", "end_match", "end_patch", "end_remote", "end_stat", "end_toggle_field_fx_", "end_trig_death_monitor", "enemy_a", "enemy_b", "enemy_c", "enemy_goal", "enemy_not_visible", "enemy_or_motion", "enemy_or_motion_sidestep", "enemy_spawn", "enemy_visible", "entitlements_active", "entitlements_config_file_max_retry_time", "entitlements_config_file_retry_step", "entitlements_cool_off_time", "entitlements_delay", "entitlements_key_archive_max_retry_time", "entitlements_key_archive_retry_step", "error_msg", "exo_breakdown", "exp_heli_crash_loop", "exp_trophy_system", "exp_veh_helicopter_hit", "facebook_delay", "facebook_friends_active", "facebook_friends_max_retry_time", "facebook_friends_refresh_time", "facebook_friends_retry_step", "facebook_friends_throttle_time", "facebook_max_retry_time", "facebook_password_asterisk", "facebook_popup_text", "facebook_retry_step", "facebook_upload_photo_active", "facebook_upload_video_active", "faction_allies", "faction_alliesR", "faction_axis", "faction_axisJ", "faction_cdc", "faction_cia", "faction_popup", "fast_restart", "first_kill", "first_place", "first_player_spawned", "first_rotate", "first_snapshot", "fixedtime", "fly_annihilator_first_raise", "fly_annihilator_first_raise_", "fly_annihilator_first_raise_wpn_grab", "fly_annihilator_rechamber", "fly_annihilator_rechamber_ads", "fly_ap", "fly_arak_bolt_back", "fly_arak_bolt_release", "fly_arak_mag_in", "fly_arak_mag_out", "fly_ares_drum_in", "fly_ares_drum_out", "fly_ares_lid_close", "fly_ares_lid_open", "fly_ares_pull", "fly_ares_release", "fly_ares_tap", "fly_argus_first_raise", "fly_argus_lever_down", "fly_argus_lever_up", "fly_argus_mag_in", "fly_argus_mag_out", "fly_argus_wheel_spin_close", "fly_argus_wheel_spin_open", "fly_assault_reload_npc_charge", "fly_assault_reload_npc_mag_in", "fly_assault_reload_npc_mag_out", "fly_blackcell_first_raise", "fly_blackcell_mag_in", "fly_blackcell_mag_out", "fly_blackcell_slide_in", "fly_blackcell_slide_out", "fly_bodyfall_large_", "fly_bodyfall_small_", "fly_bomb_armed_plr", "fly_bomb_buttons_npc", "fly_bomb_buttons_plr", "fly_bomb_case_npc", "fly_bomb_case_plr", "fly_bomb_close_npc", "fly_bomb_close_plr", "fly_bomb_latch_npc", "fly_bomb_latch_plr", "fly_bomb_screen_plr", "fly_bot_bodyfall", "fly_bot_crawl_hand", "fly_bot_ctrl_lvl_", "fly_bot_jump", "fly_bot_land", "fly_bot_melee_dbl_swipe", "fly_bot_melee_left", "fly_bot_melee_right_end", "fly_bot_melee_right_start", "fly_bot_move_long", "fly_bot_move_short", "fly_bot_struggle", "fly_bow_first_raise", "fly_bow_load", "fly_brm_belt_feed", "fly_brm_bolt_back", "fly_brm_bolt_release", "fly_brm_mag_in", "fly_brm_mag_lock", "fly_brm_mag_out", "fly_brm_mag_slide_in", "fly_brm_mag_slide_out", "fly_brm_mag_unlock", "fly_chaser_button", "fly_chaser_charge", "fly_chaser_mag_in", "fly_chaser_mag_out", "fly_claymore_plant_npc", "fly_claymore_plant_plr", "fly_cqw_bolt_back", "fly_cqw_bolt_forward", "fly_cqw_button", "fly_cqw_mag_in", "fly_cqw_mag_out", "fly_cybercore_weapon_charge", "fly_cybercore_weapon_fail_npc", "fly_cybercore_weapon_return_npc", "fly_dingo_drum_attach", "fly_dingo_drum_in", "fly_dingo_drum_out", "fly_dingo_drum_release", "fly_dingo_pull", "fly_dingo_release", "fly_dingo_servo_attach", "fly_dingo_servo_release", "fly_dog_step_run_default", "fly_drakon_bolt_back", "fly_drakon_bolt_forward", "fly_drakon_mag_in", "fly_drakon_mag_out", "fly_dtp_land_npc_", "fly_dtp_land_plr_", "fly_dtp_slide_loop_npc_", "fly_dtp_slide_loop_npc_concrete", "fly_dtp_slide_loop_npc_default", "fly_dtp_slide_loop_npc_dirt", "fly_dtp_slide_loop_npc_grass", "fly_dtp_slide_loop_npc_gravel", "fly_dtp_slide_loop_npc_metal", "fly_dtp_slide_loop_npc_mud", "fly_dtp_slide_loop_npc_snow", "fly_dtp_slide_loop_npc_wood", "fly_dtp_slide_loop_plr_", "fly_dtp_slide_loop_plr_concrete", "fly_dtp_slide_loop_plr_default", "fly_dtp_slide_loop_plr_dirt", "fly_dtp_slide_loop_plr_grass", "fly_dtp_slide_loop_plr_gravel", "fly_dtp_slide_loop_plr_metal", "fly_dtp_slide_loop_plr_mud", "fly_dtp_slide_loop_plr_snow", "fly_dtp_slide_loop_plr_wood", "fly_dtp_slide_stop_npc_", "fly_dtp_slide_stop_plr_", "fly_fire_select_button", "fly_flamethrower_first_raise", "fly_foot_land_bot", "fly_gator_bolt_back", "fly_gator_bolt_release", "fly_gator_button", "fly_gator_mag_in", "fly_gator_mag_out", "fly_gear_enemy", "fly_gear_enemy_large", "fly_gear_reload_plr", "fly_gear_run", "fly_hbro_belt_feed", "fly_hbro_drum_attach", "fly_hbro_drum_release", "fly_hbro_lid_close", "fly_hbro_lid_open", "fly_hbro_pull", "fly_hbro_release", "fly_hive_first_raise", "fly_irs", "fly_jetpack_juke_warlord", "fly_kard_futz", "fly_kard_mag_in", "fly_kard_mag_out", "fly_kard_slide_back", "fly_kard_slide_forward", "fly_knife_first_raise", "fly_knife_grab", "fly_knuckle_crack", "fly_land_damage_npc", "fly_land_damage_plr", "fly_land_npc_", "fly_land_npc_asphalt", "fly_land_npc_bark", "fly_land_npc_bodyarmor", "fly_land_npc_brick", "fly_land_npc_carpet", "fly_land_npc_ceramic", "fly_land_npc_cloth", "fly_land_npc_concrete", "fly_land_npc_cushion", "fly_land_npc_default", "fly_land_npc_dirt", "fly_land_npc_flesh", "fly_land_npc_foliage", "fly_land_npc_fruit", "fly_land_npc_glass", "fly_land_npc_glassbulletproof", "fly_land_npc_glasscar", "fly_land_npc_grass", "fly_land_npc_gravel", "fly_land_npc_ice", "fly_land_npc_metal", "fly_land_npc_metalcar", "fly_land_npc_metalcatwalk", "fly_land_npc_metalhollow", "fly_land_npc_metalthin", "fly_land_npc_mud", "fly_land_npc_paintedmetal", "fly_land_npc_paper", "fly_land_npc_plaster", "fly_land_npc_plastic", "fly_land_npc_player", "fly_land_npc_riotshield", "fly_land_npc_rock", "fly_land_npc_rubber", "fly_land_npc_sand", "fly_land_npc_snow", "fly_land_npc_tallgrass", "fly_land_npc_water", "fly_land_npc_watershallow", "fly_land_npc_wood", "fly_land_plr_asphalt", "fly_land_plr_bark", "fly_land_plr_bodyarmor", "fly_land_plr_brick", "fly_land_plr_carpet", "fly_land_plr_ceramic", "fly_land_plr_cloth", "fly_land_plr_concrete", "fly_land_plr_cushion", "fly_land_plr_default", "fly_land_plr_dirt", "fly_land_plr_flesh", "fly_land_plr_foliage", "fly_land_plr_fruit", "fly_land_plr_glass", "fly_land_plr_glassbulletproof", "fly_land_plr_glasscar", "fly_land_plr_grass", "fly_land_plr_gravel", "fly_land_plr_ice", "fly_land_plr_metal", "fly_land_plr_metalcar", "fly_land_plr_metalcatwalk", "fly_land_plr_metalhollow", "fly_land_plr_metalthin", "fly_land_plr_mud", "fly_land_plr_paintedmetal", "fly_land_plr_paper", "fly_land_plr_plaster", "fly_land_plr_plastic", "fly_land_plr_player", "fly_land_plr_riotshield", "fly_land_plr_rock", "fly_land_plr_rubber", "fly_land_plr_sand", "fly_land_plr_snow", "fly_land_plr_tallgrass", "fly_land_plr_water", "fly_land_plr_watershallow", "fly_land_plr_wood", "fly_launcher_close_npc", "fly_launcher_gren_in_npc", "fly_launcher_open_npc", "fly_launcher_slide_out_npc", "fly_lightning_first_raise_chrg", "fly_lightning_flaps", "fly_lmg_belt_feed_npc", "fly_lmg_bolt_back_npc", "fly_lmg_bolt_release_npc", "fly_lmg_mag_in_npc", "fly_lmg_mag_out_npc", "fly_lmg_mag_slide_in_npc", "fly_locus_bolt_back", "fly_locus_bolt_forward", "fly_locus_mag_in", "fly_locus_mag_out", "fly_m", "fly_mag_pouch_pat", "fly_metalstormsnp_spin", "fly_minigun_tap", "fly_movement_foliage_npc", "fly_movement_foliage_plr", "fly_mow_bolt_back", "fly_mow_bolt_release", "fly_mow_forward_assist", "fly_mow_mag_in", "fly_mow_mag_out", "fly_mow_magwell", "fly_mp", "fly_mr", "fly_p", "fly_pdw_bolt_back", "fly_pdw_bolt_back_npc", "fly_pdw_bolt_forward", "fly_pdw_bolt_forward_npc", "fly_pdw_button", "fly_pdw_mag_in", "fly_pdw_mag_in_npc", "fly_pdw_mag_in_quick", "fly_pdw_mag_out", "fly_pdw_mag_out_npc", "fly_pharaoh_bolt_back", "fly_pharaoh_bolt_forward", "fly_pharaoh_button", "fly_pharaoh_mag_in", "fly_pharaoh_mag_out", "fly_pharaohmag_out", "fly_pineapple_first_raise", "fly_pistol_npc_reload_mag_in", "fly_pistol_npc_reload_mag_out", "fly_pistol_npc_reload_slide_forward", "fly_razorback_button", "fly_razorback_dial", "fly_razorback_mag_in", "fly_razorback_mag_out", "fly_reaper_first_raise", "fly_reaper_first_raise_npc", "fly_reaper_pullout", "fly_reaper_putaway", "fly_reaper_putaway_npc", "fly_reload_cloth_med", "fly_reload_cloth_sm", "fly_reload_cloth_sml", "fly_reload_equip_grab", "fly_reload_wpn_grab", "fly_shieva_bolt_down", "fly_shieva_button", "fly_shieva_mag_in", "fly_shieva_mag_out", "fly_shotgun_npc_reload_pull", "fly_shotgun_npc_reload_push", "fly_shotgun_npc_reload_shell_in", "fly_smg_npc_reload_charge", "fly_smg_npc_reload_mag_in", "fly_smg_npc_reload_mag_out", "fly_sniper_npc_bolt_back", "fly_sniper_npc_bolt_forward", "fly_sniper_npc_mag_in", "fly_sniper_npc_mag_out", "fly_spartan_chamber_close", "fly_spartan_chamber_open", "fly_spartan_pull", "fly_spartan_release", "fly_spartan_shell_in", "fly_spike_first_raise", "fly_spike_mag_in", "fly_spike_mag_out", "fly_spyder_mag_in", "fly_spyder_mag_out", "fly_spyder_slide_back", "fly_spyder_slide_forward", "fly_step_", "fly_step_run_", "fly_step_run_dirt", "fly_step_run_npc_asphalt", "fly_step_run_npc_bark", "fly_step_run_npc_bodyarmor", "fly_step_run_npc_brick", "fly_step_run_npc_carpet", "fly_step_run_npc_ceramic", "fly_step_run_npc_cloth", "fly_step_run_npc_concrete", "fly_step_run_npc_cushion", "fly_step_run_npc_default", "fly_step_run_npc_dirt", "fly_step_run_npc_flesh", "fly_step_run_npc_foliage", "fly_step_run_npc_fruit", "fly_step_run_npc_glass", "fly_step_run_npc_glassbulletproof", "fly_step_run_npc_glasscar", "fly_step_run_npc_grass", "fly_step_run_npc_gravel", "fly_step_run_npc_ice", "fly_step_run_npc_metal", "fly_step_run_npc_metalcar", "fly_step_run_npc_metalcatwalk", "fly_step_run_npc_metalhollow", "fly_step_run_npc_metalthin", "fly_step_run_npc_mud", "fly_step_run_npc_paintedmetal", "fly_step_run_npc_paper", "fly_step_run_npc_plaster", "fly_step_run_npc_plastic", "fly_step_run_npc_player", "fly_step_run_npc_riotshield", "fly_step_run_npc_rock", "fly_step_run_npc_rubber", "fly_step_run_npc_sand", "fly_step_run_npc_snow", "fly_step_run_npc_tallgrass", "fly_step_run_npc_water", "fly_step_run_npc_watershallow", "fly_step_run_npc_wood", "fly_step_run_plr_asphalt", "fly_step_run_plr_bark", "fly_step_run_plr_bodyarmor", "fly_step_run_plr_brick", "fly_step_run_plr_carpet", "fly_step_run_plr_ceramic", "fly_step_run_plr_cloth", "fly_step_run_plr_concrete", "fly_step_run_plr_cushion", "fly_step_run_plr_default", "fly_step_run_plr_dirt", "fly_step_run_plr_flesh", "fly_step_run_plr_foliage", "fly_step_run_plr_fruit", "fly_step_run_plr_glass", "fly_step_run_plr_glassbulletproof", "fly_step_run_plr_glasscar", "fly_step_run_plr_grass", "fly_step_run_plr_gravel", "fly_step_run_plr_ice", "fly_step_run_plr_metal", "fly_step_run_plr_metalcar", "fly_step_run_plr_metalcatwalk", "fly_step_run_plr_metalhollow", "fly_step_run_plr_metalthin", "fly_step_run_plr_mud", "fly_step_run_plr_paintedmetal", "fly_step_run_plr_paper", "fly_step_run_plr_plaster", "fly_step_run_plr_plastic", "fly_step_run_plr_player", "fly_step_run_plr_riotshield", "fly_step_run_plr_rock", "fly_step_run_plr_rubber", "fly_step_run_plr_sand", "fly_step_run_plr_snow", "fly_step_run_plr_tallgrass", "fly_step_run_plr_water", "fly_step_run_plr_watershallow", "fly_step_run_plr_wood", "fly_step_scrape_", "fly_svg", "fly_talon_bolt_back", "fly_talon_bolt_release", "fly_talon_button_in", "fly_talon_button_out", "fly_talon_mag_in", "fly_talon_mag_out", "fly_tc", "fly_tinsert_beep", "fly_triton_mag_in", "fly_triton_mag_out", "fly_triton_slide_back", "fly_triton_slide_forward", "fly_vmp_bolt_back", "fly_vmp_bolt_forward", "fly_vmp_mag_in", "fly_vmp_mag_out", "fly_wpn_gear_rattle", "fly_xm", "fly_xr", "foot_kicks_back_left", "foot_kicks_back_right", "foot_kicks_water_left", "foot_kicks_water_right", "foot_spri", "footstep_alert_distance", "footstep_default_distance", "footstep_front_left", "footstep_front_left_scrape", "footstep_front_left_shuffle", "footstep_front_left_small", "footstep_front_right", "footstep_front_right_scrape", "footstep_front_right_shuffle", "footstep_front_right_small", "footstep_left", "footstep_left_back", "footstep_left_forward", "footstep_left_large", "footstep_left_large_siege_base", "footstep_left_large_theia", "footstep_left_small", "footstep_lifespan", "footstep_pool_value", "footstep_priority", "footstep_rear_left", "footstep_rear_left_scrape", "footstep_rear_left_shuffle", "footstep_rear_left_small", "footstep_rear_right", "footstep_rear_right_scrape", "footstep_rear_right_shuffle", "footstep_rear_right_small", "footstep_right", "footstep_right_back", "footstep_right_forward", "footstep_right_large", "footstep_right_large_siege_base", "footstep_right_large_theia", "footstep_right_small", "force_aim_wake", "force_character_models", "force_cover", "force_crawler", "force_goal", "force_high_speed", "force_movement_wake", "force_scoreboard", "force_scoreboardk", "force_spawn", "force_stance", "force_static_models", "force_view_models", "force_world_materials", "fr_core_ffotd_tu", "fr_reset_stats_offline", "fr_reset_stats_online", "fr_start", "frag_deploy", "frag_grenade", "frag_grenade_cp", "frag_grenade_grenade", "frag_grenade_mp", "frag_grenade_short_mp", "frag_incoming", "frag_multi_blast", "frag_multikill", "friendsCacheSteamFriends", "friendsMaxSteamLookupsPerFrame", "friends_updated", "front_left", "front_right", "front_wheel_lt", "front_wheel_lt_support", "front_wheel_rt", "front_wheel_rt_base", "front_wheel_rt_lower", "front_wheel_rt_support", "fs_C", "fs_basegame", "fs_basepath", "fs_basepath_output", "fs_cdpath", "fs_copyfiles", "fs_debug", "fs_game", "fs_homepath", "fs_ignoreLocalized", "fs_openedList", "fs_referencedList", "fx_ability_elec_startup_wasp", "fx_ability_elec_startup_waspc", "fx_ability_elec_surge_short_pamws", "fx_ability_elec_surge_short_raps", "fx_ability_elec_surge_short_robot", "fx_ability_elec_surge_short_wasp", "fx_ability_fire_immolation_body_amws", "fx_ability_fire_immolation_dyn_wasp", "fx_ability_fire_immolation_pamws", "fx_ability_fire_immolation_raps", "fx_ability_fire_immolation_rapsc", "fx_ability_fire_immolation_wasp", "fx_ability_fire_immolation_wing_wasp", "fx_ability_firefly_attack_", "fx_ability_firefly_chase_", "fx_ability_glow_chest_ravage_core", "fx_add_mark", "fx_agr_damage_state", "fx_agr_drop_box", "fx_agr_drop_boxc", "fx_agr_emp_stun", "fx_agr_explosion", "fx_agr_explosion_no_dmg", "fx_agr_gun_flash_", "fx_agr_rocket_exp", "fx_agr_rocket_flash_", "fx_agr_rocket_trail", "fx_agr_vlight", "fx_agr_vlight_eye_grn", "fx_agr_vlight_eye_red", "fx_air_drop_marker_gold", "fx_air_drop_marker_red", "fx_air_drop_marker_white", "fx_air_drop_marker_whitec", "fx_alphaThreshold", "fx_axis_createfx", "fx_barrel_lod", "fx_betty_enemy_light", "fx_betty_exp", "fx_betty_exp_death", "fx_betty_exp_destroyed", "fx_betty_friendly_light", "fx_betty_launch_dust", "fx_betty_light", "fx_betty_light_blue", "fx_betty_light_orng", "fx_bio_direwolf_eyes", "fx_blood_decal_impact_ground", "fx_blood_gib_arm_sever_burst", "fx_blood_gib_arm_sever_burst_rt", "fx_blood_gib_arm_sever_burst_rtc", "fx_blood_gib_leg_sever_burst", "fx_blood_gib_leg_sever_burst_rt", "fx_blood_gib_limb_trail_emitter", "fx_blood_gib_limb_trail_emitterc", "fx_blood_impact_exp_body_lg", "fx_blood_impact_exp_robot_lg", "fx_blood_torso_explo_zmb", "fx_blood_torso_explo_zmbs", "fx_bounce_equip_dust", "fx_bounce_equip_water", "fx_bul_impact_armor_body_fatal", "fx_bul_impact_armor_body_fatal_exit", "fx_bul_impact_armor_body_nonfatal", "fx_bul_impact_armor_body_nonfatal_exit", "fx_bul_impact_armor_head_fatal", "fx_bul_impact_armor_head_fatal_exit", "fx_bul_impact_armor_head_nonfatal", "fx_bul_impact_armor_head_nonfatal_exit", "fx_bul_impact_blood_body_fatal", "fx_bul_impact_blood_body_fatal_exit", "fx_bul_impact_blood_body_fatal_exit_zmb", "fx_bul_impact_blood_body_fatal_zmb", "fx_bul_impact_blood_body_nonfatal", "fx_bul_impact_blood_body_nonfatal_exit", "fx_bul_impact_blood_body_nonfatal_exit_zmb", "fx_bul_impact_blood_body_nonfatal_zmb", "fx_bul_impact_blood_corpse_fatal", "fx_bul_impact_blood_corpse_nonfatal", "fx_bul_impact_blood_head_fatal", "fx_bul_impact_blood_head_fatal_exit", "fx_bul_impact_blood_head_fatal_exit_zmb", "fx_bul_impact_blood_head_fatal_zmb", "fx_bul_impact_blood_head_nonfatal", "fx_bul_impact_blood_head_nonfatal_exit", "fx_bul_impact_blood_head_nonfatal_exit_zmb", "fx_bul_impact_blood_head_nonfatal_zmb", "fx_bul_impact_body_armor_lg", "fx_bul_impact_boss_body_fatal", "fx_bul_impact_boss_body_fatal_exit", "fx_bul_impact_boss_body_nonfatal", "fx_bul_impact_boss_body_nonfatal_exit", "fx_bul_impact_boss_head_fatal", "fx_bul_impact_boss_head_fatal_exit", "fx_bul_impact_boss_head_nonfatal", "fx_bul_impact_boss_head_nonfatal_exit", "fx_bul_impact_concrete_hero_minigun", "fx_bul_impact_concrete_lg", "fx_bul_impact_concrete_sm", "fx_bul_impact_concrete_xlg", "fx_bul_impact_concrete_xsm", "fx_bul_impact_concrete_xtreme", "fx_bul_impact_default_hero_minigun", "fx_bul_impact_default_lg", "fx_bul_impact_default_sm", "fx_bul_impact_default_xlg", "fx_bul_impact_default_xsm", "fx_bul_impact_default_xtreme", "fx_bul_impact_dirt_hero_minigun", "fx_bul_impact_dirt_lg", "fx_bul_impact_dirt_sm", "fx_bul_impact_dirt_xlg", "fx_bul_impact_dirt_xsm", "fx_bul_impact_dirt_xtreme", "fx_bul_impact_glass_hero_minigun", "fx_bul_impact_glass_lg", "fx_bul_impact_glass_sm", "fx_bul_impact_glass_xlg", "fx_bul_impact_glass_xsm", "fx_bul_impact_glass_xtreme", "fx_bul_impact_gravel_hero_minigun", "fx_bul_impact_gravel_lg", "fx_bul_impact_gravel_sm", "fx_bul_impact_gravel_xlg", "fx_bul_impact_gravel_xsm", "fx_bul_impact_heavy_body_fatal", "fx_bul_impact_heavy_body_fatal_exit", "fx_bul_impact_heavy_body_nonfatal", "fx_bul_impact_heavy_body_nonfatal_exit", "fx_bul_impact_heavy_head_fatal", "fx_bul_impact_heavy_head_fatal_exit", "fx_bul_impact_heavy_head_nonfatal", "fx_bul_impact_heavy_head_nonfatal_exit", "fx_bul_impact_metal_hero_minigun", "fx_bul_impact_metal_lg", "fx_bul_impact_metal_sm", "fx_bul_impact_metal_xlg", "fx_bul_impact_metal_xsm", "fx_bul_impact_metal_xtreme", "fx_bul_impact_mud_hero_minigun", "fx_bul_impact_mud_lg", "fx_bul_impact_mud_sm", "fx_bul_impact_mud_xlg", "fx_bul_impact_mud_xsm", "fx_bul_impact_pwr_armor_lg", "fx_bul_impact_robot_body_fatal", "fx_bul_impact_robot_body_fatal_exit", "fx_bul_impact_robot_body_nonfatal", "fx_bul_impact_robot_body_nonfatal_exit", "fx_bul_impact_robot_head_fatal", "fx_bul_impact_robot_head_fatal_exit", "fx_bul_impact_robot_head_nonfatal", "fx_bul_impact_robot_head_nonfatal_exit", "fx_bul_impact_sand_hero_minigun", "fx_bul_impact_sand_lg", "fx_bul_impact_sand_sm", "fx_bul_impact_sand_xsm", "fx_bul_impact_shtgun_juiced_ammo", "fx_bul_impact_snow_hero_minigun", "fx_bul_impact_snow_lg", "fx_bul_impact_snow_sm", "fx_bul_impact_snow_xlg", "fx_bul_impact_snow_xsm", "fx_bul_impact_snow_xtreme", "fx_bul_impact_thin_metal_hero_minigun", "fx_bul_impact_thin_metal_lg", "fx_bul_impact_thin_metal_sm", "fx_bul_impact_thin_metal_xlg", "fx_bul_impact_thin_metal_xsm", "fx_bul_impact_water_hero_minigun", "fx_bul_impact_water_lg", "fx_bul_impact_water_sm", "fx_bul_impact_water_xlg", "fx_bul_impact_water_xsm", "fx_bul_impact_water_xtreme", "fx_bul_impact_wood_hero_minigun", "fx_bul_impact_wood_lg", "fx_bul_impact_wood_sm", "fx_bul_impact_wood_xlg", "fx_bul_impact_wood_xsm", "fx_bullet_chain", "fx_bullet_chainB", "fx_bullet_chain_blur", "fx_c", "fx_care_package_thruster", "fx_cast_shadow", "fx_char_gib_chunk_fat", "fx_char_gib_chunk_meat", "fx_claymore_laser", "fx_colorid", "fx_compute_render_sort", "fx_compute_sprite_cull", "fx_compute_sprite_cull_clear", "fx_compute_sprite_cull_down", "fx_compute_sprite_cull_qtree", "fx_compute_sprite_light", "fx_compute_sprite_light_lmap", "fx_compute_sprite_light_shadow", "fx_contact", "fx_crossbow_base", "fx_ctf_flag_base_team", "fx_ctf_flag_base_team_green", "fx_ctf_flag_base_team_red", "fx_ctf_flag_base_team_yellow", "fx_cuav_lights", "fx_cull_elem_draw", "fx_cull_elem_draw_flicker", "fx_cull_elem_spawn", "fx_dart_death_exp", "fx_dart_thruster", "fx_dart_thruster_sm", "fx_debris_bottle_molotov_break_lotus", "fx_debris_stone_", "fx_debug_deleted_fx", "fx_deferelem", "fx_dest_robot_body_sparks", "fx_dest_robot_dmg_dyn_piece_smk", "fx_dest_robot_dmg_dyn_piece_spark", "fx_dest_robot_dmg_trail_smk_spawner", "fx_dest_robot_dmg_trail_smk_spawnerc", "fx_dest_robot_head_sparks", "fx_dom_cap_indicator_neutral_r", "fx_dom_cap_indicator_team_r", "fx_dom_marker_neutral_r", "fx_dom_marker_team_r", "fx_dpvs_cull_elem_draw", "fx_draw", "fx_drawClouds", "fx_draw_nonsprite", "fx_draw_omniLight", "fx_draw_shadowing", "fx_drgnfire_damage_state", "fx_drgnfire_damage_statec", "fx_drgnfire_explosion", "fx_drgnfire_impact_sparks", "fx_drgnfire_light_green_", "fx_drgnfire_light_red_", "fx_drgnfire_rotor_wash_runner", "fx_drone_hunter_lights", "fx_dud_m", "fx_dust_prop_fan_digital_lg", "fx_dust_prop_fan_digital_sm", "fx_ed_lights_green", "fx_ed_lights_red", "fx_elec_enemy_juiced_shotgun", "fx_elec_gp_wire_sparking_xsml_anim", "fx_elec_gp_wire_sparking_xsml_anim_v", "fx_elec_spark_gib_robot_limb_left", "fx_elec_spark_gib_robot_limb_rt", "fx_elec_sparks_burst_sm_omni_blue_os", "fx_elec_veh_dmg_weakspot", "fx_elec_warlord_damage_", "fx_elec_warlord_lower_damage_", "fx_emp_core", "fx_emp_damage_sparks", "fx_emp_exp_death", "fx_emp_explosion_equip", "fx_enable", "fx_equip_light_green", "fx_equip_light_os", "fx_equip_light_red", "fx_equip_tac_insert_exp", "fx_equip_tac_insert_light_grn", "fx_equip_tac_insert_light_red", "fx_exhaust_jetpa", "fx_exhaust_jetpack_dbl_jmp_core", "fx_exhaust_jetpack_dbl_jmp_core_sm", "fx_exhaust_jetpack_warlord_juke", "fx_exp_bomb_demo_mp", "fx_exp_drone_death", "fx_exp_equipment", "fx_exp_equipment_lg", "fx_exp_grenade_concrete", "fx_exp_grenade_concussion", "fx_exp_grenade_default", "fx_exp_grenade_dirt", "fx_exp_grenade_emp", "fx_exp_grenade_flshbng", "fx_exp_grenade_glass", "fx_exp_grenade_metal", "fx_exp_grenade_mud", "fx_exp_grenade_sand", "fx_exp_grenade_semtex_concrete", "fx_exp_grenade_semtex_default", "fx_exp_grenade_semtex_dirt", "fx_exp_grenade_semtex_glass", "fx_exp_grenade_semtex_metal", "fx_exp_grenade_semtex_mud", "fx_exp_grenade_semtex_sand", "fx_exp_grenade_semtex_snow", "fx_exp_grenade_semtex_wood", "fx_exp_grenade_smoke", "fx_exp_grenade_snow", "fx_exp_grenade_water", "fx_exp_grenade_water_shllw", "fx_exp_grenade_water_surface_deep", "fx_exp_grenade_wood", "fx_exp_robot_stage", "fx_exp_robot_torso_death", "fx_exp_rocket_concrete", "fx_exp_rocket_default", "fx_exp_rocket_dirt", "fx_exp_rocket_emp", "fx_exp_rocket_glass", "fx_exp_rocket_metal", "fx_exp_rocket_mud", "fx_exp_rocket_sand", "fx_exp_rocket_snow", "fx_exp_rocket_wood", "fx_exp_spike_launcher", "fx_exp_spike_launcher_default", "fx_exp_spike_launcher_metal", "fx_exp_spike_launcher_sand", "fx_exp_warlor", "fx_exp_warlord_death", "fx_fire_ai_human_arm_left_loop", "fx_fire_ai_human_arm_left_os", "fx_fire_ai_human_arm_right_loop", "fx_fire_ai_human_arm_right_os", "fx_fire_ai_human_head_loop", "fx_fire_ai_human_head_os", "fx_fire_ai_human_hip_left_loop", "fx_fire_ai_human_hip_left_os", "fx_fire_ai_human_hip_right_loop", "fx_fire_ai_human_hip_right_os", "fx_fire_ai_human_leg_left_loop", "fx_fire_ai_human_leg_left_os", "fx_fire_ai_human_leg_right_loop", "fx_fire_ai_human_leg_right_os", "fx_fire_ai_human_torso_loop", "fx_fire_ai_human_torso_os", "fx_fire_ai_robot_arm_left_loop", "fx_fire_ai_robot_arm_left_os", "fx_fire_ai_robot_arm_right_loop", "fx_fire_ai_robot_arm_right_os", "fx_fire_ai_robot_head_loop", "fx_fire_ai_robot_head_os", "fx_fire_ai_robot_leg_left_loop", "fx_fire_ai_robot_leg_left_os", "fx_fire_ai_robot_leg_right_loop", "fx_fire_ai_robot_leg_right_os", "fx_fire_ai_robot_torso_loop", "fx_fire_ai_robot_torso_os", "fx_fire_torso_zmb", "fx_flare", "fx_flesh_hit_knife", "fx_flesh_hit_knife_noblood", "fx_flesh_hit_knife_zmb", "fx_flesh_hit_neck_fatal", "fx_footstep_dust", "fx_footstep_mud", "fx_footstep_sand", "fx_footstep_water", "fx_fr_target_demat", "fx_fr_target_impact", "fx_gi_robot_exp", "fx_gib_chunk_fat", "fx_gib_chunk_meat", "fx_hatr_exp", "fx_heavy_flash_base", "fx_heli_chaff", "fx_heli_exp_flak", "fx_heli_exp_lg", "fx_heli_exp_lgc", "fx_heli_exp_md", "fx_heli_exp_sm", "fx_heli_raps_exp_lg", "fx_heli_raps_exp_sm", "fx_heli_raps_exp_trail", "fx_heli_smk_trail_engine", "fx_heli_smk_trail_engine_", "fx_heli_smk_trail_tail", "fx_hellstorm_trail", "fx_hero_annhilatr_death_blood", "fx_hero_annhilatr_death_blood_trail_emitter", "fx_hero_annhilatr_glint", "fx_hero_annhilatr_impact_entity_exp", "fx_hero_annhilatr_impact_entity_robot_exp", "fx_hero_annhilatr_impact_exp", "fx_hero_annhilatr_muz_flsh_", "fx_hero_arm_blade_death_blood", "fx_hero_arm_blade_death_sparks", "fx_hero_arm_blade_glow", "fx_hero_arm_blade_glow_attk", "fx_hero_arm_blade_glow_attk_", "fx_hero_bow_lnchr_accelerator", "fx_hero_bow_lnchr_exp_bot", "fx_hero_bow_lnchr_exp_bot_trail_emitter", "fx_hero_bow_lnchr_glow", "fx_hero_bow_lnchr_impact", "fx_hero_bow_lnchr_impact_sm", "fx_hero_bow_lnchr_trail", "fx_hero_bow_lnchr_trail_sm", "fx_hero_chem_gun_blob_death", "fx_hero_chem_gun_blob_exp", "fx_hero_chem_gun_blob_impact", "fx_hero_chem_gun_muz_flsh_", "fx_hero_chem_gun_trail", "fx_hero_firefly_attack", "fx_hero_firefly_attack_limb", "fx_hero_firefly_attack_limb_reaper", "fx_hero_firefly_attack_ragdoll", "fx_hero_firefly_blood", "fx_hero_firefly_blood_os", "fx_hero_firefly_death", "fx_hero_firefly_hunting", "fx_hero_firefly_sparks", "fx_hero_firefly_sparks_os", "fx_hero_firefly_start", "fx_hero_firefly_start_entity", "fx_hero_flamethrower_begin_", "fx_hero_flamethrower_blocked", "fx_hero_flamethrower_emitter_", "fx_hero_flamethrower_end_", "fx_hero_grvity_spk_glow_", "fx_hero_grvity_spk_grnd_hit_", "fx_hero_grvity_spk_grnd_hit_concrete", "fx_hero_grvity_spk_grnd_hit_default", "fx_hero_grvity_spk_grnd_hit_dirt", "fx_hero_grvity_spk_grnd_hit_dust", "fx_hero_grvity_spk_grnd_hit_snow", "fx_hero_impact_grvity_spk_concrete", "fx_hero_impact_grvity_spk_default", "fx_hero_impact_grvity_spk_dust", "fx_hero_impact_grvity_spk_snow", "fx_hero_lightning_gun_death", "fx_hero_lightning_gun_death_burst", "fx_hero_lightning_gun_death_hands", "fx_hero_lightning_gun_death_hands_lft", "fx_hero_lightning_gun_muz_flsh_", "fx_hero_lightning_gun_muz_glow_", "fx_hero_micro_missile_trail", "fx_hero_minigun_muz_", "fx_hero_pineapple_death_blood", "fx_hero_pineapple_exp", "fx_hero_pineapple_exp_concrete", "fx_hero_pineapple_exp_dirt", "fx_hero_pineapple_exp_glass", "fx_hero_pineapple_exp_metal", "fx_hero_pineapple_exp_mud", "fx_hero_pineapple_exp_sand", "fx_hero_pineapple_exp_snow", "fx_hero_pineapple_exp_wood", "fx_hero_pineapple_surface_bounce", "fx_hero_pineapple_trail", "fx_hero_pineapple_trail_blue", "fx_hero_pineapple_trail_orng", "fx_hero_pineapple_trail_orngc", "fx_hit", "fx_incend_grenade_exp", "fx_incend_grenade_fire_sm", "fx_killEffectOnRewind", "fx_kill_confirmed_vanish", "fx_knife_impact", "fx_knife_impact_assassination_back", "fx_koth_marker_blue", "fx_koth_marker_blue_window", "fx_koth_marker_blue_windowc", "fx_koth_marker_contested", "fx_koth_marker_contested_window", "fx_koth_marker_green", "fx_koth_marker_green_window", "fx_koth_marker_green_windowc", "fx_koth_marker_neutral", "fx_koth_marker_neutral_window", "fx_koth_marker_orng", "fx_koth_marker_orng_window", "fx_koth_marker_red", "fx_koth_marker_red_window", "fx_koth_marker_yellow", "fx_koth_marker_yellow_window", "fx_leg_lod", "fx_lensflare_sniper_glint", "fx_lensflare_sniper_glintc", "fx_lightGridSampleOffset", "fx_light_body_glow_warlord", "fx_light_eye_glow_warlord", "fx_light_red_spike_charge_os", "fx_light_robot_set_base", "fx_light_robot_set_base_blink", "fx_light_robot_set_base_blink_lg", "fx_light_robot_set_base_lg", "fx_light_robot_set_blink_lg_yellow", "fx_light_robot_set_blink_xlg_yellow", "fx_light_robot_set_blink_yellow", "fx_light_robot_set_lg_yellow", "fx_light_robot_set_yellow", "fx_light_spike_launcher", "fx_light_veh_amws_single", "fx_lightning_gun_impact", "fx_lightning_gun_impact_water", "fx_lightninggun_arc", "fx_ls_exhaust_afterburner", "fx_ls_exp_bomb", "fx_ls_trail_bomb", "fx_margwa_head_shot_zod_zmb", "fx_margwa_roar_purple_zod_zmb", "fx_margwa_roar_zod_zmb", "fx_margwa_teleport_intro_zod_zmb", "fx_margwa_teleport_tell_zod_zmb", "fx_margwa_teleport_travel_zod_zmb", "fx_margwa_teleport_zod_zmb", "fx_mark_profile", "fx_marks", "fx_marks_draw", "fx_marks_ents", "fx_marks_nearlimit", "fx_marks_smodels", "fx_mech_foot_step_steam", "fx_mech_wpn_flamethrower", "fx_missing_fx", "fx_mp_exp_bomb", "fx_mp_exp_bombc", "fx_mship_burner", "fx_mship_burner_mp", "fx_mship_death", "fx_mship_lights", "fx_mship_smk_trail_", "fx_mship_smk_trail_b", "fx_mship_turret_damage_", "fx_muz_chppr_flash_", "fx_muz_chppr_flash_sm_", "fx_muz_chppr_vtol", "fx_muz_heavy_flash_base", "fx_muz_lg_mg_", "fx_muz_lg_shtgun_", "fx_muz_lg_shtgun_juiced_", "fx_muz_md_rifle_", "fx_muz_md_smk_", "fx_muz_md_sniper_", "fx_muz_minigun_flash_", "fx_muz_rocket_emp_", "fx_muz_rocket_xm_", "fx_muz_sm_pistol_", "fx_muz_smk_silenced_", "fx_muz_spike_launcher_", "fx_muz_veh_minigun_lg_", "fx_muz_veh_rocket_med_", "fx_muz_veh_sentinel_sm_", "fx_muz_veh_siegebot_rocket_", "fx_muz_xlg_snpr_", "fx_physicsImpactVelocityThreshold", "fx_pistol", "fx_pistol_flash_base", "fx_pistol_shell", "fx_pistol_shell_blur", "fx_plyr_ability_screen_blur_overdrive", "fx_plyr_clone_reaper_appear", "fx_plyr_clone_reaper_orb", "fx_plyr_clone_vanish", "fx_plyr_emp_sparks", "fx_plyr_flashback_demat", "fx_plyr_flashback_flash_yllw", "fx_plyr_flashback_trail", "fx_plyr_flashback_trail_impact", "fx_plyr_flying_tracker_l", "fx_plyr_flying_tracker_lf", "fx_plyr_flying_tracker_r", "fx_plyr_flying_tracker_rf", "fx_plyr_footstep_dust", "fx_plyr_footstep_dust_dirt", "fx_plyr_footstep_tracker", "fx_plyr_footstep_tracker_l", "fx_plyr_footstep_tracker_lf", "fx_plyr_footstep_tracker_r", "fx_plyr_footstep_tracker_rf", "fx_plyr_hand_wallrun_dust", "fx_plyr_heat_wave", "fx_plyr_heat_wave_", "fx_plyr_heat_wave_distortion_volume", "fx_plyr_heat_wave_distortion_volume_air", "fx_plyr_heat_wave_limb_burn", "fx_plyr_jump_dust", "fx_plyr_jump_dust_dirt", "fx_plyr_land_dust_dirt_xlg", "fx_plyr_land_dust_md", "fx_plyr_land_dust_md_dirt", "fx_plyr_land_dust_xlg", "fx_plyr_pwr_armor_break", "fx_plyr_rejack_light", "fx_plyr_rejack_smoke", "fx_plyr_revive", "fx_plyr_revive_demat", "fx_plyr_revivec", "fx_plyr_shock_field", "fx_plyr_shock_field_", "fx_plyr_slide_", "fx_plyr_speed_distort_lg_emitter", "fx_plyr_speed_distort_sm_emitter", "fx_plyr_swim_bubbles_body", "fx_plyr_swim_splash_foot", "fx_plyr_swim_splash_hand", "fx_plyr_tablet_activation", "fx_plyr_tablet_activation_loop", "fx_plyr_water_jump_in_bubbles_", "fx_plyr_water_jump_out_splash_", "fx_plyr_water_splash_md", "fx_plyr_water_splash_sm", "fx_post_update", "fx_predator_exp", "fx_predator_exp_lg", "fx_predator_trail", "fx_predator_trigger", "fx_profile", "fx_profileFilter", "fx_profileFilterElemCountZero", "fx_profileSkip", "fx_profileSort", "fx_proj_impact_water_lg", "fx_proj_impact_water_sm", "fx_prox_grenade_elec_jump", "fx_prox_grenade_elec_trail", "fx_prox_grenade_exp", "fx_prox_grenade_impact_player_spwner", "fx_prox_grenade_scan_blue", "fx_prox_grenade_scan_orng", "fx_prox_grenade_wrn_grn", "fx_prox_grenade_wrn_red", "fx_qr_wash_", "fx_quadtank_airburst", "fx_quadtank_airburst_ground", "fx_raps_lights", "fx_rcxd_emp_exp", "fx_rcxd_exp", "fx_rcxd_lights_blinky", "fx_rcxd_lights_grn", "fx_rcxd_lights_red", "fx_rcxd_lights_solid", "fx_rcxd_rotor_wash", "fx_rcxd_rotor_wash_rt", "fx_rcxd_treadfx_concrete", "fx_rcxd_treadfx_dirt", "fx_rcxd_treadfx_water", "fx_rifle", "fx_rifle_shell", "fx_rifle_shell_blur", "fx_riotshield_depoly_dust", "fx_riotshield_depoly_lights", "fx_rolling_thunder_exp", "fx_rolling_thunder_thruster_trails", "fx_sc_lights_grn", "fx_sc_lights_grnc", "fx_sc_lights_red", "fx_sentinel_disabled_water_", "fx_sentinel_exp", "fx_sentinel_exp_", "fx_sentinel_lights", "fx_sentinel_smoke", "fx_sentry_damage_state", "fx_sentry_death_state", "fx_sentry_disabled_spark", "fx_sentry_emp_stun", "fx_sentry_exp", "fx_set_shadow_camera", "fx_sg_damage_state", "fx_sg_death_statec", "fx_sg_distortion_cone_ash", "fx_sg_distortion_cone_ash_sm", "fx_sg_emp_stun", "fx_sg_exp", "fx_shellejects_minigun", "fx_shellejects_pistol", "fx_shellejects_rifle", "fx_shellejects_saw", "fx_shellejects_shotgun", "fx_shellejects_shotgun_yellow", "fx_shield_lod", "fx_shotgun_shell", "fx_shotgun_shell_blur", "fx_smk_ai_human_arm_left_os", "fx_smk_ai_human_arm_right_os", "fx_smk_ai_human_head_os", "fx_smk_ai_human_hip_left_os", "fx_smk_ai_human_hip_right_os", "fx_smk_ai_human_leg_left_os", "fx_smk_ai_human_leg_right_os", "fx_smk_ai_human_torso_os", "fx_smk_ai_human_waist_os", "fx_smk_veh_amws_transform", "fx_smk_veh_amws_transformc", "fx_smoke_willy_pete_sp", "fx_spark_disabled_rc_car", "fx_spawn", "fx_supply_drop_smoke", "fx_tank_sherman_smldr", "fx_theater_camera_head", "fx_theater_camera_head_glow_green", "fx_theater_camera_head_glow_red", "fx_theater_camera_head_glow_white", "fx_theater_camera_head_glow_yellow", "fx_theater_camera_head_select", "fx_trail_blood_streak", "fx_trail_grenade", "fx_trail_hatchet", "fx_trail_knife_ballistic", "fx_trail_quad_javelin", "fx_trail_rocket_emp", "fx_trail_rocket_md", "fx_trail_rocket_wasp", "fx_trail_rocket_xm", "fx_trail_rpg", "fx_trail_spike_launcher", "fx_treadfx_agr_dirt_emit", "fx_treadfx_asphalt_peel", "fx_treadfx_asphalt_skid_emit", "fx_treadfx_asphalt_tread_emit", "fx_treadfx_raps_concrete_peel_mp", "fx_treadfx_raps_concrete_skid_emit_mp", "fx_treadfx_raps_concrete_tread_emit_mp", "fx_treadfx_raps_dirt_peel_mp", "fx_treadfx_raps_dirt_skid_emit_mp", "fx_treadfx_raps_dirt_tread_emit_mp", "fx_treadfx_raps_metal_peel_mp", "fx_treadfx_raps_metal_tread_emit_mp", "fx_treadfx_snow_skid_emit]", "fx_treadfx_snow_tread_emitcore_patch", "fx_trophy_detonation", "fx_trophy_detonationc", "fx_trophy_dust_impact", "fx_trophy_flash", "fx_trophy_laser", "fx_trophy_light", "fx_trophy_light_enemy", "fx_trophy_lightcore_gfx", "fx_trophy_radius_indicator", "fx_turret_shelleject_expelcore_pre_gfx", "fx_uav_bunner", "fx_uav_damage_trail", "fx_uav_exp", "fx_uav_lights", "fx_uav_lightsc", "fx_ui_flagbase_blue", "fx_ui_flagbase_orng", "fx_ui_flagbase_orngc", "fx_ui_flagbase_pmcc", "fx_ui_flagbase_wht", "fx_ui_frontend_battery_cigar_burn", "fx_ui_frontend_battery_cigar_drag", "fx_ui_frontend_battery_cigar_exhale", "fx_ui_frontend_battery_cigar_flick", "fx_ui_frontend_prophet_weapon", "fx_ui_frontend_prophet_weapon_charge", "fx_ui_gi_patrol", "fx_update", "fx_update_nonsprite", "fx_update_portalled", "fx_update_remaining", "fx_update_shadowing", "fx_uplink_ball_trail", "fx_uplink_ball_vanish", "fx_uplink_goal_marker", "fx_uplink_goal_marker_flash", "fx_uplink_goal_marker_flash_green", "fx_uplink_goal_marker_flash_red", "fx_uplink_goal_marker_flash_yellow", "fx_uplink_goal_marker_green", "fx_uplink_goal_marker_red", "fx_uplink_goal_marker_yellow", "fx_uplink_goal_markerc", "fx_vdest_debris_elec_surge_sm_os", "fx_vdest_debris_fire_trail_sm", "fx_vdest_pamws_dmg_body_", "fx_vdest_pamws_dmg_turret_", "fx_vexp_amws_death", "fx_vexp_amws_deathc", "fx_vexp_raps_death", "fx_vexp_raps_death_core", "fx_vexp_raps_death_mp", "fx_vexp_raps_death_side", "fx_vexp_wasp_death", "fx_vexp_wasp_gibb_death", "fx_vexplode_helicopter_exp_mp", "fx_vfire_med_", "fx_vfire_sherman", "fx_vfire_wasp_crash", "fx_vfire_wasp_wing_crash", "fx_visMinTraceDist", "fx_vtol_exhaust_engine", "fx_vtol_exp", "fx_vtol_lights", "fx_vtol_lights_grn", "fx_vtol_lights_red", "fx_vtol_supply_exhaust_engine", "fx_vtol_supply_lights", "fx_vtol_thruster", "fx_wpn_", "g_C", "g_D", "g_FactionName_", "g_ScoresColor_Allies", "g_ScoresColor_Axis", "g_ScoresColor_EnemyTeam", "g_ScoresColor_Free", "g_ScoresColor_MyParty", "g_ScoresColor_MyTeam", "g_ScoresColor_Spectator", "g_TeamIcon_Allies", "g_TeamIcon_Axis", "g_TeamIcon_EnemyAllies", "g_TeamIcon_EnemyAxis", "g_TeamIcon_Free", "g_TeamIcon_MyAllies", "g_TeamIcon_MyAxis", "g_TeamIcon_Spectator", "g_TeamName_", "g_TeamName_Allies", "g_TeamName_Axis", "g_TeamTitleColor_EnemyTeam", "g_TeamTitleColor_MyTeam", "g_TeamTitleColor_Spectator", "g_ZMemBuf", "g_[", "g_^", "g_allowvote", "g_assetNames", "g_atmosFogDistanceScaleReadOnly", "g_atmosFogEnabledReadOnly", "g_atmosFogExtinctionStrengthReadOnly", "g_atmosFogHalfPlaneDistanceReadOnly", "g_atmosFogHazeColorReadOnly", "g_atmosFogHazeSpreadReadOnly", "g_atmosFogHazeStrengthReadOnly", "g_atmosFogHeightFogBaseHeightReadOnly", "g_atmosFogHeightFogEnabledReadOnly", "g_atmosFogHeightFogHalfPlaneDistanceReadOnly", "g_atmosFogInScatterStrengthReadOnly", "g_atmosFogSkyAngularFalloffEnabledReadOnly", "g_atmosFogSkyDistanceReadOnly", "g_atmosFogSkyFalloffAngleRangeReadOnly", "g_atmosFogSkyFalloffStartAngleReadOnly", "g_atmosFogStartDistanceReadOnly", "g_atmosFogSunDirectionReadOnly", "g_atmosFogSunFogColorReadOnly", "g_banIPs", "g_biodomes", "g_biodomes_nightmares", "g_bundle_playin", "g_chinatown_int", "g_chopper_gunner", "g_clonePlayerMaxVelocity", "g_compassShowEnemies", "g_copyInfo", "g_customTeamName_Allies", "g_customTeamName_Axis", "g_deadChat", "g_dropForwardSpeed", "g_dropHorzSpeedRand", "g_dropUpSpeedBase", "g_dropUpSpeedRand", "g_earthquakeEnable", "g_fileBuf", "g_findRemovableBoundaryEdges", "g_fogColorIntensityReadOnly", "g_fogColorReadOnly", "g_fogHalfDistReadOnly", "g_fogMaxOpacityReadOnly", "g_fogStartDistReadOnly", "g_friendlyNameDist", "g_friendlyfireDist", "g_fx_taillight_r", "g_gameEnded", "g_gameskill", "g_gametype", "g_giveAll", "g_h_", "g_hardcore", "g_heightFogBaseHeightReadOnly", "g_heightFogEnabledReadOnly", "g_heightFogHalfPlaneDistanceReadOnly", "g_inactivity", "g_keyboarduseholdtime", "g_knockback", "g_lagged_damage_threshold", "g_listEntity", "g_load", "g_load_semaphore", "g_lod", "g_mantleBlockTimeBuffer", "g_maxDroppedWeapons", "g_minGrenadeDamageSpeed", "g_oldschool", "g_passenger", "g_password", "g_patch", "g_playerCollisionEjectSpeed", "g_player_maxHealth", "g_player_speed", "g_quadrotorFlyHeight", "g_radiusDamageMax", "g_react_intro_", "g_removeTinyBoundaryEdges", "g_scriptMainMenu", "g_speed", "g_sunFogBeginFadeAngleReadOnly", "g_sunFogColorIntensityReadOnly", "g_sunFogColorReadOnly", "g_sunFogDirReadOnly", "g_sunFogEnabledReadOnly", "g_sunFogEndFadeAngleReadOnly", "g_sunFogScaleReadOnly", "g_turret_panel_", "g_useholdspawndelay", "g_useholdtime", "g_voiceChatTalkingDuration", "gameMode", "game_ended", "game_map", "game_mode", "game_over", "game_playlist_id", "game_playlist_name", "game_result", "game_time_sec", "game_types", "game_variant", "game_version", "gamedate", "gamedvr_active", "gamename", "gametype_CP", "gametype_ZM", "gametype_mp", "gametype_setting", "gametype_settings", "glass_angular_vel", "glass_beamDamage", "glass_break", "glass_bulletproof", "glass_car", "glass_crack_pattern_scale", "glass_damageToDestroy", "glass_damageToWeaken", "glass_edge_angle", "glass_fall_delay", "glass_fall_gravity", "glass_fall_ratio", "glass_freeCmd", "glass_freeCmd[", "glass_fringe_maxcoverage", "glass_fringe_maxsize", "glass_fx_chance", "glass_gen_verts", "glass_glasses", "glass_groupsAllocator", "glass_groupsAllocator[", "glass_hinge_friction", "glass_indices", "glass_indices[", "glass_indices_slots", "glass_indices_slots[", "glass_linear_vel", "glass_max_pieces_per_frame", "glass_max_shatter_fx_per_frame", "glass_meleeDamage", "glass_missing_verts", "glass_physicsAllocator", "glass_physicsAllocator[", "glass_physics_chance", "glass_physics_maxdist", "glass_radiusDamageMultiplier", "glass_shard_maxsize", "glass_shardsAllocator", "glass_shardsAllocator[", "glass_sharedMemory", "glass_sharedMemory[", "glass_shattered_scale", "glass_smallAllocator", "glass_smallAllocator[", "glass_trace_interval", "glass_unused_gfx_mem", "glass_unused_mem", "glass_update_shards", "glass_verts", "glass_verts[", "glass_verts_slots", "glass_verts_slots[", "goal_changed", "goal_yaw", "gpad_button_lstick_deflect_max", "gpad_button_rstick_deflect_max", "gpad_buttonsConfig", "gpad_dpadDebounceTime", "gpad_menu_scroll_delay_first", "gpad_menu_scroll_delay_rest_accel", "gpad_menu_scroll_delay_rest_end", "gpad_menu_scroll_delay_rest_start", "gpad_rumble", "gpad_stick_deadzone_max", "gpad_stick_pressed", "gpad_stick_pressed_hysteresis", "gpad_sticksConfig", "gravity_spikeJ", "gravity_spike_dust", "gravity_spikes", "grenade_bounce", "grenade_explode", "grenade_fire", "grenade_flee", "grenade_launcher_fire", "grenade_left", "grenade_light", "grenade_ping", "grenade_ping_alert_distance", "grenade_ping_default_distance", "grenade_ping_lifespan", "grenade_ping_pool_value", "grenade_ping_priority", "grenade_pullback", "grenade_right", "grenade_rumble", "grenade_rumbleJ", "grenade_rumbleR", "grenade_stuck", "grenade_throw", "grenade_throwback", "ground_point", "gunshot_alert_distance", "gunshot_default_distance", "gunshot_lifespan", "gunshot_pool_value", "gunshot_priority", "gunshot_teammate", "gunshot_teammate_alert_distance", "gunshot_teammate_default_distance", "gunshot_teammate_lifespan", "gunshot_teammate_pool_value", "gunshot_teammate_priority", "heli_ai_mp", "heli_attack_area", "heli_barrelMaxVelocity", "heli_barrelRotation", "heli_barrelSlowdown", "heli_comlink_bootup_anim", "heli_comlink_light", "heli_crash_start", "heli_crash_zone", "heli_dest", "heli_guard", "heli_guard_light", "heli_guard_mp", "heli_gunner", "heli_gunner_light", "heli_gunner_loop_start", "heli_height_lock", "heli_leave", "heli_loop_start", "heli_player_gunner_mp", "heli_raps_mp", "heli_raps_mpB", "heli_start", "heli_warn_fired", "heli_warn_locked", "heli_warn_targeted", "hiDef", "high_alert", "high_boost", "high_priority", "host_content_completed", "host_left_no_migration", "host_migration_begin", "host_msg_completed", "host_msgheartbeat_completed", "host_msgstate_completed", "host_product_name", "host_product_version", "host_sucks_end_game", "host_unreachable", "host_xuid", "hostmigration_start", "hudElemPausedBrightness", "hudOutlineDuringADS", "hud_ammo_refill", "hud_bloodOverlayLerpRate", "hud_chalk_", "hud_deathQuoteFadeTime", "hud_enable", "hud_exploding_vehicles", "hud_explosive_arrow_icon", "hud_fade_ammodisplay", "hud_fade_compass", "hud_fade_healthbar", "hud_fade_offhand", "hud_fade_sprint", "hud_flash_period_offhand", "hud_flash_time_offhand", "hud_force_kill_killstreak_hud", "hud_grenadeicon_", "hud_grenadepointer", "hud_hardcore", "hud_health_pulserate_critical", "hud_health_pulserate_injured", "hud_health_startpulse_critical", "hud_health_startpulse_injured", "hud_icon_stuck_semtex", "hud_icon_syrette", "hud_keyline_enemyequip", "hud_keyline_enemyequipR", "hud_keyline_friendlyequip", "hud_keyline_resurrect", "hud_keyline_retrievable", "hud_keyline_retrievableJ", "hud_keyline_unplaceable", "hud_ks_dogs", "hud_ks_harpy", "hud_ks_harpy_single", "hud_ks_littlebird", "hud_ks_m", "hud_ks_minigun", "hud_ks_player_helicopter", "hud_ks_qr_drone", "hud_ks_reaper", "hud_ks_straferun", "hud_ks_tv_guided_marker", "hud_ks_tv_guided_missile", "hud_message", "hud_missionFailed", "hud_monsoon_nitrogen_barrel", "hud_monsoon_titus_arrow", "hud_mp", "hud_obit_crate", "hud_obit_death_crush", "hud_obit_death_falling", "hud_obit_death_grenade_round", "hud_obit_death_suicide", "hud_obit_knife", "hud_obit_weapon_butt", "hud_outline_model_alpha_scriptint", "hud_outline_model_calpha_scriptint", "hud_outline_model_green", "hud_outline_model_green_alpha", "hud_outline_model_green_calpha", "hud_outline_model_orange", "hud_outline_model_orange_alpha", "hud_outline_model_orange_calpha", "hud_outline_model_red", "hud_outline_model_red_alpha", "hud_outline_model_red_calpha", "hud_outline_model_scriptint", "hud_outline_model_white", "hud_outline_model_white_alpha", "hud_outline_model_white_calpha", "hud_outline_model_z_alpha_scriptint", "hud_outline_model_z_calpha_scriptint", "hud_outline_model_z_green", "hud_outline_model_z_green_alpha", "hud_outline_model_z_green_calpha", "hud_outline_model_z_orange", "hud_outline_model_z_orange_alpha", "hud_outline_model_z_orange_calpha", "hud_outline_model_z_red", "hud_outline_model_z_red_alpha", "hud_outline_model_z_red_calpha", "hud_outline_model_z_scriptint", "hud_outline_model_z_white", "hud_outline_model_z_white_alpha", "hud_outline_model_z_white_calpha", "hud_outline_model_zonly_scriptint", "hud_outline_predator", "hud_outline_predator_break", "hud_outline_predator_camo_active_ally", "hud_outline_predator_camo_active_enemy", "hud_outline_predator_camo_active_enemy_scorestreak", "hud_outline_predator_camo_disruption_ally", "hud_outline_predator_camo_disruption_enemy", "hud_outline_predator_camo_disruption_enemy_scorestreak", "hud_outline_predator_scorestreak", "hud_outline_rim", "hud_refresh", "hud_remote_missile_target", "hud_scavenger_pickup", "hud_status_connecting", "hud_status_connectingA", "hud_status_dead", "hud_vehicle_turret_fire", "hud_visible", "igs_download_active", "igs_fo", "igs_sosp", "igs_swp", "igs_td", "igs_use_dcache", "ik_C", "ik_Ct[", "ik_ai_hand_get_data", "ik_ai_hand_offset_vec", "ik_ai_hand_rotation_vec", "ik_ai_hand_tuning", "ik_ai_pool_size", "ik_ai_range_max", "ik_debug", "ik_disable_layer", "ik_dvar_ai_aim_tracking_rate", "ik_dvar_lookatentity_eyes_scale", "ik_dvar_lookatentity_notorso", "ik_dvar_lookatentity_tracking_rate", "ik_dvar_lookatpos_eyes_scale", "ik_dvar_lookatpos_notorso", "ik_dvar_lookatpos_tracking_rate", "ik_enable", "ik_enable_ai_hand", "ik_enable_ai_terrain", "ik_enable_player_hand", "ik_enable_player_terrain", "ik_foot_test", "ik_hand_test", "ik_left_hand_lerp_test", "ik_lookatentity_gun_out_of_hand_range", "ik_lookatentity_head_scale", "ik_lookatpos_head_scale", "ik_momentum", "ik_momentum_degrees_accel", "ik_momentum_degrees_angular", "ik_momentum_degrees_vel", "ik_momentum_max_accel", "ik_paranoid_matrix_checks", "ik_pelvis_test", "ik_pitch_left_hand_attach_thresh_max", "ik_pitch_left_hand_attach_thresh_min", "ik_pitch_limit_max", "ik_pitch_limit_thresh", "ik_playerpitch_pelvis_crouch_down", "ik_playerpitch_pelvis_crouch_up", "ik_playerpitch_pelvis_stand_down", "ik_playerpitch_pelvis_stand_up", "ik_playerpitch_pelvis_twist_ofs_crouch", "ik_playerpitch_pelvis_twist_ofs_stand", "ik_right_hand_lerp_test", "ik_roll_limit_max", "ik_roll_limit_thresh", "ik_swimming_align_aim", "ik_terrain_vel_max", "ik_terrain_vel_min", "ik_types", "ik_yaw_limit_max", "ik_yaw_limit_thresh", "in_igc", "in_mouse", "in_restart", "in_spawnSpectator", "in_vehicle", "info_corona", "info_notnull", "info_notnull_big", "info_player_deathmatch", "info_player_start", "info_type", "info_vehicle_node", "info_vehicle_node_rotate", "info_volume", "ingamestore_breadcrumb_grab_playerdata_killswitch", "input_autoAim", "input_devices", "input_invertpitch", "input_source_changed", "input_targetAssist", "input_viewSensitivity", "input_viewSensitivityHorizontal", "input_viewSensitivityVertical", "intro", "invalid_argument", "invalid_s_m_i_d", "inventory_addEntitlementsToLocalInventory", "inventory_ai_tank_drop", "inventory_ai_tank_marker", "inventory_ai_tank_marker_mp", "inventory_airstrike", "inventory_artillery", "inventory_auto_tow", "inventory_autoturret", "inventory_autoturret_mp", "inventory_combat_robot", "inventory_combat_robot_drop", "inventory_combat_robot_marker", "inventory_combat_robot_marker_mp", "inventory_counteruav", "inventory_counteruav_mp", "inventory_currency", "inventory_dart", "inventory_dart_mps", "inventory_dogs", "inventory_dogs_lvl", "inventory_drone_strike", "inventory_drone_strike_mp", "inventory_emp", "inventory_emp_mp", "inventory_enableEntitlementDLCScanning", "inventory_enableRevoke", "inventory_enabled", "inventory_exchangeEnabled", "inventory_exchangeMaxConsumablesPerBoot", "inventory_exchangeRetryBaseMS", "inventory_exchangeRetryByRound", "inventory_exchangeRetryMax", "inventory_excludeEntitlementDLCScanning", "inventory_helicopter", "inventory_helicopter_comlink", "inventory_helicopter_comlink_mp", "inventory_helicopter_guard", "inventory_helicopter_guard_mp", "inventory_helicopter_gunner", "inventory_helicopter_gunner_assistant", "inventory_helicopter_gunner_assistant_mp", "inventory_helicopter_player_firstperson", "inventory_helicopter_player_gunner", "inventory_helicopter_player_gunner_mp", "inventory_helicopter_x", "inventory_ignoreDWPushNotification_claimAchievement", "inventory_ignoreDWPushNotification_itemUpdate", "inventory_m", "inventory_microwave_turret", "inventory_microwave_turret_deploy_mp", "inventory_microwaveturret", "inventory_minigun", "inventory_minigun_cp", "inventory_minigun_drop", "inventory_minigun_drop_mps", "inventory_minigun_mp", "inventory_missile_drone", "inventory_missile_swarm", "inventory_mortar", "inventory_mp", "inventory_napalm", "inventory_planemortar", "inventory_planemortar_mp", "inventory_qrdrone", "inventory_raps", "inventory_raps_drone", "inventory_raps_mp", "inventory_rcbomb", "inventory_rcbomb_mp", "inventory_remote_missile", "inventory_remote_missile_mp", "inventory_remote_mortar", "inventory_remote_mortar_mp", "inventory_satellite", "inventory_satellite_mp", "inventory_sentinel", "inventory_sentinel_mp", "inventory_straferun", "inventory_supply_drop", "inventory_supply_station", "inventory_supplydrop", "inventory_supplydrop_marker", "inventory_supplydrop_marker_mps", "inventory_taskExchangeTimeout", "inventory_taskGetTimeout", "inventory_tow_turret_drop", "inventory_triggerExchangeOnContentMount", "inventory_triggerExchangeOnStoreExit", "inventory_turret_drop", "inventory_uav", "inventory_uav_mp", "iotd_active", "iotd_retry", "is_aggregated", "is_builtin", "is_case_sensitive", "is_default", "is_encrpyted", "is_encrypted", "is_main", "is_network_volume", "isgodmode", "j_C", "j_UNOPT", "j_WW", "j_a", "j_ankle_le", "j_ankle_le_heel", "j_ankle_ri", "j_ankle_ri_heel", "j_antenna_", "j_antenna_tr", "j_arm_", "j_ball_le", "j_ball_ri", "j_bar", "j_bolt", "j_bolt_handle", "j_bracket_slide_", "j_breathe_le", "j_breathe_ri", "j_breathing_", "j_breathing_trns", "j_bridge", "j_brow_a", "j_brow_b", "j_brow_in_le", "j_brow_in_ri", "j_brow_le", "j_brow_out_le", "j_brow_out_ri", "j_brow_ri", "j_buckle_", "j_bullet", "j_butt_adj_", "j_calf_adj_", "j_calf_le", "j_calf_ri", "j_camera_rotate", "j_camera_rotate_dam", "j_cheek_a", "j_cheek_b", "j_cheek_c", "j_cheek_down_le", "j_cheek_down_ri", "j_cheek_high_le", "j_cheek_high_ri", "j_cheek_le", "j_cheek_out_le", "j_cheek_out_ri", "j_cheek_ri", "j_cheekpuff_le", "j_cheekpuff_ri", "j_chest_door", "j_chest_door_dam", "j_chin_a", "j_chin_jaw", "j_chin_skinroll", "j_clavicle_le", "j_clavicle_le_tr", "j_clavicle_le_trans", "j_clavicle_ri", "j_clavicle_ri_tr", "j_clavicle_ri_trans", "j_claw_bottom_", "j_claw_left_", "j_claw_right_", "j_clip", "j_coatfront_le", "j_coatfront_ri", "j_coatrear_le", "j_coatrear_ri", "j_collar", "j_counter", "j_dial_left", "j_dial_right", "j_dish", "j_door", "j_door_hinge", "j_ear_a", "j_ear_b", "j_elbow_bulge_le", "j_elbow_bulge_ri", "j_elbow_le", "j_elbow_le_rot", "j_elbow_ri", "j_elbow_ri_rot", "j_eye_a", "j_eye_b", "j_eye_le", "j_eye_le_aim", "j_eye_le_lid", "j_eye_lid_bot_le", "j_eye_lid_bot_ri", "j_eye_lid_top_le", "j_eye_lid_top_ri", "j_eye_ri", "j_eye_ri_aim", "j_eye_ri_lid", "j_eyeball_le", "j_eyeball_ri", "j_eyebrow_top_le", "j_eyebrow_top_ri", "j_eyelid_bot_", "j_eyelid_bottom_le", "j_eyelid_bottom_ri", "j_eyelid_top_", "j_eyelid_top_le", "j_eyelid_top_ri", "j_forehead_a", "j_forehead_b", "j_forehead_le", "j_forehead_ri", "j_glass_tumbler", "j_grenade_activate_clip", "j_guide_cord_down", "j_guide_cord_down_bot", "j_guide_cord_up", "j_guide_cord_up_top", "j_gun", "j_gun_", "j_hammer", "j_hand_le", "j_hand_le_end", "j_hand_ri", "j_hand_ri_end", "j_handle", "j_handle_click", "j_head", "j_head_aim", "j_head_end", "j_head_ponytail_", "j_head_rot", "j_helmet", "j_hinge", "j_hinge_", "j_hip_base_le", "j_hip_base_ri", "j_hip_inner_le", "j_hip_inner_le_tr", "j_hip_inner_ri", "j_hip_inner_ri_tr", "j_hip_le", "j_hip_le_dam", "j_hip_ri", "j_hip_ri_dam", "j_hip_ri_loop", "j_hipbackpush_le", "j_hipbackpush_ri", "j_hipfrontraise_le", "j_hipfrontraise_ri", "j_hippack_", "j_hipslidedown_le", "j_hipslidedown_ri", "j_hiptwist_le", "j_hiptwist_ri", "j_hydraulic_lower_base_", "j_hydraulic_lower_base_hinge", "j_hydraulic_upper_base_", "j_hydraulic_upper_base_hinge", "j_index_le_", "j_index_ri_", "j_indexbase_le", "j_indexbase_ri", "j_indexretract_le", "j_indexretract_ri", "j_inner_shoulder_pack_le", "j_inner_shoulder_pack_le_tr", "j_inner_shoulder_pack_le_trans", "j_inner_shoulder_pack_le_trans_dam", "j_inner_shoulder_pack_ri", "j_inner_shoulder_pack_ri_tr", "j_inner_shoulder_pack_ri_trans", "j_inner_shoulder_pack_ri_trans_dam", "j_jaw", "j_jaw_a", "j_jaw_b", "j_jaw_c", "j_jaw_end", "j_jaw_lower", "j_jaw_upper", "j_jets_left_back", "j_jets_left_front", "j_jets_left_side", "j_jets_right_back", "j_jets_right_front", "j_jets_right_side", "j_joind_end_right", "j_joint_corner_left", "j_joint_corner_right", "j_joint_middle_left", "j_joint_middle_right", "j_k", "j_k_", "j_knee_bulge_le", "j_knee_bulge_ri", "j_knee_le", "j_knee_le_dam", "j_knee_le_rot", "j_knee_ri", "j_knee_ri_dam", "j_knee_ri_rot", "j_l_rear_socket_animate", "j_l_wing_large_feather", "j_left_panel", "j_leg_front", "j_leg_left", "j_leg_rear", "j_leg_right", "j_levator_le", "j_levator_ri", "j_lever_", "j_lip_bot", "j_lip_bot_le", "j_lip_bot_out_le", "j_lip_bot_out_ri", "j_lip_bot_ri", "j_lip_top", "j_lip_top_le", "j_lip_top_out_le", "j_lip_top_out_ri", "j_lip_top_ri", "j_lip_upper_le", "j_lip_upper_out_le", "j_lip_upper_out_ri", "j_lip_upper_ri", "j_lower_arch_", "j_lower_arch_collapse", "j_lower_arch_override", "j_lower_limb", "j_lower_limb_collapse", "j_lowerhead", "j_mag_release", "j_mainroot", "j_mid_feather_ctrl_le", "j_mid_feather_ctrl_ri", "j_mid_le_", "j_mid_ri_", "j_mid_shoulder_le_tr", "j_mid_shoulder_le_trans", "j_mid_shoulder_ri_tr", "j_mid_shoulder_ri_trans", "j_mms_flip", "j_mouth_a", "j_mouth_b", "j_mouth_c", "j_mouth_inner_le", "j_mouth_inner_ri", "j_mouth_innerlow", "j_mouth_innerlow_le", "j_mouth_innerlow_ri", "j_mouth_innerup", "j_mouth_innerup_le", "j_mouth_innerup_ri", "j_mouth_le", "j_mouth_ri", "j_neck", "j_neck_", "j_neck_end", "j_neck_spinedisk", "j_neck_spinedisk_tr", "j_nose", "j_nose_a", "j_nose_b", "j_nose_c", "j_nose_le", "j_nose_ri", "j_o", "j_over_head", "j_over_shoulder_spin", "j_palm_end_le", "j_palm_end_ri", "j_palm_le", "j_palm_ri", "j_panel", "j_path_follow", "j_pelvis", "j_pelvis_clavicle_le", "j_pelvis_clavicle_ri", "j_pinky_le_", "j_pinky_ri_", "j_pinkybase_le", "j_pinkybase_ri", "j_pinkypalm_le", "j_pinkypalm_ri", "j_pistol_grip", "j_pitch", "j_pivot", "j_post_corner_base_", "j_post_corner_dmg_", "j_post_corner_left", "j_post_corner_right", "j_post_emd_dmg_", "j_post_end_", "j_post_end_base_", "j_post_end_dmg_", "j_post_middle_base_", "j_post_middle_dmg_", "j_post_middle_left", "j_post_middle_right", "j_pouch_", "j_quiver_piv", "j_quiver_rot", "j_r_wing_feather_grp_l_wing_large_feather", "j_reload", "j_reverse_pelvis", "j_right_panel", "j_ring_le_", "j_ring_ri_", "j_ringbase_le", "j_ringbase_ri", "j_ringpalm_le", "j_ringpalm_ri", "j_rotation", "j_sawbase", "j_sensor", "j_shock_slide_", "j_shorts_le", "j_shorts_lift_le", "j_shorts_lift_ri", "j_shorts_ri", "j_shoulder_base_le", "j_shoulder_base_ri", "j_shoulder_flap_le", "j_shoulder_flap_ri", "j_shoulder_le", "j_shoulder_le_rot", "j_shoulder_le_rot_dam", "j_shoulder_le_rot_new", "j_shoulder_le_tr", "j_shoulder_le_trans", "j_shoulder_ri", "j_shoulder_ri_rot", "j_shoulder_ri_rot_dam", "j_shoulder_ri_rot_new", "j_shoulder_ri_tr", "j_shoulder_ri_trans", "j_shoulder_spin_le", "j_shoulder_spin_ri", "j_shoulderpushout_le", "j_shoulderpushout_ri", "j_shoulderraise_le", "j_shoulderraise_ri", "j_shoulderraiserot_le", "j_shoulderraiserot_ri", "j_shoulderslidedown_le", "j_shoulderslidedown_ri", "j_shouldertwist_le", "j_shouldertwist_ri", "j_sleave_reshape_bottom_le_", "j_sleave_reshape_top_le_", "j_sleave_reshape_top_ri_", "j_sleeve", "j_slide_camera", "j_slide_camera_tr", "j_spine", "j_spine_", "j_spinedisc", "j_spinelower", "j_spinelower_rot", "j_spineupper", "j_squeezer", "j_start_feather_ctrl_le", "j_start_feather_ctrl_ri", "j_strap_a", "j_strap_b", "j_strap_c", "j_support_left_base", "j_support_left_mid", "j_support_right_base", "j_support_right_mid", "j_swivel", "j_syrette_cap", "j_tail", "j_tail_", "j_tail_base", "j_tail_feather_", "j_tail_feather_top_", "j_tarsal_le", "j_tarsal_ri", "j_teeth_lower", "j_teeth_upper", "j_tent_armbottom_", "j_tent_armtop_", "j_tent_leg", "j_tent_main_", "j_thumb_le_", "j_thumb_ri_", "j_toe_all_le", "j_toe_all_ri", "j_toe_index_", "j_toe_le", "j_toe_le_end", "j_toe_mid_", "j_toe_pinky_", "j_toe_ri", "j_toe_ri_end", "j_toe_thumb_", "j_toeend_le", "j_toeend_ri", "j_tongue", "j_tongue_", "j_tongue_ext", "j_trigger", "j_upper_arch_", "j_upper_arch_override_collapse", "j_upper_limb", "j_upper_limb_collapse", "j_uppercheek_a", "j_webbing_le", "j_webbing_ri", "j_wing_feather_a", "j_wing_feather_b", "j_wing_feather_c", "j_wrist_le", "j_wrist_le_updown", "j_wrist_ri", "j_wrist_ri_updown", "j_wristcrease", "j_wristcrease_le", "j_wristcrease_ri", "j_wristtwist", "j_wristtwist_le", "j_wristtwist_ri", "jump_across_", "jump_across_trv", "jump_begin", "jump_chance", "jump_down_", "jump_end", "jump_height", "jump_land", "jump_r", "jump_rumble_end", "jump_rumble_endJ", "jump_rumble_start", "jump_up", "jump_up_", "kill_after_doublejump_out_of_water", "kill_after_resupply", "kill_anteup_overclock_scorestreak_specialist", "kill_as_support_gunner", "kill_assn_", "kill_attacker_with_robot_or_tank", "kill_awareness", "kill_ball_carrier", "kill_before_specialist_weapon_use", "kill_blast_doublejump", "kill_blindeye_ghost_aircraft", "kill_booby_trap_engineer", "kill_carrier", "kill_close_blast_deadsilence", "kill_close_deadsilence_awareness", "kill_concussed_enemy", "kill_confirmed", "kill_confirmed_multi", "kill_count", "kill_dead_silence", "kill_demo_", "kill_denied", "kill_detect_tracker", "kill_dialog", "kill_distances", "kill_doublejump_uav_engineer_hardwired", "kill_enemies_one_bullet", "kill_enemy_", "kill_enemy_after_death", "kill_enemy_grenade_throwback", "kill_enemy_injuring_teammate", "kill_enemy_one_bullet", "kill_enemy_one_bullet_shotgun", "kill_enemy_one_bullet_sniper", "kill_enemy_sixth_sense", "kill_enemy_survive_flak", "kill_enemy_that_blinded_you", "kill_enemy_that_heatwaved_you", "kill_enemy_that_in_air", "kill_enemy_that_is_in_air", "kill_enemy_that_is_using_optic_camo", "kill_enemy_that_is_wallrunning", "kill_enemy_that_pulsed_you", "kill_enemy_that_used_resurrect", "kill_enemy_thats_wallrunning", "kill_enemy_through_wall", "kill_enemy_through_wall_with_fmj", "kill_enemy_when_injured", "kill_enemy_while_both_in_air", "kill_enemy_while_capping_dom", "kill_enemy_while_capping_hq", "kill_enemy_while_carrying_ball", "kill_enemy_while_flashbanged", "kill_enemy_while_in_air", "kill_enemy_while_sliding", "kill_enemy_while_stunned", "kill_enemy_while_using_psychosis", "kill_enemy_while_wallrunning", "kill_enemy_who_damaged_robot", "kill_enemy_who_has_flashbacked", "kill_enemy_who_has_high_score", "kill_enemy_who_has_powerarmor", "kill_enemy_who_is_speedbursting", "kill_enemy_who_is_using_focus", "kill_enemy_who_killed_teammate", "kill_enemy_with_care_package_crush", "kill_enemy_with_fists", "kill_enemy_with_gunbutt", "kill_enemy_with_hacked_care_package", "kill_enemy_with_more_ammo_oic", "kill_enemy_with_their_weapon", "kill_entire_team_with_specialist_weapon", "kill_every_enemy", "kill_every_enemy_with_specialist", "kill_fasthands_gungho_sprint", "kill_flag_carrier", "kill_flak_tac_while_stunned", "kill_flashed_enemy", "kill_generic_", "kill_gun", "kill_hacker", "kill_hacker_then_hack", "kill_hardwired_coldblooded", "kill_hint_text", "kill_hip_gung_ho", "kill_hunt_", "kill_in_", "kill_leader", "kill_multiple", "kill_near_plant_engineer_hardwired", "kill_nemesis", "kill_none", "kill_one_game_ability", "kill_one_game_weapon", "kill_optic_", "kill_overclock_afterburner_specialist_weapon_after_thrust", "kill_overkill_gunfighter_", "kill_pyro_", "kill_reap_", "kill_scavenger_tracker_resupply", "kill_sd", "kill_shocked_enemy", "kill_sixthsense_awareness", "kill_sling_", "kill_sniper_", "kill_specialist_with_specialist", "kill_sprint_stunned_gungho_tac", "kill_streak", "kill_streak_before_death", "kill_stun_lethal", "kill_stunned_tacmask", "kill_surv_", "kill_techno_", "kill_thermal_through_smoke", "kill_tracker_sixthsense", "kill_trip_mine_shocked", "kill_uav_enemy_with_ghost", "kill_underwater_enemy_explosive", "kill_wallrunner_or_air_with_rcbomb", "kill_warr_", "kill_while_damaging_with_microwave_turret", "kill_while_in_air", "kill_while_mantling", "kill_while_sliding", "kill_while_sliding_from_doublejump", "kill_while_underwater", "kill_while_wallrunning", "kill_while_wallrunning_", "kill_with_both_primary_weapons", "kill_with_controlled_ai_tank", "kill_with_controlled_sentinel", "kill_with_cooked_grenade", "kill_with_gunfighter", "kill_with_loadout_weapon_with_", "kill_with_pickup", "kill_with_resupplied_lethal_grenade", "kill_with_specialist_overclock", "kill_with_thermal_and_smoke_ads", "kill_within_time", "kill_x", "knife_ballistic", "knife_ballistic_cp", "knife_cp", "knife_held", "knife_held_cp", "knife_loadout", "knife_loadout_cp", "knife_loadout_mp", "knife_mp", "knife_with_ammo_oic", "koth_captured", "koth_contested", "koth_large", "koth_located", "koth_lost", "koth_online", "koth_secure", "koth_secured", "koth_small", "koth_start", "koth_zone_center", "laserDebug", "laserLightRadius", "laserRadius", "laser_off", "laser_on", "last_man_alive", "last_man_defeat_", "last_stand", "lb_readDelay", "lb_read_old_gm_leaderboards", "lb_throttle_time", "lb_times_in_window", "lb_window", "league_team_id", "left_arm", "left_arm_lower", "left_arm_upper", "left_cylinder_in", "left_cylinder_out", "left_femur_cov", "left_foot", "left_hand", "left_hand_ik", "left_hip_pitch", "left_l", "left_leg", "left_leg_lower", "left_leg_upper", "left_level", "left_player", "left_r", "left_shot", "left_stick_pressed", "left_toe_pitch", "left_tread", "left_tread_destroyed", "left_trigger", "live_dedicatedReady", "live_disablePreOrderCheck", "live_displayVACSpecificLogOnMsg", "live_notification", "live_presence_max_ms_between_updates", "live_presence_min_ms_between_updates", "live_qosec_firstupdatems", "live_qosec_lastupdatems", "live_serverLocation", "livestreaming_active", "loading_displaycontinue", "loading_sre_fatal", "loading_startplay", "lobby_animationSpeed", "lobby_animationTilesHigh", "lobby_animationTilesWide", "lobby_create", "lobby_data_client_", "lobby_data_host_", "lobby_data_silent_", "lobby_error", "lobby_errorshutdown", "lobby_idle", "lobby_leader_activity_changed", "lobby_leave", "lobby_maxLocalPlayers", "lobby_move", "lobby_numAnimationFrames", "lobby_reload", "lobby_search", "lobby_searchingPartyColor", "lobby_setgametype", "lobby_setmap", "lobby_spinner_popup", "lobby_type", "loc_arabic_sku", "loc_availablelanguages", "loc_japanese_sku", "loc_language", "loc_translate", "localplayers_cp", "localplayers_mp", "localplayers_none", "localplayers_zm", "log_host_migration_chance", "log_party_state", "long_distance_hatchet_kill", "long_shot_longbarrel_suppressor_optic", "loot_body", "loot_category", "loot_config", "loot_crate", "loot_dailyLoginEnabled", "loot_emblems", "loot_enabled", "loot_helmet", "loot_ignoreNewPendingCoupons", "loot_maxEventsToPresentSupplyPackage", "loot_maxUnopenedSupplyPackagesBeforeCouponsDeletion", "loot_maxplayTime", "loot_minEventsToPresentSupplyPackage", "loot_rarity", "loot_redeemed", "loot_reportCompletedChallenges", "loot_reportPlayTimeEnabled", "loot_taskDefaultTimeout", "loot_taskSupplyDropTimeout", "lootservice", "lowAmmoWarningColor1", "lowAmmoWarningColor2", "lowAmmoWarningNoAmmoColor1", "lowAmmoWarningNoAmmoColor2", "lowAmmoWarningNoReloadColor1", "lowAmmoWarningNoReloadColor2", "lowAmmoWarningPulseFreq", "lowAmmoWarningPulseMax", "lowAmmoWarningPulseMin", "lsp_enumertion_max_retry_time", "lsp_enumertion_retry_step", "lui_FFotDSupportEnabled", "lui_demoMode", "lui_exitOnResolve", "lui_gametype", "lui_hud_motion_angle_ease_speed", "lui_hud_motion_bob_scale", "lui_hud_motion_enabled", "lui_hud_motion_perspective", "lui_hud_motion_rotation_max", "lui_hud_motion_rotation_scale", "lui_hud_motion_trans_ease_speed", "lui_hud_motion_translation_max", "lui_hud_motion_translation_scale", "lui_loader", "lui_loader_no_offset", "lui_loot_duplicateredemption", "lui_menu", "lui_menu_data", "lui_mlg_rules_unlocked", "lui_priv_lobby_team", "lui_shared", "lui_splitscreensignin_menu", "lui_splitscreenupscaling", "lui_systemlink_menu", "lui_waitingforgavelmessagesconfirmed", "lui_waitingforonlinedatafetch_controller", "m_C", "m_D", "m_S", "m_V", "m_animationStates", "m_bgb_dial_lr", "m_eventHandlers", "m_filter", "m_forward", "m_grenade", "m_idle_ads", "m_idle_flinc`", "m_jobFuncs", "m_jobQueue", "m_maxHorizontalRange", "m_maxVerticalRange", "m_mid_lod", "m_mouseAcceleration", "m_mouseFilter", "m_mouseSensitivity", "m_move_flinc`", "m_move_l", "m_n_", "m_o", "m_pitch", "m_queueSemaphores", "m_raise_over", "m_react_id", "m_references", "m_score_", "m_side", "m_upg_react_intro_", "m_userData", "m_walk_b", "m_x", "m_yaw", "m_zm_bgb_dial_lr", "m_zm_bgb_door_op", "m_zm_bgb_tube_fr", "mag_in", "mag_lock", "mag_out", "mag_screw", "mag_slide_in", "mag_slide_out", "mag_unlock", "mag_unscrew", "mantle_across_", "mantle_end", "mantle_foot_contact", "mantle_hand_contact", "mantle_over_", "mantle_start", "manual_ai", "manual_change", "mapPackMPGroupFourFlags", "mapPackMPGroupFreeFlags", "mapPackMPGroupOneFlags", "mapPackMPGroupThreeFlags", "mapPackMPGroupTwoFlags", "map_CP", "map_ZM", "map_directional_selector", "map_directional_selectora", "map_ents", "map_fr", "map_mortar_selector", "map_mortar_selector_done", "map_restart", "map_rotate", "mapname", "maps_cp", "maps_mp", "maps_zm", "marketing_active", "marketing_content", "marketing_enabled", "marketing_getmessage", "marketing_metadata", "marketing_refresh_time", "marketing_result", "match_bonus", "match_captures", "match_change_map", "match_deaths", "match_defends", "match_duration", "match_end", "match_hash_low", "match_headshots", "match_hits", "match_id", "match_kills", "match_launch_client", "match_longshots", "match_record", "match_result", "match_score", "match_shots", "match_start", "match_starting", "match_starting_in", "match_streak", "match_xp", "matchdata_active", "matchdata_maxcompressionbuffer", "matchmaking_debug", "matchmaking_progress", "matchtype_cp", "matchtype_mp", "matchtype_theater", "matchtype_zm", "maxPrestigeOverride", "maxVoicePacketsPerSec", "maxVoicePacketsPerSecForServer", "max_compressed", "max_count", "max_duration", "max_frequency_hz", "max_kill_count", "max_move_dist", "max_opacity", "max_path_fail_count", "max_ping_threshold_good", "max_ping_threshold_medium", "max_pitch", "max_speed_pitch", "max_speed_vol", "max_uncompressed", "max_value", "max_vol", "mdsd", "melee_armblade", "melee_assassinate", "melee_bash", "melee_breath", "melee_charge", "melee_cybercom", "melee_debug", "melee_end", "melee_fire", "melee_kill", "melee_kill_", "melee_leader_gun", "melee_swipe", "melee_zoom", "menu_change", "menu_changeclass", "menu_changeclass_", "menu_changeclass_allies", "menu_changeclass_axis", "menu_changeclass_free", "menu_changeclass_offline", "menu_changeclass_team", "menu_changed", "menu_class", "menu_controls", "menu_leavegame", "menu_mp_lobby_scrollbar_block", "menu_mp_lobby_scrollbar_main", "menu_mp_pip_blue", "menu_mp_pip_green", "menu_mp_pip_outline", "menu_mp_pip_red", "menu_mp_star_rating", "menu_mp_star_rating_empty", "menu_mp_star_rating_half", "menu_none", "menu_options", "menu_select", "menu_start_menu", "menu_team", "middle_left", "middle_right", "middle_right]", "migration_dvarErrors", "migration_minclientcount", "migration_soak", "missileRemoteFOV", "missileRemoteSteerPitchRange", "missileRemoteSteerPitchRate", "missileRemoteSteerYawRate", "missile_boost", "missile_brake", "missile_createattractorent", "missile_createattractororigin", "missile_createrepulsorent", "missile_createrepulsororigin", "missile_deleteattractor", "missile_drone", "missile_drone_projectile", "missile_dronesetvisible", "missile_fire", "missile_gettarget", "missile_lock", "missile_settarget", "missile_swarm", "missile_unlocked", "missions_unlocked", "mm_aw_onboarding_rank", "mm_blops2_onboarding_skill", "mm_bucket_option", "mm_comlink", "mm_comlink_mp", "mm_country_code", "mm_dlc_map_ignore_timeline", "mm_dlc_map_ignores_enabled", "mm_fire", "mm_ghosts_onboarding_skill", "mm_mp", "mm_past_title_stats_source", "mm_ping_disparity_timeline", "mm_results_allow_unacceptable_qos_max_unresponsive", "mm_results_allow_unacceptable_qos_min_received", "mm_results_ping_band", "mm_results_use_any_ping_max_results", "mm_search_max_tier", "mm_server_acquire_interval", "mm_server_advertise_time", "mm_skill_based_allow", "mm_skill_based_enable", "mm_skill_calculation_type", "mm_skill_factor_timeline", "mm_skill_flow", "mm_skill_ignore_onboard_time", "mm_skill_lower_bucket", "mm_skill_param_delta", "mm_skill_param_gamma", "mm_skill_param_lambda", "mm_skill_param_xi", "mm_skill_tight_bounds", "mm_skill_tight_chance", "mm_skill_tight_expand_gap", "mm_skill_type", "mm_skill_upper_bucket", "mm_sph_10", "mm_sph_11", "mm_sph_12", "mm_sph_13", "mm_sph_14", "mm_sph_15", "mm_sph_16", "mm_sph_17", "mm_sph_18", "mm_sph_7", "mm_sph_8", "mm_sph_9", "mm_split_population", "mm_test_type", "mm_use_onboarding_skill", "mm_using_notequal_query", "monkeytoy", "moon_gravity", "motd", "motd_image_descriptors_done", "motd_store_link", "motionTrackerBlurDuration", "motionTrackerCenterX", "motionTrackerCenterY", "motionTrackerPingFadeTime", "motionTrackerPingPitchAddPerEnemy", "motionTrackerPingPitchBase", "motionTrackerPingPitchNearby", "motionTrackerPingSize", "movement_Update_Count", "mp_QuickMessage", "mp_ability_resurrection", "mp_ability_wakeup", "mp_apartments", "mp_apartments_d", "mp_arena", "mp_attributesTable", "mp_autoturret", "mp_biodome", "mp_biodome_d", "mp_blackmarket", "mp_castaway", "mp_challenge_complete", "mp_chinatown", "mp_chinatown_d", "mp_common", "mp_common_all", "mp_common_d", "mp_cosmodrome", "mp_ctf_spawn", "mp_ctf_spawn_", "mp_ctf_spawn_allies", "mp_ctf_spawn_allies_start", "mp_ctf_spawn_axis", "mp_ctf_spawn_axis_start", "mp_custom", "mp_custom_leaderboards_reset", "mp_default_gamesettings", "mp_dem_spawn_attacker", "mp_dem_spawn_attackerOT_start", "mp_dem_spawn_attacker_remove_a", "mp_dem_spawn_attacker_remove_b", "mp_dem_spawn_attacker_start", "mp_dem_spawn_defender", "mp_dem_spawn_defenderOT_start", "mp_dem_spawn_defender_a", "mp_dem_spawn_defender_b", "mp_dem_spawn_defender_start", "mp_dm_spawn", "mp_dm_spawn_start", "mp_dom_spawn", "mp_dom_spawn_", "mp_dom_spawn_allies_start", "mp_dom_spawn_axis_start", "mp_dom_spawn_flag", "mp_dom_spawn_flag_a", "mp_dom_spawn_flag_b", "mp_dom_spawn_flag_c", "mp_emp_power_core", "mp_enemy_obj_captured", "mp_enemy_obj_taken", "mp_escort_spawn_attacker", "mp_escort_spawn_attacker_start", "mp_escort_spawn_defender", "mp_escort_spawn_defender_start", "mp_ethiopia", "mp_ethiopia_d", "mp_face_male_jump_idle_", "mp_face_male_slides_", "mp_face_male_sprint_", "mp_face_male_swim_idle_", "mp_face_male_wall_run_", "mp_factiontable", "mp_ffotd", "mp_freerun_", "mp_freerun_gameover", "mp_freerun_room", "mp_frontend", "mp_frontend_battery", "mp_frontend_enforcer", "mp_frontend_firebreak", "mp_frontend_load_spinner", "mp_frontend_mercenary", "mp_frontend_nomad", "mp_frontend_outrider", "mp_frontend_prophet", "mp_frontend_reaper", "mp_frontend_spectre", "mp_global_intermission", "mp_gunlevels", "mp_havoc", "mp_havoc_d", "mp_hellstorm", "mp_hero_battery_room", "mp_hero_firebreak", "mp_hero_nomad_room", "mp_hero_outrider_room", "mp_hero_prophet_room", "mp_hero_reaper_room", "mp_hero_ruin_room", "mp_hero_seraph_room", "mp_hero_spectre_room", "mp_highlightReelInfoDefines", "mp_highlightReelStarLevels", "mp_infection", "mp_infection_d", "mp_initial", "mp_item_version", "mp_lan", "mp_land", "mp_loadouts", "mp_mantle_over_high", "mp_mantle_over_high_fast", "mp_mantle_over_low", "mp_mantle_over_low_fast", "mp_mantle_over_mid", "mp_mantle_over_mid_fast", "mp_mantle_root", "mp_mantle_up_", "mp_match_record_binary", "mp_metro", "mp_metro_d", "mp_microwaveturret", "mp_mode_heli_height_lock", "mp_nuketown_fs_endingmovie", "mp_nuketown_x", "mp_nuketown_x_d", "mp_obj_captured", "mp_obj_returned", "mp_obj_taken", "mp_on_f_", "mp_online", "mp_patch", "mp_prophet_bg", "mp_prophet_kick", "mp_radiation_high", "mp_radiation_low", "mp_radiation_med", "mp_rankIconTable", "mp_ranktable", "mp_redwood", "mp_redwood_d", "mp_reset_loadouts_offline", "mp_reset_loadouts_online", "mp_reset_stats_offline", "mp_reset_stats_online", "mp_riotshield", "mp_sab_spawn", "mp_sab_spawn_allies", "mp_sab_spawn_allies_start", "mp_sab_spawn_axis", "mp_sab_spawn_axis_start", "mp_sd_spawn", "mp_sd_spawn_attacker", "mp_sd_spawn_defender", "mp_sec", "mp_sector", "mp_sector_", "mp_sector_corridor", "mp_sector_d", "mp_sector_medroom", "mp_sector_objectives", "mp_sector_partial", "mp_spawn_influencers", "mp_spawn_influencers_override", "mp_spire", "mp_spire_d", "mp_statdeltas", "mp_stats", "mp_statsTable", "mp_statscheck", "mp_stronghold", "mp_stronghold_d", "mp_tdm_spawn", "mp_tdm_spawn_allies_start", "mp_tdm_spawn_axis_start", "mp_tdm_spawn_team", "mp_theater", "mp_trm_root", "mp_trophy_system", "mp_twar_spawn", "mp_unlockmapping", "mp_update", "mp_uspawn_influencer", "mp_uspawn_point", "mp_vehicles", "mp_vehicles_agr", "mp_vehicles_dart", "mp_vehicles_mothership", "mp_vehicles_sentinel", "mp_vehicles_turret", "mp_veiled", "mp_veiled_d", "mp_war_objective_lost", "mp_war_objective_neutralized", "mp_war_objective_taken", "mpl_bad_location_select", "mpl_cgunner_flir_off", "mpl_cgunner_flir_on", "mpl_cgunner_nav", "mpl_clone_gadget_loop_npc", "mpl_clone_holo_death", "mpl_crate_enemy_steals", "mpl_crate_friendly_steals", "mpl_death", "mpl_emp_turret_activate", "mpl_emp_turret_deactivate", "mpl_emp_turret_loop_close", "mpl_endmatch", "mpl_final_killcam", "mpl_final_killcam_enter", "mpl_final_killcam_slowdown", "mpl_flag_drop_plr", "mpl_flag_pickup_plr", "mpl_flagcapture_sting_enemy", "mpl_flagcapture_sting_friend", "mpl_flagdrop_sting_enemy", "mpl_flagdrop_sting_friend", "mpl_flagget_sting_enemy", "mpl_flagget_sting_friend", "mpl_flagreturn_sting", "mpl_flashback_disappear_npc", "mpl_flashback_disappear_plr", "mpl_flashback_reappear_npc", "mpl_flashback_reappear_plr", "mpl_good_location_select", "mpl_heatwave_burn_loop", "mpl_hit_alert", "mpl_hit_alert_air", "mpl_hit_alert_armor", "mpl_hit_alert_burn", "mpl_hit_alert_clone", "mpl_hit_alert_escort", "mpl_hit_alert_firefly", "mpl_hit_alert_heatwave", "mpl_hit_alert_hpm", "mpl_hit_alert_taser_spike", "mpl_hit_heli_gunner", "mpl_hk_pullout", "mpl_holoscreen_close_npc", "mpl_holoscreen_close_plr", "mpl_holoscreen_handmove", "mpl_holoscreen_loop_npc", "mpl_holoscreen_loop_plr", "mpl_holoscreen_open_npc", "mpl_holoscreen_open_plr", "mpl_killconfirm_tags_pickup", "mpl_killstreak_", "mpl_killstreak_DRONE_STRIKE", "mpl_killstreak_ai_tank", "mpl_killstreak_auto_turret", "mpl_killstreak_combat_robot", "mpl_killstreak_cruisemissile", "mpl_killstreak_dart_strt", "mpl_killstreak_dogs", "mpl_killstreak_emp_activate", "mpl_killstreak_heli", "mpl_killstreak_m", "mpl_killstreak_minigun", "mpl_killstreak_minigunk", "mpl_killstreak_osprey_strt", "mpl_killstreak_planemortar", "mpl_killstreak_qrdrone", "mpl_killstreak_radar", "mpl_killstreak_raps", "mpl_killstreak_rcbomb", "mpl_killstreak_satellite", "mpl_killstreak_sentinel_strt", "mpl_killstreak_supply", "mpl_killstreak_turret", "mpl_ks_reaper_explosion", "mpl_lightning_bomb_incoming", "mpl_lightning_flyover_boom", "mpl_m_turret_exp", "mpl_microwave_beam_off", "mpl_player_heartbeat", "mpl_plr_emp_activate", "mpl_plr_emp_deactivate", "mpl_plr_emp_looper", "mpl_postmatch", "mpl_prematch", "mpl_rc_exp", "mpl_rejack_suicide", "mpl_rejack_suicide_timeout", "mpl_resurrect_npc", "mpl_supply_crush", "mpl_thunder_flyover_wash", "mpl_thunder_incoming_start", "mpl_turret_alert", "mpl_turret_down", "mpl_turret_startup", "mpl_ui_timer_countdown", "mpl_veh_rc_boost", "name", "near_goal", "near_goal_notify_dist", "net_authPort", "net_dumpprofile", "net_ip", "net_masterServerPort", "net_new_animation", "net_noudp", "net_port", "net_restart", "net_socksEnabled", "net_socksPassword", "net_socksPort", "net_socksServer", "net_socksUsername", "nextmap", "nightVisionDisableEffects", "nightVisionFadeInOutTime", "nightVisionPowerOnTime", "night_vision_off", "night_vision_on", "no_buffer_space", "no_cover", "no_crouch_or_prone", "no_delta", "no_enemy", "no_fly_zone", "no_gfutz", "no_legs", "no_prone", "no_protocol_option", "no_proxy", "no_rating", "no_vehicles", "node_ambush", "node_balcony", "node_concealment_crouch", "node_concealment_prone", "node_concealment_stand", "node_cover_crouch", "node_cover_crouch_window", "node_cover_left", "node_cover_pillar", "node_cover_prone", "node_cover_right", "node_cover_stand", "node_exposed", "node_guard", "node_negotiation_begin", "node_negotiation_end", "node_not_safe", "node_pathnode", "node_reacquire", "node_relinquished", "node_scripted", "node_taken", "node_turret", "normal_nogravity", "normal_shotgun", "num_available_map_packs", "num_channels", "num_consts", "num_frames", "num_kill_distance_entries", "num_lives", "num_speeds_when_moving_entries", "num_spus", "num_stages", "num_threads", "objectiveFontSize", "objectiveTextOffsetY", "objective_a", "objective_add", "objective_all", "objective_allies", "objective_axis", "objective_b", "objective_c", "objective_clearallusing", "objective_clearentity", "objective_clearplayerusing", "objective_delete", "objective_desc", "objective_flipicon", "objective_free", "objective_getgamemodeflags", "objective_hint_", "objective_hint_allies", "objective_hint_axis", "objective_hint_free", "objective_hint_team", "objective_icon", "objective_onentity", "objective_position", "objective_score_", "objective_score_allies", "objective_score_axis", "objective_score_free", "objective_score_team", "objective_set", "objective_setcolor", "objective_setflag", "objective_setgamemodeflags", "objective_seticon", "objective_seticonsize", "objective_setinvisibletoall", "objective_setinvisibletoplayer", "objective_setinvisibletoplayerbyindex", "objective_setplayerusing", "objective_setprogress", "objective_setsize", "objective_setstencil", "objective_setuimodelvalue", "objective_setvisibletoall", "objective_setvisibletoplayer", "objective_setvisibletoplayerbyindex", "objective_state", "objective_team", "objective_time", "objective_visibleteams", "online_cohort_sample_percentage", "onlinegame", "only_cover", "only_stream_visible", "open_briefcase", "open_demo_manage_segments", "open_demo_save_popup", "open_dollycam_marker_options", "open_hud_menu", "open_hud_popup", "open_ingame_menu", "open_ingame_menuk", "open_keyboard_text_field_popup", "open_lid", "open_lightman_marker_options", "open_magwell", "open_main", "open_menu", "open_migration_menu", "open_panels", "open_popup", "open_scoreboard_menu", "open_side_mission_countdown", "open_side_mission_countdownZ", "overrideNVGModelWithKnife", "p2pAuth_allow_steam_p2p", "p2pAuth_self_drop_level", "painVisionLerpOutRate", "painVisionTriggerHealth", "paintExplosionRadius", "partyChatDisallowed", "party_IsLocalClientSelected", "party_P", "party_alternateMapVoteStatus", "party_dlc_only_intended_mappacks", "party_firstSubpartyIndex", "party_followPartyHostOutOfGames", "party_gamesize", "party_gametype", "party_inactiveHeartbeatPeriod", "party_initial_dlc_search_timer", "party_kickplayerquestion", "party_listFocus", "party_lobbyPlayerCount", "party_ma", "party_mak", "party_mapname", "party_mapvote_entrya_mapname", "party_mapvote_entryb_mapname", "party_matchedPlayerCount", "party_matchedpla", "party_matchex", "party_maxPrivatePartyPlayers", "party_maxTeamDiff", "party_maxplayer", "party_maxplayers", "party_membersMissingMapPack", "party_minLobbyTime", "party_minp", "party_minpl", "party_minpla", "party_minplay", "party_minplayers", "party_nextMapVoteStatus", "party_partyPlayerCount", "party_partyPlayerCountNum", "party_playersCoop", "party_playervisible", "party_privacyStatus", "party_randomMapVoteStatus", "party_readypercentrequired", "party_resume_dlc_search_timer", "party_search_for_dlc_content", "party_selectedIndex", "party_selectedIndexChangedTime", "party_size", "party_statusString", "party_teambased", "party_teamsVisible", "party_timer", "partymigrate_broadcast_interval", "partymigrate_cpuBonusPing", "partymigrate_cpuBonusThreshold", "partymigrate_logResults", "partymigrate_makeHostTimeout", "partymigrate_pingtest_active", "partymigrate_pingtest_filterThreshold", "partymigrate_pingtest_minThreshold", "partymigrate_pingtest_retry", "partymigrate_pingtest_timeout", "partymigrate_preferSameHost", "partymigrate_selectiontime", "partymigrate_timeout", "partymigrate_timeoutmax", "partymigrate_uploadtest_minThreshold", "password", "patchManifestUpdateCheckMinutes", "patchManifestUpdateDisabled", "patchSystemDebug", "patchSystemDisabled", "patchmanifestoverride", "patchmanifestversionoverride", "path_corner_curve_angle", "path_corner_curve_distance", "path_prediction_enter_turn_point", "path_prediction_leave_turn_point", "path_prediction_start_point", "path_prediction_status", "path_prediction_travel_vector", "pc_glasscar", "pc_s", "perk_armorPiercingDamage", "perk_armorVest", "perk_armorpiercing", "perk_bulletDamage", "perk_bulletPenetrationMultiplier", "perk_bulletflinch_kills", "perk_deathStreakCountRequired", "perk_delayExplosiveTime", "perk_disarmExplosiveTime", "perk_extendedMagsMGAmmo", "perk_extendedMagsPistolAmmo", "perk_extendedMagsRifleAmmo", "perk_extendedMagsSMGAmmo", "perk_extendedMagsSpreadAmmo", "perk_extraBreath", "perk_fastClimb", "perk_fastSnipeScale", "perk_fastmantle_kills", "perk_fastweaponswitch_kill_after_swap", "perk_fireproof", "perk_flakJacket", "perk_flakJacket_hardcore", "perk_footstepVolumeAlly", "perk_footstepVolumeEnemy", "perk_footstepVolumePlayer", "perk_footstepVolumeSelectiveHearingMin", "perk_gpsjammer_graceperiods", "perk_gpsjammer_immune_kills", "perk_gpsjammer_min_distance", "perk_gpsjammer_min_speed", "perk_gpsjammer_time_period", "perk_hacker_destroy", "perk_healthRegenMultiplier", "perk_immune_cuav_kills", "perk_improvedExtraBreath", "perk_killstreakAnteUpResetValue", "perk_killstreakMomentumMultiplier", "perk_killstreakReduction", "perk_lightWeightViewBobScale", "perk_longersprint", "perk_loudenemies_kills", "perk_movefaster_kills", "perk_noname_kills", "perk_nottargetedbyai_graceperiod", "perk_nottargetedbyai_min_speed", "perk_nottargetedbyairsupport_destroy_aircraft", "perk_nottargetted_graceperiod", "perk_null", "perk_numExtraLethal", "perk_numExtraTactical", "perk_parabolicAngle", "perk_parabolicIcon", "perk_parabolicRadius", "perk_protection_stun_kills", "perk_quickDrawSpeedScale", "perk_quickDrawSpeedScaleSniper", "perk_quieter_kills", "perk_scavengerMode", "perk_scavenger_kills_after_resupply", "perk_score", "perk_sgjammer_graceperiods", "perk_sgjammer_min_distance", "perk_sgjammer_min_speed", "perk_sgjammer_time_period", "perk_sprintMultiplier", "perk_sprintRecoveryMultiplierActual", "perk_sprintRecoveryMultiplierVisual", "perk_tracker_fx_fly_height", "perk_tracker_fx_foot_height", "perk_weapRateMultiplier", "perk_weapReloadMultiplier", "perk_weapSpreadMultiplier", "physVeh_StepsPerFrame", "physVeh_explodeForce", "physVeh_explodeSpinScale", "physVeh_jump", "physVeh_minContactImpulse", "physVeh_minImpactMomentum", "phys_autoDisableLinear", "phys_autoDisableTime", "phys_bulletSpinScale", "phys_bulletUpBias", "phys_dragAngular", "phys_dragLinear", "phys_gjk_collide_jq", "phys_gravity", "phys_gravityChangeWakeupRadius", "phys_gravity_ragdoll", "phys_jitterMaxMass", "phys_jq_constraint_solver", "pickupPrints", "pickup_item", "pickup_items", "pickup_model", "pickup_riotshield", "pickup_vehicle", "ping_bar", "plane_mig", "plane_mortar", "plane_mortar_kill", "plane_rumble", "plane_waypoint", "playListUpdateCheckMinutes", "player_MGUseRadius", "player_bledout", "player_breath_snd_delay", "player_breath_snd_lerp", "player_burstFireCooldown", "player_callout", "player_character", "player_clipSizeMultiplier", "player_corpse", "player_count", "player_damageMultiplier", "player_damage_type", "player_deathInvulnerableTime", "player_deathInvulnerableToMelee", "player_deathInvulnerableToProjectile", "player_debugHealth", "player_default", "player_die", "player_double_grenade", "player_downed", "player_flash_grenade_sp", "player_footstep", "player_frag_grenade_sp", "player_gender", "player_has_red_flashing_overlay", "player_ip", "player_is_invulnerable", "player_jump_start", "player_kicked", "player_looks_away_from_spawner", "player_mantle_over_low", "player_meleeDamageMultiplier", "player_meleeRangeDefault", "player_motorcycle_drive_left_arm", "player_motorcycle_drive_throttle_add", "player_motorcycle_drive_throttle_add_left", "player_motorcycle_drive_throttle_add_right", "player_motorcycle_gun_pullout_root", "player_motorcycle_gun_putaway_root", "player_motorcycle_left_arm", "player_motorcycle_right_arm", "player_motorcycle_shoot_left_arm", "player_radiusDamageMultiplier", "player_revived", "player_scene_animation_skip", "player_scene_skip_completed", "player_shock_fx", "player_spawned", "player_sprintSpeedScale", "player_sprintUnlimited", "player_stunWhiteFlash", "player_sustainAmmo", "player_swimDamage", "player_swimDamagerInterval", "player_swimTime", "player_switch", "player_throwbackInnerRadius", "player_throwbackOuterRadius", "player_turret_bullet_base_anims", "player_useRadius", "player_vtol_drop", "player_xuid", "playercard_cache_download_max_retry_time", "playercard_cache_download_retry_step", "playercard_cache_upload_max_retry_time", "playercard_cache_upload_retry_step", "playercard_cache_validity_life", "playlist", "playlistAggrFilename", "playlistFilename", "playlist_arena", "playlist_arena_champions", "playlist_arena_moshpit", "playlist_ball", "playlist_bonus", "playlist_core", "playlist_ctf", "playlist_demolition", "playlist_domination", "playlist_enabled", "playlist_entry", "playlist_escort", "playlist_ffa", "playlist_gen", "playlist_generic_", "playlist_gungame", "playlist_hardcore", "playlist_image", "playlist_kill_confirm", "playlist_koth", "playlist_leaguematch", "playlist_mercenary", "playlist_name", "playlist_playermatch", "playlist_rules", "playlist_search_destroy", "playlist_solomatch", "playlist_strings", "playlist_tdm", "playlist_war", "pm_C", "pm_flags", "pm_time", "pm_type", "popup_action_title", "popup_fetchstats_failed", "popup_gettingdata", "popup_leavegame", "popup_probation_dashboard_warning", "prestige30EasterEggEnabled", "prestige_max", "prestige_shop_active", "privateMatch_joinPassword", "privateMatch_serverPassword", "probation_deny", "probation_league_enabled", "probation_public_enabled", "probation_version", "probation_violation", "profileMenuOption_blacklevel", "profileMenuOption_hasBeenNotifiedCampaignCompleted", "profileMenuOption_hasUnlockedAll_SP", "profileMenuOption_offensiveContentMode", "profileMenuOption_resumeIsGameCompleted", "profileMenuOption_safeAreaHorz", "profileMenuOption_safeAreaVert", "profileMenuOption_sensitivityPitch", "profileMenuOption_sensitivityYaw", "profileMenuOption_volume", "projectile_alertattractor", "projectile_applyattractor", "projectile_bounced", "projectile_cbu", "projectile_dud", "projectile_hellfire_missile", "projectile_impact", "projectile_impact_alert_distance", "projectile_impact_default_distance", "projectile_impact_default_height", "projectile_impact_explode", "projectile_impact_player", "projectile_m", "projectile_ping", "projectile_ping_alert_distance", "projectile_ping_default_distance", "projectile_rus_molotov_grenade", "projectile_s", "projectile_stinger_missile", "projectile_t", "prone_back", "prone_front", "prone_pistol", "protocol", "pt_AliensReadyUpPrivateInUse", "pt_AliensReadyUpPublicInUse", "pt_AliensReadyUpPublicStartTimerLength", "pt_annihilator_crouch_fire", "pt_annihilator_crouch_fire_ads", "pt_annihilator_prone_fire", "pt_annihilator_prone_fire_ads", "pt_annihilator_stand_fire", "pt_annihilator_stand_fire_ads", "pt_arm_blade_crouch_melee_miss", "pt_arm_blade_prone_melee_miss", "pt_arm_blade_stand_melee_miss", "pt_arm_blade_wall_run_melee_miss_l", "pt_arm_blade_wall_run_melee_miss_r", "pt_b_knife_crouch_fire", "pt_b_knife_crouch_melee", "pt_b_knife_crouch_melee_stick", "pt_b_knife_crouch_reload", "pt_b_knife_prone_fire", "pt_b_knife_prone_melee", "pt_b_knife_prone_reload", "pt_b_knife_stand_fire", "pt_b_knife_stand_firstraise", "pt_b_knife_stand_melee", "pt_b_knife_stand_melee_stick", "pt_b_knife_stand_reload", "pt_backoutOnClientPresence", "pt_ball_crouch_uplink_melee", "pt_ball_prone_uplink_melee", "pt_ball_stand_uplink_melee", "pt_ball_stand_uplink_throw", "pt_barehands_crouch_chain_miss", "pt_barehands_prone_chain_miss", "pt_barehands_stand_chain_miss", "pt_bow_crouch_concussed_loop", "pt_bow_crouch_fire_enter", "pt_bow_crouch_fire_exit", "pt_bow_crouch_fire_loop", "pt_bow_crouch_flashed_loop", "pt_bow_crouch_flinch_b", "pt_bow_crouch_flinch_f", "pt_bow_crouch_flinch_l", "pt_bow_crouch_flinch_r", "pt_bow_crouch_melee", "pt_bow_crouch_putaway", "pt_bow_crouch_raise", "pt_bow_crouch_shellshock", "pt_bow_crouch_shocked_loop", "pt_bow_prone_concussed_loop", "pt_bow_prone_fire_enter", "pt_bow_prone_fire_exit", "pt_bow_prone_fire_loop", "pt_bow_prone_flashed_loop", "pt_bow_prone_flinch_b", "pt_bow_prone_flinch_f", "pt_bow_prone_flinch_l", "pt_bow_prone_flinch_r", "pt_bow_prone_melee", "pt_bow_prone_putaway", "pt_bow_prone_raise", "pt_bow_prone_shellshock", "pt_bow_prone_shocked_loop", "pt_bow_sprint_putaway", "pt_bow_sprint_raise", "pt_bow_stand_concussed_loop", "pt_bow_stand_fire_enter", "pt_bow_stand_fire_exit", "pt_bow_stand_fire_loop", "pt_bow_stand_firstraise", "pt_bow_stand_flashed_loop", "pt_bow_stand_flinch_b", "pt_bow_stand_flinch_f", "pt_bow_stand_flinch_l", "pt_bow_stand_flinch_r", "pt_bow_stand_melee", "pt_bow_stand_putaway", "pt_bow_stand_raise", "pt_bow_stand_shellshock", "pt_bow_stand_shocked_loop", "pt_bow_swim_fire_enter", "pt_bow_swim_fire_exit", "pt_bow_swim_fire_loop", "pt_bow_swim_fire_over_enter", "pt_bow_swim_fire_over_exit", "pt_bow_swim_fire_over_loop", "pt_bow_swim_flinch", "pt_bow_swim_flinch_over", "pt_bow_swim_gunbutt", "pt_bow_swim_gunbutt_over", "pt_bow_swim_putaway", "pt_bow_swim_putaway_over", "pt_bow_swim_raise", "pt_bow_swim_raise_over", "pt_bow_wall_run_fire_enter_l", "pt_bow_wall_run_fire_enter_r", "pt_bow_wall_run_fire_exit_l", "pt_bow_wall_run_fire_exit_r", "pt_bow_wall_run_fire_loop_l", "pt_bow_wall_run_fire_loop_r", "pt_bow_wall_run_melee_gunbutt_l", "pt_bow_wall_run_melee_gunbutt_r", "pt_bow_wall_run_putaway_l", "pt_bow_wall_run_putaway_r", "pt_bow_wall_run_raise_l", "pt_bow_wall_run_raise_r", "pt_brawler_crouch_melee_swipe", "pt_brawler_crouch_melee_swipe_l", "pt_brawler_fem_crouch_melee_swipe", "pt_brawler_fem_prone_melee_swipe", "pt_brawler_fem_prone_putaway", "pt_brawler_fem_prone_raise", "pt_brawler_fem_stand_melee_swipe", "pt_brawler_prone_melee_swipe", "pt_brawler_prone_melee_swipe_l", "pt_brawler_prone_putaway", "pt_brawler_prone_raise", "pt_brawler_sprint_putaway", "pt_brawler_sprint_raise", "pt_brawler_stand_firstraise", "pt_brawler_stand_melee_swipe", "pt_brawler_stand_melee_swipe_l", "pt_brawler_stand_putaway", "pt_brawler_stand_raise", "pt_brawler_stand_shellshock", "pt_brawler_swim_melee_swipe_l", "pt_brawler_swim_over_melee_swipe_l", "pt_brawler_wall_run_putaway_l", "pt_brawler_wall_run_putaway_r", "pt_brawler_wall_run_raise_l", "pt_brawler_wall_run_raise_r", "pt_briefcase_crouch_armed", "pt_briefcase_crouch_defused", "pt_briefcase_crouch_pullout", "pt_briefcase_crouch_putaway", "pt_briefcase_prone_armed", "pt_briefcase_prone_defused", "pt_briefcase_prone_pullout", "pt_briefcase_prone_putaway", "pt_briefcase_stand_armed", "pt_briefcase_stand_defused", "pt_briefcase_stand_pullout", "pt_briefcase_stand_putaway", "pt_chicken_dance", "pt_chicken_dance_crouch", "pt_connectAttempts", "pt_connectTimeout", "pt_crouch_flinch_back", "pt_crouch_flinch_grenade_back", "pt_crouch_flinch_grenade_left", "pt_crouch_flinch_grenade_right", "pt_crouch_flinch_left", "pt_crouch_flinch_pistol_back", "pt_crouch_flinch_pistol_forward", "pt_crouch_flinch_pistol_left", "pt_crouch_flinch_pistol_right", "pt_crouch_flinch_right", "pt_crouch_shoot", "pt_crouch_shoot_ads", "pt_crouch_shoot_ads_pistol", "pt_crouch_shoot_auto", "pt_crouch_shoot_auto_ads", "pt_crouch_shoot_pistol", "pt_dw_crouch_botharms_fire", "pt_dw_crouch_botharms_reload", "pt_dw_crouch_flinch_back", "pt_dw_crouch_flinch_left", "pt_dw_crouch_flinch_right", "pt_dw_crouch_melee_gunbutt", "pt_dw_crouch_putaway", "pt_dw_crouch_raise", "pt_dw_prone_botharms_fire", "pt_dw_prone_botharms_reload", "pt_dw_prone_flinch_back", "pt_dw_prone_flinch_forward", "pt_dw_prone_flinch_left", "pt_dw_prone_flinch_right", "pt_dw_prone_melee", "pt_dw_prone_melee_gunbutt", "pt_dw_prone_putaway", "pt_dw_prone_raise", "pt_dw_sprint_fire", "pt_dw_sprint_putaway", "pt_dw_sprint_raise", "pt_dw_sprint_reload", "pt_dw_stand_botharms_fire", "pt_dw_stand_botharms_reload", "pt_dw_stand_firstraise", "pt_dw_stand_flinch_back", "pt_dw_stand_flinch_forward", "pt_dw_stand_flinch_left", "pt_dw_stand_flinch_right", "pt_dw_stand_full_pullout", "pt_dw_stand_full_putaway", "pt_dw_stand_melee_gunbutt", "pt_dw_stand_melee_stick", "pt_dw_stand_melee_swipe", "pt_dw_swim_fire", "pt_dw_swim_fire_over", "pt_dw_swim_flinch", "pt_dw_swim_flinch_over", "pt_dw_swim_melee_gunbutt", "pt_dw_swim_melee_gunbutt_over", "pt_dw_swim_putaway", "pt_dw_swim_putaway_over", "pt_dw_swim_raise", "pt_dw_swim_raise_over", "pt_dw_swim_reload", "pt_dw_swim_reload_over", "pt_dw_wall_run_putaway_l", "pt_dw_wall_run_putaway_r", "pt_dw_wall_run_raise_l", "pt_dw_wall_run_raise_r", "pt_dw_wall_run_reload_l", "pt_dw_wall_run_reload_r", "pt_gameStartTimerLength", "pt_grenade_crouch_prime", "pt_grenade_crouch_throw", "pt_grenade_prone_prime", "pt_grenade_prone_throw", "pt_grenade_stand_prime", "pt_grenade_stand_throw", "pt_grenade_swim_idle_flinch_f", "pt_grenade_swim_idle_flinch_over_f", "pt_grenade_swim_move_flinch_f", "pt_grenade_swim_move_flinch_over_f", "pt_grenade_swim_prime", "pt_grenade_swim_prime_over", "pt_grenade_swim_putaway", "pt_grenade_swim_putaway_over", "pt_grenade_swim_raise", "pt_grenade_swim_raise_over", "pt_grenade_swim_throw", "pt_grenade_swim_throw_over", "pt_grenade_wall_run_prime_l", "pt_grenade_wall_run_prime_r", "pt_grenade_wall_run_throw_l", "pt_grenade_wall_run_throw_r", "pt_gumball_crouch_eat", "pt_gumball_prone_eat", "pt_gumball_stand_eat", "pt_gunslinger_stand_firstraise", "pt_hold_crouch_flinch_back", "pt_hold_crouch_flinch_left", "pt_hold_crouch_flinch_right", "pt_hold_crouch_throw", "pt_hold_melee_prone", "pt_hold_prone_flinch_back", "pt_hold_prone_flinch_left", "pt_hold_prone_flinch_right", "pt_hold_prone_throw", "pt_hold_stand_flinch_back", "pt_hold_stand_flinch_forward", "pt_hold_stand_flinch_left", "pt_hold_stand_flinch_right", "pt_hold_stand_putaway", "pt_hold_stand_raise", "pt_hold_stand_throw", "pt_hold_swim_idle_flinch", "pt_hold_swim_idle_flinch_over_f", "pt_hold_swim_melee_over", "pt_hold_swim_melee_swipe", "pt_hold_swim_putaway", "pt_hold_swim_putaway_over", "pt_hold_swim_raise", "pt_hold_swim_raise_over", "pt_hold_swim_throw", "pt_hold_swim_throw_over", "pt_hold_throw", "pt_hold_wall_run_putaway_l", "pt_hold_wall_run_putaway_r", "pt_hold_wall_run_raise_l", "pt_hold_wall_run_raise_r", "pt_hold_wall_run_throw_l", "pt_hold_wall_run_throw_r", "pt_judge_crouch_reload", "pt_judge_prone_reload", "pt_judge_stand_firstraise", "pt_judge_stand_reload", "pt_knife_crouch_flinch_back", "pt_knife_crouch_flinch_forward", "pt_knife_crouch_flinch_left", "pt_knife_crouch_flinch_right", "pt_knife_crouch_melee_swipe", "pt_knife_crouch_melee_thrust", "pt_knife_crouch_putaway", "pt_knife_crouch_putaway_lowready", "pt_knife_crouch_raise", "pt_knife_crouch_raise_lowready", "pt_knife_fem_crouch_melee_swipe", "pt_knife_fem_stand_melee_swipe", "pt_knife_fem_stand_thrust", "pt_knife_prone_flinch_back", "pt_knife_prone_flinch_forward", "pt_knife_prone_flinch_left", "pt_knife_prone_flinch_right", "pt_knife_prone_melee_swipe", "pt_knife_prone_putaway", "pt_knife_prone_raise", "pt_knife_sprint_putaway", "pt_knife_sprint_raise", "pt_knife_stand_firstraise", "pt_knife_stand_flinch_back", "pt_knife_stand_flinch_forward", "pt_knife_stand_flinch_left", "pt_knife_stand_flinch_right", "pt_knife_stand_melee_swipe", "pt_knife_stand_melee_thrust", "pt_knife_stand_putaway", "pt_knife_stand_putaway_lowready", "pt_knife_stand_raise", "pt_knife_stand_raise_lowready", "pt_knife_swim_idle_flinch_f", "pt_knife_swim_idle_flinch_over_f", "pt_knife_swim_melee_swipe", "pt_knife_swim_melee_swipe_over", "pt_knife_swim_move_flinch_f", "pt_knife_swim_move_flinch_over_f", "pt_knife_swim_putaway", "pt_knife_swim_putaway_over", "pt_knife_swim_raise", "pt_knife_swim_raise_over", "pt_knife_wall_run_putaway_l", "pt_knife_wall_run_putaway_r", "pt_knife_wall_run_raise_l", "pt_knife_wall_run_raise_r", "pt_laststand_fire", "pt_laststand_melee_swipe", "pt_laststand_putaway", "pt_laststand_raise", "pt_laststand_reload", "pt_launcher_crouch_concussed_loop", "pt_launcher_crouch_fire", "pt_launcher_crouch_fire_ads", "pt_launcher_crouch_flashed_loop", "pt_launcher_crouch_flinch_b", "pt_launcher_crouch_flinch_f", "pt_launcher_crouch_flinch_l", "pt_launcher_crouch_flinch_r", "pt_launcher_crouch_melee", "pt_launcher_crouch_putaway", "pt_launcher_crouch_putaway_lowready", "pt_launcher_crouch_raise", "pt_launcher_crouch_raise_lowready", "pt_launcher_crouch_reload", "pt_launcher_crouch_shellshock", "pt_launcher_crouch_shocked_loop", "pt_launcher_lockon_crouch_reload", "pt_launcher_lockon_prone_reload", "pt_launcher_lockon_stand_reload", "pt_launcher_prone_concussed_loop", "pt_launcher_prone_fire", "pt_launcher_prone_fire_ads", "pt_launcher_prone_flashed_loop", "pt_launcher_prone_flinch_b", "pt_launcher_prone_flinch_f", "pt_launcher_prone_flinch_l", "pt_launcher_prone_flinch_r", "pt_launcher_prone_melee", "pt_launcher_prone_putaway", "pt_launcher_prone_raise", "pt_launcher_prone_reload", "pt_launcher_prone_shellshock", "pt_launcher_prone_shocked_loop", "pt_launcher_sprint_putaway", "pt_launcher_sprint_raise", "pt_launcher_sprint_reload", "pt_launcher_stand_concussed_loop", "pt_launcher_stand_fire", "pt_launcher_stand_fire_ads", "pt_launcher_stand_firstraise", "pt_launcher_stand_flashed_loop", "pt_launcher_stand_flinch_b", "pt_launcher_stand_flinch_f", "pt_launcher_stand_flinch_l", "pt_launcher_stand_flinch_r", "pt_launcher_stand_melee", "pt_launcher_stand_putaway", "pt_launcher_stand_putaway_lowready", "pt_launcher_stand_raise", "pt_launcher_stand_raise_lowready", "pt_launcher_stand_reload", "pt_launcher_stand_shellshock", "pt_launcher_stand_shocked_loop", "pt_launcher_swim_flinch", "pt_launcher_swim_flinch_over", "pt_launcher_swim_gunbutt", "pt_launcher_swim_gunbutt_over", "pt_launcher_swim_idle_ads", "pt_launcher_swim_idle_ads_over", "pt_launcher_swim_putaway", "pt_launcher_swim_putaway_over", "pt_launcher_swim_raise", "pt_launcher_swim_raise_over", "pt_launcher_swim_reload", "pt_launcher_swim_reload_over", "pt_launcher_wall_run_melee_gunbutt_l", "pt_launcher_wall_run_melee_gunbutt_r", "pt_launcher_wall_run_putaway_l", "pt_launcher_wall_run_putaway_r", "pt_launcher_wall_run_raise_l", "pt_launcher_wall_run_raise_r", "pt_launcher_wall_run_reload_l", "pt_launcher_wall_run_reload_r", "pt_lmg_crouch_reload", "pt_lmg_fem_crouch_reload", "pt_lmg_fem_prone_reload", "pt_lmg_fem_stand_firstraise", "pt_lmg_fem_stand_reload", "pt_lmg_prone_reload", "pt_lmg_stand_firstraise", "pt_lmg_stand_reload", "pt_lmg_swim_reload", "pt_lmg_swim_reload_over", "pt_logHostSelectionChance", "pt_melee_crouch_left", "pt_melee_hold_", "pt_melee_pistol_", "pt_melee_prone", "pt_melee_prone_pistol", "pt_melee_right", "pt_memberTimeout", "pt_migrateBeforeAdvertise", "pt_migrationBandwidthBonusPing", "pt_migrationBandwidthBonusThreshold", "pt_migrationCPUWeight", "pt_migrationNotInstalledWeight", "pt_migrationPingBad", "pt_migrationPingWeight", "pt_migrationQuitsBad", "pt_migrationQuitsWeight", "pt_migrationRAMWeight", "pt_migrationThreshold", "pt_migrationUploadBad", "pt_migrationUploadWeight", "pt_migrationWifiPenalty", "pt_minigun_crouch_fire", "pt_minigun_crouch_putaway", "pt_minigun_crouch_raise", "pt_minigun_crouch_reload", "pt_minigun_stand_fire", "pt_minigun_stand_firstraise", "pt_minigun_stand_putaway", "pt_minigun_stand_raise", "pt_minigun_stand_reload", "pt_perkacola_crouch_drink", "pt_perkacola_fem_stand_drink", "pt_perkacola_prone_drink", "pt_perkacola_stand_drink", "pt_pistol_", "pt_pistol_crouch_putaway", "pt_pistol_crouch_putaway_lowready", "pt_pistol_crouch_raise", "pt_pistol_crouch_raise_lowready", "pt_pistol_crouch_reload_partial", "pt_pistol_fem_crouch_fire", "pt_pistol_fem_crouch_fire_ads", "pt_pistol_fem_crouch_flinch_b", "pt_pistol_fem_crouch_flinch_f", "pt_pistol_fem_crouch_flinch_l", "pt_pistol_fem_crouch_flinch_r", "pt_pistol_fem_crouch_putaway", "pt_pistol_fem_crouch_raise", "pt_pistol_fem_crouch_reload", "pt_pistol_fem_crouch_reload_partial", "pt_pistol_fem_prone_fire", "pt_pistol_fem_prone_fire_ads", "pt_pistol_fem_prone_melee", "pt_pistol_fem_prone_putaway", "pt_pistol_fem_prone_raise", "pt_pistol_fem_prone_reload", "pt_pistol_fem_prone_reload_partial", "pt_pistol_fem_sprint_putaway", "pt_pistol_fem_sprint_raise", "pt_pistol_fem_sprint_reload", "pt_pistol_fem_sprint_reload_partial", "pt_pistol_fem_stand_fire", "pt_pistol_fem_stand_fire_ads", "pt_pistol_fem_stand_firstraise", "pt_pistol_fem_stand_flinch_b", "pt_pistol_fem_stand_flinch_f", "pt_pistol_fem_stand_flinch_l", "pt_pistol_fem_stand_flinch_r", "pt_pistol_fem_stand_melee_gunbutt", "pt_pistol_fem_stand_melee_gunbutt_strike", "pt_pistol_fem_stand_putaway", "pt_pistol_fem_stand_reload", "pt_pistol_fem_stand_reload_partial", "pt_pistol_fem_stand_shellshock", "pt_pistol_fem_wall_run_putaway_l", "pt_pistol_fem_wall_run_putaway_r", "pt_pistol_fem_wall_run_raise_l", "pt_pistol_fem_wall_run_raise_r", "pt_pistol_fem_wall_run_reload_l", "pt_pistol_fem_wall_run_reload_l_partial", "pt_pistol_fem_wall_run_reload_r", "pt_pistol_fem_wall_run_reload_r_partial", "pt_pistol_prone_putaway", "pt_pistol_prone_raise", "pt_pistol_prone_reload_partial", "pt_pistol_sprint_putaway", "pt_pistol_sprint_raise", "pt_pistol_sprint_reload", "pt_pistol_sprint_reload_partial", "pt_pistol_stand_firstraise", "pt_pistol_stand_melee_gunbutt_strike", "pt_pistol_stand_putaway", "pt_pistol_stand_putaway_lowready", "pt_pistol_stand_raise", "pt_pistol_stand_raise_lowready", "pt_pistol_stand_reload_partial", "pt_pistol_swim_idle_flinch_f", "pt_pistol_swim_idle_flinch_over_f", "pt_pistol_swim_melee_gunbutt", "pt_pistol_swim_melee_gunbutt_over", "pt_pistol_swim_move_flinch_f", "pt_pistol_swim_move_flinch_over_f", "pt_pistol_swim_putaway", "pt_pistol_swim_putaway_over", "pt_pistol_swim_raise", "pt_pistol_swim_raise_over", "pt_pistol_swim_reload", "pt_pistol_swim_reload_over", "pt_pistol_swim_reload_over_partial", "pt_pistol_swim_reload_partial", "pt_pistol_wall_run_putaway_l", "pt_pistol_wall_run_putaway_r", "pt_pistol_wall_run_raise_l", "pt_pistol_wall_run_raise_r", "pt_pistol_wall_run_reload_l_partial", "pt_pistol_wall_run_reload_r_partial", "pt_pregameStartTimerLength", "pt_prone_ads_shoot", "pt_prone_ads_shoot_auto", "pt_prone_ads_shoot_pistol", "pt_prone_flinch_back", "pt_prone_flinch_grenade_back", "pt_prone_flinch_grenade_forward", "pt_prone_flinch_grenade_left", "pt_prone_flinch_grenade_right", "pt_prone_flinch_left", "pt_prone_flinch_pistol_back", "pt_prone_flinch_pistol_forward", "pt_prone_flinch_pistol_left", "pt_prone_flinch_pistol_right", "pt_prone_flinch_right", "pt_prone_shoot", "pt_prone_shoot_auto", "pt_prone_shoot_pistol", "pt_putaway", "pt_qosTimeout", "pt_radio_crouch_putaway", "pt_radio_crouch_raise", "pt_radio_prone_putaway", "pt_radio_prone_raise", "pt_radio_stand_putaway", "pt_radio_stand_raise", "pt_reaper_crouch_concussed_loop", "pt_reaper_crouch_fire", "pt_reaper_crouch_fire_ads", "pt_reaper_crouch_melee", "pt_reaper_crouch_putaway", "pt_reaper_crouch_raise", "pt_reaper_crouch_shellshock", "pt_reaper_crouch_shocked_loop", "pt_reaper_prone_fire", "pt_reaper_prone_fire_ads", "pt_reaper_prone_melee", "pt_reaper_prone_putaway", "pt_reaper_prone_raise", "pt_reaper_prone_shellshock", "pt_reaper_sprint_putaway", "pt_reaper_sprint_raise", "pt_reaper_stand_fire", "pt_reaper_stand_fire_ads", "pt_reaper_stand_firstraise", "pt_reaper_stand_melee", "pt_reaper_stand_putaway", "pt_reaper_stand_raise", "pt_reaper_stand_shellshock", "pt_reaper_stand_shocked_loop", "pt_reaper_swim_flinch", "pt_reaper_swim_flinch_over", "pt_reaper_swim_gunbutt", "pt_reaper_swim_gunbutt_over", "pt_reaper_swim_idle_ads", "pt_reaper_swim_idle_ads_over", "pt_reaper_swim_putaway", "pt_reaper_swim_putaway_over", "pt_reaper_swim_raise", "pt_reaper_swim_raise_over", "pt_reload_crouch_pistol", "pt_reload_crouch_rifle", "pt_reload_crouchwalk", "pt_reload_crouchwalk_pistol", "pt_reload_prone_auto", "pt_reload_prone_pistol", "pt_reload_stand_auto", "pt_reload_stand_auto_mp", "pt_reload_stand_pistol", "pt_reload_stand_rifle", "pt_reservedCommittedSlotTime", "pt_reservedJoiningSlotTime", "pt_revolver_crouch_reload", "pt_revolver_prone_reload", "pt_revolver_stand_reload", "pt_rifle_crouch_concussed_loop", "pt_rifle_crouch_cyber_activate", "pt_rifle_crouch_flashed_loop", "pt_rifle_crouch_knife_swipe", "pt_rifle_crouch_putaway", "pt_rifle_crouch_putaway_lowready", "pt_rifle_crouch_raise", "pt_rifle_crouch_raise_lowready", "pt_rifle_crouch_reload_gl", "pt_rifle_crouch_reload_handleclip", "pt_rifle_crouch_reload_handleclip_partial", "pt_rifle_crouch_reload_partial", "pt_rifle_crouch_reload_rearclip", "pt_rifle_crouch_reload_rearclip_partial", "pt_rifle_crouch_reload_sideclip", "pt_rifle_crouch_reload_sideclip_partial", "pt_rifle_crouch_remote_hack_in", "pt_rifle_crouch_remote_hack_loop", "pt_rifle_crouch_remote_hack_out", "pt_rifle_crouch_revive_cp", "pt_rifle_crouch_shocked_loop", "pt_rifle_fem_crouch_fire", "pt_rifle_fem_crouch_fire_ads", "pt_rifle_fem_crouch_melee_gunbutt_swipe", "pt_rifle_fem_crouch_putaway", "pt_rifle_fem_crouch_raise", "pt_rifle_fem_crouch_reload", "pt_rifle_fem_crouch_reload_handleclip", "pt_rifle_fem_crouch_reload_handleclip_partial", "pt_rifle_fem_crouch_reload_partial", "pt_rifle_fem_crouch_reload_rearclip", "pt_rifle_fem_crouch_reload_rearclip_partial", "pt_rifle_fem_crouch_shellshock", "pt_rifle_fem_crouch_shoot_auto", "pt_rifle_fem_crouch_shoot_auto_ads", "pt_rifle_fem_prone_fire", "pt_rifle_fem_prone_fire_ads", "pt_rifle_fem_prone_melee_gunbutt", "pt_rifle_fem_prone_putaway", "pt_rifle_fem_prone_raise", "pt_rifle_fem_prone_reload", "pt_rifle_fem_prone_reload_handleclip", "pt_rifle_fem_prone_reload_handleclip_partial", "pt_rifle_fem_prone_reload_partial", "pt_rifle_fem_prone_reload_rearclip", "pt_rifle_fem_prone_reload_rearclip_partial", "pt_rifle_fem_prone_shellshock", "pt_rifle_fem_prone_shoot_auto", "pt_rifle_fem_prone_shoot_auto_ads", "pt_rifle_fem_sprint_putaway", "pt_rifle_fem_sprint_raise", "pt_rifle_fem_sprint_reload", "pt_rifle_fem_sprint_reload_partial", "pt_rifle_fem_stand_fire", "pt_rifle_fem_stand_fire_ads", "pt_rifle_fem_stand_firstraise", "pt_rifle_fem_stand_gunbutt_melee_strike", "pt_rifle_fem_stand_gunbutt_melee_swipe", "pt_rifle_fem_stand_putaway", "pt_rifle_fem_stand_raise", "pt_rifle_fem_stand_reload", "pt_rifle_fem_stand_reload_handleclip", "pt_rifle_fem_stand_reload_handleclip_partial", "pt_rifle_fem_stand_reload_partial", "pt_rifle_fem_stand_reload_rearclip", "pt_rifle_fem_stand_reload_rearclip_partial", "pt_rifle_fem_stand_shellshock", "pt_rifle_fem_stand_shoot_auto", "pt_rifle_fem_stand_shoot_auto_ads", "pt_rifle_fem_wall_run_l_reload", "pt_rifle_fem_wall_run_l_reload_partial", "pt_rifle_fem_wall_run_putaway_l", "pt_rifle_fem_wall_run_putaway_r", "pt_rifle_fem_wall_run_r_reload", "pt_rifle_fem_wall_run_r_reload_partial", "pt_rifle_fem_wall_run_raise_l", "pt_rifle_fem_wall_run_raise_r", "pt_rifle_fire", "pt_rifle_fire_ads", "pt_rifle_fire_prone", "pt_rifle_prone_concussed_loop", "pt_rifle_prone_cyber_activate", "pt_rifle_prone_flashed_loop", "pt_rifle_prone_knife_swipe", "pt_rifle_prone_putaway", "pt_rifle_prone_raise", "pt_rifle_prone_reload_gl", "pt_rifle_prone_reload_handleclip", "pt_rifle_prone_reload_handleclip_partial", "pt_rifle_prone_reload_partial", "pt_rifle_prone_reload_rearclip", "pt_rifle_prone_reload_rearclip_partial", "pt_rifle_prone_reload_sideclip", "pt_rifle_prone_reload_sideclip_partial", "pt_rifle_prone_revive_cp", "pt_rifle_prone_shocked_loop", "pt_rifle_sprint_putaway", "pt_rifle_sprint_raise", "pt_rifle_sprint_reload", "pt_rifle_sprint_reload_handleclip", "pt_rifle_sprint_reload_partial", "pt_rifle_sprint_reload_rearclip", "pt_rifle_sprint_reload_rearclip_partial", "pt_rifle_sprint_reload_shotgun", "pt_rifle_stand_concussed_loop", "pt_rifle_stand_cyber_activate", "pt_rifle_stand_firstraise", "pt_rifle_stand_firstraise_r_bolt", "pt_rifle_stand_flashed_loop", "pt_rifle_stand_knife_swipe", "pt_rifle_stand_melee_gunbutt_strike", "pt_rifle_stand_putaway", "pt_rifle_stand_putaway_lowready", "pt_rifle_stand_raise", "pt_rifle_stand_raise_lowready", "pt_rifle_stand_reload_gl", "pt_rifle_stand_reload_handleclip", "pt_rifle_stand_reload_handleclip_partial", "pt_rifle_stand_reload_partial", "pt_rifle_stand_reload_rearclip", "pt_rifle_stand_reload_rearclip_partial", "pt_rifle_stand_reload_sideclip", "pt_rifle_stand_reload_sideclip_partial", "pt_rifle_stand_remote_hack_in", "pt_rifle_stand_remote_hack_loop", "pt_rifle_stand_remote_hack_out", "pt_rifle_stand_revive_cp", "pt_rifle_stand_shocked_loop", "pt_rifle_swim_idle_ads", "pt_rifle_swim_idle_ads_over", "pt_rifle_swim_idle_flinch_f", "pt_rifle_swim_idle_flinch_over_f", "pt_rifle_swim_idle_gunbutt_melee", "pt_rifle_swim_idle_gunbutt_over", "pt_rifle_swim_move_flinch_f", "pt_rifle_swim_move_flinch_over_f", "pt_rifle_swim_putaway", "pt_rifle_swim_putaway_over", "pt_rifle_swim_raise", "pt_rifle_swim_raise_over", "pt_rifle_swim_reload", "pt_rifle_swim_reload_over", "pt_rifle_swim_reload_over_partial", "pt_rifle_swim_reload_partial", "pt_rifle_wall_run_putaway_l", "pt_rifle_wall_run_putaway_r", "pt_rifle_wall_run_raise_l", "pt_rifle_wall_run_raise_r", "pt_rifle_wall_run_reload_handleclip_l", "pt_rifle_wall_run_reload_handleclip_l_partial", "pt_rifle_wall_run_reload_handleclip_r", "pt_rifle_wall_run_reload_handleclip_r_partial", "pt_rifle_wall_run_reload_l", "pt_rifle_wall_run_reload_l_partial", "pt_rifle_wall_run_reload_r", "pt_rifle_wall_run_reload_r_partial", "pt_rifle_wall_run_reload_rearclip_l", "pt_rifle_wall_run_reload_rearclip_r", "pt_rifle_wall_run_reload_shotgun_l", "pt_rifle_wall_run_reload_shotgun_r", "pt_riot_stand_firstraise", "pt_riotshield_crouch_deploy_fire", "pt_riotshield_crouch_putaway", "pt_riotshield_crouch_raise", "pt_riotshield_stand_deploy_fire", "pt_riotshield_stand_melee", "pt_riotshield_stand_putaway", "pt_riotshield_stand_raise", "pt_satchel_prone_putaway", "pt_satchel_prone_raise", "pt_searchConnectAttempts", "pt_searchPauseTime", "pt_searchRandomDelay", "pt_searchResultsLifetime", "pt_searchResultsMin", "pt_shock_charge_crouch_throw", "pt_shock_charge_prone_throw", "pt_shock_charge_stand_throw", "pt_shot_crouch_reload", "pt_shot_prone_reload", "pt_shot_stand_firstraise", "pt_shot_stand_reload", "pt_shotgun_crouch_reload_empty", "pt_shotgun_precision_crouch_reload", "pt_shotgun_precision_crouch_shoot", "pt_shotgun_precision_prone_reload", "pt_shotgun_precision_prone_shoot", "pt_shotgun_precision_stand_reload", "pt_shotgun_precision_stand_shoot", "pt_shotgun_prone_reload_empty", "pt_shotgun_stand_reload_empty", "pt_smg_crouch_capacity_reload", "pt_smg_crouch_capacity_reload_partial", "pt_smg_fem_stand_firstraise", "pt_smg_prone_capacity_reload", "pt_smg_prone_capacity_reload_partial", "pt_smg_stand_capacity_reload", "pt_smg_stand_capacity_reload_partial", "pt_smg_stand_firstraise", "pt_sniper_crouch_fire_ads_bolt", "pt_sniper_crouch_fire_bolt", "pt_sniper_fastbolt_crouch_reload_base", "pt_sniper_fastbolt_prone_reload_base", "pt_sniper_fastbolt_stand_reload_base", "pt_sniper_prone_fire_ads_bolt", "pt_sniper_prone_fire_bolt", "pt_sniper_stand_fire_ads_bolt", "pt_sniper_stand_fire_bolt", "pt_sniper_stand_firstraise", "pt_spike_launcher_crouch_putaway", "pt_spike_launcher_crouch_raise", "pt_spike_launcher_crouch_reload", "pt_spike_launcher_crouch_shellshock", "pt_spike_launcher_sprint_putaway", "pt_spike_launcher_sprint_raise", "pt_spike_launcher_sprint_reload", "pt_spike_launcher_stand_fire", "pt_spike_launcher_stand_firstraise", "pt_spike_launcher_stand_putaway", "pt_spike_launcher_stand_raise", "pt_spike_launcher_stand_reload", "pt_spike_launcher_stand_shellshock", "pt_spike_launcher_wall_run_putaway_l", "pt_spike_launcher_wall_run_putaway_r", "pt_spike_launcher_wall_run_raise_l", "pt_spike_launcher_wall_run_raise_r", "pt_spike_launcher_wall_run_reload_l", "pt_spike_launcher_wall_run_reload_r", "pt_stand_flinch_back", "pt_stand_flinch_forward", "pt_stand_flinch_grenade_back", "pt_stand_flinch_grenade_forward", "pt_stand_flinch_grenade_left", "pt_stand_flinch_grenade_right", "pt_stand_flinch_left", "pt_stand_flinch_pistol_back", "pt_stand_flinch_pistol_forward", "pt_stand_flinch_pistol_left", "pt_stand_flinch_pistol_right", "pt_stand_flinch_right", "pt_stand_shoot", "pt_stand_shoot_ads", "pt_stand_shoot_ads_pistol", "pt_stand_shoot_auto", "pt_stand_shoot_auto_ads", "pt_stand_shoot_pistol", "pt_stand_shoot_shotgun", "pt_stillConnectingWaitTime", "pt_supply_drop_crouch_putaway", "pt_supply_drop_crouch_raise", "pt_supply_drop_prone_putaway", "pt_supply_drop_prone_raise", "pt_supply_drop_sprint_putaway", "pt_supply_drop_stand_firstraise", "pt_supply_drop_stand_putaway", "pt_supply_drop_stand_raise", "pt_supply_drop_swim_idle_flinch_f", "pt_supply_drop_swim_idle_flinch_over_f", "pt_supply_drop_swim_putaway", "pt_supply_drop_swim_putaway_over", "pt_supply_drop_swim_raise", "pt_supply_drop_swim_raise_over", "pt_supply_drop_wall_run_putaway_l", "pt_supply_drop_wall_run_putaway_r", "pt_supply_drop_wall_run_raise_l", "pt_supply_drop_wall_run_raise_r", "pt_sword_crouch_flinch_b", "pt_sword_crouch_flinch_f", "pt_sword_crouch_flinch_l", "pt_sword_crouch_flinch_r", "pt_sword_crouch_melee_stick", "pt_sword_crouch_throw", "pt_sword_prone_flinch_b", "pt_sword_prone_flinch_f", "pt_sword_prone_flinch_l", "pt_sword_prone_flinch_r", "pt_sword_prone_melee_stick", "pt_sword_prone_throw", "pt_sword_sprint_putaway", "pt_sword_sprint_raise", "pt_sword_stand_firstraise", "pt_sword_stand_flinch_b", "pt_sword_stand_flinch_f", "pt_sword_stand_flinch_l", "pt_sword_stand_flinch_r", "pt_sword_stand_melee_stick", "pt_sword_stand_throw", "pt_tesla_crouch_reload", "pt_tesla_prone_reload", "pt_tesla_stand_reload", "pt_tomahawk_crouch_pullout", "pt_tomahawk_crouch_throw", "pt_tomahawk_prone_pullout", "pt_tomahawk_prone_throw", "pt_tomahawk_stand_pullout", "pt_tomahawk_stand_throw", "pt_useMigrationWeights", "pt_v_tablet_crouch_putaway", "pt_v_tablet_crouch_raise", "pt_v_tablet_prone_putaway", "pt_v_tablet_prone_raise", "pt_v_tablet_stand_putaway", "pt_v_tablet_stand_raise", "pt_v_tablet_swim_putaway", "pt_v_tablet_swim_putaway_over", "pt_v_tablet_swim_raise", "pt_v_tablet_swim_raise_over", "pt_zod_beast_left_shock_in", "pt_zod_beast_left_shock_loop", "pt_zod_beast_left_shock_out", "pt_zod_beast_melee", "pt_zod_beast_revive", "pt_zom_beast_grapple_in", "pt_zom_beast_grapple_reel_out", "pt_zom_beast_grapple_yank", "pt_zom_beast_grapple_yank_end", "pt_zom_beast_grapple_yank_loop", "publisherFileFetchTimeout", "r_E", "r_FXAverageColorFunc", "r_J", "r_OIT", "r_OIT_MaxEntries", "r_RI", "r__", "r_aaMaxQuality", "r_aaSamples", "r_aaTechnique", "r_actorShadowCount", "r_adapter", "r_adapterName", "r_adaptiveSubdiv", "r_adaptiveSubdivBaseFactor", "r_adaptiveSubdivPatchFactor", "r_add_bsp_sun", "r_add_draw_calls_early", "r_add_draw_calls_late", "r_add_staticmodel_combine", "r_add_staticmodel_finish", "r_add_staticmodel_sort", "r_add_staticmodel_split", "r_add_staticmodel_sun", "r_aim_down_r", "r_aim_up_cen", "r_aim_up_lef", "r_aim_up_rig", "r_allCells", "r_amdGPU", "r_amdMinRadeonSoftwareRevReq", "r_amdMinRadeonSoftwareRevReqString", "r_aoBlurSharpness", "r_aoBlurStep", "r_aoDiminish", "r_aoPower", "r_aoStrength", "r_aoUseTweaks", "r_artUseTweaks", "r_aspectRatio", "r_asyncCompute", "r_atlasAnimFPS", "r_atmoBlurBA", "r_atmoBlurHD", "r_atmoBlurNS", "r_autoRestoreFullscreen", "r_autopriority", "r_b", "r_backBufferCount", "r_balanceLightmapOpaqueLists", "r_blacklevel", "r_blur", "r_blurdstGaussianBlurLevel", "r_blurdstGaussianBlurRadius", "r_bottles_gen", "r_brightness", "r_cacheModelLighting", "r_cacheSModelLighting", "r_charLightAmbient", "r_clampLodScale", "r_clear", "r_clearColor", "r_clearColor2", "r_clutCompositeVisionSet", "r_cmdbuf_worker", "r_colorGradingEnable", "r_colorMap", "r_colorScaleUseTweaks", "r_combinePostOpaqueFx", "r_contrast", "r_curved_milita", "r_d", "r_darkColor", "r_darkColorPower", "r_debugLineWidth", "r_defaultPatchCount", "r_deferredForceShadowNeverUpdate", "r_depthPrepass", "r_depthSortEnable", "r_depthSortRange", "r_desaturation", "r_detailMap", "r_diffuseColorScale", "r_displacementMap", "r_displacementPatchCount", "r_distortion", "r_distortion_script_force_off", "r_dlightForceLimit", "r_dlightLimit", "r_dm_score_", "r_dmg_", "r_dof_bias", "r_dof_enable", "r_dof_farBlur", "r_dof_farEnd", "r_dof_farStart", "r_dof_limit", "r_dof_nearBlur", "r_dof_nearEnd", "r_dof_nearStart", "r_dof_physical_adsFocusSpeed", "r_dof_physical_adsMaxFstop", "r_dof_physical_adsMinFstop", "r_dof_physical_bokehEnable", "r_dof_physical_bokehRotation", "r_dof_physical_bokehShape", "r_dof_physical_bokehSharpness", "r_dof_physical_enable", "r_dof_physical_filmDiagonal", "r_dof_physical_focusDistance", "r_dof_physical_fstop", "r_dof_physical_hipEnable", "r_dof_physical_hipFocusSpeed", "r_dof_physical_hipFstop", "r_dof_physical_hipSharpCocDiameter", "r_dof_physical_maxCocDiameter", "r_dof_physical_minFocusDistance", "r_dof_physical_viewModelFocusDistance", "r_dof_physical_viewModelFstop", "r_dof_tweak", "r_dof_viewModelEnd", "r_dof_viewModelStart", "r_dontPreloadShadersForVirtualLobby", "r_drawFrameDurationGraph", "r_drawSun", "r_drawWater", "r_draw_depth", "r_draw_lit", "r_driverVersion_amd", "r_driverVersion_nvidia", "r_dw", "r_dynamicOPL", "r_dynamicSpotLightShadows", "r_elevatedPriority", "r_emblemBrightnessScale", "r_emissiveMap", "r_enableNoTessBuckets", "r_envBrdfLutMap", "r_envMapExponent", "r_envMapMaxIntensity", "r_envMapMinIntensity", "r_envMapOverride", "r_envMapSunIntensity", "r_eyePupil", "r_eyeRedness", "r_eyeWetness", "r_f", "r_f_d", "r_fastModelPrimaryLightCheck", "r_fastModelPrimaryLightLink", "r_female", "r_fill_texture_memory", "r_filmAltShader", "r_filmLut", "r_filmTweakBrightness", "r_filmTweakContrast", "r_filmTweakDarkTint", "r_filmTweakDesaturation", "r_filmTweakDesaturationDark", "r_filmTweakEnable", "r_filmTweakInvert", "r_filmTweakLightTint", "r_filmTweakMediumTint", "r_filmUseTweaks", "r_flashback", "r_floatZCopy", "r_flushAfterExecute", "r_fog", "r_fog_depthhack_scale", "r_fog_ev_adjust", "r_font_cache_debug_display", "r_forceLod", "r_frozen_weapon_idle", "r_fullscreen", "r_fullscreenWindow", "r_fxaaSubpixel", "r_giv", "r_globalGenericMaterialScale", "r_glow_allowed", "r_glow_allowed_script_forced", "r_graphicContentBlur", "r_gunSightColorEntityScale", "r_gunSightColorNoneScale", "r_gunxpscalecp", "r_hbaoBias", "r_hbaoBlurEnable", "r_hbaoBlurSharpness", "r_hbaoCoarseAO", "r_hbaoDetailAO", "r_hbaoRadius", "r_hbaoSceneScale", "r_hbaoStrengthBlend", "r_hbaoStrengthFixed", "r_hemiAoBlurTolerance", "r_hemiAoCombineResolutionsBeforeBlur", "r_hemiAoCombineResolutionsWithMul", "r_hemiAoDepthSquash", "r_hemiAoEnable", "r_hemiAoHierarchyDepth", "r_hemiAoMaxDepthDownsample", "r_hemiAoNoiseFilterTolerance", "r_hemiAoPower", "r_hemiAoQualityLevel", "r_hemiAoRejectionFalloff", "r_hemiAoStrength", "r_hemiAoUpsampleTolerance", "r_heroLighting", "r_highLodDist", "r_hold", "r_hud_proje", "r_idl", "r_idle", "r_idle_anim", "r_idle_turn_r", "r_ignore", "r_image_cache_copy_memory_budget", "r_image_cache_copy_number_budget", "r_image_cache_create_memory_budget", "r_image_cache_delay_ms", "r_image_cache_delete_until_available", "r_image_cache_keep_lower_mips", "r_image_cache_make_staging_texture", "r_image_cache_mass_remove_threshold", "r_image_cache_throttle_ms", "r_inGameVideo", "r_index", "r_index_t", "r_k", "r_lateAllocParamCacheAllowed", "r_lateAllocParamCacheDefault", "r_lateAllocParamCacheDisplacement", "r_lateAllocParamCacheSubdiv", "r_letterboxAspectRatio", "r_level", "r_lightCacheLessFrequentMaxDistance", "r_lightCacheLessFrequentPeriod", "r_lightGridAvgApplyPrimaryLight", "r_lightGridAvgFollowCamera", "r_lightGridAvgProbeCount", "r_lightGridAvgTraceGround", "r_lightGridContrast", "r_lightGridDefaultFXLightingLookup", "r_lightGridDefaultModelLightingLookup", "r_lightGridEnableTweaks", "r_lightGridIntensity", "r_lightGridSHBands", "r_lightGridUseTweakedValues", "r_lightMap", "r_lightingReflectionProbeMipDrop", "r_lightingShadowFiltering", "r_lightingSunShadowDisableDynamicDraw", "r_lightingSunShadowSSTMipDrop", "r_limitDpvsCmd", "r_litSurfaceHDRScalar", "r_loadForRenderer", "r_loadsun", "r_lockPvs", "r_lod", "r_lod4Dist", "r_lod5Dist", "r_lodBiasRigid", "r_lodBiasSkinned", "r_lodLimit", "r_lodScaleRigid", "r_lodScaleSkinned", "r_lowLodDist", "r_low_r_", "r_lowestLodDist", "r_lowwall_ai", "r_makeDark_enable", "r_maxFrameLatency", "r_mbEnable", "r_mbFastEnable", "r_mbFastPreset", "r_mbLimit", "r_mdao", "r_mdaoAsyncOccluderGen", "r_mdaoBoneInfluenceRadiusScale", "r_mdaoCapsuleStrength", "r_mdaoLimit", "r_mdaoMinBoneBoundsToOcclude", "r_mdaoOccluderCullDistance", "r_mdaoOccluderFadeOutStartDistance", "r_mdaoUseTweaks", "r_mdaoVolumeStrength", "r_mediumLodDist", "r_menu_select", "r_mode", "r_modelLightingMap", "r_modelLodLimit", "r_monitor", "r_motionBlurMode", "r_motionBlurQuality", "r_mpRimColor", "r_mpRimDiffuseTint", "r_mpRimStrength", "r_msaa_downsample", "r_multiGpu", "r_normalMap", "r_numGPUs", "r_nvidiaGPU", "r_nvidiaMinDriverRevReq", "r_nvidiaMinDriverRevReqString", "r_offchipTessellationAllowed", "r_offchipTessellationTfThreshold", "r_offchipTessellationWaveThreshold", "r_omitUnusedRenderTargets", "r_omniShadowRes", "r_outdoor", "r_outdoorFeather", "r_panel", "r_partial", "r_particleHdr", "r_patchCountAllowed", "r_picfxmip", "r_picmip", "r_picmip_bump", "r_picmip_spec", "r_picmip_water", "r_pistol", "r_poisonFX_blurMax", "r_poisonFX_blurMin", "r_poisonFX_debug_amount", "r_poisonFX_debug_enable", "r_poisonFX_dvisionA", "r_poisonFX_dvisionX", "r_poisonFX_dvisionY", "r_poisonFX_pulse", "r_poisonFX_warpX", "r_poisonFX_warpY", "r_polygonOffsetBias", "r_polygonOffsetClamp", "r_polygonOffsetScale", "r_portalBevels", "r_portalBevelsOnly", "r_portalMinClipArea", "r_portalMinRecurseDepth", "r_portalWalkLimit", "r_postAA", "r_postFxParams", "r_postfx_enable", "r_preloadShaders", "r_preloadShadersELL", "r_preloadShadersELLMLLT", "r_preloadShadersELLMS", "r_preloadShadersELLMSPT", "r_preloadShadersFrontend", "r_preloadShadersFrontendAllow", "r_preloadShadersFrontendClearCache", "r_preloadShadersFrontendOptionsRestartAllow", "r_preloadShadersWNDTOO", "r_primaryLightTweakDiffuseStrength", "r_primaryLightTweakSpecularStrength", "r_primaryLightUseTweaks", "r_printalloc", "r_prone_aim_", "r_r", "r_radialblu", "r_reactiveMotionActorRadius", "r_reactiveMotionActorVelocityMax", "r_reactiveMotionActorZOffset", "r_reactiveMotionEffectorStrengthScale", "r_reactiveMotionHelicopterLimit", "r_reactiveMotionHelicopterRadius", "r_reactiveMotionHelicopterStrength", "r_reactiveMotionPlayerHeightAdjust", "r_reactiveMotionPlayerRadius", "r_reactiveMotionPlayerZOffset", "r_reactiveMotionVelocityTailScale", "r_reactiveMotionWindAmplitudeScale", "r_reactiveMotionWindAreaScale", "r_reactiveMotionWindDir", "r_reactiveMotionWindFrequencyScale", "r_reactiveMotionWindStrength", "r_rear_door_ent", "r_recommendedSet", "r_reflectionProbeMap", "r_reflectionProbeNmlLuminance", "r_refreshRate", "r_renderResolution", "r_renderResolutionNative", "r_request_scenemodel_lods", "r_request_staticmodel_lods", "r_reviveFX_edgeAmount", "r_reviveFX_edgeColorTemp", "r_reviveFX_edgeContrast", "r_reviveFX_edgeMaskAdjust", "r_reviveFX_edgeOffset", "r_reviveFX_edgeSaturation", "r_reviveFX_edgeScale", "r_reviveFX_enable", "r_rimLight0Color", "r_rimLight0Heading", "r_rimLight0Pitch", "r_rimLightBias", "r_rimLightDiffuseIntensity", "r_rimLightFalloffMaxDistance", "r_rimLightFalloffMinDistance", "r_rimLightFalloffMinIntensity", "r_rimLightPower", "r_rimLightSpecIntensity", "r_rimLightUseTweaks", "r_room_hatch_lod", "r_s_", "r_savesun", "r_scaleViewport", "r_sceneBrightness", "r_sceneMipShowOverlay", "r_sceneResolutionMultiplier", "r_sceneents_brush", "r_sceneents_dobj", "r_sceneents_dobj_combine", "r_sceneents_dynbrush", "r_sceneents_glassbrush", "r_sceneents_model", "r_sceneents_shadow_brush", "r_sceneents_shadow_dobj", "r_sceneents_shadow_dynbrush", "r_sceneents_shadow_model", "r_serializeRendering", "r_set_visibility_camera", "r_showLightGrid", "r_showLightGridAvgProbes", "r_showLightGridDetailInfo", "r_showLightProbes", "r_showMissingLightGrid", "r_showModelLightingLowWaterMark", "r_showPortals", "r_showPortalsOverview", "r_showReflectionProbeSelection", "r_siege_animate", "r_siege_uncompress", "r_singleCell", "r_skipPvs", "r_skyFogUseTweaks", "r_sky_fog_intensity", "r_sky_fog_max_angle", "r_sky_fog_min_angle", "r_smaaFilmicStrength", "r_smaaThreshold", "r_smodelInstancedRenderer", "r_smodelInstancedThreshold", "r_smp_backend", "r_smp_worker", "r_smp_worker_thread0", "r_smp_worker_thread1", "r_smp_worker_thread2", "r_smp_worker_thread3", "r_smp_worker_thread4", "r_smp_worker_thread5", "r_smp_worker_thread6", "r_smp_worker_thread7", "r_specOccMap", "r_specularColorScale", "r_specularMap", "r_speedBlurAmount", "r_speedBlurFX_enable", "r_spotLightEntityShadows", "r_spotLightShadows", "r_spotShadowRes", "r_sprite_ra", "r_ssaaSamples", "r_ssaoDebug", "r_ssaoDebugMip", "r_ssaoDepthScale", "r_ssaoDepthScaleViewModel", "r_ssaoFadeDepth", "r_ssaoGapFalloff", "r_ssaoGradientFalloff", "r_ssaoMinPixelWidth", "r_ssaoMultiRes", "r_ssaoPower", "r_ssaoRejectDepth", "r_ssaoSampleCount", "r_ssaoScriptScale", "r_ssaoStrength", "r_ssaoTechnique", "r_ssaoUseTweaks", "r_ssaoWidth", "r_sse_skinning", "r_ssrBlendScale", "r_ssrFadeInDuration", "r_ssrPositionCorrection", "r_ssrRoughnessMipParameters", "r_sssBlendWeight", "r_sssDebugMaterial", "r_sssJitterRadius", "r_sssLimit", "r_sssNarrowRadius", "r_sssWideRadius", "r_sssblurEnable", "r_stand_firs", "r_strafe_run_l", "r_strafe_run_r", "r_streamLowDetail", "r_stream_combine", "r_stream_decompress", "r_stream_sort", "r_stream_update", "r_stream_update_client_cache", "r_stream_update_dynamicmodels", "r_stream_update_fileblocks", "r_stream_update_staticmodels", "r_stream_update_staticsurfaces", "r_subdiv", "r_subdivLimit", "r_subdivPatchCount", "r_subdomainLimit", "r_subdomainScale", "r_subwindow", "r_sunFlareTint", "r_sunInfDist", "r_sun_from_dvars", "r_sun_fx_position", "r_sun_shadow_dpvs_build_umbra", "r_sun_shadow_dpvs_process_ents", "r_sun_shadow_dpvs_setup_backend", "r_sun_shadow_dpvs_setup_dobjs", "r_sun_shadow_dpvs_setup_dynents", "r_sunblind_fadein", "r_sunblind_fadeout", "r_sunblind_max_angle", "r_sunblind_max_darken", "r_sunblind_min_angle", "r_sunflare_fadein", "r_sunflare_fadeout", "r_sunflare_max_alpha", "r_sunflare_max_angle", "r_sunflare_max_size", "r_sunflare_min_angle", "r_sunflare_min_size", "r_sunflare_shader", "r_sunglare_fadein", "r_sunglare_fadeout", "r_sunglare_max_angle", "r_sunglare_max_lighten", "r_sunglare_min_angle", "r_sunshadowmap_cmdbuf_worker", "r_sunsprite_shader", "r_sunsprite_size", "r_surfaceHDRScalarUseTweaks", "r_swim_sprint", "r_tessellation", "r_tessellationCutoffDistance", "r_tessellationCutoffFalloff", "r_tessellationEyeScale", "r_tessellationFactor", "r_tessellationHeightAuto", "r_tessellationHeightScale", "r_tessellationHybrid", "r_tessellationLodBias", "r_tessellationUseTweaks", "r_texFilterAnisoMax", "r_texFilterAnisoMin", "r_texFilterDisable", "r_texFilterMipBias", "r_texFilterMipMode", "r_texFilterProbeBilinear", "r_texFilterQuality", "r_texShowMipMode", "r_texturebits", "r_thermalColorOffset", "r_thermalColorScale", "r_thermalDetailScale", "r_thermalFadeColor", "r_thermalFadeControl", "r_thermalFadeMax", "r_thermalFadeMin", "r_tonemap", "r_tonemapAdaptSpeed", "r_tonemapAuto", "r_tonemapAutoExposureAdjust", "r_tonemapBlack", "r_tonemapBlend", "r_tonemapCrossover", "r_tonemapDarkEv", "r_tonemapDarkExposureAdjust", "r_tonemapExposure", "r_tonemapExposureAdjust", "r_tonemapHighlightRange", "r_tonemapLightEv", "r_tonemapLightExposureAdjust", "r_tonemapLockAutoExposureAdjust", "r_tonemapMaxExposure", "r_tonemapMaxExposureAdjust", "r_tonemapMidEv", "r_tonemapMidExposureAdjust", "r_tonemapMinExposureAdjust", "r_tonemapShoulder", "r_tonemapToe", "r_tonemapWhite", "r_transitio", "r_uav_overlap", "r_ui3d_debug_display", "r_ui3d_h", "r_ui3d_use_debug_values", "r_ui3d_w", "r_ui3d_x", "r_ui3d_y", "r_uiBlurDstMode", "r_umbraAccurateOcclusionThreshold", "r_umbraExclusive", "r_umbraUseBadPlaces", "r_umbra_clear_early", "r_umbra_query", "r_umbra_query_end", "r_unlitSurfaceHDRScalar", "r_up", "r_useComputeSkinning", "r_useLayeredMaterials", "r_useLightGridDefaultFXLightingLookup", "r_useLightGridDefaultModelLightingLookup", "r_useShadowGeomOpt", "r_useSunShadowPortals", "r_useXAnimIK", "r_vc_makelog", "r_vc_showlog", "r_veilAntialiasing", "r_veilBackgroundStrength", "r_veilFalloffScale1", "r_veilFalloffScale2", "r_veilFalloffWeight1", "r_veilFalloffWeight2", "r_veilFilter", "r_veilPreset", "r_veilRadius", "r_velocityPrepass", "r_videoMemoryMultiplier", "r_videoMemoryScale", "r_videoMode", "r_viewModelLightAmbient", "r_viewModelPrimaryLightTweakDiffuseStrength", "r_viewModelPrimaryLightTweakSpecularStrength", "r_viewModelPrimaryLightUseTweaks", "r_volumeLightScatter", "r_volumeLightScatterAngularAtten", "r_volumeLightScatterBackgroundDistance", "r_volumeLightScatterColor", "r_volumeLightScatterDepthAttenFar", "r_volumeLightScatterDepthAttenNear", "r_volumeLightScatterEv", "r_volumeLightScatterLinearAtten", "r_volumeLightScatterQuadraticAtten", "r_volumeLightScatterUseTweaks", "r_volumetric_lighting_enabled", "r_volumetric_lighting_lights_skip_samples", "r_volumetric_lighting_max_spot_samples", "r_volumetric_lighting_max_sun_samples", "r_volumetric_lighting_sun_skip_samples", "r_vsync", "r_walk_f", "r_warningRepeatDelay", "r_waterFogTest", "r_waveWaterGeneratorTweakAmplitude", "r_waveWaterGeneratorTweakAmplitudeVariation", "r_waveWaterGeneratorTweakChangeTime", "r_waveWaterGeneratorTweakChangeTimeVariation", "r_waveWaterGeneratorTweakPeriod", "r_waveWaterGeneratorTweakPeriodVariation", "r_waveWaterGeneratorTweakRadius", "r_waveWaterTweakConvolutionWidth", "r_waveWaterTweakDamping", "r_waveWaterTweakGridDetailScale", "r_waveWaterTweakGridInteractionScale", "r_waveWaterTweakMaxGridSize", "r_waveWaterTweakMinGridSize", "r_waveWaterTweakOtherRadiusScale", "r_waveWaterTweakPhysicsRadiusScale", "r_waveWaterTweakPlayerRadiusScale", "r_waveWaterTweakTimeScale", "r_waveWaterTweakWaterDepth", "r_wavewater_draw_node", "r_wavewater_grid_update", "r_wavewater_update", "r_wideTessFactorsThreshold", "r_zfar", "r_znear", "radar_allies", "radar_axis", "radar_client", "radarjamDistMax", "radarjamDistMin", "radarjamSinCurve", "radius_damage_debug", "radius_use", "ragdoll_baselerp_bone", "ragdoll_baselerp_time", "ragdoll_bone", "ragdoll_bullet_force", "ragdoll_bullet_upbias", "ragdoll_clear", "ragdoll_dump_anims", "ragdoll_enable", "ragdoll_explode_force", "ragdoll_explode_upbias", "ragdoll_exploding_bullet_force", "ragdoll_exploding_bullet_upbias", "ragdoll_idle_min_linvelsq", "ragdoll_idle_min_velsq", "ragdoll_jitter_scale", "ragdoll_joint", "ragdoll_jointlerp_time", "ragdoll_limit", "ragdoll_link_to_moving_platform", "ragdoll_max_life", "ragdoll_max_simulating", "ragdoll_max_stretch_pct", "ragdoll_mp_limit", "ragdoll_mp_resume_share_after_killcam", "ragdoll_nodeath", "ragdoll_now", "ragdoll_pin_bone", "ragdoll_resolve_penetration_bias", "ragdoll_rotvel_scale", "ragdoll_self_collision_scale", "ragdoll_selfpair", "ragdoll_stretch_iters", "ragdoll_use_linear_velocity", "raise_over", "raise_r", "raise_riotshield", "rankedPlayEndMatchKeepLobby", "rate", "reached_end_node", "reached_node", "reached_wait_node", "reached_wait_speed", "recorder_disablePlayback", "recorder_enablePlayback", "recorder_gotoTime", "recorder_memResize", "recorder_togglePlayback", "reload_arrow", "reload_base", "reload_clipin", "reload_clipinJ", "reload_clipout", "reload_large", "reload_medium", "reload_rearclip_partial", "reload_rechamber", "reload_small", "reload_smallR", "reload_start", "reload_then_kill_dualclip", "requireOpenNat", "reset_loadouts", "reset_trigger_count", "retaildev", "revive_material_end", "revive_material_start", "revive_shader_constant", "right_arm", "right_arm_lower", "right_arm_upper", "right_cylinder_close", "right_cylinder_open", "right_foot", "right_hand", "right_hand_ik", "right_hip_yaw", "right_l", "right_leg", "right_leg_lower", "right_leg_upper", "right_level", "right_player", "right_r", "right_shot", "right_stick_pressed", "right_tread", "right_tread_destroyed", "right_trigger", "riotshield_bullet_damage_scale", "riotshield_cp", "riotshield_deploy_limit_radius", "riotshield_deploy_trace_parallel", "riotshield_deployed_health", "riotshield_depoly_lights", "riotshield_destroyed_cleanup_time", "riotshield_dust", "riotshield_explosive_damage_scale", "riotshield_impact", "riotshield_impactR", "riotshield_light", "riotshield_melee_damage_scale", "riotshield_mp", "riotshield_projectile_damage_scale", "riotshield_state", "rocket_explode", "rocket_explode_xtreme", "rocket_launcher", "rocket_launcher_check", "rocket_wasp_hijacked", "s_BR", "s_C", "s_DESC", "s__tostring", "s_aggregate_ping_offset", "s_aggregate_ping_scale", "s_alert_distance", "s_avg_max_weighting", "s_barrack_", "s_corrupt", "s_default", "s_default_distance", "s_default_height", "s_drive_by_sound_apex", "s_drive_by_sound_name", "s_drive_by_sound_radius", "s_ds_pingclient_reping_wait_db", "s_eyeglow", "s_fl", "s_full", "s_gen", "s_h", "s_hanging_", "s_l", "s_lifespan", "s_lod", "s_matchRecordData", "s_navmesh", "s_navvolume", "s_nightmares", "s_nightmares_", "s_noise", "s_objectives", "s_overload_react_intro", "s_overload_react_intro_", "s_overload_react_outro_", "s_patch", "s_pool_value", "s_priority", "s_pro", "s_scrambled", "s_t", "s_t_", "s_trash_food_box", "s_tu", "s_v", "safeAreaTweakable_horizontal", "safeAreaTweakable_vertical", "safeArea_adjusted_horizontal", "safeArea_adjusted_vertical", "safeArea_horizontal", "safeArea_vertical", "saved_gameskill", "say_party", "say_team", "scr_HeldKillstreak_Penalty", "scr_RequiredMapAspectratio", "scr_ai_tank_think_debug", "scr_airsupportHeightScale", "scr_allow_killstreak_building", "scr_armor_colorB", "scr_armor_colorG", "scr_armor_colorR", "scr_armor_dev", "scr_armor_expand", "scr_armor_mod_bullet_mult", "scr_armor_mod_expl_mult", "scr_armor_mod_melee_mult", "scr_armor_mod_misc_mult", "scr_armor_mod_proj_mult", "scr_armor_mod_view_kick_mult", "scr_barrelroll", "scr_bomb_beep", "scr_bouncing_betty_killcam_offset", "scr_btx", "scr_bty", "scr_codPointsCap", "scr_codpointsmatchscale", "scr_codpointsperchallenge", "scr_codpointsxpscale", "scr_combat_efficiency_power_loss_scalar", "scr_cpower_debug_prints", "scr_csmode", "scr_ctf_halftime", "scr_ctf_numlives", "scr_ctf_playerrespawndelay", "scr_ctf_returntime", "scr_ctf_roundlimit", "scr_ctf_scorelimit", "scr_ctf_spawnPointFacingAngle", "scr_ctf_timelimit", "scr_ctf_waverespawndelay", "scr_ctf_winlimit", "scr_damage_debug", "scr_dd_addtime", "scr_dd_bombtimer", "scr_dd_defusetime", "scr_dd_numlives", "scr_dd_planttime", "scr_dd_playerrespawndelay", "scr_dd_roundlimit", "scr_dd_roundswitch", "scr_dd_scorelimit", "scr_dd_timelimit", "scr_dd_waverespawndelay", "scr_dd_winlimit", "scr_debug_heat_wave_traces", "scr_defaultDistanceTabun", "scr_degreesToRoll", "scr_deleteexplosivesonspawn", "scr_devHeliPathsDebugDraw", "scr_diehard", "scr_dirt_enable_explosion", "scr_dirt_enable_fall_damage", "scr_dirt_enable_gravity_spikes", "scr_dirt_enable_slide", "scr_disableChallenges", "scr_disableStatTracking", "scr_disable_air_death_ragdoll", "scr_dm_numlives", "scr_dm_playerrespawndelay", "scr_dm_roundlimit", "scr_dm_score_", "scr_dm_scorelimit", "scr_dm_timelimit", "scr_dm_waverespawndelay", "scr_dm_winlimit", "scr_dof_farBlur", "scr_dof_farEnd", "scr_dof_farStart", "scr_dof_nearEnd", "scr_dof_nearStart", "scr_dom_numlives", "scr_dom_playerrespawndelay", "scr_dom_roundlimit", "scr_dom_scorelimit", "scr_dom_timelimit", "scr_dom_waverespawndelay", "scr_dom_winlimit", "scr_drawfriend", "scr_enable_new_tabun", "scr_explBulletMod", "scr_fireflies_start_height", "scr_fireflyPartialMovePercent", "scr_fireflyPodActivationTime", "scr_fireflyPodDetectionRadius", "scr_fireflyPodGracePeriod", "scr_firefly_attack_attack_speed_scale", "scr_firefly_collision_check_interval", "scr_firefly_debug", "scr_firefly_emit_time", "scr_firefly_min_speed", "scr_firefly_pod_timeout", "scr_fog_color", "scr_fog_exp_halfplane", "scr_fog_nearplane", "scr_fx_tabun_radius", "scr_game_allowkillcam", "scr_game_arcadescoring", "scr_game_deathpointloss", "scr_game_difficulty", "scr_game_division", "scr_game_forceuav", "scr_game_friendlyFireDelay", "scr_game_graceperiod", "scr_game_hardpoints", "scr_game_killstreakdelay", "scr_game_matchstarttime", "scr_game_medalsenabled", "scr_game_onlyheadshots", "scr_game_perks", "scr_game_pinups", "scr_game_playerwaittime", "scr_game_rankenabled", "scr_game_spectatetype", "scr_game_suicidepointloss", "scr_gameended", "scr_givetestsupplydrop", "scr_gunx", "scr_gunxj", "scr_gunxpscalec", "scr_gunxpscalecp", "scr_gunxpscalemp", "scr_gunxpscalezm", "scr_hardcore", "scr_hardpoint_allowauto_turret", "scr_hardpoint_allowcounteruav", "scr_hardpoint_allowdogs", "scr_hardpoint_allowhelicopter_comlink", "scr_hardpoint_allowradar", "scr_hardpoint_allowradardirection", "scr_hardpoint_allowrcbomb", "scr_heli_armor", "scr_heli_armor_bulletdamage", "scr_heli_armored_maxhealth", "scr_heli_attract_range", "scr_heli_attract_strength", "scr_heli_debug", "scr_heli_debug_crash", "scr_heli_dest_wait", "scr_heli_hardpoint_interval", "scr_heli_health_degrade", "scr_heli_loopmax", "scr_heli_maxhealth", "scr_heli_missile_friendlycare", "scr_heli_missile_max", "scr_heli_missile_range", "scr_heli_missile_regen_time", "scr_heli_missile_reload_time", "scr_heli_missile_rof", "scr_heli_missile_target_cone", "scr_heli_missile_valid_target_cone", "scr_heli_protect_pos_time", "scr_heli_protect_radius", "scr_heli_protect_time", "scr_heli_target_recognition", "scr_heli_target_spawnprotection", "scr_heli_targeting_delay", "scr_heli_turretClipSize", "scr_heli_turretReloadTime", "scr_heli_turret_angle_tan", "scr_heli_turret_spinup_delay", "scr_heli_turret_target_cone", "scr_heli_visual_range", "scr_heli_warning_distance", "scr_helicopterTurretMaxAngle", "scr_incendiaryDamageRadius", "scr_incendiary_fx_count", "scr_incendiary_stepout_ground", "scr_incendiary_stepout_wall", "scr_incendiary_trace_distance", "scr_incendiary_trace_down_distance", "scr_incendiaryfireDamage", "scr_incendiaryfireDamageHardcore", "scr_incendiaryfireDamageTickTime", "scr_incendiaryfireDuration", "scr_incendiaryfxDuration", "scr_kick_mintime", "scr_kick_time", "scr_killcam_posttime", "scr_killcam_time", "scr_koth_numlives", "scr_koth_playerrespawndelay", "scr_koth_roundlimit", "scr_koth_roundswitch", "scr_koth_scorelimit", "scr_koth_timelimit", "scr_koth_waverespawndelay", "scr_koth_winlimit", "scr_lightningGunKillcamDecelPercent", "scr_lightningGunKillcamOffset", "scr_lightningGunKillcamTime", "scr_loopheight", "scr_loopheightrand", "scr_loopwaittime", "scr_mapsize", "scr_maxPerPlayerExplosives", "scr_max_planey", "scr_max_planeyaw", "scr_max_rank", "scr_max_simLocks", "scr_maxinventory_scorestreaks", "scr_maxo_planex", "scr_maxo_planey", "scr_microwave_turret_debug", "scr_min_planeroll", "scr_min_prestige", "scr_missileDudDeleteDelay", "scr_motd", "scr_nukeCancelMode", "scr_nukeTimer", "scr_obj", "scr_overdrive_amount", "scr_overdrive_boost_fx_time", "scr_overdrive_boost_speed_tol", "scr_overdrive_flash_alpha", "scr_overdrive_flash_fade_in_time", "scr_overdrive_flash_fade_out_time", "scr_overdrive_inner_radius", "scr_overdrive_outer_radius", "scr_overdrive_velScale", "scr_overdrive_velShouldScale", "scr_patientZero", "scr_planeox", "scr_planeoy", "scr_planeroll", "scr_planey", "scr_planeyaw", "scr_planez", "scr_player", "scr_player_allowrevive", "scr_player_forcerespawn", "scr_player_healthregentime", "scr_player_maxhealth", "scr_player_numlives", "scr_player_respawndelay", "scr_player_sprinttime", "scr_player_suicidespawndelay", "scr_poisonDamage", "scr_poisonDamageHardcore", "scr_poisonDuration", "scr_proximityChainBoltSpeed", "scr_proximityChainDebug", "scr_proximityChainGracePeriod", "scr_proximityGrenadeActivationTime", "scr_proximityGrenadeDOTDamageAmount", "scr_proximityGrenadeDOTDamageAmountHardcore", "scr_proximityGrenadeDOTDamageInstances", "scr_proximityGrenadeDOTDamageTime", "scr_proximityGrenadeDetectionRadius", "scr_proximityGrenadeDuration", "scr_proximityGrenadeGracePeriod", "scr_proximityGrenadeProtectedTime", "scr_rampagebonusscale", "scr_rankXpCap", "scr_rcbomb_amount", "scr_rcbomb_duration", "scr_rcbomb_fadeOut_delay", "scr_rcbomb_fadeOut_timeBlack", "scr_rcbomb_fadeOut_timeIn", "scr_rcbomb_fadeOut_timeOut", "scr_rcbomb_inner_radius", "scr_rcbomb_outer_radius", "scr_riotShieldXPBullets", "scr_rmbomblet_camera_delaytime", "scr_sab_bombtimer", "scr_sab_defusetime", "scr_sab_hotpotato", "scr_sab_numlives", "scr_sab_planttime", "scr_sab_playerrespawndelay", "scr_sab_roundlimit", "scr_sab_roundswitch", "scr_sab_scorelimit", "scr_sab_timelimit", "scr_sab_waverespawndelay", "scr_sab_winlimit", "scr_satchel_detonation_delay", "scr_scorestreaks", "scr_scorestreaks_maxstacking", "scr_sd_bombtimer", "scr_sd_defusetime", "scr_sd_multibomb", "scr_sd_numlives", "scr_sd_planttime", "scr_sd_playerrespawndelay", "scr_sd_roundlimit", "scr_sd_roundswitch", "scr_sd_scorelimit", "scr_sd_timelimit", "scr_sd_waverespawndelay", "scr_sd_winlimit", "scr_secondaryProgressBarHeight", "scr_secondaryProgressBarX", "scr_secondaryProgressBarY", "scr_selecting_location", "scr_show_shot_info_for_igcs", "scr_showperksonspawn", "scr_sitrepscan", "scr_spawn_enemyavoiddist", "scr_spawn_enemyavoidweight", "scr_spawnpointdebug", "scr_spawnpointlospenalty", "scr_spawnpointnewlogic", "scr_spawnpointprofile", "scr_spawnpointweaponpenalty", "scr_spawnsimple", "scr_stop_teamops", "scr_supply_drop_give", "scr_supply_drop_gui", "scr_supplydropAccel", "scr_supplydropAccelLeaving", "scr_supplydropAccelStarting", "scr_supplydropIncomingDistance", "scr_supplydropMaxPitch", "scr_supplydropMaxRoll", "scr_supplydropOffset", "scr_supplydropOffsetHeight", "scr_supplydropOutgoingDistance", "scr_supplydropSpeed", "scr_supplydropSpeedLeaving", "scr_supplydropSpeedStarting", "scr_supplydrop_killcam_max_rot", "scr_supplydrop_killcam_rot_wait", "scr_tabunGasDuration", "scr_tabunInitialGasShockDuration", "scr_tabunWalkInGasShockDuration", "scr_tabun_effect_radius", "scr_tabun_shock_height", "scr_tabun_shock_radius", "scr_team_fftype", "scr_team_respawntime", "scr_team_teamkillerplaylistbanpenalty", "scr_team_teamkillerplaylistbanquantum", "scr_team_teamkillpointloss", "scr_team_teamkillspawndelay", "scr_teambalance", "scr_thirdPerson", "scr_timeplayedcap", "scr_tispawndelay", "scr_unstoppableforce_activation_delay", "scr_unstoppableforce_amount", "scr_unstoppableforce_boost_speed_tol", "scr_unstoppableforce_flash_alpha", "scr_unstoppableforce_flash_fade_in_time", "scr_unstoppableforce_flash_fade_out_time", "scr_unstoppableforce_inner_radius", "scr_unstoppableforce_outer_radius", "scr_unstoppableforce_velScale", "scr_unstoppableforce_velShouldScale", "scr_use_digital_blood_enabled", "scr_veh_", "scr_veh_alive_cleanuptimemax", "scr_veh_alive_cleanuptimemin", "scr_veh_cleanupabandoned", "scr_veh_cleanupdebugprint", "scr_veh_cleanupdrifted", "scr_veh_cleanupmaxspeedmph", "scr_veh_cleanupmindistancefeet", "scr_veh_cleanuptime_dmgfactor_deadtread", "scr_veh_cleanuptime_dmgfactor_max", "scr_veh_cleanuptime_dmgfactor_min", "scr_veh_cleanuptime_dmgfraction_curve_begin", "scr_veh_cleanuptime_dmgfraction_curve_end", "scr_veh_dead_cleanuptimemax", "scr_veh_dead_cleanuptimemin", "scr_veh_disableoverturndamage", "scr_veh_disablerespawn", "scr_veh_disappear_maxpreventdistancefeet", "scr_veh_disappear_maxpreventvisibilityfeet", "scr_veh_disappear_maxwaittime", "scr_veh_driversarehidden", "scr_veh_driversareinvulnerable", "scr_veh_explode_on_cleanup", "scr_veh_explosion_doradiusdamage", "scr_veh_explosion_husk_forcepointvariance", "scr_veh_explosion_husk_horzvelocityvariance", "scr_veh_explosion_husk_vertvelocitymax", "scr_veh_explosion_husk_vertvelocitymin", "scr_veh_explosion_maxdamage", "scr_veh_explosion_mindamage", "scr_veh_explosion_radius", "scr_veh_explosion_spawnfx", "scr_veh_health_jeep", "scr_veh_health_tank", "scr_veh_ondeath_createhusk", "scr_veh_ondeath_usevehicleashusk", "scr_veh_respawnafterhuskcleanup", "scr_veh_respawntimemax", "scr_veh_respawntimemin", "scr_veh_respawnwait_iterationwaitseconds", "scr_veh_respawnwait_maxiterations", "scr_veh_waittillstoppedandmindist_maxtime", "scr_veh_waittillstoppedandmindist_maxtimeenabledistfeet", "scr_vehicle_damage_scalar", "scr_vehicle_healthnumbers", "scr_wagerBet", "scr_war_numlives", "scr_war_playerrespawndelay", "scr_war_roundlimit", "scr_war_scorelimit", "scr_war_timelimit", "scr_war_waverespawndelay", "scr_war_winlimit", "scr_weapon_allowbetty", "scr_weapon_allowc", "scr_weapon_allowflash", "scr_weapon_allowfrags", "scr_weapon_allowmines", "scr_weapon_allowrpgs", "scr_weapon_allowsatchel", "scr_weapon_allowsmoke", "scr_weaponobject_coneangle", "scr_weaponobject_debug", "scr_weaponobject_graceperiod", "scr_weaponobject_mindist", "scr_weaponobject_radius", "scr_xps", "scr_xpsc", "scr_xpsca", "scr_xpscal", "scr_xpscale", "scr_xpscalecp", "scr_xpscalemp", "scr_xpscalezm", "screenshots_active", "script_accuracy", "script_aigroup", "script_animname", "script_brushmodel", "script_callstack", "script_callstack_id", "script_camera", "script_color_allies", "script_color_axis", "script_elevator", "script_errors", "script_gameobjectname", "script_killspawner", "script_label", "script_lifespan", "script_linkName", "script_model", "script_models", "script_noteworthy", "script_origin", "script_pool_value", "script_priority", "script_string", "script_struct", "script_trigger_allplayers", "script_unitrigger_type", "script_vehicle", "script_vehicle_corpse", "script_vehicleride", "sd_a", "sd_b", "sd_bomb", "sd_bomb_defused", "sd_bomb_dropped", "sd_bomb_enemy", "sd_bomb_planted", "sd_bomb_taken", "sd_defuse_a", "sd_defuse_b", "sd_mix_earlyverb", "sd_mix_frame", "sd_mix_lateverb", "sd_start", "sd_stream", "search_query", "search_results", "search_weight_asn", "search_weight_country_code", "search_weight_lat_long", "sensitivity", "sentry_gun_kill", "sentry_gun_plant", "sentry_placement_feet_offset", "sentry_placement_feet_trace_dist_z", "sentry_placement_trace_dist", "sentry_placement_trace_min_normal", "sentry_placement_trace_parallel", "sentry_placement_trace_pitch", "sentry_placement_trace_radius", "sentry_placement_trace_radius_canon_safety", "sentry_turret", "server1", "server10", "server11", "server12", "server13", "server14", "server15", "server16", "server2", "server3", "server4", "server5", "server6", "server7", "server8", "server9", "session_end", "session_ffotd", "session_id", "session_immediateDeleteTinySessions", "session_mode", "session_nonblocking", "session_rejoin", "session_start", "set_anim", "set_for_time__", "set_gametype", "set_goal_func_quits", "set_lighting_ent", "set_playback_speed", "set_shot", "shellshock_flashed", "shortversion", "showPlaylistTotalPlayers", "signed_out", "silenced_shot", "silenced_shot_alert_distance", "silenced_shot_default_distance", "silenced_shot_lifespan", "silenced_shot_pool_value", "silenced_shot_priority", "skill_rating", "skill_rating_start", "skill_update", "skill_variance", "skill_variance_start", "sm_cacheSpotShadows", "sm_cacheSpotShadowsEnabled", "sm_cacheSunShadow", "sm_cacheSunShadowEnabled", "sm_cameraOffset", "sm_dynlightAllSModels", "sm_enable", "sm_fastSunShadow", "sm_lightScore_eyeProjectDist", "sm_lightScore_spotProjectFrac", "sm_maxLightsWithShadows", "sm_minSpotLightScore", "sm_polygonOffsetBias", "sm_polygonOffsetClamp", "sm_polygonOffsetScale", "sm_qualitySpotShadow", "sm_spotDistCull", "sm_spotEnable", "sm_spotFilterRadius", "sm_spotLightScoreModelScale", "sm_spotLightScoreRadiusPower", "sm_spotLimit", "sm_spotShadowFadeTime", "sm_strictCull", "sm_sunEnable", "sm_sunFilterRadius", "sm_sunSampleSizeNear", "sm_sunShadowBoundsMax", "sm_sunShadowBoundsMin", "sm_sunShadowBoundsOverride", "sm_sunShadowCenter", "sm_sunShadowCenterMode", "sm_sunShadowScale", "sm_sunShadowScaleLocked", "sm_tileResolution", "sm_usedSunCascadeCount", "snd_allowHeadphoneHRTF", "snd_announcerDisabled", "snd_announcerVoicePrefix", "snd_battlechatterDisabled", "snd_bow_port", "snd_bow_stbd", "snd_busvolprio_holdbreath", "snd_busvolprio_pain", "snd_busvolprio_shellshock", "snd_cinematicVolumeScale", "snd_cockpit", "snd_controller_sounds", "snd_detectedSpeakerConfig", "snd_dopplerAuditionEnable", "snd_dopplerBaseSpeedOfSound", "snd_dopplerEnable", "snd_dopplerPitchMax", "snd_dopplerPitchMin", "snd_dopplerPlayerVelocityScale", "snd_dopplerSmoothing", "snd_draw3D", "snd_drawInfo", "snd_enable2D", "snd_enable3D", "snd_enableEq", "snd_enableReverb", "snd_enableStream", "snd_engine", "snd_envFollowerBuffScale", "snd_enveffectsprio_level", "snd_enveffectsprio_shellshock", "snd_errorOnMissing", "snd_hiFilter", "snd_hitsoundDisabled", "snd_impact", "snd_inheritSecondaryPitchVol", "snd_levelFadeTime", "snd_loadFadeTime", "snd_loopFadeTime", "snd_losOcclusion", "snd_lowFilter", "snd_lowQualityAudio", "snd_masterRingmod", "snd_menu_cinematic", "snd_menu_hearing_impaired", "snd_menu_master", "snd_menu_music", "snd_menu_presets", "snd_menu_sfx", "snd_menu_speaker_setup", "snd_menu_voice", "snd_multiplayer_character_voice", "snd_multiplayer_music", "snd_multiplayer_music_track", "snd_musicDisabled", "snd_occlusion", "snd_occlusionDelay", "snd_occlusionLerpTime", "snd_peakLimiterCompression", "snd_peakLimiterDecay", "snd_peakLimiterPregain", "snd_peakLimiterSustainFrames", "snd_playLocal", "snd_restart", "snd_reverbRingmod", "snd_reverbZoneOutsideFactor", "snd_rotor", "snd_slaveFadeTime", "snd_speakerConfig", "snd_tail_rotor", "snd_touchStreamFilesOnLoad", "snd_useOldPanning", "snd_virtualChannelInfo", "snd_virtualMinTimeLeftToRevive", "snd_virtualReviveVoices", "snd_virtualWaitToReviveTime", "snd_voicechat_open_mic", "snd_voicechat_record_level", "snd_voicechat_volume", "snd_volume", "snd_wasapiSampleRateConverterNeeded", "snd_wind_right", "spawnsystem_convert_spawns_to_structs", "spawnsystem_devgui", "specialty_accuracyandflatspread", "specialty_additionalprimaryweapon", "specialty_ammodrainsfromstockfirst", "specialty_anteup", "specialty_armorpiercing", "specialty_armorvest", "specialty_bulletaccuracy", "specialty_bulletdamage", "specialty_bulletflinch", "specialty_bulletpenetration", "specialty_combat_efficiency", "specialty_deadshot", "specialty_decoy", "specialty_delayexplosive", "specialty_detectexplosive", "specialty_detectnearbyenemies", "specialty_detectnearbyenemies_inner", "specialty_detectnearbyenemies_outer", "specialty_detectnearbyenemies_zthreshold", "specialty_directionalfire", "specialty_disarmexplosive", "specialty_doubletap", "specialty_earnmoremomentum", "specialty_electriccherry", "specialty_extraammo", "specialty_fallheight", "specialty_fastads", "specialty_fastequipmentuse", "specialty_fastladderclimb", "specialty_fastmantle", "specialty_fastmeleerecovery", "specialty_fastreload", "specialty_fasttoss", "specialty_fastweaponswitch", "specialty_finalstand", "specialty_fireproof", "specialty_flakjacket", "specialty_flashprotection", "specialty_gpsjammer", "specialty_grenadepulldeath", "specialty_healthregen", "specialty_holdbreath", "specialty_immunecounteruav", "specialty_immuneemp", "specialty_immunemms", "specialty_immunenvthermal", "specialty_immunerangefinder", "specialty_immunesmoke", "specialty_immunetriggerbetty", "specialty_immunetriggerc", "specialty_immunetriggershock", "specialty_jetcharger", "specialty_jetnoradar", "specialty_jetpack", "specialty_jetquiet", "specialty_killstreak", "specialty_longersprint", "specialty_loudenemies", "specialty_lowgravity", "specialty_marksman", "specialty_microwaveprotection", "specialty_microwaveprotection_damage_scalar", "specialty_microwaveprotection_shellshock_scalar", "specialty_microwaveprotection_viewkick_scalar", "specialty_movefaster", "specialty_nokillst", "specialty_nokillstreakreticle", "specialty_nomotionsensor", "specialty_noname", "specialty_nottargete", "specialty_nottargetedbyairsupport", "specialty_nottargetedbyaitank", "specialty_nottargetedbyraps", "specialty_nottargetedbyrobot", "specialty_nottargetedbysentry", "specialty_null", "specialty_overcharge", "specialty_phdflopper", "specialty_pin_back", "specialty_pistoldeath", "specialty_playeriszombie", "specialty_proximityprotection", "specialty_quickrevive", "specialty_quieter", "specialty_rof", "specialty_scavenger", "specialty_sengrenjammer", "specialty_shellshock", "specialty_showenemyequipment", "specialty_showenemyvehicles", "specialty_showscorestreakicons", "specialty_sixthsensejammer", "specialty_sixthsensejammer_distance_scalar", "specialty_sixthsensejammer_z_scalar", "specialty_spawnpingenemies", "specialty_sprintequipment", "specialty_sprintfire", "specialty_sprintfirerecovery", "specialty_sprintgrenadelethal", "specialty_sprintgrenadetactical", "specialty_sprintrecovery", "specialty_stalker", "specialty_staminup", "specialty_stunprotection", "specialty_teflon", "specialty_tombstone", "specialty_tracer", "specialty_tracker", "specialty_trackerjammer", "specialty_twogrenades", "specialty_twoprimaries", "specialty_unlimitedsprint", "specialty_vultureaid", "specialty_weapon_", "specialty_whoswho", "specialty_widowswine", "speech_active", "splitscreen", "splitscreen_horizontal", "splitscreen_playerCount", "splitscreen_playerNum", "sprint_b", "sprint_begin", "sprint_end", "sprint_forward", "sprint_gungho_lean_reaper_set", "sprint_gungho_lean_rifle_set", "sprint_gungho_lean_rifle_set_female", "sprint_l", "sprint_lean_armminigun_set", "sprint_lean_bow_set", "sprint_lean_brawler_set", "sprint_lean_brawler_set_female", "sprint_lean_dw_set", "sprint_lean_knife_set", "sprint_lean_knife_set_female", "sprint_lean_launcher_set", "sprint_lean_lmg_set", "sprint_lean_onehanded_set", "sprint_lean_pistol_set", "sprint_lean_pistol_set_female", "sprint_lean_rifle_set", "sprint_lean_rifle_set_female", "sprint_lean_smg_set", "sprint_lean_spikelauncher_set", "sprint_lean_spikelauncher_set_female", "sprint_lean_supply_drop_set", "sprint_pistol", "sprint_r", "sprint_rumble", "sprint_rumbleJ", "sprint_rumble_end", "sprint_rumble_start", "start_aim", "start_date", "start_destructible_explosion", "start_in_", "start_knife_flip", "start_match", "start_move", "start_plant_sound", "start_ragdoll", "start_transforming", "start_up", "state_combat_update", "stats_changed", "stats_cp", "stats_cp_nightmare", "stats_cp_nightmare_offline", "stats_cp_offline", "stats_fr", "stats_fr_offline", "stats_init", "stats_merged", "stats_modified_sent", "stats_mp", "stats_mp_offline", "stats_zm", "stats_zm_offline", "stop_aim", "stop_attackidle", "stop_attackidle_bark", "stop_attackidle_growl", "stop_color_forcegoal", "stop_color_move", "stop_crash_loop_sound", "stop_effects", "stop_enemy_killstreak", "stop_idle", "stop_loop", "stop_plant_sound", "stop_player_fx", "stop_revive_trigger", "stop_scripted_anim", "stop_soon", "stop_sound", "stop_suicide_trigger", "stop_tracking", "stringtable_debug", "sun_border_padding", "sun_disable_caching_split_screen", "sun_shadow_bias", "sun_umbra_planar", "suppression_end", "sv_allowClientConsole", "sv_allowedClan1", "sv_allowedClan2", "sv_archiveClientsPositions", "sv_botsoak", "sv_cheats", "sv_checkMinPlayers", "sv_clientArchive", "sv_clientFpsLimit", "sv_connectTimeout", "sv_cumulThinkTime", "sv_error_on_baseline_failure", "sv_exponentialBackoffAfterNonAckedMsgs", "sv_hostname", "sv_hugeSnapshotDelay", "sv_hugeSnapshotSize", "sv_iwdNames", "sv_iwds", "sv_keywords", "sv_kickBanTime", "sv_lastSaveGame", "sv_local_client_snapshot_msec", "sv_mapSwitchPreloadFrontend", "sv_maxclients", "sv_minPingClamp", "sv_network_fps", "sv_numExpBackoffBeforeReleasingCachedSnapshots", "sv_paused", "sv_privateClients", "sv_privateClientsForClients", "sv_privatePassword", "sv_reconnectlimit", "sv_referencedFFCheckSums", "sv_referencedFFNames", "sv_referencedIwdNames", "sv_referencedIwds", "sv_rejoinTimeout", "sv_remote_client_snapshot_joiningstate_msec", "sv_remote_client_snapshot_msec", "sv_resetOnSpawn", "sv_rewindPoseArchive", "sv_running", "sv_showAverageBPS", "sv_testValue", "sv_timeout", "sv_trackFrameMsecThreshold", "sv_useExtraCompress", "sv_zlib_threshold", "sv_zombietime", "svwp", "syncTimeTimeout", "sys_SSE", "sys_configSum", "sys_configureGHz", "sys_cpuGHz", "sys_cpuName", "sys_error", "sys_gpu", "sys_lockThreads", "sys_quitMigrateTime", "sys_smp_allowed", "sys_sysMB", "system_init_complete", "system_overload", "system_survey", "systemlink", "systemlink_host", "tag_acog", "tag_activate_clip_animate", "tag_ads", "tag_aframe_l_d", "tag_aframe_r_d", "tag_aileron_l_", "tag_aileron_r_", "tag_aim", "tag_aim_animated", "tag_aim_pitch", "tag_airbrake_front_bottom_animate", "tag_airbrake_front_left_animate", "tag_airbrake_front_right_animate", "tag_airbrake_front_top_animate", "tag_airbrake_rear_lower_left_animate", "tag_airbrake_rear_lower_right_animate", "tag_airbrake_rear_upper_left_animate", "tag_airbrake_rear_upper_right_animate", "tag_align", "tag_align_wardrobe_", "tag_ammo", "tag_ammo_belt", "tag_ammo_can", "tag_ammo_chute_", "tag_ammo_extmag_", "tag_ammo_feed_animate", "tag_ammo_sleeve", "tag_ammo_source_animate", "tag_animate", "tag_annihilator", "tag_antenna", "tag_antenna_animate", "tag_antenna_base_animate", "tag_antenna_head_animate", "tag_antenna_parent", "tag_arm_", "tag_arm_elbow_animate", "tag_arm_right_", "tag_armored_armbrace_animate", "tag_armored_bib_rotate_animate", "tag_armored_bib_slide_animate", "tag_arms", "tag_arrow", "tag_arrow_", "tag_arrow_animate", "tag_arrow_extend_fletching", "tag_arrow_extend_point", "tag_arrow_extend_shaft_mid", "tag_arrow_extend_shaft_small", "tag_arrow_extend_squish_point", "tag_arrow_grip", "tag_arrow_nock", "tag_attach", "tag_attach_dangle", "tag_attach_dead_body_front_burnt", "tag_attach_null", "tag_attach_ramp_animate", "tag_attachment", "tag_back_anim", "tag_back_handle_anim", "tag_barrel", "tag_barrel_", "tag_barrel_animate", "tag_barrel_attach", "tag_barrel_base", "tag_barrel_base_animate", "tag_barrel_base_attach", "tag_barrel_front", "tag_barrel_front_", "tag_barrel_le", "tag_barrel_mid", "tag_barrel_null", "tag_barrel_rear_animate", "tag_barrel_recoil", "tag_barrel_spin", "tag_barrel_spin_animate", "tag_base", "tag_base_d", "tag_base_front_animate", "tag_base_lower", "tag_base_rear_animate", "tag_base_upper", "tag_bcpu", "tag_bipod", "tag_bipod_left", "tag_bipod_left_animate", "tag_bipod_right", "tag_bipod_right_animate", "tag_blade_animate", "tag_blade_left_animate", "tag_blade_right_animate", "tag_board_", "tag_body", "tag_body_animate", "tag_body_d", "tag_bolt", "tag_bolt_", "tag_bolt_animate", "tag_bolt_animate_attach", "tag_bolt_animate_le", "tag_bolt_attach_animate", "tag_bolt_base_animate", "tag_bolt_base_attach_animate", "tag_bolt_hinge", "tag_bolt_hinge_animate", "tag_bolt_hinge_attach_animate", "tag_bolt_rear_animate", "tag_bolt_rear_attach_animate", "tag_bolt_release", "tag_bolt_release_animate", "tag_bolt_release_base", "tag_bolt_track_animate", "tag_bomb", "tag_bomb_animate", "tag_bomb_b_left_", "tag_bomb_b_right_", "tag_bomb_c_left_", "tag_bomb_c_right_", "tag_bow_string_animate", "tag_bow_string_animate_lower_", "tag_bow_string_animate_upper_", "tag_bracket_animate", "tag_bracket_lower_animate", "tag_brass", "tag_brass_", "tag_brass_le", "tag_breach_animate", "tag_bullet", "tag_bullet_", "tag_bullet_animate", "tag_bullet_animate_le", "tag_bumper_back_l_d", "tag_bumper_back_r_d", "tag_bumper_front", "tag_bumper_front_d", "tag_bumper_front_l_d", "tag_bumper_front_lower", "tag_bumper_front_r_d", "tag_bumper_low_d", "tag_bumper_low_phx", "tag_bumper_rear_low_d", "tag_bumper_rear_phx", "tag_butt", "tag_button", "tag_button_animate", "tag_button_le_animate", "tag_button_rt_animate", "tag_cab_glass_left_d", "tag_cab_glass_right_d", "tag_cab_wheel_left", "tag_cab_wheel_right", "tag_cam", "tag_cambone", "tag_camera", "tag_camera_animate", "tag_camera_cinematic", "tag_camera_head_animate", "tag_camera_l_animate", "tag_canopy_animate", "tag_cap_animate", "tag_cargo_hatch_igc_animate", "tag_cargo_hatch_low_animate", "tag_cargo_hatch_top_animate", "tag_carry_handle", "tag_carry_handle_animate", "tag_chair_l_animate", "tag_chair_l_d", "tag_chair_l_null", "tag_chair_l_phx", "tag_chair_r_animate", "tag_chair_r_d", "tag_chair_r_null", "tag_chair_r_phx", "tag_charging_handle", "tag_clacker_animate", "tag_clamp", "tag_clamp_left_animate", "tag_clamp_lleft_animate", "tag_clamp_plate_animate", "tag_clamp_plate_extmag_", "tag_clamp_release_animate", "tag_clamp_right_animate", "tag_clamps_lower_l_animate", "tag_clamps_lower_r_animate", "tag_clamps_upper_l_animate", "tag_clamps_upper_r_animate", "tag_clip", "tag_clip_a", "tag_clip_animate", "tag_clip_b", "tag_clip_bullet_animate", "tag_clip_c", "tag_clip_d", "tag_clip_damage", "tag_clip_fmj", "tag_clip_full_animate", "tag_clip_full_fmj", "tag_clip_handling", "tag_clip_le", "tag_clip_rotate_", "tag_clip_rotate_animate", "tag_clip_supply", "tag_cockpit_console", "tag_cockpit_console_l", "tag_cockpit_console_r", "tag_collision", "tag_connector_animate", "tag_connector_base_animate", "tag_control_dial_", "tag_control_panel", "tag_counterweight_animate", "tag_counterweight_attach_animate", "tag_coupler", "tag_coupler_animate", "tag_coupler_attach", "tag_cover_release_animate", "tag_cpu_attach", "tag_cylinder_animate", "tag_dbal", "tag_dbal_attach", "tag_deathfx", "tag_decibel_reader", "tag_detach", "tag_digital_readout", "tag_dish_left_animate", "tag_dish_right_animate", "tag_door_back_ext_animate", "tag_door_back_lower_animate", "tag_door_back_upper_animate", "tag_door_front_left_animate", "tag_door_front_left_null", "tag_door_front_right_animate", "tag_door_front_right_null", "tag_door_glass_left_d", "tag_door_glass_right_d", "tag_door_guard_front_l", "tag_door_guard_front_r", "tag_door_guard_rear_l", "tag_door_guard_rear_r", "tag_door_l_", "tag_door_le_animate", "tag_door_left", "tag_door_left_animate", "tag_door_left_front_animate", "tag_door_left_front_d", "tag_door_left_front_null", "tag_door_left_front_phx", "tag_door_left_rear", "tag_door_left_rear_animate", "tag_door_left_rear_d", "tag_door_left_rear_null", "tag_door_left_rear_phx", "tag_door_mid_le_animate", "tag_door_mid_rt_animate", "tag_door_r_", "tag_door_right", "tag_door_right_animate", "tag_door_right_front_animate", "tag_door_right_front_d", "tag_door_right_front_null", "tag_door_right_front_phx", "tag_door_right_rear", "tag_door_right_rear_animate", "tag_door_right_rear_d", "tag_door_right_rear_null", "tag_door_right_rear_phx", "tag_door_rt_animate", "tag_door_weapons_l_animate", "tag_door_weapons_r_animate", "tag_dragons_breath", "tag_driver", "tag_driver_camera", "tag_driver_enter", "tag_drone_attach_l", "tag_drone_attach_r", "tag_dummy", "tag_elbow_animate", "tag_engine_exhaust", "tag_engine_fx", "tag_engine_left", "tag_engine_left_animate", "tag_engine_left_code_control", "tag_engine_left_code_control_null", "tag_engine_left_null", "tag_engine_right", "tag_engine_right_animate", "tag_engine_right_code_control", "tag_engine_right_code_control_null", "tag_engine_right_null", "tag_engines_rear_fixed", "tag_enter_back", "tag_enter_driver", "tag_enter_gunner", "tag_enter_left", "tag_enter_passenger", "tag_enter_rider", "tag_enter_right", "tag_exhaust_left", "tag_exhaust_right", "tag_explosive", "tag_ext_clip", "tag_ext_fast_mag_animate", "tag_ext_fast_mag_attach_animate", "tag_ext_fast_mag_attach_bullet_animate", "tag_ext_fast_mag_bullet_animate", "tag_ext_mag", "tag_ext_mag_", "tag_ext_mag_animate", "tag_ext_mag_attach", "tag_ext_mag_attach_animate", "tag_ext_mag_bullet_animate", "tag_ext_mag_bullet_attach_animate", "tag_ext_mag_clamp_left_animate", "tag_ext_mag_clamp_right_animate", "tag_ext_mag_full_animate", "tag_ext_mag_full_fmj", "tag_ext_mag_release_animate", "tag_eye", "tag_eyeglow_left", "tag_eyeglow_right", "tag_fan_base_l", "tag_fan_base_l_parent", "tag_fan_base_r", "tag_fan_base_r_parent", "tag_fan_left", "tag_fan_left_animate", "tag_fan_left_d", "tag_fan_right", "tag_fan_right_animate", "tag_fan_right_d", "tag_fast_mag", "tag_fast_mag_animate", "tag_fast_mag_attach", "tag_fast_mag_attach_animate", "tag_fast_mag_attach_bullet_animate", "tag_fast_mag_bullet_animate", "tag_fastrope_le", "tag_fastrope_ri", "tag_fill_light", "tag_fire_switch", "tag_firing_pin_animate", "tag_firing_pin_base", "tag_firing_pin_base_animate", "tag_flamer_pilot_light", "tag_flap_arm_le_animate", "tag_flap_arm_rt_animate", "tag_flap_front_left_animate", "tag_flap_front_right_animate", "tag_flap_fx", "tag_flap_l_animate", "tag_flap_l_null", "tag_flap_le_animate", "tag_flap_mid_left_animate", "tag_flap_mid_right_animate", "tag_flap_r_animate", "tag_flap_r_null", "tag_flap_rear_left_animate", "tag_flap_rear_right_animate", "tag_flap_rt_animate", "tag_flash", "tag_flash_alt", "tag_flash_gunner", "tag_flash_le", "tag_flashlight", "tag_fmj", "tag_fmj_attach", "tag_fmj_le", "tag_focus", "tag_fog_light_left_d", "tag_fog_light_right_d", "tag_follow", "tag_foot_front_le_animate", "tag_foot_front_rt_animate", "tag_foot_fx_left_back", "tag_foot_fx_left_front", "tag_foot_fx_right_back", "tag_foot_fx_right_front", "tag_foot_rear_le_animate", "tag_foot_rear_rt_animate", "tag_foregrip", "tag_foregrip_animate", "tag_foregrip_attach", "tag_fork_animate", "tag_front_anim", "tag_front_canard_l_animate", "tag_front_canard_l_null", "tag_front_canard_r_animate", "tag_front_canard_r_null", "tag_front_gear_animate", "tag_front_gear_door_animate", "tag_front_handle_anim", "tag_frontgrip", "tag_fx", "tag_fx_arm", "tag_fx_brakelights_left_rear", "tag_fx_brakelights_right_rear", "tag_fx_countermeasures", "tag_fx_death", "tag_fx_engine_exhaust_back", "tag_fx_engine_exhaust_l", "tag_fx_engine_exhaust_r", "tag_fx_engine_exhaust_rear", "tag_fx_engine_left", "tag_fx_engine_left_back", "tag_fx_engine_left_front", "tag_fx_engine_right", "tag_fx_engine_right_back", "tag_fx_engine_right_front", "tag_fx_exhaust", "tag_fx_fan_wash", "tag_fx_front", "tag_fx_headlight", "tag_fx_headlight_l", "tag_fx_headlight_left", "tag_fx_headlight_r", "tag_fx_headlight_right", "tag_fx_interior_l", "tag_fx_interior_r", "tag_fx_jet_left_front", "tag_fx_jet_left_rear", "tag_fx_jet_right_front", "tag_fx_jet_right_rear", "tag_fx_jet_top_front", "tag_fx_jet_top_rear", "tag_fx_left", "tag_fx_left_hand", "tag_fx_light_back_left", "tag_fx_light_back_right", "tag_fx_light_beacon", "tag_fx_light_belly", "tag_fx_light_camera", "tag_fx_light_front_left", "tag_fx_light_front_right", "tag_fx_light_frontspot_left", "tag_fx_light_frontspot_ll", "tag_fx_light_frontspot_lr", "tag_fx_light_frontspot_right", "tag_fx_light_frontspot_ul", "tag_fx_light_frontspot_ur", "tag_fx_light_landinglight_left", "tag_fx_light_landinglight_right", "tag_fx_light_left", "tag_fx_light_nose", "tag_fx_light_parking_left", "tag_fx_light_parking_right", "tag_fx_light_rear", "tag_fx_light_right", "tag_fx_light_tail", "tag_fx_light_tail_left", "tag_fx_light_tail_right", "tag_fx_light_top", "tag_fx_light_troops_door_left", "tag_fx_light_troops_door_right", "tag_fx_light_troops_ext_rear_left", "tag_fx_light_troops_ext_rear_right", "tag_fx_light_troops_front_left", "tag_fx_light_troops_front_right", "tag_fx_light_troops_int_front", "tag_fx_light_troops_int_rear", "tag_fx_light_troops_seat", "tag_fx_light_wing_green", "tag_fx_light_wing_left", "tag_fx_light_wing_red", "tag_fx_light_wing_right", "tag_fx_raps_left", "tag_fx_raps_right", "tag_fx_right", "tag_fx_right_hand", "tag_fx_rocket_pod_l", "tag_fx_rocket_pod_r", "tag_fx_scanner", "tag_fx_shield_l", "tag_fx_shield_r", "tag_fx_smoke", "tag_fx_tail", "tag_fx_tail_light_left", "tag_fx_tail_light_right", "tag_fx_thruster", "tag_fx_thruster_back_left_inner", "tag_fx_thruster_back_left_outer", "tag_fx_thruster_back_right_inner", "tag_fx_thruster_back_right_outer", "tag_fx_thruster_front_left_inner", "tag_fx_thruster_front_left_outer", "tag_fx_thruster_front_right_inner", "tag_fx_thruster_front_right_outer", "tag_fx_thrusters_belly_small_left", "tag_fx_thrusters_belly_small_right", "tag_gangway_attach", "tag_gasmask", "tag_gear_rear_animate", "tag_gear_shift_animate", "tag_geararm_l_animate", "tag_geararm_r_animate", "tag_geardoor_left", "tag_geardoor_rear_left", "tag_geardoor_rear_right", "tag_geardoor_right", "tag_gearpiston_a_l_animate", "tag_gearpiston_a_r_animate", "tag_gearpiston_b_l_animate", "tag_gearpiston_b_r_animate", "tag_gearpivot_l_animate", "tag_gearpivot_r_animate", "tag_glass_back_d", "tag_glass_front_d", "tag_glass_front_left_animate", "tag_glass_front_right_animate", "tag_glass_hud_d", "tag_glass_left_front_animate", "tag_glass_left_front_d", "tag_glass_left_rear_animate", "tag_glass_left_rear_d", "tag_glass_right_front_animate", "tag_glass_right_front_d", "tag_glass_right_rear_animate", "tag_glass_right_rear_d", "tag_glint", "tag_grip", "tag_grip_attach", "tag_grip_le", "tag_grip_off", "tag_grip_on", "tag_grip_safety_animate", "tag_grip_tape", "tag_gun", "tag_gun_right_hide", "tag_gunner", "tag_gunner_aim", "tag_gunner_barrel", "tag_gunner_brass", "tag_gunner_flash", "tag_gunner_hands", "tag_gunner_pov", "tag_gunner_spin", "tag_gunner_turret", "tag_guy", "tag_hammer", "tag_hammer_animate", "tag_hammer_animate_le", "tag_hammer_attach_animate", "tag_hammer_le", "tag_hand_ball_animate", "tag_handguard", "tag_handguard_attach", "tag_handguard_left_animate", "tag_handguard_left_attach_animate", "tag_handguard_right_animate", "tag_handguard_right_attach_animate", "tag_handguard_strap", "tag_handguard_top", "tag_handle", "tag_handle_animate", "tag_handle_attach", "tag_handle_le", "tag_head", "tag_head_slide_animate", "tag_headlight_glass_left_d", "tag_headlight_glass_right_d", "tag_headlight_left", "tag_headlight_left_d", "tag_headlight_right", "tag_headlight_right_d", "tag_hinge_bottom_animate", "tag_hinge_front_left_animate", "tag_hinge_front_right_animate", "tag_hinge_mid_left_animate", "tag_hinge_mid_right_animate", "tag_hinge_rear_left_animate", "tag_hinge_rear_right_animate", "tag_hinge_top_animate", "tag_holo", "tag_hood", "tag_hood_animate", "tag_hood_d", "tag_hood_null", "tag_hood_phx", "tag_housing_left_animate", "tag_housing_right_animate", "tag_hybrid", "tag_inhand", "tag_int_mirror", "tag_int_mirror_mount", "tag_interior", "tag_interior_d", "tag_interior_ring_", "tag_jetpack_left", "tag_jetpack_right", "tag_jets_left_back", "tag_jets_left_front", "tag_jets_left_side", "tag_jets_right_back", "tag_jets_right_front", "tag_jets_right_side", "tag_kc", "tag_knife", "tag_knife_attach", "tag_knife_fx", "tag_l_wing_large_feather", "tag_landing_gear", "tag_landing_gear_back_", "tag_landing_gear_back_door_l_animate", "tag_landing_gear_back_door_r_animate", "tag_landing_gear_door_l_", "tag_landing_gear_door_r_", "tag_landing_gear_front", "tag_landing_gear_l_", "tag_landing_gear_left_bottom", "tag_landing_gear_left_flap", "tag_landing_gear_left_ski", "tag_landing_gear_left_top", "tag_landing_gear_r_", "tag_landing_gear_right_bottom", "tag_landing_gear_right_flap", "tag_landing_gear_right_ski", "tag_landing_gear_right_top", "tag_laptop_scrn_animate", "tag_laser", "tag_laser_attach", "tag_laser_iron_sight", "tag_laser_le", "tag_launcher_attach", "tag_left_bracket_animate", "tag_left_door", "tag_left_frame_animate", "tag_left_gear_animate", "tag_left_gear_door_b_animate", "tag_left_handle_animate", "tag_left_hindge_animate", "tag_left_panel", "tag_left_support_base", "tag_left_support_mid", "tag_left_tail", "tag_left_wheel_back_", "tag_left_wheel_front_", "tag_left_wingtip", "tag_leg", "tag_leg_", "tag_leg_animate", "tag_leg_front", "tag_leg_front_animate", "tag_leg_front_le_animate", "tag_leg_front_mid_animate", "tag_leg_front_mid_hinge", "tag_leg_front_rt_animate", "tag_leg_left", "tag_leg_left_animate", "tag_leg_left_foot_animate", "tag_leg_rear", "tag_leg_rear_le_animate", "tag_leg_rear_mid_animate", "tag_leg_rear_mid_hinge", "tag_leg_rear_rt_animate", "tag_leg_right", "tag_leg_right_animate", "tag_leg_right_foot_animate", "tag_leg_slide", "tag_leg_slide_animate", "tag_legs", "tag_legs_hinge_anim", "tag_lens", "tag_lens_animate", "tag_lever", "tag_lever_action_animate", "tag_lever_animate", "tag_lever_top", "tag_lever_top_attach", "tag_licenseplate_d", "tag_licenseplate_front_d", "tag_lid", "tag_lid_animate", "tag_lid_attach_animate", "tag_lid_attach_release_animate", "tag_lid_base_animate", "tag_lid_base_release_animate", "tag_lid_internals", "tag_lift_animate", "tag_light", "tag_light_belly", "tag_light_fx", "tag_light_left_back_d", "tag_light_nose", "tag_light_right_back_d", "tag_light_tail", "tag_lights_back_left_d", "tag_lights_back_right_d", "tag_lock_left_animate", "tag_lock_rear_animate", "tag_lock_right_animate", "tag_lockon", "tag_long_barrel_attach", "tag_lower", "tag_lower_attach", "tag_lower_bomblet_", "tag_lower_panel_animate", "tag_lower_panel_hand_rotate_animate", "tag_lower_panel_hand_track_animate", "tag_lra", "tag_mag", "tag_mag_bolt_left_animate", "tag_mag_bolt_right_animate", "tag_mag_chain_", "tag_mag_cover", "tag_mag_ext_animate", "tag_mag_ext_bullet_animate", "tag_mag_push_animate", "tag_mag_release", "tag_mag_release_animate", "tag_mag_release_lt_animate", "tag_mag_release_rt_animate", "tag_mag_screw", "tag_mag_sleeve", "tag_mag_track", "tag_magwell_hinge_left_", "tag_magwell_hinge_right_", "tag_magwell_left", "tag_magwell_left_animate", "tag_magwell_right", "tag_magwell_right_animate", "tag_main_rotor", "tag_main_rotor_blur", "tag_main_rotor_d", "tag_main_rotor_offset", "tag_main_rotor_static", "tag_microwavefx", "tag_microwavefxB", "tag_midwing_arm_l_animate", "tag_midwing_arm_r_animate", "tag_midwing_base_l_animate", "tag_midwing_base_r_animate", "tag_midwing_l_animate", "tag_midwing_r_animate", "tag_midwing_skid_l_animate", "tag_midwing_skid_r_animate", "tag_midwingflap_l_animate", "tag_midwingflap_r_animate", "tag_midwingtip_l_animate", "tag_midwingtip_r_animate", "tag_military_tablet_anim", "tag_military_tablet_lam_special_anim", "tag_military_tablet_light_anim", "tag_minigun_flaps", "tag_minigun_mount", "tag_minigun_spin", "tag_mirror_left_d", "tag_mirror_right_d", "tag_missile", "tag_missile_launcher_", "tag_missile_loader", "tag_monitor_animate", "tag_mount", "tag_mouth_fx", "tag_muzzle", "tag_muzzle_attach", "tag_muzzle_le", "tag_nacelle_l_back_animate", "tag_nacelle_l_back_null", "tag_nacelle_l_back_parent", "tag_nacelle_l_front_animate", "tag_nacelle_l_front_null", "tag_nacelle_l_front_parent", "tag_nacelle_r_back_animate", "tag_nacelle_r_back_null", "tag_nacelle_r_back_parent", "tag_nacelle_r_front_animate", "tag_nacelle_r_front_null", "tag_nacelle_r_front_parent", "tag_nameplate", "tag_number_", "tag_optic_bottom_right", "tag_optic_center", "tag_optic_top_left", "tag_orient", "tag_origin", "tag_originB", "tag_origin_animate", "tag_packanim", "tag_packglow", "tag_panel", "tag_panel_", "tag_panel_animate", "tag_panel_back_d", "tag_panel_back_l_d", "tag_panel_back_r_d", "tag_panel_engine_l_d", "tag_panel_engine_r_d", "tag_panel_front_d", "tag_panel_front_l_d", "tag_panel_front_lower_l_d", "tag_panel_front_lower_r_d", "tag_panel_front_r_d", "tag_panel_l_d", "tag_panel_lower_left_", "tag_panel_r_d", "tag_panel_rear_l_d", "tag_panel_rear_r_d", "tag_panel_skirt_l_d", "tag_panel_skirt_r_d", "tag_panel_top_d", "tag_panel_upper_left_", "tag_panel_upper_left_hinge_", "tag_passenger", "tag_piece_body", "tag_pilot_fx", "tag_pin_animate", "tag_pintle_mount", "tag_piston", "tag_piston_", "tag_piston_ramp_top_l_animate", "tag_piston_ramp_top_r_animate", "tag_pivot", "tag_pivot_", "tag_pivot_animate", "tag_player", "tag_playerride", "tag_popout", "tag_pov_hide", "tag_power_switch", "tag_pump_animate", "tag_pump_attach_animate", "tag_r_wing_feather_grp_l_wing_large_feather", "tag_rail", "tag_rail_attach", "tag_rail_cover", "tag_rail_cover_attach", "tag_rail_covers", "tag_rails", "tag_rails_bottom", "tag_rails_side", "tag_rapidfire_attach_animate", "tag_raps_deploy_left", "tag_raps_deploy_right", "tag_raps_drop_left", "tag_raps_drop_right", "tag_reactive_armor_r_d", "tag_rear_gear_door_a", "tag_rear_gear_door_a_animate", "tag_rear_gear_door_b", "tag_rear_gear_door_b_animate", "tag_receiver", "tag_receiver_attach", "tag_receiver_plate", "tag_receiver_upper_animate", "tag_receiver_upper_attach_animate", "tag_reflector_rear_l_d", "tag_reflector_rear_r_d", "tag_reflex", "tag_release_lever_animate", "tag_reload_arm", "tag_reload_cover_animate", "tag_reload_cover_base_animate", "tag_reload_cover_hinge_animate", "tag_reload_cover_plate_", "tag_rider", "tag_right_bracket_animate", "tag_right_door", "tag_right_frame_animate", "tag_right_gear_animate", "tag_right_gear_door_b_animate", "tag_right_handle_animate", "tag_right_hindge_animate", "tag_right_panel", "tag_right_support_base", "tag_right_support_mid", "tag_right_tail", "tag_right_wheel_back_", "tag_right_wheel_front_", "tag_right_wingtip", "tag_ring", "tag_ring_animate", "tag_ring_base", "tag_ring_cloth_animate", "tag_riot_shield", "tag_rise", "tag_rmr", "tag_rocket", "tag_rocket_attch_l", "tag_rocket_attch_r", "tag_rocket_left", "tag_rocket_pod_l_d", "tag_rocket_pod_r_d", "tag_rocket_right", "tag_rocket_tube", "tag_rocket_tube_animate", "tag_roof_d", "tag_rotate_animate", "tag_rotor_arm_left", "tag_rotor_arm_left_null", "tag_rotor_arm_right", "tag_rotor_arm_right_null", "tag_rotor_fl", "tag_rotor_fl_arm", "tag_rotor_fl_arm_parent", "tag_rotor_fl_null", "tag_rotor_fr", "tag_rotor_fr_arm", "tag_rotor_fr_arm_parent", "tag_rotor_fr_null", "tag_rotor_left", "tag_rotor_left_null", "tag_rotor_main", "tag_rotor_main_animate", "tag_rotor_main_null", "tag_rotor_offest", "tag_rotor_right", "tag_rotor_right_null", "tag_rotor_rl", "tag_rotor_rl_arm", "tag_rotor_rl_arm_parent", "tag_rotor_rl_null", "tag_rotor_rr", "tag_rotor_rr_arm", "tag_rotor_rr_arm_parent", "tag_rotor_rr_null", "tag_rotor_tail", "tag_rotor_tail_animate", "tag_rotor_tail_null", "tag_rudder_l_animate", "tag_rudder_r_animate", "tag_scanner", "tag_scanner_animate", "tag_scanner_base", "tag_scanner_base_animate", "tag_scanner_top_animate", "tag_scope", "tag_screen", "tag_screen_", "tag_screen_bottom_left", "tag_screen_bottom_left_", "tag_screen_bottom_right", "tag_screen_bottom_right_", "tag_screen_left_animate", "tag_screen_right_animate", "tag_screen_top_left", "tag_screen_top_left_", "tag_screen_top_right", "tag_screen_top_right_", "tag_screw_main_animate", "tag_seat", "tag_seat_left", "tag_seat_left_animate", "tag_seat_right", "tag_seat_right_animate", "tag_selectfire_animate", "tag_selectfire_animate_le", "tag_sensor", "tag_shell_animate", "tag_shield", "tag_shield_l_lower_d", "tag_shield_l_upper_d", "tag_shield_r_lower_d", "tag_shield_r_upper_d", "tag_shroud", "tag_shroud_attach_animate", "tag_shroud_left_animate", "tag_shroud_left_attach_animate", "tag_shroud_right_animate", "tag_shroud_right_attach_animate", "tag_side_door_tl_animate", "tag_side_door_tr_animate", "tag_side_panel_animate", "tag_side_panel_base_animate", "tag_side_panel_hinge_animate", "tag_side_rail", "tag_side_rails", "tag_sidegun_arm_l_animate", "tag_sidegun_arm_r_animate", "tag_sidegun_pivot_l_animate", "tag_sidegun_pivot_r_animate", "tag_sidegun_rotate_l_animate", "tag_sidegun_rotate_r_animate", "tag_sight_back", "tag_sight_hinge", "tag_sight_level", "tag_sights", "tag_sights_front", "tag_sights_front_off", "tag_sights_front_on", "tag_sights_le", "tag_sights_off", "tag_sights_on", "tag_sights_rear", "tag_sights_rear_off", "tag_sights_rear_on", "tag_sights_up_animate", "tag_silencer", "tag_silencer_attach", "tag_skid_l_animate", "tag_skid_r_animate", "tag_skidtip_l", "tag_skidtip_r", "tag_slide_animate", "tag_slide_animate_le", "tag_sling_animate", "tag_sling_end_animate", "tag_sling_mid_animate", "tag_sling_ring", "tag_sling_ring_animate", "tag_sling_ring_base", "tag_spike_", "tag_spike_left", "tag_spike_left_animate", "tag_spike_left_cap", "tag_spike_left_cap_animate", "tag_spike_left_end", "tag_spike_left_end_animate", "tag_spike_left_guard", "tag_spike_left_guard_animate", "tag_spike_left_spin_bottom", "tag_spike_left_spin_bottom_animate", "tag_spike_left_spin_top", "tag_spike_left_spin_top_animate", "tag_spike_right", "tag_spike_right_animate", "tag_spike_right_cap", "tag_spike_right_cap_animate", "tag_spike_right_end", "tag_spike_right_end_animate", "tag_spike_right_guard", "tag_spike_right_guard_animate", "tag_spike_right_spin_bottom", "tag_spike_right_spin_bottom_animate", "tag_spike_right_spin_top", "tag_spike_right_spin_top_animate", "tag_spikes", "tag_spikes_animate", "tag_spin", "tag_spinner_animate", "tag_spinner_l_", "tag_spinner_l_front", "tag_spinner_r_", "tag_spinner_r_front", "tag_spotlight", "tag_stab_animate", "tag_stabilizer_l_animate", "tag_stabilizer_l_null", "tag_stabilizer_r_animate", "tag_stabilizer_r_null", "tag_steering_wheel_animate", "tag_step_cover_l_animate", "tag_step_cover_r_animate", "tag_step_l_", "tag_step_r_", "tag_stock", "tag_stock_animate", "tag_stock_attach", "tag_stock_attach_animate", "tag_store_r_", "tag_stowed_back", "tag_stowed_hip_rear", "tag_strap", "tag_strap_", "tag_straps", "tag_suspension", "tag_sync", "tag_tactical_link", "tag_tail_l_d", "tag_tail_left", "tag_tail_light_left", "tag_tail_light_right", "tag_tail_r_d", "tag_tail_right", "tag_tail_rotor", "tag_tail_rotor_blur", "tag_tail_rotor_d", "tag_tail_rotor_static", "tag_tail_top_left_animate", "tag_tail_top_right_animate", "tag_tailgate_rear", "tag_tailgate_rear_animate", "tag_tailgate_rear_d", "tag_target", "tag_target_fan_left_inner", "tag_target_fan_left_outer", "tag_target_fan_right_inner", "tag_target_fan_right_outer", "tag_target_l", "tag_target_lower", "tag_target_lowerZ", "tag_target_r", "tag_thermal", "tag_thruster_fx_", "tag_top", "tag_top_panel_animate", "tag_top_panel_base_animate", "tag_top_panel_hinge_animate", "tag_top_rail", "tag_top_rgail", "tag_torso", "tag_track", "tag_trailer_animate", "tag_trailer_stand_animate", "tag_trailer_wheel_back_left", "tag_trailer_wheel_back_right", "tag_trailer_wheel_left", "tag_trailer_wheel_right", "tag_tread_axil_back_left_animate", "tag_tread_axil_back_left_null", "tag_tread_axil_back_right_animate", "tag_tread_axil_back_right_null", "tag_tread_axil_front_left_animate", "tag_tread_axil_front_left_null", "tag_tread_axil_front_right_animate", "tag_tread_axil_front_right_null", "tag_trigger", "tag_trigger_animate", "tag_trigger_animate_le", "tag_trigger_attach_animate", "tag_trigger_le", "tag_troop_carrier_door_left_animate", "tag_troop_carrier_door_right_animate", "tag_troops_animate", "tag_trunk_animate", "tag_trunk_d", "tag_trunk_light_l_d", "tag_trunk_light_r_d", "tag_trunk_null", "tag_trunk_phx", "tag_tube_release_animate", "tag_turret", "tag_turret_animate", "tag_turret_arm_animate", "tag_turret_attach", "tag_turret_canopy_animate", "tag_turret_d", "tag_turret_head_elevate_animate", "tag_turret_head_yaw_animate", "tag_turret_null", "tag_turret_panel_", "tag_underbody_d", "tag_upper", "tag_upper_attach", "tag_upper_bomblet_", "tag_upper_le", "tag_upper_plate_animate", "tag_view", "tag_viewmodel", "tag_wake", "tag_walker", "tag_weapon", "tag_weapon_attach_left", "tag_weapon_attach_right", "tag_weapon_chest", "tag_weapon_index_", "tag_weapon_le", "tag_weapon_left", "tag_weapon_mid_", "tag_weapon_pinky_", "tag_weapon_pinky_base", "tag_weapon_right", "tag_weapon_ring_", "tag_weapon_ring_base", "tag_weapon_thumb_", "tag_weapon_wrist", "tag_weaponbay_hellfire_left", "tag_weaponbay_hellfire_right", "tag_weaponbay_left", "tag_weaponbay_right", "tag_wheel_attach", "tag_wheel_back", "tag_wheel_back_animate", "tag_wheel_back_d", "tag_wheel_back_left", "tag_wheel_back_left_animate", "tag_wheel_back_left_null", "tag_wheel_back_left_spin", "tag_wheel_back_left_steer", "tag_wheel_back_left_tire", "tag_wheel_back_left_tire_d", "tag_wheel_back_null", "tag_wheel_back_right", "tag_wheel_back_right_animate", "tag_wheel_back_right_null", "tag_wheel_back_right_spin", "tag_wheel_back_right_steer", "tag_wheel_back_right_tire", "tag_wheel_back_right_tire_d", "tag_wheel_back_spin", "tag_wheel_back_steer", "tag_wheel_back_steer_animate", "tag_wheel_back_steer_null", "tag_wheel_front", "tag_wheel_front_left", "tag_wheel_front_left_animate", "tag_wheel_front_left_d", "tag_wheel_front_left_null", "tag_wheel_front_left_spin", "tag_wheel_front_left_steer", "tag_wheel_front_left_tire", "tag_wheel_front_left_tire_d", "tag_wheel_front_right", "tag_wheel_front_right_animate", "tag_wheel_front_right_d", "tag_wheel_front_right_null", "tag_wheel_front_right_spin", "tag_wheel_front_right_steer", "tag_wheel_front_right_tire", "tag_wheel_front_right_tire_d", "tag_wheel_lf_", "tag_wheel_lr_", "tag_wheel_middle_left", "tag_wheel_middle_left_spin", "tag_wheel_middle_right", "tag_wheel_middle_right_spin", "tag_wheel_rear_left_d", "tag_wheel_rear_right_d", "tag_wheel_rf_", "tag_wheel_rr_", "tag_windshield_d", "tag_wing_armor_l_d", "tag_wing_armor_r_d", "tag_wing_bottom_left", "tag_wing_bottom_right", "tag_wing_flap_bottom_left", "tag_wing_flap_bottom_right", "tag_wing_flap_l", "tag_wing_flap_left_animate", "tag_wing_flap_r", "tag_wing_flap_right_animate", "tag_wing_flap_top_left", "tag_wing_front_", "tag_wing_hinge_bottom_left", "tag_wing_hinge_bottom_right", "tag_wing_hinge_left", "tag_wing_hinge_right", "tag_wing_hinge_top_left", "tag_wing_hinge_top_right", "tag_wing_l_d", "tag_wing_left", "tag_wing_left_base", "tag_wing_lock_bottom_left", "tag_wing_lock_bottom_right", "tag_wing_lock_l", "tag_wing_lock_r", "tag_wing_lock_top_left", "tag_wing_r_d", "tag_wing_rear_", "tag_wing_right", "tag_wing_right_base", "tag_wing_slide_bottom_left_animate", "tag_wing_slide_bottom_right_animate", "tag_wing_slide_top_left_animate", "tag_wing_slide_top_right_animate", "tag_wing_tip_left", "tag_wing_tip_right", "tag_wing_top_left", "tag_wrap", "target_bRca", "target_boundingisunderreticle", "target_clearreticlelockon", "target_getarray", "target_getoffset", "target_isincircle", "target_isinrect", "target_istarget", "target_meleed", "target_originisincircle", "target_remove", "target_scaleminmaxradius", "target_script_trigger", "target_set", "target_setAttackMode", "target_setjavelinonly", "target_setoffscreenshader", "target_setoffset", "target_setshader", "target_setturretaquire", "target_startreticlelockon", "targetted_by_zombie", "tb_report", "team_changed", "team_grenade_throw", "team_icon", "team_indicator", "team_kill", "team_rebalance", "team_switch", "team_t", "teambalance_option", "thermalBlurFactorNoScope", "thermalBlurFactorScope", "thermal_playerModel", "tokensEnabled", "total_bytes", "total_distance_travelled", "total_score", "total_shots", "total_speeds_when_moving", "tracer_explosiveColor1", "tracer_explosiveColor2", "tracer_explosiveColor3", "tracer_explosiveColor4", "tracer_explosiveColor5", "tracer_explosiveOverride", "tracer_explosiveWidth", "tracer_firstPersonMaxWidth", "tracer_stoppingPowerColor1", "tracer_stoppingPowerColor2", "tracer_stoppingPowerColor3", "tracer_stoppingPowerColor4", "tracer_stoppingPowerColor5", "tracer_stoppingPowerOverride", "tracer_stoppingPowerWidth", "tracer_thermalWidthMult", "transients_verbose", "traverse_default", "traverse_jump_down_", "traverse_jump_up_", "traverse_through_hole_", "traverse_wallhop", "traverse_window", "triggerDLCEnumerationOnSocialConfigLoad", "trigger_box", "trigger_box_use", "trigger_damage", "trigger_delete", "trigger_delete_on_touch", "trigger_disk", "trigger_group_", "trigger_hint", "trigger_hurt", "trigger_ik_playerclip_terrain", "trigger_lookat", "trigger_multiple", "trigger_navmesh", "trigger_now_clear", "trigger_off", "trigger_once", "trigger_out_of_bounds", "trigger_radius", "trigger_radius_hurt", "trigger_radius_use", "trigger_spawner", "trigger_type", "trigger_unlock", "trigger_use", "trigger_use_doubletap", "trigger_use_touch", "truck_cam", "turret_bo", "turret_close", "turret_cooldown_max", "turret_cooldown_min", "turret_deactivate", "turret_destroyed", "turret_disabled", "turret_drop", "turret_drop_mpI", "turret_enabled", "turret_enemy_detect_freq", "turret_fire", "turret_fire_burst_max", "turret_fire_burst_min", "turret_fire_power_loss", "turret_microwave_close", "turret_microwave_init", "turret_microwave_open", "turret_not_on_target", "turret_on_target", "turret_return_default_pos", "turret_rotate_moving", "turret_rotate_stopped", "turret_scan_start", "turret_scan_stop", "turret_target_aquired", "turret_target_lost", "turret_tow_fire", "turret_tow_unlink", "turret_visionset", "ui_allow_controlschange", "ui_allow_teamchange", "ui_allowvote", "ui_arrow_left", "ui_arrow_right", "ui_autodetectGamepad", "ui_autodetectGamepadDone", "ui_bigFont", "ui_blur", "ui_blurAmount", "ui_blurDarkenAmount", "ui_blurTime", "ui_borderLowLightScale", "ui_browserFriendlyfire", "ui_browserKillcam", "ui_browserMod", "ui_browserShowDedicated", "ui_browserShowEmpty", "ui_browserShowFull", "ui_browserShowPassword", "ui_browserShowPure", "ui_browser_new", "ui_buildLocation", "ui_buildSize", "ui_button_ps", "ui_cam_cac_ar_accuratek", "ui_cam_cac_ar_standard", "ui_cam_cac_lmg_heavy", "ui_cam_cac_lmg_slowfire", "ui_cam_cac_shotgun_precision", "ui_cam_cac_shotgun_semiauto", "ui_cam_cac_smg_burst", "ui_cam_cac_sniper_powerbolt", "ui_cam_char_customization_icons", "ui_cam_char_customization_icons_render", "ui_cam_char_frozenmoments", "ui_cam_char_identity", "ui_cam_character_customization", "ui_cam_endgame_mp_apartments", "ui_cam_endgame_mp_sector", "ui_cam_frontend_crate_in", "ui_cam_frontend_hero_battery", "ui_cam_frontend_hero_enforcer", "ui_cam_frontend_hero_firebreak", "ui_cam_frontend_hero_mercenary", "ui_cam_frontend_hero_nomad", "ui_cam_frontend_hero_outrider", "ui_cam_frontend_hero_prophet", "ui_cam_frontend_hero_reaper", "ui_cam_frontend_hero_spectre", "ui_challenge_1_ref", "ui_challenge_2_ref", "ui_challenge_3_ref", "ui_challenge_4_ref", "ui_challenge_5_ref", "ui_challenge_6_ref", "ui_challenge_7_ref", "ui_cinematicsTimestamp", "ui_connectScreenTextGlowColor", "ui_contextualMenuLocation", "ui_currentFeederMapIndex", "ui_currentMap", "ui_cursor", "ui_customClassName", "ui_customModeEditName", "ui_customModeName", "ui_customerServiceURL", "ui_danger_team", "ui_deadquote", "ui_debugMode", "ui_demoname", "ui_disableInGameStore", "ui_disableTokenRedemption", "ui_drawCrosshair", "ui_editSquadMemberIndex", "ui_enable_cp", "ui_enable_set_rewards", "ui_execdemo_beta", "ui_execdemo_e", "ui_execdemo_gamescom", "ui_execdemo_gamescom_host", "ui_extraBigFont", "ui_friendlyfire", "ui_gametype", "ui_generic_status_bar", "ui_guncycle", "ui_halftime", "ui_hostname", "ui_hud_hardcore", "ui_hud_obituaries", "ui_hud_showdeathicons", "ui_hud_showobjicons", "ui_inGameStoreOpen", "ui_inactiveBaseColor", "ui_inactivePartyColor", "ui_joinGametype", "ui_keyboard_cancel", "ui_keyboard_complete", "ui_keyboard_input", "ui_keyboard_new", "ui_keyboard_update", "ui_lastServerRefresh_", "ui_line_graph", "ui_loadMenuName", "ui_lobbyDebugSessionSQJ", "ui_lobbyDebugVis", "ui_map", "ui_mapname", "ui_mapvote_entrya_gametype", "ui_mapvote_entrya_mapname", "ui_mapvote_entryb_gametype", "ui_mapvote_entryb_mapname", "ui_maxclients", "ui_menuAttachUnlocks", "ui_menuCamoUnlocks", "ui_missingMapName", "ui_motd", "ui_mousePitch", "ui_mouse_char_rot", "ui_mp", "ui_multiplayer", "ui_myPartyColor", "ui_netGametype", "ui_netGametypeName", "ui_netSource", "ui_normal", "ui_onlineRequired", "ui_opensummary", "ui_partyFull", "ui_playerPartyColor", "ui_playlistActionButtonAlpha", "ui_playlistCategoryDisabledColor", "ui_playlistCategoryEnabledColor", "ui_promotion", "ui_resetSelectedPlayerXuid", "ui_scorelimit", "ui_screenshot", "ui_scrollbar_arrow_left", "ui_scrollbar_arrow_right", "ui_selectedFeederMap", "ui_serverStatusTimeOut", "ui_showDLCMaps", "ui_showList", "ui_showMenuOnly", "ui_show_depot", "ui_show_store", "ui_showmap", "ui_singlemission", "ui_singlemission_difficulty", "ui_sliderSteps", "ui_smallFont", "ui_textScrollFadeTime", "ui_textScrollPauseEnd", "ui_textScrollPauseStart", "ui_textScrollSpeed", "ui_text_endreason", "ui_timelimit", "ui_weapon_tiers", "ui_zm_gamemodegroup", "uin_alert_lockon", "uin_alert_lockon_start", "uin_c", "uin_chyron_loop", "uin_gamble_perk", "uin_igc_skip", "uin_lobby_closed", "uin_lobby_enter", "uin_mp_combat_bot_escort", "uin_mp_combat_bot_guard", "uin_notify_data_loop", "uin_objective_updated", "uin_out_of_bounds_loop", "uin_paint_image_manipulate", "uin_pip_close", "uin_pip_open", "uin_pulse_text_delete", "uin_pulse_text_type", "uin_sh_html_highlight", "uin_sixth_sense_ping_on", "uin_start_count_down", "uin_timer", "uin_timer_esports_last_beep", "uiscript_debug", "useCPMarkerForCPOwnership", "useRelativeTeamColors", "useTagFlashSilenced", "use_audio_max_speed", "use_engine_damage_sounds", "use_filtered_query_pass", "use_lighting_ent", "use_weighted_dlc_exactmatch_pass", "use_weighted_pass", "useonlinestats", "userFileFetchTimeout", "userGroup_RetryTime", "userGroup_active", "userGroup_cool_off_time", "userGroup_coop_delay", "userGroup_max_retry_time", "userGroup_refresh_time_secs", "userGroup_retry_step", "using_animtree", "using_mlg", "validate_apply_revert_full", "validate_clamp_assists", "validate_clamp_experience", "validate_clamp_headshots", "validate_clamp_hits", "validate_clamp_kills", "validate_clamp_losses", "validate_clamp_misses", "validate_clamp_ties", "validate_clamp_totalshots", "validate_clamp_weaponXP", "validate_clamp_wins", "validate_drop_on_fail", "vehAudio_inAirPitchDownLerp", "vehAudio_inAirPitchUpLerp", "vehAudio_spawnVolumeTime", "vehCam_freeLook", "vehDroneDebugDrawPath", "vehHelicopterBoundsRadius", "vehHelicopterDecelerationFwd", "vehHelicopterDecelerationSide", "vehHelicopterDecelerationUp", "vehHelicopterHeadSwayDontSwayTheTurret", "vehHelicopterHoverSpeedThreshold", "vehHelicopterInvertUpDown", "vehHelicopterJitterJerkyness", "vehHelicopterLookaheadTime", "vehHelicopterMaxAccel", "vehHelicopterMaxAccelVertical", "vehHelicopterMaxPitch", "vehHelicopterMaxRoll", "vehHelicopterMaxSpeed", "vehHelicopterMaxSpeedVertical", "vehHelicopterMaxYawAccel", "vehHelicopterMaxYawRate", "vehHelicopterPitchOffset", "vehHelicopterRightStickDeadzone", "vehHelicopterScaleMovement", "vehHelicopterSoftCollisions", "vehHelicopterStrafeDeadzone", "vehHelicopterTiltFromAcceleration", "vehHelicopterTiltFromControllerAxes", "vehHelicopterTiltFromDeceleration", "vehHelicopterTiltFromFwdAndYaw", "vehHelicopterTiltFromFwdAndYaw_VelAtMaxTilt", "vehHelicopterTiltFromVelocity", "vehHelicopterTiltMomentum", "vehHelicopterTiltSpeed", "vehHelicopterYawOnLeftStick", "vehUGVPitchTrack", "vehUGVRollTrack", "vehUGVWheelInfluence", "vehWalkerControlMode", "veh_aiOverSteerScale", "veh_amws_scan", "veh_anim_future_heli_gearup_bay_open", "veh_anim_v", "veh_b", "veh_bo", "veh_boneControllerLodDist", "veh_boneControllerUnLodDist", "veh_boost", "veh_car_destroy", "veh_chopper_prop_wash_dirt", "veh_chopper_prop_wash_water", "veh_cobra_rotor", "veh_cobra_rotor_lfe", "veh_cobra_tail", "veh_cobra_turbine", "veh_collision", "veh_collision_heavy", "veh_collision_lightI", "veh_counteruav_mp", "veh_counteruav_mpB", "veh_damage_filter_heavy", "veh_damage_filter_light", "veh_dart_mp", "veh_default_suspension_lg_hd", "veh_default_suspension_lg_lt", "veh_drn_qrdrone_mp", "veh_drone_spin", "veh_ejectoccupants", "veh_engine_stutter", "veh_flak_drone_mp", "veh_heightmesh_max", "veh_heightmesh_min", "veh_heli_ai_mp", "veh_heli_guard_mp", "veh_heli_gunner_mp", "veh_heli_player_gunner_mp", "veh_heli_supplydrop_mp", "veh_helicopter_alarm", "veh_hind_alarm_missile_fired", "veh_hind_alarm_missile_locked_mp", "veh_hind_alarm_missile_locking_mp", "veh_hind_cloak_off", "veh_hind_cloak_on", "veh_hind_rotor", "veh_hind_rotor_lfe", "veh_hind_tail", "veh_hind_turbine", "veh_huey_chaff_drop_plr", "veh_huey_chaff_explo_npc", "veh_huey_door_wind", "veh_huey_radio", "veh_huey_rotor", "veh_huey_rotor_lfe", "veh_huey_tail", "veh_huey_turbine", "veh_hunter_alarm_target", "veh_hunter_scanner_loop", "veh_inair", "veh_jetpack_surface_", "veh_jump_landingI", "veh_kls_uav_afterburner", "veh_landed", "veh_overwatch_lfe", "veh_overwatch_rotor", "veh_overwatch_turbine", "veh_pc_amws_turret_extend", "veh_pc_amws_turret_retract", "veh_predictedcollision", "veh_qrdrone_death_fire_loop", "veh_qrdrone_dmg_hit", "veh_qrdrone_dmg_loop", "veh_qrdrone_explo", "veh_qrdrone_idle_rotate", "veh_qrdrone_move_down", "veh_qrdrone_move_start", "veh_qrdrone_move_up", "veh_qrdrone_sparks", "veh_qrdrone_static_lp", "veh_qrdrone_turbine_idle", "veh_qrdrone_turbine_moving", "veh_qrdrone_vertical", "veh_qrdrone_wall", "veh_quadtank_sparks", "veh_raps_close_", "veh_raps_direction", "veh_raps_first_land", "veh_raps_in_air", "veh_raps_jump_up", "veh_raps_land", "veh_raps_launch", "veh_raps_spawn", "veh_raps_targeting", "veh_sentinel_mp", "veh_sentinel_player_mp", "veh_sentinel_player_mpA", "veh_sentry_turret_dmg_hit", "veh_sentry_turret_emp_down", "veh_stuck", "veh_supply_drop", "veh_supply_rotor", "veh_supply_rotor_lfe", "veh_supply_turbine", "veh_suspension_limit_activated", "veh_t", "veh_talon_crate_exp", "veh_talon_shutdown", "veh_turret_alert", "veh_turret_idle", "veh_uav_engine_loop", "veh_vtol_supply_robot_activate", "veh_vtol_supply_robot_land", "veh_vtol_supply_robot_launch", "veh_wasp_direction", "veh_wasp_dmg_hit", "veh_wasp_dmg_loop", "veh_wasp_explo", "veh_wasp_gibbed", "veh_wasp_ground_death", "veh_wasp_vox", "veh_wasp_wall_imp", "vehicle_ai", "vehicle_ai_shared", "vehicle_anim_type", "vehicle_cache", "vehicle_death", "vehicle_debug_render_spline_plane", "vehicle_descriptor", "vehicle_driver", "vehicle_explo", "vehicle_ger_tracked_king_tiger", "vehicle_kill_badplace", "vehicle_name", "vehicle_oob_minz", "vehicle_pathsmooth", "vehicle_shared", "vehicle_straferun_mp", "version", "vid_height", "vid_restart", "vid_width", "vid_xpos", "vid_ypos", "viewangNow", "viewposNow", "virtualLobbyActive", "virtualLobbyAllocated", "virtualLobbyEnabled", "virtualLobbyInFiringRange", "virtualLobbyMap", "virtualLobbyPresentable", "virtualLobbyReady", "vlDepotEnabled", "vlDepotLoaded", "voMtxEnable", "voice_off", "voice_on", "voice_on_dim", "vpte", "war_a", "war_b", "war_c", "war_d", "war_e", "waypointAerialIconMaxSize", "waypointAerialIconMinSize", "waypointAerialIconScale", "waypointDebugDraw", "waypointDistScaleRangeMax", "waypointDistScaleRangeMin", "waypointDistScaleSmallest", "waypointIconHeight", "waypointIconWidth", "waypointOffscreenCornerRadius", "waypointOffscreenDistanceThresholdAlpha", "waypointOffscreenPadBottom", "waypointOffscreenPadLeft", "waypointOffscreenPadRight", "waypointOffscreenPadTop", "waypointOffscreenPointerDistance", "waypointOffscreenPointerHeight", "waypointOffscreenPointerWidth", "waypointOffscreenRoundedCorners", "waypointOffscreenScaleLength", "waypointOffscreenScaleSmallest", "waypointPlayerOffsetCrouch", "waypointPlayerOffsetProne", "waypointPlayerOffsetStand", "waypointScreenCenterFadeAdsMin", "waypointScreenCenterFadeHipMin", "waypointScreenCenterFadeRadius", "waypointSplitscreenScale", "waypointTweakY", "waypoint_clamp", "waypoint_default", "waypoint_distance_culled", "waypoint_dogtags", "waypoint_fade_when_in_combat", "waypoint_fade_when_targeted", "waypoint_image", "waypoint_line_of_sight", "waypoint_out_of_line_of_sight", "waypoint_out_of_viewport", "waypoint_recon_artillery_strike", "waypoint_show_distance_when_far", "waypoint_text", "waypoint_z_offset", "weapon_ads", "weapon_assassination", "weapon_assault", "weapon_butt", "weapon_change", "weapon_change_complete", "weapon_change_on_turret", "weapon_changing_", "weapon_cqb", "weapon_explosive", "weapon_fired", "weapon_flamethrower", "weapon_grenade", "weapon_grenadelauncher", "weapon_hmg", "weapon_hold_mode", "weapon_hud_visible", "weapon_idle", "weapon_juke_end_requested", "weapon_knife", "weapon_launcher", "weapon_launcher_alt", "weapon_lmg", "weapon_masterkey", "weapon_melee", "weapon_melee_charge", "weapon_melee_charge_end", "weapon_melee_juke", "weapon_melee_juke_end", "weapon_melee_power", "weapon_melee_power_left", "weapon_name", "weapon_null", "weapon_null_mp", "weapon_pistol", "weapon_pistol_dw", "weapon_raising", "weapon_rifle", "weapon_shared", "weapon_shotgun", "weapon_smg", "weapon_sniper", "weapon_special", "weapon_switch_started", "wideScreen", "wind_global_hi_altitude", "wind_global_low_altitude", "wind_global_low_strength_percent", "wind_global_vector", "wind_lft", "wind_rt", "winvoice_loopback", "winvoice_mic_mute", "winvoice_mic_outTime", "winvoice_mic_reclevel", "winvoice_mic_scaler", "winvoice_mic_threshold", "winvoice_save_voice", "wpn_agr_explode", "wpn_ammo_pickup", "wpn_arm_blade_lock", "wpn_armblade_idle", "wpn_betty_alert", "wpn_betty_arm", "wpn_betty_explo", "wpn_betty_jump", "wpn_betty_plant_npc", "wpn_betty_plant_plr", "wpn_bow_launcher_draw_cancel", "wpn_bow_launcher_draw_npc", "wpn_bow_launcher_draw_plr", "wpn_bowlauncher_stretch_loop", "wpn_bowlauncher_stretch_loop_npc", "wpn_claymore_alert", "wpn_dart_alert", "wpn_emp_explode", "wpn_flash_grenade_explode", "wpn_gas_hiss_end", "wpn_gas_hiss_lp", "wpn_gas_hiss_start", "wpn_gel_gun_fire_npc", "wpn_gel_gun_fire_plr", "wpn_gelgun_blob_alert_lp", "wpn_gelgun_blob_burst", "wpn_gelgun_blob_destroy", "wpn_gelgun_hive_attack", "wpn_gelgun_hive_die", "wpn_gelgun_hive_hunt_lp", "wpn_gelgun_hive_wall_impact", "wpn_glove_button_open", "wpn_grenade_explode", "wpn_grenade_pull_pin", "wpn_grenade_throw", "wpn_grenade_throw_cloth", "wpn_hatchet_throw_npc", "wpn_hatchet_throw_plr", "wpn_hellfire_fire_npc", "wpn_inc_grenade_pull_pin", "wpn_incendiary_core_start", "wpn_lightning_gun_bounce", "wpn_metalstorm_lock_on", "wpn_metalstormsnp_charge_plr_", "wpn_micro_turret_deploy", "wpn_micro_turret_loop", "wpn_micro_turret_retract", "wpn_micro_turret_start", "wpn_micro_turret_stop", "wpn_pineapple_grenade_explode_flesh_", "wpn_power_armor_destroyed_npc", "wpn_power_armor_destroyed_plr", "wpn_qr_alert", "wpn_rcxd_alert", "wpn_remote_missile_boost_npc", "wpn_remote_missile_boost_plr", "wpn_remote_missile_brake_npc", "wpn_remote_missile_brake_plr", "wpn_remote_missile_explode_plr", "wpn_remote_missile_fire_boost_npc", "wpn_remote_missile_fire_boost_plr", "wpn_remote_missile_inc", "wpn_remote_missile_loop_npc", "wpn_remote_missile_loop_plr", "wpn_riotshield_destroy", "wpn_riotshield_plant", "wpn_riotshield_visor_deploy", "wpn_semtex_alert", "wpn_semtex_button", "wpn_semtex_countdown", "wpn_sensor_nade_explo", "wpn_sensor_nade_lp", "wpn_shield_destroy", "wpn_shield_plant", "wpn_t", "wpn_tac_grenade_twist", "wpn_taser_mine_tacmask", "wpn_taser_mine_zap", "wpn_tesla_bounce", "wpn_triple", "wpn_trophy_alert", "wpn_trophy_deploy_start", "wpn_trophy_spin", "wpn_weap_pickup", "xanim_disableFootIK", "xanim_disableFootIKOutsidePlayerView", "xanim_disableIK", "xblive_clanmatch", "xblive_competitionmatch", "xblive_hostingprivateparty", "xblive_loggedin", "xblive_matchEndingSoon", "xblive_privatematch", "xblive_privatematch_solo", "xblive_rta_enabled", "xp_end", "xp_start", "zombie_bgb_token_notification", "zombie_board_tear", "zombie_board_tear_bus", "zombie_body", "zombie_bus_window_idle", "zombie_bus_window_melee", "zombie_cheat", "zombie_climb_chain", "zombie_climbin_bus", "zombie_crawl_melee", "zombie_death", "zombie_devgui", "zombie_dog", "zombie_frontend_ai", "zombie_ground_rise", "zombie_ground_rise_death", "zombie_has_eyes", "zombie_health_increase", "zombie_health_increase_multiplier", "zombie_health_start", "zombie_jump_down_", "zombie_jump_on_bus", "zombie_jump_up_", "zombie_jump_up_to_climb", "zombie_jump_up_to_climb_coast", "zombie_keyline_render", "zombie_ladder_up", "zombie_lighthouse_crawl_down", "zombie_mantle_over_", "zombie_melee", "zombie_quad_vent_jump_down", "zombie_run_melee", "zombie_stumpy_melee", "zombie_use_failsafe", "zombie_walk_melee", "zombie_wall_crawl_drop", "zombie_wall_crawl_drop_quick", "zombie_window_melee"]
}), define("editor/titles/modern-warfare/util", ["require", "exports", "../../../util/crypto"], function(e, _, t) {
    "use strict";

    function a(e) {
        return e.startsWith("0x") ? e : "0x" + t.fnv0(e.toLowerCase() + "\0", 831984323, 3016437289).toString(16).toUpperCase()
    }
    Object.defineProperty(_, "__esModule", {
        value: !0
    }), _.hashDvar = a
}), define("editor/titles/modern-warfare/segment2", ["require", "exports", "../../../util/stream", "./util"], function(e, _, t, a) {
    "use strict";

    function r(e, _) {
        for (var t = []; e-- > 0;) {
            var a = _.readInt16();
            0 !== a && a < 1024 ? t.push(_.readString("ascii", a)) : t.push("")
        }
        return t
    }

    function i(e, _) {
        for (var t = 0, a = _; t < a.length; t++) {
            var r = a[t];
            e.writeInt16(r.length), e.writeString(r)
        }
    }

    function o(e) {
        for (var _, t = {}; - 1 !== (_ = e.readInt32());) {
            t[e.readString("ascii", _)] = e.readString("ascii", e.readInt32())
        }
        return t
    }

    function n(e, _) {
        Object.getOwnPropertyNames(_).filter(function(e) {
            return !e.startsWith("__") && void 0 !== _[e]
        }).forEach(function(t) {
            return e.writeInt32(t.length).writeString(t).writeInt32(_[t].length).writeString(_[t])
        }), e.writeInt32(-1)
    }
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var l = a.hashDvar("g_player_maxHealth"),
        s = function() {
            function e(e) {
                var _ = new t.Stream(e);
                this.header = _.readBytes(208), this.models1 = r(1024, _), this.models2 = r(64, _), this.effects1 = r(512, _), this.effects2 = r(512, _), this.audio1 = r(512, _), this.audio2 = r(128, _), this.text1 = r(2399, _), this.uList1 = r(2, _), this.uList2 = r(13, _), this.dvars = o(_), this.postDvars1 = _.readBytes(53248), this.u1 = _.readInt32(), this.postDvars2 = _.readBytes(this.u1 << 3), this.u2 = _.readInt32(), this.u3 = _.readInt32(), this.u4 = _.readInt32(), this.u5 = _.readInt32(), this.health = _.readInt32(), this.footer = _.readBytes(_.length - _.position)
            }
            return e.prototype.importDvars = function(e) {
                this.dvars = e
            }, e.prototype.toBuffer = function() {
                var e = t.Stream.reserve(4194304);
                return e.writeBytes(this.header), i(e, this.models1), i(e, this.models2), i(e, this.effects1), i(e, this.effects2), i(e, this.audio1), i(e, this.audio2), i(e, this.text1), i(e, this.uList1), i(e, this.uList2), n(e, this.dvars), e.writeBytes(this.postDvars1), e.writeUInt32(this.u1), e.writeBytes(this.postDvars2), e.writeUInt32(this.u2), e.writeUInt32(this.u3), e.writeUInt32(this.u4), e.writeUInt32(this.u5), e.writeInt32(+(this.dvars.hasOwnProperty(l) ? this.dvars[l] : this.health)), e.writeBytes(this.footer), e.getBuffer()
            }, e
        }();
    _.Segment2 = s
}), define("editor/titles/modern-warfare/index", ["require", "exports", "tslib", "../../../util/fs", "./campaign-save", "./segment2", "./util", "./dvars"], function(e, _, t, a, r, i, o, n) {
    "use strict";
    Object.defineProperty(_, "__esModule", {
        value: !0
    });
    var l = {};
    ["player_sustainAmmo", "g_speed", "jump_height", "player_sprintUnlimited", "player_sprintSpeedScale", "player_clipSizeMultiplier", "g_gravity"].forEach(function(e) {
        return l[e] = o.hashDvar(e)
    });
    var s = new Set(Object.getOwnPropertyNames(l).map(function(e) {
            return l[e]
        })),
        p = {
            player_swimDamage: "0",
            player_deathInvulnerableTime: "1000",
            player_damageMultiplier: "0",
            player_meleeDamageMultiplier: "0",
            bg_fallDamageMaxHeight: "1000",
            bg_fallDamageMinHeight: "1000",
            g_player_maxhealth: "1000",
            player_deathInvulnerableToMelee: "1",
            player_deathInvulnerableToProjectile: "1"
        },
        c = function() {
            function e() {
                this.seg2 = {
                    dvars: {}
                }, this.hashes = l
            }
            return e.prototype.load = function(e) {
                this.godModeEnabled = !1, this.campaignSave = new r.CampaignSave(e), this.seg2 = new i.Segment2(this.campaignSave.getSegment(2))
            }, e.prototype.enableGodMode = function() {
                var e = this;
                this.godModeEnabled = !0, Object.getOwnPropertyNames(p).forEach(function(_) {
                    return e.setDvar(_, p[_])
                }), alert("God mode enabled! To disable it, continue to the next checkpoint and save your game.")
            }, e.prototype.backupDvars = function() {
                return t.__awaiter(this, void 0, void 0, function() {
                    var e;
                    return t.__generator(this, function(_) {
                        switch (_.label) {
                            case 0:
                                return [4, a.saveFileDialog({
                                    defaultPath: "dvars",
                                    filters: [{
                                        name: "DVAR Files",
                                        extensions: ["json"]
                                    }]
                                })];
                            case 1:
                                return e = _.sent(), e ? [4, a.writeFile(e, JSON.stringify(this.seg2.dvars, void 0, 2))] : [3, 3];
                            case 2:
                                _.sent(), _.label = 3;
                            case 3:
                                return [2]
                        }
                    })
                })
            }, e.prototype.restoreDvars = function() {
                return t.__awaiter(this, void 0, void 0, function() {
                    var e, _, r, i, o, n;
                    return t.__generator(this, function(t) {
                        switch (t.label) {
                            case 0:
                                return [4, a.openFileDialog({
                                    filters: [{
                                        name: "DVAR Files",
                                        extensions: ["json"]
                                    }]
                                })];
                            case 1:
                                if (!(e = t.sent()) || !e[0]) return [3, 5];
                                t.label = 2;
                            case 2:
                                return t.trys.push([2, 4, , 5]), r = (_ = this.seg2).importDvars, o = (i = JSON).parse, [4, a.readFile(e[0], "utf8")];
                            case 3:
                                return r.apply(_, [o.apply(i, [t.sent()])]), [3, 5];
                            case 4:
                                return n = t.sent(), alert("Failed to import DVAR file."), [3, 5];
                            case 5:
                                return [2]
                        }
                    })
                })
            }, e.prototype.save = function() {
                return this.campaignSave.setSegment(2, this.seg2.toBuffer()).toBuffer()
            }, e.prototype.setDvar = function(e, _) {
                var t = o.hashDvar(e);
                d.has(t) || d.set(t, e), this.seg2.dvars[t] = _
            }, e
        }();
    _.ModernWarfare = c;
    for (var d = new Map, m = 0, u = n.default; m < u.length; m++) {
        var g = u[m];
        d.set(o.hashDvar(g), g)
    }
    var h = function() {
        function e() {}
        return e.prototype.toView = function(e) {
            return d.get(e) || e
        }, e
    }();
    _.RealDvarNameValueConverter = h;
    var f = function() {
        function e() {}
        return e.prototype.toView = function(e) {
            return e && "0" !== e
        }, e.prototype.fromView = function(e) {
            return e ? "1" : "0"
        }, e
    }();
    _.BoolDvarValueConverter = f;
    var b = function() {
        function e() {}
        return e.prototype.toView = function(e) {
            return parseInt(e)
        }, e.prototype.fromView = function(e) {
            return Number.isNaN(e) ? void 0 : e.toString()
        }, e
    }();
    _.IntDvarValueConverter = b;
    var w = function() {
        function e() {}
        return e.prototype.toView = function(e) {
            return parseFloat(e)
        }, e.prototype.fromView = function(e) {
            return Number.isNaN(e) ? void 0 : e.toString()
        }, e
    }();
    _.FloatDvarValueConverter = w;
    var v = function() {
        function e() {}
        return e.prototype.toView = function(e, _, t) {
            return !(!t || !e.name || e.name.toLowerCase() !== t.toLowerCase()) || void 0 !== _[e.hash] && (t && (t = t.trim()) ? e.hash === t || e.name && e.name.includes(t) : !!e.name)
        }, e
    }();
    _.FilterDvarValueConverter = v;
    var y = function() {
        function e() {}
        return e.prototype.toView = function(e, _) {
            var t = e.filter(function(e) {
                return !s.has(e)
            }).map(function(e) {
                return {
                    hash: e,
                    name: d.get(e)
                }
            }).sort(function(e, _) {
                return (e.name || e.hash).localeCompare(_.name || _.hash)
            });
            if (_) {
                var a;
                if (_.startsWith("0") ? (a = _, d.has(a) && (_ = d.get(a))) : (a = o.hashDvar(_), d.has(a) ? _ = d.get(a) : d.set(a, _)), !s.has(a)) {
                    var r = t.findIndex(function(e) {
                        return e.hash === a
                    });
                    if (-1 !== r) {
                        var i = t[r];
                        t.splice(r, 1), t.unshift(i)
                    } else t.unshift({
                        hash: a,
                        name: _
                    })
                }
            }
            return t
        }, e
    }();
    _.DvarsValueConverter = y
}), define("aurelia-dialog/ai-dialog", ["exports", "aurelia-templating"], function(e, _) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.AiDialog = void 0;
    var t, a, r;
    e.AiDialog = (t = (0, _.customElement)("ai-dialog"), a = (0, _.inlineView)("\n  <template>\n    <slot></slot>\n  </template>\n"), t(r = a(r = function() {}) || r) || r)
}), define("aurelia-dialog/ai-dialog-header", ["exports", "aurelia-templating", "./dialog-controller"], function(e, _, t) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.AiDialogHeader = void 0;
    var a, r, i, o, n;
    e.AiDialogHeader = (a = (0, _.customElement)("ai-dialog-header"), r = (0, _.inlineView)('\n  <template>\n    <button type="button" class="dialog-close" aria-label="Close" if.bind="!controller.settings.lock" click.trigger="controller.cancel()">\n      <span aria-hidden="true">&times;</span>\n    </button>\n\n    <div class="dialog-header-content">\n      <slot></slot>\n    </div>\n  </template>\n'), a(i = r((n = o = function(e) {
        this.controller = e
    }, o.inject = [t.DialogController], i = n)) || i) || i)
}), define("aurelia-dialog/dialog-controller", ["exports", "./lifecycle", "./dialog-result"], function(e, _, t) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.DialogController = void 0;
    e.DialogController = function() {
        function e(e, _, t, a) {
            this.renderer = e, this.settings = _, this._resolve = t, this._reject = a
        }
        return e.prototype.ok = function(e) {
            return this.close(!0, e)
        }, e.prototype.cancel = function(e) {
            return this.close(!1, e)
        }, e.prototype.error = function(e) {
            var t = this;
            return (0, _.invokeLifecycle)(this.viewModel, "deactivate").then(function() {
                return t.renderer.hideDialog(t)
            }).then(function() {
                t.controller.unbind(), t._reject(e)
            })
        }, e.prototype.close = function(e, a) {
            var r = this;
            return this._closePromise ? this._closePromise : (this._closePromise = (0, _.invokeLifecycle)(this.viewModel, "canDeactivate").then(function(i) {
                if (i) return (0, _.invokeLifecycle)(r.viewModel, "deactivate").then(function() {
                    return r.renderer.hideDialog(r)
                }).then(function() {
                    var _ = new t.DialogResult(!e, a);
                    return r.controller.unbind(), r._resolve(_), _
                });
                r._closePromise = void 0
            }, function(e) {
                return r._closePromise = void 0, Promise.reject(e)
            }), this._closePromise)
        }, e
    }()
}), define("aurelia-dialog/lifecycle", ["exports"], function(e) {
    "use strict";

    function _(e, _, t) {
        if ("function" == typeof e[_]) {
            var a = e[_](t);
            return a instanceof Promise ? a : null !== a && void 0 !== a ? Promise.resolve(a) : Promise.resolve(!0)
        }
        return Promise.resolve(!0)
    }
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.invokeLifecycle = _
}), define("aurelia-dialog/dialog-result", ["exports"], function(e) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    e.DialogResult = function(e, _) {
        this.wasCancelled = !1, this.wasCancelled = e, this.output = _
    }
}), define("aurelia-dialog/ai-dialog-body", ["exports", "aurelia-templating"], function(e, _) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.AiDialogBody = void 0;
    var t, a, r;
    e.AiDialogBody = (t = (0, _.customElement)("ai-dialog-body"), a = (0, _.inlineView)("\n  <template>\n    <slot></slot>\n  </template>\n"), t(r = a(r = function() {}) || r) || r)
}), define("aurelia-dialog/ai-dialog-footer", ["exports", "aurelia-templating", "./dialog-controller"], function(e, _, t) {
    "use strict";

    function a(e, _, t, a) {
        t && Object.defineProperty(e, _, {
            enumerable: t.enumerable,
            configurable: t.configurable,
            writable: t.writable,
            value: t.initializer ? t.initializer.call(a) : void 0
        })
    }

    function r(e, _, t, a, r) {
        var i = {};
        return Object.keys(a).forEach(function(e) {
            i[e] = a[e]
        }), i.enumerable = !!i.enumerable, i.configurable = !!i.configurable, ("value" in i || i.initializer) && (i.writable = !0), i = t.slice().reverse().reduce(function(t, a) {
            return a(e, _, t) || t
        }, i), r && void 0 !== i.initializer && (i.value = i.initializer ? i.initializer.call(r) : void 0, i.initializer = void 0), void 0 === i.initializer && (Object.defineProperty(e, _, i), i = null), i
    }
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.AiDialogFooter = void 0;
    var i, o, n, l, s, p, c, d;
    e.AiDialogFooter = (i = (0, _.customElement)("ai-dialog-footer"), o = (0, _.inlineView)('\n  <template>\n    <slot></slot>\n\n    <template if.bind="buttons.length > 0">\n      <button type="button" class="btn btn-default" repeat.for="button of buttons" click.trigger="close(button)">${button}</button>\n    </template>\n  </template>\n'), i(n = o((d = c = function() {
        function e(e) {
            a(this, "buttons", s, this), a(this, "useDefaultButtons", p, this), this.controller = e
        }
        return e.prototype.close = function(_) {
            e.isCancelButton(_) ? this.controller.cancel(_) : this.controller.ok(_)
        }, e.prototype.useDefaultButtonsChanged = function(e) {
            e && (this.buttons = ["Cancel", "Ok"])
        }, e.isCancelButton = function(e) {
            return "Cancel" === e
        }, e
    }(), c.inject = [t.DialogController], l = d, s = r(l.prototype, "buttons", [_.bindable], {
        enumerable: !0,
        initializer: function() {
            return []
        }
    }), p = r(l.prototype, "useDefaultButtons", [_.bindable], {
        enumerable: !0,
        initializer: function() {
            return !1
        }
    }), n = l)) || n) || n)
}), define("aurelia-dialog/attach-focus", ["exports", "aurelia-templating"], function(e, _) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.AttachFocus = void 0;
    var t, a, r, i;
    e.AttachFocus = (t = (0, _.customAttribute)("attach-focus"))((i = r = function() {
        function e(e) {
            this.value = !0, this.element = e
        }
        return e.prototype.attached = function() {
            this.value && "false" !== this.value && this.element.focus()
        }, e.prototype.valueChanged = function(e) {
            this.value = e
        }, e
    }(), r.inject = [Element], a = i)) || a
}), define("aurelia-dialog/dialog-configuration", ["exports", "./renderer", "./dialog-renderer", "./dialog-options", "aurelia-pal"], function(e, _, t, a, r) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.DialogConfiguration = void 0;
    var i = t.DialogRenderer,
        o = {
            "ai-dialog": "./ai-dialog",
            "ai-dialog-header": "./ai-dialog-header",
            "ai-dialog-body": "./ai-dialog-body",
            "ai-dialog-footer": "./ai-dialog-footer",
            "attach-focus": "./attach-focus"
        },
        n = "ai-dialog-container,ai-dialog-overlay{position:fixed;top:0;right:0;bottom:0;left:0}ai-dialog-overlay{opacity:0}ai-dialog-overlay.active{opacity:1}ai-dialog-container{display:block;transition:opacity .2s linear;opacity:0;overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch}ai-dialog-container.active{opacity:1}ai-dialog-container>div{padding:30px}ai-dialog-container>div>div{display:block;min-width:300px;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;margin:auto}ai-dialog-container,ai-dialog-container>div,ai-dialog-container>div>div{outline:0}ai-dialog{display:table;box-shadow:0 5px 15px rgba(0,0,0,.5);border:1px solid rgba(0,0,0,.2);border-radius:5px;padding:3;min-width:300px;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;margin:auto;border-image-source:initial;border-image-slice:initial;border-image-width:initial;border-image-outset:initial;border-image-repeat:initial;background:#fff}ai-dialog>ai-dialog-header{display:block;padding:16px;border-bottom:1px solid #e5e5e5}ai-dialog>ai-dialog-header>button{float:right;border:none;display:block;width:32px;height:32px;background:0 0;font-size:22px;line-height:16px;margin:-14px -16px 0 0;padding:0;cursor:pointer}ai-dialog>ai-dialog-body{display:block;padding:16px}ai-dialog>ai-dialog-footer{display:block;padding:6px;border-top:1px solid #e5e5e5;text-align:right}ai-dialog>ai-dialog-footer button{color:#333;background-color:#fff;padding:6px 12px;font-size:14px;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;background-image:none;border:1px solid #ccc;border-radius:4px;margin:5px 0 5px 5px}ai-dialog>ai-dialog-footer button:disabled{cursor:default;opacity:.45}ai-dialog>ai-dialog-footer button:hover:enabled{color:#333;background-color:#e6e6e6;border-color:#adadad}.ai-dialog-open{overflow:hidden}";
    e.DialogConfiguration = function() {
        function e(e) {
            this.aurelia = e, this.settings = a.dialogOptions, this.resources = [], this.cssText = n, this.renderer = i
        }
        return e.prototype.useDefaults = function() {
            return this.useRenderer(i).useCSS(n).useStandardResources()
        }, e.prototype.useStandardResources = function() {
            return this.useResource("ai-dialog").useResource("ai-dialog-header").useResource("ai-dialog-body").useResource("ai-dialog-footer").useResource("attach-focus")
        }, e.prototype.useResource = function(e) {
            return this.resources.push(e), this
        }, e.prototype.useRenderer = function(e, _) {
            return this.renderer = e, this.settings = Object.assign(this.settings, _ || {}), this
        }, e.prototype.useCSS = function(e) {
            return this.cssText = e, this
        }, e.prototype._apply = function() {
            var e = this;
            this.aurelia.transient(_.Renderer, this.renderer), this.resources.forEach(function(_) {
                return e.aurelia.globalResources(o[_])
            }), this.cssText && r.DOM.injectStyles(this.cssText)
        }, e
    }()
}), define("aurelia-dialog/renderer", ["exports"], function(e) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    e.Renderer = function() {
        function e() {}
        return e.prototype.getDialogContainer = function() {
            throw new Error("DialogRenderer must implement getDialogContainer().")
        }, e.prototype.showDialog = function(e) {
            throw new Error("DialogRenderer must implement showDialog().")
        }, e.prototype.hideDialog = function(e) {
            throw new Error("DialogRenderer must implement hideDialog().")
        }, e
    }()
}), define("aurelia-dialog/dialog-renderer", ["exports", "aurelia-pal", "aurelia-dependency-injection"], function(e, _, t) {
    "use strict";

    function a(e) {
        var t = e.children[0],
            a = Math.max(_.DOM.querySelectorAll("html")[0].clientHeight, window.innerHeight || 0);
        t.style.marginTop = Math.max((a - t.offsetHeight) / 2, 30) + "px", t.style.marginBottom = Math.max((a - t.offsetHeight) / 2, 30) + "px"
    }
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.DialogRenderer = void 0;
    var r, i = function() {
        var e = null;
        return function() {
            if (e) return e;
            var t = void 0,
                a = _.DOM.createElement("fakeelement"),
                r = {
                    transition: "transitionend",
                    OTransition: "oTransitionEnd",
                    MozTransition: "transitionend",
                    WebkitTransition: "webkitTransitionEnd"
                };
            for (t in r)
                if (void 0 !== a.style[t]) return e = r[t]
        }
    }();
    (e.DialogRenderer = (0, t.transient)()(r = function() {
        function e() {
            var e = this;
            this._escapeKeyEventHandler = function(_) {
                if (27 === _.keyCode) {
                    var t = e._dialogControllers[e._dialogControllers.length - 1];
                    t && !0 !== t.settings.lock && t.cancel()
                }
            }
        }
        return e.prototype.getDialogContainer = function() {
            return _.DOM.createElement("div")
        }, e.prototype.showDialog = function(e) {
            var t = this,
                r = e.settings,
                o = _.DOM.querySelectorAll("body")[0],
                n = document.createElement("div");
            this.modalOverlay = _.DOM.createElement("ai-dialog-overlay"), this.modalContainer = _.DOM.createElement("ai-dialog-container"), this.anchor = e.slot.anchor, n.appendChild(this.anchor), this.modalContainer.appendChild(n), this.stopPropagation = function(e) {
                e._aureliaDialogHostClicked = !0
            }, this.closeModalClick = function(_) {
                if (r.lock || _._aureliaDialogHostClicked) return !1;
                e.cancel()
            }, e.centerDialog = function() {
                r.centerHorizontalOnly || a(t.modalContainer)
            }, this.modalOverlay.style.zIndex = r.startingZIndex, this.modalContainer.style.zIndex = r.startingZIndex;
            var l = Array.from(o.querySelectorAll("ai-dialog-container")).pop();
            return l ? (l.parentNode.insertBefore(this.modalContainer, l.nextSibling), l.parentNode.insertBefore(this.modalOverlay, l.nextSibling)) : (o.insertBefore(this.modalContainer, o.firstChild), o.insertBefore(this.modalOverlay, o.firstChild)), this._dialogControllers.length || _.DOM.addEventListener("keyup", this._escapeKeyEventHandler), this._dialogControllers.push(e), e.slot.attached(), "function" == typeof r.position ? r.position(this.modalContainer, this.modalOverlay) : e.centerDialog(), this.modalContainer.addEventListener("click", this.closeModalClick), this.anchor.addEventListener("click", this.stopPropagation), new Promise(function(e) {
                function _(t) {
                    t.target === a.modalContainer && (a.modalContainer.removeEventListener(i(), _), e())
                }
                var a = t;
                r.ignoreTransitions ? e() : t.modalContainer.addEventListener(i(), _), t.modalOverlay.classList.add("active"), t.modalContainer.classList.add("active"), o.classList.add("ai-dialog-open")
            })
        }, e.prototype.hideDialog = function(e) {
            var t = this,
                a = e.settings,
                r = _.DOM.querySelectorAll("body")[0];
            this.modalContainer.removeEventListener("click", this.closeModalClick), this.anchor.removeEventListener("click", this.stopPropagation);
            var o = this._dialogControllers.indexOf(e);
            return -1 !== o && this._dialogControllers.splice(o, 1), this._dialogControllers.length || _.DOM.removeEventListener("keyup", this._escapeKeyEventHandler), new Promise(function(e) {
                function _() {
                    r.modalContainer.removeEventListener(i(), _), e()
                }
                var r = t;
                a.ignoreTransitions ? e() : t.modalContainer.addEventListener(i(), _), t.modalOverlay.classList.remove("active"), t.modalContainer.classList.remove("active")
            }).then(function() {
                return r.removeChild(t.modalOverlay), r.removeChild(t.modalContainer), e.slot.detached(), t._dialogControllers.length || r.classList.remove("ai-dialog-open"), Promise.resolve()
            })
        }, e
    }()) || r).prototype._dialogControllers = []
}), define("aurelia-dialog/dialog-options", ["exports"], function(e) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    e.dialogOptions = {
        lock: !0,
        centerHorizontalOnly: !1,
        startingZIndex: 1e3,
        ignoreTransitions: !1
    }
}), define("aurelia-dialog/dialog-service", ["exports", "aurelia-metadata", "aurelia-dependency-injection", "aurelia-templating", "./dialog-controller", "./renderer", "./lifecycle", "./dialog-result", "./dialog-options"], function(e, _, t, a, r, i, o, n, l) {
    "use strict";

    function s(e) {
        return e = Object.assign({}, l.dialogOptions, e), e.startingZIndex = l.dialogOptions.startingZIndex, e
    }

    function p(e, _, t) {
        var r = t.renderer.getDialogContainer();
        return c({
            container: e.container,
            childContainer: _,
            model: t.settings.model,
            view: t.settings.view,
            viewModel: t.settings.viewModel,
            viewSlot: new a.ViewSlot(r, !0),
            host: r
        }, e.compositionEngine).then(function(_) {
            return t.viewModel = _.viewModel, t.slot = _.viewSlot, (0, o.invokeLifecycle)(t.viewModel, "canActivate", t.settings.model).then(function(a) {
                if (a) return e.compositionEngine.compose(_).then(function(_) {
                    return e.controllers.push(t), e.hasActiveDialog = !!e.controllers.length, t.controller = _, t.view = _.view, t.renderer.showDialog(t)
                })
            })
        })
    }

    function c(e, t) {
        return "function" == typeof e.viewModel && (e.viewModel = _.Origin.get(e.viewModel).moduleId), "string" == typeof e.viewModel ? t.ensureViewModel(e) : Promise.resolve(e)
    }

    function d(e, _) {
        var t = e.controllers.indexOf(_); - 1 !== t && (e.controllers.splice(t, 1), e.hasActiveDialog = !!e.controllers.length)
    }
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.DialogService = void 0;
    var m, u;
    e.DialogService = (u = m = function() {
        function e(e, _) {
            this.container = e, this.compositionEngine = _, this.controllers = [], this.hasActiveDialog = !1
        }
        return e.prototype.open = function(e) {
            return this.openAndYieldController(e).then(function(e) {
                return e.result
            })
        }, e.prototype.openAndYieldController = function(e) {
            var _ = this,
                t = this.container.createChild(),
                a = void 0,
                o = new Promise(function(_, o) {
                    a = new r.DialogController(t.get(i.Renderer), s(e), _, o)
                });
            return t.registerInstance(r.DialogController, a), a.result = o, a.result.then(function() {
                d(_, a)
            }, function() {
                d(_, a)
            }), p(this, t, a).then(function() {
                return a
            })
        }, e
    }(), m.inject = [t.Container, a.CompositionEngine], u)
}), define("text!app/app.html", ["module"], function(e) {
    e.exports = '<template><require from="./app.css"></require><require from="./resources/elements/app-header"></require><require from="./resources/elements/sidebar.html"></require><div class="app-layout"><app-header></app-header><div class="app-bottom"><sidebar></sidebar><div class="app-content"><router-view></router-view></div></div></div></template>'
}), define("text!app/app.css", ["module"], function(e) {
    e.exports = '@import url(../static/fonts/lato/lato.css);@import url(../static/fonts/gotham/gotham.css);.hide{display:none !important}.clearfix:after{content:"";display:block;clear:both}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}body{margin:0;padding:0;width:100%;overflow:hidden}*{cursor:default;box-sizing:border-box;-webkit-user-select:none;font-family:Lato}a,img{-webkit-user-drag:none}a,a *,button,button *{cursor:pointer;outline:none}input[type=text],input[type=password]{cursor:initial}ai-dialog-overlay{background:rgba(0,0,0,0.5);opacity:1 !important}ai-dialog-container{overflow:hidden}.app-layout{width:100vw;height:100vh;display:flex;flex-direction:column}.app-layout app-header{flex:0}.app-layout .app-bottom{flex:1;display:flex;flex-direction:row}.app-layout .app-bottom sidebar{flex:0}.app-layout .app-bottom .app-content{flex:1;position:relative;min-width:0}.app-layout .app-bottom .app-content router-view{display:block;width:100%;height:100%;overflow-y:hidden;position:relative;background-color:#EFF1F3}\n'
}), define("text!app/disclaimer-dialog.html", ["module"], function(e) {
    e.exports = '<template><require from="./disclaimer-dialog.css"></require><div class="disclaimer-dialog"><div class="agreement">Using this application and its services may violate the Xbox LIVE Terms of Use, corrupt your saved game data, or incur bandwith or other network-related fees as a result of transferring saved game data. By continuing, you agree that Vantage and its creators are not responsible for anything that happens to your Microsoft account, your Xbox account, your computer, your saved game files, or anything else as a direct or indirect result of using this application.<br><br>Vantage is not affiliated with or endorsed by Microsoft or Xbox.</div><div class="actions"><button class="exit-button" click.delegate="exit()">Exit</button> <button class="agree-button" click.delegate="agree()">Agree</button></div></div></template>'
}), define("text!app/constants.css", ["module"], function(e) {
    e.exports = ""
}), define("text!app/update-dialog.html", ["module"], function(e) {
    e.exports = '<template><require from="./update-dialog.css"></require><div class="update-dialog"><div class="message">A new version of Vantage is available!</div><div class="actions"><button class="cancel-button" click.delegate="controller.cancel()">No Thanks</button> <button class="download-button" click.delegate="downloadNow()">Download Now</button></div></div></template>'
}), define("text!app/disclaimer-dialog.css", ["module"], function(e) {
    e.exports = ".disclaimer-dialog{width:500px;padding:25px;border-radius:3px;background-color:#f2f2f2}.disclaimer-dialog .agreement{padding-bottom:20px;font-size:14px;line-height:1.4;color:#0C272C;text-align:justify;letter-spacing:0.75px;font-weight:300}.disclaimer-dialog .actions{width:100%;height:40px;display:flex}.disclaimer-dialog .actions button{display:inline;position:relative;text-align:center;border-radius:3px;border:0;font-weight:900;font-size:12px;color:#fff;letter-spacing:0.5px;transition:box-shadow 0.3s}.disclaimer-dialog .actions button,.disclaimer-dialog .actions button *{cursor:pointer}.disclaimer-dialog .actions button.exit-button{flex:1;background-image:linear-gradient(-133deg, #d74921 0%, #e6461a 100%)}.disclaimer-dialog .actions button.exit-button:hover{box-shadow:0 0 10px rgba(215,73,33,0.8)}.disclaimer-dialog .actions button.agree-button{flex:2;margin-left:10px;background-image:linear-gradient(-133deg, #27B54F 0%, #63BF70 100%)}.disclaimer-dialog .actions button.agree-button:hover{box-shadow:0 0 10px rgba(39,181,79,0.8)}\n"
}), define("text!auth/auth-dialog.html", ["module"], function(e) {
    e.exports = '<template><require from="./auth-dialog.css"></require><div class="auth-dialog"><webview preload="./auth-bridge.js" class="auth-frame" autosize="on" minwidth="500" minheight="310" partition="persist:auth" ref="frame"></webview></div></template>'
}), define("text!app/update-dialog.css", ["module"], function(e) {
    e.exports = ".update-dialog{width:400px;padding:25px;border-radius:3px;background-color:#f2f2f2}.update-dialog .message{padding-bottom:20px;font-size:14px;line-height:1.4;color:#0C272C;text-align:center;letter-spacing:0.75px;font-weight:500}.update-dialog .actions{width:100%;height:40px;display:flex}.update-dialog .actions button{display:inline;position:relative;text-align:center;border-radius:3px;border:0;font-weight:900;font-size:12px;color:#fff;letter-spacing:0.5px;transition:box-shadow 0.3s}.update-dialog .actions button,.update-dialog .actions button *{cursor:pointer}.update-dialog .actions button.cancel-button{flex:1;background-image:linear-gradient(-133deg, #d74921 0%, #e6461a 100%)}.update-dialog .actions button.cancel-button:hover{box-shadow:0 0 10px rgba(215,73,33,0.8)}.update-dialog .actions button.download-button{flex:2;margin-left:10px;background-image:linear-gradient(-133deg, #27B54F 0%, #63BF70 100%)}.update-dialog .actions button.download-button:hover{box-shadow:0 0 10px rgba(39,181,79,0.8)}\n"
}), define("text!editor/editor.html", ["module"], function(e) {
    e.exports = '<template><require from="./editor.css"></require><div class="editor"><div class="editor-header"><div class="thumbnail"><img src.bind="title.thumbnailUrl"></div><div class="title">${title.name}<div class="editor-name">${editor.name}</div></div><div if.bind="auth.gamercard" class="actions"><div if.bind="!status" class="refresh-button"><i click.delegate="refreshContainers()"><inline-svg src="icons/refresh.svg"></inline-svg></i></div><template if.bind="containers.length"><div class="select ${fileSelectorOpen ? \'open\' : \'\'}" close-if-click-outside.two-way="fileSelectorOpen"><div class="value" click.delegate="fileSelectorOpen = !fileSelectorOpen">${selectedFile.name ? (selectedFile.container.name + \'/\' + selectedFile.name) : \'Select a file...\'}</div><div class="options"><template repeat.for="container of containers"><div repeat.for="file of container.files" click.delegate="load(file)" class="option">${container.name}/${file.name}</div></template></div><i class="select-arrow"><inline-svg src="icons/caret-down.svg"></inline-svg></i></div><button class="action-button" click.trigger="save()">Save</button></template><div if.bind="!containers.length && !status" class="no-saves">No Saves Found</div></div><div if.bind="!auth.gamercard" class="actions"><button class="action-button" click.trigger="auth.signIn()">Sign In</button></div></div><div class="categories ${(editorLoaded && !status) || isTestEditor ? \'\' : \'disabled\'}"><compose view="./titles/${editor.src}.html" view-model="./titles/${editor.src}" view-model.ref="editorElement"></compose></div></div><status-tip if.bind="status === \'reading\'" title="Reading..." message="Reading your saved games..."></status-tip><status-tip if.bind="status === \'loading\'" title="Downloading..." message="Downloading your saved game file..."></status-tip><status-tip if.bind="status === \'saving\'" title="Syncing..." message="Hang tight, we\'re syncing your changes..."></status-tip></template>'
}), define("text!app/utilities.css", ["module"], function(e) {
    e.exports = '.hide{display:none !important}.clearfix:after{content:"";display:block;clear:both}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}\n'
}), define("text!welcome/welcome.html", ["module"], function(e) {
    e.exports = '<template><require from="./welcome.css"></require><section class="welcome"><div if.bind="!auth.gamercard" class="sign-in"><h1>Sign in to your Xbox account</h1><button click.trigger="auth.signIn()">Sign In</button><h3>Your information is safe.<br>Nothing is stored on our servers</h3></div><div if.bind="auth.gamercard" class="welcome"><img src.bind="auth.gamercard.gamerpicUrl"><h1>Welcome, ${auth.gamercard.gamertag}</h1><h3><img src="static/images/welcome-arrow.svg" class="arrow"> Select a game to start modding</h3></div></section></template>'
}), define("text!auth/auth-dialog.css", ["module"], function(e) {
    e.exports = ".auth-dialog{padding:30px 40px;border-radius:3px;background-color:#f2f2f2}.auth-dialog .auth-frame{width:475px;height:310px;background-color:#f2f2f2;border:none}\n"
}), define("text!resources/elements/close-button.html", ["module"], function(e) {
    e.exports = '<template><i><inline-svg src="icons/close.svg"></inline-svg></i></template>'
}), define("text!editor/editor.css", ["module"], function(e) {
    e.exports = ".hide{display:none !important}.clearfix:after{content:\"\";display:block;clear:both}.ellipsis,.editor .editor-header .title,.editor .editor-header .actions .select .value,.editor .editor-header .actions .select .option{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.editor{position:relative;display:flex;flex-direction:column;height:100%}.editor .editor-header{display:flex;flex-direction:row;align-items:center;height:72px;background:#31B24A}.editor .editor-header .thumbnail{flex:0;align-self:center}.editor .editor-header .thumbnail img{margin:0 24px;width:40px;height:40px}.editor .editor-header .title{flex:1;font-weight:bold;font-size:16px;color:#fff;letter-spacing:1px}.editor .editor-header .title .editor-name{padding-top:5px;font-weight:200;font-size:11px}.editor .editor-header .actions{flex:0;white-space:nowrap;display:flex;padding:0 24px}.editor .editor-header .actions .refresh-button{width:30px}.editor .editor-header .actions .refresh-button i{cursor:pointer;display:inline-block;margin-top:7px}.editor .editor-header .actions .refresh-button i *{cursor:pointer}.editor .editor-header .actions .refresh-button i:hover svg *{fill:#79e297;transition:fill 0.15s}.editor .editor-header .actions .action-button{height:30px;padding:0 20px;margin-left:16px;border:0;background:#0C272C;border-radius:3px;font-weight:900;font-size:12px;color:#fff;letter-spacing:0.5px;line-height:16.67px;transition:background 0.15s}.editor .editor-header .actions .action-button:hover{background:#174b54}.editor .editor-header .actions .no-saves{color:#fff;font-weight:300;font-size:14px;line-height:30px}.editor .editor-header .actions .select{display:inline-block;position:relative;width:186px;height:30px}.editor .editor-header .actions .select *{cursor:pointer}.editor .editor-header .actions .select .value,.editor .editor-header .actions .select .option{height:30px;width:100%;padding:0 16px;font-size:12px;color:#02394A;letter-spacing:0.5px;line-height:30px;background:#fff}.editor .editor-header .actions .select .value{padding-right:40px;border-radius:3px;transition:border-radius 0.3s}.editor .editor-header .actions .select .select-arrow{pointer-events:none;position:absolute;right:10px;top:3px}.editor .editor-header .actions .select .select-arrow svg *{fill:#526173}.editor .editor-header .actions .select .options{position:absolute;left:0;top:0px;z-index:2;padding-top:30px;width:100%;max-height:200px;overflow-x:hidden;overflow-y:auto;visibility:hidden;opacity:0;border-bottom-right-radius:3px;border-bottom-left-radius:3px;transition:opacity 0.3s, visibility 0s linear 0.3s, box-shadow 0.3s}.editor .editor-header .actions .select .options .option:hover{background:#efefef}.editor .editor-header .actions .select:hover .select-arrow svg *{fill:#000}.editor .editor-header .actions .select.open .value{border-bottom-left-radius:0;border-bottom-right-radius:0}.editor .editor-header .actions .select.open .options{opacity:1;visibility:visible;transition-delay:0s;box-shadow:0 0 10px rgba(0,0,0,0.2)}.editor .categories{overflow:auto;padding-bottom:24px;flex:1}.editor .categories::-webkit-scrollbar{background-color:#EFF1F3;width:10px;box-shadow:inset 2px 2px 5px 0px rgba(0,0,0,0.3)}.editor .categories::-webkit-scrollbar-thumb:window-inactive,.editor .categories::-webkit-scrollbar-thumb{background:#617282}.editor .categories::-webkit-scrollbar-thumb:window-inactive:hover,.editor .categories::-webkit-scrollbar-thumb:hover{background:#6c7e90}.editor .categories.disabled .card-wrapper:before{content:'';position:absolute;left:0;top:0;right:0;bottom:0;z-index:1;background:rgba(255,255,255,0.4)}.editor .categories header{display:block;height:40px;line-height:40px;background:#31b24a;opacity:0.75;padding:0 24px;margin:24px 0;font-weight:900;font-size:10px;color:rgba(255,255,255,0.8);letter-spacing:2px;text-transform:uppercase}.editor .categories header:first-child{margin-top:0}.editor table{table-layout:fixed;font-size:14px;padding:0;border-collapse:separate;border-spacing:0}.editor table td,.editor table th{font-size:14px;vertical-align:middle;padding:1px 0 0 24px;text-align:left;margin:0}.editor table td:last-child,.editor table th:last-child{padding-right:24px}.editor table thead th{color:rgba(41,86,102,0.5);text-transform:uppercase;font-weight:900;font-size:10px;letter-spacing:2px;height:45px;border-bottom:2px solid #e9ebed}.editor table tr td{height:45px;border-bottom:1px solid #e9ebed;font-size:12px;color:#295666;letter-spacing:0.76px}\n"
}), define("text!resources/elements/number-input.html", ["module"], function(e) {
    e.exports = '<template class="${disabled ? \'disabled\' : \'\'}"><button click.delegate="subtract()" class="decrement">-</button> <input type="number" value.bind="value"> <button click.delegate="add()" class="increment">+</button></template>'
}), define("text!welcome/welcome.css", ["module"], function(e) {
    e.exports = "section.welcome{position:relative;width:100%;height:100%;display:flex;align-items:center}section.welcome .sign-in,section.welcome .welcome{text-align:center;margin:0 auto}section.welcome .sign-in h1{font-weight:bold;font-size:20px;color:#0C272C;letter-spacing:1px}section.welcome .sign-in h3{opacity:0.5;font-size:12px;color:#0C272C;letter-spacing:0.5px}section.welcome .sign-in button{border-radius:5.6px;background-image:linear-gradient(-133deg, #27B54F 0%, #63BF70 100%);font-weight:900;font-size:22.4px;color:#fff;letter-spacing:0.93px;width:133px;height:56px;border:none;transition:filter 0.15s}section.welcome .sign-in button:hover{filter:brightness(110%)}section.welcome .welcome img{width:125px;height:125px;border-radius:50%}section.welcome .welcome h1{margin:20px 0 0 0;font-weight:bold;font-size:31.25px;color:#39AF45;letter-spacing:0.78px}section.welcome .welcome h3{margin:7px 0 0 0;opacity:0.75;font-size:21.88px;color:#0C272C;letter-spacing:0.78px;position:relative}section.welcome .welcome h3 .arrow{position:absolute;right:100%;top:50%;transform:translate(0, -50%);width:calc()}\n"
}), define("text!resources/elements/progress-bar.html", ["module"], function(e) {
    e.exports = '<template bindable="progress"><div class="value" css.bind="{width: (progress * 100) +\'%\'}"></div></template>'
}), define("text!resources/elements/status-ring.css", ["module"], function(e) {
    e.exports = "status-ring{width:38px;height:38px;transform-origin:50% 50%;animation:status-ring-rotate 1s linear infinite;display:inline-block}status-ring svg{width:100%;height:100%}status-ring path{animation:status-ring-dash 4s infinite ease-in-out;stroke-dasharray:100}\n"
}), define("text!resources/elements/range-input.html", ["module"], function(e) {
    e.exports = '<template bindable="value, min, max, step, disabled" class="${disabled ? \'disabled\' : \'\'}"><input type="range" min.bind="min" max.bind="max" step.bind="step" value.bind="value"><label>${value || 0}</label></template>'
}), define("text!resources/elements/status-tip.css", ["module"], function(e) {
    e.exports = "status-tip{position:absolute;left:50%;bottom:0;z-index:2;transform:translate(-50%, 100%);padding:18px;width:280px;background:#fff;border-top-left-radius:6px;border-top-right-radius:6px;border:1px solid #D9E2EB;font-family:Lato-Regular;font-size:10px;color:rgba(16,49,55,0.5);letter-spacing:0.5px;transform:translate(-50%, 0);transition-delay:0s}status-tip strong{display:block;font-weight:900;font-size:14px;color:#02394A;letter-spacing:0.5px;margin-bottom:7px}status-tip .status-ring{float:left;margin-right:18px;display:block}@keyframes status-ring-dash{0%{stroke-dashoffset:100}50%{stroke-dashoffset:25}100%{stroke-dashoffset:100}}@keyframes status-ring-rotate{to{transform:rotate(360deg)}}\n"
}), define("text!resources/elements/selection-input.html", ["module"], function(e) {
    e.exports = '<template class="${opened ? \'opened\' : \'\'} ${disabled ? \'disabled\' : \'\'}"><div click.delegate="open()" class="selection-value">${value || \'---\'}</div><ul class="selection-options"><li repeat.for="option of options" click.delegate="setValue(option)">${option}</li></ul></template>'
}), define("text!app/resources/elements/app-header.css", ["module"], function(e) {
    e.exports = "app-header{display:block;background:#001011;width:100%;height:56px;-webkit-app-region:drag}app-header .sizer{position:absolute;width:100%;height:6px;-webkit-app-region:no-drag}app-header img{width:118px;height:27px;margin:14.5px 24px}app-header window-controls{float:right;margin:21px;-webkit-app-region:no-drag}\n"
}), define("text!resources/elements/status-ring.html", ["module"], function(e) {
    e.exports = '<template><require from="./status-ring.css"></require><inline-svg src="spinner.svg"></inline-svg></template>'
}), define("text!app/resources/elements/donation.css", ["module"], function(e) {
    e.exports = '.hide{display:none !important}.clearfix:after,donation .goal:after{content:"";display:block;clear:both}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}donation{display:block;width:100%;padding:16px 24px;background:#0C272C}donation .goal .label{font-size:11px;color:#fff;letter-spacing:0.5px;float:left}donation .goal .value{font-weight:bold;font-size:11px;color:#39AF45;float:right}donation .goal .value .slash{color:#275B65}donation .goal .value .total{color:#fff}donation .progress{width:100%;height:7px;border-radius:3.5px;background:#103137;margin:10px 0 16px 0}donation .progress .value{height:7px;border-radius:3.5px;background:#40AC3F;transition:width 0.5s}donation button{display:block;width:100%;height:40px;position:relative;text-align:center;background-image:linear-gradient(-133deg, #d74921 0%, #e6461a 100%);border-radius:3px;border:0;font-weight:900;font-size:12px;color:#fff;letter-spacing:0.5px;transition:box-shadow 0.3s;line-height:40px}donation button img{float:left;margin:9px 10px;width:20px;height:20px;vertical-align:middle}donation button,donation button *{cursor:pointer}donation button:after{content:"";width:40px;height:40px;background:url(static/images/icons/caret-right.svg) 25px center no-repeat;display:inline-block;float:right}donation button:hover{box-shadow:0 0 10px rgba(215,73,33,0.8)}\n'
}), define("text!resources/elements/status-tip.html", ["module"], function(e) {
    e.exports = '<template bindable="title,message"><require from="./status-tip.css"></require><div class="status-ring"><status-ring></status-ring></div><div><strong>${title}</strong> ${message}</div></template>'
}), define("text!app/resources/elements/app-header.html", ["module"], function(e) {
    e.exports = '<template><require from="./app-header.css"></require><require from="./window-controls"></require><div class="sizer"></div><img src="static/images/logo.svg"><window-controls></window-controls></template>'
}), define("text!app/resources/elements/games.css", ["module"], function(e) {
    e.exports = '.hide{display:none !important}.clearfix:after{content:"";display:block;clear:both}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}games{display:flex;flex-flow:column;width:100%}games header{display:flex;justify-content:center;align-content:center;flex-direction:column;height:24px;background:#103137;padding-left:24px;font-weight:900;font-size:10px;color:rgba(255,255,255,0.25);letter-spacing:2px;text-transform:uppercase}games .games{flex:1;overflow-y:auto}games .games::-webkit-scrollbar{background-color:transparent;width:10px;box-shadow:inset 2px 2px 5px 0px rgba(0,0,0,0.3)}games .games::-webkit-scrollbar-thumb:window-inactive,games .games::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.25)}games .games::-webkit-scrollbar-thumb:window-inactive:hover,games .games::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.25)}games .game{position:relative;display:block;height:60px;position:relative;background:#071E22;border-bottom:1px solid #103137;font-weight:bold;font-size:12px;color:#fff;letter-spacing:0.5px;text-decoration:none;padding-right:24px}games .game:before{content:"";display:block;position:absolute;left:0;top:50%;bottom:50%;width:4px;background:#39AF45;z-index:1;opacity:0;transition:top 0.3s, bottom 0.3s, opacity 0.15s}games .game:hover:before,games .game.highlight:before{top:0;bottom:0;opacity:1}games .game img{width:33px;height:33px;margin:13px 16px 13px 24px;float:left}games .game .label{padding-top:14px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}games .game .label .editor-name{font-size:10px;font-weight:200;padding-top:5px}games .game>div{opacity:0.5;transition:opacity 0.15s}games .game:hover>div,games .game.highlight>div{opacity:1}\n'
}), define("text!app/resources/elements/profile.css", ["module"], function(e) {
    e.exports = '.hide{display:none !important}.clearfix:after,profile .profile:after{content:"";display:block;clear:both}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}profile{display:block;width:100%;background:#0C272C;position:relative}profile .profile{display:block;padding:16px 24px}profile .profilea{cursor:pointer}profile .profilea *{cursor:pointer}profile .profile img{width:40px;height:40px;border-radius:20px;margin-right:16px;float:left}profile .profile .info{float:left;height:40px}profile .profile .gamertag{display:block;font-weight:bold;font-size:14px;color:#fff;letter-spacing:0.5px}profile .profile .gamerscore{display:block;margin-top:7px;line-height:13px;padding-left:20px;font-weight:900;font-size:9.6px;color:#39AF45;letter-spacing:0.8px;background:url(../../../static/images/gamerscore-icon.svg) center left no-repeat}profile .signout{background:transparent;border:none;position:absolute;right:24px;top:50%;transform:translate(0, -50%);z-index:1}profile .signout svg *{fill:#485D60;transition:fill 0.15s}profile .signout:hover svg *{fill:#fff}\n'
}), define("text!app/resources/elements/donation.html", ["module"], function(e) {
    e.exports = '<template><require from="./donation.css"></require><button click.delegate="visit()"><img src="static/images/patreon-logo.svg"> Donate on Patreon</button></template>'
}), define("text!app/resources/elements/sidebar.css", ["module"], function(e) {
    e.exports = "sidebar{display:flex;flex-flow:column;width:280px;min-width:280px;height:calc(100vh - 56px);background:#071E22;position:relative}sidebar games{position:relative;left:0;height:100%}sidebar support{padding-bottom:0px}\n"
}), define("text!app/resources/elements/games.html", ["module"], function(e) {
    e.exports = '<template><require from="./games.css"></require><header css="height: ${\'storageExplorer\' | env:\'24px\':\'40px\'}">Mods</header><div class="games"><template repeat.for="title of titles | sort:\'name\'"><a repeat.for="editor of title.editors" class="game ${router.currentInstruction.config.name === \'editor\' && router.currentInstruction.params.scid === title.scid ? \'highlight\' : \'\'}" route-href="route: editor; params.bind: {scid: title.scid, index: $index}"><div><img src.bind="title.thumbnailUrl" style="width:32px"><div class="label">${title.name}<div class="editor-name">${title.editors[$index].name}</div></div></div></a></template></div></template>'
}), define("text!app/resources/elements/storage-explorer.css", ["module"], function(e) {
    e.exports = '.hide{display:none !important}.clearfix:after{content:"";display:block;clear:both}.ellipsis,storage-explorer .titles .title .title-header .name,storage-explorer .containers .container>.header .name,storage-explorer .files .file .save-button .name{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}storage-explorer{position:relative;z-index:999}storage-explorer .toggle-button{width:280px;height:40px;font-weight:900;font-size:10px;color:rgba(255,255,255,0.25);letter-spacing:2px;text-transform:uppercase;padding:0 24px;background:#0C272C;border:0;border-top:1px solid #103137;border-bottom:1px solid #103137;text-align:left;transition:color 0.15s, background 0.15s, border 0.15s}storage-explorer .toggle-button svg{float:right}storage-explorer .toggle-button svg *{fill:#485D60;transition:fill 0.15s}storage-explorer .toggle-button:hover{background:#174b54;border-top:#174b54 1px solid;border-bottom:#174b54 1px solid;color:#fff}storage-explorer .toggle-button:hover svg *{fill:#fff}storage-explorer .explorer{position:fixed;width:500px;overflow-y:auto;background:#071E22;transform:translate(-100%, 0);visibility:hidden;opacity:0;transition:transform 0.2s ease-in-out}storage-explorer .explorer::-webkit-scrollbar{background-color:transparent;width:10px;box-shadow:inset 2px 2px 5px 0px rgba(0,0,0,0.3)}storage-explorer .explorer::-webkit-scrollbar-thumb:window-inactive,storage-explorer .explorer::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.25)}storage-explorer .explorer::-webkit-scrollbar-thumb:window-inactive:hover,storage-explorer .explorer::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.25)}storage-explorer ul{margin:0;padding:0;list-style:none}storage-explorer status-ring{display:block;margin:0 auto 15px auto;width:30px;height:30px}storage-explorer .titles .title{position:relative}storage-explorer .titles .title:before{content:"";display:block;position:absolute;left:0;top:50%;bottom:50%;width:4px;background:#27A1F1;z-index:1;opacity:0;transition:top 0.3s, bottom 0.3s, opacity 0.15s}storage-explorer .titles .title:hover:before,storage-explorer .titles .title.highlight:before{top:0;bottom:0;opacity:1}storage-explorer .titles .title .title-wrapper{height:0;overflow:hidden}storage-explorer .titles .title .title-header{display:flex;height:60px;border-top:1px solid #103137;align-items:center;text-decoration:none}storage-explorer .titles .title .title-header .name{flex:1;opacity:0.5;font-size:12px;color:#fff;letter-spacing:0.5px}storage-explorer .titles .title .title-header .thumbnail{flex:0;padding:0 16px 0 24px}storage-explorer .titles .title .title-header .thumbnail img{width:33px;height:33px}storage-explorer .titles .title .title-header .icon{flex:0;padding:0 24px 0 16px}storage-explorer .titles .title .title-header .icon svg{transition:transform 0.3s}storage-explorer .titles .title:last-child{border-bottom:1px solid #103137}storage-explorer .titles .title.expanded{border-left-color:#27A1F1}storage-explorer .titles .title.expanded .title-header .icon svg{transform:rotate(90deg)}storage-explorer .titles .title.expanded .title-wrapper{height:auto}storage-explorer .containers{background:#0C272C}storage-explorer .containers .container{border-top:1px solid #103137}storage-explorer .containers .container>.header{display:flex;align-items:center;height:42px;text-decoration:none}storage-explorer .containers .container>.header .icon{flex:0;padding:0 25px 0 34px}storage-explorer .containers .container>.header .icon i{display:inline;width:11px;height:11px}storage-explorer .containers .container>.header .icon i.expanded-icon{display:none}storage-explorer .containers .container>.header .name{flex:1;font-size:10px;color:#fff;letter-spacing:0.5px}storage-explorer .containers .container>.header .meta{font-weight:bold;font-size:9px;color:#485D60;letter-spacing:1px;padding:0 24px}storage-explorer .containers .container>.header .meta em{color:#1D4951}storage-explorer .containers .container>.header:hover{background:rgba(255,255,255,0.025)}storage-explorer .containers .container:first-child{border-top:none}storage-explorer .containers .container.expanded>.header i{display:none}storage-explorer .containers .container.expanded>.header i.expanded-icon{display:inline}storage-explorer .files .file{padding:6px 24px 0px 70px}storage-explorer .files .file a{text-decoration:none}storage-explorer .files .file a:hover{background:rgba(255,255,255,0.025);transition:background 0.15s}storage-explorer .files .file:last-child{border-bottom:none;padding-bottom:10px}storage-explorer .files .file .wrapper{height:40px;display:flex;align-items:center;background:#103137;border:1px solid #194249;border-radius:3px}storage-explorer .files .file .save-button{display:flex;flex:1;align-items:center;height:100%}storage-explorer .files .file .save-button .icon{flex:0;padding:0 16px;width:48px;height:16px}storage-explorer .files .file .save-button .name{flex:1;font-size:10px;color:#fff;letter-spacing:0.5px}storage-explorer .files .file .save-button .size{flex:0;font-weight:bold;font-size:9px;color:#485D60;letter-spacing:1px;padding:0 24px;white-space:nowrap}storage-explorer .files .file .replace-button{height:100%;padding:0 14px;border-left:1px solid #194249;height:100%;display:flex;align-items:center}storage-explorer .files .file .replace-button i{display:block;width:13px}storage-explorer.open{height:auto}storage-explorer.open .toggle-button{color:#fff;background:#27A1F1;border-top-color:#27A1F1;border-bottom-color:#27A1F1}storage-explorer.open .toggle-button svg *{fill:rgba(255,255,255,0.5)}storage-explorer.open .toggle-button:hover{background:#57b6f4;border-top-color:#57b6f4;border-bottom-color:#57b6f4}storage-explorer.open .toggle-button:hover svg *{fill:#fff}storage-explorer.open .explorer{transform:translate(0, 0);opacity:1;visibility:visible;transition-delay:0s;height:calc(100% - 168px)}\n'
}), define("text!app/resources/elements/profile.html", ["module"], function(e) {
    e.exports = '<template><require from="./profile.css"></require><div if.bind="auth.gamercard" class="profile"><img src.bind="auth.gamercard.gamerpicUrl"><div class="info"><span class="gamertag">${auth.gamercard.gamertag}</span> <span class="gamerscore">${auth.gamercard.gamerscore | numberWithCommas}</span></div><button class="signout" click.trigger="signOut()"><i><inline-svg src="icons/power.svg"></inline-svg></i></button></div><a if.bind="!auth.gamercard" route-href="route: default" class="profile"><div class="info"><span class="gamertag">Guest</span> <span class="gamerscore">0</span></div></a></template>'
}), define("text!app/resources/elements/support.css", ["module"], function(e) {
    e.exports = '.hide{display:none !important}.clearfix:after{content:"";display:block;clear:both}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}support{display:block;width:100%;padding:16px 24px;background:#0C272C}support button{display:block;width:100%;height:40px;position:relative;text-align:center;background-image:linear-gradient(-133deg, #238bb6 0%, #29abe1 100%);border-radius:3px;border:0;font-weight:900;font-size:12px;color:#fff;letter-spacing:0.5px;transition:box-shadow 0.3s;line-height:40px}support button img{float:left;margin:10px;width:20px;height:20px;vertical-align:middle}support button,support button *{cursor:pointer}support button:after{content:"";width:40px;height:40px;background:url(static/images/icons/caret-right.svg) 25px center no-repeat;display:inline-block;float:right}support button:hover{box-shadow:0 0 10px rgba(35,139,182,0.8)}\n'
}), define("text!app/resources/elements/sidebar.html", ["module"], function(e) {
    e.exports = '<template><require from="./sidebar.css"></require><require from="./profile"></require><require from="./games"></require><require from="./support"></require><require from="./donation"></require><require from="./storage-explorer"></require><profile></profile><storage-explorer if.bind="\'storageExplorer\' | env"></storage-explorer><games></games><support></support><donation></donation></template>'
}), define("text!app/resources/elements/window-controls.css", ["module"], function(e) {
    e.exports = "window-controls{display:inline-block}window-controls ul{list-style:none;margin:0;padding:0;transform:translate(0, -3px)}window-controls ul li{display:inline-block;margin-right:14px;width:14px;height:14px}window-controls ul li:last-child{margin-right:0}window-controls ul li *{cursor:pointer}window-controls ul li svg{width:14px;height:14px}window-controls ul li svg *{transition:opacity 0.15s}window-controls ul li:hover svg *{opacity:1}\n"
}), define("text!app/resources/elements/storage-explorer.html", ["module"], function(e) {
    e.exports = '<template class="${opened ? \'open\' : \'\'}"><require from="./storage-explorer.css"></require><button class="toggle-button" click.delegate="toggle()">Storage Explorer <i if.bind="opened"><inline-svg src="icons/close.svg"></inline-svg></i><i if.bind="!opened"><inline-svg src="icons/caret-right.svg"></inline-svg></i></button><div class="explorer" close-if-click-outside.two-way="opened"><ul class="titles"><li repeat.for="title of auth.gamercard.titles" class="title ${expandedTitles[title.scid] ? \'expanded highlight\' : \'\'}"><a href="#" class="title-header" click.delegate="toggleTitle(title.scid)"><div class="thumbnail"><img src.bind="title.imageUrl"></div><span class="name">${title.name}</span> <span class="icon"><inline-svg src="icons/caret-right.svg"></inline-svg></span></a><div class="title-wrapper"><status-ring if.bind="!containers[title.scid]"></status-ring><ul if.bind="containers[title.scid].length" class="containers"><li repeat.for="container of containers[title.scid]" class="container ${expandedContainers[title.scid + \'.\' + container.name] ? \'expanded\' : \'\'}"><a href="#" class="header" click.delegate="toggleContainer(title.scid, container)"><span class="icon"><i class="expanded-icon"><inline-svg src="icons/minus.svg"></inline-svg></i><i><inline-svg src="icons/plus.svg"></inline-svg></i></span><span class="name">${container.name}</span> <span class="meta">${container.size | byteFormat} <em>&bull;</em> ${container.modifiedAt | friendlyDate:\'M/D/YY\'}</span></a><ul if.bind="expandedContainers[title.scid + \'.\' + container.name] && container.files.length" class="files"><li repeat.for="file of container.files" class="file"><div class="wrapper"><a href="#" click.trigger="saveAs(title.scid, container, file)" class="save-button"><span class="icon"><i><inline-svg src="icons/disk.svg"></inline-svg></i></span><span class="name">${file.name}</span> <span class="size">${file.size | byteFormat}</span> </a><a href="#" click.trigger="replace(title.scid, container, file)" class="replace-button"><i><inline-svg src="icons/upload.svg"></inline-svg></i></a></div></li></ul><ul if.bind="expandedContainers[title.scid + \'.\' + container.name] && !container.files.length" class="files"><li class="file"><div class="wrapper"><div class="save-button"><span class="icon"></span> <span class="name">No Files</span></div></div></li></ul></li></ul><ul if.bind="containers[title.scid] && !containers[title.scid].length" class="containers"><li class="container"><div class="header"><span class="icon"></span> <span class="name">No Saves</span></div></li></ul></div></li></ul><status-tip if.bind="isDownloading" title="Downloading..." message="Downloading your file from the cloud..."></status-tip><status-tip if.bind="isUploading" title="Uploading..." message="Syncing your file to the cloud..."></status-tip></div></template>'
}), define("text!editor/resources/elements/card.css", ["module"], function(e) {
    e.exports = '.hide{display:none !important}.clearfix:after{content:"";display:block;clear:both}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}card{display:block;position:relative}card .card-wrapper{position:relative;background:#fff;box-shadow:0 1px 2px 0 rgba(0,0,0,0.16);margin:16px 24px 0 24px;align-items:center;display:flex;padding:21px 24px}card.with-label label{font-weight:bold;font-size:12px;color:#02394A;letter-spacing:0.5px;flex:1}card.without-label .card-wrapper{overflow-y:auto;overflow-x:visible;display:block}card.without-label .card-wrapper::-webkit-scrollbar{background-color:#EFF1F3;width:10px;box-shadow:inset 2px 2px 5px 0px rgba(0,0,0,0.3)}card.without-label .card-wrapper::-webkit-scrollbar-thumb:window-inactive,card.without-label .card-wrapper::-webkit-scrollbar-thumb{background:#617282}card.without-label .card-wrapper::-webkit-scrollbar-thumb:window-inactive:hover,card.without-label .card-wrapper::-webkit-scrollbar-thumb:hover{background:#6c7e90}card table{margin:-16px -24px 2px -24px;width:calc(100% + 48px)}\n'
}), define("text!app/resources/elements/support.html", ["module"], function(e) {
    e.exports = '<template><require from="./support.css"></require><button click.delegate="visit()"><img src="static/images/icons/speech-bubble.svg"> Join the Discussion</button></template>'
}), define("text!editor/resources/elements/v-button.css", ["module"], function(e) {
    e.exports = '.hide{display:none !important}.clearfix:after{content:"";display:block;clear:both}.ellipsis,v-button{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}v-button{display:inline-block;max-width:100%;border-radius:3px;background:#39AF45;height:30px;font-weight:900;font-size:12px;color:#fff;letter-spacing:0.5px;line-height:30px;padding:0 13px;border:0;transition:background 0.15s;margin-left:5px;cursor:pointer}v-button:hover{background:#54c760}v-button.disabled{pointer-events:none;opacity:0.5}\n'
}), define("text!app/resources/elements/window-controls.html", ["module"], function(e) {
    e.exports = '<template class="window-controls"><require from="./window-controls.css"></require><ul><li if.bind="!minimized" click.trigger="minimize()"><inline-svg src="icons/app-minimize.svg"></inline-svg></li><li if.bind="!maximized" click.trigger="maximize()"><inline-svg src="icons/app-maximize.svg"></inline-svg></li><li if.bind="maximized" click.trigger="restore()"><inline-svg src="icons/app-restore.svg"></inline-svg></li><li click.trigger="close()"><inline-svg src="icons/app-close.svg"></inline-svg></li></ul></template>'
}), define("text!editor/resources/elements/v-number.css", ["module"], function(e) {
    e.exports = "v-number{position:relative;display:inline-block}v-number input{display:inline-block;width:85px;height:24px;border-radius:1.5px;border:1px solid #D4D8DC;background:transparent;padding:0 30px;font-weight:bold;font-size:12.5px;color:#295666;letter-spacing:0;text-align:center;outline:none}v-number input::-webkit-inner-spin-button{-webkit-appearance:none;opacity:0}v-number button{position:absolute;top:2px;width:20px;height:20px;background:#39AF45;border-radius:2px;border:0;outline:none;cursor:pointer}v-number button svg{width:8px;height:8px;transform:translate(0, -1px)}v-number button svg *{fill:#fff}v-number button:hover{background:#54c760}v-number button.increment{right:2px}v-number button.decrement{left:2px}\n"
}), define("text!editor/resources/elements/card.html", ["module"], function(e) {
    e.exports = '<template bindable="label, height" class="${label ? \'with-label\' : \'without-label\'}"><require from="./card.css"></require><div class="card-wrapper" css.bind="{height: height ? height : \'auto\'}"><label if.bind="label">${label}</label><slot></slot></div></template>'
}), define("text!editor/resources/elements/v-selection.css", ["module"], function(e) {
    e.exports = '.hide{display:none !important}.clearfix:after{content:"";display:block;clear:both}.ellipsis,v-selection .select .value,v-selection .select .option{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}v-selection{display:inline-block;width:100%;max-width:150px;min-width:75px}v-selection .select{height:30px;width:100%;position:relative;background:#fff}v-selection .select *{cursor:pointer}v-selection .select .value,v-selection .select .option{height:30px;width:100%;padding:0 16px;font-size:12px;color:#02394A;letter-spacing:0.5px;line-height:30px}v-selection .select .value{padding-right:40px;border-radius:3px;transition:border-radius 0.3s;border:1px solid #c0c0c0;border-radius:3px}v-selection .select .select-arrow{pointer-events:none;position:absolute;right:10px;top:3px}v-selection .select .select-arrow svg *{fill:#526173}v-selection .select .options{border:1px solid #c0c0c0;position:absolute;left:0;top:29px;z-index:1;width:100%;max-height:200px;overflow-x:hidden;overflow-y:auto;visibility:hidden;opacity:0;border-bottom-right-radius:3px;border-bottom-left-radius:3px;transition:opacity 0.3s, visibility 0s linear 0.3s}v-selection .select .options::-webkit-scrollbar{background-color:#fff;width:10px;box-shadow:inset 2px 2px 5px 0px rgba(0,0,0,0.3)}v-selection .select .options::-webkit-scrollbar-thumb:window-inactive,v-selection .select .options::-webkit-scrollbar-thumb{background:silver}v-selection .select .options::-webkit-scrollbar-thumb:window-inactive:hover,v-selection .select .options::-webkit-scrollbar-thumb:hover{background:#cdcdcd}v-selection .select .options .option{background:#fff}v-selection .select .options .option:hover{background:#efefef}v-selection .select:hover .select-arrow svg *{fill:#000}v-selection .select.open .value{border-bottom-left-radius:0;border-bottom-right-radius:0}v-selection .select.open .options{opacity:1;visibility:visible;transition-delay:0s}\n'
}), define("text!editor/resources/elements/v-button.html", ["module"], function(e) {
    e.exports = "<template class=\"${disabled ? 'disabled' : ''}\"><require from=\"./v-button.css\"></require><slot></slot></template>"
}), define("text!editor/resources/elements/v-slider.css", ["module"], function(e) {
    e.exports = "v-slider{position:relative;display:inline-block;width:100%;max-width:180px}v-slider input[type=range]{-webkit-appearance:none;background:transparent;cursor:pointer;width:100%;margin:0}v-slider input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:13px;height:13px;background-color:#40AC3F;border-radius:50%;margin:-5px 0 0 0;padding:0;transition:background-color 0.15s}v-slider input[type=range]::-webkit-slider-thumb:hover{background-color:#5cc35b;cursor:url(static/images/openhand.cur),default}v-slider input[type=range]::-webkit-slider-thumb:active:hover{cursor:url(static/images/closedhand.cur),default}v-slider input[type=range]::-webkit-slider-runnable-track{width:100%;height:3px;border-radius:3px;background:rgba(41,86,102,0.25);margin:0;padding:0}v-slider input[type=range]:focus{outline:none}v-slider .label-wrapper{margin:3px 7px 0 6.5px}v-slider label{font-family:Gotham;font-weight:bold;display:inline-block;font-size:10px;color:#295666;letter-spacing:0.25px;text-align:center;transform:translate(-50%, 0)}\n"
}), define("text!editor/resources/elements/v-number.html", ["module"], function(e) {
    e.exports = '<template><require from="./v-number.css"></require><button click.delegate="decrease()" class="decrement"><i><inline-svg src="icons/minus.svg"></inline-svg></i></button> <input type="number" placeholder.bind="placeholder" value.bind="value"> <button click.delegate="increase()" class="increment"><i><inline-svg src="icons/plus.svg"></inline-svg></i></button></template>'
}), define("text!editor/resources/elements/v-switch.css", ["module"], function(e) {
    e.exports = 'v-switch .switch{display:flex;width:38px;height:24px;border:3px solid #39AF45;border-radius:12px;position:relative;transition:border-color 0.15s}v-switch .switch,v-switch .switch *{cursor:pointer}v-switch .switch:before{content:"";display:block;width:15px;height:15px;position:absolute;left:2px;top:2px;background:#39AF45;border-radius:7.5px;transition:left 0.15s, background-color 0.15s}v-switch .switch.on:before{left:15px}v-switch .switch:hover{border-color:#54c760}v-switch .switch:hover:before{background-color:#54c760}\n'
}), define("text!editor/resources/elements/v-selection.html", ["module"], function(e) {
    e.exports = '<template><require from="./v-selection.css"></require><div class="select ${open ? \'open\' : \'\'}" close-if-click-outside.two-way="open"><div class="value" click.delegate="open = !open">${selectedOption.label}</div><div class="options"><div repeat.for="option of options" click.delegate="select(option)" class="option">${option.label}</div></div><i class="select-arrow"><inline-svg src="icons/caret-down.svg"></inline-svg></i></div></template>'
}), define("text!editor/resources/elements/v-text.css", ["module"], function(e) {
    e.exports = "v-text input{display:inline-block;height:30px;max-width:150px;color:#02394A;border:1px solid rgba(0,0,0,0.25);border-radius:3px;padding:0 12px;outline:none}\n"
}), define("text!editor/resources/elements/v-slider.html", ["module"], function(e) {
    e.exports = '<template><require from="./v-slider.css"></require><input type="range" min.bind="min" max.bind="max" step.bind="step" value.bind="rangeValue"><div class="label-wrapper"><label ref="labelElement">${label}</label></div></template>'
}), define("text!editor/resources/elements/v-tree-node.css", ["module"], function(e) {
    e.exports = '.hide{display:none !important}.clearfix:after{content:"";display:block;clear:both}.ellipsis,v-tree-node .node .node-wrapper .name{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}v-tree-node{display:block}v-tree-node .node .node-wrapper{display:flex;flex-direction:row;align-items:center;height:30px;margin-bottom:3px}v-tree-node .node .node-wrapper .icon{flex:0;padding-right:24px;display:inline-block;width:42px;height:18px}v-tree-node .node .node-wrapper .icon svg{width:18px;height:18px}v-tree-node .node .node-wrapper .icon svg *{fill:#295666}v-tree-node .node .node-wrapper .name{flex:1;font-size:12px;line-height:30px;color:#295666;letter-spacing:0.76px}v-tree-node .node .node-wrapper .component{flex:0;min-width:150px}v-tree-node .node>.nodes{max-height:0px;padding-left:42px;overflow:hidden;opacity:0;transition:max-height 0.5s cubic-bezier(0, 1, 0, 1),opacity 0.5s linear}v-tree-node .node.expandable>.node-wrapper .icon,v-tree-node .node.expandable>.node-wrapper .icon *,v-tree-node .node.expandable>.node-wrapper .name,v-tree-node .node.expandable>.node-wrapper .name *{cursor:pointer}v-tree-node .node.expandable>.node-wrapper:hover .icon svg *{fill:#000}v-tree-node .node.expandable>.node-wrapper:hover .name{color:#000}v-tree-node .node:not(.expandable){padding-left:42px}v-tree-node .node.expandable.expanded>.node-wrapper .name{color:#39AF45}v-tree-node .node.expandable.expanded>.node-wrapper .icon svg *{fill:#39AF45}v-tree-node .node.expandable.expanded>.nodes{max-height:1000px;opacity:1;transition-timing-function:ease-in}\n'
}), define("text!editor/resources/elements/v-switch.html", ["module"], function(e) {
    e.exports = '<template><require from="./v-switch.css"></require><div class="switch ${value ? \'on\' : \'off\'}" click.delegate="value = !value"></div></template>'
}), define("text!editor/resources/elements/v-tree.css", ["module"], function(e) {
    e.exports = '.hide{display:none !important}.clearfix:after{content:"";display:block;clear:both}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}v-tree::-webkit-scrollbar{background-color:#EFF1F3;width:10px;box-shadow:inset 2px 2px 5px 0px rgba(0,0,0,0.3)}v-tree::-webkit-scrollbar-thumb:window-inactive,v-tree::-webkit-scrollbar-thumb{background:#617282}v-tree::-webkit-scrollbar-thumb:window-inactive:hover,v-tree::-webkit-scrollbar-thumb:hover{background:#6c7e90}\n'
}), define("text!editor/resources/elements/v-text.html", ["module"], function(e) {
    e.exports = '<template bindable="value"><require from="./v-text.css"></require><input type="text" css.bind="style" placeholder.bind="placeholder || \'\'" value.bind="value"></template>'
}), define("text!editor/resources/elements/v-tree-node.html", ["module"], function(e) {
    e.exports = '<template><require from="./v-tree-node.css"></require><div class="node ${expanded ? \'expanded\' : \'\'} ${node.nodes.length ? \'expandable\' : \'\'}"><div class="node-wrapper"><div class="icon" if.bind="node.nodes.length" click.delegate="toggle()"><i if.bind="!expanded"><inline-svg src="icons/plus.svg"></inline-svg></i><i if.bind="expanded"><inline-svg src="icons/minus.svg"></inline-svg></i></div><div class="name" click.delegate="toggle()">${node.name}</div><div class="component" if.bind="node.component"><v-button if.bind="node.component.type == \'button\'" click.delegate="node.component.callback()">${node.component.label}</v-button><selection if.bind="node.component.type == \'select\'" value.bind="node.component.value" options.bind="node.component.options"></selection><slider if.bind="node.component.type == \'slider\'" value.bind="node.component.value" min.bind="node.component.min" max.bind="node.component.max" step.bind="node.component.step"></slider><v-text if.bind="node.component.type == \'text\'" value.bind="node.component.value" type="text"></v-text></div></div><div class="nodes"><div class="nodes-wrapper"><v-tree-node repeat.for="node of node.nodes" node.bind="node"></v-tree-node></div></div></div></template>'
}), define("text!editor/resources/elements/v-tree.html", ["module"], function(e) {
    e.exports = '<template><require from="./v-tree.css"></require><require from="./v-tree-node"></require><v-tree-node repeat.for="node of nodes" node.bind="node"></v-tree-node></template>'
}), define("text!editor/titles/component-test/index.html", ["module"], function(e) {
    e.exports = '<template><header>Category 1</header><card label="Text Test"><v-text value.bind="textValue"></v-text></card><card label="Select Test"><v-selection value.bind="selectValue" options.bind="selectOptions"></v-selection></card><card label="Switch Test"><v-switch value.bind="switchValue"></v-switch></card><card label="Slider Test"><v-slider min.bind="sliderMin" max.bind="sliderMax" step.bind="sliderStep" value.bind="sliderValue"></v-slider></card><card label="Button Test"><v-button click.delegate="buttonCallback()">${buttonLabel}</v-button></card><card label="Disabled Button Test"><v-button click.delegate="buttonCallback()" disabled.bind="true">${buttonLabel}</v-button></card><card label="Number Test"><v-number value.bind="numberValue" min.bind="numberMin" max.bind="numberMax" placeholder="5" step.bind="numberStep"></v-number></card><card><v-tree nodes.bind="treeNodes"></v-tree></card><header>Category 2</header><card height="100px"><table><thead><th>Column One</th><th>Column Two</th><th>Column Three</th><th>Column Four</th></thead><tbody><tr><td>Text</td><td><v-text value.bind="textValue"></v-text></td><td>Select</td><td><v-selection value.bind="selectValue" options.bind="selectOptions"></v-selection></td></tr><tr><td>Switch</td><td><v-switch value.bind="switchValue"></v-switch></td><td>Slider</td><td><v-slider min.bind="sliderMin" max.bind="sliderMax" step.bind="sliderStep" value.bind="sliderValue"></v-slider></td></tr><tr><td>Switch</td><td><v-switch value.bind="switchValue"></v-switch></td><td>Button</td><td><v-button click.trigger="buttonCallback()">Button label is really long</v-button></td></tr></tbody></table></card></template>'
}), define("text!editor/titles/gears-of-war-4/index.html", ["module"], function(e) {
    e.exports = "<template></template>"
}), define("text!editor/titles/modern-warfare/index.html", ["module"], function(e) {
    e.exports = '<template><header>Player</header><card label="God Mode"><v-button disabled.bind="godModeEnabled" click.delegate="enableGodMode()">Enable God Mode</v-button></card><card label="Speed"><v-slider min="0" max="1000" step="10" default="500" value.bind="seg2.dvars[hashes[\'g_speed\']] | intDvar"></v-slider></card><card label="Jump Height"><v-slider min="0" max="1000" step="10" value.bind="seg2.dvars[hashes[\'jump_height\']] | intDvar"></v-slider></card><card label="Unlimited Sprint"><v-switch value.bind="seg2.dvars[hashes[\'player_sprintUnlimited\']] | boolDvar"></v-switch></card><card label="Sprint Speed Multiplier"><v-slider min="0" max="25" step="0.5" value.bind="seg2.dvars[hashes[\'player_sprintSpeedScale\']] | floatDvar"></v-slider></card><header>Weapons</header><card label="Unlimited Ammo"><v-switch value.bind="seg2.dvars[hashes[\'player_sustainAmmo\']] | boolDvar"></v-switch></card><card label="Clip Size Multiplier"><v-slider min="1" max="50" step="0.5" log="true" placeholder="1" value.bind="seg2.dvars[hashes[\'player_clipSizeMultiplier\']] | floatDvar"></v-slider></card><header>Environment</header><card label="Gravity"><v-slider min="0" max="1000" step="5" value.bind="seg2.dvars[hashes[\'g_gravity\']] | floatDvar"></v-slider></card><header>Advanced - DVARs</header><card label="DVAR Backup"><v-button click.delegate="backupDvars()">Backup DVARs</v-button><v-button click.delegate="restoreDvars()">Restore DVARs...</v-button></card><card label="Filter DVARs"><v-text type="text" style="width:243px;max-width:none" value.bind="dvarFilter"></v-text></card><card><table><thead><th>DVAR</th><th>Value</th></thead><tbody><template repeat.for="dvar of seg2.dvars | objectKeys | dvars:dvarFilter"><tr if.bind="dvar | filterDvar:seg2.dvars:dvarFilter"><td>${dvar.name || dvar.hash}</td><td><v-text value.bind="seg2.dvars[dvar.hash]" placeholder="Not Set"></v-text></td></tr></template></tbody></table></card></template>'
});
//# sourceMappingURL=app-bundle.js.map