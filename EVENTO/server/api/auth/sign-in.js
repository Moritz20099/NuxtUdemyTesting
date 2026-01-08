import bcrypt from 'bcryptjs';
import User from "../../utils/models/user";
import { SignUpSchema } from "../../utils/schemas/signup-schema";
import {SignInSchema} from "~~/server/utils/schemas/signin-schema.js";

export default defineEventHandler(async (event) => {
    try {
        // CONNECT TO DB
        await dbConnect();
        const body = await readBody(event);
        const { email, password } = body;

        // // VALIDATE WITH YAP
        try {
            await  SignInSchema.validate(body, { abortEarly: false });
        } catch (validationError) {
            throw createError({
                statusCode: 400,
                statusMessage: "Validation Error",
                data: {
                    errorsArray: validationError.errors
                }
            })
        }

        // CHECK IF USER EXISTS
        const user = await User.findOne({ email });
        if (!user) {
            throw createError({
                statusCode: 401,
                statusMessage: "Es gibt keinen Account mit dieser E-Mail."
            });
        }

        // CHECK PASSWORD
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw createError({
                statusCode: 401,
                statusMessage: "Falsches Passwort."
            });
        }

        // set a new session
        await setUserSession(event, {
            user: {
                id: user._id.toString(),
                email: user.email
            }
        })

        return {
            success: true,
            user: {
                id: user._id,
                email: user.email
            }
        }

    } catch (error) {
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.message || "Internal Server Error",
            data: error.data || null
        });
    }
})