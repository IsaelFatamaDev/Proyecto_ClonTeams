import express from "express";
import path from "path";
import adminRouter from "./src/routes/admin.js";
import morgan from "morgan";

const app = express();

app.set("view engine", "ejs");

app.set("views", path.join("views"));
app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join("public")));

const PORT = process.env.PORT || 3000;

app.use("/", adminRouter);

app.listen(PORT, () => {
     console.log(`Server is running on port http://localhost:${PORT}`);
});
