export default defineEventHandler(async (event) => {
    // Clear user session to log out the user
    await clearUserSession(event);
    return { success: true };
})