export const isAdminAuthenticated = () => {
  const token = localStorage.getItem('adminToken');
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
  return token && user.isAdmin === true;
};
