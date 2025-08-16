import { useEffect, useMemo, useState } from "react";
import supabase from "@/lib/supabase";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

// 00:00:00 hari ini (Asia/Jakarta) → ISO UTC
const getJakartaMidnightISO = () => dayjs().tz("Asia/Jakarta").startOf("day").utc().toISOString();

const DAY_KEY = () => dayjs().tz("Asia/Jakarta").format("YYYY-MM-DD");
const ACK_KEY = (tableOrKey) => `ack_${DAY_KEY()}_${tableOrKey}`;

const nowUTCISO = () => dayjs().utc().toISOString();

async function tableChangedSince(table, sinceISO, build) {
  let query = supabase.from(table).select("*", { head: true, count: "exact" }).gte("created_at", sinceISO).limit(1);
  if (build) query = build(query);
  const { count, error } = await query;
  if (error) return false;
  return (count ?? 0) > 0;
}

export function useNotifyData(tables, opts = {}) {
  const pollMs = opts.pollMs ?? 180000; // 3 menit
  const sinceMidnightISO = useMemo(() => getJakartaMidnightISO(), []);
  const subQueries = opts.subQueries ?? {};
  const classifiers = opts.classifiers ?? {};

  // Buat daftar keys yang dipantau: table biasa atau table:subkey
  const watchKeys = useMemo(() => {
    const keys = [];
    for (const t of tables) {
      if (subQueries[t]) {
        for (const sub of Object.keys(subQueries[t])) keys.push(`${t}:${sub}`);
      } else {
        keys.push(t);
      }
    }
    return keys;
  }, [JSON.stringify(tables), JSON.stringify(subQueries)]);

  const [changed, setChanged] = useState(() => Object.fromEntries(watchKeys.map((k) => [k, false])));

  // Helpers ACK per-key (bukan per-table)
  const getAckISO = (k) => localStorage.getItem(ACK_KEY(k));
  const setAckISO = (k, iso) => localStorage.setItem(ACK_KEY(k), iso);
  const boundSinceISO = (k) => {
    const ack = getAckISO(k);
    const a = dayjs(ack || sinceMidnightISO).valueOf();
    const b = dayjs(sinceMidnightISO).valueOf();
    return (a >= b ? dayjs(ack) : dayjs(sinceMidnightISO)).toISOString();
  };

  // Init ACK default = 00:00 WIB untuk semua key yang dipantau
  useEffect(() => {
    for (const k of watchKeys) {
      if (!getAckISO(k)) setAckISO(k, sinceMidnightISO);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(watchKeys), sinceMidnightISO]);

  // Initial check + realtime + polling
  useEffect(() => {
    let cancelled = false;

    // Cek awal
    (async () => {
      for (const t of tables) {
        if (subQueries[t]) {
          for (const [sub, build] of Object.entries(subQueries[t])) {
            const key = `${t}:${sub}`;
            const flag = await tableChangedSince(t, boundSinceISO(key), build);
            if (!cancelled) setChanged((prev) => ({ ...prev, [key]: flag }));
          }
        } else {
          const flag = await tableChangedSince(t, boundSinceISO(t));
          if (!cancelled) setChanged((prev) => ({ ...prev, [t]: flag }));
        }
      }
    })();

    // Realtime
    const channels = tables.map((t) =>
      supabase
        .channel(`today:${t}`)
        .on("postgres_changes", { event: "*", schema: "public", table: t }, (payload) => {
          const ts = payload?.commit_timestamp || payload?.new?.created_at || payload?.old?.created_at;
          if (!ts) return;

          // Hit batas waktu per-key
          if (subQueries[t]) {
            // Ada subgroup → tentukan subgroup via classifier
            const classifier = classifiers[t];
            const sub = classifier ? classifier(payload?.new ?? payload?.old ?? {}) : null;
            if (!sub || !subQueries[t][sub]) return;

            const key = `${t}:${sub}`;
            if (dayjs(ts).valueOf() >= dayjs(boundSinceISO(key)).valueOf()) {
              setChanged((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
            }
          } else {
            if (dayjs(ts).valueOf() >= dayjs(boundSinceISO(t)).valueOf()) {
              setChanged((prev) => (prev[t] ? prev : { ...prev, [t]: true }));
            }
          }
        })
        .subscribe()
    );

    // Polling
    const poller = setInterval(async () => {
      for (const t of tables) {
        if (subQueries[t]) {
          for (const [sub, build] of Object.entries(subQueries[t])) {
            const key = `${t}:${sub}`;
            const flag = await tableChangedSince(t, boundSinceISO(key), build);
            setChanged((prev) => ({ ...prev, [key]: flag || prev[key] }));
          }
        } else {
          const flag = await tableChangedSince(t, boundSinceISO(t));
          setChanged((prev) => ({ ...prev, [t]: flag || prev[t] }));
        }
      }
    }, pollMs);

    return () => {
      cancelled = true;
      clearInterval(poller);
      channels.forEach((ch) => supabase.removeChannel(ch));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(tables), JSON.stringify(subQueries), JSON.stringify(classifiers), sinceMidnightISO, pollMs]);

  // === API ===
  const markAllAsSeen = () => {
    for (const k of Object.keys(changed)) setAckISO(k, nowUTCISO()); // geser ACK tiap key
    setChanged(Object.fromEntries(Object.keys(changed).map((k) => [k, false])));
  };

  const reload = async () => {
    for (const t of tables) {
      if (subQueries[t]) {
        for (const [sub, build] of Object.entries(subQueries[t])) {
          const key = `${t}:${sub}`;
          const flag = await tableChangedSince(t, boundSinceISO(key), build);
          setChanged((prev) => ({ ...prev, [key]: flag }));
        }
      } else {
        const flag = await tableChangedSince(t, boundSinceISO(t));
        setChanged((prev) => ({ ...prev, [t]: flag }));
      }
    }
  };

  const changedList = useMemo(() => Object.keys(changed).filter((k) => changed[k]), [changed]);

  return {
    sinceISO: sinceMidnightISO,
    changed,
    changedList, // berisi item seperti "silastik_transaction:kunjungan"
    markAllAsSeen,
    reload,
  };
}
