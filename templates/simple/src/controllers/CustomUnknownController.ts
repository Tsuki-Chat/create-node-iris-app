import {
  ChatContext,
  Command,
  Logger,
  UnknownController,
} from "@racla-dev/node-iris";

@UnknownController
class CustomUnknownController {
  private logger: Logger;

  constructor() {
    this.logger = new Logger(CustomUnknownController.name);
  }

  @Command
  async onUnknown(context: ChatContext) {
    this.logger.warn("Unknown event received", {
      type: context.raw?.type || "unknown",
      room: context.room.name,
      sender: await context.sender.getName(),
      data: context.raw,
    });
  }
}

export default CustomUnknownController;
