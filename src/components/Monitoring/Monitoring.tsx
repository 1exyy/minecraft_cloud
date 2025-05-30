import type {FC} from "react";
import {Box, Typography, styled} from '@mui/material';
import {Chart} from "../Chart/Chart";
import {convertBytes} from "../../utils/converters.ts";
import type {IServerMonitoring} from "./types.ts";

interface IMonitoringProps {
    monitoringData: IServerMonitoring;
}

const MonitoringWrapper = styled(Box)(({theme}) => ({
    display: 'grid',
    alignItems: 'center',
    gridRowGap: '32px',
    padding: theme.spacing(3),
    borderRadius: '24px',
    backgroundColor: 'rgba(26, 26, 26, 0.85)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
}));

const InfoContainer = styled(Box)(({theme}) => ({
    display: 'grid',
    width: "100%",
    gridTemplateColumns: '1fr 1fr 1fr',
    '& span': {
        color: '#e0e0e0',
        fontSize: '24px',
        textAlign: 'center',
        borderColor: '#e0e0e0',
        borderStyle: 'solid',
        borderWidth: '0 0 0 2px',
        padding: theme.spacing(0, 1),
    },
    '& span:last-child': {
        borderRight: '2px solid #e0e0e0',
    }
}));

const Title = styled(Typography)({
    color: '#e0e0e0',
    fontSize: '48px',
    textAlign: 'center',
});

export const Monitoring: FC<IMonitoringProps> = ({monitoringData}) => {
    const getComputedValueCPU = () => {
        return parseFloat(((monitoringData.cpu.used / monitoringData.cpu.total) * 100).toFixed(2)) || 0;
    }

    const getComputedValueMemory = () => {
        return parseFloat(((monitoringData.memory.used / monitoringData.memory.total) * 100).toFixed(2)) || 0;
    }

    return (
        <Box display="grid" gap={3}>
            <MonitoringWrapper>
                <Title>Загрузка CPU</Title>
                <Chart percent={getComputedValueCPU()}/>
                <InfoContainer>
                    <span>total: <br/>{monitoringData.cpu.total}</span>
                    <span>used: <br/>{parseFloat(monitoringData.cpu.used.toFixed(2))}</span>
                    <span>percent: <br/>{getComputedValueCPU()}%</span>
                </InfoContainer>
            </MonitoringWrapper>

            <MonitoringWrapper>
                <Title>Загрузка ОЗУ</Title>
                <Chart percent={getComputedValueMemory()}/>
                <InfoContainer>
                    <span>total: <br/>{convertBytes(monitoringData.memory.total)}</span>
                    <span>used: <br/>{convertBytes(monitoringData.memory.used)}</span>
                    <span>percent: <br/>{getComputedValueMemory()}%</span>
                </InfoContainer>
            </MonitoringWrapper>
        </Box>
    );
};