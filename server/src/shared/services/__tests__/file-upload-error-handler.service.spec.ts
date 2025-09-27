import { FileUploadErrorHandlerService } from '../file-upload-error-handler.service';

describe('FileUploadErrorHandlerService (unit)', () => {
  let service: FileUploadErrorHandlerService;

  beforeEach(() => {
    service = new FileUploadErrorHandlerService({
      deleteImage: jest.fn(),
    } as any);
  });

  it('processWithRetry: успех со второй попытки', async () => {
    const file: any = { originalname: 'a.jpg' };
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce('/path/a.jpg');
    const res = await service.processWithRetry(file, fn, 2);
    expect(res.success).toBe(true);
    expect(res.filePath).toBe('/path/a.jpg');
  });

  it('handleUploadWithRollback: критическая ошибка и rollback', async () => {
    const files: any[] = [{ originalname: 'a.jpg' }, { originalname: 'b.jpg' }];
    const fn = jest
      .fn()
      .mockResolvedValueOnce('/a')
      .mockRejectedValueOnce(new Error('fail')); // 50% успеха < 70%
    const res = await service.handleUploadWithRollback(files, fn, 0.7);
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/Критическая ошибка/);
  });
});
