import { google } from "googleapis";

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/oauth2callback";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "Error: YOUTUBE_CLIENT_ID y YOUTUBE_CLIENT_SECRET no están configurados en las variables de entorno",
  );
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
);

// Genera la URL de autorización
const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/youtube.force-ssl"],
  prompt: "consent",
});

console.log("\n🚀 Servidor iniciado en http://localhost:3000\n");
console.log("🔗 Abre esta URL en tu navegador para autorizar la aplicación:\n");
console.log(authUrl);
console.log("\n⏳ Esperando autorización...\n");

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/oauth2callback") {
      const authCode = url.searchParams.get("code");

      if (!authCode) {
        return new Response(
          "<h1>❌ Error: No se recibió el código de autorización</h1>",
          {
            headers: { "Content-Type": "text/html; charset=utf-8" },
            status: 400,
          },
        );
      }

      try {
        const { tokens } = await oauth2Client.getToken(authCode);

        console.log("\n✅ Tokens obtenidos con éxito:\n");
        console.log("Refresh Token:", tokens.refresh_token);

        console.log("\n📝 Guarda el Refresh Token en tu archivo .env:\n");
        console.log(`YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token}`);

        const envContent = `YOUTUBE_CLIENT_ID=${CLIENT_ID}
YOUTUBE_CLIENT_SECRET=${CLIENT_SECRET}
YOUTUBE_REDIRECT_URI=${REDIRECT_URI}
YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token}
`;

        await Bun.write(".env.youtube", envContent);
        console.log("\n✅ Credenciales guardadas en .env.youtube");

        setTimeout(() => {
          server.stop();
          console.log("\n🔒 Servidor cerrado. Proceso completado.\n");
          process.exit(0);
        }, 1000);

        return new Response(
          `
          <h1>✅ Autorización exitosa</h1>
          <p>Puedes cerrar esta ventana y volver a la terminal.</p>
          <p><strong>Refresh Token obtenido:</strong></p>
          <code style="background: #f0f0f0; padding: 10px; display: block; margin-top: 10px;">
            ${tokens.refresh_token}
          </code>
        `,
          {
            headers: { "Content-Type": "text/html; charset=utf-8" },
          },
        );
      } catch (err) {
        console.error("❌ Error al obtener el token:", err);
        server.stop();
        process.exit(1);
      }
    }

    return new Response("Not found", { status: 404 });
  },
});
