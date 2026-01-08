import UserEvent from "../../utils/models/user-event";
import {checkUserSession} from "../../utils/index.js";
import {EventSchema} from "../../utils/schemas/event-schema";

export default defineEventHandler(async (event) => {
    try {
        await dbConnect();
        const body = await readBody(event);
        const session = await checkUserSession(event);

        // VALIDATION
        try {
            await  EventSchema.validate(body, { abortEarly: false });
        } catch (validationError) {
            throw createError({
                statusCode: 400,
                statusMessage: "Validation failed",
                data: validationError.errors
            })
        }

        // create new event
        const userEvent = new UserEvent({
            ...body,
            owner: session.id
        })
        await userEvent.save();

        return {
            status: 201,
            message: 'Event created successfully',
        }
    } catch (error) {
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || error.message,
            data: error.data || null,
        });
    }
})