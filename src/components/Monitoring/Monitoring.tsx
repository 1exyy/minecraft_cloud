import type {FC} from "react";
import type {IServerMonitoring} from "./types.ts";
import styles from './Monitoring.module.scss';
import clsx from "clsx";
import 'react-circular-progressbar/dist/styles.css';
import {Chart} from "../Chart/Chart.tsx";
import {convertBytes} from "../../utils/converters.ts";

interface IMonitoringProps {
    monitoringData: IServerMonitoring;
}

export const Monitoring: FC<IMonitoringProps> = ({monitoringData}) => {
    const getComputedValueCPU = () => {
        return parseFloat(((monitoringData.cpu.used / monitoringData.cpu.total) * 100).toFixed(2)) || 0;
    }

    const getComputedValueMemory = () => {
        return parseFloat(((monitoringData.memory.used / monitoringData.memory.total) * 100).toFixed(2)) || 0;
    }

    return (
        <>
            <div className={clsx(styles.wrapper, "frosted-glass")}>
                <div className={styles.title}>Загрузка CPU</div>
                <Chart percent={getComputedValueCPU()}/>
                <div className={styles.info}>
                    <span>total: <br/>{monitoringData.cpu.total}</span>
                    <span>used: <br/>{parseFloat(monitoringData.cpu.used.toFixed(2))}</span>
                    <span>percent: <br/>{getComputedValueCPU()}%</span>
                </div>
            </div>

            <div className={clsx(styles.wrapper, "frosted-glass")}>
                <div className={styles.title}>Загрузка ОЗУ</div>
                <Chart percent={getComputedValueMemory()}/>

                <div className={styles.info}>
                    <span>total: <br/>{convertBytes(monitoringData.memory.total)}</span>
                    <span>used: <br/>{convertBytes(monitoringData.memory.used)}</span>
                    <span>percent: <br/>{getComputedValueMemory()}%</span>
                </div>
            </div>
        </>
    );
};

