const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const loginRoute = require("./routes/UserRoute.js");
const scheduleRoute = require("./routes/ScheduleMessageRoutes.js");
const whatsappRoute = require("./routes/WhatsappAuthRoute.js");
const recipientRoute = require("./routes/RecipientRoute.js");
const templateMessage = require("./routes/TemplateMessageRoutes.js");
const activityRoute = require("./routes/ActivityRoutes.js");

const cors = require('cors');
require("./controllers/SchedulerController.js");

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(loginRoute);
app.use(recipientRoute);
app.use(scheduleRoute);
app.use(whatsappRoute);
app.use(templateMessage);
app.use(activityRoute);

app.listen(5005, () => console.log('Server Up and Running...'));