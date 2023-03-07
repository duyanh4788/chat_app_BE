import { IConvertStationDriversRepository } from "../Repository/IConvertStationDriversRepository";


export class ConvertStationUseCase {
    constructor(private convertStationDriversRepository: IConvertStationDriversRepository) { }

    async saveConverStation(senderId: string, reciverId: string) {
        return await this.convertStationDriversRepository.saveConverStation(senderId, reciverId)
    }
}