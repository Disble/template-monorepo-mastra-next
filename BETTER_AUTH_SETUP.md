# Better Auth Setup Guide

## ✅ Instalación Completada

Better Auth ha sido instalado y configurado en tu monorepo Next.js.

## 📁 Archivos Creados/Modificados

### 1. **Esquema de Base de Datos** (`packages/db/src/schema/users.ts`)
- Tablas compatibles con Better Auth: `user`, `session`, `account`, `verification`
- Schema actualizado para usar los tipos de datos requeridos por Better Auth

### 2. **Configuración del Servidor** (`apps/web/src/lib/auth.ts`)
- Configuración de Better Auth con Drizzle adapter
- Email/Password habilitado
- Plugin `nextCookies()` para server actions

### 3. **API Route** (`apps/web/src/app/api/auth/[...all]/route.ts`)
- Manejador de autenticación en `/api/auth/*`

### 4. **Cliente de Autenticación** (`apps/web/src/lib/auth-client.ts`)
- Cliente React con hooks: `useSession`, `signIn`, `signUp`, `signOut`

### 5. **Proxy de Next.js 16** (`apps/web/src/proxy.ts`)
- Protección de rutas `/dashboard` y `/advisor`
- Redirección automática si no hay sesión

### 6. **Componentes de Ejemplo**
- `components/auth-example.tsx` - Ejemplo de sign up/sign in
- `app/dashboard/page.tsx` - Página protegida de ejemplo

## 🔧 Pasos Completados

### 1. ✅ Migraciones de Base de Datos Ejecutadas

Las tablas de Better Auth han sido creadas en la base de datos:
- ✅ `user` - Usuarios
- ✅ `session` - Sesiones activas
- ✅ `account` - Cuentas y providers
- ✅ `verification` - Tokens de verificación

**Nota:** Durante `bun run generate`, Drizzle preguntó por cada tabla nueva:
- Respondiste `+ account`, `+ session`, `+ user`, `+ verification` para crear todas las tablas
- Las migraciones se aplicaron exitosamente con `bun run migrate`

### 2. ✅ Variables de Entorno Configuradas

El archivo `.env` debe contener (ya deberías tenerlo configurado):

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# App URL (opcional, default: http://localhost:4000)
NEXT_PUBLIC_APP_URL="http://localhost:4000"
```

### 3. 🧪 Probar la Autenticación

**Iniciar el servidor:**
```bash
cd apps/web
bun run dev
```

**Páginas de prueba creadas:**
1. **`/auth-test`** - Formulario de registro y login
2. **`/dashboard`** - Página protegida (requiere autenticación)

**Flujo de prueba:**
1. Visita `http://localhost:4000/auth-test`
2. Registra un usuario (Name, Email, Password)
3. Verás tu información de sesión
4. Prueba ir a `/dashboard` - tendrás acceso
5. Haz logout y vuelve a `/dashboard` - serás redirigido a `/`

### 4. Usar la Autenticación en tu Código

#### En Componentes Client:

```tsx
"use client";
import { authClient } from "#lib/auth-client";

export function MyComponent() {
  const { data: session } = authClient.useSession();
  
  const handleSignOut = async () => {
    await authClient.signOut();
  };
  
  return session ? (
    <div>Welcome {session.user.name}</div>
  ) : (
    <div>Not logged in</div>
  );
}
```

#### En Server Components:

```tsx
import { auth } from "#lib/auth";
import { headers } from "next/headers";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  return <div>Welcome {session?.user.name}</div>;
}
```

#### En Server Actions:

```tsx
"use server";
import { auth } from "#lib/auth";
import { headers } from "next/headers";

export async function myAction() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  if (!session) {
    throw new Error("Unauthorized");
  }
  
  // Your logic here
}
```

### 4. Agregar Providers Sociales (Opcional)

Edita `apps/web/src/lib/auth.ts`:

```ts
export const auth = betterAuth({
  // ...existing config
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
});
```

## 📚 Recursos

- [Better Auth Docs](https://www.better-auth.com/docs)
- [Next.js Integration](https://www.better-auth.com/docs/integrations/nextjs)
- [Drizzle Adapter](https://www.better-auth.com/docs/adapters/drizzle)

## ⚠️ Notas Importantes

1. El proxy usa `getSessionCookie()` para verificación rápida, **NO es completamente seguro**
2. Siempre valida la sesión en cada página/ruta protegida usando `auth.api.getSession()`
3. El plugin `nextCookies()` debe ser el **último** en el array de plugins
4. Next.js 16 usa "proxy" en lugar de "middleware"
