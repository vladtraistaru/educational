# Measure Time

## Purpose

Teaches **reading time** (analog and digital), **setting** the clock, simple **durations**, and **order in the day** (*avant / après*), aligned with MER *Grandeurs et mesures* (temps).

## User Experience

1. **Controls**: Choose an **activity** (five modes) and a **step** (whole hours → half hours → quarters → five minutes). Changing either loads a new question (same as **Next** after an answer).

2. **Clock → digital**: One analog face; pick the matching digital time from four options (EN: 12h + AM/PM; FR: 24h `14h30` style).

3. **Digital → clock**: A digital time is shown; pick the matching face among four small analog clocks.

4. **Set the clock**: Prompt shows target digital time. Drag **hour** or **minute** hand (whichever is closer to the pointer); minutes snap to the current step. Optional **hour / minute** selects mirror the same time for accessibility. **Check** submits; feedback and **Next** appear when correct or wrong.

5. **How long?**: Start and end times with two clocks; choose the elapsed duration from four options.

6. **What happens first?**: Two event labels with times (same calendar day, later after earlier). Cards may show either order; choose which **event** happens first (two labelled buttons). Correct choice is always the earlier time.

7. After answering, short feedback text and **Next** load another question for the same activity and step.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Activity and step selects, question state, feedback, Next / load round. |
| `TimeExercises.tsx` | Renders one question type; MC buttons; wires `AnalogClock` / `DigitalTimePicker`. |
| `AnalogClock.tsx` | SVG face and hands; optional drag to set time (minute or hour by proximity). |
| `DigitalTimePicker.tsx` | Hour (0–23) and stepped minute `<select>`s. |
| `timeItems.ts` | `ClockTime`, generators, formatting, snapping, angles. |
| `Activity.module.css` | Clock, grids, event cards, options. |

## Key State

- `Activity.tsx`: `kind`, `step`, `question`, `feedback`, `chosenTime`, `chosenDuration`, `userSetTime`
- `AnalogClock.tsx`: drag mode (`hour` \| `minute`) during pointer capture
