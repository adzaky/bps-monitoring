export async function postJsonToGoogleAppScript(url, data) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors",
      body: JSON.stringify(data),
    });

    console.log("Response:", JSON.stringify(res));
    return res;
  } catch (error) {
    console.error("Error posting JSON to Google App Script:", error);
    throw error;
  }
}
