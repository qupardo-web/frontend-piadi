export const isRectoria = (user) => Boolean(user)
  && (user.role === 'Rector' || user.roleGroup === 'Rectoria');

export const isCalidad = (user) => Boolean(user)
  && user.roleGroup === 'Calidad';

export const canCreateMeta = (user) => (
  isRectoria(user) || (Boolean(user?.departmentId) && !isCalidad(user))
);
