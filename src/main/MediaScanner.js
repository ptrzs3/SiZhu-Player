"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaScanner = void 0;
var os = require("os");
var path_1 = require("path");
var fs_1 = require("fs");
var MediaScanner = /** @class */ (function () {
    /**
     *
     * @param paths music librarys
     */
    function MediaScanner(paths, recursive) {
        if (paths === void 0) { paths = []; }
        if (recursive === void 0) { recursive = true; }
        /**
         * music librarys or default to USER.MUSIC
         */
        this.librarys = [];
        this.songs = new Set();
        this.allowedFormats = ['.mp3', '.flac', '.ogg', '.wav', '.wma'];
        /**
         * recursively scan or not, default to true
         */
        this.recursive = true;
        this.recursive = recursive;
        this._processLibrarys(paths);
        console.log(this.librarys);
    }
    MediaScanner.prototype._processLibrarys = function (paths) {
        // User passed the paths
        if (paths.length) {
            this.librarys = paths;
            console.log(paths);
        }
        else {
            switch (os.platform()) {
                case 'win32':
                    if (process.env.USERPROFILE) {
                        this.librarys = [(0, path_1.join)(process.env.USERPROFILE, 'Music')];
                    }
                    else {
                        this.librarys = [''];
                    }
                    break;
                case 'darwin':
                    this.librarys = [(0, path_1.join)(os.homedir(), 'Music/Music/Media.localized')];
                    break;
                case 'linux':
                    this.librarys = [(0, path_1.join)(os.homedir(), 'Music')];
                    break;
                default:
                    console.error('sorry, unsupported platform');
            }
        }
    };
    MediaScanner.prototype.scanDirectory = function (dir) {
        if (dir === void 0) { dir = ''; }
        return __awaiter(this, void 0, void 0, function () {
            var items;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!dir.length) {
                            return [2 /*return*/, ['']];
                        }
                        return [4 /*yield*/, fs_1.promises.readdir(dir, {
                                recursive: this.recursive
                            })];
                    case 1:
                        items = _a.sent();
                        items = items.filter(function (item) {
                            return _this.allowedFormats.includes((0, path_1.extname)(item));
                        });
                        return [2 /*return*/, items.map(function (item) { return (0, path_1.join)(dir, item); })];
                }
            });
        });
    };
    MediaScanner.prototype.scanDirectories = function () {
        return __awaiter(this, void 0, void 0, function () {
            var songLists;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.songs.clear();
                        console.time('start');
                        return [4 /*yield*/, Promise.all(this.librarys.map(function (path) {
                                return _this.scanDirectory(path);
                            }))];
                    case 1:
                        songLists = _a.sent();
                        songLists.map(function (list) { return list.map(function (song) { return _this.songs.add(song); }); });
                        console.timeEnd('start');
                        return [2 /*return*/];
                }
            });
        });
    };
    return MediaScanner;
}());
exports.MediaScanner = MediaScanner;
