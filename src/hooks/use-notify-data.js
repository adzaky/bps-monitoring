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
const ACK_KEY = (table) => `ack_${DAY_KEY()}_${table}`;

const nowUTCISO = () => dayjs().utc().toISOString();

async function tableChangedSince(table, sinceISO) {
  const { count, error } = await supabase
    .from(table)
    .select("*", { head: true, count: "exact" })
    .gte("created_at", sinceISO)
    .limit(1);
  if (error) return false;
  return (count ?? 0) > 0;
}

export function useNotifyData(tables, opts = {}) {
  const pollMs = opts.pollMs ?? 180000; // 3 menit
  const sinceMidnightISO = useMemo(() => getJakartaMidnightISO(), []);
  const [changed, setChanged] = useState(() => Object.fromEntries(tables.map((t) => [t, false])));

  // Helper ACK getter/bound
  const getAckISO = (t) => localStorage.getItem(ACK_KEY(t));
  const setAckISO = (t, iso) => localStorage.setItem(ACK_KEY(t), iso);
  const boundSinceISO = (t) => {
    const ack = getAckISO(t);
    const a = dayjs(ack || sinceMidnightISO).valueOf();
    const b = dayjs(sinceMidnightISO).valueOf();
    return (a >= b ? dayjs(ack) : dayjs(sinceMidnightISO)).toISOString();
  };

  // Init ACK (default = 00:00 WIB)
  useEffect(() => {
    for (const t of tables) {
      if (!getAckISO(t)) setAckISO(t, sinceMidnightISO);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(tables), sinceMidnightISO]);

  // Initial check + realtime + polling
  useEffect(() => {
    let cancelled = false;

    (async () => {
      for (const t of tables) {
        const flag = await tableChangedSince(t, boundSinceISO(t));
        if (!cancelled) setChanged((prev) => ({ ...prev, [t]: flag }));
      }
    })();

    const channels = tables.map((t) =>
      supabase
        .channel(`today:${t}`)
        .on("postgres_changes", { event: "*", schema: "public", table: t }, (payload) => {
          const ts = payload?.commit_timestamp || payload?.new?.created_at || payload?.old?.created_at;
          if (!ts) return;
          // Tetapkan true hanya jika event >= bound (ACK/00:00)
          if (dayjs(ts).valueOf() >= dayjs(boundSinceISO(t)).valueOf()) {
            setChanged((prev) => (prev[t] ? prev : { ...prev, [t]: true }));
          }
        })
        .subscribe()
    );

    const poller = setInterval(async () => {
      for (const t of tables) {
        const flag = await tableChangedSince(t, boundSinceISO(t));
        setChanged((prev) => ({ ...prev, [t]: flag || prev[t] }));
      }
    }, pollMs);

    return () => {
      cancelled = true;
      clearInterval(poller);
      channels.forEach((ch) => supabase.removeChannel(ch));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(tables), sinceMidnightISO, pollMs]);

  // === API ===
  const markAllAsSeen = () => {
    for (const t of tables) setAckISO(t, nowUTCISO()); // geser ACK ke sekarang
    setChanged(Object.fromEntries(tables.map((t) => [t, false])));
  };

  const reload = async () => {
    for (const t of tables) {
      const flag = await tableChangedSince(t, boundSinceISO(t));
      setChanged((prev) => ({ ...prev, [t]: flag }));
    }
  };

  const changedList = useMemo(() => tables.filter((t) => changed[t]), [changed, tables]);

  return {
    sinceISO: sinceMidnightISO,
    changed,
    changedList,
    markAllAsSeen,
    reload,
  };
}
