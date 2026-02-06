# Google OAuth Setup Guide

## 📋 Configuración Completada

Google OAuth ha sido integrado en Better Auth.

## 🔧 Pasos para Configurar Google OAuth

### 1. Crear Credenciales de Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/apis/dashboard)
2. Selecciona o crea un proyecto
3. Ve a **APIs & Services** → **Credentials**
4. Click en **Create Credentials** → **OAuth client ID**
5. Selecciona **Web application**
6. Configura las **Authorized redirect URIs**:
   - **Desarrollo**: `http://localhost:4000/api/auth/callback/google`
   - **Producción**: `https://tu-dominio.com/api/auth/callback/google`
7. Copia el **Client ID** y **Client Secret**

### 2. Agregar Variables de Entorno

Agrega estas variables a tu archivo `.env`:

```env
# Better Auth
BETTER_AUTH_URL="http://localhost:4000"  # En producción: https://tu-dominio.com

# Google OAuth
GOOGLE_CLIENT_ID="tu-client-id-de-google.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="tu-client-secret-de-google"

# Database (ya configurado)
DATABASE_URL="postgresql://..."
```

### 3. Configuración Aplicada

#### Archivo: `apps/web/src/lib/auth.ts`

```typescript
export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL, // ⚠️ Requerido para OAuth
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      accessType: "offline", // Siempre obtiene refresh token
      prompt: "select_account consent", // Siempre pide consentimiento
    },
  },
  // ...
});
```

**Opciones configuradas:**
- **`accessType: "offline"`** - Obtiene refresh token siempre
- **`prompt: "select_account consent"`** - Permite seleccionar cuenta y siempre pide consentimiento

#### Archivo: `packages/envs/src/node.ts`

Variables de entorno agregadas:
- `BETTER_AUTH_URL` (requerido)
- `GOOGLE_CLIENT_ID` (requerido)
- `GOOGLE_CLIENT_SECRET` (requerido)

## 🧪 Probar Google OAuth

### 1. Iniciar el servidor

```bash
cd apps/web
bun run dev
```

### 2. Probar el flujo

1. Ve a `http://localhost:4000/auth-test`
2. Click en el botón **"Continue with Google"**
3. Serás redirigido a Google para autenticarte
4. Después de autorizar, volverás a `/auth-test` con sesión iniciada
5. La información del usuario de Google se guardará en la base de datos

## 📊 Datos Guardados

Cuando un usuario se autentica con Google, Better Auth guarda:

- **Tabla `user`**: Información básica del usuario (nombre, email, imagen)
- **Tabla `account`**: Credenciales de Google (provider, tokens, etc.)
- **Tabla `session`**: Sesión activa del usuario

## 🔒 Características de Seguridad

### Refresh Token Siempre Disponible

Con `accessType: "offline"` y `prompt: "select_account consent"`, el refresh token se obtiene en cada login, permitiendo:
- Renovar el access token cuando expire
- Acceder a APIs de Google sin re-autenticación

### Revocar Acceso

Si necesitas obtener un nuevo refresh token, el usuario debe:
1. Ir a [Google Account Permissions](https://myaccount.google.com/permissions)
2. Revocar el acceso a tu aplicación
3. Volver a autenticarse

## 🚀 Uso Avanzado

### Solicitar Scopes Adicionales de Google

Si necesitas acceso a Google Drive, Gmail, etc., después del registro inicial:

```tsx
const requestGoogleDriveAccess = async () => {
  await authClient.linkSocial({
    provider: "google",
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });
};
```

### Sign In con ID Token (Client-side)

Si ya tienes el ID Token de Google en el cliente:

```tsx
const data = await authClient.signIn.social({
  provider: "google",
  idToken: {
    token: // Google ID Token,
    accessToken: // Google Access Token
  }
});
```

## ⚠️ Notas Importantes

1. **`BETTER_AUTH_URL` es obligatorio** - Sin esto, Google OAuth fallará con `redirect_uri_mismatch`
2. **Configura correctamente las redirect URIs en Google Cloud Console** - Deben coincidir exactamente
3. **En producción**, actualiza `BETTER_AUTH_URL` a tu dominio real
4. **El refresh token** solo se obtiene la primera vez a menos que uses `accessType: "offline"`

## 📚 Recursos

- [Better Auth - Google Provider](https://www.better-auth.com/docs/authentication/social-providers/google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com)
