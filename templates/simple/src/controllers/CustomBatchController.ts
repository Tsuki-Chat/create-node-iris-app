import {
  ChatContext,
  Logger,
  BatchController,
  Schedule,
  ScheduleMessage,
  BatchScheduler,
  ScheduledMessage,
} from "@racla-dev/node-iris";

@BatchController
class CustomBatchController {
  private logger: Logger;

  constructor() {
    this.logger = new Logger(CustomBatchController.name);
  }

  /**
   * 5초마다 배치된 메시지들을 처리하는 예제
   */
  @Schedule(5000) // 5초마다 실행
  async processBatchedMessages(contexts: ChatContext[]) {
    if (contexts.length === 0) return;

    this.logger.info(`Processing ${contexts.length} batched messages`);
    
    // 메시지별로 처리
    for (const context of contexts) {
      try {
        const senderName = await context.sender.getName();
        const message = context.message.msg;
        this.logger.debug(`Batch processing message from ${senderName}: ${message}`);
        
        // 여기에 배치 처리 로직을 구현하세요
        // 예: 데이터베이스 저장, 통계 수집, 알림 발송 등
        
      } catch (error) {
        this.logger.error('Error processing message in batch:', error);
      }
    }
  }

  /**
   * 30초마다 일일 요약을 생성하는 예제
   */
  @Schedule(30000, 'daily-summary') // 30초마다 실행, 커스텀 ID
  async generateDailySummary(contexts: ChatContext[]) {
    if (contexts.length === 0) return;
    
    const uniqueUsers = new Set<string>();
    const messagesByRoom = new Map<string, number>();
    
    for (const context of contexts) {
      try {
        const senderName = await context.sender.getName();
        uniqueUsers.add(senderName);
        
        const roomCount = messagesByRoom.get(context.room.id) || 0;
        messagesByRoom.set(context.room.id, roomCount + 1);
      } catch (error) {
        this.logger.error('Error processing context for summary:', error);
      }
    }
    
    this.logger.info(`Daily summary: ${contexts.length} messages from ${uniqueUsers.size} users across ${messagesByRoom.size} rooms`);
    
    // 요약 정보를 데이터베이스에 저장하거나 관리자에게 알림을 보낼 수 있습니다
  }

  /**
   * 스케줄된 리마인더 메시지를 처리하는 예제
   * 
   * 이 메서드는 다음과 같은 방법으로 트리거됩니다:
   * 1. BatchScheduler.getInstance().scheduleMessage(..., metadata: { key: 'reminder' })
   * 2. 다른 컨트롤러에서 this.scheduleMessage() 호출 시 key가 'reminder'인 경우
   */
  @ScheduleMessage('reminder')
  async handleReminderMessages(scheduledMessage: ScheduledMessage) {
    this.logger.info(`Processing reminder message: ${scheduledMessage.message}`);
    
    // 메시지는 이미 자동으로 전송되므로 추가 처리만 수행
    
    // 리마인더 타입별 처리
    switch (scheduledMessage.metadata?.type) {
      case 'meeting':
        this.logger.info('Meeting reminder processed');
        // 회의 알림 관련 추가 처리 (예: 참석자 목록 확인, 준비사항 점검 등)
        break;
        
      case 'daily':
        this.logger.info('Daily reminder processed');
        // 일일 알림 처리 (예: 오늘의 할 일, 날씨 정보 등)
        break;
        
      case 'weekly':
        this.logger.info('Weekly reminder processed');
        // 주간 알림 처리 (예: 주간 요약, 다음 주 일정 등)
        break;
    }
    
    // 반복 알림인 경우 다음 알림을 스케줄
    if (scheduledMessage.metadata?.recurring) {
      const nextTime = Date.now() + scheduledMessage.metadata.interval;
      const scheduler = BatchScheduler.getInstance();
      
      scheduler.scheduleMessage(
        scheduledMessage.id + '_' + Date.now(), // 고유한 ID 생성
        scheduledMessage.roomId,
        scheduledMessage.message,
        nextTime,
        scheduledMessage.metadata
      );
      
      this.logger.info(`Scheduled next recurring reminder for ${new Date(nextTime).toISOString()}`);
    }
  }

  /**
   * 알림 메시지를 처리하는 예제
   * 
   * 이 메서드는 다음과 같은 방법으로 트리거됩니다:
   * 1. BatchScheduler.getInstance().scheduleMessage(..., metadata: { key: 'notification' })
   * 2. 시스템에서 자동으로 생성되는 알림들
   */
  @ScheduleMessage('notification')
  async handleNotificationMessages(scheduledMessage: ScheduledMessage) {
    this.logger.info(`Processing notification: ${scheduledMessage.message}`);
    
    // 알림 관련 추가 처리 로직
    // 예: 알림 로그 저장, 통계 업데이트 등
    
    if (scheduledMessage.metadata?.type === 'important') {
      this.logger.warn(`Important notification sent: ${scheduledMessage.message}`);
      
      // 중요한 알림의 경우 추가 처리
      // 예: 관리자에게 별도 알림, 로그 파일에 특별 기록 등
    }
    
    if (scheduledMessage.metadata?.type === 'system') {
      this.logger.info('System notification processed');
      
      // 시스템 알림 처리 (예: 서버 상태, 에러 알림 등)
    }
  }

  /**
   * 사용자 정의 메시지 스케줄링 예제
   * 이 메서드는 다른 곳에서 호출하여 메시지를 스케줄링하는 방법을 보여줍니다.
   */
  async scheduleCustomReminder(roomId: string, message: string, delayMinutes: number) {
    const scheduler = BatchScheduler.getInstance();
    const scheduledTime = Date.now() + (delayMinutes * 60 * 1000);
    
    // 리마인더 스케줄링 (handleReminderMessages에서 처리됨)
    scheduler.scheduleMessage(
      `custom-reminder-${Date.now()}`,
      roomId,
      message,
      scheduledTime,
      { 
        key: 'reminder', 
        type: 'custom',
        createdBy: 'user',
        recurring: false 
      }
    );
    
    this.logger.info(`Custom reminder scheduled for ${delayMinutes} minutes later`);
  }

  /**
   * 시스템 알림 스케줄링 예제
   */
  async scheduleSystemNotification(roomId: string, message: string, priority: 'normal' | 'important' = 'normal') {
    const scheduler = BatchScheduler.getInstance();
    const scheduledTime = Date.now() + 1000; // 1초 후 즉시 전송
    
    // 시스템 알림 스케줄링 (handleNotificationMessages에서 처리됨)
    scheduler.scheduleMessage(
      `system-notification-${Date.now()}`,
      roomId,
      message,
      scheduledTime,
      { 
        key: 'notification', 
        type: 'system',
        priority: priority,
        timestamp: new Date().toISOString()
      }
    );
    
    this.logger.info(`System notification scheduled with priority: ${priority}`);
  }
}

export default CustomBatchController;
