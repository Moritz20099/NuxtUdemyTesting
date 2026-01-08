import bcrypt from 'bcryptjs';
import User from "../../utils/models/user";
import { SignUpSchema } from "../../utils/schemas/signup-schema";

export default defineEventHandler(async (event) => {
    try {
        await dbConnect();
        const body = await readBody(event);
        const { email, password } = body;

        // // VALIDATE WITH YAP
        try {
            await  SignUpSchema.validate(body, { abortEarly: false });
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
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw createError({
                statusCode: 400,
                statusMessage: "User already exists"
            });
        }

        // // HASH PASSWORD
        const hashedPassword = await bcrypt.hash(password, 12);

        // CREATE USER
        const user = await User.create({
            email: email.toLowerCase(),
            password: hashedPassword
        });

        // // set a new session
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