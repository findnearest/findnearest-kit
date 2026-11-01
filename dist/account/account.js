/** The letter on the avatar: the first character of the name, or of the email if there's no name. */
export function accountInitial(name) {
    return name.trim().charAt(0).toUpperCase() || '?';
}
