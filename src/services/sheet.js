import supabase from "@/lib/supabase";

export async function postJsonToGoogleAppScript(body) {
  try {
    const { data, error } = await supabase.functions.invoke("create-sheet-recap-data", {
      body: { title: "Rekap Transaksi Layanan BPS", data: body },
    });

    if (error) throw error;

    console.log(data);
    return data;
  } catch (error) {
    console.error("Error posting JSON to Google App Script:", error);
    throw error;
  }
}
