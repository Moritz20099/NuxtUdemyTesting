export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)
    const user = session?.user;

    if (user) {
        event.context.auth = { user: user };
    } else {
        event.context.auth = null;
    }
})

// Middleware läuft vor jedem API-Handler und überprüft die Benutzersitzung.
// wenn eine gültige Sitzung vorhanden ist (eingeloggt), wird der Benutzer in event.context.auth gesetzt,
// event ist ein globales Objekt, das in allen API-Handlern zugänglich ist.
// somit ist event.context.auth in jedem API-Handler verfügbar.