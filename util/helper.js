export function checkAdmin(user) {
  return user.userType == "admin" || user.userType == "god";
}

export function isMentor(user) {
  return checkAdmin(user) || user.userType == "mentor";
}
