export async function checkUserSession(event) {
    if (!event.context.auth || !event.context.auth.user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        });
    }

    return event.context.auth.user;
}

// da wir in der middleware den benutzer in event.context.auth setzen,
// können wir hier einfach event.context.auth.user zurückgeben,
// wenn keine session (kein nutzer) ist, wird ein 401-fehler ausgelöst, weil das zeigt dass man nicht eingeloggt ist.