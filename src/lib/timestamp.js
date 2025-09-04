import dayjs from "dayjs";

const TIMESTAMP_KEY = "app_last_timestamp";

export const getCurrentTimestamp = () => {
  return dayjs().toISOString();
};

export const saveCurrentTimestamp = () => {
  const timestamp = getCurrentTimestamp();
  localStorage.setItem(TIMESTAMP_KEY, timestamp);
  return timestamp;
};

export const getLastTimestamp = () => {
  return localStorage.getItem(TIMESTAMP_KEY);
};

export const getTimeDifferenceInSeconds = (timestamp1, timestamp2 = getCurrentTimestamp()) => {
  const time1 = dayjs(timestamp1);
  const time2 = dayjs(timestamp2);
  return Math.abs(time2.diff(time1, "second"));
};

export const clearTimestamp = () => {
  localStorage.removeItem(TIMESTAMP_KEY);
};
