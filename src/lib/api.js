import supabase from "./supabase";

export const api = {
  libraryService: {
    getLibraryServiceData: async () => {
      return await supabase.from("pst_customer").select();
    },
  },
};
