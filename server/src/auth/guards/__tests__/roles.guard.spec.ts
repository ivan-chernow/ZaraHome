import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RolesGuard } from '../roles.guard';
import { UserRole } from 'src/shared/shared.interfaces';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  const mockExecutionContext = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn(),
  };

  const mockRequest = {
    user: {
      id: 'user123',
      role: UserRole.USER,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    beforeEach(() => {
      mockExecutionContext.switchToHttp.mockReturnValue({
        getRequest: () => mockRequest,
      });
    });

    it('should return true when no roles are required', () => {
      mockReflector.getAllAndOverride.mockReturnValue([]);

      const result = guard.canActivate(mockExecutionContext as any);

      expect(result).toBe(true);
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(
        'roles',
        [mockExecutionContext.getHandler(), mockExecutionContext.getClass()]
      );
    });

    it('should return true when no roles are specified', () => {
      mockReflector.getAllAndOverride.mockReturnValue(undefined);

      const result = guard.canActivate(mockExecutionContext as any);

      expect(result).toBe(true);
    });

    it('should return true when user has required role', () => {
      mockReflector.getAllAndOverride.mockReturnValue([UserRole.USER]);

      const result = guard.canActivate(mockExecutionContext as any);

      expect(result).toBe(true);
    });

    it('should return true when user has one of multiple required roles', () => {
      mockReflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN, UserRole.USER]);

      const result = guard.canActivate(mockExecutionContext as any);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when user is not authenticated', () => {
      mockReflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);
      mockExecutionContext.switchToHttp.mockReturnValue({
        getRequest: () => ({ user: null }),
      });

      expect(() => guard.canActivate(mockExecutionContext as any)).toThrow(
        new ForbiddenException('User not authenticated')
      );
    });

    it('should throw ForbiddenException when user does not have required role', () => {
      mockReflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);

      expect(() => guard.canActivate(mockExecutionContext as any)).toThrow(
        new ForbiddenException('Insufficient permissions. Required roles: admin')
      );
    });

    it('should throw ForbiddenException with multiple required roles message', () => {
      mockReflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);

      expect(() => guard.canActivate(mockExecutionContext as any)).toThrow(
        new ForbiddenException('Insufficient permissions. Required roles: admin')
      );
    });

    it('should work with admin user', () => {
      mockReflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);
      mockExecutionContext.switchToHttp.mockReturnValue({
        getRequest: () => ({
          user: {
            id: 'admin123',
            role: UserRole.ADMIN,
          },
        }),
      });

      const result = guard.canActivate(mockExecutionContext as any);

      expect(result).toBe(true);
    });

    it('should work with moderator user', () => {
      mockReflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);
      mockExecutionContext.switchToHttp.mockReturnValue({
        getRequest: () => ({
          user: {
            id: 'moderator123',
            role: UserRole.ADMIN,
          },
        }),
      });

      const result = guard.canActivate(mockExecutionContext as any);

      expect(result).toBe(true);
    });
  });
});
