import supabase from "@/lib/supabase";

export async function postJsonToGoogleAppScript(body, title) {
  try {
    const { data, error } = await supabase.functions.invoke("create-sheet-recap-data", {
      body: { title: title, data: body },
    });

    if (error) throw error;

    console.log(data);
    return data;
  } catch (error) {
    console.error("Error posting JSON to Google App Script:", error);
    throw error;
  }
}

export async function uploadSpreadsheetRecapData(rawData, year = new Date().getFullYear()) {
  try {
    const { data, error } = await supabase.functions.invoke("upload-sheet-recap-data", {
      body: {
        title: `Rekap Transaksi Layanan PST 7200 Tahun ${year}`,
        data: rawData,
      },
    });

    if (error) throw error;

    console.log(data);
    return data;
  } catch (error) {
    console.error("Error uploading Excel to Google Sheets:", error);
    throw error;
  }
}
