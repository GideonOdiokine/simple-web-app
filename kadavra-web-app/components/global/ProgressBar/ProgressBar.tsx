import { ReactNode } from "react";
import classes from "./ProgressBar.module.scss";

interface ProgressBarProps {
  value?: number;
  children?: ReactNode;
  indeterminate?: boolean;
}

export default function ProgressBar(props: ProgressBarProps) {
  const { value = 0, children, indeterminate } = props;
  const getProgressClass = () => {
    const progressClass = [classes.progressBar];
    if (indeterminate) {
      progressClass.push(classes.indeterminate);
    }
    return progressClass.join(" ");
  };
  return (
    <div className="space-y-1">
      <div className={getProgressClass()}>
        <div
          style={{ width: `${value * 100}%` }}
          className={classes.progress}
        ></div>
      </div>
      {children}
    </div>
  );
}
