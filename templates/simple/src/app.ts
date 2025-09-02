import "dotenv/config";
import { Bot } from "@racla-dev/node-iris";
import { Logger } from "@racla-dev/node-iris";

// Import controller classes
import CustomChatController from "./controllers/CustomChatController";
import CustomNewMemberController from "./controllers/CustomNewMemberController";
import CustomDeleteMemberController from "./controllers/CustomDeleteMemberController";
import CustomMessageController from "./controllers/CustomMessageController";
import CustomFeedController from "./controllers/CustomFeedController";
import CustomUnknownController from "./controllers/CustomUnknownController";
import CustomErrorController from "./controllers/CustomErrorController";
import CustomBatchController from "./controllers/CustomBatchController";
import CustomBootstrapController from "./controllers/CustomBootstrapController";

const appName = "Create-Node-Iris-App";

// Controller configuration
const controllers = [
  CustomChatController,
  CustomNewMemberController,
  CustomDeleteMemberController,
  CustomMessageController,
  CustomFeedController,
  CustomUnknownController,
  CustomErrorController,
  CustomBatchController,
  CustomBootstrapController,
];

class App {
  private bot: Bot;
  private logger: Logger;

  constructor() {
    if (!process.env.IRIS_URL) {
      throw new Error("Need IRIS_URL environment variable");
    }
    this.logger = new Logger("Bootstrap");
    this.bot = new Bot(appName, process.env.IRIS_URL, {
      saveChatLogs: process.env.SAVE_CHAT_LOGS === "true",
      autoRegisterControllers: false, // Disable auto-registration
    });

    // Register controllers manually
    this.bot.registerControllers(controllers);
  }

  public async start() {
    try {
      if (!process.env.IRIS_URL) {
        throw new Error("Need IRIS_URL environment variable");
      }
      this.logger.info(`${this.bot.name} is starting...`);
      await this.bot.run();
    } catch (error) {
      this.logger.error(`${this.bot.name} failed to start:`, error);
      process.exit(1);
    }
  }

  public async stop() {
    try {
      this.bot.stop();
    } catch (error) {
      this.logger.error(`${this.bot.name} failed to stop:`, error);
    }
  }
}

export default App;
