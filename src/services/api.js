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
};
