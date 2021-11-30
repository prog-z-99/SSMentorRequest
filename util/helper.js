export function checkAdmin(user) {
  return user.userType == "admin" || user.userType == "god";
}

export function isMentor(user) {
  return isAdmin(user) || user.userType == "mentor";
}
