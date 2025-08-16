import supabase from "../lib/supabase";

export const api = {
  libraryService: {
    getLibraryServiceData: async () => {
      return await supabase.from("pst_customer").select().order("created_at", { ascending: false });
    },
  },
  romantikService: {
    getRomantikStatisticalActivities: async () => {
      return await supabase.from("romantik_statistical").select().order("created_at", { ascending: false });
    },
  },
  silastikService: {
    getStatisticalTransactions: async () => {
      return await supabase.from("silastik_transaction").select().order("created_at", { ascending: false });
    },
    getConsultationStatistic: async () => {
      return await supabase
        .from("silastik_transaction")
        .select()
        .ilike("need_type", "%Konsultasi%")
        .order("created_at", { ascending: false });
    },
    getProductStatistic: async () => {
      return await supabase
        .from("silastik_transaction")
        .select()
        .ilike("need_type", "%Permintaan Data%")
        .order("created_at", { ascending: false });
    },
  },
};
