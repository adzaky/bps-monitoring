import supabase from "../lib/supabase";

export const api = {
  libraryService: {
    getLibraryServiceData: async () => {
      return await supabase.from("pst_customer").select();
    },
  },
  romantikService: {
    getRomantikStatisticalActivities: async () => {
      return await supabase.from("romantik_statistical").select();
    },
  },
  silastikService: {
    getStatisticalTransactions: async () => {
      return await supabase.from("silastik_transaction").select();
    },
    getConsultationStatistic: async () => {
      return await supabase.from("silastik_transaction").select().ilike("need_type", "%Konsultasi%");
    },
    getProductStatistic: async () => {
      return await supabase.from("silastik_transaction").select().ilike("need_type", "%Permintaan Data%");
    },
  },
};
