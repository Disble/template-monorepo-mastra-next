"use server";

export async function submitContentForm(data: {
  url: string;
  contentType: string;
}) {
  // Aquí puedes implementar la lógica de envío al servidor
  console.log("Server received data:", data);

  return {
    runId: "A1F23V45",
  };
}
