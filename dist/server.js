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
        while (_) try {
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
import path from "path";
import express from "express";
import fs from "fs";
import cors from "cors";
import fetch from "node-fetch";
import shopify from "shopify-buy";
import getPriceRings from "./api/index.js";
global.fetch = fetch;
var app = express();
var __dirname = path.resolve();
var PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV === "development") {
    PORT = process.env.DEV_PORT_API;
}
// Middlewares
app.use(cors());
app.use("/", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryParams, client, priceRings, filePath, dataWriteFile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                queryParams = req.query;
                if (!(queryParams["update_pricing"] &&
                    queryParams["update_pricing"] === "true")) return [3 /*break*/, 2];
                client = shopify.buildClient({
                    domain: "annasheffield.myshopify.com",
                    storefrontAccessToken: "6ce2afdc8e2e91cf7c8c3ebcffb3c629",
                });
                return [4 /*yield*/, getPriceRings(client)];
            case 1:
                priceRings = _a.sent();
                filePath = path.resolve(__dirname, "dist", "file", "price.json");
                dataWriteFile = JSON.stringify(priceRings);
                try {
                    fs.writeFileSync(filePath, dataWriteFile);
                    return [2 /*return*/, res.json({ 'status': 'ok' })];
                }
                catch (error) {
                    console.error(error);
                }
                _a.label = 2;
            case 2:
                next();
                return [2 /*return*/];
        }
    });
}); });
app.get("/getPrices", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var filePath, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filePath = path.resolve(__dirname, "dist", "file", "price.json");
                    return [4 /*yield*/, fs.readFileSync(filePath, {
                            encoding: "utf8",
                            flag: "r",
                        })];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, res.json(JSON.parse(data))];
            }
        });
    });
});
// ROUTES
app.use(express.json());
app.use(express.static(path.join(__dirname, "build")));
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.listen(PORT, function () {
    return console.log("Listening on " + PORT);
});