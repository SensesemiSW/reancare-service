export interface ISenseDeviceVitalsUsageService {
    searchUsageByClient(clientId: string, current: string, pageIndex: number, itemsPerPage: number) : Promise< any | null >;

    searchAllUsage(current: string, pageIndex: number, itemsPerPage: number): Promise< any | null>

}
