"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("./src/routing/index"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3001;
const corsOptions = {
    origin: 'http://localhost:3002',
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
const mongoDB = "mongodb://127.0.0.1:27017/FullStackDB";
mongoose_1.default.connect(mongoDB);
mongoose_1.default.Promise = Promise;
const db = mongoose_1.default.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use((req, res, next) => {
    express_1.default.json()(req, res, next);
});
app.use("/", index_1.default);
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, morgan_1.default)("dev"));
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
