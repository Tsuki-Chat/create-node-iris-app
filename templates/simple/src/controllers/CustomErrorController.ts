import { ErrorController, Logger, Command } from "@racla-dev/node-iris";

@ErrorController
class CustomErrorController {
  private logger: Logger;

  constructor() {
    this.logger = new Logger(CustomErrorController.name);
  }

  @Command
  async onError(error: any) {
    this.logger.error("Bot Error", error, {
      message: error?.message || "Unknown error",
      stack: error?.stack,
      error: error,
    });
  }
}

export default CustomErrorController;
