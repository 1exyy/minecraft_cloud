import type {FC} from "react";
import {buildStyles, CircularProgressbarWithChildren} from "react-circular-progressbar";
import clsx from "clsx";
import styles from './Chart.module.scss'
import type {CircularProgressbarWrapperProps} from "react-circular-progressbar/dist/types";
import React from "react";

interface IChart extends Partial<CircularProgressbarWrapperProps> {
    percent: number;
}

export const Chart: FC<IChart> = React.memo(({percent, className, ...rest}) => {
    return (
        <CircularProgressbarWithChildren
            value={percent}
            className={clsx(styles.chart, className)}
            {...rest}
            styles={buildStyles({
                pathColor: 'rgba(189,66,250,0.4)', // Цвет заполнения
                trailColor: 'rgba(255,255,255,0.67)', // Цвет фона
            })}
        >
            <div className={styles.data}>
                <span>{`${percent}%`}</span>
            </div>
        </CircularProgressbarWithChildren>
    );
});

