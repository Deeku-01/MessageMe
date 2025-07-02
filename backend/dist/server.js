"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const db_1 = require("./lib/db");
const auth_middleware_1 = require("./middleware/auth.middleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({}));
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.get("/me", auth_middleware_1.protectedRoute, (req, res) => {
    res.status(200).json({
        message: "Protected route accessed successfully",
        user: req.user // Assuming req.user is set by the protectedRoute middleware
    });
});
app.use("/api/auth", auth_1.default);
const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
    await (0, db_1.connectDB)();
    console.log("Database connected successfully");
    console.log(`Server is running on port http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map