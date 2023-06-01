import React, {useEffect, useRef, useState, memo} from "react";
import PropTypes from "prop-types";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const areEqual = (prevProps, nextProps) => {
    return (
        prevProps.isVisible === nextProps.isVisible &&
        prevProps.date.getTime() === nextProps.date.getTime()
    );
};

const DateTimePickerModal = memo(
    ({date, mode, isVisible, onCancel, onConfirm, onHide, ...otherProps}) => {
        const currentDateRef = useRef(date);
        const [currentMode, setCurrentMode] = useState(null);

        useEffect(() => {
            if (isVisible && currentMode === null) {
                setCurrentMode(mode === "monthYears" ? "monthYears" : mode === "monthYears" ? "date" : "date");
            } else if (!isVisible) {
                setCurrentMode(null);
            }
        }, [isVisible, currentMode, mode]);

        if (!isVisible || !currentMode) return null;

        const handleChange = (selectedDate) => {
            if (!selectedDate) {
                onCancel();
                onHide(false);
                return;
            }

            let nextDate = selectedDate;
            if (mode === "datetime") {
                if (currentMode === "date") {
                    setCurrentMode("time");
                    currentDateRef.current = new Date(selectedDate);
                    return;
                } else if (currentMode === "monthYears") {
                    const year = selectedDate.getFullYear();
                    const month = selectedDate.getMonth();
                    nextDate = new Date(year, month);
                }
            } else if (mode === "monthYears") {
                const year = selectedDate.getFullYear();
                const month = selectedDate.getMonth();
                nextDate = new Date(year, month);
            }

            onConfirm(nextDate);
            onHide(true, nextDate);
        };

        return (
            <DateTimePickerModal
                {...otherProps}
                isVisible={isVisible}
                mode={currentMode}
                date={date}
                onCancel={handleChange}
                onConfirm={handleChange}
            />
        );
    },
    areEqual
);

DateTimePickerModal.propTypes = {
    date: PropTypes.instanceOf(Date),
    isVisible: PropTypes.bool,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onHide: PropTypes.func,
    maximumDate: PropTypes.instanceOf(Date),
    minimumDate: PropTypes.instanceOf(Date)
};

DateTimePickerModal.defaultProps = {
    date: new Date(),
    isVisible: false,
    onHide: () => {
    }
};

export {DateTimePickerModal};
