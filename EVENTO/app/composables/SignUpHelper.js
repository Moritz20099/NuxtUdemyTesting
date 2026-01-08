
export const signUpHelper = async (formData, type) => {
    const {fetch: refreshSession} = useUserSession();
    const authStore = useAuthStore();
    const toast = useToast();
    let response;

    try {
        if (type === 'sign-up') {
            response = await $fetch('/api/auth/sign-up', {
                method: 'POST',
                body: formData
            });

            toast.add({
                title: 'Congratulations!',
                description: 'Your account has been created successfully.',
                color: 'success',
            });
        } else {
            response = await $fetch('/api/auth/sign-in', {
                method: 'POST',
                body: formData
            });

            toast.add({
                title: 'Welcome back!',
                description: 'You have signed in successfully.',
                color: 'success',
            });
        }

        // PINIA ...
        authStore.login(response.user)


        await refreshSession(); // WICHTIG !!!!
        await navigateTo('/');

        return true;

    } catch (error) {
        if (error.statusCode === 400 && error.data.data) {
            const validationErrors = error.data.data.errorsArray;

            validationErrors.forEach(err => {
                toast.add({
                    title: 'Oops!',
                    description: err,
                    color: 'error',
                });
            });

        } else {

            toast.add({
                title: 'Oops!',
                description: error.data?.statusMessage || 'Sorry, something went wrong.',
                color: 'error',
            });
        }

        return error;
    }
}