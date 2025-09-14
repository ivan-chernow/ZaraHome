import { Test, TestingModule } from '@nestjs/testing';
import { ResponseService } from '../response.service';
import { ApiResponse } from '../../shared.interfaces';

describe('ResponseService', () => {
  let service: ResponseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseService],
    }).compile();

    service = module.get<ResponseService>(ResponseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('success', () => {
    it('should return success response with data and message', () => {
      const data = { id: 1, name: 'Test' };
      const message = 'Operation successful';
      const expectedResponse: ApiResponse<typeof data> = {
        success: true,
        data,
        message,
      };

      const result = service.success(data, message);

      expect(result).toEqual(expectedResponse);
    });

    it('should return success response with null data', () => {
      const data = null;
      const message = 'Operation successful';
      const expectedResponse: ApiResponse<null> = {
        success: true,
        data: null,
        message,
      };

      const result = service.success(data, message);

      expect(result).toEqual(expectedResponse);
    });

    it('should return success response with undefined data', () => {
      const data = undefined;
      const message = 'Operation successful';
      const expectedResponse: ApiResponse<undefined> = {
        success: true,
        data: undefined,
        message,
      };

      const result = service.success(data, message);

      expect(result).toEqual(expectedResponse);
    });

    it('should return success response with array data', () => {
      const data = [1, 2, 3, 4, 5];
      const message = 'Data loaded successfully';
      const expectedResponse: ApiResponse<number[]> = {
        success: true,
        data,
        message,
      };

      const result = service.success(data, message);

      expect(result).toEqual(expectedResponse);
    });
  });

  describe('error', () => {
    it('should return error response with message only', () => {
      const message = 'Something went wrong';
      const expectedResponse: ApiResponse<never> = {
        success: false,
        message,
        error: undefined,
      };

      const result = service.error(message);

      expect(result).toEqual(expectedResponse);
    });

    it('should return error response with message and error details', () => {
      const message = 'Validation failed';
      const error = 'Invalid input data';
      const expectedResponse: ApiResponse<never> = {
        success: false,
        message,
        error,
      };

      const result = service.error(message, error);

      expect(result).toEqual(expectedResponse);
    });

    it('should return error response with empty message', () => {
      const message = '';
      const expectedResponse: ApiResponse<never> = {
        success: false,
        message: '',
        error: undefined,
      };

      const result = service.error(message);

      expect(result).toEqual(expectedResponse);
    });
  });
});
