interface INestedMonitoringValues {
    total: number,
    used: number
}

export interface IServerMonitoring {
    cpu: INestedMonitoringValues,
    memory: INestedMonitoringValues
}