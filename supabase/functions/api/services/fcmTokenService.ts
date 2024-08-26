import { FcmTokenRepository } from '../repositories/fcmTokenRepository.ts';

export class FcmTokenService {
  private fcmTokenRepository: FcmTokenRepository;

  constructor() {
    this.fcmTokenRepository = new FcmTokenRepository();
  }

  async addFCMToken(userID: string, fcmToken: string) {
    await this.fcmTokenRepository.addFCMToken(userID, fcmToken);
  }

  async deleteFCMToken(userID: string, fcmToken: string) {
    await this.fcmTokenRepository.deleteFCMToken(userID, fcmToken);
  }
}
