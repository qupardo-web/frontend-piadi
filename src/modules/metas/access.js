export const isRectoriaUser = (user) => Boolean(user) && (
  user.role === 'Rector' || user.roleGroup === 'Rectoria'
);
