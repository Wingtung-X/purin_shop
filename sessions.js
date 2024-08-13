const uuid = require('uuid').v4;

 const sessions = {};

 function addSession(username, role) {
   const sid = uuid();
   sessions[sid] = {
     username,
     role,
   };
   return sid;
 };

 function getSessionUser(sid) {
  const session = sessions[sid];
  if (!session) {
    return null; 
  }
  return { username: session.username, role: session.role };
 }

 function deleteSession(sid) {
   delete sessions[sid];
 }

 module.exports = {
   addSession,
   deleteSession,
   getSessionUser,
 };