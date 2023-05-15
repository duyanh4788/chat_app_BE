export interface IConvertStationDriversRepository {
  saveConverStation(senderId: string, reciverId: string): Promise<any>;
  findConverStation(senderId: string, reciverId: string): Promise<any>;
  findConverStationById(conversationId: string): Promise<any>;
}
