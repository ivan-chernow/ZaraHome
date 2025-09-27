import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../roles.guard';

describe('Guards (unit)', () => {
  describe('RolesGuard', () => {
    const createContext = (user?: any) =>
      ({
        switchToHttp: () => ({ getRequest: () => ({ user }) }),
        getHandler: () => ({}),
        getClass: () => ({}),
      }) as any;

    it('пропускает,  если роли не требуются', () => {
      const reflector = {
        getAllAndOverride: jest.fn().mockReturnValue(undefined),
      } as unknown as Reflector;
      const guard = new RolesGuard(reflector);
      expect(guard.canActivate(createContext({ role: 'user' }))).toBe(true);
    });

    it('кидает 403, если пользователь отсутствует', () => {
      const reflector = {
        getAllAndOverride: jest.fn().mockReturnValue(['admin']),
      } as unknown as Reflector;
      const guard = new RolesGuard(reflector);
      expect(() => guard.canActivate(createContext(undefined))).toThrow(
        ForbiddenException
      );
    });

    it('пропускает, если роль подходит', () => {
      const reflector = {
        getAllAndOverride: jest.fn().mockReturnValue(['admin']),
      } as unknown as Reflector;
      const guard = new RolesGuard(reflector);
      expect(guard.canActivate(createContext({ role: 'admin' }))).toBe(true);
    });

    it('кидает 403, если роль не подходит', () => {
      const reflector = {
        getAllAndOverride: jest.fn().mockReturnValue(['admin']),
      } as unknown as Reflector;
      const guard = new RolesGuard(reflector);
      expect(() => guard.canActivate(createContext({ role: 'user' }))).toThrow(
        ForbiddenException
      );
    });
  });
});
