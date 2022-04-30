/*
 * Email validator
 * http://emailregex.com/
 */
export const isEmail = (emailValue: string): boolean => {
    // eslint-disable-next-line
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(emailValue.toLowerCase().trim());
}


/*
 * Check if newPassword is valid: at least 8 characters, at least one number, at least one lowercase and one uppercase letter.
 * Special characters are allowed but not required, even spaces.
 * https://stackoverflow.com/a/49721224/3681450
 */
const isPassword = (passwordValue: string): boolean => {
    if (!passwordValue.length) {
        return false;
    }
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(passwordValue);
}