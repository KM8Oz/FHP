use whoami;
pub fn get_current_user_uid() -> Option<String> {
    Some(whoami::username())
}