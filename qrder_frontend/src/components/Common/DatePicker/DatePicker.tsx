import React, { useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import hr from "date-fns/locale/hr";

import { ReactComponent as CalendarIcon } from "../../../assets/calendar.svg";
import { ReactComponent as CancelIcon } from "../../../assets/x.svg";
import { ReactComponent as SearchIcon } from "../../../assets/magnifying-glass.svg";

import styles from "./DatePicker.module.css";
import "react-day-picker/dist/style.css";
import Button from "../Buttons/Button/Button";
import { CSSTransition } from "react-transition-group";

const body = document.body;

const dayValues: { [key: number]: string } = {
  1: "Pon",
  2: "Uto",
  3: "Sri",
  4: "Čet",
  5: "Pet",
  6: "Sub",
  0: "Ned",
};

type Props = {
  selectedRange: DateRange | undefined;
  setSelectedRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  onSearch: () => void;
  className?: string;
  maxDate?: Date;
  minDate?: Date;
};

const DatePicker = ({
  selectedRange,
  setSelectedRange,
  onSearch,
  className,
  maxDate,
  minDate,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.wrapper} onClick={(e) => e.stopPropagation()}>
      <button
        className={`${styles.mainBox} ${isOpen && styles.mainBoxOpen} ${
          className || ""
        }`}
        onClick={() => {
          if (isOpen) setIsOpen(false);
          else {
            setIsOpen(true);
            body.addEventListener(
              "click",
              () => {
                setIsOpen(false);
              },
              { once: true }
            );
          }
        }}
      >
        <CalendarIcon className={styles.icon} />
        {selectedRange ? (
          <>
            <div>
              <span className={styles.day}>
                {dayValues[selectedRange.from!.getDay()]}
              </span>
              <span className={styles.date}>
                {selectedRange.from!.toLocaleDateString()}
              </span>
            </div>
            {selectedRange.to &&
              selectedRange.to.getTime() !== selectedRange.from!.getTime() && (
                <>
                  <span className={styles.divider}>-</span>
                  <div>
                    <span className={styles.day}>
                      {dayValues[selectedRange.to.getDay()]}
                    </span>
                    <span className={styles.date}>
                      {selectedRange.to.toLocaleDateString()}
                    </span>
                  </div>
                </>
              )}
          </>
        ) : (
          <div>Filtrirajte po datumu</div>
        )}
      </button>
      <CSSTransition
        timeout={300}
        in={isOpen}
        unmountOnExit={true}
        classNames={{
          enter: styles.datePickerEnter,
          enterActive: styles.datePickerEnterActive,
          enterDone: styles.datePickerEnterDone,
          exitActive: styles.datePickerExitActive,
          exitDone: styles.datePickerExit,
        }}
      >
        <DayPicker
          className={styles.datePicker}
          mode={"range"}
          selected={selectedRange}
          onSelect={setSelectedRange}
          fromDate={minDate}
          toDate={maxDate}
          weekStartsOn={1}
          captionLayout={"dropdown"}
          fixedWeeks={true}
          locale={hr}
          modifiersStyles={{
            selected: {
              backgroundColor: "var(--color-primary-dark)",
              color: "var(--white)",
            },
            range_start: {
              borderTopRightRadius: "0",
              borderBottomRightRadius: "0",
            },
            range_end: {
              borderTopLeftRadius: "0",
              borderBottomLeftRadius: "0",
            },
          }}
          styles={{
            day: { fontSize: "1.6rem", padding: "4px 8px", width: "100%" },
            caption: { marginBottom: "8px", textTransform: "capitalize" },
            caption_label: {
              fontSize: "2.8rem",
              letterSpacing: "-1px",
              color: "var(--color-primary-dark)",
            },
          }}
          footer={
            <div className={styles.footer}>
              <Button
                className={styles.footerBtn}
                style={{ backgroundColor: "var(--color-red)" }}
                onClick={() => setSelectedRange(undefined)}
              >
                <CancelIcon className={styles.btnIcon} />
                Poništite
              </Button>
              <Button
                className={styles.footerBtn}
                style={{ backgroundColor: "var(--color-primary-dark)" }}
                onClick={onSearch}
              >
                <SearchIcon className={styles.btnIcon} />
                Tražite
              </Button>
            </div>
          }
        />
      </CSSTransition>
    </div>
  );
};

export default DatePicker;
